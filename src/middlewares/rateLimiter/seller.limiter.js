const rateLimit = require('express-rate-limit');
const ApiError = require('../../utils/apiError');

const sellerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 200, // Maksimal 200 request per 15 menit
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(429, 'Terlalu banyak permintaan ke API Seller. Silakan coba lagi setelah 15 menit.'));
  },
});

const sellerMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 50, // Maksimal 50 request untuk penulisan/perubahan
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new ApiError(429, 'Terlalu banyak aktivitas perubahan data pada akun Anda. Silakan coba lagi nanti.'));
  },
});

module.exports = {
  sellerLimiter,
  sellerMutationLimiter,
};
