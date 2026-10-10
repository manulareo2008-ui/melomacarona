"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { spring } from "@/lib/motion";

const STEPS = [
  {
    title: "Mapeie seu perfil",
    description:
      "Responda perguntas rápidas sobre seus objetivos, nível de experiência, disponibilidade e orçamento.",
  },
  {
    title: "Afinidade calculada",
    description:
      "Nosso sistema combina seu perfil com cursos avaliados manualmente, encontrando alinhamento real entre o que você busca e o que cada curso entrega.",
  },
  {
    title: "Comece a jornada",
    description:
      "Receba recomendações personalizadas com justificativas claras e links diretos para matrícula.",
  },
] as const;

/**
 * A linha que liga 1 → 2 → 3 é desenhada pela rolagem (é a sequência real do
 * teste). Horizontal no desktop, vertical no mobile; cada nó acende quando a
 * linha chega nele.
 */
export function HowItWorks() {
  const listRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const layout = useRef({ horizontal: true, stops: [0, 0.5, 1] });
  const [reached, setReached] = useState(0);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });

  // Onde cada nó fica ao longo da linha (0–1); recalculado só quando o layout muda.
  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const horizontal = rail.offsetWidth >= rail.offsetHeight;
    const length = horizontal ? rail.offsetWidth : rail.offsetHeight;
    const stops = nodeRefs.current.map((node) => {
      if (!node || length === 0) return 0;
      const center = horizontal
        ? node.offsetLeft + node.offsetWidth / 2 - rail.offsetLeft
        : node.offsetTop + node.offsetHeight / 2 - rail.offsetTop;
      return Math.min(1, Math.max(0, center / length));
    });
    layout.current = { horizontal, stops };
  }, []);

  const paint = useCallback(
    (progress: number) => {
      const { horizontal, stops } = layout.current;
      if (fillRef.current && !reduceMotion) {
        // Escreve o transform direto: nada de re-render a cada quadro.
        fillRef.current.style.transform = horizontal ? `scaleX(${progress})` : `scaleY(${progress})`;
      }
      setReached(progress <= 0 ? 0 : stops.filter((stop) => progress >= stop - 0.02).length);
    },
    [reduceMotion]
  );

  useEffect(() => {
    measure();
    paint(scrollYProgress.get());
    const observer = new ResizeObserver(() => {
      measure();
      paint(scrollYProgress.get());
    });
    if (listRef.current) observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [measure, paint, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", paint);

  const lit = reduceMotion ? STEPS.length : reached;

  return (
    <section className="atl-section" id="como-funciona" aria-labelledby="how-title">
      <div className="atl-container">
        <h2 id="how-title" className="atl-h2">
          Três etapas para mapear seu caminho
        </h2>
        <p className="atl-section-lede">
          Um processo simples e direto para encontrar as melhores opções para você.
        </p>

        <div ref={listRef} className="atl-steps">
          <div ref={railRef} className="atl-steps-rail" aria-hidden>
            <span ref={fillRef} className="atl-steps-fill" />
          </div>
          <ol className="atl-steps-list">
            {STEPS.map((step, index) => {
              const on = index < lit;
              return (
                <li key={step.title} className="atl-step">
                  <span
                    ref={(element) => {
                      nodeRefs.current[index] = element;
                    }}
                    className="atl-step-node"
                    aria-hidden
                  >
                    {index + 1}
                    <motion.span
                      className="atl-step-node-on"
                      initial={false}
                      animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.85 }}
                      transition={spring.snappy}
                    >
                      {index + 1}
                    </motion.span>
                  </span>
                  <div>
                    <h3 className="atl-h3">{step.title}</h3>
                    <p className="atl-step-desc">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
