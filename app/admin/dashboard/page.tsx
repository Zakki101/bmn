"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig, } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, PolarRadiusAxis, Label, } from "recharts";
import { ReactNode } from "react";

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
    <div className="grid grid-cols-5 gap-2 p-0">
      {/* total BMN */}
      <SmallCard className="col-span-1 h-[140px] flex flex-col">
        <CardHeader className="p-2 pb-0">
          <CardTitle className="text-xs">Total Unit BMN</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-end justify-end p-2">
          <span className="text-2xl font-bold">{totalBMN}</span>
        </CardContent>
      </SmallCard>

      {/* radial chart per kategori */}
      {kategoriData.map((stat, i) => {
        const chartConfig = {
          kondisiBaik: { label: "Kondisi Baik", color: "var(--chart-1)" },
          dalamPerbaikan: { label: "Dalam Perbaikan", color: "var(--chart-2)" },
        } satisfies ChartConfig;

        const total =
          kondisiData[stat.name].reduce((s, d) => s + d.value, 0) || 0;

        return (
          <SmallCard key={i} className="col-span-1 h-[140px] flex flex-col">
            <CardHeader className="flex justify-between items-center p-2 pb-0">
              <CardTitle className="text-xs">{stat.name}</CardTitle>
            </CardHeader>
            <CardContent className="rounded-none flex-1 flex items-center justify-center">
              <ChartContainer
                config={chartConfig}
                className="aspect-square w-[90px] h-[90px]"
              >
                <RadialBarChart
                  data={[
                    Object.fromEntries(
                      kondisiData[stat.name].map((d) => [d.name, d.value])
                    ),
                  ]}
                  endAngle={180}
                  innerRadius={40}
                  outerRadius={65}
                >
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 2}
                                className="fill-foreground text-base font-bold"
                              >
                                {total}
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </PolarRadiusAxis>
                  {kondisiData[stat.name].map((entry) => (
                    <RadialBar
                      key={entry.name}
                      dataKey={entry.name}
                      stackId="a"
                      fill={entry.color}
                      className="stroke-transparent stroke-2"
                    />
                  ))}
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
          </SmallCard>
        );
      })}

      {/* bar chart + tabel */}
      <div className="col-span-5 grid grid-cols-5 gap-2 items-start">
        <SmallCard className="col-span-2 h-full">
          <CardHeader className="p-2 pb-0">
            <CardTitle className="text-xs">
              Visualisasi Kategori Barang
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] p-2 pb-0 text-[9px]">
            <ResponsiveContainer width="90%" height="100%">
              <BarChart data={kategoriData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#8884d8" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </SmallCard>

        <div className="col-span-3 flex flex-col gap-2">
          {/* perolehan BMN terbaru */}
          <SmallCard>
            <CardHeader className="px-3 pt-2 pb-0">
              <CardTitle className="text-xs">
                Perolehan BMN Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pt-0 pb-2">
              <div className="max-h-32 overflow-y-auto">
                <table className="w-full border border-gray-200 border-collapse text-[7px]">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="text-left py-1 px-2 border">Nama Barang</th>
                      <th className="text-left py-1 px-2 border">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perolehanBMN.map((item) => (
                      <tr
                        key={item.idBMN}
                        className="hover:bg-gray-50 even:bg-gray-50/50"
                      >
                        <td className="py-1 px-2 border">{item.namaBarang}</td>
                        <td className="py-1 px-2 border">
                          {item.tanggalPerolehan}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </SmallCard>

          {/* peminjaman BMN terbsru*/}
          <SmallCard>
            <CardHeader className="px-3 pt-2 pb-0">
              <CardTitle className="text-xs">
                Peminjaman BMN Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pt-0 pb-2">
              <div className="max-h-32 overflow-y-auto">
                <table className="w-full border-collapse text-[7px]">
                  <thead>
                    <tr className="bg-gray-100 sticky top-0 z-10">
                      <th className="text-left py-1 px-2 border">
                        Nama Peminjam
                      </th>
                      <th className="text-left py-1 px-2 border">
                        Nama Barang
                      </th>
                      <th className="text-left py-1 px-2 border">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {peminjamanBMN.map((item) => (
                      <tr key={item.idPeminjaman} className="hover:bg-gray-50">
                        <td className="py-1 px-2 border">{item.namaPeminjam}</td>
                        <td className="py-1 px-2 border">{item.namaBarang}</td>
                        <td className="py-1 px-2 border">{item.tanggalPinjam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </SmallCard>
        </div>
      </div>
    </div>
  );
}
