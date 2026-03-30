import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * BMN Assets Table
 */
export const bmn = sqliteTable("bmn", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  kodeSatker: text("kode_satker"),
  ikmm: text("ikmm").notNull(), // From Excel Col C
  kodeAkun: text("kode_akun"), // From Excel Col B
  bidang: text("bidang"), // Default null/default
  nup: integer("nup"), // From Excel Col D
  namaBarang: text("nama_barang").notNull(), // From Excel Col E
  merkType: text("merk_type"), // From Excel Col F
  kuantitas: integer("kuantitas").default(1), // From Excel Col J
  satuan: text("satuan"), // From Excel Col G
  kategori: text("kategori"), // Enum: Laptop, PC / Server, Printer / Scanner, Furniture, Multimedia, Elektronik, Telekomunikasi, Jaringan, Kendaraan, Peralatan Kantor, Lainnya
  kondisiBarang: text("kondisi_barang").notNull().default("Baik"), // From Excel Col I
  tanggalPerolehan: text("tanggal_perolehan").notNull(), // From Excel Col H
  nilaiPerolehan: integer("nilai_perolehan"), // From Excel Col K
  mutasiBmn: integer("mutasi_bmn"), // From Excel Col L
  nilaiBmn: integer("nilai_bmn"), // From Excel Col M
  nilaiPenyusutan: integer("nilai_penyusutan"), // From Excel Col N
  nilaiBuku: integer("nilai_buku"), // From Excel Col O
  status: text("status").notNull().default("Tersedia"), // From Excel Col P
  foto: text("foto"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Peminjaman Table
 */
export const peminjaman = sqliteTable("peminjaman", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nomorPeminjaman: text("nomor_peminjaman").notNull().unique(),
  namaPeminjam: text("nama_peminjam").notNull(),
  statusPegawai: text("status_pegawai").notNull(), // "PPPK" | "KI" | "PNS" | "Magang"
  pangkatGolongan: text("pangkat_golongan"),
  jabatan: text("jabatan"),
  nip: text("nip").notNull(),
  bmnId: integer("bmn_id")
    .notNull()
    .references(() => bmn.id, { onDelete: "cascade" }),
  jumlahPinjam: integer("jumlah_pinjam").notNull().default(1),
  tanggalPinjam: text("tanggal_pinjam").notNull(),
  tanggalSelesai: text("tanggal_selesai"),
  tujuan: text("tujuan"),
  keterangan: text("keterangan"),
  statusPeminjaman: text("status_peminjaman").notNull().default("Aktif"), // "Aktif" | "Selesai" | "Terlambat"
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Usulan Penghapusan Table
 */
export const usulanHapus = sqliteTable("usulan_hapus", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bmnId: integer("bmn_id")
    .notNull()
    .references(() => bmn.id, { onDelete: "cascade" }),
  tanggalUsulan: text("tanggal_usulan").notNull(),
  alasan: text("alasan").notNull(),
  statusUsulan: text("status_usulan").notNull().default("Menunggu"), // "Menunggu" | "Disetujui" | "Ditolak"
  disetujuiOleh: text("disetujui_oleh"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

/**
 * Log Hapus Table
 * Menyimpan riwayat BMN yang dihapus
 */
export const logHapus = sqliteTable("log_hapus", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bmnId: integer("bmn_id"), // Reference to original ID if needed
  kodeSatker: text("kode_satker"),
  ikmm: text("ikmm").notNull(),
  kodeAkun: text("kode_akun"),
  bidang: text("bidang"),
  nup: integer("nup"),
  namaBarang: text("nama_barang").notNull(),
  merkType: text("merk_type"),
  kuantitas: integer("kuantitas").default(1),
  satuan: text("satuan"),
  kategori: text("kategori"),
  kondisiBarang: text("kondisi_barang").notNull().default("Baik"),
  tanggalPerolehan: text("tanggal_perolehan").notNull(),
  tanggalHapus: text("tanggal_hapus"), // dari tanggal_usulan
  alasanHapus: text("alasan_hapus"), // dari alasan
  disetujuiOleh: text("disetujui_oleh"), // dari disetujuiOleh
  nilaiPerolehan: integer("nilai_perolehan"),
  mutasiBmn: integer("mutasi_bmn"),
  nilaiBmn: integer("nilai_bmn"),
  nilaiPenyusutan: integer("nilai_penyusutan"),
  nilaiBuku: integer("nilai_buku"),
  status: text("status").notNull().default("Dihapus"),
  foto: text("foto"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
