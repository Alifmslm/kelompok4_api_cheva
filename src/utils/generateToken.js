const jwt = require('jsonwebtoken');

/**
 * Helper untuk men-generate JWT
 * @param {Object} payload - Data yang akan dienkripsi ke dalam token (misal: id_pengguna, peran)
 * @returns {String} Token JWT
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret_key_default', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

module.exports = { generateToken };