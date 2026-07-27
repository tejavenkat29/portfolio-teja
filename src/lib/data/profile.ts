export const profile = {
  name: "Teja Venkat Kundem",
  shortName: "Teja",
  monogram: "TK",
  headline: "Backend Software Engineer",
  /** Cycled by the hero's rotating title. Order matters — first one is SSR'd. */
  roles: [
    "Backend Software Engineer",
    "Python Backend Developer",
    "AI Engineer",
    "Distributed Systems Enthusiast",
  ],
  intro:
    "I design and build scalable backend systems, AI-powered applications, distributed architectures, and production-grade APIs that solve real-world problems.",
  /** A second, denser line used for SEO descriptions and the About lede. */
  summary:
    "Backend engineer with 1+ year of experience shipping production real-time AI systems in Python, Django, DRF and FastAPI. I own the unglamorous parts — latency budgets, provider failover, idempotent webhooks, cost per turn — for systems where a 300 ms regression is something a user can hear.",
  location: "Andhra Pradesh, India",
  timezone: "Asia/Kolkata",
  availability: "Open to backend & AI engineering roles",
  email: "tejavenkat562@gmail.com",
  phone: "+91 96185 47741",
  phoneE164: "+919618547741",
  resumeFile: "/Teja_Venkat_Kundem_Resume.pdf",
  resumeFileName: "Teja_Venkat_Kundem_Resume.pdf",
  links: {
    github: "https://github.com/tejavenkat29",
    linkedin: "https://www.linkedin.com/in/teja-venkat-kundem/",
    whatsapp: "https://wa.me/919618547741",
    mail: "mailto:tejavenkat562@gmail.com",
  },
  githubUser: "tejavenkat29",
  /** Used by JSON-LD + the OG image. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tejavenkatkundem.com",
  currentRole: {
    title: "Software Engineer",
    company: "Gamyam Info Tech LLP",
    since: "2025-08-01",
  },
} as const;

export const education = {
  degree: "B.Tech, Computer Science & Engineering",
  institution: "BVC Engineering College",
  period: "2021 – 2025",
  cgpa: "8.10",
} as const;
