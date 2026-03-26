"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
import { Download, FolderDown, Plus, Loader2, ArrowDownUp } from "lucide-react";
import Pagination from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import imageCompression from "browser-image-compression";
import { pdf } from "@react-pdf/renderer";
import GenerateBA from "@/components/pdf/GenerateBA";
import GenerateSIP from "@/components/pdf/GenerateSIP";
import { Peminjaman } from "@/data/dataPeminjaman";

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
  const [sortBy, setSortBy] = useState("tanggal-terlama");
  const tableContainerRef = useRef<HTMLDivElement>(null);
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
    switch (sortBy) {
      case "nama-az":
        return a.namaPeminjam.localeCompare(b.namaPeminjam);
      case "nama-za":
        return b.namaPeminjam.localeCompare(a.namaPeminjam);
      case "tanggal-terlama":
        return new Date(a.tanggalPinjam).getTime() - new Date(b.tanggalPinjam).getTime();
      case "tanggal-terbaru":
      default:
        return new Date(b.tanggalPinjam).getTime() - new Date(a.tanggalPinjam).getTime();
    }
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

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "data_peminjaman.xlsx");
  };
  
  const handleDownloadPDFBA = async (item: Peminjaman) => {
    try {
      const blob = await pdf(<GenerateBA data={item} />).toBlob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `BA_Peminjaman_${item.nomorPeminjaman}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal download PDF:", error);
      alert("Gagal membuat PDF");
    }
  };

  const handleDownloadPDFSIP = async (item: Peminjaman) => {
    try {
      const blob = await pdf(<GenerateSIP data={item} />).toBlob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `SIP_Peminjaman_${item.namaPeminjam}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Gagal download PDF:", error);
      alert("Gagal membuat PDF");
    }
  };

  const handleOpenEdit = (item: Peminjaman) => {
    setSelectedPeminjaman(item);
    setEditKeterangan(item.keterangan || "");
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="pt-0 pb-0 text-[25px] font-bold">Data Peminjaman</h1>
        {/* export + tambah data */}
        <div className="flex gap-2 ml-auto">
            <Button className="h-[35px] text-[14px] bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
              onClick={handleDownloadExcel}>
              <FolderDown className="h-4 w-4" />
              Eksport Data
            </Button>

            <Button className="h-[35px] text-[14px] bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
              onClick={() => router.push("/admin/peminjaman/add-peminjaman")}>
              <Plus className="h-4 w-4" />
              Tambah Data
            </Button>
        </div>
      </div>

    <div className="bg-white border border-gray-400 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1">
            {/* search */}
            <Input
              placeholder="Cari peminjam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[14px] placeholder:text-[14px] h-[35px] w-[200px] px-2"
            />
            {/* Status */}
            <Select onValueChange={setStatusFilter} value={statusFilter}>
              <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[140px] px-2">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Terlambat">Terlambat</SelectItem>
              </SelectContent>
            </Select>
            {/* Kategori */}
            <Select onValueChange={setKategori} value={kategori}>
              <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[180px] px-2">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                {["all", "Laptop/Server", "Monitor", "Printer", "TV", "Furniture", "Jaringan", "Elektronik", "Peripheral", "Lainnya"].map((k) => (
                  <SelectItem key={k} value={k}>{k === "all" ? "Semua Kategori" : k}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Sort */}
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
            {/* Reset Button */}
            <Button
              variant="outline"
              className="h-[35px] px-3"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setKategori("all");
                setSortBy("tanggal-terlama");
                setCurrentPage(1);
              }}
            >Reset
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border overflow-x-auto">
          <div ref={tableContainerRef} className="max-h-[400px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-blue-100 text-[14px] text-left">
                <tr>
                  <th className="border p-2">No</th>
                  <th className="border p-2 min-w-[135px]">Nomor Peminjaman</th>
                  <th className="border p-2 min-w-[120px]">Nama Peminjam</th>
                  <th className="border p-2 min-w-[110px]">Status Pegawai</th>
                  <th className="border p-2 min-w-[135px]">Pangkat / Golongan</th>
                  <th className="border p-2 min-w-[120px]">Jabatan</th>
                  <th className="border p-2 min-w-[130px]">NIP</th>
                  <th className="border p-2 min-w-[110px]">IKMM</th>
                  <th className="border p-2 min-w-[150px]">Nama / Merek / Tipe</th>
                  <th className="border p-2">NUP</th>
                  <th className="border p-2">Kategori</th>
                  <th className="border p-2 min-w-[130px] text-center">Tahun Peorlehan</th>
                  <th className="border p-2">Jumlah</th>
                  <th className="border p-2 min-w-[110px]">Tanggal Pinjam</th>
                  <th className="border p-2 min-w-[130px] text-center">Tanggal Selesai</th>
                  <th className="border p-2 min-w-[120px] text-center">Keterangan</th>
                  <th className="border p-2 text-center">Status</th>
                  <th className="border p-2 min-w-[100px] text-center">Bukti Foto</th>
                  <th className="border p-2 text-center">Hapus</th>
                  <th className="border p-2 text-center min-w-[100px]">Download BA</th>
                  <th className="border p-2 text-center min-w-[100px]">Download SIP</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {loading ? (
                  <tr>
                    <td colSpan={21} className="p-4 text-center">
                      <Loader2 className="animate-spin h-6 w-6 mx-auto" />
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
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
                    <td className="border p-2 text-center">{item.tanggalPerolehan.split("/")[2]}</td>
                    <td className="border p-2 text-center">{item.jumlahPinjam}</td>
                    <td className="border p-2 text-center">{item.tanggalPinjam}</td>

                    {/* Tanggal selesai */}
                    <td className="border p-2 text-center">
                      {item.tanggalSelesai ? item.tanggalSelesai : "-"}
                    </td>

                    {/* Klik untuk edit keterangan */}
                    <td
                      className="border p-2 text-center cursor-pointer text-blue-600 hover:underline"
                      onClick={() => handleOpenEdit(item)}
                    >
                      {item.keterangan || <span className="text-gray-400 italic">Klik untuk tambah...</span>}
                    </td>

                    {/* Status */}
                    <td className="border p-2 text-center">
                      <Select
                        value={item.statusPeminjaman}
                        onValueChange={(value) =>
                          handleInlineStatusChange(
                            item.idPeminjaman,
                            value as "Aktif" | "Selesai" | "Terlambat"
                          )
                        }
                      >
                        <SelectTrigger className="justify-center mx-auto cursor-pointer text-xs !h-[22px] w-[100px] px-2">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aktif" className="text-[10px]">Aktif</SelectItem>
                          <SelectItem value="Selesai" className="text-[10px]">Selesai</SelectItem>
                          <SelectItem value="Terlambat" className="text-[10px]">Terlambat</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    {/* Foto */}
                    <td className="border p-2 text-center">
                      {item.foto ? (
                        <button
                          onClick={() => item.foto?.[0] && window.open(item.foto[0], "_blank")}
                          className="bg-blue-500 text-white text-[10px] py-1 px-2 rounded hover:bg-blue-600"
                        >
                          Lihat Foto
                        </button>
                      ) : (
                        <>
                          <label
                            htmlFor={`upload-${item.idPeminjaman}`}
                            className="cursor-pointer bg-green-500 text-white text-[10px] py-1 px-2 rounded hover:bg-green-600"
                          >
                            Tambah Foto
                          </label>
                          <input
                            id={`upload-${item.idPeminjaman}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleUploadFoto(e, item.idPeminjaman)}
                            className="hidden"
                          />
                        </>
                      )}
                    </td>

                    {/* Hapus */}
                    <td className="border p-2 text-center">
                      <button
                        className="cursor-pointer rounded bg-red-500 p-1 text-white hover:bg-red-600"
                        onClick={() => handleDelete(item.idPeminjaman)}
                      >
                        <MdDeleteOutline className="text-lg" />
                      </button>
                    </td>

                    <td className="border p-2 text-center">
                      <button
                        className="cursor-pointer rounded bg-blue-500 p-1 text-white hover:bg-blue-600"
                        onClick={() => handleDownloadPDFBA(item)}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>

                    <td className="border p-2 text-center">
                      <button
                        className="cursor-pointer rounded bg-blue-500 p-1 text-white hover:bg-blue-600"
                        onClick={() => handleDownloadPDFSIP(item)}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                      <td colSpan={21} className="border p-4 text-center bg-gray-100">
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
          totalItems={sortedData.length}
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
