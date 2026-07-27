"use client";

import * as React from "react";
import { ArrowUp, Command } from "lucide-react";

import { cn } from "@/lib/utils";
import { profile } from "@/lib/data/profile";
import { navItems } from "@/lib/data/site";
import { openPalette, scrollToSection } from "@/lib/ui-events";
import { brandIcons } from "@/components/icons";
import { Monogram } from "@/components/layout/monogram";

const channels = [
  { label: "GitHub", href: profile.links.github, Icon: brandIcons.GitHub },
  { label: "LinkedIn", href: profile.links.linkedin, Icon: brandIcons.LinkedIn },
  { label: "WhatsApp", href: profile.links.whatsapp, Icon: brandIcons.WhatsApp },
  { label: "Email", href: profile.links.mail, Icon: brandIcons.Gmail },
];

/** Live IST clock — a small signal that the page is a running thing, not a print-out. */
function LocalTime() {
  const [now, setNow] = React.useState<string | null>(null);

  React.useEffect(() => {
    const tick = () =>
      setNow(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: profile.timezone,
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-xs tabular-nums text-muted">
      {now ?? "--:--:--"} <span className="text-faint">IST</span>
    </span>
  );
}

export function Footer() {
  const columns = [
    { title: "Explore", items: navItems.slice(1, 6) },
    { title: "More", items: navItems.slice(6) },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-48 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 100%, color-mix(in oklab, var(--color-primary) 30%, transparent), transparent 70%)",
        }}
      />

      <div className="shell relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <div className="flex items-center gap-3">
              <Monogram className="size-10" />
              <div className="leading-tight">
                <div className="font-semibold tracking-[-0.02em] text-white">{profile.name}</div>
                <div className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                  Backend · AI Systems · Distributed
                </div>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Building backends where latency, cost and correctness are all measured — and none of
              them are left to chance.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {channels.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer noopener"
                  aria-label={label}
                  className={cn(
                    "grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03]",
                    "text-muted transition-[color,border-color,transform] duration-300",
                    "hover:-translate-y-0.5 hover:border-white/22 hover:text-white",
                  )}
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <div className="eyebrow mb-4">{column.title}</div>
              <ul className="space-y-2.5">
                {column.items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.href);
                      }}
                      className="text-sm text-muted transition-colors duration-300 hover:text-white"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Direct */}
          <div>
            <div className="eyebrow mb-4">Direct</div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={profile.links.mail}
                  className="text-muted transition-colors duration-300 hover:text-white"
                >
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${profile.phoneE164}`}
                  className="text-muted transition-colors duration-300 hover:text-white"
                >
                  {profile.phone}
                </a>
              </li>
              <li className="text-muted">{profile.location}</li>
              <li>
                <LocalTime />
              </li>
            </ul>
          </div>
        </div>

        {/* Baseline */}
        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-6 border-t border-white/8 pt-7 sm:flex-row sm:items-center">
          <p className="font-mono text-[0.6875rem] text-faint">
            © {new Date().getFullYear()} {profile.name} · Built with Next.js, TypeScript, Tailwind CSS
            and Framer Motion
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openPalette}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5",
                "text-xs text-muted transition-colors duration-300 hover:border-white/22 hover:text-white",
              )}
            >
              <Command className="size-3.5" />
              Command palette
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("#home")}
              aria-label="Back to top"
              className={cn(
                "grid size-9 place-items-center rounded-full border border-white/10 bg-white/[0.03]",
                "text-muted transition-[color,border-color,transform] duration-300",
                "hover:-translate-y-0.5 hover:border-white/22 hover:text-white",
              )}
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
