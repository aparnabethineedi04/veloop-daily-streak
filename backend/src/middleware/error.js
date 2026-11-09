const AppError = require('../utils/appError');
const { ZodError } = require('zod');

function notFound(req, res) {
  res.status(404).json({ success: false, code: 'NOT_FOUND', message: 'Route not found.' });
}

/** Never leaks MongoServerError / CastError / stack traces to the client. */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Invalid request.',
      errors: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }
  if (err instanceof AppError) {
    return res
      .status(err.status)
      .json({ success: false, code: err.code, message: err.message, ...err.extra });
  }
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, code: 'BAD_JSON', message: 'Invalid request body.' });
  }
  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    code: 'SERVER_ERROR',
    message: 'Unable to process your request. Please try again.',
  });
}

module.exports = { notFound, errorHandler };
