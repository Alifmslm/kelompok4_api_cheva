const express = require('express');
const router = express.Router();
const commodityController = require('../controllers/commodity.controller');
const { validateCommodityQuery } = require('../validations/commodity.validation');
const { commodityLimiter } = require('../middlewares/rateLimiter/commodity.limiter');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Manajemen produk
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Ambil daftar produk dengan filter dan search
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Keyword untuk mencari produk
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
 *         description: Berhasil mengambil daftar produk
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
 *                   example: Daftar produk berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           price:
 *                             type: integer
 *                           stock:
 *                             type: integer
 *                           image:
 *                             type: string
 *                           weight:
 *                             type: integer
 *                           seller:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
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
 *       400:
 *         description: Parameter query tidak valid
 */
router.get('/products', commodityLimiter, validateCommodityQuery, commodityController.getCommodities);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Detail produk
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID produk
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail produk
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
 *                   example: Detail produk berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_produk:
 *                       type: integer
 *                     nama:
 *                       type: string
 *                     deskripsi:
 *                       type: string
 *                     harga:
 *                       type: integer
 *                     stok:
 *                       type: integer
 *                     url_gambar:
 *                       type: string
 *                     berat_gram:
 *                       type: integer
 *                     seller:
 *                       type: string
 *       404:
 *         description: Produk tidak ditemukan
 */
router.get('/products/:id', commodityLimiter, commodityController.getCommodityById);

module.exports = router;