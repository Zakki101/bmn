"use client";
import Image from "next/image";

type HeaderProps = {
  title: string;
  role: "admin" | "user";
};

export default function Header({ title, role }: HeaderProps) {
  const isAdmin = role === "admin";
  const bgColor = isAdmin ? "bg-primary" : "bg-primary";
  const textColor = isAdmin ? "text-primary-foreground" : "text-primary-foreground";

  const headerTitle = isAdmin ? `Admin ${title}` : title;
  const subtitle = "Pusat Data dan Teknologi Informasi";

  return (
    <header
      className={`${bgColor} ${textColor} shadow px-6 py-5 flex justify-between items-center`}
    >
      {/* Judul */}
      <h1 className="text-[16px] font-semibold tracking-wide">{headerTitle}</h1>

      {/* Logo + Subtitle */}
      <div className="flex items-center gap-2">
        <Image
          src="/logopu.png"
          alt="Logo PU"
          width={24}
          height={24}
          className="object-contain"
        />
        <span className="text-[16px] font-medium">{subtitle}</span>
      </div>
    </header>
  );
}
