const rateLimit = require('express-rate-limit');

const cartLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Terlalu banyak request ke cart, silakan coba lagi setelah 5 menit'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false
});

const cartMutationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Terlalu banyak perubahan pada cart, silakan coba lagi setelah 1 menit'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false
});

module.exports = {
  cartLimiter,
  cartMutationLimiter
};
