const prisma = require('../config/database');
const CartModel = require('../models/cart.model');
const ProdukModel = require('../models/produk.model');
const ApiError = require('../utils/ApiError');

const checkoutFromCart = async (userId, { id_alamat, kurir, ongkos_kirim }) => {
  const cartItems = await CartModel.findByUserId(userId);
  
  if (!cartItems || cartItems.length === 0) {
    throw new ApiError(400, 'Cart kosong, tidak bisa checkout');
  }

  const productsByUmkm = {};
  for (const item of cartItems) {
    const product = await prisma.produk.findUnique({
      where: { id_produk: item.productId },
      include: { profil_umkm: true }
    });

    if (!product) {
      throw new ApiError(404, `Produk dengan ID ${item.productId} tidak ditemukan`);
    }

    if (product.stok < item.quantity) {
      throw new ApiError(400, `Stok ${product.nama} tidak mencukupi`);
    }

    const umkmId = product.id_umkm;
    if (!productsByUmkm[umkmId]) {
      productsByUmkm[umkmId] = [];
    }
    productsByUmkm[umkmId].push({
      product,
      quantity: item.quantity
    });
  }

  const umkmIds = Object.keys(productsByUmkm);
  if (umkmIds.length > 1) {
    throw new ApiError(400, 'Cart mengandung produk dari berbagai seller. Silakan checkout per seller.');
  }

  const alamat = await prisma.alamat_Buyer.findUnique({
    where: { id_alamat }
  });

  if (!alamat) {
    throw new ApiError(404, 'Alamat tidak ditemukan');
  }

  if (alamat.id_pengguna !== userId) {
    throw new ApiError(403, 'Alamat bukan milik user ini');
  }

  let total_harga = 0;
  const orderItems = [];

  for (const item of cartItems) {
    const product = await prisma.produk.findUnique({
      where: { id_produk: item.productId }
    });
    const subtotal = product.harga * item.quantity;
    total_harga += subtotal;
    orderItems.push({
      id_produk: item.productId,
      jumlah: item.quantity,
      harga: product.harga
    });
  }

  const order = await prisma.pesanan.create({
    data: {
      id_pengguna: userId,
      id_alamat,
      status: 'pending_payment',
      total_harga,
      ongkos_kirim,
      kurir: kurir || null,
      item_pesanan: {
        create: orderItems
      }
    },
    include: {
      item_pesanan: true
    }
  });

  for (const item of orderItems) {
    await prisma.produk.update({
      where: { id_produk: item.id_produk },
      data: {
        stok: {
          decrement: item.jumlah
        }
      }
    });
  }

  await CartModel.deleteByUserId(userId);

  return {
    id_pesanan: order.id_pesanan,
    status: order.status,
    total_harga: order.total_harga,
    ongkos_kirim: order.ongkos_kirim,
    kurir: order.kurir,
    dibuat_pada: order.dibuat_pada
  };
};

const createDirectOrder = async (userId, { items, id_alamat, kurir, ongkos_kirim }) => {
  const productsByUmkm = {};

  for (const item of items) {
    const product = await prisma.produk.findUnique({
      where: { id_produk: item.id_produk },
      include: { profil_umkm: true }
    });

    if (!product) {
      throw new ApiError(404, `Produk dengan ID ${item.id_produk} tidak ditemukan`);
    }

    if (product.stok < item.jumlah) {
      throw new ApiError(400, `Stok ${product.nama} tidak mencukupi`);
    }

    const umkmId = product.id_umkm;
    if (!productsByUmkm[umkmId]) {
      productsByUmkm[umkmId] = [];
    }
    productsByUmkm[umkmId].push({
      product,
      quantity: item.jumlah
    });
  }

  const umkmIds = Object.keys(productsByUmkm);
  if (umkmIds.length > 1) {
    throw new ApiError(400, 'Order mengandung produk dari berbagai seller. Silakan order per seller.');
  }

  const alamat = await prisma.alamat_Buyer.findUnique({
    where: { id_alamat }
  });

  if (!alamat) {
    throw new ApiError(404, 'Alamat tidak ditemukan');
  }

  if (alamat.id_pengguna !== userId) {
    throw new ApiError(403, 'Alamat bukan milik user ini');
  }

  let total_harga = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await prisma.produk.findUnique({
      where: { id_produk: item.id_produk }
    });
    const subtotal = product.harga * item.jumlah;
    total_harga += subtotal;
    orderItems.push({
      id_produk: item.id_produk,
      jumlah: item.jumlah,
      harga: product.harga
    });
  }

  const order = await prisma.pesanan.create({
    data: {
      id_pengguna: userId,
      id_alamat,
      status: 'pending_payment',
      total_harga,
      ongkos_kirim,
      kurir: kurir || null,
      item_pesanan: {
        create: orderItems
      }
    },
    include: {
      item_pesanan: true
    }
  });

  for (const item of orderItems) {
    await prisma.produk.update({
      where: { id_produk: item.id_produk },
      data: {
        stok: {
          decrement: item.jumlah
        }
      }
    });
  }

  return {
    id_pesanan: order.id_pesanan,
    status: order.status,
    total_harga: order.total_harga,
    ongkos_kirim: order.ongkos_kirim,
    kurir: order.kurir,
    dibuat_pada: order.dibuat_pada
  };
};

const getOrders = async (userId, { status, page, limit }) => {
  const offset = (page - 1) * limit;
  const where = { id_pengguna: userId };

  if (status) {
    where.status = status;
  }

  const [orders, total] = await Promise.all([
    prisma.pesanan.findMany({
      where,
      include: {
        item_pesanan: {
          include: {
            produk: {
              select: {
                nama: true
              }
            }
          }
        }
      },
      orderBy: {
        dibuat_pada: 'desc'
      },
      take: limit,
      skip: offset
    }),
    prisma.pesanan.count({ where })
  ]);

  const formattedOrders = orders.map(order => ({
    id_pesanan: order.id_pesanan,
    status: order.status,
    total_harga: order.total_harga,
    ongkos_kirim: order.ongkos_kirim,
    kurir: order.kurir,
    dibuat_pada: order.dibuat_pada,
    jumlah_item: order.item_pesanan.length
  }));

  return {
    orders: formattedOrders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getOrderById = async (userId, orderId) => {
  const order = await prisma.pesanan.findUnique({
    where: { id_pesanan: orderId },
    include: {
      item_pesanan: {
        include: {
          produk: {
            select: {
              nama: true,
              url_gambar: true
            }
          }
        }
      },
      alamat_buyer: true
    }
  });

  if (!order) {
    throw new ApiError(404, 'Order tidak ditemukan');
  }

  if (order.id_pengguna !== userId) {
    throw new ApiError(403, 'Tidak memiliki akses ke order ini');
  }

  const items = order.item_pesanan.map(item => ({
    id_produk: item.id_produk,
    nama_produk: item.produk.nama,
    url_gambar: item.produk.url_gambar,
    jumlah: item.jumlah,
    harga: item.harga,
    subtotal: item.harga * item.jumlah
  }));

  return {
    id_pesanan: order.id_pesanan,
    status: order.status,
    total_harga: order.total_harga,
    ongkos_kirim: order.ongkos_kirim,
    kurir: order.kurir,
    kode_resi: order.kode_resi,
    dibuat_pada: order.dibuat_pada,
    diperbarui_pada: order.diperbarui_pada,
    items,
    alamat: {
      nama_penerima: order.alamat_buyer.nama_penerima,
      alamat_lengkap: order.alamat_buyer.alamat_lengkap,
      nomor_telepon: order.alamat_buyer.nomor_telepon
    }
  };
};

const cancelOrder = async (userId, orderId) => {
  const order = await prisma.pesanan.findUnique({
    where: { id_pesanan: orderId },
    include: {
      item_pesanan: true
    }
  });

  if (!order) {
    throw new ApiError(404, 'Order tidak ditemukan');
  }

  if (order.id_pengguna !== userId) {
    throw new ApiError(403, 'Tidak memiliki akses ke order ini');
  }

  if (order.status !== 'pending_payment') {
    throw new ApiError(400, 'Hanya order dengan status pending_payment yang bisa dibatalkan');
  }

  const updatedOrder = await prisma.pesanan.update({
    where: { id_pesanan: orderId },
    data: {
      status: 'cancelled'
    }
  });

  for (const item of order.item_pesanan) {
    await prisma.produk.update({
      where: { id_produk: item.id_produk },
      data: {
        stok: {
          increment: item.jumlah
        }
      }
    });
  }

  return {
    id_pesanan: updatedOrder.id_pesanan,
    status: updatedOrder.status
  };
};

const getOrderStatus = async (userId, orderId) => {
  const order = await prisma.pesanan.findUnique({
    where: { id_pesanan: orderId },
    include: {
      pembayaran: {
        select: {
          status: true
        }
      }
    }
  });

  if (!order) {
    throw new ApiError(404, 'Order tidak ditemukan');
  }

  if (order.id_pengguna !== userId) {
    throw new ApiError(403, 'Tidak memiliki akses ke order ini');
  }

  return {
    id_pesanan: order.id_pesanan,
    status: order.status,
    diperbarui_pada: order.diperbarui_pada,
    kode_resi: order.kode_resi,
    payment_status: order.pembayaran ? order.pembayaran.status : null
  };
};

module.exports = {
  checkoutFromCart,
  createDirectOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  getOrderStatus
};
