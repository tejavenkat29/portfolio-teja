"use client";

import { cn } from "@/lib/utils";
import { achievements, outcomeMetrics } from "@/lib/data/site";
import { Section, SectionHeader } from "@/components/layout/section";
import { GlassCard } from "@/components/ui/card";
import { Icon } from "@/components/icons";
import { Counter } from "@/components/interactive/counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/interactive/reveal";

export function Achievements() {
  return (
    <Section id="achievements">
      <SectionHeader
        id="achievements"
        index="07"
        eyebrow="Achievements"
        title="By the numbers"
        lede="Counted from shipped work — production endpoints, delivered features and the commits behind them."
        align="center"
      />

      <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((item) => (
          <RevealItem as="li" key={item.label} className="h-full">
            <GlassCard className="h-full p-6 text-center">
              <span
                className={cn(
                  "mx-auto grid size-11 place-items-center rounded-xl",
                  "border border-primary/25 bg-primary/10",
                )}
              >
                <Icon name={item.icon} className="size-[1.15rem] text-[#c7ccff]" />
              </span>

              <div className="mt-5 text-[clamp(2.25rem,4vw,3rem)] font-bold leading-none tracking-[-0.04em] text-gradient">
                <Counter to={item.value} suffix={item.suffix} />
              </div>

              <div className="mt-3 text-[0.9375rem] font-semibold text-white">{item.label}</div>
              <p className="mt-2 text-[0.75rem] leading-relaxed text-muted">{item.detail}</p>
            </GlassCard>
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Outcome strip — the metrics that describe engineering results */}
      <Reveal delay={0.1} className="mt-4">
        <div className="grid divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.015] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {outcomeMetrics.map((metric) => (
            <div key={metric.label} className="p-5 text-center">
              <div className="font-mono text-xl font-semibold tracking-tight text-accent">
                {metric.value}
              </div>
              <div className="mt-1.5 text-[0.75rem] text-muted">{metric.label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
