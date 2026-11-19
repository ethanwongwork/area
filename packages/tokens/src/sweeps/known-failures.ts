/**
 * Known failures of the cross-setting sweeps: the one list (plan A, docs/research/system-status-2026-11-18/README.md).
 * Test code only. Read by sweeps/ratchet.ts; the sweeps are colour.test.ts (suites "colour", "state", "edges") and
 * geometry.test.ts (suite "geometry").
 *
 * Every entry is a miss measured against the gate's own floor, recorded so the suite stays green while the fix waits:
 *
 *   rule    a regular expression over the sweep's rule names ("WCAG danger-border on bg-surface", "control ladder
 *           strictly increases");
 *   where   the setting combinations it covers: each listed axis must have one of the listed values;
 *   count   how many cases it covered when recorded; a sweep that finds more fails (MORE CASES);
 *   worst   the worst value measured (a WCAG ratio, an APCA Lc, a ΔE OK, a px difference); a worse one fails (WORSE);
 *   finding the README section 2 finding it is ("new" where the README's table does not list it);
 *   kind    "defect" (to fix, plan B) or "decision" (the owner's, README section 7).
 *
 * A failure no entry covers fails the sweep (NEW), and an entry that covers nothing fails it too (FIXED): delete the
 * entry in the change that fixes it. Never widen an entry to pass, and never change a floor here: floors live in
 * contrast/assertions.ts and the sweeps. `SWEEP_REPORT=1 npx vitest run src/sweeps` prints each entry as measured.
 */
export interface KnownFailure {
  id: string;
  suite: "colour" | "state" | "edges" | "geometry";
  finding: number | "new";
  kind: "defect" | "decision";
  rule: string;
  where: Readonly<Record<string, readonly (string | number)[]>>;
  count: number;
  worst: number;
  /** For a bound a value must stay under; ratios, Lc, ΔE and the px differences recorded here are worse when lower. */
  higherIsWorse?: boolean;
  note: string;
}

export const KNOWN_FAILURES: readonly KnownFailure[] = [
  {
    id: "tone-border-strong/APCA/dark/declared", suite: "colour", finding: 1, kind: "defect",
    rule: String.raw`^APCA (?:accent-border-strong|brown-border-strong|caution-border-strong|danger-border-strong|discovery-border-strong|info-border-strong|pink-border-strong|success-border-strong|warning-border-strong) on (?:bg-surface)$`,
    where: { theme: ["dark"], ground: [0,24], layers: [0,8] },
    count: 9252, worst: 7.7624,
    note: "Tone and hue hover outlines (-border-strong, 1.9 / Lc 15 tier) on the declared ground: they are fixed palette rungs and do not follow the ground or Layers. In dark too (black page with raised Layers, and ground 24): the README table names only the light gray page.",
  },
  {
    id: "tone-border-strong/APCA/dark/every-ground", suite: "colour", finding: 1, kind: "defect",
    rule: String.raw`^APCA (?:accent-border-strong|brown-border-strong|caution-border-strong|danger-border-strong|discovery-border-strong|info-border-strong|pink-border-strong|success-border-strong|warning-border-strong) on (?:bg-card|bg-float|bg-page|bg-subtle|bg-tile|bg-well)$`,
    where: { theme: ["dark"], ground: [0,24], layers: [0,8] },
    count: 52056, worst: 0,
    note: "Tone and hue hover outlines on grounds the gate does not declare (the every-ground invariant), at the floor their bg-surface assertion declares.",
  },
  {
    id: "tone-border-strong/WCAG/dark/declared", suite: "colour", finding: 1, kind: "defect",
    rule: String.raw`^WCAG (?:accent-border-strong|brown-border-strong|caution-border-strong|danger-border-strong|discovery-border-strong|info-border-strong|pink-border-strong|success-border-strong|warning-border-strong) on (?:bg-surface)$`,
    where: { theme: ["dark"], ground: [24], layers: [8] },
    count: 4860, worst: 1.4834,
    note: "Tone and hue hover outlines (-border-strong, 1.9 / Lc 15 tier) on the declared ground: they are fixed palette rungs and do not follow the ground or Layers. In dark too (black page with raised Layers, and ground 24): the README table names only the light gray page.",
  },
  {
    id: "tone-border-strong/WCAG/dark/every-ground", suite: "colour", finding: 1, kind: "defect",
    rule: String.raw`^WCAG (?:accent-border-strong|brown-border-strong|caution-border-strong|danger-border-strong|discovery-border-strong|info-border-strong|pink-border-strong|success-border-strong|warning-border-strong) on (?:bg-card|bg-float|bg-subtle|bg-tile|bg-well)$`,
    where: { theme: ["dark"], ground: [24], layers: [8] },
    count: 21114, worst: 1.2821,
    note: "Tone and hue hover outlines on grounds the gate does not declare (the every-ground invariant), at the floor their bg-surface assertion declares.",
  },
  {
    id: "tone-border-strong/WCAG/light/declared", suite: "colour", finding: 1, kind: "defect",
    rule: String.raw`^WCAG (?:accent-border-strong|caution-border-strong|danger-border-strong|discovery-border-strong|info-border-strong|pink-border-strong|success-border-strong|warning-border-strong) on (?:bg-surface)$`,
    where: { theme: ["light"], ground: [90], layers: [0,8] },
    count: 8640, worst: 1.4071,
    note: "Tone and hue hover outlines (-border-strong, 1.9 / Lc 15 tier) on the declared ground: they are fixed palette rungs and do not follow the ground or Layers.",
  },
  {
    id: "tone-border-strong/WCAG/light/every-ground/gray-page", suite: "colour", finding: 1, kind: "defect",
    rule: String.raw`^WCAG (?:accent-border-strong|caution-border-strong|danger-border-strong|discovery-border-strong|info-border-strong|pink-border-strong|success-border-strong|warning-border-strong) on (?:bg-card|bg-float|bg-page|bg-subtle|bg-tile|bg-well)$`,
    where: { theme: ["light"], ground: [90], layers: [0,8] },
    count: 51840, worst: 1.2095,
    note: "Tone and hue hover outlines on grounds the gate does not declare (the every-ground invariant), at the floor their bg-surface assertion declares.",
  },
  {
    id: "tone-border-strong/WCAG/light/every-ground/white-page", suite: "colour", finding: 1, kind: "defect",
    rule: String.raw`^WCAG (?:accent-border-strong|caution-border-strong|danger-border-strong|discovery-border-strong|info-border-strong|pink-border-strong|success-border-strong|warning-border-strong) on (?:bg-subtle|bg-tile|bg-well)$`,
    where: { theme: ["light"], ground: [100], layers: [0,4,8] },
    count: 30240, worst: 1.6524,
    note: "Not in the README (it measured bg-surface only): tone hover outlines under 1.9:1 on the recessed grounds (subtle, tile, well) of a white page, at the default Layers too (worst 1.65 on bg-well).",
  },
  {
    id: "tone-border/WCAG/dark/declared", suite: "colour", finding: 1, kind: "defect",
    rule: String.raw`^WCAG (?:accent-border|brown-border|caution-border|danger-border|discovery-border|hue-blue-border|hue-brown-border|hue-green-border|hue-orange-border|hue-pink-border|hue-purple-border|hue-red-border|hue-yellow-border|info-border|pink-border|success-border|warning-border) on (?:bg-surface)$`,
    where: { theme: ["dark"], ground: [0,24], layers: [0,8] },
    count: 26964, worst: 1.1633,
    note: "Tone and hue outlines (-border, 1.3 ambient tier) on the declared ground: they are fixed palette rungs and do not follow the ground or Layers. In dark too (black page with raised Layers, and ground 24): the README table names only the light gray page.",
  },
  {
    id: "tone-border/WCAG/dark/every-ground", suite: "colour", finding: 1, kind: "defect",
    rule: String.raw`^WCAG (?:accent-border|brown-border|caution-border|danger-border|discovery-border|hue-blue-border|hue-brown-border|hue-green-border|hue-orange-border|hue-pink-border|hue-purple-border|hue-red-border|hue-yellow-border|info-border|pink-border|success-border|warning-border) on (?:bg-card|bg-float|bg-page|bg-subtle|bg-tile|bg-well)$`,
    where: { theme: ["dark"], ground: [0,24], layers: [0,8] },
    count: 117612, worst: 1.0537,
    note: "Tone and hue outlines on grounds the gate does not declare (the every-ground invariant), at the floor their bg-surface assertion declares.",
  },
  {
    id: "tone-border/WCAG/light/declared", suite: "colour", finding: 1, kind: "defect",
    rule: String.raw`^WCAG (?:accent-border|caution-border|danger-border|discovery-border|hue-blue-border|hue-green-border|hue-orange-border|hue-pink-border|hue-purple-border|hue-red-border|hue-yellow-border|info-border|pink-border|success-border|warning-border) on (?:bg-surface)$`,
    where: { theme: ["light"], ground: [90], layers: [0,8] },
    count: 16200, worst: 1.0145,
    note: "Tone and hue outlines (-border, 1.3 ambient tier) on the declared ground: they are fixed palette rungs and do not follow the ground or Layers.",
  },
  {
    id: "tone-border/WCAG/light/every-ground/gray-page", suite: "colour", finding: 1, kind: "defect",
    rule: String.raw`^WCAG (?:accent-border|brown-border|caution-border|danger-border|discovery-border|hue-blue-border|hue-brown-border|hue-green-border|hue-orange-border|hue-pink-border|hue-purple-border|hue-red-border|hue-yellow-border|info-border|pink-border|success-border|warning-border) on (?:bg-card|bg-float|bg-page|bg-subtle|bg-tile|bg-well)$`,
    where: { theme: ["light"], ground: [90], layers: [0,8] },
    count: 100440, worst: 1.0145,
    note: "Tone and hue outlines on grounds the gate does not declare (the every-ground invariant), at the floor their bg-surface assertion declares.",
  },
  {
    id: "tone-border/WCAG/light/every-ground/white-page", suite: "colour", finding: 1, kind: "defect",
    rule: String.raw`^WCAG (?:accent-border|caution-border|danger-border|discovery-border|hue-blue-border|hue-green-border|hue-orange-border|hue-pink-border|hue-purple-border|hue-red-border|hue-yellow-border|info-border|pink-border|success-border|warning-border) on (?:bg-subtle|bg-tile|bg-well)$`,
    where: { theme: ["light"], ground: [100], layers: [0,4,8] },
    count: 56700, worst: 1.1344,
    note: "Not in the README (it measured bg-surface only): tone and hue outlines under 1.3:1 on the recessed grounds (subtle, tile, well) of a white page, at the default Layers too.",
  },
  {
    id: "hue-icon/light/declared", suite: "colour", finding: 2, kind: "defect",
    rule: String.raw`^WCAG (?:hue-brown-icon|hue-green-icon|hue-orange-icon|hue-yellow-icon) on (?:bg-page|bg-surface)$`,
    where: { theme: ["light"], ground: [90], layers: [0,8] },
    count: 6480, worst: 2.6427,
    note: "Hue icons (fixed palette rungs in light) under 3:1 on a gray light page.",
  },
  {
    id: "hue-icon/light/every-ground", suite: "colour", finding: 2, kind: "defect",
    rule: String.raw`^WCAG (?:hue-blue-icon|hue-brown-icon|hue-gray-icon|hue-green-icon|hue-orange-icon|hue-pink-icon|hue-purple-icon|hue-red-icon|hue-yellow-icon) on (?:bg-card|bg-float|bg-subtle|bg-tile|bg-well)$`,
    where: { theme: ["light"], ground: [90], layers: [0,8] },
    count: 25380, worst: 2.2716,
    note: "Hue icons under 3:1 on grounds the gate does not declare (the every-ground invariant).",
  },
  {
    id: "dark-disabled", suite: "colour", finding: 3, kind: "defect",
    rule: String.raw`^APCA (?:fg-disabled) on (?:bg-surface)$`,
    where: { theme: ["dark"], ground: [0], layers: [0] },
    count: 540, worst: 19.2988,
    note: "Dark disabled ink under its Lc 20 floor on a black page with flat Layers.",
  },
  {
    id: "dark-subtle", suite: "colour", finding: 3, kind: "defect",
    rule: String.raw`^APCA (?:fg-placeholder|fg-subtle) on (?:bg-component-float|bg-component-float-hover|bg-component-hover)$`,
    where: { theme: ["dark"], ground: [0,24], layers: [0,8] },
    count: 5400, worst: 54.1753,
    note: "Dark meta and placeholder ink under Lc 60 on the floating and hovered plates at Layers extremes.",
  },
  {
    id: "accent-selection/dark", suite: "state", finding: 4, kind: "defect",
    rule: String.raw`^(?:selected differs from hover)$`,
    where: { theme: ["dark"], strength: [30,60], ground: [0,8], layers: [0,8], plate: ["card","float","frame","frameRaised","page","raised","recessed","tile","well"], selection: ["accent"] },
    count: 141, worst: 0.0059,
    note: "Selection Accent at a low Accent strength: the selected plate (accent-surface) is within the smallest state step of the hover plate.",
  },
  {
    id: "accent-selection/light", suite: "state", finding: 4, kind: "defect",
    rule: String.raw`^(?:selected differs from hover)$`,
    where: { theme: ["light"], strength: [30], ground: [100], layers: [0,8], plate: ["card","float","frame","frameRaised","page","raised","recessed","tile","well"], selection: ["accent"] },
    count: 38, worst: 0.0048,
    note: "Selection Accent at a low Accent strength: the selected plate (accent-surface) is within the smallest state step of the hover plate.",
  },
  {
    id: "ladder-type12-compact", suite: "geometry", finding: 5, kind: "decision",
    rule: String.raw`^(?:control ladder strictly increases)$`,
    where: { type: ["12"], density: ["28"] },
    count: 2430, worst: 0,
    note: "Type 12 + Compact: sm and md controls are both 24 (ladder 20/24/24/32/40). Decision for the owner: accept, or hold a 2px step.",
  },
  {
    id: "pill-odd-half", suite: "geometry", finding: 6, kind: "decision",
    rule: String.raw`^(?:Pill is half the height)$`,
    where: { type: ["12","13","15"], radius: ["pill"] },
    count: 8100, worst: -1,
    note: "Pill rounds the corner down to even pixels, so a height whose half is odd draws 1px short of a pill (14 on 30, 12 on 26, 10 on 22). Decision for the owner: accept, or round the height.",
  },
  {
    id: "edge-groups/dark", suite: "edges", finding: 8, kind: "decision",
    rule: String.raw`^edge group (?:buttons|callouts|cards|dividers|media|options|regions|tags|tracks) on (?:bg-page|bg-subtle|bg-surface)$`,
    where: { theme: ["dark"], ground: [0,8,24], layers: [0,8] },
    count: 222, worst: 1.0735,
    note: "Stroke groups at their default amounts and the default Edge contrast under the 1.2 container tier (contrast/assertions.ts STROKE.faint). Decision for the owner: raise the defaults or declare them decorative.",
  },
  {
    id: "edge-groups/light", suite: "edges", finding: 8, kind: "decision",
    rule: String.raw`^edge group (?:buttons|callouts|cards|dividers|media|options|regions|tags|tracks) on (?:bg-page|bg-subtle|bg-surface)$`,
    where: { theme: ["light"], ground: [90,100], layers: [0,4,8] },
    count: 255, worst: 1.0853,
    note: "Stroke groups at their default amounts and the default Edge contrast under the 1.2 container tier (contrast/assertions.ts STROKE.faint). Decision for the owner: raise the defaults or declare them decorative.",
  },
  {
    id: "dark-vivid-code", suite: "colour", finding: "new", kind: "defect",
    rule: String.raw`^APCA (?:fg-accent-vivid|fg-danger-vivid|fg-discovery-vivid|fg-info-vivid) on (?:bg-code)$`,
    where: { theme: ["dark"], ground: [24], layers: [8] },
    count: 1890, worst: 53.5215,
    note: "Not in the README table: dark vivid syntax inks under Lc 60 on the code ground at ground 24 + Layers 8 (the audit's colour.log has it).",
  },
];
