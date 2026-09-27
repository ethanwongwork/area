// Generates packages/react/src/components/color-grid.ts from the Area palette: one column per
// chromatic family in hue order, rows from dark to light, and a neutral row from white to
// black above them (the layout of the iOS color grid). Run: node scripts/gen-color-grid.mjs
import { readFileSync, writeFileSync } from "node:fs";

const palette = JSON.parse(readFileSync(new URL("../packages/tokens/src/color/palette.json", import.meta.url), "utf8"));
const title = name => name[0].toUpperCase() + name.slice(1);
// Tinted neutrals (cool, warm) and neutral itself are not hue columns.
const hues = Object.entries(palette.families)
  .filter(([name]) => !["neutral", "cool", "warm"].includes(name))
  .map(([name, rungs]) => ({ name, rungs, h: rungs["500"].oklch.H }))
  .sort((a, b) => ((a.h + 350) % 360) - ((b.h + 350) % 360)); // red (18°) first, pink (358°) last
const rows = ["900", "800", "700", "600", "500", "400", "300", "200", "100"];
const neutralSteps = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
const neutral = [
  { value: palette.constants.white.toUpperCase(), label: "White" },
  ...neutralSteps.slice(0, hues.length - 2).map(rung => ({ value: palette.families.neutral[rung].hex.toUpperCase(), label: `Neutral ${rung}` })),
  { value: palette.constants.black.toUpperCase(), label: "Black" },
];
if (neutral.length !== hues.length) throw new Error(`neutral row has ${neutral.length} cells for ${hues.length} columns`);
const options = [...neutral, ...rows.flatMap(rung => hues.map(({ name, rungs }) => ({ value: rungs[rung].hex.toUpperCase(), label: `${title(name)} ${rung}` })))];
writeFileSync(new URL("../packages/react/src/components/color-grid.ts", import.meta.url),
`/** Area palette grid for color pickers, generated from packages/tokens/src/color/palette.json by
 * scripts/gen-color-grid.mjs. Do not edit by hand. Columns: ${hues.map(h => h.name).join(", ")}. */
export const AREA_COLOR_GRID = {
  columns: ${hues.length},
  options: [
${options.map(o => `    { value: "${o.value}", label: "${o.label}" },`).join("\n")}
  ],
} as const;
`);
console.log(`${hues.length} columns, ${options.length} colors`);
