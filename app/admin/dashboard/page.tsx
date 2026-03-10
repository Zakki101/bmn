"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatTooltip } from "@/components/ui/stat-tooltip";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ReactNode } from "react";
import { ChartLine, ChartNoAxesColumn } from "lucide-react";

import { dataBMN } from "@/data/dataBMN";
import { dataPeminjaman } from "@/data/dataPeminjaman";

function parseDate(dateStr?: string | null): Date {
  if (!dateStr) return new Date(0);
  const parts = dateStr.split(/[/\-\.]/).map((p) => p.trim());
  if (parts.length < 3) return new Date(0);

  const [d, m] = parts;
  let [, , y] = parts;
  if (y.length === 2) y = "20" + y;
  const day = parseInt(d, 10);
  const month = parseInt(m, 10) - 1;
  const year = parseInt(y, 10);
  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year))
    return new Date(0);
  return new Date(year, month, day);
}

const kategoriData = [
  { name: "Laptop", total: 20 },
  { name: "TV", total: 10 },
  { name: "Monitor", total: 15 },
  { name: "Printer", total: 25 },
];

const kondisiData: Record<
  string,
  { name: string; value: number; color: string }[]
> = {
  Laptop: [
    { name: " Kondisi Baik", value: 15, color: "var(--chart-1)" },
    { name: "Dalam Perbaikan", value: 5, color: "var(--chart-2)" },
  ],
  TV: [
    { name: "Kondisi Baik", value: 7, color: "var(--chart-1)" },
    { name: "Dalam Perbaikan", value: 3, color: "var(--chart-2)" },
  ],
  Monitor: [
    { name: "Kondisi Baik", value: 12, color: "var(--chart-1)" },
    { name: "Dalam Perbaikan", value: 3, color: "var(--chart-2)" },
  ],
  Printer: [
    { name: "Kondisi Baik", value: 20, color: "var(--chart-1)" },
    { name: "Dalam Perbaikan", value: 5, color: "var(--chart-2)" },
  ],
};

const totalBMN = kategoriData.reduce((s, it) => s + it.total, 0);

type SmallCardProps = {
  children: ReactNode;
  className?: string;
};

const SmallCard = ({ children, className = "" }: SmallCardProps) => (
  <Card className={`p-1 text-xs ${className}`}>{children}</Card>
);

export default function Dashboard() {
  const perolehanBMN = [...dataBMN]
    .sort(
      (a, b) =>
        parseDate(b.tanggalPerolehan).getTime() -
        parseDate(a.tanggalPerolehan).getTime()
    )
    .slice(0, 4);

  const peminjamanBMN = [...dataPeminjaman]
    .sort(
      (a, b) =>
        parseDate(b.tanggalPinjam).getTime() -
        parseDate(a.tanggalPinjam).getTime()
    )
    .slice(0, 4);

  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-2 p-0">
      {/* Total Unit + Statistik */}
      <SmallCard className="row-span-2 col-span-2">
        <CardHeader className="p-2 pb-0">
          <div className="flex items-center px-1 py-1">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-2">
              <ChartLine className="w-6 h-6 text-secondary-foreground" strokeWidth={2.5}/>
            </div>
            <CardTitle className="text-[18px]">Statistik BMN</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="space-y-4">
            {/* Total Unit */}
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-[14px] font-medium">Total Unit BMN</span>
              <span className="text-[20px] font-bold">{totalBMN} Unit</span>
            </div>
            
            {/* Kategori dengan stacked progress bar */}
            {kategoriData.map((stat, i) => {
              const baik =
                kondisiData[stat.name].find((d) =>
                  d.name.includes("Kondisi Baik")
                )?.value || 0;
              const perbaikan =
                kondisiData[stat.name].find((d) =>
                  d.name.includes("Dalam Perbaikan")
                )?.value || 0;
              const total = baik + perbaikan;
              const baikPercent = total > 0 ? Math.round((baik / total) * 100) : 0;
              const perbaikanPercent = total > 0 ? Math.round((perbaikan / total) * 100) : 0;

              return (
                <div key={i} className="group relative cursor-pointer hover:bg-gray-200 rounded transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[14px]">{stat.name}</span>
                    <span className="text-[14px] font-semibold">{total} Unit</span>
                  </div>
                  {/* Stacked Progress Bar with Tooltip */}
                  <StatTooltip titlebarang={stat.name} baikValue={baik} perbaikanValue={perbaikan}>
                    <div className="w-full bg-gray-200 rounded h-2 flex overflow-hidden group-hover:opacity-80 transition-opacity">
                      <div
                        className="bg-primary h-2 transition-all"
                        style={{ width: `${baikPercent}%` }}
                      />
                      <div
                        className="bg-secondary h-2 transition-all"
                        style={{ width: `${perbaikanPercent}%` }}
                      />
                    </div>
                  </StatTooltip>
                </div>
              );
            })}

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 pt-2 mt-2 border-t text-[10px]">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-sm" />
                <span className="text-[12px]">Baik</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-secondary rounded-sm" />
                <span className="text-[12px]">Perbaikan</span>
              </div>
            </div>
          </div>
        </CardContent>
      </SmallCard>

      {/* Bar Chart */}
      <SmallCard className="row-span-2 col-span-2">
        <CardHeader className="p-2 pb-5">
          <div className="flex items-center px-1 py-1">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mr-2">
              <ChartNoAxesColumn className="w-6 h-6 text-secondary-foreground" strokeWidth={2.5}/>
            </div>
            <CardTitle className="text-[18px]"> Visualisasi Kategori Barang</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="h-[250px] p-2 pb-0 text-[9px]">
          <ResponsiveContainer width="90%" height="100%">
            <BarChart data={kategoriData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#142B6F" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </SmallCard>

      {/* Tabel Perolehan BMN */}
      <SmallCard className="row-span-1 col-span-4">
        <CardHeader className="px-3 pt-2 pb-0">
          <CardTitle className="text-[18px]">
            Perolehan BMN Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pt-0 pb-2">
          <div className="max-h-32 overflow-y-auto">
            <table className="w-full border border-gray-200 border-collapse text-[7px]">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="text-left py-1 px-2 border text-[14px]">Nama Barang</th>
                  <th className="text-left py-1 px-2 border text-[14px]">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {perolehanBMN.map((item) => (
                  <tr
                    key={item.idBMN}
                    className="hover:bg-gray-50 even:bg-gray-50/50"
                  >
                    <td className="py-1 px-2 border text-[12px]">
                      {item.namaBarang}
                    </td>
                    <td className="py-1 px-2 border text-[12px]">
                      {item.tanggalPerolehan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </SmallCard>

      {/* Tabel Peminjaman BMN */}
      <SmallCard className="row-span-1 col-span-4">
        <CardHeader className="px-3 pt-2 pb-0">
          <CardTitle className="text-[18px]">
            Peminjaman BMN Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pt-0 pb-2">
          <div className="max-h-32 overflow-y-auto">
            <table className="w-full border-collapse text-[7px]">
              <thead>
                <tr className="bg-gray-100 sticky top-0 z-10">
                  <th className="text-left py-1 px-2 border text-[14px]">
                    Nama Peminjam
                  </th>
                  <th className="text-left py-1 px-2 border text-[14px]">
                    Nama Barang
                  </th>
                  <th className="text-left py-1 px-2 border text-[14px]">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody>
                {peminjamanBMN.map((item) => (
                  <tr key={item.idPeminjaman} className="hover:bg-gray-50">
                    <td className="py-1 px-2 border text-[12px]">
                      {item.namaPeminjam}
                    </td>
                    <td className="py-1 px-2 border text-[12px]">
                      {item.namaBarang}
                    </td>
                    <td className="py-1 px-2 border text-[12px]">
                      {item.tanggalPinjam}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </SmallCard>
    </div>
  );
}
