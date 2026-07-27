"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

import { useIsTouch } from "@/lib/hooks/use-media-query";

/**
 * Magnetic wrapper: the child drifts a few pixels toward the cursor while it is
 * over the element, then springs back. Capped at `strength` px so it reads as
 * responsiveness rather than a gimmick.
 */
export function Magnetic({
  children,
  strength = 9,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 });

  if (reduced || isTouch) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy, display: "inline-flex" }}
      className={className}
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        x.set(Math.max(-1, Math.min(1, dx)) * strength);
        y.set(Math.max(-1, Math.min(1, dy)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
