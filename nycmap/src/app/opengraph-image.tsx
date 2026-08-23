import { ImageResponse } from "next/og";

export const alt = "NYC MAP — claim a real New York City tax lot";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f6f4ef",
          position: "relative",
          fontFamily: "Georgia, Times New Roman, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 48,
            border: "1px solid #e4e0d8",
            borderRadius: 32,
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 56,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 22,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "#8a847e",
              }}
            >
              Five boroughs · real tax lots
            </div>
            <div
              style={{
                marginTop: 18,
                fontSize: 92,
                lineHeight: 0.95,
                color: "#141414",
                letterSpacing: -3,
              }}
            >
              NYC MAP
            </div>
            <div
              style={{
                marginTop: 20,
                fontSize: 32,
                color: "#5c574f",
                maxWidth: 760,
                lineHeight: 1.25,
              }}
            >
              Own a digital piece of New York. $1 a lot. Anyone can take it for 1.5×.
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ display: "flex", gap: 10 }}>
              {["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island"].map((b) => (
                <div
                  key={b}
                  style={{
                    border: "1px solid #e4e0d8",
                    borderRadius: 999,
                    padding: "10px 18px",
                    fontSize: 20,
                    color: "#141414",
                    background: "#f6f4ef",
                  }}
                >
                  {b}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 24, color: "#8a847e" }}>nycmap.lol</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
