const crypto = require('crypto');
const WalletTransaction = require('../models/WalletTransaction');

function newReferenceId() {
  return `STREAK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

async function createCredit(data, session) {
  const [tx] = await WalletTransaction.create([{ ...data, type: 'CREDIT', source: 'DAILY_STREAK' }], {
    session,
  });
  return tx;
}

module.exports = { newReferenceId, createCredit };
