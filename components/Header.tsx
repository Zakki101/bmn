"use client";
import Image from "next/image";

type HeaderProps = {
  title: string;
  role: "admin" | "user";
};

export default function Header({ title, role }: HeaderProps) {
  const isAdmin = role === "admin";
  const bgColor = isAdmin ? "bg-purple-500" : "bg-blue-500";

  const headerTitle = isAdmin ? `Admin ${title}` : title;
  const subtitle = "Pusat Data dan Teknologi Informasi";

  return (
    <header
      className={`${bgColor} shadow px-6 py-4 flex justify-between items-center text-white`}
    >
      {/* Judul */}
      <h1 className="text-sm font-semibold tracking-wide">{headerTitle}</h1>

      {/* Logo + Subtitle */}
      <div className="flex items-center gap-2">
        <Image
          src="/logopu.png"
          alt="Logo PU"
          width={18}
          height={18}
          className="object-contain"
        />
        <span className="text-[11px] font-medium">{subtitle}</span>
      </div>
    </header>
  );
}
