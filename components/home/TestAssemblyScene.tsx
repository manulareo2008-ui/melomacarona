"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type Transition,
  type Variants,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { spring } from "@/lib/motion";
import { convergePath, type Point } from "./converge";
import { useMediaQuery } from "./useMediaQuery";

const STEPS = ["Área", "Nicho", "Formato e investimento", "Suas recomendações"] as const;
const LAST = STEPS.length - 1;

/** Quando a cena não prende (mesma media query do CSS em atloom-landing.css). */
const STATIC_QUERY =
  "(prefers-reduced-motion: reduce), (max-height: 619px), (max-width: 899px) and (max-height: 649px)";

/** Fração da rolagem da cena em que cada etapa começa. A última dura mais: é a recompensa. */
const STAGE_START = [0, 0.22, 0.46, 0.7];

function stageAt(progress: number) {
  let stage = 0;
  STAGE_START.forEach((start, index) => {
    if (progress >= start) stage = index;
  });
  return stage;
}

/* Perguntas e opções reais do teste (locales/pt-BR.json e lib/domain.ts). */
const AREAS = ["Tecnologia", "Saúde", "Humanas", "Artes & Design", "Negócios & Administração", "Engenharia"];
const NICHES = [
  "Programação e fundamentos de software",
  "Dados, analytics e aprendizado de máquina",
  "Design de interfaces, UX e produto",
  "Desenvolvimento web e aplicações front-end",
  "Infraestrutura, cloud e redes",
  "Cibersegurança, DevOps e automação",
];
const MODALITIES = ["Presencial", "Online", "Híbrido"];
const BUDGETS = ["Apenas cursos gratuitos", "Até R$ 100,00", "Até R$ 500,00", "Até R$ 1.000,00", "Sem limite"];

/** Pilares de lib/recommendation/scoring.ts, na ordem das perguntas e com o peso real. */
const PILLARS = [
  { key: "area", weight: 25 },
  { key: "niche", weight: 45 },
  { key: "modality", weight: 10 },
  { key: "price", weight: 20 },
] as const;
type Pillar = (typeof PILLARS)[number]["key"];
const WEIGHT = Object.fromEntries(PILLARS.map((pillar) => [pillar.key, pillar.weight])) as Record<
  Pillar,
  number
>;

/**
 * Respostas da demo na ordem em que entram no perfil, com o atraso após a etapa
 * abrir. Área e nicho já pontuam na prévia; formato e investimento pontuam no
 * fim, e são eles que viram a ordem do ranking.
 */
const PROFILE = [
  { slot: "Área", answer: "Tecnologia", pillar: "area", stage: 0, delay: 0.8 },
  { slot: "Nicho", answer: "Dados e IA", pillar: "niche", stage: 1, delay: 0.8 },
  { slot: "Formato", answer: "Online", pillar: "modality", stage: 2, delay: 0.75 },
  { slot: "Investimento", answer: "Até R$ 500", pillar: "price", stage: 2, delay: 1 },
] as const;

/** Etapa em que cada pilar entra na conta. */
const SCORED_AT: Record<Pillar, number> = { area: 0, niche: 1, modality: LAST, price: LAST };

/** Top 3 de scoring.ts para este perfil, com a nota (0–100) de cada pilar. */
const RESULTS = [
  {
    name: "Machine Learning (revisado CS229 · material aberto)",
    institution: "Stanford University",
    price: "Gratuito",
    pillars: { area: 100, niche: 70, modality: 100, price: 100 },
  },
  {
    name: "IBM Data Science (certificado profissional)",
    institution: "IBM",
    price: "R$ 350",
    pillars: { area: 100, niche: 90, modality: 100, price: 30 },
  },
  {
    name: "Power BI Completo — do básico ao avançado",
    institution: "Hashtag Treinamentos",
    price: "R$ 197",
    pillars: { area: 100, niche: 50, modality: 100, price: 61 },
  },
];

/** Mesma conta de computeAffinityScore, só com os pilares já respondidos. */
function affinity(pillars: Record<Pillar, number>, scored: Record<Pillar, boolean>) {
  const sum = PILLARS.reduce(
    (total, { key }) => (scored[key] ? total + (pillars[key] * WEIGHT[key]) / 100 : total),
    0,
  );
  return Math.round(sum);
}

const DEMO_SUMMARY =
  "Demonstração do teste. Área: Tecnologia. Nicho: dados, analytics e aprendizado de máquina. " +
  "Modalidade: online. Faixa de investimento: até R$ 500,00. A afinidade soma o peso de cada " +
  "resposta. Resultado: Machine Learning, da Stanford University, gratuito, 87% de afinidade; " +
  "IBM Data Science, da IBM, R$ 350, 82%; Power BI Completo, da Hashtag Treinamentos, R$ 197, 70%.";

/** A mesma curva do --ease (globals.css) para os traços desenhados. */
const DRAW: Transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };

const panelVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  shown: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...spring.gentle, staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const partVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: spring.gentle },
};

/** Entra com a mola suave (e um atraso, se houver); sai rápido e sem atraso. */
function enter(on: boolean, delay = 0): Transition {
  return on ? { ...spring.gentle, delay } : spring.snappy;
}

/** Onda única quando o ponto acende (a mesma do hero). Constantes: o framer não a repete a cada render. */
const RIPPLE = { opacity: [0.6, 0], scale: [0.8, 3.2] };
const RING_REST = { opacity: 0, scale: 0.8 };

/**
 * Celebração contida do clímax, uma vez por chegada: quando o vencedor bate a
 * afinidade final, a linha dele assenta com um leve rebote, o número dá um pulo
 * e o ponto solta uma segunda onda, no mesmo instante.
 */
const ARRIVAL = 1.5;
const POP = { scale: [1, 1.16, 1] };
const POP_REST = { scale: 1 };

type Phase = "past" | "active" | "next" | "future";

/** Folga entre a pergunta atual e o rótulo "A seguir" da próxima. */
const PEEK_GAP = 20;
/** Abaixo disso, a próxima pergunta nem aparece: seria só uma lasca. */
const PEEK_MIN = 40;

function Layer({
  phase,
  peekY,
  bodyRef,
  children,
}: {
  phase: Phase;
  peekY: number;
  bodyRef: Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  const target =
    phase === "past"
      ? { opacity: 0, y: -16 }
      : phase === "active"
        ? { opacity: 1, y: 0 }
        : phase === "next"
          ? { opacity: 0.5, y: peekY }
          : { opacity: 0, y: 24 };
  const transition =
    phase === "active" ? { ...spring.gentle, delay: 0.08 } : phase === "next" ? spring.gentle : spring.snappy;
  return (
    <motion.div className="atl-layer" initial={false} animate={target} transition={transition}>
      <motion.span
        className="atl-layer-next"
        initial={false}
        animate={{ opacity: phase === "next" ? 1 : 0 }}
        transition={spring.snappy}
      >
        A seguir
      </motion.span>
      <div ref={bodyRef}>{children}</div>
    </motion.div>
  );
}

function Option({
  label,
  chosen,
  answered,
  delay,
  row = false,
}: {
  label: string;
  /** É a opção que a demo escolhe. */
  chosen: boolean;
  /** A pergunta já foi respondida: destaca a escolhida e recua as demais. */
  answered: boolean;
  delay: number;
  row?: boolean;
}) {
  const radio = row ? <span className="atl-option-radio" /> : null;
  return (
    <motion.span
      className={row ? "atl-option atl-option--row" : "atl-option"}
      initial={false}
      animate={{ opacity: answered && !chosen ? 0.5 : 1 }}
      transition={enter(answered, delay)}
    >
      {radio}
      {label}
      {chosen && (
        <motion.span
          className="atl-option-on"
          initial={false}
          animate={{ opacity: answered ? 1 : 0, scale: answered ? 1 : 0.96 }}
          transition={answered ? { ...spring.snappy, delay } : spring.snappy}
        >
          {radio}
          {label}
        </motion.span>
      )}
    </motion.span>
  );
}

/** Conta até o valor por mola (sem overshoot: a gentle é sobreamortecida). */
function Count({ value, delay }: { value: number; delay: number }) {
  const reduceMotion = useReducedMotion();
  const count = useMotionValue(value);
  const text = useTransform(count, (latest) => Math.round(latest).toString());
  const delayRef = useRef(delay);
  delayRef.current = delay;

  useEffect(() => {
    if (reduceMotion) {
      count.set(value);
      return;
    }
    const rising = value > count.get();
    const controls = animate(count, value, rising ? { ...spring.gentle, delay: delayRef.current } : spring.snappy);
    return () => controls.stop();
  }, [value, reduceMotion, count]);

  return <motion.span>{text}</motion.span>;
}

/** Posição pelo layout (offset*), que ignora transforms em andamento. */
function offsetWithin(element: HTMLElement, ancestor: HTMLElement): Point {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = element;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

type Geometry = {
  width: number;
  height: number;
  from: Point[];
  to: Point;
  zone: number;
  bodies: number[];
  /** Altura do rótulo "A seguir", que fica acima da pergunta esmaecida. */
  label: number;
};

/** As linhas mais distantes do ponto chegam primeiro, como no hero. */
function drawOrder(geometry: Geometry) {
  const byDistance = geometry.from
    .map((point, index) => ({ index, distance: Math.abs(point.x - geometry.to.x) }))
    .sort((a, b) => b.distance - a.distance);
  return geometry.from.map((_, index) => byDistance.findIndex((item) => item.index === index));
}

/**
 * Cena presa "veja o teste montar sua trilha" (design-system.md §4.1).
 * A rolagem escolhe a etapa; cada etapa anima por mola, então rolar para cima
 * desfaz. Só transform e opacity (e o traço das linhas, que é pintura de SVG);
 * nenhum listener segura o scroll.
 */
export function TestAssemblyScene() {
  const trackRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const beaconRef = useRef<HTMLSpanElement>(null);
  const slotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [scrollStage, setScrollStage] = useState(0);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const reduceMotion = useReducedMotion();

  // Movimento reduzido ou tela baixa demais para prender: mostra direto o resultado.
  const isStatic = useMediaQuery(STATIC_QUERY);
  const stage = isStatic ? LAST : scrollStage;
  const live = useInView(panelRef, { once: true, amount: 0.35 });
  const showResults = stage === LAST;
  const answered = (question: number) => stage > question || (stage === question && live);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (progress) => setScrollStage(stageAt(progress)));
  useEffect(() => {
    setScrollStage(stageAt(scrollYProgress.get()));
  }, [scrollYProgress]);

  const measure = useCallback(() => {
    const panel = panelRef.current;
    const beacon = beaconRef.current;
    const zone = zoneRef.current;
    if (!panel || !beacon || !zone) return;
    const from = slotRefs.current.map((slot) => {
      if (!slot) return { x: 0, y: 0 };
      const { x, y } = offsetWithin(slot, panel);
      return { x: x + slot.offsetWidth / 2, y: y + slot.offsetHeight };
    });
    setGeometry({
      width: panel.offsetWidth,
      height: panel.offsetHeight,
      from,
      to: offsetWithin(beacon, panel),
      zone: zone.clientHeight,
      bodies: bodyRefs.current.map((body) => body?.offsetHeight ?? 0),
      label: zone.querySelector<HTMLElement>(".atl-layer-next")?.offsetHeight ?? 0,
    });
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (panelRef.current) observer.observe(panelRef.current);
    // A largura das fichas e a altura das perguntas dependem da fonte carregada.
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [measure]);

  /* Perguntas: a atual, a anterior saindo por cima e a próxima esmaecida, se couber. */
  const peekYOf = (index: number) =>
    geometry && index > 0 ? geometry.bodies[index - 1] + PEEK_GAP + geometry.label : 24;
  const phaseOf = (index: number): Phase => {
    if (index < stage) return "past";
    if (index === stage) return "active";
    if (index === stage + 1 && geometry) {
      if (peekYOf(index) <= geometry.zone - PEEK_MIN) return "next";
    }
    return "future";
  };
  const peeking = [1, 2].some((index) => phaseOf(index) === "next");

  /* Prévia: cada pilar pontua quando a resposta entra; o ranking reordena por mola. */
  const scored: Record<Pillar, boolean> = {
    area: answered(0),
    niche: answered(1),
    modality: showResults,
    price: showResults,
  };
  // Só atrasa quando a etapa atual é a que pontua (rolando direto, entra junto com a ficha).
  const scoreDelay = (pillar: Pillar) => (stage !== SCORED_AT[pillar] ? 0 : showResults ? 0.9 : 1);
  const rowDelay = (index: number) => (stage === 0 || stage === 1 ? 1 : showResults ? 0.9 + index * 0.08 : 0);
  const values = RESULTS.map((course) => affinity(course.pillars, scored));
  const order = values
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value || a.index - b.index)
    .map((item) => item.index);

  const bodyRef = (index: number) => (element: HTMLDivElement | null) => {
    bodyRefs.current[index] = element;
  };

  const lineOrder = geometry ? drawOrder(geometry) : [];
  const instant = reduceMotion ? { duration: 0 } : null;

  return (
    <section ref={trackRef} className="atl-scene" aria-labelledby="scene-title">
      <div className="atl-scene-sticky">
        <div className="atl-container atl-scene-grid">
          <div className="atl-scene-copy">
            <h2 id="scene-title" className="atl-h2 atl-scene-title">
              Veja o teste montar sua trilha
            </h2>
            <p className="sr-only">{DEMO_SUMMARY}</p>

            <div className="atl-scene-steps" aria-hidden>
              <motion.span
                className="atl-scene-marker"
                initial={false}
                animate={{ y: `${stage * 100}%` }}
                transition={spring.snappy}
              />
              {STEPS.map((label, index) => (
                <motion.span
                  key={label}
                  className="atl-scene-step"
                  initial={false}
                  animate={{ opacity: index === stage ? 1 : 0.5 }}
                  transition={spring.snappy}
                >
                  {label}
                </motion.span>
              ))}
            </div>

            <div className="atl-scene-progress" aria-hidden>
              <div className="atl-scene-progress-track">
                <motion.span
                  className="atl-scene-progress-fill"
                  initial={false}
                  animate={{ x: `${stage * 100}%` }}
                  transition={spring.snappy}
                />
              </div>
              <div className="atl-scene-progress-labels">
                {STEPS.map((label, index) => (
                  <motion.span
                    key={label}
                    initial={false}
                    animate={{ opacity: index === stage ? 1 : 0 }}
                    transition={spring.snappy}
                  >
                    {label}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          <motion.div
            ref={panelRef}
            className="atl-panel"
            aria-hidden
            variants={panelVariants}
            initial="hidden"
            animate={live ? "shown" : "hidden"}
          >
            {/* Clímax: as respostas convergem no ponto, com a curva do hero.
                A espessura de cada linha é o peso do pilar na afinidade. */}
            {geometry && (
              <svg
                className="atl-links"
                width={geometry.width}
                height={geometry.height}
                viewBox={`0 0 ${geometry.width} ${geometry.height}`}
                focusable="false"
              >
                {geometry.from.map((point, index) => (
                  <motion.path
                    key={PROFILE[index].slot}
                    d={convergePath(point, geometry.to)}
                    className={PROFILE[index].pillar === "niche" ? "atl-link atl-link--main" : "atl-link"}
                    strokeWidth={0.6 + WEIGHT[PROFILE[index].pillar] / 25}
                    initial={false}
                    animate={{ pathLength: showResults ? 1 : 0, opacity: showResults ? 1 : 0 }}
                    transition={
                      instant ??
                      (showResults ? { ...DRAW, delay: 0.08 + lineOrder[index] * 0.06 } : spring.snappy)
                    }
                  />
                ))}
              </svg>
            )}

            <motion.div className="atl-profile" variants={partVariants}>
              <p className="atl-panel-label">Seu perfil</p>
              <div className="atl-slots">
                {PROFILE.map((item, index) => {
                  const filled = answered(item.stage);
                  const transition = enter(filled, stage === item.stage ? item.delay : 0);
                  return (
                    <span
                      key={item.slot}
                      ref={(element) => {
                        slotRefs.current[index] = element;
                      }}
                      className="atl-slot"
                    >
                      <motion.span
                        className="atl-slot-label"
                        initial={false}
                        animate={{ opacity: filled ? 0 : 1 }}
                        transition={transition}
                      >
                        {item.slot}
                      </motion.span>
                      <span className="atl-slot-size">{item.answer}</span>
                      <motion.span
                        className="atl-slot-chip"
                        initial={false}
                        animate={{ opacity: filled ? 1 : 0, y: filled ? 0 : 6, scale: filled ? 1 : 0.92 }}
                        transition={transition}
                      >
                        {item.answer}
                      </motion.span>
                    </span>
                  );
                })}
              </div>
            </motion.div>

            <motion.div ref={zoneRef} className="atl-stage" variants={partVariants}>
              <Layer phase={phaseOf(0)} peekY={peekYOf(0)} bodyRef={bodyRef(0)}>
                <p className="atl-q">Qual área geral você deseja explorar?</p>
                <div className="atl-options">
                  {AREAS.map((area) => (
                    <Option key={area} label={area} chosen={area === "Tecnologia"} answered={answered(0)} delay={0.35} />
                  ))}
                </div>
              </Layer>

              <Layer phase={phaseOf(1)} peekY={peekYOf(1)} bodyRef={bodyRef(1)}>
                <p className="atl-q">Em qual nicho de Tecnologia você mais se identifica?</p>
                <div className="atl-options atl-options--rows">
                  {NICHES.map((niche) => (
                    <Option
                      key={niche}
                      label={niche}
                      chosen={niche === NICHES[1]}
                      answered={answered(1)}
                      delay={0.35}
                      row
                    />
                  ))}
                </div>
              </Layer>

              <Layer phase={phaseOf(2)} peekY={peekYOf(2)} bodyRef={bodyRef(2)}>
                <p className="atl-q">Modalidade</p>
                <div className="atl-options">
                  {MODALITIES.map((modality) => (
                    <Option
                      key={modality}
                      label={modality}
                      chosen={modality === "Online"}
                      answered={answered(2)}
                      delay={0.35}
                    />
                  ))}
                </div>
                <p className="atl-q atl-q--next">Faixa de investimento</p>
                <div className="atl-options">
                  {BUDGETS.map((budget) => (
                    <Option
                      key={budget}
                      label={budget}
                      chosen={budget === "Até R$ 500,00"}
                      answered={answered(2)}
                      delay={0.6}
                    />
                  ))}
                </div>
              </Layer>

              <motion.span
                className="atl-stage-fade"
                initial={false}
                animate={{ opacity: peeking ? 1 : 0 }}
                transition={spring.snappy}
              />
            </motion.div>

            <motion.div className="atl-ranking" variants={partVariants}>
              <span ref={beaconRef} className="atl-beacon">
                <motion.span
                  className="atl-beacon-ring"
                  initial={false}
                  animate={showResults ? RIPPLE : RING_REST}
                  transition={instant ?? (showResults ? { duration: 1.1, ease: DRAW.ease, delay: 0.6 } : spring.snappy)}
                />
                <motion.span
                  className="atl-beacon-ring"
                  initial={false}
                  animate={showResults ? RIPPLE : RING_REST}
                  transition={instant ?? (showResults ? { duration: 1.3, ease: DRAW.ease, delay: ARRIVAL } : spring.snappy)}
                />
                <motion.span
                  className="atl-beacon-dot"
                  initial={false}
                  animate={{ opacity: showResults ? 1 : 0, scale: showResults ? 1 : 0.6 }}
                  transition={showResults ? { ...spring.snappy, delay: 0.55 } : spring.snappy}
                />
              </span>

              <div className="atl-ranking-head">
                <p className="atl-ranking-title">
                  <motion.span initial={false} animate={{ opacity: showResults ? 0 : 1 }} transition={spring.snappy}>
                    Prévia da sua lista
                  </motion.span>
                  <motion.span
                    initial={false}
                    animate={{ opacity: showResults ? 1 : 0 }}
                    transition={enter(showResults, 0.7)}
                  >
                    Cursos selecionados para você
                  </motion.span>
                </p>
                <span className="atl-ranking-unit">Afinidade</span>
              </div>

              <ol className="atl-courses">
                {RESULTS.map((course, index) => {
                  const rank = order.indexOf(index);
                  const top = showResults && rank === 0;
                  return (
                    <motion.li
                      key={course.name}
                      className="atl-course"
                      initial={false}
                      animate={{ y: `${rank * 100}%` }}
                      transition={{ ...spring.gentle, delay: rowDelay(index) + 0.05 }}
                    >
                      <motion.span
                        className="atl-course-top"
                        initial={false}
                        animate={{ opacity: top ? 1 : 0, scale: top ? 1 : 0.94 }}
                        transition={top ? { ...spring.celebrate, delay: ARRIVAL } : spring.snappy}
                      />
                      <motion.span
                        className="atl-course-name"
                        initial={false}
                        animate={{ opacity: showResults ? 1 : 0.62 }}
                        transition={enter(showResults, 0.85 + index * 0.08)}
                      >
                        {course.name}
                      </motion.span>
                      <span className="atl-course-meta">
                        <span>{course.institution}</span>
                        <span>Online</span>
                        <span className="atl-course-price">{course.price}</span>
                        <motion.span
                          className="atl-course-badge"
                          initial={false}
                          animate={{ opacity: top ? 1 : 0, x: top ? 0 : -6 }}
                          transition={top ? { ...spring.snappy, delay: ARRIVAL + 0.08 } : spring.snappy}
                        >
                          Maior afinidade
                        </motion.span>
                      </span>
                      <motion.span
                        className="atl-course-score"
                        initial={false}
                        animate={{ opacity: showResults ? 1 : 0.55, scale: showResults ? 1 : 0.8 }}
                        transition={enter(showResults, 0.85 + index * 0.08)}
                      >
                        <motion.span
                          className="atl-course-score-pop"
                          initial={false}
                          animate={top ? POP : POP_REST}
                          transition={top ? { duration: 0.5, times: [0, 0.35, 1], ease: DRAW.ease, delay: ARRIVAL } : spring.snappy}
                        >
                          <Count value={values[index]} delay={rowDelay(index)} />
                          <span className="atl-course-score-unit">%</span>
                        </motion.span>
                      </motion.span>
                      <span className="atl-course-bar">
                        {PILLARS.map(({ key, weight }) => (
                          <span key={key} className="atl-seg" style={{ flexGrow: weight }}>
                            <motion.span
                              className="atl-seg-fill"
                              initial={false}
                              animate={{ scaleX: scored[key] ? course.pillars[key] / 100 : 0 }}
                              transition={enter(scored[key], scoreDelay(key) + (showResults ? index * 0.08 : 0))}
                            />
                          </span>
                        ))}
                      </span>
                    </motion.li>
                  );
                })}
              </ol>

              <p className="atl-ranking-note">
                Cada trecho da barra é uma resposta: área, nicho, formato e investimento.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
