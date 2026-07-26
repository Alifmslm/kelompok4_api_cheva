const prisma = require('../config/database');
const KeranjangModel = require('./keranjang.model');
const ItemKeranjangModel = require('./item_keranjang.model');

const findByUserId = async (id_pengguna) => {
  let keranjang = await KeranjangModel.findByPenggunaId(id_pengguna);
  
  if (!keranjang) {
    keranjang = await KeranjangModel.create({ id_pengguna });
  }

  const items = await prisma.item_keranjang.findMany({
    where: { id_keranjang: keranjang.id_keranjang },
    include: {
      produk: {
        select: {
          nama_produk: true,
          harga: true,
          stok: true
        }
      }
    }
  });

  return items.map(item => ({
    id: item.id_item_keranjang,
    userId: id_pengguna,
    productId: item.id_produk,
    productName: item.produk.nama_produk,
    price: item.produk.harga,
    quantity: item.jumlah,
    stock: item.produk.stok
  }));
};

const findById = async (id_item_keranjang) => {
  const item = await prisma.item_keranjang.findUnique({
    where: { id_item_keranjang },
    include: {
      keranjang: true
    }
  });

  if (!item) return null;

  return {
    id: item.id_item_keranjang,
    userId: item.keranjang.id_pengguna,
    productId: item.id_produk,
    quantity: item.jumlah
  };
};

const findByUserAndProduct = async (id_pengguna, id_produk) => {
  let keranjang = await KeranjangModel.findByPenggunaId(id_pengguna);
  
  if (!keranjang) {
    keranjang = await KeranjangModel.create({ id_pengguna });
  }

  const item = await ItemKeranjangModel.findByKeranjangAndProduk(keranjang.id_keranjang, id_produk);

  if (!item) return null;

  return {
    id: item.id_item_keranjang,
    userId: id_pengguna,
    productId: item.id_produk,
    quantity: item.jumlah
  };
};

const create = async (id_pengguna, id_produk, jumlah) => {
  let keranjang = await KeranjangModel.findByPenggunaId(id_pengguna);
  
  if (!keranjang) {
    keranjang = await KeranjangModel.create({ id_pengguna });
  }

  const item = await ItemKeranjangModel.create({
    id_keranjang: keranjang.id_keranjang,
    id_produk,
    jumlah
  });

  return {
    id: item.id_item_keranjang,
    productId: item.id_produk,
    quantity: item.jumlah
  };
};

const updateQuantity = async (id_item_keranjang, jumlah) => {
  const item = await ItemKeranjangModel.update(id_item_keranjang, { jumlah });

  return {
    id: item.id_item_keranjang,
    quantity: item.jumlah
  };
};

const deleteById = async (id_item_keranjang) => {
  await ItemKeranjangModel.remove(id_item_keranjang);
};

const deleteByUserId = async (id_pengguna) => {
  const keranjang = await KeranjangModel.findByPenggunaId(id_pengguna);
  
  if (keranjang) {
    await prisma.item_keranjang.deleteMany({
      where: { id_keranjang: keranjang.id_keranjang }
    });
  }
};

module.exports = {
  findByUserId,
  findById,
  findByUserAndProduct,
  create,
  updateQuantity,
  deleteById,
  deleteByUserId
};
