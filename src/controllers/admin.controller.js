const adminService = require('../services/admin.service');
const apiResponse = require('../utils/apiResponse');

const getVerifications = async (req, res, next) => {
  try {
    const verifications = await adminService.getVerifications(req.query.status);
    return apiResponse.success(res, 200, 'Daftar verifikasi UMKM berhasil diambil', verifications);
  } catch (error) {
    next(error);
  }
};

const getVerificationDetail = async (req, res, next) => {
  try {
    const verification = await adminService.getVerificationDetail(req.params.id_umkm);
    return apiResponse.success(res, 200, 'Detail profil UMKM berhasil diambil', verification);
  } catch (error) {
    next(error);
  }
};

const verifySeller = async (req, res, next) => {
  try {
    const adminId = req.user.id_pengguna;
    const updated = await adminService.verifySeller(adminId, req.params.id_umkm, req.body);
    return apiResponse.success(res, 200, `Verifikasi berhasil dengan aksi: ${req.body.aksi}`, updated);
  } catch (error) {
    next(error);
  }
};

const getLogs = async (req, res, next) => {
  try {
    const logs = await adminService.getVerificationLogs(req.query.id_umkm);
    return apiResponse.success(res, 200, 'Riwayat log verifikasi berhasil diambil', logs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVerifications,
  getVerificationDetail,
  verifySeller,
  getLogs,
};