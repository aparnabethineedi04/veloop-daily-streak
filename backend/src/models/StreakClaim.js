const mongoose = require('mongoose');

/** Claim history. Unique (userId, cycleId, day) makes double claims impossible at DB level. */
const streakClaimSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cycleId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreakCycle', required: true },
    cycleNumber: { type: Number, required: true },
    day: { type: Number, required: true },
    rewardId: { type: mongoose.Schema.Types.ObjectId, ref: 'StreakReward', required: true },
    rewardSnapshot: {
      type: { type: String },
      currency: String,
      amount: Number,
      title: String,
      subtitle: String,
    },
    status: { type: String, enum: ['SUCCESS'], default: 'SUCCESS' },
    claimedAt: { type: Date, required: true },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'WalletTransaction' },
    referenceId: { type: String },
    idempotencyKey: { type: String },
  },
  { timestamps: true }
);

streakClaimSchema.index({ userId: 1, cycleId: 1, day: 1 }, { unique: true });
streakClaimSchema.index(
  { userId: 1, idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: 'string' } } }
);

module.exports = mongoose.model('StreakClaim', streakClaimSchema);
