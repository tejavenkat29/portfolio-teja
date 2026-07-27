import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

import "./globals.css";

import { profile, education } from "@/lib/data/profile";
import { Backdrop } from "@/components/layout/backdrop";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OverlayHost } from "@/components/interactive/overlay-host";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
  preload: false,
});

const title = `${profile.name} — Backend Software Engineer`;
const description =
  "Backend Software Engineer building production real-time AI systems, distributed architectures and high-performance REST APIs in Python, Django, DRF and FastAPI.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: title,
    template: `%s · ${profile.name}`,
  },
  description,
  applicationName: `${profile.name} — Portfolio`,
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  keywords: [
    "Teja Venkat Kundem",
    "Backend Software Engineer",
    "Python Backend Developer",
    "AI Engineer",
    "Django Developer",
    "Django REST Framework",
    "FastAPI",
    "Celery",
    "Distributed Systems",
    "Microservices",
    "REST API design",
    "LLM orchestration",
    "OpenAI Realtime",
    "Anthropic Claude",
    "AWS Bedrock",
    "LiveKit WebRTC",
    "PostgreSQL",
    "Redis",
    "Docker",
    "Kubernetes",
    "India",
  ],
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: `${profile.name} — Portfolio`,
    title,
    description,
    url: profile.siteUrl,
    locale: "en_US",
    firstName: "Teja Venkat",
    lastName: "Kundem",
    username: profile.githubUser,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#050816",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** Structured data so a recruiter's search result carries the right facts. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  givenName: "Teja Venkat",
  familyName: "Kundem",
  jobTitle: "Backend Software Engineer",
  description,
  email: `mailto:${profile.email}`,
  telephone: profile.phoneE164,
  url: profile.siteUrl,
  image: `${profile.siteUrl}/opengraph-image`,
  address: {
    "@type": "PostalAddress",
    addressRegion: "Andhra Pradesh",
    addressCountry: "IN",
  },
  worksFor: {
    "@type": "Organization",
    name: profile.currentRole.company,
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: education.institution,
  },
  knowsLanguage: ["English", "Hindi", "Telugu"],
  knowsAbout: [
    "Python",
    "Django",
    "Django REST Framework",
    "FastAPI",
    "Celery",
    "Distributed Systems",
    "Microservices",
    "REST API Design",
    "LLM Application Development",
    "OpenAI Realtime API",
    "Anthropic Claude",
    "AWS",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "Redis",
    "MongoDB",
    "Elasticsearch",
  ],
  sameAs: [profile.links.github, profile.links.linkedin],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrains.variable} antialiased`}>
        <noscript>
          {/* Scroll reveals start hidden and are resolved by JS. Without it,
              show everything rather than an empty page. */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <script
          type="application/ld+json"
          // Static, author-controlled JSON — no user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />

        <TooltipProvider delayDuration={180} skipDelayDuration={400}>
          <Backdrop />
          <ScrollProgress />
          <Nav />

          <main id="main" tabIndex={-1}>{children}</main>

          <Footer />

          <OverlayHost />

          <Toaster
            theme="dark"
            position="bottom-center"
            toastOptions={{
              style: {
                background: "rgba(10,15,36,0.92)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                backdropFilter: "blur(18px)",
              },
            }}
          />
        </TooltipProvider>

        {/* Real-user Core Web Vitals. Reports only on Vercel deployments — a
            no-op locally, so `npm run dev` and `npm start` stay silent. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
