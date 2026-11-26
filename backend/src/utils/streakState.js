/**
 * PURE streak state calculator. No database, no clocks: everything it needs is
 * passed in, so it is deterministic and unit-testable. All decisions use the
 * `now` supplied by the SERVER, never the client.
 *
 * cycle  : latest StreakCycle of the user (or null)
 * rewards: active StreakReward list sorted by day (length = cycle length)
 * config : { claimIntervalHours, claimWindowHours }
 *
 * Modes
 *  FRESH              no cycle yet, or the last cycle was already reset
 *  FRESH_NEXT_CYCLE   last cycle was completed and its interval has elapsed
 *  MISSED             active cycle, claim window expired -> streak must reset
 *  READY              active cycle, next day claimable now
 *  WAITING            active cycle, next day still locked (countdown)
 *  COMPLETE_WAITING   cycle completed, waiting before a new cycle may start
 */
const HOUR = 3600 * 1000;

function computeState({ cycle, rewards, config, now }) {
  const totalDays = rewards.length;
  const intervalMs = config.claimIntervalHours * HOUR;
  const windowMs = config.claimWindowHours * HOUR;
  const nowMs = now.getTime();

  const base = {
    totalDays,
    claimedDays: [],
    currentStreak: 0,
    checkedIn: 0,
    currentDay: 1,
    claimable: true,
    nextClaimAt: null,
    missedAt: null,
    remainingMs: 0,
    needsNewCycle: true,
    needsReset: false,
    lastReset: null,
  };

  if (!cycle) return { ...base, mode: 'FRESH' };

  const last = cycle.lastClaimAt ? new Date(cycle.lastClaimAt) : null;
  const nextClaimAt = last ? new Date(last.getTime() + intervalMs) : null;
  const missedAt = nextClaimAt ? new Date(nextClaimAt.getTime() + windowMs) : null;
  const claimed = [...(cycle.claimedDays || [])].sort((a, b) => a - b);

  if (cycle.status === 'RESET') {
    return {
      ...base,
      mode: 'FRESH',
      lastReset: {
        previousStreak: cycle.claimedCount || claimed.length,
        missedDay: (cycle.claimedCount || claimed.length) + 1,
        resetAt: cycle.resetAt || null,
      },
    };
  }

  if (cycle.status === 'COMPLETED') {
    if (nowMs >= nextClaimAt.getTime()) return { ...base, mode: 'FRESH_NEXT_CYCLE' };
    return {
      ...base,
      mode: 'COMPLETE_WAITING',
      claimedDays: claimed,
      currentStreak: claimed.length,
      checkedIn: claimed.length,
      currentDay: null,
      claimable: false,
      nextClaimAt,
      remainingMs: nextClaimAt.getTime() - nowMs,
      needsNewCycle: false,
    };
  }

  // ACTIVE cycle
  if (nowMs > missedAt.getTime()) {
    return {
      ...base,
      mode: 'MISSED',
      needsReset: true,
      missedAt,
      lastReset: {
        previousStreak: claimed.length,
        missedDay: claimed.length + 1,
        resetAt: null,
      },
    };
  }

  const ready = nowMs >= nextClaimAt.getTime();
  return {
    ...base,
    mode: ready ? 'READY' : 'WAITING',
    claimedDays: claimed,
    currentStreak: claimed.length,
    checkedIn: claimed.length,
    currentDay: claimed.length + 1,
    claimable: ready,
    nextClaimAt: ready ? null : nextClaimAt,
    missedAt,
    remainingMs: ready ? 0 : nextClaimAt.getTime() - nowMs,
    needsNewCycle: false,
  };
}

/** Per-day card states, decided entirely on the server. */
function buildCards(rewards, state) {
  return rewards.map((r) => {
    const claimed = state.claimedDays.includes(r.day);
    let status;
    let isToday = false;
    let isNext = false;
    if (claimed) status = 'CLAIMED';
    else if (state.currentDay === r.day) {
      if (state.claimable) {
        status = 'AVAILABLE';
        isToday = true;
      } else {
        status = 'LOCKED';
        isNext = true;
      }
    } else status = 'LOCKED';

    return {
      day: r.day,
      status,
      isToday,
      isNext,
      nextClaimAt: isNext && state.nextClaimAt ? state.nextClaimAt.toISOString() : null,
      reward: {
        type: r.rewardType,
        currency: r.currency,
        amount: r.amount,
        title: r.title,
        subtitle: r.subtitle,
        assetType: r.assetType,
        badge: (r.metadata && r.metadata.badge) || null,
        isUltimate: !!(r.metadata && r.metadata.isUltimate),
      },
    };
  });
}

module.exports = { computeState, buildCards };
