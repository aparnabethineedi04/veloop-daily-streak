/**
 * Seeds reward config, streak rules and a demo user.
 * Usage: npm run seed   (uses MONGO_URI from .env - YOUR OWN dev database)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const StreakReward = require('../src/models/StreakReward');
const StreakConfig = require('../src/models/StreakConfig');
const User = require('../src/models/User');
const Wallet = require('../src/models/Wallet');

const rewards = [
  { day: 1, rewardType: 'VES', currency: 'VES', amount: 5, title: 'Daily Reward', subtitle: '5 VEs', assetType: 'coin' },
  { day: 2, rewardType: 'VES', currency: 'VES', amount: 10, title: 'Daily Reward', subtitle: '10 VEs', assetType: 'coin' },
  { day: 3, rewardType: 'VES', currency: 'VES', amount: 15, title: 'Daily Reward', subtitle: '15 VEs', assetType: 'coin' },
  { day: 4, rewardType: 'GIFT_CARD', currency: 'INR', amount: 1, title: 'Daily Reward', subtitle: 'Amazon Gift Card', assetType: 'gift' },
  { day: 5, rewardType: 'GIFT_CARD', currency: 'INR', amount: 2, title: 'Daily Reward', subtitle: 'Amazon Gift Card', assetType: 'gift-card', metadata: { badge: 'Gift Card' } },
  { day: 6, rewardType: 'VES', currency: 'VES', amount: 30, title: 'Daily Reward', subtitle: '30 VEs', assetType: 'coin', metadata: { badge: 'Coin' } },
  { day: 7, rewardType: 'GIFT_CARD', currency: 'INR', amount: 5, title: 'Ultimate Reward', subtitle: 'Amazon Gift Card', assetType: 'crown', metadata: { badge: 'VIP', isUltimate: true } },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  for (const r of rewards) await StreakReward.updateOne({ day: r.day }, { $set: { ...r, active: true } }, { upsert: true });

  await StreakConfig.updateOne(
    { key: 'default' },
    { $set: { claimIntervalHours: 24, claimWindowHours: 24, resetOnMiss: true, active: true } },
    { upsert: true }
  );

  const email = 'demo@veloop.test';
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name: 'Demo User', email, passwordHash: await bcrypt.hash('Demo@1234', 12) });
  }
  await Wallet.updateOne({ userId: user._id }, { $setOnInsert: { balances: { VES: 120, INR: 0 } } }, { upsert: true });

  console.log('Seed complete. Demo login -> demo@veloop.test / Demo@1234');
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
