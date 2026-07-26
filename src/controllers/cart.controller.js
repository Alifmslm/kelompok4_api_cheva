const cartService = require('../services/cart.service');
const apiResponse = require('../utils/apiResponse');

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCart(userId);
    return apiResponse.success(res, 200, 'Cart berhasil diambil', cart);
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    const cartItem = await cartService.addItem(userId, productId, quantity);
    return apiResponse.success(res, 201, 'Item berhasil ditambahkan ke cart', cartItem);
  } catch (error) {
    next(error);
  }
};

const updateQuantity = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const itemId = parseInt(req.params.id);
    const { quantity } = req.body;
    const cartItem = await cartService.updateQuantity(userId, itemId, quantity);
    return apiResponse.success(res, 200, 'Quantity berhasil diupdate', cartItem);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const itemId = parseInt(req.params.id);
    await cartService.deleteItem(userId, itemId);
    return apiResponse.success(res, 200, 'Item berhasil dihapus dari cart', null);
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await cartService.clearCart(userId);
    return apiResponse.success(res, 200, 'Cart berhasil dikosongkan', null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItem,
  updateQuantity,
  deleteItem,
  clearCart
};
