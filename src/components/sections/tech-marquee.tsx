"use client";

import { cn } from "@/lib/utils";
import { marqueeTech } from "@/lib/data/stack";
import { TechIcon, techColor, techLabel } from "@/components/icons";

/**
 * A quiet band of the real production stack between the hero and the content.
 * Duplicated once and translated -50% for a seamless loop; paused on hover so a
 * visitor can actually read a logo they don't recognise.
 */
export function TechMarquee() {
  const items = [...marqueeTech, ...marqueeTech];

  return (
    <div className="relative border-y border-white/6 bg-white/[0.015] py-6">
      <div className="mask-fade-x overflow-hidden">
        <div
          className={cn(
            "flex w-max items-center gap-12 animate-marquee",
            "hover:[animation-play-state:paused] motion-reduce:animate-none",
          )}
        >
          {items.map((slug, index) => (
            <div
              key={`${slug}-${index}`}
              className="group flex shrink-0 items-center gap-2.5"
              style={{ ["--brand" as string]: techColor(slug) }}
              aria-hidden={index >= marqueeTech.length}
            >
              <TechIcon
                slug={slug}
                className="size-5 text-white/28 transition-colors duration-400 group-hover:text-[var(--brand)]"
              />
              <span className="whitespace-nowrap font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-white/25 transition-colors duration-400 group-hover:text-white/70">
                {techLabel(slug)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
