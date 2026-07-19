const ApiError = require('../utils/apiError');

/**
 * Middleware terpusat untuk menangani error
 * Selalu mengembalikan format error yang konsisten
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Tangkap error khusus dari Prisma jika diperlukan
  if (err.code === 'P2002') {
    const field = err.meta.target;
    error = new ApiError(400, `Data untuk field ${field} sudah digunakan (harus unik).`);
  }

  // Fallback untuk unhandled error
  if (!error.isOperational && error.statusCode === 500) {
    console.error('ERROR:', err);
    error.message = 'Terjadi kesalahan pada server.';
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

module.exports = errorHandler;