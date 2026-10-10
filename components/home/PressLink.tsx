"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ComponentProps } from "react";
import { spring } from "@/lib/motion";

const MotionLink = motion.create(Link);

const PRESS = { scale: 0.97 };
/** Botões sobem 2px no hover e afundam no clique: a mesma mola nos dois sentidos. */
const LIFT = { y: -2 };

/**
 * Link com resposta física: encolhe por mola no pointer-down (interrompível).
 * Com `lift`, também sobe no hover (o framer ignora hover vindo de toque).
 */
export function PressLink({
  whileTap = PRESS,
  transition = spring.snappy,
  lift = false,
  ...props
}: ComponentProps<typeof MotionLink> & { lift?: boolean }) {
  return (
    <MotionLink
      whileTap={whileTap}
      whileHover={lift ? LIFT : undefined}
      transition={transition}
      {...props}
    />
  );
}
