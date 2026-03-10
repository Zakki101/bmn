"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  Box,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";
import { MdDashboard } from "react-icons/md";

export default function Sidebar({ role }: { role: "admin" | "user" }) {
  const pathname = usePathname();
  const [openBMN, setOpenBMN] = useState(false);
  const [openPeminjaman, setOpenPeminjaman] = useState(false);

  const activeColor =
    role === "admin" ? "bg-secondary text-secondary-foreground" : "bg-primary text-white";

  const textColorLogOut = role === "admin" ? "text-secondary-foreground" : "text-white";
  const hoverBg = role === "admin" ? "hover:bg-primary" : "hover:bg-secondary";
  const hoverText = role === "admin" ? "hover:text-primary-foreground" : "hover:text-primary";
  const borderColor = role === "admin" ? "border-yellow-500" : "border-blue-500";
  const textColor = role === "admin" ? "text-yellow-600" : "text-blue-600";
  const bgSubActive = role === "admin" ? "bg-yellow-50" : "bg-blue-50"; 
  const bgColor = role === "admin" ? "bg-secondary" : "bg-primary";

  useEffect(() => {
    if (pathname.includes("/bmn")) setOpenBMN(true);
    if (pathname.includes("/peminjaman")) setOpenPeminjaman(true);
  }, [pathname]);

  return (
    <aside className="fixed left-0 top-0 w-60 h-screen bg-white flex flex-col border-r border-gray-200 z-40">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-5 py-6 justify-center border-b border-gray-200">
        <MdDashboard className="w-12 h-14 text-blue-950" />
        <span className="text-[30px] font-bold">E-BMN</span>
      </div>

      {/* MENU */}
      <nav className="px-4 py-5 flex-1 overflow-y-auto">
        <ul className="text-[11px] font-semibold space-y-2">
          {/* DASHBOARD */}
          <li>
            <Link
              href={`/${role}/dashboard`}
              className={`flex items-center gap-2 py-2 px-3 text-[14px] rounded-md transition-all ${
                pathname.startsWith(`/${role}/dashboard`)
                  ? activeColor + " shadow-sm"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <Home className="w-5 h-5" strokeWidth={2.5} />
              Dashboard
            </Link>
          </li>

          {/* ==== ADMIN SECTION ==== */}
          {role === "admin" && (
            <>
              {/* BMN DROPDOWN */}
              <li>
                <button
                  onClick={() => setOpenBMN(!openBMN)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-md transition-all ${
                    pathname.includes("/bmn") || pathname.includes("/log-bmn") || pathname.includes("/rencana-penghapusan")
                      ? activeColor + " shadow-sm"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span className="flex items-center gap-2 text-[14px]">
                    <Box className="w-5 h-5" />
                    BMN
                  </span>
                  {openBMN ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                <ul
                  className={`ml-5 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openBMN ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <li>
                    <Link
                      href="/admin/bmn"
                      className={`block py-1.5 px-2 border-l-4 text-[12px] transition-all ${
                        pathname.startsWith("/admin/bmn")
                          ? `${bgSubActive} ${textColor} ${borderColor} font-semibold border-opacity-100`
                          : "border-transparent rounded-md hover:bg-gray-100"
                      }`}
                    >
                      Data BMN
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/rencana-penghapusan"
                      className={`block py-1.5 px-2 border-l-4 text-[12px] transition-all ${
                        pathname.startsWith("/admin/rencana-penghapusan")
                          ? `${bgSubActive} ${textColor} ${borderColor} font-semibold border-opacity-100`
                          : "border-transparent rounded-md hover:bg-gray-100" 
                      }`}
                    >
                      Usulan Hapus
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/log-bmn"
                      className={`block py-1.5 px-2 border-l-4 text-[12px] transition-all ${
                        pathname.startsWith("/admin/log-bmn")
                          ? `${bgSubActive} ${textColor} ${borderColor} font-semibold border-opacity-100`
                          : "border-transparent rounded-md hover:bg-gray-100"
                      }`}
                    >
                      Log Penghapusan
                    </Link>
                  </li>
                </ul>
              </li>

              {/* PEMINJAMAN DROPDOWN */}
              <li>
                <button
                  onClick={() => setOpenPeminjaman(!openPeminjaman)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-md transition-all ${
                    pathname.includes("/peminjaman") ||
                    pathname.includes("/log-peminjaman")
                      ? activeColor + " shadow-sm"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span className="flex items-center gap-2 text-[14px]">
                    <ClipboardList className="w-5 h-5" />
                    Peminjaman
                  </span>
                  {openPeminjaman ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                <ul
                  className={`ml-5 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openPeminjaman ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <li>
                    <Link
                      href="/admin/peminjaman"
                      className={`block py-1.5 px-2 border-l-4 text-[12px] transition-all ${
                        pathname.startsWith("/admin/peminjaman")
                          ? `${bgSubActive} ${textColor} ${borderColor} font-semibold border-opacity-100`
                          : "border-transparent rounded-md hover:bg-gray-100"
                      }`}
                    >
                      Data Peminjaman
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/log-peminjaman"
                      className={`block py-1.5 px-2 border-l-4 text-[12px] transition-all ${
                        pathname.startsWith("/admin/log-peminjaman")
                          ? `${bgSubActive} ${textColor} ${borderColor} font-semibold border-opacity-100`
                          : "border-transparent rounded-md hover:bg-gray-100"
                      }`}
                    >
                      Log Peminjaman
                    </Link>
                  </li>
                </ul>
              </li>
            </>
          )}

          {/* ==== USER SECTION ==== */}
          {role === "user" && (
            <li>
              <Link
                href="/user/bmn"
                className={`flex items-center gap-2 py-2 text-[14px] px-3 rounded-md transition-all ${
                  pathname.startsWith("/user/bmn")
                    ? activeColor + " shadow-sm"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <Box className="w-5 h-5" />
                Data BMN
              </Link> 
            </li>
          )}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <Link
          href="/"
          className={`flex items-center justify-center gap-4 py-2 text-[16px] rounded-md transition-all ${
            pathname.startsWith("/logout")
              ? `${bgColor} ${textColorLogOut} shadow-sm`
              : `${bgColor} ${textColorLogOut} ${hoverBg} ${hoverText}`
          }`}
        >
          <LogOut className="w-5 h-5" strokeWidth={2.5} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
