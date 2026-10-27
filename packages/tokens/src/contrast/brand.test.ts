/**
 * The gate for any brand (semantic/brand.ts, 2026-10-26). A brand colour can be any of sixteen million, so the gate
 * samples: the four reference brands from the owner's sheets, colours at the edges (near grey, near white, near black,
 * neon), and 500 seeded colours spread over hue, chroma and lightness, a third of them with all three slots, every
 * assertion (contrast/assertions.ts and BRAND_ASSERTIONS) in both modes; 60 of them again at Saturation's and Shade's
 * ends. And with no brand, the theme is Area's own, token for token.
 */
import { describe, expect, it } from "vitest";
import { type Brand, BRAND_ASSERTIONS, brandDefaultCss, brandFailures, defaultBrandTokens, resolveBrandTheme } from "../semantic/brand.ts";
import { resolveTheme } from "../semantic/resolve.ts";
import { SRGB, clampRgb, oklchToRgb, toHex } from "../color/oklab.ts";
import { maxChromaAt } from "../color/gamut.ts";

const REFERENCE: Brand[] = [
  { primary: "#667fff", secondary: "#b2a99d" },
  { primary: "#00b65c", secondary: "#a785fe", tertiary: "#f8311c" },
  { primary: "#e5e12d", secondary: "#587989", tertiary: "#242a2d" },
  { primary: "#4d80e6", secondary: "#47585c", tertiary: "#c8d5bb" },
];
const EDGES: Brand[] = [
  { primary: "#808080" }, { primary: "#f5feff", secondary: "#0e1415" }, { primary: "#0e1415", secondary: "#f9f8e5" },
  { primary: "#ff0000" }, { primary: "#00ff66", secondary: "#ff00ff" }, { primary: "#ffff00" }, { primary: "#1a237e" },
];

/** A seeded generator, so a failure names a brand that can be rerun. */
function mulberry32(seed: number) {
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const random = mulberry32(20261026);
const colour = () => {
  const L = 0.2 + random() * 0.75, h = random() * 360, C = random() * maxChromaAt(L, h, SRGB);
  return toHex(clampRgb(oklchToRgb({ L, C, h }, SRGB)));
};
const SAMPLE: Brand[] = Array.from({ length: 500 }, (_, i) => i % 3 === 0 ? { primary: colour(), secondary: colour(), tertiary: colour() } : { primary: colour() });

describe("brand: no brand is Area's own palette", () => {
  for (const theme of ["light", "dark"] as const) it(`${theme}: every token as resolveTheme writes it`, () => {
    for (const selection of [
      { accent: "blue" }, { accent: "orange", accentStrength: 40 }, { accent: "260", solid: { light: 750, dark: 750 } as const }, { accent: "teal", statusColours: "match" as const, accentStrength: 60 },
    ]) {
      const own = resolveTheme({ theme, neutral: "neutral", ...selection }).tokens;
      const brand = resolveBrandTheme({ theme, neutral: "neutral", ...selection }).tokens;
      expect(Object.keys(own).filter(name => own[name] !== brand[name])).toEqual([]);
    }
  });
  it("the CSS defaults are the resolver's defaults", () => {
    const { fixed } = brandDefaultCss();
    for (const theme of ["light", "dark"] as const) {
      const defaults = defaultBrandTokens(resolveTheme({ theme, neutral: "neutral", accent: "blue" }).tokens, theme);
      for (const [name, value] of Object.entries(fixed)) {
        const pair = /^light-dark\((#[0-9a-f]+), (#[0-9a-f]+)\)$/.exec(value);
        expect(defaults[name.slice("--area-".length)], name).toBe(pair ? pair[theme === "light" ? 1 : 2] : value);
      }
    }
  });
  it("names a pairing for every new role", () => {
    expect(BRAND_ASSERTIONS.length).toBeGreaterThan(40);
  });
});

describe("brand: contrast gate", () => {
  const run = (brands: Brand[], extra: object = {}) => {
    const problems: string[] = [];
    for (const brand of brands) for (const theme of ["light", "dark"] as const) {
      const t = resolveBrandTheme({ theme, neutral: "neutral", brand, ...extra }).tokens;
      for (const failure of brandFailures(t, theme)) problems.push(`${JSON.stringify(brand)} ${theme} ${JSON.stringify(extra)}: ${failure}`);
    }
    return problems;
  };
  it("the reference brands and the edge colours", () => {
    expect(run([...REFERENCE, ...EDGES]).slice(0, 20)).toEqual([]);
  }, 60_000);
  it("500 sampled brands", () => {
    expect(run(SAMPLE).slice(0, 20)).toEqual([]);
  }, 300_000);
  for (const extra of [{ accentStrength: 30 }, { solid: { light: 200, dark: 200 } }, { solid: { light: 850, dark: 850 } }, { statusColours: "fixed" }])
    it(`60 sampled brands at ${JSON.stringify(extra)}`, () => {
      expect(run(SAMPLE.slice(0, 60), extra).slice(0, 20)).toEqual([]);
    }, 120_000);
});
