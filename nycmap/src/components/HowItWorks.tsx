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
      <div className="claim-sheet max-h-[min(92dvh,840px)] w-full max-w-lg overflow-y-auto rounded-3xl border border-[#e4e0d8] bg-[#f6f4ef] p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8a847e]">About</p>
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
          <Step
            n="01"
            title="Assemble a parcel"
            body="Tap unclaimed lots until you have five. That’s the buy-in. Think Monopoly, except the board is the actual city."
          />
          <Step
            n="02"
            title="Plant the flag"
            body="Pay $1 a lot. Your name, link, and picture go on the map. If you become mayor, people click your URL on the pill and your photo floats over the hood. That’s the whole prize."
          />
          <Step
            n="03"
            title="Hunt and be hunted"
            body="Tycoons rank by total property value citywide. Anyone can take a single owned lot at 1.5× the last sale — so empires get picked apart one block at a time."
          />
        </ol>

        <div className="mt-6 border-t border-[#e4e0d8] pt-5">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847e]">Mayors</p>
          <h3 className="font-serif mt-1 text-xl leading-snug text-[#141414]">
            One seat per neighborhood.
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[#5c574f]">
            You don’t buy a neighborhood. You buy lots. Whoever has spent the most on lots inside a
            neighborhood becomes its mayor — the map paints that hood in their color, and their name
            sits on the label until someone else outspends them there. Tap the mayor’s URL to visit
            their site. If they uploaded a photo, it floats over the territory like a billboard.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#5c574f]">
            If you’re the only person with a lot in Inwood, you’re mayor of Inwood. The seat is yours
            until a rival pours more money into that same neighborhood.
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-[#5c574f]">
            Tycoon is the citywide crown (total property value everywhere). Mayor is local — a flag
            planted in one hood. Chase both if you like chaos.
          </p>
        </div>

        <p className="mt-5 text-[13px] leading-relaxed text-[#5c574f]">
          Questions or press —{" "}
          <a
            href="https://x.com/dullylamb"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[#141414] underline underline-offset-2"
          >
            @dullylamb
          </a>{" "}
          on X.
        </p>

        <p className="mt-4 text-[11px] leading-relaxed text-[#8a847e]">
          Lots are drawn from public NYC tax-block / DCP data. The geometry is a souvenir, not a survey:
          lines can drift, lots get merged, industrial tracts get lumpy. This is not real property,
          not a legal description, and not affiliated with the City of New York. Checkout is billed by SportBusy LLC as NYC MAP.
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
