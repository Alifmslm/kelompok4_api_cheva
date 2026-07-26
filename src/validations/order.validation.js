const ApiError = require('../utils/ApiError');

const validateCheckout = (req, res, next) => {
  const { id_alamat, ongkos_kirim, kurir } = req.body;

  if (!id_alamat) {
    throw new ApiError(400, 'ID alamat wajib diisi');
  }

  if (typeof id_alamat !== 'number' || id_alamat <= 0) {
    throw new ApiError(400, 'ID alamat harus berupa angka positif');
  }

  if (!ongkos_kirim && ongkos_kirim !== 0) {
    throw new ApiError(400, 'Ongkos kirim wajib diisi');
  }

  if (typeof ongkos_kirim !== 'number' || ongkos_kirim < 0) {
    throw new ApiError(400, 'Ongkos kirim harus berupa angka positif atau 0');
  }

  if (kurir && typeof kurir !== 'string') {
    throw new ApiError(400, 'Kurir harus berupa string');
  }

  next();
};

const validateCreateOrder = (req, res, next) => {
  const { items, id_alamat, ongkos_kirim, kurir } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Items wajib diisi dan harus berupa array dengan minimal 1 item');
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    if (!item.id_produk) {
      throw new ApiError(400, `Item ke-${i + 1}: id_produk wajib diisi`);
    }

    if (typeof item.id_produk !== 'number' || item.id_produk <= 0) {
      throw new ApiError(400, `Item ke-${i + 1}: id_produk harus berupa angka positif`);
    }

    if (!item.jumlah) {
      throw new ApiError(400, `Item ke-${i + 1}: jumlah wajib diisi`);
    }

    if (typeof item.jumlah !== 'number' || item.jumlah < 1) {
      throw new ApiError(400, `Item ke-${i + 1}: jumlah harus berupa angka minimal 1`);
    }
  }

  if (!id_alamat) {
    throw new ApiError(400, 'ID alamat wajib diisi');
  }

  if (typeof id_alamat !== 'number' || id_alamat <= 0) {
    throw new ApiError(400, 'ID alamat harus berupa angka positif');
  }

  if (!ongkos_kirim && ongkos_kirim !== 0) {
    throw new ApiError(400, 'Ongkos kirim wajib diisi');
  }

  if (typeof ongkos_kirim !== 'number' || ongkos_kirim < 0) {
    throw new ApiError(400, 'Ongkos kirim harus berupa angka positif atau 0');
  }

  if (kurir && typeof kurir !== 'string') {
    throw new ApiError(400, 'Kurir harus berupa string');
  }

  next();
};

const validateCancelOrder = (req, res, next) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id) || id <= 0) {
    throw new ApiError(400, 'ID order tidak valid');
  }

  next();
};

module.exports = {
  validateCheckout,
  validateCreateOrder,
  validateCancelOrder
};
