const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateTransactionId } = require('../validations/payment.validation');
const { paymentLimiter } = require('../middlewares/rateLimiter/payment.limiter');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Manajemen pembayaran dan transaksi
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Ambil riwayat transaksi buyer
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, paid, failed]
 *         description: Filter berdasarkan status pembayaran
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Jumlah data per halaman
 *     responses:
 *       200:
 *         description: Berhasil mengambil riwayat transaksi
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
 *                   example: Riwayat transaksi berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id_pembayaran:
 *                             type: integer
 *                           penyedia:
 *                             type: string
 *                             example: Midtrans
 *                           status:
 *                             type: string
 *                             enum: [pending, paid, failed]
 *                           jumlah:
 *                             type: integer
 *                           referensi_transaksi:
 *                             type: string
 *                           dibuat_pada:
 *                             type: string
 *                             format: date-time
 *                           id_pesanan:
 *                             type: integer
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
router.get('/transactions', paymentLimiter, authenticate, paymentController.getTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Detail transaksi
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pembayaran
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail transaksi
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
 *                   example: Detail transaksi berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_pembayaran:
 *                       type: integer
 *                     penyedia:
 *                       type: string
 *                     status:
 *                       type: string
 *                     jumlah:
 *                       type: integer
 *                     referensi_transaksi:
 *                       type: string
 *                     dibuat_pada:
 *                       type: string
 *                       format: date-time
 *                     pesanan:
 *                       type: object
 *                       properties:
 *                         id_pesanan:
 *                           type: integer
 *                         status:
 *                           type: string
 *                         total_harga:
 *                           type: integer
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.get('/transactions/:id', paymentLimiter, authenticate, validateTransactionId, paymentController.getTransactionById);

/**
 * @swagger
 * /transactions/{id}/status:
 *   get:
 *     summary: Ambil status terbaru transaksi
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pembayaran
 *     responses:
 *       200:
 *         description: Berhasil mengambil status transaksi
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
 *                   example: Status transaksi berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_pembayaran:
 *                       type: integer
 *                     status:
 *                       type: string
 *                       enum: [pending, paid, failed]
 *                     dibuat_pada:
 *                       type: string
 *                       format: date-time
 *                     referensi_transaksi:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.get('/transactions/:id/status', paymentLimiter, authenticate, validateTransactionId, paymentController.getTransactionStatus);

/**
 * @swagger
 * /transactions/{id}/timeline:
 *   get:
 *     summary: Riwayat tracking status pembayaran dan pesanan
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pembayaran
 *     responses:
 *       200:
 *         description: Berhasil mengambil timeline transaksi
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
 *                   example: Timeline transaksi berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_pembayaran:
 *                       type: integer
 *                     timeline:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           event:
 *                             type: string
 *                             example: Pembayaran dibuat
 *                           status:
 *                             type: string
 *                           timestamp:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.get('/transactions/:id/timeline', paymentLimiter, authenticate, validateTransactionId, paymentController.getTransactionTimeline);

module.exports = router;
