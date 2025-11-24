// dataUsulanHapus.ts

export type UsulanHapus = {
  idUsulan: number;
  idBMN?: number; 
  ikmm: string; 
  akun: number;
  bidang: "MTI" | "BDI" | "TU";
  namaBarang: string;
  unit: number;
  kategori:
    | "Laptop"
    | "Monitor"
    | "Printer"
    | "TV"
    | "Peripheral"
    | "Internet"
    | "Lainnya";
  kondisiBarang: "Baik" | "Rusak" | "Dalam Perbaikan";
  tanggalUsulan: string; // format ISO (YYYY-MM-DD)
  alasan: string;
  statusUsulan: "Menunggu" | "Disetujui" | "Ditolak";
  disetujuiOleh?: string; // optional
  tanggalPerolehan?: string; // ditambah supaya bisa dipindah ke logBMN
};

export const dataUsulanHapus: UsulanHapus[] = [
  {
    idUsulan: 1,
    idBMN: 101, // tambahkan idBMN biar bisa dihapus dari tabel BMN
    ikmm: "3100102002",
    akun: 132111,
    bidang: "BDI",
    namaBarang: "Printer Epson L3150",
    unit: 2,
    kategori: "Printer",
    kondisiBarang: "Rusak",
    tanggalUsulan: "2025-10-20",
    alasan: "Sudah tidak berfungsi dan tidak bisa diperbaiki",
    statusUsulan: "Menunggu",
    tanggalPerolehan: "2023-06-10", // contoh
  },
  {
    idUsulan: 2,
    idBMN: 102,
    ikmm: "3100102003",
    akun: 132111,
    bidang: "MTI",
    namaBarang: "Monitor Dell 24 inch",
    unit: 1,
    kategori: "Monitor",
    kondisiBarang: "Baik",
    tanggalUsulan: "2025-09-30",
    alasan: "Sudah tidak digunakan",
    statusUsulan: "Disetujui",
    disetujuiOleh: "Kepala Subbag BMN",
    tanggalPerolehan: "2022-08-15",
  },
];
