const express = require('express');
const router = express.Router();
const commodityController = require('../controllers/commodity.controller');
const { validateCommodityQuery } = require('../validations/commodity.validation');
const { commodityLimiter } = require('../middlewares/rateLimiter/commodity.limiter');

/**
 * @swagger
 * tags:
 *   name: Commodity
 *   description: Manajemen commodity dan kategori
 */

/**
 * @swagger
 * commodities:
 *   get:
 *     summary: Ambil daftar commodity dengan filter dan search
 *     tags: [Commodity]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter berdasarkan kategori slug
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Keyword untuk mencari commodity
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
 *         description: Berhasil mengambil daftar commodity
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
 *                   example: Daftar commodity berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     commodities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           slug:
 *                             type: string
 *                           description:
 *                             type: string
 *                           price:
 *                             type: number
 *                           unit:
 *                             type: string
 *                           category:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                               name:
 *                                 type: string
 *                               slug:
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
router.get('commodities', commodityLimiter, validateCommodityQuery, commodityController.getCommodities);

/**
 * @swagger
 * commodities/{id}:
 *   get:
 *     summary: Detail commodity
 *     tags: [Commodity]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID commodity
 *     responses:
 *       200:
 *         description: Berhasil mengambil detail commodity
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
 *                   example: Detail commodity berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     slug:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *                     unit:
 *                       type: string
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         slug:
 *                           type: string
 *       404:
 *         description: Commodity tidak ditemukan
 */
router.get('commodities/:id', commodityLimiter, commodityController.getCommodityById);

/**
 * @swagger
 * categories:
 *   get:
 *     summary: Ambil daftar kategori
 *     tags: [Commodity]
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar kategori
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
 *                   example: Daftar kategori berhasil diambil
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       slug:
 *                         type: string
 *                       description:
 *                         type: string
 */
router.get('categories', commodityLimiter, commodityController.getCategories);

/**
 * @swagger
 * categories/{id}/commodities:
 *   get:
 *     summary: Ambil commodity berdasarkan kategori
 *     tags: [Commodity]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kategori
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
 *         description: Berhasil mengambil commodity berdasarkan kategori
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
 *                   example: Commodity berdasarkan kategori berhasil diambil
 *                 data:
 *                   type: object
 *                   properties:
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         slug:
 *                           type: string
 *                     commodities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           slug:
 *                             type: string
 *                           price:
 *                             type: number
 *                           unit:
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
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.get('categories/:id/commodities', commodityLimiter, commodityController.getCommoditiesByCategory);

module.exports = router;