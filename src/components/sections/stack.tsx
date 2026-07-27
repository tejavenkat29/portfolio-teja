"use client";

import { cn } from "@/lib/utils";
import { stackLayers } from "@/lib/data/stack";
import { Section, SectionHeader } from "@/components/layout/section";
import { TechIcon, techColor } from "@/components/icons";
import { Reveal } from "@/components/interactive/reveal";
import { toneColor, type Tone } from "@/components/sections/diagram";

/**
 * Tech Stack answers "where does it sit in a running system" — so it reads as a
 * descent through layers rather than a grid of logos. Deliberately a different
 * shape from the Skills grid above it.
 */
export function Stack() {
  return (
    <Section id="stack">
      <SectionHeader
        id="stack"
        index="06"
        eyebrow="Tech Stack"
        title="What runs where, from the edge to the object store"
        lede="The same technologies as above, arranged the way a request meets them. Each one is there for a reason I can defend."
      />

      <div className="relative">
        {/* Descent rail */}
        <span
          aria-hidden
          className="absolute left-[1.375rem] top-4 hidden h-[calc(100%-2rem)] w-px bg-[linear-gradient(to_bottom,var(--color-accent),var(--color-primary)_45%,var(--color-success))] opacity-30 lg:block"
        />

        <div className="space-y-4">
          {stackLayers.map((layer, index) => {
            const color = toneColor[layer.tone as Tone];

            return (
              <Reveal key={layer.id} delay={index * 0.05}>
                <div className="relative lg:pl-16">
                  {/* Node */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-5 hidden size-[2.75rem] place-items-center rounded-full border border-white/10 bg-void/90 backdrop-blur lg:grid"
                  >
                    <span
                      className="grid size-7 place-items-center rounded-full font-mono text-[0.625rem] font-semibold tabular-nums"
                      style={{
                        background: `color-mix(in oklab, ${color} 18%, transparent)`,
                        color,
                      }}
                    >
                      {index + 1}
                    </span>
                  </span>

                  <div
                    className={cn(
                      "group/layer overflow-hidden rounded-2xl border border-white/8 bg-white/[0.015]",
                      "transition-[border-color,background-color] duration-500 hover:border-white/16 hover:bg-white/[0.03]",
                    )}
                  >
                    <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:gap-8 md:p-6">
                      {/* Layer identity */}
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span
                            aria-hidden
                            className="h-4 w-1 rounded-full"
                            style={{ background: color }}
                          />
                          <h3 className="text-[1.0625rem] font-semibold tracking-[-0.015em] text-white">
                            {layer.layer}
                          </h3>
                        </div>
                        <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-muted">{layer.role}</p>
                      </div>

                      {/* Items */}
                      <ul className="grid gap-2 sm:grid-cols-2">
                        {layer.items.map((item) => (
                          <li
                            key={item.name}
                            className={cn(
                              "group/item flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2.5",
                              "transition-[border-color,transform] duration-400 hover:-translate-y-0.5 hover:border-white/16",
                            )}
                            style={{ ["--brand" as string]: techColor(item.icon) }}
                          >
                            <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/8 bg-white/[0.03]">
                              <TechIcon
                                slug={item.icon}
                                className="size-4 text-white/60 transition-colors duration-400 group-hover/item:text-[var(--brand)]"
                              />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[0.8125rem] font-medium text-white/90">
                                {item.name}
                              </span>
                              <span className="mt-0.5 block truncate font-mono text-[0.625rem] text-faint">
                                {item.note}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
