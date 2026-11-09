/**
 * DEV ONLY (ALLOW_DEV_ROUTES=true and NODE_ENV != production).
 * Lets you test missed-day logic without waiting real days by shifting the
 * user's STORED claim timestamps back in time. Server clock is never changed.
 */
const express = require('express');
const { z } = require('zod');
const { requireAuth } = require('../middleware/auth');
const StreakCycle = require('../models/StreakCycle');
const router = express.Router();

router.post('/rewind', requireAuth, async (req, res, next) => {
  try {
    const { hours } = z.object({ hours: z.number().positive().max(24 * 60) }).parse(req.body);
    const cycle = await StreakCycle.findOne({ userId: req.user.id }).sort({ cycleNumber: -1 });
    if (!cycle || !cycle.lastClaimAt) {
      return res.status(400).json({ success: false, code: 'NOTHING_TO_REWIND', message: 'No claim to rewind.' });
    }
    cycle.lastClaimAt = new Date(cycle.lastClaimAt.getTime() - hours * 3600 * 1000);
    await cycle.save();
    res.json({ success: true, lastClaimAt: cycle.lastClaimAt });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
