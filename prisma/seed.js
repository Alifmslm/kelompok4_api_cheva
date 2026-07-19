require('dotenv/config');
const prisma = require('../src/config/database');
const bcrypt = require('bcryptjs');

async function main() {
  console.log('Seeding database...');

  const adminEmail = 'admin@email.com';
  
  // Cek apakah admin sudah ada
  const existingAdmin = await prisma.pengguna.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await prisma.pengguna.create({
      data: {
        nama: 'Super Admin',
        email: adminEmail,
        kata_sandi: hashedPassword,
        nomor_telepon: '080000000000',
        peran: 'admin',
      },
    });
    console.log('[SUCCESS] Admin berhasil dibuat! Email: admin@email.com | Password: admin123');
  } else {
    console.log('[WARNING] Admin sudah ada di database.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });