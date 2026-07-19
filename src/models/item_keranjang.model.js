const prisma = require('../config/database');

const create = (data) => prisma.item_keranjang.create({ data });

const findById = (id_item_keranjang) =>
  prisma.item_keranjang.findUnique({ where: { id_item_keranjang } });

const findAllByKeranjangId = (id_keranjang) =>
  prisma.item_keranjang.findMany({ where: { id_keranjang } });

const findByKeranjangAndProduk = (id_keranjang, id_produk) =>
  prisma.item_keranjang.findFirst({
    where: { id_keranjang, id_produk },
  });

const update = (id_item_keranjang, data) =>
  prisma.item_keranjang.update({ where: { id_item_keranjang }, data });

const remove = (id_item_keranjang) =>
  prisma.item_keranjang.delete({ where: { id_item_keranjang } });

module.exports = { create, findById, findAllByKeranjangId, findByKeranjangAndProduk, update, remove };
