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

export default function DataBMNAdminPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [kategori, setKategori] = useState("all");
  const [bmnData, setBmnData] = useState(initialDataBMN);
  const [kondisi, setKondisi] = useState("all");
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
            ? { ...b, foto: [previewUrl] } // ← PASTIKAN ARRAY
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

  return (
    <div className="p-2 space-y-2">
      <h1 className="pt-0 pb-0 text-xs font-bold">Data BMN</h1>

      {/* Search + Filter + Add */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-1">
          <Input
            placeholder="Cari barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[10px] placeholder:text-xs h-[24px] w-[200px] px-2 !bg-gray-50"
          />
          <Select onValueChange={setStatus} defaultValue="all">
            <SelectTrigger className="cursor-pointer text-xs !h-[24px] w-[130px] px-2 !bg-gray-50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="all" className="text-[10px]">Semua Status</SelectItem>
              <SelectItem value="Dipinjam" className="text-[10px]">Dipinjam</SelectItem>
              <SelectItem value="Tersedia" className="text-[10px]">Tersedia</SelectItem>
              <SelectItem value="Tidak Tersedia" className="text-[10px]">Tidak Tersedia</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={setKondisi} defaultValue="all">
            <SelectTrigger className="cursor-pointer text-xs !h-[24px] w-[130px] px-2 !bg-gray-50">
              <SelectValue placeholder="Kondisi" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="all" className="text-[10px]">Semua Kondisi</SelectItem>
              <SelectItem value="Baik" className="text-[10px]">Baik</SelectItem>
              <SelectItem value="Rusak" className="text-[10px]">Rusak</SelectItem>  
              <SelectItem value="Dalam Perbaikan" className="text-[10px]">Dalam Perbaikan</SelectItem>
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
              setKategori("all");
            }}
          >Reset
          </Button>
        </div>
        <Button
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-xs h-[24px] px-3"
          onClick={() => router.push("/admin/bmn/add-bmn")}
        >
          + Tambah
        </Button>
      </div>

      {/* Tabel */}
      <div className="bg-white pb-0 rounded-lg shadow border overflow-x-auto">
        <div className="max-h-[400px] max-w-[1035px] overflow-y-auto">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-blue-100 text-left sticky top-0 z-10">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2 min-w-[140px]">IKMM / Kode Barang</th>
                <th className="border p-2">Akun</th>
                <th className="border p-2 min-w-[150px]">Nama / Merek / Tipe</th>
                <th className="border p-2">NUP</th>
                <th className="border p-2">Kategori</th>
                <th className="border p-2 min-w-[140px]">Tanggal Perolehan</th>
                <th className="border p-2 text-center">Kondisi</th>
                <th className="border p-2 text-center">Status</th>
                <th className="border p-2 min-w-[100px] text-center">Bukti Foto</th>
                <th className="border p-2 text-center min-w-[170px]">Usulkan Penghapusan</th>
                <th className="border p-2 text-center">Hapus</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.idBMN} className="hover:bg-gray-50">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{item.ikmm}</td>
                  <td className="border p-2">{item.akun}</td>
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
                      <SelectTrigger className="justify-center mx-auto cursor-pointer text-xs !h-[22px] w-[95px] px-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baik" className="text-[10px]">Baik</SelectItem>
                        <SelectItem value="Rusak" className="text-[10px]">Rusak</SelectItem>
                        <SelectItem value="Dalam Perbaikan" className="text-[10px]">Dalam Perbaikan</SelectItem>
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
                      <SelectTrigger className="justify-center mx-auto cursor-pointer text-xs !h-[22px] w-[95px] px-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dipinjam" className="text-[10px]">Dipinjam</SelectItem>
                        <SelectItem value="Tersedia" className="text-[10px]">Tersedia</SelectItem>
                        <SelectItem value="Tidak Tersedia" className="text-[10px]">Tidak Tersedia</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>

                  {/* foto */}
                  <td className="border p-2 text-center">
                    {item.foto && item.foto.length > 0 ? (
                      <button
                        onClick={() => window.open(item.foto![0], "_blank")}
                        className="bg-blue-500 text-white text-[10px] py-1 px-2 rounded hover:bg-blue-600"
                      >
                        Lihat Foto
                      </button>
                    ) : (
                      <>
                        <label
                          htmlFor={`upload-${item.idBMN}`}
                          className="cursor-pointer bg-green-500 text-white text-[10px] py-1 px-2 rounded hover:bg-green-600"
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
                      className="cursor-pointer bg-yellow-500 text-white text-[10px] py-1 px-2 rounded hover:bg-yellow-600"
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}