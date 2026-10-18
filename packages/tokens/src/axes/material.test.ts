import { describe, expect, it } from "vitest";
import { AXES } from "./registry.ts";
import { MATERIAL_BUNDLES, MATERIAL_LEVERS, materialDefaults, materialDerived, materialRules } from "./material.ts";

describe("material (docs/research/astra/materials/27-levers)", () => {
  const rules = materialRules();
  const bundle = (id: string) => rules.find(([selector]) => selector === `[data-area-material="${id}"]`)![1];

  it("sets every input in every bundle, so a nested bundle never inherits its parent's", () => {
    const keys = Object.keys(bundle("none")).sort();
    for (const id of Object.keys(MATERIAL_BUNDLES)) expect(Object.keys(bundle(id)).sort()).toEqual(keys);
  });

  it("is None with no attribute: every lever and gate 0", () => {
    const defaults = materialDefaults();
    for (const { id } of MATERIAL_LEVERS) expect(defaults[`--area-material-${id}`]).toMatch(/^0(deg)?$/);
    for (const [name, value] of Object.entries(defaults)) if (/-(radial|accent|band|lit|solid|double|neutral|icons|none|centre|away|gradient)$/.test(name) && !name.endsWith("material-gradient")) expect(value, name).toBe("0");
  });

  it("emits a rule for every lever step after the bundles, so a lever wins over its bundle", () => {
    const firstLever = rules.findIndex(([selector]) => selector.startsWith("[data-area-material-"));
    const lastBundle = rules.map(([selector]) => selector.startsWith("[data-area-material=")).lastIndexOf(true);
    expect(firstLever).toBeGreaterThan(lastBundle);
    for (const { id } of MATERIAL_LEVERS) expect(rules.some(([selector]) => selector === `[data-area-material-${id}="8"]` || selector === `[data-area-material-${id}="345"]`)).toBe(true);
  });

  it("never paints `none` inside a list, and stays out of every axis's namespace", () => {
    for (const [name, value] of Object.entries(materialDerived())) expect(value, name).not.toMatch(/(?<![-\w])none\b/);
    for (const axis of AXES) for (const ns of axis.namespaces) expect(ns.startsWith("--area-material-")).toBe(false);
  });
});
