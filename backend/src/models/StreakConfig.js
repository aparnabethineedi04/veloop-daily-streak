const mongoose = require('mongoose');

/** Single document (key = "default") holding all streak rules. */
const streakConfigSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'default', unique: true },
    claimIntervalHours: { type: Number, required: true, min: 0 }, // wait between claims
    claimWindowHours: { type: Number, required: true, min: 0 }, // grace after unlock before streak resets
    resetOnMiss: { type: Boolean, default: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StreakConfig', streakConfigSchema);
