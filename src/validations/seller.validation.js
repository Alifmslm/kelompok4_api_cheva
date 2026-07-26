const ApiError = require('../utils/ApiError');

const validateSupplierId = (req, res, next) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id) || id <= 0) {
    throw new ApiError(400, 'ID tidak valid, harus berupa angka positif');
  }

  next();
};

module.exports = {
  validateSupplierId
};
