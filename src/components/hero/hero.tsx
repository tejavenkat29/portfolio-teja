"use client";

import * as React from "react";
import { ArrowDown, Command, Copy, Check, Download, FolderKanban, Mail, MapPin, Terminal } from "lucide-react";

import { cn } from "@/lib/utils";
import { profile } from "@/lib/data/profile";
import { openPalette, openTerminal, scrollToSection } from "@/lib/ui-events";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/interactive/magnetic";
import { WordReveal } from "@/components/hero/word-reveal";
import { ParticleField } from "@/components/hero/particle-field";
import { OrbitCluster } from "@/components/hero/orbit-cluster";
import { RotatingRole } from "@/components/hero/rotating-role";

/** CSS entrance delay — `enter` carries the keyframes, this only stages them. */
const enterAt = (seconds: number) => ({ animationDelay: `${seconds}s` });

export function Hero() {
  const [copied, setCopied] = React.useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = profile.links.mail;
    }
  };

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative flex min-h-svh items-center overflow-hidden pb-10 pt-(--nav-h) sm:pb-16"
    >
      <ParticleField className="absolute inset-0 size-full opacity-70" />

      {/* Horizon glow that anchors the hero to the fold */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,#050816,transparent)]"
      />

      <div className="shell relative w-full">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-9 sm:gap-14 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:gap-10">
          {/* ---------------------------------------------------------------- */}
          {/* Left — the pitch                                                 */}
          {/* ---------------------------------------------------------------- */}
          <div className="max-w-2xl">
            <div className="enter mb-5 flex flex-wrap items-center gap-3 sm:mb-7" style={enterAt(0.04)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/8 py-1.5 pl-2.5 pr-3.5">
                <span className="relative grid size-2 place-items-center">
                  <span className="absolute size-2 rounded-full bg-success/60 animate-ping motion-reduce:animate-none" />
                  <span className="size-1.5 rounded-full bg-success" />
                </span>
                <span className="text-xs font-medium text-[#a7f3c4]">{profile.availability}</span>
              </span>

              <span className="hidden items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint sm:inline-flex">
                <MapPin className="size-3" />
                {profile.location}
              </span>
            </div>

            <h1 id="hero-heading" className="text-display font-bold">
              <WordReveal text="Teja Venkat" className="block text-gradient" />
              <WordReveal text="Kundem" className="block text-gradient" delay={0.06} />
            </h1>

            <div
              className="enter mt-4 flex min-h-[2.5rem] items-center text-[1.0625rem] font-medium sm:mt-6 sm:text-xl md:text-[1.375rem]"
              style={enterAt(0.26)}
            >
              <RotatingRole roles={profile.roles} />
            </div>

            {/* Deliberately not animated. The gradient headline is painted with
                `color: transparent`, so it can never be an LCP candidate; this
                paragraph is the largest element that can. Fading it in from
                opacity 0 makes the browser fall through to whatever paints next
                — which was the rotating role, repainting every 2.9s and pinning
                LCP around 4s. Rendered immediately, LCP lands with FCP. */}
            <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-muted sm:mt-6">
              {profile.intro}
            </p>

            {/* Actions — the primary spans the row on phones and the two secondary
                actions pair off beside it, which keeps the fold from being eaten by
                three stacked 52px buttons. Inline from sm up. */}
            <div
              className="enter mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:flex sm:flex-wrap sm:items-center"
              style={enterAt(0.36)}
            >
              <Magnetic className="col-span-2 w-full sm:col-span-1 sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => scrollToSection("#projects")}
                  className="w-full sm:w-auto"
                >
                  <FolderKanban />
                  View Projects
                </Button>
              </Magnetic>

              <Magnetic className="w-full sm:w-auto">
                <Button asChild variant="glass" size="lg" className="w-full px-5 sm:w-auto sm:px-7">
                  <a href={profile.resumeFile} download={profile.resumeFileName}>
                    <Download />
                    {/* The full label doesn't fit a half-width column at 390px. */}
                    <span className="sm:hidden">Resume</span>
                    <span className="hidden sm:inline">Download Resume</span>
                  </a>
                </Button>
              </Magnetic>

              <Magnetic className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToSection("#contact")}
                  className="w-full px-5 sm:w-auto sm:px-7"
                >
                  <Mail />
                  Contact
                </Button>
              </Magnetic>
            </div>

            {/* Utility rail */}
            <div
              className="enter mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-9"
              style={enterAt(0.44)}
            >
              <button
                type="button"
                onClick={copyEmail}
                className={cn(
                  "group inline-flex items-center gap-2 font-mono text-[0.8125rem] text-muted",
                  "transition-colors duration-300 hover:text-white",
                )}
              >
                {copied ? (
                  <Check className="size-3.5 text-success" />
                ) : (
                  <Copy className="size-3.5 transition-transform duration-300 group-hover:-translate-y-px" />
                )}
                {copied ? "Copied to clipboard" : profile.email}
              </button>

              <span aria-hidden className="hidden h-4 w-px bg-white/10 sm:block" />

              <button
                type="button"
                onClick={openPalette}
                className="inline-flex items-center gap-2 text-[0.8125rem] text-muted transition-colors duration-300 hover:text-white"
              >
                <Command className="size-3.5" />
                Command palette
                {/* A key hint is noise on a touch device — the button still opens it. */}
                <kbd className="hidden rounded border border-white/12 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.625rem] text-white/70 sm:inline">
                  ⌘K
                </kbd>
              </button>

              <span aria-hidden className="hidden h-4 w-px bg-white/10 sm:block" />

              <button
                type="button"
                onClick={openTerminal}
                className="inline-flex items-center gap-2 text-[0.8125rem] text-muted transition-colors duration-300 hover:text-white"
              >
                <Terminal className="size-3.5" />
                Try the terminal
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Right — the interactive profile                                  */}
          {/* ---------------------------------------------------------------- */}
          <div className="enter relative" style={enterAt(0.2)}>
            <OrbitCluster />
          </div>
        </div>

      </div>

      {/* Scroll cue — anchored to the viewport-height section, not the content */}
      <button
        type="button"
        onClick={() => scrollToSection("#about")}
        style={enterAt(0.62)}
        className={cn(
          "enter group absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex",
          "text-faint transition-colors duration-300 hover:text-white",
        )}
        aria-label="Scroll to About"
      >
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.22em]">Scroll</span>
        <span className="grid size-8 place-items-center rounded-full border border-white/10 transition-colors group-hover:border-white/25">
          <ArrowDown className="size-3.5 motion-safe:animate-bounce" />
        </span>
      </button>
    </section>
  );
}
