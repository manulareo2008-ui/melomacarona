"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { spring } from "@/lib/motion";

/**
 * Com `prefers-reduced-motion`, o framer descarta transformações e mantém só
 * opacidade, e as cenas presas viram estáticas (via CSS).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={spring.gentle}>
      {children}
    </MotionConfig>
  );
}
