const prisma = require('../config/database');

const create = (data) => prisma.alamat_buyer.create({ data });

const findById = (id_alamat) =>
  prisma.alamat_buyer.findUnique({ where: { id_alamat } });

const findAllByPenggunaId = (id_pengguna) =>
  prisma.alamat_buyer.findMany({ where: { id_pengguna } });

const update = (id_alamat, data) =>
  prisma.alamat_buyer.update({ where: { id_alamat }, data });

const remove = (id_alamat) =>
  prisma.alamat_buyer.delete({ where: { id_alamat } });

module.exports = { create, findById, findAllByPenggunaId, update, remove };
