# NYC MAP

Buy a real New York City tax lot. Five boroughs. Anyone can steal it for 1.5×.

Street-bounded lots come from the NYC Department of Finance tax-block map. Each disconnected polygon is its own claim — hovering one lot no longer paints its neighbor.

## Run

```bash
cd nycmap
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Data

```bash
python3 scripts/build-nyc-data.py
```

Sources: [TAX_BLOCK_POLYGON](https://data.cityofnewyork.us/City-Government/TAX_BLOCK_POLYGON/akq4-haa2) and DCP 2020 Neighborhood Tabulation Areas.

Payments in this preview are simulated (browser storage).
