import { NextResponse } from "next/server";
import { getGiftByCode, giftIsRedeemable, listClaims } from "@/lib/claims-store";
import { packLotMetadata, type LotPayload } from "@/lib/lots";
import { bundlePrice, LOT_PRICE, MAX_BUNDLE, MIN_BUNDLE, minOutbid } from "@/lib/pricing";
import { appBaseUrl, getStripe, integrationIdentifier } from "@/lib/stripe";

export const runtime = "nodejs";

type Body = {
  lots?: LotPayload[];
  kind?: "bundle" | "takeover";
  ownerName?: string;
  ownerUrl?: string;
  ownerImage?: string;
  ownerColor?: string;
  bid?: number;
  giftCode?: string;
  buyerToken?: string;
};

function clip(value: string, max = 450) {
  return value.slice(0, max);
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as Body;
  const lots = Array.isArray(body.lots) ? body.lots : [];
  const kind = body.kind === "takeover" ? "takeover" : "bundle";
  const ownerName = (body.ownerName ?? "").trim();
  let ownerUrl = (body.ownerUrl ?? "").trim();
  const ownerImage = (body.ownerImage ?? "").trim();
  const ownerColor = (body.ownerColor ?? "#141414").trim();
  const bid = Number(body.bid);
  const giftCode = (body.giftCode ?? "").trim().toUpperCase();
  const buyerToken = (body.buyerToken ?? "").trim();

  if (!lots.length || !ownerName || !ownerUrl || !Number.isFinite(bid) || bid < LOT_PRICE) {
    return NextResponse.json({ error: "Missing claim details" }, { status: 400 });
  }
  if (lots.length > MAX_BUNDLE) {
    return NextResponse.json({ error: `At most ${MAX_BUNDLE} lots per checkout` }, { status: 400 });
  }
  const ids = new Set(lots.map((l) => l.id));
  if (ids.size !== lots.length || lots.some((l) => !l.id)) {
    return NextResponse.json({ error: "Duplicate or invalid lots" }, { status: 400 });
  }

  if (!ownerUrl.startsWith("http://") && !ownerUrl.startsWith("https://")) {
    ownerUrl = `https://${ownerUrl}`;
  }

  const claims = await listClaims();
  const owned = new Set(claims.map((c) => c.id));

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
    if (lots.length < MIN_BUNDLE) {
      return NextResponse.json(
        { error: `Claim at least ${MIN_BUNDLE} unclaimed lots together` },
        { status: 400 }
      );
    }
    if (lots.some((l) => owned.has(l.id))) {
      return NextResponse.json({ error: "One of those lots is already claimed" }, { status: 409 });
    }
    const min = bundlePrice(lots.length);
    if (bid < min) {
      return NextResponse.json({ error: `Bid must be at least $${min}` }, { status: 409 });
    }
  } else {
    if (lots.length !== 1) {
      return NextResponse.json({ error: "Takeovers are one lot at a time" }, { status: 400 });
    }
    const current = claims.find((c) => c.id === lots[0].id);
    if (!current) {
      return NextResponse.json({ error: "That lot is unclaimed — group 5 open lots instead" }, { status: 409 });
    }
    const min = minOutbid(current.price);
    if (bid < min) {
      return NextResponse.json({ error: `Bid must be at least $${min}` }, { status: 409 });
    }
  }

  const amountCents = Math.round((kind === "bundle" ? bid - giftCredit : bid) * 100);
  const origin = appBaseUrl();
  const label = kind === "takeover" ? "Takeover" : "Claim";
  const first = lots[0];
  const place = [first.neighborhoodName, first.borough].filter(Boolean).join(", ");
  const stripe = getStripe();
  const packed = packLotMetadata(lots, kind);

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/claim/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=canceled`,
      client_reference_id: lots[0].id.slice(0, 200),
      allow_promotion_codes: true,
      branding_settings: {
        display_name: "NYC Map",
      },
      integration_identifier: integrationIdentifier("nycmap_lot"),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: kind === "bundle" ? `NYC Map · ${lots.length} lots` : "NYC Map lot takeover",
              description:
                kind === "bundle"
                  ? `Digital souvenir — claim ${lots.length} lots at $${LOT_PRICE} each. Not real NYC property.`
                  : `Digital souvenir — takeover lot ${lots[0].id}. Not real NYC property.`,
              metadata: {
                app: "nycmap",
                product: kind === "bundle" ? "lot_bundle" : "lot_takeover",
              },
            },
          },
        },
      ],
      custom_text: {
        submit: {
          message: `${label} ${place ? `${place} ` : ""}${lots.length === 1 ? `lot ${lots[0].id}` : `${lots.length} lots`}. Digital souvenir — not real NYC property. Charged by SportBusy LLC.`,
        },
      },
      payment_intent_data: {
        statement_descriptor_suffix: "NYC MAP",
        description: `${label} ${lots.length} lot${lots.length === 1 ? "" : "s"}`,
        metadata: {
          app: "nycmap",
          kind,
          block_ids: packed.block_ids,
        },
      },
      metadata: {
        ...packed,
        owner_name: clip(ownerName, 80),
        owner_url: clip(ownerUrl),
        owner_image: clip(ownerImage),
        owner_color: clip(ownerColor, 20),
        bid: String(bid),
        gift_code: giftCode,
        buyer_token: clip(buyerToken, 80),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("Stripe checkout session failed:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
