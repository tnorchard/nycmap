import { NextResponse } from "next/server";
import { listClaims } from "@/lib/claims-store";
import { minOutbid } from "@/lib/pricing";
import { appBaseUrl, getStripe, integrationIdentifier } from "@/lib/stripe";

export const runtime = "nodejs";

type Body = {
  blockId?: string;
  taxBlock?: number;
  neighborhoodId?: string;
  neighborhoodName?: string;
  borough?: string;
  ownerName?: string;
  ownerUrl?: string;
  ownerImage?: string;
  ownerColor?: string;
  bid?: number;
  basePrice?: number;
};

function clip(value: string, max = 450) {
  return value.slice(0, max);
}

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as Body;
  const blockId = (body.blockId ?? "").trim();
  const ownerName = (body.ownerName ?? "").trim();
  let ownerUrl = (body.ownerUrl ?? "").trim();
  const ownerImage = (body.ownerImage ?? "").trim();
  const ownerColor = (body.ownerColor ?? "#141414").trim();
  const bid = Number(body.bid);
  const basePrice = Number(body.basePrice);
  const neighborhoodId = (body.neighborhoodId ?? "").trim();
  const neighborhoodName = (body.neighborhoodName ?? "").trim();
  const taxBlock = Number(body.taxBlock);
  const borough = (body.borough ?? "").trim();

  if (!blockId || !ownerName || !ownerUrl || !Number.isFinite(bid) || bid < 1) {
    return NextResponse.json({ error: "Missing claim details" }, { status: 400 });
  }
  if (!Number.isFinite(basePrice) || basePrice < 1) {
    return NextResponse.json({ error: "Invalid base price" }, { status: 400 });
  }

  if (!ownerUrl.startsWith("http://") && !ownerUrl.startsWith("https://")) {
    ownerUrl = `https://${ownerUrl}`;
  }

  const claims = await listClaims();
  const current = claims.find((c) => c.id === blockId);
  const min = current ? minOutbid(current.price) : basePrice;
  if (bid < min) {
    return NextResponse.json({ error: `Bid must be at least $${min}` }, { status: 409 });
  }

  const amountCents = Math.round(bid * 100);
  const productId = process.env.STRIPE_NYCMAP_PRODUCT_ID || "nycmap_lot";
  const origin = appBaseUrl();
  const label = current ? "Takeover" : "Claim";
  const place = [neighborhoodName, borough].filter(Boolean).join(", ");
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${origin}/claim/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?checkout=canceled`,
    client_reference_id: blockId,
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
          product: productId,
        },
      },
    ],
    custom_text: {
      submit: {
        message: `${label} ${place ? `${place} ` : ""}lot ${blockId}. Digital souvenir — not real NYC property. Charged by SportBusy LLC.`,
      },
    },
    payment_intent_data: {
      statement_descriptor_suffix: "NYC MAP",
      description: `${label} ${blockId}`,
      metadata: {
        app: "nycmap",
        block_id: blockId,
      },
    },
    metadata: {
      app: "nycmap",
      block_id: clip(blockId, 80),
      tax_block: String(Number.isFinite(taxBlock) ? taxBlock : 0),
      neighborhood_id: clip(neighborhoodId, 80),
      neighborhood_name: clip(neighborhoodName, 120),
      borough: clip(borough, 40),
      owner_name: clip(ownerName, 80),
      owner_url: clip(ownerUrl),
      owner_image: clip(ownerImage),
      owner_color: clip(ownerColor, 20),
      base_price: String(basePrice),
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Stripe did not return a checkout URL" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
