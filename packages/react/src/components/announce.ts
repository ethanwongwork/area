// One announcer for screen readers (components audit D1, 2026-11-07; Primer's one shared live region, ADR-020).
// Every family that reports a change it doesn't show where focus is (a copy, a toast, a reorder, a result count, an
// upload, a month) says it here, so a page has one polite region and one assertive region, not one per component.
// DESIGN_SYSTEM.md, "Announcements".

import { useEffect, useRef } from "react";
import { ANNOUNCE } from "./timing.ts";

export type AnnouncePoliteness = "polite" | "assertive";

export interface AnnounceOptions {
  /** `polite` (default) waits for the reader to finish; `assertive` interrupts, for a failure the person must act on now. */
  politeness?: AnnouncePoliteness;
}

/** The pause between clearing a region and writing it, so a repeated message is announced again (ms). */
export const ANNOUNCE_DELAY_MS = ANNOUNCE.delay;
/** How long a message stays in the region before it is cleared, so it isn't found later while reading the page (ms). */
export const ANNOUNCE_CLEAR_MS = ANNOUNCE.clear;

interface Regions {
  root: HTMLElement;
  polite: HTMLElement;
  assertive: HTMLElement;
  timers: Map<AnnouncePoliteness, ReturnType<typeof setTimeout>>;
}

const MARK = "data-area-announcer";
const HIDDEN = "position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap";
const byDocument = new WeakMap<Document, Regions>();

const currentDocument = (): Document | undefined => typeof document === "undefined" ? undefined : document;

/** A modal dialog makes the rest of the page inert, a live region outside it included, so the region joins the top one. */
function host(doc: Document): HTMLElement {
  const open = Array.from(doc.querySelectorAll?.("dialog[open]") ?? []) as HTMLElement[];
  for (const dialog of open.reverse()) {
    try { if (dialog.matches(":modal")) return dialog; } catch { /* :modal unsupported: treat as not modal */ }
  }
  return doc.body;
}

function region(doc: Document, politeness: AnnouncePoliteness): HTMLElement {
  const make = (live: AnnouncePoliteness) => {
    const node = doc.createElement("div");
    node.setAttribute("role", live === "assertive" ? "alert" : "status");
    node.setAttribute("aria-live", live);
    node.setAttribute("aria-atomic", "true");
    node.setAttribute(MARK, live);
    return node;
  };
  let regions = byDocument.get(doc);
  if (!regions) {
    // Another copy of the package may have made the regions already: one per document, whoever made them.
    const found = doc.querySelector?.(`[${MARK}="root"]`) as HTMLElement | null;
    const root = found ?? doc.createElement("div");
    if (!found) {
      root.setAttribute(MARK, "root");
      root.setAttribute("style", HIDDEN);
      root.append(make("polite"), make("assertive"));
    }
    regions = {
      root,
      polite: root.querySelector(`[${MARK}="polite"]`) as HTMLElement,
      assertive: root.querySelector(`[${MARK}="assertive"]`) as HTMLElement,
      timers: new Map(),
    };
    byDocument.set(doc, regions);
  }
  const target = host(doc);
  if (regions.root.parentNode !== target) target.append(regions.root);
  return regions[politeness];
}

/**
 * Says `message` to screen readers through the document's one shared live region. Polite by default; `assertive`
 * only for a failure the person must act on now. The region is made on first use, so importing this touches no
 * document (server rendering is safe), and a call with no document does nothing. The region is cleared and written
 * again after a short pause, so the same words twice are said twice, and cleared after a few seconds.
 */
export function announce(message: string, { politeness = "polite" }: AnnounceOptions = {}): void {
  const doc = currentDocument();
  if (!doc?.body) return;
  const node = region(doc, politeness);
  const regions = byDocument.get(doc)!;
  const pending = regions.timers.get(politeness);
  if (pending) clearTimeout(pending);
  node.textContent = "";
  const text = message.trim();
  if (!text) return;
  regions.timers.set(politeness, setTimeout(() => {
    node.textContent = text;
    regions.timers.set(politeness, setTimeout(() => { node.textContent = ""; regions.timers.delete(politeness); }, ANNOUNCE_CLEAR_MS));
  }, ANNOUNCE_DELAY_MS));
}

/** Empties both regions and cancels anything waiting to be said (a view that closes takes its words with it). */
export function clearAnnouncements(): void {
  const doc = currentDocument();
  const regions = doc && byDocument.get(doc);
  if (!regions) return;
  for (const timer of regions.timers.values()) clearTimeout(timer);
  regions.timers.clear();
  regions.polite.textContent = "";
  regions.assertive.textContent = "";
}

/**
 * Says `message` each time it changes after the first render (a status a component shows away from focus: an upload's
 * state, the month on view). The first value is not said, since it was on the page before anything changed; an empty
 * or missing message says nothing.
 */
export function useAnnouncement(message: string | null | undefined, { politeness = "polite" }: AnnounceOptions = {}): void {
  const last = useRef(message);
  useEffect(() => {
    if (last.current === message) return;
    last.current = message;
    if (message) announce(message, { politeness });
  }, [message, politeness]);
}
