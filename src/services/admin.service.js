const AdminModel = require('../models/admin.model');
const ApiError = require('../utils/apiError');

/**
 * Ambil semua pengajuan verifikasi UMKM
 * @param {string} [status]
 */
const getVerifications = async (status) => {
  return await AdminModel.findVerifications(status);
};

/**
 * Ambil detail satu UMKM
 * @param {number|string} id_umkm
 */
const getVerificationDetail = async (id_umkm) => {
  const verification = await AdminModel.findVerificationById(id_umkm);
  if (!verification) {
    throw new ApiError(404, `Profil UMKM dengan id ${id_umkm} tidak ditemukan`);
  }
  return verification;
};

/**
 * Eksekusi aksi verifikasi: approve | reject | review
 * @param {number} adminId
 * @param {number|string} id_umkm
 * @param {{ aksi: string, alasan?: string }} data
 */
const verifySeller = async (adminId, id_umkm, data) => {
  await getVerificationDetail(id_umkm);

  let status_verifikasi;
  if (data.aksi === 'approve') {
    status_verifikasi = 'approved';
  } else if (data.aksi === 'reject') {
    if (!data.alasan || data.alasan.trim() === '') {
      throw new ApiError(400, 'Alasan penolakan wajib diisi jika menolak verifikasi');
    }
    status_verifikasi = 'rejected';
  } else if (data.aksi === 'review') {
    status_verifikasi = 'under_review';
  } else {
    throw new ApiError(400, 'Aksi tidak valid. Gunakan: approve, reject, atau review');
  }

  const updatedProfile = await AdminModel.updateVerificationStatus(id_umkm, status_verifikasi);

  await AdminModel.createLogVerifikasi({
    aksi: data.aksi,
    alasan: data.alasan || null,
    id_umkm: parseInt(id_umkm),
    id_admin: adminId,
  });

  return updatedProfile;
};

/**
 * Ambil semua audit log
 * @param {string} [id_umkm]
 */
const getVerificationLogs = async (id_umkm) => {
  return await AdminModel.findVerificationLogs(id_umkm);
};

module.exports = {
  getVerifications,
  getVerificationDetail,
  verifySeller,
  getVerificationLogs,
};