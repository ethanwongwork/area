import { describe, expect, it } from "vitest";
import { ALL_SCALES, CHROMATIC_SCALES, NEUTRAL_SCALES } from "./presets.ts";
import { type Theme, assertLadder, buildScale } from "./scale.ts";
import { CHROMA_FRACTION, LEVELS, levelLightness } from "./curves.ts";
import { SRGB, oklchToRgb, parseHex, rgbInGamut } from "./oklab.ts";
import { maxChromaAt } from "./gamut.ts";
import { WCAG, wcagContrastHex } from "./contrast.ts";

const THEMES: Theme[] = ["light", "dark"];
const CASES = THEMES.flatMap((theme) => ALL_SCALES.map((spec) => ({ theme, spec })));

describe.each(CASES)("$spec.id / $theme", ({ theme, spec }) => {
  const scale = buildScale(spec, theme);

  it("has one step per level, all inside sRGB", () => {
    expect(scale.steps).toHaveLength(LEVELS.length);
    for (const step of scale.steps) {
      // The shipped value is held to the boundary exactly.
      expect(rgbInGamut(parseHex(step.hex), 0), `${spec.id}-${step.level}`).toBe(true);
      // The unquantised float is held to the library's own tolerance. Level 100 sits on
      // the white point, where an OKLab round trip lands 1.5e-15 outside unity -- double
      // precision, not a gamut error, and the hex it produces is exactly #ffffff.
      expect(rgbInGamut(oklchToRgb(step.oklch, SRGB)), `${spec.id}-${step.level}`).toBe(true);
    }
  });

  it("is named by its own lightness", () => {
    // The whole premise of the ladder. `blue-58` must be L 0.58, or the token lies.
    expect(() => assertLadder(scale)).not.toThrow();
    for (const step of scale.steps) {
      expect(step.oklch.L, `${spec.id}-${step.level}`).toBeCloseTo(levelLightness(step.level), 2);
    }
  });

  it("descends monotonically from end to end", () => {
    // The ordinal scale this replaced was non-monotonic in twelve places -- green, teal,
    // cyan and blue all had a step 11 lighter than their step 10, which meant "secondary
    // text" was lighter than "solid hover" and nobody noticed. Assert the whole ramp, not
    // a band of it.
    for (let i = 1; i < scale.steps.length; i++) {
      const delta = scale.steps[i]!.oklch.L - scale.steps[i - 1]!.oklch.L;
      expect(delta, `${spec.id} ${scale.steps[i - 1]!.level} -> ${scale.steps[i]!.level}`).toBeLessThan(
        -0.005,
      );
    }
  });

  it("keeps every step distinguishable from its neighbour", () => {
    for (let i = 1; i < scale.steps.length; i++) {
      const a = scale.steps[i - 1]!;
      const b = scale.steps[i]!;
      expect(a.hex, `${spec.id}-${a.level} and -${b.level} are identical`).not.toBe(b.hex);
    }
  });

  it("holds one hue for the whole scale", () => {
    // There is no drift table. Any rotation here would be the gamut mapper moving hue,
    // which it is not supposed to do. Near-achromatic steps are skipped: hue is
    // meaningless below the chroma floor and quantisation dominates it.
    const chromatic = scale.steps.filter((s) => s.oklch.C > 0.01);
    for (const step of chromatic) {
      const delta = Math.abs(((step.oklch.h - spec.hue + 540) % 360) - 180);
      expect(delta, `${spec.id}-${step.level} hue`).toBeLessThan(1);
    }
  });

  it("solves alpha steps that composite back to the opaque step", () => {
    for (const alpha of scale.alphas) {
      // Quantising the foreground to 8 bits is where alpha ramps visibly drift.
      expect(alpha.residual, `${spec.id}-a${alpha.level}`).toBeLessThan(0.01);
    }
  });
});

describe("the ladder", () => {
  it("is a uniform grid, so a level's neighbour can be named without a lookup", () => {
    const gaps = new Set(LEVELS.slice(1).map((l, i) => LEVELS[i]! - l));
    expect([...gaps]).toEqual([5]);
    // Every name is a round number on that grid. This is the property the earlier
    // 99/97/94/90 ladder lacked: nothing there distinguished 99 from 98, so the precision
    // the names implied was not real.
    for (const level of LEVELS) expect(level % 5, `level ${level}`).toBe(0);
  });

  it("gives every hue the same lightness at the same level", () => {
    // The property the ordinal scale could not promise: its step 9 ranged L 0.548 to 0.910.
    for (const level of LEVELS) {
      const lightnesses = ALL_SCALES.map(
        (spec) => buildScale(spec, "light").steps.find((s) => s.level === level)!.oklch.L,
      );
      const spread = Math.max(...lightnesses) - Math.min(...lightnesses);
      expect(spread, `level ${level} spread`).toBeLessThan(0.01);
    }
  });

  it("is one ramp, read from both ends rather than two ramps", () => {
    for (const spec of ALL_SCALES) {
      const light = buildScale(spec, "light");
      const dark = buildScale(spec, "dark");
      expect(dark.steps.map((s) => s.hex), spec.id).toEqual(light.steps.map((s) => s.hex));
    }
  });
});

describe("chroma", () => {
  it("claims most of what the gamut allows at every level", () => {
    // "As bright as possible" is only meaningful against the boundary. The previous
    // generator multiplied a bell curve by the gamut's own falloff and desaturated twice:
    // teal and cyan peaked at C 0.09 where violet reached 0.24.
    for (const spec of CHROMATIC_SCALES) {
      for (const step of buildScale(spec, "light").steps) {
        const ceiling = maxChromaAt(step.oklch.L, spec.hue, SRGB);
        // Level 100 is pure white, where the gamut allows no chroma at all. That is the
        // honest consequence of naming a level after its lightness, not a gap in the ramp.
        if (ceiling < 1e-4) {
          expect(step.oklch.C, `${spec.id}-${step.level}`).toBeLessThan(1e-4);
          continue;
        }
        // Compared against the declared curve rather than a literal, so the test tracks
        // CHROMA_FRACTION instead of drifting out of step with it.
        expect(step.oklch.C / ceiling, `${spec.id}-${step.level}`).toBeGreaterThanOrEqual(
          Math.min(...CHROMA_FRACTION) - 0.01,
        );
        expect(step.oklch.C, `${spec.id}-${step.level}`).toBeLessThanOrEqual(ceiling + 1e-6);
      }
    }
  });

  it("gets each hue close to its own cusp, which is all a generator can do", () => {
    // Hues are not comparable to each other -- sRGB simply gives violet more chroma than
    // cyan -- so comparing their peaks measures the gamut, not this code. What is testable
    // is whether each hue reaches its *own* ceiling: the cusp is the most chromatic colour
    // that hue has, and a ladder only lands near it if the rungs fall in the right places.
    for (const spec of CHROMATIC_SCALES) {
      const scale = buildScale(spec, "light");
      const peak = Math.max(...scale.steps.map((s) => s.oklch.C));
      expect(peak / scale.cusp.C, spec.id).toBeGreaterThan(0.85);
    }
  });
});

describe("solid fill", () => {
  it.each(THEMES)("carries its declared foreground at AA in %s", (theme) => {
    for (const spec of CHROMATIC_SCALES) {
      const scale = buildScale(spec, theme);
      expect(
        scale.contrast.wcag,
        `${spec.id} solid (${spec.id}-${scale.solid.level}) on ${scale.contrast.hex}`,
      ).toBeGreaterThanOrEqual(WCAG.TEXT);
    }
  });

  it("sits on the ladder rather than beside it", () => {
    // The binary search this replaced produced a lightness that was not any level of the
    // scale -- a colour smuggled in next to the ramp rather than drawn from it.
    for (const spec of CHROMATIC_SCALES) {
      const scale = buildScale(spec, "light");
      expect(LEVELS, spec.id).toContain(scale.solid.level);
      expect(LEVELS, spec.id).toContain(scale.solid.hover.light);
      expect(LEVELS, spec.id).toContain(scale.solid.hover.dark);
    }
  });

  it("moves its hover away from each theme's own page background", () => {
    for (const spec of CHROMATIC_SCALES) {
      const scale = buildScale(spec, "light");
      // Light page: hover is darker. Dark page: hover is lighter. Levels *are* lightness.
      expect(scale.solid.hover.light, spec.id).toBeLessThan(scale.solid.level);
      expect(scale.solid.hover.dark, spec.id).toBeGreaterThan(scale.solid.level);
    }
  });

  it("keeps the hover readable with the same foreground", () => {
    for (const theme of THEMES) {
      for (const spec of CHROMATIC_SCALES) {
        const scale = buildScale(spec, theme);
        const hover = scale.steps.find((s) => s.level === scale.solid.hover[theme])!;
        expect(
          wcagContrastHex(scale.contrast.hex, hover.hex),
          `${spec.id} hover in ${theme}`,
        ).toBeGreaterThanOrEqual(WCAG.LARGE_TEXT);
      }
    }
  });

  it("holds its identity across themes, so a brand colour is one colour", () => {
    for (const spec of CHROMATIC_SCALES) {
      const light = buildScale(spec, "light");
      const dark = buildScale(spec, "dark");
      expect(dark.solid.level, spec.id).toBe(light.solid.level);
    }
  });
});

describe("neutrals", () => {
  it("differ only in temperature, never in lightness", () => {
    // Swapping gray for slate must not move a single contrast ratio.
    const gray = buildScale(NEUTRAL_SCALES.find((s) => s.id === "gray")!, "light");
    for (const spec of NEUTRAL_SCALES) {
      const other = buildScale(spec, "light");
      for (let i = 0; i < LEVELS.length; i++) {
        expect(other.steps[i]!.oklch.L, `${spec.id}-${LEVELS[i]}`).toBeCloseTo(
          gray.steps[i]!.oklch.L,
          2,
        );
      }
    }
  });

  it("keeps gray truly achromatic", () => {
    const gray = buildScale(NEUTRAL_SCALES.find((s) => s.id === "gray")!, "light");
    for (const step of gray.steps) {
      const [r, g, b] = parseHex(step.hex);
      expect(r, `gray-${step.level}`).toBe(g);
      expect(g, `gray-${step.level}`).toBe(b);
    }
  });

  it("keeps every tinted neutral a neutral", () => {
    // A tint that climbs past this stops reading as grey and starts reading as a colour.
    for (const spec of NEUTRAL_SCALES) {
      for (const step of buildScale(spec, "light").steps) {
        expect(step.oklch.C, `${spec.id}-${step.level}`).toBeLessThan(0.02);
      }
    }
  });
});
