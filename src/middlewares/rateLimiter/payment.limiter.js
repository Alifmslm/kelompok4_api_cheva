const rateLimit = require('express-rate-limit');

const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Terlalu banyak request ke payment, silakan coba lagi setelah 5 menit'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false
});

module.exports = {
  paymentLimiter
};
