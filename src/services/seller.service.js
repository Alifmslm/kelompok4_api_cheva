const SellerModel = require('../models/seller.model');
const ApiError = require('../utils/apiError');

const createProfile = async (userId, data) => {
  const existingProfile = await SellerModel.findProfileByUserId(userId);
  if (existingProfile) {
    throw new ApiError(400, 'Profil UMKM untuk akun ini sudah ada');
  }

  const newProfile = await SellerModel.createProfile({
    ...data,
    status_verifikasi: 'pending',
    id_pengguna: userId,
  });

  return newProfile;
};

const getProfile = async (userId) => {
  const profile = await SellerModel.findProfileByUserId(userId);
  if (!profile) {
    throw new ApiError(404, 'Profil UMKM tidak ditemukan. Silakan ajukan profil terlebih dahulu.');
  }
  return profile;
};

const updateProfile = async (userId, data) => {
  const profile = await getProfile(userId);
  const updated = await SellerModel.updateProfile(profile.id_umkm, data);
  return updated;
};

const createProduct = async (userId, data) => {
  const profile = await getProfile(userId);

  if (profile.status_verifikasi !== 'approved') {
    throw new ApiError(403, 'Hanya verified seller yang dapat menambahkan produk');
  }

  const newProduct = await SellerModel.createProduct({
    ...data,
    id_umkm: profile.id_umkm,
  });

  return newProduct;
};

const getSellerProducts = async (userId) => {
  const profile = await getProfile(userId);
  const products = await SellerModel.findProductsByUmkmId(profile.id_umkm);
  return products;
};

const getProductById = async (userId, productId) => {
  const profile = await getProfile(userId);
  const product = await SellerModel.findProductById(parseInt(productId));

  if (!product || product.id_umkm !== profile.id_umkm) {
    throw new ApiError(404, 'Produk tidak ditemukan atau bukan milik toko Anda');
  }

  return product;
};

const updateProduct = async (userId, productId, data) => {
  await getProductById(userId, productId);
  const updated = await SellerModel.updateProduct(parseInt(productId), data);
  return updated;
};

const deleteProduct = async (userId, productId) => {
  await getProductById(userId, productId);
  try {
    await SellerModel.deleteProduct(parseInt(productId));
    return { message: 'Produk berhasil dihapus' };
  } catch (error) {
    if (error.code === 'P2003') {
      const ApiError = require('../utils/apiError');
      throw new ApiError(400, 'Produk gagal dihapus karena masih ada di dalam pesanan atau keranjang pembeli. Tips: Ubah stok menjadi 0 alih-alih menghapusnya.');
    }
    throw error;
  }
};

const getInboundOrders = async (userId, query = {}) => {
  const profile = await getProfile(userId);
  const orders = await SellerModel.findOrdersByUmkmId(profile.id_umkm, query.status);
  return orders;
};

const getOrderById = async (userId, orderId) => {
  const profile = await getProfile(userId);
  const order = await SellerModel.findOrderByIdAndUmkm(parseInt(orderId), profile.id_umkm);

  if (!order) {
    throw new ApiError(404, 'Pesanan tidak ditemukan pada toko Anda');
  }

  return order;
};

const updateOrderStatus = async (userId, orderId, data) => {
  await getOrderById(userId, orderId);
  const updatedOrder = await SellerModel.updateOrderStatus(parseInt(orderId), data);
  return updatedOrder;
};

const getDashboardStats = async (userId) => {
  const profile = await getProfile(userId);
  const stats = await SellerModel.getDashboardStats(profile.id_umkm);
  return {
    umkm: {
      id_umkm: profile.id_umkm,
      nama_usaha: profile.nama_usaha,
      status_verifikasi: profile.status_verifikasi,
    },
    stats,
  };
};

// === Fungsi (public supplier info — tanpa auth) ===
const prisma = require('../config/database');

const getSupplierById = async (id) => {
  const supplier = await prisma.profil_UMKM.findUnique({
    where: { id_umkm: id },
    include: {
      pengguna: {
        select: {
          nama: true,
          email: true,
          nomor_telepon: true,
        },
      },
    },
  });

  if (!supplier) {
    throw new ApiError(404, 'Supplier tidak ditemukan');
  }

  return {
    id_umkm: supplier.id_umkm,
    nama_usaha: supplier.nama_usaha,
    alamat: supplier.alamat,
    status_verifikasi: supplier.status_verifikasi,
    diajukan_pada: supplier.diajukan_pada,
    diverifikasi_pada: supplier.diverifikasi_pada,
    pemilik: {
      nama: supplier.pengguna.nama,
      email: supplier.pengguna.email,
      nomor_telepon: supplier.pengguna.nomor_telepon,
    },
  };
};

const getSupplierLocation = async (id) => {
  const supplier = await prisma.profil_UMKM.findUnique({
    where: { id_umkm: id },
    select: {
      id_umkm: true,
      nama_usaha: true,
      alamat: true,
      latitude: true,
      longitude: true,
    },
  });

  if (!supplier) {
    throw new ApiError(404, 'Supplier tidak ditemukan');
  }

  return {
    id_umkm: supplier.id_umkm,
    nama_usaha: supplier.nama_usaha,
    alamat: supplier.alamat,
    latitude: supplier.latitude,
    longitude: supplier.longitude,
  };
};

const getSupplierByProduct = async (productId) => {
  const product = await prisma.produk.findUnique({
    where: { id_produk: productId },
    include: {
      profil_umkm: {
        select: {
          id_umkm: true,
          nama_usaha: true,
          alamat: true,
          status_verifikasi: true,
        },
      },
    },
  });

  if (!product) {
    throw new ApiError(404, 'Produk tidak ditemukan');
  }

  return {
    id_umkm: product.profil_umkm.id_umkm,
    nama_usaha: product.profil_umkm.nama_usaha,
    alamat: product.profil_umkm.alamat,
    status_verifikasi: product.profil_umkm.status_verifikasi,
    produk: {
      id_produk: product.id_produk,
      nama: product.nama,
    },
  };
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  createProduct,
  getSellerProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getInboundOrders,
  getOrderById,
  updateOrderStatus,
  getDashboardStats,
  getSupplierById,
  getSupplierLocation,
  getSupplierByProduct,
};