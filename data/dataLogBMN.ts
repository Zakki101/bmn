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
    kodeAkun: "132111",
    bidang: "BDI",
    nup: 1,
    namaBarang: "Monitor LG 24MK600",
    kategori: "Elektronik",
    kondisiBarang: "Rusak",
    tanggalPerolehan: "15/02/2022",
    status: "Tidak Tersedia",
    foto: [],
    tanggalPenghapusan: "01/11/2025",
    alasanPenghapusan: "Rusak berat dan tidak bisa diperbaiki",
    disetujuiOleh: "Admin Utama",
  },
  {
    idBMN: 2,
    ikmm: "3100102002",
    kodeAkun: "132111",
    bidang: "MTI",
    nup: 1,
    namaBarang: "Printer Canon G3010",
    kategori: "Printer / Scanner",
    kondisiBarang: "Rusak",
    tanggalPerolehan: "10/01/2021",
    status: "Tidak Tersedia",
    foto: [],
    tanggalPenghapusan: "03/11/2025",
    alasanPenghapusan: "Sudah tidak berfungsi dengan baik",
    disetujuiOleh: "Kepala Bagian BMN",
  },
];
