"use client";

import Hls from "hls.js";
import Link from "next/link";
import { useEffect, useRef } from "react";

const MUX_HLS_URL =
  "https://stream.mux.com/tLkHO1qZoaaQOUeVWo8hEBeGQfySP02EPS02BmnNFyXys.m3u8";

export function AtloomVideoHero() {
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
    <section
      className="hero meloma-hero-v2 meloma-video-hero"
      aria-label="Início"
    >
      <video
        ref={bgVideoRef}
        autoPlay
        loop
        muted
        playsInline
        className="meloma-video-hero__video"
        aria-hidden
      />
      <div className="meloma-video-hero__fade" aria-hidden />
      <div className="meloma-video-hero__fade meloma-video-hero__fade--side" aria-hidden />

      <div className="container meloma-video-hero__content-wrap">
        <div className="meloma-hero-shell meloma-video-hero__shell">
          <div className="hero-badge meloma-hero-reveal meloma-hero-reveal--1">
            <span className="dot" />
            Plataforma com IA de Recomendação
          </div>

          <h1 className="hero-title meloma-hero-reveal meloma-hero-reveal--2">
            Encontre o curso
            <br />
            <span className="highlight">perfeito para você</span>
          </h1>

          <p className="hero-subtitle meloma-hero-reveal meloma-hero-reveal--3">
            Nossa IA analisa seu perfil, interesses e objetivos para recomendar
            os cursos ideais. Motor de recomendação, teste vocacional e fluxo
            completo de matrícula do sistema atual — com visual renovado.
          </p>

          <div className="hero-cta-wrap meloma-hero-reveal meloma-hero-reveal--4">
            <Link href="/quiz" className="btn-hero">
              Descobrir meus cursos
              <span className="arrow">→</span>
            </Link>
            <Link href="/guias" className="hero-secondary-link">
              <span>Explorar guias</span>
            </Link>
          </div>

          <div className="hero-stats meloma-hero-reveal meloma-hero-reveal--5">
            <div className="hero-stat">
              <div className="hero-stat-value">IA Personalizada</div>
              <div className="hero-stat-label">recomendações precisas</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">Gratuito</div>
              <div className="hero-stat-label">para começar</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">Teste vocacional</div>
              <div className="hero-stat-label">
                perfil e recomendações no mesmo fluxo
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
