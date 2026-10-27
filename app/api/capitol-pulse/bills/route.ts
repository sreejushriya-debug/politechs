// Public JSON export of the Capitol Pulse tech-bill dataset.

import { NextResponse } from "next/server";
import { getTechBills } from "@/lib/capitol-pulse/congress";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    const data = await getTechBills();
    return NextResponse.json(
      { source: "Congress.gov API", ...data },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (error) {
    console.error("[capitol-pulse] bills export failed:", error);
    return NextResponse.json({ error: "Could not reach Congress.gov" }, { status: 503 });
  }
}
