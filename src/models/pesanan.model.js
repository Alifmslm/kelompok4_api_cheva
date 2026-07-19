const prisma = require('../config/database');

const create = (data) => prisma.pesanan.create({ data });

const findById = (id_pesanan) =>
  prisma.pesanan.findUnique({ where: { id_pesanan } });

const findAllByPenggunaId = (id_pengguna) =>
  prisma.pesanan.findMany({ where: { id_pengguna } });

const update = (id_pesanan, data) =>
  prisma.pesanan.update({ where: { id_pesanan }, data });

module.exports = { create, findById, findAllByPenggunaId, update };
