const prisma = require('../config/database');

const create = (data) => prisma.profil_umkm.create({ data });

const findById = (id_umkm) =>
  prisma.profil_umkm.findUnique({ where: { id_umkm } });

const findByPenggunaId = (id_pengguna) =>
  prisma.profil_umkm.findUnique({ where: { id_pengguna } });

const findAll = (filter = {}) => prisma.profil_umkm.findMany({ where: filter });

const update = (id_umkm, data) =>
  prisma.profil_umkm.update({ where: { id_umkm }, data });

const remove = (id_umkm) =>
  prisma.profil_umkm.delete({ where: { id_umkm } });

module.exports = { create, findById, findByPenggunaId, findAll, update, remove };
