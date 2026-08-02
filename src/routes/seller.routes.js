const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const upload = require('../middlewares/upload.middleware');
const {
  createProfile,
  updateProfile,
  createProduct,
  updateProduct,
  updateOrderStatus,
  validateSupplierId,
} = require('../validations/seller.validation');
const { sellerLimiter, sellerMutationLimiter } = require('../middlewares/rateLimiter/seller.limiter');

/**
 * @swagger
 * tags:
 *   - name: Seller
 *     description: Manajemen toko UMKM, produk seller, pesanan masuk, dan dashboard KPI
 *   - name: Sellers
 *     description: Informasi publik UMKM/Supplier (tanpa login)
 */

// =====================================================
// === ROUTES PUBLIK (tanpa auth) ===
// =====================================================

/**
 * @swagger
 * /api/v1/seller/suppliers/{id}:
 *   get:
 *     summary: Detail UMKM/supplier (publik)
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID UMKM
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail supplier
 *       404:
 *         description: Supplier tidak ditemukan
 */
router.get('/suppliers/:id', sellerLimiter, validateSupplierId, sellerController.getSupplierById);

/**
 * @swagger
 * /api/v1/seller/suppliers/{id}/location:
 *   get:
 *     summary: Ambil lokasi workshop supplier (publik)
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID UMKM
 *     responses:
 *       200:
 *         description: Berhasil mengambil lokasi supplier
 *       404:
 *         description: Supplier tidak ditemukan
 */
router.get('/suppliers/:id/location', sellerLimiter, validateSupplierId, sellerController.getSupplierLocation);

/**
 * @swagger
 * /api/v1/seller/products/{id}/supplier:
 *   get:
 *     summary: Ambil supplier pemilik produk (publik)
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Produk
 *     responses:
 *       200:
 *         description: Berhasil mengambil supplier pemilik produk
 *       404:
 *         description: Produk tidak ditemukan
 */
router.get('/products/:id/supplier', sellerLimiter, validateSupplierId, sellerController.getSupplierByProduct);

// =====================================================
// === ROUTES PRIVAT KITA (perlu login sebagai seller) ===
// =====================================================

router.use(authenticate, authorize('seller'));

/**
 * @swagger
 * /api/v1/seller/profile:
 *   post:
 *     summary: Ajukan profil UMKM (beserta dokumen legalitas)
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [nama_usaha, dokumen_legalitas, alamat]
 *             properties:
 *               nama_usaha:
 *                 type: string
 *               dokumen_legalitas:
 *                 type: string
 *                 format: binary
 *                 description: File PDF dokumen legalitas
 *               foto_profil:
 *                 type: string
 *                 format: binary
 *                 description: File gambar foto profil UMKM
 *               alamat:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       201:
 *         description: Profil berhasil diajukan
 */
router.post(
  '/profile',
  sellerMutationLimiter,
  upload.fields([{ name: 'foto_profil', maxCount: 1 }, { name: 'dokumen_legalitas', maxCount: 1 }]),
  validate(createProfile),
  sellerController.createProfile
);

/**
 * @swagger
 * /api/v1/seller/profile:
 *   get:
 *     summary: Lihat profil toko UMKM sendiri
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil berhasil diambil
 */
router.get('/profile', sellerLimiter, sellerController.getProfile);

/**
 * @swagger
 * /api/v1/seller/profile:
 *   put:
 *     summary: Perbarui data atau dokumen profil UMKM
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama_usaha:
 *                 type: string
 *               dokumen_legalitas:
 *                 type: string
 *                 format: binary
 *               foto_profil:
 *                 type: string
 *                 format: binary
 *               alamat:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 */
router.put(
  '/profile',
  sellerMutationLimiter,
  upload.fields([{ name: 'foto_profil', maxCount: 1 }, { name: 'dokumen_legalitas', maxCount: 1 }]),
  validate(updateProfile),
  sellerController.updateProfile
);

/**
 * @swagger
 * /api/v1/seller/products:
 *   post:
 *     summary: Tambah produk baru ke katalog toko
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [nama, harga, stok, kategori, berat_gram]
 *             properties:
 *               nama:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               harga:
 *                 type: number
 *               stok:
 *                 type: number
 *               gambar:
 *                 type: string
 *                 format: binary
 *                 description: Foto produk
 *               kategori:
 *                 type: string
 *                 enum: [teh, kopi, kerajinan_tangan, makanan_ringan, pakaian_batik, furniture_bambu, produk_olahan_susu, madu, keripik, dodol, anyaman, tas_rajut, sepatu_kulit, aksesoris, tanaman_hias, pupuk_organik, lainnya]
 *               berat_gram:
 *                 type: number
 *               kapasitas_produksi:
 *                 type: string
 *               sertifikasi:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produk berhasil dibuat
 */
router.post('/products', sellerMutationLimiter, upload.single('gambar'), validate(createProduct), sellerController.createProduct);

/**
 * @swagger
 * /api/v1/seller/products:
 *   get:
 *     summary: Lihat daftar produk milik toko sendiri
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar produk berhasil diambil
 */
router.get('/products', sellerLimiter, sellerController.getProducts);

/**
 * @swagger
 * /api/v1/seller/products/{id}:
 *   get:
 *     summary: Detail produk toko sendiri
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail produk berhasil diambil
 */
router.get('/products/:id', sellerLimiter, sellerController.getProductById);

/**
 * @swagger
 * /api/v1/seller/products/{id}:
 *   put:
 *     summary: Ubah detail produk toko
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               harga:
 *                 type: number
 *               stok:
 *                 type: number
 *               gambar:
 *                 type: string
 *                 format: binary
 *                 description: Foto produk
 *               kategori:
 *                 type: string
 *                 enum: [teh, kopi, kerajinan_tangan, makanan_ringan, pakaian_batik, furniture_bambu, produk_olahan_susu, madu, keripik, dodol, anyaman, tas_rajut, sepatu_kulit, aksesoris, tanaman_hias, pupuk_organik, lainnya]
 *               berat_gram:
 *                 type: number
 *               kapasitas_produksi:
 *                 type: string
 *               sertifikasi:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produk berhasil diperbarui
 */
router.put('/products/:id', sellerMutationLimiter, upload.single('gambar'), validate(updateProduct), sellerController.updateProduct);

/**
 * @swagger
 * /api/v1/seller/products/{id}:
 *   delete:
 *     summary: Hapus produk dari katalog toko
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 */
router.delete('/products/:id', sellerMutationLimiter, sellerController.deleteProduct);

/**
 * @swagger
 * /api/v1/seller/orders:
 *   get:
 *     summary: Lihat daftar pesanan sampel masuk ke toko
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daftar pesanan masuk berhasil diambil
 */
router.get('/orders', sellerLimiter, sellerController.getOrders);

/**
 * @swagger
 * /api/v1/seller/orders/{id}:
 *   get:
 *     summary: Lihat detail pesanan sampel masuk beserta alamat pengiriman
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail pesanan masuk berhasil diambil
 */
router.get('/orders/:id', sellerLimiter, sellerController.getOrderById);

/**
 * @swagger
 * /api/v1/seller/orders/{id}/status:
 *   patch:
 *     summary: Ubah status pesanan (misal dari processing ke shipped dengan melampirkan resi)
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [processing, shipped, completed, cancelled]
 *               kode_resi:
 *                 type: string
 *               kurir:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status pesanan berhasil diperbarui
 */
router.patch('/orders/:id/status', sellerMutationLimiter, validate(updateOrderStatus), sellerController.updateOrderStatus);

/**
 * @swagger
 * /api/v1/seller/dashboard:
 *   get:
 *     summary: Ambil data statistik untuk dasbor 3 KPI Card toko
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistik dasbor toko berhasil diambil
 */
router.get('/dashboard', sellerLimiter, sellerController.getDashboardStats);

module.exports = router;