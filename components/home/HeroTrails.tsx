"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { spring } from "@/lib/motion";
import { convergePath } from "./converge";

/**
 * Ponto de convergência no viewBox 600×640: o "próximo passo" do título.
 * O CSS posiciona o ponto e o pivô das camadas nas mesmas coordenadas
 * (`max(16cqw, 15cqh)` = 96 × escala do `slice`).
 */
const POINT = { x: 300, y: 96 };
const BASE_Y = 640;

/** Camada de fundo: caminhos distantes, finos e abertos. */
const FAR = [-440, -260, -20, 100, 215, 325, 445, 590, 800, 1000];
/** Camada da frente: mais nítida. A principal chega por último, junto com o ponto. */
const NEAR = [-160, -10, 110, 200, 262, 340, 430, 540, 720];
const MAIN = 262;

/** Desenha de fora para dentro: as trilhas se fecham sobre o ponto. */
function drawDelays(xs: number[], start: number, step: number) {
  const order = [...xs].sort((a, b) => Math.abs(b - POINT.x) - Math.abs(a - POINT.x));
  return new Map(order.map((x, index) => [x, start + index * step]));
}

const FAR_DELAY = drawDelays(FAR, 0, 45);
const NEAR_DELAY = drawDelays(NEAR, 200, 50);

function Tier({ id, xs, delays, stops }: {
  id: string;
  xs: number[];
  delays: Map<number, number>;
  /** Opacidade do traço da base até o ponto: as trilhas ganham nitidez ao convergir. */
  stops: [number, number][];
}) {
  return (
    <svg viewBox={`0 0 600 ${BASE_Y}`} preserveAspectRatio="xMidYMin slice" focusable="false">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1={BASE_Y} x2="0" y2={POINT.y}>
          {stops.map(([offset, opacity]) => (
            <stop key={offset} offset={offset} stopOpacity={opacity} />
          ))}
        </linearGradient>
      </defs>
      {xs.map((x) => (
        <path
          key={x}
          d={convergePath({ x, y: BASE_Y }, POINT)}
          pathLength={1}
          className={x === MAIN ? "atl-trail atl-trail--main" : "atl-trail"}
          stroke={x === MAIN ? undefined : `url(#${id})`}
          style={{ animationDelay: `${delays.get(x)}ms` }}
        />
      ))}
    </svg>
  );
}

/**
 * Motivo de "trilhas que convergem" (design-system.md §4.5), o único momento
 * ousado da página. O desenho e o ponto são CSS (rodam antes da hidratação);
 * o framer cuida só do balanço das camadas em torno do ponto e do parallax.
 */
export function HeroTrails() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // As camadas giram em torno do ponto: o destino fica, os caminhos balançam.
  // A de trás gira metade da da frente, o que dá profundidade sem desalinhar o ponto.
  const pointerX = useMotionValue(0);
  const lean = useSpring(pointerX, spring.gentle);
  const swayFar = useTransform(lean, [-1, 1], [0.9, -0.9]);
  const swayNear = useTransform(lean, [-1, 1], [1.8, -1.8]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);

  useEffect(() => {
    if (reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    const onPointerMove = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [reduceMotion, pointerX]);

  return (
    <div ref={ref} className="atl-trails" aria-hidden>
      <motion.div className="atl-trails-layer" style={{ y }}>
        <span className="atl-trails-light" />
        <motion.div className="atl-trails-tier atl-trails-tier--far" style={{ rotate: swayFar }}>
          <Tier id="atl-trail-far" xs={FAR} delays={FAR_DELAY} stops={[[0.3, 0.08], [1, 0.5]]} />
        </motion.div>
        <motion.div className="atl-trails-tier" style={{ rotate: swayNear }}>
          <Tier
            id="atl-trail-near"
            xs={NEAR}
            delays={NEAR_DELAY}
            stops={[[0.3, 0.2], [0.7, 0.62], [1, 1]]}
          />
        </motion.div>
        <span className="atl-point">
          <span className="atl-point-glow" />
          <span className="atl-point-ring" />
          <span className="atl-point-dot" />
        </span>
      </motion.div>
    </div>
  );
}
