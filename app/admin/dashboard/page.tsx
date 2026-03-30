"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatTooltip } from "@/components/ui/stat-tooltip";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ReactNode } from "react";
import { ChartLine, ChartNoAxesColumn, Loader2, PackageOpen, HandHelping } from "lucide-react";

type SmallCardProps = {
  children: ReactNode;
  className?: string;
};

const SmallCard = ({ children, className = "" }: SmallCardProps) => (
  <Card className={`p-1 text-xs ${className}`}>{children}</Card>
);

export default function Dashboard() {
  const [bmnData, setBmnData] = useState<any[]>([]);
  const [peminjamanData, setPeminjamanData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bmnRes, peminjamanRes] = await Promise.all([
          fetch("/api/bmn"),
          fetch("/api/peminjaman")
        ]);
        const [bmn, loans] = await Promise.all([
          bmnRes.json(),
          peminjamanRes.json()
        ]);
        setBmnData(bmn);
        setPeminjamanData(loans);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Process data for charts
  const categories = ["Laptop/Server", "Monitor", "Printer", "TV", "Furniture", "Jaringan", "Elektronik", "Peripheral", "Lainnya"];
  const kategoriStats = categories.map(cat => {
    const items = bmnData.filter(b => b.kategori === cat);
    const baik = items.filter(b => b.kondisiBarang === "Baik").length;
    const perbaikan = items.filter(b => b.kondisiBarang !== "Baik").length;
    return { name: cat, total: items.length, baik, perbaikan };
  }).filter(c => c.total > 0);

  const totalBMN = bmnData.length;

  const totalBaik = bmnData.filter(b => b.kondisiBarang === "Baik").length;
  const totalRusak = bmnData.filter(b => b.kondisiBarang !== "Baik").length;

  const perolehanBMN = [...bmnData]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const peminjamanTerbaru = [...peminjamanData]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 grid-rows-1 gap-2">
      {/* Bar Chart */}
      <SmallCard className="row-span-1 col-span-3">
        <CardHeader className="p-2 pb-5">
          <div className="flex items-center px-1 py-1">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-2">
              <ChartNoAxesColumn className="w-6 h-6 text-secondary-foreground" strokeWidth={2.5} />
            </div>
            <CardTitle className="text-[18px]"> Visualisasi Kategori Barang</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-2 pb-0 text-[10px] flex flex-col">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kategoriStats}>
              <XAxis dataKey="name" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="total" fill="#142B6F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </SmallCard>
      
      {/* Total Unit + Statistik */}
      <SmallCard className="row-span-1 col-span-1">
        <CardHeader className="p-2 pb-0">
          <div className="flex items-center px-1 py-1">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-2">
              <ChartLine className="w-6 h-6 text-secondary-foreground" strokeWidth={2.5} />
            </div>
            <CardTitle className="text-[18px]">Statistik BMN</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-[14px] font-medium">Total Unit BMN</span>
              <span className="text-[20px] font-bold">{totalBMN} Unit</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px]">Baik</span>
                <span className="text-[14px] font-semibold">{totalBaik} Unit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px]">Rusak / Perbaikan</span>
                <span className="text-[14px] font-semibold">{totalRusak} Unit</span>
              </div>
            </div>

            <div className="border-b"></div>

            {kategoriStats.map((stat, i) => {
              const total = stat.total;
              const baikPercent = total > 0 ? Math.round((stat.baik / total) * 100) : 0;
              const perbaikanPercent = total > 0 ? Math.round((stat.perbaikan / total) * 100) : 0;

              return (
                <div key={i} className="group relative cursor-pointer hover:bg-gray-200 rounded transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px]">{stat.name}</span>
                    <span className="text-[14px] font-semibold">{total} Unit</span>
                  </div>
                  <StatTooltip titlebarang={stat.name} baikValue={stat.baik} perbaikanValue={stat.perbaikan}>
                    <div className="w-full bg-gray-200 rounded h-2 flex overflow-hidden">
                      <div className="bg-primary h-2" style={{ width: `${baikPercent}%` }} />
                      <div className="bg-secondary h-2" style={{ width: `${perbaikanPercent}%` }} />
                    </div>
                  </StatTooltip>
                </div>
              );
            })}

            <div className="flex items-center justify-center gap-4 pt-2 mt-2 border-t text-[10px]">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-sm" />
                <span className="text-[12px]">Baik</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-secondary rounded-sm" />
                <span className="text-[12px]">Rusak/Perbaikan</span>
              </div>
            </div>
          </div>
        </CardContent>
      </SmallCard>


      {/* Tabel Perolehan BMN */}
      <SmallCard className="row-span-1 col-span-4">
        <CardHeader className="p-2 pb-0">
          <div className="flex items-center p-1">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-2">
              <PackageOpen className="w-6 h-6 ml-0.5 text-secondary-foreground" strokeWidth={2} />
            </div>
            <CardTitle className="text-[18px]">Perolehan BMN Terbaru</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-3 pt-0 pb-4">
          <div className="max-h-32 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200 text-black">
                <tr>
                  <th className="text-left p-1 border text-[14px]">Nama Barang</th>
                  <th className="text-left p-1 border text-[14px]">Unit (NUP)</th>
                  <th className="text-left p-1 border text-[14px]">Tanggal Masuk</th>
                </tr>
              </thead>
              <tbody>
                {perolehanBMN.length > 0 ? perolehanBMN.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="p-1 border text-[13px]">{item.namaBarang}</td>
                    <td className="p-1 border text-[13px]">{item.unit}</td>
                    <td className="p-1 border text-[13px]">{new Date(item.createdAt).toLocaleDateString("id-ID")}</td>
                  </tr>
                )) : <tr><td colSpan={3} className="hover:bg-gray-100 text-center p-2 text-[14px] border-1">Data Tidak Ditemukan</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </SmallCard>

      {/* Tabel Peminjaman BMN */}
      <SmallCard className="row-span-1 col-span-4">
        <CardHeader className="p-2 pb-0">
          <div className="flex items-center p-1">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-2">
              <HandHelping className="w-7 h-7 ml-0.5 text-secondary-foreground" strokeWidth={2} />
            </div>
            <CardTitle className="text-[18px]">Peminjaman Aktif</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-3 pt-0 pb-4">
          <div className="max-h-32 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200 text-black">
                <tr>
                  <th className="text-left p-1 border text-[14px]">Peminjam</th>
                  <th className="text-left p-1 border text-[14px]">Status</th>
                  <th className="text-left p-1 border text-[14px]">Tanggal Pinjam</th>
                </tr>
              </thead>
              <tbody>
                {peminjamanTerbaru.length > 0 ? peminjamanTerbaru.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="p-1 border text-[13px]">{item.namaPeminjam}</td>
                    <td className="p-1 border text-[13px]">{item.statusPeminjaman}</td>
                    <td className="p-1 border text-[13px]">{new Date(item.tanggalPinjam).toLocaleDateString("id-ID")}</td>
                  </tr>
                )) : <tr>
                      <td colSpan={3} className="hover:bg-gray-100 text-center p-2 text-[14px] border-1">Data Tidak Ditemukan</td>
                    </tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </SmallCard>
    </div>
  );
}
