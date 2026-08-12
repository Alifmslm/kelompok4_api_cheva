const ApiError = require('../utils/apiError');

/**
 * Middleware untuk memvalidasi req.body menggunakan skema Joi
 * @param {Object} schema - Skema validasi Joi
 */
const validate = (schema) => (req, res, next) => {
  // Bersihkan string kosong dari req.body (Sangat berguna untuk multipart/form-data dari Swagger/Frontend)
  if (req.body && typeof req.body === 'object') {
    for (const key in req.body) {
      if (req.body[key] === '') {
        delete req.body[key];
      }
    }
  }

  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return next(new ApiError(400, errorMessage));
  }

  // (WAJIB untuk form-data: angka seperti harga/stok datang sebagai string, Joi mengkonversinya ke Integer)
  req.body = value;

  // Cek manual khusus untuk update (PUT/PATCH) agar tidak mengirim object kosong ke Prisma
  if (req.method === 'PUT' || req.method === 'PATCH') {
    const bodyIsEmpty = Object.keys(req.body).length === 0;
    const noFiles = !req.file && (!req.files || Object.keys(req.files).length === 0);
    
    if (bodyIsEmpty && noFiles) {
      return next(new ApiError(400, 'Minimal satu field teks atau file gambar/dokumen harus diisi untuk melakukan update'));
    }
  }

  next();
};

module.exports = validate;