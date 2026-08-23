"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import Header from "@/components/Header";
import NeighborhoodRail from "@/components/NeighborhoodRail";
import BlockPanel from "@/components/BlockPanel";
import Leaderboard from "@/components/Leaderboard";
import HowItWorks from "@/components/HowItWorks";
import { OwnershipProvider } from "@/lib/ownership";
import { BlockProperties } from "@/types";
import { BOROUGHS, BoroughId } from "@/data/neighborhoods";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#f6f4ef]">
      <p className="font-serif text-lg text-[#8a847e]">Unrolling the city…</p>
    </div>
  ),
});

export default function Home() {
  const [borough, setBorough] = useState<BoroughId>("manhattan");
  const [selected, setSelected] = useState<BlockProperties | null>(null);
  const [flyTo, setFlyTo] = useState<[number, number, number] | null>(null);
  const [fitBounds, setFitBounds] = useState<[[number, number], [number, number]] | null>(null);
  const [how, setHow] = useState(false);

  const onSelectBlock = useCallback((props: BlockProperties) => {
    setSelected(props);
  }, []);

  const onSelectNeighborhood = useCallback((id: string, bounds: [[number, number], [number, number]]) => {
    setFitBounds(bounds);
    setTimeout(() => setFitBounds(null), 1200);
    void id;
  }, []);

  const onPickNeighborhood = useCallback((id: string, center: [number, number]) => {
    setFlyTo([center[0], center[1], 15]);
    setTimeout(() => setFlyTo(null), 1200);
    void id;
  }, []);

  const onBoroughChange = useCallback((id: BoroughId) => {
    setBorough(id);
    setSelected(null);
    const b = BOROUGHS.find((x) => x.id === id)!;
    setFlyTo([b.center[0], b.center[1], b.zoom]);
    setTimeout(() => setFlyTo(null), 1400);
  }, []);

  return (
    <OwnershipProvider>
      <div className="relative h-dvh w-full overflow-hidden bg-[#f6f4ef]">
        <div className="absolute inset-0">
          <Map
            borough={borough}
            selectedBlockId={selected?.id ?? null}
            onSelectBlock={onSelectBlock}
            onSelectNeighborhood={onSelectNeighborhood}
            flyTo={flyTo}
            fitBounds={fitBounds}
          />
        </div>
        <Header borough={borough} onBoroughChange={onBoroughChange} onHowItWorks={() => setHow(true)} />
        <BlockPanel block={selected} onClose={() => setSelected(null)} />
        <Leaderboard />
        <NeighborhoodRail borough={borough} onPick={onPickNeighborhood} />
        <HowItWorks open={how} onClose={() => setHow(false)} />
      </div>
    </OwnershipProvider>
  );
}
