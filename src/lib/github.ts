import { profile } from "@/lib/data/profile";

export type GhProfile = {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
  htmlUrl: string;
};

export type GhRepo = {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  pushedAt: string;
  topics: string[];
  isProfileReadme: boolean;
};

export type GhDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type GhData = {
  ok: boolean;
  user: GhProfile | null;
  repos: GhRepo[];
  totalStars: number;
  languages: { name: string; percent: number; color: string }[];
  contributions: { total: number; days: GhDay[] } | null;
  activity: { type: string; repo: string; date: string; label: string }[];
};

/** Canonical GitHub language colours for the handful that appear here. */
const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
  Dockerfile: "#384D54",
  "Jupyter Notebook": "#DA5B0B",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Java: "#B07219",
  SCSS: "#C6538C",
  Makefile: "#427819",
  Mako: "#7E858D",
};

export function languageColor(name: string | null) {
  if (!name) return "#64748B";
  return LANGUAGE_COLORS[name] ?? "#94A3B8";
}

const HEADERS: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "tvk-portfolio",
  // Optional: set GITHUB_TOKEN to lift the unauthenticated rate limit.
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

/** Revalidate hourly — fresh enough for a profile, cheap enough to stay static. */
const REVALIDATE = 3600;

async function getJson<T>(url: string, headers: HeadersInit = HEADERS): Promise<T | null> {
  try {
    const response = await fetch(url, { headers, next: { revalidate: REVALIDATE } });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    // A failed upstream must never break the page — the section degrades instead.
    return null;
  }
}

const EVENT_LABELS: Record<string, string> = {
  PushEvent: "Pushed commits to",
  CreateEvent: "Created a branch in",
  PullRequestEvent: "Opened a pull request in",
  IssuesEvent: "Filed an issue in",
  IssueCommentEvent: "Commented in",
  WatchEvent: "Starred",
  ForkEvent: "Forked",
  DeleteEvent: "Deleted a ref in",
  PullRequestReviewEvent: "Reviewed a pull request in",
  ReleaseEvent: "Published a release in",
};

/**
 * Everything the GitHub section renders, fetched server-side. Each source fails
 * independently: no contribution API means no graph, not a broken section.
 */
export async function getGithubData(): Promise<GhData> {
  const user = profile.githubUser;

  const [rawUser, rawRepos, rawContrib, rawEvents] = await Promise.all([
    getJson<Record<string, unknown>>(`https://api.github.com/users/${user}`),
    getJson<Record<string, unknown>[]>(
      `https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`,
    ),
    getJson<{ total: Record<string, number>; contributions: GhDay[] }>(
      `https://github-contributions-api.jogruber.de/v4/${user}?y=last`,
      { "User-Agent": "tvk-portfolio" },
    ),
    getJson<Record<string, unknown>[]>(`https://api.github.com/users/${user}/events/public?per_page=30`),
  ]);

  const mappedUser: GhProfile | null = rawUser
    ? {
        login: String(rawUser.login ?? user),
        name: (rawUser.name as string) ?? null,
        bio: (rawUser.bio as string) ?? null,
        avatarUrl: String(rawUser.avatar_url ?? ""),
        publicRepos: Number(rawUser.public_repos ?? 0),
        followers: Number(rawUser.followers ?? 0),
        following: Number(rawUser.following ?? 0),
        createdAt: String(rawUser.created_at ?? ""),
        htmlUrl: String(rawUser.html_url ?? profile.links.github),
      }
    : null;

  const repos: GhRepo[] = (rawRepos ?? [])
    .filter((repo) => !repo.fork && !repo.archived)
    .map((repo) => ({
      id: Number(repo.id),
      name: String(repo.name),
      description: (repo.description as string) ?? null,
      url: String(repo.html_url),
      language: (repo.language as string) ?? null,
      stars: Number(repo.stargazers_count ?? 0),
      forks: Number(repo.forks_count ?? 0),
      pushedAt: String(repo.pushed_at ?? ""),
      topics: (repo.topics as string[]) ?? [],
      isProfileReadme: String(repo.name).toLowerCase() === user.toLowerCase(),
    }))
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt));

  const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);

  // Language mix by repository count — the honest signal when repo sizes vary.
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (!repo.language) continue;
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const totalLangRepos = [...counts.values()].reduce((a, b) => a + b, 0);
  const languages = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      percent: totalLangRepos ? Math.round((count / totalLangRepos) * 100) : 0,
      color: languageColor(name),
    }));

  const contributions = rawContrib?.contributions?.length
    ? {
        total:
          Number(rawContrib.total?.lastYear ?? 0) ||
          rawContrib.contributions.reduce((sum, day) => sum + day.count, 0),
        days: rawContrib.contributions,
      }
    : null;

  const activity = (rawEvents ?? [])
    .map((event) => {
      const type = String(event.type ?? "");
      const repoName = String((event.repo as { name?: string } | undefined)?.name ?? "").split("/").pop() ?? "";
      return {
        type,
        repo: repoName,
        date: String(event.created_at ?? ""),
        label: EVENT_LABELS[type] ?? "Activity in",
      };
    })
    .filter((entry) => entry.repo)
    .slice(0, 6);

  return {
    ok: Boolean(mappedUser),
    user: mappedUser,
    repos,
    totalStars,
    languages,
    contributions,
    activity,
  };
}

/** Group a flat day list into calendar columns (weeks starting Sunday). */
export function toWeeks(days: GhDay[]): (GhDay | null)[][] {
  if (!days.length) return [];
  const weeks: (GhDay | null)[][] = [];
  const firstWeekday = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();

  let current: (GhDay | null)[] = Array.from({ length: firstWeekday }, () => null);

  for (const day of days) {
    current.push(day);
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
  }
  if (current.length) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }

  return weeks;
}
