import { describe, expect, it } from "vitest";
import { derivedTokens } from "../emit/base.ts";
import { RADIUS_AXIS } from "./radius.ts";

/**
 * The corner derivations (emit/base.ts) evaluated for every Corner preset, on the heights the size derivations give at
 * type 13: Default (density 32) and Compact (type 12, density 28). The heights are inputs here; the corner rules are
 * what is tested (plan A2.1, 2026-11-11).
 */
const DERIVED = derivedTokens();
const HEIGHTS = {
  default: { "control-md": 30, "ui-row": 30, "inset-surface-md": 14 },
  compact: { "control-md": 26, "ui-row": 28, "inset-surface-md": 12 },
} as const;

/** Resolves a derived token to px for one preset and one set of heights: var(), calc, min, max, round. */
function resolve(name: string, preset: Record<string, string>, heights: Record<string, number>): number {
  const value = (token: string): number => {
    if (token in heights) return heights[token]!;
    const raw = preset[`--area-${token}`] ?? DERIVED[`--area-${token}`];
    if (raw === undefined) throw new Error(`--area-${token} is not a corner input`);
    const expr = raw
      .replace(/var\(--area-([a-z0-9-]+)\)/g, (_, inner: string) => `(${value(inner)})`)
      .replace(/round\(down,/g, "rd(").replace(/round\(nearest,/g, "rn(")
      .replace(/\bcalc\(/g, "(").replace(/\bmin\(/g, "mn(").replace(/\bmax\(/g, "mx(")
      .replace(/(\d)px\b/g, "$1");
    // eslint-disable-next-line no-new-func
    return new Function("rd", "rn", "mn", "mx", `return ${expr};`)(
      (x: number, step: number) => Math.floor(x / step + 1e-9) * step,
      (x: number, step: number) => Math.round(x / step) * step,
      Math.min, Math.max,
    ) as number;
  };
  return value(name);
}

const corners = (presetId: string, heights: Record<string, number>) => {
  const preset = RADIUS_AXIS.presets.find(p => p.id === presetId)!.tokens as Record<string, string>;
  const read = (token: string) => resolve(token, preset, heights);
  return {
    md: read("radius-control-md"), step: read("radius-step"), floor: read("radius-floor"), row: read("radius-row"),
    listRow: read("radius-list-row"), list: read("radius-list"), container: read("radius-container"),
  };
};

describe("corners (axes/radius.ts, emit/base.ts radiusDerivations)", () => {
  it("takes the step from the real medium control: rows of one height share one corner (plan A2.1)", () => {
    for (const heights of Object.values(HEIGHTS)) {
      for (const { id } of RADIUS_AXIS.presets) {
        const c = corners(id, heights);
        expect(c.step, `step at ${id}`).toBe(c.md);
        // A row in a menu is as round as a Nav row of its height (and, at the default, a medium Button), less only where
        // the surface's padding leaves less room, until Pill, where menu rows reach a pill.
        if (id !== "pill") expect(c.listRow, `menu row at ${id}`).toBe(Math.min(c.row, Math.max(c.floor, c.container - 4)));
        if (id !== "pill" && heights["ui-row"] === heights["control-md"]) expect(c.listRow, `menu row at ${id}`).toBeLessThanOrEqual(c.md);
        if (id === "pill") expect(c.listRow).toBe(heights["ui-row"] / 2);
        // The list is its rows plus the padding (4, or the rows' own corner below 4): concentric at every preset
        // (plan B6.3), and never rounder than the container except where the container is under twice the rows (Corner 2).
        expect(c.list, `list at ${id}`).toBe(c.listRow + Math.min(4, c.listRow));
        if (c.container >= 2 * c.listRow) expect(c.list, `list at ${id}`).toBeLessThanOrEqual(c.container);
      }
    }
  });

  it("gives the shipped default 8 on the medium Button and menu rows, 12 on lists, 16 on surfaces", () => {
    expect(corners("10", HEIGHTS.default)).toEqual({ md: 8, step: 8, floor: 4, row: 8, listRow: 8, list: 12, container: 16 });
    expect(corners("10", HEIGHTS.compact)).toMatchObject({ md: 8, step: 8, listRow: 8, list: 12, container: 16 });
    // The floor reads the setting's own number, so Corner 4 keeps 4 where its medium control draws 2.
    expect(corners("4", HEIGHTS.default)).toMatchObject({ md: 2, step: 2, floor: 4 });
  });

  it("keeps every preset monotonic, square only at Sharp, and menu rows a pill at Pill", () => {
    for (const heights of Object.values(HEIGHTS)) {
      const all = RADIUS_AXIS.presets.map(({ id }) => corners(id, heights));
      for (const key of ["md", "step", "floor", "row", "listRow", "list", "container"] as const) {
        const values = all.map(c => c[key]);
        for (let i = 1; i < values.length; i++) expect(values[i], `${key}: ${values.join(" ")}`).toBeGreaterThanOrEqual(values[i - 1]!);
      }
      expect(Object.values(all[0]!).every(v => v === 0)).toBe(true);
      for (const c of all.slice(1)) expect(c.floor).toBeGreaterThan(0);
      expect(all.at(-1)!.listRow).toBe(heights["ui-row"] / 2);
    }
  });

  it("describes each preset by what it draws: the 32px control and the medium Button at the default type", () => {
    const ten = RADIUS_AXIS.presets.find(p => p.id === "10")!;
    expect(ten.description).toBe("10px on a 32px control (8px on a medium Button at the default type), 16px on surfaces (default).");
    for (const { id, description } of RADIUS_AXIS.presets) {
      const match = description?.match(/\((\d+)px on a medium Button/);
      if (match) expect(Number(match[1]), id).toBe(corners(id, HEIGHTS.default).md);
    }
  });
});
