"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import type { Project } from "@/lib/data/projects";
import { Icon } from "@/components/icons";

/**
 * The project "preview". Not a mock screenshot of a backend that has no UI —
 * a live schematic of the actual request path, built from the same architecture
 * data the detail tab renders, with a packet tracing the flow end to end.
 */
export function ProjectPreview({ project }: { project: Project }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reduced = useReducedMotion();

  // One representative node per stage — the spine of the system.
  const spine = React.useMemo(
    () =>
      project.architecture.stages.map((stage) => ({
        id: stage.id,
        stage: stage.label,
        node: stage.nodes[0],
      })),
    [project.architecture.stages],
  );

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#060a18]"
      style={{ ["--from" as string]: project.accentFrom, ["--to" as string]: project.accentTo }}
    >
      {/* Accent wash + grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.16]"
        style={{ background: `radial-gradient(120% 90% at 12% 0%, var(--from), transparent 62%)` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.13]"
        style={{ background: `radial-gradient(100% 80% at 100% 100%, var(--to), transparent 60%)` }}
      />
      <div aria-hidden className="absolute inset-0 dot-backdrop opacity-40" />

      {/* Window chrome */}
      <div className="relative flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-white/12" />
          <span className="size-2.5 rounded-full bg-white/12" />
          <span className="size-2.5 rounded-full bg-white/12" />
        </div>

        <span className="truncate font-mono text-[0.6875rem] text-white/45">
          {project.id}/architecture — request path
        </span>

        <span className="flex items-center gap-1.5 rounded-full border border-white/8 px-2 py-0.5">
          <span className="relative grid size-1.5 place-items-center">
            <span className="absolute size-1.5 rounded-full bg-success/50 animate-ping motion-reduce:animate-none" />
            <span className="size-1 rounded-full bg-success" />
          </span>
          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-white/55">
            {project.status}
          </span>
        </span>
      </div>

      {/* Spine */}
      <div className="relative p-4 sm:p-5">
        <ol className="space-y-0">
          {spine.map((entry, index) => (
            <li key={entry.id}>
              <div className="flex items-center gap-3">
                <span className="w-7 shrink-0 font-mono text-[0.625rem] tabular-nums text-white/25">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div
                  className={cn(
                    "flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2",
                    "transition-colors duration-400 hover:border-white/16",
                  )}
                >
                  {entry.node?.icon ? (
                    <span
                      className="grid size-7 shrink-0 place-items-center rounded-lg"
                      style={{ background: "color-mix(in oklab, var(--from) 16%, transparent)" }}
                    >
                      <Icon name={entry.node.icon} className="size-3.5 text-white/80" />
                    </span>
                  ) : null}

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.8125rem] font-medium text-white/85">
                      {entry.node?.label}
                    </span>
                    <span className="block truncate font-mono text-[0.625rem] text-white/35">
                      {entry.stage}
                      {entry.node?.sub ? ` · ${entry.node.sub}` : ""}
                    </span>
                  </span>

                  <span className="hidden shrink-0 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-white/25 sm:block">
                    {entry.stage}
                  </span>
                </div>
              </div>

              {index < spine.length - 1 ? (
                <div className="relative ml-[1.6rem] h-5" aria-hidden>
                  <span className="absolute inset-y-0 left-0 w-px bg-white/10" />
                  {inView && !reduced ? (
                    <motion.span
                      className="absolute left-0 size-1 -translate-x-1/2 rounded-full"
                      style={{
                        background: "var(--to)",
                        boxShadow: "0 0 8px 1px var(--to)",
                      }}
                      initial={{ top: 0, opacity: 0 }}
                      animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
                      transition={{
                        duration: 0.85,
                        repeat: Infinity,
                        repeatDelay: spine.length * 0.28,
                        delay: index * 0.28,
                        ease: "linear",
                      }}
                    />
                  ) : null}
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      {/* Footer meta */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-white/8 px-4 py-3">
        <span className="font-mono text-[0.625rem] text-white/40">{project.role}</span>
        <span className="font-mono text-[0.625rem] text-white/40">{project.period}</span>
      </div>
    </div>
  );
}
