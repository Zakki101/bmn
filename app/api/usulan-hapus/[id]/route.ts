import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usulanHapus, bmn } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * PATCH /api/usulan-hapus/:id
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await req.json();
    const { statusUsulan, disetujuiOleh } = body;

    const result = await db
      .update(usulanHapus)
      .set({ statusUsulan, disetujuiOleh })
      .where(eq(usulanHapus.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // If approved, maybe update BMN status?
    // if (statusUsulan === "Disetujui") {
    //   await db.update(bmn).set({ dipinjam: "Tidak Tersedia" }).where(eq(bmn.id, result[0].bmnId));
    // }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("PATCH /api/usulan-hapus/:id error:", error);
    return NextResponse.json({ error: "Failed to update proposal" }, { status: 500 });
  }
}

/**
 * DELETE /api/usulan-hapus/:id
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const result = await db.delete(usulanHapus).where(eq(usulanHapus.id, id)).returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/usulan-hapus/:id error:", error);
    return NextResponse.json({ error: "Failed to delete proposal" }, { status: 500 });
  }
}
