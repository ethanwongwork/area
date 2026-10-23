/**
 * Pick a page colour (owner, 2026-10-22: "they pick the exact shade they want, or they even pick a color shade for the
 * surface"): the colour splits into OKLCH, and each part snaps to the setting that makes it, so the page is drawn by the
 * same settings anyone can set by hand. Lightness to the mode's nearest Ground, chroma to the nearest Tint strength, hue
 * to the nearest 5° (left alone for a gray, which has none). docs/research/custom-neutral-2026-10-22/.
 */
import { AXIS_PRESETS } from "@area/tokens/config";

/** A hex colour as OKLCH (Björn Ottosson's OKLab). */
export function oklchOf(hex: string): { L: number; C: number; h: number } {
  const n = parseInt(hex.replace("#", "").slice(0, 6), 16);
  const lin = (c: number) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const r = lin(n >> 16 & 255), g = lin(n >> 8 & 255), b = lin(n & 255);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L, C: Math.hypot(A, B), h: (Math.atan2(B, A) * 180 / Math.PI + 360) % 360 };
}

/** The tint steps' chroma (axes/tint.ts: 0.005 a step) and the grays' threshold: under it a colour has no hue to keep. */
const TINT_STEP = 0.005, GRAY = 0.002;
/** A dark ground's lightness: 8 is Area's near-black (L 0.0847), every other step its own percent (color/layers.ts). */
const groundL = (theme: "light" | "dark", step: number) => theme === "dark" && step === 8 ? 0.0847 : step / 100;

/** The settings that draw a page nearest this colour in this mode. */
export function snapPageColour(hex: string, theme: "light" | "dark"): { ground: string; tint: string; hue?: string } {
  const { L, C, h } = oklchOf(hex);
  const grounds = AXIS_PRESETS[`ground-${theme}`].map(Number);
  const ground = grounds.reduce((best, step) => Math.abs(groundL(theme, step) - L) < Math.abs(groundL(theme, best) - L) ? step : best);
  const tint = Math.min(8, Math.round(C / TINT_STEP));
  return { ground: String(ground), tint: String(tint), hue: C > GRAY ? String(Math.round(h / 5) * 5 % 360) : undefined };
}
