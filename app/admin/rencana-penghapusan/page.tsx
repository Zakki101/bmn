"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, PenLine, FolderDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  dataUsulanHapus as initialData,
  UsulanHapus,
} from "@/data/dataUsulanHapus";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function UsulanHapusPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hapusData, setHapusData] = useState<UsulanHapus[]>(initialData);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [disetujuiOleh, setDisetujuiOleh] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleStatusChange = async (
    id: number,
    newStatus: "Menunggu" | "Disetujui" | "Ditolak"
  ) => {
    const item = hapusData.find((x) => x.idUsulan === id);
    if (!item) return;

    if (newStatus === "Disetujui") {
      const confirmDelete = window.confirm(
        `Apakah Anda yakin ingin menghapus data "${item.namaBarang}" secara permanen dari tabel BMN?`
      );

      if (confirmDelete) {
        setHapusData((prev) => prev.filter((x) => x.idUsulan !== id));

        alert(
          `Data "${item.namaBarang}" berhasil dihapus dari tabel BMN dan dipindahkan ke Log BMN.`
        );
      } else {
        return;
      }
    }

    setHapusData((prev) =>
      prev.map((i) =>
        i.idUsulan === id
          ? {
            ...i,
            statusUsulan: newStatus,
            disetujuiOleh: newStatus === "Disetujui" ? i.disetujuiOleh : "",
          }
          : i
      )
    );
  };

  // Dialog "Disetujui Oleh"
  const handleOpenDialog = (id: number, currentValue: string) => {
    setSelectedId(id);
    setDisetujuiOleh(currentValue || "");
    setOpenDialog(true);
  };

  const handleSaveDisetujuiOleh = () => {
    if (selectedId !== null) {
      setHapusData((prev) =>
        prev.map((item) =>
          item.idUsulan === selectedId
            ? { ...item, disetujuiOleh: disetujuiOleh.trim() || "-" }
            : item
        )
      );
    }
    setOpenDialog(false);
    setSelectedId(null);
    setDisetujuiOleh("");
  };

  // Filter & Search 
  const filteredData = hapusData
    .filter((item) => {
      const matchSearch = item.namaBarang
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" || item.statusUsulan === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort(
      (a, b) =>
        new Date(b.tanggalUsulan).getTime() -
        new Date(a.tanggalUsulan).getTime()
    );

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Download Excel
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
      "Tanggal Usulan": item.tanggalUsulan,
      "Alasan Penghapusan": item.alasan,
      "Status Usulan": item.statusUsulan,
      "Disetujui Oleh": item.disetujuiOleh || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usulan Hapus");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "usulan_hapus.xlsx");
  };

  return (
    <div className="space-y-2">
      <h1 className="text-[25px] font-bold">Usulan Penghapusan BMN</h1>

      {/* Search + Filter + Download */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <Input
            placeholder="Cari nama barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[14px] placeholder:text-[14px] h-[35px] w-[200px] px-2"
          />

          <Select onValueChange={setStatusFilter} defaultValue="all">
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[160px] px-2">
              <SelectValue placeholder="Status Usulan" />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              <SelectItem value="all" className="text-[12px]">
                Semua Status
              </SelectItem>
              <SelectItem value="Menunggu" className="text-[12px]">
                Menunggu
              </SelectItem>
              <SelectItem value="Disetujui" className="text-[12px]">
                Disetujui
              </SelectItem>
              <SelectItem value="Ditolak" className="text-[12px]">
                Ditolak
              </SelectItem>
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
        
        {/* eksport data */}
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
            <thead className="bg-blue-100 text-[13px] text-left sticky top-0 z-10">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2 min-w-[140px]">IKMM / Kode Barang</th>
                <th className="border p-2">Akun</th>
                <th className="border p-2">Bidang</th>
                <th className="border p-2 min-w-[150px]">Nama / Merek / Tipe</th>
                <th className="border p-2">NUP</th>
                <th className="border p-2">Kategori</th>
                <th className="border p-2 min-w-[100px]">Kondisi</th>
                <th className="border p-2 min-w-[130px]">Tanggal Usulan</th>
                <th className="border p-2 min-w-[150px]">Alasan Penghapusan</th>
                <th className="border p-2 min-w-[120px] text-center">
                  Status Usulan
                </th>
                <th className="border p-2 min-w-[140px] text-center">
                  Disetujui Oleh
                </th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.idUsulan} className="hover:bg-gray-50">
                    <td className="border p-2">{startIndex + index + 1}</td>
                    <td className="border p-2">{item.ikmm}</td>
                    <td className="border p-2">{item.akun}</td>
                    <td className="border p-2">{item.bidang}</td>
                    <td className="border p-2">{item.namaBarang}</td>
                    <td className="border p-2">{item.unit}</td>
                    <td className="border p-2">{item.kategori}</td>
                    <td className="border p-2">{item.kondisiBarang}</td>
                    <td className="border p-2">{item.tanggalUsulan}</td>
                    <td className="border p-2">{item.alasan}</td>

                    {/* Status */}
                    <td className="border p-2 text-center">
                      <Select
                        value={item.statusUsulan}
                        onValueChange={(v) =>
                          handleStatusChange(
                            item.idUsulan,
                            v as "Menunggu" | "Disetujui" | "Ditolak"
                          )
                        }
                      >
                        <SelectTrigger className="justify-between mx-auto cursor-pointer text-[12px] !h-[30px] w-[125px] px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Menunggu" className="text-[12px]">
                            Menunggu
                          </SelectItem>
                          <SelectItem value="Disetujui" className="text-[12px]">
                            Disetujui
                          </SelectItem>
                          <SelectItem value="Ditolak" className="text-[12px]">
                            Ditolak
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    <td
                      className="border p-2 text-center text-blue-600 hover:underline cursor-pointer"
                      onClick={() =>
                        handleOpenDialog(item.idUsulan, item.disetujuiOleh ?? "")
                      }
                    >
                      {item.disetujuiOleh || (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="border p-4 text-center bg-red-100">
                    <span className="text-red-800 font-semibold text-[14px]">Data tidak ada</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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

      {/* Dialog Input Nama Penyetuju */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[14px] font-medium">
              Usulan hapus disetujui oleh:
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Input
              placeholder="Masukkan nama penyetuju..."
              value={disetujuiOleh}
              onChange={(e) => setDisetujuiOleh(e.target.value)}
              className="text-[14px] h-[35px] w-full px-2"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="text-[14px] h-[35px] px-3"
              onClick={() => setOpenDialog(false)}
            >
              Batal
            </Button>
            <Button
              className="text-[14px] h-[35px] px-3"
              onClick={handleSaveDisetujuiOleh}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
