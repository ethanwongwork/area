/**
 * Pick a page colour (owner, 2026-10-22: "they pick the exact shade they want, or they even pick a color shade for the
 * surface"): the colour splits into OKLCH, and each part snaps to the setting that makes it, so the page is drawn by the
 * same settings anyone can set by hand. Lightness to the mode's nearest Ground, chroma to the nearest Tint strength, hue
 * to the nearest 5° (left alone for a gray, which has none). docs/research/custom-neutral-2026-10-22/.
 */
import { AXIS_PRESETS } from "@area/tokens/config";
import TOKENS from "@area/tokens/tokens.json";

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
  // The strongest Tint the registry offers (16 since 2026-10-23), read from it so the field reaches every step.
  const strongest = Math.max(...AXIS_PRESETS[`tint-${theme}`].map(Number).filter(Number.isFinite));
  const tint = Math.min(strongest, Math.round(C / TINT_STEP));
  return { ground: String(ground), tint: String(tint), hue: C > GRAY ? String(Math.round(h / 5) * 5 % 360) : undefined };
}

/*
 * Pick an accent colour (owner, 2026-10-23: "a darker navy color as the button color ... a specific hue and chroma that the
 * current palette doesnt have"): the accent, Accent strength and Light solid that paint the nearest solid fill, so a
 * picked colour is drawn by the same settings anyone can set by hand (docs/research/palette-customization-2026-10-23).
 * The search runs over every accent the registry has (the palette's eleven and the 72 hues), every strength and every
 * Solid step, comparing in OKLab what each would paint (@area/tokens color/generate.ts withStrength, restated here).
 */
type Lab = [number, number, number];
const linear = (c: number) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const rgbOf = (hex: string) => { const n = parseInt(hex.replace("#", "").slice(0, 6), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255].map(c => c / 255) as Lab; };
function labOfLinear([r, g, b]: Lab): Lab {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
const labOf = (hex: string) => labOfLinear(rgbOf(hex).map(linear) as Lab);
/** What a colour paints at a strength: mixed in OKLab toward the gray of its own luminance (WCAG weights). */
function labAtStrength(hex: string, strength: number): Lab {
  const lin = rgbOf(hex).map(linear) as Lab, Y = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  const a = labOfLinear(lin), g = labOfLinear([Y, Y, Y]), t = strength / 100;
  return [a[0] * t + g[0] * (1 - t), a[1] * t + g[1] * (1 - t), a[2] * t + g[2] * (1 - t)];
}

type Preset = { id: string; tokens: Record<string, string> };
const presetsOf = (id: string) => ((TOKENS.axes as unknown as Array<{ id: string; presets: Preset[] }>).find(axis => axis.id === id)?.presets ?? []);

/** The settings that paint the nearest accent solid to this colour in light, and how far it is (ΔE in OKLab). */
export function snapAccentColour(hex: string): { accent: string; strength: string; solid: string; distance: number } {
  const target = labOf(hex);
  const strengths = presetsOf("accent-strength").map(preset => Number(preset.id));
  const steps = presetsOf("solid-light").map(preset => preset.id).filter(id => id !== "auto");
  let best = { accent: "blue", strength: "100", solid: "auto", distance: Infinity };
  for (const preset of presetsOf("accent")) {
    const auto = preset.tokens["--area-accent-solid-full"]!;
    for (const step of steps) {
      const fill = preset.tokens[`--area-accent-solid-${step}-full`]!;
      for (const strength of strengths) {
        const [L, a, b] = labAtStrength(fill, strength);
        const distance = Math.hypot(L - target[0], a - target[1], b - target[2]);
        if (distance < best.distance) best = { accent: preset.id, strength: String(strength), solid: fill === auto ? "auto" : step, distance };
      }
    }
  }
  return { ...best, distance: Number(best.distance.toFixed(3)) };
}

/** OKLab back to an sRGB hex, clamped. */
function hexOfLab([L, a, b]: Lab): string {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  const encode = (c: number) => { const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.max(0, c) ** (1 / 2.4) - 0.055; return Math.round(Math.min(1, Math.max(0, v)) * 255); };
  return `#${lin.map(c => encode(c).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/** The accent's solid as the settings paint it in light: its Light solid step at its Accent strength. */
export function accentSolidHex(accent: string, strength: string, solid: string): string {
  const tokens = presetsOf("accent").find(preset => preset.id === accent)?.tokens;
  const fill = tokens?.[solid === "auto" ? "--area-accent-solid-full" : `--area-accent-solid-${solid}-full`];
  return fill ? hexOfLab(labAtStrength(fill, Number(strength))) : "#000000";
}
