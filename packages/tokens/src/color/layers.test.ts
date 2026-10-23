/**
 * Layers (color/layers.ts): every combination of ground and layer contrast, in every neutral, keeps text readable and
 * keeps controls, selection and frames visible; the CSS that ships computes the same lightness as the model; and the
 * defaults reproduce Area's light theme as it was. docs/research/layers-2026-10-16/.
 */
import { describe, expect, it } from "vitest";
import {
  DARK_FILL_FLOOR, GROUND_DARK_STEPS, GROUND_LIGHT_STEPS, HUED_INKS, LAYER_STEPS, VIVID_ROLES, castOf, DEFAULT_FILL, FILL_STEPS, type FillSelection, groundLightness, layerHex, layerLightness, layerLightnessCss, layerTokens,
  DEFAULT_INK_TINT, INK_TINT_STEPS, TINT_HUES, TINT_STEP, TINT_STEPS, inkHex, CARD_TONE_STEPS, type CardTone,
} from "./layers.ts";
import { wcagContrastHex } from "./contrast.ts";
import { type Rgb, SRGB, clampRgb, oklabToRgb, parseHex, rgbToOklab, toHex } from "./oklab.ts";
import { CHROMATIC_SCALES, NEUTRAL_SCALES } from "./presets.ts";
import { resolveTheme, scaleFor } from "../semantic/resolve.ts";

const THEMES = ["light", "dark"] as const;
const groundsOf = (t: "light" | "dark") => t === "light" ? GROUND_LIGHT_STEPS : GROUND_DARK_STEPS;
/** The smallest steps Area ships today that read: light 0.012 (a sidebar's 50 to its hover 75), dark 0.04. */
const MIN = { light: { fill: 0.017, hover: 0.009, selected: 0.035, frame: 0.03 }, dark: { fill: 0.035, hover: 0.035, selected: 0.07, frame: 0.06 } };
const casts = NEUTRAL_SCALES.map(spec => ({ id: spec.id, cast: castOf(scaleFor(spec.id, "light").steps.find(s => s.level === 50)!.hex, scaleFor(spec.id, "dark").steps.find(s => s.level === 900)!.hex) }));

/** base.ts `bg-mark` composited over a ground: 6% black in light, 10% white in dark. */
function markOver(theme: "light" | "dark", hex: string, keep = theme === "light" ? 0.94 : 0.9): string {
  const over = (c: number) => theme === "light" ? c * keep : c * keep + (1 - keep);
  return toHex(parseHex(hex).map(over) as Rgb);
}
/** Mix toward black (d > 0) or white in OKLab, as CSS color-mix(in oklab, …) does. */
function mixOklab(hex: string, toward: "black" | "white", t: number): string {
  const { L, a, b } = rgbToOklab(parseHex(hex), SRGB), end = toward === "black" ? 0 : 1;
  return toHex(clampRgb(oklabToRgb({ L: L * (1 - t) + end * t, a: a * (1 - t), b: b * (1 - t) }, SRGB)));
}
/** A colour at alpha over an opaque ground, in sRGB, as the browser composites. */
function alphaOver(hex: string, alpha: number, ground: string): string {
  const f = parseHex(hex), g = parseHex(ground);
  return toHex(f.map((c, i) => c * alpha + g[i]! * (1 - alpha)) as Rgb);
}

/** Every check the gate runs, for one mode at one tint and one text share, over every ground and Layers step. */
function problemsFor(theme: "light" | "dark", cast: { chroma: number; hue: number }, share = DEFAULT_INK_TINT / 4, cardTone: CardTone = "auto"): string[] {
    const problems: string[] = [];
    for (const g of groundsOf(theme)) for (const n of LAYER_STEPS) {
      const m = layerLightness(theme, g, n, DEFAULT_FILL, cardTone), hx = (L: number) => layerHex(theme, L, cast), at = `${g}/${n}`;
      const ink = (L: number) => inkHex(theme, L, cast, share);
      const body = ink(m.ink.body), muted = ink(m.ink.muted), edge = hx(m.ink.edge), mm = MIN[theme];
      for (const [name, ground] of [["page", m.page], ["raised", m.raised], ["recessed", m.recessed], ["card", m.card], ["tile", m.tile]] as const) {
        const [rest, hover, selected] = m.fill[name];
        for (const [what, bg] of [[name, ground], [`${name} field`, rest], [`${name} hover`, hover], [`${name} selected`, selected]] as const)
          if (wcagContrastHex(muted, hx(bg)) < 4.5) problems.push(`${at}: muted on ${what}`);
        // Soft Badge and Count: muted on the soft-mark plate (base.ts bg-mark) laid over the ground.
        if (wcagContrastHex(muted, markOver(theme, hx(ground))) < 4.5) problems.push(`${at}: muted on a mark on ${name}`);
        // An interactive soft Badge under the pointer (bg-mark-hover, 10.7% black) on the page and on layers.
        if (theme === "light" && name !== "recessed" && name !== "tile" && wcagContrastHex(muted, markOver(theme, hx(ground), 0.893)) < 4.5) problems.push(`${at}: muted on a hovered mark on ${name}`);
        if (wcagContrastHex(body, hx(selected)) < 4.5) problems.push(`${at}: body on ${name} selected`);
        for (const bg of [ground, rest]) if (wcagContrastHex(edge, hx(bg)) < 3) problems.push(`${at}: control edge on ${name}`);
        if (Math.abs(rest - ground) < mm.fill) problems.push(`${at}: ${name} field`);
        if (Math.abs(hover - rest) < mm.hover) problems.push(`${at}: ${name} hover`);
        if (Math.abs(selected - ground) < mm.selected) problems.push(`${at}: ${name} selected`);
        if (theme === "dark" && rest < DARK_FILL_FLOOR - 1e-9) problems.push(`${at}: ${name} field under the dark floor`);
      }
      if (Math.abs(m.edge.card - m.page) < mm.frame) problems.push(`${at}: card frame`);
      if (Math.abs(m.edge.float - m.raised) < mm.frame) problems.push(`${at}: menu frame`);
    }
    return problems;
}

describe("layers: every combination is usable", () => {
  for (const theme of THEMES) for (const { id, cast } of casts) it(`${theme}, ${id}: text reads, controls and frames show`, () => {
    expect(problemsFor(theme, cast[theme])).toEqual([]);
  });
});

// Tint (axes/tint.ts, 2026-10-22): every hue in its 5° steps at every strength 1 to 8, at every Text tint share, in both
// modes, through every check above, at every ground and Layers step (docs/research/custom-neutral-2026-10-22/).
describe("layers: every tint is usable", () => {
  for (const theme of THEMES) it(`${theme}: every hue, strength and text share`, () => {
    const problems: string[] = [];
    for (const hue of TINT_HUES) for (const step of TINT_STEPS) for (const share of INK_TINT_STEPS) {
      if (step === 0) continue;
      const found = problemsFor(theme, { hue, chroma: step * TINT_STEP }, share / 4);
      if (found.length) problems.push(`hue ${hue}, tint ${step}, text ${share}: ${found[0]} (+${found.length - 1})`);
    }
    expect(problems).toEqual([]);
  });
  it("an untinted gray is unchanged by the text rule", () => {
    for (const share of INK_TINT_STEPS) expect(inkHex("light", 0.5, { hue: 0, chroma: 0 }, share / 4)).toBe(layerHex("light", 0.5, { hue: 0, chroma: 0 }));
  });
});

/** A small evaluator for the CSS math layers.ts writes: calc, min, max, clamp, pow and var() over the settings. */
function evaluate(expr: string, vars: Record<string, number>): number {
  const js = expr
    .replace(/var\(--area-([a-z0-9-]+)\)/g, (_, name) => { if (!(name in vars)) throw new Error(`unknown var ${name}`); return `(${vars[name]})`; })
    .replace(/\bcalc\(/g, "(").replace(/\bpow\(/g, "Math.pow(").replace(/\bmin\(/g, "Math.min(").replace(/\bmax\(/g, "Math.max(")
    .replace(/\bclamp\(/g, "((a,x,b)=>Math.min(b,Math.max(a,x)))(");
  return Function(`"use strict"; return (${js});`)() as number;
}
function cssLightness(theme: "light" | "dark", g: number, n: number, f: FillSelection = DEFAULT_FILL, tone: CardTone = "auto") {
  const auto = tone === "auto" ? 1 : 0, k = tone === "auto" ? 0 : tone;
  const css = layerLightnessCss(), vars: Record<string, number> = { "ground-light": theme === "light" ? groundLightness("light", g) : 1, "ground-dark": theme === "dark" ? groundLightness("dark", g) : 0, "layers-light": theme === "light" ? n : 8 - n, "layers-dark": theme === "dark" ? n : 8 - n, "fill-hover-step": f.hover, "fill-selected-step": f.selected,
    "card-tone-light-auto": theme === "light" ? auto : 1, "card-tone-light": theme === "light" ? k : 0, "card-tone-dark-auto": theme === "dark" ? auto : 1, "card-tone-dark": theme === "dark" ? k : 0 };
  // Resolve in dependency order: keep going until every helper is known.
  for (let pass = 0; pass < 6; pass++) for (const [k, e] of Object.entries(css)) if (!(k in vars)) { try { vars[k] = evaluate(e, vars); } catch { /* a later pass */ } }
  return vars;
}

// Every fill setting combination (axes/states.ts): hover 1–5 × selected 0–4, on every ground and Layers step.
const FILL_COMBOS: FillSelection[] = [];
for (let hover = FILL_STEPS.hover.min; hover <= FILL_STEPS.hover.max; hover++) for (let selected = FILL_STEPS.selected.min; selected <= FILL_STEPS.selected.max; selected++) FILL_COMBOS.push({ hover, selected });

// Card tone (axes/card-tone.ts, 2026-10-22): every step in both modes, through every check above, at every ground and
// Layers step; and with the tint at its extremes, so a darker or lighter card on a tinted ground still reads.
describe("layers: every card tone is usable", () => {
  for (const theme of THEMES) it(`${theme}: every step`, () => {
    const problems: string[] = [];
    for (const step of CARD_TONE_STEPS) for (const { id, cast } of casts) {
      const found = problemsFor(theme, cast[theme], DEFAULT_INK_TINT / 4, step);
      if (found.length) problems.push(`card ${step}, ${id}: ${found[0]} (+${found.length - 1})`);
    }
    for (const step of CARD_TONE_STEPS) for (const hue of TINT_HUES.filter(h => h % 30 === 0)) for (const tint of [4, 8]) for (const share of [0, 4]) {
      const found = problemsFor(theme, { hue, chroma: tint * TINT_STEP }, share / 4, step);
      if (found.length) problems.push(`card ${step}, hue ${hue}, tint ${tint}, text ${share}: ${found[0]} (+${found.length - 1})`);
    }
    expect(problems).toEqual([]);
  });
  it("Auto keeps each container's own tone", () => {
    for (const theme of THEMES) for (const g of groundsOf(theme)) for (const n of LAYER_STEPS) {
      const m = layerLightness(theme, g, n);
      expect(m.card).toBe(m.raised); expect(m.tile).toBe(m.recessed);
    }
  });
});

describe("layers: the shipped CSS computes what the model does", () => {
  for (const theme of THEMES) it(theme, () => {
    for (const tone of ["auto", ...CARD_TONE_STEPS] as CardTone[]) for (const f of tone === "auto" ? FILL_COMBOS : [DEFAULT_FILL]) for (const g of groundsOf(theme)) for (const n of LAYER_STEPS) {
      const m = layerLightness(theme, g, n, f, tone), c = cssLightness(theme, g, n, f, tone), p = `layer-${theme}-`;
      const pairs: Array<[string, number]> = [
        ["page", m.page], ["raised", m.raised], ["recessed", m.recessed], ["step", m.step],
        ["page-fill-0", m.fill.page[0]], ["page-fill-1", m.fill.page[1]], ["page-fill-2", m.fill.page[2]],
        ["raised-fill-0", m.fill.raised[0]], ["raised-fill-2", m.fill.raised[2]], ["recessed-fill-1", m.fill.recessed[1]],
        ["card", m.card], ["tile", m.tile], ["card-fill-0", m.fill.card[0]], ["card-fill-2", m.fill.card[2]], ["tile-fill-1", m.fill.tile[1]],
        ["body", m.ink.body], ["muted", m.ink.muted], ["edge", m.ink.edge],
        ...(theme === "light" ? [["vivid-darken", m.vividDarken], ["tonal-darken", m.tonalDarken]] as Array<[string, number]> : [["tint-lift", m.tintLift], ["tint-lift-fill", m.tintLiftFill]] as Array<[string, number]>),
      ];
      for (const [k, x] of pairs) expect(c[p + k], `${theme} ${g}/${n} fill ${f.hover}/${f.selected} card ${tone} ${k}`).toBeCloseTo(x, 6);
    }
  });
});

describe("layers: inks with a hue follow the ground", () => {
  // Every hued ink in every accent and neutral (accent's own inks change with it), darkened as the CSS does, on the page.
  const inks = { vivid: new Set<string>(), tonal: new Set<string>() };
  for (const neutral of NEUTRAL_SCALES) for (const accent of CHROMATIC_SCALES) {
    const t = resolveTheme({ theme: "light", neutral: neutral.id, accent: accent.id }).tokens;
    for (const { token, darken } of HUED_INKS) inks[darken].add(t[token]!);
  }
  it("light: vivid and tonal inks keep 4.5:1 on every page, and are unchanged on white", () => {
    const problems: string[] = [];
    for (const g of GROUND_LIGHT_STEPS) for (const n of LAYER_STEPS) {
      const m = layerLightness("light", g, n), page = layerHex("light", m.page, { chroma: 0, hue: 0 });
      if (g === 100 && (m.vividDarken !== 0 || m.tonalDarken !== 0)) problems.push(`${g}/${n}: darkens on white`);
      for (const [kind, d] of [["vivid", m.vividDarken], ["tonal", m.tonalDarken]] as const)
        for (const ink of inks[kind]) if (wcagContrastHex(mixOklab(ink, "black", d), page) < 4.5) problems.push(`${g}/${n}: ${kind} ${ink} on ${page}`);
    }
    expect(problems).toEqual([]);
  });
  // Tag's dark inks (tag.css: the vivid rungs, gray, and its green and yellow literals) over a 16% wash of themselves.
  const tagInks = [...VIVID_ROLES.filter(r => r !== "accent" && r !== "caution" && r !== "success").map(r => resolveTheme({ theme: "dark", neutral: "neutral", accent: "blue" }).tokens[`fg-${r}-vivid`]!), resolveTheme({ theme: "dark", neutral: "neutral", accent: "blue" }).tokens["fg-gray"]!, "#85ce94", "#e2b968"];
  it("dark: tinted labels keep 4.5:1 on their plate on every raised layer, field and hovered row", () => {
    const problems: string[] = [];
    for (const g of GROUND_DARK_STEPS) for (const n of LAYER_STEPS) {
      const m = layerLightness("dark", g, n);
      for (const [ground, lift] of [[m.page, m.tintLift], [m.raised, m.tintLift], [m.fill.raised[0], m.tintLiftFill], [m.fill.raised[1], m.tintLiftFill]] as const) {
        const bg = layerHex("dark", ground, { chroma: 0, hue: 0 });
        for (const ink of tagInks) if (wcagContrastHex(mixOklab(ink, "white", lift), alphaOver(ink, 0.16, bg)) < 4.5) problems.push(`${g}/${n}: ${ink} on ${bg}`);
      }
    }
    expect(problems).toEqual([]);
  });
});

describe("layers: the defaults are Area as it was", () => {
  it("light 100 + 4 reproduces the light theme", () => {
    const t = layerTokens("light", { groundLight: 100, groundDark: 8, layersLight: 4, layersDark: 4 }, { chroma: 0, hue: 0 });
    expect(t).toMatchObject({
      "bg-page": "#ffffff", "bg-surface": "#ffffff", "bg-subtle": "#f7f7f7", "bg-stripe": "#fafafa", "bg-code": "#ffffff",
      "bg-component": "#f7f7f7", "bg-component-hover": "#f3f3f3", "bg-component-active": "#eeeeee",
      "fg-default": "#282828", "fg-muted": "#666666", "fg-placeholder": "#666666",
      "border-decorative": "#f3f3f3", "border-card": "#eeeeee", "border-float": "#eeeeee", "border-faint": "#e2e2e2", "border-divider": "#e2e2e2",
      "border-subtle": "#d4d4d4", "border": "#c5c5c5", "border-hover": "#b4b4b4", "stroke-control": "#838383", "stroke-control-hover": "#747474",
    });
  });
  it("dark 8 + 4 keeps the near-black page and today's inks", () => {
    const t = layerTokens("dark", { groundLight: 100, groundDark: 8, layersLight: 4, layersDark: 4 }, { chroma: 0, hue: 0 });
    expect(t).toMatchObject({ "bg-page": "#020202", "fg-default": "#eeeeee", "fg-muted": "#c5c5c5", "stroke-control": "#939393", "stroke-control-hover": "#a4a4a4", "border-decorative": "#282828", "border-card": "#333333", "border-float": "#4b4b4b" });
  });
});

describe("layers: the state fills keep their order and read apart at every setting", () => {
  for (const theme of THEMES) it(theme, () => {
    const problems: string[] = [];
    for (const f of FILL_COMBOS) for (const g of groundsOf(theme)) for (const n of LAYER_STEPS) {
      const m = layerLightness(theme, g, n, f);
      for (const ground of ["page", "raised", "recessed"] as const) {
        const [rest, hover, selected] = m.fill[ground], sign = theme === "light" ? -1 : 1;
        // hover moves away from rest, selected never back past hover (equal only at Selected fill 0)
        if (sign * (hover - rest) < -1e-9) problems.push(`${theme} ${g}/${n} ${f.hover}/${f.selected} ${ground}: hover behind rest`);
        if (sign * (selected - hover) < -1e-9) problems.push(`${theme} ${g}/${n} ${f.hover}/${f.selected} ${ground}: selected behind hover`);
        if (f.selected > 0 && Math.abs(selected - hover) < 0.008) problems.push(`${theme} ${g}/${n} ${f.hover}/${f.selected} ${ground}: selected reads as hover (${(selected - hover).toFixed(4)})`);
      }
    }
    expect(problems).toEqual([]);
  });
});
