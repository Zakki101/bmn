"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as XLSX from "xlsx";

import { FolderDown, ArrowDownUp, Loader2 } from "lucide-react";
import Pagination from "@/components/ui/pagination";

// state
export default function DataBMNUserPage() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("all");
  const [kondisi, setKondisi] = useState("all");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("tanggal-terlama");
  const [bmnData, setBmnData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const fetchBMN = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status !== "all") params.append("status", status);
      if (kategori !== "all") params.append("kategori", kategori);
      if (kondisi !== "all") params.append("kondisi", kondisi);

      const res = await fetch(`/api/bmn?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setBmnData(data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data BMN");
    } finally {
      setLoading(false);
    }
  }, [search, status, kategori, kondisi]);

  useEffect(() => {
    fetchBMN();
  }, [fetchBMN]);

  // filter + sort
  const sortedData = [...bmnData].sort((a, b) => {
    switch (sortBy) {
      case "nama-az":
        return a.namaBarang.localeCompare(b.namaBarang);
      case "nama-za":
        return b.namaBarang.localeCompare(a.namaBarang);
      case "tanggal-terlama":
        return new Date(a.tanggalPerolehan).getTime() - new Date(b.tanggalPerolehan).getTime();
      case "tanggal-terbaru":
      default:
        return new Date(b.tanggalPerolehan).getTime() - new Date(a.tanggalPerolehan).getTime();
    }
  });

  const filteredData = sortedData;

  // pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // export functions
  const handleDownloadExcel = () => {
    const data = filteredData.map((item, index) => ({
      "No": index + 1,
      "IKMM": item.ikmm,
      "Nama": item.namaBarang,
      "Kategori": item.kategori,
      "Jumlah": item.kuantitas || 1,
      "Tanggal Perolehan": item.tanggalPerolehan,
      "Kondisi": item.kondisiBarang,
      "Status": item.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data BMN");

    worksheet["!cols"] = [
      { wch: 5 },
      { wch: 12 },
      { wch: 20 },
      { wch: 12 },
      { wch: 8 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 }
    ];

    XLSX.writeFile(workbook, `BMN_Data_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-2">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="pt-0 pb-0 text-[25px] font-bold">Data BMN</h1>
        {/* export */}
        <Button
          className="cursor-pointer text-[14px] h-[35px] px-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
          onClick={() => handleDownloadExcel()}>
          <FolderDown className="mr-2 h-4 w-4" />
          Eksport Data
        </Button>
      </div>

      <div className="bg-white border border-gray-400 rounded-lg p-4 space-y-3">
        {/* Filter, Sort, Reset */}
        <div className="flex flex-wrap items-center gap-1">
          {/* search */}
          <Input
            placeholder="Cari barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[14px] placeholder:text-[14px] h-[35px] w-[365px] px-2"/>

          {/* filter kategori */}
          <Select onValueChange={setKategori} value={kategori}>
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[180px] px-2">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              {["all", "Laptop/Server", "Monitor", "Printer", "TV", "Furniture", "Jaringan", "Elektronik", "Peripheral", "Lainnya"].map((k) => (
                <SelectItem key={k} value={k} className="text-[12px]">
                  {k === "all" ? "Semua Kategori" : k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* filter kondisi */}
          <Select onValueChange={setKondisi} value={kondisi}>
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[180px] px-2">
              <SelectValue placeholder="Kondisi" />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              <SelectItem value="all" className="text-[14px]">Semua Kondisi</SelectItem>
              <SelectItem value="Baik" className="text-[14px]">Baik</SelectItem>
              <SelectItem value="Rusak" className="text-[14px]">Rusak</SelectItem>
              <SelectItem value="Dalam Perbaikan" className="text-[14px]">Dalam Perbaikan</SelectItem>
            </SelectContent>
          </Select>

          {/* filter status */}
          <Select onValueChange={setStatus} value={status}>
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[180px] px-2">
              <SelectValue placeholder="Ketersediaan" />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              <SelectItem value="all" className="text-[14px]">Semua Ketersediaan</SelectItem>
              <SelectItem value="Tersedia" className="text-[14px]">Tersedia</SelectItem>
              <SelectItem value="Dipinjam" className="text-[14px]">Dipinjam</SelectItem>
              <SelectItem value="Tidak Tersedia" className="text-[14px]">Tidak Tersedia</SelectItem>
            </SelectContent>
          </Select>

          {/* sort */}
          <Select onValueChange={setSortBy} value={sortBy}>
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[200px] px-2">
              <ArrowDownUp className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              <SelectItem value="tanggal-terbaru" className="text-[14px]">Tanggal Terbaru</SelectItem>
              <SelectItem value="tanggal-terlama" className="text-[14px]">Tanggal Terlama</SelectItem>
              <SelectItem value="nama-az" className="text-[14px]">Nama (A - Z)</SelectItem>
              <SelectItem value="nama-za" className="text-[14px]">Nama (Z - A)</SelectItem>
            </SelectContent>
          </Select>

          {/* reset */}
          <Button
            variant="outline"
            className="cursor-pointer text-[14px] h-[35px] px-3"
            onClick={() => {
              setSearch("");
              setKategori("all");
              setKondisi("all");
              setStatus("all");
              setSortBy("tanggal-terlama");
              setCurrentPage(1);
            }}
          >
            Reset
          </Button>
        </div>

      {/* tabel */}
      <div className="bg-white pb-0 rounded-lg shadow border overflow-x-auto">
        <div ref={tableContainerRef} className="max-h-[400px] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-100 text-[14px] text-left sticky top-0 z-10">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">IKMM</th>
                <th className="border p-2 min-w-[150px]">Nama</th>
                <th className="border p-2">Kategori</th>
                <th className="border p-2">Jumlah</th>
                <th className="border p-2 min-w-[130px]">Tanggal Perolehan</th>
                <th className="border p-2">Kondisi</th>
                <th className="border p-2">Ketersediaan</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="border p-8 text-center bg-gray-50">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span>Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="border p-2">{startIndex + index + 1}</td>
                    <td className="border p-2">{item.ikmm}</td>
                    <td className="border p-2">{item.namaBarang}</td>
                    <td className="border p-2">{item.kategori}</td>
                    <td className="border p-2">{item.kuantitas || 1}</td>
                    <td className="border p-2">{item.tanggalPerolehan}</td>
                    <td className="border p-2 text-center">
                      {item.kondisiBarang === "Baik" ? (
                        <span className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded text-[14px] font-semibold min-w-[70px]">
                          Baik
                        </span>
                      ) : item.kondisiBarang === "Rusak" ? (
                        <span className="inline-block bg-red-200 text-red-800 px-3 py-1 rounded text-[14px] font-semibold min-w-[70px]">
                          Rusak
                        </span>
                      ) : (
                        <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded text-[14px] font-semibold min-w-[70px]">
                          Perbaikan
                        </span>
                      )}
                    </td>
                    <td className="border p-2 text-center">
                      {item.status === "Tersedia" ? (
                        <span className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded text-[14px] font-semibold min-w-[120px]">
                          Tersedia
                        </span>
                      ) : item.status === "Dipinjam" ? (
                        <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded text-[14px] font-semibold min-w-[120px]">
                          Dipinjam
                        </span>
                      ) : (
                        <span className="inline-block bg-red-200 text-red-800 px-3 py-1 rounded text-[14px] font-semibold min-w-[120px]">
                          Tidak Tersedia
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={8} className="border p-4 text-center bg-gray-100">
                      <span className="text-gray-500 font-semibold text-[14px]">Data tidak ditemukan</span>
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
        tableContainerRef={tableContainerRef}
      />
      </div>

    </div>
  );
}
