import { NextResponse } from "next/server";
import { heartbeatPresence, readPresence } from "@/lib/presence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const data = await readPresence();
    return NextResponse.json(data, { headers: NO_STORE });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Presence unavailable";
    return NextResponse.json({ online: 0, visitors: 0, error: message }, { status: 503, headers: NO_STORE });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { visitorId?: string };
  const visitorId = (body.visitorId ?? "").trim().slice(0, 80);
  if (!visitorId) {
    return NextResponse.json({ error: "Missing visitorId" }, { status: 400, headers: NO_STORE });
  }
  try {
    const data = await heartbeatPresence(visitorId);
    return NextResponse.json(data, { headers: NO_STORE });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Presence unavailable";
    return NextResponse.json({ error: message }, { status: 503, headers: NO_STORE });
  }
}
