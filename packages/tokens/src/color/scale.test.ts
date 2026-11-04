import { describe, expect, it } from "vitest";
import { ALL_SCALES, CHROMATIC_SCALES, NEUTRAL_SCALES } from "./presets.ts";
import { type Theme, WHITE, assertScale, buildScale } from "./scale.ts";
import { DARK_CHROMA_CAP, DARK_LIGHTNESS_LIFT, DARK_TONAL_CHROMA, INVERSION, LEVELS, LIGHT_TONAL_CHROMA, TINT_HUE_LEVEL, VIVID_PEAK_CHROMA } from "./curves.ts";
import { maxChromaAt } from "./gamut.ts";
import { SRGB } from "./oklab.ts";
import { labToLch, parseHex, rgbToOklab } from "./oklab.ts";
import { APCA, WCAG, apcaMagnitude, relativeLuminance, wcagContrastHex } from "./contrast.ts";
import { TONAL_Y } from "./layers.ts";
import PALETTE from "./palette.json" with { type: "json" };

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
    // not. Area pins each family's 500 to a contrast wall instead, so the hues sit at
    // different lightnesses at a shared rung -- by design, and by a wide enough margin
    // that treating a rung as a measurement would be wrong.
    const at350 = ALL_SCALES.map((s) => buildScale(s, "light").steps.find((x) => x.level === 350)!.oklch.L);
    expect(Math.max(...at350) - Math.min(...at350)).toBeGreaterThan(0.1);
  });

  it("closes that spread at the shared endpoints", () => {
    // The middle may diverge; the light surface rungs and untouched near-black endpoint
    // may not. Chromatic 950 is deliberately lifted and is not a neutral surface ground.
    for (const level of [25, 50, 75, 975] as const) {
      const ls = ALL_SCALES.map((s) => buildScale(s, "light").steps.find((x) => x.level === level)!.oklch.L);
      expect(Math.max(...ls) - Math.min(...ls), `rung ${level}`).toBeLessThan(0.025);
    }
    const at950 = CHROMATIC_SCALES.map((s) => buildScale(s, "light").steps.find((x) => x.level === 950)!.oklch.L);
    expect(Math.max(...at950) - Math.min(...at950), "chromatic rung 950").toBeLessThan(0.025);
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
    const GLYPH_WALL_WHITE = ["green", "cyan"];
    for (const id of LABEL_WALL) {
      const spec = CHROMATIC_SCALES.find((s) => s.id === id)!;
      expect(buildScale(spec, "light").solid.level.light, id).toBe(500);
    }
    for (const id of GLYPH_WALL_WHITE) {
      const spec = CHROMATIC_SCALES.find((s) => s.id === id)!;
      expect(buildScale(spec, "light").solid.level.light, id).toBe(600);
    }
    // The bounded +0.01 lightness lift at 600 puts teal just below the white-label wall;
    // its measured solid selection correctly retreats one rung instead of weakening it.
    expect(buildScale(CHROMATIC_SCALES.find((s) => s.id === "teal")!, "light").solid.level.light).toBe(650);
    // Every family named above takes white; the remaining three are the warm hues with no
    // readable dark end, which take black at their chromatic peak instead.
    for (const id of [...LABEL_WALL, ...GLYPH_WALL_WHITE, "teal"]) {
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
      expect(LEVELS, spec.id).toContain(scale.solid.level.light);
      expect(LEVELS, spec.id).toContain(scale.solid.level.dark);
      expect(LEVELS, spec.id).toContain(scale.solid.hover.light);
      expect(LEVELS, spec.id).toContain(scale.solid.hover.dark);
    }
  });

  it("uses one adjacent hover step while preserving its foreground", () => {
    for (const spec of CHROMATIC_SCALES) {
      const scale = buildScale(spec, "light");
      for (const theme of THEMES) {
        expect(Math.abs(LEVELS.indexOf(scale.solid.hover[theme]) - LEVELS.indexOf(scale.solid.level[theme])), spec.id).toBe(1);
      }
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
        ).toBeGreaterThanOrEqual(WCAG.TEXT);
      }
    }
  });

  it("holds its identity across themes, so a accent colour is one colour", () => {
    for (const spec of CHROMATIC_SCALES) {
      // Chromatic only: a neutral's solid crosses the ladder with the theme, by design.
      const light = buildScale(spec, "light").solid.level;
      expect(buildScale(spec, "dark").solid.level, spec.id).toEqual(light);
      expect(light.light, spec.id).toBe(light.dark);
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

describe("chroma across families", () => {
  /*
   * The light end is the one place the palette's own anchor leaves families free to
   * diverge. A rung is pinned against *white*, which says nothing about that family beside
   * its ten siblings at the same rung -- and sRGB will hold far more chroma in a pale green
   * than in a pale blue, so the families that can be bright, are.
   *
   * Measured before `CHROMA_TRIM` existed, rung 150 ran 0.051 to 0.138 -- lime and green at
   * nearly twice their peers, which is what makes a green tint read as a wash where a blue
   * one reads as a tint. This is the bound that keeps it closed, and the reason the trim
   * cannot quietly be dropped.
   */
  const LIGHT_END: Array<[number, number]> = [
    [100, 0.035],
    [150, 0.06],
    [200, 0.055],
    [250, 0.05],
  ];

  it.each(LIGHT_END)("holds the spread at rung %i under %f", (level, bound) => {
    const index = LEVELS.indexOf(level as (typeof LEVELS)[number]);
    const chromas = CHROMATIC_SCALES.map((spec) => ({
      id: spec.id,
      C: buildScale(spec, "light").steps[index]!.oklch.C,
    }));
    const lo = chromas.reduce((a, b) => (b.C < a.C ? b : a));
    const hi = chromas.reduce((a, b) => (b.C > a.C ? b : a));
    expect(
      hi.C - lo.C,
      `rung ${level}: ${hi.id} ${hi.C.toFixed(3)} against ${lo.id} ${lo.C.toFixed(3)}`,
    ).toBeLessThan(bound);
  });

  it("applies only the declared dark-end lightness lift and chroma ceiling", () => {
    // The dark adjustment is an explicit bounded curve. It may desaturate indigo and
    // purple to keep them in balance, but it cannot move undeclared rungs, exceed the
    // family's established peak, or paint outside sRGB.
    for (const spec of CHROMATIC_SCALES) {
      const built = buildScale(spec, "light");
      for (const step of built.steps) {
        if (step.level <= 500) continue;
        const families = PALETTE.families as Record<string, Record<string, { oklch: { L: number; C: number } }>>;
        const rung = families[spec.id]?.[String(step.level)];
        if (!rung) continue;
        const expectedLift = DARK_LIGHTNESS_LIFT[step.level] ?? 0;
        expect(step.oklch.L, `${spec.id}-${step.level} lightness`).toBeCloseTo(rung.oklch.L + expectedLift, 3);
        const familyPeak = Math.max(...Object.values(families[spec.id]!).map((x) => x.oklch.C));
        expect(step.oklch.C, `${spec.id}-${step.level} family peak`).toBeLessThanOrEqual(familyPeak + 0.001);
        expect(step.oklch.C, `${spec.id}-${step.level} sRGB boundary`).toBeLessThanOrEqual(
          maxChromaAt(step.oklch.L, step.oklch.h, SRGB) + 0.001,
        );
        const cap = DARK_CHROMA_CAP[step.level];
        if (cap !== undefined) {
          expect(step.oklch.C, `${spec.id}-${step.level} dark cap`).toBeLessThanOrEqual(cap * step.oklch.L + 0.001);
        }
      }
    }
  });

  it("chooses the maximum-chroma accessible tonal foreground and surface sequence", () => {
    const neutral = buildScale(NEUTRAL_SCALES.find(spec => spec.id === "neutral")!, "light");
    const neutralHex = (position: (typeof INVERSION)[keyof typeof INVERSION][Theme]) =>
      position === "white" ? WHITE : neutral.steps.find(step => step.level === position)!.hex;
    const sequences = {
      light: [[25, 50, 75], [50, 75, 100], [75, 100, 150], [100, 150, 200]],
      dark: [[850, 800, 750], [800, 750, 700], [750, 700, 650], [700, 650, 600]],
    } as const;

    for (const spec of CHROMATIC_SCALES) {
      const scale = buildScale(spec, "light");
      const byLevel = new Map(scale.steps.map(step => [step.level, step]));
      for (const theme of THEMES) {
        const ambient = [INVERSION.page, INVERSION.surface, INVERSION.subtle].map(slot => neutralHex(slot[theme]));
        const selectedForeground = byLevel.get(scale.tonal.foreground[theme])!;
        const selectedSurfaces = [scale.tonal.surface[theme], scale.tonal.surfaceHover[theme], scale.tonal.surfaceActive[theme]];
        const passes = (foreground: typeof selectedForeground, surfaceLevels: readonly number[]) =>
          [...ambient, ...surfaceLevels.map(level => byLevel.get(level as typeof selectedForeground.level)!.hex)].every(background =>
            wcagContrastHex(foreground.hex, background) >= WCAG.TEXT &&
            (theme === "light" || apcaMagnitude(foreground.hex, background) >= APCA.CONTENT)
          );

        const moreChromatic = scale.steps.filter(step => step.oklch.C > selectedForeground.oklch.C + 1e-9);
        // In light the tints paint from the neutral fills (2026-11-02): the ink is the most chromatic step that reads on
        // what paints and stays under the Layers bound; the rung sequence no longer paints.
        if (theme === "light") {
          const grounds = [...ambient, ...scale.tonal.paint.light];
          const reads = (hex: string) => grounds.every(background => wcagContrastHex(hex, background) >= WCAG.TEXT) && relativeLuminance(parseHex(hex)) <= TONAL_Y;
          expect(reads(selectedForeground.hex), `${spec.id}/light foreground ${selectedForeground.level} reads`).toBe(true);
          expect(moreChromatic.some(step => reads(step.hex)), `${spec.id}/light foreground ${selectedForeground.level}`).toBe(false);
          continue;
        }
        expect(
          moreChromatic.some(step => sequences[theme].some(surfaceLevels => passes(step, surfaceLevels))),
          `${spec.id}/${theme} foreground ${selectedForeground.level}`,
        ).toBe(false);

        const selectedSurfaceChroma = selectedSurfaces.reduce((sum, level) => sum + byLevel.get(level)!.oklch.C, 0);
        const bestSurfaceChroma = Math.max(...sequences[theme]
          .filter(surfaceLevels => passes(selectedForeground, surfaceLevels))
          .map(surfaceLevels => surfaceLevels.reduce((sum, level) => sum + byLevel.get(level)!.oklch.C, 0)));
        expect(selectedSurfaceChroma, `${spec.id}/${theme} surfaces`).toBeCloseTo(bestSurfaceChroma, 9);
      }
    }
  });

  // Owner, 2026-10-28 (dark soft tones, option A) and 2026-11-02 (light): a tonal surface is
  // the neutral control fill of its state with the tone's light-end hue at DARK_TONAL_CHROMA or LIGHT_TONAL_CHROMA, never
  // a palette rung; where sRGB holds less near white (light blue), the chroma is what it can show.
  it("paints tonal surfaces at the neutral control lightness and the quiet chroma, in both modes", () => {
    const controls = [INVERSION.component, INVERSION.componentHover, INVERSION.componentActive];
    for (const theme of ["light", "dark"] as const) {
      const neutralL = controls.map(slot => PALETTE.families.neutral[String(slot[theme]) as "800"].oklch.L);
      const chroma = theme === "light" ? LIGHT_TONAL_CHROMA : DARK_TONAL_CHROMA;
      for (const spec of CHROMATIC_SCALES) {
        const scale = buildScale(spec, theme);
        const hue = scale.steps.find(step => step.level === TINT_HUE_LEVEL)!.oklch.h;
        const share = Math.min(1, Math.max(...scale.steps.map(step => step.oklch.C)) / VIVID_PEAK_CHROMA);
        scale.tonal.paint[theme].forEach((hex, i) => {
          const lch = labToLch(rgbToOklab(parseHex(hex), SRGB));
          if (theme === "light") {
            // Light: the chroma holds; the lightness is the fill's, or as far under it as sRGB needs to show it.
            expect(lch.C, `${theme} ${spec.id} C ${i}`).toBeCloseTo(chroma[i]! * share, 2);
            expect(lch.L, `${theme} ${spec.id} L ${i}`).toBeLessThan(neutralL[i]! + 0.005);
            if (maxChromaAt(neutralL[i]!, hue, SRGB) >= chroma[i]! * share) expect(lch.L, `${theme} ${spec.id} L ${i}`).toBeCloseTo(neutralL[i]!, 2);
          } else {
            // Dark: the lightness is the fill's; the chroma is the ladder's or what sRGB shows there.
            expect(lch.L, `${theme} ${spec.id} L ${i}`).toBeCloseTo(neutralL[i]!, 2);
            expect(lch.C, `${theme} ${spec.id} C ${i}`).toBeCloseTo(Math.min(chroma[i]! * share, maxChromaAt(neutralL[i]!, hue, SRGB)), 2);
          }
        });
      }
    }
  });
});
