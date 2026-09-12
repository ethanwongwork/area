import { describe, expect, it } from "vitest";
import { ALL_SCALES, CHROMATIC_SCALES } from "./presets.ts";
import { type Theme, buildScale } from "./scale.ts";
import { SRGB, oklchToRgb, parseHex, rgbInGamut } from "./oklab.ts";
import { WCAG, wcagContrastHex } from "./contrast.ts";

const THEMES: Theme[] = ["light", "dark"];
const CASES = THEMES.flatMap((theme) => ALL_SCALES.map((spec) => ({ theme, spec })));

describe.each(CASES)("$spec.id / $theme", ({ theme, spec }) => {
  const scale = buildScale(spec, theme);

  it("has twelve steps, all inside sRGB", () => {
    expect(scale.steps).toHaveLength(12);
    for (const step of scale.steps) {
      expect(rgbInGamut(parseHex(step.hex), 0), `step ${step.step}`).toBe(true);
      expect(rgbInGamut(oklchToRgb(step.oklch, SRGB), 0), `step ${step.step}`).toBe(true);
    }
  });

  it("moves monotonically through the chrome band, so hover and active are always distinct", () => {
    // Steps 1-8 are backgrounds and borders; they must march in one direction with no
    // repeats, or a hover state becomes invisible.
    const chrome = scale.steps.slice(0, 8).map((s) => s.oklch.L);
    for (let i = 1; i < chrome.length; i++) {
      const delta = chrome[i]! - chrome[i - 1]!;
      if (theme === "light") expect(delta, `step ${i} -> ${i + 1}`).toBeLessThan(-0.005);
      else expect(delta, `step ${i} -> ${i + 1}`).toBeGreaterThan(0.005);
    }
  });

  it("keeps every step distinguishable from its neighbour", () => {
    for (let i = 1; i < 12; i++) {
      const a = scale.steps[i - 1]!;
      const b = scale.steps[i]!;
      expect(a.hex, `steps ${i} and ${i + 1} are identical`).not.toBe(b.hex);
    }
  });

  it("solves alpha steps that composite back to the solid step", () => {
    for (const alpha of scale.alphas) {
      // Quantising the foreground to 8 bits is where alpha ramps visibly drift.
      expect(alpha.residual, `alpha step ${alpha.step}`).toBeLessThan(0.01);
    }
  });
});

describe("solid fill", () => {
  it.each(THEMES)("carries its declared foreground at AA in %s", (theme) => {
    for (const spec of CHROMATIC_SCALES) {
      const scale = buildScale(spec, theme);
      expect(scale.contrast.wcag, `${spec.id} solid on ${scale.contrast.hex}`).toBeGreaterThanOrEqual(
        WCAG.TEXT,
      );
    }
  });

  it.each(THEMES)("keeps the hover step visibly distinct from rest in %s", (theme) => {
    for (const spec of CHROMATIC_SCALES) {
      const scale = buildScale(spec, theme);
      const rest = scale.steps[8]!;
      const hover = scale.steps[9]!;
      const delta = Math.abs(hover.oklch.L - rest.oklch.L);
      expect(delta, `${spec.id} 9 -> 10`).toBeGreaterThan(0.02);
      // and still readable with the same foreground
      expect(wcagContrastHex(scale.contrast.hex, hover.hex), `${spec.id} hover`).toBeGreaterThanOrEqual(
        WCAG.LARGE_TEXT,
      );
    }
  });

  it("holds its identity across themes, so a brand colour is one colour", () => {
    for (const spec of CHROMATIC_SCALES) {
      const light = buildScale(spec, "light").steps[8]!;
      const dark = buildScale(spec, "dark").steps[8]!;
      expect(dark.hex, spec.id).toBe(light.hex);
    }
  });
});

describe("neutrals", () => {
  it("differ only in temperature, never in lightness", () => {
    // Swapping gray for slate must not move a single contrast ratio.
    for (const theme of THEMES) {
      const gray = buildScale(ALL_SCALES.find((s) => s.id === "gray")!, theme);
      for (const id of ["slate", "sand"]) {
        const other = buildScale(ALL_SCALES.find((s) => s.id === id)!, theme);
        for (let i = 0; i < 12; i++) {
          expect(other.steps[i]!.oklch.L, `${id} step ${i + 1}`).toBeCloseTo(gray.steps[i]!.oklch.L, 2);
        }
      }
    }
  });

  it("keeps gray truly achromatic", () => {
    for (const theme of THEMES) {
      const gray = buildScale(ALL_SCALES.find((s) => s.id === "gray")!, theme);
      for (const step of gray.steps) {
        const [r, g, b] = parseHex(step.hex);
        expect(r, `step ${step.step}`).toBe(g);
        expect(g, `step ${step.step}`).toBe(b);
      }
    }
  });
});
