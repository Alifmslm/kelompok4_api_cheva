const prisma = require('../config/database');

const createProfile = (data) => prisma.profil_UMKM.create({ data });

const findProfileByUserId = (id_pengguna) =>
  prisma.profil_UMKM.findUnique({ where: { id_pengguna } });

const updateProfile = (id_umkm, data) =>
  prisma.profil_UMKM.update({ where: { id_umkm }, data });

const createProduct = (data) => prisma.produk.create({ data });

const findProductsByUmkmId = (id_umkm) =>
  prisma.produk.findMany({
    where: { id_umkm },
    orderBy: { dibuat_pada: 'desc' },
  });

const findProductById = (id_produk) =>
  prisma.produk.findUnique({ where: { id_produk } });

const updateProduct = (id_produk, data) =>
  prisma.produk.update({ where: { id_produk }, data });

const deleteProduct = (id_produk) =>
  prisma.produk.delete({ where: { id_produk } });

const findOrdersByUmkmId = (id_umkm, status) => {
  const where = {
    item_pesanan: {
      some: {
        produk: {
          id_umkm,
        },
      },
    },
  };
  if (status) {
    where.status = status;
  }
  return prisma.pesanan.findMany({
    where,
    include: {
      item_pesanan: {
        where: {
          produk: { id_umkm },
        },
        include: {
          produk: {
            select: {
              id_produk: true,
              nama: true,
              harga: true,
              url_gambar: true,
            },
          },
        },
      },
      alamat_buyer: true,
      pengguna: {
        select: {
          nama: true,
          email: true,
          nomor_telepon: true,
        },
      },
    },
    orderBy: { dibuat_pada: 'desc' },
  });
};

const findOrderByIdAndUmkm = (id_pesanan, id_umkm) =>
  prisma.pesanan.findFirst({
    where: {
      id_pesanan,
      item_pesanan: {
        some: {
          produk: { id_umkm },
        },
      },
    },
    include: {
      item_pesanan: {
        where: {
          produk: { id_umkm },
        },
        include: {
          produk: {
            select: {
              id_produk: true,
              nama: true,
              harga: true,
              url_gambar: true,
            },
          },
        },
      },
      alamat_buyer: true,
      pengguna: {
        select: {
          nama: true,
          email: true,
          nomor_telepon: true,
        },
      },
    },
  });

const updateOrderStatus = (id_pesanan, data) =>
  prisma.pesanan.update({ where: { id_pesanan }, data });

const getDashboardStats = async (id_umkm) => {
  const [activeProductsCount, inboundOrdersCount, ordersForRevenue] = await Promise.all([
    prisma.produk.count({
      where: {
        id_umkm,
        stok: { gt: 0 },
      },
    }),
    prisma.pesanan.count({
      where: {
        status: { in: ['pending_payment', 'processing'] },
        item_pesanan: {
          some: {
            produk: { id_umkm },
          },
        },
      },
    }),
    prisma.pesanan.findMany({
      where: {
        status: { in: ['processing', 'shipped', 'completed'] },
        item_pesanan: {
          some: {
            produk: { id_umkm },
          },
        },
      },
      include: {
        item_pesanan: {
          where: {
            produk: { id_umkm },
          },
        },
      },
    }),
  ]);

  const potentialRevenue = ordersForRevenue.reduce((total, order) => {
    const sellerSubtotal = order.item_pesanan.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
    return total + sellerSubtotal;
  }, 0);

  return {
    totalActiveProducts: activeProductsCount,
    totalInboundOrders: inboundOrdersCount,
    estimatedPotentialRevenue: potentialRevenue,
  };
};

module.exports = {
  createProfile,
  findProfileByUserId,
  updateProfile,
  createProduct,
  findProductsByUmkmId,
  findProductById,
  updateProduct,
  deleteProduct,
  findOrdersByUmkmId,
  findOrderByIdAndUmkm,
  updateOrderStatus,
  getDashboardStats,
};