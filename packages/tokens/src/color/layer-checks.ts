/**
 * The Layers gate's checks, shared by the tests that walk the settings (layers.test.ts) and the picked page colours
 * (colours.test.ts). Test code only: nothing ships from here.
 */
import { DARK_FILL_FLOOR, DEFAULT_FILL, DEFAULT_INK_TINT, GROUND_DARK_STEPS, GROUND_LIGHT_STEPS, LAYER_STEPS, castOf, groundLightness, inkHex, layerHex, layerLightnessAt, layerLightnessCss, type CardTone, type Cast, type FillSelection } from "./layers.ts";
import { relativeLuminance } from "./contrast.ts";
import { type Rgb, SRGB, clampRgb, oklabToRgb, parseHex, rgbToOklab, toHex } from "./oklab.ts";
import { NEUTRAL_SCALES } from "./presets.ts";
import { scaleFor } from "../semantic/resolve.ts";

export const THEMES = ["light", "dark"] as const;
export const groundsOf = (t: "light" | "dark") => t === "light" ? GROUND_LIGHT_STEPS : GROUND_DARK_STEPS;
/** The smallest steps Area ships today that read: light 0.012 (a sidebar's 50 to its hover 75), dark 0.04. */
export const MIN = { light: { fill: 0.017, hover: 0.009, selected: 0.035, frame: 0.03 }, dark: { fill: 0.035, hover: 0.035, selected: 0.07, frame: 0.06 } };
export const casts = NEUTRAL_SCALES.map(spec => ({ id: spec.id, cast: castOf(scaleFor(spec.id, "light").steps.find(s => s.level === 50)!.hex, scaleFor(spec.id, "dark").steps.find(s => s.level === 900)!.hex) }));

/** base.ts `bg-mark` composited over a ground: 6% black in light, 10% white in dark. */
export function markOver(theme: "light" | "dark", hex: string, keep = theme === "light" ? 0.94 : 0.9): string {
  const over = (c: number) => theme === "light" ? c * keep : c * keep + (1 - keep);
  return toHex(parseHex(hex).map(over) as Rgb);
}
/** Mix toward black (d > 0) or white in OKLab, as CSS color-mix(in oklab, …) does. */
export function mixOklab(hex: string, toward: "black" | "white", t: number): string {
  const { L, a, b } = rgbToOklab(parseHex(hex), SRGB), end = toward === "black" ? 0 : 1;
  return toHex(clampRgb(oklabToRgb({ L: L * (1 - t) + end * t, a: a * (1 - t), b: b * (1 - t) }, SRGB)));
}
/** A colour at alpha over an opaque ground, in sRGB, as the browser composites. */
export function alphaOver(hex: string, alpha: number, ground: string): string {
  const f = parseHex(hex), g = parseHex(ground);
  return toHex(f.map((c, i) => c * alpha + g[i]! * (1 - alpha)) as Rgb);
}

/** The whole-step grounds of a mode, as lightness. */
export const groundLightnesses = (theme: "light" | "dark") => groundsOf(theme).map(step => groundLightness(theme, step));

/** WCAG contrast of two hexes, each hex's luminance worked out once: the grids compare the same few hundred greys millions
 * of times. */
const LUMINANCE = new Map<string, number>();
const luminance = (hex: string) => { let y = LUMINANCE.get(hex); if (y === undefined) { y = relativeLuminance(parseHex(hex)); if (LUMINANCE.size > 2e6) LUMINANCE.clear(); LUMINANCE.set(hex, y); } return y; };
export const contrast = (a: string, b: string) => { const x = luminance(a), y = luminance(b); return x > y ? (x + 0.05) / (y + 0.05) : (y + 0.05) / (x + 0.05); };

/** Every check the gate runs, for one mode at one tint and one text share (or several), over every ground and Layers step
 * (or the Layers values and page lightnesses given). */
export function problemsFor(theme: "light" | "dark", cast: Cast, share: number | readonly number[] = DEFAULT_INK_TINT / 4, cardTone: CardTone = "auto", layers: readonly number[] = LAYER_STEPS, fills: FillSelection = DEFAULT_FILL, grounds: readonly number[] = groundLightnesses(theme)): string[] {
    const problems: string[] = [], shares = typeof share === "number" ? [share] : share;
    for (const g of grounds) for (const n of layers) {
      const m = layerLightnessAt(theme, g, n, fills, cardTone), at = `${Number((g * 100).toFixed(2))}/${n}`;
      const memo = new Map<number, string>(), hx = (L: number) => { let x = memo.get(L); if (x === undefined) memo.set(L, x = layerHex(theme, L, cast)); return x; };
      const edge = hx(m.ink.edge), mm = MIN[theme];
      for (const [name, ground] of [["page", m.page], ["raised", m.raised], ["recessed", m.recessed], ["card", m.card], ["tile", m.tile], ["well", m.well], ["float", m.float]] as const) {
        const [rest, hover, selected] = m.fill[name];
        for (const t of shares) {
          const ink = (L: number) => inkHex(theme, L, cast, t), body = ink(m.ink.body), muted = ink(m.ink.muted), text = shares.length > 1 ? `, text ${t}` : "";
          for (const [what, bg] of [[name, ground], [`${name} field`, rest], [`${name} hover`, hover], [`${name} selected`, selected]] as const)
            if (contrast(muted, hx(bg)) < 4.5) problems.push(`${at}: muted on ${what}${text}`);
          // The subtle ink (meta, placeholders): text on each ground, its field and its hover fill, never a selected plate.
          const subtle = ink(m.ink.subtle);
          for (const [what, bg] of [[name, ground], [`${name} field`, rest], [`${name} hover`, hover]] as const)
            if (contrast(subtle, hx(bg)) < 4.5) problems.push(`${at}: subtle on ${what}${text}`);
          // Soft Badge and Count: muted on the soft-mark plate (base.ts bg-mark) laid over the ground.
          if (contrast(muted, markOver(theme, hx(ground))) < 4.5) problems.push(`${at}: muted on a mark on ${name}${text}`);
          // An interactive soft Badge under the pointer (bg-mark-hover, 10.7% black) on the page and on layers.
          if (theme === "light" && name !== "recessed" && name !== "tile" && name !== "well" && contrast(muted, markOver(theme, hx(ground), 0.893)) < 4.5) problems.push(`${at}: muted on a hovered mark on ${name}${text}`);
          if (contrast(body, hx(selected)) < 4.5) problems.push(`${at}: body on ${name} selected${text}`);
        }
        for (const bg of [ground, rest]) if (contrast(edge, hx(bg)) < 3) problems.push(`${at}: control edge on ${name}`);
        if (Math.abs(rest - ground) < mm.fill) problems.push(`${at}: ${name} field`);
        // The smallest steps a state shows are the defaults' (the fill settings choose fainter or firmer plates on purpose;
        // their order and reading apart are "the state fills keep their order").
        if (fills === DEFAULT_FILL && Math.abs(hover - rest) < mm.hover) problems.push(`${at}: ${name} hover`);
        if (fills === DEFAULT_FILL && Math.abs(selected - ground) < mm.selected) problems.push(`${at}: ${name} selected`);
        if (theme === "dark" && rest < DARK_FILL_FLOOR - 1e-9) problems.push(`${at}: ${name} field under the dark floor`);
      }
      if (Math.abs(m.edge.card - m.page) < mm.frame) problems.push(`${at}: card frame`);
      if (Math.abs(m.edge.float - m.raised) < mm.frame) problems.push(`${at}: menu frame`);
    }
    return problems;
}

/** A small evaluator for the CSS math layers.ts writes: calc, min, max, clamp, pow and var() over the settings. */
export function evaluate(expr: string, vars: Record<string, number>): number {
  const js = expr
    .replace(/var\(--area-([a-z0-9-]+), ([0-9.]+)\)/g, (_, name, fallback) => `(${name in vars ? vars[name] : fallback})`)
    .replace(/var\(--area-([a-z0-9-]+)\)/g, (_, name) => { if (!(name in vars)) throw new Error(`unknown var ${name}`); return `(${vars[name]})`; })
    .replace(/\bround\(up, /g, "((x,s)=>Math.ceil(x/s)*s)(")
    .replace(/\bcalc\(/g, "(").replace(/\bpow\(/g, "Math.pow(").replace(/\bmin\(/g, "Math.min(").replace(/\bmax\(/g, "Math.max(")
    .replace(/\bclamp\(/g, "((a,x,b)=>Math.min(b,Math.max(a,x)))(");
  return Function(`"use strict"; return (${js});`)() as number;
}
/** Resolve a set of CSS formulas over the given inputs, in dependency order. */
export function resolveCss(css: Record<string, string>, vars: Record<string, number>): Record<string, number> {
  for (let pass = 0; pass < 8; pass++) for (const [k, e] of Object.entries(css)) if (!(k in vars)) { try { vars[k] = evaluate(e, vars); } catch { /* a later pass */ } }
  return vars;
}
/** The shipped lightness CSS resolved for one mode on a page of lightness `g`. */
export function cssLightnessAt(theme: "light" | "dark", g: number, n: number, f: FillSelection = DEFAULT_FILL, tone: CardTone = "auto") {
  const auto = tone === "auto" ? 1 : 0, k = tone === "auto" ? 0 : tone;
  return resolveCss(layerLightnessCss(), { "cast-chroma-light": 0, "ground-light": theme === "light" ? g : 1, "ground-dark": theme === "dark" ? g : 0, "layers-light": theme === "light" ? n : 8 - n, "layers-dark": theme === "dark" ? n : 8 - n, "fill-hover-step": f.hover, "fill-selected-step": f.selected,
    "card-tone-light-auto": theme === "light" ? auto : 1, "card-tone-light": theme === "light" ? k : 0, "card-tone-dark-auto": theme === "dark" ? auto : 1, "card-tone-dark": theme === "dark" ? k : 0 });
}
/** The same at a whole ground step. */
export const cssLightness = (theme: "light" | "dark", step: number, n: number, f: FillSelection = DEFAULT_FILL, tone: CardTone = "auto") => cssLightnessAt(theme, groundLightness(theme, step), n, f, tone);
