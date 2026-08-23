"use client";

import { TOTAL_BLOCKS, NYC_TAX_BLOCKS } from "@/data/neighborhoods";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function HowItWorks({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/20 p-4 backdrop-blur-sm sm:items-center">
      <div className="claim-sheet w-full max-w-lg rounded-3xl border border-[#e4e0d8] bg-[#f6f4ef] p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a847e]">The idea</p>
            <h2 className="font-serif mt-1 text-3xl leading-tight text-[#141414]">
              New York is for sale.
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#8a847e] transition hover:bg-white hover:text-[#141414]"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="mt-4 text-[14px] leading-relaxed text-[#5c574f]">
          There are {NYC_TAX_BLOCKS.toLocaleString()} official tax blocks in New York City.
          This map splits them into {TOTAL_BLOCKS.toLocaleString()} lots — one shape, one claim —
          across all five boroughs. Pick one. Put your name on it. Anyone can take it.
        </p>

        <ol className="mt-6 space-y-4">
          <Step n="01" title="Pick a lot" body="Choose a borough, zoom in until streets appear, then tap a single lot. Midtown costs more than Inwood." />
          <Step n="02" title="Claim it" body="Pay the listed price. Your name, link, and color live on the map." />
          <Step n="03" title="Defend it" body="Anyone can steal your block by paying 1.5× what you paid. Outbid them back, or let it go." />
        </ol>

        <p className="mt-6 text-[11px] leading-relaxed text-[#8a847e]">
          Not affiliated with the City of New York. Blocks are digital souvenirs on this map,
          not real property. Payments are simulated in this preview.
        </p>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-[#141414] py-3 text-[13px] font-medium text-white transition hover:bg-black"
        >
          Start looking
        </button>
      </div>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <span className="font-serif text-[13px] text-[#8a847e]">{n}</span>
      <div>
        <p className="text-[13px] font-medium text-[#141414]">{title}</p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-[#5c574f]">{body}</p>
      </div>
    </li>
  );
}
