import { useEffect, useState } from "react";
/* --- Skeleton, Spinner, Progress ------------------------------------------ */

/**
 * How long a loading mark waits before it shows, so a quick load shows nothing: `short` 300 ms, `long` (or `true`)
 * 1000 ms, or any number of milliseconds. Omitted or `false`, it shows at once.
 */
export type LoadingDelay = boolean | "short" | "long" | number;
/* spec: docs/research/components-audit-2026-11-07/primer.md, Spinner `delay` (src/Spinner/Spinner.tsx:27-28). */
export const LOADING_DELAY = { short: 300, long: 1000 } as const;
const loadingDelayMs = (delay: LoadingDelay | undefined) =>
  delay === undefined || delay === false ? 0 : delay === true ? LOADING_DELAY.long
    : typeof delay === "number" ? Math.max(0, delay) : LOADING_DELAY[delay];

/**
 * False until the delay has passed. The server and the client's first render both say false, so a delayed mark
 * hydrates as it was rendered (waiting) and the timer starts only in the browser.
 */
export function useLoadingDelay(delay: LoadingDelay | undefined): boolean {
  const ms = loadingDelayMs(delay);
  const [shown, setShown] = useState(ms === 0);
  useEffect(() => {
    if (ms === 0) { setShown(true); return; }
    setShown(false);
    const timer = setTimeout(() => setShown(true), ms);
    return () => clearTimeout(timer);
  }, [ms]);
  return shown;
}

