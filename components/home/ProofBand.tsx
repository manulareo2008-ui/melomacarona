"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { spring } from "@/lib/motion";
import type { ProofFacts } from "./catalogFacts";

/**
 * Sobe uma vez ao entrar na tela. O HTML do servidor já traz o valor final
 * (sem JS, quem lê vê o número certo); só zera se ainda estiver fora da tela.
 */
function Counter({ to, delay }: { to: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const value = useMotionValue(to);
  const text = useTransform(value, (latest) => Math.round(latest).toString());

  useEffect(() => {
    const element = ref.current;
    if (reduceMotion || !element) return;
    const { top } = element.getBoundingClientRect();
    if (top > window.innerHeight) value.set(0);
  }, [reduceMotion, value]);

  useEffect(() => {
    if (!inView || reduceMotion || value.get() === to) return;
    const controls = animate(value, to, { ...spring.gentle, delay });
    return () => controls.stop();
  }, [inView, reduceMotion, to, value, delay]);

  return (
    <span ref={ref} className="atl-stat-number" style={{ minWidth: `${String(to).length}ch` }}>
      <motion.span aria-hidden>{text}</motion.span>
      <span className="sr-only">{to}</span>
    </span>
  );
}

/** Números calculados do catálogo real (components/home/catalogFacts.ts). */
export function ProofBand({ facts }: { facts: ProofFacts }) {
  const stats = [
    { value: facts.courses, label: "cursos avaliados manualmente" },
    { value: facts.free, label: "deles são gratuitos" },
    { value: facts.areas, label: "áreas de conhecimento" },
    { value: 2, unit: "min", label: "para fazer o teste" },
  ];

  return (
    <section className="atl-section" aria-labelledby="proof-title">
      <div className="atl-container atl-proof">
        <div className="atl-proof-intro">
          <h2 id="proof-title" className="atl-h2 atl-proof-title">
            Curadoria humana de cursos profissionalizantes
          </h2>
          <p className="atl-section-lede">
            Cada curso passa por avaliação manual antes de entrar nas recomendações.
          </p>

          <p className="atl-proof-inst">
            Há cursos de {facts.institutions} universidades, escolas e empresas de tecnologia no
            catálogo.
          </p>
        </div>

        <div className="atl-proof-facts">
          <ul className="atl-stats">
            {stats.map((stat, index) => (
              <li key={stat.label} className="atl-stat">
                <span className="atl-stat-value">
                  {/* Em cascata, na ordem de leitura: a contagem acompanha o olho. */}
                  <Counter to={stat.value} delay={index * 0.08} />
                  {stat.unit && <span className="atl-stat-unit"> {stat.unit}</span>}
                </span>
                <span className="atl-stat-label">{stat.label}</span>
              </li>
            ))}
          </ul>

          <p className="atl-proof-note">
            Entre os cursos há opções gratuitas e pagas, e no teste você escolhe a faixa de
            investimento.
          </p>
        </div>

        <p className="atl-proof-partner">
          Instituições de ensino podem colocar seus cursos na frente de quem realmente procura.{" "}
          <Link href="/parcerias" className="atl-link-quiet">
            Sou uma instituição
          </Link>
        </p>
      </div>
    </section>
  );
}
