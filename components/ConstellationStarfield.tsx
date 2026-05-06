"use client";

import { useEffect, useRef } from "react";

/**
 * Camada visual inspirada em “Constelação Neural” (referência Kimi):
 * partículas + linhas sutis + cores AURORA / STARDUST sobre VOID.
 * Respeita prefers-reduced-motion (quadro estático).
 */
export function ConstellationStarfield({
  className,
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rawCtx = canvas.getContext("2d");
    if (!rawCtx) return;
    const g: CanvasRenderingContext2D = rawCtx;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Star = {
      bx: number;
      by: number;
      x: number;
      y: number;
      r: number;
      tw: number;
      kind: 0 | 1 | 2;
    };

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    const t0 = performance.now();
    const mouse = { x: 0.5, y: 0.5 };

    function initStars() {
      const area = w * h;
      const count = Math.min(88, Math.max(48, Math.floor(area / 13500)));
      stars = [];
      for (let i = 0; i < count; i++) {
        const roll = Math.random();
        const kind: 0 | 1 | 2 = roll < 0.7 ? 0 : roll < 0.9 ? 1 : 2;
        stars.push({
          bx: Math.random() * w,
          by: Math.random() * h,
          x: 0,
          y: 0,
          r: kind === 2 ? 1 + Math.random() * 1 : 0.35 + Math.random() * 0.85,
          tw: Math.random() * Math.PI * 2,
          kind,
        });
      }
    }

    function resize() {
      const el = canvasRef.current;
      if (!el) return;
      const parent = el.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      el.width = w * dpr;
      el.height = h * dpr;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    }

    function onMove(e: MouseEvent) {
      const el = canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (inside) {
        mouse.x = (e.clientX - rect.left) / rect.width;
        mouse.y = (e.clientY - rect.top) / rect.height;
      } else {
        mouse.x += (0.5 - mouse.x) * 0.04;
        mouse.y += (0.5 - mouse.y) * 0.04;
      }
    }

    function drawFrame(now: number) {
      const t = (now - t0) * 0.001;
      g.clearRect(0, 0, w, h);

      const px = (mouse.x - 0.5) * 20;
      const py = (mouse.y - 0.5) * 20;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const drift = reduced ? 0 : Math.sin(t * 0.55 + s.tw) * 1.2;
        const driftY = reduced ? 0 : Math.cos(t * 0.48 + s.tw * 1.1) * 1.2;
        s.x = s.bx + px * (0.25 + (i % 7) * 0.06) + drift;
        s.y = s.by + py * (0.25 + (i % 5) * 0.07) + driftY;
      }

      const linkDist = Math.min(w, h) * 0.11;
      g.lineWidth = 0.55;
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist && d > 4) {
            const alpha = (1 - d / linkDist) * 0.28;
            g.strokeStyle = `rgba(45, 212, 191, ${alpha})`;
            g.beginPath();
            g.moveTo(a.x, a.y);
            g.lineTo(b.x, b.y);
            g.stroke();
          }
        }
      }

      for (const s of stars) {
        let base = "rgba(248, 250, 252, ";
        if (s.kind === 1) base = "rgba(45, 212, 191, ";
        if (s.kind === 2) base = "rgba(245, 166, 35, ";
        const pulse = reduced ? 0.55 : 0.38 + Math.sin(t * 2.2 + s.tw) * 0.28;
        g.fillStyle = `${base}${pulse})`;
        g.beginPath();
        g.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        g.fill();
      }

      if (!reduced) {
        raf = requestAnimationFrame(drawFrame);
      }
    }

    const parentEl = canvasRef.current?.parentElement;
    if (!parentEl) return;

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parentEl);
    window.addEventListener("mousemove", onMove, { passive: true });

    if (reduced) {
      drawFrame(performance.now());
    } else {
      raf = requestAnimationFrame(drawFrame);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
      role="presentation"
    />
  );
}
