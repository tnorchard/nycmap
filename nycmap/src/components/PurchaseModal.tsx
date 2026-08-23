"use client";

import { useState } from "react";
import { BlockProperties, OwnedBlock } from "@/types";
import { bundlePrice, formatMoney, LOT_PRICE, minOutbid } from "@/lib/pricing";
import { toLotPayload } from "@/lib/lots";

const COLORS = ["#141414", "#8B1E3F", "#1F4E5F", "#C45C26", "#2F5D50", "#3D348B", "#B08900"];

interface Props {
  lots: BlockProperties[];
  owner?: OwnedBlock;
  onClose: () => void;
}

export default function PurchaseModal({ lots, owner, onClose }: Props) {
  const isTakeover = lots.length === 1 && !!owner;
  const minBid = isTakeover ? minOutbid(owner.price) : bundlePrice(lots.length);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [bidAmount, setBidAmount] = useState(String(minBid));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const bid = isTakeover ? Number(bidAmount) || 0 : minBid;
  const valid = Boolean(name.trim() && url.trim() && bid >= minBid);
  const headline = isTakeover
    ? `${lots[0].neighborhood} ${lots[0].block}`
    : `${lots.length} lots · ${formatMoney(LOT_PRICE)} each`;

  const checkout = async () => {
    if (!valid) return;
    setBusy(true);
    setError("");
    const href = url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lots: lots.map(toLotPayload),
          kind: isTakeover ? "takeover" : "bundle",
          ownerName: name.trim(),
          ownerUrl: href,
          ownerImage: image.trim(),
          ownerColor: color,
          bid,
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
    <div className="fixed inset-0 z-[2100] flex items-end justify-center bg-black/20 p-4 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-[#e4e0d8] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#eeeae3] px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847e]">
              {isTakeover ? "Takeover" : "Claim group"}
            </p>
            <h2 className="font-serif mt-1 text-xl text-[#141414]">{headline}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-[#8a847e] hover:bg-[#f6f4ef]" aria-label="Close">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isTakeover ? (
          <div className="border-b border-[#eeeae3] px-6 py-4">
            <label className="text-[11px] uppercase tracking-[0.14em] text-[#8a847e]">
              Minimum {formatMoney(minBid)}
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
        ) : (
          <div className="border-b border-[#eeeae3] px-6 py-4">
            <p className="text-[13px] text-[#5c574f]">
              Unclaimed lots are {formatMoney(LOT_PRICE)} each. Five is the buy-in. Your link is the billboard;
              your photo is the flag people see on the map.
            </p>
            <p className="font-serif mt-2 text-3xl text-[#141414]">{formatMoney(minBid)}</p>
          </div>
        )}

        <div className="space-y-3 px-6 py-4">
          <Field label="Name / brand" value={name} onChange={setName} placeholder="Acme" />
          <Field label="Your link — this is the billboard" value={url} onChange={setUrl} placeholder="https://acme.com" />
          <Field label="Photo or logo URL — this is the flag" value={image} onChange={setImage} placeholder="https://…/logo.png" />
          <p className="-mt-1 text-[11px] leading-snug text-[#8a847e]">
            People click your link from the map, the legend, and the ledger. The picture shows up next to your name. That’s what you’re buying.
          </p>
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-[#8a847e]">Color on the map</p>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
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
            type="button"
            onClick={() => void checkout()}
            disabled={!valid || busy}
            className="w-full rounded-2xl bg-[#141414] py-3 text-[13px] font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-30"
          >
            {busy
              ? "Sending you to Stripe…"
              : isTakeover
                ? `Takeover for ${formatMoney(bid)}`
                : `Claim ${lots.length} lots · ${formatMoney(bid)}`}
          </button>
          {error ? <p className="mt-2 text-center text-[11px] text-[#8B1E3F]">{error}</p> : null}
          <p className="mt-2 text-center text-[10px] text-[#8a847e]">
            Stripe Checkout · billed as NYC MAP by SportBusy LLC
          </p>
        </div>
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
