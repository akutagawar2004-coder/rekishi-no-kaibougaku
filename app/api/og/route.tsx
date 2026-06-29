import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "歴史の解剖学";
  const series = searchParams.get("series") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "60px",
          background: "#f5f0e8",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "3px",
            background: "#b8972a",
            marginBottom: "24px",
          }}
        />
        {series && (
          <p
            style={{
              fontSize: "20px",
              color: "#7a6e62",
              marginBottom: "12px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {series}
          </p>
        )}
        <p
          style={{
            fontSize: "48px",
            fontWeight: "bold",
            color: "#1a1612",
            lineHeight: 1.3,
            maxWidth: "880px",
          }}
        >
          {title}
        </p>
        <p
          style={{
            marginTop: "32px",
            fontSize: "20px",
            color: "#b8972a",
            letterSpacing: "0.05em",
          }}
        >
          歴史の解剖学
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
