const authService = require('../services/auth.service');
const apiResponse = require('../utils/apiResponse');

const registerBuyer = async (req, res, next) => {
  try {
    const data = await authService.registerBuyer(req.body);
    return apiResponse.success(res, 201, 'Registrasi buyer berhasil', data);
  } catch (error) {
    next(error);
  }
};

const registerSeller = async (req, res, next) => {
  try {
    const data = await authService.registerSeller(req.body);
    return apiResponse.success(res, 201, 'Registrasi seller berhasil', data);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, kata_sandi } = req.body;
    const data = await authService.login(email, kata_sandi);
    return apiResponse.success(res, 200, 'Login berhasil', data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerBuyer,
  registerSeller,
  login,
};