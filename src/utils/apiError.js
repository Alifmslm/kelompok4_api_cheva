/**
 * Custom error class dengan statusCode dan message
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Error yang bisa diprediksi
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;