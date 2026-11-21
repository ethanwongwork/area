/**
 * The known-failures ratchet for the cross-setting sweeps (sweeps/*.test.ts; plan A in
 * docs/research/system-status-2026-11-18/README.md). Test code only: nothing ships from here.
 *
 * A sweep reports every failing check as a `Failure` (the rule, the setting combination, the measured value). Each
 * failure has to be covered by an entry in `known-failures.ts`, and every entry has to still cover something:
 *
 *   - a failure no entry covers is NEW: the sweep fails and names it;
 *   - an entry that covers nothing has been FIXED: the sweep fails until the entry is deleted;
 *   - an entry that covers more cases than it recorded, or a worse value than it recorded, has REGRESSED: the sweep fails.
 *
 * So the list only shrinks. Floors are never read from here: a sweep measures against the gate's own floors and this
 * file only says which of today's misses are known.
 */
import { KNOWN_FAILURES, type KnownFailure } from "./known-failures.ts";

/** One setting combination: each axis the sweep crosses and its value. */
export type Combo = Readonly<Record<string, string | number>>;

export interface Failure {
  /** The rule that failed, e.g. "WCAG danger-border on bg-surface" or "control ladder strictly increases". */
  rule: string;
  combo: Combo;
  /** The measured value (a ratio, an APCA Lc, a ΔE, a length). */
  value: number;
  /** The floor or bound it was measured against. */
  floor: number;
  /** Colours or lengths, for the message. */
  detail?: string;
}

const describeCombo = (combo: Combo) => Object.entries(combo).map(([k, v]) => `${k} ${v}`).join(", ");

/** Whether an entry covers a failure: same suite, the rule matches, and every listed axis has one of the listed values. */
export function covers(entry: KnownFailure, suite: string, failure: Failure): boolean {
  if (entry.suite !== suite) return false;
  if (!new RegExp(entry.rule).test(failure.rule)) return false;
  for (const [axis, values] of Object.entries(entry.where)) {
    if (!(values as readonly (string | number)[]).includes(failure.combo[axis] as string | number)) return false;
  }
  return true;
}

/** Lower is worse for ratios, Lc and ΔE; an entry can say otherwise (a length over a bound). */
const isWorse = (entry: KnownFailure, value: number, than: number) => {
  const tolerance = Math.max(1e-4, Math.abs(than) * 1e-3);
  return entry.higherIsWorse ? value > than + tolerance : value < than - tolerance;
};

export interface RatchetReport {
  /** Failures no entry covers, grouped by rule: the worst case and how many. */
  unexpected: string[];
  /** Entries that cover nothing now: delete them. */
  fixed: string[];
  /** Entries that cover more cases, or a worse value, than they recorded. */
  regressed: string[];
  /** Per entry: cases covered and the worst value measured, for the record. */
  measured: Array<{ entry: KnownFailure; count: number; worst: number; at: string }>;
}

/** Compare a sweep's failures with the known list for its suite. */
export function ratchet(suite: KnownFailure["suite"], failures: readonly Failure[], known: readonly KnownFailure[] = KNOWN_FAILURES): RatchetReport {
  const entries = known.filter(entry => entry.suite === suite);
  const tally = new Map<KnownFailure, { count: number; worst: number; at: string }>();
  const stray = new Map<string, { count: number; worst: Failure }>();
  for (const failure of failures) {
    const entry = entries.find(e => covers(e, suite, failure));
    if (!entry) {
      const group = stray.get(failure.rule);
      if (!group) stray.set(failure.rule, { count: 1, worst: failure });
      else {
        group.count++;
        if (failure.value < group.worst.value) group.worst = failure;
      }
      continue;
    }
    const t = tally.get(entry);
    const at = `${describeCombo(failure.combo)}${failure.detail ? ` (${failure.detail})` : ""}`;
    if (!t) tally.set(entry, { count: 1, worst: failure.value, at });
    else {
      t.count++;
      if (isWorse(entry, failure.value, t.worst)) { t.worst = failure.value; t.at = at; }
    }
  }
  const unexpected = [...stray].map(([rule, { count, worst }]) =>
    `NEW: [${rule}] ${count} case(s); worst ${worst.value.toFixed(3)} against ${worst.floor} at ${describeCombo(worst.combo)}${worst.detail ? ` (${worst.detail})` : ""}`);
  const fixed: string[] = [], regressed: string[] = [], measured: RatchetReport["measured"] = [];
  for (const entry of entries) {
    const t = tally.get(entry);
    if (!t) { fixed.push(`FIXED (delete the entry from known-failures.ts): finding ${entry.finding}, ${entry.id}`); continue; }
    measured.push({ entry, ...t });
    if (t.count > entry.count) regressed.push(`MORE CASES: ${entry.id} covers ${t.count}, recorded ${entry.count}; e.g. ${t.at}`);
    if (isWorse(entry, t.worst, entry.worst)) regressed.push(`WORSE: ${entry.id} measured ${t.worst.toFixed(4)}, recorded ${entry.worst} at ${t.at}`);
  }
  return { unexpected, fixed, regressed, measured };
}

/** The lines a failing ratchet prints (empty when it holds). */
export const ratchetProblems = (report: RatchetReport) => [...report.unexpected, ...report.regressed, ...report.fixed];

/** Every known entry's current count and worst, for updating the record after a fix (set SWEEP_REPORT=1). */
export function printMeasured(suite: string, report: RatchetReport): void {
  if (!process.env.SWEEP_REPORT) return;
  console.log(`\n${suite}: known failures as measured`);
  for (const { entry, count, worst, at } of report.measured) console.log(`  ${entry.id}: ${count} case(s), worst ${worst.toFixed(4)} at ${at}`);
}
