"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dataLogPeminjaman } from "@/data/dataLogPeminjaman";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FileSpreadsheet } from "lucide-react";

export default function LogPeminjamanPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [logData, setLogData] = useState(dataLogPeminjaman);

  useEffect(() => {
    setLogData([...dataLogPeminjaman]);
  }, [dataLogPeminjaman.length]);

  // Filter + search
  const filteredData = logData
    .filter((item) => {
      const matchSearch = item.namaPeminjam.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || item.statusPeminjaman === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => new Date(b.tanggalPinjam).getTime() - new Date(a.tanggalPinjam).getTime());
  
  const handleDownloadExcel = () => {
          const exportData = filteredData.map((item, i) => ({
            No: i + 1,
            "Nomor Peminjaman": item.nomorPeminjaman,
            "Nama Peminjam": item.namaPeminjam,
            "Status Pegawai": item.statusPegawai,
            "Pangkat / Golongan": item.pangkatGolongan,
            "Jabatan": item.jabatan,
            NIP: item.nip,
            IKMM: item.ikmm,
            "Nama Barang": item.namaBarang,
            NUP: item.unit,
            Kategori: item.kategori,
            Jumlah: item.jumlahPinjam,
            "Tanggal Pinjam": item.tanggalPinjam,
            "Tanggal Selesai": item.tanggalSelesai || "-",
            Keterangan: item.keterangan || "-",
            statusPeminjaman: item.statusPeminjaman,
            foto: item.foto ? "Ada" : "Tidak Ada",
          }));
      
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "Data Peminjaman");
      
          const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });
          const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
          });
          saveAs(blob, "data_peminjaman.xlsx");
        };

  return (
    <div className="p-2 space-y-2">
      <h1 className="text-xs font-bold">Log Peminjaman</h1>

      {/* Search + Filter */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <Input
            placeholder="Cari peminjam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs placeholder:text-xs h-[24px] w-[200px] px-2 !bg-gray-50"
          />

          <Select onValueChange={setStatusFilter} defaultValue="all">
            <SelectTrigger className="cursor-pointer text-xs !h-[24px] w-[140px] px-2 !bg-gray-50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="all" className="text-[10px]">Semua Status</SelectItem>
              <SelectItem value="Aktif"  className="text-[10px]">Aktif</SelectItem>
              <SelectItem value="Selesai" className="text-[10px]">Selesai</SelectItem>
              <SelectItem value="Terlambat" className="text-[10px]">Terlambat</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="text-xs h-[24px] px-3 !bg-gray-50"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
          >
            Reset
          </Button>

          <Button
            className="cursor-pointer text-xs h-[24px] px-3"
            variant="default"
            onClick={handleDownloadExcel}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <div className="max-h-[400px] max-w-[1035px] overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-blue-100 text-left sticky top-0 z-10">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2 min-w-[135px]">Nomor Peminjaman</th>
                <th className="border p-2 min-w-[120px]">Nama Peminjam</th>
                <th className="border p-2 min-w-[110px]">Status Pegawai</th>
                <th className="border p-2 min-w-[135px]">Pangkat / Golongan</th>
                <th className="border p-2 min-w-[120px]">Jabatan</th>
                <th className="border p-2 min-w-[110px]">NIP</th>
                <th className="border p-2">IKMM</th>
                <th className="border p-2 min-w-[150px]">Nama / Merek / Tipe</th>
                <th className="border p-2">NUP</th>
                <th className="border p-2">Kategori</th>
                <th className="border p-2">Jumlah</th>
                <th className="border p-2 min-w-[110px]">Tanggal Pinjam</th>
                <th className="border p-2 min-w-[130px] text-center">Tanggal Selesai</th>
                <th className="border p-2 min-w-[120px] text-center">Keterangan</th>
                <th className="border p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.idPeminjaman} className="hover:bg-gray-50">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{item.nomorPeminjaman}</td>
                  <td className="border p-2">{item.namaPeminjam}</td>
                  <td className="border p-2">{item.statusPegawai}</td>
                  <td className="border p-2">{item.pangkatGolongan}</td>
                  <td className="border p-2">{item.jabatan}</td>
                  <td className="border p-2">{item.nip}</td>
                  <td className="border p-2">{item.ikmm}</td>
                  <td className="border p-2">{item.namaBarang}</td>
                  <td className="border p-2 text-center">{item.unit}</td>
                  <td className="border p-2">{item.kategori}</td>
                  <td className="border p-2 text-center">{item.jumlahPinjam}</td>
                  <td className="border p-2 text-center">{item.tanggalPinjam}</td>
                  <td className="border p-2 text-center">{item.tanggalSelesai || "-"}</td>
                  <td className="border p-2 text-center">{item.keterangan || "-"}</td>
                  <td className="border p-2 text-center">{item.statusPeminjaman}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
