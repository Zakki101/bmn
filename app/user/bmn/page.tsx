"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { dataBMN } from "@/data/dataBMN";

// state
export default function DataBMNUserPage() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("all");

  // filter + sort
  const sortedData = [...dataBMN].sort((a, b) => {
    const [dayA, monthA, yearA] = a.tanggalPerolehan.split("/");
    const [dayB, monthB, yearB] = b.tanggalPerolehan.split("/");

    const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
    const dateB = new Date(`${yearB}-${monthB}-${dayB}`);

    return dateB.getTime() - dateA.getTime();
  });

  const filteredData = sortedData.filter((item) => {
    const matchSearch = item.namaBarang.toLowerCase().includes(search.toLowerCase());
    const matchKategori = kategori === "all" || item.kategori === kategori;
    return matchSearch && matchKategori;
  });

  return (
    <div className="p-1 space-y-2">
      {/* header */}
      <h1 className="pt-0 pb-0 text-sm font-bold">Data BMN</h1>

      <div className="flex flex-wrap items-center gap-1">
        {/* search */}
        <Input
          placeholder="Cari barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-xs placeholder:text-xs h-[24px] w-[200px] px-2"
        />

        {/* filter */}
        <Select onValueChange={setKategori} defaultValue="all">
          <SelectTrigger className="cursor-pointer text-xs !h-[24px] w-[140px] px-2">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent className="text-xs">
            <SelectItem value="all" className="text-[10px]">Semua Kategori</SelectItem>
            <SelectItem value="Laptop" className="text-[10px]">Laptop</SelectItem>
            <SelectItem value="TV" className="text-[10px]">TV</SelectItem>
            <SelectItem value="Monitor" className="text-[10px]">Monitor</SelectItem>
            <SelectItem value="Printer" className="text-[10px]">Printer</SelectItem>
          </SelectContent>
        </Select>

        {/* reset */}
        <Button
          variant="outline"
          className="cursor-pointer text-xs h-[24px] px-3"
          onClick={() => {
            setSearch("");
            setKategori("all");
          }}
        >
          Reset
        </Button>
      </div>

      {/* tabel */}
      <div className="bg-white pb-0 rounded-lg shadow border overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-blue-100 text-left sticky top-0 z-10">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">IKMM</th>
                <th className="border p-2">Nama</th>
                <th className="border p-2">Kategori</th>
                <th className="border p-2">Jumlah</th>
                <th className="border p-2">Tanggal Perolehan</th>
                <th className="border p-2">Kondisi Baik</th>
                <th className="border p-2">Dalam Perbaikan</th>
                <th className="border p-2">Jumlah Tersedia</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.idBMN} className="hover:bg-gray-50">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{item.ikmm}</td>
                  <td className="border p-2">{item.namaBarang}</td>
                  <td className="border p-2">{item.kategori}</td>
                  <td className="border p-2">1</td>
                  <td className="border p-2">{item.tanggalPerolehan}</td>
                  <td className="border p-2 text-center">{item.kondisiBarang === "Baik" ? "✅" : "-"}</td>
                  <td className="border p-2 text-center">{item.kondisiBarang === "Dalam Perbaikan" ? "🔧" : "-"}</td>
                  <td className="border p-2 text-center">{item.dipinjam === "Tersedia" ? "Ready" : "Not Ready"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
