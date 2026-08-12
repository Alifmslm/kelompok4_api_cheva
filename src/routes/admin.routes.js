const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { verifySeller } = require('../validations/admin.validation');
const { adminLimiter } = require('../middlewares/rateLimiter/admin.limiter');

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Kurasi dan verifikasi legalitas UMKM serta audit log
 */

router.use(authenticate, authorize('admin'), adminLimiter);

/**
 * @swagger
 * /admin/verifications:
 *   get:
 *     summary: Lihat daftar pengajuan verifikasi UMKM
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, under_review, approved, rejected]
 *     responses:
 *       200:
 *         description: Daftar pengajuan verifikasi berhasil diambil
 *       401:
 *         description: Belum login atau token tidak valid
 *       403:
 *         description: Akses ditolak (bukan Admin)
 */
router.get('/verifications', adminController.getVerifications);

/**
 * @swagger
 * /admin/verifications/{id_umkm}:
 *   get:
 *     summary: Lihat detail pemeriksaan profil UMKM dan dokumen legalitas
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_umkm
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail verifikasi UMKM berhasil diambil
 *       401:
 *         description: Belum login atau token tidak valid
 *       403:
 *         description: Akses ditolak (bukan Admin)
 *       404:
 *         description: Profil UMKM tidak ditemukan
 */
router.get('/verifications/:id_umkm', adminController.getVerificationDetail);

/**
 * @swagger
 * /admin/verifications/{id_umkm}/verify:
 *   post:
 *     summary: Eksekusi verifikasi UMKM (approve / reject / review)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_umkm
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [aksi]
 *             properties:
 *               aksi:
 *                 type: string
 *                 enum: [approve, reject, review]
 *                 description: |
 *                   - approve → status menjadi "approved"
 *                   - reject  → status menjadi "rejected" (wajib isi alasan)
 *                   - review  → status menjadi "under_review"
 *               alasan:
 *                 type: string
 *                 example: Dokumen NIB buram dan tidak terbaca
 *     responses:
 *       200:
 *         description: Proses verifikasi berhasil disimpan
 *       400:
 *         description: Aksi tidak valid atau alasan penolakan tidak diisi
 *       401:
 *         description: Belum login atau token tidak valid
 *       403:
 *         description: Akses ditolak (bukan Admin)
 *       404:
 *         description: Profil UMKM tidak ditemukan
 */
router.post('/verifications/:id_umkm/verify', validate(verifySeller), adminController.verifySeller);

/**
 * @swagger
 * /admin/logs:
 *   get:
 *     summary: Lihat riwayat audit log verifikasi UMKM oleh Admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_umkm
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Riwayat audit log verifikasi berhasil diambil
 *       401:
 *         description: Belum login atau token tidak valid
 *       403:
 *         description: Akses ditolak (bukan Admin)
 */
router.get('/logs', adminController.getLogs);

module.exports = router;