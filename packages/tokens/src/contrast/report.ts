/**
 * Groups gate failures by assertion so curve tuning is driven by the worst case,
 * not by whichever failure the test runner printed last.
 */
import { ASSERTIONS } from "./assertions.ts";
import { isWaived } from "./exceptions.ts";
import { apcaMagnitude, wcagContrastHex } from "../color/contrast.ts";
import { shippedThemes } from "../semantic/resolve.ts";

interface Row {
  /** Set when this pairing is covered by a documented exception. */
  waived?: string;
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
    const ctx = `${t.theme}/${t.neutral}/${t.brand}`;

    const checks: Array<[string, number, number]> = [["wcag", wcagContrastHex(fg, bg), a.wcag]];
    if (t.theme === "dark") checks.push(["apca", apcaMagnitude(fg, bg), a.apca]);

    for (const [standard, actual, required] of checks) {
      // A waived pairing is still measured and still shown -- in its own section, with its
      // reason -- because the point of writing an exception down was to keep it visible.
      // Folding it into the pass count would make this report disagree with the gate in the
      // direction that flatters the system.
      const waiver = isWaived(
        { fg: a.fg, bg: a.bg, standard: standard as "wcag" | "apca" },
        { theme: t.theme, brand: t.brand, neutral: t.neutral },
      );
      const key = `${waiver ? "waived|" : ""}${standard}|${a.fg}|${a.bg}`;
      const row = rows.get(key) ?? {
        waived: waiver?.reason,
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

const all = [...rows.values()].filter((r) => r.count > 0).sort((a, b) => b.count - a.count);
const failing = all.filter((r) => !r.waived);
const waived = all.filter((r) => r.waived);
const passing = [...rows.values()].filter((r) => r.count === 0).length;

console.log(`\n  ${failing.length} failing assertion(s), ${passing} passing, across ${themes.length} themes\n`);
console.log(`  ${"assertion".padEnd(40)} ${"std".padEnd(5)} ${"req".padEnd(6)} ${"worst".padEnd(8)} fail/total  worst case`);
for (const r of failing) {
  console.log(
    `  ${r.key.padEnd(40)} ${r.standard.padEnd(5)} ${String(r.required).padEnd(6)} ${r.worst.toFixed(2).padEnd(8)} ${String(r.count).padStart(3)}/${String(r.total).padEnd(5)} ${r.worstAt}  (${r.note})`,
  );
}

if (waived.length) {
  console.log(`  ${waived.length} waived assertion(s) -- measured, below the bar, and recorded:\n`);
  for (const r of waived) {
    console.log(
      `  ${r.key.padEnd(40)} ${r.standard.padEnd(5)} ${String(r.required).padEnd(6)} ${r.worst.toFixed(2).padEnd(8)} ${String(r.count).padStart(3)}/${String(r.total).padEnd(5)} ${r.worstAt}`,
    );
    console.log(`    ${r.waived}`);
  }
}

console.log();

process.exitCode = failing.length ? 1 : 0;
