const authService = require('../services/auth.service');
const { registerSchema, loginSchema } = require('../validators/schemas');

exports.register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    res.status(201).json({ success: true, ...result });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data, req.ip);
    res.json({ success: true, ...result });
  } catch (e) {
    next(e);
  }
};

exports.me = (req, res) => res.json({ success: true, user: req.user });
