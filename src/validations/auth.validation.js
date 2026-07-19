const Joi = require('joi');

const registerBuyer = Joi.object({
  nama: Joi.string().required(),
  email: Joi.string().email().required(),
  kata_sandi: Joi.string().min(8).required(),
  kode_negara: Joi.string().pattern(/^\+\d{1,4}$/).message('Kode negara harus diawali + dan angka (contoh: +62)').optional(),
  nomor_telepon: Joi.string().pattern(/^[1-9]\d{6,14}$/).message('Nomor telepon harus diawali angka bukan 0 (contoh: 812...)').optional(),
}).and('kode_negara', 'nomor_telepon');

const registerSeller = Joi.object({
  nama: Joi.string().required(),
  email: Joi.string().email().required(),
  kata_sandi: Joi.string().min(8).required(),
  kode_negara: Joi.string().pattern(/^\+\d{1,4}$/).message('Kode negara harus diawali + dan angka (contoh: +62)').optional(),
  nomor_telepon: Joi.string().pattern(/^[1-9]\d{6,14}$/).message('Nomor telepon harus diawali angka bukan 0 (contoh: 812...)').optional(),
}).and('kode_negara', 'nomor_telepon');

const login = Joi.object({
  email: Joi.string().email().required(),
  kata_sandi: Joi.string().required(),
});

module.exports = {
  registerBuyer,
  registerSeller,
  login,
};