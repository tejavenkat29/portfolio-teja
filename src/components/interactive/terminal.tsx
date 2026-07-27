"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Minus, Terminal as TerminalIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { profile, education } from "@/lib/data/profile";
import { experience } from "@/lib/data/experience";
import { projects } from "@/lib/data/projects";
import { skillCategories } from "@/lib/data/skills";
import { stackLayers } from "@/lib/data/stack";
import { navItems } from "@/lib/data/site";
import { scrollToSection } from "@/lib/ui-events";

type Line = { id: number; kind: "in" | "out" | "err" | "sys"; node: React.ReactNode };

const PROMPT = "teja@portfolio";

/* ------------------------------------------------------------------ helpers */

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="w-24 shrink-0 text-accent/80">{label}</span>
      <span className="min-w-0 flex-1 text-white/80">{value}</span>
    </div>
  );
}

function Bar({ level }: { level: number }) {
  const filled = Math.round((level / 100) * 18);
  return (
    <span className="text-primary/90">
      {"█".repeat(filled)}
      <span className="text-white/12">{"░".repeat(18 - filled)}</span>
      <span className="ml-2 text-faint">{level}%</span>
    </span>
  );
}

const COMMANDS = [
  ["help", "List every available command"],
  ["about", "Who I am and what I build"],
  ["whoami", "Identity, role and location"],
  ["experience", "Roles and what I owned"],
  ["projects", "Production work — add a name for detail"],
  ["skills", "Proficiency by category"],
  ["stack", "What runs where in production"],
  ["resume", "Download the PDF résumé"],
  ["contact", "Every way to reach me"],
  ["github", "Open my GitHub profile"],
  ["theme", "Inspect the design tokens"],
  ["ls", "List the sections on this page"],
  ["open <section>", "Scroll to a section and close"],
  ["clear", "Clear the screen"],
  ["exit", "Close the terminal"],
] as const;

/* ---------------------------------------------------------------- component */

export function TerminalOverlay({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [minimized, setMinimized] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [history, setHistory] = React.useState<string[]>([]);
  const [cursor, setCursor] = React.useState<number | null>(null);
  const counter = React.useRef(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const nextId = () => ++counter.current;

  const banner = React.useMemo<Line[]>(
    () => [
      {
        id: 0,
        kind: "sys",
        node: (
          <div className="space-y-1">
            <div className="text-white/90">
              {profile.name} — <span className="text-primary">Backend Software Engineer</span>
            </div>
            <div className="text-faint">
              Python · Django · DRF · FastAPI · real-time AI · distributed systems
            </div>
            <div className="pt-1 text-faint">
              Type <span className="text-accent">help</span> to see what this shell knows.
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  const [lines, setLines] = React.useState<Line[]>(banner);

  // Focus the prompt whenever the shell is (re)opened.
  React.useEffect(() => {
    if (!open) return;
    setMinimized(false);
    const focus = window.setTimeout(() => inputRef.current?.focus(), 120);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focus);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, minimized]);

  const push = React.useCallback((kind: Line["kind"], node: React.ReactNode) => {
    setLines((prev) => [...prev, { id: nextId(), kind, node }]);
  }, []);

  const resolve = React.useCallback(
    (raw: string) => {
      const [command, ...rest] = raw.trim().split(/\s+/);
      const arg = rest.join(" ").toLowerCase();

      switch ((command ?? "").toLowerCase()) {
        case "help":
          return push(
            "out",
            <div className="space-y-1">
              {COMMANDS.map(([name, description]) => (
                <div key={name} className="flex gap-3">
                  <span className="w-32 shrink-0 text-accent">{name}</span>
                  <span className="text-white/70">{description}</span>
                </div>
              ))}
            </div>,
          );

        case "about":
          return push(
            "out",
            <div className="space-y-2">
              <p className="text-white/80">{profile.summary}</p>
              <div className="space-y-1 pt-1">
                <Row label="focus" value="Real-time AI backends, distributed systems, production APIs" />
                <Row label="education" value={`${education.degree} — ${education.institution} (CGPA ${education.cgpa})`} />
                <Row label="languages" value="English · Hindi · Telugu" />
              </div>
            </div>,
          );

        case "whoami":
          return push(
            "out",
            <div className="space-y-1">
              <Row label="name" value={profile.name} />
              <Row label="role" value={`${profile.currentRole.title} @ ${profile.currentRole.company}`} />
              <Row label="location" value={`${profile.location} · IST (UTC+5:30)`} />
              <Row label="status" value={<span className="text-success">{profile.availability}</span>} />
            </div>,
          );

        case "experience":
          return push(
            "out",
            <div className="space-y-3">
              {experience.map((role) => (
                <div key={role.id} className="space-y-1">
                  <div className="text-white/90">
                    {role.title} <span className="text-faint">—</span> {role.company}
                  </div>
                  <div className="text-faint">
                    {role.start.slice(0, 7)} → {role.end ? role.end.slice(0, 7) : "present"} · {role.location}
                  </div>
                  <div className="text-white/70">{role.mandate}</div>
                </div>
              ))}
            </div>,
          );

        case "projects": {
          if (arg) {
            const match = projects.find(
              (p) => p.id.includes(arg) || p.name.toLowerCase().includes(arg),
            );
            if (!match) return push("err", `No project matches “${arg}”. Try: ${projects.map((p) => p.id).join(", ")}`);
            return push(
              "out",
              <div className="space-y-2">
                <div className="text-white/90">
                  {match.name} <span className="text-faint">·</span>{" "}
                  <span className="text-primary">{match.status}</span>
                </div>
                <p className="text-white/70">{match.overview}</p>
                <div className="space-y-1 pt-1">
                  <Row label="role" value={match.role} />
                  <Row label="period" value={match.period} />
                  <Row
                    label="stack"
                    value={match.stack.flatMap((group) => group.items).slice(0, 8).join(" · ")}
                  />
                  <Row
                    label="results"
                    value={match.results.map((r) => `${r.value} ${r.label.toLowerCase()}`).join(" · ")}
                  />
                </div>
              </div>,
            );
          }
          return push(
            "out",
            <div className="space-y-1">
              {projects.map((project) => (
                <div key={project.id} className="flex flex-wrap gap-x-3">
                  <span className="w-28 shrink-0 text-accent">{project.id}</span>
                  <span className="text-white/80">{project.tagline}</span>
                </div>
              ))}
              <div className="pt-1 text-faint">
                Run <span className="text-accent">projects aayu</span> for the full breakdown.
              </div>
            </div>,
          );
        }

        case "skills": {
          const categories = arg
            ? skillCategories.filter((c) => c.id.includes(arg) || c.title.toLowerCase().includes(arg))
            : skillCategories;
          if (!categories.length) return push("err", `No skill category matches “${arg}”.`);
          return push(
            "out",
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="space-y-1">
                  <div className="text-secondary">{category.title}</div>
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="flex flex-wrap items-center gap-x-3">
                      <span className="w-40 shrink-0 text-white/75">{skill.name}</span>
                      <Bar level={skill.level} />
                    </div>
                  ))}
                </div>
              ))}
            </div>,
          );
        }

        case "stack":
          return push(
            "out",
            <div className="space-y-2">
              {stackLayers.map((layer) => (
                <div key={layer.id} className="flex flex-wrap gap-x-3">
                  <span className="w-40 shrink-0 text-accent">{layer.layer}</span>
                  <span className="text-white/75">{layer.items.map((i) => i.name).join(" · ")}</span>
                </div>
              ))}
            </div>,
          );

        case "resume": {
          const link = document.createElement("a");
          link.href = profile.resumeFile;
          link.download = profile.resumeFileName;
          link.click();
          return push(
            "out",
            <span>
              Downloading <span className="text-accent">{profile.resumeFileName}</span> — one page, no fluff.
            </span>,
          );
        }

        case "contact":
          return push(
            "out",
            <div className="space-y-1">
              <Row label="email" value={<a className="text-accent hover:underline" href={profile.links.mail}>{profile.email}</a>} />
              <Row label="phone" value={profile.phone} />
              <Row label="linkedin" value={<a className="text-accent hover:underline" href={profile.links.linkedin} target="_blank" rel="noreferrer">teja-venkat-kundem</a>} />
              <Row label="github" value={<a className="text-accent hover:underline" href={profile.links.github} target="_blank" rel="noreferrer">{profile.githubUser}</a>} />
              <Row label="whatsapp" value={<a className="text-accent hover:underline" href={profile.links.whatsapp} target="_blank" rel="noreferrer">{profile.phone}</a>} />
            </div>,
          );

        case "github":
          window.open(profile.links.github, "_blank", "noopener,noreferrer");
          return push("out", <span>Opening github.com/{profile.githubUser} …</span>);

        case "theme":
          return push(
            "out",
            <div className="space-y-2">
              <div className="text-white/75">
                Dark by design — a single, deliberate palette rather than a toggle. Tokens:
              </div>
              <div className="grid gap-1">
                {[
                  ["--color-void", "#050816", "background"],
                  ["--color-primary", "#6366F1", "primary"],
                  ["--color-secondary", "#8B5CF6", "secondary"],
                  ["--color-accent", "#00D9FF", "accent"],
                  ["--color-success", "#22C55E", "success"],
                  ["--color-muted", "#94A3B8", "secondary text"],
                ].map(([token, hex, role]) => (
                  <div key={token} className="flex items-center gap-3">
                    <span
                      className="size-3 shrink-0 rounded-sm border border-white/15"
                      style={{ background: hex }}
                    />
                    <span className="w-44 shrink-0 text-accent/80">{token}</span>
                    <span className="w-20 shrink-0 text-white/70">{hex}</span>
                    <span className="text-faint">{role}</span>
                  </div>
                ))}
              </div>
            </div>,
          );

        case "ls":
          return push(
            "out",
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {navItems.map((item) => (
                <span key={item.id} className="text-white/75">
                  {item.id}
                  <span className="text-faint">/</span>
                </span>
              ))}
            </div>,
          );

        case "cd":
        case "open": {
          const target = navItems.find((item) => item.id === arg || item.label.toLowerCase() === arg);
          if (!target) return push("err", `No section “${arg}”. Run ls to list them.`);
          onOpenChange(false);
          window.setTimeout(() => scrollToSection(target.href), 120);
          return push("out", <span>Navigating to {target.label} …</span>);
        }

        case "sudo":
          return push("err", `${profile.shortName} is not in the sudoers file. This incident has been logged. 🙂`);

        case "clear":
          setLines(banner);
          return;

        case "exit":
          onOpenChange(false);
          return;

        case "":
          return;

        default:
          return push(
            "err",
            <span>
              command not found: <span className="text-white/80">{command}</span> — try{" "}
              <span className="text-accent">help</span>
            </span>,
          );
      }
    },
    [banner, push, onOpenChange],
  );

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const raw = value;
    push("in", raw);
    if (raw.trim()) setHistory((prev) => [raw, ...prev].slice(0, 40));
    setCursor(null);
    setValue("");
    resolve(raw);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!history.length) return;
      const next = cursor === null ? 0 : Math.min(cursor + 1, history.length - 1);
      setCursor(next);
      setValue(history[next] ?? "");
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (cursor === null) return;
      const next = cursor - 1;
      if (next < 0) {
        setCursor(null);
        setValue("");
      } else {
        setCursor(next);
        setValue(history[next] ?? "");
      }
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const partial = value.trim().toLowerCase();
      if (!partial) return;
      const match = COMMANDS.map(([name]) => name.split(" ")[0]).find((name) => name.startsWith(partial));
      if (match) setValue(match);
    }
    if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setLines(banner);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="terminal"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.985 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "fixed bottom-4 left-1/2 z-95 w-[calc(100vw-1.5rem)] max-w-2xl -translate-x-1/2",
            "sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0",
          )}
          role="dialog"
          aria-label="Interactive terminal"
        >
          {/* Near-opaque on purpose: this panel carries dense text, so the page
              behind it must not compete with it. */}
          <div
            className={cn(
              "overflow-hidden rounded-2xl border border-white/12 bg-[#050a18]/97 backdrop-blur-2xl",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_40px_100px_-40px_rgba(0,0,0,0.95)]",
            )}
          >
            {/* Title bar */}
            <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Close terminal"
                  className="group grid size-3 place-items-center rounded-full bg-[#ff5f57]/85"
                >
                  <X className="size-2 text-black/0 transition-colors group-hover:text-black/60" />
                </button>
                <button
                  type="button"
                  onClick={() => setMinimized((v) => !v)}
                  aria-label={minimized ? "Expand terminal" : "Minimize terminal"}
                  className="group grid size-3 place-items-center rounded-full bg-[#febc2e]/85"
                >
                  <Minus className="size-2 text-black/0 transition-colors group-hover:text-black/60" />
                </button>
                <span className="size-3 rounded-full bg-[#28c840]/85" />
              </div>

              <span className="flex items-center gap-2 font-mono text-[0.6875rem] text-faint">
                <TerminalIcon className="size-3" />
                {PROMPT} — zsh
              </span>

              <span className="w-12" />
            </div>

            {!minimized ? (
              <>
                <div
                  ref={scrollRef}
                  className="max-h-[min(52vh,26rem)] space-y-2.5 overflow-y-auto overscroll-contain p-4 font-mono text-[0.8125rem] leading-relaxed"
                  onClick={() => inputRef.current?.focus()}
                >
                  {lines.map((line) => (
                    <div key={line.id}>
                      {line.kind === "in" ? (
                        <div className="flex gap-2">
                          <span className="shrink-0 text-success">➜</span>
                          <span className="shrink-0 text-primary">~</span>
                          <span className="text-white/90">{line.node}</span>
                        </div>
                      ) : line.kind === "err" ? (
                        <div className="text-[#fca5a5]">{line.node}</div>
                      ) : (
                        <div className={line.kind === "sys" ? "text-white/85" : "text-white/75"}>{line.node}</div>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/8 px-4 py-3">
                  <span className="shrink-0 font-mono text-[0.8125rem] text-success">➜</span>
                  <span className="shrink-0 font-mono text-[0.8125rem] text-primary">~</span>
                  <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={onKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="off"
                    aria-label="Terminal input"
                    placeholder="help"
                    className="w-full bg-transparent font-mono text-[0.8125rem] text-white outline-none placeholder:text-faint/70"
                  />
                  <button
                    type="submit"
                    aria-label="Run command"
                    className="shrink-0 text-faint transition-colors hover:text-white"
                  >
                    <CornerDownLeft className="size-3.5" />
                  </button>
                </form>
              </>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
