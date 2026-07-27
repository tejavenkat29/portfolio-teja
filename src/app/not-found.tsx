import type { Metadata } from "next";
import Link from "next/link";

import { Monogram } from "@/components/layout/monogram";

export const metadata: Metadata = {
  title: "404 — Not found",
  robots: { index: false, follow: false },
};

/**
 * Kept free of client components on purpose: the App Router ships the
 * not-found boundary alongside every page, so anything imported here is
 * downloaded on visits that never 404. Plain links, no ripple, no cva.
 */
const linkBase =
  "inline-flex h-[3.25rem] items-center justify-center gap-2 rounded-full px-7 text-[0.9375rem] font-medium " +
  "transition-[transform,box-shadow,background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "hover:-translate-y-0.5 active:translate-y-0";

export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center px-6 py-24">
      <div className="max-w-lg text-center">
        <Monogram className="mx-auto size-14" />

        <p className="mt-8 font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-accent">
          HTTP 404
        </p>

        <h1 className="mt-4 text-[clamp(2rem,6vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.035em] text-gradient">
          No route matches that path
        </h1>

        <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted">
          The handler doesn&apos;t exist — nothing was logged, nothing broke. Head back to the
          portfolio and pick a section.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className={`${linkBase} bg-[linear-gradient(100deg,var(--color-primary),var(--color-secondary))] text-white shadow-[0_10px_34px_-12px_color-mix(in_oklab,var(--color-primary)_75%,transparent)]`}
          >
            Back to portfolio
          </Link>
          <Link
            href="/#projects"
            className={`${linkBase} border border-white/12 bg-white/[0.045] text-white/90 backdrop-blur-xl hover:border-white/22 hover:text-white`}
          >
            View projects
          </Link>
        </div>
      </div>
    </div>
  );
}
