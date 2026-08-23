"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useOwnership } from "@/lib/ownership";
import { BlockProperties } from "@/types";
import { formatMoney, LOT_PRICE } from "@/lib/pricing";
import { BOROUGHS, BoroughId } from "@/data/neighborhoods";
import type { CameraCommand } from "@/lib/camera";

export type { CameraCommand };

type Geom = { type: string; coordinates: unknown };

type BlockFC = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: BlockProperties;
    geometry: Geom;
  }>;
};

type NtaFC = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: {
      id: string;
      name: string;
      price: number;
      blocks: number;
      type: string;
      boro: string;
    };
    geometry: Geom;
  }>;
};

type LatLngBoundsLiteral = [[number, number], [number, number]];

interface HoverInfo {
  name: string;
  block: number;
  part: number;
  price: number;
  owned: boolean;
  owner?: string;
  x: number;
  y: number;
}

interface MapProps {
  borough: BoroughId;
  selectedIds: string[];
  highlightOwner: string | null;
  highlightSeq: number;
  onSelectBlock: (props: BlockProperties) => void;
  onSelectNeighborhood: (id: string, bounds: LatLngBoundsLiteral) => void;
  onBoroughInView: (id: BoroughId, opts?: { force?: boolean }) => void;
  onClearHighlight: () => void;
  camera: CameraCommand | null;
}

function Camera({ command }: { command: CameraCommand | null }) {
  const map = useMap();
  const seen = useRef<number | null>(null);

  useEffect(() => {
    if (!command || seen.current === command.id) return;
    seen.current = command.id;
    map.stop();
    if (command.mode === "fly" && command.center && command.zoom != null) {
      map.setView(command.center, command.zoom, { animate: true, duration: 0.7 });
      return;
    }
    if (command.mode === "fit" && command.bounds) {
      map.fitBounds(command.bounds, { padding: [56, 56], maxZoom: 15, animate: true, duration: 0.7 });
    }
  }, [map, command]);

  return null;
}

function FocusOwner({
  owner,
  seq,
  blocks,
  getBlockOwner,
  onBorough,
}: {
  owner: string | null;
  seq: number;
  blocks: BlockFC | null;
  getBlockOwner: (id: string) => { ownerName: string } | undefined;
  onBorough: (id: BoroughId, opts?: { force?: boolean }) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!owner || !blocks) return;
    const owned = blocks.features.filter((f) => getBlockOwner(f.properties.id)?.ownerName === owner);
    if (owned.length === 0) return;

    const tally = new globalThis.Map<string, number>();
    for (const f of owned) {
      const boro = f.properties.boro;
      tally.set(boro, (tally.get(boro) || 0) + 1);
    }
    let bestBoro = owned[0].properties.boro;
    let bestN = 0;
    for (const [boro, n] of tally) {
      if (n > bestN) {
        bestN = n;
        bestBoro = boro;
      }
    }
    if (BOROUGHS.some((b) => b.id === bestBoro)) {
      onBorough(bestBoro as BoroughId, { force: true });
    }

    const layer = L.geoJSON({ type: "FeatureCollection", features: owned } as never);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [72, 72], maxZoom: 16, animate: true, duration: 0.8 });
    }
  }, [owner, seq, blocks, getBlockOwner, map, onBorough]);

  return null;
}

function ViewportBorough({ onBorough }: { onBorough: (id: BoroughId, opts?: { force?: boolean }) => void }) {
  const map = useMap();

  useEffect(() => {
    const nearest = () => {
      const bounds = map.getBounds();
      const inView = BOROUGHS.filter((b) => bounds.contains(L.latLng(b.center[0], b.center[1])));
      const pool = inView.length > 0 ? inView : BOROUGHS;
      const c = map.getCenter();
      let best: BoroughId = pool[0].id;
      let bestD = Infinity;
      for (const b of pool) {
        const d = (c.lat - b.center[0]) ** 2 + (c.lng - b.center[1]) ** 2;
        if (d < bestD) {
          bestD = d;
          best = b.id;
        }
      }
      onBorough(best);
    };
    nearest();
    map.on("moveend", nearest);
    return () => {
      map.off("moveend", nearest);
    };
  }, [map, onBorough]);

  return null;
}

function ZoomTracker({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMapEvents({ zoomend: () => onZoom(map.getZoom()) });
  useEffect(() => {
    onZoom(map.getZoom());
  }, [map, onZoom]);
  return null;
}

function LabelsOverlay() {
  const map = useMap();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!map.getPane("labels")) {
      const pane = map.createPane("labels");
      pane.style.zIndex = "650";
      pane.style.pointerEvents = "none";
    }
    setReady(true);
  }, [map]);

  if (!ready) return null;

  return (
    <TileLayer
      url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
      pane="labels"
      attribution=""
    />
  );
}

function priceFill(price: number) {
  const t = Math.min(1, Math.max(0, (price - 6) / 94));
  const l = 92 - t * 28;
  return `hsl(35 12% ${l}%)`;
}

export default function Map({
  borough,
  selectedIds,
  highlightOwner,
  highlightSeq,
  onSelectBlock,
  onSelectNeighborhood,
  onBoroughInView,
  onClearHighlight,
  camera,
}: MapProps) {
  const [blocks, setBlocks] = useState<BlockFC | null>(null);
  const [ntas, setNtas] = useState<NtaFC | null>(null);
  const [zoom, setZoom] = useState(12);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [loadingBlocks, setLoadingBlocks] = useState(true);
  const blockRef = useRef<L.GeoJSON | null>(null);
  const ntaRef = useRef<L.GeoJSON | null>(null);
  const selectedRef = useRef<string[]>(selectedIds);
  const highlightRef = useRef<string | null>(highlightOwner);
  const { ownedBlocks, getBlockOwner, getBlocksForNeighborhood } = useOwnership();
  const showBlocks = zoom >= 14;
  const visibleBlocks = (() => {
    if (!blocks) return null;
    const ownerLots = highlightOwner
      ? blocks.features.filter((f) => getBlockOwner(f.properties.id)?.ownerName === highlightOwner)
      : [];
    if (!showBlocks && ownerLots.length === 0) return null;
    const seen = new Set(ownerLots.map((f) => f.properties.id));
    const rest = showBlocks
      ? blocks.features.filter((f) => f.properties.boro === borough && !seen.has(f.properties.id))
      : [];
    const features = [...ownerLots, ...rest];
    if (features.length === 0) return null;
    return { type: "FeatureCollection" as const, features };
  })();

  selectedRef.current = selectedIds;
  highlightRef.current = highlightOwner;

  useEffect(() => {
    fetch("/data/nyc-neighborhoods.geojson")
      .then((r) => r.json() as Promise<NtaFC>)
      .then(setNtas);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingBlocks(true);
    Promise.all(
      BOROUGHS.map((b) => fetch(`/data/${b.id}-blocks.geojson`).then((r) => r.json() as Promise<BlockFC>))
    )
      .then((collections) => {
        if (cancelled) return;
        setBlocks({ type: "FeatureCollection", features: collections.flatMap((c) => c.features) });
        setLoadingBlocks(false);
      })
      .catch(() => {
        if (!cancelled) setLoadingBlocks(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const ntaStyle = useCallback(
    (feature?: { properties?: { id: string; price: number; type: string; boro: string } }) => {
      if (!feature?.properties) return {};
      const owned = getBlocksForNeighborhood(feature.properties.id).length;
      const isPark = feature.properties.type === "park";
      const dim = feature.properties.boro !== borough;
      return {
        fillColor: isPark ? "#e7efe4" : priceFill(feature.properties.price),
        fillOpacity: dim ? 0.08 : showBlocks ? 0.04 : owned > 0 ? 0.58 : 0.42,
        color: dim ? "#cfc9c0" : "#1a1a1a",
        weight: dim ? 0.4 : showBlocks ? 0.7 : 1.1,
        opacity: dim ? 0.4 : 0.9,
        interactive: !showBlocks,
      };
    },
    [borough, getBlocksForNeighborhood, showBlocks]
  );

  const paintBlock = useCallback(
    (id: string) => {
      const owner = getBlockOwner(id);
      const selected = selectedRef.current.includes(id);
      const focused = !!highlightRef.current && owner?.ownerName === highlightRef.current;
      const dimmed = !!highlightRef.current && !focused;
      if (owner) {
        return {
          fillColor: owner.ownerColor || "#1a1a1a",
          fillOpacity: dimmed ? 0.08 : selected || focused ? 0.9 : 0.74,
          color: selected || focused ? "#111" : "#ffffff",
          weight: selected || focused ? 2.6 : 0.8,
          opacity: dimmed ? 0.2 : 1,
        };
      }
      return {
        fillColor: selected ? "#0a0a0a" : "#ffffff",
        fillOpacity: dimmed ? 0.03 : selected ? 0.82 : 0.12,
        color: selected ? "#ffffff" : "#2a2a2a",
        weight: selected ? 3.2 : 0.6,
        opacity: dimmed ? 0.12 : selected ? 1 : 0.5,
      };
    },
    [getBlockOwner]
  );

  const onEachNta = useCallback(
    (feature: { properties?: { id: string; boro: string } }, layer: L.Layer) => {
      const p = feature.properties;
      if (!p) return;
      layer.on({
        click: (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          if (p.boro) onBoroughInView(p.boro as BoroughId, { force: true });
          const b = (layer as L.Polygon).getBounds();
          onSelectNeighborhood(p.id, [
            [b.getSouth(), b.getWest()],
            [b.getNorth(), b.getEast()],
          ]);
        },
        mouseover: (e: L.LeafletMouseEvent) => {
          if (showBlocks) return;
          e.target.setStyle({ weight: 2.2, fillOpacity: 0.64 });
          e.target.bringToFront();
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          ntaRef.current?.resetStyle(e.target);
        },
      });
    },
    [onBoroughInView, onSelectNeighborhood, showBlocks]
  );

  const onSelectBlockRef = useRef(onSelectBlock);
  onSelectBlockRef.current = onSelectBlock;

  const onEachBlock = useCallback(
    (feature: { properties?: BlockProperties }, layer: L.Layer) => {
      const p = feature.properties;
      if (!p) return;
      layer.on({
        click: (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          const already = selectedRef.current.includes(p.id);
          selectedRef.current = already
            ? selectedRef.current.filter((id) => id !== p.id)
            : [...selectedRef.current, p.id];
          (e.target as L.Path).setStyle(paintBlock(p.id));
          onSelectBlockRef.current(p);
        },
        mouseover: (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          const owner = getBlockOwner(p.id);
          const selected = selectedRef.current.includes(p.id);
          const target = e.target as L.Path;
          if (!selected) {
            target.setStyle({ weight: 1.8, fillOpacity: owner ? 0.92 : 0.32, color: "#111" });
          }
          setHover({
            name: p.neighborhood,
            block: p.block,
            part: p.part,
            price: owner?.price ?? LOT_PRICE,
            owned: !!owner,
            owner: owner?.ownerName,
            x: e.containerPoint.x,
            y: e.containerPoint.y,
          });
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          (e.target as L.Path).setStyle(paintBlock(p.id));
          setHover(null);
        },
      });
    },
    [getBlockOwner, paintBlock]
  );

  useEffect(() => {
    blockRef.current?.eachLayer((layer) => {
      const feat = (layer as L.Layer & { feature?: { properties?: BlockProperties } }).feature;
      if (feat?.properties) {
        (layer as L.Path).setStyle(paintBlock(feat.properties.id));
      }
    });
  }, [paintBlock, ownedBlocks, selectedIds, highlightOwner]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[40.7128, -74.006]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        zoomControl
        minZoom={10}
        maxZoom={18}
      >
        <TileLayer
          attribution="&copy; OSM · CARTO · NYC DCP / DOF"
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <LabelsOverlay />
        <ZoomTracker onZoom={setZoom} />
        <Camera command={camera} />
        <ViewportBorough onBorough={onBoroughInView} />
        <FocusOwner
          owner={highlightOwner}
          seq={highlightSeq}
          blocks={blocks}
          getBlockOwner={getBlockOwner}
          onBorough={onBoroughInView}
        />

        {ntas && (
          <GeoJSON
            ref={(r) => {
              ntaRef.current = r;
            }}
            data={ntas as never}
            style={ntaStyle}
            onEachFeature={onEachNta}
            key={`nta-${showBlocks ? "z" : "o"}`}
          />
        )}

        {visibleBlocks && (
          <GeoJSON
            ref={(r) => {
              blockRef.current = r;
            }}
            data={visibleBlocks as never}
            style={(feature) => paintBlock(feature?.properties?.id ?? "")}
            onEachFeature={onEachBlock}
            key={`blocks-${borough}-${highlightOwner ?? "none"}-${showBlocks ? "z" : "h"}`}
          />
        )}
      </MapContainer>

      {hover && showBlocks && (
        <div
          className="pointer-events-none absolute z-[500] rounded-lg border border-[#e4e0d8] bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm"
          style={{ left: Math.min(hover.x + 14, 280), top: hover.y + 14 }}
        >
          <p className="text-[11px] font-medium tracking-wide text-[#141414]">{hover.name}</p>
          <p className="text-[10px] text-[#6b6560]">
            Block {hover.block}
            {hover.part > 1 ? ` · lot ${hover.part}` : ""}
            {hover.owned ? ` · ${hover.owner}` : ` · ${formatMoney(hover.price)}`}
          </p>
        </div>
      )}

      {highlightOwner && (
        <div className="absolute left-1/2 top-24 z-[500] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#141414] bg-white px-3 py-1.5 text-[11px] text-[#141414] shadow-sm">
          <span>Touring {highlightOwner}&apos;s empire</span>
          <button
            type="button"
            onClick={onClearHighlight}
            className="rounded-full bg-[#141414] px-2 py-0.5 text-[10px] font-medium text-white"
          >
            Clear
          </button>
        </div>
      )}

      {loadingBlocks && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[500] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e4e0d8] bg-white/90 px-3.5 py-1.5 text-[11px] text-[#6b6560] shadow-sm backdrop-blur">
          Loading lots…
        </div>
      )}

      {!showBlocks && !loadingBlocks && (
        <div className="pointer-events-none absolute bottom-28 left-1/2 z-[500] -translate-x-1/2 rounded-full border border-[#e4e0d8] bg-white/90 px-3.5 py-1.5 text-[11px] text-[#6b6560] shadow-sm backdrop-blur">
          Zoom in, then tap lots to group them. Five unclaimed lots to claim.
        </div>
      )}
    </div>
  );
}
