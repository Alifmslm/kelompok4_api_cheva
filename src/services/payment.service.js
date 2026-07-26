const prisma = require('../config/database');
const ApiError = require('../utils/ApiError');

const getTransactions = async (userId, { status, page, limit }) => {
  const offset = (page - 1) * limit;
  
  const where = {
    pesanan: {
      id_pengguna: userId
    }
  };

  if (status) {
    where.status = status;
  }

  const [transactions, total] = await Promise.all([
    prisma.pembayaran.findMany({
      where,
      include: {
        pesanan: {
          select: {
            id_pesanan: true,
            status: true,
            total_harga: true
          }
        }
      },
      orderBy: {
        dibuat_pada: 'desc'
      },
      take: limit,
      skip: offset
    }),
    prisma.pembayaran.count({ where })
  ]);

  const formattedTransactions = transactions.map(tx => ({
    id_pembayaran: tx.id_pembayaran,
    penyedia: tx.penyedia,
    status: tx.status,
    jumlah: tx.jumlah,
    referensi_transaksi: tx.referensi_transaksi,
    dibuat_pada: tx.dibuat_pada,
    id_pesanan: tx.id_pesanan
  }));

  return {
    transactions: formattedTransactions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getTransactionById = async (userId, transactionId) => {
  const transaction = await prisma.pembayaran.findUnique({
    where: { id_pembayaran: transactionId },
    include: {
      pesanan: {
        select: {
          id_pesanan: true,
          id_pengguna: true,
          status: true,
          total_harga: true,
          ongkos_kirim: true
        }
      }
    }
  });

  if (!transaction) {
    throw new ApiError(404, 'Transaksi tidak ditemukan');
  }

  if (transaction.pesanan.id_pengguna !== userId) {
    throw new ApiError(403, 'Tidak memiliki akses ke transaksi ini');
  }

  return {
    id_pembayaran: transaction.id_pembayaran,
    penyedia: transaction.penyedia,
    status: transaction.status,
    jumlah: transaction.jumlah,
    referensi_transaksi: transaction.referensi_transaksi,
    dibuat_pada: transaction.dibuat_pada,
    pesanan: {
      id_pesanan: transaction.pesanan.id_pesanan,
      status: transaction.pesanan.status,
      total_harga: transaction.pesanan.total_harga,
      ongkos_kirim: transaction.pesanan.ongkos_kirim
    }
  };
};

const getTransactionStatus = async (userId, transactionId) => {
  const transaction = await prisma.pembayaran.findUnique({
    where: { id_pembayaran: transactionId },
    include: {
      pesanan: {
        select: {
          id_pengguna: true
        }
      }
    }
  });

  if (!transaction) {
    throw new ApiError(404, 'Transaksi tidak ditemukan');
  }

  if (transaction.pesanan.id_pengguna !== userId) {
    throw new ApiError(403, 'Tidak memiliki akses ke transaksi ini');
  }

  return {
    id_pembayaran: transaction.id_pembayaran,
    status: transaction.status,
    dibuat_pada: transaction.dibuat_pada,
    referensi_transaksi: transaction.referensi_transaksi
  };
};

const getTransactionTimeline = async (userId, transactionId) => {
  const transaction = await prisma.pembayaran.findUnique({
    where: { id_pembayaran: transactionId },
    include: {
      pesanan: {
        select: {
          id_pengguna: true,
          status: true,
          dibuat_pada: true,
          diperbarui_pada: true
        }
      }
    }
  });

  if (!transaction) {
    throw new ApiError(404, 'Transaksi tidak ditemukan');
  }

  if (transaction.pesanan.id_pengguna !== userId) {
    throw new ApiError(403, 'Tidak memiliki akses ke transaksi ini');
  }

  const timeline = [];

  timeline.push({
    event: 'Pesanan dibuat',
    status: 'pending_payment',
    timestamp: transaction.pesanan.dibuat_pada
  });

  timeline.push({
    event: 'Pembayaran dibuat',
    status: transaction.status,
    timestamp: transaction.dibuat_pada
  });

  if (transaction.status === 'paid') {
    timeline.push({
      event: 'Pembayaran berhasil',
      status: 'paid',
      timestamp: transaction.dibuat_pada
    });
  }

  if (transaction.status === 'failed') {
    timeline.push({
      event: 'Pembayaran gagal',
      status: 'failed',
      timestamp: transaction.dibuat_pada
    });
  }

  if (transaction.pesanan.status === 'processing') {
    timeline.push({
      event: 'Pesanan diproses',
      status: 'processing',
      timestamp: transaction.pesanan.diperbarui_pada
    });
  }

  if (transaction.pesanan.status === 'shipped') {
    timeline.push({
      event: 'Pesanan dikirim',
      status: 'shipped',
      timestamp: transaction.pesanan.diperbarui_pada
    });
  }

  if (transaction.pesanan.status === 'completed') {
    timeline.push({
      event: 'Pesanan selesai',
      status: 'completed',
      timestamp: transaction.pesanan.diperbarui_pada
    });
  }

  if (transaction.pesanan.status === 'cancelled') {
    timeline.push({
      event: 'Pesanan dibatalkan',
      status: 'cancelled',
      timestamp: transaction.pesanan.diperbarui_pada
    });
  }

  return {
    id_pembayaran: transaction.id_pembayaran,
    timeline: timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  };
};

module.exports = {
  getTransactions,
  getTransactionById,
  getTransactionStatus,
  getTransactionTimeline
};
