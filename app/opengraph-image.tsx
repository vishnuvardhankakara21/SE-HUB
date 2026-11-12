import { ImageResponse } from "next/og";
import { SITE_CONFIG } from "@/lib/seo-config";

export const runtime = "edge";
export const alt = "Software Engineering Academic Learning Platform | ANITS CSE";
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
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #262626 2%, transparent 0%), radial-gradient(circle at 75px 75px, #171717 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#34d399",
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            <span>ANITS CSE • Academic Learning Portal</span>
          </div>
          <div
            style={{
              padding: "8px 18px",
              borderRadius: "12px",
              backgroundColor: "#171717",
              border: "1px solid #262626",
              color: "#a3a3a3",
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            B.Tech Curriculum
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "-0.03em",
              color: "#ffffff",
            }}
          >
            Software Engineering
          </h1>
          <p
            style={{
              fontSize: "26px",
              color: "#10b981",
              margin: 0,
              fontWeight: 600,
            }}
          >
            Interactive Learning & Architecture Platform
          </p>
          <p
            style={{
              fontSize: "20px",
              color: "#a3a3a3",
              margin: 0,
              maxWidth: "950px",
              lineHeight: 1.4,
            }}
          >
            5-Unit Complete Notes • 79 University Exam Q&As • 16 System Architectures • draw.io Studio
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #262626",
            paddingTop: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px", color: "#737373" }}>Architect & Developer:</span>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#34d399" }}>
              {SITE_CONFIG.author.name}
            </span>
          </div>
          <div style={{ fontSize: "15px", color: "#737373" }}>
            se-hub-anits.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

