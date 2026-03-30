import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { usulanHapus, bmn, logHapus } from "@/lib/db/schema";
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

    const proposal = result[0];

    // Jika disetujui, tambahkan ke log_hapus, tanpa menghapus dari bmn saat ini (untuk uji coba)
    if (statusUsulan === "Disetujui") {
      const bmnData = await db.select().from(bmn).where(eq(bmn.id, proposal.bmnId));
      if (bmnData.length > 0) {
        const item = bmnData[0];
        const tanggalSaatIni = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        await db.insert(logHapus).values({
          bmnId: item.id,
          kodeSatker: item.kodeSatker,
          ikmm: item.ikmm,
          kodeAkun: item.kodeAkun,
          bidang: item.bidang,
          nup: item.nup,
          namaBarang: item.namaBarang,
          merkType: item.merkType,
          kuantitas: item.kuantitas,
          satuan: item.satuan,
          kategori: item.kategori,
          kondisiBarang: item.kondisiBarang,
          tanggalPerolehan: item.tanggalPerolehan,
          tanggalHapus: tanggalSaatIni,
          alasanHapus: proposal.alasan,
          disetujuiOleh: proposal.disetujuiOleh,
          nilaiPerolehan: item.nilaiPerolehan,
          mutasiBmn: item.mutasiBmn,
          nilaiBmn: item.nilaiBmn,
          nilaiPenyusutan: item.nilaiPenyusutan,
          nilaiBuku: item.nilaiBuku,
          status: "Dihapus"
        });

        // Uncomment baris di bawah ini nanti jika penghapusan dari data bmn sudah fix
        // await db.delete(bmn).where(eq(bmn.id, item.id));
      }
    }

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
