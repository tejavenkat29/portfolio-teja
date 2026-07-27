"use client";

import * as React from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { archLayers, designPrinciples } from "@/lib/data/system-design";
import { Section, SectionHeader } from "@/components/layout/section";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/interactive/reveal";
import { toneColor, type Tone } from "@/components/sections/diagram";

/**
 * Spine geometry, defined once. The vertical connector, the off-path indent and
 * the elbow that joins them all derive from these two values — keeping them in
 * separate class strings is exactly how they drift out of alignment.
 *
 * SPINE_OFFSET lands between a row's index number and its icon.
 * The indent must exceed it, or a branch row would sit left of its own spine —
 * so below `sm` there is no indent at all and the rows stay flush.
 */
const SPINE_OFFSET = "2.85rem";
const SPINE_BRANCH_WIDTH = "4rem";
const SPINE_BRANCH_INDENT = "sm:pl-16";

export function SystemDesign() {
  const [selected, setSelected] = React.useState(archLayers[0]?.id ?? "");
  const spineRef = React.useRef<HTMLOListElement>(null);
  const inView = useInView(spineRef, { amount: 0.12 });
  const reduced = useReducedMotion();

  const active = archLayers.find((layer) => layer.id === selected) ?? archLayers[0];

  return (
    <Section id="architecture">
      <SectionHeader
        id="architecture"
        index="04"
        eyebrow="System Design"
        title="The request path I actually ship"
        lede="Not a generic diagram — the hops I build in practice, each annotated with the decision that puts it there. Select a layer to read the reasoning."
      />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-10">
        {/* ------------------------------------------------------------- */}
        {/* The spine                                                     */}
        {/* ------------------------------------------------------------- */}
        <Reveal>
          <GlassCard className="p-4 sm:p-6" glow={false}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/70">
                Client → Storage
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[0.625rem] text-faint">
                <span className="size-1.5 rounded-full bg-accent" />
                critical path
              </span>
            </div>

            <ol ref={spineRef} className="relative space-y-0">
              {archLayers.map((layer, index) => {
                const isActive = layer.id === selected;
                const color = toneColor[(layer.tone ?? "primary") as Tone];

                return (
                  <li key={layer.id}>
                    {/* The off-path indent lives on this wrapper, not on the button.
                        A margin on a w-full button would push its right edge past
                        the card; padding here shrinks the button instead, so every
                        row stays flush on the right. */}
                    <div className={cn("relative", layer.branch && SPINE_BRANCH_INDENT)}>
                      {/* Elbow: starts exactly on the spine and runs to the row */}
                      {layer.branch ? (
                        <span
                          aria-hidden
                          className="absolute top-1/2 hidden h-px sm:block"
                          style={{
                            left: SPINE_OFFSET,
                            width: `calc(${SPINE_BRANCH_WIDTH} - ${SPINE_OFFSET})`,
                            background: `linear-gradient(to right, color-mix(in oklab, ${color} 60%, transparent), color-mix(in oklab, ${color} 28%, transparent))`,
                          }}
                        />
                      ) : null}

                      <button
                        type="button"
                        onClick={() => setSelected(layer.id)}
                        aria-pressed={isActive}
                        className={cn(
                          "group relative flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left",
                          "transition-[border-color,background-color,transform] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          isActive
                            ? "border-white/18 bg-white/[0.06]"
                            : "border-white/8 bg-white/[0.015] hover:border-white/14 hover:bg-white/[0.035]",
                        )}
                        style={
                          isActive
                            ? { boxShadow: `0 0 0 1px color-mix(in oklab, ${color} 40%, transparent), 0 18px 44px -26px ${color}` }
                            : undefined
                        }
                      >
                        <span className="w-6 shrink-0 font-mono text-[0.625rem] tabular-nums text-white/25">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span
                          className="grid size-9 shrink-0 place-items-center rounded-xl"
                          style={{ background: `color-mix(in oklab, ${color} 15%, transparent)` }}
                        >
                          <Icon name={layer.icon} className="size-4" style={{ color }} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-[0.9375rem] font-semibold text-white">
                              {layer.label}
                            </span>
                            {layer.branch ? (
                              <span className="shrink-0 rounded border border-white/10 px-1 font-mono text-[0.5625rem] uppercase tracking-wide text-faint">
                                off-path
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-0.5 block truncate font-mono text-[0.625rem] text-faint">
                            {layer.sub}
                          </span>
                        </span>

                        {layer.latency ? (
                          <span className="hidden shrink-0 font-mono text-[0.625rem] text-white/45 sm:block">
                            {layer.latency}
                          </span>
                        ) : null}

                        <Icon
                          name="ChevronRight"
                          className={cn(
                            "size-4 shrink-0 transition-[transform,color] duration-400",
                            isActive ? "translate-x-0.5 text-white/70" : "text-white/20 group-hover:text-white/50",
                          )}
                        />
                      </button>
                    </div>

                    {/* Connector — always on the spine, so the main path reads as
                        one continuous line and off-path rows hang off it. */}
                    {index < archLayers.length - 1 ? (
                      <div className="relative h-6" style={{ marginLeft: SPINE_OFFSET }} aria-hidden>
                        <span className="absolute inset-y-0 left-0 w-px bg-white/10" />
                        {inView && !reduced ? (
                          <motion.span
                            className="absolute left-0 size-1.5 -translate-x-1/2 rounded-full bg-accent"
                            style={{ boxShadow: "0 0 10px 1px var(--color-accent)" }}
                            initial={{ top: 0, opacity: 0 }}
                            animate={{ top: ["0%", "100%"], opacity: [0, 1, 0] }}
                            transition={{
                              duration: 0.55,
                              repeat: Infinity,
                              repeatDelay: archLayers.length * 0.26,
                              delay: index * 0.26,
                              ease: "linear",
                            }}
                          />
                        ) : null}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </GlassCard>
        </Reveal>

        {/* ------------------------------------------------------------- */}
        {/* Reasoning panel + principles                                  */}
        {/* ------------------------------------------------------------- */}
        <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <Reveal delay={0.06}>
            <GlassCard className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active?.id}
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="grid size-11 place-items-center rounded-xl"
                      style={{
                        background: `color-mix(in oklab, ${toneColor[(active?.tone ?? "primary") as Tone]} 15%, transparent)`,
                      }}
                    >
                      <Icon
                        name={active?.icon ?? "Server"}
                        className="size-[1.15rem]"
                        style={{ color: toneColor[(active?.tone ?? "primary") as Tone] }}
                      />
                    </span>
                    <div>
                      <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-white">
                        {active?.label}
                      </h3>
                      <p className="mt-0.5 font-mono text-[0.6875rem] text-faint">{active?.sub}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                      Decision
                    </div>
                    <p className="text-[0.9375rem] leading-relaxed text-white/80">{active?.decision}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/6 pt-4">
                    {active?.tech.map((tech) => (
                      <Badge key={tech} variant="mono">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-6">
              <h3 className="eyebrow mb-5">Principles I hold across all of it</h3>
              <ul className="space-y-4">
                {designPrinciples.map((principle) => (
                  <li key={principle.title} className="flex gap-3">
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                      <Icon name={principle.icon} className="size-3.5 text-accent" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[0.875rem] font-semibold text-white">{principle.title}</div>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{principle.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
