"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Cycles the role titles in place. The first title is rendered on the server so
 * the headline never arrives empty, and the list is exposed to assistive tech as
 * static text instead of an announcing live region.
 */
export function RotatingRole({ roles, className }: { roles: readonly string[]; className?: string }) {
  const [index, setIndex] = React.useState(0);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced || roles.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), 2900);
    return () => window.clearInterval(id);
  }, [reduced, roles.length]);

  return (
    <span className={cn("relative inline-flex items-center", className)}>
      <span className="sr-only">{roles.join(" · ")}</span>

      <span aria-hidden className="relative inline-flex h-[1.35em] items-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={roles[index]}
            initial={reduced ? false : { y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={reduced ? undefined : { y: "-100%", opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block whitespace-nowrap text-gradient-accent"
          >
            {roles[index]}
          </motion.span>
        </AnimatePresence>
      </span>

      <span
        aria-hidden
        className="ml-1 inline-block h-[1.05em] w-[2px] translate-y-[0.08em] bg-accent animate-caret motion-reduce:animate-none"
      />
    </span>
  );
}
