const ApiError = require('../utils/apiError');

/**
 * Middleware untuk memvalidasi req.body menggunakan skema Joi
 * @param {Object} schema - Skema validasi Joi
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map((detail) => detail.message).join(', ');
    return next(new ApiError(400, errorMessage));
  }
  next();
};

module.exports = validate;