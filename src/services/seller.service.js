const prisma = require('../config/database');
const ApiError = require('../utils/ApiError');

const getSupplierById = async (id) => {
    const supplier = await prisma.profil_UMKM.findUnique({
        where: { id_umkm: id },
        include: {
            pengguna: {
                select: {
                    nama: true,
                    email: true,
                    nomor_telepon: true
                }
            }
        }
    });

    if (!supplier) {
        throw new ApiError(404, 'Supplier tidak ditemukan');
    }

    return {
        id_umkm: supplier.id_umkm,
        nama_usaha: supplier.nama_usaha,
        alamat: supplier.alamat,
        status_verifikasi: supplier.status_verifikasi,
        diajukan_pada: supplier.diajukan_pada,
        diverifikasi_pada: supplier.diverifikasi_pada,
        pemilik: {
            nama: supplier.pengguna.nama,
            email: supplier.pengguna.email,
            nomor_telepon: supplier.pengguna.nomor_telepon
        }
    };
};

const getSupplierLocation = async (id) => {
    const supplier = await prisma.profil_UMKM.findUnique({
        where: { id_umkm: id },
        select: {
            id_umkm: true,
            nama_usaha: true,
            alamat: true,
            latitude: true,
            longitude: true
        }
    });

    if (!supplier) {
        throw new ApiError(404, 'Supplier tidak ditemukan');
    }

    return {
        id_umkm: supplier.id_umkm,
        nama_usaha: supplier.nama_usaha,
        alamat: supplier.alamat,
        latitude: supplier.latitude,
        longitude: supplier.longitude
    };
};

const getSupplierByProduct = async (productId) => {
    const product = await prisma.produk.findUnique({
        where: { id_produk: productId },
        include: {
            profil_umkm: {
                select: {
                    id_umkm: true,
                    nama_usaha: true,
                    alamat: true,
                    status_verifikasi: true
                }
            }
        }
    });

    if (!product) {
        throw new ApiError(404, 'Produk tidak ditemukan');
    }

    return {
        id_umkm: product.profil_umkm.id_umkm,
        nama_usaha: product.profil_umkm.nama_usaha,
        alamat: product.profil_umkm.alamat,
        status_verifikasi: product.profil_umkm.status_verifikasi,
        produk: {
            id_produk: product.id_produk,
            nama: product.nama
        }
    };
};

module.exports = {
    getSupplierById,
    getSupplierLocation,
    getSupplierByProduct
};
