const bcrypt = require('bcryptjs');
const penggunaModel = require('../models/pengguna.model');
const ApiError = require('../utils/apiError');
const { generateToken } = require('../utils/generateToken');

/**
 * Service untuk menangani registrasi pengguna dengan peran 'buyer'
 */
const registerBuyer = async (data) => {
  const existingUser = await penggunaModel.findByEmail(data.email);
  if (existingUser) {
    throw new ApiError(400, 'Email sudah terdaftar. Silakan gunakan email lain.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.kata_sandi, salt);

  const nomorTeleponLengkap = data.kode_negara && data.nomor_telepon 
    ? `${data.kode_negara}${data.nomor_telepon}` 
    : undefined;

  const newBuyer = await penggunaModel.create({
    nama: data.nama,
    email: data.email,
    kata_sandi: hashedPassword,
    nomor_telepon: nomorTeleponLengkap,
    peran: 'buyer',
  });

  // Hapus kata sandi dari response
  delete newBuyer.kata_sandi;
  return newBuyer;
};

/**
 * Service untuk menangani registrasi pengguna dengan peran 'seller'
 */
const registerSeller = async (data) => {
  const existingUser = await penggunaModel.findByEmail(data.email);
  if (existingUser) {
    throw new ApiError(400, 'Email sudah terdaftar. Silakan gunakan email lain.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.kata_sandi, salt);

  const nomorTeleponLengkap = data.kode_negara && data.nomor_telepon 
    ? `${data.kode_negara}${data.nomor_telepon}` 
    : undefined;

  const newSeller = await penggunaModel.create({
    nama: data.nama,
    email: data.email,
    kata_sandi: hashedPassword,
    nomor_telepon: nomorTeleponLengkap,
    peran: 'seller',
  });

  // Hapus kata sandi dari response
  delete newSeller.kata_sandi;
  return newSeller;
};

/**
 * Service untuk menangani login pengguna
 */
const login = async (email, password) => {
  const user = await penggunaModel.findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Email atau kata sandi salah.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.kata_sandi);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Email atau kata sandi salah.');
  }

  // Generate Token JWT
  const token = generateToken({ id_pengguna: user.id_pengguna, peran: user.peran });

  delete user.kata_sandi;

  return {
    user,
    token,
  };
};

module.exports = {
  registerBuyer,
  registerSeller,
  login,
};