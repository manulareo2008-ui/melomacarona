"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function InternalHeader() {
  const router = useRouter();

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 40,
      background: "rgba(8,11,16,0.85)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "0 24px",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
      }}>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Voltar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            width: "34px",
            height: "34px",
            cursor: "pointer",
            transition: "all 0.15s",
            color: "rgba(255,255,255,0.6)",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(200,255,77,0.08)";
            e.currentTarget.style.borderColor = "rgba(200,255,77,0.3)";
            e.currentTarget.style.color = "#C8FF4D";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "rgba(255,255,255,0.6)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <Link
          href="/"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "18px",
            color: "#fff",
            textDecoration: "none",
            letterSpacing: "-0.01em",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C8FF4D")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
        >
          melomacarona
        </Link>

        <div style={{ width: "34px", flexShrink: 0 }} />
      </div>
    </header>
  );
}