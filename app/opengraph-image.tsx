import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "GoFreeTool - Free Daily-Use Tools";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #6366f1 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <span style={{ fontSize: 80 }}>🛠️</span>
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            marginBottom: 20,
            textShadow: "0 4px 8px rgba(0,0,0,0.3)",
          }}
        >
          GoFreeTool
        </div>
        <div
          style={{
            fontSize: 36,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Free Daily-Use Tools & Calculators
        </div>
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            marginTop: 30,
          }}
        >
          No Signup Required • 100% Free • Browser-Based
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
