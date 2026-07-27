/**
 * A tiny event bus for the two global overlays (command palette, terminal).
 * Custom events keep the nav, hero, terminal and keyboard handler decoupled —
 * no provider tree threading state that only two components care about.
 */
export const UI_EVENTS = {
  palette: "ui:palette",
  terminal: "ui:terminal",
} as const;

type UiEvent = (typeof UI_EVENTS)[keyof typeof UI_EVENTS];

export function emitUi(event: UiEvent, detail?: unknown) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(event, { detail }));
}

export function onUi(event: UiEvent, handler: (detail?: unknown) => void) {
  if (typeof window === "undefined") return () => {};
  const listener = (e: Event) => handler((e as CustomEvent).detail);
  window.addEventListener(event, listener);
  return () => window.removeEventListener(event, listener);
}

export const openPalette = () => emitUi(UI_EVENTS.palette);
export const openTerminal = () => emitUi(UI_EVENTS.terminal);

/** Smooth-scrolls to a section id and updates the hash without a jump. */
export function scrollToSection(hash: string) {
  if (typeof window === "undefined") return;
  const id = hash.replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", `#${id}`);
}
