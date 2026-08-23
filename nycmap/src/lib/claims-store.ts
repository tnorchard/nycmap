import { OwnedBlock } from "@/types";
import { createAdminClient } from "@/lib/supabase/admin";

type LotClaimRow = {
  block_id: string;
  tax_block: number;
  neighborhood_id: string;
  neighborhood_name: string;
  owner_name: string;
  owner_url: string;
  owner_image: string;
  owner_color: string;
  price: number;
  purchased_at: string;
  stripe_session_id: string;
};

function rowToClaim(row: LotClaimRow): OwnedBlock {
  return {
    id: row.block_id,
    taxBlock: row.tax_block,
    neighborhoodId: row.neighborhood_id,
    neighborhoodName: row.neighborhood_name,
    ownerName: row.owner_name,
    ownerUrl: row.owner_url,
    ownerImage: row.owner_image,
    ownerColor: row.owner_color,
    price: Number(row.price),
    purchasedAt: row.purchased_at,
    stripeSessionId: row.stripe_session_id,
  };
}

function claimToRow(claim: OwnedBlock): LotClaimRow {
  return {
    block_id: claim.id,
    tax_block: claim.taxBlock,
    neighborhood_id: claim.neighborhoodId,
    neighborhood_name: claim.neighborhoodName,
    owner_name: claim.ownerName,
    owner_url: claim.ownerUrl,
    owner_image: claim.ownerImage,
    owner_color: claim.ownerColor,
    price: claim.price,
    purchased_at: claim.purchasedAt,
    stripe_session_id: claim.stripeSessionId ?? "",
  };
}

export async function listClaims(): Promise<OwnedBlock[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("nycmap_lot_claims")
    .select("*")
    .order("purchased_at", { ascending: false });

  if (error) throw error;
  return (data as LotClaimRow[]).map(rowToClaim);
}

export async function getClaimByBlockId(blockId: string): Promise<OwnedBlock | undefined> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("nycmap_lot_claims")
    .select("*")
    .eq("block_id", blockId)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToClaim(data as LotClaimRow) : undefined;
}

export async function isSessionProcessed(sessionId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("nycmap_processed_checkout_sessions")
    .select("stripe_session_id")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export async function markSessionProcessed(sessionId: string, blockId: string) {
  const admin = createAdminClient();
  const { error } = await admin.from("nycmap_processed_checkout_sessions").insert({
    stripe_session_id: sessionId,
    block_id: blockId,
  });
  if (error) throw error;
}

export async function upsertClaim(claim: OwnedBlock, ownerEmail = "") {
  const admin = createAdminClient();
  const withEmail = { ...claimToRow(claim), owner_email: ownerEmail };
  let { error } = await admin.from("nycmap_lot_claims").upsert(withEmail, { onConflict: "block_id" });
  if (error) {
    ({ error } = await admin.from("nycmap_lot_claims").upsert(claimToRow(claim), { onConflict: "block_id" }));
  }
  if (error) throw error;
}

export async function getClaimOwnerEmail(blockId: string): Promise<string> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("nycmap_lot_claims")
    .select("owner_email")
    .eq("block_id", blockId)
    .maybeSingle();
  if (error) throw error;
  return ((data as { owner_email?: string } | null)?.owner_email ?? "").trim();
}

export type LotTransactionKind = "claim" | "takeover" | "refunded_too_low" | "gift";

export type PublicDeed = {
  id: string;
  blockId: string;
  neighborhoodName: string;
  ownerName: string;
  ownerUrl: string;
  ownerImage: string;
  ownerColor: string;
  amount: number;
  kind: LotTransactionKind;
  previousOwnerName: string | null;
  createdAt: string;
};

export async function insertLotTransaction(row: {
  stripeSessionId: string;
  stripePaymentIntentId?: string | null;
  blockId: string;
  taxBlock: number;
  neighborhoodId: string;
  neighborhoodName: string;
  borough?: string;
  ownerName: string;
  ownerUrl: string;
  ownerImage: string;
  ownerColor: string;
  ownerEmail?: string;
  amount: number;
  kind: LotTransactionKind;
  previousOwnerName?: string | null;
  previousOwnerEmail?: string | null;
  previousPrice?: number | null;
}) {
  const admin = createAdminClient();
  const payload = {
    stripe_session_id: row.stripeSessionId,
    stripe_payment_intent_id: row.stripePaymentIntentId || null,
    block_id: row.blockId,
    tax_block: row.taxBlock,
    neighborhood_id: row.neighborhoodId,
    neighborhood_name: row.neighborhoodName,
    borough: row.borough || "",
    owner_name: row.ownerName,
    owner_url: row.ownerUrl,
    owner_image: row.ownerImage,
    owner_color: row.ownerColor,
    owner_email: row.ownerEmail || "",
    amount: row.amount,
    kind: row.kind,
    previous_owner_name: row.previousOwnerName || null,
    previous_owner_email: row.previousOwnerEmail || null,
    previous_price: row.previousPrice ?? null,
  };
  let { error } = await admin.from("nycmap_lot_transactions").insert(payload);
  if (error) {
    const { owner_email: _e, previous_owner_email: _p, ...legacy } = payload;
    void _e;
    void _p;
    ({ error } = await admin.from("nycmap_lot_transactions").insert(legacy));
  }
  if (error) throw error;
}

export async function listPublicDeeds(limit = 40): Promise<PublicDeed[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("nycmap_lot_transactions")
    .select(
      "id, block_id, neighborhood_name, owner_name, owner_url, owner_image, owner_color, amount, kind, previous_owner_name, created_at"
    )
    .in("kind", ["claim", "takeover"])
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
    id: String(row.id),
    blockId: String(row.block_id),
    neighborhoodName: String(row.neighborhood_name ?? ""),
    ownerName: String(row.owner_name),
    ownerUrl: String(row.owner_url ?? ""),
    ownerImage: String(row.owner_image ?? ""),
    ownerColor: String(row.owner_color ?? "#141414"),
    amount: Number(row.amount),
    kind: row.kind as LotTransactionKind,
    previousOwnerName: row.previous_owner_name ? String(row.previous_owner_name) : null,
    createdAt: String(row.created_at),
  }));
}

const GIFT_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function randomGiftCode() {
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += GIFT_ALPHABET[Math.floor(Math.random() * GIFT_ALPHABET.length)];
  }
  return code;
}

export type GiftCodeRow = {
  code: string;
  createdBySessionId: string;
  createdByBuyerToken: string;
  createdByName: string;
  createdAt: string;
  expiresAt: string;
  redeemedAt: string | null;
  redeemedBySessionId: string | null;
};

function giftFromRow(row: Record<string, unknown>): GiftCodeRow {
  return {
    code: String(row.code),
    createdBySessionId: String(row.created_by_session_id ?? ""),
    createdByBuyerToken: String(row.created_by_buyer_token ?? ""),
    createdByName: String(row.created_by_name ?? ""),
    createdAt: String(row.created_at),
    expiresAt: String(row.expires_at),
    redeemedAt: row.redeemed_at ? String(row.redeemed_at) : null,
    redeemedBySessionId: row.redeemed_by_session_id ? String(row.redeemed_by_session_id) : null,
  };
}

export async function getGiftByCode(code: string): Promise<GiftCodeRow | undefined> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("nycmap_gift_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .maybeSingle();
  if (error) throw error;
  return data ? giftFromRow(data as Record<string, unknown>) : undefined;
}

export async function getGiftByCreatorSession(sessionId: string): Promise<GiftCodeRow | undefined> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("nycmap_gift_codes")
    .select("*")
    .eq("created_by_session_id", sessionId)
    .maybeSingle();
  if (error) throw error;
  return data ? giftFromRow(data as Record<string, unknown>) : undefined;
}

export function giftIsRedeemable(gift: GiftCodeRow, buyerToken = "") {
  if (gift.redeemedAt) return false;
  if (new Date(gift.expiresAt).getTime() < Date.now()) return false;
  if (buyerToken && gift.createdByBuyerToken && gift.createdByBuyerToken === buyerToken) return false;
  return true;
}

export async function createGiftForSession(input: {
  sessionId: string;
  buyerToken: string;
  ownerName: string;
}): Promise<GiftCodeRow | undefined> {
  const existing = await getGiftByCreatorSession(input.sessionId);
  if (existing) return existing;
  const admin = createAdminClient();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = randomGiftCode();
    const { data, error } = await admin
      .from("nycmap_gift_codes")
      .insert({
        code,
        created_by_session_id: input.sessionId,
        created_by_buyer_token: input.buyerToken,
        created_by_name: input.ownerName,
        expires_at: expires,
      })
      .select("*")
      .maybeSingle();
    if (!error && data) return giftFromRow(data as Record<string, unknown>);
  }
  return undefined;
}

export async function redeemGift(code: string, sessionId: string, redeemerName: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("nycmap_gift_codes")
    .update({
      redeemed_at: new Date().toISOString(),
      redeemed_by_session_id: sessionId,
      redeemed_by_name: redeemerName,
    })
    .eq("code", code.toUpperCase())
    .is("redeemed_at", null)
    .select("code")
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}
