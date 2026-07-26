const prisma = require('../config/database');

/**
 * Ambil semua pengajuan verifikasi UMKM
 * @param {string} [status] - Filter: pending | under_review | approved | rejected
 */
const findVerifications = (status) => {
  const where = {};
  if (status) {
    where.status_verifikasi = status;
  }
  return prisma.profil_UMKM.findMany({
    where,
    include: {
      pengguna: {
        select: {
          id_pengguna: true,
          nama: true,
          email: true,
          nomor_telepon: true,
          dibuat_pada: true,
        },
      },
    },
    orderBy: { diajukan_pada: 'desc' },
  });
};

/**
 * Ambil detail satu UMKM beserta riwayat log verifikasinya
 * @param {number|string} id_umkm
 */
const findVerificationById = (id_umkm) =>
  prisma.profil_UMKM.findUnique({
    where: { id_umkm: parseInt(id_umkm) },
    include: {
      pengguna: {
        select: {
          id_pengguna: true,
          nama: true,
          email: true,
          nomor_telepon: true,
          dibuat_pada: true,
        },
      },
      log_verifikasi: {
        include: {
          admin: {
            select: {
              nama: true,
              email: true,
            },
          },
        },
        orderBy: { dibuat_pada: 'desc' },
      },
    },
  });

/**
 * Update status verifikasi UMKM
 * @param {number|string} id_umkm
 * @param {string} status_verifikasi
 */
const updateVerificationStatus = (id_umkm, status_verifikasi) =>
  prisma.profil_UMKM.update({
    where: { id_umkm: parseInt(id_umkm) },
    data: {
      status_verifikasi,
      diverifikasi_pada: new Date(),
    },
  });

/**
 * Buat entri audit log verifikasi baru
 * @param {{ aksi: string, alasan?: string, id_umkm: number, id_admin: number }} data
 */
const createLogVerifikasi = (data) =>
  prisma.log_Verifikasi.create({ data });

/**
 * Ambil semua audit log verifikasi
 * @param {number|string} [id_umkm]
 */
const findVerificationLogs = (id_umkm) => {
  const where = {};
  if (id_umkm) {
    where.id_umkm = parseInt(id_umkm);
  }
  return prisma.log_Verifikasi.findMany({
    where,
    include: {
      profil_umkm: {
        select: { nama_usaha: true },
      },
      admin: {
        select: { nama: true, email: true },
      },
    },
    orderBy: { dibuat_pada: 'desc' },
  });
};

module.exports = {
  findVerifications,
  findVerificationById,
  updateVerificationStatus,
  createLogVerifikasi,
  findVerificationLogs,
};