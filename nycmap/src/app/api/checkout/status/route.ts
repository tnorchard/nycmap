import { NextResponse } from "next/server";
import { getGiftByCreatorSession, listClaims } from "@/lib/claims-store";
import { unpackLotMetadata } from "@/lib/lots";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
  if (!sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const lots = unpackLotMetadata(session.metadata ?? undefined);
  const ids = new Set(lots.map((l) => l.id));
  const claims = await listClaims();
  const matched = claims.filter((c) => c.stripeSessionId === sessionId || ids.has(c.id));
  const claim = matched.find((c) => c.stripeSessionId === sessionId) ?? matched[0] ?? null;
  let giftCode = "";
  try {
    const gift = await getGiftByCreatorSession(sessionId);
    giftCode = gift?.code ?? "";
  } catch {
    giftCode = "";
  }

  return NextResponse.json({
    status: session.status,
    payment_status: session.payment_status,
    blockId: lots[0]?.id ?? "",
    count: lots.length || matched.length,
    claimed: Boolean(claim && claim.stripeSessionId === sessionId),
    claim: claim?.stripeSessionId === sessionId ? claim : null,
    lots: lots.map((l) => l.id),
    neighborhoodName: lots[0]?.neighborhoodName || claim?.neighborhoodName || "",
    ownerName: session.metadata?.owner_name || claim?.ownerName || "",
    kind: session.metadata?.kind || "bundle",
    giftCode,
  });
}
