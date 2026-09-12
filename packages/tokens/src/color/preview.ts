/**
 * Prints every scale as ANSI truecolour swatches so the ramps can be judged by eye.
 * Run with `npm run preview -w @area/tokens`. Tuning the lightness curves is design
 * work, and this is the instrument for it.
 */
import { ALL_SCALES } from "./presets.ts";
import { type Theme, buildScale } from "./scale.ts";
import { parseHex } from "./oklab.ts";
import { wcagContrastHex } from "./contrast.ts";

function swatch(hex: string, label: string): string {
  const [r, g, b] = parseHex(hex).map((v) => Math.round(v * 255));
  const fg = wcagContrastHex("#ffffff", hex) >= 4.5 ? "255;255;255" : "0;0;0";
  return `\x1b[48;2;${r};${g};${b}m\x1b[38;2;${fg}m${label}\x1b[0m`;
}

const theme = (process.argv[2] as Theme) ?? "light";

console.log(`\n  Area colour scales — ${theme}\n`);
console.log(`  ${"".padEnd(8)}${[1,2,3,4,5,6,7,8,9,10,11,12].map((s) => String(s).padStart(4).padEnd(8)).join("")}`);

for (const spec of ALL_SCALES) {
  const scale = buildScale(spec, theme);
  const row = scale.steps.map((s) => swatch(s.hex, ` ${s.hex} `)).join("");
  console.log(`  ${spec.id.padEnd(8)}${row}`);
}

console.log("\n  Step 9 (solid fill) — foreground chosen by measurement\n");
for (const spec of ALL_SCALES) {
  if (spec.kind !== "chromatic") continue;
  const s = buildScale(spec, theme);
  const nine = s.steps[8]!;
  const flag = s.contrast.wcag >= 4.5 ? "AA " : s.contrast.wcag >= 3 ? "AA-large" : "FAIL";
  console.log(
    `  ${spec.id.padEnd(8)} ${swatch(nine.hex, `  ${s.contrast.hex === "#ffffff" ? "white" : "black"} text  `)}` +
      `  ${nine.hex}  L=${nine.oklch.L.toFixed(3)} C=${nine.oklch.C.toFixed(3)} h=${nine.oklch.h.toFixed(1)}` +
      `  cusp L=${s.cusp.L.toFixed(3)}  WCAG ${s.contrast.wcag.toFixed(2)}  Lc ${s.contrast.apca.toFixed(0)}  ${flag}`,
  );
}
console.log();
