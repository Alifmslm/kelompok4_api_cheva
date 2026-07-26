const commodityService = require('../services/commodity.service');
const apiResponse = require('../utils/apiResponse');

const getCommodities = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const result = await commodityService.getCommodities({
      category,
      search,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    return apiResponse.success(res, 200, 'Daftar commodity berhasil diambil', result);
  } catch (error) {
    next(error);
  }
};

const getCommodityById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const commodity = await commodityService.getCommodityById(id);
    return apiResponse.success(res, 200, 'Detail commodity berhasil diambil', commodity);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await commodityService.getCategories();
    return apiResponse.success(res, 200, 'Daftar kategori berhasil diambil', categories);
  } catch (error) {
    next(error);
  }
};

const getCommoditiesByCategory = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { page = 1, limit = 10 } = req.query;
    const result = await commodityService.getCommoditiesByCategory(categoryId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });
    return apiResponse.success(res, 200, 'Commodity berdasarkan kategori berhasil diambil', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommodities,
  getCommodityById,
  getCategories,
  getCommoditiesByCategory
};
