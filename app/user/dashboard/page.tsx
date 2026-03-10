"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Pie, PieChart } from "recharts";
import { ReactNode } from "react";
import { CalendarClock, ChartBarStacked, CheckCheck, Warehouse } from "lucide-react";

const kategoriData = [
  { name: "Laptop", total: 20 },
  { name: "TV", total: 10 },
  { name: "Monitor", total: 15 },
  { name: "Printer", total: 25 },
];

const ketersediaanData = [
  { name: "Gudang", total: 30, fill: "var(--chart-1)" },
  { name: "Dipinjam", total: 40, fill: "var(--chart-2)" },
];

const totalBMN = kategoriData.reduce((sum, item) => sum + item.total, 0);

type SmallCardProps = {
  children: ReactNode;
  className?: string;
};

const SmallCard = ({ children, className = "" }: SmallCardProps) => (
  <Card className={`p-1 text-[12px] ${className}`}>{children}</Card>
);

export default function Dashboard() {
  return (
    <div className="grid grid-cols-6 grid-rows-5 gap-3 p-3">
      {/* total BMN */}
      <SmallCard className="col-span-2 row-span-1 bg-primary text-primary-foreground">
        <CardHeader className="p-2">
          <CardTitle className="text-[18px] text ml-1">Total Unit BMN</CardTitle>
        </CardHeader>
      <CardContent className="relative flex items-center p-2 h-full">
        <p className="absolute bottom-2 right-2 text-[40px] font-bold mr-1">
          {totalBMN} <span className="text-[16px] font-bold">Unit</span>
        </p>
      </CardContent>
      </SmallCard>

      {/* Statistik Cards */}
      {kategoriData.map((stat, i) => (
        <SmallCard key={i} className="col-span-1 row-span-1">
          <CardHeader className="p-2">
            <CardTitle className="text-[18px] ml-1">{stat.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 h-full flex items-end justify-end">
            <p className="text-[30px] font-bold mr-1">{stat.total}</p>
            <span className="text-[14px] text-gray-800 gap-2 pb-1 font-medium">Unit</span>
          </CardContent>
        </SmallCard>
      ))}

      {/* total BMN di gudang */}
      <SmallCard className="col-span-3 row-span-1">
        <CardHeader className="p-2">
          <CardTitle className="flex items-center px-1 py-1">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-2">
              <Warehouse className="w-6 h-6 text-primary-foreground" strokeWidth={2.5}/>
            </div>
            <span className="text-[16px]">Jumlah BMN dalam Gudang</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex items-end justify-end gap-1">
          <p className="text-[40px] font-bold justify-self-end ">
            {ketersediaanData.find((d) => d.name === "Gudang")?.total}
          </p>
          <span className="text-[18px] text-gray-800 pb-2 mr-2 font-medium">Unit</span>
        </CardContent>
      </SmallCard>

      {/* total BMN yang dipinjam */}
      <SmallCard className="col-span-3 row-span-1">
        <CardHeader className="p-2">
          <CardTitle className="flex items-center text-[16px] px-1 py-1">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-2">
              <CalendarClock className="w-6 h-6 text-primary-foreground" strokeWidth={2.5}/>
            </div>
            <span>Jumlah BMN Dipinjam</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 flex items-end justify-end gap-1">
          <p className="text-[40px] font-bold justify-self-end ">
            {ketersediaanData.find((d) => d.name === "Dipinjam")?.total}
          </p>
          <span className="text-[18px] text-gray-800 pb-2 mr-2">Unit</span>
        </CardContent>
      </SmallCard>

      {/* pie chart */}
      <SmallCard className="col-start-1 col-span-3 row-start-3 row-span-3">
        <CardHeader className="p-2 pb-0">
        <CardTitle className="flex items-center px-1 py-1">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-2">
              <CheckCheck className="w-6 h-6 text-primary-foreground" strokeWidth={2.5}/>
            </div>
            <span className="text-[16px]">Ketersediaan BMN</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full flex flex-col">
          <ChartContainer
            config={{
              total: { label: "Total" },
              Gudang: { label: "Gudang", color: "var(--chart-1)" },
              Dipinjam: { label: "Dipinjam", color: "var(--chart-2)" },
            }}
            className="[&_.recharts-text]:fill-background flex-1 flex items-center justify-center"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="total" hideLabel />}
              />
              <Pie data={ketersediaanData} dataKey="total" nameKey="name" innerRadius={70} outerRadius={100} />
            </PieChart>
          </ChartContainer>
          {/* Legend */}
          <div className="flex flex-col gap-2 mx-35 mt-2 mb-5">
            {ketersediaanData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-[14px] flex-1">{item.name === "Gudang" ? "Tersedia" : "Tidak Tersedia"}</span>
                <span className="text-[14px] font-bold">{item.total} Unit</span>
              </div>
            ))}
          </div>
        </CardContent>
      </SmallCard>

      {/* bar chart */}
      <SmallCard className="col-start-4 col-span-3 row-start-3 row-span-3">
        <CardHeader className="p-2 pb-3">
          <CardTitle className="flex items-center px-1 py-1">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mr-2">
              <ChartBarStacked className="w-6 h-6 text-primary-foreground" strokeWidth={2.5}/>
            </div>
            <span className="text-[16px]">Kategori BMN</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={kategoriData}>
              <XAxis dataKey="name" tick={{ fill: "var(--foreground)" }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </SmallCard>
    </div>
  );
}
