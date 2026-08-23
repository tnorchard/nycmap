"use client";

import { BlockProperties } from "@/types";
import { bundlePrice, formatMoney, LOT_PRICE, MAX_BUNDLE, MIN_BUNDLE } from "@/lib/pricing";

interface Props {
  lots: BlockProperties[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
}

export default function BundleBar({ lots, onRemove, onClear, onCheckout }: Props) {
  if (lots.length === 0) return null;

  const remaining = Math.max(0, MIN_BUNDLE - lots.length);
  const ready = lots.length >= MIN_BUNDLE;
  const total = bundlePrice(lots.length);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-[1100] p-3 sm:bottom-28 sm:p-4">
      <div className="pointer-events-auto mx-auto max-w-[720px] rounded-3xl border border-[#e4e0d8] bg-white/95 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#8a847e]">Your group</p>
            <p className="mt-1 text-[15px] font-medium text-[#141414]">
              {lots.length} lot{lots.length === 1 ? "" : "s"} · {formatMoney(LOT_PRICE)} each
            </p>
            <p className="mt-0.5 text-[12px] text-[#6b6560]">
              {ready
                ? `Ready to claim for ${formatMoney(total)}`
                : `Add ${remaining} more unclaimed lot${remaining === 1 ? "" : "s"} · minimum ${MIN_BUNDLE}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="rounded-full px-2 py-1 text-[11px] text-[#8a847e] hover:bg-[#f6f4ef] hover:text-[#141414]"
          >
            Clear
          </button>
        </div>

        <div className="mt-3 flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
          {lots.map((lot) => (
            <button
              key={lot.id}
              type="button"
              onClick={() => onRemove(lot.id)}
              className="rounded-full border border-[#e4e0d8] bg-[#f6f4ef] px-2.5 py-1 text-[11px] text-[#141414] hover:border-[#141414]"
              title="Remove from group"
            >
              {lot.neighborhood} {lot.block}
              <span className="ml-1 text-[#8a847e]">×</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={!ready || lots.length > MAX_BUNDLE}
          onClick={onCheckout}
          className="mt-3 w-full rounded-2xl bg-[#141414] py-3 text-[13px] font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-30"
        >
          {ready ? `Claim ${lots.length} lots · ${formatMoney(total)}` : `Group ${MIN_BUNDLE} lots to claim`}
        </button>
      </div>
    </div>
  );
}
