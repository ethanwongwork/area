/**
 * The geometry group as one product (sweeps/geometry-sweep.ts; plan A1, A3, docs/research/system-status-2026-11-18/
 * README.md): Type × Density × Corner × Stroke width × Focus ring × Selected stroke × Contrast, 36,450 combinations.
 * Every length resolves to a finite number; corners stay within half the height; targets keep 24px; focus draws on
 * whole pixels; the control ladder never decreases and (a held decision at type 12 Compact) strictly increases.
 * Today's misses are held in known-failures.ts; anything else fails, and so does a fixed entry left in.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { DENSITY_LEVELS } from "../axes/density.ts";
import { typeSizeTokens } from "../axes/type-size.ts";
import { axisById } from "../axes/registry.ts";
import { AXES } from "../axes/registry.ts";
import { NUMERIC_TOKENS, resolverFor, runGeometrySweep } from "./geometry-sweep.ts";
import { printMeasured, ratchet, ratchetProblems } from "./ratchet.ts";

let sweep: ReturnType<typeof runGeometrySweep>;
beforeAll(() => { sweep = runGeometrySweep(); }, 120_000);

const defaults = () => Object.assign({}, ...AXES.map(a => a.presets.find(p => p.id === a.defaultPreset)!.tokens)) as Record<string, string>;

describe("geometry sweep: the model it measures", () => {
  it("crosses every preset of the six settings at three Contrast levels", () => {
    const count = ["type", "density", "radius", "surface", "focus-ring", "selected-stroke"].reduce((n, id) => n * axisById(id)!.presets.length, 3);
    expect(count).toBe(36_450);
    expect(sweep.combos).toBe(count);
    expect(NUMERIC_TOKENS.length).toBeGreaterThan(150);
    expect(sweep.evaluations).toBe(count * NUMERIC_TOKENS.length);
  });

  it("agrees with density.test.ts's resolver on the type 13 ladders", () => {
    const ladder = (density: keyof typeof DENSITY_LEVELS) => {
      const leaves: Record<string, string> = { ...defaults() };
      for (const [k, v] of Object.entries(typeSizeTokens(13))) leaves[`--area-${k}`] = v;
      leaves["--area-density-level"] = String(DENSITY_LEVELS[density]);
      const n = resolverFor(leaves);
      return ["control-xs", "control-sm", "control-md", "control-lg", "control-xl", "ui-row"].map(k => n(`--area-${k}`));
    };
    expect(ladder("28")).toEqual([20, 24, 26, 34, 42, 28]);
    expect(ladder("32")).toEqual([22, 26, 30, 38, 46, 30]);
    expect(ladder("36")).toEqual([26, 30, 34, 42, 50, 34]);
  });
});

describe("geometry sweep: nothing fails but what known-failures.ts lists", () => {
  it("geometry", () => {
    const report = ratchet("geometry", sweep.failures);
    printMeasured("geometry", report);
    expect(ratchetProblems(report)).toEqual([]);
  });
  it("never lets a hard rule into the known list: finite lengths, corners, targets, focus and the non-decreasing ladder", () => {
    const hard = /finite|at most half|targets|xs at least|never decreases|whole pixels|Sharp|focus ring is drawn|Contrast More|raised Contrast/;
    expect(sweep.failures.filter(f => hard.test(f.rule)).slice(0, 10)).toEqual([]);
  });
});
