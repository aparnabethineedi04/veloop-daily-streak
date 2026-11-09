const mongoose = require('mongoose');

/** One 7-day run per user. Source of truth for the current streak. */
const streakCycleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cycleNumber: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['ACTIVE', 'COMPLETED', 'RESET'], default: 'ACTIVE' },
    claimedDays: { type: [Number], default: [] },
    claimedCount: { type: Number, default: 0 },
    lastClaimAt: { type: Date, default: null },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    resetAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Two concurrent "start cycle" requests cannot both succeed.
streakCycleSchema.index({ userId: 1, cycleNumber: 1 }, { unique: true });

module.exports = mongoose.model('StreakCycle', streakCycleSchema);
