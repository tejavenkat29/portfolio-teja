# Teja Venkat Kundem — Portfolio

Personal portfolio for a backend software engineer working on real-time AI systems,
distributed architectures and production APIs.

Built with **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Framer Motion · Radix UI · React Three Fiber**.

---

## Quick start

```bash
npm install          # first run may need --legacy-peer-deps on npm 10
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm start            # serve the production build
npm run lint         # ESLint (next/core-web-vitals + next/typescript)
npm run typecheck    # tsc --noEmit
```

A production build and a running `next dev` both write to `.next` and will
corrupt each other (`Cannot find module './xxx.js'`). To build while dev is
running, point the build at its own directory:

```bash
NEXT_DIST_DIR=.next-prod npm run build
NEXT_DIST_DIR=.next-prod npm start
```

---

## What's in here

| Section | Notes |
| --- | --- |
| **Hero** | Full-viewport. Rotating role titles, canvas constellation field, orbital tech ring with 10 real stack logos, lazy WebGL core, pointer parallax. |
| **About** | Scroll-drawn trajectory timeline + eight evidence cards. No filler paragraphs. |
| **Experience** | Vertical timeline; achievements render as feature cards rather than bullets. |
| **Projects** | Aayu, Practo AHC, Practo DX — each with a live architecture schematic and tabbed Overview / Problem / Architecture / Features / Challenges / Results. |
| **System Design** | Interactive reference architecture: select a hop, read the decision behind it. |
| **Skills** | Categorised proficiency cards with animated level bars and the work each skill came from. |
| **Tech Stack** | The same stack arranged by layer — edge → application → async → AI → data → platform. |
| **Achievements** | Animated counters plus an engineering-outcome strip. |
| **GitHub** | **Live** data from the GitHub API + contribution calendar, revalidated hourly. |
| **Resume** | The real PDF embedded inline, with file size and date read from disk at build time. |
| **Contact** | Server-action form with validation, honeypot and throttling, plus every direct channel. |

Global extras: `⌘K` / `Ctrl+K` command palette, an interactive terminal
(`help`, `about`, `whoami`, `experience`, `projects`, `skills`, `stack`,
`resume`, `contact`, `github`, `theme`, `ls`, `open <section>`, `clear`, `exit`),
scroll progress rail, and a fully keyboard-navigable nav.

---

## Content lives in one place

All copy, metrics and links are typed data — no content is hardcoded in components:

```
src/lib/data/
├── profile.ts         name, links, résumé path, availability
├── about.ts           capability cards, facts rail, trajectory
├── experience.ts      roles and achievement cards
├── projects.ts        full case studies + architecture diagrams
├── skills.ts          categories, levels, tiers
├── stack.ts           production stack by layer + hero marquee
├── system-design.ts   reference architecture + principles
└── site.ts            navigation, counters, outcome metrics
```

Edit those files and every section, the command palette, the terminal and the
JSON-LD update together.

### Swapping the résumé

Replace `public/Teja_Venkat_Kundem_Resume.pdf` (keep the filename, or update
`resumeFile` / `resumeFileName` in `src/lib/data/profile.ts`). The preview, the
download buttons, the terminal `resume` command and the sitemap all follow.

### Adding a profile photo

The hero centre is a geometric monogram by design. To use a photo instead, drop a
square image in `public/` and render it inside the centre disc in
`src/components/hero/orbit-cluster.tsx` (replace `<Monogram />` with
`next/image`).

---

## Environment variables

Everything works with no configuration. These are optional:

| Variable | Effect if unset |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, JSON-LD and the sitemap. Defaults to `https://tejavenkatkundem.com`. |
| `NEXT_DIST_DIR` | Build output directory. Defaults to `.next`; set it to build without clobbering a running dev server. |
| `GITHUB_TOKEN` | GitHub calls run unauthenticated (60 req/hr per IP — fine with hourly revalidation). A classic token with no scopes lifts the limit. |
| `RESEND_API_KEY` + `CONTACT_FROM_EMAIL` | Contact form falls back to opening the visitor's own mail client with the message pre-filled. With both set, the server action sends directly via Resend. |

```bash
cp .env.example .env.local   # then fill in what you need
```

---

## Design system

Tokens live in `src/app/globals.css` under `@theme` — colours, the fluid type
scale, one shared easing curve, and the named animations. Component classes read
from those tokens, so a palette change propagates everywhere.

```
background #050816   primary #6366F1   secondary #8B5CF6
accent     #00D9FF   success #22C55E   muted     #94A3B8
```

Surfaces use a single `GlassCard` with a pointer-tracked highlight. Custom
utilities (`glass`, `gradient-ring`, `grid-backdrop`, `noise-overlay`,
`mask-fade-x`, `shell`) keep that vocabulary consistent instead of repeating long
class strings.

---

## Performance & accessibility

Measured on the production build (headless Chrome, localhost, 1440×900):

| Metric | Value |
| --- | --- |
| LCP | ~424 ms (equal to FCP) |
| CLS | 0 |
| JS deferred past `load` | 19 KB (command palette + terminal) |
| Style recalculation | ~121 ms |

Run Lighthouse against the deployed site for a scored result — a local headless
run with software rendering isn't representative.

**Above the fold is CSS, not JavaScript.** The hero entrance uses keyframes with
staged `animation-delay`, so it starts at first paint instead of waiting for
hydration, and it still resolves with JS disabled.

**Two LCP traps this layout walks into** — worth knowing before editing the hero:

1. `background-clip: text` requires `color: transparent`, which makes the
   gradient headline permanently ineligible as an LCP candidate. The intro
   paragraph is therefore the largest eligible element and is deliberately
   rendered without an entrance animation. Fading it in pushed LCP onto the
   rotating role text, which repaints every 2.9 s — LCP landed at ~4 s.
2. Entrance animations use `animation-fill-mode: backwards`, never `both`.
   `both` retains the final keyframe, leaving an identity `transform` on the
   element; a transformed descendant can't be clipped by an ancestor's
   `background-clip: text`, and the headline disappears entirely.

Everything else:

- Static prerender with hourly ISR; WebGL is dynamically imported, deferred to
  idle, feature-detected, DPR-capped on small screens, and wrapped in an error
  boundary. It renders on phones too — gating it by viewport width meant the hero
  was a different composition on mobile than on desktop, which is not a saving
  worth making for a wireframe icosahedron and 420 points.
- The command palette and terminal load on first use, with both chunks warmed
  during idle so the first ⌘K is still instant.
- Sections use `content-visibility: auto` with an intrinsic size, so off-screen
  content skips style, layout and paint (~18% less style recalculation) with no
  layout shift.
- The canvas particle field pauses when off-screen or when the tab is hidden.
- `prefers-reduced-motion` is honoured globally in CSS **and** per-component.
  The global rule zeroes `animation-delay` as well as duration — otherwise
  staged entrances would hold content hidden through the full stagger.
- Icon barrels are tree-shaken via `optimizePackageImports`.
- Semantic landmarks, a skip link to `#main`, labelled controls, visible focus
  rings, `aria-current` on the active nav item, and no colour-only signals.
- A `<noscript>` rule resolves every scroll reveal, so the page is fully
  readable without JavaScript.
- SEO: per-section metadata, Person JSON-LD, generated OG image, sitemap,
  robots and a web manifest.

---

## Deploying

Vercel needs no configuration beyond the optional env vars above. Any Node host
works with `npm run build && npm start`.

Because the GitHub section uses ISR, the first request after a deploy renders the
build-time snapshot and refreshes within the hour.
