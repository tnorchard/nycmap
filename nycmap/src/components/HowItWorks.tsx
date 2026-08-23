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
          There are {NYC_TAX_BLOCKS.toLocaleString()} official tax blocks in the city&apos;s files.
          We carved them into {TOTAL_BLOCKS.toLocaleString()} digital lots — a board game on New York.
          A dollar a lot. Five at a time. Your link is a billboard; your photo is the flag.
          Anyone can steal a lot later for 1.5×. That&apos;s the sport.
        </p>

        <ol className="mt-6 space-y-4">
          <Step n="01" title="Assemble a parcel" body="Tap unclaimed lots until you have five. That’s the buy-in. Think Monopoly, except the board is the actual city." />
          <Step n="02" title="Plant the flag" body="Pay $1 a lot. Your name, link, and picture go on the map. People click through. That’s the whole prize." />
          <Step n="03" title="Hold the empire" body="Tycoons get hunted. Anyone can take a single lot at 1.5× the last sale. Stack the most value in a neighborhood and you’re mayor — your name sits on the map until someone outspends you." />
        </ol>

        <p className="mt-6 text-[11px] leading-relaxed text-[#8a847e]">
          Lots are drawn from public NYC tax-block / DCP data. The geometry is a souvenir, not a survey:
          lines can drift, lots get merged, industrial tracts get lumpy. This is not real property,
          not a legal description, and not affiliated with the City of New York. Checkout is billed by SportBusy LLC as NYC MAP.
          Questions?{" "}
          <a href="https://x.com/dullylamb" target="_blank" rel="noreferrer" className="underline underline-offset-2">
            @dullylamb
          </a>
          {" "}on X.
        </p>

        <button
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-[#141414] py-3 text-[13px] font-medium text-white transition hover:bg-black"
        >
          Go make a little trouble
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
