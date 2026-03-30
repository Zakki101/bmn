import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logHapus } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
    try {
        const data = await db.select().from(logHapus).orderBy(desc(logHapus.createdAt));
        return NextResponse.json(data);
    } catch (error) {
        console.error("GET /api/log-hapus error:", error);
        return NextResponse.json({ error: "Failed to fetch log hapus data" }, { status: 500 });
    }
}
