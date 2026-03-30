"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBMNPage() {
  const router = useRouter();

  // state
  const [namaBarang, setNamaBarang] = useState("");
  const [kategori, setKategori] = useState("");
  const [tanggalPerolehan, setTanggalPerolehan] = useState("");
  const [ikmm, setIkmm] = useState("");
  const [bidang, setBidang] = useState("");
  const [nup, setNup] = useState<number>(0);
  const [merkType, setMerkType] = useState("");
  const [kuantitas, setKuantitas] = useState<number>(1);
  const [satuan, setSatuan] = useState("");
  const [loading, setLoading] = useState(false);

  // mapping kategori - IKMM
  const kategoriToIkmm: Record<string, string> = {
    "Laptop/Server": "3100101002",
    "Monitor": "3100102003",
    "Printer": "3100102005",
    "TV": "3100102010",
    "Furniture": "3080101001",
    "Jaringan": "3100203001",
    "Elektronik": "3080105001",
    "Peripheral": "3100102001",
    "Lainnya": "0",
  };

  // submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaBarang || !kategori || !tanggalPerolehan || !bidang || !merkType || !satuan) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (kuantitas < 1) {
      alert("Kuantitas minimal 1!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bmn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaBarang,
          kategori,
          ikmm,
          bidang,
          nup: nup || undefined,
          merkType,
          kuantitas,
          jumlahBarang: kuantitas,
          satuan,
          tanggalPerolehan,
          kondisiBarang: "Baik",
          status: "Tersedia",
        }),
      });

      if (!res.ok) throw new Error("Failed to create BMN");

      alert("Data BMN berhasil ditambahkan!");
      router.push("/admin/bmn");
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan data BMN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-[20px] font-bold">Tambah Data BMN</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* nama barang */}
        <div>
          <label className="mb-1 block text-[14px] font-medium">Nama Barang *</label>
          <input
            type="text"
            className="w-full rounded border px-3 py-2 text-[14px]"
            placeholder="Masukkan nama barang"
            value={namaBarang}
            onChange={(e) => setNamaBarang(e.target.value)}
            required
          />
        </div>

        {/* kategori */}
        <div>
          <label className="mb-1 block text-[14px] font-medium">Kategori *</label>
          <select
            className="w-full rounded border px-3 py-2 text-[14px]"
            value={kategori}
            onChange={(e) => {
              setKategori(e.target.value);
              setIkmm(kategoriToIkmm[e.target.value] || "");
            }}
            required
          >
            <option value="">Pilih kategori</option>
            <option value="Laptop/Server">Laptop/Server</option>
            <option value="Monitor">Monitor</option>
            <option value="Printer">Printer</option>
            <option value="TV">TV</option>
            <option value="Furniture">Furniture</option>
            <option value="Jaringan">Jaringan</option>
            <option value="Elektronik">Elektronik</option>
            <option value="Peripheral">Peripheral</option>
            <option value="Lainnya">Lainnya</option>
          </select>

        </div>

        {/* IKMM */}
        <div>
          <label className="mb-1 block text-[14px] font-medium">Kode IKMM</label>
          <input
            type="text"
            className="w-full text-gray-700 rounded border bg-gray-100 px-3 py-2 text-[14px]"
            value={ikmm}
            readOnly
          />
        </div>

        {/* bidang */}
        <div>
          <label className="mb-1 block text-[14px] font-medium">Bidang *</label>
          <select
            className="w-full rounded border px-3 py-2 text-[14px]"
            value={bidang}
            onChange={(e) => setBidang(e.target.value)}
            required
          >
            <option value="">Pilih bidang</option>
            <option value="MTI">MTI</option>
            <option value="BDI">BDI</option>
            <option value="TU">TU</option>
          </select>
        </div>

        {/* NUP */}
        <div>
          <label className="mb-1 block text-[14px] font-medium">NUP</label>
          <input
            type="number"
            className="w-full rounded border px-3 py-2 text-[14px]"
            placeholder="Masukkan NUP (opsional)"
            value={nup || ""}
            onChange={(e) => setNup(e.target.value ? Number(e.target.value) : 0)}
          />
        </div>

        {/* Merk / Type */}
        <div>
          <label className="mb-1 block text-[14px] font-medium">Merk / Type *</label>
          <input
            type="text"
            className="w-full rounded border px-3 py-2 text-[14px]"
            placeholder="Masukkan merk atau tipe barang"
            value={merkType}
            onChange={(e) => setMerkType(e.target.value)}
            required
          />
        </div>

        {/* Kuantitas */}
        <div>
          <label className="mb-1 block text-[14px] font-medium">Kuantitas *</label>
          <input
            type="number"
            className="w-full rounded border px-3 py-2 text-[14px]"
            placeholder="Masukkan kuantitas"
            value={kuantitas}
            onChange={(e) => setKuantitas(Number(e.target.value) || 0)}
            required
          />
        </div>

        {/* Satuan */}
        <div>
          <label className="mb-1 block text-[14px] font-medium">Satuan *</label>
          <select
            className="w-full rounded border px-3 py-2 text-[14px]"
            value={satuan}
            onChange={(e) => setSatuan(e.target.value)}
            required
          >
            <option value="">Pilih satuan</option>
            <option value="Unit">Unit</option>
            <option value="Buah">Buah</option>
            <option value="Set">Set</option>
            <option value="Lembar">Lembar</option>
            <option value="Meter">Meter</option>
          </select>
        </div>

        {/* tanggal perolehan */}
        <div>
          <label className="mb-1 block text-[14px] font-medium">Tanggal Perolehan *</label>
          <input
            type="date"
            className="w-full rounded border px-3 py-2 text-[14px]"
            value={tanggalPerolehan}
            onChange={(e) => setTanggalPerolehan(e.target.value)}
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="cursor-pointer text-[14px] bg-red-500 font-bold text-white px-2 py-1 rounded hover:bg-red-800 disabled:opacity-50"
            onClick={() => router.push("/admin/bmn")}
            disabled={loading}>
            Kembali
          </button>

          <button
            type="submit"
            className="cursor-pointer text-[14px] bg-primary text-primary-foreground font-medium px-2 py-1 rounded hover:bg-secondary hover:text-secondary-foreground disabled:opacity-50"
            disabled={loading}>
            {loading ? "Menyimpan..." : "Tambah"}
          </button>
        </div>
      </form>
    </div>
  );
}
