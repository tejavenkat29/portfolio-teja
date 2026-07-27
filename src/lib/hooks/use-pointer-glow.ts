"use client";

import { useCallback, useRef } from "react";

/**
 * Writes pointer position to CSS custom properties on the element. Nothing
 * re-renders — the glow is pure CSS reading --mx / --my.
 */
export function usePointerGlow<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const raf = useRef(0);

  const onPointerMove = useCallback((event: React.PointerEvent<T>) => {
    const el = ref.current;
    if (!el || raf.current) return;
    const { clientX, clientY } = event;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - rect.left}px`);
      el.style.setProperty("--my", `${clientY - rect.top}px`);
    });
  }, []);

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "-40%");
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
