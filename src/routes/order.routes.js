const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateCheckout, validateCreateOrder, validateCancelOrder } = require('../validations/order.validation');
const { orderLimiter, orderMutationLimiter } = require('../middlewares/rateLimiter/order.limiter');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Manajemen pesanan/order
 */

/**
 * @swagger
 * /checkout:
 *   post:
 *     summary: Proses checkout dari cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_alamat
 *               - ongkos_kirim
 *             properties:
 *               id_alamat:
 *                 type: integer
 *                 example: 1
 *               kurir:
 *                 type: string
 *                 example: JNE
 *               ongkos_kirim:
 *                 type: integer
 *                 example: 15000
 *     responses:
 *       201:
 *         description: Checkout berhasil, order dibuat
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
 *                   example: Checkout berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_pesanan:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     total_harga:
 *                       type: integer
 *                     ongkos_kirim:
 *                       type: integer
 *       400:
 *         description: Cart kosong atau validasi gagal
 *       401:
 *         description: Unauthorized
 */
router.post('/checkout', orderMutationLimiter, authenticate, validateCheckout, orderController.checkout);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Buat order baru (direct checkout tanpa cart)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - id_alamat
 *               - ongkos_kirim
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_produk:
 *                       type: integer
 *                       example: 1
 *                     jumlah:
 *                       type: integer
 *                       example: 2
 *               id_alamat:
 *                 type: integer
 *                 example: 1
 *               kurir:
 *                 type: string
 *                 example: JNE
 *               ongkos_kirim:
 *                 type: integer
 *                 example: 15000
 *     responses:
 *       201:
 *         description: Order berhasil dibuat
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
 *                   example: Order berhasil dibuat
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_pesanan:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     total_harga:
 *                       type: integer
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Unauthorized
 */
router.post('/orders', orderMutationLimiter, authenticate, validateCreateOrder, orderController.createOrder);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Ambil daftar order milik buyer
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending_payment, processing, shipped, completed, cancelled]
 *         description: Filter berdasarkan status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar order
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
 *                   example: Daftar order berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     orders:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id_pesanan:
 *                             type: integer
 *                           status:
 *                             type: string
 *                           total_harga:
 *                             type: integer
 *                           ongkos_kirim:
 *                             type: integer
 *                           kurir:
 *                             type: string
 *                           dibuat_pada:
 *                             type: string
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 */
router.get('/orders', orderLimiter, authenticate, orderController.getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Detail order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID order
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail order
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
 *                   example: Detail order berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_pesanan:
 *                       type: integer
 *                     status:
 *                       type: string
 *                     total_harga:
 *                       type: integer
 *                     ongkos_kirim:
 *                       type: integer
 *                     kurir:
 *                       type: string
 *                     kode_resi:
 *                       type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id_produk:
 *                             type: integer
 *                           nama_produk:
 *                             type: string
 *                           jumlah:
 *                             type: integer
 *                           harga:
 *                             type: integer
 *                           subtotal:
 *                             type: integer
 *                     alamat:
 *                       type: object
 *                       properties:
 *                         nama_penerima:
 *                           type: string
 *                         alamat_lengkap:
 *                           type: string
 *                         nomor_telepon:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order tidak ditemukan
 */
router.get('/orders/:id', orderLimiter, authenticate, orderController.getOrderById);

/**
 * @swagger
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Batalkan order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID order
 *     responses:
 *       200:
 *         description: Order berhasil dibatalkan
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
 *                   example: Order berhasil dibatalkan
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_pesanan:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       example: cancelled
 *       400:
 *         description: Order tidak bisa dibatalkan
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order tidak ditemukan
 */
router.patch('/orders/:id/cancel', orderMutationLimiter, authenticate, validateCancelOrder, orderController.cancelOrder);

module.exports = router;
