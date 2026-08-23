"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GeoJSON, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useOwnership } from "@/lib/ownership";
import { BlockProperties } from "@/types";
import { formatMoney, LOT_PRICE } from "@/lib/pricing";
import { BOROUGHS, BoroughId } from "@/data/neighborhoods";
import { displayHost } from "@/lib/owner-display";
import type { NeighborhoodMayor } from "@/lib/ownership";
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

function ViewBounds({ onBounds }: { onBounds: (bounds: L.LatLngBounds) => void }) {
  const map = useMap();
  useEffect(() => {
    const fire = () => onBounds(map.getBounds());
    fire();
    map.on("moveend zoomend", fire);
    return () => {
      map.off("moveend zoomend", fire);
    };
  }, [map, onBounds]);
  return null;
}

function HoodBorders({ ntas }: { ntas: NtaFC | null }) {
  const map = useMap();
  useEffect(() => {
    if (!map.getPane("hood-borders")) {
      const pane = map.createPane("hood-borders");
      pane.style.zIndex = "450";
      pane.style.pointerEvents = "none";
    }
  }, [map]);
  if (!ntas) return null;
  return (
    <GeoJSON
      data={ntas as never}
      interactive={false}
      style={{
        fill: false,
        fillOpacity: 0,
        color: "#141414",
        weight: 2.4,
        opacity: 0.95,
        pane: "hood-borders",
      }}
    />
  );
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


function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch] ?? ch));
}

function largestRing(geom: Geom): number[][] | null {
  if (geom.type === "Polygon") {
    return (geom.coordinates as number[][][])[0] ?? null;
  }
  if (geom.type !== "MultiPolygon") return null;
  const polys = geom.coordinates as number[][][][];
  let best: number[][] | null = null;
  let bestN = 0;
  for (const poly of polys) {
    const ring = poly[0];
    if (ring && ring.length > bestN) {
      best = ring;
      bestN = ring.length;
    }
  }
  return best;
}

function pointInRing(lat: number, lng: number, ring: number[][]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x0, y0] = ring[j];
    const [x1, y1] = ring[i];
    const crosses = y0 > lat !== y1 > lat && lng < ((x1 - x0) * (lat - y0)) / (y1 - y0) + x0;
    if (crosses) inside = !inside;
  }
  return inside;
}

function ringCentroid(ring: number[][]): [number, number] | null {
  if (ring.length < 3) return null;
  let twiceArea = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [x0, y0] = ring[j];
    const [x1, y1] = ring[i];
    const f = x0 * y1 - x1 * y0;
    twiceArea += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  }
  if (Math.abs(twiceArea) < 1e-12) {
    const n = ring.length;
    return [ring.reduce((s, p) => s + p[1], 0) / n, ring.reduce((s, p) => s + p[0], 0) / n];
  }
  return [cy / (3 * twiceArea), cx / (3 * twiceArea)];
}

function visibleAnchor(ring: number[][], map: L.Map): [number, number] | null {
  const view = map.getBounds();
  const pad = view.pad(-0.12);
  const focus = pad.getCenter();
  if (pointInRing(focus.lat, focus.lng, ring)) return [focus.lat, focus.lng];

  const visible: number[][] = [];
  for (const [lng, lat] of ring) {
    if (pad.contains(L.latLng(lat, lng))) visible.push([lng, lat]);
  }
  if (visible.length >= 3) return ringCentroid(visible);
  if (visible.length > 0) {
    return [
      visible.reduce((s, pt) => s + pt[1], 0) / visible.length,
      visible.reduce((s, pt) => s + pt[0], 0) / visible.length,
    ];
  }

  const box = L.latLngBounds(ring.map(([lng, lat]) => L.latLng(lat, lng)));
  if (!box.intersects(view)) return null;
  if (pointInRing(view.getCenter().lat, view.getCenter().lng, ring)) {
    return [view.getCenter().lat, view.getCenter().lng];
  }
  return ringCentroid(ring);
}

function NeighborhoodLabels({
  ntas,
  borough,
  mayors,
}: {
  ntas: NtaFC | null;
  borough: BoroughId;
  mayors: Record<string, NeighborhoodMayor>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map.getPane("hood-labels")) {
      const pane = map.createPane("hood-labels");
      pane.style.zIndex = "655";
      pane.style.pointerEvents = "none";
    }

    const group = L.layerGroup().addTo(map);
    const draw = () => {
      group.clearLayers();
      const z = map.getZoom();
      if (!ntas || z < 11) return;
      const scale = z >= 16 ? " is-street" : z >= 14 ? " is-lots" : "";

      for (const feature of ntas.features) {
        const props = feature.properties;
        if (!props?.name) continue;
        const dim = props.boro !== borough;
        const mayor = props.type === "park" ? undefined : mayors[props.id];

        const ring = largestRing(feature.geometry);
        if (!ring) continue;
        const center = visibleAnchor(ring, map);
        if (!center) continue;

        let minLng = Infinity;
        let minLat = Infinity;
        let maxLng = -Infinity;
        let maxLat = -Infinity;
        for (const [lng, lat] of ring) {
          if (lng < minLng) minLng = lng;
          if (lat < minLat) minLat = lat;
          if (lng > maxLng) maxLng = lng;
          if (lat > maxLat) maxLat = lat;
        }
        const sw = map.latLngToContainerPoint([minLat, minLng]);
        const ne = map.latLngToContainerPoint([maxLat, maxLng]);
        const w = Math.abs(ne.x - sw.x);
        const h = Math.abs(ne.y - sw.y);
        const minW = props.type === "park" ? 90 : mayor ? 72 : 56;
        const minH = props.type === "park" ? 40 : mayor ? 32 : 22;
        if (z < 14 && (w < minW || h < minH)) continue;
        if (z >= 16 && props.type === "park") continue;

        const mayorLine = mayor
          ? `<span class="hood-mayor">Mayor ${escapeHtml(mayor.url ? displayHost(mayor.url) : mayor.name)}</span>`
          : "";
        const marker = L.marker(center, {
          icon: L.divIcon({
            className: `hood-label-wrap${dim ? " is-dim" : ""}${props.type === "park" ? " is-park" : ""}${mayor ? " has-mayor" : ""}${scale}`,
            html: `<span class="hood-label"><span class="hood-name">${escapeHtml(props.name)}</span>${mayorLine}</span>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
          interactive: false,
          keyboard: false,
          pane: "hood-labels",
        });
        group.addLayer(marker);
      }
    };

    draw();
    map.on("zoomend moveend", draw);
    return () => {
      map.off("zoomend moveend", draw);
      group.clearLayers();
      map.removeLayer(group);
    };
  }, [map, ntas, borough, mayors]);

  return null;
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
  const { ownedBlocks, getBlockOwner, getBlocksForNeighborhood, getMayors } = useOwnership();
  const mayors = useMemo(() => getMayors(), [getMayors]);
  const showBlocks = zoom >= 14;
  const [viewBounds, setViewBounds] = useState<L.LatLngBounds | null>(null);
  const lotBBox = useMemo(() => {
    const m = new globalThis.Map<string, [number, number, number, number]>();
    if (!blocks) return m;
    for (const f of blocks.features) {
      const ring = largestRing(f.geometry);
      if (!ring) continue;
      let minLng = Infinity;
      let minLat = Infinity;
      let maxLng = -Infinity;
      let maxLat = -Infinity;
      for (const [lng, lat] of ring) {
        if (lng < minLng) minLng = lng;
        if (lat < minLat) minLat = lat;
        if (lng > maxLng) maxLng = lng;
        if (lat > maxLat) maxLat = lat;
      }
      m.set(f.properties.id, [minLng, minLat, maxLng, maxLat]);
    }
    return m;
  }, [blocks]);
  const visibleBlocks = (() => {
    if (!blocks) return null;
    const ownerLots = highlightOwner
      ? blocks.features.filter((f) => getBlockOwner(f.properties.id)?.ownerName === highlightOwner)
      : [];
    if (!showBlocks && ownerLots.length === 0) return null;
    const seen = new Set(ownerLots.map((f) => f.properties.id));
    const rest = showBlocks
      ? blocks.features.filter((f) => {
          if (seen.has(f.properties.id)) return false;
          if (!viewBounds) return true;
          const bb = lotBBox.get(f.properties.id);
          if (!bb) return false;
          const b = viewBounds.pad(0.2);
          return bb[0] <= b.getEast() && bb[2] >= b.getWest() && bb[1] <= b.getNorth() && bb[3] >= b.getSouth();
        })
      : [];
    const features = [...ownerLots, ...rest];
    if (features.length === 0) return null;
    return { type: "FeatureCollection" as const, features };
  })();
  const boundsKey = viewBounds
    ? `${viewBounds.getWest().toFixed(2)}-${viewBounds.getSouth().toFixed(2)}-${viewBounds.getEast().toFixed(2)}-${viewBounds.getNorth().toFixed(2)}`
    : "x";

  selectedRef.current = selectedIds;
  highlightRef.current = highlightOwner;

  useEffect(() => {
    setHover(null);
  }, [boundsKey, showBlocks]);

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
      return {
        fillColor: isPark ? "#e7efe4" : priceFill(feature.properties.price),
        fillOpacity: showBlocks ? 0.03 : owned > 0 ? 0.58 : 0.42,
        color: "#141414",
        weight: showBlocks ? 0 : 1.25,
        opacity: 0.95,
        interactive: !showBlocks,
      };
    },
    [getBlocksForNeighborhood, showBlocks]
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
        mousemove: (e: L.LeafletMouseEvent) => {
          setHover((prev) =>
            prev ? { ...prev, x: e.containerPoint.x, y: e.containerPoint.y } : prev
          );
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
        {showBlocks ? <LabelsOverlay /> : null}
        <NeighborhoodLabels ntas={ntas} borough={borough} mayors={mayors} />
        <ZoomTracker onZoom={setZoom} />
        <ViewBounds onBounds={setViewBounds} />
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
            key={`blocks-${highlightOwner ?? "none"}-${showBlocks ? boundsKey : "h"}`}
          />
        )}
        {showBlocks ? <HoodBorders ntas={ntas} /> : null}
      </MapContainer>

      {hover && showBlocks && (
        <div
          className="pointer-events-none absolute z-[500] rounded-lg border border-[#e4e0d8] bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm"
          style={{ left: hover.x + 14, top: hover.y + 14 }}
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
