# UMKM Export-Import Platform API

REST API yang mempertemukan UMKM Indonesia — khususnya komoditas unggulan Jawa Barat seperti teh, tekstil, dan kerajinan tangan — dengan calon pembeli internasional. Platform ini mengutamakan **trust & discovery** (verified seller dengan verifikasi dokumen legalitas) sebelum transaksi, mirip model B2B seperti Alibaba.com, bukan marketplace C2C volume-first.

API ini dikonsumsi oleh aplikasi mobile dan dashboard web, dibangun dengan Express.js menggunakan **Layered Architecture** (`Route → Middleware → Controller → Service → Model`). Detail lengkap arsitektur ada di [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## Fitur Utama (MVP)

- Authentication (JWT)
- CRUD produk + upload gambar (Cloudinary)
- Verified seller (upload dokumen legalitas → verifikasi admin)
- Katalog produk untuk mobile app
- Keranjang & checkout
- Payment gateway internasional (Stripe)
- Manajemen pesanan & riwayat transaksi
- Review produk
- Dokumentasi API (Swagger)

## Tech Stack

- **Runtime:** Node.js + Express.js
- **Database:** PostgreSQL (Prisma ORM)
- **Auth:** JWT
- **Payment:** Stripe
- **Upload:** Cloudinary
- **Docs:** Swagger (`swagger-jsdoc` + `swagger-ui-express`)

## Cara Setup

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd umkm-export-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Isi seluruh value di `.env` (database credentials, JWT secret, Stripe key, Cloudinary key). Lihat [`.env.example`](./.env.example) untuk daftar variable yang dibutuhkan.

4. **Setup database MySQL lokal**
   - Pastikan MySQL sudah terinstall dan running
   - Buat database baru:
     ```sql
     CREATE DATABASE kelompok4_db;
     ```
   - Update `DATABASE_URL` di `.env` dengan format:
     ```
     DATABASE_URL="mysql://username:password@localhost:3306/kelompok4_db"
     ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Jalankan migrasi database**
   ```bash
   npx prisma migrate dev
   ```
   Ini akan membuat tabel-tabel yang diperlukan berdasarkan schema Prisma.

7. **Jalankan server**
   ```bash
   npm run dev
   ```

## Struktur Project

Lihat [`ARCHITECTURE.md`](./ARCHITECTURE.md) untuk penjelasan lengkap struktur folder dan alur request antar layer.

## Scripts

| Command | Keterangan |
|---|---|
| `npm run dev` | Menjalankan server dengan hot-reload (nodemon) |
| `npm start` | Menjalankan server (production) |
| `npx prisma studio` | Membuka GUI untuk lihat isi database |
| `npx prisma migrate dev` | Menjalankan migrasi database |
