import type { Transition } from "framer-motion";

/**
 * Linguagem física única do site (design-system.md §4).
 * Tudo que se move usa estas molas; durações e a curva `--ease` (só para
 * opacidade e traços desenhados em CSS) ficam nos tokens de globals.css.
 */
export const spring = {
  /** Revelações e movimentos amplos: amortecida, sem overshoot. */
  gentle: { type: "spring", stiffness: 120, damping: 20, mass: 0.6 },
  /** Resposta a toque e marcadores: rápida, quase sem rebote. */
  snappy: { type: "spring", stiffness: 300, damping: 30 },
  /** Só a chegada do curso vencedor no clímax: o único rebote visível do site. */
  celebrate: { type: "spring", stiffness: 380, damping: 20, mass: 0.7 },
} satisfies Record<string, Transition>;
