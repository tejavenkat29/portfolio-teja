"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import { UI_EVENTS, onUi } from "@/lib/ui-events";

/**
 * Owns the two global overlays. Neither ships in the initial bundle — the
 * palette pulls in cmdk and the terminal pulls in its own renderer, and the
 * overwhelming majority of visits never open either.
 *
 * They mount on first request, and both chunks are warmed during idle time
 * afterwards so the first ⌘K still feels instant.
 */
const CommandPalette = dynamic(
  () => import("@/components/interactive/command-palette").then((m) => m.CommandPalette),
  { ssr: false },
);

const TerminalOverlay = dynamic(
  () => import("@/components/interactive/terminal").then((m) => m.TerminalOverlay),
  { ssr: false },
);

export function OverlayHost() {
  const [paletteMounted, setPaletteMounted] = React.useState(false);
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [terminalMounted, setTerminalMounted] = React.useState(false);
  const [terminalOpen, setTerminalOpen] = React.useState(false);

  const openPalette = React.useCallback(() => {
    setPaletteMounted(true);
    setPaletteOpen(true);
  }, []);

  const openTerminal = React.useCallback(() => {
    setTerminalMounted(true);
    setTerminalOpen(true);
  }, []);

  // The only always-loaded behaviour: a keyboard shortcut and two event hooks.
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setPaletteMounted(true);
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => onUi(UI_EVENTS.palette, openPalette), [openPalette]);
  React.useEffect(() => onUi(UI_EVENTS.terminal, openTerminal), [openTerminal]);

  // Warm both chunks once the browser is idle, so opening them costs nothing.
  React.useEffect(() => {
    const warm = () => {
      void import("@/components/interactive/command-palette");
      void import("@/components/interactive/terminal");
    };

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(warm, { timeout: 4000 });
      return () => window.cancelIdleCallback(handle);
    }

    const handle = window.setTimeout(warm, 2500);
    return () => window.clearTimeout(handle);
  }, []);

  return (
    <>
      {paletteMounted ? <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} /> : null}
      {terminalMounted ? <TerminalOverlay open={terminalOpen} onOpenChange={setTerminalOpen} /> : null}
    </>
  );
}
