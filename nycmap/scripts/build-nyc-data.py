#!/usr/bin/env python3
"""Build per-borough tax-block GeoJSON.

Each source polygon becomes its own buyable lot (no merging). That way a
tax-block number that was stored as two shapes across a street is two lots.
"""

from __future__ import annotations

import json
import math
import os
import urllib.parse
import urllib.request
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "data")
SRC_DIR = os.path.join(ROOT, "src", "data")

BOROUGHS = {
    "1": {"id": "manhattan", "name": "Manhattan", "prefix": "MN", "center": [40.783, -73.971]},
    "2": {"id": "bronx", "name": "Bronx", "prefix": "BX", "center": [40.8448, -73.8648]},
    "3": {"id": "brooklyn", "name": "Brooklyn", "prefix": "BK", "center": [40.6782, -73.9442]},
    "4": {"id": "queens", "name": "Queens", "prefix": "QN", "center": [40.7282, -73.7949]},
    "5": {"id": "staten-island", "name": "Staten Island", "prefix": "SI", "center": [40.5795, -74.1502]},
}

MANHATTAN_DISPLAY = {
    "Financial District-Battery Park City": "Financial District",
    "Tribeca-Civic Center": "Tribeca",
    "The Battery-Governors Island-Ellis Island-Liberty Island": "Battery Park",
    "SoHo-Little Italy-Hudson Square": "SoHo",
    "Greenwich Village": "Greenwich Village",
    "West Village": "West Village",
    "Chinatown-Two Bridges": "Chinatown",
    "Lower East Side": "Lower East Side",
    "East Village": "East Village",
    "Chelsea-Hudson Yards": "Chelsea",
    "Hell's Kitchen": "Hell's Kitchen",
    "Midtown South-Flatiron-Union Square": "Flatiron",
    "Midtown-Times Square": "Times Square",
    "Stuyvesant Town-Peter Cooper Village": "Stuyvesant Town",
    "Gramercy": "Gramercy",
    "Murray Hill-Kips Bay": "Murray Hill",
    "East Midtown-Turtle Bay": "Midtown East",
    "United Nations": "United Nations",
    "Upper West Side-Lincoln Square": "Lincoln Square",
    "Upper West Side (Central)": "Upper West Side",
    "Upper West Side-Manhattan Valley": "Manhattan Valley",
    "Upper East Side-Lenox Hill-Roosevelt Island": "Lenox Hill",
    "Upper East Side-Carnegie Hill": "Carnegie Hill",
    "Upper East Side-Yorkville": "Yorkville",
    "Morningside Heights": "Morningside Heights",
    "Manhattanville-West Harlem": "Manhattanville",
    "Hamilton Heights-Sugar Hill": "Hamilton Heights",
    "Harlem (South)": "South Harlem",
    "Harlem (North)": "Harlem",
    "East Harlem (South)": "East Harlem",
    "East Harlem (North)": "East Harlem North",
    "Randall's Island": "Randall's Island",
    "Washington Heights (South)": "Washington Heights",
    "Washington Heights (North)": "Hudson Heights",
    "Inwood": "Inwood",
    "Highbridge Park": "Highbridge Park",
    "Inwood Hill Park": "Inwood Hill Park",
    "Central Park": "Central Park",
}

MANHATTAN_PRICE = {
    "Midtown-Times Square": 100,
    "East Midtown-Turtle Bay": 85,
    "Financial District-Battery Park City": 80,
    "United Nations": 80,
    "SoHo-Little Italy-Hudson Square": 75,
    "Tribeca-Civic Center": 70,
    "West Village": 70,
    "Greenwich Village": 65,
    "Chelsea-Hudson Yards": 60,
    "Midtown South-Flatiron-Union Square": 60,
    "Central Park": 150,
    "Gramercy": 50,
    "Hell's Kitchen": 45,
    "East Village": 45,
    "Upper East Side-Carnegie Hill": 45,
    "Murray Hill-Kips Bay": 40,
    "Upper East Side-Lenox Hill-Roosevelt Island": 40,
    "Upper West Side-Lincoln Square": 40,
    "The Battery-Governors Island-Ellis Island-Liberty Island": 40,
    "Upper East Side-Yorkville": 35,
    "Upper West Side (Central)": 30,
    "Chinatown-Two Bridges": 28,
    "Lower East Side": 25,
    "Stuyvesant Town-Peter Cooper Village": 22,
    "Upper West Side-Manhattan Valley": 22,
    "Morningside Heights": 18,
    "Randall's Island": 15,
    "Harlem (South)": 12,
    "Highbridge Park": 12,
    "Inwood Hill Park": 12,
    "Harlem (North)": 10,
    "East Harlem (South)": 10,
    "Manhattanville-West Harlem": 10,
    "Hamilton Heights-Sugar Hill": 10,
    "East Harlem (North)": 9,
    "Washington Heights (South)": 8,
    "Washington Heights (North)": 8,
    "Inwood": 6,
}

DEFAULT_PRICE = {"1": 15, "2": 8, "3": 12, "4": 10, "5": 6}


def slug(name: str) -> str:
    return (
        name.lower()
        .replace("'", "")
        .replace("(", "")
        .replace(")", "")
        .replace("&", "and")
        .replace("/", "-")
        .replace(" ", "-")
    )


def display_name(nta_name: str, boro: str) -> str:
    if boro == "1" and nta_name in MANHATTAN_DISPLAY:
        return MANHATTAN_DISPLAY[nta_name]
    # Take the first clause of long DCP names
    return nta_name.split("-")[0].strip()


def price_for(nta_name: str, boro: str) -> int:
    if boro == "1":
        return MANHATTAN_PRICE.get(nta_name, DEFAULT_PRICE["1"])
    n = nta_name.lower()
    if boro == "3":
        if "dumbo" in n or "brooklyn heights" in n:
            return 45
        if "williamsburg" in n or "greenpoint" in n:
            return 32
        if "park slope" in n or "cobble hill" in n or "boerum" in n or "carroll" in n:
            return 28
        if "bushwick" in n or "bed-stuy" in n or "bedford" in n:
            return 16
        if "park" in n and "prospect" in n:
            return 20
        return DEFAULT_PRICE["3"]
    if boro == "4":
        if "long island city" in n or "lic" in n:
            return 28
        if "astoria" in n or "sunnyside" in n:
            return 16
        if "forest hills" in n or "jackson heights" in n:
            return 14
        return DEFAULT_PRICE["4"]
    if boro == "2":
        if "mott haven" in n or "south bronx" in n or "port morris" in n:
            return 12
        if "riverdale" in n:
            return 14
        return DEFAULT_PRICE["2"]
    if "st. george" in n or "st george" in n:
        return 10
    return DEFAULT_PRICE[boro]


def ring_area(ring):
    a = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i][0], ring[i][1]
        x2, y2 = ring[i + 1][0], ring[i + 1][1]
        a += x1 * y2 - x2 * y1
    return a / 2.0


def centroid_of_ring(ring):
    a = ring_area(ring)
    if abs(a) < 1e-18:
        xs = [p[0] for p in ring[:-1] or ring]
        ys = [p[1] for p in ring[:-1] or ring]
        n = max(len(xs), 1)
        return sum(xs) / n, sum(ys) / n
    cx = cy = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i][0], ring[i][1]
        x2, y2 = ring[i + 1][0], ring[i + 1][1]
        f = x1 * y2 - x2 * y1
        cx += (x1 + x2) * f
        cy += (y1 + y2) * f
    return cx / (6 * a), cy / (6 * a)


def iter_polygons(geom):
    t = geom["type"]
    coords = geom["coordinates"]
    if t == "Polygon":
        yield coords
    elif t == "MultiPolygon":
        for poly in coords:
            yield poly


def point_in_ring(x, y, ring):
    inside = False
    n = len(ring)
    j = n - 1
    for i in range(n):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-16) + xi):
            inside = not inside
        j = i
    return inside


def point_in_polygon(x, y, poly):
    if not poly or not point_in_ring(x, y, poly[0]):
        return False
    for hole in poly[1:]:
        if point_in_ring(x, y, hole):
            return False
    return True


def perp_dist(p, a, b):
    (x, y), (x1, y1), (x2, y2) = p[:2], a[:2], b[:2]
    dx, dy = x2 - x1, y2 - y1
    if dx == 0 and dy == 0:
        return math.hypot(x - x1, y - y1)
    t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)
    t = max(0.0, min(1.0, t))
    return math.hypot(x - (x1 + t * dx), y - (y1 + t * dy))


def simplify_ring(ring, eps):
    if len(ring) <= 4:
        return ring

    def rec(pts):
        if len(pts) < 3:
            return pts
        max_d = -1
        idx = 0
        a, b = pts[0], pts[-1]
        for i in range(1, len(pts) - 1):
            d = perp_dist(pts[i], a, b)
            if d > max_d:
                max_d = d
                idx = i
        if max_d > eps:
            left = rec(pts[: idx + 1])
            right = rec(pts[idx:])
            return left[:-1] + right
        return [pts[0], pts[-1]]

    closed = ring[0] == ring[-1]
    pts = ring[:-1] if closed else ring[:]
    simp = rec(pts)
    if closed:
        if simp[0] != simp[-1]:
            simp.append(simp[0])
        if len(simp) < 4:
            return ring
    return simp


def simplify_polygon(poly, eps=0.00008):
    rings = []
    for i, ring in enumerate(poly):
        s = simplify_ring(ring, eps if i == 0 else eps * 0.6)
        if len(s) >= 4:
            rings.append(s)
    return rings


def fetch_json(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "nycmap/1.0"})
    with urllib.request.urlopen(req, timeout=180) as resp:
        return json.load(resp)


def fetch_tax_blocks():
    cache = os.path.join(ROOT, ".cache", "nyc-taxblocks.geojson")
    os.makedirs(os.path.dirname(cache), exist_ok=True)
    if os.path.exists(cache) and os.path.getsize(cache) > 1_000_000:
        print("using cached tax blocks", cache)
        return json.load(open(cache))
    url = (
        "https://data.cityofnewyork.us/resource/akq4-haa2.geojson?"
        + urllib.parse.urlencode({"$limit": "50000"})
    )
    print("downloading tax blocks…")
    data = fetch_json(url)
    json.dump(data, open(cache, "w"))
    return data


def fetch_ntas():
    cache = os.path.join(ROOT, ".cache", "nyc-ntas.geojson")
    os.makedirs(os.path.dirname(cache), exist_ok=True)
    if os.path.exists(cache) and os.path.getsize(cache) > 10_000:
        print("using cached NTAs", cache)
        return json.load(open(cache))
    url = (
        "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/"
        "NYC_Neighborhood_Tabulation_Areas_2020/FeatureServer/0/query?"
        + urllib.parse.urlencode(
            {
                "where": "1=1",
                "outFields": "NTAName,NTA2020,NTAType,BoroName,BoroCode",
                "outSR": "4326",
                "f": "geojson",
                "resultRecordCount": "500",
            }
        )
    )
    print("downloading NTAs…")
    data = fetch_json(url)
    json.dump(data, open(cache, "w"))
    return data


def nta_index(ntas):
    by_boro = defaultdict(list)
    for f in ntas["features"]:
        p = f["properties"]
        boro = str(p.get("BoroCode") or "")
        if len(boro) == 1:
            pass
        else:
            # sometimes stored as 1.0
            try:
                boro = str(int(float(boro)))
            except Exception:
                continue
        polys = list(iter_polygons(f["geometry"]))
        minx = miny = 1e9
        maxx = maxy = -1e9
        for poly in polys:
            for pt in poly[0]:
                minx = min(minx, pt[0])
                maxx = max(maxx, pt[0])
                miny = min(miny, pt[1])
                maxy = max(maxy, pt[1])
        by_boro[boro].append((p, polys, (minx, miny, maxx, maxy)))
    return by_boro


def assign_nta(x, y, prepared):
    for p, polys, (minx, miny, maxx, maxy) in prepared:
        if x < minx or x > maxx or y < miny or y > maxy:
            continue
        for poly in polys:
            if point_in_polygon(x, y, poly):
                return p
    best = None
    best_d = 1e9
    for p, polys, _ in prepared:
        ring = polys[0][0]
        cx, cy = centroid_of_ring(ring)
        d = (cx - x) ** 2 + (cy - y) ** 2
        if d < best_d:
            best_d = d
            best = p
    return best


def main():
    raw = fetch_tax_blocks()
    ntas = fetch_ntas()
    print("tax polygons", len(raw["features"]), "ntas", len(ntas["features"]))
    prepared = nta_index(ntas)

    lots_by_boro = defaultdict(list)
    seq_by_key = defaultdict(int)

    for f in raw["features"]:
        props = f.get("properties") or {}
        geom = f.get("geometry")
        if not geom:
            continue
        boro = str(props.get("boro") or "")
        if boro not in BOROUGHS:
            continue
        block = props.get("block")
        info = BOROUGHS[boro]
        nta_list = prepared.get(boro, [])
        for poly in iter_polygons(geom):
            rings = simplify_polygon(poly)
            if not rings:
                continue
            lng, lat = centroid_of_ring(rings[0])
            nta_props = assign_nta(lng, lat, nta_list) or {}
            nta_name = nta_props.get("NTAName") or info["name"]
            nta_code = nta_props.get("NTA2020") or f"{info['prefix']}0000"
            nta_type = str(nta_props.get("NTAType") or "0")
            display = display_name(nta_name, boro)
            nid = f"{info['id']}-{slug(display)}"
            seq_key = f"{info['prefix']}-{block}"
            seq_by_key[seq_key] += 1
            seq = seq_by_key[seq_key]
            lot_id = f"{seq_key}-{seq}" if seq > 1 or True else seq_key
            # always include seq so two parts of the same tax block never share an id
            lot_id = f"{seq_key}-{seq}"
            lots_by_boro[boro].append(
                {
                    "type": "Feature",
                    "properties": {
                        "id": lot_id,
                        "block": int(block) if str(block).isdigit() else block,
                        "part": seq,
                        "boro": info["id"],
                        "borough": info["name"],
                        "nta": nta_code,
                        "ntaName": nta_name,
                        "neighborhood": display,
                        "neighborhoodId": nid,
                        "type": "park" if nta_type in ("9", "6") else "neighborhood",
                        "price": price_for(nta_name, boro),
                    },
                    "geometry": {"type": "Polygon", "coordinates": rings},
                }
            )

    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(SRC_DIR, exist_ok=True)

    nta_stats = defaultdict(lambda: {"count": 0, "lats": [], "lngs": []})
    borough_counts = {}
    all_nta_features = []

    for boro, info in BOROUGHS.items():
        feats = lots_by_boro.get(boro, [])
        feats.sort(key=lambda f: (f["properties"]["neighborhood"], f["properties"]["block"], f["properties"]["part"]))
        path = os.path.join(OUT_DIR, f"{info['id']}-blocks.geojson")
        with open(path, "w") as fh:
            json.dump({"type": "FeatureCollection", "features": feats}, fh, separators=(",", ":"))
        borough_counts[info["id"]] = len(feats)
        print(info["name"], "lots", len(feats), "MB", os.path.getsize(path) / 1e6)
        for feat in feats:
            p = feat["properties"]
            s = nta_stats[p["neighborhoodId"]]
            s["count"] += 1
            s["name"] = p["neighborhood"]
            s["ntaName"] = p["ntaName"]
            s["nta"] = p["nta"]
            s["type"] = p["type"]
            s["price"] = p["price"]
            s["borough"] = p["borough"]
            s["boroughId"] = p["boro"]
            ring = feat["geometry"]["coordinates"][0]
            lng, lat = centroid_of_ring(ring)
            s["lats"].append(lat)
            s["lngs"].append(lng)

    for f in ntas["features"]:
        p = f["properties"]
        try:
            boro = str(int(float(p.get("BoroCode"))))
        except Exception:
            continue
        if boro not in BOROUGHS:
            continue
        info = BOROUGHS[boro]
        nta_name = p.get("NTAName") or info["name"]
        display = display_name(nta_name, boro)
        nid = f"{info['id']}-{slug(display)}"
        polys = []
        for poly in iter_polygons(f["geometry"]):
            rings = simplify_polygon(poly, 0.00014)
            if rings:
                polys.append(rings)
        if not polys:
            continue
        geom = {"type": "Polygon", "coordinates": polys[0]} if len(polys) == 1 else {
            "type": "MultiPolygon",
            "coordinates": polys,
        }
        all_nta_features.append(
            {
                "type": "Feature",
                "properties": {
                    "id": nid,
                    "name": display,
                    "ntaName": nta_name,
                    "nta": p.get("NTA2020"),
                    "type": "park" if str(p.get("NTAType")) in ("9", "6") else "neighborhood",
                    "price": price_for(nta_name, boro),
                    "blocks": nta_stats.get(nid, {}).get("count", 0),
                    "boro": info["id"],
                    "borough": info["name"],
                },
                "geometry": geom,
            }
        )

    with open(os.path.join(OUT_DIR, "nyc-neighborhoods.geojson"), "w") as fh:
        json.dump({"type": "FeatureCollection", "features": all_nta_features}, fh, separators=(",", ":"))

    neighborhoods = []
    for nid, s in sorted(nta_stats.items(), key=lambda kv: (kv[1]["borough"], -kv[1]["price"], kv[1]["name"])):
        if s["count"] == 0:
            continue
        neighborhoods.append(
            {
                "id": nid,
                "name": s["name"],
                "ntaName": s["ntaName"],
                "nta": s["nta"],
                "borough": s["borough"],
                "boroughId": s["boroughId"],
                "type": s["type"],
                "pricePerBlock": s["price"],
                "blockCount": s["count"],
                "center": [
                    round(sum(s["lats"]) / len(s["lats"]), 6),
                    round(sum(s["lngs"]) / len(s["lngs"]), 6),
                ],
            }
        )

    ts = """import { Neighborhood } from "@/types";

export const BOROUGHS = [
  { id: "manhattan", name: "Manhattan", center: [40.783, -73.971] as [number, number], zoom: 12 },
  { id: "brooklyn", name: "Brooklyn", center: [40.6782, -73.9442] as [number, number], zoom: 12 },
  { id: "queens", name: "Queens", center: [40.7282, -73.7949] as [number, number], zoom: 11 },
  { id: "bronx", name: "Bronx", center: [40.8448, -73.8648] as [number, number], zoom: 12 },
  { id: "staten-island", name: "Staten Island", center: [40.5795, -74.1502] as [number, number], zoom: 12 },
] as const;

export type BoroughId = (typeof BOROUGHS)[number]["id"];

export const NEIGHBORHOODS: Neighborhood[] = %s;

export const BLOCKS_BY_BOROUGH: Record<BoroughId, number> = %s;

export const TOTAL_BLOCKS = Object.values(BLOCKS_BY_BOROUGH).reduce((a, b) => a + b, 0);
export const NYC_TAX_BLOCKS = 28802;
""" % (
        json.dumps(neighborhoods, indent=2),
        json.dumps(borough_counts, indent=2),
    )
    with open(os.path.join(SRC_DIR, "neighborhoods.ts"), "w") as fh:
        fh.write(ts)

    print("neighborhoods", len(neighborhoods))
    print("total lots", sum(borough_counts.values()))


if __name__ == "__main__":
    main()
