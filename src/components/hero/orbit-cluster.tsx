"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";
import { profile } from "@/lib/data/profile";
import { TechIcon, techColor, techLabel } from "@/components/icons";
import { Monogram } from "@/components/layout/monogram";
import { useIsTouch } from "@/lib/hooks/use-media-query";

const CoreScene = dynamic(() => import("@/components/hero/core-scene"), { ssr: false });

/** Cheap capability probe — cheaper than loading three.js to find out. */
function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

/** The ten technologies from the stack that define the day-to-day. */
const OUTER = ["python", "django", "fastapi", "docker", "aws", "postgres"] as const;
const INNER = ["openai", "anthropic", "redis", "livekit"] as const;

/**
 * One orbital ring. Placement uses full-size rotating "arms" rather than a
 * percentage translate — a percentage there would resolve against the chip's own
 * box, not the ring radius, and collapse every icon into the centre.
 *
 * Each chip then cancels both rotations (the carrier's animation and its own
 * arm angle) so logos stay upright and legible the whole way round.
 */
function OrbitRing({
  size,
  duration,
  slugs,
  reverse = false,
  chipClass,
  iconClass,
}: {
  size: string;
  duration: string;
  slugs: readonly string[];
  reverse?: boolean;
  chipClass: string;
  iconClass: string;
}) {
  const spin = `spin ${duration} linear infinite${reverse ? " reverse" : ""}`;
  const unspin = `spin ${duration} linear infinite${reverse ? "" : " reverse"}`;

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: size, height: size }}
    >
      {/* Ring track — a true hairline, brightened along two arcs */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 210deg, transparent 0deg, color-mix(in oklab, var(--color-primary) 55%, transparent) 46deg, transparent 130deg, transparent 210deg, color-mix(in oklab, var(--color-accent) 45%, transparent) 268deg, transparent 340deg)",
          mask: "radial-gradient(circle, transparent calc(50% - 1.25px), #000 calc(50% - 1.25px))",
          WebkitMask: "radial-gradient(circle, transparent calc(50% - 1.25px), #000 calc(50% - 1.25px))",
        }}
      />
      <div className="absolute inset-0 rounded-full border border-white/[0.07]" />

      {/* Rotating carrier */}
      <div className="absolute inset-0 motion-reduce:animate-none" style={{ animation: spin }}>
        {slugs.map((slug, index) => {
          const angle = (360 / slugs.length) * index;

          return (
            <div key={slug} className="absolute inset-0" style={{ transform: `rotate(${angle}deg)` }}>
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                <div className="motion-reduce:animate-none" style={{ animation: unspin }}>
                  <div style={{ transform: `rotate(${-angle}deg)` }}>
                    <div
                      className={cn(
                        "group/chip relative grid place-items-center rounded-2xl",
                        "border border-white/12 bg-[#080d20]/85 backdrop-blur-md",
                        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_12px_30px_-16px_rgba(0,0,0,0.95)]",
                        "transition-[transform,border-color] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        "hover:scale-110 hover:border-white/25",
                        chipClass,
                      )}
                      style={{ ["--brand" as string]: techColor(slug) }}
                      title={techLabel(slug)}
                    >
                      <TechIcon
                        slug={slug}
                        className={cn(
                          "text-white/75 transition-colors duration-400 group-hover/chip:text-[var(--brand)]",
                          iconClass,
                        )}
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-400 group-hover/chip:opacity-100"
                        style={{ boxShadow: "0 0 24px -4px var(--brand)" }}
                      />
                      <span className="sr-only">{techLabel(slug)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function OrbitCluster() {
  const reduced = useReducedMotion();
  const isTouch = useIsTouch();
  const [mounted, setMounted] = React.useState(false);
  const wrapper = React.useRef<HTMLDivElement>(null);

  // Pointer parallax — springs so the cluster settles rather than tracking 1:1.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 20, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 20, mass: 0.6 });
  const tx = useTransform(sx, [-1, 1], [-16, 16]);
  const ty = useTransform(sy, [-1, 1], [-14, 14]);
  const rotY = useTransform(sx, [-1, 1], [7, -7]);
  const rotX = useTransform(sy, [-1, 1], [-6, 6]);

  React.useEffect(() => {
    // Defer WebGL until the browser is idle so it never competes with LCP, then
    // mount it on every capable device. This used to bail below 768px, which left
    // phones with hollow rings while desktop got the wireframe core — the same
    // component rendering two different compositions. The scene is a wireframe
    // icosahedron plus 420 points, so the saving was never worth the divergence;
    // CoreScene caps its own DPR on small screens instead.
    if (reduced || !supportsWebGL()) return;
    let idleId = 0;
    let timeoutId = 0;

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(() => setMounted(true), { timeout: 2200 });
    } else {
      timeoutId = window.setTimeout(() => setMounted(true), 1400);
    }

    return () => {
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [reduced]);

  React.useEffect(() => {
    if (reduced || isTouch) return;
    const onMove = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      px.set((event.clientX / innerWidth) * 2 - 1);
      py.set((event.clientY / innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [px, py, reduced, isTouch]);

  return (
    <motion.div
      ref={wrapper}
      style={
        reduced || isTouch
          ? undefined
          : { x: tx, y: ty, rotateX: rotX, rotateY: rotY, transformPerspective: 1100 }
      }
      className="relative mx-auto aspect-square w-full max-w-[16rem] sm:max-w-[24rem] lg:max-w-[31rem]"
    >
      {/* Ambient bloom — kept low so the rings and logos stay the focus */}
      <div
        aria-hidden
        className="absolute inset-[14%] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, color-mix(in oklab, var(--color-primary) 22%, transparent), color-mix(in oklab, var(--color-secondary) 10%, transparent) 55%, transparent 74%)",
        }}
      />

      {/* WebGL core */}
      {mounted ? (
        <div aria-hidden className="absolute inset-0">
          <CoreScene />
        </div>
      ) : null}

      {/* Orbits */}
      <OrbitRing
        size="88%"
        duration="48s"
        slugs={OUTER}
        chipClass="h-11 w-11 sm:h-14 sm:w-14"
        iconClass="size-[1.15rem] sm:size-6"
      />
      <OrbitRing
        size="55%"
        duration="34s"
        slugs={INNER}
        reverse
        chipClass="h-9 w-9 sm:h-12 sm:w-12"
        iconClass="size-[0.9rem] sm:size-5"
      />

      {/* Centre identity */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid size-[7.25rem] place-items-center sm:size-[9.5rem]">
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border border-primary/30 animate-pulse-ring motion-reduce:animate-none"
          />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full border border-accent/20 animate-pulse-ring [animation-delay:-1.6s] motion-reduce:animate-none"
          />

          <div
            className={cn(
              "relative grid size-full place-items-center rounded-full",
              "border border-white/12 bg-[#070c1e]/80 backdrop-blur-xl",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_28px_70px_-30px_rgba(0,0,0,0.95)]",
            )}
          >
            {/* The monogram is the only item in the centring grid, so it lands on
                the exact axis the rings and chips orbit. The caption is taken out
                of flow — as a second grid child it centred the *pair*, which
                pushed the logo visibly above the centre of the whole cluster. */}
            <Monogram className="size-10 sm:size-14" />
            <span className="absolute bottom-[15%] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-faint">
              {profile.monogram} · IST
            </span>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
