const multer = require('multer');
const ApiError = require('../utils/apiError');

// Menggunakan memory storage agar file tidak disimpan di harddisk lokal,
// melainkan ditahan di memory (RAM) untuk langsung di-stream ke Cloudinary
const storage = multer.memoryStorage();

// Filter memperbolehkan gambar dan PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Tipe file tidak didukung. Harap upload gambar (JPG/PNG) atau dokumen (PDF).'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Maksimal ukuran file 5MB
  },
});

module.exports = upload;