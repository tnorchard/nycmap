"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import Header from "@/components/Header";
import NeighborhoodRail from "@/components/NeighborhoodRail";
import BlockPanel from "@/components/BlockPanel";
import BundleBar from "@/components/BundleBar";
import HowItWorks from "@/components/HowItWorks";
import Leaderboard from "@/components/Leaderboard";
import ActivityModal, { type ActivityTab } from "@/components/ActivityModal";
import PurchaseModal from "@/components/PurchaseModal";
import { OwnershipProvider, useOwnership } from "@/lib/ownership";
import { usePresence } from "@/lib/use-presence";
import { BlockProperties } from "@/types";
import { BOROUGHS, BoroughId } from "@/data/neighborhoods";
import { MAX_BUNDLE } from "@/lib/pricing";
import type { CameraCommand } from "@/lib/camera";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#f6f4ef]">
      <p className="font-serif text-lg text-[#8a847e]">Unrolling the city…</p>
    </div>
  ),
});

function HomeInner() {
  const { getBlockOwner } = useOwnership();
  const [borough, setBorough] = useState<BoroughId>("manhattan");
  const [group, setGroup] = useState<BlockProperties[]>([]);
  const [takeover, setTakeover] = useState<BlockProperties | null>(null);
  const [buyingGroup, setBuyingGroup] = useState(false);
  const [camera, setCamera] = useState<CameraCommand | null>(null);
  const [how, setHow] = useState(false);
  const [activity, setActivity] = useState(false);
  const [activityTab, setActivityTab] = useState<ActivityTab>("mayors");
  const [highlightOwner, setHighlightOwner] = useState<string | null>(null);
  const [highlightSeq, setHighlightSeq] = useState(0);
  const { online, visitors } = usePresence();
  const cameraId = useRef(0);
  const ignoreViewportUntil = useRef(0);

  const moveCamera = useCallback((next: Omit<CameraCommand, "id">) => {
    cameraId.current += 1;
    setCamera({ id: cameraId.current, ...next });
  }, []);

  const onSelectBlock = useCallback(
    (props: BlockProperties) => {
      if (getBlockOwner(props.id)) {
        setTakeover(props);
        return;
      }
      setTakeover(null);
      setGroup((prev) => {
        if (prev.some((l) => l.id === props.id)) {
          return prev.filter((l) => l.id !== props.id);
        }
        if (prev.length >= MAX_BUNDLE) return prev;
        return [...prev, props];
      });
    },
    [getBlockOwner]
  );

  const onSelectNeighborhood = useCallback(
    (id: string, bounds: [[number, number], [number, number]]) => {
      ignoreViewportUntil.current = Date.now() + 1000;
      moveCamera({ mode: "fit", bounds });
      void id;
    },
    [moveCamera]
  );

  const onPickNeighborhood = useCallback(
    (id: string, center: [number, number]) => {
      ignoreViewportUntil.current = Date.now() + 1000;
      moveCamera({ mode: "fly", center, zoom: 15 });
      void id;
    },
    [moveCamera]
  );

  const onBoroughChange = useCallback(
    (id: BoroughId) => {
      ignoreViewportUntil.current = Date.now() + 1000;
      setBorough(id);
      setTakeover(null);
      setHighlightOwner(null);
      const b = BOROUGHS.find((x) => x.id === id)!;
      moveCamera({ mode: "fly", center: b.center, zoom: b.zoom });
    },
    [moveCamera]
  );

  const onBoroughInView = useCallback((id: BoroughId, opts?: { force?: boolean }) => {
    if (!opts?.force && Date.now() < ignoreViewportUntil.current) return;
    setBorough((cur) => (cur === id ? cur : id));
  }, []);

  const revealOwner = useCallback((name: string | null) => {
    ignoreViewportUntil.current = Date.now() + 2500;
    setHighlightOwner(name);
    if (name) {
      setHighlightSeq((n) => n + 1);
      setActivity(false);
    }
  }, []);

  const selectedIds = [...group.map((l) => l.id), ...(takeover ? [takeover.id] : [])];

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#f6f4ef]">
      <div className="absolute inset-0">
        <Map
          borough={borough}
          selectedIds={selectedIds}
          highlightOwner={highlightOwner}
          highlightSeq={highlightSeq}
          onSelectBlock={onSelectBlock}
          onSelectNeighborhood={onSelectNeighborhood}
          onBoroughInView={onBoroughInView}
          onClearHighlight={() => setHighlightOwner(null)}
          camera={camera}
        />
      </div>
      <Header
        borough={borough}
        onBoroughChange={onBoroughChange}
        onHowItWorks={() => setHow(true)}
        onActivity={() => setActivity(true)}
        online={online}
        visitors={visitors}
      />
      <BlockPanel block={takeover} onClose={() => setTakeover(null)} />
      <BundleBar
        lots={group}
        onRemove={(id) => setGroup((prev) => prev.filter((l) => l.id !== id))}
        onClear={() => setGroup([])}
        onCheckout={() => setBuyingGroup(true)}
      />
      <Leaderboard
        highlightOwner={highlightOwner}
        onSelectOwner={revealOwner}
        onViewAll={(tab) => {
          setActivityTab(tab);
          setActivity(true);
        }}
      />
      <NeighborhoodRail borough={borough} onPick={onPickNeighborhood} />
      <HowItWorks open={how} onClose={() => setHow(false)} />
      <ActivityModal
        open={activity}
        tab={activityTab}
        onTab={setActivityTab}
        onClose={() => setActivity(false)}
        highlightOwner={highlightOwner}
        onSelectOwner={revealOwner}
        online={online}
        visitors={visitors}
      />
      {buyingGroup && group.length > 0 && (
        <PurchaseModal lots={group} onClose={() => setBuyingGroup(false)} />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <OwnershipProvider>
      <HomeInner />
    </OwnershipProvider>
  );
}
