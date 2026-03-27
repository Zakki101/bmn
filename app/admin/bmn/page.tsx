"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { MdDeleteOutline } from "react-icons/md";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FolderDown, Plus, Loader2, ArrowDownUp } from "lucide-react";
import Pagination from "@/components/ui/pagination";

export default function DataBMNAdminPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [kategori, setKategori] = useState("all");
  const [openUsulanDialog, setOpenUsulanDialog] = useState(false);
  const [selectedBmnId, setSelectedBmnId] = useState<number | null>(null);
  const [alasanUsulan, setAlasanUsulan] = useState("");
  const [bmnData, setBmnData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kondisi, setKondisi] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sortBy, setSortBy] = useState("tanggal-terlama");
  const router = useRouter();

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

  const parseDate = (d: string): Date => {
    if (!d) return new Date();
    // Assuming format is DD/MM/YYYY or similar if it comes from dummy
    // But DB result will likely be a timestamp or text.
    // Let's handle both just in case.
    if (d.includes("/")) {
      const [day, month, year] = d.split("/").map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(d);
  };

  // sorting
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

  // pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try {
      const res = await fetch(`/api/bmn/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      fetchBMN();
      alert("Data berhasil dihapus!");
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

      // In a real app, we'd upload to Supabase Storage/Blob and get a URL
      // For now, we'll continue with preview URL just for UI demonstration 
      // but ideally we PATCH the URL to the DB.
      const previewUrl = URL.createObjectURL(compressed);

      const res = await fetch(`/api/bmn/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foto: [previewUrl] }),
      });

      if (!res.ok) throw new Error("Upload failed");
      fetchBMN();
    } catch (err) {
      console.error("Gagal kompres gambar:", err);
    }
  };


  const handleKondisiChange = async (id: number, kondisiValue: string) => {
    try {
      const res = await fetch(`/api/bmn/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kondisiBarang: kondisiValue }),
      });
      if (!res.ok) throw new Error("Update failed");
      fetchBMN();
    } catch (err) {
      console.error(err);
      alert("Gagal update kondisi");
    }
  };

  const handleStatusChange = async (id: number, statusValue: string) => {
    try {
      const res = await fetch(`/api/bmn/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusValue }),
      });
      if (!res.ok) throw new Error("Update failed");
      fetchBMN();
    } catch (err) {
      console.error(err);
      alert("Gagal update status");
    }
  };

  const handleAjukanPenghapusan = (id: number) => {
    const item = bmnData.find((b) => b.id === id);
    if (!item) return;

    setSelectedBmnId(id);
    setAlasanUsulan("");
    setOpenUsulanDialog(true);
  };

  const handleSubmitUsulan = async () => {
    if (!selectedBmnId) return;
    if (!alasanUsulan.trim()) {
      alert("Alasan penghapusan wajib diisi!");
      return;
    }

    const item = bmnData.find((b) => b.id === selectedBmnId);

    try {
      const res = await fetch("/api/usulan-hapus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bmnId: selectedBmnId,
          tanggalUsulan: new Date().toISOString().split("T")[0],
          alasan: alasanUsulan.trim(),
        }),
      });

      if (!res.ok) throw new Error("Gagal mengajukan usulan");

      alert(`Usulan penghapusan untuk "${item?.namaBarang}" berhasil diajukan!`);
      setOpenUsulanDialog(false);
      setSelectedBmnId(null);
      setAlasanUsulan("");
      fetchBMN();
    } catch (err) {
      console.error("Error creating usulan:", err);
      alert("Gagal menambahkan usulan penghapusan. Silakan coba lagi.");
    }
  };

  const handleDownloadExcel = () => {
    const exportData = sortedData.map((item, i) => ({
      No: i + 1,
      "Kode Satker": item.kodeSatker,
      IKMM: item.ikmm,
      "Kode Akun": item.kodeAkun,
      Bidang: item.bidang,
      NUP: item.nup,
      "Nama Barang": item.namaBarang,
      "Merk / Type": item.merkType,
      Kuantitas: item.kuantitas,
      Satuan: item.satuan,
      Kategori: item.kategori,
      "Tanggal Perolehan": item.tanggalPerolehan,
      "Kondisi Barang": item.kondisiBarang,
      "Status": item.status,
      Foto: item.foto ? "Ada" : "Tidak Ada",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data BMN");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "data_bmn.xlsx");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="pt-0 pb-0 text-[25px] font-bold">Data BMN</h1>
        {/* export + tambah data */}
        <div className="flex gap-2 ml-auto">
          <Button
            className="cursor-pointer text-[14px] h-[35px] s bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
            onClick={() => handleDownloadExcel()}>
            <FolderDown className="h-4 w-4" />Eksport Data
          </Button>

          <Button
            className="cursor-pointer text-[14px] h-[35px] px-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
            onClick={() => router.push("/admin/bmn/add-bmn")}>
            <Plus className="h-4 w-4" />Tambah Data
          </Button>
        </div>
      </div>

      <div className="bg-white border border-gray-400 rounded-lg p-4 space-y-3">
        {/* Filter, Sort, Reset */}
        <div className="flex flex-wrap items-center gap-1">
          {/* cari data */}
          <Input
            placeholder="Cari barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[14px] placeholder:text-[14px] h-[35px] w-[365px] px-2"
          />
          {/* filter kategori */}
          <Select onValueChange={setKategori} value={kategori}>
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[180px] px-2">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              {["all", "Laptop/Server", "Monitor", "Printer", "TV", "Furniture", "Jaringan", "Elektronik", "Peripheral", "Lainnya"].map((k) => (
                <SelectItem key={k} value={k} className="text-[14px]">
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
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              <SelectItem value="all" className="text-[14px]">Semua Status</SelectItem>
              <SelectItem value="Dipinjam" className="text-[14px]">Dipinjam</SelectItem>
              <SelectItem value="Tersedia" className="text-[14px]">Tersedia</SelectItem>
              <SelectItem value="Tidak Tersedia" className="text-[14px]">Tidak Tersedia</SelectItem>
            </SelectContent>
          </Select>
          {/* sort */}
          <Select onValueChange={setSortBy} value={sortBy}>
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[200px] px-2">
              <ArrowDownUp className="h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              <SelectItem value="tanggal-terbaru" className="text-[14px]">Tanggal Terbaru</SelectItem>
              <SelectItem value="tanggal-terlama" className="text-[14px]">Tanggal Terlama</SelectItem>
              <SelectItem value="nama-az" className="text-[14px]">Nama (A - Z)</SelectItem>
              <SelectItem value="nama-za" className="text-[14px]">Nama (Z - A)</SelectItem>
            </SelectContent>
          </Select>

          {/* reset button */}
          <Button
            variant="outline"
            className="cursor-pointer text-[14px] h-[35px] px-3"
            onClick={() => {
              setSearch("");
              setKategori("all");
              setStatus("all");
              setKondisi("all");
              setSortBy("tanggal-terlama");
              setCurrentPage(1);
            }}
          > Reset
          </Button>
        </div>

        {/* Tabel */}
        <div className="pb-0 overflow-x-auto">
          <div ref={tableContainerRef} className="max-h-[400px] max-w-auto overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-blue-100 text-[14px] text-left sticky top-0 z-10">
                <tr>
                  <th className="border p-2">No</th>
                  <th className="border p-2 min-w-[120px]">Kode Satker</th>
                  <th className="border p-2 min-w-[140px]">IKMM / Kode Barang</th>
                  <th className="border p-2 min-w-[120px]">Kode Akun</th>
                  <th className="border p-2">Bidang</th>
                  <th className="border p-2">NUP</th>
                  <th className="border p-2 min-w-[200px]">Nama Barang</th>
                  <th className="border p-2 min-w-[150px]">Merk / Type</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Satuan</th>
                  <th className="border p-2">Kategori</th>
                  <th className="border p-2 min-w-[140px]">Tanggal Perolehan</th>
                  <th className="border p-2">Kondisi</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2 min-w-[120px]">Bukti Foto</th>
                  <th className="border p-2 min-w-[170px]">Usulkan Penghapusan</th>
                  <th className="border p-2 min-w-[80px]">Aksi</th>
                </tr>
              </thead>

              <tbody className="text-[14px]">
                {loading ? (
                  <tr>
                    <td colSpan={13} className="border p-8 text-center bg-gray-50">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border p-2">{startIndex + index + 1}</td>
                      <td className="border p-2">{item.kodeSatker}</td>
                      <td className="border p-2">{item.ikmm}</td>
                      <td className="border p-2">{item.kodeAkun}</td>
                      <td className="border p-2">{item.bidang}</td>
                      <td className="border p-2">{item.nup}</td>
                      <td className="border p-2">{item.namaBarang}</td>
                      <td className="border p-2">{item.merkType}</td>
                      <td className="border p-2 text-center">{item.kuantitas}</td>
                      <td className="border p-2">{item.satuan}</td>
                      <td className="border p-2">{item.kategori}</td>
                      <td className="border p-2">{item.tanggalPerolehan}</td>

                      {/* kondisi */}
                      <td className="border p-2 text-center">
                        <Select
                          value={item.kondisiBarang}
                          onValueChange={(v) =>
                            handleKondisiChange(item.id, v)
                          }
                        >
                          <SelectTrigger className="justify-between mx-auto cursor-pointer text-[14px] !h-[28px] min-w-[140px] px-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Baik" className="text-[14px]">Baik</SelectItem>
                            <SelectItem value="Rusak" className="text-[14px]">Rusak</SelectItem>
                            <SelectItem value="Dalam Perbaikan" className="text-[14px]">Dalam Perbaikan</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      {/* status */}
                      <td className="border p-2 text-center">
                        <Select
                          value={item.status}
                          onValueChange={(v) => handleStatusChange(item.id, v)}
                        >
                          <SelectTrigger className="justify-between mx-auto cursor-pointer text-[14px] !h-[28px] min-w-[120px] px-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dipinjam" className="text-[14px]">Dipinjam</SelectItem>
                            <SelectItem value="Tersedia" className="text-[14px]">Tersedia</SelectItem>
                            <SelectItem value="Tidak Tersedia" className="text-[14px]">Tidak Tersedia</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      {/* foto */}
                      <td className="border p-2 text-center">
                        {item.foto && JSON.parse(item.foto).length > 0 ? (
                          <button
                            onClick={() => window.open(JSON.parse(item.foto)[0], "_blank")}
                            className="bg-blue-500 text-white text-[14px] py-1 px-2 rounded hover:bg-blue-600"
                          >
                            Lihat Foto
                          </button>
                        ) : (
                          <>
                            <label
                              htmlFor={`upload-${item.id}`}
                              className="cursor-pointer bg-green-500 text-white text-[14px] py-1 px-2 rounded hover:bg-green-600"
                            >
                              Tambah Foto
                            </label>

                            <input
                              id={`upload-${item.id}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUploadFoto(e, item.id)}
                              className="hidden"
                            />
                          </>
                        )}

                      </td>

                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleAjukanPenghapusan(item.id)}
                          className="cursor-pointer bg-yellow-500 text-white text-[14px] py-1 px-2 rounded hover:bg-yellow-600"
                        >
                          Usulkan
                        </button>
                      </td>

                      {/* hapus */}
                      <td className="border p-2 text-center">
                        <button
                          className="cursor-pointer rounded text-black hover:text-red-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          <MdDeleteOutline className="text-[20px]" />
                        </button>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={17} className="border p-4 text-center bg-gray-100">
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
          totalItems={bmnData.length}
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

      <Dialog open={openUsulanDialog} onOpenChange={setOpenUsulanDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Usulkan Penghapusan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-[14px] font-medium">Alasan Penghapusan</label>
              <textarea
                className="w-full min-h-[100px] border border-gray-300 rounded-md p-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Masukkan alasan penghapusan BMN ini..."
                value={alasanUsulan}
                onChange={e => setAlasanUsulan(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenUsulanDialog(false)}>Batal</Button>
            <Button onClick={handleSubmitUsulan}>Submit Usulan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}