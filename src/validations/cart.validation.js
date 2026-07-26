// schema validasi untuk request keranjang
const ApiError = require('../utils/ApiError');

const validateCartItem = (req, res, next) => {
    const { productId, quantity } = req.body;

    if (!productId) {
        throw new ApiError(400, 'Product ID wajib diisi');
    }

    if (typeof productId !== 'number' || productId <= 0) {
        throw new ApiError(400, 'Product ID harus berupa angka positif');
    }

    if (!quantity) {
        throw new ApiError(400, 'Quantity wajib diisi');
    }

    if (typeof quantity !== 'number' || quantity < 1) {
        throw new ApiError(400, 'Quantity harus berupa angka minimal 1');
    }

    next();
};

const validateUpdateQuantity = (req, res, next) => {
    const { quantity } = req.body;

    if (!quantity) {
        throw new ApiError(400, 'Quantity wajib diisi');
    }

    if (typeof quantity !== 'number' || quantity < 1) {
        throw new ApiError(400, 'Quantity harus berupa angka minimal 1');
    }

    next();
};

module.exports = {
    validateCartItem,
    validateUpdateQuantity
};
