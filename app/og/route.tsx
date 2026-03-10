import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") ?? "Stav Fernandes";
  const description = searchParams.get("description") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0e0e0c",
          padding: "64px",
        }}
      >
        {/* Top: branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #22d3ee, #3b82f6, #8b5cf6)",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            stavfernandes.dev
          </span>
        </div>

        {/* Middle: title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: title.length > 40 ? "48px" : "56px",
              fontWeight: 700,
              color: "#ffffff",
              fontFamily: "sans-serif",
              lineHeight: 1.15,
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: "24px",
                color: "rgba(255,255,255,0.55)",
                fontFamily: "sans-serif",
                lineHeight: 1.4,
                margin: 0,
                maxWidth: "800px",
              }}
            >
              {description.length > 120
                ? description.slice(0, 120) + "..."
                : description}
            </p>
          )}
        </div>

        {/* Bottom: author + accent line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              color: "rgba(255,255,255,0.4)",
              fontFamily: "sans-serif",
            }}
          >
            Stav Fernandes
          </span>
          <div
            style={{
              height: "4px",
              width: "120px",
              borderRadius: "2px",
              background: "linear-gradient(90deg, #22d3ee, #3b82f6, #8b5cf6)",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
