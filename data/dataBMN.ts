export type BMN = {
  idBMN: number;
  ikmm: string;
  akun: number;
  unit: number;
  namaBarang: string;
  kategori:
    | "Laptop"
    | "Monitor"
    | "Printer"
    | "TV"
    | "Peripheral"
    | "Internet"
    | "Lainnya";
  kondisiBarang: "Baik" | "Rusak" | "Dalam Perbaikan";
  tanggalPerolehan: string;
  dipinjam: "Dipinjam" | "Tersedia" | "Tidak Tersedia";
  foto?: string [];
};

export const dataBMN: BMN[] = [
  {
    idBMN: 1,
    ikmm: "3100102002",
    akun: 132111,
    unit: 1,
    namaBarang: "Lenovo IdeaPad 3 14/TL6",
    kategori: "Laptop",
    kondisiBarang: "Baik",
    tanggalPerolehan: "26/08/2024",
    dipinjam: "Dipinjam",
  },
  {
    idBMN: 2,
    ikmm: "3100102002",
    akun: 132111,
    unit: 2,
    namaBarang: "Lenovo IdeaPad 3 14/TL6",
    kategori: "Laptop",
    kondisiBarang: "Baik",
    tanggalPerolehan: "26/08/2024",
    dipinjam: "Dipinjam",
  },
  {
    idBMN: 3,
    ikmm: "3100102002",
    akun: 132111,
    unit: 3,
    namaBarang: "Lenovo IdeaPad 3 14/TL6",
    kategori: "Laptop",
    kondisiBarang: "Baik",
    tanggalPerolehan: "26/08/2024",
    dipinjam: "Tersedia",
  },
  {
    idBMN: 4,
    ikmm: "3100102005",
    akun: 132111,
    unit: 1,
    namaBarang: "HP LaserJet Pro M404dn",
    kategori: "Printer",
    kondisiBarang: "Baik",
    tanggalPerolehan: "15/03/2023",
    dipinjam: "Dipinjam",
  },
  {
    idBMN: 5,
    ikmm: "3100102006",
    akun: 132111,
    unit: 2,
    namaBarang: "HP LaserJet Pro M404dn",
    kategori: "Printer",
    kondisiBarang: "Baik",
    tanggalPerolehan: "15/03/2023",
    dipinjam: "Tersedia",
  },
  {
    idBMN: 6,
    ikmm: "3100102007",
    akun: 132111,
    unit: 1,
    namaBarang: "Dell 24-inch UltraSharp Monitor",
    kategori: "Monitor",
    kondisiBarang: "Baik",
    tanggalPerolehan: "09/11/2022",
    dipinjam: "Dipinjam",
  },
  {
    idBMN: 7,
    ikmm: "3100102007",
    akun: 132111,
    unit: 2,
    namaBarang: "Dell 24-inch UltraSharp Monitor",
    kategori: "Monitor",
    kondisiBarang: "Dalam Perbaikan",
    tanggalPerolehan: "09/11/2022",
    dipinjam: "Tidak Tersedia",
  },
  {
    idBMN: 8,
    ikmm: "3100102007",
    akun: 132111,
    unit: 3,
    namaBarang: "Dell 24-inch UltraSharp Monitor",
    kategori: "Monitor",
    kondisiBarang: "Baik",
    tanggalPerolehan: "09/11/2022",
    dipinjam: "Dipinjam",
  },
  {
    idBMN: 9,
    ikmm: "3100102010",
    akun: 132111,
    unit: 1,
    namaBarang: "LG 43-inch Smart TV",
    kategori: "TV",
    kondisiBarang: "Baik",
    tanggalPerolehan: "20/10/2021",
    dipinjam: "Dipinjam",
  },
  {
    idBMN: 10,
    ikmm: "3100102010",
    akun: 132111,
    unit: 2,
    namaBarang: "LG 43-inch Smart TV",
    kategori: "TV",
    kondisiBarang: "Baik",
    tanggalPerolehan: "20/10/2021",
    dipinjam: "Dipinjam",
  },
  {
    idBMN: 11,
    ikmm: "3100203017",
    akun: 132111,
    unit: 1,
    namaBarang: "Seagate Expansion 1TB External Hard Drive",
    kategori: "Peripheral",
    kondisiBarang: "Baik",
    tanggalPerolehan: "10/09/2023",
    dipinjam: "Dipinjam",
  },
  {
    idBMN: 12,
    ikmm: "3100203017",
    akun: 132111,
    unit: 2,
    namaBarang: "Seagate Expansion 1TB External Hard Drive",
    kategori: "Peripheral",
    kondisiBarang: "Rusak",
    tanggalPerolehan: "10/09/2023",
    dipinjam: "Tidak Tersedia",
  },
  {
    idBMN: 13,
    ikmm: "3100203017",
    akun: 132111,
    unit: 3,
    namaBarang: "Seagate Expansion 1TB External Hard Drive",
    kategori: "Peripheral",
    kondisiBarang: "Baik",
    tanggalPerolehan: "10/09/2023",
    dipinjam: "Dipinjam",
  },
  {
    idBMN: 14,
    ikmm: "3100203017",
    akun: 132111,
    unit: 4,
    namaBarang: "Seagate Expansion 1TB External Hard Drive",
    kategori: "Peripheral",
    kondisiBarang: "Baik",
    tanggalPerolehan: "10/09/2023",
    dipinjam: "Tersedia",
  },
];
