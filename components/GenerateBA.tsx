"user client";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Peminjaman } from "@/data/dataPeminjaman";
import { TbTextDecrease } from "react-icons/tb";

const formatDate = (date: string | null) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatSuratDate = (dateString: string | null) => {
  if (!dateString) return "-";
  
  // Cek format DD/MM/YYYY
  if (dateString.includes("/")) {
    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    const monthName = date.toLocaleString("id-ID", { month: "long" });
    return `Jakarta, ${day} ${monthName} ${year}`;
  }

  // Fallback jika format valid ISO
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const day = date.getDate();
    const monthName = date.toLocaleString("id-ID", { month: "long" });
    const year = date.getFullYear();
    return `Jakarta, ${day} ${monthName} ${year}`;
  }

  // Kalau semua gagal, kembalikan string aslinya
  return dateString;
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 72,
    paddingRight: 72,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.2,
  },

  // HEADER
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  logoBox: {
    width: 60,
    height: 60,
    marginRight: 10,
  },

  kopSuratContainer: {
    flexGrow: 1,
    textAlign: "center",
    alignItems: "center",
  },

  kop1: {
    fontSize: 12.5,
    fontWeight: 500,
    textAlign: "center",
  },

  kop1Bold: {
    fontSize: 12.5,
    fontWeight: 700,
    textAlign: "center",
  },

  kop3: {
    fontSize: 8,
    marginTop: 2,
    textAlign: "center",
  },

  headerLine: {
    height: 1.5,
    backgroundColor: "#000",
    marginTop: 2,
    marginBottom: 5,
    width: "100%",
  },

  // TITLE
  title: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: 700,
    marginTop: 10,
    marginBottom: 10,
  },

  infoTable: {
    width: "100%",
    fontSize: 10,
    marginBottom: 10,
    marginTop: 10,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  infoLabel: { width: "30%" },
  infoColon: { width: "4%" },
  infoValue: { width: "66%" },

  daftarTitle: {
    fontWeight: 700,
    marginTop: 12,
    marginBottom: 4,
    fontSize: 10,
  },

  tableHeader: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 6,
    backgroundColor: "#f2f2f2",
    fontWeight: 700,
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 6,
    fontSize: 10,
    alignItems: "center",
  },

  colNo: { width: "8%", textAlign: "center" },
  colNama: { width: "33%", paddingLeft: 4 },
  colJumlah: { width: "12%", textAlign: "center" },
  colStatus: { width: "14%", textAlign: "center" },
  colKet: { width: "18%", paddingLeft: 4 },
  colIKMM: { width: "15%", textAlign: "center" },

  titleKetentuan: {
    fontSize: 10,
    marginTop: 10,
  },

  ketentuan: {
    fontSize: 10,
    marginTop: 2,
    textAlign: "justify",
  },

  // TANDA TANGAN
  ttdContainer: {
    marginTop: 20,
  },

  ttdRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  ttdCol: {
    width: "45%",
    textAlign: "center",
    fontSize: 10,
  },

  ttdMengetahui: {
    marginTop: 10,
    width: "100%",
    textAlign: "center",
    fontSize: 10,
  },

  ttdSpace: {
    height: 60,
  },

  // FOOTER
  footerList: {
  position: "absolute",
  bottom: 30,    
  left: 72,       
  fontSize: 8,
  lineHeight: 1.3,
  },
  footerTitle: {
    fontWeight: 700,
    textDecoration: "underline",
    marginBottom: 2,
  },
  footerItem: {
    marginLeft: 10,
  }, 

  // LAMPIRAN
  lampiranTitle: {
  fontSize: 12,
  fontWeight: "bold",
  marginBottom: 16,
  textDecoration: "underline",
  },

  lampiranItem: {
    marginBottom: 18,
  },

  lampiranText: {
    fontSize: 11,
    marginBottom: 6,
  },

  placeholderBox: {
    borderWidth: 1,
    borderColor: "#000",
    height: 80,
    width: "100%",
  },

  // FOTO
  img: {
    width: "60%",
    height: "60%",
    borderWidth: 1,
    borderColor: "#000",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
  },
});

const GenerateBA: React.FC<{ data: Peminjaman }> = ({ data }) => {
  return (
    <Document>
      {/* ======================= PAGE 1 ======================= */}
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
       <View>
          <View style={styles.headerRow}>
            <Image src="/logopu.png" style={styles.logoBox} />

            <View style={styles.kopSuratContainer}>
              <Text style={styles.kop1}>KEMENTERIAN PEKERJAAN UMUM</Text>
              <Text style={styles.kop1Bold}>SEKRETARIAT JENDERAL</Text>
              <Text style={styles.kop1}>PUSAT DATA DAN TEKNOLOGI INFORMASI</Text>
              <Text style={styles.kop3}>
                Jalan Pattimura Nomor 20, Kebayoran Baru, Jakarta 12110, Telepon 7232366 Faksimili 220219
              </Text>
              <View style={styles.headerLine} />
            </View>
          </View>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>FORM PEMINJAMAN BMN</Text>

        {/* INFO */}
        <View style={styles.infoTable}>
          {[
            ["Nomor", data.nomorPeminjaman],
            ["Nama Peminjam", data.namaPeminjam],
            ["Tujuan", data.tujuan],
            ["Jenis BMN", data.kategori],
            ["Tanggal Peminjaman", formatDate(data.tanggalPinjam)],
            ["Tanggal Pengembalian", formatDate(data.tanggalSelesai)],
          ].map(([label, value], i) => (
            <View style={styles.infoRow} key={i}>
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoColon}>:</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* DAFTAR BARANG */}
        <Text style={styles.daftarTitle}>DAFTAR ALAT/BARANG YANG DIPINJAM:</Text>

        {/* TABLE HEADER */}
        <View style={styles.tableHeader}>
          <Text style={styles.colNo}>No</Text>
          <Text style={styles.colNama}>Nama/Merek/ Tipe</Text>
          <Text style={styles.colJumlah}>Jumlah</Text>
          <Text style={styles.colStatus}>Kondisi</Text>
          <Text style={styles.colKet}>Keterangan</Text>
          <Text style={styles.colIKMM}>IKMM</Text>
        </View>

        {/* ONLY ONE BARANG (from Peminjaman) */}
        <View style={styles.tableRow}>
          <Text style={styles.colNo}>1</Text>
          <Text style={styles.colNama}>{data.namaBarang}</Text>
          <Text style={styles.colJumlah}>{data.jumlahPinjam}</Text>
          <Text style={styles.colStatus}>Baik</Text>
          <Text style={styles.colKet}>{data.keterangan || "-"}</Text>
          <Text style={styles.colIKMM}>{data.ikmm}</Text>
        </View>

        {/* KETENTUAN */}
        <Text style={styles.titleKetentuan}>Ketentuan:</Text>
        <Text style={styles.ketentuan}>
          1. Peminjam barang bertanggung jawab atas pemakaian barang selama
          periode peminjaman;
        </Text>
        <Text style={styles.ketentuan}>
          2. Segala sesuatu yang berkaitan dengan perawatan, pemeliharaan,
          kerusakan dan/atau kehilangan atas barang yang dipinjamkan menjadi
          tanggung jawab pemakai;
        </Text>
        <Text style={styles.ketentuan}>
          3. Pemakaian barang oleh Konsultan Individual akan berakhir setelah
          masa kontrak kerja selesai sehingga barang yang dipinjam harus
          dikembalikan seminggu setelah masa kontrak kerja selesai;
        </Text>
        <Text style={styles.ketentuan}>
          4. Saat pengembalian barang, segala kelengkapan dan kondisi barang
          harus sesuai dengan pada saat barang diterima.
        </Text>
        
    
        {/* TTD */}
        <View style={styles.ttdContainer}>

          <View style={styles.ttdRow}>

            {/* MENYERAHKAN */}
            <View style={styles.ttdCol}>
              <Text>Yang Menyerahkan</Text>
              <Text>Petugas BMN Bidang Data dan Informasi </Text>
              <View style={styles.ttdSpace} />
              <Text style={{ textDecoration: "underline" }}>Gama Ilmy Hartanto</Text>
              <Text>NIP. 19820626 201012 1 004</Text>
              <Text></Text>
            </View>

            {/* TANGGAL + MENERIMA */}
            <View style={styles.ttdCol}>
              <Text>{formatSuratDate(data.tanggalPinjam)}</Text>
              <Text>Yang Menerima</Text>
              <View style={styles.ttdSpace} />
              <Text style={{ textDecoration: "underline" }}>{data.namaPeminjam}</Text>
              <Text>NIP. {data.nip}</Text>
            </View>

          </View>

          {/* MENGETAHUI */}
          <View style={styles.ttdMengetahui}>
            <Text style={{ fontWeight: 700, textDecoration: "underline" }}>Mengetahui</Text>
            <Text>Kepala Bidang Data dan Informasi</Text>
            <View style={styles.ttdSpace} />
            <Text style={{ textDecoration: "underline" }}>Komang Sri Hartini</Text>
            <Text>NIP. 198212272005022001</Text>
          </View>
        </View>
      
        <View style={styles.footerList}>
          <Text style={styles.footerTitle}>Keterangan:</Text>
          <Text style={styles.footerItem}>
            1. Perpanjangan BMN wajib melapor (cek bmn dan mengisi form peminjaman);
          </Text>
          <Text style={styles.footerItem}>
            2. Pengembalian BMN wajib melapor (cek bmn dan paraf form peminjaman);
          </Text>
          <Text style={styles.footerItem}>
            3. Ketentuan sesuai dengan arahan pimpinan.
          </Text>
        </View>
      </Page>

      {/* PAGE 2 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.lampiranTitle}>Lampiran Dokumentasi Barang</Text>

        {/* ITEM 1 */}
        <View style={styles.lampiranItem}>
          <Text style={styles.lampiranText}>1. Barang Tampak Depan</Text>
          <View style={styles.placeholderBox} />
        </View>

        {/* ITEM 2 */}
        <View style={styles.lampiranItem}>
          <Text style={styles.lampiranText}>2. Barang Tampak Belakang</Text>
          <View style={styles.placeholderBox} />
        </View>

        {/* ITEM 3 */}
        <View style={styles.lampiranItem}>
          <Text style={styles.lampiranText}>3. Tambahan </Text>
          <View style={styles.placeholderBox} />
        </View>

        {/* ITEM 4 — BUKTI PENYERAHAN */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.lampiranText}>4. Bukti Penyerahan</Text>

          {Array.isArray(data.foto) && data.foto.length > 0 ? (
            data.foto.map((img, i) => (
              <View key={i} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 10 }}></Text>
                <Image
                  src={img}
                  style={styles.img}
                />
              </View>
            ))
          ) : (
            <View style={styles.placeholderBox} />
          )}
        </View>
      </Page>
    </Document>
  );
};

export default GenerateBA;
