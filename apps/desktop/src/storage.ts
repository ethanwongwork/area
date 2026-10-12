/**
 * Per-viewer conveniences (tab, theme, panel widths, canvas settings) in localStorage. Every read
 * falls back to its default and every write may fail silently: the app renders without them.
 */
const KEY = "area-desktop";

export function readStored<T>(name: string, fallback: T): T {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, unknown>;
    return name in all ? (all[name] as T) : fallback;
  } catch { return fallback; }
}

export function writeStored(name: string, value: unknown) {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, unknown>;
    localStorage.setItem(KEY, JSON.stringify({ ...all, [name]: value }));
  } catch {}
}
