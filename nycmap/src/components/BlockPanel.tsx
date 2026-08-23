"use client";

import { useState } from "react";
import { BlockProperties } from "@/types";
import { useOwnership } from "@/lib/ownership";
import { formatMoney, minOutbid } from "@/lib/pricing";
import PurchaseModal from "./PurchaseModal";

interface Props {
  block: BlockProperties | null;
  onClose: () => void;
}

export default function BlockPanel({ block, onClose }: Props) {
  const [buying, setBuying] = useState(false);
  const { getBlockOwner, getBlocksForNeighborhood } = useOwnership();

  if (!block) return null;

  const owner = getBlockOwner(block.id);
  const claimedInHood = getBlocksForNeighborhood(block.neighborhoodId).length;
  const nextPrice = owner ? minOutbid(owner.price) : block.price;

  return (
    <>
      <aside className="claim-sheet absolute right-3 top-20 z-[1100] w-[min(100%-24px,360px)] overflow-hidden rounded-3xl border border-[#e4e0d8] bg-white/95 shadow-xl backdrop-blur-md sm:right-4">
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#8a847e]">
              {block.neighborhood}
            </p>
            <h2 className="font-serif mt-1 text-2xl leading-none text-[#141414]">
              Block {block.block}
            </h2>
            <p className="mt-2 text-[11px] text-[#8a847e]">
              {claimedInHood} claimed here · {block.borough} tax block {block.boro}-{block.block}
              {block.part > 1 ? ` lot ${block.part}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-[#8a847e] transition hover:bg-[#f6f4ef] hover:text-[#141414]"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4">
          {owner ? (
            <div className="rounded-2xl border border-[#e4e0d8] bg-[#f6f4ef] p-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#8a847e]">Held by</p>
              <div className="mt-2 flex items-center gap-3">
                <Mark ownerName={owner.ownerName} color={owner.ownerColor} image={owner.ownerImage} />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-medium text-[#141414]">{owner.ownerName}</p>
                  <a
                    href={owner.ownerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-[12px] text-[#6b6560] underline-offset-2 hover:underline"
                  >
                    {owner.ownerUrl.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              </div>
              <p className="mt-3 text-[12px] text-[#6b6560]">
                Paid {formatMoney(owner.price)} · steal it for {formatMoney(nextPrice)}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e4e0d8] bg-[#f6f4ef] p-4">
              <p className="text-[13px] text-[#5c574f]">Unclaimed. Starting price is set by the neighborhood.</p>
              <p className="font-serif mt-2 text-3xl text-[#141414]">{formatMoney(block.price)}</p>
            </div>
          )}

          <button
            onClick={() => setBuying(true)}
            className="mt-4 w-full rounded-2xl bg-[#141414] py-3 text-[13px] font-medium text-white transition hover:bg-black"
          >
            {owner ? `Take this block · ${formatMoney(nextPrice)}` : `Claim this block · ${formatMoney(block.price)}`}
          </button>
        </div>
      </aside>

      {buying && (
        <PurchaseModal block={block} owner={owner} onClose={() => setBuying(false)} />
      )}
    </>
  );
}

function Mark({ ownerName, color, image }: { ownerName: string; color: string; image: string }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={image} alt="" className="h-10 w-10 rounded-xl object-cover" />
    );
  }
  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-xl text-[13px] font-medium text-white"
      style={{ background: color || "#141414" }}
    >
      {ownerName.slice(0, 1).toUpperCase()}
    </div>
  );
}
