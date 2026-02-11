"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { dataBMN, BMN } from "@/data/dataBMN";

export default function AddBMNPage() {
  const router = useRouter();

  // state
  const [namaBarang, setNamaBarang] = useState("");
  const [kategori, setKategori] = useState<BMN["kategori"] | "">("");
  const [tanggalPerolehan, setTanggalPerolehan] = useState("");
  const [ikmm, setIkmm] = useState("");
  const [jumlahBarang, setJumlahBarang] = useState<number>(1);
  const [bidang, setBidang] = useState<BMN["bidang"] | "">("");

  // mapping kategori - IKMM
  const kategoriToIkmm: Record<string, string> = {
    Laptop: "3100106002",
    TV: "3100103002",
    Monitor: "3100106002",
    Printer: "3100104002",
    Peripheral: "3100203017",
  };

  // format tanggal
  const formatDate = (isoDate: string): string => {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  };

  const generateNUP = (
    existingData: BMN[],
    namaBarang: string,
    jumlahBaru: number,
    kategori: BMN["kategori"],
    ikmm: string,
    tanggalPerolehan: string,
    bidang: BMN["bidang"]
  ): BMN[] => {
    // cari data BMN yang sama berdasarkan namaBarang
    const sameItems = existingData.filter((item) => item.namaBarang === namaBarang);

    // cari NUP terakhir
    const lastNUP = sameItems.length > 0 ? Math.max(...sameItems.map((i) => i.unit)) : 0;

    // buat array baru sesuai jumlah yang ditambahkan
    return Array.from({ length: jumlahBaru }, (_, i) => ({
      idBMN: existingData.length + i + 1,
      akun: 132111, // ✅ angka, bukan string
      ikmm,
      unit: lastNUP + i + 1,
      namaBarang,
      kategori,
      tanggalPerolehan: formatDate(tanggalPerolehan),
      kondisiBarang: "Baik",
      dipinjam: "Tersedia", // ✅ sesuai tipe union
      bidang: bidang,
    }));
  };

  // submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaBarang || !kategori || !tanggalPerolehan || !bidang) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (jumlahBarang < 1) {
      alert("Jumlah barang minimal 1!");
      return;
    }

    const newItems = generateNUP(
      dataBMN,
      namaBarang,
      jumlahBarang,
      kategori,
      ikmm,
      tanggalPerolehan,
      bidang as BMN["bidang"]
    );

    dataBMN.push(...newItems);
    router.push("/admin/bmn");
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-sm font-bold">Tambah Data BMN</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* nama barang */}
        <div>
          <label className="mb-1 block text-xs font-medium">Nama Barang *</label>
          <input
            type="text"
            className="w-full rounded border px-3 py-2 text-xs"
            placeholder="Masukkan nama barang"
            value={namaBarang}
            onChange={(e) => setNamaBarang(e.target.value)}
            required
          />
        </div>

        {/* kategori */}
        <div>
          <label className="mb-1 block text-xs font-medium">Kategori *</label>
          <select
            className="w-full rounded border px-3 py-2 text-xs"
            value={kategori}
            onChange={(e) => {
              const val = e.target.value as BMN["kategori"];
              setKategori(val);
              setIkmm(kategoriToIkmm[val] || "");
            }}
            required
          >
            <option value="">Pilih kategori</option>
            <option value="Laptop">Laptop</option>
            <option value="TV">TV</option>
            <option value="Monitor">Monitor</option>
            <option value="Printer">Printer</option>
            <option value="Peripheral">Peripheral</option>
            <option value="Internet">Internet</option>
            <option value="Lainnya">Lainnya</option>
          </select>

        </div>

        {/* IKMM */}
        <div>
          <label className="mb-1 block text-xs font-medium">Kode IKMM</label>
          <input
            type="text"
            className="w-full text-gray-700 rounded border bg-gray-100 px-3 py-2 text-xs"
            value={ikmm}
            readOnly
          />
        </div>

        {/* bidang */}
        <div>
          <label className="mb-1 block text-xs font-medium">Bidang *</label>
          <select
            className="w-full rounded border px-3 py-2 text-xs"
            value={bidang}
            onChange={(e) => setBidang(e.target.value as BMN["bidang"])}
            required
          >
            <option value="">Pilih bidang</option>
            <option value="MTI">MTI</option>
            <option value="BDI">BDI</option>
            <option value="TU">TU</option>
          </select>
        </div>

        {/* jumlah barang */}
        <div>
          <label className="mb-1 block text-xs font-medium">Jumlah Barang *</label>
          <input
            type="number"
            min={1}
            className="w-full rounded border px-3 py-2 text-xs"
            placeholder="Masukkan jumlah barang"
            value={jumlahBarang}
            onChange={(e) => setJumlahBarang(Number(e.target.value))}
            required
          />
        </div>

        {/* tanggal perolehan */}
        <div>
          <label className="mb-1 block text-xs font-medium">Tanggal Perolehan *</label>
          <input
            type="date"
            className="w-full rounded border px-3 py-2 text-xs"
            value={tanggalPerolehan}
            onChange={(e) => setTanggalPerolehan(e.target.value)}
            required
          />
        </div>

        {/* tombol */}
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="cursor-pointer rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
          >
            Simpan
          </button>
          <button
            type="button"
            className="cursor-pointer rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
            onClick={() => router.push("/admin/bmn")}
          >
            Kembali
          </button>
        </div>
      </form>
    </div>
  );
}
