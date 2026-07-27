"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const base = [
  "w-full rounded-xl bg-white/[0.035] px-4 text-sm text-white",
  "border border-white/10 placeholder:text-faint/80",
  "transition-[border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
  "hover:border-white/16 focus:bg-white/[0.055] focus:outline-none",
  "focus:border-[color-mix(in_oklab,var(--color-primary)_60%,transparent)]",
  "focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_14%,transparent)]",
  "aria-[invalid=true]:border-[color-mix(in_oklab,#f87171_60%,transparent)]",
  "disabled:opacity-50",
].join(" ");

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(base, "h-12", className)} {...props} />;
  },
);

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(base, "min-h-32 resize-y py-3.5 leading-relaxed", className)} {...props} />;
  },
);

export function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("flex items-center gap-2 text-[0.8125rem] font-medium text-white/75", className)}
      {...props}
    >
      {children}
    </label>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return <p className="text-xs text-[#fca5a5]">{children}</p>;
}
