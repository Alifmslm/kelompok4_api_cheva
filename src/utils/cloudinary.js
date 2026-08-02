const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Fungsi untuk upload gambar/dokumen dari memori (buffer) ke Cloudinary
 * @param {Buffer} fileBuffer Buffer dari file yang diupload (via multer.memoryStorage)
 * @param {String} folderName Nama folder di dalam Cloudinary
 * @returns {Promise<String>} URL file yang berhasil diupload
 */
const uploadImageToCloudinary = (fileBuffer, folderName = 'localbiz_products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: 'auto', // 'auto' mendukung gambar (jpg/png) DAN dokumen (pdf)
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  cloudinary,
  uploadImageToCloudinary,
};