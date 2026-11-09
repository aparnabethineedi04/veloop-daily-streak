const mongoose = require('mongoose');
const env = require('../config/env');

/**
 * Runs fn(session) inside a MongoDB transaction (auto-retried on transient
 * write conflicts). If USE_TRANSACTIONS=false (plain standalone mongod) fn runs
 * with a null session and relies on the atomic guards + unique indexes.
 */
async function runInTransaction(fn) {
  if (!env.useTransactions) return fn(null);
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await fn(session);
    });
    return result;
  } finally {
    session.endSession();
  }
}

module.exports = { runInTransaction };
