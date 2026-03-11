"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MdDeleteOutline } from "react-icons/md";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { dataBMN as initialDataBMN } from "@/data/dataBMN";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FolderDown, Plus } from "lucide-react";

export default function DataBMNAdminPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [kategori, setKategori] = useState("all");
  const [bmnData, setBmnData] = useState(initialDataBMN);
  const [kondisi, setKondisi] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const router = useRouter();

  const parseDate = (d: string): Date => {
    const [day, month, year] = d.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredData = bmnData
    .filter((i) => {
      const matchSearch = i.namaBarang.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === "all" || i.dipinjam === status;
      const matchKategori = kategori === "all" || i.kategori === kategori;
      const matchKondisi = kondisi === "all" || i.kondisiBarang === kondisi;
      return matchSearch && matchStatus && matchKategori && matchKondisi;
    })
    .sort((a, b) => parseDate(b.tanggalPerolehan).getTime() - parseDate(a.tanggalPerolehan).getTime());

  // pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleDelete = (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    setBmnData(bmnData.filter((i) => i.idBMN !== id));
    alert("Data berhasil dihapus!");
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

      const previewUrl = URL.createObjectURL(compressed);

      setBmnData(
        bmnData.map((b) =>
          b.idBMN === id
            ? { ...b, foto: [previewUrl] } 
            : b
        )
      );
    } catch (err) {
      console.error("Gagal kompres gambar:", err);
    }
  };


  const handleKondisiChange = (id: number, kondisi: "Baik" | "Rusak" | "Dalam Perbaikan") => {
    setBmnData(bmnData.map((b) => (b.idBMN === id ? { ...b, kondisiBarang: kondisi } : b)));
  };

  const handleAjukanPenghapusan = (id: number) => {
    const item = bmnData.find((b) => b.idBMN === id);
    if (!item) return;
    if (confirm(`Ajukan penghapusan untuk ${item.namaBarang} (NUP: ${item.unit})?`)) {
      alert(`Usulan penghapusan untuk "${item.namaBarang}" berhasil diajukan!`);
    }
  };

  const handleDownloadExcel = () => {
          const exportData = filteredData.map((item, i) => ({
            No: i + 1,
            IKMM: item.ikmm,
            Akun: item.akun,
            Bidang: item.bidang,
            "Nama Barang": item.namaBarang,
            NUP: item.unit,
            Kategori: item.kategori,
            "Tanggal Perolehan": item.tanggalPerolehan,
            "Kondisi Barang": item.kondisiBarang,
            "Status": item.dipinjam,
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
      <h1 className="pt-0 pb-0 text-[25px] font-bold">Data BMN</h1>

      {/* Search + Filter + Add */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <Input
            placeholder="Cari barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[14px] placeholder:text-[14px] h-[35px] w-[200px] px-2"
          />
          <Select onValueChange={setStatus} defaultValue="all">
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
          <Select onValueChange={setKondisi} defaultValue="all">
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
          <Select onValueChange={setKategori} defaultValue="all">
            <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[180px] px-2">
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
            className="cursor-pointer text-[14px] h-[35px] px-3"
            onClick={() => {
              setSearch("");
              setKategori("all");
              setStatus("all");
              setKondisi("all");
              setCurrentPage(1);
            }}
          >Reset
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
              onClick={() => router.push("/admin/bmn/add-bmn")}>
              <Plus className="h-4 w-4" />
              Tambah
            </Button>
          </div>
      </div>

      {/* Tabel */}
      <div className="bg-white pb-0 rounded-lg shadow border overflow-x-auto">
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
                <th className="border p-2 min-w-[140px]">Tanggal Perolehan</th>
                <th className="border p-2 text-center">Kondisi</th>
                <th className="border p-2 text-center">Status</th>
                <th className="border p-2 min-w-[120px] text-center">Bukti Foto</th>
                <th className="border p-2 text-center min-w-[170px]">Usulkan Penghapusan</th>
                <th className="border p-2 text-center">Hapus</th>
              </tr>
            </thead>

            <tbody className="text-[12px]">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={item.idBMN} className="hover:bg-gray-50">
                    <td className="border p-2">{startIndex + index + 1}</td>
                    <td className="border p-2">{item.ikmm}</td>
                  <td className="border p-2">{item.akun}</td>
                  <td className="border p-2">{item.bidang}</td>
                  <td className="border p-2">{item.namaBarang}</td>
                  <td className="border p-2">{item.unit}</td>
                  <td className="border p-2">{item.kategori}</td>
                  <td className="border p-2">{item.tanggalPerolehan}</td>

                  {/* kondisi */}
                  <td className="border p-2 text-center">
                    <Select
                      value={item.kondisiBarang}
                      onValueChange={(v) =>
                        handleKondisiChange(item.idBMN, v as "Baik" | "Rusak" | "Dalam Perbaikan")
                      }
                    >
                      <SelectTrigger className="justify-between mx-auto cursor-pointer text-[12px] !h-[28px] min-w-[140px] px-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baik" className="text-[12px]">Baik</SelectItem>
                        <SelectItem value="Rusak" className="text-[12px]">Rusak</SelectItem>
                        <SelectItem value="Dalam Perbaikan" className="text-[12px]">Dalam Perbaikan</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  {/* status */}
                  <td className="border p-2 text-center">
                    <Select
                      value={item.dipinjam}
                      onValueChange={(v) =>
                        setBmnData(
                          bmnData.map((b) =>
                            b.idBMN === item.idBMN
                              ? { ...b, dipinjam: v as "Dipinjam" | "Tersedia" | "Tidak Tersedia" }
                              : b
                          )
                        )
                      }
                    >
                      <SelectTrigger className="justify-between mx-auto cursor-pointer text-[12px] !h-[28px] min-w-[120px] px-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dipinjam" className="text-[12px]">Dipinjam</SelectItem>
                        <SelectItem value="Tersedia" className="text-[12px]">Tersedia</SelectItem>
                        <SelectItem value="Tidak Tersedia" className="text-[12px]">Tidak Tersedia</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  {/* foto */}
                  <td className="border p-2 text-center">
                    {item.foto && item.foto.length > 0 ? (
                      <button
                        onClick={() => window.open(item.foto![0], "_blank")}
                        className="bg-blue-500 text-white text-[12px] py-1 px-2 rounded hover:bg-blue-600"
                      >
                        Lihat Foto
                      </button>
                    ) : (
                      <>
                        <label
                          htmlFor={`upload-${item.idBMN}`}
                          className="cursor-pointer bg-green-500 text-white text-[12px] py-1 px-2 rounded hover:bg-green-600"
                        >
                          Tambah Foto
                        </label>

                        <input
                          id={`upload-${item.idBMN}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadFoto(e, item.idBMN)}
                          className="hidden"
                        />
                      </>
                    )}

                  </td>
                  
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleAjukanPenghapusan(item.idBMN)}
                      className="cursor-pointer bg-yellow-500 text-white text-[12px] py-1 px-2 rounded hover:bg-yellow-600"
                    >
                      Usulkan 
                    </button>
                  </td>

                  {/* hapus */}
                  <td className="border p-2 text-center">
                    <button
                      className="cursor-pointer rounded bg-gray-300 p-1 text-gray-500 hover:text-white hover:bg-red-600"
                      onClick={() => handleDelete(item.idBMN)}
                    >
                      <MdDeleteOutline className="text-lg" />
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