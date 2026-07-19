const prisma = require('../config/database');

const create = (data) => prisma.pembayaran.create({ data });

const findById = (id_pembayaran) =>
  prisma.pembayaran.findUnique({ where: { id_pembayaran } });

const findByPesananId = (id_pesanan) =>
  prisma.pembayaran.findUnique({ where: { id_pesanan } });

const update = (id_pembayaran, data) =>
  prisma.pembayaran.update({ where: { id_pembayaran }, data });

module.exports = { create, findById, findByPesananId, update };
