const rateLimit = require('express-rate-limit');

const commodityLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Terlalu banyak request ke commodity, silakan coba lagi setelah 5 menit'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false
});

module.exports = {
  commodityLimiter
};
