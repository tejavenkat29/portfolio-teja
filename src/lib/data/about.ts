export type Capability = {
  id: string;
  label: string;
  headline: string;
  detail: string;
  icon: string;
  proof: string;
  tone: "primary" | "secondary" | "accent" | "success";
};

/** The About section is built from these — evidence cards, not paragraphs. */
export const capabilities: Capability[] = [
  {
    id: "experience",
    label: "1+ Years Experience",
    headline: "Shipping production systems since day one",
    detail:
      "Started as an AI engineering intern building ML pipelines, moved into owning a real-time voice product's entire backend. Every line I've written has run in production.",
    icon: "CalendarRange",
    proof: "AI Intern → Software Engineer at Gamyam Info Tech LLP",
    tone: "primary",
  },
  {
    id: "backend",
    label: "Backend Development",
    headline: "Python backends built to be operated",
    detail:
      "Django, DRF and FastAPI services with explicit boundaries, sane migrations and enough telemetry that debugging a live incident doesn't start with guessing.",
    icon: "Server",
    proof: "Django · DRF · FastAPI · Celery",
    tone: "primary",
  },
  {
    id: "ai",
    label: "AI Systems",
    headline: "Real-time AI that has to answer in milliseconds",
    detail:
      "Multi-provider LLM orchestration across OpenAI Realtime and Claude on Bedrock, with prompt caching, provider pre-warming and per-turn cost telemetry.",
    icon: "Brain",
    proof: "Dual-agent voice pipeline: VAD → STT → LLM → TTS",
    tone: "secondary",
  },
  {
    id: "apis",
    label: "Production APIs",
    headline: "10+ REST APIs under real traffic",
    detail:
      "Designed for high volume, then measurably tuned — query optimization, targeted indexing, connection pooling and Redis caching on hot paths.",
    icon: "Gauge",
    proof: "25–30% response-time reduction",
    tone: "accent",
  },
  {
    id: "distributed",
    label: "Distributed Systems",
    headline: "Systems that fail in pieces, not all at once",
    detail:
      "Queue-decoupled workflows over Celery, Redis and AWS SQS, idempotent webhook handling, and lock-based reliability where contention is real.",
    icon: "Network",
    proof: "Celery · Redis · AWS SQS · HMAC-SHA256 webhooks",
    tone: "accent",
  },
  {
    id: "microservices",
    label: "Microservices",
    headline: "Boundaries drawn on ownership, not fashion",
    detail:
      "Service split by who owns the data and how it's read — PostgreSQL for transactional state, MongoDB for unstructured session artifacts.",
    icon: "Boxes",
    proof: "Clear service contracts across booking, orders and sessions",
    tone: "secondary",
  },
  {
    id: "cloud",
    label: "Cloud Deployment",
    headline: "AWS estate with a repeatable path to prod",
    detail:
      "EC2 and S3 behind Nginx and Gunicorn, CI/CD on GitHub Actions, and Kubernetes for the client platforms that need orchestrated scaling.",
    icon: "Cloud",
    proof: "AWS EC2 · S3 · Kubernetes · GitHub Actions",
    tone: "success",
  },
  {
    id: "containers",
    label: "Containerization",
    headline: "The same image everywhere",
    detail:
      "Docker and Docker Compose from local development through CI to production, so 'works on my machine' stops being a category of bug.",
    icon: "Container",
    proof: "Docker · Docker Compose · reproducible CI builds",
    tone: "success",
  },
];

/** Short, high-signal facts rendered as a metadata rail beside the cards. */
export const aboutFacts: { k: string; v: string }[] = [
  { k: "Base", v: "Andhra Pradesh, India · IST (UTC+5:30)" },
  { k: "Focus", v: "Real-time AI backends · distributed systems" },
  { k: "Languages", v: "Python, SQL" },
  { k: "Speaks", v: "English · Hindi · Telugu" },
  { k: "Education", v: "B.Tech CSE, BVC Engineering College · CGPA 8.10" },
  { k: "Open to", v: "Backend & AI engineering roles" },
];

/** The narrative spine of the About section — three beats, no filler. */
export const story: { year: string; title: string; body: string }[] = [
  {
    year: "2021 – 2025",
    title: "Computer Science, then the parts nobody teaches",
    body:
      "B.Tech in CSE at BVC Engineering College (CGPA 8.10). The degree covered algorithms and databases; production taught me connection pools, retry storms and what a p99 actually costs.",
  },
  {
    year: "May 2025",
    title: "Models first, then the service around them",
    body:
      "Joined Gamyam Info Tech as an AI Engineer Intern — Scikit-learn pipelines, feature engineering, hyperparameter tuning — and learned that a model is only useful once it sits behind a stable interface.",
  },
  {
    year: "Aug 2025 →",
    title: "Owning a real-time AI product's backend",
    body:
      "Now a Software Engineer building Aayu, a speech-to-speech voice companion, alongside diagnostics and health-checkup microservices for Practo client platforms. Latency budgets, provider failover and cost per turn are my day job.",
  },
];
