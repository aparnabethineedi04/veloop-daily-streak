const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const AppError = require('../utils/appError');
const audit = require('./audit.service');

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

async function register({ name, email, password }) {
  const exists = await User.findOne({ email });
  if (exists) throw new AppError(409, 'EMAIL_TAKEN', 'An account with this email already exists.');
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  await Wallet.create({ userId: user._id });
  return { token: signToken(user), user: publicUser(user) };
}

async function login({ email, password }, ip) {
  const user = await User.findOne({ email }).select('+passwordHash');
  const ok = user && (await bcrypt.compare(password, user.passwordHash));
  if (!ok) {
    await audit.log(user ? user._id : undefined, 'AUTH_FAILED', { email }, ip);
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Incorrect email or password.');
  }
  if (user.status !== 'ACTIVE') throw new AppError(403, 'ACCOUNT_DISABLED', 'This account is not eligible.');
  return { token: signToken(user), user: publicUser(user) };
}

module.exports = { register, login };
