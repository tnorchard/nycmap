export type LotPayload = {
  id: string;
  taxBlock: number;
  neighborhoodId: string;
  neighborhoodName: string;
  borough: string;
};

const CHUNK = 450;

export function packLotMetadata(lots: LotPayload[], kind: "bundle" | "takeover") {
  const json = JSON.stringify(lots);
  const chunks: string[] = [];
  for (let i = 0; i < json.length; i += CHUNK) {
    chunks.push(json.slice(i, i + CHUNK));
  }
  const meta: Record<string, string> = {
    app: "nycmap",
    kind,
    lot_count: String(lots.length),
    block_ids: lots
      .map((l) => l.id)
      .join(",")
      .slice(0, 500),
    lot_chunks: String(chunks.length),
  };
  chunks.forEach((chunk, i) => {
    meta[`lc_${i}`] = chunk;
  });
  return meta;
}

export function unpackLotMetadata(meta: Record<string, string> | null | undefined): LotPayload[] {
  if (!meta) return [];
  const n = Number(meta.lot_chunks || "0");
  if (n > 0) {
    const json = Array.from({ length: n }, (_, i) => meta[`lc_${i}`] ?? "").join("");
    try {
      const parsed = JSON.parse(json) as LotPayload[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {
      /* fall through */
    }
  }
  const ids = (meta.block_ids || meta.block_id || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return ids.map((id) => ({
    id,
    taxBlock: Number(meta.tax_block || "0"),
    neighborhoodId: meta.neighborhood_id || "",
    neighborhoodName: meta.neighborhood_name || "",
    borough: meta.borough || "",
  }));
}

export function toLotPayload(block: {
  id: string;
  block: number;
  neighborhoodId: string;
  neighborhood: string;
  borough: string;
}): LotPayload {
  return {
    id: block.id,
    taxBlock: block.block,
    neighborhoodId: block.neighborhoodId,
    neighborhoodName: block.neighborhood,
    borough: block.borough,
  };
}
