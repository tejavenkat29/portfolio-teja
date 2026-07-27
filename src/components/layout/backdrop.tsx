/**
 * Page-wide atmosphere: three slow aurora blooms, a masked grid and film grain.
 * Fixed, non-interactive and GPU-composited — it never enters the scroll path.
 */
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden noise-overlay">
      {/* Base vertical wash — keeps the top brighter than the fold */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,#0c1230_0%,#050816_45%,#03050f_100%)]" />

      {/* Aurora blooms */}
      <div
        className="absolute -left-[18%] -top-[22%] size-[52rem] rounded-full opacity-60 blur-[110px] animate-aurora"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, color-mix(in oklab, var(--color-primary) 55%, transparent), transparent 68%)",
        }}
      />
      <div
        className="absolute -right-[14%] top-[8%] size-[44rem] rounded-full opacity-50 blur-[120px] animate-aurora [animation-delay:-7s]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-secondary) 52%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-16%] left-[26%] size-[40rem] rounded-full opacity-40 blur-[130px] animate-aurora [animation-delay:-14s]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--color-accent) 38%, transparent), transparent 72%)",
        }}
      />

      {/* Structure */}
      <div className="absolute inset-0 grid-backdrop opacity-70" />

      {/* Vignette so content always sits on the darkest part of the frame */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_50%,transparent_35%,rgba(3,5,18,0.72)_100%)]" />
    </div>
  );
}
