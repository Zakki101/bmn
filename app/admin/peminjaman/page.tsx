"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MdDeleteOutline } from "react-icons/md";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { dataPeminjaman as initialDataPeminjaman, Peminjaman } from "@/data/dataPeminjaman";
import { dataLogPeminjaman } from "@/data/dataLogPeminjaman";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FileSpreadsheet } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import GenerateBA from "@/components/pdf/GenerateBA";
import GenerateSIP from "@/components/pdf/GenerateSIP";
import { Download, FolderDown, Plus } from "lucide-react";

// Format tanggal ke dd/mm/yyyy


export default function DataPeminjamanAdminPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kategori, setKategori] = useState("all");
  const [peminjamanData, setPeminjamanData] = useState(initialDataPeminjaman);
  const [selectedPeminjaman, setSelectedPeminjaman] = useState<Peminjaman | null>(null);
  const [editKeterangan, setEditKeterangan] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();

  function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split(/[/-]/).map(Number);
    return new Date(year, month - 1, day);
  }

  // Filter + sort
  const filteredData = peminjamanData
    .filter((item) => {
      const matchSearch = item.namaPeminjam.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || item.statusPeminjaman === statusFilter;
      const matchKategori = kategori === "all" || item.kategori === kategori;
      return matchSearch && matchStatus && matchKategori;
    })
    .sort((a, b) => {
      const dateA = parseDate(a.tanggalPinjam);
      const dateB = parseDate(b.tanggalPinjam);
      return dateB.getTime() - dateA.getTime();
    });

  // pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Hapus
  const handleDelete = (id: number) => {
    const itemToDelete = peminjamanData.find((i) => i.idPeminjaman === id);
    if (!itemToDelete) return;

    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    if (itemToDelete.statusPeminjaman === "Selesai") {
      dataLogPeminjaman.push(itemToDelete);
      alert("Data selesai berhasil dipindahkan ke log!");
    }

    setPeminjamanData(peminjamanData.filter((i) => i.idPeminjaman !== id));
  };

  // Upload foto
  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      const previewUrl = URL.createObjectURL(compressed);
      setPeminjamanData(
        peminjamanData.map((p) => (p.idPeminjaman === id ? { ...p, foto: p.foto ? [...p.foto, previewUrl] : [previewUrl] }
          : p))
      );
    } catch (err) {
      console.error("Gagal kompres gambar:", err);
    }
  };

  // Ganti status
  const handleInlineStatusChange = (
    id: number,
    value: "Aktif" | "Selesai" | "Terlambat"
  ) => {
    const currentItem = peminjamanData.find((p) => p.idPeminjaman === id);
    if (!currentItem) return;

    if (value === "Selesai") {
      const confirmed = confirm("Apakah Anda yakin peminjaman ini telah selesai?");
      if (!confirmed) return;
    }

    setPeminjamanData((prev) =>
      prev.map((p) =>
        p.idPeminjaman === id
          ? {
            ...p,
            statusPeminjaman: value,
            tanggalSelesai:
              value === "Selesai"
                ? new Date().toLocaleDateString("id-ID")
                : "-",
          }
          : p
      )
    );
  };

  useEffect(() => {
    const today = new Date();
    const expired = peminjamanData.filter((item) => {
      if (item.statusPeminjaman !== "Selesai" || !item.tanggalSelesai) return false;
      const selesaiDate = parseDate(item.tanggalSelesai);
      const diffDays = Math.floor(
        (today.getTime() - selesaiDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays >= 7;
    });

    if (expired.length > 0) {
      expired.forEach((item) => dataLogPeminjaman.push(item));
      setPeminjamanData((prev) =>
        prev.filter((item) => !expired.some((e) => e.idPeminjaman === item.idPeminjaman))
      );
      alert(`${expired.length} data selesai telah otomatis dipindahkan ke log.`);
    }
  }, [peminjamanData]);

  const handleOpenEdit = (item: Peminjaman) => {
    setSelectedPeminjaman(item);
    setEditKeterangan(item.keterangan || "");
  };

  const handleSaveKeterangan = () => {
    if (!selectedPeminjaman) return;
    setPeminjamanData((prev) =>
      prev.map((p) =>
        p.idPeminjaman === selectedPeminjaman.idPeminjaman
          ? { ...p, keterangan: editKeterangan }
          : p
      )
    );
    setSelectedPeminjaman(null);
  };

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

  return (
    <div className="space-y-2">
      <h1 className="pt-0 pb-0 text-[25px] font-bold">Data Peminjaman</h1>

      {/* Search + Filter + Tambah */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <Input
            placeholder="Cari peminjam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[14px] placeholder:text-[14px] h-[35px] w-[200px] px-2 !bg-gray-50"
          />

          <Select onValueChange={setStatusFilter} defaultValue="all">
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[140px] px-2 !bg-gray-50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              <SelectItem value="all" className="text-[14px]">Semua Status</SelectItem>
              <SelectItem value="Aktif" className="text-[14px]">Aktif</SelectItem>
              <SelectItem value="Selesai" className="text-[14px]">Selesai</SelectItem>
              <SelectItem value="Terlambat" className="text-[14px]">Terlambat</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setKategori} defaultValue="all">
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[180px] px-2 !bg-gray-50">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent className="text-[14px]">
              {["all", "Laptop", "Monitor", "Printer", "TV", "Peripheral", "Lainnya"].map((k) => (
                <SelectItem key={k} value={k} className="text-[14px]">
                  {k === "all" ? "Semua Kategori" : k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="cursor-pointer text-[14px] h-[35px] px-3 !bg-gray-50"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setKategori("all");
              setCurrentPage(1);
            }}
          >
            Reset
          </Button>
        </div>

          {/* export + tambah data */}
          <div className="flex gap-2 ml-auto">
            <Button
              className="cursor-pointer text-[12px] h-[35px] s bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
              onClick={() => handleDownloadExcel()}>
              <FolderDown className="mr-1 h-4 w-4" />
              Eksport Data
            </Button>

            <Button
              className="cursor-pointer text-[12px] h-[35px] px-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground"
              onClick={() => router.push("/admin/peminjaman/add-peminjaman")}>
              <Plus className="h-4 w-4" />
              Tambah
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
                <th className="border p-2 min-w-[130px] text-center">Tahun Peorlehan</th>
                <th className="border p-2">Jumlah</th>
                <th className="border p-2 min-w-[110px]">Tanggal Pinjam</th>
                <th className="border p-2 min-w-[130px] text-center">Tanggal Selesai</th>
                <th className="border p-2 min-w-[120px] text-center">Keterangan</th>
                <th className="border p-2 text-center">Status</th>
                <th className="border p-2 min-w-[120px] text-center">Bukti Foto</th>
                <th className="border p-2 text-center">Hapus</th>
                <th className="border p-2 text-center min-w-[100px]">Download BA</th>
                <th className="border p-2 text-center min-w-[100px]">Download SIP</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
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
                        <SelectTrigger className="justify-between mx-auto cursor-pointer text-[12px] !h-[30px] min-w-[100px] px-2">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Aktif" className="text-[12px]">Aktif</SelectItem>
                          <SelectItem value="Selesai" className="text-[12px]">Selesai</SelectItem>
                          <SelectItem value="Terlambat" className="text-[12px]">Terlambat</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    {/* Foto */}
                    <td className="border p-2 text-center">
                      {item.foto ? (
                        <button
                          onClick={() => item.foto?.[0] && window.open(item.foto[0], "_blank")}
                          className="bg-blue-500 text-white text-[12px] py-1 px-2 rounded hover:bg-blue-600"
                        >
                          Lihat Foto
                        </button>
                      ) : (
                        <>
                          <label
                            htmlFor={`upload-${item.idPeminjaman}`}
                            className="cursor-pointer bg-green-500 text-white text-[12px] py-1 px-2 rounded hover:bg-green-600"
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
                  <td colSpan={12} className="border p-4 text-center bg-red-100">
                    <span className="text-red-800 font-semibold text-[14px]">Data tidak ada</span>
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
