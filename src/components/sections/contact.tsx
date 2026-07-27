"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowUpRight, Check, Copy, LoaderCircle, Send } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { profile } from "@/lib/data/profile";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { Section, SectionHeader } from "@/components/layout/section";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import { Icon, brandIcons } from "@/components/icons";
import { Reveal } from "@/components/interactive/reveal";
import { Magnetic } from "@/components/interactive/magnetic";

const initialState: ContactState = { status: "idle" };

const channels = [
  {
    id: "email",
    label: "Email",
    value: profile.email,
    href: profile.links.mail,
    Icon: brandIcons.Gmail,
    note: "Best for detail — I reply within a day",
    copy: profile.email,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "teja-venkat-kundem",
    href: profile.links.linkedin,
    Icon: brandIcons.LinkedIn,
    note: "Roles, referrals and introductions",
  },
  {
    id: "github",
    label: "GitHub",
    value: `@${profile.githubUser}`,
    href: profile.links.github,
    Icon: brandIcons.GitHub,
    note: "Code, commits and public work",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: profile.phone,
    href: profile.links.whatsapp,
    Icon: brandIcons.WhatsApp,
    note: "Quickest for a scheduling ping",
    copy: profile.phone,
  },
] as const;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Magnetic>
      <Button type="submit" variant="primary" size="lg" disabled={pending} className="min-w-44">
        {pending ? (
          <>
            <LoaderCircle className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send />
            Send message
          </>
        )}
      </Button>
    </Magnetic>
  );
}

export function Contact() {
  const [state, action] = useActionState(submitContact, initialState);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [copied, setCopied] = React.useState<string | null>(null);
  const handled = React.useRef<ContactState | null>(null);

  // React to the action result exactly once per submission.
  React.useEffect(() => {
    if (state === handled.current || state.status === "idle") return;
    handled.current = state;

    if (state.status === "sent") {
      toast.success("Message sent", { description: state.message });
      formRef.current?.reset();
    }

    if (state.status === "handoff" && state.draft) {
      const { name, email, subject, message } = state.draft;
      const body = `${message}\n\n—\n${name}\n${email}`;
      const href = `${profile.links.mail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      toast.info("Opening your mail app", { description: state.message });
      window.location.href = href;
    }

    if (state.status === "error" && !state.errors) {
      toast.error("Couldn't send that", { description: state.message });
    }
  }, [state]);

  const copy = async (value: string, id: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      toast.success("Copied", { description: value });
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      toast.error("Couldn't copy that");
    }
  };

  return (
    <Section id="contact">
      <SectionHeader
        id="contact"
        index="10"
        eyebrow="Contact"
        title="Let's talk about the system you're building"
        lede="Hiring, contracting, or just want the architecture walkthrough behind one of the projects above — all of it reaches me here."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        {/* ------------------------------------------------------------- */}
        {/* Form                                                          */}
        {/* ------------------------------------------------------------- */}
        <Reveal>
          <GlassCard className="h-full p-6 sm:p-8">
            <form ref={formRef} action={action} className="space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <Icon name="User" className="size-3.5 text-primary" />
                    Your name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    aria-invalid={Boolean(state.errors?.name)}
                    aria-describedby={state.errors?.name ? "name-error" : undefined}
                    required
                  />
                  <span id="name-error">
                    <FieldError>{state.errors?.name}</FieldError>
                  </span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Icon name="Mail" className="size-3.5 text-primary" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    aria-invalid={Boolean(state.errors?.email)}
                    aria-describedby={state.errors?.email ? "email-error" : undefined}
                    required
                  />
                  <span id="email-error">
                    <FieldError>{state.errors?.email}</FieldError>
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">
                  <Icon name="Hash" className="size-3.5 text-primary" />
                  Subject
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Backend role · AI systems · architecture question"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  <Icon name="MessageSquare" className="size-3.5 text-primary" />
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="What are you building, and where does the backend need to hold up?"
                  aria-invalid={Boolean(state.errors?.message)}
                  aria-describedby={state.errors?.message ? "message-error" : undefined}
                  required
                />
                <span id="message-error">
                  <FieldError>{state.errors?.message}</FieldError>
                </span>
              </div>

              {/* Honeypot — visually and programmatically hidden */}
              <div aria-hidden className="hidden">
                <label htmlFor="company_website">Company website</label>
                <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <SubmitButton />

                <p className="text-[0.75rem] leading-relaxed text-faint">
                  Goes straight to{" "}
                  <span className="font-mono text-white/60">{profile.email}</span>. No list, no
                  newsletter.
                </p>
              </div>

              {state.status === "sent" ? (
                <p
                  role="status"
                  className="flex items-center gap-2 rounded-xl border border-success/25 bg-success/8 px-4 py-3 text-[0.8125rem] text-[#a7f3c4]"
                >
                  <Check className="size-4 shrink-0" />
                  {state.message}
                </p>
              ) : null}
            </form>
          </GlassCard>
        </Reveal>

        {/* ------------------------------------------------------------- */}
        {/* Channels                                                      */}
        {/* ------------------------------------------------------------- */}
        <div className="grid gap-4 lg:content-start">
          <Reveal delay={0.06}>
            <GlassCard className="p-5">
              <div className="flex items-start gap-3">
                <span className="relative mt-1 grid size-2.5 place-items-center">
                  <span className="absolute size-2.5 rounded-full bg-success/50 animate-ping motion-reduce:animate-none" />
                  <span className="size-2 rounded-full bg-success" />
                </span>
                <div>
                  <h3 className="text-[0.9375rem] font-semibold text-white">{profile.availability}</h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                    Based in {profile.location} · IST (UTC+5:30). Comfortable with remote and
                    distributed teams.
                  </p>
                </div>
              </div>
            </GlassCard>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="grid gap-3">
              {channels.map((channel) => (
                <li key={channel.id}>
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-3.5">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03]">
                        <channel.Icon className="size-4 text-white/80" />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[0.8125rem] font-semibold text-white">{channel.label}</span>
                        </div>
                        <a
                          href={channel.href}
                          target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                          rel="noreferrer noopener"
                          className="mt-0.5 block truncate font-mono text-[0.75rem] text-accent hover:underline"
                        >
                          {channel.value}
                        </a>
                        <p className="mt-1 truncate text-[0.6875rem] text-faint">{channel.note}</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        {"copy" in channel && channel.copy ? (
                          <button
                            type="button"
                            onClick={() => copy(channel.copy as string, channel.id)}
                            aria-label={`Copy ${channel.label}`}
                            className={cn(
                              "grid size-8 place-items-center rounded-lg border border-white/8",
                              "text-faint transition-colors hover:border-white/20 hover:text-white",
                            )}
                          >
                            {copied === channel.id ? (
                              <Check className="size-3.5 text-success" />
                            ) : (
                              <Copy className="size-3.5" />
                            )}
                          </button>
                        ) : null}

                        <a
                          href={channel.href}
                          target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                          rel="noreferrer noopener"
                          aria-label={`Open ${channel.label}`}
                          className={cn(
                            "grid size-8 place-items-center rounded-lg border border-white/8",
                            "text-faint transition-colors hover:border-white/20 hover:text-white",
                          )}
                        >
                          <ArrowUpRight className="size-3.5" />
                        </a>
                      </div>
                    </div>
                  </GlassCard>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
