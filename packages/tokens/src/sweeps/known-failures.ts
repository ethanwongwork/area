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
];
