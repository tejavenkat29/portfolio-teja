import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Word-by-word headline reveal driven entirely by CSS.
 *
 * The JS equivalent can't start until React hydrates, which keeps the largest
 * text on the page at opacity 0 for the whole hydration window and drags LCP
 * with it. This version animates from first paint and needs no JavaScript.
 *
 * The fill mode is `backwards`, never `both`: `both` would leave an identity
 * transform on every word, and a transformed descendant cannot be clipped by an
 * ancestor's `background-clip: text` — the gradient headline would vanish.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
  step = 0.03,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
}) {
  const words = text.split(" ");

  return (
    <span className={cn("inline-block", className)}>
      {/* Screen readers get the phrase once, unfragmented. */}
      <span className="sr-only">{text}</span>

      <span aria-hidden>
        {words.map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span
                className="enter-word inline-block"
                style={{ animationDelay: `${(delay + index * step).toFixed(3)}s` }}
              >
                {word}
              </span>
            </span>
            {/* The separator lives outside the clipping wrapper: a trailing space
                inside an inline-block is trimmed, which welds the words together. */}
            {index < words.length - 1 ? " " : null}
          </React.Fragment>
        ))}
      </span>
    </span>
  );
}
