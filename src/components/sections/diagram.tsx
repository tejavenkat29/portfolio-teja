"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { DiagramStage } from "@/lib/data/projects";
import { Icon } from "@/components/icons";

export const toneColor = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  accent: "var(--color-accent)",
  success: "var(--color-success)",
  neutral: "var(--color-muted)",
} as const;

export type Tone = keyof typeof toneColor;

/** One box in a flow. Same component in project architectures and the system-design spine. */
export function NodeChip({
  label,
  sub,
  icon,
  tone = "primary",
  className,
}: {
  label: string;
  sub?: string;
  icon?: string;
  tone?: Tone;
  className?: string;
}) {
  const color = toneColor[tone];

  return (
    <div
      className={cn(
        "group/node relative flex min-w-0 items-center gap-3 rounded-xl border px-3.5 py-2.5",
        "bg-[#070c1e]/70 backdrop-blur-sm",
        "transition-[transform,border-color,box-shadow] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-0.5",
        className,
      )}
      style={{
        borderColor: `color-mix(in oklab, ${color} 26%, transparent)`,
        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05)`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-400 group-hover/node:opacity-100"
        style={{ boxShadow: `0 0 0 1px color-mix(in oklab, ${color} 50%, transparent), 0 14px 34px -18px ${color}` }}
      />

      {icon ? (
        <span
          className="grid size-8 shrink-0 place-items-center rounded-lg"
          style={{ background: `color-mix(in oklab, ${color} 14%, transparent)` }}
        >
          <Icon name={icon} className="size-4" style={{ color }} />
        </span>
      ) : null}

      <span className="min-w-0">
        <span className="block truncate text-[0.8125rem] font-medium text-white/90">{label}</span>
        {sub ? (
          <span className="mt-0.5 block truncate font-mono text-[0.625rem] text-faint">{sub}</span>
        ) : null}
      </span>
    </div>
  );
}

/** Animated connector between two stages — a dashed rail with a travelling packet. */
export function Connector({ label, active = true }: { label?: string; active?: boolean }) {
  const reduced = useReducedMotion();

  return (
    <div className="relative flex h-11 items-center justify-center" aria-hidden>
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--color-primary)_45%,transparent),transparent)]" />

      {active && !reduced ? (
        <motion.span
          className="absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-accent"
          style={{ boxShadow: "0 0 10px 1px var(--color-accent)" }}
          initial={{ top: 0, opacity: 0 }}
          animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "linear", times: [0, 0.15, 0.85, 1] }}
        />
      ) : null}

      {label ? (
        <span className="relative ml-4 rounded-full border border-white/8 bg-void/80 px-2 py-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-faint">
          {label}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Renders a staged architecture. Each stage is a labelled band of nodes; the
 * packet animation only runs while the diagram is on screen.
 */
export function StageFlow({ stages, className }: { stages: DiagramStage[]; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15 });

  return (
    <div ref={ref} className={cn("relative", className)}>
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-white/6 bg-white/[0.015] p-4"
          >
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/70">
                {stage.label}
              </span>
              {stage.note ? (
                <span className="font-mono text-[0.625rem] text-faint">{stage.note}</span>
              ) : null}
            </div>

            <div
              className={cn(
                "grid gap-2.5",
                stage.nodes.length === 1 && "sm:grid-cols-1",
                stage.nodes.length === 2 && "sm:grid-cols-2",
                stage.nodes.length >= 3 && "sm:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {stage.nodes.map((node) => (
                <NodeChip
                  key={node.id}
                  label={node.label}
                  sub={node.sub}
                  icon={node.icon}
                  tone={(node.tone ?? "primary") as Tone}
                />
              ))}
            </div>
          </motion.div>

          {index < stages.length - 1 ? <Connector active={inView} /> : null}
        </React.Fragment>
      ))}
    </div>
  );
}
