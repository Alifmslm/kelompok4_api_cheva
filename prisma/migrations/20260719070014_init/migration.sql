-- CreateTable
CREATE TABLE `pengguna` (
    `id_pengguna` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `kata_sandi` VARCHAR(191) NOT NULL,
    `peran` ENUM('admin', 'seller', 'buyer') NOT NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `nomor_telepon` VARCHAR(191) NULL,
    `foto_profil` VARCHAR(191) NULL,

    UNIQUE INDEX `pengguna_email_key`(`email`),
    PRIMARY KEY (`id_pengguna`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alamat_buyer` (
    `id_alamat` INTEGER NOT NULL AUTO_INCREMENT,
    `label_alamat` VARCHAR(191) NOT NULL,
    `nama_penerima` VARCHAR(191) NOT NULL,
    `alamat_lengkap` TEXT NOT NULL,
    `negara` VARCHAR(191) NOT NULL,
    `alamat_utama` BOOLEAN NOT NULL,
    `nomor_telepon` VARCHAR(191) NOT NULL,
    `foto_profil` VARCHAR(191) NULL,
    `id_pengguna` INTEGER NOT NULL,

    PRIMARY KEY (`id_alamat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profil_umkm` (
    `id_umkm` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_usaha` VARCHAR(191) NOT NULL,
    `url_dokumen_legalitas` VARCHAR(191) NOT NULL,
    `status_verifikasi` ENUM('pending', 'under_review', 'approved', 'rejected') NOT NULL,
    `alamat` TEXT NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `diajukan_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diverifikasi_pada` DATETIME(3) NULL,
    `id_pengguna` INTEGER NOT NULL,

    UNIQUE INDEX `profil_umkm_id_pengguna_key`(`id_pengguna`),
    PRIMARY KEY (`id_umkm`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_verifikasi` (
    `id_log` INTEGER NOT NULL AUTO_INCREMENT,
    `aksi` ENUM('review', 'approve', 'reject') NOT NULL,
    `alasan` TEXT NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_umkm` INTEGER NOT NULL,
    `id_admin` INTEGER NOT NULL,

    PRIMARY KEY (`id_log`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produk` (
    `id_produk` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NULL,
    `harga` INTEGER NOT NULL,
    `stok` INTEGER NOT NULL,
    `url_gambar` VARCHAR(191) NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diperbarui_pada` DATETIME(3) NOT NULL,
    `berat_gram` INTEGER NOT NULL,
    `id_umkm` INTEGER NOT NULL,

    PRIMARY KEY (`id_produk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `keranjang` (
    `id_keranjang` INTEGER NOT NULL AUTO_INCREMENT,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_pengguna` INTEGER NOT NULL,

    UNIQUE INDEX `keranjang_id_pengguna_key`(`id_pengguna`),
    PRIMARY KEY (`id_keranjang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_keranjang` (
    `id_item_keranjang` INTEGER NOT NULL AUTO_INCREMENT,
    `jumlah` INTEGER NOT NULL,
    `id_keranjang` INTEGER NOT NULL,
    `id_produk` INTEGER NOT NULL,

    PRIMARY KEY (`id_item_keranjang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pesanan` (
    `id_pesanan` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('pending_payment', 'processing', 'shipped', 'completed', 'cancelled') NOT NULL,
    `total_harga` INTEGER NOT NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `diperbarui_pada` DATETIME(3) NOT NULL,
    `kurir` VARCHAR(191) NULL,
    `ongkos_kirim` INTEGER NOT NULL,
    `kode_resi` VARCHAR(191) NULL,
    `id_pengguna` INTEGER NOT NULL,
    `id_alamat` INTEGER NOT NULL,

    PRIMARY KEY (`id_pesanan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `item_pesanan` (
    `id_item_pesanan` INTEGER NOT NULL AUTO_INCREMENT,
    `jumlah` INTEGER NOT NULL,
    `harga` INTEGER NOT NULL,
    `id_pesanan` INTEGER NOT NULL,
    `id_produk` INTEGER NOT NULL,

    PRIMARY KEY (`id_item_pesanan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembayaran` (
    `id_pembayaran` INTEGER NOT NULL AUTO_INCREMENT,
    `penyedia` VARCHAR(191) NOT NULL,
    `status` ENUM('pending', 'paid', 'failed') NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `referensi_transaksi` VARCHAR(191) NULL,
    `dibuat_pada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_pesanan` INTEGER NOT NULL,

    UNIQUE INDEX `pembayaran_id_pesanan_key`(`id_pesanan`),
    PRIMARY KEY (`id_pembayaran`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alamat_buyer` ADD CONSTRAINT `alamat_buyer_id_pengguna_fkey` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna`(`id_pengguna`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profil_umkm` ADD CONSTRAINT `profil_umkm_id_pengguna_fkey` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna`(`id_pengguna`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_verifikasi` ADD CONSTRAINT `log_verifikasi_id_umkm_fkey` FOREIGN KEY (`id_umkm`) REFERENCES `profil_umkm`(`id_umkm`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_verifikasi` ADD CONSTRAINT `log_verifikasi_id_admin_fkey` FOREIGN KEY (`id_admin`) REFERENCES `pengguna`(`id_pengguna`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `produk` ADD CONSTRAINT `produk_id_umkm_fkey` FOREIGN KEY (`id_umkm`) REFERENCES `profil_umkm`(`id_umkm`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `keranjang` ADD CONSTRAINT `keranjang_id_pengguna_fkey` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna`(`id_pengguna`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_keranjang` ADD CONSTRAINT `item_keranjang_id_keranjang_fkey` FOREIGN KEY (`id_keranjang`) REFERENCES `keranjang`(`id_keranjang`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_keranjang` ADD CONSTRAINT `item_keranjang_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `produk`(`id_produk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanan` ADD CONSTRAINT `pesanan_id_pengguna_fkey` FOREIGN KEY (`id_pengguna`) REFERENCES `pengguna`(`id_pengguna`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pesanan` ADD CONSTRAINT `pesanan_id_alamat_fkey` FOREIGN KEY (`id_alamat`) REFERENCES `alamat_buyer`(`id_alamat`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_pesanan` ADD CONSTRAINT `item_pesanan_id_pesanan_fkey` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan`(`id_pesanan`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `item_pesanan` ADD CONSTRAINT `item_pesanan_id_produk_fkey` FOREIGN KEY (`id_produk`) REFERENCES `produk`(`id_produk`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pembayaran` ADD CONSTRAINT `pembayaran_id_pesanan_fkey` FOREIGN KEY (`id_pesanan`) REFERENCES `pesanan`(`id_pesanan`) ON DELETE RESTRICT ON UPDATE CASCADE;
