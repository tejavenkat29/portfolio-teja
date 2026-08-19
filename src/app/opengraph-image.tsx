import { ImageResponse } from "next/og";

import { profile } from "@/lib/data/profile";

export const alt = `${profile.name} — ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social card generated at build time — same palette and monogram as the site. */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #070c1e 0%, #050816 48%, #03050f 100%)",
          padding: 72,
          position: "relative",
        }}
      >
        {/* Aurora blooms */}
        <div
          style={{
            position: "absolute",
            top: -220,
            left: -160,
            width: 700,
            height: 700,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(99,102,241,0.42), rgba(99,102,241,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -280,
            right: -140,
            width: 640,
            height: 640,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(0,217,255,0.28), rgba(0,217,255,0) 70%)",
          }}
        />

        {/* Top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              border: "2px solid #8B5CF6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            TK
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#94A3B8",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Backend · AI Systems · Distributed
          </div>
        </div>

        {/* Name + pitch */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1,
              color: "#ffffff",
            }}
          >
            {profile.name}
          </div>

          <div style={{ display: "flex", fontSize: 36, color: "#c7ccff", letterSpacing: -0.8 }}>
            Software Engineer · Python · Django/FastAPI · AI/LLM · Cloud & DevOps
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#94A3B8",
              maxWidth: 900,
              lineHeight: 1.45,
            }}
          >
            Real-time AI systems, distributed architectures and production-grade APIs.
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 14 }}>
            {["LiveKit", "OpenAI Realtime", "Claude · Bedrock", "Celery", "PostgreSQL", "AWS"].map((chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  padding: "10px 18px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "#e2e8ff",
                  fontSize: 20,
                }}
              >
                {chip}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", fontSize: 22, color: "#00D9FF" }}>{profile.githubUser}</div>
        </div>
      </div>
    ),
    size,
  );
}
