const prisma = require('../config/database');

const create = (data) => prisma.keranjang.create({ data });

const findByPenggunaId = (id_pengguna) =>
  prisma.keranjang.findUnique({ where: { id_pengguna } });

const findById = (id_keranjang) =>
  prisma.keranjang.findUnique({ where: { id_keranjang } });

module.exports = { create, findByPenggunaId, findById };