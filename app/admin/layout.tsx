"use client";

import Header from "@/components/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Header */}
      <Header role="admin" />

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
