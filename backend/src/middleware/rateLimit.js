const rateLimit = require('express-rate-limit');

const json = (code, message) => (req, res) =>
  res.status(429).json({ success: false, code, message });

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json('RATE_LIMITED', 'Too many requests. Please slow down.'),
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  handler: json('RATE_LIMITED', 'Too many attempts. Please try again later.'),
});

const claimLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => (req.user ? String(req.user.id) : req.ip),
  handler: json('RATE_LIMITED', 'Too many claim attempts. Please wait a moment.'),
});

module.exports = { apiLimiter, authLimiter, claimLimiter };
