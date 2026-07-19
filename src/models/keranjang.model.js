const prisma = require('../config/database');

const create = (data) => prisma.keranjang.create({ data });

const findById = (id_keranjang) =>
  prisma.keranjang.findUnique({ where: { id_keranjang } });

const findByPenggunaId = (id_pengguna) =>
  prisma.keranjang.findUnique({ where: { id_pengguna } });

module.exports = { create, findById, findByPenggunaId };
