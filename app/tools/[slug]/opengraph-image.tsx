import { ImageResponse } from "next/og";
import { getToolBySlug } from "@/lib/tools";

export const runtime = "edge";

export const alt = "Tool Preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            color: "white",
          }}
        >
          Tool Not Found
        </div>
      ),
      { ...size }
    );
  }

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
          padding: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
          }}
        >
          <span style={{ fontSize: 100 }}>{tool.icon}</span>
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            marginBottom: 20,
            textShadow: "0 4px 8px rgba(0,0,0,0.3)",
            maxWidth: 1000,
          }}
        >
          {tool.name}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          {tool.shortDescription}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 24, color: "rgba(255,255,255,0.6)" }}>
            gofreetool.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
