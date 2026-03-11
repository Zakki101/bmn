import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { peminjaman } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * PATCH /api/peminjaman/:id
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { statusPeminjaman, tanggalSelesai } = body;

    const result = await db
      .update(peminjaman)
      .set({ statusPeminjaman, tanggalSelesai })
      .where(eq(peminjaman.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("PATCH /api/peminjaman/:id error:", error);
    return NextResponse.json({ error: "Failed to update loan" }, { status: 500 });
  }
}

/**
 * DELETE /api/peminjaman/:id
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const result = await db.delete(peminjaman).where(eq(peminjaman.id, id)).returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Loan not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/peminjaman/:id error:", error);
    return NextResponse.json({ error: "Failed to delete loan" }, { status: 500 });
  }
}
