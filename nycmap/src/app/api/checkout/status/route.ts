import { NextResponse } from "next/server";
import { listClaims } from "@/lib/claims-store";
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
  const blockId = session.metadata?.block_id ?? "";
  const claims = await listClaims();
  const claim = claims.find((c) => c.stripeSessionId === sessionId || (blockId && c.id === blockId));

  return NextResponse.json({
    status: session.status,
    payment_status: session.payment_status,
    blockId,
    claimed: Boolean(claim && claim.stripeSessionId === sessionId),
    claim: claim?.stripeSessionId === sessionId ? claim : null,
  });
}
