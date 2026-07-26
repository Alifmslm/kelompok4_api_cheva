const sellerService = require('../services/seller.service');
const apiResponse = require('../utils/apiResponse');

const getSupplierById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const supplier = await sellerService.getSupplierById(id);
        return apiResponse.success(res, 200, 'Detail supplier berhasil diambil', supplier);
    } catch (error) {
        next(error);
    }
};

const getSupplierLocation = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const location = await sellerService.getSupplierLocation(id);
        return apiResponse.success(res, 200, 'Lokasi supplier berhasil diambil', location);
    } catch (error) {
        next(error);
    }
};

const getSupplierByProduct = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.id);
        const supplier = await sellerService.getSupplierByProduct(productId);
        return apiResponse.success(res, 200, 'Supplier pemilik produk berhasil diambil', supplier);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSupplierById,
    getSupplierLocation,
    getSupplierByProduct
};
