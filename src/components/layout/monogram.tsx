import { cn } from "@/lib/utils";

/**
 * Identity mark: a bracketed monogram. The brackets read as code, the diagonal
 * as a signal path — a backend engineer's initials rather than a generic badge.
 */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("shrink-0", className)} role="img" aria-label="Teja Venkat Kundem">
      <defs>
        <linearGradient id="mg-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="55%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#00D9FF" />
        </linearGradient>
        <linearGradient id="mg-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <rect x="1.25" y="1.25" width="37.5" height="37.5" rx="11" fill="url(#mg-fill)" />
      <rect
        x="1.25"
        y="1.25"
        width="37.5"
        height="37.5"
        rx="11"
        fill="none"
        stroke="url(#mg-stroke)"
        strokeWidth="1.5"
      />

      {/* T */}
      <path
        d="M9.5 13.25h9.25M14.1 13.25v13.5"
        stroke="#ffffff"
        strokeWidth="2.1"
        strokeLinecap="round"
        fill="none"
      />
      {/* K */}
      <path
        d="M23.6 13.25v13.5M30.9 13.6l-6.4 6.6 6.6 6.6"
        stroke="url(#mg-stroke)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
