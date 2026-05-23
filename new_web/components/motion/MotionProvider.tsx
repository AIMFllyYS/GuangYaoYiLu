"use client";

import { MotionConfig, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig
      reducedMotion={reduce ? "always" : "never"}
      transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionConfig>
  );
}
