"use client";

import Hls from "hls.js";
import { useEffect, useRef, type CSSProperties } from "react";

const MUX_HLS_URL =
  "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

export const VIDEO_HUMAN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_090051_64ea5059-da6b-492b-a171-aa7ecc767dc3.mp4";

export const VIDEO_AI =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_093237_ff0ddc63-c068-4e29-96da-fdd0e40af133.mp4";

const gradientTextStyle: CSSProperties = {
  background: "linear-gradient(90deg, #666666 0%, #d0d0d0 50%, #666666 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  display: "block",
  lineHeight: 1.1,
  marginBottom: "-0.22em",
};

type VideoIconProps = {
  src: string;
  /** Cap em px usado no clamp (ex.: 110 no hero). Default 72. */
  size?: number;
};

export function VideoIcon({ src, size = 72 }: VideoIconProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    void v.play().catch(() => {});
  }, [src]);

  const dim = `clamp(48px, 10vw, ${size}px)`;

  return (
    <span
      className="inline-block shrink-0 align-middle overflow-hidden rounded-full"
      style={{ width: dim, height: dim }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="block h-full w-full"
        style={{ objectFit: "cover" }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </span>
  );
}

export function HeroSection() {
  const bgVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = bgVideoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({ autoStartLoad: true });
      hls.loadSource(MUX_HLS_URL);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        void video.play().catch(() => {});
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = MUX_HLS_URL;
      const onMeta = () => {
        void video.play().catch(() => {});
      };
      video.addEventListener("loadedmetadata", onMeta);
      return () => {
        video.removeEventListener("loadedmetadata", onMeta);
      };
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <section className="relative flex h-screen min-h-0 flex-col items-center justify-center overflow-hidden bg-black">
      <video
        ref={bgVideoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center"
        style={{ marginTop: 380 }}
      >
        <h1
          className="leading-tight"
          style={{
            fontFamily: "'YDYoonche L', 'YDYoonche M', sans-serif",
            fontSize: "clamp(2.2rem, 7vw, 6.5rem)",
            color: "#fff",
            fontWeight: 300,
            letterSpacing: "-0.01em",
            lineHeight: 1.1,
          }}
        >
          <span style={gradientTextStyle}>The vision</span>
          <span style={gradientTextStyle}>of engineering</span>
          <div className="flex flex-wrap items-center justify-center gap-3 text-white">
            <span style={{ color: "#999" }}>is</span>
            <VideoIcon src={VIDEO_HUMAN} size={110} />
            <span>human</span>
            <span
              style={{
                color: "#999",
                position: "relative",
                top: "0.15em",
                marginLeft: "0.25em",
              }}
            >
              +
            </span>
            <VideoIcon src={VIDEO_AI} size={110} />
            <span>AI</span>
          </div>
        </h1>

        <p
          className="mt-4 max-w-xl px-2 text-center"
          style={{
            fontSize: "clamp(0.95rem, 2.2vw, 1.2rem)",
            color: "#ccc",
            lineHeight: 1.4,
            fontWeight: 400,
          }}
        >
          We help you map the talent you need, track the talent you have, and close your gaps to thrive
          in a GenAI world.
        </p>

        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center transition-all duration-300 hover:scale-[1.03] hover:shadow-[0px_6px_32px_8px_rgba(39,243,169,0.22)] active:scale-[0.98]"
          style={{
            padding: "12px 28px",
            background: "#000",
            boxShadow: "0px 6px 24px 6px rgba(39, 243, 169, 0.15)",
            borderRadius: 8,
            outline: "1px solid #30463C",
            outlineOffset: -1,
            border: "none",
            cursor: "pointer",
            gap: 10,
          }}
        >
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 400 }}>Join The Movement!</span>
        </button>
      </div>
    </section>
  );
}

export default HeroSection;
