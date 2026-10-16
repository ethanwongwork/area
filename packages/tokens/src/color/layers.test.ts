/**
 * Layers (color/layers.ts): every combination of ground and layer contrast, in every neutral, keeps text readable and
 * keeps controls, selection and frames visible; the CSS that ships computes the same lightness as the model; and the
 * defaults reproduce Area's light theme as it was. docs/research/layers-2026-10-16/.
 */
import { describe, expect, it } from "vitest";
import {
  DARK_FILL_FLOOR, GROUND_DARK_STEPS, GROUND_LIGHT_STEPS, LAYER_STEPS, castOf, groundLightness, layerHex, layerLightness, layerLightnessCss, layerTokens,
} from "./layers.ts";
import { wcagContrastHex } from "./contrast.ts";
import { NEUTRAL_SCALES } from "./presets.ts";
import { scaleFor } from "../semantic/resolve.ts";

const THEMES = ["light", "dark"] as const;
const groundsOf = (t: "light" | "dark") => t === "light" ? GROUND_LIGHT_STEPS : GROUND_DARK_STEPS;
/** The smallest steps Area ships today that read: light 0.012 (a sidebar's 50 to its hover 75), dark 0.04. */
const MIN = { light: { fill: 0.017, hover: 0.009, selected: 0.035, frame: 0.03 }, dark: { fill: 0.035, hover: 0.035, selected: 0.07, frame: 0.06 } };
const casts = NEUTRAL_SCALES.map(spec => ({ id: spec.id, cast: castOf(scaleFor(spec.id, "light").steps.find(s => s.level === 50)!.hex, scaleFor(spec.id, "dark").steps.find(s => s.level === 900)!.hex) }));

describe("layers: every combination is usable", () => {
  for (const theme of THEMES) for (const { id, cast } of casts) it(`${theme}, ${id}: text reads, controls and frames show`, () => {
    const problems: string[] = [];
    for (const g of groundsOf(theme)) for (const n of LAYER_STEPS) {
      const m = layerLightness(theme, g, n), hx = (L: number) => layerHex(theme, L, cast[theme]), at = `${g}/${n}`;
      const body = hx(m.ink.body), muted = hx(m.ink.muted), edge = hx(m.ink.edge), mm = MIN[theme];
      for (const [name, ground] of [["page", m.page], ["raised", m.raised], ["recessed", m.recessed]] as const) {
        const [rest, hover, selected] = m.fill[name];
        for (const [what, bg] of [[name, ground], [`${name} field`, rest], [`${name} hover`, hover]] as const)
          if (wcagContrastHex(muted, hx(bg)) < 4.5) problems.push(`${at}: muted on ${what}`);
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
    expect(problems).toEqual([]);
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
function cssLightness(theme: "light" | "dark", g: number, n: number) {
  const css = layerLightnessCss(), vars: Record<string, number> = { "ground-light": theme === "light" ? groundLightness("light", g) : 1, "ground-dark": theme === "dark" ? groundLightness("dark", g) : 0, layers: n };
  // Resolve in dependency order: keep going until every helper is known.
  for (let pass = 0; pass < 6; pass++) for (const [k, e] of Object.entries(css)) if (!(k in vars)) { try { vars[k] = evaluate(e, vars); } catch { /* a later pass */ } }
  return vars;
}

describe("layers: the shipped CSS computes what the model does", () => {
  for (const theme of THEMES) it(theme, () => {
    for (const g of groundsOf(theme)) for (const n of LAYER_STEPS) {
      const m = layerLightness(theme, g, n), c = cssLightness(theme, g, n), p = `layer-${theme}-`;
      const pairs: Array<[string, number]> = [
        ["page", m.page], ["raised", m.raised], ["recessed", m.recessed], ["step", m.step],
        ["page-fill-0", m.fill.page[0]], ["page-fill-1", m.fill.page[1]], ["page-fill-2", m.fill.page[2]],
        ["raised-fill-0", m.fill.raised[0]], ["raised-fill-2", m.fill.raised[2]], ["recessed-fill-1", m.fill.recessed[1]],
        ["body", m.ink.body], ["muted", m.ink.muted], ["edge", m.ink.edge],
      ];
      for (const [k, x] of pairs) expect(c[p + k], `${theme} ${g}/${n} ${k}`).toBeCloseTo(x, 6);
    }
  });
});

describe("layers: the defaults are Area as it was", () => {
  it("light 100 + 4 reproduces the light theme", () => {
    const t = layerTokens("light", { groundLight: 100, groundDark: 8, layers: 4 }, { chroma: 0, hue: 0 });
    expect(t).toMatchObject({
      "bg-page": "#ffffff", "bg-surface": "#ffffff", "bg-subtle": "#f7f7f7", "bg-stripe": "#fafafa", "bg-code": "#ffffff",
      "bg-component": "#f7f7f7", "bg-component-hover": "#f3f3f3", "bg-component-active": "#eeeeee",
      "fg-default": "#282828", "fg-muted": "#666666", "fg-placeholder": "#666666",
      "border-decorative": "#f3f3f3", "border-card": "#eeeeee", "border-float": "#eeeeee", "border-faint": "#e2e2e2", "border-divider": "#e2e2e2",
      "border-subtle": "#d4d4d4", "border": "#c5c5c5", "border-hover": "#b4b4b4", "stroke-control": "#838383", "stroke-control-hover": "#747474",
    });
  });
  it("dark 8 + 4 keeps the near-black page and today's inks", () => {
    const t = layerTokens("dark", { groundLight: 100, groundDark: 8, layers: 4 }, { chroma: 0, hue: 0 });
    expect(t).toMatchObject({ "bg-page": "#020202", "fg-default": "#eeeeee", "fg-muted": "#c5c5c5", "stroke-control": "#939393", "stroke-control-hover": "#a4a4a4", "border-decorative": "#282828", "border-card": "#333333", "border-float": "#4b4b4b" });
  });
});
