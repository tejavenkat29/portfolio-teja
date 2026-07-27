"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full",
    "font-medium tracking-[-0.01em] select-none",
    "transition-[transform,box-shadow,background-color,border-color,color] duration-300",
    "ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:shrink-0 [&_svg]:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "text-white",
          "bg-[linear-gradient(100deg,var(--color-primary),var(--color-secondary)_55%,var(--color-primary))]",
          "bg-[length:200%_100%] bg-[position:0%_0%] hover:bg-[position:100%_0%]",
          "shadow-[0_10px_34px_-12px_color-mix(in_oklab,var(--color-primary)_75%,transparent)]",
          "hover:shadow-[0_18px_48px_-14px_color-mix(in_oklab,var(--color-secondary)_80%,transparent)]",
          "hover:-translate-y-0.5 active:translate-y-0",
        ].join(" "),
        glass: [
          "text-white/90 hover:text-white",
          "bg-white/[0.045] hover:bg-white/[0.08]",
          "border border-white/12 hover:border-white/22",
          "backdrop-blur-xl",
          "shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)]",
          "hover:-translate-y-0.5 active:translate-y-0",
        ].join(" "),
        outline: [
          "text-white/85 hover:text-white",
          "border border-white/15 hover:border-[color-mix(in_oklab,var(--color-accent)_55%,transparent)]",
          "hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent),0_14px_40px_-20px_color-mix(in_oklab,var(--color-accent)_60%,transparent)]",
          "hover:-translate-y-0.5 active:translate-y-0",
        ].join(" "),
        ghost: "text-muted hover:text-white hover:bg-white/[0.06]",
        link: "text-accent underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem] [&_svg]:size-3.5",
        md: "h-11 px-5 text-sm [&_svg]:size-4",
        lg: "h-[3.25rem] px-7 text-[0.9375rem] [&_svg]:size-[1.05rem]",
        icon: "size-10 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "glass", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

/**
 * Adds a pointer-origin ripple on press. Implemented with a single absolutely
 * positioned span so it costs one paint and never re-renders the tree.
 */
function useRipple() {
  return React.useCallback((event: React.PointerEvent<HTMLElement>) => {
    const host = event.currentTarget;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = host.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.1;
    const ripple = document.createElement("span");

    ripple.setAttribute("aria-hidden", "true");
    Object.assign(ripple.style, {
      position: "absolute",
      left: `${event.clientX - rect.left - size / 2}px`,
      top: `${event.clientY - rect.top - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "9999px",
      pointerEvents: "none",
      background: "radial-gradient(circle, rgba(255,255,255,0.42), rgba(255,255,255,0) 62%)",
      transform: "scale(0)",
      opacity: "0.85",
      transition: "transform 620ms cubic-bezier(0.16,1,0.3,1), opacity 620ms linear",
    } satisfies Partial<CSSStyleDeclaration>);

    host.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.style.transform = "scale(1)";
      ripple.style.opacity = "0";
    });
    window.setTimeout(() => ripple.remove(), 660);
  }, []);
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, onPointerDown, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  const ripple = useRipple();

  return (
    <Comp
      ref={ref}
      className={cn("overflow-hidden isolate", buttonVariants({ variant, size }), className)}
      onPointerDown={(event: React.PointerEvent<HTMLButtonElement>) => {
        ripple(event);
        onPointerDown?.(event);
      }}
      {...props}
    />
  );
});

export { buttonVariants };
