const prisma = require('../config/database');

const create = (data) => prisma.item_pesanan.create({ data });

const createMany = (data) => prisma.item_pesanan.createMany({ data });

const findAllByPesananId = (id_pesanan) =>
  prisma.item_pesanan.findMany({ where: { id_pesanan } });

module.exports = { create, createMany, findAllByPesananId };
