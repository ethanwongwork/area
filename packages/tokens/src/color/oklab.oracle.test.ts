/**
 * Proves `oklab.ts` against colorjs.io — the CSS Color 4 reference implementation.
 *
 * This is the foundation check for the whole colour system. If it fails, every scale,
 * every contrast assertion, and every emitted token inherits the error, so it runs
 * before anything is built on top.
 */
import { describe, expect, it } from "vitest";
import Color from "colorjs.io";
import {
  DISPLAY_P3,
  SRGB,
  type Gamut,
  type Oklab,
  type Vec3,
  deltaEOk,
  labToLch,
  lchToLab,
  oklabToLinearRgb,
  oklchToRgb,
  parseHex,
  rgbToOklab,
  toHex,
} from "./oklab.ts";

/** Ottosson's published direct OKLab -> linear sRGB matrix, as an independent second opinion. */
function ottossonOklabToLinearSrgb({ L, a, b }: Oklab): Vec3 {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** A dense, deterministic sweep of the OKLCh space. */
function* sweep(): Generator<{ L: number; C: number; h: number }> {
  for (let L = 0; L <= 1.0001; L += 0.05) {
    for (let C = 0; C <= 0.32001; C += 0.02) {
      for (let h = 0; h < 360; h += 5) {
        yield { L: Math.min(L, 1), C, h };
      }
    }
  }
}

const GAMUTS: Array<[string, Gamut, "srgb" | "p3"]> = [
  ["sRGB", SRGB, "srgb"],
  ["display-p3", DISPLAY_P3, "p3"],
];

describe("oklab conversions vs colorjs.io", () => {
  it.each(GAMUTS)("OKLCh -> %s matches the reference to 1e-12", (_name, gamut, cjsId) => {
    let worst = 0;
    let worstAt = "";
    let n = 0;

    for (const c of sweep()) {
      n++;
      const mine = oklchToRgb(c, gamut);
      const ref = new Color("oklch", [c.L, c.C, c.h]).to(cjsId).coords;
      for (let i = 0; i < 3; i++) {
        const d = Math.abs(mine[i]! - ref[i]!);
        if (d > worst) {
          worst = d;
          worstAt = `L=${c.L.toFixed(2)} C=${c.C.toFixed(2)} h=${c.h}`;
        }
      }
    }

    // 21 lightness x 17 chroma x 72 hue steps.
    expect(n).toBe(25_704);
    expect(worst, `worst channel deviation at ${worstAt}`).toBeLessThan(1e-12);
  });

  it("agrees with Ottosson's direct sRGB matrix to 1e-6", () => {
    let worst = 0;
    for (const c of sweep()) {
      const lab = lchToLab(c);
      const viaXyz = oklabToLinearRgb(lab, SRGB);
      const direct = ottossonOklabToLinearSrgb(lab);
      for (let i = 0; i < 3; i++) worst = Math.max(worst, Math.abs(viaXyz[i]! - direct[i]!));
    }
    // Ottosson publishes 10 significant figures; the residual is his rounding, not ours.
    expect(worst).toBeLessThan(1e-6);
  });

  it.each(GAMUTS)("%s -> OKLab -> RGB round-trips exactly", (_name, gamut) => {
    let worst = 0;
    for (let r = 0; r <= 1.0001; r += 0.1) {
      for (let g = 0; g <= 1.0001; g += 0.1) {
        for (let b = 0; b <= 1.0001; b += 0.1) {
          const rgb: Vec3 = [Math.min(r, 1), Math.min(g, 1), Math.min(b, 1)];
          const back = oklchToRgb(labToLch(rgbToOklab(rgb, gamut)), gamut);
          for (let i = 0; i < 3; i++) worst = Math.max(worst, Math.abs(rgb[i]! - back[i]!));
        }
      }
    }
    // Exact to float64 noise, because every inverse matrix is derived rather than transcribed.
    expect(worst).toBeLessThan(1e-12);
  });

  it("places the achromatic anchors where they belong", () => {
    const white = labToLch(rgbToOklab([1, 1, 1], SRGB));
    expect(white.L).toBeCloseTo(1, 6);
    expect(white.C).toBeLessThan(1e-6);

    const black = labToLch(rgbToOklab([0, 0, 0], SRGB));
    expect(black.L).toBeCloseTo(0, 9);

    // Ottosson's worked example: sRGB mid grey #808080 sits near L 0.5999.
    const grey = labToLch(rgbToOklab(parseHex("#808080"), SRGB));
    expect(grey.L).toBeCloseTo(0.5999, 3);
    expect(grey.C).toBeLessThan(1e-6);
  });

  it("hex round-trips through 8-bit quantisation", () => {
    for (const hex of ["#000000", "#ffffff", "#3b63f6", "#d13234", "#05721d", "#7c5504"]) {
      expect(toHex(parseHex(hex))).toBe(hex);
    }
  });

  it("deltaEOk reports one JND as 0.02", () => {
    const a: Oklab = { L: 0.5, a: 0.1, b: 0.0 };
    const b: Oklab = { L: 0.5, a: 0.12, b: 0.0 };
    expect(deltaEOk(a, b)).toBeCloseTo(0.02, 12);
  });
});
