const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/seller.controller');
const { validateSupplierId } = require('../validations/seller.validation');
const { sellerLimiter } = require('../middlewares/rateLimiter/seller.limiter');

/**
 * @swagger
 * tags:
 *   name: Sellers
 *   description: Manajemen profil UMKM/Supplier
 */

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Detail UMKM/supplier
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Detail supplier berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_umkm:
 *                       type: integer
 *                     nama_usaha:
 *                       type: string
 *                     alamat:
 *                       type: string
 *                     status_verifikasi:
 *                       type: string
 *                       enum: [pending, under_review, approved, rejected]
 *                     diajukan_pada:
 *                       type: string
 *                       format: date-time
 *                     diverifikasi_pada:
 *                       type: string
 *                       format: date-time
 *                     pemilik:
 *                       type: object
 *                       properties:
 *                         nama:
 *                           type: string
 *                         email:
 *                           type: string
 *                         nomor_telepon:
 *                           type: string
 *       404:
 *         description: Supplier tidak ditemukan
 */
router.get('/suppliers/:id', sellerLimiter, validateSupplierId, sellerController.getSupplierById);

/**
 * @swagger
 * /suppliers/{id}/location:
 *   get:
 *     summary: Ambil lokasi workshop supplier
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Lokasi supplier berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_umkm:
 *                       type: integer
 *                     nama_usaha:
 *                       type: string
 *                     alamat:
 *                       type: string
 *                     latitude:
 *                       type: number
 *                       format: double
 *                       example: -6.914744
 *                     longitude:
 *                       type: number
 *                       format: double
 *                       example: 107.609810
 *       404:
 *         description: Supplier tidak ditemukan
 */
router.get('/suppliers/:id/location', sellerLimiter, validateSupplierId, sellerController.getSupplierLocation);

/**
 * @swagger
 * /products/{id}/supplier:
 *   get:
 *     summary: Ambil supplier pemilik produk
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Supplier pemilik produk berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_umkm:
 *                       type: integer
 *                     nama_usaha:
 *                       type: string
 *                     alamat:
 *                       type: string
 *                     status_verifikasi:
 *                       type: string
 *                     produk:
 *                       type: object
 *                       properties:
 *                         id_produk:
 *                           type: integer
 *                         nama:
 *                           type: string
 *       404:
 *         description: Produk tidak ditemukan
 */
router.get('/products/:id/supplier', sellerLimiter, validateSupplierId, sellerController.getSupplierByProduct);

module.exports = router;
