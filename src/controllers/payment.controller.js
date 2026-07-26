const paymentService = require('../services/payment.service');
const apiResponse = require('../utils/apiResponse');

const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    
    const result = await paymentService.getTransactions(userId, {
      status,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    return apiResponse.success(res, 200, 'Riwayat transaksi berhasil diambil', result);
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionId = parseInt(req.params.id);
    
    const transaction = await paymentService.getTransactionById(userId, transactionId);
    
    return apiResponse.success(res, 200, 'Detail transaksi berhasil diambil', transaction);
  } catch (error) {
    next(error);
  }
};

const getTransactionStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionId = parseInt(req.params.id);
    
    const status = await paymentService.getTransactionStatus(userId, transactionId);
    
    return apiResponse.success(res, 200, 'Status transaksi berhasil diambil', status);
  } catch (error) {
    next(error);
  }
};

const getTransactionTimeline = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionId = parseInt(req.params.id);
    
    const timeline = await paymentService.getTransactionTimeline(userId, transactionId);
    
    return apiResponse.success(res, 200, 'Timeline transaksi berhasil diambil', timeline);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getTransactionById,
  getTransactionStatus,
  getTransactionTimeline
};
