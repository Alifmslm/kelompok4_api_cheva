const rateLimit = require('express-rate-limit');

const sellerLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Terlalu banyak request ke seller, silakan coba lagi setelah 5 menit'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false
});

module.exports = {
  sellerLimiter
};
