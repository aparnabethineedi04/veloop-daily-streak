const mongoose = require('mongoose');
const StreakCycle = require('../models/StreakCycle');
const StreakClaim = require('../models/StreakClaim');
const AppError = require('../utils/appError');
const { computeState, buildCards } = require('../utils/streakState');
const { runInTransaction } = require('../utils/transaction');
const rewardService = require('./reward.service');
const walletService = require('./wallet.service');
const txService = require('./transaction.service');
const audit = require('./audit.service');

async function latestCycle(userId, session) {
  return StreakCycle.findOne({ userId }).sort({ cycleNumber: -1 }).session(session || null);
}

/** Persist a detected missed streak exactly once (guarded by status ACTIVE). */
async function resetStreakIfMissed(userId, cycle, state, now, ip) {
  if (!state.needsReset || !cycle) return false;
  const res = await StreakCycle.updateOne(
    { _id: cycle._id, status: 'ACTIVE' },
    { $set: { status: 'RESET', resetAt: now } }
  );
  if (res.modifiedCount === 1) {
    await audit.log(
      userId,
      'STREAK_RESET',
      { cycleId: cycle._id, previousStreak: cycle.claimedCount, missedDay: cycle.claimedCount + 1 },
      ip
    );
    return true;
  }
  return false;
}

/** Full page payload: everything React renders comes from here. */
async function getStreak(userId, ip) {
  const now = new Date();
  const [config, rewards, cycle, wallet] = await Promise.all([
    rewardService.getConfig(),
    rewardService.getActiveRewards(),
    latestCycle(userId),
    walletService.getWallet(userId),
  ]);

  const state = computeState({ cycle, rewards, config, now });
  await resetStreakIfMissed(userId, cycle, state, now, ip);

  const cards = buildCards(rewards, state);
  const nextRewardCard = cards.find((c) => c.day === state.currentDay);
  const ultimate = rewards.find((r) => r.metadata && r.metadata.isUltimate) || rewards[rewards.length - 1];

  return {
    success: true,
    serverTime: now.toISOString(),
    streak: {
      currentStreak: state.currentStreak,
      currentDay: state.currentDay,
      checkedIn: state.checkedIn,
      totalRewards: state.totalDays,
      status: state.mode,
      claimable: state.claimable,
      nextClaimAt: state.nextClaimAt ? state.nextClaimAt.toISOString() : null,
      remainingMs: state.remainingMs,
      cycleNumber: cycle ? cycle.cycleNumber : 1,
      lastReset: state.lastReset,
    },
    stats: {
      totalRewards: state.totalDays,
      checkedIn: state.checkedIn,
      nextReward: nextRewardCard
        ? {
            day: nextRewardCard.day,
            amount: nextRewardCard.reward.amount,
            currency: nextRewardCard.reward.currency,
            type: nextRewardCard.reward.type,
            title: nextRewardCard.reward.title,
            subtitle: nextRewardCard.reward.subtitle,
          }
        : null,
    },
    ultimateReward: {
      day: ultimate.day,
      amount: ultimate.amount,
      currency: ultimate.currency,
      type: ultimate.rewardType,
      title: ultimate.title,
      subtitle: ultimate.subtitle,
      assetType: ultimate.assetType,
      unlockDay: ultimate.day,
    },
    rewards: cards,
    wallet,
  };
}

/** Lightweight endpoint used by the frontend when its countdown reaches ~0. */
async function getStatus(userId, ip) {
  const full = await getStreak(userId, ip);
  return {
    success: true,
    serverTime: full.serverTime,
    streak: full.streak,
    wallet: full.wallet,
  };
}

async function getHistory(userId, { page = 1, limit = 20 }) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    StreakClaim.find({ userId }).sort({ claimedAt: -1 }).skip(skip).limit(limit).lean(),
    StreakClaim.countDocuments({ userId }),
  ]);
  return {
    success: true,
    page,
    limit,
    total,
    history: items.map((c) => ({
      claimId: c._id,
      cycleNumber: c.cycleNumber,
      day: c.day,
      reward: c.rewardSnapshot,
      status: c.status,
      claimedAt: c.claimedAt,
      transactionId: c.transactionId,
      referenceId: c.referenceId,
    })),
  };
}

/** The single atomic claim operation. Everything is derived on the server. */
async function doClaim({ userId, requestedDay, idempotencyKey }) {
  const [config, rewards] = await Promise.all([rewardService.getConfig(), rewardService.getActiveRewards()]);

  return runInTransaction(async (session) => {
    const now = new Date();
    const cycle = await latestCycle(userId, session);
    const state = computeState({ cycle, rewards, config, now });

    // A client-supplied day is only an *intent*; it must match what the server computed.
    if (requestedDay != null && requestedDay !== state.currentDay) {
      throw new AppError(400, 'INVALID_DAY', 'That reward is not your current streak day.', {
        invalid: true,
      });
    }
    if (!state.claimable) {
      const nextClaimAt = state.nextClaimAt ? state.nextClaimAt.toISOString() : null;
      throw new AppError(403, 'NOT_AVAILABLE_YET', 'Your next reward is not available yet.', {
        nextClaimAt,
        serverTime: now.toISOString(),
      });
    }

    const day = state.currentDay;
    const reward = rewards.find((r) => r.day === day);
    if (!reward) throw new AppError(500, 'CONFIG_MISSING', 'Reward is not configured.');

    // Close a missed cycle, then open a new one when required.
    let active = cycle;
    if (state.needsReset && cycle) {
      await StreakCycle.updateOne(
        { _id: cycle._id, status: 'ACTIVE' },
        { $set: { status: 'RESET', resetAt: now } },
        { session }
      );
    }
    if (state.needsNewCycle) {
      const [created] = await StreakCycle.create(
        [{ userId, cycleNumber: (cycle ? cycle.cycleNumber : 0) + 1, status: 'ACTIVE', startedAt: now }],
        { session }
      );
      active = created;
    }

    // Atomic guard: only succeeds if nothing changed since we read the state.
    const isLast = day === rewards.length;
    const advanced = await StreakCycle.findOneAndUpdate(
      {
        _id: active._id,
        userId,
        status: 'ACTIVE',
        claimedCount: day - 1,
        lastClaimAt: active.lastClaimAt || null,
      },
      {
        $push: { claimedDays: day },
        $inc: { claimedCount: 1 },
        $set: {
          lastClaimAt: now,
          ...(isLast ? { status: 'COMPLETED', completedAt: now } : {}),
        },
      },
      { new: true, session }
    );
    if (!advanced) {
      throw new AppError(409, 'ALREADY_CLAIMED', 'This reward has already been claimed.');
    }

    // Wallet credit + ledger entry.
    const { balanceBefore, balanceAfter } = await walletService.credit(
      userId,
      reward.currency,
      reward.amount,
      session
    );
    const referenceId = txService.newReferenceId();
    const tx = await txService.createCredit(
      {
        userId,
        currency: reward.currency,
        rewardType: reward.rewardType,
        amount: reward.amount,
        streakDay: day,
        referenceId,
        balanceBefore,
        balanceAfter,
      },
      session
    );

    // Claim history row (unique per user+cycle+day).
    const [claim] = await StreakClaim.create(
      [
        {
          userId,
          cycleId: advanced._id,
          cycleNumber: advanced.cycleNumber,
          day,
          rewardId: reward._id,
          rewardSnapshot: {
            type: reward.rewardType,
            currency: reward.currency,
            amount: reward.amount,
            title: reward.title,
            subtitle: reward.subtitle,
          },
          claimedAt: now,
          transactionId: tx._id,
          referenceId,
          idempotencyKey: idempotencyKey || undefined,
        },
      ],
      { session }
    );

    return { claim, tx, wasReset: state.needsReset, previousStreak: cycle ? cycle.claimedCount : 0 };
  });
}

async function claimReward(userId, { requestedDay, idempotencyKey, ip, ignoredFields = [] }) {
  await audit.log(userId, 'STREAK_CLAIM_REQUEST', { requestedDay, idempotencyKey, ignoredFields }, ip);

  // Idempotent replay: same key from the same user returns the original result.
  if (idempotencyKey) {
    const existing = await StreakClaim.findOne({ userId, idempotencyKey }).lean();
    if (existing) {
      await audit.log(userId, 'DUPLICATE_CLAIM', { idempotencyKey, day: existing.day }, ip);
      const state = await getStreak(userId, ip);
      return { ...state, claim: formatClaim(existing), idempotentReplay: true };
    }
  }

  try {
    const result = await doClaim({ userId, requestedDay, idempotencyKey });
    if (result.wasReset) {
      await audit.log(userId, 'STREAK_RESET', { previousStreak: result.previousStreak }, ip);
    }
    await audit.log(
      userId,
      'STREAK_CLAIM_SUCCESS',
      { day: result.claim.day, referenceId: result.claim.referenceId, amount: result.tx.amount },
      ip
    );
    const state = await getStreak(userId, ip);
    return { ...state, claim: formatClaim(result.claim), idempotentReplay: false };
  } catch (err) {
    let appErr = err;
    // Unique-index hit (concurrent or repeated claim) -> clean duplicate response.
    if (err && (err.code === 11000 || /E11000/.test(err.message || ''))) {
      appErr = new AppError(409, 'ALREADY_CLAIMED', 'This reward has already been claimed.');
    }
    if (appErr instanceof AppError) {
      const event =
        appErr.code === 'ALREADY_CLAIMED'
          ? 'DUPLICATE_CLAIM'
          : appErr.code === 'INVALID_DAY'
          ? 'INVALID_CLAIM'
          : 'STREAK_CLAIM_REJECTED';
      await audit.log(userId, event, { code: appErr.code, requestedDay }, ip);
      throw appErr;
    }
    throw err;
  }
}

function formatClaim(c) {
  return {
    claimId: c._id,
    day: c.day,
    reward: c.rewardSnapshot,
    claimedAt: c.claimedAt,
    transactionId: c.transactionId,
    referenceId: c.referenceId,
  };
}

module.exports = { getStreak, getStatus, getHistory, claimReward, mongoose };
