"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { usePointerGlow } from "@/lib/hooks/use-pointer-glow";

/**
 * The site's one card surface. A pointer-tracked radial highlight sits above the
 * glass and below the content, so hovering feels like light moving over glass
 * rather than a background colour swap.
 */
export function GlassCard({
  className,
  children,
  glow = true,
  ring = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
  ring?: boolean;
}) {
  const { ref, onPointerMove, onPointerLeave } = usePointerGlow<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onPointerMove={glow ? onPointerMove : undefined}
      onPointerLeave={glow ? onPointerLeave : undefined}
      className={cn(
        "group/card relative isolate overflow-hidden rounded-2xl glass",
        "transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        ring && "gradient-ring",
        className,
      )}
      style={{ "--mx": "50%", "--my": "-40%" } as React.CSSProperties}
      {...props}
    >
      {glow ? (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-px z-0 opacity-0 transition-opacity duration-500",
            "group-hover/card:opacity-100",
          )}
          style={{
            background:
              "radial-gradient(340px circle at var(--mx) var(--my), color-mix(in oklab, var(--color-primary) 16%, transparent), transparent 68%)",
          }}
        />
      ) : null}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-[1.0625rem] font-semibold tracking-[-0.015em] text-white", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-relaxed text-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-3 p-6 pt-0", className)} {...props} />;
}
