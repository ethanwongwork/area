import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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

interface Entry extends ToastOptions { toastId: number }

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

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer?.handle) clearTimeout(timer.handle);
    timers.current.delete(id);
    setEntries(list => list.filter(entry => entry.toastId !== id));
  }, []);
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
  useEffect(() => () => { for (const timer of timers.current.values()) if (timer.handle) clearTimeout(timer.handle); }, []);

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
        {entries.map(({ toastId, message, duration: _duration, announcement: _announcement, ...toast }) => <li key={toastId}>
          <Toast {...toast} live={false} onDismiss={() => dismiss(toastId)}>{message}</Toast>
        </li>)}
      </ol>
    </section>
  </ToasterContext.Provider>;
}
