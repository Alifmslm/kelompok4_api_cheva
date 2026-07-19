const ApiError = require('../utils/apiError');

/**
 * Middleware untuk membatasi akses berdasarkan peran pengguna
 * @param  {...String} roles - Daftar peran yang diizinkan ('admin', 'seller', 'buyer')
 */
const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.peran)) {
      return next(
        new ApiError(403, 'Anda tidak memiliki akses untuk melakukan tindakan ini.')
      );
    }
    next();
  };
};

module.exports = roleMiddleware;