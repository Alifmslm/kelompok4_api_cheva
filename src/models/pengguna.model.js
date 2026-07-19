const prisma = require('../config/database');

const create = (data) => prisma.pengguna.create({ data });

const findById = (id_pengguna) =>
  prisma.pengguna.findUnique({ where: { id_pengguna } });

const findByEmail = (email) =>
  prisma.pengguna.findUnique({ where: { email } });

const findAll = (filter = {}) => prisma.pengguna.findMany({ where: filter });

const update = (id_pengguna, data) =>
  prisma.pengguna.update({ where: { id_pengguna }, data });

const remove = (id_pengguna) =>
  prisma.pengguna.delete({ where: { id_pengguna } });

module.exports = { create, findById, findByEmail, findAll, update, remove };
