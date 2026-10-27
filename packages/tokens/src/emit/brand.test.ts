import { describe, expect, it } from "vitest";
import { brandCssWith, brandDeclarationsWith, brandInputNames } from "./brand.ts";
import { brandDerivedFormulas } from "./brand-derived.ts";
import { resolveBrandTheme } from "../semantic/brand.ts";
import { accentInputs } from "../semantic/inputs.ts";

const derived = brandDerivedFormulas();
const brand = { primary: "#00b65c", secondary: "#a785fe", tertiary: "#f8311c" };

describe("brand declarations (emit/brand.ts)", () => {
  it("restate every derivation that reads an input a brand writes, and nothing it writes itself", () => {
    const declarations = brandDeclarationsWith(derived, brand);
    const inputs = new Set(brandInputNames().map(name => `--area-${name}`));
    for (const [name, formula] of Object.entries(derived)) if (!inputs.has(name)) expect(declarations[name], name).toBe(formula);
    expect(Object.keys(derived).length).toBeGreaterThan(100);
  });
  it("write the resolver's values: the accent's inputs, its Auto at the brand's nearest shade, and the new roles", () => {
    const declarations = brandDeclarationsWith(derived, brand);
    for (const theme of ["light", "dark"] as const) {
      const resolved = resolveBrandTheme({ theme, neutral: "neutral", brand });
      const value = (name: string) => { const v = declarations[`--area-${name}`]!; const pair = /^light-dark\((.+), (.+)\)$/.exec(v); return pair ? pair[theme === "light" ? 1 : 2] : v; };
      for (const [name, hex] of Object.entries(accentInputs(resolved)).filter(([name]) => name !== "accent-label-full")) expect(value(name), name).toBe(hex);
      for (const name of ["secondary-solid", "fg-on-tertiary", "support-3", "fg-on-support-3-strong", "bg-brand-ground", "danger-solid-full"]) expect(value(name), name).toBe(resolved.tokens[name.replace(/-full$/, "")] ?? resolved.tokens[name]);
      expect(value("accent-solid-full")).toBe(resolved.tokens["accent-solid"]);
    }
  });
  it("leave a slot that is not set to the accent's aliases, and accept #rgb", () => {
    const declarations = brandDeclarationsWith(derived, { primary: "#0a5" });
    expect(declarations["--area-secondary-solid"]).toBe("var(--area-accent-solid)");
    expect(brandCssWith(derived, { primary: "#0A5" })).toMatch(/^\/\* Area brand: #00aa55 \*\/\n@layer area\.axes \{\n  \[data-area-brand\] \{/);
  });
  it("refuse anything but a hex colour, and cache a brand once worked out", () => {
    expect(() => brandDeclarationsWith(derived, { primary: "green" })).toThrow(/hex colour/);
    expect(brandDeclarationsWith(derived, brand)).toBe(brandDeclarationsWith(derived, { ...brand, primary: "#00B65C" }));
  });
});
