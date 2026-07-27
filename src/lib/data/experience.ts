export type Highlight = {
  title: string;
  detail: string;
  /** lucide-react icon name resolved by the icon registry */
  icon: string;
  tags: string[];
  metric?: string;
};

export type Role = {
  id: string;
  company: string;
  companyUrl?: string;
  title: string;
  type: string;
  start: string;
  end: string | null;
  location: string;
  /** One-line framing of the mandate — not a bullet list. */
  mandate: string;
  stack: string[];
  highlights: Highlight[];
};

export const experience: Role[] = [
  {
    id: "gamyam-swe",
    company: "Gamyam Info Tech LLP",
    title: "Software Engineer",
    type: "Full-time",
    start: "2025-08-01",
    end: null,
    location: "Andhra Pradesh, India",
    mandate:
      "Own the end-to-end backend for Aayu — a real-time speech-to-speech voice companion — plus the diagnostics and health-checkup microservices behind Practo client platforms.",
    stack: [
      "Python",
      "Django",
      "DRF",
      "LiveKit",
      "OpenAI Realtime",
      "Claude on Bedrock",
      "Celery",
      "Redis",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "AWS",
    ],
    highlights: [
      {
        title: "Owned a real-time voice product end to end",
        detail:
          "Backend for Aayu: LiveKit (WebRTC) transport, session lifecycle, LLM orchestration and async post-session processing — from the first packet of audio to the analytics written after the call ends.",
        icon: "AudioLines",
        tags: ["LiveKit", "WebRTC", "Session state"],
      },
      {
        title: "Shipped 10+ production REST APIs",
        detail:
          "Django/DRF services built for high-volume traffic, then tuned: query optimization, targeted indexing, connection pooling and Redis caching on the hot read paths.",
        icon: "Gauge",
        tags: ["Django", "DRF", "Redis", "PostgreSQL"],
        metric: "25–30% faster responses",
      },
      {
        title: "Engineered a low-latency voice pipeline",
        detail:
          "VAD → STT → LLM → TTS with streaming TTS, provider pre-warming and parallelized sidecars, so the first audible syllable arrives while the rest of the reply is still being generated.",
        icon: "Zap",
        tags: ["Streaming TTS", "Pre-warming", "Concurrency"],
      },
      {
        title: "Built a dual-agent architecture",
        detail:
          "An on-path voice model (OpenAI gpt-realtime) carries the conversation while an off-path Claude reasoner on AWS Bedrock thinks in parallel — plus a safety classifier for distress detection across English, Hindi and Telugu.",
        icon: "Brain",
        tags: ["OpenAI Realtime", "Bedrock", "Safety"],
      },
      {
        title: "Designed the microservices boundaries",
        detail:
          "Clear service ownership with PostgreSQL for structured, transactional data and MongoDB for unstructured session artifacts — each store chosen for its access pattern, not by default.",
        icon: "Boxes",
        tags: ["Microservices", "PostgreSQL", "MongoDB"],
      },
      {
        title: "Cut LLM cost and latency together",
        detail:
          "Anthropic prompt caching on stable context, plus a config-driven “voice stack” that A/B rotates model, voice and TTS combinations without a deploy.",
        icon: "CircleDollarSign",
        tags: ["Prompt caching", "A/B config", "Telemetry"],
      },
      {
        title: "Secured and shipped the platform",
        detail:
          "OAuth 2.0 / JWT with role-based access control, containerized via Docker Compose, CI/CD on GitHub Actions, deployed to AWS (EC2, S3) with per-turn cost and latency telemetry.",
        icon: "ShieldCheck",
        tags: ["OAuth 2.0", "JWT", "RBAC", "GitHub Actions"],
      },
      {
        title: "Delivered Practo client microservices",
        detail:
          "Annual Health Checkup and Diagnostics platforms: booking and order-lifecycle APIs, diagnostic-lab integrations, HMAC-SHA256 signed webhooks and slot-lock reliability under concurrent booking.",
        icon: "Stethoscope",
        tags: ["HMAC-SHA256", "Webhooks", "Slot locks"],
      },
    ],
  },
  {
    id: "gamyam-intern",
    company: "Gamyam Info Tech LLP",
    title: "AI Engineer Intern",
    type: "Internship",
    start: "2025-05-01",
    end: "2025-07-31",
    location: "Hyderabad, India",
    mandate:
      "Train and productionize machine-learning models, then make their predictions consumable by product teams without coupling them to the model code.",
    stack: ["Python", "Scikit-learn", "ML Pipelines", "REST"],
    highlights: [
      {
        title: "Built and trained ML models",
        detail:
          "End-to-end Scikit-learn pipelines in Python — preprocessing, feature engineering and hyperparameter tuning — evaluated before anything reached a service boundary.",
        icon: "FlaskConical",
        tags: ["Scikit-learn", "Feature engineering"],
      },
      {
        title: "Served inference behind clean REST interfaces",
        detail:
          "Wrapped model inference in backend services with stable contracts, so product teams could consume predictions with minimal coupling to the underlying model.",
        icon: "Network",
        tags: ["REST", "Decoupling", "Backend integration"],
      },
    ],
  },
];
