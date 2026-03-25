export type BMN = {
  idBMN: number;
  ikmm: string;
  kodeAkun: string;
  bidang: "MTI" | "BDI" | "TU";
  nup: number;
  namaBarang: string;
  kategori:
  | "Laptop/Server"
  | "Monitor"
  | "Printer"
  | "TV"
  | "Furniture"
  | "Jaringan"
  | "Elektronik"
  | "Peripheral"
  | "Lainnya";
  kondisiBarang: "Baik" | "Rusak" | "Dalam Perbaikan";
  tanggalPerolehan: string;
  status: "Dipinjam" | "Tersedia" | "Tidak Tersedia";
  foto?: string[];
};

export const dataBMN: BMN[] = [
  {
    idBMN: 1,
    ikmm: "3100102002",
    kodeAkun: "132111",
    nup: 1,
    bidang: "BDI",
    namaBarang: "Lenovo IdeaPad 3 14/TL6",
    kategori: "Laptop/Server",
    kondisiBarang: "Baik",
    tanggalPerolehan: "26/08/2024",
    status: "Dipinjam",
  },
  {
    idBMN: 2,
    ikmm: "3100102002",
    kodeAkun: "132111",
    bidang: "BDI",
    nup: 2,
    namaBarang: "Lenovo IdeaPad 3 14/TL6",
    kategori: "Laptop/Server",
    kondisiBarang: "Baik",
    tanggalPerolehan: "26/08/2024",
    status: "Dipinjam",
  },
  {
    idBMN: 3,
    ikmm: "3100102002",
    kodeAkun: "132111",
    bidang: "MTI",
    nup: 3,
    namaBarang: "Lenovo IdeaPad 3 14/TL6",
    kategori: "Laptop/Server",
    kondisiBarang: "Baik",
    tanggalPerolehan: "26/08/2024",
    status: "Tersedia",
  },
  {
    idBMN: 4,
    ikmm: "3100102005",
    kodeAkun: "132111",
    bidang: "TU",
    nup: 1,
    namaBarang: "HP LaserJet Pro M404dn",
    kategori: "Printer",
    kondisiBarang: "Baik",
    tanggalPerolehan: "15/03/2023",
    status: "Dipinjam",
  },
  {
    idBMN: 5,
    ikmm: "3100102006",
    kodeAkun: "132111",
    bidang: "TU",
    nup: 2,
    namaBarang: "HP LaserJet Pro M404dn",
    kategori: "Printer",
    kondisiBarang: "Baik",
    tanggalPerolehan: "15/03/2023",
    status: "Tersedia",
  },
  {
    idBMN: 6,
    ikmm: "3100102007",
    kodeAkun: "132111",
    bidang: "BDI",
    nup: 1,
    namaBarang: "Dell 24-inch UltraSharp Monitor",
    kategori: "Monitor",
    kondisiBarang: "Baik",
    tanggalPerolehan: "09/11/2022",
    status: "Dipinjam",
  },
  {
    idBMN: 7,
    ikmm: "3100102007",
    kodeAkun: "132111",
    bidang: "MTI",
    nup: 2,
    namaBarang: "Dell 24-inch UltraSharp Monitor",
    kategori: "Monitor",
    kondisiBarang: "Dalam Perbaikan",
    tanggalPerolehan: "09/11/2022",
    status: "Tidak Tersedia",
  },
  {
    idBMN: 8,
    ikmm: "3100102007",
    kodeAkun: "132111",
    bidang: "MTI",
    nup: 3,
    namaBarang: "Dell 24-inch UltraSharp Monitor",
    kategori: "Monitor",
    kondisiBarang: "Baik",
    tanggalPerolehan: "09/11/2022",
    status: "Dipinjam",
  },
  {
    idBMN: 9,
    ikmm: "3100102010",
    kodeAkun: "132111",
    bidang: "TU",
    nup: 1,
    namaBarang: "LG 43-inch Smart TV",
    kategori: "TV",
    kondisiBarang: "Baik",
    tanggalPerolehan: "20/10/2021",
    status: "Dipinjam",
  },
  {
    idBMN: 10,
    ikmm: "3100102010",
    kodeAkun: "132111",
    bidang: "TU",
    nup: 2,
    namaBarang: "LG 43-inch Smart TV",
    kategori: "TV",
    kondisiBarang: "Baik",
    tanggalPerolehan: "20/10/2021",
    status: "Dipinjam",
  },
  {
    idBMN: 11,
    ikmm: "3100203017",
    kodeAkun: "132111",
    bidang: "MTI",
    nup: 1,
    namaBarang: "Seagate Expansion 1TB External Hard Drive",
    kategori: "Peripheral",
    kondisiBarang: "Baik",
    tanggalPerolehan: "10/09/2023",
    status: "Dipinjam",
  },
  {
    idBMN: 12,
    ikmm: "3100203017",
    kodeAkun: "132111",
    bidang: "BDI",
    nup: 2,
    namaBarang: "Seagate Expansion 1TB External Hard Drive",
    kategori: "Peripheral",
    kondisiBarang: "Rusak",
    tanggalPerolehan: "10/09/2023",
    status: "Tidak Tersedia",
  },
  {
    idBMN: 13,
    ikmm: "3100203017",
    kodeAkun: "132111",
    bidang: "MTI",
    nup: 3,
    namaBarang: "Seagate Expansion 1TB External Hard Drive",
    kategori: "Peripheral",
    kondisiBarang: "Baik",
    tanggalPerolehan: "10/09/2023",
    status: "Dipinjam",
  },
  {
    idBMN: 14,
    ikmm: "3100203017",
    kodeAkun: "132111",
    bidang: "TU",
    nup: 4,
    namaBarang: "Seagate Expansion 1TB External Hard Drive",
    kategori: "Peripheral",
    kondisiBarang: "Baik",
    tanggalPerolehan: "10/09/2023",
    status: "Tersedia",
  },
];
