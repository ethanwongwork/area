/**
 * Groups gate failures by assertion so curve tuning is driven by the worst case,
 * not by whichever failure the test runner printed last.
 */
import { ASSERTIONS } from "./assertions.ts";
import { apcaMagnitude, wcagContrastHex } from "../color/contrast.ts";
import { shippedThemes } from "../semantic/resolve.ts";

interface Row {
  key: string;
  note: string;
  standard: string;
  required: number;
  worst: number;
  worstAt: string;
  count: number;
  total: number;
}

const rows = new Map<string, Row>();
const themes = shippedThemes();

for (const t of themes) {
  for (const a of ASSERTIONS) {
    const fg = t.tokens[a.fg]!;
    const bg = t.tokens[a.bg]!;
    const ctx = `${t.theme}/${t.neutral}/${t.accent}`;

    const checks: Array<[string, number, number]> = [["wcag", wcagContrastHex(fg, bg), a.wcag]];
    if (t.theme === "dark") checks.push(["apca", apcaMagnitude(fg, bg), a.apca]);

    for (const [standard, actual, required] of checks) {
      const key = `${standard}|${a.fg}|${a.bg}`;
      const row = rows.get(key) ?? {
        key: `${a.fg} on ${a.bg}`,
        note: a.note,
        standard,
        required,
        worst: Infinity,
        worstAt: "",
        count: 0,
        total: 0,
      };
      row.total++;
      if (actual < row.worst) {
        row.worst = actual;
        row.worstAt = ctx;
      }
      if (actual < required) row.count++;
      rows.set(key, row);
    }
  }
}

const failing = [...rows.values()].filter((r) => r.count > 0).sort((a, b) => b.count - a.count);
const passing = [...rows.values()].filter((r) => r.count === 0).length;

console.log(`\n  ${failing.length} failing assertion(s), ${passing} passing, across ${themes.length} themes\n`);
console.log(`  ${"assertion".padEnd(40)} ${"std".padEnd(5)} ${"req".padEnd(6)} ${"worst".padEnd(8)} fail/total  worst case`);
for (const r of failing) {
  console.log(
    `  ${r.key.padEnd(40)} ${r.standard.padEnd(5)} ${String(r.required).padEnd(6)} ${r.worst.toFixed(2).padEnd(8)} ${String(r.count).padStart(3)}/${String(r.total).padEnd(5)} ${r.worstAt}  (${r.note})`,
  );
}
console.log();
