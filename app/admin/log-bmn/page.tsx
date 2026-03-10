"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { dataLogBMN as initialLogBMN } from "@/data/dataLogBMN";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FolderDown } from "lucide-react";

export default function LogBMNPage() {
  const [search, setSearch] = useState("");
  const [logData] = useState(initialLogBMN);
  const [kategori, setKategori] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

 const filteredData = logData
    .filter((i) => {
      const matchSearch = i.namaBarang.toLowerCase().includes(search.toLowerCase());
      const matchKategori    = kategori === "all" || i.kategori === kategori;
    return matchSearch && matchKategori;
    });

  // pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleDownloadExcel = () => {
        const exportData = filteredData.map((item, i) => ({
          No: i + 1,
          IKMM: item.ikmm,
          Akun: item.akun,
          Bidang: item.bidang,
          "Nama Barang": item.namaBarang,
          NUP: item.unit,
          Kategori: item.kategori,
          "Kondisi Barang": item.kondisiBarang,
          "Tanggal Penghapusan": item.tanggalPenghapusan,
          "Alasan Penghapusan": item.alasanPenghapusan,
          "Disetujui Oleh": item.disetujuiOleh,
        }));
    
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Log Data BMN");
    
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(blob, "LOG_data_bmn.xlsx");
      };

  return (
    <div className="p-2 space-y-2">
      <h1 className="text-[20px] font-bold">Log Penghapusan BMN</h1>

      {/* Search + Reset */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <Input
            placeholder="Cari nama barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[14px] placeholder:text-[14px] h-[35px] w-[250px] px-2"
          />
          <Select onValueChange={setKategori} defaultValue="all">
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[200px] px-2">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              {["all", "Laptop", "Monitor", "Printer", "TV", "Peripheral", "Lainnya"].map((k) => (
                <SelectItem key={k} value={k} className="text-[12px]">
                  {k === "all" ? "Semua Kategori" : k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="cursor-pointer text-[14px] h-[35px] px-3"
            onClick={() => {
              setSearch("");
              setKategori("all");
              setCurrentPage(1);
            }}
          >
            Reset
          </Button>          
        </div>
        
        {/* export data */}
        <div className="ml-auto">
          <Button
            className="cursor-pointer text-[12px] h-[35px] px-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
            onClick={() => handleDownloadExcel()}>
            <FolderDown className="mr-2 h-4 w-4" />
            Eksport Data
          </Button>
        </div>
      </div>

      {/* Table Log BMN */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <div className="max-h-[400px] max-w-auto overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-100 text-[13px] text-left sticky top-0 z-10">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2 min-w-[170px]">IKMM / Kode Barang</th>
                <th className="border p-2">Akun</th>
                <th className="border p-2">Bidang</th>
                <th className="border p-2 min-w-[150px]">Nama / Merek / Tipe</th>
                <th className="border p-2">NUP</th>
                <th className="border p-2">Kategori</th>
                <th className="border p-2">Kondisi</th>
                <th className="border p-2 min-w-[130px]">Tanggal Perolehan</th>
                <th className="border p-2 min-w-[150px]">Tanggal Penghapusan</th>
                <th className="border p-2 min-w-[180px]">Alasan Penghapusan</th>
                <th className="border p-2 min-w-[140px] text-center">Disetujui Oleh</th>
              </tr>
            </thead>

            <tbody className="text-[12px]">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.idBMN} className="text-[12px] hover:bg-gray-50">
                    <td className="border p-2">{startIndex + index + 1}</td>
                    <td className="border p-2">{item.ikmm}</td>
                    <td className="border p-2">{item.akun}</td>
                    <td className="border p-2">{item.bidang}</td>
                    <td className="border p-2">{item.namaBarang}</td>
                    <td className="border p-2">{item.unit}</td>
                    <td className="border p-2">{item.kategori}</td>
                    <td className="border p-2">{item.kondisiBarang}</td>
                    <td className="border p-2">{item.tanggalPerolehan}</td>
                    <td className="border p-2">{item.tanggalPenghapusan}</td>
                    <td className="border p-2">{item.alasanPenghapusan || "-"}</td>
                    <td className="border p-2 text-center">
                      {item.disetujuiOleh || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="border p-4 text-center bg-pink-100">
                    <span className="text-pink-600 font-semibold text-xs">Data tidak ada</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between gap-2 bg-white p-4 rounded-lg shadow border">
        <div className="flex items-center gap-2">
          {/* items per page */}
          <Select value={String(itemsPerPage)} onValueChange={(value) => {
            setItemsPerPage(Number(value));
            setCurrentPage(1);
          }}>
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[100px] px-2">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              <SelectItem value="10" className="text-[14px]">10 Data</SelectItem>
              <SelectItem value="20" className="text-[14px]">20 Data</SelectItem>
              <SelectItem value="100" className="text-[14px]">100 Data</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-[14px] text-black">
            Menampilkan {filteredData.length === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="cursor-pointer text-[14px] h-[35px] px-3"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ← Sebelumnya
          </Button>
          <div className="text-[14px] text-gray-600 px-3">
            Halaman {currentPage} dari {totalPages}
          </div>
          <Button
            variant="outline"
            className="cursor-pointer text-[14px] h-[35px] px-3"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Berikutnya →
          </Button>
        </div>
      </div>
    </div>
  );
}
