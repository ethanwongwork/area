/**
 * The data-colour gate (colour system study, proposal 6; owner picked Build, 2026-11-01).
 *
 * The same thresholds as the dataviz skill's validator (validate_palette.js), so the review page and the build agree:
 * neighbours apart under simulated protanopia and deuteranopia (Machado, Oliveira & Fernandes 2009, severity 1.0) by
 * OKLab ΔE × 100 ≥ 8 and under normal vision by ≥ 15, marks at chroma ≥ 0.10, marks ≥ 3:1 on every ground they sit on
 * (WCAG 2.2 SC 1.4.11), a number ≥ 4.5:1 on its fill, ramps one hue with every step ≥ 0.06 lighter than the next. At every
 * Series lightness, in both modes, on sRGB and on Display P3. The skill's dark lightness band (L 0.48–0.67) is the one
 * check not held: dark marks are the luminous colours themselves, above it by the owner's choice (OpenAI's colours).
 */
import { describe, expect, it } from "vitest";
import { RAMP_STEPS, SERIES, SERIES_GROUNDS_LIGHT, SERIES_LIGHTNESSES, seriesColours } from "../color/series.ts";
import { hexLuminance, p3Luminance, ratioOf } from "../color/place.ts";
import { SRGB, labToLch, parseHex, rgbToOklab, type Rgb } from "../color/oklab.ts";
import { shippedThemes } from "../semantic/resolve.ts";

const MACHADO = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
} as const;
const lin = (c: number) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const enc = (c: number) => { c = Math.max(0, Math.min(1, c)); return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055; };
function simulated(hex: string, kind?: keyof typeof MACHADO): Rgb {
  const rgb = parseHex(hex);
  if (!kind) return rgb;
  const l = rgb.map(lin), M = MACHADO[kind];
  return M.map(row => enc(row[0] * l[0]! + row[1] * l[1]! + row[2] * l[2]!)) as Rgb;
}
const deltaE = (a: string, b: string, kind?: keyof typeof MACHADO) => {
  const x = rgbToOklab(simulated(a, kind), SRGB), y = rgbToOklab(simulated(b, kind), SRGB);
  return 100 * Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b);
};
const lch = (hex: string) => labToLch(rgbToOklab(parseHex(hex), SRGB));
const contrast = (a: string, b: string) => ratioOf(hexLuminance(a), hexLuminance(b));

/** Every ground a mark sits on in the shipped themes: the page, raised and recessed layers, wells, fields, stripes. */
const GROUND_TOKENS = ["bg-page", "bg-surface", "bg-subtle", "bg-well", "bg-component", "bg-component-hover", "bg-stripe"];
const grounds = { light: new Set<string>(), dark: new Set<string>() };
for (const t of shippedThemes()) for (const k of GROUND_TOKENS) grounds[t.theme].add(t.tokens[k]!);

const at = (lightness: number) => SERIES.map(s => seriesColours(s.hue, lightness));

describe("series colours", () => {
  it("solve light marks on grounds no shipped light ground is darker than", () => {
    const floor = Math.min(...SERIES_GROUNDS_LIGHT.map(hexLuminance));
    for (const g of grounds.light) expect(hexLuminance(g), g).toBeGreaterThanOrEqual(floor - 1e-9);
  });

  describe.each(SERIES_LIGHTNESSES.map(l => [l] as const))("at Series lightness %i", lightness => {
    const series = at(lightness);
    for (const mode of ["light", "dark"] as const) {
      it(`keeps neighbours apart under colour-vision deficiency and normal vision (${mode})`, () => {
        for (const part of ["mark", "fill"] as const) {
          const list = series.map(c => c[mode][part]);
          // Dark fills are areas under a luminous line, told apart by the line: only the light fills are categorical.
          if (mode === "dark" && part === "fill") continue;
          for (let i = 0; i + 1 < list.length; i++) {
            const [a, b] = [list[i]!, list[i + 1]!];
            expect(Math.min(deltaE(a, b, "protan"), deltaE(a, b, "deutan")), `${mode} ${part} ${a}↔${b}`).toBeGreaterThanOrEqual(8);
            expect(deltaE(a, b), `${mode} ${part} ${a}↔${b} normal`).toBeGreaterThanOrEqual(15);
          }
        }
      });
      it(`draws marks with colour, not grey (${mode})`, () => {
        for (const c of series) expect(lch(c[mode].mark).C, c[mode].mark).toBeGreaterThanOrEqual(0.10);
      });
      it(`shows marks at 3:1 on every ${mode} ground`, () => {
        for (const c of series) for (const g of grounds[mode]) expect(contrast(c[mode].mark, g), `${c[mode].mark} on ${g}`).toBeGreaterThanOrEqual(3);
      });
      it(`reads a number inside a fill (${mode})`, () => {
        for (const c of series) expect(contrast(c[mode].ink, c[mode].fill), `${c[mode].ink} on ${c[mode].fill}`).toBeGreaterThanOrEqual(4.5);
      });
      it(`walks each ramp along one hue with visible steps (${mode})`, () => {
        for (const c of series) {
          const ramp = c[mode].ramp;
          expect(ramp).toHaveLength(RAMP_STEPS);
          const Ls = ramp.map(h => lch(h).L);
          for (let i = 0; i + 1 < Ls.length; i++) {
            const gap = mode === "light" ? Ls[i]! - Ls[i + 1]! : Ls[i + 1]! - Ls[i]!;
            expect(gap, `${ramp[i]} → ${ramp[i + 1]}`).toBeGreaterThanOrEqual(0.06 - 1e-3);
          }
          const hues = ramp.map(h => lch(h).h);
          const apart = (h: number, k: number) => { const d = Math.abs(h - k) % 360; return Math.min(d, 360 - d); };
          expect(Math.max(...hues.flatMap(h => hues.map(k => apart(h, k)))), ramp.join(" ")).toBeLessThanOrEqual(40);
        }
      });
    }
    it("shows a dark line over its own area fill", () => {
      for (const c of series) expect(contrast(c.dark.mark, c.dark.fill)).toBeGreaterThanOrEqual(3);
    });
    it("keeps the P3 colours readable: a number on a light fill, a mark on every dark ground", () => {
      for (const c of series) {
        const y = p3Luminance(c.p3.rgb);
        expect(ratioOf(y, hexLuminance(c.light.ink)), `${c.light.ink} on ${c.p3.css}`).toBeGreaterThanOrEqual(4.5);
        for (const g of grounds.dark) expect(ratioOf(y, hexLuminance(g)), `${c.p3.css} on ${g}`).toBeGreaterThanOrEqual(3);
        expect(ratioOf(y, hexLuminance(c.dark.fill))).toBeGreaterThanOrEqual(3);
      }
    });
  });
});
