#!/usr/bin/env python3
"""Build simplified Manhattan tax-block + neighborhood GeoJSON for NYC MAP.

Sources:
  - NYC DOF TAX_BLOCK_POLYGON (akq4-haa2) — real city tax blocks
  - NYC DCP 2020 Neighborhood Tabulation Areas
  - DCP PLUTO unique Manhattan tax blocks: 1,964
"""

from __future__ import annotations

import json
import math
import os
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "data")
SRC_DIR = os.path.join(ROOT, "src", "data")

DISPLAY_NAME = {
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

PRICE = {
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

DEFAULT_PRICE = 15


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


def simplify_geom(geom, eps=0.00007):
    polys = []
    for poly in iter_polygons(geom):
        rings = []
        for i, ring in enumerate(poly):
            s = simplify_ring(ring, eps if i == 0 else eps * 0.6)
            if len(s) >= 4:
                rings.append(s)
        if rings:
            polys.append(rings)
    if not polys:
        return geom
    if len(polys) == 1:
        return {"type": "Polygon", "coordinates": polys[0]}
    return {"type": "MultiPolygon", "coordinates": polys}


def nta_lookup(ntas):
    prepared = []
    for f in ntas["features"]:
        p = f["properties"]
        polys = list(iter_polygons(f["geometry"]))
        prepared.append((p, polys))
    return prepared


def assign_nta(x, y, prepared):
    for p, polys in prepared:
        for poly in polys:
            if point_in_polygon(x, y, poly):
                return p
    # nearest NTA centroid fallback
    best = None
    best_d = 1e9
    for p, polys in prepared:
        ring = polys[0][0]
        cx, cy = centroid_of_ring(ring)
        d = (cx - x) ** 2 + (cy - y) ** 2
        if d < best_d:
            best_d = d
            best = p
    return best


def main():
    ntas = json.load(open("/tmp/nta-mn.geojson"))
    raw = json.load(open("/tmp/taxblocks-mn.geojson"))
    prepared = nta_lookup(ntas)

    grouped = defaultdict(list)
    for f in raw["features"]:
        block = str(f["properties"]["block"])
        grouped[block].append(f["geometry"])

    features = []
    nta_stats = defaultdict(lambda: {"count": 0, "lats": [], "lngs": []})

    for block, geoms in grouped.items():
        polys = []
        for g in geoms:
            for poly in iter_polygons(g):
                polys.append(poly)
        geom = {"type": "MultiPolygon", "coordinates": polys}
        geom = simplify_geom(geom)

        # centroid from largest outer ring
        largest = None
        largest_a = 0
        for poly in iter_polygons(geom):
            a = abs(ring_area(poly[0]))
            if a > largest_a:
                largest_a = a
                largest = poly[0]
        lng, lat = centroid_of_ring(largest)

        nta_props = assign_nta(lng, lat, prepared) or {}
        nta_name = nta_props.get("NTAName") or "Manhattan"
        nta_code = nta_props.get("NTA2020") or "MN0000"
        nta_type = nta_props.get("NTAType") or "0"
        display = DISPLAY_NAME.get(nta_name, nta_name)
        price = PRICE.get(nta_name, DEFAULT_PRICE)
        nid = slug(display)

        features.append(
            {
                "type": "Feature",
                "properties": {
                    "id": f"MN-{block}",
                    "block": int(block) if str(block).isdigit() else block,
                    "nta": nta_code,
                    "ntaName": nta_name,
                    "neighborhood": display,
                    "neighborhoodId": nid,
                    "type": "park" if nta_type in ("9", "6") else "neighborhood",
                    "price": price,
                },
                "geometry": geom,
            }
        )
        s = nta_stats[nid]
        s["count"] += 1
        s["name"] = display
        s["ntaName"] = nta_name
        s["nta"] = nta_code
        s["type"] = "park" if nta_type in ("9", "6") else "neighborhood"
        s["price"] = price
        s["lats"].append(lat)
        s["lngs"].append(lng)

    features.sort(key=lambda f: (f["properties"]["neighborhood"], f["properties"]["block"]))

    os.makedirs(OUT_DIR, exist_ok=True)
    blocks_fc = {"type": "FeatureCollection", "features": features}
    with open(os.path.join(OUT_DIR, "manhattan-blocks.geojson"), "w") as f:
        json.dump(blocks_fc, f, separators=(",", ":"))

    nta_out = []
    for f in ntas["features"]:
        p = f["properties"]
        display = DISPLAY_NAME.get(p["NTAName"], p["NTAName"])
        nid = slug(display)
        nta_out.append(
            {
                "type": "Feature",
                "properties": {
                    "id": nid,
                    "name": display,
                    "ntaName": p["NTAName"],
                    "nta": p["NTA2020"],
                    "type": "park" if p["NTAType"] in ("9", "6") else "neighborhood",
                    "price": PRICE.get(p["NTAName"], DEFAULT_PRICE),
                    "blocks": nta_stats.get(nid, {}).get("count", 0),
                },
                "geometry": simplify_geom(f["geometry"], 0.00012),
            }
        )
    with open(os.path.join(OUT_DIR, "manhattan-neighborhoods.geojson"), "w") as f:
        json.dump({"type": "FeatureCollection", "features": nta_out}, f, separators=(",", ":"))

    neighborhoods = []
    for nid, s in sorted(nta_stats.items(), key=lambda kv: (-kv[1]["price"], kv[1]["name"])):
        neighborhoods.append(
            {
                "id": nid,
                "name": s["name"],
                "ntaName": s["ntaName"],
                "nta": s["nta"],
                "borough": "Manhattan",
                "type": s["type"],
                "pricePerBlock": s["price"],
                "blockCount": s["count"],
                "center": [
                    round(sum(s["lats"]) / len(s["lats"]), 6),
                    round(sum(s["lngs"]) / len(s["lngs"]), 6),
                ],
            }
        )

    os.makedirs(SRC_DIR, exist_ok=True)
    ts = """import { Neighborhood } from "@/types";

export const NEIGHBORHOODS: Neighborhood[] = %s;

export const TOTAL_BLOCKS = NEIGHBORHOODS.reduce((sum, n) => sum + n.blockCount, 0);
export const MANHATTAN_TAX_BLOCKS = %d;
export const NYC_TAX_BLOCKS = 28802;
""" % (
        json.dumps(neighborhoods, indent=2),
        len(features),
    )
    with open(os.path.join(SRC_DIR, "neighborhoods.ts"), "w") as f:
        f.write(ts)

    print("blocks", len(features))
    print("neighborhoods", len(neighborhoods))
    print("blocks geojson MB", os.path.getsize(os.path.join(OUT_DIR, "manhattan-blocks.geojson")) / 1e6)
    print("nta geojson MB", os.path.getsize(os.path.join(OUT_DIR, "manhattan-neighborhoods.geojson")) / 1e6)
    for n in neighborhoods:
        print(f"  {n['pricePerBlock']:>4}  {n['blockCount']:>4}  {n['name']}")


if __name__ == "__main__":
    main()
