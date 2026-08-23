"use client";

import { NEIGHBORHOODS } from "@/data/neighborhoods";
import { BoroughId } from "@/data/neighborhoods";
import { useOwnership } from "@/lib/ownership";
import { displayHost } from "@/lib/owner-display";

interface Props {
  borough: BoroughId;
  onPick: (id: string, center: [number, number]) => void;
}

export default function NeighborhoodRail({ borough, onPick }: Props) {
  const { getMayors } = useOwnership();
  const mayors = getMayors();
  const list = NEIGHBORHOODS.filter((n) => n.boroughId === borough && n.type === "neighborhood");

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1000] p-3 sm:p-4">
      <div className="pointer-events-auto mx-auto max-w-[1400px]">
        <div className="no-scrollbar flex gap-2 overflow-x-auto rounded-2xl border border-[#e4e0d8] bg-white/90 p-2 shadow-sm backdrop-blur-md">
          {list.map((n) => {
            const mayor = mayors[n.id];
            return (
              <button
                key={n.id}
                onClick={() => onPick(n.id, n.center)}
                className="shrink-0 rounded-xl px-3 py-2 text-left transition hover:bg-[#f6f4ef]"
              >
                <p className="text-[12px] font-medium text-[#141414]">{n.name}</p>
                {mayor ? (
                  <p className="text-[10px] text-[#6b6560]">
                    Mayor {mayor.url ? displayHost(mayor.url) : mayor.name}
                    <span className="text-[#8a847e]"> · {mayor.count} lot{mayor.count === 1 ? "" : "s"}</span>
                  </p>
                ) : (
                  <p className="text-[10px] text-[#8a847e]">{n.blockCount} lots · seat open</p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
