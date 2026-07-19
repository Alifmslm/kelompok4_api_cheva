const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const authValidation = require('../validations/auth.validation');

/**
 * @swagger
 * /api/v1/auth/register/buyer:
 *   post:
 *     summary: Registrasi untuk Buyer (Aplikasi Mobile)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - email
 *               - kata_sandi
 *             properties:
 *               nama:
 *                 type: string
 *               email:
 *                 type: string
 *               kata_sandi:
 *                 type: string
 *                 minLength: 8
 *               kode_negara:
 *                 type: string
 *                 example: "+62"
 *               nomor_telepon:
 *                 type: string
 *                 example: "8123456789"
 *     responses:
 *       201:
 *         description: Berhasil registrasi buyer
 *       400:
 *         description: Validasi error atau email sudah terdaftar
 */
router.post(
  '/register/buyer',
  validate(authValidation.registerBuyer),
  authController.registerBuyer
);

/**
 * @swagger
 * /api/v1/auth/register/seller:
 *   post:
 *     summary: Registrasi untuk Seller (Aplikasi Web)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - email
 *               - kata_sandi
 *             properties:
 *               nama:
 *                 type: string
 *               email:
 *                 type: string
 *               kata_sandi:
 *                 type: string
 *                 minLength: 8
 *               kode_negara:
 *                 type: string
 *                 example: "+62"
 *               nomor_telepon:
 *                 type: string
 *                 example: "8123456789"
 *     responses:
 *       201:
 *         description: Berhasil registrasi seller
 *       400:
 *         description: Validasi error atau email sudah terdaftar
 */
router.post(
  '/register/seller',
  validate(authValidation.registerSeller),
  authController.registerSeller
);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login untuk mendapatkan JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - kata_sandi
 *             properties:
 *               email:
 *                 type: string
 *               kata_sandi:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan token JWT
 *       401:
 *         description: Email atau kata sandi salah
 */
router.post(
  '/login',
  validate(authValidation.login),
  authController.login
);

module.exports = router;