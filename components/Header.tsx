"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import {
  Home,
  Box,
  ClipboardList,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";
import { MdDashboard } from "react-icons/md";

type HeaderProps = {
  role: "admin" | "user";
};

export default function Header({ role }: HeaderProps) {
  const pathname = usePathname();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openBMNMenu, setOpenBMNMenu] = useState(false);
  const [openPeminjamanMenu, setOpenPeminjamanMenu] = useState(false);

  const subtitle = "PUSDATIN Kementerian PUPR";
  const userName = "Nama Akun"; // Sesuaikan dengan actual user
  const userRole = role === "admin" ? "Administrator" : "User";

  const isMenuActive = (href: string) => {
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <MdDashboard className="w-10 h-10 pb-1" />
              <div>
                <div className="text-[20px] font-bold leading-none">E-BMN</div>
                <span className="text-[14px] opacity-90">{subtitle}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-3">
            {/* Dashboard */}
            <Link
              href={`/${role}/dashboard`}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-[14px] font-medium transition-all ${
                isMenuActive(`/${role}/dashboard`)
                  ? "bg-white text-primary"
                  : "hover:bg-white hover:text-primary"
              }`}
            >
              <Home className="w-5 h-5" />
              Dashboard
            </Link>

            {/* BMN Dropdown - Admin Only */}
            {role === "admin" && (
              <div className="relative group">
                <button
                  onClick={() => setOpenBMNMenu(!openBMNMenu)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-[14px] font-medium transition-all ${
                    pathname.includes("/admin/bmn") ||
                    pathname.includes("/admin/rencana-penghapusan") ||
                    pathname.includes("/admin/log-bmn")
                      ? "bg-white text-primary"
                      : "hover:bg-white hover:text-primary"
                  }`}
                >
                  <Box className="w-5 h-5" />
                  BMN
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white text-black rounded-lg shadow-lg transition-all duration-200 ${
                    openBMNMenu
                      ? "opacity-100 visible"
                      : "opacity-0 invisible pointer-events-none"
                  }`}
                  onMouseLeave={() => setOpenBMNMenu(false)}
                >
                  <Link
                    href="/admin/bmn"
                    className={`block px-4 py-2 rounded-t-lg text-[14px] transition-all ${
                      isMenuActive("/admin/bmn")
                        ? "bg-blue-50 text-black font-semibold"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    Data BMN
                  </Link>
                  <Link
                    href="/admin/rencana-penghapusan"
                    className={`block px-4 py-2 text-[14px] transition-all ${
                      isMenuActive("/admin/rencana-penghapusan")
                        ? "bg-blue-50 text-black font-semibold"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    Usulan Hapus
                  </Link>
                  <Link
                    href="/admin/log-bmn"
                    className={`block px-4 py-2 rounded-b-lg text-[14px] transition-all ${
                      isMenuActive("/admin/log-bmn")
                        ? "bg-blue-50 text-black font-semibold"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    Log Penghapusan
                  </Link>
                </div>
              </div>
            )}

            {/* Peminjaman Dropdown - Admin Only */}
            {role === "admin" && (
              <div className="relative group">
                <button
                  onClick={() => setOpenPeminjamanMenu(!openPeminjamanMenu)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-[14px] font-medium transition-all ${
                    pathname.includes("/admin/peminjaman") ||
                    pathname.includes("/admin/log-peminjaman")
                      ? "bg-white text-primary"
                      : "hover:bg-white hover:text-primary"
                  }`}
                >
                  <ClipboardList className="w-5 h-5" />
                  Peminjaman
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white text-black rounded-lg shadow-lg transition-all duration-200 ${
                    openPeminjamanMenu
                      ? "opacity-100 visible"
                      : "opacity-0 invisible pointer-events-none"
                  }`}
                  onMouseLeave={() => setOpenPeminjamanMenu(false)}
                >
                  <Link
                    href="/admin/peminjaman"
                    className={`block px-4 py-2 rounded-t-lg text-[14px] transition-all ${
                      isMenuActive("/admin/peminjaman")
                        ? "bg-blue-50 text-black font-semibold"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    Data Peminjaman
                  </Link>
                  <Link
                    href="/admin/log-peminjaman"
                    className={`block px-4 py-2 rounded-b-lg text-[14px] transition-all ${
                      isMenuActive("/admin/log-peminjaman")
                        ? "bg-blue-50 text-black font-semibold"
                        : "hover:bg-gray-200"
                    }`}
                  >
                    Log Peminjaman
                  </Link>
                </div>
              </div>
            )}

            {/* Data BMN - User Only */}
            {role === "user" && (
              <Link
                href="/user/bmn"
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-[14px] font-medium transition-all ${
                  isMenuActive("/user/bmn")
                    ? "bg-white text-primary"
                    : "hover:bg-white hover:text-primary"
                }`}
              >
                <Box className="w-5 h-5" />
                Data BMN
              </Link>
            )}
          </nav>

          {/* Right: User Profile */}
          <div className="relative">
            <button
              onClick={() => setOpenUserMenu(!openUserMenu)}
              className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-white hover:text-primary transition-all"
            >
              <div className="text-right">
                <div className="text-[14px] font-semibold">{userName}</div>
                <div className="text-xs opacity-75">{userRole}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* User Dropdown Menu */}
            <div
              className={`absolute right-0 -translate-x-1/16 mt-2 w-40 bg-white text-black rounded-lg shadow-lg transition-all duration-200 ${
                openUserMenu
                  ? "opacity-100 visible"
                  : "opacity-0 invisible pointer-events-none"
              }`}
              onMouseLeave={() => setOpenUserMenu(false)}
            >
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-[14px] hover:bg-red-50 text-red-600 font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
