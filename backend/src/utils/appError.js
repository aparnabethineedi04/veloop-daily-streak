/** Operational error with a safe, user-facing message and a stable code. */
class AppError extends Error {
  constructor(status, code, message, extra = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.extra = extra;
    this.isOperational = true;
  }
}
module.exports = AppError;
