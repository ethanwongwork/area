import { describe, expect, it } from "vitest";
import { EASING_AXIS, SPRING, springStops } from "./easing.ts";
import { MOTION_AXIS } from "./motion.ts";
import { derivedTokens } from "../emit/base.ts";

/**
 * The curves' contract (docs/MOTION.md, "Tokens"; plan A5.1, A5.4, A5.5, 2026-11-11): effects never overshoot under any
 * Easing value, exits accelerate, Spring is a real spring on movement, and colour leaves on a third of Speed.
 */
const ys = (curve: string): number[] => {
  const cubic = curve.match(/^cubic-bezier\(([^)]+)\)$/);
  if (cubic) { const [, y1, , y2] = cubic[1]!.split(",").map(Number); return [y1!, y2!]; }
  const linear = curve.match(/^linear\((.*)\)$/);
  if (linear) return linear[1]!.split(",").map(stop => Number(stop.trim().split(/\s+/)[0]));
  if (curve === "linear") return [0, 1];
  throw new Error(`not a curve: ${curve}`);
};

describe("easing", () => {
  for (const preset of EASING_AXIS.presets) {
    const t = preset.tokens as Record<string, string>;
    it(`${preset.id}: effects, exits and in-out never pass their mark`, () => {
      for (const role of ["ease-effects", "ease-exit", "ease-in-out", "ease-in"]) {
        const curve = t[`--area-${role}`]!;
        expect(curve, role).toBeTruthy();
        for (const y of ys(curve)) expect(y, `${role} ${curve}`).toBeLessThanOrEqual(1);
      }
    });
    it(`${preset.id}: the exit accelerates (behind the straight line halfway through)`, () => {
      const [, x1, y1, x2, y2] = t["--area-ease-exit"]!.match(/^cubic-bezier\(([\d.]+), ([\d.]+), ([\d.]+), ([\d.]+)\)$/)!.map(Number);
      const b = (a: number, c: number, u: number) => 3 * (1 - u) ** 2 * u * a + 3 * (1 - u) * u * u * c + u ** 3;
      let lo = 0, hi = 1;
      for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (b(x1!, x2!, m) < 0.5) lo = m; else hi = m; }
      expect(b(y1!, y2!, lo)).toBeLessThan(0.5);
    });
  }
  it("Spring is a damped spring on movement, and its effects are Subtle's out", () => {
    const spring = EASING_AXIS.presets.find(p => p.id === "spring")!.tokens as Record<string, string>;
    const subtle = EASING_AXIS.presets.find(p => p.id === "subtle")!.tokens as Record<string, string>;
    expect(spring["--area-ease-out"]).toBe(SPRING);
    expect(spring["--area-ease-drawer"]).toBe(SPRING);
    expect(spring["--area-ease-effects"]).toBe(subtle["--area-ease-out"]);
    const stops = springStops();
    expect(stops[0]).toBe(0);
    expect(stops.at(-1)).toBe(1);
    expect(Math.max(...stops)).toBeGreaterThan(1);
    expect(Math.max(...stops)).toBeLessThan(1.01);
  });
  it("every value but Spring keeps its out curve for effects, so nothing moves at the defaults", () => {
    for (const preset of EASING_AXIS.presets.filter(p => p.id !== "spring")) {
      const t = preset.tokens as Record<string, string>;
      expect(t["--area-ease-effects"]).toBe(t["--area-ease-out"]);
    }
  });
});

describe("motion durations", () => {
  it("quick is a third of the Speed number at every step", () => {
    for (const preset of MOTION_AXIS.presets) {
      const t = preset.tokens as Record<string, string>;
      expect(parseFloat(t["--area-duration-quick"]!) * 3).toBeCloseTo(parseFloat(t["--area-duration-base"]!));
    }
  });
  it("the shared transition leaves colour on quick and the effects curve, and a press's scale on fast", () => {
    const transition = derivedTokens()["--area-transition"]!;
    for (const prop of ["background-color", "border-color", "color", "box-shadow"])
      expect(transition).toContain(`${prop} var(--area-duration-quick) var(--area-ease-effects)`);
    expect(transition).toContain("scale var(--area-duration-fast) var(--area-ease-out)");
  });
});
