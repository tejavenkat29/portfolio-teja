"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { ExternalLink, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { projects, type Project } from "@/lib/data/projects";
import { profile } from "@/lib/data/profile";
import { scrollToSection } from "@/lib/ui-events";
import { Section, SectionHeader } from "@/components/layout/section";
import { GlassCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/ui/tooltip";
import { Icon, brandIcons } from "@/components/icons";
import { Reveal } from "@/components/interactive/reveal";
import { ProjectPreview } from "@/components/sections/project-preview";
import { StageFlow } from "@/components/sections/diagram";

const TABS = [
  { id: "overview", label: "Overview", icon: "Eye" },
  { id: "problem", label: "Problem", icon: "Target" },
  { id: "architecture", label: "Architecture", icon: "Workflow" },
  { id: "features", label: "Features", icon: "Sparkles" },
  { id: "challenges", label: "Challenges", icon: "Wrench" },
  { id: "results", label: "Results", icon: "TrendingUp" },
] as const;

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeader
        id="projects"
        index="03"
        eyebrow="Projects"
        title="Three systems, and the decisions that made them work"
        lede="Production work — a real-time voice product and two healthcare platforms. For each one: the problem, the architecture, what broke, and what it cost to fix."
      />

      <div className="space-y-24 lg:space-y-32">
        {projects.map((project, index) => (
          <ProjectBlock key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  );
}

function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const [tab, setTab] = React.useState<string>("overview");

  return (
    <article id={`project-${project.id}`} className="scroll-mt-28">
      {/* Header */}
      <Reveal className="mb-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span
                className="font-mono text-[0.6875rem] tabular-nums"
                style={{ color: project.accentTo }}
              >
                {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
              <span
                aria-hidden
                className="h-px w-8"
                style={{
                  background: `linear-gradient(to right, ${project.accentFrom}, transparent)`,
                }}
              />
              <span className="eyebrow">{project.kind}</span>
            </div>

            <h3 className="text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
              {project.name}
            </h3>
            <p className="mt-2.5 max-w-2xl text-[1.0625rem] text-muted">{project.tagline}</p>
          </div>

          {/* Links — private work is stated, not linked to nothing */}
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {project.source.available && project.source.url ? (
              <Button asChild variant="glass" size="sm">
                <a href={project.source.url} target="_blank" rel="noreferrer noopener">
                  <brandIcons.GitHub />
                  Source
                  <ExternalLink />
                </a>
              </Button>
            ) : (
              <Hint label={project.source.reason ?? "Private repository"}>
                {/* tabIndex so the reason is reachable by keyboard, not hover-only */}
                <span
                  tabIndex={0}
                  role="note"
                  aria-label={`Source not public — ${project.source.reason ?? "private repository"}`}
                  className={cn(
                    "inline-flex h-9 cursor-help items-center gap-2 rounded-full border border-white/8",
                    "bg-white/[0.02] px-4 text-[0.8125rem] text-faint",
                  )}
                >
                  <Lock className="size-3.5" />
                  Private source
                </span>
              </Hint>
            )}

            {project.demo.available && project.demo.url ? (
              <Button asChild variant="primary" size="sm">
                <a href={project.demo.url} target="_blank" rel="noreferrer noopener">
                  Live demo
                  <ExternalLink />
                </a>
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => scrollToSection("#contact")}>
                <Icon name="MessageSquare" />
                Request a walkthrough
              </Button>
            )}
          </div>
        </div>
      </Reveal>

      {/* Body.
          Tracks are minmax(0,…) on purpose: an `auto` grid track floors at the
          item's min-content width, and the tab row's min-content would blow the
          column past the viewport on narrow screens. */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:gap-8">
        {/* Preview column */}
        <div className="min-w-0 space-y-4 xl:sticky xl:top-28 xl:self-start">
          <Reveal>
            <ProjectPreview project={project} />
          </Reveal>

          <Reveal delay={0.06}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
              {project.results.map((result) => (
                <div
                  key={result.label}
                  className="rounded-xl border border-white/8 bg-white/[0.02] p-3.5"
                >
                  <div
                    className="font-mono text-lg font-semibold leading-none tracking-tight"
                    style={{ color: project.accentTo }}
                  >
                    {result.value}
                  </div>
                  <div className="mt-1.5 text-[0.6875rem] leading-snug text-white/70">
                    {result.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Detail column */}
        <Reveal delay={0.08} className="min-w-0">
          <GlassCard className="overflow-visible p-0" glow={false}>
            <Tabs.Root value={tab} onValueChange={setTab}>
              <Tabs.List
                className="flex flex-wrap gap-1 border-b border-white/8 p-2"
                aria-label={`${project.name} details`}
              >
                {TABS.map((item) => (
                  <Tabs.Trigger
                    key={item.id}
                    value={item.id}
                    className={cn(
                      "relative shrink-0 rounded-lg px-3 py-2 text-[0.8125rem] font-medium",
                      "transition-colors duration-300 outline-none",
                      tab === item.id ? "text-white" : "text-muted hover:text-white/85",
                    )}
                  >
                    {tab === item.id ? (
                      <motion.span
                        layoutId={`tab-${project.id}`}
                        className="absolute inset-0 rounded-lg border border-white/10 bg-white/[0.07]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative flex items-center gap-1.5">
                      <Icon name={item.icon} className="size-3.5" />
                      {item.label}
                    </span>
                  </Tabs.Trigger>
                ))}
              </Tabs.List>

              <div className="p-5 sm:p-6">
                <TabPanel value="overview">
                  <p className="text-[0.9375rem] leading-relaxed text-white/80">{project.overview}</p>

                  <div className="mt-6 space-y-4">
                    {project.stack.map((group) => (
                      <div key={group.group}>
                        <div className="mb-2 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                          {group.group}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {group.items.map((item) => (
                            <Badge key={item} variant="default" size="md">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabPanel>

                <TabPanel value="problem">
                  <p className="text-[0.9375rem] leading-relaxed text-white/80">
                    {project.problem.statement}
                  </p>

                  <div className="mt-6">
                    <div className="mb-3 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                      Constraints that shaped the design
                    </div>
                    <ul className="space-y-2.5">
                      {project.problem.constraints.map((constraint) => (
                        <li key={constraint} className="flex gap-3">
                          <Icon
                            name="ChevronRight"
                            className="mt-0.5 size-3.5 shrink-0"
                            style={{ color: project.accentTo }}
                          />
                          <span className="text-[0.875rem] leading-relaxed text-muted">{constraint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabPanel>

                <TabPanel value="architecture">
                  <p className="mb-6 text-[0.9375rem] leading-relaxed text-white/80">
                    {project.architecture.summary}
                  </p>
                  <StageFlow stages={project.architecture.stages} />
                </TabPanel>

                <TabPanel value="features">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {project.features.map((feature) => (
                      <li
                        key={feature.title}
                        className="rounded-xl border border-white/8 bg-white/[0.02] p-4 transition-colors duration-400 hover:border-white/16"
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className="grid size-7 shrink-0 place-items-center rounded-lg"
                            style={{ background: `color-mix(in oklab, ${project.accentFrom} 16%, transparent)` }}
                          >
                            <Icon name={feature.icon} className="size-3.5 text-white/85" />
                          </span>
                          <h4 className="text-[0.875rem] font-semibold leading-snug text-white">
                            {feature.title}
                          </h4>
                        </div>
                        <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted">
                          {feature.detail}
                        </p>
                      </li>
                    ))}
                  </ul>
                </TabPanel>

                <TabPanel value="challenges">
                  <ul className="space-y-4">
                    {project.challenges.map((entry, i) => (
                      <li key={entry.challenge} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 font-mono text-[0.625rem] tabular-nums text-faint">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-[0.875rem] font-semibold leading-snug text-white">
                              {entry.challenge}
                            </h4>
                            <div className="mt-3 flex gap-2.5 border-l-2 pl-3" style={{ borderColor: project.accentTo }}>
                              <p className="text-[0.8125rem] leading-relaxed text-muted">{entry.approach}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </TabPanel>

                <TabPanel value="results">
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {project.results.map((result) => (
                      <li key={result.label} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                        <div
                          className="font-mono text-2xl font-semibold leading-none tracking-tight"
                          style={{ color: project.accentTo }}
                        >
                          {result.value}
                        </div>
                        <div className="mt-2 text-[0.875rem] font-medium text-white/90">{result.label}</div>
                        {result.note ? (
                          <div className="mt-1.5 text-[0.75rem] leading-relaxed text-faint">{result.note}</div>
                        ) : null}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 flex items-start gap-2 text-[0.75rem] leading-relaxed text-faint">
                    <Icon name="Lightbulb" className="mt-0.5 size-3.5 shrink-0" />
                    Figures reflect measured backend outcomes on{" "}
                    {project.status === "Production" ? "the live system" : "the delivered platform"}. Happy to
                    walk through the methodology —{" "}
                    <a className="text-accent hover:underline" href={profile.links.mail}>
                      ask me
                    </a>
                    .
                  </p>
                </TabPanel>
              </div>
            </Tabs.Root>
          </GlassCard>
        </Reveal>
      </div>
    </article>
  );
}

function TabPanel({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Tabs.Content
      value={value}
      className="outline-none data-[state=active]:animate-[rise_0.5s_var(--ease-out-expo)_both]"
    >
      {children}
    </Tabs.Content>
  );
}
