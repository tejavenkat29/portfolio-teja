"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Counts up once, when it first enters the viewport. */
export function Counter({
  to,
  suffix = "",
  duration = 1.5,
  className,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [value, setValue] = React.useState(reduced ? to : 0);

  React.useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduced, to, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="tabular-nums">{value}</span>
      {suffix}
    </span>
  );
}

/** Animated progress bar used for skill levels. */
export function LevelBar({
  level,
  color = "var(--color-primary)",
  className,
  delay = 0,
}: {
  level: number;
  color?: string;
  className?: string;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className={`relative h-1 w-full overflow-hidden rounded-full bg-white/8 ${className ?? ""}`}
      role="progressbar"
      aria-valuenow={level}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          width: reduced || inView ? `${level}%` : "0%",
          background: `linear-gradient(to right, color-mix(in oklab, ${color} 55%, transparent), ${color})`,
          boxShadow: `0 0 12px -2px ${color}`,
          transition: reduced
            ? undefined
            : `width 1.15s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        }}
      />
    </div>
  );
}
