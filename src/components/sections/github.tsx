import { ArrowUpRight, GitFork, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { profile } from "@/lib/data/profile";
import { getGithubData, languageColor, toWeeks, type GhDay } from "@/lib/github";
import { Section, SectionHeader } from "@/components/layout/section";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon, brandIcons } from "@/components/icons";
import { Reveal } from "@/components/interactive/reveal";

const LEVEL_BG = [
  "rgba(255,255,255,0.045)",
  "color-mix(in oklab, var(--color-primary) 34%, transparent)",
  "color-mix(in oklab, var(--color-primary) 58%, transparent)",
  "color-mix(in oklab, var(--color-secondary) 74%, transparent)",
  "var(--color-accent)",
] as const;

function relative(iso: string) {
  const then = new Date(iso).getTime();
  const days = Math.round((Date.now() - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

/**
 * Live GitHub section — server-rendered from the public API and revalidated
 * hourly. If an upstream is down the affected panel says so rather than showing
 * invented squares.
 */
export async function Github() {
  const data = await getGithubData();
  const weeks = data.contributions ? toWeeks(data.contributions.days) : [];

  const stats = [
    { label: "Public repos", value: data.user ? String(data.user.publicRepos) : "—", icon: "FolderKanban" },
    {
      label: "Contributions · 1y",
      value: data.contributions ? String(data.contributions.total) : "—",
      icon: "GitCommitHorizontal",
    },
    { label: "Stars earned", value: data.user ? String(data.totalStars) : "—", icon: "Star" },
    {
      label: "On GitHub since",
      value: data.user?.createdAt
        ? new Date(data.user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "—",
      icon: "CalendarRange",
    },
  ];

  return (
    <Section id="github">
      <SectionHeader
        id="github"
        index="08"
        eyebrow="GitHub"
        title="Public activity, pulled live"
        lede="Most of what I build is behind a company repository. What is public is here, fetched from the GitHub API and refreshed hourly."
        action={
          <Button asChild variant="glass" size="md">
            <a href={profile.links.github} target="_blank" rel="noreferrer noopener">
              <brandIcons.GitHub />
              @{profile.githubUser}
              <ArrowUpRight />
            </a>
          </Button>
        }
      />

      {/* Stats */}
      <Reveal>
        <div className="grid divide-white/8 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.015] sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3.5 p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03]">
                <Icon name={stat.icon} className="size-4 text-[#c7ccff]" />
              </span>
              <div>
                <div className="font-mono text-xl font-semibold leading-none tracking-tight text-white">
                  {stat.value}
                </div>
                <div className="mt-1.5 text-[0.6875rem] uppercase tracking-[0.12em] text-faint">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
        {/* ------------------------------------------------------------- */}
        {/* Contribution graph                                            */}
        {/* ------------------------------------------------------------- */}
        <Reveal>
          <GlassCard className="h-full p-5 sm:p-6" glow={false}>
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-[0.9375rem] font-semibold text-white">
                {data.contributions ? (
                  <>
                    <span className="font-mono text-accent">{data.contributions.total}</span> contributions in
                    the last year
                  </>
                ) : (
                  "Contribution graph"
                )}
              </h3>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
                {profile.githubUser}
              </span>
            </div>

            {weeks.length ? (
              <>
                <div className="no-scrollbar overflow-x-auto pb-1">
                  <div className="flex gap-[3px]" style={{ minWidth: `${weeks.length * 13}px` }}>
                    {weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-[3px]">
                        {week.map((day: GhDay | null, dayIndex) => (
                          <span
                            key={dayIndex}
                            title={
                              day
                                ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${new Date(
                                    `${day.date}T00:00:00Z`,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    timeZone: "UTC",
                                  })}`
                                : undefined
                            }
                            className={cn(
                              "size-[10px] rounded-[2px] transition-[transform,filter] duration-300",
                              day ? "hover:scale-125 hover:brightness-125" : "opacity-0",
                            )}
                            style={day ? { background: LEVEL_BG[day.level] } : undefined}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="font-mono text-[0.625rem] text-faint">
                    {data.contributions?.days[0]?.date} → {data.contributions?.days.at(-1)?.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="font-mono text-[0.625rem] text-faint">less</span>
                    {LEVEL_BG.map((background, index) => (
                      <span
                        key={index}
                        className="size-[10px] rounded-[2px]"
                        style={{ background }}
                        aria-hidden
                      />
                    ))}
                    <span className="font-mono text-[0.625rem] text-faint">more</span>
                  </span>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
                <p className="text-sm text-muted">
                  The contribution graph couldn&apos;t be loaded right now.
                </p>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
                >
                  View it on GitHub
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            )}

            {/* Languages */}
            {data.languages.length ? (
              <div className="mt-6 border-t border-white/8 pt-5">
                <h4 className="eyebrow mb-3.5">Languages across public repos</h4>

                <div className="flex h-1.5 overflow-hidden rounded-full bg-white/6">
                  {data.languages.map((language) => (
                    <span
                      key={language.name}
                      style={{ width: `${language.percent}%`, background: language.color }}
                      title={`${language.name} · ${language.percent}%`}
                    />
                  ))}
                </div>

                <ul className="mt-3.5 flex flex-wrap gap-x-5 gap-y-2">
                  {data.languages.map((language) => (
                    <li key={language.name} className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{ background: language.color }}
                        aria-hidden
                      />
                      <span className="text-[0.8125rem] text-white/80">{language.name}</span>
                      <span className="font-mono text-[0.6875rem] text-faint">{language.percent}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </GlassCard>
        </Reveal>

        {/* ------------------------------------------------------------- */}
        {/* Follow + activity                                             */}
        {/* ------------------------------------------------------------- */}
        <div className="grid gap-4">
          <Reveal delay={0.05}>
            <GlassCard className="p-5">
              <div className="flex items-center gap-3.5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03]">
                  <brandIcons.GitHub className="size-5 text-white/85" />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[0.9375rem] font-semibold text-white">
                    {data.user?.name ?? profile.name}
                  </div>
                  <div className="truncate font-mono text-[0.6875rem] text-faint">
                    @{data.user?.login ?? profile.githubUser}
                  </div>
                </div>
              </div>

              {data.user?.bio ? (
                <p className="mt-3.5 text-[0.8125rem] leading-relaxed text-muted">{data.user.bio}</p>
              ) : null}

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/8 pt-4">
                <div>
                  <div className="font-mono text-base font-semibold text-white">
                    {data.user?.followers ?? "—"}
                  </div>
                  <div className="text-[0.6875rem] uppercase tracking-[0.12em] text-faint">Followers</div>
                </div>
                <div>
                  <div className="font-mono text-base font-semibold text-white">
                    {data.user?.following ?? "—"}
                  </div>
                  <div className="text-[0.6875rem] uppercase tracking-[0.12em] text-faint">Following</div>
                </div>
              </div>

              <Button asChild variant="glass" size="sm" className="mt-4 w-full">
                <a href={`${profile.links.github}?tab=followers`} target="_blank" rel="noreferrer noopener">
                  Follow on GitHub
                  <ArrowUpRight />
                </a>
              </Button>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard className="h-full p-5" glow={false}>
              <h3 className="eyebrow mb-4">Recent activity</h3>

              {data.activity.length ? (
                <ul className="space-y-3">
                  {data.activity.map((event, index) => (
                    <li key={`${event.type}-${event.date}-${index}`} className="flex gap-3">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
                      <div className="min-w-0">
                        <p className="text-[0.8125rem] leading-snug text-white/80">
                          {event.label}{" "}
                          <span className="font-mono text-[0.75rem] text-accent">{event.repo}</span>
                        </p>
                        <span className="font-mono text-[0.625rem] text-faint">{relative(event.date)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[0.8125rem] text-muted">No public activity to show right now.</p>
              )}
            </GlassCard>
          </Reveal>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Repositories                                                  */}
      {/* ------------------------------------------------------------- */}
      {data.repos.length ? (
        <div className="mt-10">
          <Reveal>
            <h3 className="eyebrow mb-4">Public repositories</h3>
          </Reveal>

          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.repos.map((repo, index) => (
              <Reveal as="li" key={repo.id} delay={index * 0.04} className="h-full">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block h-full focus:outline-none"
                >
                  <GlassCard className="h-full p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <Icon
                          name={repo.isProfileReadme ? "IdCard" : "FolderKanban"}
                          className="size-4 shrink-0 text-primary"
                        />
                        <span className="truncate font-mono text-[0.875rem] font-medium text-white">
                          {repo.name}
                        </span>
                      </div>
                      <ArrowUpRight className="size-4 shrink-0 text-faint transition-transform duration-300 group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5" />
                    </div>

                    <p className="mt-3 line-clamp-3 min-h-[3.25rem] text-[0.8125rem] leading-relaxed text-muted">
                      {repo.description ??
                        (repo.isProfileReadme
                          ? "Profile README — what I'm building and working on."
                          : "No description provided.")}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/6 pt-3.5">
                      {repo.language ? (
                        <span className="flex items-center gap-1.5 text-[0.75rem] text-white/70">
                          <span
                            className="size-2 rounded-full"
                            style={{ background: languageColor(repo.language) }}
                          />
                          {repo.language}
                        </span>
                      ) : null}
                      <span className="flex items-center gap-1 font-mono text-[0.6875rem] text-faint">
                        <Star className="size-3" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[0.6875rem] text-faint">
                        <GitFork className="size-3" />
                        {repo.forks}
                      </span>
                      <span className="ml-auto font-mono text-[0.6875rem] text-faint">
                        {relative(repo.pushedAt)}
                      </span>
                    </div>
                  </GlassCard>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}
