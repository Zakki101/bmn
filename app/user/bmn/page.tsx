"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { dataBMN } from "@/data/dataBMN";
import { FolderDown } from "lucide-react";

// state
export default function DataBMNUserPage() {
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("all");
  const [kondisiFilter, setKondisiFilter] = useState<string[]>([]);
  const [showKondisiDropdown, setShowKondisiDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showExportModal, setShowExportModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowKondisiDropdown(false);
      }
    };

    if (showKondisiDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showKondisiDropdown]);

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
    
    // Separate filters by category
    const kondisiFilters = kondisiFilter.filter(f => ["baik", "rusak", "perbaikan"].includes(f));
    const ketersediaanFilters = kondisiFilter.filter(f => ["tersedia", "dipinjam", "tidak-tersedia"].includes(f));
    
    // If no filter selected, show all items
    if (kondisiFilter.length === 0) {
      return matchSearch && matchKategori;
    }
    
    // Check kondisi barang filters (OR logic within this category)
    let matchKondisiBarang = true;
    if (kondisiFilters.length > 0) {
      matchKondisiBarang = false;
      for (const filter of kondisiFilters) {
        if (filter === "baik" && item.kondisiBarang === "Baik") {
          matchKondisiBarang = true;
          break;
        } else if (filter === "rusak" && item.kondisiBarang === "Rusak") {
          matchKondisiBarang = true;
          break;
        } else if (filter === "perbaikan" && item.kondisiBarang === "Dalam Perbaikan") {
          matchKondisiBarang = true;
          break;
        }
      }
    }
    
    // Check ketersediaan filters (OR logic within this category)
    let matchKetersediaan = true;
    if (ketersediaanFilters.length > 0) {
      matchKetersediaan = false;
      for (const filter of ketersediaanFilters) {
        if (filter === "tersedia" && item.dipinjam === "Tersedia") {
          matchKetersediaan = true;
          break;
        } else if (filter === "dipinjam" && item.dipinjam === "Dipinjam") {
          matchKetersediaan = true;
          break;
        } else if (filter === "tidak-tersedia" && item.dipinjam === "Tidak Tersedia") {
          matchKetersediaan = true;
          break;
        }
      }
    }
    
    // AND logic between categories
    return matchSearch && matchKategori && matchKondisiBarang && matchKetersediaan;
  });

  // pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // export functions
  const exportToExcel = () => {
    const data = filteredData.map((item, index) => ({
      "No": index + 1,
      "IKMM": item.ikmm,
      "Nama": item.namaBarang,
      "Kategori": item.kategori,
      "Jumlah": 1,
      "Tanggal Perolehan": item.tanggalPerolehan,
      "Kondisi (Baik/Rusak/Perbaikan)": item.kondisiBarang,
      "Ketersediaan (Tersedia/Dipinjam/Tidak Tersedia)": item.dipinjam
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

  // Export ke pdf lewat HTML karena lib pdf di browser sering bermasalah dengan styling
  const exportToPDF = () => {
    const data = filteredData;
    let htmlContent = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Data BMN</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 10px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4472C4; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .container { max-width: 1200px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Data BMN</h1>
            <p>Tanggal Export: ${new Date().toLocaleDateString('id-ID')}</p>
            <p>Total Data: ${filteredData.length}</p>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>IKMM</th>
                  <th>Nama</th>
                  <th>Kategori</th>
                  <th>Jumlah</th>
                  <th>Tanggal Perolehan</th>
                  <th>Kondisi</th>
                  <th>Ketersediaan</th>
                </tr>
              </thead>
              <tbody>
    `;

    data.forEach((item, index) => {
      htmlContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.ikmm}</td>
          <td>${item.namaBarang}</td>
          <td>${item.kategori}</td>
          <td>1</td>
          <td>${item.tanggalPerolehan}</td>
          <td>${item.kondisiBarang}</td>
          <td>${item.dipinjam}</td>
        </tr>
      `;
    });

    htmlContent += `
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BMN_Data_${new Date().toISOString().split('T')[0]}.html`;
    link.click();
  };

  return (
    <div className="space-y-2">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="pt-0 pb-0 text-[25px] font-bold">Data BMN</h1>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        {/* search */}
        <Input
          placeholder="Cari barang..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-[14px] placeholder:text-[14px] h-[35px] w-[250px] px-2"/>

        {/* filter kategori */}
        <Select onValueChange={setKategori} defaultValue="all">
          <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[200px] px-2">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent className="text-[14px]">
            <SelectItem value="all" className="text-[12px]">Semua Kategori</SelectItem>
            <SelectItem value="Laptop" className="text-[12px]">Laptop</SelectItem>
            <SelectItem value="TV" className="text-[12px]">TV</SelectItem>
            <SelectItem value="Monitor" className="text-[12px]">Monitor</SelectItem>
            <SelectItem value="Printer" className="text-[12px]">Printer</SelectItem>
          </SelectContent>
        </Select>

        {/* multi select filter kondisi */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="outline"
            className="cursor-pointer text-[14px] h-[35px] px-3 w-[220px] items-center justify-start"
            onClick={() => setShowKondisiDropdown(!showKondisiDropdown)}> 
            Filter Kondisi {kondisiFilter.length > 0 && `(${kondisiFilter.length})`}
          </Button>
          
          {showKondisiDropdown && (
            <div className="absolute top-full left-0 mt-1 w-[280px] bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div className="p-3 space-y-3 max-h-[300px] overflow-y-auto">
                {/* Kondisi Section */}
                <div>
                  <div className="text-[11px] font-bold text-gray-700 px-2 py-1">KONDISI BARANG</div>
                  <div className="space-y-2 pl-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                      <input
                        type="checkbox"
                        checked={kondisiFilter.includes("baik")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setKondisiFilter([...kondisiFilter, "baik"]);
                          } else {
                            setKondisiFilter(kondisiFilter.filter(f => f !== "baik"));
                          }
                        }}
                        className="w-4 h-4 cursor-pointer"/>
                      <span className="text-[12px]">Baik</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                      <input
                        type="checkbox"
                        checked={kondisiFilter.includes("rusak")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setKondisiFilter([...kondisiFilter, "rusak"]);
                          } else {
                            setKondisiFilter(kondisiFilter.filter(f => f !== "rusak"));
                          }
                        }}
                        className="w-4 h-4 cursor-pointer"/>
                      <span className="text-[12px]">Rusak</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                      <input
                        type="checkbox"
                        checked={kondisiFilter.includes("perbaikan")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setKondisiFilter([...kondisiFilter, "perbaikan"]);
                          } else {
                            setKondisiFilter(kondisiFilter.filter(f => f !== "perbaikan"));
                          }
                        }}
                        className="w-4 h-4 cursor-pointer"/>
                      <span className="text-[12px]">Dalam Perbaikan</span>
                    </label>
                  </div>
                </div>

                {/* Ketersediaan Section */}
                <div>
                  <div className="text-[11px] font-bold text-gray-700 px-2 py-1">KETERSEDIAAN</div>
                  <div className="space-y-2 pl-2">
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                      <input
                        type="checkbox"
                        checked={kondisiFilter.includes("tersedia")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setKondisiFilter([...kondisiFilter, "tersedia"]);
                          } else {
                            setKondisiFilter(kondisiFilter.filter(f => f !== "tersedia"));
                          }
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-[12px]">Tersedia untuk Pinjam</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                      <input
                        type="checkbox"
                        checked={kondisiFilter.includes("dipinjam")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setKondisiFilter([...kondisiFilter, "dipinjam"]);
                          } else {
                            setKondisiFilter(kondisiFilter.filter(f => f !== "dipinjam"));
                          }
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-[12px]">Sedang Dipinjam</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                      <input
                        type="checkbox"
                        checked={kondisiFilter.includes("tidak-tersedia")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setKondisiFilter([...kondisiFilter, "tidak-tersedia"]);
                          } else {
                            setKondisiFilter(kondisiFilter.filter(f => f !== "tidak-tersedia"));
                          }
                        }}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-[12px]">Tidak Tersedia</span>
                    </label>
                  </div>
                </div>

                {/* Clear button */}
                {kondisiFilter.length > 0 && (
                  <div className="border-t pt-2">
                    <Button
                      variant="outline"
                      className="cursor-pointer text-[11px] h-[28px] px-2 w-full"
                      onClick={() => setKondisiFilter([])}
                    >
                      Hapus Semua Filter
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* reset */}
        <Button
          variant="outline"
          className="cursor-pointer text-[14px] h-[35px] px-3 "
          onClick={() => {
            setSearch("");
            setKategori("all");
            setKondisiFilter([]);
            setCurrentPage(1);
            setShowKondisiDropdown(false);
          }}
        >
          Reset
        </Button>

          <div className="ml-auto">
            {/* export */}
            <Button
              className="cursor-pointer text-[12px] h-[35px] px-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
              onClick={() => setShowExportModal(true)}>
              <FolderDown className="mr-2 h-4 w-4" />
              Eksport Data
            </Button>
          </div>
      </div>

      {/* tabel */}
      <div className="bg-white pb-0 rounded-lg shadow border overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-100 text-[14px] text-left sticky top-0 z-10">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">IKMM</th>
                <th className="border p-2">Nama</th>
                <th className="border p-2">Kategori</th>
                <th className="border p-2">Jumlah</th>
                <th className="border p-2">Tanggal Perolehan</th>
                <th className="border p-2">Kondisi</th>
                <th className="border p-2">Ketersediaan</th>
              </tr>
            </thead>
            <tbody className="text-[14px]">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.idBMN} className="hover:bg-gray-100">
                    <td className="border p-2">{startIndex + index + 1}</td>
                    <td className="border p-2">{item.ikmm}</td>
                    <td className="border p-2">{item.namaBarang}</td>
                    <td className="border p-2">{item.kategori}</td>
                    <td className="border p-2">1</td>
                    <td className="border p-2">{item.tanggalPerolehan}</td>
                    <td className="border p-2 text-center">
                      {item.kondisiBarang === "Baik" ? (
                        <span className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded text-[12px] font-semibold min-w-[70px]">
                          Baik
                        </span>
                      ) : item.kondisiBarang === "Rusak" ? (
                        <span className="inline-block bg-red-200 text-red-800 px-3 py-1 rounded text-[12px] font-semibold min-w-[70px]">
                          Rusak
                        </span>
                      ) : (
                        <span className="inline-block bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-[12px] font-semibold min-w-[70px]">
                          Perbaikan
                        </span>
                      )}
                    </td>
                    <td className="border p-2 text-center">
                      {item.dipinjam === "Tersedia" ? (
                        <span className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded text-[12px] font-semibold min-w-[120px]">
                          Tersedia
                        </span>
                      ) : item.dipinjam === "Dipinjam" ? (
                        <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded text-[12px] font-semibold min-w-[120px]">
                          Dipinjam
                        </span>
                      ) : (
                        <span className="inline-block bg-gray-300 text-gray-800 px-3 py-1 rounded text-[12px] font-semibold min-w-[120px]">
                          Tidak Tersedia
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="border p-4 text-center bg-pink-100">
                    <span className="text-pink-600 font-semibold text-[14px]">Data tidak ada</span>
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
            <SelectContent className="text-[12px]">
              <SelectItem value="10" className="text-[12px]">10 Data</SelectItem>
              <SelectItem value="20" className="text-[12px]">20 Data</SelectItem>
              <SelectItem value="100" className="text-[12px]">100 Data</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-[14px] text-black">
            Menampilkan {filteredData.length === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="cursor-pointer text-[12px] h-[35px] px-3"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            ← Sebelumnya
          </Button>
          <div className="text-[12px] text-gray-600 px-3">
            Halaman {currentPage} dari {totalPages}
          </div>
          <Button
            variant="outline"
            className="cursor-pointer text-[12px] h-[35px] px-3"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Berikutnya →
          </Button>
        </div>
      </div>

      {/* export modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Format Ekstrak</DialogTitle>
            <DialogDescription>
              Pilih format file yang ingin anda download. Data yang ditampilkan sesuai dengan filter yang aktif.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button
              className="cursor-pointer text-[14px] h-[40px] justify-start bg-green-600 text-green-50 hover:bg-green-700"
              onClick={() => {
                exportToExcel();
                setShowExportModal(false);
              }}
            >
              Excel
            </Button>
            <Button
              className="cursor-pointer text-[14px] h-[40px] justify-start bg-red-600 text-red-50 hover:bg-red-700"
              onClick={() => {
                exportToPDF();
                setShowExportModal(false);
              }}
            >
              HTML
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
