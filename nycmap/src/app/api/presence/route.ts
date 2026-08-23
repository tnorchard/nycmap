import { NextResponse } from "next/server";
import { heartbeatPresence, readPresence } from "@/lib/presence";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await readPresence();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Presence unavailable";
    return NextResponse.json({ online: 0, visitors: 0, error: message }, { status: 200 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { visitorId?: string; isNewVisitor?: boolean };
  const visitorId = (body.visitorId ?? "").trim().slice(0, 80);
  if (!visitorId) {
    return NextResponse.json({ error: "Missing visitorId" }, { status: 400 });
  }
  try {
    const data = await heartbeatPresence(visitorId, Boolean(body.isNewVisitor));
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Presence unavailable";
    return NextResponse.json({ online: 1, visitors: 0, error: message }, { status: 200 });
  }
}
