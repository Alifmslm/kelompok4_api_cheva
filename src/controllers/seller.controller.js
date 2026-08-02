const sellerService = require('../services/seller.service');
const apiResponse = require('../utils/apiResponse');
const { uploadImageToCloudinary } = require('../utils/cloudinary');

const createProfile = async (req, res, next) => {
  try {
    let profileData = { ...req.body };
    if (req.files) {
      if (req.files['foto_profil']) {
        profileData.foto_profil = await uploadImageToCloudinary(req.files['foto_profil'][0].buffer, 'localbiz_profiles');
      }
      if (req.files['dokumen_legalitas']) {
        profileData.url_dokumen_legalitas = await uploadImageToCloudinary(req.files['dokumen_legalitas'][0].buffer, 'localbiz_docs');
      }
    }
    const profile = await sellerService.createProfile(req.user.id_pengguna, profileData);
    return apiResponse.success(res, 201, 'Profil UMKM berhasil diajukan', profile);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const profile = await sellerService.getProfile(req.user.id_pengguna);
    return apiResponse.success(res, 200, 'Detail profil UMKM berhasil diambil', profile);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    let profileData = { ...req.body };
    if (req.files) {
      if (req.files['foto_profil']) {
        profileData.foto_profil = await uploadImageToCloudinary(req.files['foto_profil'][0].buffer, 'localbiz_profiles');
      }
      if (req.files['dokumen_legalitas']) {
        profileData.url_dokumen_legalitas = await uploadImageToCloudinary(req.files['dokumen_legalitas'][0].buffer, 'localbiz_docs');
      }
    }
    const profile = await sellerService.updateProfile(req.user.id_pengguna, profileData);
    return apiResponse.success(res, 200, 'Profil UMKM berhasil diperbarui', profile);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    let productData = { ...req.body };
    if (req.file) {
      const imageUrl = await uploadImageToCloudinary(req.file.buffer);
      productData.url_gambar = imageUrl;
    }
    const product = await sellerService.createProduct(req.user.id_pengguna, productData);
    return apiResponse.success(res, 201, 'Produk berhasil ditambahkan ke katalog', product);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await sellerService.getSellerProducts(req.user.id_pengguna);
    return apiResponse.success(res, 200, 'Daftar produk toko berhasil diambil', products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await sellerService.getProductById(req.user.id_pengguna, req.params.id);
    return apiResponse.success(res, 200, 'Detail produk berhasil diambil', product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let productData = { ...req.body };
    if (req.file) {
      const imageUrl = await uploadImageToCloudinary(req.file.buffer);
      productData.url_gambar = imageUrl;
    }
    const product = await sellerService.updateProduct(req.user.id_pengguna, req.params.id, productData);
    return apiResponse.success(res, 200, 'Produk berhasil diperbarui', product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const result = await sellerService.deleteProduct(req.user.id_pengguna, req.params.id);
    return apiResponse.success(res, 200, result.message, null);
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await sellerService.getInboundOrders(req.user.id_pengguna, req.query);
    return apiResponse.success(res, 200, 'Daftar pesanan masuk berhasil diambil', orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await sellerService.getOrderById(req.user.id_pengguna, req.params.id);
    return apiResponse.success(res, 200, 'Detail pesanan masuk berhasil diambil', order);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await sellerService.updateOrderStatus(req.user.id_pengguna, req.params.id, req.body);
    return apiResponse.success(res, 200, 'Status pesanan berhasil diperbarui', order);
  } catch (error) {
    next(error);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await sellerService.getDashboardStats(req.user.id_pengguna);
    return apiResponse.success(res, 200, 'Statistik dasbor toko berhasil diambil', stats);
  } catch (error) {
    next(error);
  }
};

// === Controller (public supplier info — tanpa auth) ===

const getSupplierById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const supplier = await sellerService.getSupplierById(id);
    return apiResponse.success(res, 200, 'Detail supplier berhasil diambil', supplier);
  } catch (error) {
    next(error);
  }
};

const getSupplierLocation = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const location = await sellerService.getSupplierLocation(id);
    return apiResponse.success(res, 200, 'Lokasi supplier berhasil diambil', location);
  } catch (error) {
    next(error);
  }
};

const getSupplierByProduct = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const supplier = await sellerService.getSupplierByProduct(productId);
    return apiResponse.success(res, 200, 'Supplier pemilik produk berhasil diambil', supplier);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getDashboardStats,
  getSupplierById,
  getSupplierLocation,
  getSupplierByProduct,
};