require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const url = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.replace(/^\//, ''),
    ssl: url.searchParams.get('sslaccept') === 'strict' ? { rejectUnauthorized: true } : undefined,
});

const prisma = new PrismaClient({ adapter });

Object.defineProperties(prisma, {
    profil_umkm:    { get: () => prisma.profil_UMKM },
    log_verifikasi: { get: () => prisma.log_Verifikasi },
    alamat_buyer:   { get: () => prisma.alamat_Buyer },
    item_keranjang: { get: () => prisma.item_Keranjang },
    item_pesanan:   { get: () => prisma.item_Pesanan },
});

module.exports = prisma;
