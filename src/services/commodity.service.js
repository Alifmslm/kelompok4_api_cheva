const ProdukModel = require('../models/produk.model');
const ApiError = require('../utils/ApiError');

const getCommodities = async ({ category, search, page, limit }) => {
  const offset = (page - 1) * limit;
  
  const filter = {};
  
  if (search) {
    filter.search = search;
  }
  
  const { products, total } = await ProdukModel.findAllWithFilter(filter, limit, offset);
  
  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getCommodityById = async (id) => {
  const product = await ProdukModel.findById(id);
  
  if (!product) {
    throw new ApiError(404, 'Produk tidak ditemukan');
  }
  
  return product;
};

module.exports = {
  getCommodities,
  getCommodityById
};
