/**
 * The pairing table (plan F7, RD9: "No published colour pairing rule"): which inks meet 4.5:1 and 3:1 on which
 * grounds, light and dark, at the shipped defaults. Computed by the gate's own model and measure (`resolveTheme`,
 * `wcagContrastHex`, as contrast.test.ts and report.ts do), so the table and the gate cannot disagree. It reports; the
 * gate (contrast.test.ts, ASSERTIONS) is still what fails a build, and a pairing absent from ASSERTIONS is not a
 * supported one because it happens to clear here.
 *
 *   node packages/tokens/src/contrast/pairings.ts           print the table
 *   node packages/tokens/src/contrast/pairings.ts --write   write docs/CONTRAST_PAIRINGS.md
 *
 * pairings.test.ts fails when the written file is not what this produces.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { wcagContrastHex } from "../color/contrast.ts";
import { DEFAULT_SELECTION, type ResolvedTheme, resolveTheme } from "../semantic/resolve.ts";
import { ASSERTIONS } from "./assertions.ts";

export const PAIRINGS_FILE = fileURLToPath(new URL("../../../../docs/CONTRAST_PAIRINGS.md", import.meta.url));

/** The neutral grounds every ink may sit on: the page, the layers and the component plates at rest, hover and selected. */
const GROUNDS = ["bg-page", "bg-surface", "bg-subtle", "bg-component", "bg-component-hover", "bg-component-active"] as const;
const NEUTRAL_INKS = ["fg-default", "fg-muted", "fg-placeholder", "fg-disabled", "fg-accent", "fg-accent-vivid", "fg-accent-strong"] as const;
const TONES = ["danger", "warning", "caution", "success", "info", "discovery", "pink", "brown", "gray"] as const;
/** Non-text indicators, which need 3:1 (WCAG 1.4.11), on the same grounds. */
const INDICATORS = ["stroke-control", "stroke-control-hover", "stroke-selected", "accent-indicator"] as const;

type Band = "4.5" | "3" | "below";
const band = (ratio: number): Band => (ratio >= 4.5 ? "4.5" : ratio >= 3 ? "3" : "below");
const cell = (ratio: number) => `${band(ratio) === "4.5" ? "**4.5**" : band(ratio) === "3" ? "3" : "no"} (${ratio.toFixed(2)})`;

function themes(): Record<"light" | "dark", ResolvedTheme> {
  return {
    light: resolveTheme({ ...DEFAULT_SELECTION, theme: "light" }),
    dark: resolveTheme({ ...DEFAULT_SELECTION, theme: "dark" }),
  };
}

/** Measure when both are opaque colours; translucent tokens would need compositing over a ground the table can't know. */
function ratio(theme: ResolvedTheme, fg: string, bg: string): number | undefined {
  const a = theme.tokens[fg], b = theme.tokens[bg];
  if (!a || !b || a.length > 7 || b.length > 7) return undefined;
  return wcagContrastHex(a, b);
}

export interface PairingRow { ink: string; ground: string; light?: number; dark?: number; asserted: boolean }

/** Every row of the table, in its order. */
export function pairings(): PairingRow[] {
  const t = themes();
  const asserted = new Set(ASSERTIONS.map((a) => `${a.fg}|${a.bg}`));
  const rows: PairingRow[] = [];
  const add = (ink: string, ground: string) => {
    const light = ratio(t.light, ink, ground), dark = ratio(t.dark, ink, ground);
    if (light === undefined && dark === undefined) return;
    rows.push({ ink, ground, light, dark, asserted: asserted.has(`${ink}|${ground}`) });
  };
  for (const ink of [...NEUTRAL_INKS, ...TONES.map((tone) => `fg-${tone}`), ...INDICATORS]) for (const ground of GROUNDS) add(ink, ground);
  for (const tone of TONES) {
    for (const ground of [`${tone}-surface`, `${tone}-surface-hover`, `${tone}-surface-active`]) {
      add(`fg-${tone}`, ground);
      add(`fg-${tone}-strong`, ground);
    }
    add(`fg-on-${tone}`, `${tone}-solid`);
  }
  add("fg-on-accent", "accent-solid");
  add("fg-on-neutral", "neutral-solid");
  add("fg-on-inverse", "bg-inverse");
  return rows;
}

const SHORT: Record<string, string> = {
  "bg-page": "Page", "bg-surface": "Surface", "bg-subtle": "Subtle", "bg-component": "Plate",
  "bg-component-hover": "Plate, hover", "bg-component-active": "Plate, selected",
};

/** The table as Markdown: one grid per mode for the neutral grounds, then each tone's own grounds. */
export function pairingsMarkdown(): string {
  const rows = pairings();
  const on = new Map(rows.map((row) => [`${row.ink}|${row.ground}`, row]));
  const grid = (mode: "light" | "dark", inks: readonly string[]) => [
    `| Ink | ${GROUNDS.map((g) => `${SHORT[g]} (\`${g}\`)`).join(" | ")} |`,
    `|---|${GROUNDS.map(() => "---").join("|")}|`,
    ...inks.filter((ink) => GROUNDS.some((g) => on.get(`${ink}|${g}`)?.[mode] !== undefined)).map((ink) =>
      `| \`${ink}\` | ${GROUNDS.map((g) => { const value = on.get(`${ink}|${g}`)?.[mode]; return value === undefined ? "—" : cell(value); }).join(" | ")} |`),
  ];
  const inks = [...NEUTRAL_INKS, ...TONES.map((tone) => `fg-${tone}`), ...INDICATORS];
  const own = rows.filter((row) => !GROUNDS.includes(row.ground as (typeof GROUNDS)[number]));
  const sel = DEFAULT_SELECTION;
  return [
    "# Contrast pairings",
    "",
    "<!-- Generated by `node packages/tokens/src/contrast/pairings.ts --write` from the contrast suite's model",
    "     (semantic/resolve.ts) and measure (color/contrast.ts). Do not edit: pairings.test.ts fails when this file is stale. -->",
    "",
    `Which inks meet 4.5:1 (text) and 3:1 (large text, icons and other indicators) on which grounds, at the shipped`,
    `defaults (neutral \`${sel.neutral}\`, accent \`${sel.accent}\`, default Layers, Tone contrast 4.5), light and dark, in WCAG 2.2`,
    "ratios. **4.5** meets 4.5:1; 3 meets 3:1 only; no meets neither. The ratio follows in brackets.",
    "",
    "This is a report of the gate's numbers, not a list of supported pairings: the supported ones are the assertions in",
    "`packages/tokens/src/contrast/assertions.ts` (marked Asserted below), which `npm test` holds across every neutral and",
    "accent. A pair that clears here at the defaults may fail at another setting. Rules: [Color, stroke and focus](CONTRAST.md).",
    "",
    "## Light, on the neutral grounds",
    "",
    ...grid("light", inks),
    "",
    "## Dark, on the neutral grounds",
    "",
    ...grid("dark", inks),
    "",
    "## Each tone on its own grounds",
    "",
    "| Ink | Ground | Light | Dark | Asserted |",
    "|---|---|---|---|---|",
    ...own.map((row) => `| \`${row.ink}\` | \`${row.ground}\` | ${row.light === undefined ? "—" : cell(row.light)} | ${row.dark === undefined ? "—" : cell(row.dark)} | ${row.asserted ? "Yes" : "No"} |`),
    "",
  ].join("\n");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const text = pairingsMarkdown();
  if (process.argv.includes("--write")) {
    writeFileSync(PAIRINGS_FILE, text);
    console.log(`Wrote ${PAIRINGS_FILE}`);
  } else console.log(text);
}
