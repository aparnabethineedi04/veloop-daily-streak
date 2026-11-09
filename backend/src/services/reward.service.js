const StreakReward = require('../models/StreakReward');
const StreakConfig = require('../models/StreakConfig');
const AppError = require('../utils/appError');

async function getActiveRewards() {
  const rewards = await StreakReward.find({ active: true }).sort({ day: 1 }).lean();
  if (!rewards.length) throw new AppError(500, 'CONFIG_MISSING', 'Rewards are not configured yet.');
  return rewards;
}

async function getConfig() {
  const config = await StreakConfig.findOne({ key: 'default', active: true }).lean();
  if (!config) throw new AppError(500, 'CONFIG_MISSING', 'Streak rules are not configured yet.');
  return config;
}

module.exports = { getActiveRewards, getConfig };
