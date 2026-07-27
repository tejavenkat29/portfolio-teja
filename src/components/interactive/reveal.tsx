"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";


const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll reveal used across every section. One shared curve and distance keeps
 * the whole page feeling like a single document rather than a pile of widgets.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = "div",
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "span" | "article" | "header";
  once?: boolean;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) return <MotionTag className={className}>{children}</MotionTag>;

  return (
    <MotionTag
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE } },
};

/** Container that staggers its `RevealItem` children into view. */
export function RevealGroup({
  children,
  className,
  as = "div",
  amount = 0.18,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "section";
  amount?: number;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) return <MotionTag className={className}>{children}</MotionTag>;

  return (
    <MotionTag
      data-reveal
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduced) return <MotionTag className={className}>{children}</MotionTag>;

  return (
    <MotionTag data-reveal className={className} variants={staggerChild}>
      {children}
    </MotionTag>
  );
}
