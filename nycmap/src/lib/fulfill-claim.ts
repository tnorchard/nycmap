import Stripe from "stripe";
import { OwnedBlock } from "@/types";
import { unpackLotMetadata } from "@/lib/lots";
import { bundlePrice, LOT_PRICE, MIN_BUNDLE, minOutbid } from "@/lib/pricing";
import {
  createGiftForSession,
  getClaimByBlockId,
  getClaimOwnerEmail,
  getGiftByCode,
  giftIsRedeemable,
  insertLotTransaction,
  isSessionProcessed,
  markSessionProcessed,
  redeemGift,
  upsertClaim,
} from "@/lib/claims-store";
import { sendMail, takeoverEmailHtml } from "@/lib/mail";
import { getStripe } from "@/lib/stripe";

function meta(session: Stripe.Checkout.Session, key: string) {
  return (session.metadata?.[key] ?? "").trim();
}

function sessionEmail(session: Stripe.Checkout.Session) {
  return (session.customer_details?.email || session.customer_email || "").trim();
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
  const ownerEmail = sessionEmail(session);
  const buyerToken = meta(session, "buyer_token");
  const giftCode = meta(session, "gift_code").toUpperCase();

  async function refund(reason: string, blockId: string) {
    if (!paymentIntentId) return;
    await getStripe().refunds.create({
      payment_intent: paymentIntentId,
      metadata: { reason, block_id: blockId },
    });
  }

  let giftCredit = 0;
  if (kind === "bundle" && giftCode) {
    try {
      const gift = await getGiftByCode(giftCode);
      if (gift && giftIsRedeemable(gift, buyerToken)) giftCredit = LOT_PRICE;
    } catch (err) {
      console.error("[gift lookup]", err);
    }
  }

  if (kind === "bundle") {
    const due = bundlePrice(lots.length) - giftCredit;
    if (lots.length < MIN_BUNDLE || paidDollars + 0.001 < due) {
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
        ownerEmail,
        amount: LOT_PRICE,
        kind: "claim",
      });
      await upsertClaim(claim, ownerEmail);
    }

    if (giftCode && giftCredit) {
      try {
        await redeemGift(giftCode, sessionId, ownerName);
      } catch (err) {
        console.error("[gift redeem]", err);
      }
    }

    try {
      await createGiftForSession({ sessionId, buyerToken, ownerName });
    } catch (err) {
      console.error("[gift create]", err);
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
        ownerEmail,
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

  const previousEmail = await getClaimOwnerEmail(lot.id).catch(() => "");
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
    ownerEmail,
    amount: paidDollars,
    kind: "takeover",
    previousOwnerName: current.ownerName,
    previousOwnerEmail: previousEmail,
    previousPrice: current.price,
  });
  await upsertClaim(claim, ownerEmail);
  await markSessionProcessed(sessionId, lot.id);

  if (previousEmail && previousEmail.toLowerCase() !== ownerEmail.toLowerCase()) {
    await sendMail(
      previousEmail,
      `${ownerName} just stole your lot in ${lot.neighborhoodName}`,
      takeoverEmailHtml({
        previousOwner: current.ownerName,
        newOwner: ownerName,
        neighborhood: lot.neighborhoodName,
        lotId: lot.id,
        amount: paidDollars,
      })
    );
  }

  try {
    await createGiftForSession({ sessionId, buyerToken, ownerName });
  } catch (err) {
    console.error("[gift create]", err);
  }

  return { ok: true, granted: true as const, claim };
}
