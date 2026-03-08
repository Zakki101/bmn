"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Sidebar */}
      <Sidebar role="admin" />

      {/* Konten */}
      <div className="ml-60 flex flex-col">
        <Header
          role="admin"
          title="Dashboard Monitoring Barang Milik Negara (BMN)"
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
