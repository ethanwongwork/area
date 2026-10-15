import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cx } from "../variants.ts";
import { Toast, type ToastProps } from "./primitives.tsx";

export interface ToastOptions extends Omit<ToastProps, "children" | "onDismiss"> {
  /** The message. Plain text is also what the live region announces. */
  message: ReactNode;
  /** ms before it leaves. Defaults to the Toaster's; a toast with an action stays until dismissed. */
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
  children?: ReactNode;
  /** Names the region ("Notifications"); the hotkey is added for assistive tech. */
  label?: string;
  /** Default ms a toast stays (Radix 5000). Toasts with an action never time out. */
  duration?: number;
  /** Moves focus to the region (Radix: F8). */
  hotkey?: string;
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
 * Hosts toasts (audit E-11 A, owner 2026-09-30). The live regions exist before any toast, so the
 * first message is announced; danger is assertive, as Alert's. Timers pause while the pointer or
 * focus is in the region (WCAG 2.2.1), a toast with an action waits to be dismissed, F8 reaches
 * the region, and toasts stack newest last at the end corner.
 */
export function Toaster({ children, label = "Notifications", duration = 5000, hotkey = "F8", className }: ToasterProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [polite, setPolite] = useState("");
  const [assertive, setAssertive] = useState("");
  const nextId = useRef(1);
  const region = useRef<HTMLElement | null>(null);
  const paused = useRef(false);
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
  const arm = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (!timer || paused.current || !Number.isFinite(timer.left)) return;
    timer.started = Date.now();
    timer.handle = setTimeout(() => dismiss(id), timer.left);
  }, [dismiss]);
  const show = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    const left = options.action ? Infinity : options.duration ?? duration;
    timers.current.set(id, { left, started: Date.now() });
    setEntries(list => [...list, { ...options, toastId: id }]);
    const said = options.announcement ?? [text(options.title), text(options.message)].filter(Boolean).join(". ");
    // Clear, then write on the next frame, so the same message twice is announced twice.
    const set = options.tone === "danger" ? setAssertive : setPolite;
    set("");
    requestAnimationFrame(() => set(said));
    arm(id);
    return id;
  }, [arm, duration]);

  const pause = () => {
    if (paused.current) return;
    paused.current = true;
    for (const timer of timers.current.values()) {
      if (!timer.handle) continue;
      clearTimeout(timer.handle);
      timer.handle = undefined;
      timer.left -= Date.now() - timer.started;
    }
  };
  const resume = () => {
    if (!paused.current) return;
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
  useEffect(() => () => {
    for (const timer of timers.current.values()) if (timer.handle) clearTimeout(timer.handle);
    for (const handle of removals.current.values()) clearTimeout(handle);
  }, []);

  const api = useMemo(() => ({ show, dismiss }), [show, dismiss]);
  return <ToasterContext.Provider value={api}>
    {children}
    <span className="area-sr-only" role="status" aria-live="polite" aria-atomic="true">{polite}</span>
    <span className="area-sr-only" role="alert" aria-live="assertive" aria-atomic="true">{assertive}</span>
    <section ref={region} className={cx("area-toaster", className)} aria-label={`${label} (${hotkey})`} tabIndex={-1}
      hidden={entries.length === 0}
      onPointerEnter={pause} onPointerLeave={() => { if (!region.current?.contains(document.activeElement)) resume(); }}
      onFocus={pause} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null) && !event.currentTarget.matches(":hover")) resume(); }}>
      <ol className="area-toaster__list">
        {entries.map(({ toastId, leaving, message, duration: _duration, announcement: _announcement, ...toast }) => <li key={toastId}
          data-leaving={leaving ? "" : undefined}
          ref={node => { if (node) items.current.set(toastId, node); else items.current.delete(toastId); }}>
          <Toast {...toast} live={false} onDismiss={() => dismiss(toastId)}>{message}</Toast>
        </li>)}
      </ol>
    </section>
  </ToasterContext.Provider>;
}
