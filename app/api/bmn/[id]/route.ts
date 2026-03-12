import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bmn } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * PATCH /api/bmn/:id
 * Update specific BMN fields
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const { kondisiBarang, status: statusValue, foto } = body;

    const updateData: Partial<typeof bmn.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (kondisiBarang) updateData.kondisiBarang = kondisiBarang;
    if (statusValue) updateData.status = statusValue;
    if (foto) updateData.foto = JSON.stringify(foto);

    const result = await db
      .update(bmn)
      .set(updateData)
      .where(eq(bmn.id, id))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "BMN not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("PATCH /api/bmn/:id error:", error);
    return NextResponse.json({ error: "Failed to update BMN" }, { status: 500 });
  }
}

/**
 * DELETE /api/bmn/:id
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await db.delete(bmn).where(eq(bmn.id, id)).returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "BMN not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE /api/bmn/:id error:", error);
    return NextResponse.json({ error: "Failed to delete BMN" }, { status: 500 });
  }
}
