import { describe, expect, it } from "vitest";
import { AXES, attributeFor, checkAxisIntegrity, defaultPresetOf } from "./registry.ts";
import type { AxisDefinition } from "./schema.ts";

describe("axis registry", () => {
  it("is internally consistent", () => {
    expect(checkAxisIntegrity()).toEqual([]);
  });

  it("gives every axis a default preset that exists", () => {
    for (const axis of AXES) expect(defaultPresetOf(axis).id).toBe(axis.defaultPreset);
  });

  it("names each axis attribute distinctly", () => {
    const attributes = AXES.map(attributeFor);
    expect(new Set(attributes).size).toBe(attributes.length);
  });

  it("ships the axes the system promises", () => {
    expect(AXES.map((a) => a.id).sort()).toEqual(
      ["accent", "motion", "neutral", "radius", "surface", "theme", "ui"].sort(),
    );
  });
});

describe("the integrity check actually catches things", () => {
  // The check is the only thing standing between eight independent axes and a system whose
  // behaviour depends on source order, so it gets tested like the gate does: by breaking it.

  const good: AxisDefinition = {
    id: "alpha",
    label: "Alpha",
    description: "",
    defaultPreset: "a",
    namespaces: ["--area-alpha-"],
    presets: [
      { id: "a", label: "A", description: "", tokens: { "--area-alpha-x": "1" } },
      { id: "b", label: "B", description: "", tokens: { "--area-alpha-x": "2" } },
    ],
  };

  it("catches two axes writing the same property", () => {
    const clash: AxisDefinition = {
      ...good,
      id: "beta",
      namespaces: ["--area-alpha-"],
    };
    const problems = checkAxisIntegrity([good, clash]);
    expect(problems.some((p) => p.kind === "collision")).toBe(true);
    expect(problems[0]!.message).toContain("--area-alpha-x");
  });

  it("catches a preset that sets tokens its siblings do not", () => {
    const uneven: AxisDefinition = {
      ...good,
      presets: [
        good.presets[0]!,
        { id: "b", label: "B", description: "", tokens: { "--area-alpha-y": "2" } },
      ],
    };
    const problems = checkAxisIntegrity([uneven]);
    expect(problems.some((p) => p.kind === "inconsistent-preset")).toBe(true);
  });

  it("catches a token emitted outside its axis's namespace", () => {
    const stray: AxisDefinition = {
      ...good,
      presets: [
        { id: "a", label: "A", description: "", tokens: { "--area-elsewhere-x": "1" } },
        { id: "b", label: "B", description: "", tokens: { "--area-elsewhere-x": "2" } },
      ],
    };
    expect(checkAxisIntegrity([stray]).some((p) => p.kind === "namespace")).toBe(true);
  });

  it("catches a default that names a preset which does not exist", () => {
    const orphan: AxisDefinition = { ...good, defaultPreset: "nope" };
    expect(checkAxisIntegrity([orphan]).some((p) => p.kind === "missing-default")).toBe(true);
  });

  it("catches a dark variant that omits a token its light counterpart sets", () => {
    const lopsided: AxisDefinition = {
      ...good,
      presets: [
        { id: "a", label: "A", description: "", tokens: { "--area-alpha-x": "1" }, darkTokens: {} },
        { id: "b", label: "B", description: "", tokens: { "--area-alpha-x": "2" } },
      ],
    };
    expect(checkAxisIntegrity([lopsided]).some((p) => p.kind === "inconsistent-preset")).toBe(true);
  });
});

it.each(['NaN', 'Infinity', '-Infinity', '', 'undefined'])("rejects invalid dark values: %s", value => {
  const axes = structuredClone(AXES);
  const neutral = axes.find(a => a.id === 'neutral')!;
  neutral.presets[0]!.darkTokens = { ...neutral.presets[0]!.darkTokens, '--area-bg-page': value };
  expect(checkAxisIntegrity(axes).some(p => p.kind === 'invalid-value')).toBe(true);
});

it('rejects an extra invalid dark token outside its namespace', () => {
  const axes = structuredClone(AXES);
  axes.find(a => a.id === 'neutral')!.presets[0]!.darkTokens = {
    ...axes.find(a => a.id === 'neutral')!.presets[0]!.darkTokens,
    '--area-rogue': 'NaN',
  };
  const problems = checkAxisIntegrity(axes);
  for (const kind of ['inconsistent-preset', 'invalid-value', 'namespace']) expect(problems.some(p => p.kind === kind)).toBe(true);
});

it('rejects a dark-only collision with another axis', () => {
  const axes = structuredClone(AXES);
  axes.find(a => a.id === 'neutral')!.presets[0]!.darkTokens = {
    ...axes.find(a => a.id === 'neutral')!.presets[0]!.darkTokens,
    '--area-accent-solid': '#ffffff',
  };
  expect(checkAxisIntegrity(axes).some(p => p.kind === 'collision')).toBe(true);
});

it('checks namespace claims even before overlapping properties are emitted', () => {
  const axes=structuredClone(AXES);
  axes.find(a=>a.id==='surface')!.namespaces=['--area-shadow-','--area-border-width','--area-ring-'];
  expect(checkAxisIntegrity(axes).some(p=>p.message.includes('overlapping namespaces'))).toBe(true);
});
