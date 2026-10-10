"use client";

import { AnimatePresence, motion, useInView, type Variants } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconArrowUpRight } from "@/components/AtloomIcons";
import { spring } from "@/lib/motion";
import type { AreaSummary } from "./catalogFacts";
import { PressLink } from "./PressLink";

const listVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.04 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  shown: { opacity: 1, y: 0, transition: spring.gentle },
};

/** A faixa "pousa" na primeira área depois que a lista termina de entrar. */
const MARK_LANDING = 0.38;

type Mark = { top: number[]; height: number };

/**
 * Lista tipográfica de áreas (não um kit de cards). Com mouse, a área ativa
 * (hover ou foco) ganha uma faixa que desliza por mola e alimenta a prévia do
 * catálogo na coluna esquerda; no toque, a contagem fica sempre visível na linha.
 */
export function AreaList({ areas }: { areas: AreaSummary[] }) {
  const [active, setActive] = useState(0);
  const [mark, setMark] = useState<Mark | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const revealed = useInView(listRef, { once: true, amount: 0.3 });

  // Posições pelo layout (offset*), que ignoram o y da entrada em andamento.
  const measure = useCallback(() => {
    const rows = rowRefs.current.filter((row): row is HTMLLIElement => row !== null);
    if (!rows.length) return;
    setMark({ top: rows.map((row) => row.offsetTop), height: rows[0].offsetHeight - 1 });
  }, []);

  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    if (listRef.current) observer.observe(listRef.current);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [measure]);

  const current = areas[active];

  return (
    <section className="atl-section atl-section--sunk" id="categorias" aria-labelledby="areas-title">
      <div className="atl-container atl-areas">
        <div className="atl-areas-intro">
          <h2 id="areas-title" className="atl-h2">
            Onde você quer chegar?
          </h2>
          <p className="atl-section-lede">
            Clique em uma área para iniciar o quiz já filtrado pelo seu interesse.
          </p>

          {/* Complemento visual da linha ativa; contagem e preço já estão no nome de cada link. */}
          <motion.div
            className="atl-area-preview"
            aria-hidden
            initial={false}
            animate={{ opacity: revealed ? 1 : 0 }}
            transition={{ ...spring.gentle, delay: revealed ? MARK_LANDING : 0 }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={current.slug}
                className="atl-area-preview-body"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={spring.snappy}
              >
                <p className="atl-area-preview-label">O teste começa no nicho</p>
                <p className="atl-area-preview-niche">{current.niche}</p>
                <ul className="atl-area-examples">
                  {current.examples.map((course) => (
                    <li key={course.name} className="atl-area-example">
                      <span className="atl-area-example-name">{course.name}</span>
                      <span className="atl-area-example-meta">
                        <span>{course.institution}</span>
                        <span>{course.price}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                {current.more > 0 && (
                  <p className="atl-area-more">
                    e mais {current.more} {current.more === 1 ? "curso" : "cursos"} no catálogo
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.ul
          ref={listRef}
          className="atl-area-list"
          variants={listVariants}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.3 }}
        >
          {mark && (
            <motion.span
              className="atl-area-mark"
              aria-hidden
              style={{ height: mark.height }}
              initial={false}
              animate={{
                y: mark.top[active] ?? 0,
                opacity: revealed ? 1 : 0,
                scaleX: revealed ? 1 : 0.6,
              }}
              transition={{
                y: spring.snappy,
                default: { ...spring.gentle, delay: revealed ? MARK_LANDING : 0 },
              }}
            />
          )}
          {areas.map((area, index) => (
            <motion.li
              key={area.slug}
              ref={(element) => {
                rowRefs.current[index] = element;
              }}
              variants={rowVariants}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setActive(index);
              }}
            >
              <PressLink
                href={`/quiz?tema=${area.slug}`}
                className="atl-area"
                data-active={index === active}
                onFocus={() => setActive(index)}
                whileTap={{ scale: 0.985 }}
              >
                <span className="atl-area-name">{area.name}</span>
                {area.summary && (
                  <span className="atl-area-meta">
                    <span className="sr-only">, </span>
                    {area.summary}
                  </span>
                )}
                <span className="sr-only">: fazer o teste nesta área</span>
                <span className="atl-area-icon" aria-hidden>
                  <IconArrowUpRight size={22} />
                </span>
              </PressLink>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
