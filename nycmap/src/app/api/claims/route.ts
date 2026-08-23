import { NextResponse } from "next/server";
import { listClaims } from "@/lib/claims-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const claims = await listClaims();
  return NextResponse.json({ claims });
}
