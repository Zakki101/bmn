"use client";

import { useState } from "react";
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
import { FolderDown, Plus } from "lucide-react";
import Pagination from "@/components/ui/pagination";

export default function LogPeminjamanPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  // Filter + search
  const filteredData = dataLogPeminjaman
    .filter((item) => {
      const matchSearch = item.namaPeminjam.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || item.statusPeminjaman === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => new Date(b.tanggalPinjam).getTime() - new Date(a.tanggalPinjam).getTime());

  // pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

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
    <div className="space-y-2">
      <h1 className="text-[25px] font-bold">Log Peminjaman</h1>

      {/* Search + Filter */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <Input
            placeholder="Cari peminjam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[14px] placeholder:text-[14px] h-[35px] w-[200px] px-2"
          />

          <Select onValueChange={setStatusFilter} defaultValue="all">
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[140px] px-2">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              <SelectItem value="all" className="text-[12px]">Semua Status</SelectItem>
              <SelectItem value="Aktif" className="text-[12px]">Aktif</SelectItem>
              <SelectItem value="Selesai" className="text-[12px]">Selesai</SelectItem>
              <SelectItem value="Terlambat" className="text-[12px]">Terlambat</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="text-[14px] h-[35px] px-3"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setCurrentPage(1);
            }}
          >
            Reset
          </Button>
        </div>

        {/* eksport */}
        <div className="flex gap-2 ml-auto">
          <Button
            className="cursor-pointer text-[12px] h-[35px] s bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
            onClick={() => handleDownloadExcel()}>
            <FolderDown className="mr-1 h-4 w-4" />
            Eksport Data
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <div className="max-h-[400px] max-w-auto overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-100 text-[14px] text-left sticky top-0 z-10">
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
            <tbody className="text-[14px]">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.idPeminjaman} className="hover:bg-gray-50">
                    <td className="border p-2">{startIndex + index + 1}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan={16} className="border p-4 text-center bg-red-100">
                    <span className="text-red-800 font-semibold text-[14px]">Data tidak ada</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredData.length}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
