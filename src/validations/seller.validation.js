const Joi = require('joi');

const createProfile = Joi.object({
  nama_usaha: Joi.string().required().messages({
    'string.empty': 'Nama usaha tidak boleh kosong',
    'any.required': 'Nama usaha wajib diisi',
  }),
  url_dokumen_legalitas: Joi.string().optional(),
  foto_profil: Joi.string().optional(),
  alamat: Joi.string().required().messages({
    'string.empty': 'Alamat usaha tidak boleh kosong',
    'any.required': 'Alamat usaha wajib diisi',
  }),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
});

const updateProfile = Joi.object({
  nama_usaha: Joi.string().optional(),
  url_dokumen_legalitas: Joi.string().optional(),
  foto_profil: Joi.string().optional(),
  alamat: Joi.string().optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
});

const kategoriEnum = [
  'teh', 'kopi', 'kerajinan_tangan', 'makanan_ringan', 'pakaian_batik',
  'furniture_bambu', 'produk_olahan_susu', 'madu', 'keripik', 'dodol',
  'anyaman', 'tas_rajut', 'sepatu_kulit', 'aksesoris', 'tanaman_hias',
  'pupuk_organik', 'lainnya',
];

const createProduct = Joi.object({
  nama: Joi.string().required().messages({
    'string.empty': 'Nama produk tidak boleh kosong',
    'any.required': 'Nama produk wajib diisi',
  }),
  deskripsi: Joi.string().allow('', null).optional(),
  harga: Joi.number().integer().min(0).max(2147483647).required().messages({
    'number.base': 'Harga harus berupa angka',
    'number.min': 'Harga tidak boleh negatif',
    'number.max': 'Harga terlalu besar melebihi kapasitas sistem',
    'any.required': 'Harga wajib diisi',
  }),
  stok: Joi.number().integer().min(0).max(2147483647).required().messages({
    'number.base': 'Stok harus berupa angka',
    'number.min': 'Stok tidak boleh negatif',
    'number.max': 'Stok terlalu besar melebihi kapasitas sistem',
    'any.required': 'Stok wajib diisi',
  }),
  url_gambar: Joi.string().allow('', null).optional(),
  kategori: Joi.string().valid(...kategoriEnum).required().messages({
    'any.only': 'Kategori produk tidak valid',
    'any.required': 'Kategori produk wajib diisi',
  }),
  berat_gram: Joi.number().integer().min(1).max(2147483647).required().messages({
    'number.base': 'Berat gram harus berupa angka',
    'number.min': 'Berat gram minimal 1 gram',
    'number.max': 'Berat gram terlalu besar',
    'any.required': 'Berat gram wajib diisi',
  }),
  kapasitas_produksi: Joi.string().allow('', null).optional(),
  sertifikasi: Joi.string().allow('', null).optional(),
});

const updateProduct = Joi.object({
  nama: Joi.string().optional(),
  deskripsi: Joi.string().allow('', null).optional(),
  harga: Joi.number().integer().min(0).max(2147483647).optional(),
  stok: Joi.number().integer().min(0).max(2147483647).optional(),
  url_gambar: Joi.string().allow('', null).optional(),
  kategori: Joi.string().valid(...kategoriEnum).optional(),
  berat_gram: Joi.number().integer().min(1).max(2147483647).optional(),
  kapasitas_produksi: Joi.string().allow('', null).optional(),
  sertifikasi: Joi.string().allow('', null).optional(),
});

const updateOrderStatus = Joi.object({
  status: Joi.string().valid('processing', 'shipped', 'completed', 'cancelled').required().messages({
    'any.only': 'Status pesanan tidak valid (harus processing, shipped, completed, atau cancelled)',
    'any.required': 'Status pesanan wajib diisi',
  }),
  kode_resi: Joi.string().allow('', null).optional(),
  kurir: Joi.string().allow('', null).optional(),
});

// === Validasi (public supplier routes) ===
const ApiError = require('../utils/apiError');

const validateSupplierId = (req, res, next) => {
  const id = parseInt(req.params.id);

  // Mencegah ID lebih besar dari limit Int32 MySQL (2147483647) agar Prisma tidak 500
  if (isNaN(id) || id <= 0 || id > 2147483647) {
    throw new ApiError(400, 'ID tidak valid, harus berupa angka positif dengan ukuran normal');
  }

  next();
};

module.exports = {
  createProfile,
  updateProfile,
  createProduct,
  updateProduct,
  updateOrderStatus,
  validateSupplierId,
};