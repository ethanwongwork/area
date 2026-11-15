/**
 * The press on a control fill (`bg-pressed-track`, styles layers.css; plan B7.4): Segmented's and soft Toggle group's
 * options on their track, Board's add row. The pressed wash, capped at the alpha where the muted label keeps 4.6:1 on the
 * ground's control fill. This walks the same arithmetic the CSS does over every ground, Layers step, fill combination and
 * neutral cast: the muted label keeps 4.5:1 on the press, and at the shipped fills the press is never lighter than the
 * hover under it. The CSS formula is read from layers.css, so a change there that this model does not follow fails.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DEFAULT_FILL, DEFAULT_INK_TINT, LAYER_STEPS, inkHex, layerHex, layerLightnessAt } from "./layers.ts";
import { THEMES, alphaOver, casts, contrast, groundLightnesses } from "./layer-checks.ts";
import { SRGB, parseHex, rgbToOklab } from "./oklab.ts";
import { darkWashAlphas } from "../emit/base.ts";

const encode = (y: number) => y <= 0.0031308 ? 12.92 * y : 1.055 * y ** (1 / 2.4) - 0.055;
const lightness = (hex: string) => rgbToOklab(parseHex(hex), SRGB).L;
const hoverStep = (hover: number) => Math.max(1.25, 1.5 + 0.375 * (hover - 2));
type Fills = { hover: number; selected: number; pressed: number };
const lightWash = (f: Fills) => ({ hover: 0.05 * hoverStep(f.hover) / 1.5, pressed: 0.07 * (hoverStep(f.hover) + 0.625 * f.selected) / 2.125 + 0.01375 * f.pressed });

/** The alpha layers.css paints: the pressed wash, capped on the fill (as the CSS: c = 1.055·l^1.25 − 0.055). */
export function trackPressAlpha(theme: "light" | "dark", fill: string, mutedL: number, f: Fills): number {
  const c = 1.055 * lightness(fill) ** 1.25 - 0.055;
  const cap = theme === "light"
    ? 1 - (1.055 * (4.6 * (mutedL ** 3 + 0.05) - 0.05) ** (1 / 2.4) - 0.055) / c
    : (1.055 * Math.max(0.0031308, (mutedL ** 3 + 0.05) / 4.6 - 0.05) ** (1 / 2.4) - 0.055 - c) / (1 - c);
  const wash = theme === "light" ? lightWash(f).pressed : darkWashAlphas(f.hover, f.selected, f.pressed).pressed;
  return Math.max(0, Math.min(wash, cap));
}

const FILLS: Fills[] = [];
for (let hover = 1; hover <= 4; hover++) for (let selected = 0; selected <= 4; selected++) for (let pressed = 1; pressed <= 4; pressed++) FILLS.push({ hover, selected, pressed });
const GROUNDS = ["page", "raised", "card", "float", "recessed", "tile", "well"] as const;

describe("the press on a control fill (bg-pressed-track)", () => {
  it("layers.css writes the formula this model walks", () => {
    const css = readFileSync(new URL("../../../styles/src/layers.css", import.meta.url), "utf8");
    const rule = css.match(/--area-bg-pressed-track:([^;]+);/)?.[1]?.replace(/\s+/g, " ") ?? "";
    expect(rule).toContain("oklch(from var(--area-bg-component) 0 0 0 / max(0, min(var(--area-wash-pressed-light),");
    expect(rule).toContain("calc(4.6 * (pow(var(--area-layer-light-muted), 3) + 0.05) - 0.05), 0.416667) - 0.055) / (1.055 * pow(l, 1.25) - 0.055)");
    expect(rule).toContain("oklch(from var(--area-bg-component) 1 0 0 / max(0, min(var(--area-wash-pressed-dark),");
    expect(rule).toContain("calc((pow(var(--area-layer-dark-muted), 3) + 0.05) / 4.6 - 0.05)), 0.416667) - 1.055 * pow(l, 1.25)) / (1.055 - 1.055 * pow(l, 1.25))");
  });
  for (const theme of THEMES) {
    it(`${theme}: the muted label keeps 4.5:1 on the press at every ground, Layers step, fill and cast`, () => {
      const problems: string[] = [];
      for (const { id, cast } of casts) for (const g of groundLightnesses(theme)) for (const n of LAYER_STEPS) for (const f of FILLS) {
        const m = layerLightnessAt(theme, g, n, { hover: f.hover, selected: f.selected }, "auto");
        const muted = inkHex(theme, m.ink.muted, cast[theme], DEFAULT_INK_TINT / 4);
        for (const ground of GROUNDS) {
          const fill = layerHex(theme, m.fill[ground][0], cast[theme]);
          const press = alphaOver(theme === "light" ? "#000000" : "#ffffff", trackPressAlpha(theme, fill, m.ink.muted, f), fill);
          if (contrast(muted, press) < 4.5) problems.push(`${id} ${g.toFixed(3)}/${n} ${ground} ${JSON.stringify(f)}: ${contrast(muted, press).toFixed(2)}`);
        }
      }
      expect(problems.slice(0, 10)).toEqual([]);
    }, 120_000);
    it(`${theme}: at the shipped fills the press is never lighter than the hover, and shows on the page`, () => {
      const f = { ...DEFAULT_FILL, pressed: 4 };
      const problems: string[] = [];
      for (const { id, cast } of casts) for (const g of groundLightnesses(theme)) for (const n of LAYER_STEPS) {
        const m = layerLightnessAt(theme, g, n, DEFAULT_FILL, "auto");
        for (const ground of GROUNDS) {
          const fill = layerHex(theme, m.fill[ground][0], cast[theme]);
          const press = alphaOver(theme === "light" ? "#000000" : "#ffffff", trackPressAlpha(theme, fill, m.ink.muted, f), fill);
          const hover = theme === "light" ? alphaOver("#141414", lightWash(f).hover, fill) : alphaOver("#ffffff", darkWashAlphas(f.hover, f.selected, f.pressed).hover, fill);
          const step = (lightness(hover) - lightness(press)) * (theme === "light" ? 1 : -1);
          if (step < -1e-3) problems.push(`${id} ${g.toFixed(3)}/${n} ${ground}: press ${press} lighter than hover ${hover}`);
          if (ground === "page" && step < 0.004) problems.push(`${id} ${g.toFixed(3)}/${n} page: press ${press} only ${step.toFixed(4)} past hover ${hover}`);
        }
      }
      expect(problems.slice(0, 10)).toEqual([]);
    }, 60_000);
  }
});
