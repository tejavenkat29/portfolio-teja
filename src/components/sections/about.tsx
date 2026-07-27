"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";
import { aboutFacts, capabilities, story } from "@/lib/data/about";
import { Section, SectionHeader } from "@/components/layout/section";
import { GlassCard } from "@/components/ui/card";
import { Icon } from "@/components/icons";
import { RevealGroup, RevealItem, Reveal } from "@/components/interactive/reveal";

const toneMap = {
  primary: { text: "text-[#c7ccff]", ring: "var(--color-primary)" },
  secondary: { text: "text-[#ddd0ff]", ring: "var(--color-secondary)" },
  accent: { text: "text-[#a8ecff]", ring: "var(--color-accent)" },
  success: { text: "text-[#a7f3c4]", ring: "var(--color-success)" },
} as const;

export function About() {
  const trackRef = React.useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 78%", "end 55%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section id="about">
      <SectionHeader
        id="about"
        index="01"
        eyebrow="About"
        title="Engineer first, in the parts of the system users never see"
        lede="Three years of computer science, one year of production. What follows is what I actually own day to day — not a list of adjectives."
      />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        {/* ---------------------------------------------------------------- */}
        {/* Trajectory                                                       */}
        {/* ---------------------------------------------------------------- */}
        <div>
          <h3 className="eyebrow mb-7">Trajectory</h3>

          <ol ref={trackRef} className="relative space-y-9 pl-8">
            {/* Rail */}
            <span aria-hidden className="absolute left-[0.4375rem] top-2 h-[calc(100%-1rem)] w-px bg-white/8" />
            <motion.span
              aria-hidden
              style={reduced ? undefined : { scaleY: lineScale }}
              className={cn(
                "absolute left-[0.4375rem] top-2 h-[calc(100%-1rem)] w-px origin-top",
                "bg-[linear-gradient(to_bottom,var(--color-primary),var(--color-secondary),var(--color-accent))]",
              )}
            />

            {story.map((beat, index) => (
              <Reveal as="li" key={beat.year} delay={index * 0.08} className="relative">
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-8 top-1.5 grid size-3.5 place-items-center rounded-full",
                    "border border-primary/50 bg-void",
                  )}
                >
                  <span className="size-1.5 rounded-full bg-primary" />
                </span>

                <div className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-accent/80">
                  {beat.year}
                </div>
                <h4 className="mt-2 text-[1.0625rem] font-semibold tracking-[-0.015em] text-white">
                  {beat.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{beat.body}</p>
              </Reveal>
            ))}
          </ol>

          {/* Facts rail */}
          <Reveal delay={0.1} className="mt-11">
            <GlassCard className="p-5" ring={false}>
              <dl className="space-y-3">
                {aboutFacts.map((fact) => (
                  <div key={fact.k} className="flex gap-4 text-[0.8125rem]">
                    <dt className="w-20 shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
                      {fact.k}
                    </dt>
                    <dd className="flex-1 text-white/80">{fact.v}</dd>
                  </div>
                ))}
              </dl>
            </GlassCard>
          </Reveal>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Capability cards                                                 */}
        {/* ---------------------------------------------------------------- */}
        <div>
          <h3 className="eyebrow mb-7">What I bring</h3>

          <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((capability) => {
              const tone = toneMap[capability.tone];
              return (
                <RevealItem as="li" key={capability.id} className="h-full">
                  <GlassCard className="h-full p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-xl border"
                        style={{
                          borderColor: `color-mix(in oklab, ${tone.ring} 34%, transparent)`,
                          background: `color-mix(in oklab, ${tone.ring} 11%, transparent)`,
                        }}
                      >
                        <Icon name={capability.icon} className={cn("size-[1.05rem]", tone.text)} />
                      </span>

                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
                        {capability.label}
                      </span>
                    </div>

                    <h4 className="mt-4 text-[0.9375rem] font-semibold leading-snug tracking-[-0.01em] text-white">
                      {capability.headline}
                    </h4>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{capability.detail}</p>

                    <div className="mt-4 flex items-start gap-2 border-t border-white/6 pt-3">
                      <Icon name="CircleCheck" className="mt-0.5 size-3.5 shrink-0 text-success/80" />
                      <span className="font-mono text-[0.6875rem] leading-relaxed text-white/55">
                        {capability.proof}
                      </span>
                    </div>
                  </GlassCard>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
