const AuditLog = require('../models/AuditLog');

/** Audit logging must never break the request, so errors are swallowed. */
async function log(userId, event, details = {}, ip) {
  try {
    await AuditLog.create({ userId, event, details, ip });
  } catch (err) {
    console.error('audit log failed:', err.message);
  }
}

module.exports = { log };
