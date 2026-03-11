import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { peminjaman } from "@/lib/db/schema";
import { and, eq, like, or } from "drizzle-orm";

/**
 * GET /api/peminjaman
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const filters = [];

    if (search) {
      filters.push(
        or(
          like(peminjaman.namaPeminjam, `%${search}%`),
          like(peminjaman.nip, `%${search}%`),
          like(peminjaman.nomorPeminjaman, `%${search}%`)
        )
      );
    }

    if (status && status !== "all") {
      filters.push(eq(peminjaman.statusPeminjaman, status));
    }

    const data = await db
      .select()
      .from(peminjaman)
      .orderBy(peminjaman.createdAt);

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/peminjaman error:", error);
    return NextResponse.json({ error: "Failed to fetch loans" }, { status: 500 });
  }
}

/**
 * POST /api/peminjaman
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      nomorPeminjaman,
      namaPeminjam,
      statusPegawai,
      nip,
      bmnId,
      jumlahPinjam,
      tanggalPinjam,
      tanggalSelesai,
      tujuan,
      keterangan,
      statusPeminjaman,
    } = body;

    const result = await db.insert(peminjaman).values({
      nomorPeminjaman,
      namaPeminjam,
      statusPegawai,
      nip,
      bmnId,
      jumlahPinjam,
      tanggalPinjam,
      tanggalSelesai,
      tujuan,
      keterangan,
      statusPeminjaman: statusPeminjaman || "Aktif",
    }).returning();

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/peminjaman error:", error);
    return NextResponse.json({ error: "Failed to create loan" }, { status: 500 });
  }
}
