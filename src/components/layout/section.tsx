import * as React from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/interactive/reveal";

/** Shared section shell: consistent rhythm, one heading treatment, one eyebrow. */
export function Section({
  id,
  children,
  className,
  bleed = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 py-24 md:py-32", "section-defer", className)}
      aria-labelledby={`${id}-heading`}
    >
      <div className={cn(!bleed && "shell")}>{children}</div>
    </section>
  );
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  lede,
  align = "left",
  action,
  index,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  action?: React.ReactNode;
  /** Section number, rendered as a monospace ordinal. */
  index?: string;
}) {
  return (
    <Reveal className={cn("mb-14 md:mb-18", align === "center" && "text-center")}>
      <div
        className={cn(
          "flex flex-col gap-6",
          align === "left" && action && "md:flex-row md:items-end md:justify-between",
        )}
      >
        <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
          <div
            className={cn(
              "mb-5 flex items-center gap-3",
              align === "center" && "justify-center",
            )}
          >
            {index ? (
              <span className="font-mono text-[0.6875rem] tabular-nums text-primary/90">{index}</span>
            ) : null}
            <span
              aria-hidden
              className="h-px w-10 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--color-primary)_80%,transparent),transparent)]"
            />
            <span className="eyebrow">{eyebrow}</span>
          </div>

          <h2
            id={`${id}-heading`}
            className="text-headline font-bold text-gradient"
          >
            {title}
          </h2>

          {lede ? (
            <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-muted">{lede}</p>
          ) : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </Reveal>
  );
}
