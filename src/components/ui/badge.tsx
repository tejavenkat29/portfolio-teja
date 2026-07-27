import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap transition-colors duration-300",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/[0.05] text-white/80",
        primary:
          "border-[color-mix(in_oklab,var(--color-primary)_38%,transparent)] bg-[color-mix(in_oklab,var(--color-primary)_14%,transparent)] text-[#c7ccff]",
        secondary:
          "border-[color-mix(in_oklab,var(--color-secondary)_38%,transparent)] bg-[color-mix(in_oklab,var(--color-secondary)_14%,transparent)] text-[#ddd0ff]",
        accent:
          "border-[color-mix(in_oklab,var(--color-accent)_36%,transparent)] bg-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] text-[#a8ecff]",
        success:
          "border-[color-mix(in_oklab,var(--color-success)_38%,transparent)] bg-[color-mix(in_oklab,var(--color-success)_13%,transparent)] text-[#a7f3c4]",
        mono: "border-white/10 bg-white/[0.04] font-mono text-[0.6875rem] tracking-wide text-muted",
      },
      size: {
        sm: "px-2 py-0.5 text-[0.6875rem]",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-[0.8125rem]",
      },
    },
    defaultVariants: { variant: "default", size: "sm" },
  },
);

export function Badge({
  className,
  variant,
  size,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { badgeVariants };
