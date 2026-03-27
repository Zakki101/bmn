

import Header from "@/components/Header";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* Header */}
      <Header role="user" />

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
