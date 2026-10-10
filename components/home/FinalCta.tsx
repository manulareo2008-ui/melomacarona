"use client";

import { motion, type Variants } from "framer-motion";
import { spring } from "@/lib/motion";
import { PressLink } from "./PressLink";

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  shown: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...spring.gentle, staggerChildren: 0.05, delayChildren: 0.06 },
  },
};

const partVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: spring.gentle },
};

/** Um dos dois objetos elevados da página, com o painel da cena (design-system.md §3). */
export function FinalCta() {
  return (
    <section className="atl-final" id="quiz" aria-labelledby="final-title">
      <div className="atl-container">
        <motion.div
          className="atl-final-card"
          variants={cardVariants}
          initial="hidden"
          whileInView="shown"
          viewport={{ once: true, amount: 0.4 }}
        >
          <motion.h2 id="final-title" className="atl-h2" variants={partVariants}>
            Leva menos de 2 minutos.
            <br />E pode mudar a direção da sua carreira.
          </motion.h2>
          <motion.div variants={partVariants}>
            <PressLink href="/quiz" className="atl-btn atl-final-btn" lift>
              Fazer o teste
            </PressLink>
          </motion.div>
          <motion.p className="atl-final-note" variants={partVariants}>
            O teste é gratuito.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
