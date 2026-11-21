/**
 * The geometry group swept as one product (plan A1, A3; docs/research/system-status-2026-11-18/README.md): every
 * setting that changes a length, crossed together, where density.test.ts and radius.test.ts check type 13 and a few
 * fixed heights. Test code only.
 *
 *   Type (5) × Density (3) × Corner (9) × Stroke width (6) × Focus ring (5) × Selected stroke (3) × Contrast (0, ½, 1)
 *
 * Each combination resolves emit/base.ts `derivedTokens()` over the presets' leaves as the browser does (var() with its
 * fallback, calc, min, max, clamp, round), at the Mac's 2× device pixel. The evaluator compiles each expression once and
 * memoises per combination, so the 36,450 combinations take a few seconds rather than the audit's 75.
 */
import { AXES, axisById } from "../axes/registry.ts";
import { baseTokens, derivedTokens } from "../emit/base.ts";
import type { Combo, Failure } from "./ratchet.ts";

type Fn = (g: (name: string, fallback?: number) => number, R: (mode: string, x: number, step?: number) => number, C: (lo: number, x: number, hi: number) => number) => number;

class NotALength extends Error {}
const NOT_A_LENGTH = new NotALength();

const compiled = new Map<string, Fn | null>();
/** One CSS value as a function of its var()s, or null where it is not a length or a number (a colour, a font, a %). */
function compile(raw: string): Fn | null {
  if (compiled.has(raw)) return compiled.get(raw)!;
  let js = raw.trim();
  // var() from the innermost out: a numeric fallback is passed, any other fallback dropped.
  for (let guard = 0; /var\(/.test(js) && guard < 50; guard++) {
    js = js.replace(/var\((--area-[\w-]+)(?:,\s*([^()]*))?\)/g, (_, name: string, fallback?: string) => {
      const fb = fallback?.trim();
      return fb !== undefined && /^-?[\d.]+(px)?$/.test(fb) ? `g("${name}",${parseFloat(fb)})` : `g("${name}")`;
    });
  }
  js = js.replace(/(-?\d*\.?\d+)px\b/g, "$1")
    .replace(/round\((nearest|up|down|to-zero),/g, (_, mode: string) => `R("${mode}",`).replace(/\bround\(/g, `R("nearest",`)
    .replace(/\bcalc\(/g, "(").replace(/\b(max|min)\(/g, "Math.$1(").replace(/\bclamp\(/g, "C(");
  const rest = js.replace(/g\("--area-[\w-]+"(,-?[\d.]+)?\)|R\("(nearest|up|down|to-zero)"|Math\.(max|min)|\bC\(/g, "");
  const fn = /[a-zA-Z#%"']/.test(rest) ? null : (new Function("g", "R", "C", `return (${js});`) as Fn);
  compiled.set(raw, fn);
  return fn;
}

const R = (mode: string, x: number, step = 1) => (mode === "up" ? Math.ceil(x / step - 1e-9) : mode === "down" ? Math.floor(x / step + 1e-9) : mode === "to-zero" ? Math.trunc(x / step) : Math.round(x / step)) * step;
const C = (lo: number, x: number, hi: number) => Math.min(Math.max(lo, x), hi);

const DERIVED = derivedTokens();
const BASE = baseTokens();
const DEFAULTS: Record<string, string> = {};
for (const axis of AXES) Object.assign(DEFAULTS, axis.presets.find(p => p.id === axis.defaultPreset)!.tokens);

/** A resolver for one combination's leaves: `n("--area-x")` is its value in px (or a plain number), or null. */
export function resolverFor(leaves: Record<string, string>): (name: string) => number | null {
  const memo = new Map<string, number | null>();
  const g = (name: string, fallback?: number): number => {
    const v = evaluate(name);
    if (v === null) { if (fallback !== undefined) return fallback; throw NOT_A_LENGTH; }
    return v;
  };
  const evaluate = (name: string): number | null => {
    if (memo.has(name)) return memo.get(name)!;
    memo.set(name, null); // a cycle reads as not a length
    const raw = leaves[name] ?? DERIVED[name] ?? BASE[name];
    let value: number | null = null;
    if (raw !== undefined) {
      const fn = compile(raw);
      if (fn) try { value = Number(fn(g, R, C)); } catch (e) { if (e !== NOT_A_LENGTH) throw e; }
    }
    memo.set(name, value);
    return value;
  };
  return evaluate;
}

const presets = (id: string) => axisById(id)!.presets as ReadonlyArray<{ id: string; tokens: Record<string, string> }>;
export const GEOMETRY_AXES = { type: "type", density: "density", radius: "radius", surface: "surface", focus: "focus-ring", selected: "selected-stroke" } as const;
export const CONTRAST_LEVELS = [0, 0.5, 1] as const;
export const TIERS = ["xs", "sm", "md", "lg", "xl"] as const;
/** The 2× device pixel (emit/css.ts), where Hairline is half a CSS pixel. */
const DEVICE_PIXEL = "0.5px";

/** The derived tokens that are numbers at the defaults: each has to stay a finite number at every combination. */
export const NUMERIC_TOKENS: readonly string[] = (() => {
  const n = resolverFor({ ...DEFAULTS, "--area-device-pixel": DEVICE_PIXEL });
  return Object.keys(DERIVED).filter(name => n(name) !== null);
})();

export interface GeometrySweep { failures: Failure[]; combos: number; evaluations: number }

/** Every combination's failures. */
export function runGeometrySweep(): GeometrySweep {
  const failures: Failure[] = [];
  let combos = 0, evaluations = 0;
  for (const t of presets("type")) for (const d of presets("density")) for (const r of presets("radius")) for (const s of presets("surface"))
  for (const f of presets("focus-ring")) for (const sel of presets("selected-stroke")) for (const contrast of CONTRAST_LEVELS) {
    combos++;
    const combo: Combo = { type: t.id, density: d.id, radius: r.id, surface: s.id, focus: f.id, selected: sel.id, contrast };
    const n = resolverFor({ ...DEFAULTS, ...t.tokens, ...d.tokens, ...r.tokens, ...s.tokens, ...f.tokens, ...sel.tokens, "--area-contrast-more": String(contrast), "--area-device-pixel": DEVICE_PIXEL });
    const px = (k: string) => n(`--area-${k}`)!;
    const fail = (rule: string, value: number, floor: number, detail?: string) => failures.push({ rule, combo, value, floor, detail });

    for (const name of NUMERIC_TOKENS) {
      const v = n(name); evaluations++;
      if (v === null || !Number.isFinite(v)) fail("every length resolves to a finite number", Number.NaN, 0, `${name} = ${v}`);
    }

    const h = Object.fromEntries(TIERS.map(x => [x, px(`control-${x}`)])) as Record<(typeof TIERS)[number], number>;
    const row = px("ui-row");
    for (const x of TIERS) {
      const corner = px(`radius-control-${x}`);
      if (corner > h[x] / 2 + 1e-9) fail("corner at most half the height", h[x] / 2 - corner, 0, `control-${x} ${h[x]}, corner ${corner}`);
      if (!Number.isInteger(h[x])) fail("control heights on whole pixels", h[x], 0, `control-${x}`);
      // Pill promises half the height (README finding 6: the corner rounds down to even pixels).
      if (r.id === "pill" && corner < h[x] / 2 - 1e-9) fail("Pill is half the height", corner - h[x] / 2, 0, `control-${x} ${h[x]}, corner ${corner}`);
    }
    for (const [name, corner] of [["radius-row", px("radius-row")], ["radius-list-row", px("radius-list-row")]] as const)
      if (corner > row / 2 + 1e-9) fail("corner at most half the height", row / 2 - corner, 0, `${name} ${corner} on a ${row} row`);
    // WCAG 2.2 SC 2.5.8 (24 × 24) for every control from sm up; xs keeps the floor its own derivation declares (20).
    for (const x of ["sm", "md", "lg", "xl"] as const) if (h[x] < 24) fail("targets at least 24px", h[x], 24, `control-${x}`);
    if (h.xs < 20) fail("xs at least its 20px floor", h.xs, 20);
    for (let i = 1; i < TIERS.length; i++) {
      const lower = h[TIERS[i - 1]!], upper = h[TIERS[i]!];
      if (upper < lower) fail("control ladder never decreases", upper - lower, 0, TIERS.map(x => h[x]).join("/"));
      // README finding 5: at type 12 Compact sm and md are one height. A decision, held in known-failures.ts.
      if (upper <= lower) fail("control ladder strictly increases", upper - lower, 1, TIERS.map(x => h[x]).join("/"));
      if (px(`radius-control-${TIERS[i]}`) < px(`radius-control-${TIERS[i - 1]}`)) fail("corner ladder never decreases", 0, 0, TIERS.map(x => px(`radius-control-${x}`)).join("/"));
    }
    if (r.id === "0" && ["radius-control-md", "radius-row", "radius-list-row", "radius-list", "radius-container"].some(k => px(k) !== 0)) fail("Sharp is square", 1, 0);
    // Focus geometry draws on whole pixels: the ring, its offsets and a field's ring and halo.
    for (const k of ["focus-width", "focus-offset", "focus-solid-offset", "field-focus-outline-width", "field-focus-halo-width"]) {
      const v = px(k);
      if (Math.abs(v - Math.round(v)) > 1e-9) fail("focus on whole pixels", v, 0, k);
    }
    if (px("focus-width") <= 0) fail("a focus ring is drawn", px("focus-width"), 1);
    if (contrast >= 1 && px("focus-width") < 3) fail("Contrast More draws a 3px ring", px("focus-width"), 3);
    if (contrast > 0 && px("border-width") < 1) fail("raised Contrast draws frames at 1px or more", px("border-width"), 1);
  }
  return { failures, combos, evaluations };
}
