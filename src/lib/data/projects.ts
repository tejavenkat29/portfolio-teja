export type DiagramNode = {
  id: string;
  label: string;
  sub?: string;
  icon?: string;
  tone?: "primary" | "secondary" | "accent" | "success" | "neutral";
};

export type DiagramStage = {
  id: string;
  label: string;
  note?: string;
  nodes: DiagramNode[];
};

export type Project = {
  id: string;
  name: string;
  tagline: string;
  kind: string;
  period: string;
  role: string;
  status: "Production" | "Client delivery";
  /** Source availability — stated plainly rather than linking to nothing. */
  source: { available: boolean; url?: string; reason?: string };
  demo: { available: boolean; url?: string; reason?: string };
  accentFrom: string;
  accentTo: string;
  overview: string;
  problem: { statement: string; constraints: string[] };
  architecture: { summary: string; stages: DiagramStage[] };
  stack: { group: string; items: string[] }[];
  features: { title: string; detail: string; icon: string }[];
  challenges: { challenge: string; approach: string }[];
  results: { value: string; label: string; note?: string }[];
};

export const projects: Project[] = [
  {
    id: "aayu",
    name: "Aayu",
    tagline: "Real-time speech-to-speech AI voice companion",
    kind: "Real-time AI system",
    period: "Aug 2025 – Present",
    role: "Backend owner — end to end",
    status: "Production",
    source: { available: false, reason: "Proprietary product at Gamyam Info Tech LLP" },
    demo: { available: false, reason: "Invite-only beta — walkthrough available on request" },
    accentFrom: "#6366F1",
    accentTo: "#00D9FF",
    overview:
      "Aayu is a voice companion you talk to, not type at. A LiveKit/WebRTC session streams audio both ways while a dual-agent core keeps the conversation moving: a fast on-path voice model speaks, an off-path Claude reasoner thinks, and a safety classifier watches for distress in English, Hindi and Telugu. Everything a user can hear happens inside a latency budget; everything else — emotion analysis, coaching, analytics — is pushed to async workers after the call.",
    problem: {
      statement:
        "Conversational voice AI fails in two ways that users notice immediately: dead air and flatness. A sequential VAD → STT → LLM → TTS chain stacks four network round-trips before a single syllable plays, and the model that responds fastest is rarely the model that reasons best. Off-the-shelf transcription also degrades on Indian-accented English — exactly the audience the product serves.",
      constraints: [
        "Turn-taking must feel conversational — silence reads as a dropped call",
        "Accented-English accuracy without discarding the prosody that carries emotion",
        "One model fast enough to speak, another strong enough to reason — in the same turn",
        "Per-turn LLM cost bounded well enough to run continuously in production",
        "Safety signals detected across three languages, not just English",
      ],
    },
    architecture: {
      summary:
        "Two paths run concurrently off one audio stream. The on-path lane is latency-critical and never blocks on anything slow; the off-path lane enriches the same turn and the post-session lane runs entirely outside the call.",
      stages: [
        {
          id: "transport",
          label: "Transport",
          note: "Bidirectional audio, sub-second",
          nodes: [
            { id: "client", label: "Mobile / Web client", sub: "Mic + speaker", icon: "Smartphone", tone: "neutral" },
            { id: "livekit", label: "LiveKit room", sub: "WebRTC SFU", icon: "Radio", tone: "accent" },
          ],
        },
        {
          id: "ingest",
          label: "Speech ingest",
          note: "Hybrid — accuracy and prosody in parallel",
          nodes: [
            { id: "vad", label: "VAD", sub: "Turn boundary detection", icon: "AudioWaveform", tone: "primary" },
            { id: "assembly", label: "AssemblyAI STT", sub: "Indian-accented English", icon: "Captions", tone: "primary" },
            { id: "realtime-stt", label: "OpenAI Realtime", sub: "Prosody-aware understanding", icon: "Ear", tone: "secondary" },
          ],
        },
        {
          id: "reasoning",
          label: "Dual-agent core",
          note: "On-path speaks · off-path reasons",
          nodes: [
            { id: "voice", label: "gpt-realtime", sub: "On-path voice model", icon: "MessageCircle", tone: "accent" },
            { id: "claude", label: "Claude · AWS Bedrock", sub: "Off-path reasoner", icon: "Brain", tone: "secondary" },
            { id: "safety", label: "Safety classifier", sub: "Distress · EN / HI / TE", icon: "ShieldAlert", tone: "success" },
          ],
        },
        {
          id: "response",
          label: "Response",
          note: "First syllable before the last token",
          nodes: [
            { id: "backchannel", label: "Backchannel mask", sub: "Pre-cached acknowledgment", icon: "Sparkles", tone: "primary" },
            { id: "tts", label: "Streaming TTS", sub: "Chunked synthesis", icon: "Volume2", tone: "accent" },
          ],
        },
        {
          id: "async",
          label: "Post-session",
          note: "Off the critical path entirely",
          nodes: [
            { id: "celery", label: "Celery + Redis", sub: "Task queue", icon: "Workflow", tone: "primary" },
            { id: "hume", label: "Hume AI batch", sub: "Emotion analysis", icon: "HeartPulse", tone: "secondary" },
            { id: "judge", label: "LLM-as-judge", sub: "Per-user coaching", icon: "Scale", tone: "success" },
          ],
        },
        {
          id: "state",
          label: "State & storage",
          note: "Per-turn telemetry, queryable",
          nodes: [
            { id: "pg", label: "PostgreSQL", sub: "Turns · mood · cost", icon: "Database", tone: "primary" },
            { id: "mongo", label: "MongoDB", sub: "Session artifacts", icon: "Layers", tone: "secondary" },
            { id: "s3", label: "Amazon S3", sub: "Call recordings", icon: "HardDrive", tone: "accent" },
          ],
        },
      ],
    },
    stack: [
      { group: "Runtime", items: ["Python", "Django", "DRF", "Celery", "Redis"] },
      { group: "Real-time", items: ["LiveKit", "WebRTC", "VAD", "Streaming TTS"] },
      { group: "AI", items: ["OpenAI Realtime (gpt-realtime)", "Anthropic Claude on AWS Bedrock", "AssemblyAI", "Hume AI"] },
      { group: "Data", items: ["PostgreSQL", "MongoDB", "Amazon S3"] },
      { group: "Platform", items: ["Docker Compose", "GitHub Actions", "AWS EC2", "Nginx"] },
    ],
    features: [
      {
        title: "Dual-agent orchestration",
        detail:
          "The voice model owns the turn while Claude reasons off-path on the same context. The conversation never waits on the slower, smarter model.",
        icon: "Brain",
      },
      {
        title: "Backchannel latency mask",
        detail:
          "A pre-cached acknowledgment plays the instant the user stops speaking, converting dead air into an engaged pause while the real reply generates.",
        icon: "Sparkles",
      },
      {
        title: "Hybrid STT pipeline",
        detail:
          "AssemblyAI transcribes accented English accurately; OpenAI Realtime keeps the prosodic signal. Neither alone gives you both.",
        icon: "Captions",
      },
      {
        title: "Multi-layer emotion system",
        detail:
          "Live prosody-driven tone adaptation, a mood state machine spanning −3 to +3, and post-session Hume AI analytics stored per turn.",
        icon: "HeartPulse",
      },
      {
        title: "Config-driven voice stack",
        detail:
          "Model, voice and TTS provider are configuration, not code — so combinations rotate for A/B evaluation without a deploy.",
        icon: "SlidersHorizontal",
      },
      {
        title: "Multilingual safety net",
        detail:
          "A dedicated classifier screens every turn for distress signals in English, Hindi and Telugu, independent of the conversational model.",
        icon: "ShieldAlert",
      },
      {
        title: "Per-turn cost & latency telemetry",
        detail:
          "Every turn records provider, tokens, cache hits and stage-level timing — so a regression is a query, not a hunch.",
        icon: "Activity",
      },
      {
        title: "Async coaching loop",
        detail:
          "After the call, Celery workers score the transcript with an LLM-as-judge loop and generate per-user guidance that shapes the next session.",
        icon: "Repeat",
      },
    ],
    challenges: [
      {
        challenge: "Four sequential network hops before the user hears anything.",
        approach:
          "Split the turn into on-path and off-path lanes, stream TTS in chunks, pre-warm provider connections, and run enrichment as parallel sidecars — so perceived latency tracks the first chunk, not the full response.",
      },
      {
        challenge: "Transcription accuracy and emotional signal pulled in opposite directions.",
        approach:
          "Ran both engines on the same audio and merged their outputs: AssemblyAI for the words, OpenAI Realtime for how they were said.",
      },
      {
        challenge: "A continuously running voice product is a continuously running bill.",
        approach:
          "Applied Anthropic prompt caching to the stable system context and instrumented per-turn cost, making model/voice rotation a measurable trade rather than a guess.",
      },
      {
        challenge: "Safety could not be delegated to the conversational model.",
        approach:
          "Isolated distress detection into a dedicated classifier covering all three supported languages, running independently of the model generating the reply.",
      },
    ],
    results: [
      { value: "25–30%", label: "Faster API responses", note: "Query optimization, indexing, pooling, Redis caching" },
      { value: "10+", label: "Production REST APIs", note: "Django / DRF, built for high-volume traffic" },
      { value: "3", label: "Languages covered", note: "English · Hindi · Telugu safety classification" },
      { value: "0", label: "Blocking calls on-path", note: "Enrichment and analytics run off the critical path" },
    ],
  },
  {
    id: "practo-ahc",
    name: "Practo — Corporate AHC Platform",
    tagline: "Annual health checkup booking at company scale",
    kind: "Healthcare platform · client delivery",
    period: "2025 – Present",
    role: "Backend microservices",
    status: "Client delivery",
    source: { available: false, reason: "Client codebase — not publicly available" },
    demo: { available: false, reason: "Enterprise platform behind corporate SSO" },
    accentFrom: "#8B5CF6",
    accentTo: "#6366F1",
    overview:
      "A corporate annual-health-checkup platform where one booking touches an employer, an employee, a diagnostic partner and a lab report. The backend exposes the booking and order-management surface in Django/DRF, hides every diagnostic vendor behind one adapter contract, and moves anything slow — notifications, PDF reports, partner callbacks — onto Celery workers so the API stays responsive.",
    problem: {
      statement:
        "Each diagnostic partner ships its own API shape, its own status vocabulary and its own callback semantics. Wiring them in directly would leak vendor detail into the booking domain and make every new partner a core-code change — while employees still expect a single reliable slot-booking experience.",
      constraints: [
        "Onboard a new diagnostic partner without touching the booking domain",
        "Bookings must survive concurrent attempts on the same slot",
        "Partner callbacks must be authenticated and safe to replay",
        "Report generation and notification fan-out cannot block a request",
        "Corporate access flows through SSO, not a bespoke login",
      ],
    },
    architecture: {
      summary:
        "A thin API surface over a domain that knows nothing about vendors. Partner specifics live in adapters; anything with unpredictable latency lives behind the queue.",
      stages: [
        {
          id: "edge",
          label: "Access",
          nodes: [
            { id: "sso", label: "Corporate SSO", sub: "Employee identity", icon: "KeyRound", tone: "accent" },
            { id: "api", label: "Django + DRF", sub: "Booking & order APIs", icon: "Server", tone: "primary" },
          ],
        },
        {
          id: "domain",
          label: "Domain",
          note: "Vendor-agnostic core",
          nodes: [
            { id: "slots", label: "Slot engine", sub: "Locking · contention", icon: "CalendarClock", tone: "primary" },
            { id: "orders", label: "Order lifecycle", sub: "State transitions", icon: "GitBranch", tone: "secondary" },
          ],
        },
        {
          id: "adapters",
          label: "Partner adapters",
          note: "One contract, many vendors",
          nodes: [
            { id: "thyrocare", label: "Thyrocare", sub: "Pluggable adapter", icon: "Plug", tone: "success" },
            { id: "healthians", label: "Healthians", sub: "Pluggable adapter", icon: "Plug", tone: "success" },
          ],
        },
        {
          id: "async",
          label: "Async workers",
          nodes: [
            { id: "celery", label: "Celery + Redis", sub: "Orders · notifications", icon: "Workflow", tone: "primary" },
            { id: "pdf", label: "PDF reports", sub: "Generated & delivered", icon: "FileText", tone: "secondary" },
          ],
        },
        {
          id: "trust",
          label: "Integrity",
          nodes: [
            { id: "hmac", label: "HMAC-SHA256", sub: "Signed webhooks", icon: "FileKey", tone: "accent" },
            { id: "audit", label: "Order audit trail", sub: "Every transition recorded", icon: "ScrollText", tone: "neutral" },
          ],
        },
      ],
    },
    stack: [
      { group: "Runtime", items: ["Python", "Django", "DRF", "Celery", "Redis"] },
      { group: "Integrations", items: ["Thyrocare", "Healthians", "HMAC-signed webhooks"] },
      { group: "Security", items: ["SSO", "HMAC-SHA256 request signing", "RBAC"] },
      { group: "Delivery", items: ["Automated PDF reports", "Notification workflows"] },
    ],
    features: [
      {
        title: "Pluggable partner adapters",
        detail:
          "Every diagnostic provider implements the same interface, so onboarding a new lab is a new adapter — not a change to the booking domain.",
        icon: "Plug",
      },
      {
        title: "Booking & order management APIs",
        detail:
          "RESTful surface covering the full corporate annual-health-checkup workflow, from slot selection to order completion.",
        icon: "Server",
      },
      {
        title: "Slot-lock reliability",
        detail:
          "Locking around slot reservation so two employees racing for the last appointment produce one booking and one clean rejection.",
        icon: "Lock",
      },
      {
        title: "HMAC-signed partner traffic",
        detail:
          "Inbound and outbound partner calls are signed and verified, so a callback is trusted on cryptography rather than on network position.",
        icon: "FileKey",
      },
      {
        title: "Async orders and notifications",
        detail:
          "Celery and Redis absorb the slow work — partner submission, notification fan-out, report delivery — keeping API latency flat under load.",
        icon: "Workflow",
      },
      {
        title: "Automated report pipeline",
        detail:
          "PDF report generation and delivery run as a workflow, not a manual step, with each stage independently retryable.",
        icon: "FileText",
      },
    ],
    challenges: [
      {
        challenge: "Every partner integration threatened to leak into the core domain.",
        approach:
          "Defined one adapter contract for booking, status and report retrieval; each vendor's quirks are confined to its own adapter module.",
      },
      {
        challenge: "Concurrent booking on a finite slot inventory.",
        approach: "Introduced slot locking so reservation is serialized at the point of contention, not at the API edge.",
      },
      {
        challenge: "Partner callbacks arrive unauthenticated and sometimes twice.",
        approach: "Required HMAC-SHA256 signatures and made handlers safe to replay so a duplicate callback is a no-op.",
      },
    ],
    results: [
      { value: "2+", label: "Diagnostic partners", note: "Onboarded behind one adapter contract" },
      { value: "Flat", label: "API latency under load", note: "Slow paths deferred to Celery workers" },
      { value: "Signed", label: "Partner traffic", note: "HMAC-SHA256 on every webhook" },
      { value: "0-touch", label: "Report delivery", note: "PDF generation and notification fully automated" },
    ],
  },
  {
    id: "practo-dx",
    name: "Practo — Diagnostics Platform",
    tagline: "Test discovery, lab orchestration and report delivery",
    kind: "Healthcare platform · client delivery",
    period: "2025 – Present",
    role: "Core backend APIs",
    status: "Client delivery",
    source: { available: false, reason: "Client codebase — not publicly available" },
    demo: { available: false, reason: "Runs inside the client's production estate" },
    accentFrom: "#00D9FF",
    accentTo: "#22C55E",
    overview:
      "The diagnostics backend: catalog and test search, booking, sample-collection scheduling, order-lifecycle tracking and report delivery. Search is served by Elasticsearch instead of database LIKE queries; the booking, processing and delivery stages are decoupled through Celery, Redis and AWS SQS; and the whole estate runs on Kubernetes.",
    problem: {
      statement:
        "A diagnostics catalog is searched far more often than it is booked, and users search the way they speak — brand names, abbreviations, symptoms. Relational text matching neither ranks nor scales for that. Meanwhile a single order spans partner labs, phlebotomist scheduling and report retrieval, each failing independently.",
      constraints: [
        "Catalog lookups fast and relevant across a large test/panel corpus",
        "Order state accurate while three external systems mutate it",
        "Booking, processing and delivery must fail independently, not together",
        "Partner labs differ in status vocabulary and report availability",
        "Deployments and scaling handled without hand-managed servers",
      ],
    },
    architecture: {
      summary:
        "Reads are served from a purpose-built search index; writes flow through a queue-decoupled lifecycle so a slow lab never stalls a booking.",
      stages: [
        {
          id: "api",
          label: "API layer",
          nodes: [
            { id: "dx-api", label: "Django + DRF", sub: "Booking · catalog · orders", icon: "Server", tone: "primary" },
            { id: "auth", label: "Auth & RBAC", sub: "Scoped access", icon: "KeyRound", tone: "accent" },
          ],
        },
        {
          id: "search",
          label: "Discovery",
          note: "Read path, optimized separately",
          nodes: [
            { id: "es", label: "Elasticsearch", sub: "Catalog & test search", icon: "Search", tone: "accent" },
            { id: "catalog", label: "Lab catalog", sub: "Tests · panels · pricing", icon: "BookOpen", tone: "primary" },
          ],
        },
        {
          id: "lifecycle",
          label: "Order lifecycle",
          nodes: [
            { id: "state", label: "State machine", sub: "Booked → collected → reported", icon: "GitBranch", tone: "secondary" },
            { id: "collection", label: "Sample collection", sub: "Scheduling", icon: "CalendarClock", tone: "primary" },
          ],
        },
        {
          id: "queues",
          label: "Async fabric",
          note: "Failure isolation between stages",
          nodes: [
            { id: "celery", label: "Celery", sub: "Workers", icon: "Workflow", tone: "primary" },
            { id: "redis", label: "Redis", sub: "Broker · cache", icon: "Zap", tone: "secondary" },
            { id: "sqs", label: "AWS SQS", sub: "Durable decoupling", icon: "Inbox", tone: "accent" },
          ],
        },
        {
          id: "partners",
          label: "Partner labs",
          nodes: [
            { id: "labs", label: "Lab integrations", sub: "Status · reports", icon: "Plug", tone: "success" },
            { id: "reports", label: "Report delivery", sub: "Retrieval & dispatch", icon: "FileText", tone: "secondary" },
          ],
        },
        {
          id: "platform",
          label: "Platform",
          nodes: [
            { id: "k8s", label: "Kubernetes", sub: "Production workloads", icon: "Boxes", tone: "primary" },
            { id: "obs", label: "Health & metrics", sub: "Per-service visibility", icon: "Activity", tone: "neutral" },
          ],
        },
      ],
    },
    stack: [
      { group: "Runtime", items: ["Python", "Django", "DRF", "Celery"] },
      { group: "Data & search", items: ["PostgreSQL", "Redis", "Elasticsearch"] },
      { group: "Messaging", items: ["AWS SQS", "Redis broker"] },
      { group: "Platform", items: ["Kubernetes", "Docker", "CI/CD"] },
    ],
    features: [
      {
        title: "Core diagnostics APIs",
        detail:
          "Test booking, lab-catalog management, order-lifecycle tracking and report delivery — the endpoints the rest of the product is built on.",
        icon: "Server",
      },
      {
        title: "Elasticsearch-backed discovery",
        detail:
          "Catalog and test search moved off relational text matching, improving both lookup speed and result relevance.",
        icon: "Search",
      },
      {
        title: "Partner lab integrations",
        detail:
          "Sample-collection scheduling, real-time order-status updates and report retrieval, normalized across labs that agree on none of it.",
        icon: "Plug",
      },
      {
        title: "Queue-decoupled workflows",
        detail:
          "Celery, Redis and AWS SQS separate booking, processing and delivery so a stalled downstream stage degrades one stage, not the order.",
        icon: "Inbox",
      },
      {
        title: "Order-lifecycle tracking",
        detail:
          "An explicit state machine from booking through sample collection to report availability, with transitions recorded rather than inferred.",
        icon: "GitBranch",
      },
      {
        title: "Kubernetes production estate",
        detail: "Services deployed and maintained on Kubernetes, with rollout and scaling handled by the platform.",
        icon: "Boxes",
      },
    ],
    challenges: [
      {
        challenge: "Catalog search was neither fast nor relevant on relational queries.",
        approach:
          "Indexed the catalog in Elasticsearch and tuned analyzers for how users actually search — brand names, abbreviations and partial terms.",
      },
      {
        challenge: "One slow partner lab could hold up an entire booking flow.",
        approach: "Pushed inter-stage handoffs onto Celery, Redis and SQS so each stage retries on its own clock.",
      },
      {
        challenge: "Every lab reports order status in its own vocabulary.",
        approach:
          "Normalized partner statuses into a single internal lifecycle so downstream consumers read one state model regardless of provider.",
      },
    ],
    results: [
      { value: "Faster", label: "Catalog lookups", note: "Elasticsearch replaced relational text search" },
      { value: "3-way", label: "Async decoupling", note: "Celery + Redis + AWS SQS between stages" },
      { value: "K8s", label: "Production deployment", note: "Services maintained on Kubernetes" },
      { value: "Unified", label: "Order state model", note: "Partner statuses normalized to one lifecycle" },
    ],
  },
];
