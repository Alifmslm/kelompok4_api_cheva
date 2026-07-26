const ApiError = require('../utils/ApiError');

const validateCommodityQuery = (req, res, next) => {
  const { category, search, page, limit } = req.query;

  if (category && typeof category !== 'string') {
    throw new ApiError(400, 'Category harus berupa string');
  }

  if (search && typeof search !== 'string') {
    throw new ApiError(400, 'Search keyword harus berupa string');
  }

  if (page) {
    const pageNum = parseInt(page);
    if (isNaN(pageNum) || pageNum < 1) {
      throw new ApiError(400, 'Page harus berupa angka positif minimal 1');
    }
  }

  if (limit) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      throw new ApiError(400, 'Limit harus berupa angka antara 1-100');
    }
  }

  next();
};

module.exports = {
  validateCommodityQuery
};
