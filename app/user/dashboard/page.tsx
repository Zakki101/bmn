"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Pie, PieChart } from "recharts";
import { ReactNode } from "react";
import { CalendarClock, ChartBarStacked, CheckCheck, Warehouse, Loader2 } from "lucide-react";

type SmallCardProps = {
  children: ReactNode;
  className?: string;
};

const SmallCard = ({ children, className = "" }: SmallCardProps) => (
  <Card className={`p-1 text-[12px] flex flex-col ${className}`}>{children}</Card>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [kategoriData, setKategoriData] = useState<{ name: string, total: number }[]>([]);
  const [ketersediaanData, setKetersediaanData] = useState<any[]>([]);
  const [totalBMN, setTotalBMN] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bmn");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();

      let total = 0;
      let gudang = 0;
      let dipinjam = 0;
      const catMap: Record<string, number> = {};

      data.forEach((item: any) => {
        const qty = item.kuantitas || 1;
        total += qty;

        if (item.status === 'Tersedia') gudang += qty;
        else if (item.status === 'Dipinjam') dipinjam += qty;

        if (item.kategori) {
          catMap[item.kategori] = (catMap[item.kategori] || 0) + qty;
        }
      });

      setTotalBMN(total);

      const catArr = Object.keys(catMap).map(k => ({
        name: k,
        total: catMap[k]
      })).sort((a, b) => b.total - a.total);

      setKategoriData(catArr);

      setKetersediaanData([
        { name: "Gudang", total: gudang, fill: "var(--chart-1)" },
        { name: "Dipinjam", total: dipinjam, fill: "var(--chart-2)" },
      ]);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Baris 1: Total & Kategori (Grid Responsif) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 auto-rows-fr">
        {/* total BMN */}
        <SmallCard className="col-span-2 bg-primary text-primary-foreground min-h-[100px]">
          <CardHeader className="p-2">
            <CardTitle className="text-[18px] text ml-1">Total Unit BMN</CardTitle>
          </CardHeader>
          <CardContent className="relative flex items-center p-2 h-full flex-1">
            <p className="absolute bottom-2 right-2 text-[40px] font-bold mr-1">
              {totalBMN} <span className="text-[16px] font-bold">Unit</span>
            </p>
          </CardContent>
        </SmallCard>

        {/* Statistik Cards */}
        {kategoriData.map((stat, i) => (
          <SmallCard key={i} className="col-span-1 min-h-[100px] justify-between">
            <CardHeader className="p-2">
              <CardTitle className="text-[16px] ml-1 truncate" title={stat.name}>{stat.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex items-end justify-end">
              <p className="text-[30px] font-bold mr-1">{stat.total}</p>
              <span className="text-[14px] text-gray-800 gap-2 pb-1 font-medium">Unit</span>
            </CardContent>
          </SmallCard>
        ))}
      </div>

      {/* Baris 2: Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-fr">
        {/* total BMN di gudang */}
        <SmallCard className="min-h-[120px] justify-center">
          <CardHeader className="p-2">
            <CardTitle className="flex items-center px-1 py-1">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-2 flex-shrink-0">
                <Warehouse className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="text-[16px]">Jumlah BMN dalam Gudang</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 flex items-end justify-end gap-1 flex-1">
            <p className="text-[40px] font-bold justify-self-end leading-none">
              {ketersediaanData.find((d) => d.name === "Gudang")?.total || 0}
            </p>
            <span className="text-[18px] text-gray-800 pb-1 mr-2 font-medium leading-none">Unit</span>
          </CardContent>
        </SmallCard>

        {/* total BMN yang dipinjam */}
        <SmallCard className="min-h-[120px] justify-center">
          <CardHeader className="p-2">
            <CardTitle className="flex items-center text-[16px] px-1 py-1">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-2 flex-shrink-0">
                <CalendarClock className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span>Jumlah BMN Dipinjam</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 flex items-end justify-end gap-1 flex-1">
            <p className="text-[40px] font-bold justify-self-end leading-none">
              {ketersediaanData.find((d) => d.name === "Dipinjam")?.total || 0}
            </p>
            <span className="text-[18px] text-gray-800 pb-1 mr-2 leading-none font-medium">Unit</span>
          </CardContent>
        </SmallCard>
      </div>

      {/* Baris 3: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-fr">
        {/* pie chart */}
        <SmallCard className="min-h-[350px]">
          <CardHeader className="p-2 pb-0">
            <CardTitle className="flex items-center px-1 py-1">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-2 flex-shrink-0">
                <CheckCheck className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="text-[16px]">Ketersediaan BMN</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full flex flex-col flex-1">
            <ChartContainer
              config={{
                total: { label: "Total" },
                Gudang: { label: "Gudang", color: "var(--chart-1)" },
                Dipinjam: { label: "Dipinjam", color: "var(--chart-2)" },
              }}
              className="[&_.recharts-text]:fill-background flex-1 flex items-center justify-center w-full min-h-[220px]"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="total" hideLabel />}
                />
                <Pie data={ketersediaanData} dataKey="total" nameKey="name" innerRadius={70} outerRadius={100} />
              </PieChart>
            </ChartContainer>
            {/* Legend */}
            <div className="flex flex-col gap-2 mx-auto lg:mx-10 mt-2 mb-2 w-full max-w-[300px]">
              {ketersediaanData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-[14px] flex-1">{item.name === "Gudang" ? "Tersedia" : "Tidak Tersedia / Dipinjam"}</span>
                  <span className="text-[14px] font-bold">{item.total} Unit</span>
                </div>
              ))}
            </div>
          </CardContent>
        </SmallCard>

        {/* bar chart */}
        <SmallCard className="min-h-[350px]">
          <CardHeader className="p-2 pb-3">
            <CardTitle className="flex items-center px-1 py-1">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-2 flex-shrink-0">
                <ChartBarStacked className="w-6 h-6 text-primary-foreground" strokeWidth={2.5} />
              </div>
              <span className="text-[16px]">Kategori BMN</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full flex-1 w-full min-h-[250px] pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kategoriData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fill: "var(--foreground)", fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </SmallCard>
      </div>
    </div>
  );
}
