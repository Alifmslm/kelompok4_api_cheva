const rateLimit = require('express-rate-limit');
const ApiError = require('../../utils/apiError');

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(429, 'Terlalu banyak permintaan dari akun Admin Anda. Silakan coba lagi setelah 15 menit.'));
  },
});

module.exports = { adminLimiter };