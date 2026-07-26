const prisma = require('../config/database');

const findById = async (id_produk) => {
  const product = await prisma.produk.findUnique({
    where: { id_produk }
  });

  if (!product) return null;

  return {
    id: product.id_produk,
    name: product.nama_produk,
    price: product.harga,
    stock: product.stok
  };
};

module.exports = {
  findById
};
