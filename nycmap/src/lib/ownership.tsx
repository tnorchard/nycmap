"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { OwnedBlock } from "@/types";

interface OwnershipContextType {
  ownedBlocks: OwnedBlock[];
  purchaseBlock: (block: OwnedBlock) => void;
  refreshClaims: () => Promise<void>;
  getBlockOwner: (blockId: string) => OwnedBlock | undefined;
  getBlocksForNeighborhood: (neighborhoodId: string) => OwnedBlock[];
  getTotalRevenue: () => number;
  getTopOwners: () => { name: string; count: number; spent: number }[];
}

const OwnershipContext = createContext<OwnershipContextType | null>(null);
const STORAGE_KEY = "nycmap-v2";

function load(): OwnedBlock[] {
  if (typeof window === "undefined") return [];
  try {
    const d = localStorage.getItem(STORAGE_KEY);
    return d ? JSON.parse(d) : [];
  } catch {
    return [];
  }
}

function save(blocks: OwnedBlock[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
}

export function OwnershipProvider({ children }: { children: React.ReactNode }) {
  const [ownedBlocks, setOwnedBlocks] = useState<OwnedBlock[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refreshClaims = useCallback(async () => {
    try {
      const res = await fetch("/api/claims", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { claims?: OwnedBlock[] };
      if (Array.isArray(data.claims)) {
        setOwnedBlocks(data.claims);
        save(data.claims);
      }
    } catch {
      /* keep cached claims */
    }
  }, []);

  useEffect(() => {
    setOwnedBlocks(load());
    setLoaded(true);
    void refreshClaims();
  }, [refreshClaims]);

  const purchaseBlock = useCallback((block: OwnedBlock) => {
    setOwnedBlocks((prev) => {
      const updated = [...prev.filter((b) => b.id !== block.id), block];
      save(updated);
      return updated;
    });
  }, []);

  const getBlockOwner = useCallback(
    (blockId: string) => ownedBlocks.find((b) => b.id === blockId),
    [ownedBlocks]
  );

  const getBlocksForNeighborhood = useCallback(
    (neighborhoodId: string) => ownedBlocks.filter((b) => b.neighborhoodId === neighborhoodId),
    [ownedBlocks]
  );

  const getTotalRevenue = useCallback(
    () => ownedBlocks.reduce((sum, b) => sum + b.price, 0),
    [ownedBlocks]
  );

  const getTopOwners = useCallback(() => {
    const map = new Map<string, { name: string; count: number; spent: number }>();
    ownedBlocks.forEach((b) => {
      const e = map.get(b.ownerName);
      if (e) {
        e.count++;
        e.spent += b.price;
      } else {
        map.set(b.ownerName, { name: b.ownerName, count: 1, spent: b.price });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.spent - a.spent).slice(0, 10);
  }, [ownedBlocks]);

  return (
    <OwnershipContext.Provider
      value={{
        ownedBlocks,
        purchaseBlock,
        refreshClaims,
        getBlockOwner,
        getBlocksForNeighborhood,
        getTotalRevenue,
        getTopOwners,
      }}
    >
      {children}
    </OwnershipContext.Provider>
  );
}

export function useOwnership() {
  const ctx = useContext(OwnershipContext);
  if (!ctx) throw new Error("useOwnership must be used within OwnershipProvider");
  return ctx;
}
