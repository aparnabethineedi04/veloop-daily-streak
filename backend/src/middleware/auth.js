const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const AppError = require('../utils/appError');

/** Identity comes ONLY from the verified JWT, never from the request body/query. */
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new AppError(401, 'UNAUTHENTICATED', 'Please log in to continue.');
    let payload;
    try {
      payload = jwt.verify(token, env.jwtSecret);
    } catch {
      throw new AppError(401, 'UNAUTHENTICATED', 'Please log in to continue.');
    }
    const user = await User.findById(payload.sub).lean();
    if (!user) throw new AppError(401, 'UNAUTHENTICATED', 'Please log in to continue.');
    if (user.status !== 'ACTIVE') throw new AppError(403, 'ACCOUNT_DISABLED', 'This account is not eligible.');
    req.user = { id: user._id, name: user.name, email: user.email };
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireAuth };
