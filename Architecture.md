# Architecture Context — UMKM Export-Import Platform API

> Setiap kode yang di-generate WAJIB mengikuti pola arsitektur dan struktur folder di dokumen ini, kecuali ada instruksi eksplisit lain dari developer.

---

## 1. Ringkasan Project

REST API untuk platform yang mempertemukan UMKM Indonesia (khususnya komoditas unggulan Jawa Barat: teh, tekstil, kerajinan tangan) dengan calon pembeli internasional. Transaksi (cart, checkout, payment gateway) tetap terjadi di dalam platform, namun fokus utama produk adalah trust & discovery, bukan volume transaksi — mirip model B2B seperti Alibaba.com, bukan marketplace C2C seperti Tokopedia/Shopee. Kredibilitas dibangun lebih dulu lewat verified seller (verifikasi dokumen legalitas oleh admin) sebelum buyer internasional bertransaksi, sehingga urutan value proposition-nya adalah kredibilitas & matching dulu, transaksi mengikuti — bukan sebaliknya. API ini dikonsumsi oleh dua consumer: aplikasi mobile dan dashboard web.

---

## 2. Pola Arsitektur: Layered Architecture

Project ini menggunakan **Layered Architecture** dengan 4 layer utama, bukan MVC murni (karena tidak ada View — response selalu JSON).

### 2.1 Alur Request

```
Client (mobile/web)
      │
      ▼
   Route          → mendefinisikan endpoint + attach middleware
      │
      ▼
 Middleware        → auth, role check, validasi input, upload file
      │
      ▼
  Controller       → terima req, panggil Service, bentuk response
      │
      ▼
   Service         → business logic murni
      │
      ▼
   Model           → query ke database
      │
      ▼
  Database
```

Response mengalir balik dari Model → Service → Controller → Client dengan format yang konsisten (lihat bagian 4).

### 2.2 Tanggung Jawab Tiap Layer

#### Route
- Hanya mendaftarkan endpoint (`METHOD /path`) dan mengaitkannya dengan middleware + controller.
- **TIDAK BOLEH** ada logic apa pun di sini, termasuk validasi atau query database.
- Satu file route = satu resource/domain (misal `product.routes.js` hanya untuk endpoint produk).

Contoh:
```js
// product.routes.js
router.get('/', productController.getAll);
router.post('/', authMiddleware, roleMiddleware('seller'), validate(createProductSchema), productController.create);
```

#### Controller
- Menjembatani HTTP layer dengan business logic.
- Tugasnya HANYA: ambil data dari `req` (body/params/query/user), panggil fungsi di Service, lalu kirim response memakai `apiResponse` helper.
- **TIDAK BOLEH** menulis business logic (perhitungan, pengecekan status, query database langsung) di sini.
- **TIDAK BOLEH** memanggil Model secara langsung — selalu lewat Service.
- Error dilempar ke `next(error)` agar ditangani oleh `errorHandler.middleware.js`.

Contoh:
```js
// product.controller.js
const create = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.user.id, req.body);
    return apiResponse.success(res, 201, 'Produk berhasil dibuat', product);
  } catch (error) {
    next(error);
  }
};
```

#### Service
- Tempat seluruh **business logic** berada. Ini adalah layer terpenting.
- Contoh logic yang wajib ada di Service: cek apakah seller berstatus verified sebelum produk boleh dipublish, hitung total harga cart, convert currency, generate invoice, validasi status transisi order.
- Service boleh memanggil satu atau lebih Model, bahkan Service lain, untuk menyelesaikan satu use case.
- Service tidak tahu apa-apa soal HTTP (tidak menerima `req`/`res`), sehingga mudah di-unit-test dan di-reuse (misal dipanggil dari controller lain, cron job, atau webhook).

Contoh:
```js
// product.service.js
const createProduct = async (userId, data) => {
  const seller = await userModel.findById(userId);
  if (!seller.isVerified) {
    throw new ApiError(403, 'Hanya verified seller yang dapat menambahkan produk');
  }
  return productModel.create({ ...data, sellerId: userId });
};
```

#### Model
- Satu-satunya layer yang berinteraksi langsung dengan database.
- Berisi definisi skema/tabel dan query dasar (create, find, update, delete).
- **TIDAK BOLEH** berisi business logic (pengecekan role, perhitungan, dsb) — itu tugas Service.

### 2.3 Aturan Ketat untuk AI Agent

1. Alur pemanggilan **harus selalu** `Route → Middleware → Controller → Service → Model`. Tidak boleh loncat layer (misal Controller memanggil Model langsung).
2. Setiap Service function harus bisa dipanggil tanpa context HTTP (tidak menerima `req`/`res` sebagai parameter).
3. Validasi input dilakukan di layer Middleware (`validate.middleware.js` + schema dari folder `validations/`), bukan di Controller atau Service.
4. Error selalu menggunakan class `ApiError` dan dilempar (`throw`), lalu ditangkap oleh `errorHandler.middleware.js` secara terpusat — tidak ada `try/catch` manual untuk format response error di tiap controller selain untuk meneruskan ke `next()`.
5. Response sukses selalu dibentuk lewat helper `apiResponse.js` agar format konsisten di seluruh endpoint.
6. Satu file = satu resource/domain. Jangan menumpuk banyak resource berbeda dalam satu file controller/service/model.

---

## 3. Struktur Folder

```
umkm-export-api/
├── src/
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middlewares/
│   ├── validations/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Penjelasan Tiap Folder

#### `src/config/`
Semua konfigurasi koneksi ke service eksternal dan setup global. Contoh isi:
- `database.js` — koneksi ke database (Prisma/Sequelize client)
- `cloudinary.js` — konfigurasi upload gambar
- `swagger.js` — konfigurasi `swagger-jsdoc`
- `env.js` — validasi dan export environment variables agar tidak ada `process.env.X` tersebar di banyak file

#### `src/routes/`
Definisi endpoint per resource. Semua route digabung di `index.js` dengan prefix versi API (`/api/v1`).
- `auth.routes.js`, `product.routes.js`, `cart.routes.js`, `order.routes.js`, `payment.routes.js`, `seller.routes.js`, `review`.routes.js`, `admin.routes.js`

#### `src/controllers/`
Satu file controller per resource, isinya kumpulan handler function (`getAll`, `getById`, `create`, `update`, `delete`, dst) yang dipanggil oleh route.

#### `src/services/`
Satu file service per resource/domain, berisi seluruh business logic. Ini adalah folder yang paling sering berkembang seiring bertambahnya fitur.
- `upload.service.js` khusus menangani logic upload file (dipanggil oleh service lain yang butuh upload gambar, misal `product.service.js`)

#### `src/models/`
Definisi skema data dan query dasar ke database. Jika memakai ORM seperti Prisma, sebagian isi folder ini bisa digantikan oleh `prisma/schema.prisma`, namun file di `models/` tetap berfungsi sebagai wrapper query yang dipanggil Service.

#### `src/middlewares/`
Fungsi yang berjalan di antara Route dan Controller.
- `auth.middleware.js` — verifikasi JWT, isi `req.user`
- `role.middleware.js` — cek apakah `req.user.role` sesuai (buyer/seller/admin)
- `upload.middleware.js` — konfigurasi Multer untuk menangkap file dari request
- `validate.middleware.js` — menjalankan schema dari folder `validations/` terhadap `req.body`/`req.query`/`req.params`
- `errorHandler.middleware.js` — penanganan error terpusat, mengubah `ApiError` menjadi response JSON yang konsisten

#### `src/validations/`
Schema validasi input (misal menggunakan Joi/Zod) per resource. Dipanggil oleh `validate.middleware.js`, memisahkan aturan validasi dari logic controller.

#### `src/utils/`
Helper/fungsi murni yang dipakai lintas layer.
- `apiResponse.js` — format response sukses yang konsisten
- `apiError.js` — custom error class yang membawa `statusCode` dan `message`
- `generateToken.js` — helper generate JWT
- `currencyConverter.js` — helper konversi mata uang untuk payment internasional

#### `src/app.js`
Setup instance Express: register middleware global (`cors`, `helmet`, `express.json()`), mount routes dari `routes/index.js`, dan register `errorHandler.middleware.js` di paling akhir.

#### `src/server.js`
Entry point aplikasi — import `app.js`, lalu `listen()` di port tertentu. Dipisah dari `app.js` supaya `app` bisa di-import langsung di file test tanpa perlu benar-benar membuka port.

#### `tests/`
- `unit/` — test untuk Service (tanpa dependency HTTP/database asli, biasanya pakai mock)
- `integration/` — test end-to-end yang memanggil endpoint sungguhan

---

## 4. Konvensi Response Format

Semua response sukses dan error mengikuti format berikut agar konsumsi dari mobile app dan web dashboard konsisten:

**Sukses:**
```json
{
  "success": true,
  "message": "Produk berhasil dibuat",
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Hanya verified seller yang dapat menambahkan produk",
  "errors": null
}
```

---

## 5. Konvensi Penamaan File

| Layer | Format nama file | Contoh |
|---|---|---|
| Route | `[resource].routes.js` | `product.routes.js` |
| Controller | `[resource].controller.js` | `product.controller.js` |
| Service | `[resource].service.js` | `product.service.js` |
| Model | `[resource].model.js` | `product.model.js` |
| Validation | `[resource].validation.js` | `product.validation.js` |
| Middleware | `[fungsi].middleware.js` | `auth.middleware.js` |

---

## 6. Contoh Alur End-to-End: "Seller membuat produk baru"

1. `POST /api/v1/products` masuk lewat `product.routes.js`
2. Middleware `authMiddleware` memverifikasi JWT, mengisi `req.user`
3. Middleware `roleMiddleware('seller')` memastikan role sesuai
4. Middleware `validate(createProductSchema)` memvalidasi `req.body`
5. `product.controller.js` → fungsi `create` memanggil `productService.createProduct(req.user.id, req.body)`
6. `product.service.js` → cek `seller.isVerified` lewat `userModel`, jika lolos panggil `productModel.create(...)`
7. `product.model.js` → eksekusi query insert ke database
8. Hasil dikembalikan ke Service → Controller → dibungkus `apiResponse.success()` → dikirim ke client