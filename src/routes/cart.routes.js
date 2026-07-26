const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateCartItem, validateUpdateQuantity } = require('../validation/cart.validation');
const { cartLimiter, cartMutationLimiter } = require('../middlewares/rateLimiter/cart.limiter');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Manajemen keranjang belanja
 */

/**
 * @swagger
 * cart:
 *   get:
 *     summary: Ambil isi cart user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil isi cart
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
 *                   example: Cart berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           productId:
 *                             type: integer
 *                           productName:
 *                             type: string
 *                           price:
 *                             type: number
 *                           quantity:
 *                             type: integer
 *                           subtotal:
 *                             type: number
 *                     total:
 *                       type: number
 *       401:
 *         description: Unauthorized
 */
router.get('cart', cartLimiter, authenticate, cartController.getCart);

/**
 * @swagger
 * cart/items:
 *   post:
 *     summary: Tambah item ke cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       201:
 *         description: Item berhasil ditambahkan ke cart
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
 *                   example: Item berhasil ditambahkan ke cart
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Produk tidak ditemukan
 */
router.post('cart/items', cartMutationLimiter, authenticate, validateCartItem, cartController.addItem);

/**
 * @swagger
 * cart/items/{id}:
 *   patch:
 *     summary: Ubah quantity item di cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID cart item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *     responses:
 *       200:
 *         description: Quantity berhasil diupdate
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
 *                   example: Quantity berhasil diupdate
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item tidak ditemukan
 */
router.patch('cart/items/:id', cartMutationLimiter, authenticate, validateUpdateQuantity, cartController.updateQuantity);

/**
 * @swagger
 * cart/items/{id}:
 *   delete:
 *     summary: Hapus item dari cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID cart item
 *     responses:
 *       200:
 *         description: Item berhasil dihapus dari cart
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
 *                   example: Item berhasil dihapus dari cart
 *                 data:
 *                   type: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Item tidak ditemukan
 */
router.delete('cart/items/:id', cartMutationLimiter, authenticate, cartController.deleteItem);

/**
 * @swagger
 * cart:
 *   delete:
 *     summary: Kosongkan cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart berhasil dikosongkan
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
 *                   example: Cart berhasil dikosongkan
 *                 data:
 *                   type: null
 *       401:
 *         description: Unauthorized
 */
router.delete('cart', cartMutationLimiter, authenticate, cartController.clearCart);

module.exports = router;