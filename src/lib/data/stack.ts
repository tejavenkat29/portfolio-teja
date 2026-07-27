/**
 * The Tech Stack section answers a different question than Skills does:
 * not "how well do you know it" but "where does it sit in a running system".
 */
export type StackLayer = {
  id: string;
  layer: string;
  role: string;
  items: { name: string; icon: string; note: string }[];
  tone: "primary" | "secondary" | "accent" | "success";
};

export const stackLayers: StackLayer[] = [
  {
    id: "edge",
    layer: "Edge & transport",
    role: "Everything a client touches before it reaches application code.",
    tone: "accent",
    items: [
      { name: "Nginx", icon: "nginx", note: "Reverse proxy · TLS · static assets" },
      { name: "Gunicorn", icon: "gunicorn", note: "WSGI workers for Django" },
      { name: "LiveKit / WebRTC", icon: "livekit", note: "Bidirectional real-time audio" },
      { name: "REST + Webhooks", icon: "rest", note: "Sync contracts and signed callbacks" },
    ],
  },
  {
    id: "app",
    layer: "Application",
    role: "Where business rules live and request latency is won or lost.",
    tone: "primary",
    items: [
      { name: "Django", icon: "django", note: "Domain models, admin, migrations" },
      { name: "DRF", icon: "drf", note: "Serialization, versioning, throttling" },
      { name: "FastAPI", icon: "fastapi", note: "Async endpoints and AI-facing services" },
      { name: "Python", icon: "python", note: "The language all of it is written in" },
    ],
  },
  {
    id: "async",
    layer: "Async & messaging",
    role: "Anything whose latency I refuse to put in front of a user.",
    tone: "secondary",
    items: [
      { name: "Celery", icon: "celery", note: "Workers, retries, scheduled tasks" },
      { name: "Redis", icon: "redis", note: "Broker, cache, distributed locks" },
      { name: "AWS SQS", icon: "sqs", note: "Durable inter-service decoupling" },
    ],
  },
  {
    id: "ai",
    layer: "AI layer",
    role: "Multi-provider orchestration with cost and latency as first-class inputs.",
    tone: "secondary",
    items: [
      { name: "OpenAI Realtime", icon: "openai", note: "On-path voice model" },
      { name: "Claude on Bedrock", icon: "anthropic", note: "Off-path reasoning + prompt caching" },
      { name: "AssemblyAI", icon: "assemblyai", note: "Accent-tuned transcription" },
      { name: "Hume AI", icon: "hume", note: "Batch emotion analytics" },
      { name: "LangChain / LangGraph", icon: "langchain", note: "Chains and stateful agent flows" },
    ],
  },
  {
    id: "data",
    layer: "Data",
    role: "One store per access pattern — no single database doing four jobs.",
    tone: "accent",
    items: [
      { name: "PostgreSQL", icon: "postgres", note: "Transactional state and telemetry" },
      { name: "MongoDB", icon: "mongodb", note: "Unstructured session artifacts" },
      { name: "Elasticsearch", icon: "elasticsearch", note: "Catalog and test search" },
      { name: "Amazon S3", icon: "s3", note: "Recordings, reports, artifacts" },
    ],
  },
  {
    id: "platform",
    layer: "Platform & delivery",
    role: "How code gets from a commit to a running production process.",
    tone: "success",
    items: [
      { name: "Docker", icon: "docker", note: "Reproducible images end to end" },
      { name: "Kubernetes", icon: "kubernetes", note: "Orchestrated production workloads" },
      { name: "GitHub Actions", icon: "githubactions", note: "CI/CD on every merge" },
      { name: "AWS EC2", icon: "aws", note: "Compute for deployed services" },
      { name: "Linux", icon: "linux", note: "The box it all runs on" },
    ],
  },
];

/** Marquee row under the hero — real logos, in the order they appear in a request. */
export const marqueeTech: string[] = [
  "python",
  "django",
  "drf",
  "fastapi",
  "celery",
  "redis",
  "postgres",
  "mongodb",
  "elasticsearch",
  "docker",
  "kubernetes",
  "aws",
  "nginx",
  "linux",
  "githubactions",
  "openai",
  "anthropic",
  "langchain",
  "livekit",
  "playwright",
];
