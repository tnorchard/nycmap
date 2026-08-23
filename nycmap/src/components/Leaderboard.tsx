"use client";

import { useState } from "react";
import { useOwnership } from "@/lib/ownership";
import { formatMoney } from "@/lib/pricing";
import { OwnerAvatar, OwnerLink } from "@/components/OwnerMark";

interface Props {
  highlightOwner: string | null;
  onSelectOwner: (name: string | null) => void;
  onViewAll: (tab: "deeds" | "landlords") => void;
}

export default function Leaderboard({ highlightOwner, onSelectOwner, onViewAll }: Props) {
  const [open, setOpen] = useState(false);
  const { ownedBlocks, getTopOwners } = useOwnership();
  const recent = [...ownedBlocks].sort((a, b) => b.purchasedAt.localeCompare(a.purchasedAt)).slice(0, 3);
  const tycoons = getTopOwners().slice(0, 3);

  return (
    <div className="pointer-events-none absolute bottom-24 left-3 z-[1000] sm:bottom-28 sm:left-4">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-[#e4e0d8] bg-white px-3 py-2 text-left shadow-sm sm:hidden"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a847e]">Ledger</span>
          <span className="text-[11px] text-[#141414]">
            {recent.length} deed{recent.length === 1 ? "" : "s"} · {tycoons.length} tycoon{tycoons.length === 1 ? "" : "s"}
          </span>
        </button>
      ) : null}

      <div
        className={`pointer-events-auto w-[min(260px,calc(100vw-1.5rem))] rounded-2xl border border-[#e4e0d8] bg-white shadow-sm sm:w-[min(280px,calc(100vw-1.5rem))] ${
          open ? "block" : "hidden sm:block"
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-[#eeeae3] px-3 py-2 sm:hidden">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#8a847e]">Ledger</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full px-2 py-0.5 text-[10px] font-medium text-[#141414]"
          >
            Close
          </button>
        </div>

        <div className="max-h-[min(42dvh,320px)] overflow-y-auto p-2.5 sm:max-h-none sm:p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] uppercase tracking-[0.16em] text-[#8a847e]">Fresh deeds</p>
            <button
              type="button"
              onClick={() => onViewAll("deeds")}
              className="text-[10px] font-medium text-[#141414] underline-offset-2 hover:underline"
            >
              View all
            </button>
          </div>
          {recent.length === 0 ? (
            <p className="mt-1.5 text-[10px] leading-snug text-[#8a847e]">Nobody’s planted a flag yet.</p>
          ) : (
            <ul className="mt-1.5 space-y-1">
              {recent.map((b) => (
                <li key={`${b.id}-${b.purchasedAt}`} className="flex items-center gap-1.5">
                  <OwnerAvatar name={b.ownerName} image={b.ownerImage} color={b.ownerColor} url={b.ownerUrl} size={20} />
                  <span className="min-w-0 flex-1 truncate text-[10px] text-[#141414] sm:text-[11px]">
                    <span className="font-medium">{b.ownerName}</span>
                    {b.ownerUrl ? (
                      <>
                        {" "}
                        <OwnerLink url={b.ownerUrl} name={b.ownerName} className="text-[#6b6560]" />
                      </>
                    ) : null}
                    <span className="text-[#8a847e]"> · {b.neighborhoodName}</span>
                  </span>
                  <span className="shrink-0 text-[10px] text-[#6b6560]">{formatMoney(b.price)}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] text-[#8a847e]">Tycoons</p>
              <p className="text-[10px] text-[#8a847e]">Ranked by property value.</p>
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
            <p className="mt-1.5 text-[10px] leading-snug text-[#8a847e]">Biggest empires on the map.</p>
          ) : (
            <ul className="mt-1.5 space-y-0.5">
              {tycoons.map((o, i) => {
                const active = highlightOwner === o.name;
                return (
                  <li
                    key={o.name}
                    className={`flex items-center gap-1.5 rounded-lg px-1 py-0.5 ${active ? "bg-[#141414] text-white" : ""}`}
                  >
                    <OwnerAvatar name={o.name} image={o.image} color={o.color} url={o.url} size={22} />
                    <span className="min-w-0 flex-1 truncate text-[10px] sm:text-[11px]">
                      {i + 1}. <span className="font-medium">{o.name}</span>
                      {o.url ? (
                        <>
                          {" "}
                          <OwnerLink url={o.url} name={o.name} className={active ? "text-white" : "text-[#6b6560]"} />
                        </>
                      ) : null}
                      <span className={active ? "text-white/70" : "text-[#8a847e]"}>
                        {" "}
                        · {formatMoney(o.spent)}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectOwner(active ? null : o.name)}
                      className={`shrink-0 text-[9px] font-medium underline-offset-2 hover:underline sm:text-[10px] ${active ? "text-white" : "text-[#141414]"}`}
                    >
                      {active ? "Hide" : "See lots"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-2 text-[8px] leading-snug text-[#8a847e] sm:text-[9px]">
            Public NYC tax-lot sketches. Not a survey, not a deed, not the City.
          </p>
        </div>
      </div>
    </div>
  );
}
