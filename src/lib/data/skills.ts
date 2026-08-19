export type Tier = "core" | "production" | "working";

export type Skill = {
  name: string;
  /** react-icons key resolved by the tech icon registry */
  icon: string;
  level: number;
  tier: Tier;
  /** Where it's actually been used — every entry maps to shipped work. */
  usedFor: string;
};

export type SkillCategory = {
  id: string;
  title: string;
  blurb: string;
  icon: string;
  tone: "primary" | "secondary" | "accent" | "success";
  skills: Skill[];
};

export const tierMeta: Record<Tier, { label: string; ring: string }> = {
  core: { label: "Daily driver", ring: "var(--color-accent)" },
  production: { label: "Shipped in production", ring: "var(--color-primary)" },
  working: { label: "Working knowledge", ring: "var(--color-muted)" },
};

export const skillCategories: SkillCategory[] = [
  {
    id: "programming",
    title: "Programming",
    blurb: "The languages everything else is expressed in.",
    icon: "CodeXml",
    tone: "primary",
    skills: [
      { name: "Python", icon: "python", level: 95, tier: "core", usedFor: "Every backend service, pipeline and worker I ship" },
      { name: "SQL", icon: "sql", level: 88, tier: "core", usedFor: "Query tuning and indexing that cut response times 25–30%" },
      { name: "Bash", icon: "bash", level: 80, tier: "production", usedFor: "Deploy scripts, server ops and CI glue on Linux" },
      { name: "JavaScript", icon: "javascript", level: 70, tier: "working", usedFor: "Frontend integration and this portfolio's tooling" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    blurb: "Where the request lands and the contract is kept.",
    icon: "Server",
    tone: "primary",
    skills: [
      { name: "Django", icon: "django", level: 94, tier: "core", usedFor: "Aayu backend and Practo booking / diagnostics services" },
      { name: "Django REST Framework", icon: "drf", level: 93, tier: "core", usedFor: "10+ production REST APIs under high-volume traffic" },
      { name: "FastAPI", icon: "fastapi", level: 85, tier: "production", usedFor: "Async services and internal AI-facing endpoints" },
      { name: "Celery", icon: "celery", level: 90, tier: "core", usedFor: "Post-session processing, order fan-out, report delivery" },
    ],
  },
  {
    id: "ai",
    title: "AI & LLM",
    blurb: "Orchestration, not prompt collecting — cost and latency are part of the design.",
    icon: "Brain",
    tone: "secondary",
    skills: [
      { name: "OpenAI API", icon: "openai", level: 92, tier: "core", usedFor: "gpt-realtime on-path voice model in Aayu" },
      { name: "Anthropic Claude", icon: "anthropic", level: 90, tier: "core", usedFor: "Off-path reasoner on AWS Bedrock + prompt caching" },
      { name: "LangChain", icon: "langchain", level: 82, tier: "production", usedFor: "LLM application scaffolding and tool wiring" },
      { name: "LangGraph", icon: "langgraph", level: 78, tier: "production", usedFor: "Stateful, multi-step agent flows" },
      { name: "LangSmith", icon: "langsmith", level: 72, tier: "working", usedFor: "Tracing and evaluating LLM chains" },
      { name: "Hugging Face", icon: "huggingface", level: 70, tier: "working", usedFor: "Model exploration and inference experiments" },
      { name: "Scikit-learn", icon: "sklearn", level: 80, tier: "production", usedFor: "ML pipelines, feature engineering, tuning" },
    ],
  },
  {
    id: "databases",
    title: "Databases",
    blurb: "Chosen by access pattern — not by habit.",
    icon: "Database",
    tone: "accent",
    skills: [
      { name: "PostgreSQL", icon: "postgres", level: 92, tier: "core", usedFor: "Transactional state, per-turn telemetry, indexing strategy" },
      { name: "MongoDB", icon: "mongodb", level: 82, tier: "production", usedFor: "Unstructured session artifacts and transcripts" },
      { name: "Redis", icon: "redis", level: 90, tier: "core", usedFor: "Hot-path caching, Celery broker, slot locks" },
      { name: "Elasticsearch", icon: "elasticsearch", level: 78, tier: "production", usedFor: "Catalog and test search on the Practo DX platform" },
      { name: "MySQL", icon: "mysql", level: 75, tier: "working", usedFor: "Relational modelling and querying alongside PostgreSQL" },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    blurb: "A repeatable path from a local container to a running production service.",
    icon: "Cloud",
    tone: "success",
    skills: [
      { name: "AWS", icon: "aws", level: 86, tier: "production", usedFor: "EC2, S3, SQS and Bedrock in production" },
      { name: "Docker", icon: "docker", level: 90, tier: "core", usedFor: "Identical images across dev, CI and production" },
      { name: "Docker Compose", icon: "docker", level: 88, tier: "core", usedFor: "Multi-service local and deployed stacks" },
      { name: "Kubernetes", icon: "kubernetes", level: 74, tier: "production", usedFor: "Practo diagnostics services in production" },
      { name: "Linux", icon: "linux", level: 85, tier: "core", usedFor: "Server operation, debugging and process management" },
      { name: "Nginx", icon: "nginx", level: 80, tier: "production", usedFor: "Reverse proxy, TLS termination, static delivery" },
      { name: "CI/CD", icon: "cicd", level: 85, tier: "core", usedFor: "Automated build, test and deploy pipelines" },
      { name: "GitHub Actions", icon: "githubactions", level: 87, tier: "core", usedFor: "Every deploy I own runs through it" },
      { name: "Terraform", icon: "terraform", level: 68, tier: "working", usedFor: "Declarative AWS infrastructure as code" },
      { name: "Ansible", icon: "ansible", level: 66, tier: "working", usedFor: "Repeatable server configuration and provisioning" },
    ],
  },
  {
    id: "monitoring",
    title: "Monitoring & Observability",
    blurb: "If it isn't measured, it isn't running — dashboards, alerts and per-request telemetry.",
    icon: "Activity",
    tone: "success",
    skills: [
      { name: "Grafana", icon: "grafana", level: 80, tier: "production", usedFor: "Dashboards for latency, cost and error budgets" },
      { name: "Prometheus", icon: "prometheus", level: 78, tier: "production", usedFor: "Metrics collection and alerting rules" },
      { name: "Datadog", icon: "datadog", level: 74, tier: "production", usedFor: "Log aggregation and production alerting" },
    ],
  },
  {
    id: "automation",
    title: "Scraping & Automation",
    blurb: "Getting reliable data out of systems that would rather you didn't.",
    icon: "Bot",
    tone: "secondary",
    skills: [
      { name: "Playwright", icon: "playwright", level: 88, tier: "core", usedFor: "Browser automation and resilient data extraction" },
      { name: "BeautifulSoup", icon: "beautifulsoup", level: 88, tier: "core", usedFor: "HTML parsing and structured extraction" },
      { name: "Selenium", icon: "selenium", level: 80, tier: "production", usedFor: "Legacy flows and driver-level automation" },
      { name: "Scrapy", icon: "scrapy", level: 78, tier: "production", usedFor: "Large-scale crawls with scheduling and pipelines" },
      { name: "Requests", icon: "requests", level: 92, tier: "core", usedFor: "HTTP clients, session handling, retries" },
      { name: "curl-cffi", icon: "curlcffi", level: 75, tier: "working", usedFor: "TLS-fingerprint-accurate HTTP requests" },
    ],
  },
  {
    id: "apis",
    title: "APIs & Security",
    blurb: "Contracts that hold, and traffic you can actually trust.",
    icon: "ShieldCheck",
    tone: "accent",
    skills: [
      { name: "REST API design", icon: "rest", level: 93, tier: "core", usedFor: "10+ production endpoints across three platforms" },
      { name: "OAuth 2.0", icon: "oauth", level: 85, tier: "production", usedFor: "Authorization flows on Aayu's API surface" },
      { name: "JWT", icon: "jwt", level: 88, tier: "core", usedFor: "Stateless auth with RBAC enforcement" },
      { name: "Webhooks", icon: "webhook", level: 87, tier: "core", usedFor: "HMAC-SHA256 signed, replay-safe partner callbacks" },
      { name: "Git & GitHub", icon: "git", level: 90, tier: "core", usedFor: "Branching, reviews and release hygiene" },
    ],
  },
];

/** Cross-cutting engineering practice — rendered as a chip cloud, no bars. */
export const practices: string[] = [
  "Microservices",
  "Distributed Systems",
  "Prompt Engineering",
  "Alerting & Logging",
  "Metrics / Telemetry",
  "System Design",
  "Database Design",
  "API Optimization",
  "Message Queues",
  "Scalability",
  "Design Patterns",
  "MVC Architecture",
  "Clean Code",
  "Performance Optimization",
  "Debugging",
  "Agile / Scrum",
];
