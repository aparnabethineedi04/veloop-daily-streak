const mongoose = require('mongoose');

/** Reward configuration per streak day. Editing this changes the UI with no code change. */
const streakRewardSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, unique: true, min: 1 },
    rewardType: { type: String, enum: ['VES', 'GIFT_CARD'], required: true },
    currency: { type: String, enum: ['VES', 'INR'], required: true },
    amount: { type: Number, required: true, min: 0 },
    title: { type: String, required: true }, // e.g. "Daily Reward"
    subtitle: { type: String, default: '' }, // e.g. "5 VEs" / "Amazon Gift Card"
    assetType: { type: String, enum: ['coin', 'gift', 'gift-card', 'crown'], required: true },
    active: { type: Boolean, default: true, index: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // { badge, isUltimate }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StreakReward', streakRewardSchema);
