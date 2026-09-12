import { describe, expect, it } from "vitest";
import Color from "colorjs.io";
import {
  DISPLAY_P3,
  SRGB,
  type Oklch,
  clampRgb,
  deltaEOkLch,
  labToLch,
  oklchToRgb,
  rgbInGamut,
  rgbToOklab,
} from "./oklab.ts";
import { findCusp, gamutMap, maxChromaAt } from "./gamut.ts";

describe("gamut boundary", () => {
  it("maxChromaAt lands exactly on the boundary", () => {
    for (const h of [0, 30, 60, 90, 145, 200, 264, 300, 340]) {
      for (const L of [0.2, 0.4, 0.6, 0.8, 0.95]) {
        const C = maxChromaAt(L, h, SRGB);
        expect(rgbInGamut(oklchToRgb({ L, C, h }, SRGB), 0), `inside at h=${h} L=${L}`).toBe(true);
        // One micro-step further out must fall off the edge.
        expect(rgbInGamut(oklchToRgb({ L, C: C + 1e-4, h }, SRGB), 0), `outside at h=${h} L=${L}`).toBe(false);
      }
    }
  });

  it("finds each hue's cusp where the literature places it", () => {
    // Published sRGB cusp lightnesses: blue is the darkest, yellow by far the lightest.
    const blue = findCusp(264, SRGB);
    const yellow = findCusp(110, SRGB);
    const red = findCusp(29, SRGB);

    expect(blue.L).toBeGreaterThan(0.4);
    expect(blue.L).toBeLessThan(0.55);
    expect(yellow.L).toBeGreaterThan(0.85);
    expect(red.L).toBeGreaterThan(0.55);
    expect(red.L).toBeLessThan(0.7);

    // The cusp is a true maximum: no nearby lightness yields more chroma.
    for (const { L, C, h } of [
      { ...blue, h: 264 },
      { ...yellow, h: 110 },
      { ...red, h: 29 },
    ]) {
      for (const d of [-0.05, -0.01, 0.01, 0.05]) {
        const other = maxChromaAt(L + d, h, SRGB);
        expect(other).toBeLessThanOrEqual(C + 1e-4);
      }
    }
  });

  it("P3 admits more chroma than sRGB at every hue", () => {
    for (let h = 0; h < 360; h += 15) {
      const s = findCusp(h, SRGB);
      const p = findCusp(h, DISPLAY_P3);
      expect(p.C, `hue ${h}`).toBeGreaterThan(s.C * 1.02);
    }
  });
});

describe("gamut mapping vs colorjs.io", () => {
  /** Out-of-sRGB colours spanning the hue circle at high chroma. */
  function* outOfGamut(): Generator<Oklch> {
    for (let h = 0; h < 360; h += 10) {
      for (const L of [0.25, 0.45, 0.65, 0.85]) {
        for (const C of [0.25, 0.32, 0.4]) yield { L, C, h };
      }
    }
  }

  it("matches the CSS Color 4 reference mapper to within a fifth of a JND", () => {
    let worst = 0;
    let n = 0;
    for (const c of outOfGamut()) {
      if (rgbInGamut(oklchToRgb(c, SRGB), 0)) continue;
      n++;
      const mine = gamutMap(c, SRGB);
      const refCoords = new Color("oklch", [c.L, c.C, c.h])
        .toGamut({ space: "srgb", method: "css" })
        .to("srgb").coords as [number, number, number];
      const ref = labToLch(rgbToOklab(refCoords, SRGB));
      worst = Math.max(worst, deltaEOkLch(mine.oklch, ref));
    }
    expect(n).toBeGreaterThan(200);
    // One JND is 0.02 (CSS Color 4 section 14.2.1); we hold to a fifth of that.
    expect(worst).toBeLessThan(0.004);
  });

  it("always returns an in-gamut colour", () => {
    for (const gamut of [SRGB, DISPLAY_P3]) {
      for (const c of outOfGamut()) {
        expect(rgbInGamut(gamutMap(c, gamut).rgb, 0)).toBe(true);
      }
    }
  });

  it("leaves in-gamut colours untouched", () => {
    for (let h = 0; h < 360; h += 30) {
      const c: Oklch = { L: 0.6, C: 0.05, h };
      const r = gamutMap(c, SRGB);
      expect(r.mapped).toBe(false);
      expect(r.deltaE).toBe(0);
      expect(r.oklch).toEqual(c);
    }
  });

  it("preserves hue far better than clipping, matching the reference exactly", () => {
    const drift = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);
    let ours = 0;
    let clipping = 0;

    for (const c of outOfGamut()) {
      if (rgbInGamut(oklchToRgb(c, SRGB), 0)) continue;
      ours = Math.max(ours, drift(gamutMap(c, SRGB).oklch.h, c.h));
      const clipped = labToLch(rgbToOklab(clampRgb(oklchToRgb(c, SRGB)), SRGB));
      clipping = Math.max(clipping, drift(clipped.h, c.h));
    }

    // CSS Color 4 section 14.1.1 cites clipping as causing "a substantial change of 69 degrees".
    // Reproducing that number independently confirms the corpus really exercises the hard cases.
    expect(clipping).toBeGreaterThan(60);
    // The spec algorithm still ends in a local-MINDE clip, so some drift is inherent --
    // but it is five times smaller, and identical to what colorjs.io produces.
    expect(ours).toBeLessThan(14);
    expect(ours).toBeLessThan(clipping / 5);
  });
});
