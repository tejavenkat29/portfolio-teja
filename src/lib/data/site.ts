export type NavItem = {
  id: string;
  label: string;
  href: string;
  /** Shown in the desktop bar. Everything else lives in ⌘K + the mobile sheet. */
  primary?: boolean;
  icon: string;
  hint?: string;
};

export const navItems: NavItem[] = [
  { id: "home", label: "Home", href: "#home", icon: "House", hint: "Top of page" },
  { id: "about", label: "About", href: "#about", primary: true, icon: "User", hint: "Background & capabilities" },
  { id: "experience", label: "Experience", href: "#experience", primary: true, icon: "Briefcase", hint: "Roles & achievements" },
  { id: "projects", label: "Projects", href: "#projects", primary: true, icon: "FolderKanban", hint: "Aayu · Practo AHC · Practo DX" },
  { id: "architecture", label: "System Design", href: "#architecture", icon: "Workflow", hint: "Reference architecture" },
  { id: "skills", label: "Skills", href: "#skills", primary: true, icon: "Sparkles", hint: "Proficiency by category" },
  { id: "stack", label: "Tech Stack", href: "#stack", primary: true, icon: "Layers", hint: "What runs where" },
  { id: "achievements", label: "Achievements", href: "#achievements", icon: "Trophy", hint: "By the numbers" },
  { id: "github", label: "GitHub", href: "#github", primary: true, icon: "GitHub", hint: "Live activity & repos" },
  { id: "resume", label: "Resume", href: "#resume", primary: true, icon: "FileText", hint: "Preview & download" },
  { id: "contact", label: "Contact", href: "#contact", primary: true, icon: "Mail", hint: "Get in touch" },
];

export const achievements: { value: number; suffix: string; label: string; detail: string; icon: string }[] = [
  {
    value: 1,
    suffix: "+",
    label: "Years Experience",
    detail: "Production backend and AI systems since May 2025",
    icon: "CalendarRange",
  },
  {
    value: 10,
    suffix: "+",
    label: "Production APIs",
    detail: "Django/DRF endpoints serving high-volume traffic",
    icon: "Server",
  },
  {
    value: 20,
    suffix: "+",
    label: "Backend Features",
    detail: "Shipped across Aayu and Practo client platforms",
    icon: "Boxes",
  },
  {
    value: 100,
    suffix: "+",
    label: "Git Commits",
    detail: "Across product, client and personal repositories",
    icon: "GitCommitHorizontal",
  },
];

/** Secondary metric strip — the ones that describe engineering outcomes. */
export const outcomeMetrics: { value: string; label: string }[] = [
  { value: "25–30%", label: "API response time reduction" },
  { value: "3", label: "Languages supported end to end" },
  { value: "4", label: "AI providers orchestrated" },
  { value: "2", label: "Diagnostic partners integrated" },
];
