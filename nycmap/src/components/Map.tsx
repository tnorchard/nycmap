"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useOwnership } from "@/lib/ownership";
import { BlockProperties } from "@/types";
import { formatMoney } from "@/lib/pricing";
import { BoroughId } from "@/data/neighborhoods";

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
  selectedBlockId: string | null;
  onSelectBlock: (props: BlockProperties) => void;
  onSelectNeighborhood: (id: string, bounds: LatLngBoundsLiteral) => void;
  flyTo: [number, number, number] | null;
  fitBounds: LatLngBoundsLiteral | null;
}

function ZoomTracker({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMapEvents({ zoomend: () => onZoom(map.getZoom()) });
  useEffect(() => {
    onZoom(map.getZoom());
  }, [map, onZoom]);
  return null;
}

function FlyTo({ target }: { target: [number, number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo([target[0], target[1]], target[2], { duration: 0.85 });
  }, [map, target]);
  return null;
}

function FitBounds({ bounds }: { bounds: LatLngBoundsLiteral | null }) {
  const map = useMap();
  useEffect(() => {
    if (!bounds) return;
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16, animate: true });
  }, [map, bounds]);
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
  selectedBlockId,
  onSelectBlock,
  onSelectNeighborhood,
  flyTo,
  fitBounds,
}: MapProps) {
  const [blocks, setBlocks] = useState<BlockFC | null>(null);
  const [ntas, setNtas] = useState<NtaFC | null>(null);
  const [zoom, setZoom] = useState(12);
  const [hover, setHover] = useState<HoverInfo | null>(null);
  const [loadingBlocks, setLoadingBlocks] = useState(true);
  const blockRef = useRef<L.GeoJSON | null>(null);
  const ntaRef = useRef<L.GeoJSON | null>(null);
  const { ownedBlocks, getBlockOwner, getBlocksForNeighborhood } = useOwnership();
  const showBlocks = zoom >= 14;

  useEffect(() => {
    fetch("/data/nyc-neighborhoods.geojson")
      .then((r) => r.json() as Promise<NtaFC>)
      .then(setNtas);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingBlocks(true);
    setBlocks(null);
    fetch(`/data/${borough}-blocks.geojson`)
      .then((r) => r.json() as Promise<BlockFC>)
      .then((data) => {
        if (!cancelled) {
          setBlocks(data);
          setLoadingBlocks(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [borough]);

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
        interactive: !showBlocks && !dim,
      };
    },
    [borough, getBlocksForNeighborhood, showBlocks]
  );

  const blockStyle = useCallback(
    (feature?: { properties?: BlockProperties }) => {
      if (!feature?.properties) return {};
      const p = feature.properties;
      const owner = getBlockOwner(p.id);
      const selected = selectedBlockId === p.id;
      if (owner) {
        return {
          fillColor: owner.ownerColor || "#1a1a1a",
          fillOpacity: selected ? 0.88 : 0.74,
          color: selected ? "#111" : "#ffffff",
          weight: selected ? 2.2 : 0.8,
          opacity: 1,
          bubblingMouseEvents: false,
        };
      }
      return {
        fillColor: "#ffffff",
        fillOpacity: selected ? 0.4 : 0.12,
        color: selected ? "#111111" : "#2a2a2a",
        weight: selected ? 2.4 : 0.6,
        opacity: selected ? 1 : 0.45,
        bubblingMouseEvents: false,
      };
    },
    [getBlockOwner, selectedBlockId]
  );

  const onEachNta = useCallback(
    (feature: { properties?: { id: string; boro: string } }, layer: L.Layer) => {
      const p = feature.properties;
      if (!p || p.boro !== borough) return;
      layer.on({
        click: (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
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
    [borough, onSelectNeighborhood, showBlocks]
  );

  const onEachBlock = useCallback(
    (feature: { properties?: BlockProperties }, layer: L.Layer) => {
      const p = feature.properties;
      if (!p) return;
      layer.on({
        click: (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          onSelectBlock(p);
        },
        mouseover: (e: L.LeafletMouseEvent) => {
          L.DomEvent.stopPropagation(e);
          const owner = getBlockOwner(p.id);
          const target = e.target as L.Path;
          target.setStyle({ weight: 1.8, fillOpacity: owner ? 0.92 : 0.32, color: "#111" });
          target.bringToFront();
          setHover({
            name: p.neighborhood,
            block: p.block,
            part: p.part,
            price: owner?.price ?? p.price,
            owned: !!owner,
            owner: owner?.ownerName,
            x: e.containerPoint.x,
            y: e.containerPoint.y,
          });
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          blockRef.current?.resetStyle(e.target);
          setHover(null);
        },
      });
    },
    [getBlockOwner, onSelectBlock]
  );

  useEffect(() => {
    blockRef.current?.eachLayer((layer) => {
      const feat = (layer as L.Layer & { feature?: { properties?: BlockProperties } }).feature;
      if (feat?.properties) {
        (layer as L.Path).setStyle(blockStyle(feat) as L.PathOptions);
      }
    });
  }, [blockStyle, ownedBlocks, selectedBlockId]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[40.7128, -74.006]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        zoomControl
        minZoom={10}
        maxZoom={18}
        preferCanvas
        maxBounds={[
          [40.48, -74.28],
          [40.93, -73.68],
        ]}
        maxBoundsViscosity={0.7}
      >
        <TileLayer
          attribution="&copy; OSM · CARTO · NYC DCP / DOF"
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
        <LabelsOverlay />
        <ZoomTracker onZoom={setZoom} />
        <FlyTo target={flyTo} />
        <FitBounds bounds={fitBounds} />

        {ntas && (
          <GeoJSON
            ref={(r) => {
              ntaRef.current = r;
            }}
            data={ntas as never}
            style={ntaStyle}
            onEachFeature={onEachNta}
            key={`nta-${borough}-${showBlocks ? "z" : "o"}`}
          />
        )}

        {blocks && showBlocks && (
          <GeoJSON
            ref={(r) => {
              blockRef.current = r;
            }}
            data={blocks as never}
            style={blockStyle}
            onEachFeature={onEachBlock}
            key={`blocks-${borough}`}
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

      {loadingBlocks && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[500] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e4e0d8] bg-white/90 px-3.5 py-1.5 text-[11px] text-[#6b6560] shadow-sm backdrop-blur">
          Loading lots…
        </div>
      )}

      {!showBlocks && !loadingBlocks && (
        <div className="pointer-events-none absolute bottom-28 left-1/2 z-[500] -translate-x-1/2 rounded-full border border-[#e4e0d8] bg-white/90 px-3.5 py-1.5 text-[11px] text-[#6b6560] shadow-sm backdrop-blur">
          Zoom in for streets, then tap one lot
        </div>
      )}
    </div>
  );
}
