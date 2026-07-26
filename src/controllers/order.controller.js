const orderService = require('../services/order.service');
const apiResponse = require('../utils/apiResponse');

const checkout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id_alamat, kurir, ongkos_kirim } = req.body;
    
    const order = await orderService.checkoutFromCart(userId, {
      id_alamat,
      kurir,
      ongkos_kirim
    });
    
    return apiResponse.success(res, 201, 'Checkout berhasil', order);
  } catch (error) {
    next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items, id_alamat, kurir, ongkos_kirim } = req.body;
    
    const order = await orderService.createDirectOrder(userId, {
      items,
      id_alamat,
      kurir,
      ongkos_kirim
    });
    
    return apiResponse.success(res, 201, 'Order berhasil dibuat', order);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    
    const result = await orderService.getOrders(userId, {
      status,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    return apiResponse.success(res, 200, 'Daftar order berhasil diambil', result);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.id);
    
    const order = await orderService.getOrderById(userId, orderId);
    
    return apiResponse.success(res, 200, 'Detail order berhasil diambil', order);
  } catch (error) {
    next(error);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orderId = parseInt(req.params.id);
    
    const order = await orderService.cancelOrder(userId, orderId);
    
    return apiResponse.success(res, 200, 'Order berhasil dibatalkan', order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkout,
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder
};
