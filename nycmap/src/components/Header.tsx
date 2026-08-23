"use client";

import { BLOCKS_BY_BOROUGH, BOROUGHS, BoroughId } from "@/data/neighborhoods";
import { useOwnership } from "@/lib/ownership";
import { formatMoney } from "@/lib/pricing";

interface HeaderProps {
  borough: BoroughId;
  onBoroughChange: (id: BoroughId) => void;
  onHowItWorks: () => void;
}

export default function Header({ borough, onBoroughChange, onHowItWorks }: HeaderProps) {
  const { ownedBlocks, getTotalRevenue } = useOwnership();
  const total = BLOCKS_BY_BOROUGH[borough];
  const claimedHere = ownedBlocks.filter((b) => b.id.startsWith(prefix(borough))).length;
  const remaining = total - claimedHere;
  const current = BOROUGHS.find((b) => b.id === borough)!;

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-[1000] p-3 sm:p-4">
      <div className="pointer-events-auto mx-auto flex max-w-[1400px] flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-[#e4e0d8] bg-white/90 px-3.5 py-2.5 shadow-sm backdrop-blur-md">
            <div>
              <h1 className="font-serif text-[22px] leading-none tracking-tight text-[#141414]">
                NYC MAP
              </h1>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-[#8a847e]">
                {current.name}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-2xl border border-[#e4e0d8] bg-white/90 px-4 py-2 shadow-sm backdrop-blur-md md:flex">
            <Stat label="Lots" value={total.toLocaleString()} />
            <Divider />
            <Stat label="Claimed" value={String(claimedHere)} />
            <Divider />
            <Stat label="Open" value={remaining.toLocaleString()} />
            <Divider />
            <Stat label="Spent" value={formatMoney(getTotalRevenue())} />
          </div>

          <button
            onClick={onHowItWorks}
            className="rounded-2xl border border-[#e4e0d8] bg-white/90 px-3.5 py-2.5 text-[12px] font-medium text-[#141414] shadow-sm backdrop-blur-md transition hover:bg-white"
          >
            How it works
          </button>
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {BOROUGHS.map((b) => {
            const active = b.id === borough;
            return (
              <button
                key={b.id}
                onClick={() => onBoroughChange(b.id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium shadow-sm backdrop-blur-md transition ${
                  active
                    ? "border-[#141414] bg-[#141414] text-white"
                    : "border-[#e4e0d8] bg-white/90 text-[#141414] hover:bg-white"
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

function prefix(id: BoroughId) {
  return { manhattan: "MN", brooklyn: "BK", queens: "QN", bronx: "BX", "staten-island": "SI" }[id];
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-1.5 text-center">
      <p className="font-serif text-[15px] leading-none text-[#141414]">{value}</p>
      <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#8a847e]">{label}</p>
    </div>
  );
}

function Divider() {
  return <div className="h-7 w-px bg-[#e4e0d8]" />;
}
