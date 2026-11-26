const mongoose = require('mongoose');

/** One wallet per user. VES = in-app coins, INR = gift-card value (Rs). */
const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balances: {
      VES: { type: Number, default: 0, min: 0 },
      INR: { type: Number, default: 0, min: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', walletSchema);
