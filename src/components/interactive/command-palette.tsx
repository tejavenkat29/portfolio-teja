"use client";

import * as React from "react";
import { Command } from "cmdk";
import { ArrowUpRight, Copy, CornerDownLeft, Download, Search, Terminal } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { navItems } from "@/lib/data/site";
import { projects } from "@/lib/data/projects";
import { profile } from "@/lib/data/profile";
import { openTerminal, scrollToSection } from "@/lib/ui-events";
import { Icon, brandIcons } from "@/components/icons";

/**
 * ⌘K palette. Every section, project and contact channel reachable in two
 * keystrokes — the navigation a keyboard-first visitor actually wants.
 *
 * Open state is owned by `OverlayHost` so this whole module (and cmdk with it)
 * can stay out of the initial bundle until someone actually reaches for it.
 */
export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [search, setSearch] = React.useState("");

  const run = React.useCallback(
    (action: () => void) => {
      onOpenChange(false);
      // Let the dialog finish closing so the scroll isn't fighting a focus trap.
      window.setTimeout(action, 90);
    },
    [onOpenChange],
  );

  const copyEmail = () =>
    run(async () => {
      try {
        await navigator.clipboard.writeText(profile.email);
        toast.success("Email copied", { description: profile.email });
      } catch {
        window.location.href = profile.links.mail;
      }
    });

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      shouldFilter
      loop
      overlayClassName="fixed inset-0 z-100 bg-ink/80 backdrop-blur-md anim-overlay"
      contentClassName={cn(
        "fixed left-1/2 top-[12vh] z-101 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2",
        "overflow-hidden rounded-2xl glass-strong outline-none",
        "animate-[fade-in_0.24s_var(--ease-out-expo)]",
      )}
      className={cn(
        "[&_[cmdk-list]]:max-h-[min(58vh,26rem)] [&_[cmdk-list]]:overflow-y-auto",
        "[&_[cmdk-list]]:overscroll-contain [&_[cmdk-list]]:scroll-py-2",
      )}
    >
      <div className="flex items-center gap-3 border-b border-white/8 px-4">
        <Search className="size-4 shrink-0 text-faint" />
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Jump to a section, project or channel…"
          className="h-14 w-full bg-transparent text-[0.9375rem] text-white outline-none placeholder:text-faint"
        />
        <kbd className="hidden shrink-0 rounded border border-white/12 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[0.625rem] text-white/60 sm:block">
          ESC
        </kbd>
      </div>

      <Command.List className="p-2">
        <Command.Empty className="px-3 py-8 text-center text-sm text-muted">
          Nothing matches <span className="font-mono text-white/80">{search}</span>.
        </Command.Empty>

        <Group heading="Navigate">
          {navItems.map((item) => (
            <Item
              key={item.id}
              value={`${item.label} ${item.hint ?? ""}`}
              onSelect={() => run(() => scrollToSection(item.href))}
              icon={<Icon name={item.icon} className="size-4" />}
              hint={item.hint}
            >
              {item.label}
            </Item>
          ))}
        </Group>

        <Group heading="Projects">
          {projects.map((project) => (
            <Item
              key={project.id}
              value={`${project.name} ${project.tagline} ${project.kind}`}
              onSelect={() => run(() => scrollToSection(`#project-${project.id}`))}
              icon={<Icon name="FolderKanban" className="size-4" />}
              hint={project.tagline}
            >
              {project.name}
            </Item>
          ))}
        </Group>

        <Group heading="Actions">
          <Item
            value="Download resume PDF CV"
            onSelect={() =>
              run(() => {
                const link = document.createElement("a");
                link.href = profile.resumeFile;
                link.download = profile.resumeFileName;
                link.click();
                toast.success("Resume downloading", { description: profile.resumeFileName });
              })
            }
            icon={<Download className="size-4" />}
            hint="PDF · one page"
          >
            Download résumé
          </Item>
          <Item
            value="Copy email address"
            onSelect={copyEmail}
            icon={<Copy className="size-4" />}
            hint={profile.email}
          >
            Copy email
          </Item>
          <Item
            value="Open interactive terminal shell"
            onSelect={() => run(openTerminal)}
            icon={<Terminal className="size-4" />}
            hint="help · about · projects · skills"
          >
            Open terminal
          </Item>
        </Group>

        <Group heading="Channels">
          <LinkItem href={profile.links.github} label="GitHub" hint="github.com/tejavenkat29">
            <brandIcons.GitHub className="size-4" />
          </LinkItem>
          <LinkItem href={profile.links.linkedin} label="LinkedIn" hint="teja-venkat-kundem">
            <brandIcons.LinkedIn className="size-4" />
          </LinkItem>
          <LinkItem href={profile.links.whatsapp} label="WhatsApp" hint={profile.phone}>
            <brandIcons.WhatsApp className="size-4" />
          </LinkItem>
          <LinkItem href={profile.links.mail} label="Email" hint={profile.email}>
            <brandIcons.Gmail className="size-4" />
          </LinkItem>
        </Group>
      </Command.List>

      <div className="flex items-center justify-between gap-4 border-t border-white/8 px-4 py-2.5">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-faint">
          {profile.shortName}@portfolio
        </span>
        <span className="flex items-center gap-3 text-[0.6875rem] text-faint">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="size-3" /> select
          </span>
          <span className="hidden items-center gap-1 sm:flex">↑↓ navigate</span>
        </span>
      </div>
    </Command.Dialog>
  );
}

function Group({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className={cn(
        "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3",
        "[&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.625rem]",
        "[&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.18em]",
        "[&_[cmdk-group-heading]]:text-faint",
      )}
    >
      {children}
    </Command.Group>
  );
}

function Item({
  children,
  value,
  onSelect,
  icon,
  hint,
  trailing,
}: {
  children: React.ReactNode;
  value: string;
  onSelect: () => void;
  icon: React.ReactNode;
  hint?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/80",
        "transition-colors duration-200",
        "data-[selected=true]:bg-white/[0.07] data-[selected=true]:text-white",
      )}
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-muted transition-colors group-data-[selected=true]:border-primary/40 group-data-[selected=true]:text-white">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {hint ? <span className="hidden shrink-0 truncate text-xs text-faint sm:block">{hint}</span> : null}
      {trailing}
    </Command.Item>
  );
}

function LinkItem({
  href,
  label,
  hint,
  children,
}: {
  href: string;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <Item
      value={`${label} ${hint}`}
      onSelect={() => window.open(href, href.startsWith("mailto:") ? "_self" : "_blank", "noopener,noreferrer")}
      icon={children}
      hint={hint}
      trailing={<ArrowUpRight className="size-3.5 shrink-0 text-faint" />}
    >
      {label}
    </Item>
  );
}
