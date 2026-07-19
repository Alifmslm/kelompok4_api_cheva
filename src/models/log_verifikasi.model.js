const prisma = require('../config/database');

const create = (data) => prisma.log_verifikasi.create({ data });

const findById = (id_log) =>
  prisma.log_verifikasi.findUnique({ where: { id_log } });

const findAllByUmkmId = (id_umkm) =>
  prisma.log_verifikasi.findMany({ where: { id_umkm } });

const findAllByAdminId = (id_admin) =>
  prisma.log_verifikasi.findMany({ where: { id_admin } });

module.exports = { create, findById, findAllByUmkmId, findAllByAdminId };
