"use client";

import { useOwnership } from "@/lib/ownership";
import { formatMoney } from "@/lib/pricing";
import { OwnerAvatar, OwnerLink } from "@/components/OwnerMark";

interface Props {
  highlightOwner: string | null;
  onSelectOwner: (name: string | null) => void;
  onViewAll: (tab: "deeds" | "landlords") => void;
}

export default function Leaderboard({ highlightOwner, onSelectOwner, onViewAll }: Props) {
  const { ownedBlocks, getTopOwners } = useOwnership();
  const recent = [...ownedBlocks].sort((a, b) => b.purchasedAt.localeCompare(a.purchasedAt)).slice(0, 3);
  const tycoons = getTopOwners().slice(0, 3);

  return (
    <div className="pointer-events-none absolute bottom-28 left-3 z-[1000] w-[min(280px,calc(100vw-1.5rem))] sm:left-4">
      <div className="pointer-events-auto rounded-2xl border border-[#e4e0d8] bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-[#8a847e]">Fresh deeds</p>
            <p className="text-[10px] text-[#8a847e]">Ink still wet. Names are billboards.</p>
          </div>
          <button
            type="button"
            onClick={() => onViewAll("deeds")}
            className="text-[10px] font-medium text-[#141414] underline-offset-2 hover:underline"
          >
            View all
          </button>
        </div>
        {recent.length === 0 ? (
          <p className="mt-2 text-[11px] leading-snug text-[#8a847e]">Nobody’s planted a flag yet. Five lots and you’re on the wall.</p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {recent.map((b) => (
              <li key={`${b.id}-${b.purchasedAt}`} className="flex items-center gap-2">
                <OwnerAvatar name={b.ownerName} image={b.ownerImage} color={b.ownerColor} url={b.ownerUrl} size={22} />
                <span className="min-w-0 flex-1 truncate text-[11px] text-[#141414]">
                  <span className="font-medium">{b.ownerName}</span>
                  {b.ownerUrl ? (
                    <>
                      {" "}
                      <OwnerLink url={b.ownerUrl} name={b.ownerName} className="text-[#6b6560]" />
                    </>
                  ) : null}
                  <span className="text-[#8a847e]"> · {b.neighborhoodName}</span>
                </span>
                <span className="shrink-0 text-[11px] text-[#6b6560]">{formatMoney(b.price)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-[#8a847e]">Tycoons</p>
            <p className="text-[10px] text-[#8a847e]">Ranked by loot on the books.</p>
          </div>
          <button
            type="button"
            onClick={() => onViewAll("landlords")}
            className="text-[10px] font-medium text-[#141414] underline-offset-2 hover:underline"
          >
            View all
          </button>
        </div>
        {tycoons.length === 0 ? (
          <p className="mt-2 text-[11px] leading-snug text-[#8a847e]">Biggest empires, ranked by loot on the map.</p>
        ) : (
          <ul className="mt-2 space-y-1">
            {tycoons.map((o, i) => {
              const active = highlightOwner === o.name;
              return (
                <li key={o.name} className={`flex items-center gap-2 rounded-xl px-1 py-1 ${active ? "bg-[#141414] text-white" : ""}`}>
                  <OwnerAvatar name={o.name} image={o.image} color={o.color} url={o.url} size={24} />
                  <span className="min-w-0 flex-1 truncate text-[11px]">
                    {i + 1}. <span className="font-medium">{o.name}</span>
                    {o.url ? (
                      <>
                        {" "}
                        <OwnerLink url={o.url} name={o.name} className={active ? "text-white" : "text-[#6b6560]"} />
                      </>
                    ) : null}
                    <span className={active ? "text-white/70" : "text-[#8a847e]"}>
                      {" "}
                      · {o.count} lot{o.count === 1 ? "" : "s"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectOwner(active ? null : o.name)}
                    className={`shrink-0 text-[10px] font-medium underline-offset-2 hover:underline ${active ? "text-white" : "text-[#141414]"}`}
                  >
                    {active ? "Hide lots" : "See lots"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-2.5 text-[9px] leading-snug text-[#8a847e]">
          Public NYC tax-lot sketches. Lines wander, lots merge, industrial tracts get lumpy. Not a survey, not a deed, not the City.
        </p>
      </div>
    </div>
  );
}
