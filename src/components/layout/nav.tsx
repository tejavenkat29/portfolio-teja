"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Command, Download, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { navItems } from "@/lib/data/site";
import { profile } from "@/lib/data/profile";
import { openPalette, scrollToSection } from "@/lib/ui-events";
import { useActiveSection } from "@/lib/hooks/use-active-section";
import { Icon, brandIcons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Monogram } from "@/components/layout/monogram";

const sectionIds = navItems.map((item) => item.id);
/**
 * The bar shows the primary set from `lg`, and adds System Design at `xl` where
 * there's room for it. Everything else stays one ⌘K or one tap away — a nav that
 * wraps or scrolls costs more than it gains.
 */
const barItems = navItems.filter((item) => item.primary || item.id === "architecture");

export function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const active = useActiveSection(sectionIds);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 28);
  });

  // Close the mobile sheet on resize to desktop and lock scroll while open.
  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    scrollToSection(href);
  };

  return (
    <>
      <a
        href="#main"
        className={cn(
          "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-120",
          "focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-white",
        )}
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-90 h-(--nav-h)",
          "transition-[background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "border-b border-white/8 bg-[#050816]/70 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav className="shell flex h-full items-center justify-between gap-4" aria-label="Primary">
          {/* Identity */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go("#home");
            }}
            className="group flex items-center gap-3 rounded-full outline-none"
          >
            <Monogram className="size-9 transition-transform duration-500 group-hover:rotate-[8deg]" />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-[0.9375rem] font-semibold tracking-[-0.02em] text-white">
                {profile.name}
              </span>
              <span className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-faint">
                Backend · AI Systems
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {barItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className={cn(!item.primary && "hidden xl:block")}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.href);
                    }}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative flex items-center rounded-full px-3 py-2 text-[0.8125rem] font-medium",
                      "transition-colors duration-300",
                      isActive ? "text-white" : "text-muted hover:text-white",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.07]"
                        transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.7 }}
                      />
                    ) : null}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open command palette"
              className={cn(
                "hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-3 pr-2",
                "text-xs text-muted transition-colors duration-300 hover:border-white/20 hover:text-white md:flex",
              )}
            >
              <Command className="size-3.5" />
              <span className="font-mono">K</span>
            </button>

            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub profile"
              className="hidden size-9 place-items-center rounded-full border border-white/10 text-muted transition-colors duration-300 hover:border-white/20 hover:text-white sm:grid"
            >
              <brandIcons.GitHub className="size-4" />
            </a>

            <Button asChild variant="primary" size="sm" className="hidden sm:inline-flex">
              <a href={profile.resumeFile} download={profile.resumeFileName}>
                <Download />
                Resume
              </a>
            </Button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid size-10 place-items-center rounded-full border border-white/10 text-white/80 transition-colors hover:border-white/20 hover:text-white lg:hidden"
            >
              {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet — every section, including the ones the desktop bar hides */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-85 lg:hidden"
          >
            <div className="absolute inset-0 bg-ink/85 backdrop-blur-xl" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-3 top-(--nav-h) mt-2 overflow-hidden rounded-2xl glass-strong"
            >
              <ul className="grid gap-1 p-3">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        go(item.href);
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 transition-colors",
                        active === item.id ? "bg-white/[0.07] text-white" : "text-muted hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <span className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                        <Icon name={item.icon} className="size-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className="text-sm font-medium">{item.label}</span>
                        {item.hint ? <span className="text-[0.6875rem] text-faint">{item.hint}</span> : null}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="grid grid-cols-2 gap-2 border-t border-white/8 p-3">
                <Button asChild variant="primary" size="sm">
                  <a href={profile.resumeFile} download={profile.resumeFileName}>
                    <Download />
                    Resume
                  </a>
                </Button>
                <Button asChild variant="glass" size="sm">
                  <a href={profile.links.github} target="_blank" rel="noreferrer noopener">
                    <brandIcons.GitHub />
                    GitHub
                    <ArrowUpRight />
                  </a>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
