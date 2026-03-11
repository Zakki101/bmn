"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MdDeleteOutline } from "react-icons/md";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download, FolderDown, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import imageCompression from "browser-image-compression";
import { pdf } from "@react-pdf/renderer";
import GenerateBA from "@/components/pdf/GenerateBA";
import GenerateSIP from "@/components/pdf/GenerateSIP";

export default function DataPeminjamanAdminPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kategori, setKategori] = useState("all");
  const [peminjamanData, setPeminjamanData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeminjaman, setSelectedPeminjaman] = useState<any | null>(null);
  const [editKeterangan, setEditKeterangan] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await fetch(`/api/peminjaman?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch loans");
      const data = await res.json();
      
      // Filter by category client-side since BMN join is complex in the query for now
      let filtered = data;
      if (kategori !== "all") {
        filtered = data.filter((item: any) => item.kategori === kategori);
      }
      
      setPeminjamanData(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, kategori]);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  function parseDate(dateStr: string): Date {
    if (!dateStr) return new Date();
    // Assuming dd/mm/yyyy or iso
    if (dateStr.includes("/")) {
        const [day, month, year] = dateStr.split("/").map(Number);
        return new Date(year, month - 1, day);
    }
    return new Date(dateStr);
  }

  // Sort
  const sortedData = [...peminjamanData].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.tanggalPinjam);
    const dateB = new Date(b.createdAt || b.tanggalPinjam);
    return dateB.getTime() - dateA.getTime();
  });

  // pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(`/api/peminjaman/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setPeminjamanData(peminjamanData.filter((i) => i.id !== id));
      alert("Data berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
    }
  };

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      // In a real app, upload to storage (S3/Cloudinary)
      // For now, we'll simulate update
      const previewUrl = URL.createObjectURL(compressed);
      // await fetch(`/api/peminjaman/${id}`, { method: 'PATCH', body: JSON.stringify({ foto: [previewUrl] }) });
      alert("Foto berhasil diproses (simulasi)");
    } catch (err) {
      console.error("Gagal kompres gambar:", err);
    }
  };

  const handleInlineStatusChange = async (id: number, value: string) => {
    try {
      const res = await fetch(`/api/peminjaman/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          statusPeminjaman: value,
          tanggalSelesai: value === "Selesai" ? new Date().toISOString() : null,
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      
      setPeminjamanData(prev =>
        prev.map(p => p.id === id ? { 
            ...p, 
            statusPeminjaman: value,
            tanggalSelesai: value === "Selesai" ? new Date().toLocaleDateString("id-ID") : null 
        } : p)
      );
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui status");
    }
  };

  const handleDownloadExcel = () => {
    const exportData = sortedData.map((item, i) => ({
      No: i + 1,
      "Nomor Peminjaman": item.nomorPeminjaman,
      "Nama Peminjam": item.namaPeminjam,
      "Status Pegawai": item.statusPegawai,
      NIP: item.nip,
      "Tanggal Pinjam": item.tanggalPinjam,
      "Tanggal Selesai": item.tanggalSelesai || "-",
      Keterangan: item.keterangan || "-",
      statusPeminjaman: item.statusPeminjaman,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Peminjaman");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "data_peminjaman.xlsx");
  };

  return (
    <div className="p-2 space-y-2">
      <h1 className="pt-0 pb-0 text-[20px] font-bold">Data Peminjaman</h1>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <Input
            placeholder="Cari peminjam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[14px] placeholder:text-[14px] h-[35px] w-[200px] px-2 !bg-gray-50"
          />

          <Select onValueChange={setStatusFilter} value={statusFilter}>
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[140px] px-2 !bg-gray-50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Selesai">Selesai</SelectItem>
              <SelectItem value="Terlambat">Terlambat</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setKategori} value={kategori}>
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[180px] px-2 !bg-gray-50">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              {["all", "Laptop", "Monitor", "Printer", "TV", "Peripheral", "Lainnya"].map((k) => (
                <SelectItem key={k} value={k}>{k === "all" ? "Semua Kategori" : k}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            className="h-[35px] px-3"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setKategori("all");
            }}
          >
            Reset
          </Button>
        </div>

        <div className="flex gap-2 ml-auto">
          <Button className="h-[35px]" onClick={handleDownloadExcel}>
            <FolderDown className="mr-1 h-4 w-4" />
            Eksport
          </Button>

          <Button className="h-[35px]" onClick={() => router.push("/admin/peminjaman/add-peminjaman")}>
            <Plus className="h-4 w-4 mr-1" />
            Tambah
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-blue-100 text-[13px] text-left">
            <tr>
              <th className="border p-2">No</th>
              <th className="border p-2">Nomor Peminjaman</th>
              <th className="border p-2">Nama Peminjam</th>
              <th className="border p-2">NIP</th>
              <th className="border p-2">Tanggal Pinjam</th>
              <th className="border p-2 text-center">Status</th>
              <th className="border p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-[12px]">
            {loading ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                   <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border p-2">{startIndex + index + 1}</td>
                  <td className="border p-2">{item.nomorPeminjaman}</td>
                  <td className="border p-2">{item.namaPeminjam}</td>
                  <td className="border p-2">{item.nip}</td>
                  <td className="border p-2">{new Date(item.tanggalPinjam).toLocaleDateString("id-ID")}</td>
                  <td className="border p-2 text-center">
                    <Select
                      value={item.statusPeminjaman}
                      onValueChange={(val) => handleInlineStatusChange(item.id, val)}
                    >
                      <SelectTrigger className="h-[30px] min-w-[100px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Selesai">Selesai</SelectItem>
                        <SelectItem value="Terlambat">Terlambat</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="border p-2 text-center">
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">
                      <MdDeleteOutline className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">Data tidak ditemukan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
