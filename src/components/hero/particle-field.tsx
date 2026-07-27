"use client";

import * as React from "react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

const LINK_DISTANCE = 118;
const POINTER_RADIUS = 170;

/**
 * Constellation field behind the hero. Deliberately plain canvas 2D rather than
 * a library: ~70 nodes, one rAF loop, paused whenever it leaves the viewport or
 * the tab is hidden, and reduced to a single static frame when the user asks for
 * less motion.
 */
export function ParticleField({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let frame = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999, active: false };

    const seed = () => {
      const count = Math.min(78, Math.max(26, Math.round((width * height) / 17000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.3 + 0.6,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Links first so nodes sit on top of them.
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DISTANCE) continue;
          const alpha = (1 - dist / LINK_DISTANCE) * 0.19;
          ctx.strokeStyle = `rgba(139,142,255,${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Pointer tether — the field acknowledges the cursor without chasing it.
      if (pointer.active) {
        for (const p of particles) {
          const dist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (dist > POINTER_RADIUS) continue;
          const alpha = (1 - dist / POINTER_RADIUS) * 0.4;
          ctx.strokeStyle = `rgba(0,217,255,${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.fillStyle = "rgba(199,204,255,0.55)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < POINTER_RADIUS && dist > 0.01) {
            const pull = (1 - dist / POINTER_RADIUS) * 0.0055;
            p.vx += dx * pull;
            p.vy += dy * pull;
          }
        }

        // Bleed off accumulated pointer energy so motion stays calm.
        p.vx = Math.max(-0.7, Math.min(0.7, p.vx * 0.994));
        p.vy = Math.max(-0.7, Math.min(0.7, p.vy * 0.994));
      }

      draw();
      frame = window.requestAnimationFrame(step);
    };

    const start = () => {
      if (reduced || frame) return;
      frame = window.requestAnimationFrame(step);
    };

    const stop = () => {
      if (!frame) return;
      window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0.01 },
    );

    resize();
    observer.observe(canvas);
    start();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      observer.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
