import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usulanHapus, bmn } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/usulan-hapus
 */
export async function GET(req: NextRequest) {
  try {
    const data = await db
      .select({
        id: usulanHapus.id,
        bmnId: usulanHapus.bmnId,
        tanggalUsulan: usulanHapus.tanggalUsulan,
        alasan: usulanHapus.alasan,
        statusUsulan: usulanHapus.statusUsulan,
        disetujuiOleh: usulanHapus.disetujuiOleh,
        namaBarang: bmn.namaBarang,
        ikmm: bmn.ikmm,
        nup: bmn.nup,
      })
      .from(usulanHapus)
      .innerJoin(bmn, eq(usulanHapus.bmnId, bmn.id))
      .orderBy(usulanHapus.createdAt);

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/usulan-hapus error:", error);
    return NextResponse.json({ error: "Gagal mengambil usulan penghapusan" }, { status: 500 });
  }
}

/**
 * POST /api/usulan-hapus
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('POST /api/usulan-hapus body:', body);
    const { bmnId, tanggalUsulan, alasan } = body;

    const result = await db.insert(usulanHapus).values({
      bmnId,
      tanggalUsulan,
      alasan,
      statusUsulan: "Menunggu",
    }).returning();

    if (!result || result.length === 0) {
      console.error('Insertion failed, result empty');
      return NextResponse.json({ error: "Insertion failed" }, { status: 500 });
    }
    console.log('Insertion result:', result);
    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/usulan-hapus error:", error);
    return NextResponse.json({ error: "Gagal membuat usulan penghapusan" }, { status: 500 });
  }
}
