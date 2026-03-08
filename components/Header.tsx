"use client";
import Image from "next/image";

type HeaderProps = {
  title: string;
  role: "admin" | "user";
};

export default function Header({ title, role }: HeaderProps) {
  const isAdmin = role === "admin";
  const bgColor = isAdmin ? "bg-purple-500" : "bg-primary";

  const headerTitle = isAdmin ? `Admin ${title}` : title;
  const subtitle = "Pusat Data dan Teknologi Informasi";

  return (
    <header
      className={`${bgColor} shadow px-6 py-5 flex justify-between items-center text-white`}
    >
      {/* Judul */}
      <h1 className="text-[16px] font-semibold tracking-wide text-primary-foreground">{headerTitle}</h1>

      {/* Logo + Subtitle */}
      <div className="flex items-center gap-2">
        <Image
          src="/logopu.png"
          alt="Logo PU"
          width={24}
          height={24}
          className="object-contain"
        />
        <span className="text-[16px] font-medium text-primary-foreground">{subtitle}</span>
      </div>
    </header>
  );
}
