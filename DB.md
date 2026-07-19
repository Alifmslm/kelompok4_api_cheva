# Database Schema Context — UMKM Export-Import Platform API

> Dokumen ini adalah pelengkap **ARCHITECTURE.md** dan menjadi acuan tunggal untuk men-generate `prisma/schema.prisma` beserta seluruh file `src/models/*.model.js`. Ikuti struktur di dokumen ini persis, kecuali ada instruksi eksplisit lain dari developer.

---

## 0. Asumsi & Keputusan Desain

Beberapa hal berikut diasumsikan berdasarkan dokumentasi yang tersedia (ERD, skema relasi, dan `ARCHITECTURE.md`) — sesuaikan bila ada perbedaan dengan keputusan tim:

1. **ORM**: Prisma. `src/config/database.js` menginisialisasi satu instance `PrismaClient` dan meng-export-nya; seluruh file di `src/models/` mengimpor instance ini (tidak membuat instance baru per file).
2. **Database**: MySQL. Kolom bertipe `text` di dokumentasi (`Alamat_Buyer.alamat_lengkap`, `Profil_UMKM.alamat`, `Log_Verifikasi.alasan`, `Produk.deskripsi`) ditandai `@db.Text` secara eksplisit, karena default `String` Prisma di MySQL adalah `VARCHAR(191)` yang bisa terlalu pendek untuk field tersebut.
3. **Penamaan resource** mengikuti nama entitas pada ERD/dokumentasi (Bahasa Indonesia, snake_case untuk file), bukan diterjemahkan ke Inggris. Contoh: `Profil_UMKM` → `profil_umkm.model.js`, `Item_Pesanan` → `item_pesanan.model.js`.
4. **Nama field** pada Prisma schema mengikuti persis nama kolom di dokumentasi (snake_case, mis. `id_pengguna`, `dibuat_pada`) agar 1:1 dengan ERD — bukan dikonversi ke camelCase.
5. Kolom `status`, `status_verifikasi`, `kurir`, dan `aksi` di dokumentasi disebutkan punya beberapa nilai contoh diikuti "dll" (belum lengkap), sehingga **tetap bertipe `String`**, bukan `enum`, supaya tidak salah menebak nilai yang belum terdefinisi. Hanya `peran` pada `Pengguna` yang dijadikan `enum` karena nilainya eksplisit dan lengkap (`admin`, `seller`, `buyer`).
6. Tidak menambahkan constraint/index yang tidak eksplisit disebutkan di dokumentasi (mis. unique composite key), kecuali disebutkan secara terpisah di bagian catatan.

---

## 1. Ringkasan Entitas

| # | Entitas | Relasi Utama |
|---|---|---|
| 1 | Pengguna | 1–N Alamat_Buyer, 1–1 Profil_UMKM, 1–N Log_Verifikasi (sbg admin), 1–1 Keranjang, 1–N Pesanan |
| 2 | Alamat_Buyer | N–1 Pengguna, 1–N Pesanan (tujuan) |
| 3 | Profil_UMKM | 1–1 Pengguna, 1–N Log_Verifikasi, 1–N Produk |
| 4 | Log_Verifikasi | N–1 Profil_UMKM, N–1 Pengguna (admin) |
| 5 | Produk | N–1 Profil_UMKM, N–N Keranjang (via Item_Keranjang), N–N Pesanan (via Item_Pesanan) |
| 6 | Keranjang | 1–1 Pengguna, 1–N Item_Keranjang |
| 7 | Item_Keranjang | N–1 Keranjang, N–1 Produk |
| 8 | Pesanan | N–1 Pengguna, N–1 Alamat_Buyer, 1–N Item_Pesanan, 1–1 Pembayaran |
| 9 | Item_Pesanan | N–1 Pesanan, N–1 Produk |
| 10 | Pembayaran | 1–1 Pesanan |

---

## 2. Prisma Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

enum Peran {
  admin
  seller
  buyer
}

model Pengguna {
  id_pengguna   Int      @id @default(autoincrement())
  nama          String
  email         String   @unique
  kata_sandi    String
  peran         Peran
  dibuat_pada   DateTime @default(now())
  nomor_telepon String?
  foto_profil   String?

  alamat_buyer      Alamat_Buyer[]
  profil_umkm       Profil_UMKM?
  log_verifikasi    Log_Verifikasi[] @relation("AdminVerifikasi")
  keranjang         Keranjang?
  pesanan           Pesanan[]

  @@map("pengguna")
}

model Alamat_Buyer {
  id_alamat      Int      @id @default(autoincrement())
  label_alamat   String
  nama_penerima  String
  alamat_lengkap String   @db.Text
  negara         String
  alamat_utama   Boolean
  nomor_telepon  String
  foto_profil    String?
  id_pengguna    Int

  pengguna Pengguna  @relation(fields: [id_pengguna], references: [id_pengguna])
  pesanan  Pesanan[]

  @@map("alamat_buyer")
}

model Profil_UMKM {
  id_umkm               Int       @id @default(autoincrement())
  nama_usaha             String
  url_dokumen_legalitas  String
  status_verifikasi      String
  alamat                 String    @db.Text
  latitude               Float?
  longitude              Float?
  diajukan_pada          DateTime  @default(now())
  diverifikasi_pada      DateTime?
  id_pengguna            Int       @unique

  pengguna        Pengguna         @relation(fields: [id_pengguna], references: [id_pengguna])
  log_verifikasi  Log_Verifikasi[]
  produk          Produk[]

  @@map("profil_umkm")
}

model Log_Verifikasi {
  id_log      Int      @id @default(autoincrement())
  aksi        String
  alasan      String?  @db.Text
  dibuat_pada DateTime @default(now())
  id_umkm     Int
  id_admin    Int

  profil_umkm Profil_UMKM @relation(fields: [id_umkm], references: [id_umkm])
  admin       Pengguna    @relation("AdminVerifikasi", fields: [id_admin], references: [id_pengguna])

  @@map("log_verifikasi")
}

model Produk {
  id_produk       Int      @id @default(autoincrement())
  nama            String
  deskripsi       String?  @db.Text
  harga           Int
  stok            Int
  url_gambar      String?
  dibuat_pada     DateTime @default(now())
  diperbarui_pada DateTime @updatedAt
  berat_gram      Int
  id_umkm         Int

  profil_umkm    Profil_UMKM      @relation(fields: [id_umkm], references: [id_umkm])
  item_keranjang Item_Keranjang[]
  item_pesanan   Item_Pesanan[]

  @@map("produk")
}

model Keranjang {
  id_keranjang Int      @id @default(autoincrement())
  dibuat_pada  DateTime @default(now())
  id_pengguna  Int      @unique

  pengguna       Pengguna         @relation(fields: [id_pengguna], references: [id_pengguna])
  item_keranjang Item_Keranjang[]

  @@map("keranjang")
}

model Item_Keranjang {
  id_item_keranjang Int @id @default(autoincrement())
  jumlah            Int
  id_keranjang      Int
  id_produk         Int

  keranjang Keranjang @relation(fields: [id_keranjang], references: [id_keranjang])
  produk    Produk    @relation(fields: [id_produk], references: [id_produk])

  @@map("item_keranjang")
}

model Pesanan {
  id_pesanan      Int      @id @default(autoincrement())
  status          String
  total_harga     Int
  dibuat_pada     DateTime @default(now())
  diperbarui_pada DateTime @updatedAt
  kurir           String?
  ongkos_kirim    Int
  kode_resi       String?
  id_pengguna     Int
  id_alamat       Int

  pengguna     Pengguna       @relation(fields: [id_pengguna], references: [id_pengguna])
  alamat_buyer Alamat_Buyer   @relation(fields: [id_alamat], references: [id_alamat])
  item_pesanan Item_Pesanan[]
  pembayaran   Pembayaran?

  @@map("pesanan")
}

model Item_Pesanan {
  id_item_pesanan Int @id @default(autoincrement())
  jumlah          Int
  harga           Int
  id_pesanan      Int
  id_produk       Int

  pesanan Pesanan @relation(fields: [id_pesanan], references: [id_pesanan])
  produk  Produk  @relation(fields: [id_produk], references: [id_produk])

  @@map("item_pesanan")
}

model Pembayaran {
  id_pembayaran       Int      @id @default(autoincrement())
  penyedia            String
  status              String
  jumlah              Int
  referensi_transaksi String?
  dibuat_pada         DateTime @default(now())
  id_pesanan          Int      @unique

  pesanan Pesanan @relation(fields: [id_pesanan], references: [id_pesanan])

  @@map("pembayaran")
}
```

---

## 3. Pemetaan Model → `src/models/*.model.js`

Sesuai aturan `ARCHITECTURE.md`, tiap file model **hanya** berisi query dasar (create/find/update/delete) yang membungkus `prisma`. Tidak ada pengecekan role, kalkulasi, atau validasi bisnis di layer ini — itu tugas Service.

| Prisma Model | File | Query dasar wajib |
|---|---|---|
| Pengguna | `pengguna.model.js` | `create`, `findById`, `findByEmail`, `findAll`, `update`, `delete` |
| Alamat_Buyer | `alamat_buyer.model.js` | `create`, `findById`, `findAllByPenggunaId`, `update`, `delete` |
| Profil_UMKM | `profil_umkm.model.js` | `create`, `findById`, `findByPenggunaId`, `findAll`, `update`, `delete` |
| Log_Verifikasi | `log_verifikasi.model.js` | `create`, `findById`, `findAllByUmkmId`, `findAllByAdminId` |
| Produk | `produk.model.js` | `create`, `findById`, `findAllByUmkmId`, `findAll`, `update`, `delete` |
| Keranjang | `keranjang.model.js` | `create`, `findById`, `findByPenggunaId` |
| Item_Keranjang | `item_keranjang.model.js` | `create`, `findById`, `findAllByKeranjangId`, `findByKeranjangAndProduk`, `update`, `delete` |
| Pesanan | `pesanan.model.js` | `create`, `findById`, `findAllByPenggunaId`, `update` |
| Item_Pesanan | `item_pesanan.model.js` | `create` (dukung bulk insert), `findAllByPesananId` |
| Pembayaran | `pembayaran.model.js` | `create`, `findById`, `findByPesananId`, `update` |

Contoh pola satu file model (dipakai konsisten untuk semua model di atas):

```js
// pengguna.model.js
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
```

---

## 4. Catatan Relasi Khusus

- **1–1**: `Pengguna ↔ Profil_UMKM`, `Pengguna ↔ Keranjang`, `Pesanan ↔ Pembayaran` — ditandai `@unique` pada FK di sisi "banyak" secara skema, tapi relasinya dibatasi 1–1 lewat constraint tersebut.
- **N–N via tabel penghubung**: `Keranjang ↔ Produk` lewat `Item_Keranjang`, dan `Pesanan ↔ Produk` lewat `Item_Pesanan`. Kedua tabel ini adalah model sendiri (bukan implicit many-to-many Prisma) karena masing-masing punya kolom tambahan (`jumlah`, `harga`).
- **Dua relasi berbeda dari `Log_Verifikasi` ke `Pengguna`**: relasi ini sebenarnya hanya satu FK (`id_admin`), diberi nama relasi eksplisit (`"AdminVerifikasi"`) supaya tidak ambigu dengan relasi implisit lain dari `Pengguna`.
- **Harga di `Item_Pesanan`** adalah snapshot harga saat transaksi (bukan referensi live ke `Produk.harga`) — pastikan Service yang mengisi kolom ini, bukan di-generate otomatis oleh Model.

---

## 5. Instruksi untuk AI Agent

1. Generate `prisma/schema.prisma` persis seperti Bagian 2.
2. Generate `src/config/database.js` yang meng-export instance `PrismaClient` tunggal.
3. Generate 10 file di `src/models/` sesuai Bagian 3, masing-masing hanya berisi query dasar (tidak ada `if`/business rule).
4. Jangan generate Controller, Service, Route, atau Validation di tahap ini — dokumen ini khusus untuk schema + model layer.
5. Ikuti konvensi penamaan file dan gaya kode (CommonJS `require`/`module.exports`) sesuai `ARCHITECTURE.md`.