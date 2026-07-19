const prisma = require('../config/database');

const create = (data) => prisma.produk.create({ data });

const findById = (id_produk) =>
  prisma.produk.findUnique({ where: { id_produk } });

const findAllByUmkmId = (id_umkm) =>
  prisma.produk.findMany({ where: { id_umkm } });

const findAll = (filter = {}) => prisma.produk.findMany({ where: filter });

const update = (id_produk, data) =>
  prisma.produk.update({ where: { id_produk }, data });

const remove = (id_produk) =>
  prisma.produk.delete({ where: { id_produk } });

module.exports = { create, findById, findAllByUmkmId, findAll, update, remove };
