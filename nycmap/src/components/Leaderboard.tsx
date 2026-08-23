"use client";

import { useOwnership } from "@/lib/ownership";
import { formatMoney } from "@/lib/pricing";

export default function Leaderboard() {
  const { ownedBlocks, getTopOwners } = useOwnership();
  const recent = [...ownedBlocks].sort((a, b) => b.purchasedAt.localeCompare(a.purchasedAt)).slice(0, 4);
  const top = getTopOwners().slice(0, 4);

  if (ownedBlocks.length === 0) return null;

  return (
    <div className="pointer-events-none absolute bottom-28 left-3 z-[1000] hidden w-64 sm:block sm:left-4">
      <div className="pointer-events-auto rounded-2xl border border-[#e4e0d8] bg-white/90 p-3 shadow-sm backdrop-blur-md">
        <p className="text-[9px] uppercase tracking-[0.16em] text-[#8a847e]">Recent deeds</p>
        <ul className="mt-2 space-y-1.5">
          {recent.map((b) => (
            <li key={b.id} className="flex items-baseline justify-between gap-2 text-[11px]">
              <span className="truncate text-[#141414]">
                {b.ownerName}
                <span className="text-[#8a847e]"> · {b.neighborhoodName}</span>
              </span>
              <span className="shrink-0 text-[#6b6560]">{formatMoney(b.price)}</span>
            </li>
          ))}
        </ul>
        {top.length > 0 && (
          <>
            <p className="mt-3 text-[9px] uppercase tracking-[0.16em] text-[#8a847e]">Landlords</p>
            <ul className="mt-2 space-y-1.5">
              {top.map((o, i) => (
                <li key={o.name} className="flex items-baseline justify-between text-[11px]">
                  <span className="truncate text-[#141414]">
                    {i + 1}. {o.name}
                  </span>
                  <span className="text-[#6b6560]">{formatMoney(o.spent)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
