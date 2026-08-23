import { ImageResponse } from "next/og";
import { getStripe } from "@/lib/stripe";
import { unpackLotMetadata } from "@/lib/lots";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  let owner = "A New Yorker";
  let place = "New York";
  let count = 0;
  let kind = "bundle";

  try {
    if (sessionId.startsWith("cs_")) {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      const lots = unpackLotMetadata(session.metadata ?? undefined);
      owner = session.metadata?.owner_name?.trim() || owner;
      place = lots[0]?.neighborhoodName || place;
      count = lots.length;
      kind = session.metadata?.kind || "bundle";
    }
  } catch {
    /* still render a card */
  }

  const headline = kind === "takeover" ? "Stole a lot." : "Claimed the map.";
  const detail =
    kind === "takeover"
      ? `${owner} just took a lot in ${place}.`
      : `${owner} just grabbed ${count || "a handful of"} lots in ${place}.`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f6f4ef",
          fontFamily: "Georgia, Times New Roman, serif",
        }}
      >
        <div
          style={{
            margin: 48,
            flex: 1,
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
            <div style={{ fontSize: 20, letterSpacing: 6, textTransform: "uppercase", color: "#8a847e" }}>
              NYC MAP
            </div>
            <div style={{ marginTop: 18, fontSize: 84, lineHeight: 0.95, color: "#141414", letterSpacing: -2 }}>
              {headline}
            </div>
            <div style={{ marginTop: 22, fontSize: 32, color: "#5c574f", maxWidth: 900, lineHeight: 1.25 }}>
              {detail}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#8a847e" }}>
            <div>Your link is the billboard.</div>
            <div>nycmap.lol</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
