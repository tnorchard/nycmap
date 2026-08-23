"use client";

import { useState } from "react";
import { BlockProperties, OwnedBlock } from "@/types";
import { formatMoney, minOutbid } from "@/lib/pricing";

const COLORS = ["#141414", "#8B1E3F", "#1F4E5F", "#C45C26", "#2F5D50", "#3D348B", "#B08900"];

interface Props {
  block: BlockProperties;
  owner?: OwnedBlock;
  onClose: () => void;
}

export default function PurchaseModal({ block, owner, onClose }: Props) {
  const isOwned = !!owner;
  const minBid = isOwned ? minOutbid(owner.price) : block.price;
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [bidAmount, setBidAmount] = useState(String(minBid));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const bid = Number(bidAmount) || 0;
  const isValid = name.trim() && url.trim() && bid >= minBid;

  const handlePurchase = async () => {
    if (!isValid) return;
    setBusy(true);
    setError("");
    const href = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockId: block.id,
          taxBlock: block.block,
          neighborhoodId: block.neighborhoodId,
          neighborhoodName: block.neighborhood,
          borough: block.borough,
          ownerName: name.trim(),
          ownerUrl: href,
          ownerImage: image.trim(),
          ownerColor: color,
          bid,
          basePrice: block.price,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2100] flex items-end justify-center bg-black/25 p-4 backdrop-blur-sm sm:items-center">
      <div className="claim-sheet w-full max-w-md overflow-hidden rounded-3xl border border-[#e4e0d8] bg-white shadow-2xl">
        <>
            <div className="flex items-start justify-between border-b border-[#eeeae3] px-6 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847e]">
                  {isOwned ? "Takeover" : "Claim"}
                </p>
                <h2 className="font-serif mt-1 text-xl text-[#141414]">
                  {block.neighborhood} {block.block}
                </h2>
              </div>
              <button onClick={onClose} className="rounded-full p-1 text-[#8a847e] hover:bg-[#f6f4ef]" aria-label="Close">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="border-b border-[#eeeae3] px-6 py-4">
              <label className="text-[11px] uppercase tracking-[0.14em] text-[#8a847e]">
                {isOwned ? `Minimum ${formatMoney(minBid)}` : "Your bid"}
              </label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a847e]">$</span>
                <input
                  type="number"
                  min={minBid}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full rounded-2xl border border-[#e4e0d8] bg-[#f6f4ef] py-3 pl-8 pr-4 font-serif text-3xl text-[#141414] outline-none focus:border-[#141414]"
                />
              </div>
            </div>

            <div className="space-y-3 px-6 py-4">
              <Field label="Name / brand" value={name} onChange={setName} placeholder="Acme" />
              <Field label="Website or handle" value={url} onChange={setUrl} placeholder="https://acme.com" />
              <Field label="Logo URL (optional)" value={image} onChange={setImage} placeholder="https://…/logo.png" />
              <div>
                <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-[#8a847e]">Color on the map</p>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-7 w-7 rounded-full border-2 ${color === c ? "border-[#141414]" : "border-transparent"}`}
                      style={{ background: c }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={handlePurchase}
                disabled={!isValid || busy}
                className="w-full rounded-2xl bg-[#141414] py-3 text-[13px] font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-30"
              >
                {busy ? "Sending you to Stripe…" : isOwned ? `Takeover for ${formatMoney(bid)}` : `Claim for ${formatMoney(bid)}`}
              </button>
              {error ? <p className="mt-2 text-center text-[11px] text-[#8B1E3F]">{error}</p> : null}
              <p className="mt-2 text-center text-[10px] text-[#8a847e]">
                Stripe Checkout · billed as NYC MAP by SportBusy LLC · test mode
              </p>
            </div>
          </>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.14em] text-[#8a847e]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-[#e4e0d8] bg-[#f6f4ef] px-3 py-2.5 text-[13px] text-[#141414] outline-none placeholder:text-[#c4bfb6] focus:border-[#141414]"
      />
    </label>
  );
}
