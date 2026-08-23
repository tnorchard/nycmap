import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#141414",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: 108,
            height: 108,
            gap: 8,
          }}
        >
          <div style={{ width: 50, height: 50, background: "#f6f4ef", borderRadius: 8 }} />
          <div style={{ width: 50, height: 34, background: "#e8e4dc", borderRadius: 8 }} />
          <div style={{ width: 34, height: 50, background: "#d9d4cb", borderRadius: 8, marginTop: -16 }} />
          <div style={{ width: 66, height: 50, background: "#f6f4ef", borderRadius: 8, marginTop: -16 }} />
        </div>
      </div>
    ),
    size
  );
}
