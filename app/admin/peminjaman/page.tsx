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
import { Download } from "lucide-react";

// Format tanggal ke dd/mm/yyyy


export default function DataPeminjamanAdminPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [kategori, setKategori] = useState("all");
  const [peminjamanData, setPeminjamanData] = useState(initialDataPeminjaman);
  const [selectedPeminjaman, setSelectedPeminjaman] = useState<Peminjaman | null>(null);
  const [editKeterangan, setEditKeterangan] = useState("");
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
    <div className="p-2 space-y-2">
      <h1 className="pt-0 pb-0 text-xs font-bold">Data Peminjaman</h1>

      {/* Search + Filter + Tambah */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <Input
            placeholder="Cari peminjam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-xs placeholder:text-xs h-[24px] w-[200px] px-2 !bg-gray-50"
          />

          <Select onValueChange={setStatusFilter} defaultValue="all">
            <SelectTrigger className="cursor-pointer text-xs !h-[24px] w-[140px] px-2 !bg-gray-50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="all" className="text-[10px]">Semua Status</SelectItem>
              <SelectItem value="Aktif" className="text-[10px]">Aktif</SelectItem>
              <SelectItem value="Selesai" className="text-[10px]">Selesai</SelectItem>
              <SelectItem value="Terlambat" className="text-[10px]">Terlambat</SelectItem>
            </SelectContent>
          </Select>

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
            className="cursor-pointer text-xs h-[24px] px-3 !bg-gray-50"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setKategori("all");
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

        <Button
          variant="default"
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-xs h-[24px] px-3"
          onClick={() => router.push("/admin/peminjaman/add-peminjaman")}
        >
          + Tambah
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border overflow-x-auto">
        <div className="max-h-[400px] max-w-[1035px] overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-blue-100 text-left sticky top-0 z-10">
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
                <th className="border p-2 min-w-[100px] text-center">Bukti Foto</th>
                <th className="border p-2 text-center">Hapus</th>
                <th className="border p-2 text-center min-w-[100px]">Download BA</th>
                <th className="border p-2 text-center min-w-[100px]">Download SIP</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.idPeminjaman} className="hover:bg-gray-50">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog Edit Keterangan */}
      <Dialog open={!!selectedPeminjaman} onOpenChange={() => setSelectedPeminjaman(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Edit Keterangan</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <Input
              value={editKeterangan}
              onChange={(e) => setEditKeterangan(e.target.value)}
              placeholder="Masukkan keterangan peminjaman..."
            />
          </div>
          <DialogFooter >
            <Button className="cursor-pointer text-xs h-[26px] px-3" variant="outline" onClick={() => setSelectedPeminjaman(null)}>
              Batal
            </Button>
            <Button className="cursor-pointer text-xs h-[26px] px-3" onClick={handleSaveKeterangan}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
