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
import { FileSpreadsheet } from "lucide-react";

export default function LogBMNPage() {
  const [search, setSearch] = useState("");
  const [logData] = useState(initialLogBMN);
  const [kategori, setKategori] = useState("all");

 const filteredData = logData
    .filter((i) => {
      const matchSearch = i.namaBarang.toLowerCase().includes(search.toLowerCase());
      const matchKategori    = kategori === "all" || i.kategori === kategori;
    return matchSearch && matchKategori;
    });

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
      <h1 className="text-xs font-bold">Log Penghapusan BMN</h1>

      {/* Search + Reset */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <Input
            placeholder="Cari nama barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs placeholder:text-xs h-[24px] w-[200px] px-2 !bg-gray-50"
          />
          <Select onValueChange={setKategori} defaultValue="all">
            <SelectTrigger className="cursor-pointer text-xs !h-[24px] w-[140px] px-2 !bg-gray-50">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              {["all", "Laptop", "Monitor", "Printer", "TV", "Peripheral", "Lainnya"].map((k) => (
                <SelectItem key={k} value={k} className="text-[10px]">
                  {k === "all" ? "Semua Kategori" : k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="text-xs h-[24px] px-3 !bg-gray-50"
            onClick={() => {
              setSearch("");
              setKategori("all")
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

      {/* Table Log BMN */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <div className="max-h-[400px] max-w-[1035px] overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-blue-100 text-left sticky top-0 z-10">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2 min-w-[140px]">IKMM / Kode Barang</th>
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

            <tbody>
              {filteredData.map((item, index) => (
                  <tr key={item.idBMN} className="hover:bg-gray-50">
                    <td className="border p-2">{index + 1}</td>
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
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
