const prisma = require('../config/database');

const create = (data) => prisma.produk.create({ data });

const findById = async (id_produk) => {
  const produk = await prisma.produk.findUnique({ 
    where: { id_produk },
    include: {
      profil_umkm: {
        select: {
          nama_usaha: true
        }
      }
    }
  });
  
  if (!produk) return null;
  
  return {
    id_produk: produk.id_produk,
    nama: produk.nama,
    deskripsi: produk.deskripsi,
    harga: produk.harga,
    stok: produk.stok,
    url_gambar: produk.url_gambar,
    berat_gram: produk.berat_gram,
    seller: produk.profil_umkm.nama_usaha
  };
};

const findAllByUmkmId = (id_umkm) =>
  prisma.produk.findMany({ where: { id_umkm } });

const findAll = (filter = {}) => prisma.produk.findMany({ where: filter });

const findAllWithFilter = async (filter, limit, offset) => {
  const where = {};
  
  if (filter.umkmId) {
    where.id_umkm = filter.umkmId;
  }
  
  if (filter.search) {
    where.OR = [
      { nama: { contains: filter.search, mode: 'insensitive' } },
      { deskripsi: { contains: filter.search, mode: 'insensitive' } }
    ];
  }
  
  const [products, total] = await Promise.all([
    prisma.produk.findMany({
      where,
      include: {
        profil_umkm: {
          select: {
            id_umkm: true,
            nama_usaha: true
          }
        }
      },
      take: limit,
      skip: offset,
      orderBy: {
        dibuat_pada: 'desc'
      }
    }),
    prisma.produk.count({ where })
  ]);
  
  const formattedProducts = products.map(item => ({
    id: item.id_produk,
    name: item.nama,
    description: item.deskripsi,
    price: item.harga,
    stock: item.stok,
    image: item.url_gambar,
    weight: item.berat_gram,
    seller: {
      id: item.profil_umkm.id_umkm,
      name: item.profil_umkm.nama_usaha
    }
  }));
  
  return { products: formattedProducts, total };
};

const update = (id_produk, data) =>
  prisma.produk.update({ where: { id_produk }, data });

const remove = (id_produk) =>
  prisma.produk.delete({ where: { id_produk } });

module.exports = { 
  create, 
  findById, 
  findAllByUmkmId, 
  findAll, 
  findAllWithFilter,
  update, 
  remove 
};
