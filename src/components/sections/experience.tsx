"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { cn, monthYear, monthsBetween } from "@/lib/utils";
import { experience } from "@/lib/data/experience";
import { education } from "@/lib/data/profile";
import { Section, SectionHeader } from "@/components/layout/section";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icons";
import { Reveal, RevealGroup, RevealItem } from "@/components/interactive/reveal";

function duration(start: string, end: string | null) {
  const months = monthsBetween(start, end ?? undefined);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years && rest) return `${years} yr ${rest} mo`;
  if (years) return `${years} yr`;
  return `${months} mo`;
}

export function Experience() {
  const railRef = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start 70%", "end 60%"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section id="experience">
      <SectionHeader
        id="experience"
        index="02"
        eyebrow="Experience"
        title="What I've owned, and what it did in production"
        lede="Every entry below is a system that shipped and stayed up — described by the decision behind it rather than the tools involved."
      />

      <div ref={railRef} className="relative">
        {/* Rail */}
        <span
          aria-hidden
          className="absolute left-[1.0625rem] top-3 hidden h-[calc(100%-3rem)] w-px bg-white/8 md:block"
        />
        <motion.span
          aria-hidden
          style={reduced ? undefined : { scaleY }}
          className={cn(
            "absolute left-[1.0625rem] top-3 hidden h-[calc(100%-3rem)] w-px origin-top md:block",
            "bg-[linear-gradient(to_bottom,var(--color-primary),var(--color-secondary)_60%,var(--color-accent))]",
          )}
        />

        <div className="space-y-16">
          {experience.map((role, roleIndex) => (
            <div key={role.id} className="relative md:pl-16">
              {/* Node */}
              <span
                aria-hidden
                className="absolute left-0 top-2 hidden size-[2.125rem] place-items-center rounded-full border border-white/10 bg-void/90 backdrop-blur md:grid"
              >
                <span
                  className={cn(
                    "grid size-[1.375rem] place-items-center rounded-full",
                    roleIndex === 0
                      ? "bg-[linear-gradient(135deg,var(--color-primary),var(--color-secondary))]"
                      : "border border-white/12 bg-white/5",
                  )}
                >
                  <Icon
                    name={roleIndex === 0 ? "Rocket" : "FlaskConical"}
                    className="size-3 text-white"
                  />
                </span>
              </span>

              {/* Role header */}
              <Reveal>
                <GlassCard className="p-6 md:p-7">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <h3 className="text-title font-bold text-white">{role.title}</h3>
                        {role.end === null ? (
                          <Badge variant="success" size="md" className="gap-1.5">
                            <span className="relative grid size-1.5 place-items-center">
                              <span className="absolute size-1.5 rounded-full bg-success/60 animate-ping motion-reduce:animate-none" />
                              <span className="size-1 rounded-full bg-success" />
                            </span>
                            Current
                          </Badge>
                        ) : null}
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted">
                        <span className="inline-flex items-center gap-1.5 font-medium text-white/85">
                          <Icon name="Building2" className="size-3.5 text-primary" />
                          {role.company}
                        </span>
                        <span aria-hidden className="text-faint">
                          ·
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Icon name="MapPin" className="size-3.5" />
                          {role.location}
                        </span>
                        <span aria-hidden className="text-faint">
                          ·
                        </span>
                        <span>{role.type}</span>
                      </div>

                      <p className="mt-4 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
                        {role.mandate}
                      </p>
                    </div>

                    <div className="shrink-0 md:text-right">
                      <div className="font-mono text-[0.8125rem] text-white/80">
                        {monthYear(role.start)} — {role.end ? monthYear(role.end) : "Present"}
                      </div>
                      <div className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
                        {duration(role.start, role.end)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/6 pt-5">
                    {role.stack.map((tech) => (
                      <Badge key={tech} variant="mono">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </GlassCard>
              </Reveal>

              {/* Achievements as feature cards */}
              <div className="mt-5">
                <h4 className="eyebrow mb-4 pl-1">
                  {role.end === null ? "Selected work" : "What came out of it"}
                </h4>

                <RevealGroup as="ul" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {role.highlights.map((highlight) => (
                    <RevealItem as="li" key={highlight.title} className="h-full">
                      <GlassCard className="h-full p-5">
                        <div className="flex items-start gap-3">
                          <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-primary/28 bg-primary/10">
                            <Icon name={highlight.icon} className="size-4 text-[#c7ccff]" />
                          </span>
                          <div className="min-w-0">
                            <h5 className="text-[0.9375rem] font-semibold leading-snug tracking-[-0.01em] text-white">
                              {highlight.title}
                            </h5>
                            {highlight.metric ? (
                              <span className="mt-1.5 inline-flex items-center gap-1 font-mono text-[0.6875rem] text-success">
                                <Icon name="TrendingUp" className="size-3" />
                                {highlight.metric}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <p className="mt-3.5 text-[0.8125rem] leading-relaxed text-muted">
                          {highlight.detail}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {highlight.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md border border-white/8 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[0.625rem] text-white/50"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </GlassCard>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>
            </div>
          ))}

          {/* Education — same rail, deliberately lighter weight */}
          <div className="relative md:pl-16">
            <span
              aria-hidden
              className="absolute left-0 top-2 hidden size-[2.125rem] place-items-center rounded-full border border-white/10 bg-void/90 backdrop-blur md:grid"
            >
              <span className="grid size-[1.375rem] place-items-center rounded-full border border-white/12 bg-white/5">
                <Icon name="GraduationCap" className="size-3 text-white/80" />
              </span>
            </span>

            <Reveal>
              <GlassCard className="p-6" ring={false}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-[1.0625rem] font-semibold text-white">{education.degree}</h3>
                    <p className="mt-1.5 text-sm text-muted">{education.institution}</p>
                  </div>
                  <div className="flex items-center gap-3 sm:text-right">
                    <Badge variant="primary" size="md">
                      CGPA {education.cgpa}
                    </Badge>
                    <span className="font-mono text-[0.8125rem] text-white/70">{education.period}</span>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
