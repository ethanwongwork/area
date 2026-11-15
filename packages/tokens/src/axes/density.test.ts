import { describe, expect, it } from "vitest";
import { derivedTokens, SPACE_RAMP } from "../emit/base.ts";
import { typeSizeTokens, TYPE_SIZES } from "./type-size.ts";
import { DENSITY_LEVELS, type DensityId } from "./density.ts";

// Resolves the size derivations (emit/base.ts) for one type size and density, as the browser does: var() substituted,
// then calc / round / min / max / clamp evaluated in px. CSS round(nearest) ties go up, as Math.round.
const derived = derivedTokens();
function resolver(base: (typeof TYPE_SIZES)[number], density: DensityId) {
  const leaves: Record<string, string> = {};
  for (const [k, v] of Object.entries(typeSizeTokens(base))) leaves[`--area-${k}`] = v;
  leaves["--area-density-level"] = String(DENSITY_LEVELS[density]);
  const lookup = (name: string): string => {
    const value = leaves[name] ?? derived[name];
    if (value === undefined) throw new Error(`${name} is not defined`);
    return value;
  };
  const expand = (value: string): string => value.replace(/var\((--area-[\w-]+)\)/g, (_, name) => `(${expand(lookup(name))})`);
  const evaluate = (name: string): number => {
    const js = expand(lookup(name))
      .replace(/(\d*\.?\d+)px/g, "$1")
      .replace(/round\((nearest|up|down),/g, (_, mode) => `R("${mode}",`)
      .replace(/\bcalc\(/g, "(")
      .replace(/\b(max|min)\(/g, "Math.$1(")
      .replace(/\bclamp\(/g, "C(");
    const R = (mode: string, x: number, step: number) => (mode === "up" ? Math.ceil(x / step) : mode === "down" ? Math.floor(x / step) : Math.round(x / step)) * step;
    const C = (lo: number, x: number, hi: number) => Math.min(Math.max(lo, x), hi);
    return Number(new Function("R", "C", `return (${js});`)(R, C));
  };
  return evaluate;
}

const at = (density: DensityId, ...names: string[]) => names.map(name => resolver(13, density)(`--area-${name}`));

describe("density's gaps and heights at type 13 (docs/research/system-evaluation-2026-11-11, plan A1.1, A1.4, A8.1)", () => {
  it("keeps the derived height ladder and its rows (A8.1: the owner kept the ladder and the Default density)", () => {
    expect(at("28", "control-xs", "control-sm", "control-md", "control-lg", "control-xl", "ui-row")).toEqual([20, 24, 26, 34, 42, 28]);
    expect(at("32", "control-xs", "control-sm", "control-md", "control-lg", "control-xl", "ui-row")).toEqual([22, 26, 30, 38, 46, 30]);
    expect(at("36", "control-xs", "control-sm", "control-md", "control-lg", "control-xl", "ui-row")).toEqual([26, 30, 34, 42, 50, 34]);
  });

  it("puts every gap on the ladder's whole steps; insets keep the half step (A1.1)", () => {
    expect(at("28", "ui-stack", "ui-cluster", "gap-row", "gap-section")).toEqual([4, 6, 8, 16]);
    expect(at("32", "ui-stack", "ui-cluster", "gap-row", "gap-section")).toEqual([6, 8, 12, 24]);
    expect(at("36", "ui-stack", "ui-cluster", "gap-row", "gap-section")).toEqual([8, 10, 16, 32]);
    // Insets keep the half step: 10 and 14 at type 13 Default (12 and 16 at type 14).
    expect(at("32", "inset-surface-sm", "inset-surface-md")).toEqual([10, 14]);
    // Every gap at every type and density is a step of the space ramp (no 7, 10, 14 or 18 at type 13).
    const ramp = new Set<number>(SPACE_RAMP);
    for (const base of TYPE_SIZES) for (const density of Object.keys(DENSITY_LEVELS) as DensityId[]) {
      const evaluate = resolver(base, density);
      for (const name of ["ui-stack", "ui-cluster", "gap-row", "gap-section"]) {
        const value = evaluate(`--area-${name}`);
        expect(Number.isInteger(value), `${name} at ${base} / ${density} is ${value}`).toBe(true);
        expect(value % 2, `${name} at ${base} / ${density} is ${value}, off the 2px ladder`).toBe(0);
      }
      for (const name of ["ui-stack", "ui-cluster", "gap-row", "gap-section"]) {
        expect(ramp.has(evaluate(`--area-${name}`)), `${name} at ${base} / ${density} is off the space ramp`).toBe(true);
      }
      // A section is two groups apart.
      expect(evaluate("--area-gap-section")).toBe(evaluate("--area-gap-row") * 2);
    }
  });

  it("names the page inset the feed computes: 32, Compact 24, Comfortable 40 (A1.4)", () => {
    expect([...at("28", "inset-page"), ...at("32", "inset-page"), ...at("36", "inset-page")]).toEqual([24, 32, 40]);
  });
});
