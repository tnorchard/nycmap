import Stripe from "stripe";
import { OwnedBlock } from "@/types";
import { unpackLotMetadata } from "@/lib/lots";
import { bundlePrice, LOT_PRICE, MIN_BUNDLE, minOutbid } from "@/lib/pricing";
import {
  getClaimByBlockId,
  insertLotTransaction,
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
  const lots = unpackLotMetadata(session.metadata ?? undefined);
  if (!lots.length) return { ok: false, error: "missing_block_id" as const };

  if (await isSessionProcessed(sessionId)) {
    return { ok: true, granted: false, duplicate: true as const };
  }

  const paidDollars = (session.amount_total ?? 0) / 100;
  const kind = meta(session, "kind") === "takeover" ? "takeover" : "bundle";
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  const ownerName = meta(session, "owner_name");
  const ownerUrl = meta(session, "owner_url");
  const ownerImage = meta(session, "owner_image");
  const ownerColor = meta(session, "owner_color") || "#141414";

  async function refund(reason: string, blockId: string) {
    if (!paymentIntentId) return;
    await getStripe().refunds.create({
      payment_intent: paymentIntentId,
      metadata: { reason, block_id: blockId },
    });
  }

  if (kind === "bundle") {
    if (lots.length < MIN_BUNDLE || paidDollars + 0.001 < bundlePrice(lots.length)) {
      await markSessionProcessed(sessionId, lots[0].id);
      await refund("bundle_invalid", lots[0].id);
      return { ok: true, granted: false, tooLow: true as const };
    }

    for (const lot of lots) {
      const current = await getClaimByBlockId(lot.id);
      if (current) {
        await markSessionProcessed(sessionId, lots[0].id);
        await refund("lot_already_claimed", lot.id);
        return { ok: true, granted: false, tooLow: true as const };
      }
    }

    const now = new Date().toISOString();
    for (const lot of lots) {
      const claim: OwnedBlock = {
        id: lot.id,
        taxBlock: lot.taxBlock,
        neighborhoodId: lot.neighborhoodId,
        neighborhoodName: lot.neighborhoodName,
        ownerName,
        ownerUrl,
        ownerImage,
        ownerColor,
        price: LOT_PRICE,
        purchasedAt: now,
        stripeSessionId: sessionId,
      };
      await insertLotTransaction({
        stripeSessionId: sessionId,
        stripePaymentIntentId: paymentIntentId,
        blockId: lot.id,
        taxBlock: lot.taxBlock,
        neighborhoodId: lot.neighborhoodId,
        neighborhoodName: lot.neighborhoodName,
        borough: lot.borough,
        ownerName,
        ownerUrl,
        ownerImage,
        ownerColor,
        amount: LOT_PRICE,
        kind: "claim",
      });
      await upsertClaim(claim);
    }
    await markSessionProcessed(sessionId, lots.map((l) => l.id).join(",").slice(0, 200));
    return { ok: true, granted: true as const, count: lots.length };
  }

  const lot = lots[0];
  const current = await getClaimByBlockId(lot.id);
  const min = current ? minOutbid(current.price) : LOT_PRICE;
  if (!current || paidDollars + 0.001 < min) {
    if (current) {
      await insertLotTransaction({
        stripeSessionId: sessionId,
        stripePaymentIntentId: paymentIntentId,
        blockId: lot.id,
        taxBlock: lot.taxBlock,
        neighborhoodId: lot.neighborhoodId,
        neighborhoodName: lot.neighborhoodName,
        borough: lot.borough,
        ownerName,
        ownerUrl,
        ownerImage,
        ownerColor,
        amount: paidDollars,
        kind: "refunded_too_low",
        previousOwnerName: current.ownerName,
        previousPrice: current.price,
      });
    }
    await markSessionProcessed(sessionId, lot.id);
    await refund("outbid_lost_race", lot.id);
    return { ok: true, granted: false, tooLow: true as const, min };
  }

  const claim: OwnedBlock = {
    id: lot.id,
    taxBlock: lot.taxBlock,
    neighborhoodId: lot.neighborhoodId,
    neighborhoodName: lot.neighborhoodName,
    ownerName,
    ownerUrl,
    ownerImage,
    ownerColor,
    price: paidDollars,
    purchasedAt: new Date().toISOString(),
    stripeSessionId: sessionId,
  };

  await insertLotTransaction({
    stripeSessionId: sessionId,
    stripePaymentIntentId: paymentIntentId,
    blockId: lot.id,
    taxBlock: lot.taxBlock,
    neighborhoodId: lot.neighborhoodId,
    neighborhoodName: lot.neighborhoodName,
    borough: lot.borough,
    ownerName,
    ownerUrl,
    ownerImage,
    ownerColor,
    amount: paidDollars,
    kind: "takeover",
    previousOwnerName: current.ownerName,
    previousPrice: current.price,
  });
  await upsertClaim(claim);
  await markSessionProcessed(sessionId, lot.id);
  return { ok: true, granted: true as const, claim };
}
