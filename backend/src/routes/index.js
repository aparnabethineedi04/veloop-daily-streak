const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { authLimiter, claimLimiter } = require('../middleware/rateLimit');
const auth = require('../controllers/auth.controller');
const streak = require('../controllers/streak.controller');
const env = require('../config/env');

const router = express.Router();

router.get('/health', (req, res) => res.json({ success: true, status: 'ok', serverTime: new Date().toISOString() }));

router.post('/auth/register', authLimiter, auth.register);
router.post('/auth/login', authLimiter, auth.login);
router.get('/auth/me', requireAuth, auth.me);

router.get('/daily-streak', requireAuth, streak.getStreak);
router.get('/daily-streak/status', requireAuth, streak.getStatus);
router.post('/daily-streak/claim', requireAuth, claimLimiter, streak.claim);
router.get('/daily-streak/history', requireAuth, streak.getHistory);
router.get('/wallet', requireAuth, streak.getWallet);

if (env.allowDevRoutes) router.use('/dev', require('./dev'));

module.exports = router;
