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

export async function upsertClaim(claim: OwnedBlock) {
  const admin = createAdminClient();
  const { error } = await admin.from("nycmap_lot_claims").upsert(claimToRow(claim), {
    onConflict: "block_id",
  });
  if (error) throw error;
}

export type LotTransactionKind = "claim" | "takeover" | "refunded_too_low";

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
  amount: number;
  kind: LotTransactionKind;
  previousOwnerName?: string | null;
  previousPrice?: number | null;
}) {
  const admin = createAdminClient();
  const { error } = await admin.from("nycmap_lot_transactions").insert({
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
    amount: row.amount,
    kind: row.kind,
    previous_owner_name: row.previousOwnerName || null,
    previous_price: row.previousPrice ?? null,
  });
  if (error) throw error;
}
