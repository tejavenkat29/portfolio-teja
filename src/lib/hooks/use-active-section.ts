"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section owns the viewport. Uses a band just under the nav so a
 * section becomes "active" when it reaches reading position, not when its first
 * pixel appears.
 */
export function useActiveSection(ids: string[], offset = 96) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length) return;

    let frame = 0;

    const compute = () => {
      frame = 0;
      const line = offset + 24;
      let current = elements[0]?.id ?? "";

      for (const el of elements) {
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= line && bottom > line) {
          current = el.id;
          break;
        }
        if (top <= line) current = el.id;
      }

      // Pin the last section once the page bottoms out, so short trailing
      // sections can still be reached.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        current = elements[elements.length - 1]?.id ?? current;
      }

      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(compute);
    };

    // A hash landing scrolls without necessarily firing a scroll event, so
    // recompute once the browser has settled on the anchor.
    const onHash = () => window.setTimeout(compute, 120);

    compute();
    onHash();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onHash);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onHash);
    };
  }, [ids, offset]);

  return active;
}
