/**
 * Exact page colours (color/colours.ts, 2026-10-27; plan https://claude.ai/artifact/K4rswTACDiMB31nd4nzWz2). The guarantee
 * is "Area's colour rules hold everywhere a pick can land": every pick paints itself, a pick past what shows is held at the
 * nearest that does, every grey a screen shows on a light page from L 0.90 to 1.00 goes through every check, a dense grid
 * of picks over hue × chroma × lightness in both modes goes through every check at the application settings' marks and a
 * coarser one at every position, and the CSS that ships derives what the model does from the declarations a pick writes.
 * A failure names its pick, so it can be rerun.
 */
import { describe, expect, it } from "vitest";
import {
  DEFAULT_FILL, DEFAULT_INK_TINT, HUED_INKS, LAYER_STEPS, POSITIONS, SIGNED_POSITIONS, FILL_STEPS, TINT_HUES,
  castCss, castChromaCss, cardToneAt, fillPosition, fillStepAt, inkShareAt, layerHex, layerLightnessAt, layerLightnessCss, layersAt, tintedDarken, TONAL_Y, VIVID_Y, type CardTone,
} from "./layers.ts";
import { PAGE_INPUTS, PAGE_RANGE, TINT_MAX, isColour, oklchHex, pageDeclarations, parseColour, presetPick, reachableChroma, solvePage, type Mode } from "./colours.ts";
import { SRGB, rgbToOklab } from "./oklab.ts";
import { wcagContrastHex } from "./contrast.ts";
import { CHROMATIC_SCALES, NEUTRAL_SCALES } from "./presets.ts";
import { resolveTheme } from "../semantic/resolve.ts";
import { THEMES, cssLightnessAt, mixOklab, problemsFor, resolveCss } from "./layer-checks.ts";
import { brandDerivedFormulas } from "../emit/brand-derived.ts";
import { colourCssWith, colourDeclarationsWith } from "../emit/colours.ts";
import { emitAxes } from "../emit/css.ts";

const round = (x: number, p: number) => Number(x.toFixed(p));
/** Lightness in steps of `step` over a mode's range, ends included. */
const lightnesses = (theme: Mode, step: number) => {
  const [lo, hi] = PAGE_RANGE[theme], out: number[] = [];
  for (let i = 0; lo + i * step <= hi + 1e-9; i++) out.push(round(lo + i * step, 4));
  return out;
};
/** Chroma in steps of `step` from 0 to the most the page shows at that lightness and hue, the most itself included. */
const chromas = (theme: Mode, L: number, h: number, step: number) => {
  const reach = Math.floor(reachableChroma(theme, L, h) * 1e4) / 1e4, out: number[] = [];
  for (let c = 0; c < reach - 1e-9; c += step) out.push(round(c, 4));
  out.push(reach);
  return out;
};
/** The cast a solved pick draws in. */
const castOf = (theme: Mode, l: number, c: number, h: number) => { const s = solvePage(theme, { l, c, h }); return { L: s.lightness, cast: { hue: s.hue, chroma: s.strength } }; };
/** Every grey a screen shows in a mode's range: its hex and OKLCH lightness. */
const screenGreys = (theme: Mode) => Array.from({ length: 256 }, (_, v) => ({ hex: `#${v.toString(16).padStart(2, "0").repeat(3)}`, L: rgbToOklab([v / 255, v / 255, v / 255], SRGB).L }))
  .filter(({ L }) => L >= PAGE_RANGE[theme][0] - 1e-9 && L <= PAGE_RANGE[theme][1] + 1e-9);

describe("colours: a pick paints itself", () => {
  for (const theme of THEMES) it(`${theme}: every reachable pick on 15° hues, 0.5% lightness and 0.002 chroma`, () => {
    const problems: string[] = [];
    for (let h = 0; h < 360; h += 15) for (const L of lightnesses(theme, 0.005)) for (const c of chromas(theme, L, h, 0.002)) {
      const s = solvePage(theme, { l: L, c, h }), at = `oklch(${L} ${c} ${h})`;
      if (s.lightness !== L || Math.abs(s.painted.c - c) > 1e-4 || s.hue !== h) problems.push(`${at}: solved to ${JSON.stringify(s.painted)}`);
      if (s.strength > TINT_MAX + 1e-9) problems.push(`${at}: strength ${s.strength} past Tint 100`);
      // What the model paints from the solved numbers is the pick's own colour.
      const hex = layerHex(theme, s.lightness, { hue: s.hue, chroma: s.strength });
      if (hex !== oklchHex({ l: L, c, h })) problems.push(`${at}: paints ${hex}, not ${oklchHex({ l: L, c, h })}`);
    }
    expect(problems.slice(0, 20)).toEqual([]);
  });
  it("a pick past what shows is held at the nearest that does", () => {
    expect(solvePage("light", { l: 0.5, c: 0, h: 0 }).lightness).toBe(0.9);
    expect(solvePage("light", { l: 1.2, c: 0, h: 0 }).lightness).toBe(1);
    expect(solvePage("dark", { l: 0.5, c: 0, h: 0 }).lightness).toBe(0.24);
    expect(solvePage("dark", { l: -0.1, c: 0, h: 0 }).lightness).toBe(0);
    // Too much chroma: held at the most the page shows at that lightness and hue, Tint 100 or the hue's room.
    for (const theme of THEMES) for (const L of lightnesses(theme, 0.01)) for (const h of [0, 60, 100, 255, 300]) {
      const s = solvePage(theme, { l: L, c: 0.3, h }), reach = reachableChroma(theme, L, h);
      expect(s.painted.c, `${theme} ${L} ${h}`).toBeLessThanOrEqual(reach + 1e-9);
      expect(s.painted.c, `${theme} ${L} ${h}`).toBeGreaterThan(reach - 1e-4 - 1e-9);
    }
    // White and black take no tint; negative chroma is none; hue wraps.
    expect(solvePage("light", { l: 1, c: 0.05, h: 255 }).painted.c).toBe(0);
    expect(solvePage("dark", { l: 0, c: 0.05, h: 255 }).painted.c).toBe(0);
    expect(solvePage("light", { l: 0.95, c: -1, h: 0 }).strength).toBe(0);
    expect(solvePage("light", { l: 0.95, c: 0.01, h: 370 }).hue).toBe(10);
  });
  it("reads oklch() and hex, and refuses anything else", () => {
    expect(parseColour("oklch(96.34% 0.012 255deg)")).toEqual({ l: 0.9634, c: 0.012, h: 255 });
    expect(parseColour("oklch(0.9634 0.012 255)")).toEqual({ l: 0.9634, c: 0.012, h: 255 });
    expect(parseColour("#fff").l).toBeCloseTo(1, 6);
    expect(isColour("rgb(1 2 3)")).toBe(false);
    expect(() => parseColour("blue")).toThrow(/oklch/);
  });
  it("the default pages are today's: white and Area's near-black", () => {
    expect(pageDeclarations({ light: "#ffffff" })).toMatchObject({ "--area-ground-light": "1", "--area-tint-chroma-light": "0" });
    expect(solvePage("dark", parseColour("#020202")).lightness).toBeCloseTo(0.0847, 3);
  });
});

// Lightness is exact (plan, "Lightness is exact"): the light page takes any value 0.90 to 1.00 to four decimals. A screen
// shows 34 greys there; each is reached exactly, and every lightness between, to the fourth decimal, goes through every
// check at every Layer contrast mark; the 34 at every position. Dark's greys (0 to 0.24) the same.
describe("colours: every grey a screen shows", () => {
  it("light has 34, and a pick reaches each exactly", () => {
    const greys = screenGreys("light");
    expect(greys.length).toBe(34);
    for (const { hex } of greys) expect(layerHex("light", solvePage("light", parseColour(hex)).lightness, { hue: 0, chroma: 0 }), hex).toBe(hex);
  });
  it("dark: a pick reaches each exactly", () => {
    for (const { hex } of screenGreys("dark")) expect(layerHex("dark", solvePage("dark", parseColour(hex)).lightness, { hue: 0, chroma: 0 }), hex).toBe(hex);
  });
  for (const theme of THEMES) it(`${theme}: every lightness to the fourth decimal at the marks, every grey at every position`, () => {
    const grey = { hue: 0, chroma: 0 };
    const problems = [
      ...problemsFor(theme, grey, DEFAULT_INK_TINT / 4, "auto", LAYER_STEPS, DEFAULT_FILL, lightnesses(theme, 0.0001)),
      ...problemsFor(theme, grey, DEFAULT_INK_TINT / 4, "auto", POSITIONS.map(layersAt), DEFAULT_FILL, screenGreys(theme).map(({ hex }) => solvePage(theme, parseColour(hex)).lightness)),
    ];
    expect(problems.slice(0, 20)).toEqual([]);
  }, 60_000);
});

// The dense grid (plan, "How testing changes"): every degree of hue × chroma in 0.002 steps up to what the page shows ×
// lightness in 0.5% steps, at the Layer contrast marks with Text tint at its default and both ends.
describe("colours: every pick is usable", () => {
  for (const theme of THEMES) it(`${theme}: every degree × 0.002 chroma × 0.5% lightness`, () => {
    const problems: string[] = [];
    for (const h of TINT_HUES) for (const L of lightnesses(theme, 0.005)) for (const c of chromas(theme, L, h, 0.002)) {
      if (c === 0 && h > 0) continue;
      const s = castOf(theme, L, c, h), found = problemsFor(theme, s.cast, [0, DEFAULT_INK_TINT / 4, 1], "auto", LAYER_STEPS, DEFAULT_FILL, [s.L]);
      if (found.length) problems.push(`oklch(${L} ${c} ${h}): ${found[0]} (+${found.length - 1})`);
    }
    expect(problems.slice(0, 20)).toEqual([]);
  }, 300_000);
});

// The coarser grid at every position (some tones turn back along a setting, so marks alone would miss cases): 30° hues,
// lightness in 2.5% steps, half and all of the chroma the page shows, at every position of Layer contrast, Card shade, Text
// tint and the Hover and Selected fills.
describe("colours: every pick at every position", () => {
  const coarse = (theme: Mode) => {
    const out: Array<{ at: string; L: number; cast: { hue: number; chroma: number } }> = [];
    for (let h = 0; h < 360; h += 30) for (const L of lightnesses(theme, 0.025)) {
      const reach = Math.floor(reachableChroma(theme, L, h) * 1e4) / 1e4;
      for (const c of reach > 0 ? [round(reach / 2, 4), reach] : [0]) out.push({ at: `oklch(${L} ${c} ${h})`, ...castOf(theme, L, c, h) });
    }
    return out;
  };
  const TONES = SIGNED_POSITIONS.map(cardToneAt), LAYERS = POSITIONS.map(layersAt);
  const HOVERS = POSITIONS.filter(p => p >= fillPosition(FILL_STEPS.hover.min)).map(fillStepAt), SELECTEDS = POSITIONS.map(fillStepAt);
  for (const theme of THEMES) it(`${theme}: Layer contrast, Card shade, Text tint and fill positions`, () => {
    const problems: string[] = [];
    const check = (what: string, found: string[]) => { if (found.length) problems.push(`${what}: ${found[0]} (+${found.length - 1})`); };
    for (const { at, L, cast } of coarse(theme)) {
      check(`${at}, every Layer contrast`, problemsFor(theme, cast, DEFAULT_INK_TINT / 4, "auto", LAYERS, DEFAULT_FILL, [L]));
      for (const tone of TONES) check(`${at}, card ${tone}`, problemsFor(theme, cast, DEFAULT_INK_TINT / 4, tone as CardTone, LAYER_STEPS, DEFAULT_FILL, [L]));
      for (const position of POSITIONS) check(`${at}, text ${position}`, problemsFor(theme, cast, inkShareAt(position), "auto", LAYER_STEPS, DEFAULT_FILL, [L]));
      for (const hover of HOVERS) check(`${at}, hover ${hover}`, problemsFor(theme, cast, DEFAULT_INK_TINT / 4, "auto", LAYER_STEPS, { hover, selected: DEFAULT_FILL.selected }, [L]));
      for (const selected of SELECTEDS) check(`${at}, selected ${selected}`, problemsFor(theme, cast, DEFAULT_INK_TINT / 4, "auto", LAYER_STEPS, { hover: DEFAULT_FILL.hover, selected }, [L]));
    }
    expect(problems.slice(0, 20)).toEqual([]);
  }, 300_000);
});

// The hued inks (layers.ts VIVID_ROLES, TONAL_ROLES) on a picked light page: every 15° hue, lightness in 0.5% steps, half
// and all of the chroma the page shows, at every Layer contrast mark; and every lightness to the fourth decimal untinted.
describe("colours: inks with a hue hold on every picked page", () => {
  const inks = { vivid: new Set<string>(), tonal: new Set<string>() };
  for (const neutral of NEUTRAL_SCALES) for (const accent of CHROMATIC_SCALES) {
    const t = resolveTheme({ theme: "light", neutral: neutral.id, accent: accent.id }).tokens;
    for (const { token, darken } of HUED_INKS) inks[darken].add(t[token]!);
  }
  it("light", () => {
    const problems: string[] = [];
    const check = (at: string, L: number, cast: { hue: number; chroma: number }) => {
      for (const n of LAYER_STEPS) {
        const m = layerLightnessAt("light", L, n), grounds = { vivid: m.page, tonal: Math.min(m.recessed, m.card, m.tile) };
        for (const kind of ["vivid", "tonal"] as const) {
          const bg = layerHex("light", grounds[kind], cast), d = tintedDarken(grounds[kind], cast.chroma, kind === "vivid" ? VIVID_Y : TONAL_Y);
          for (const ink of inks[kind]) if (wcagContrastHex(mixOklab(ink, "black", d), bg) < 4.5) { problems.push(`${at}/${n}: ${kind} ${ink} on ${bg}`); return; }
        }
      }
    };
    for (let h = 0; h < 360; h += 15) for (const L of lightnesses("light", 0.005)) {
      const reach = Math.floor(reachableChroma("light", L, h) * 1e4) / 1e4;
      for (const c of [round(reach / 2, 4), reach]) { const s = castOf("light", L, c, h); check(`oklch(${L} ${c} ${h})`, s.L, s.cast); }
    }
    for (const L of lightnesses("light", 0.0001)) check(`oklch(${L} 0 0)`, L, { hue: 0, chroma: 0 });
    expect(problems.slice(0, 20)).toEqual([]);
  }, 120_000);
});

/** The inputs every derivation reads at the axes' defaults (Neutral: no cast, rooms open), then a pick's declarations. */
function cssVars(declarations: Record<string, string>): Record<string, number> {
  const vars: Record<string, number> = {
    "tint-hue-auto": 1, "tint-hue": 0, "tint-hue-accent": 0, "tint-room-white": 9, "tint-room-black": 9,
    "tint-hue-dark-same": 1, "tint-hue-dark-auto": 0, "tint-hue-dark": 0, "tint-hue-dark-accent": 0, "tint-room-white-dark": 9, "tint-room-black-dark": 9,
    "tint-light-auto": 1, "tint-chroma-light": 0, "tint-dark-auto": 1, "tint-chroma-dark": 0,
    "neutral-hue-light": 0, "neutral-hue-dark": 0, "neutral-chroma-light": 0, "neutral-chroma-dark": 0,
    "neutral-room-white-light": 9, "neutral-room-black-light": 9, "neutral-room-white-dark": 9, "neutral-room-black-dark": 9,
    "accent-hue": 250, "accent-room-white": 0.4, "accent-room-black": 0.3,
    "ground-light": 1, "ground-dark": 0.0847, "layers-light": 0, "layers-dark": 0, "fill-hover-step": 2, "fill-selected-step": 1,
    "card-tone-light-auto": 1, "card-tone-light": 0, "card-tone-dark-auto": 1, "card-tone-dark": 0,
  };
  for (const [name, value] of Object.entries(declarations)) vars[name.replace(/^--area-/, "")] = Number(value);
  return vars;
}

describe("colours: the shipped CSS derives what the model does", () => {
  const picks: Array<[Mode, string]> = [];
  for (const theme of THEMES) for (let h = 0; h < 360; h += 45) for (const L of lightnesses(theme, 0.02)) {
    const reach = Math.floor(reachableChroma(theme, L, h) * 1e4) / 1e4;
    for (const c of [0, round(reach / 3, 4), reach]) picks.push([theme, `oklch(${L} ${c} ${h})`]);
  }
  it("the page's lightness, hue and chroma, and the layers on it", () => {
    for (const [theme, pick] of picks) {
      const s = solvePage(theme, parseColour(pick)), css = { ...layerLightnessCss(), ...castCss() };
      const vars = resolveCss(css, cssVars(pageDeclarations({ [theme]: pick })));
      const page = vars[`layer-${theme}-page`]!;
      expect(page, pick).toBeCloseTo(s.lightness, 9);
      expect(vars[`cast-hue-${theme}`], pick).toBeCloseTo(s.hue, 9);
      const painted = resolveCss({ painted: castChromaCss(theme, String(page)) }, { ...vars }).painted!;
      expect(painted, pick).toBeCloseTo(s.painted.c, 4);
      // The layers over a picked page, at a Layer contrast mark, as the model has them.
      for (const n of [0, 4, 8]) {
        const m = layerLightnessAt(theme, s.lightness, n), c = cssLightnessAt(theme, s.lightness, n);
        for (const [k, x] of [["raised", m.raised], ["recessed", m.recessed], ["page-fill-2", m.fill.page[2]], ["body", m.ink.body], ["muted", m.ink.muted]] as const)
          expect(c[`layer-${theme}-${k}`], `${pick} ${n} ${k}`).toBeCloseTo(x, 6);
      }
    }
  });
  it("dark's Tint hue follows light's until dark has its own", () => {
    const css = castCss();
    // Same as light (the default): dark takes light's whole setting, a hue, Auto or Accent.
    const at = (extra: Record<string, number>) => resolveCss(css, { ...cssVars({}), ...extra });
    expect(at({ "tint-hue-auto": 0, "tint-hue": 120, "tint-room-white": 0.3 })["cast-hue-dark"]).toBe(120);
    expect(at({ "tint-hue-auto": 0, "tint-hue": 120, "tint-room-white": 0.3 })["cast-room-white-dark"]).toBe(0.3);
    expect(at({ "tint-hue-auto": 1, "neutral-hue-dark": 210 })["cast-hue-dark"]).toBe(210);
    expect(at({ "tint-hue-auto": 0, "tint-hue-accent": 1 })["cast-hue-dark"]).toBe(250);
    // Its own: a picked dark page leans its own way, and light keeps its own.
    const both = at({ ...cssVars(pageDeclarations({ light: "oklch(0.96 0.01 60)", dark: "oklch(0.15 0.02 250)" })) });
    expect([both["cast-hue-light"], both["cast-hue-dark"]]).toEqual([60, 250]);
  });
});

describe("colours: declarations and the scope", () => {
  const derived = brandDerivedFormulas();
  it("a page pick writes the page inputs and nothing else", () => {
    const d = colourDeclarationsWith(derived, { page: { light: "oklch(0.9634 0.012 255)", dark: "oklch(0.12 0.01 255)" } });
    expect(Object.keys(d).sort()).toEqual(PAGE_INPUTS.map(n => `--area-${n}`).sort());
    expect(d).toMatchObject({ "--area-ground-light": "0.9634", "--area-tint-hue": "255", "--area-tint-chroma-light": "0.012", "--area-tint-light-auto": "0", "--area-tint-hue-dark-same": "0" });
  });
  it("an accent writes what Brand colours writes", () => {
    const d = colourDeclarationsWith(derived, { accent: "#2f5bd3" });
    expect(d["--area-accent-hue"]).toBeDefined();
    expect(Object.keys(d).some(name => name.startsWith("--area-ground"))).toBe(false);
  });
  it("an accent's secondary and tertiary write what a brand's do", () => {
    const d = colourDeclarationsWith(derived, { accent: "#2f5bd3", secondary: "#a785fe", tertiary: "oklch(0.62 0.2 30)" });
    expect(Object.keys(d).some(name => name.startsWith("--area-secondary-"))).toBe(true);
    expect(Object.keys(d).some(name => name.startsWith("--area-tertiary-"))).toBe(true);
  });
  it("as a rule in the axes layer, on [data-area-colours]", () => {
    const css = colourCssWith(derived, { page: { light: "oklch(0.97 0.01 60)" } });
    expect(css).toMatch(/@layer area\.axes \{\n {2}\[data-area-colours\] \{/);
    expect(css).toContain("--area-ground-light: 0.97;");
  });
  it("the stylesheet restates every derivation reading a page input on [data-area-colours]", () => {
    const axes = emitAxes();
    const rules = [...axes.matchAll(/((?:\[[^\]]+\],?\s*)+)\{([^}]*)\}/g)].filter(([, selectors]) => selectors!.includes("[data-area-colours]")).map(([, , body]) => body!).join("\n");
    for (const name of ["--area-layer-light-page", "--area-cast-hue-light", "--area-cast-hue-dark", "--area-cast-chroma-dark", "--area-bg-page", "--area-fg-muted"]) expect(rules, name).toContain(`${name}:`);
  });
});

// Saved settings convert once (apps/desktop restoreCanvas): a page preset and its pick paint the same. Where no pick can
// (a tint the page itself doesn't show), the preset is kept.
describe("colours: presets as picks", () => {
  for (const theme of THEMES) it(theme, () => {
    let converted = 0, kept = 0;
    const steps = theme === "light" ? [100, 99, 98, 97, 95, 92, 90] : [0, 4, 8, 12, 16, 20, 24];
    for (const step of steps) for (let hue = 0; hue < 360; hue += 10) for (const position of [0, 6, 13, 25, 50, 75, 100]) {
      const pick = presetPick(theme, step, { hue, position });
      if (!pick) { kept++; continue; }
      converted++;
      const s = solvePage(theme, pick), L = s.lightness;
      expect(Math.abs(s.strength - (position * TINT_MAX / 100)), `${theme} ${step} ${hue} ${position}`).toBeLessThan(4e-4);
      expect(layerHex(theme, L, { hue: s.hue, chroma: s.strength }), `${theme} ${step} ${hue} ${position}`).toBe(layerHex(theme, L, { hue, chroma: position * TINT_MAX / 100 }));
    }
    expect(converted).toBeGreaterThan(0);
    expect(kept).toBeGreaterThan(0);
    expect(presetPick(theme, theme === "light" ? 100 : 8, null)).not.toBeNull();
  });
});
