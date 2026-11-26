const mongoose = require('mongoose');

/** Immutable ledger entry. balanceAfter - balanceBefore === amount. */
const walletTransactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    currency: { type: String, enum: ['VES', 'INR'], required: true },
    rewardType: { type: String, enum: ['VES', 'GIFT_CARD'], required: true },
    type: { type: String, enum: ['CREDIT', 'DEBIT'], default: 'CREDIT' },
    amount: { type: Number, required: true },
    source: { type: String, required: true }, // DAILY_STREAK
    streakDay: { type: Number },
    referenceId: { type: String, required: true, unique: true }, // STREAK-XXXXXXXX
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    status: { type: String, enum: ['COMPLETED'], default: 'COMPLETED' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
