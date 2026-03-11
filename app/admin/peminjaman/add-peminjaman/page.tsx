"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddPeminjamanPage() {
  const router = useRouter();

  // state
  const [bmns, setBmns] = useState<any[]>([]);
  const [selectedBmnId, setSelectedBmnId] = useState<string>("");
  const [namaPeminjam, setNamaPeminjam] = useState("");
  const [statusPegawai, setStatusPegawai] = useState<"PPPK" | "KI" | "PNS" | "Magang">("Magang");
  const [nip, setNip] = useState("");
  const [pangkatGolongan, setPangkatGolongan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [jumlahPinjam, setJumlahPinjam] = useState<number>(1);
  const [tanggalPinjam, setTanggalPinjam] = useState(new Date().toISOString().split("T")[0]);
  const [tujuan, setTujuan] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBmns = async () => {
      try {
        const res = await fetch("/api/bmn");
        const data = await res.json();
        setBmns(data.filter((item: any) => item.dipinjam === "Tersedia"));
      } catch (err) {
        console.error(err);
      }
    };
    fetchBmns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBmnId || !namaPeminjam || !nip || !tanggalPinjam) {
      alert("Field wajib diisi: Barang, Nama Peminjam, NIP, Tanggal Pinjam");
      return;
    }

    setLoading(true);
    try {
      // Generate dummy nomor peminjaman for now
      const nextNomor = Math.floor(Math.random() * 1000); 
      const nomorPeminjaman = `${nextNomor}/BDI-TB/I/${new Date().getFullYear()}`;

      const body = {
        nomorPeminjaman,
        namaPeminjam,
        statusPegawai,
        nip,
        bmnId: parseInt(selectedBmnId),
        jumlahPinjam,
        tanggalPinjam,
        tujuan,
        keterangan,
        pangkatGolongan,
        jabatan,
        statusPeminjaman: "Aktif",
      };

      const res = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save loan");

      // Update BMN status to "Dipinjam"
      await fetch(`/api/bmn/${selectedBmnId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dipinjam: "Dipinjam" }),
      });

      router.push("/admin/peminjaman");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan data peminjaman");
    } finally {
      setLoading(false);
    }
  };

  const selectedBmn = bmns.find(b => b.id === parseInt(selectedBmnId));

  return (
    <div className="bg-white p-6 rounded-lg shadow max-h-[calc(100vh-100px)] overflow-y-auto">
      <h2 className="text-[20px] font-bold mb-4">Tambah Data Peminjaman</h2>

      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <div className="col-span-2">
          <label className="block text-[14px] font-medium mb-1">Pilih Barang BMN (Tersedia) *</label>
          <select
            className="text-[14px] w-full border px-3 py-2 rounded"
            value={selectedBmnId}
            onChange={(e) => setSelectedBmnId(e.target.value)}
          >
            <option value="">-- Pilih Barang --</option>
            {bmns.map((b) => (
              <option key={b.id} value={b.id}>
                [{b.ikmm}] {b.namaBarang} - NUP: {b.unit}
              </option>
            ))}
          </select>
        </div>

        {selectedBmn && (
            <div className="col-span-2 bg-blue-50 p-2 rounded text-[12px] grid grid-cols-2 gap-2">
                <div><span className="font-bold">IKMM:</span> {selectedBmn.ikmm}</div>
                <div><span className="font-bold">Unit (NUP):</span> {selectedBmn.unit}</div>
                <div><span className="font-bold">Kategori:</span> {selectedBmn.kategori}</div>
                <div><span className="font-bold">Kondisi:</span> {selectedBmn.kondisiBarang}</div>
            </div>
        )}

        <div>
          <label className="block text-[14px] font-medium mb-1">Nama Peminjam *</label>
          <input
            type="text"
            className="text-[14px] w-full border px-3 py-2 rounded"
            value={namaPeminjam}
            onChange={(e) => setNamaPeminjam(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[14px] font-medium mb-1">NIP *</label>
          <input
            type="text"
            className="text-[14px] w-full border px-3 py-2 rounded"
            value={nip}
            onChange={(e) => setNip(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[14px] font-medium mb-1">Status Pegawai *</label>
          <select
            className="text-[14px] w-full border px-3 py-2 rounded"
            value={statusPegawai}
            onChange={(e) => setStatusPegawai(e.target.value as any)}
          >
            <option value="PPPK">PPPK</option>
            <option value="KI">KI</option>
            <option value="PNS">PNS</option>
            <option value="Magang">Magang</option>
          </select>
        </div>

        <div>
          <label className="block text-[14px] font-medium mb-1">Pangkat / Golongan</label>
          <input
            type="text"
            className="text-[14px] w-full border px-3 py-2 rounded"
            value={pangkatGolongan}
            onChange={(e) => setPangkatGolongan(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[14px] font-medium mb-1">Jabatan</label>
          <input
            type="text"
            className="text-[14px] w-full border px-3 py-2 rounded"
            value={jabatan}
            onChange={(e) => setJabatan(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[14px] font-medium mb-1">Jumlah Pinjam *</label>
          <input
            type="number"
            min={1}
            className="text-[14px] w-full border px-3 py-2 rounded"
            value={jumlahPinjam}
            onChange={(e) => setJumlahPinjam(parseInt(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-[14px] font-medium mb-1">Tanggal Pinjam *</label>
          <input
            type="date"
            className="text-[14px] w-full border px-3 py-2 rounded"
            value={tanggalPinjam}
            onChange={(e) => setTanggalPinjam(e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-[14px] font-medium mb-1">Tujuan *</label>
          <input
            type="text"
            className="text-[14px] w-full border px-3 py-2 rounded"
            value={tujuan}
            onChange={(e) => setTujuan(e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-[14px] font-medium mb-1">Keterangan</label>
          <textarea
            className="text-[14px] w-full border px-3 py-2 rounded"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
          />
        </div>

        <div className="col-span-2 flex gap-2 justify-end mt-4">
          <button
            type="button"
            className="cursor-pointer text-[14px] bg-red-500 font-bold text-white px-4 py-2 rounded hover:bg-red-800"
            onClick={() => router.push("/admin/peminjaman")}
            disabled={loading}
          >
            Batal
          </button>

          <button
            type="submit"
            className="cursor-pointer text-[14px] bg-secondary text-secondary-foreground font-medium px-4 py-2 rounded hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
