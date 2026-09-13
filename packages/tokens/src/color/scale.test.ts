import { describe, expect, it } from "vitest";
import { ALL_SCALES, CHROMATIC_SCALES, NEUTRAL_SCALES } from "./presets.ts";
import { type Theme, assertScale, buildScale } from "./scale.ts";
import { LEVELS } from "./curves.ts";
import { parseHex } from "./oklab.ts";
import { WCAG, wcagContrastHex } from "./contrast.ts";

const THEMES: Theme[] = ["light", "dark"];
const CASES = THEMES.flatMap((theme) => ALL_SCALES.map((spec) => ({ theme, spec })));

describe.each(CASES)("$spec.id / $theme", ({ theme, spec }) => {
  const scale = buildScale(spec, theme);

  it("has one step per rung and every hex parses", () => {
    expect(scale.steps).toHaveLength(LEVELS.length);
    expect(scale.steps.map((s) => s.level)).toEqual([...LEVELS]);
    for (const step of scale.steps) {
      expect(step.hex, `${spec.id}-${step.level}`).toMatch(/^#[0-9a-f]{6}$/);
      expect(parseHex(step.hex).every((c) => c >= 0 && c <= 1)).toBe(true);
    }
  });

  it("descends monotonically from end to end", () => {
    expect(() => assertScale(scale)).not.toThrow();
    for (let i = 1; i < scale.steps.length; i++) {
      const delta = scale.steps[i]!.oklch.L - scale.steps[i - 1]!.oklch.L;
      expect(delta, `${spec.id} ${scale.steps[i - 1]!.level} -> ${scale.steps[i]!.level}`).toBeLessThan(0);
    }
  });

  it("keeps every rung distinguishable from its neighbour", () => {
    for (let i = 1; i < scale.steps.length; i++) {
      const a = scale.steps[i - 1]!;
      const b = scale.steps[i]!;
      expect(a.hex, `${spec.id}-${a.level} and -${b.level} are identical`).not.toBe(b.hex);
    }
  });

  it("solves alpha steps that composite back to the opaque rung", () => {
    for (const alpha of scale.alphas) {
      // Quantising the foreground to 8 bits is where alpha ramps visibly drift.
      expect(alpha.residual, `${spec.id}-a${alpha.level}`).toBeLessThan(0.01);
    }
  });
});

describe("the vendored palette", () => {
  it("is the ladder the export declares", () => {
    expect([...LEVELS]).toEqual([
      25, 50, 75, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850,
      900, 925, 950, 975,
    ]);
  });

  it("is finer at the ends than through the middle", () => {
    const gaps = LEVELS.slice(1).map((l, i) => l - LEVELS[i]!);
    expect(gaps[0]).toBe(25);
    expect(gaps.at(-1)).toBe(25);
    expect(Math.max(...gaps)).toBe(50);
  });

  it("is one ramp per family, read from both ends rather than two ramps", () => {
    for (const spec of ALL_SCALES) {
      const light = buildScale(spec, "light");
      const dark = buildScale(spec, "dark");
      expect(dark.steps.map((s) => s.hex), spec.id).toEqual(light.steps.map((s) => s.hex));
    }
  });

  it("does not claim a rung is a lightness", () => {
    // The property the previous, self-generated ladder had and this one deliberately does
    // not. Stadium pins each family's 500 to a contrast wall instead, so the hues sit at
    // different lightnesses at a shared rung -- by design, and by a wide enough margin
    // that treating a rung as a measurement would be wrong.
    const at350 = ALL_SCALES.map((s) => buildScale(s, "light").steps.find((x) => x.level === 350)!.oklch.L);
    expect(Math.max(...at350) - Math.min(...at350)).toBeGreaterThan(0.1);
  });

  it("closes that spread at the ends, where page grounds have to agree", () => {
    // The middle may diverge; the ends may not, or two tinted surfaces at rung 50 would
    // not read as the same elevation.
    for (const level of [25, 50, 75, 950, 975] as const) {
      const ls = ALL_SCALES.map((s) => buildScale(s, "light").steps.find((x) => x.level === level)!.oklch.L);
      expect(Math.max(...ls) - Math.min(...ls), `rung ${level}`).toBeLessThan(0.025);
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

  it("lands on the palette's own two walls", () => {
    // The label ladder clears AA with white at 500; the glyph ladder is pinned at 3:1 there
    // and only reaches AA at 600. Nothing in the code hardcodes the split -- `chooseSolid`
    // walks from peak chroma and measures. This asserts that doing so reproduces exactly
    // the division the palette's README documents.
    const LABEL_WALL = ["red", "blue", "indigo", "purple", "pink"];
    const GLYPH_WALL_WHITE = ["green", "teal", "cyan"];
    for (const id of LABEL_WALL) {
      const spec = CHROMATIC_SCALES.find((s) => s.id === id)!;
      expect(buildScale(spec, "light").solid.level, id).toBe(500);
    }
    for (const id of GLYPH_WALL_WHITE) {
      const spec = CHROMATIC_SCALES.find((s) => s.id === id)!;
      expect(buildScale(spec, "light").solid.level, id).toBe(600);
    }
    // Every family named above takes white; the remaining three are the warm hues with no
    // readable dark end, which take black at their chromatic peak instead.
    for (const id of [...LABEL_WALL, ...GLYPH_WALL_WHITE]) {
      expect(buildScale(CHROMATIC_SCALES.find((s) => s.id === id)!, "light").contrast.hex, id).toBe(
        "#ffffff",
      );
    }
    for (const id of ["orange", "yellow", "lime"]) {
      expect(buildScale(CHROMATIC_SCALES.find((s) => s.id === id)!, "light").contrast.hex, id).toBe(
        "#000000",
      );
    }
  });

  it("sits on the ladder rather than beside it", () => {
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
      // A higher rung is darker, so light darkens and dark lightens.
      expect(scale.solid.hover.light, spec.id).toBeGreaterThan(scale.solid.level);
      expect(scale.solid.hover.dark, spec.id).toBeLessThan(scale.solid.level);
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
      expect(buildScale(spec, "dark").solid.level, spec.id).toBe(buildScale(spec, "light").solid.level);
    }
  });
});

describe("the three neutral casts", () => {
  it("differ in temperature and almost nothing else", () => {
    // This is what makes contrast near-invariant across the tone axis. The palette's README
    // states it absolutely -- "only chroma differs between the three" -- and measured, that
    // is very nearly but not exactly true: lightness deviates by at most 0.0055 (rung 750)
    // and white-contrast by at most 0.23:1. That is 8-bit quantisation, not a design flaw,
    // and it is far too small to flip a threshold. The bound is asserted so it stays that
    // way rather than being taken on trust.
    const base = buildScale(NEUTRAL_SCALES.find((s) => s.id === "neutral")!, "light");
    for (const spec of NEUTRAL_SCALES) {
      const other = buildScale(spec, "light");
      for (let i = 0; i < LEVELS.length; i++) {
        const delta = Math.abs(other.steps[i]!.oklch.L - base.steps[i]!.oklch.L);
        expect(delta, `${spec.id}-${LEVELS[i]}`).toBeLessThan(0.006);
      }
    }
  });

  it("keeps neutral truly achromatic", () => {
    for (const step of buildScale(NEUTRAL_SCALES.find((s) => s.id === "neutral")!, "light").steps) {
      const [r, g, b] = parseHex(step.hex);
      expect(r, `neutral-${step.level}`).toBe(g);
      expect(g, `neutral-${step.level}`).toBe(b);
    }
  });

  it("holds warm as cool's exact mirror", () => {
    // +180 degrees in OKLCh is negating a and b in OKLab, so the two casts cannot drift
    // apart. Asserted on the rungs where the tint is large enough to measure.
    const cool = buildScale(NEUTRAL_SCALES.find((s) => s.id === "cool")!, "light");
    const warm = buildScale(NEUTRAL_SCALES.find((s) => s.id === "warm")!, "light");
    for (let i = 0; i < LEVELS.length; i++) {
      const c = cool.steps[i]!.oklch;
      const w = warm.steps[i]!.oklch;
      // Rung 975 is #010204 against #040100 -- every channel is under 4/255, where hue is
      // quantisation noise and the mirror reads 19 degrees off. Nothing renders a hue at
      // that lightness, so the assertion stops above it rather than pretending otherwise.
      if (c.L < 0.1 || w.L < 0.1) continue;
      if (c.C < 0.004 || w.C < 0.004) continue;
      // Distance from 180 degrees apart, not from equal.
      const opposition = Math.abs((((c.h - w.h) % 360) + 360) % 360 - 180);
      expect(opposition, `rung ${LEVELS[i]} is ${opposition.toFixed(1)} degrees off opposite`).toBeLessThan(15);
    }
  });

  it("keeps every cast a neutral", () => {
    for (const spec of NEUTRAL_SCALES) {
      for (const step of buildScale(spec, "light").steps) {
        expect(step.oklch.C, `${spec.id}-${step.level}`).toBeLessThan(0.02);
      }
    }
  });
});
