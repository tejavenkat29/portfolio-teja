/**
 * A reference architecture for the systems I build: the request path I actually
 * ship, annotated with the decision made at each hop. Rendered as an animated
 * top-to-bottom diagram with a live packet tracing the critical path.
 */
export type ArchLayer = {
  id: string;
  label: string;
  sub: string;
  icon: string;
  tone: "primary" | "secondary" | "accent" | "success" | "neutral";
  /** The engineering decision at this hop — the reason the layer exists. */
  decision: string;
  tech: string[];
  /** Rendered as a side branch off the main spine rather than inline. */
  branch?: boolean;
  latency?: string;
};

export const archLayers: ArchLayer[] = [
  {
    id: "client",
    label: "Client",
    sub: "Web · mobile · voice session",
    icon: "Smartphone",
    tone: "neutral",
    decision:
      "Treat the client as untrusted and chatty. It gets one versioned contract and a token — never direct database or provider access.",
    tech: ["REST", "WebRTC", "JSON"],
  },
  {
    id: "gateway",
    label: "API Gateway",
    sub: "Nginx · routing · TLS · rate limits",
    icon: "Router",
    tone: "accent",
    decision:
      "Terminate TLS, throttle and route at the edge so application processes only ever see traffic that is already shaped.",
    tech: ["Nginx", "Gunicorn", "Throttling"],
    latency: "~1 ms",
  },
  {
    id: "auth",
    label: "Authentication",
    sub: "OAuth 2.0 · JWT · RBAC · HMAC",
    icon: "KeyRound",
    tone: "primary",
    decision:
      "Verify identity before any business logic runs. Stateless JWT for users, HMAC-SHA256 signatures for machine-to-machine callbacks.",
    tech: ["OAuth 2.0", "JWT", "RBAC", "HMAC-SHA256"],
    latency: "~2 ms",
  },
  {
    id: "services",
    label: "Backend Services",
    sub: "Django · DRF · FastAPI microservices",
    icon: "Server",
    tone: "primary",
    decision:
      "Split by data ownership, not by layer. A service that owns a table is the only service that writes to it.",
    tech: ["Django", "DRF", "FastAPI", "Microservices"],
    latency: "p95 budget",
  },
  {
    id: "cache",
    label: "Redis",
    sub: "Cache · locks · queue broker",
    icon: "Zap",
    tone: "accent",
    decision:
      "Absorb read pressure on hot paths and serialize contention where it's real — slot locks, idempotency keys, session state.",
    tech: ["Cache-aside", "Distributed locks", "Broker"],
    latency: "sub-ms",
  },
  {
    id: "workers",
    label: "Celery Workers",
    sub: "Retries · scheduling · fan-out",
    icon: "Workflow",
    tone: "secondary",
    decision:
      "Anything slow, third-party or retryable leaves the request cycle. The API returns; the work still finishes.",
    tech: ["Celery", "AWS SQS", "Idempotent tasks"],
    branch: true,
  },
  {
    id: "llm",
    label: "LLM Layer",
    sub: "Multi-provider orchestration",
    icon: "Brain",
    tone: "secondary",
    decision:
      "Providers are pluggable and pre-warmed, prompts are cached, and every call is measured — so switching models is a config change with known cost.",
    tech: ["OpenAI Realtime", "Claude · Bedrock", "Prompt caching", "Streaming"],
    branch: true,
  },
  {
    id: "db",
    label: "Database",
    sub: "PostgreSQL · MongoDB · Elasticsearch",
    icon: "Database",
    tone: "primary",
    decision:
      "Relational for anything transactional, document for unstructured artifacts, an inverted index for search. Indexing and pooling tuned against real query plans.",
    tech: ["PostgreSQL", "MongoDB", "Elasticsearch", "Connection pooling"],
  },
  {
    id: "storage",
    label: "Cloud Storage",
    sub: "Amazon S3 · recordings & reports",
    icon: "HardDrive",
    tone: "success",
    decision:
      "Large immutable objects never live in the database. Services exchange keys; access is granted by signed URL.",
    tech: ["Amazon S3", "Signed URLs", "Lifecycle policies"],
  },
];

/** Principles rail beside the diagram. */
export const designPrinciples: { title: string; body: string; icon: string }[] = [
  {
    title: "The critical path is sacred",
    body: "If a user can perceive the wait, nothing optional is allowed on that path. Enrichment runs beside it or after it.",
    icon: "Zap",
  },
  {
    title: "Fail in pieces",
    body: "Queues between stages mean a stalled partner degrades one stage instead of taking the order down with it.",
    icon: "Split",
  },
  {
    title: "Idempotent by default",
    body: "Retries and duplicate webhooks are normal traffic. A handler that can't run twice safely isn't finished.",
    icon: "Repeat",
  },
  {
    title: "Measure per unit of work",
    body: "Cost and latency are recorded per request and per turn, so a regression shows up as a query rather than a complaint.",
    icon: "Activity",
  },
  {
    title: "Providers are replaceable",
    body: "Vendors sit behind one internal contract — model, TTS engine or diagnostic lab. Swapping one is configuration, not a rewrite.",
    icon: "Plug",
  },
];
