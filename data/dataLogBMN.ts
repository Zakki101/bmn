import { BMN } from "./dataBMN";

export type LogBMN = BMN & {
    
  tanggalPenghapusan: string;
  alasanPenghapusan: string;
  disetujuiOleh: string;
};

export const dataLogBMN: LogBMN[] = [
  {
    idBMN: 1,
    ikmm: "3100102001",
    akun: 132111,
    unit: 1,
    namaBarang: "Monitor LG 24MK600",
    kategori: "Monitor",
    kondisiBarang: "Rusak",
    tanggalPerolehan: "15/02/2022",
    dipinjam: "Tidak Tersedia",
    foto: "",
    tanggalPenghapusan: "01/11/2025",
    alasanPenghapusan: "Rusak berat dan tidak bisa diperbaiki",
    disetujuiOleh: "Admin Utama",
  },
  {
    idBMN: 2,
    ikmm: "3100102002",
    akun: 132111,
    unit: 1,
    namaBarang: "Printer Canon G3010",
    kategori: "Printer",
    kondisiBarang: "Rusak",
    tanggalPerolehan: "10/01/2021",
    dipinjam: "Tidak Tersedia",
    foto: "",
    tanggalPenghapusan: "03/11/2025",
    alasanPenghapusan: "Sudah tidak berfungsi dengan baik",
    disetujuiOleh: "Kepala Bagian BMN",
  },
];
