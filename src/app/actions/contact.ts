"use server";

import { profile } from "@/lib/data/profile";

export type ContactState = {
  status: "idle" | "sent" | "handoff" | "error";
  message?: string;
  /** Field-level errors keyed by input name. */
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  /** Echoed back so the client can pre-fill a mail client when direct send is off. */
  draft?: { name: string; email: string; subject: string; message: string };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Coarse per-process throttle — enough to stop a bored visitor hammering submit. */
const recent = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

function throttled(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > MAX_PER_WINDOW;
}

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim() || "Portfolio enquiry";
  const message = String(formData.get("message") ?? "").trim();
  // Honeypot — bots fill hidden fields, humans never see them.
  const trap = String(formData.get("company_website") ?? "");

  const errors: ContactState["errors"] = {};
  if (name.length < 2) errors.name = "Tell me who you are.";
  if (!EMAIL_RE.test(email)) errors.email = "That email doesn't look right.";
  if (message.length < 12) errors.message = "A little more detail helps me reply usefully.";

  if (Object.keys(errors).length) {
    return { status: "error", errors, message: "Check the highlighted fields." };
  }

  if (trap) {
    // Silently accept and drop — never tell a bot why it failed.
    return { status: "sent", message: "Thanks — message received." };
  }

  if (throttled(email.toLowerCase())) {
    return {
      status: "error",
      message: "That's a few messages in quick succession — give it a minute.",
    };
  }

  const draft = { name, email, subject, message };
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  // Without mail credentials configured, hand the draft back to the client so it
  // can open the visitor's own mail app fully pre-filled. No silent black hole.
  if (!apiKey || !from) {
    return {
      status: "handoff",
      message: "Opening your mail app with this message ready to send.",
      draft,
    };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [profile.email],
        reply_to: email,
        subject: `[Portfolio] ${subject} — ${name}`,
        text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      return {
        status: "handoff",
        message: "Direct send failed — opening your mail app with the message instead.",
        draft,
      };
    }

    return { status: "sent", message: "Message sent. I usually reply within a day." };
  } catch {
    return {
      status: "handoff",
      message: "Couldn't reach the mail service — opening your mail app instead.",
      draft,
    };
  }
}
