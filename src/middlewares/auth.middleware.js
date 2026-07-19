const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const penggunaModel = require('../models/pengguna.model');

/**
 * Middleware untuk mengecek ketersediaan dan keabsahan token JWT
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Anda belum login. Silakan login untuk mendapatkan akses.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_default');

    // Cek apakah pengguna masih ada (jika dihapus dari DB, token menjadi invalid)
    const currentUser = await penggunaModel.findById(decoded.id_pengguna);
    if (!currentUser) {
      throw new ApiError(401, 'Pengguna yang memiliki token ini tidak lagi ada.');
    }

    // Assign data pengguna ke req object
    req.user = currentUser;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Token tidak valid. Silakan login kembali.'));
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Token telah kedaluwarsa. Silakan login kembali.'));
    } else {
      next(error);
    }
  }
};

module.exports = authMiddleware;