import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { cx } from "../variants.ts";
import { Toast, type ToastProps } from "./Toast.tsx";
import { announce } from "./announce.ts";
import { TOAST } from "./timing.ts";

export interface ToastOptions extends Omit<ToastProps, "children" | "onDismiss"> {
  /** The message. Plain text is also what the shared announcer says. */
  message: ReactNode;
  /** ms before it leaves. Defaults to the Toaster's; a toast with actions stays until dismissed. */
  duration?: number;
  /** What a screen reader hears, when `message` or `title` is not plain text. */
  announcement?: string;
}

/** `leaving`: fading out (`data-leaving`); removed when the fade ends. */
interface Entry extends ToastOptions { toastId: number; leaving?: boolean }

export interface ToasterApi {
  /** Shows a toast and returns its id. */
  show: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToasterContext = createContext<ToasterApi | null>(null);

/** The Toaster in scope: `show` and `dismiss`. */
export function useToaster(): ToasterApi {
  const api = useContext(ToasterContext);
  if (!api) throw new Error("useToaster needs a <Toaster> above it.");
  return api;
}

export interface ToasterProps {
  /** The app: `useToaster()` anywhere inside it shows toasts in the region. */
  children?: ReactNode;
  /** Names the region ("Notifications"); the hotkey is added for assistive tech. */
  label?: string;
  /** How long a toast stays, in ms, unless it sets its own. Toasts with an action never time out. */
  duration?: number;
  /** The key that moves focus to the region. */
  hotkey?: string;
  /** Classes for the region. */
  className?: string;
}

const text = (node: ReactNode): string => typeof node === "string" || typeof node === "number" ? String(node) : "";

/** The longest transition on a node, in ms: 0 at motion 0 and under reduced motion. */
const transitionMs = (node: Element | null | undefined) => {
  if (!node) return 0;
  const style = getComputedStyle(node);
  const ms = (list: string) => list.split(",").map(value => parseFloat(value) * (value.trim().endsWith("ms") ? 1 : 1000) || 0);
  const durations = ms(style.transitionDuration);
  const delays = ms(style.transitionDelay);
  return Math.max(0, ...durations.map((duration, i) => duration + (delays[i % delays.length] ?? 0)));
};

/**
 * Hosts toasts (audit E-11 A, owner 2026-09-30). Each toast is said through the shared announcer
 * (`announce`, components audit D1); danger is assertive, as Alert's. Timers pause while the pointer or
 * focus is in the region (WCAG 2.2.1), a toast with an action waits to be dismissed, F8 reaches
 * the region, and toasts stack newest last at the end corner.
 *
 * The region is a manual popover (plan C5.1), so it sits in the top layer above every popover and modal opened before
 * the newest toast. A modal dialog makes the rest of the page inert, so while one is open the region moves into it, as
 * the shared announcer does: a toast raised over a dialog can be pressed and F8 reaches it. Timers also pause while
 * the window is in the background or unfocused, and resume with the time they had left.
 */
export function Toaster({ children, label = "Notifications", duration = TOAST.duration, hotkey = "F8", className }: ToasterProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const nextId = useRef(1);
  const region = useRef<HTMLElement | null>(null);
  const paused = useRef(false);
  // Why the timers are paused: the pointer or focus in the region, or the window hidden or unfocused.
  const holds = useRef(new Set<string>());
  // After mount the region renders through a portal into a container this component owns, so the container can move
  // into an open modal and back without React losing track of the region (the first render stays in place: SSR).
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const timers = useRef(new Map<number, { left: number; started: number; handle?: ReturnType<typeof setTimeout> }>());

  const items = useRef(new Map<number, HTMLLIElement>());
  // Each item's offset from the toaster's bottom edge at the last layout, without its reflow translate.
  const offsets = useRef(new Map<number, number>());
  const removals = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  // Leaving is two steps (motion pass 2026-10-07, docs/MOTION.md "Toast"): mark the toast
  // `data-leaving` so it fades out, then remove it when its transition has run.
  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer?.handle) clearTimeout(timer.handle);
    timers.current.delete(id);
    setEntries(list => list.map(entry => entry.toastId === id && !entry.leaving ? { ...entry, leaving: true } : entry));
  }, []);
  useEffect(() => {
    for (const { toastId, leaving } of entries) {
      if (!leaving || removals.current.has(toastId)) continue;
      const wait = transitionMs(items.current.get(toastId)?.firstElementChild);
      removals.current.set(toastId, setTimeout(() => {
        removals.current.delete(toastId);
        setEntries(list => list.filter(entry => entry.toastId !== toastId));
      }, wait));
    }
  }, [entries]);
  // Stack reflow (FLIP): a toast that layout moved starts from where it was shown, as a whole-pixel
  // translate, and eases home on the list item's transition. Interrupted reflows continue from
  // where they are.
  useLayoutEffect(() => {
    const edge = region.current?.getBoundingClientRect().bottom ?? 0;
    const moved: [HTMLLIElement, number][] = [];
    for (const id of offsets.current.keys()) if (!items.current.has(id)) offsets.current.delete(id);
    for (const [id, item] of items.current) {
      const zoom = (item as HTMLElement & { currentCSSZoom?: number }).currentCSSZoom || 1;
      const shift = (parseFloat(getComputedStyle(item).translate.split(" ")[1] ?? "") || 0) * zoom;
      const offset = item.getBoundingClientRect().top - shift - edge;
      const before = offsets.current.get(id);
      offsets.current.set(id, offset);
      if (before === undefined || Math.abs(before - offset) < 0.5) continue;
      moved.push([item, Math.round((before + shift - offset) / zoom)]);
    }
    if (!moved.length) return;
    for (const [item, from] of moved) { item.style.transition = "none"; item.style.translate = `0 ${from}px`; }
    void region.current?.offsetHeight;
    for (const [item] of moved) { item.style.transition = ""; item.style.translate = ""; }
  }, [entries]);
  useEffect(() => {
    const node = document.createElement("div");
    node.setAttribute("data-area-toaster-host", "");
    node.style.display = "contents";
    document.body.append(node);
    setContainer(node);
    return () => node.remove();
  }, []);
  // The topmost open modal hosts the region; then the region is shown again so it is the newest top-layer entry.
  const raise = useCallback(() => {
    const node = region.current;
    if (!container || !node) return;
    let host: HTMLElement = document.body;
    for (const dialog of Array.from(document.querySelectorAll<HTMLDialogElement>("dialog[open]")).reverse()) {
      try { if (dialog.matches(":modal")) { host = dialog; break; } } catch { /* :modal unsupported */ }
    }
    if (container.parentNode !== host) host.append(container);
    if (typeof node.showPopover !== "function" || !node.childElementCount || node.hidden) return;
    try {
      if (node.matches(":popover-open")) node.hidePopover();
      node.showPopover();
    } catch { /* not connected yet */ }
  }, [container]);
  useLayoutEffect(() => {
    const node = region.current;
    if (!node || typeof node.hidePopover !== "function") return;
    if (entries.length) raise();
    else if (node.matches(":popover-open")) node.hidePopover();
  }, [entries.length, raise, container]);
  // A modal opening or closing while toasts show moves the region with it.
  useEffect(() => {
    if (!container || typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver(records => { if (records.some(record => (record.target as Element).localName === "dialog")) raise(); });
    observer.observe(document.body, { attributes: true, attributeFilter: ["open"], subtree: true });
    return () => observer.disconnect();
  }, [container, raise]);
  const arm = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (!timer || paused.current || !Number.isFinite(timer.left)) return;
    timer.started = Date.now();
    timer.handle = setTimeout(() => dismiss(id), timer.left);
  }, [dismiss]);
  const show = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    const left = options.actions ?? options.action ? Infinity : options.duration ?? duration;
    timers.current.set(id, { left, started: Date.now() });
    setEntries(list => [...list, { ...options, toastId: id }]);
    const said = options.announcement ?? [text(options.title), text(options.message)].filter(Boolean).join(". ");
    // The announcer clears and writes again, so the same message twice is announced twice.
    announce(said, { politeness: options.tone === "danger" ? "assertive" : "polite" });
    arm(id);
    return id;
  }, [arm, duration]);

  const hold = (reason: string) => {
    holds.current.add(reason);
    if (paused.current) return;
    paused.current = true;
    for (const timer of timers.current.values()) {
      if (!timer.handle) continue;
      clearTimeout(timer.handle);
      timer.handle = undefined;
      timer.left -= Date.now() - timer.started;
    }
  };
  const release = (reason: string) => {
    holds.current.delete(reason);
    if (!paused.current || holds.current.size) return;
    paused.current = false;
    for (const id of timers.current.keys()) arm(id);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== hotkey || !region.current?.childElementCount) return;
      event.preventDefault();
      region.current.focus();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [hotkey]);
  useEffect(() => {
    const visibility = () => { if (document.visibilityState === "hidden") hold("hidden"); else release("hidden"); };
    const blur = () => hold("blur");
    const focus = () => release("blur");
    document.addEventListener("visibilitychange", visibility);
    addEventListener("blur", blur);
    addEventListener("focus", focus);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      removeEventListener("blur", blur);
      removeEventListener("focus", focus);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- hold and release read refs only
  useEffect(() => () => {
    for (const timer of timers.current.values()) if (timer.handle) clearTimeout(timer.handle);
    for (const handle of removals.current.values()) clearTimeout(handle);
  }, []);

  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);
  const toaster = <section ref={region} className={cx("area-toaster", className)} aria-label={`${label} (${hotkey})`} tabIndex={-1}
      hidden={entries.length === 0} popover="manual"
      onPointerEnter={() => hold("pointer")} onPointerLeave={() => { if (!region.current?.contains(document.activeElement)) { release("pointer"); release("focus"); } }}
      onFocus={() => hold("focus")} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !event.currentTarget.matches(":hover")) { release("focus"); release("pointer"); } }}>
      <ol className="area-toaster__list">
        {entries.map(({ toastId, leaving, message, duration: _duration, announcement: _announcement, ...toast }) => <li key={toastId}
          data-leaving={leaving ? "" : undefined}
          ref={node => { if (node) items.current.set(toastId, node); else items.current.delete(toastId); }}>
          <Toast {...toast} live={false} onDismiss={() => dismiss(toastId)}>{message}</Toast>
        </li>)}
      </ol>
    </section>;
  return <ToasterContext.Provider value={api}>
    {children}
    {container ? createPortal(toaster, container) : toaster}
  </ToasterContext.Provider>;
}
