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

module.exports = prisma;
