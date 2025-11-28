"user client";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import { Peminjaman } from "@/data/dataPeminjaman";
import { BMN } from "@/data/dataBMN";
import { StylesSIP as styles } from "./StylesSIP";

const getRomanMonth = (monthIndex: number) => {
  const romans = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
  return romans[monthIndex];
};

const lastNumber = 0; 
const newNumber = String(lastNumber + 1).padStart(3, "0");

const currentYear = new Date().getFullYear();
const currentMonthRoman = getRomanMonth(new Date().getMonth());

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
  
  return dateString;
};

const GenerateSIP: React.FC<{ data: Peminjaman }> = ({ data }) => {
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
        <Text style={styles.title}>
          SURAT IJIN PEMAKAIAN BARANG MILIK NEGARA{"\n"}
          NOMOR: {newNumber}/SIP/DATA/{currentMonthRoman}/{currentYear}
        </Text>

        {/* FORM 1 */}
        <Text style={styles.text}>
          Dalam rangka penggunaan Alat Pengolah Data pada Satuan Kerja Pusat Data dan Teknologi
          Informasi Kementerian Pekerjaan Umum, dengan ini:
        </Text>

        <View style={styles.form}>
          {[
            ["Nama", data.namaPeminjam],
            ["NIP", data.nip],
            ["Pangkat / Golongan", data.kategori],
            ["Jabatan", data.ikmm],
              ].map(([label, value], i) => (
                <View style={styles.infoRow} key={i}>
                  <Text style={styles.infoLabel}>{label}</Text>
                  <Text style={styles.infoColon}>:</Text>
                  <Text style={styles.infoValue}>{value}</Text>
                </View>
          ))}
        </View>
        
        {/* FORM 2 */}
        <Text style={styles.diizinkan}>DIIJINKAN</Text>

        <Text style={styles.text}>
          Untuk pemakaian 1 (satu) unit Alat Pengolah Data yaitu:
        </Text>

        <View style={styles.form}>
          {[
            ["Nama Barang", data.namaBarang],
            ["Merek / Type", data.kategori],
            ["Tahun Perolehan", data.tanggalPinjam],
            ["NUP", data.unit],
              ].map(([label, value], i) => (
                <View style={styles.infoRow} key={i}>
                  <Text style={styles.infoLabel}>{label}</Text>
                  <Text style={styles.infoColon}>:</Text>
                  <Text style={styles.infoValue}>{value}</Text>
               </View>
            ))}
        </View>
        
        <View style={styles.ketentuancont}>
          <Text style={styles.ketentuantitle}>Dengan ketentuan:</Text>
          <View style={styles.listRow}>
            <Text style={styles.listNumber}>1.</Text>
            <Text style={styles.listText}>
              Ijin bersifat sementara dan akan disesuaikan dengan kepentingan dinas 
              dan penugasan pejabat/pegawai yang bersangkutan;
            </Text>
          </View>

          <View style={styles.listRow}>
            <Text style={styles.listNumber}>2.</Text>
            <Text style={styles.listText}>
              Pemakai bertanggung jawab atas segala perawatan, pemeliharaan, kerusakan, 
              dan kehilangan;
            </Text>
          </View>

          <View style={styles.listRow}>
            <Text style={styles.listNumber}>3.</Text>
            <Text style={styles.listText}>
              Alat Pengolah Data hanya untuk keperluan dinas/tugas, dan tidak 
              diperkenankan untuk keperluan pribadi/keluarga;
            </Text>
          </View>

          <View style={styles.listRow}>
            <Text style={styles.listNumber}>4.</Text>
            <Text style={styles.listText}>
              Pemakai menandatangani Surat Pernyataan Kesediaan mengembalikan 
              Alat Pengolah Data kepada Satuan Kerja selaku Kuasa Pengguna Barang, 
              pada saat pindah tugas ke Unit Kerja lain dan/atau pensiun.
            </Text>
          </View>
        </View>

        {/* TTD */}
              <Text style={styles.tanggalRight}>{formatSuratDate(data.tanggalPinjam)}</Text>
                <View>
                  <View style={styles.ttdRow}>
                    {/* MENYERAHKAN */}
                    <View style={styles.ttdCol}>
                      <Text>Penanggung jawab</Text>
                      <Text>Barang Milik Negara</Text>
                      <View style={styles.ttdSpace} />
                      <Text style={{ textDecoration: "underline" }}>Sri Wulandari Dwi Wahyuni</Text>
                      <Text>NIP. 19840216 201012 200</Text>
                      <Text></Text>
                    </View>
        
                    {/* TANGGAL + MENERIMA */}
                    <View style={styles.ttdCol}>
                      <Text>Pengguna</Text>
                      <Text>Barang Milik Negara</Text>
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
        </Page>
    </Document>
    );
};

export default GenerateSIP;