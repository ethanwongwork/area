/**
 * Locks the APCA implementation to its canonical anchor values.
 *
 * This exists because `apca-w3`'s constants have changed between revisions. The package
 * is pinned to an exact version; this test is what makes an accidental bump loud instead
 * of silently shifting every contrast verdict in the system.
 */
import { describe, expect, it } from "vitest";
import { apcaContrast, wcagContrastHex } from "./contrast.ts";

describe("APCA", () => {
  it("reproduces the published anchor values", () => {
    expect(apcaContrast("#000000", "#ffffff")).toBeCloseTo(106.04, 1);
    expect(apcaContrast("#ffffff", "#000000")).toBeCloseTo(-107.88, 1);
    expect(apcaContrast("#888888", "#ffffff")).toBeCloseTo(63.06, 1);
  });

  it("is polarity-dependent, so argument order is load-bearing", () => {
    const light = apcaContrast("#ffffff", "#222222");
    const dark = apcaContrast("#222222", "#ffffff");
    expect(light).toBeLessThan(0);
    expect(dark).toBeGreaterThan(0);
    expect(light).not.toBeCloseTo(-dark, 1);
  });
});

describe("WCAG 2.2", () => {
  it("reproduces the canonical ratios", () => {
    expect(wcagContrastHex("#000000", "#ffffff")).toBeCloseTo(21, 6);
    expect(wcagContrastHex("#ffffff", "#ffffff")).toBeCloseTo(1, 6);
    // #767676 on white is the textbook "exactly AA" value.
    expect(wcagContrastHex("#767676", "#ffffff")).toBeGreaterThanOrEqual(4.5);
    expect(wcagContrastHex("#777777", "#ffffff")).toBeLessThan(4.5);
  });

  it("is symmetric in its arguments, unlike APCA", () => {
    expect(wcagContrastHex("#3b63f6", "#ffffff")).toBeCloseTo(wcagContrastHex("#ffffff", "#3b63f6"), 12);
  });
});
