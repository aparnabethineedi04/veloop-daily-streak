const Wallet = require('../models/Wallet');

async function getWallet(userId) {
  const wallet = await Wallet.findOne({ userId }).lean();
  const b = (wallet && wallet.balances) || {};
  return { VES: b.VES || 0, INR: b.INR || 0 };
}

/** Atomically credits the wallet and returns balances before/after. Run inside a session. */
async function credit(userId, currency, amount, session) {
  const wallet = await Wallet.findOneAndUpdate(
    { userId },
    { $inc: { [`balances.${currency}`]: amount } },
    { upsert: true, new: true, session, setDefaultsOnInsert: true }
  );
  const after = wallet.balances[currency];
  return { balanceBefore: after - amount, balanceAfter: after };
}

module.exports = { getWallet, credit };
