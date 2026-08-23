import { NextResponse } from "next/server";
import { listPublicDeeds } from "@/lib/claims-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const deeds = await listPublicDeeds(40);
    return NextResponse.json({ deeds });
  } catch (err) {
    console.error("[activity]", err);
    return NextResponse.json({ deeds: [] });
  }
}
