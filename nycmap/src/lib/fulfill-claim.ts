import Stripe from "stripe";
import { OwnedBlock } from "@/types";
import { minOutbid } from "@/lib/pricing";
import {
  getClaimByBlockId,
  isSessionProcessed,
  markSessionProcessed,
  upsertClaim,
} from "@/lib/claims-store";
import { getStripe } from "@/lib/stripe";

function meta(session: Stripe.Checkout.Session, key: string) {
  return (session.metadata?.[key] ?? "").trim();
}

export async function fulfillPaidSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return { ok: true, skipped: "unpaid" as const };

  const sessionId = session.id;
  const blockId = meta(session, "block_id");
  if (!blockId) return { ok: false, error: "missing_block_id" as const };

  if (await isSessionProcessed(sessionId)) {
    return { ok: true, granted: false, duplicate: true as const };
  }

  const paidDollars = (session.amount_total ?? 0) / 100;
  const current = await getClaimByBlockId(blockId);
  const min = current ? minOutbid(current.price) : Number(meta(session, "base_price") || "0");

  if (current && paidDollars + 0.001 < min) {
    await markSessionProcessed(sessionId, blockId);
    const pi =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;
    if (pi) {
      await getStripe().refunds.create({
        payment_intent: pi,
        metadata: { reason: "outbid_lost_race", block_id: blockId },
      });
    }
    return { ok: true, granted: false, tooLow: true as const, min };
  }

  const claim: OwnedBlock = {
    id: blockId,
    taxBlock: Number(meta(session, "tax_block") || "0"),
    neighborhoodId: meta(session, "neighborhood_id"),
    neighborhoodName: meta(session, "neighborhood_name"),
    ownerName: meta(session, "owner_name"),
    ownerUrl: meta(session, "owner_url"),
    ownerImage: meta(session, "owner_image"),
    ownerColor: meta(session, "owner_color") || "#141414",
    price: paidDollars,
    purchasedAt: new Date().toISOString(),
    stripeSessionId: sessionId,
  };

  await upsertClaim(claim);
  await markSessionProcessed(sessionId, blockId);
  return { ok: true, granted: true as const, claim };
}
