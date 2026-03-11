import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bmn } from "@/lib/db/schema";
import { and, eq, like, or } from "drizzle-orm";

/**
 * GET /api/bmn
 * List all BMN with filters
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const kategori = searchParams.get("kategori");
    const kondisi = searchParams.get("kondisi");

    const filters = [];

    if (search) {
      filters.push(
        or(
          like(bmn.namaBarang, `%${search}%`),
          like(bmn.ikmm, `%${search}%`)
        )
      );
    }

    if (status && status !== "all") {
      filters.push(eq(bmn.dipinjam, status));
    }

    if (kategori && kategori !== "all") {
      filters.push(eq(bmn.kategori, kategori));
    }

    if (kondisi && kondisi !== "all") {
      filters.push(eq(bmn.kondisiBarang, kondisi));
    }

    const data = await db
      .select()
      .from(bmn)
      .where(and(...filters))
      .orderBy(bmn.createdAt);

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/bmn error:", error);
    return NextResponse.json({ error: "Failed to fetch BMN data" }, { status: 500 });
  }
}

/**
 * POST /api/bmn
 * Create new BMN (supports bulk)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      namaBarang,
      kategori,
      ikmm,
      bidang,
      jumlahBarang,
      tanggalPerolehan,
    } = body;

    if (!namaBarang || !kategori || !ikmm || !bidang || !jumlahBarang || !tanggalPerolehan) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find last NUP for the same item name to increment
    const lastItems = await db
      .select({ unit: bmn.unit })
      .from(bmn)
      .where(eq(bmn.namaBarang, namaBarang))
      .orderBy(bmn.unit);
    
    const lastNUP = lastItems.length > 0 ? Math.max(...lastItems.map(i => i.unit)) : 0;

    const itemsToInsert = Array.from({ length: jumlahBarang }, (_, i) => ({
      ikmm,
      akun: 132111,
      bidang,
      unit: lastNUP + i + 1,
      namaBarang,
      kategori,
      tanggalPerolehan,
      kondisiBarang: "Baik" as const,
      dipinjam: "Tersedia" as const,
    }));

    const result = await db.insert(bmn).values(itemsToInsert).returning();

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/bmn error:", error);
    return NextResponse.json({ error: "Failed to create BMN data" }, { status: 500 });
  }
}
