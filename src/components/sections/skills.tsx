"use client";

import { cn } from "@/lib/utils";
import { practices, skillCategories, tierMeta, type Tier } from "@/lib/data/skills";
import { Section, SectionHeader } from "@/components/layout/section";
import { GlassCard } from "@/components/ui/card";
import { Icon, TechIcon, techColor } from "@/components/icons";
import { LevelBar } from "@/components/interactive/counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/interactive/reveal";

const toneRing = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  accent: "var(--color-accent)",
  success: "var(--color-success)",
} as const;

const tierDot: Record<Tier, string> = {
  core: "bg-accent",
  production: "bg-primary",
  working: "bg-white/30",
};

export function Skills() {
  return (
    <Section id="skills">
      <SectionHeader
        id="skills"
        index="05"
        eyebrow="Skills"
        title="Depth where it counts, honesty where it doesn't"
        lede="Every entry below names the work it came from. Levels are self-assessed against what I've shipped — not a quiz score."
        action={
          <div className="flex flex-wrap items-center gap-3">
            {(Object.keys(tierMeta) as Tier[]).map((tier) => (
              <span key={tier} className="inline-flex items-center gap-2">
                <span className={cn("size-1.5 rounded-full", tierDot[tier])} />
                <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
                  {tierMeta[tier].label}
                </span>
              </span>
            ))}
          </div>
        }
      />

      <RevealGroup as="ul" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {skillCategories.map((category) => {
          const ring = toneRing[category.tone];
          return (
            <RevealItem as="li" key={category.id} className="h-full">
              <GlassCard className="h-full p-5">
                {/* Category head */}
                <div className="flex items-start gap-3">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-xl border"
                    style={{
                      borderColor: `color-mix(in oklab, ${ring} 32%, transparent)`,
                      background: `color-mix(in oklab, ${ring} 11%, transparent)`,
                    }}
                  >
                    <Icon name={category.icon} className="size-[1.05rem]" style={{ color: ring }} />
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-[1rem] font-semibold tracking-[-0.015em] text-white">
                      {category.title}
                    </h3>
                    <p className="mt-1 text-[0.75rem] leading-relaxed text-faint">{category.blurb}</p>
                  </div>
                </div>

                {/* Skills */}
                <ul className="mt-5 space-y-3.5">
                  {category.skills.map((skill, index) => (
                    <li key={skill.name} className="group/skill">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="grid size-6 shrink-0 place-items-center rounded-md border border-white/8 bg-white/[0.03]"
                          style={{ ["--brand" as string]: techColor(skill.icon) }}
                        >
                          <TechIcon
                            slug={skill.icon}
                            className="size-3.5 text-white/55 transition-colors duration-400 group-hover/skill:text-[var(--brand)]"
                          />
                        </span>

                        <span className="min-w-0 flex-1 truncate text-[0.8125rem] font-medium text-white/85">
                          {skill.name}
                        </span>

                        <span className={cn("size-1.5 shrink-0 rounded-full", tierDot[skill.tier])} />
                        <span className="shrink-0 font-mono text-[0.625rem] tabular-nums text-faint">
                          {skill.level}
                        </span>
                      </div>

                      <LevelBar
                        level={skill.level}
                        color={ring}
                        delay={index * 0.05}
                        className="mt-2"
                      />

                      <p
                        className={cn(
                          "mt-1.5 text-[0.6875rem] leading-relaxed text-faint",
                          "transition-colors duration-400 group-hover/skill:text-muted",
                        )}
                      >
                        {skill.usedFor}
                      </p>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </RevealItem>
          );
        })}
      </RevealGroup>

      {/* Practice cloud */}
      <Reveal delay={0.08} className="mt-10">
        <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-6">
          <h3 className="eyebrow mb-4">Engineering practice</h3>
          <ul className="flex flex-wrap gap-2">
            {practices.map((practice) => (
              <li
                key={practice}
                className={cn(
                  "rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5",
                  "text-[0.8125rem] text-white/70",
                  "transition-[color,border-color,transform] duration-400",
                  "hover:-translate-y-0.5 hover:border-primary/40 hover:text-white",
                )}
              >
                {practice}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
