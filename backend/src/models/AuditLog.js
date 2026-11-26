const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    event: {
      type: String,
      required: true,
      enum: [
        'STREAK_CLAIM_REQUEST',
        'STREAK_CLAIM_SUCCESS',
        'STREAK_CLAIM_REJECTED',
        'STREAK_RESET',
        'DUPLICATE_CLAIM',
        'INVALID_CLAIM',
        'AUTH_FAILED',
      ],
      index: true,
    },
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
