"use client";

import { useState } from "react";
import { useOwnership } from "@/lib/ownership";
import { formatMoney } from "@/lib/pricing";
import { hrefFor } from "@/lib/owner-display";
import { OwnerAvatar } from "@/components/OwnerMark";
import type { ActivityTab } from "@/components/ActivityModal";

interface Props {
  highlightOwner: string | null;
  onSelectOwner: (name: string | null) => void;
  onPreviewOwner: (name: string | null) => void;
  onViewAll: (tab: ActivityTab) => void;
}

export default function Leaderboard({ highlightOwner, onSelectOwner, onPreviewOwner, onViewAll }: Props) {
  const [open, setOpen] = useState(false);
  const { ownedBlocks, getTopOwners, getMayors } = useOwnership();
  const recent = [...ownedBlocks].sort((a, b) => b.purchasedAt.localeCompare(a.purchasedAt)).slice(0, 3);
  const tycoons = getTopOwners().slice(0, 3);
  const mayors = Object.values(getMayors())
    .sort((a, b) => b.spent - a.spent || b.count - a.count)
    .slice(0, 3);

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
            {mayors.length} mayor{mayors.length === 1 ? "" : "s"} · {tycoons.length} tycoon{tycoons.length === 1 ? "" : "s"}
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

        <div className="max-h-[min(46dvh,380px)] overflow-y-auto p-2.5 sm:max-h-none sm:p-3">
          <Section title="Mayors" hint="Most loot in the neighborhood." onViewAll={() => onViewAll("mayors")} />
          {mayors.length === 0 ? (
            <p className="mt-1.5 text-[10px] leading-snug text-[#8a847e]">Seats are open. Plant a flag.</p>
          ) : (
            <ul className="mt-1.5 space-y-0.5">
              {mayors.map((m) => {
                const active = highlightOwner === m.name;
                return (
                  <li
                    key={m.neighborhoodId}
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectOwner(active ? null : m.name)}
                    onMouseEnter={() => onPreviewOwner(m.name)}
                    onMouseLeave={() => onPreviewOwner(null)}
                    onFocus={() => onPreviewOwner(m.name)}
                    onBlur={() => onPreviewOwner(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectOwner(active ? null : m.name);
                      }
                    }}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-1 py-0.5 ${active ? "bg-[#141414] text-white" : "hover:bg-[#f6f4ef]"}`}
                  >
                    <OwnerAvatar name={m.name} image={m.image} color={m.color} url={m.url} size={22} />
                    <span className="min-w-0 flex-1 truncate text-[10px] sm:text-[11px]">
                      <span className="font-medium">{m.neighborhoodName}</span>
                      <span className={active ? "text-white/70" : "text-[#8a847e]"}> · </span>
                      <LedgerOwnerName name={m.name} url={m.url} active={active} />
                    </span>
                    <span className={`shrink-0 text-[9px] font-medium sm:text-[10px] ${active ? "text-white" : "text-[#141414]"}`}>
                      {formatMoney(m.spent)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-2.5">
            <Section title="Tycoons" hint="Ranked by property value." onViewAll={() => onViewAll("tycoons")} />
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
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectOwner(active ? null : o.name)}
                    onMouseEnter={() => onPreviewOwner(o.name)}
                    onMouseLeave={() => onPreviewOwner(null)}
                    onFocus={() => onPreviewOwner(o.name)}
                    onBlur={() => onPreviewOwner(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectOwner(active ? null : o.name);
                      }
                    }}
                    className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-1 py-0.5 ${active ? "bg-[#141414] text-white" : "hover:bg-[#f6f4ef]"}`}
                  >
                    <OwnerAvatar name={o.name} image={o.image} color={o.color} url={o.url} size={22} />
                    <span className="min-w-0 flex-1 truncate text-[10px] sm:text-[11px]">
                      {i + 1}. <LedgerOwnerName name={o.name} url={o.url} active={active} />
                    </span>
                    <span className={`shrink-0 text-[9px] font-medium sm:text-[10px] ${active ? "text-white" : "text-[#141414]"}`}>
                      {formatMoney(o.spent)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-2.5">
            <Section title="Fresh deeds" onViewAll={() => onViewAll("deeds")} />
          </div>
          {recent.length === 0 ? (
            <p className="mt-1.5 text-[10px] leading-snug text-[#8a847e]">Nobody’s planted a flag yet.</p>
          ) : (
            <ul className="mt-1.5 space-y-1">
              {recent.map((b) => (
                <li key={`${b.id}-${b.purchasedAt}`} className="flex items-center gap-1.5">
                  <OwnerAvatar name={b.ownerName} image={b.ownerImage} color={b.ownerColor} url={b.ownerUrl} size={20} />
                  <span className="min-w-0 flex-1 truncate text-[10px] text-[#141414] sm:text-[11px]">
                    <LedgerOwnerName name={b.ownerName} url={b.ownerUrl} />
                    <span className="text-[#8a847e]"> · {b.neighborhoodName}</span>
                  </span>
                  <span className="shrink-0 text-[10px] text-[#6b6560]">{formatMoney(b.price)}</span>
                </li>
              ))}
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

function LedgerOwnerName({
  name,
  url,
  active = false,
}: {
  name: string;
  url?: string;
  active?: boolean;
}) {
  const className = `font-medium underline-offset-2 ${active ? "text-white" : "text-[#141414]"}`;
  if (!url) return <span className={className}>{name}</span>;
  return (
    <a
      href={hrefFor(url)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`${className} underline hover:opacity-80`}
    >
      {name}
    </a>
  );
}

function Section({
  title,
  hint,
  onViewAll,
}: {
  title: string;
  hint?: string;
  onViewAll: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-[9px] uppercase tracking-[0.16em] text-[#8a847e]">{title}</p>
        {hint ? <p className="text-[10px] text-[#8a847e]">{hint}</p> : null}
      </div>
      <button
        type="button"
        onClick={onViewAll}
        className="text-[10px] font-medium text-[#141414] underline-offset-2 hover:underline"
      >
        View all
      </button>
    </div>
  );
}
