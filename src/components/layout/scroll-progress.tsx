"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A single hairline at the very top of the viewport. No numbers, no chrome. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: width }}
      className="fixed inset-x-0 top-0 z-100 h-px origin-left bg-[linear-gradient(to_right,var(--color-primary),var(--color-secondary),var(--color-accent))]"
    />
  );
}
