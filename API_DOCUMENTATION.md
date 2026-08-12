# API Documentation

Dokumentasi REST API UMKM Export-Import Platform menggunakan Swagger UI.

## Menjalankan API

```bash
npm install
npm run dev
```

Server: `http://localhost:3000`(port disesuaikan)

---

## Swagger UI

Buka:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Swagger digunakan untuk melihat dan menguji seluruh endpoint API.

### Alur Testing API
- Pilih endpoint.
- Klik Try it out.
- Isi parameter atau request body.
- Klik Execute.
- Periksa Server response.

---

## Authentication

Endpoint tertentu membutuhkan JWT.

- Gunakan POST /auth/login.
- Masukkan email dan kata sandi.
- Salin token dari response.
- Klik Authorize di Swagger.
- Masukkan token JWT.
- Klik Authorize.

Setelah terautentikasi, endpoint yang membutuhkan JWT dapat diuji melalui Swagger.

