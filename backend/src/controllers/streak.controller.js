const streakService = require('../services/streak.service');
const walletService = require('../services/wallet.service');
const { claimSchema, historyQuerySchema } = require('../validators/schemas');

exports.getStreak = async (req, res, next) => {
  try {
    res.json(await streakService.getStreak(req.user.id, req.ip));
  } catch (e) {
    next(e);
  }
};

exports.getStatus = async (req, res, next) => {
  try {
    res.json(await streakService.getStatus(req.user.id, req.ip));
  } catch (e) {
    next(e);
  }
};

exports.claim = async (req, res, next) => {
  try {
    const body = claimSchema.parse(req.body || {});
    // Fields the client must never control; they are ignored and logged.
    const ignoredFields = Object.keys(body).filter((k) => k !== 'day');
    const idempotencyKey = (req.get('Idempotency-Key') || '').slice(0, 100) || undefined;
    const result = await streakService.claimReward(req.user.id, {
      requestedDay: body.day,
      idempotencyKey,
      ip: req.ip,
      ignoredFields,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const q = historyQuerySchema.parse(req.query);
    res.json(await streakService.getHistory(req.user.id, q));
  } catch (e) {
    next(e);
  }
};

exports.getWallet = async (req, res, next) => {
  try {
    res.json({ success: true, wallet: await walletService.getWallet(req.user.id) });
  } catch (e) {
    next(e);
  }
};
