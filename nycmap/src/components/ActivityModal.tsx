"use client";

import type { ReactNode } from "react";
import { useOwnership } from "@/lib/ownership";
import { formatMoney } from "@/lib/pricing";
import { OwnerAvatar, OwnerLink } from "@/components/OwnerMark";

export type ActivityTab = "mayors" | "tycoons" | "deeds";

interface Props {
  open: boolean;
  tab: ActivityTab;
  onTab: (tab: ActivityTab) => void;
  onClose: () => void;
  highlightOwner: string | null;
  onSelectOwner: (name: string | null) => void;
  online: number;
  visitors: number;
}

export default function ActivityModal({
  open,
  tab,
  onTab,
  onClose,
  highlightOwner,
  onSelectOwner,
  online,
  visitors,
}: Props) {
  const { ownedBlocks, getTopOwners, getMayors } = useOwnership();
  if (!open) return null;

  const recent = [...ownedBlocks].sort((a, b) => b.purchasedAt.localeCompare(a.purchasedAt)).slice(0, 20);
  const tycoons = getTopOwners();
  const mayors = Object.values(getMayors()).sort((a, b) => b.spent - a.spent || b.count - a.count);

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(92dvh,880px)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#e4e0d8] bg-white shadow-[0_24px_80px_rgba(20,20,20,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[#eeeae3] px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847e]">City activity</p>
            <h2 className="font-serif mt-1 text-3xl text-[#141414] sm:text-4xl">Who owns New York</h2>
            <p className="mt-1 max-w-xl text-[13px] leading-snug text-[#6b6560]">
              Mayors hold a neighborhood. Tycoons rank by total property value citywide. A claim is a billboard —
              tap a name, send them traffic.
            </p>
            <p className="mt-2 text-[12px] text-[#6b6560]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" /> {online} here now
              <span className="mx-1.5 text-[#cfc9c0]">·</span>
              {visitors.toLocaleString()} visitors casing the joint
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-[#8a847e] hover:bg-[#f6f4ef]" aria-label="Close">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-1 px-6 pt-4">
          <TabButton active={tab === "mayors"} onClick={() => onTab("mayors")}>
            Mayors
          </TabButton>
          <TabButton active={tab === "tycoons"} onClick={() => onTab("tycoons")}>
            Tycoons
          </TabButton>
          <TabButton active={tab === "deeds"} onClick={() => onTab("deeds")}>
            Fresh deeds
          </TabButton>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {tab === "mayors" ? (
            mayors.length === 0 ? (
              <Empty text="No mayors yet. Two lots in a quiet neighborhood and the seat is yours." />
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {mayors.map((m) => {
                  const active = highlightOwner === m.name;
                  return (
                    <li
                      key={m.neighborhoodId}
                      className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 ${
                        active ? "border-[#141414] bg-[#141414] text-white" : "border-[#eeeae3]"
                      }`}
                    >
                      <OwnerAvatar name={m.name} image={m.image} color={m.color} url={m.url} size={40} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium">{m.neighborhoodName}</p>
                        <p className="truncate text-[12px]">
                          {m.name}
                          {m.url ? (
                            <>
                              {" "}
                              <OwnerLink url={m.url} name={m.name} className={active ? "text-white" : "text-[#6b6560]"} />
                            </>
                          ) : null}
                        </p>
                        <p className={`text-[11px] ${active ? "text-white/70" : "text-[#8a847e]"}`}>
                          {m.count} lot{m.count === 1 ? "" : "s"} · {formatMoney(m.spent)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectOwner(active ? null : m.name)}
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                          active ? "bg-white text-[#141414]" : "bg-[#141414] text-white"
                        }`}
                      >
                        {active ? "Hide lots" : "See lots"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )
          ) : tab === "tycoons" ? (
            tycoons.length === 0 ? (
              <Empty text="No empires yet. Be the first tycoon the island regrets." />
            ) : (
              <ul className="grid gap-2 sm:grid-cols-2">
                {tycoons.map((o, i) => {
                  const active = highlightOwner === o.name;
                  return (
                    <li
                      key={o.name}
                      className={`flex items-center gap-3 rounded-2xl border px-3 py-2.5 ${
                        active ? "border-[#141414] bg-[#141414] text-white" : "border-[#eeeae3]"
                      }`}
                    >
                      <OwnerAvatar name={o.name} image={o.image} color={o.color} url={o.url} size={40} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium">
                          {i + 1}. {o.name}
                        </p>
                        {o.url ? (
                          <OwnerLink
                            url={o.url}
                            name={o.name}
                            className={`block truncate text-[12px] ${active ? "text-white" : "text-[#6b6560]"}`}
                          />
                        ) : null}
                        <p className={`text-[11px] ${active ? "text-white/70" : "text-[#8a847e]"}`}>
                          {o.count} lot{o.count === 1 ? "" : "s"} · {formatMoney(o.spent)} property value
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectOwner(active ? null : o.name)}
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                          active ? "bg-white text-[#141414]" : "bg-[#141414] text-white"
                        }`}
                      >
                        {active ? "Hide lots" : "See lots"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )
          ) : recent.length === 0 ? (
            <Empty text="The ink is still wet. Five lots, a flag, and you’re on this wall." />
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {recent.map((b) => (
                <li key={`${b.id}-${b.purchasedAt}`} className="flex items-center gap-3 rounded-2xl border border-[#eeeae3] px-3 py-2.5">
                  <OwnerAvatar name={b.ownerName} image={b.ownerImage} color={b.ownerColor} url={b.ownerUrl} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium text-[#141414]">{b.ownerName}</p>
                    {b.ownerUrl ? (
                      <OwnerLink url={b.ownerUrl} name={b.ownerName} className="block truncate text-[12px] text-[#6b6560]" />
                    ) : null}
                    <p className="truncate text-[11px] text-[#8a847e]">
                      {b.neighborhoodName} · {b.id}
                    </p>
                  </div>
                  <p className="font-serif shrink-0 text-[18px] text-[#141414]">{formatMoney(b.price)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="border-t border-[#eeeae3] px-6 py-3 text-[10px] leading-relaxed text-[#8a847e]">
          Lots are sketched from public NYC tax-block data. Lines can drift, lots get merged, the city keeps secrets.
          This is a game on a map — not a survey, not a deed, not affiliated with New York City.
        </p>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${
        active ? "bg-[#141414] text-white" : "bg-[#f6f4ef] text-[#5c574f] hover:bg-[#eeeae3]"
      }`}
    >
      {children}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="py-10 text-center text-[13px] text-[#8a847e]">{text}</p>;
}
