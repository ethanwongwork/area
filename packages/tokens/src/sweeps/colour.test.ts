/**
 * The colour group as one product (sweeps/colour-sweep.ts; plan A1–A3, docs/research/system-status-2026-11-18/README.md):
 * mode × neutral × accent × Accent strength × Status colours × Tone contrast × Tone tint × ground and Layers, every
 * declared pairing at its own floor (WCAG in both modes, APCA in dark), the tone and hue strokes and the hue icons on
 * every ground, rest / hover / selected / pressed plates apart at both Selections, and the stroke groups against the
 * container tier. Today's misses are held in known-failures.ts; anything else fails, and so does a fixed entry left in.
 */
import { beforeAll, describe, expect, it } from "vitest";
import { ASSERTIONS } from "../contrast/assertions.ts";
import { resolveTheme } from "../semantic/resolve.ts";
import { DEFAULT_LAYER_SELECTION } from "../color/layers.ts";
import { GROUND_PAIRS, LAYERS, STATE_STEP, colourCombos, lightDarkens, paintedTokens, runColourSweep } from "./colour-sweep.ts";
import { type Failure, printMeasured, ratchet, ratchetProblems } from "./ratchet.ts";
import { KNOWN_FAILURES, type KnownFailure } from "./known-failures.ts";

let sweep: ReturnType<typeof runColourSweep>;
beforeAll(() => { sweep = runColourSweep(); }, 120_000);

describe("colour sweep: the model it measures", () => {
  it("crosses every setting it names, with the default and the extremes of ground and Layers in each mode", () => {
    // 2 modes × 3 neutrals × 4 accents × 5 strength-status pairs × 3 floors × 3 tints × 5 ground-Layers pairs.
    expect([...colourCombos()].length).toBe(5400);
    expect(LAYERS.light[0]).toEqual({ ground: DEFAULT_LAYER_SELECTION.groundLight, layers: DEFAULT_LAYER_SELECTION.layersLight });
    expect(LAYERS.dark[0]).toEqual({ ground: DEFAULT_LAYER_SELECTION.groundDark, layers: DEFAULT_LAYER_SELECTION.layersDark });
    expect(GROUND_PAIRS.length).toBeGreaterThan(100);
    expect(sweep.combos).toBe(5400);
    expect(sweep.pairs).toBe(5400 * (ASSERTIONS.length + GROUND_PAIRS.length));
  });

  // The held colours (color/layers.ts HOLD: tone and hue outlines, hue icons, dark vivid inks) are the one other thing
  // painted past the resolver; they move on a white page too, where a recessed ground or a well needs it.
  const held = (name: string) => /-border(-strong)?$/.test(name) && !/^border/.test(name) || /^hue-[a-z]+-icon$/.test(name) || /^fg-[a-z]+-vivid$/.test(name);
  it("paints the resolver's tokens on a white page, where the hued inks never darken (layers.test.ts)", () => {
    for (const c of colourCombos()) {
      if (c.theme !== "light" || c.ground !== 100 || c.accent !== "blue" || c.tint !== 100) continue;
      expect(lightDarkens(c)).toEqual({ vivid: 0, tonal: 0, floor: 0 });
      const resolved = resolveTheme({ theme: c.theme, neutral: c.neutral, accent: c.accent, accentStrength: c.strength, statusColours: c.status, toneFloor: c.floor, layers: { ...DEFAULT_LAYER_SELECTION, groundLight: c.ground, layersLight: c.layers } }).tokens;
      const painted = paintedTokens(c);
      for (const name of Object.keys(resolved)) if (!held(name)) expect(painted[name], name).toBe(resolved[name]);
    }
  });

  it("holds a colour only where it misses its floor: the dark default moves nothing, light moves only the outlines", () => {
    for (const theme of ["light", "dark"] as const) {
      const c = [...colourCombos()].find(x => x.theme === theme && x.neutral === "neutral" && x.accent === "blue" && x.strength === 100 && x.status === "fixed" && x.floor === 4.5 && x.tint === 100 && x.ground === LAYERS[theme][0]!.ground && x.layers === LAYERS[theme][0]!.layers)!;
      const resolved = resolveTheme({ theme, neutral: "neutral", accent: "blue" }).tokens, painted = paintedTokens(c);
      const moved = Object.keys(resolved).filter(name => painted[name] !== resolved[name]);
      // In light the outlines missed their floor on the recessed grounds at the defaults (1.22 on bg-well against 1.3).
      expect(moved.every(name => /-border(-strong)?$/.test(name)), moved.join(", ")).toBe(true);
      if (theme === "dark") expect(moved).toEqual([]);
    }
  });

  it("darkens the hued inks on a gray light page, and only there", () => {
    const gray = [...colourCombos()].find(c => c.theme === "light" && c.ground === 90)!;
    const d = lightDarkens(gray);
    expect(d.vivid).toBeGreaterThan(0);
    expect(d.tonal).toBeGreaterThan(0);
    expect(d.floor).toBeGreaterThan(0);
    const dark = [...colourCombos()].find(c => c.theme === "dark" && c.ground === 24)!;
    expect(lightDarkens(dark)).toEqual({ vivid: 0, tonal: 0, floor: 0 });
  });

  it("takes the state step from the Layers gate's smallest hover step", () => {
    expect(STATE_STEP).toEqual({ light: 0.009, dark: 0.035 });
  });
});

describe("colour sweep: nothing fails but what known-failures.ts lists", () => {
  for (const suite of ["colour", "state", "edges"] as const) it(suite, () => {
    const failures = { colour: sweep.colour, state: sweep.state, edges: sweep.edges }[suite];
    const report = ratchet(suite, failures);
    printMeasured(suite, report);
    expect(ratchetProblems(report)).toEqual([]);
  });

  it("finds no malformed or missing colour anywhere", () => {
    expect(sweep.colour.filter(f => /well-formed|missing|translucent/.test(f.rule)).slice(0, 10)).toEqual([]);
  });
});

describe("the ratchet actually catches things", () => {
  const entry: KnownFailure = {
    id: "test", suite: "colour", finding: 1, kind: "defect", rule: "^WCAG danger-border on bg-surface$",
    where: { theme: ["light"], ground: [90] }, count: 2, worst: 1.02, note: "",
  };
  const failure = (over: Partial<Failure> & { combo?: Record<string, string | number> } = {}): Failure =>
    ({ rule: "WCAG danger-border on bg-surface", combo: { theme: "light", ground: 90 }, value: 1.05, floor: 1.3, ...over });

  it("holds when the known failures are what was recorded", () => {
    expect(ratchetProblems(ratchet("colour", [failure(), failure({ value: 1.02 })], [entry]))).toEqual([]);
  });
  it("fails on a new failure: another rule, or the same rule at a combination the entry does not cover", () => {
    expect(ratchet("colour", [failure({ rule: "WCAG info-border on bg-surface" })], [entry]).unexpected).toHaveLength(1);
    expect(ratchet("colour", [failure({ combo: { theme: "light", ground: 95 } })], [entry]).unexpected).toHaveLength(1);
  });
  it("fails when an entry is fixed and still listed", () => {
    expect(ratchet("colour", [], [entry]).fixed).toHaveLength(1);
  });
  it("fails when an entry covers more cases, or a worse value, than it recorded", () => {
    expect(ratchet("colour", [failure(), failure(), failure()], [entry]).regressed).toHaveLength(1);
    expect(ratchet("colour", [failure({ value: 1.0 })], [entry]).regressed).toHaveLength(1);
  });
});

describe("known-failures.ts", () => {
  it("names each entry once, with a rule that compiles, a finding and a measured value", () => {
    expect(new Set(KNOWN_FAILURES.map(e => e.id)).size).toBe(KNOWN_FAILURES.length);
    for (const e of KNOWN_FAILURES) {
      expect(() => new RegExp(e.rule), e.id).not.toThrow();
      expect(e.count, e.id).toBeGreaterThan(0);
      expect(Number.isFinite(e.worst), e.id).toBe(true);
      expect(e.finding === "new" || (Number.isInteger(e.finding) && e.finding >= 1 && e.finding <= 8), e.id).toBe(true);
      expect(e.note.length, e.id).toBeGreaterThan(20);
    }
  });
  it("marks the owner's decisions as decisions (README findings 5 to 8) and every other entry a defect", () => {
    for (const e of KNOWN_FAILURES) expect(e.kind, e.id).toBe([5, 6, 7, 8].includes(e.finding as number) ? "decision" : "defect");
  });
});
