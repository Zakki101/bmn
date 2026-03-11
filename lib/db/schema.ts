import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * BMN Assets Table
 */
export const bmn = sqliteTable("bmn", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ikmm: text("ikmm").notNull(),
  akun: integer("akun").notNull().default(132111),
  bidang: text("bidang").notNull(), // "MTI" | "BDI" | "TU"
  unit: integer("unit").notNull(), // NUP
  namaBarang: text("nama_barang").notNull(),
  kategori: text("kategori").notNull(),
  kondisiBarang: text("kondisi_barang").notNull().default("Baik"), // "Baik" | "Rusak" | "Dalam Perbaikan"
  tanggalPerolehan: text("tanggal_perolehan").notNull(), // Using text for compatibility with existing format or ISO
  dipinjam: text("dipinjam").notNull().default("Tersedia"), // "Dipinjam" | "Tersedia" | "Tidak Tersedia"
  foto: text("foto"), // Store as JSON string array if multiple
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
