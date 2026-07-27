import fs from "node:fs";
import path from "node:path";

import { ArrowUpRight, Download, FileText } from "lucide-react";

import { profile, education } from "@/lib/data/profile";
import { experience } from "@/lib/data/experience";
import { Section, SectionHeader } from "@/components/layout/section";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/interactive/reveal";

/** File size read at build time so the label can't drift from the actual PDF. */
function resumeMeta() {
  try {
    const filePath = path.join(process.cwd(), "public", profile.resumeFileName);
    const { size, mtime } = fs.statSync(filePath);
    return {
      size: `${Math.max(1, Math.round(size / 1024))} KB`,
      updated: mtime.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
  } catch {
    return { size: "PDF", updated: null };
  }
}

const quickFacts = [
  { label: "Current", value: `${profile.currentRole.title}, ${profile.currentRole.company}`, icon: "Briefcase" },
  { label: "Experience", value: "1+ year in production backend & AI systems", icon: "CalendarRange" },
  { label: "Core stack", value: "Python · Django · DRF · FastAPI · Celery", icon: "Server" },
  { label: "Specialisms", value: "Real-time AI · distributed systems · REST APIs", icon: "Brain" },
  { label: "Education", value: `${education.degree.replace("B.Tech, ", "B.Tech ")} · CGPA ${education.cgpa}`, icon: "GraduationCap" },
  { label: "Location", value: `${profile.location} · open to remote`, icon: "MapPin" },
];

export function Resume() {
  const meta = resumeMeta();
  const roles = experience.length;

  return (
    <Section id="resume">
      <SectionHeader
        id="resume"
        index="09"
        eyebrow="Resume"
        title="One page, the same facts as this site"
        lede="Read it here or take it with you — the PDF is the version recruiters and ATS systems see."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="primary" size="md">
              <a href={profile.resumeFile} download={profile.resumeFileName}>
                <Download />
                Download PDF
              </a>
            </Button>
            <Button asChild variant="glass" size="md">
              <a href={profile.resumeFile} target="_blank" rel="noreferrer noopener">
                Open in new tab
                <ArrowUpRight />
              </a>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
        {/* ------------------------------------------------------------- */}
        {/* Embedded preview                                              */}
        {/* ------------------------------------------------------------- */}
        <Reveal>
          <GlassCard className="overflow-hidden p-0" glow={false}>
            <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
              <span className="flex items-center gap-2 font-mono text-[0.6875rem] text-white/60">
                <FileText className="size-3.5 text-primary" />
                {profile.resumeFileName}
              </span>
              <span className="flex items-center gap-2 font-mono text-[0.625rem] text-faint">
                <span>PDF</span>
                <span aria-hidden>·</span>
                <span>{meta.size}</span>
                {meta.updated ? (
                  <>
                    <span aria-hidden>·</span>
                    <span>updated {meta.updated}</span>
                  </>
                ) : null}
              </span>
            </div>

            <div className="relative bg-[#0a0f24]">
              {/* Native PDF rendering where the browser supports it… */}
              <object
                data={`${profile.resumeFile}#toolbar=0&navpanes=0&statusbar=0&view=FitH`}
                type="application/pdf"
                aria-label={`${profile.name} résumé preview`}
                className="block h-[34rem] w-full sm:h-[42rem]"
              >
                {/* …and an explicit path forward where it doesn't (most mobile browsers). */}
                <div className="flex h-[22rem] flex-col items-center justify-center gap-4 p-8 text-center">
                  <span className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    <FileText className="size-5 text-primary" />
                  </span>
                  <p className="max-w-sm text-sm leading-relaxed text-muted">
                    Your browser can&apos;t display PDFs inline. Open or download the file — it&apos;s
                    one page, {meta.size}.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button asChild variant="primary" size="sm">
                      <a href={profile.resumeFile} target="_blank" rel="noreferrer noopener">
                        Open résumé
                        <ArrowUpRight />
                      </a>
                    </Button>
                    <Button asChild variant="glass" size="sm">
                      <a href={profile.resumeFile} download={profile.resumeFileName}>
                        <Download />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </object>
            </div>
          </GlassCard>
        </Reveal>

        {/* ------------------------------------------------------------- */}
        {/* Quick facts                                                   */}
        {/* ------------------------------------------------------------- */}
        <div className="grid gap-4 lg:content-start">
          <Reveal delay={0.06}>
            <GlassCard className="p-6">
              <h3 className="eyebrow mb-5">At a glance</h3>

              <dl className="space-y-4">
                {quickFacts.map((fact) => (
                  <div key={fact.label} className="flex gap-3">
                    <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03]">
                      <Icon name={fact.icon} className="size-3.5 text-accent" />
                    </span>
                    <div className="min-w-0">
                      <dt className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
                        {fact.label}
                      </dt>
                      <dd className="mt-0.5 text-[0.8125rem] leading-relaxed text-white/85">
                        {fact.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/6 pt-5">
                <Badge variant="primary" size="md">
                  {roles} roles
                </Badge>
                <Badge variant="accent" size="md">
                  3 production platforms
                </Badge>
                <Badge variant="success" size="md">
                  ATS-friendly PDF
                </Badge>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <GlassCard className="p-6">
              <h3 className="text-[0.9375rem] font-semibold text-white">
                Need it in a different shape?
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
                Happy to send a role-specific version, a longer architecture write-up on any project
                here, or references on request.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <a href={profile.links.mail}>
                  <Icon name="Mail" />
                  Ask for a tailored copy
                </a>
              </Button>
            </GlassCard>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
