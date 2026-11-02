/**
 * Measures Area's colour ladder as the build paints it (color/scale.ts buildScale), per family and rung:
 * OKLCH, the most chroma sRGB holds at that L and h ("room"), the share of it used, ΔE_OK to the next rung,
 * hue drift from the 500 rung, WCAG on white and on #000, APCA on white.
 *
 *   node docs/research/color-system-2026-11-01/measure-ladder.ts            # table to stdout
 *   node docs/research/color-system-2026-11-01/measure-ladder.ts --json     # JSON (ladder.json)
 */
import { buildScale } from "../../../packages/tokens/src/color/scale.ts";
import { LEVELS } from "../../../packages/tokens/src/color/curves.ts";
import { maxChromaAt, findCusp } from "../../../packages/tokens/src/color/gamut.ts";
import { SRGB, parseHex, rgbToOklab } from "../../../packages/tokens/src/color/oklab.ts";
import { wcagContrastHex, apcaContrast } from "../../../packages/tokens/src/color/contrast.ts";
import { ALL_SCALES } from "../../../packages/tokens/src/color/presets.ts";

const json = process.argv.includes("--json");
const out: Record<string, unknown[]> = {};
const de = (a: string, b: string) => {
  const x = rgbToOklab(parseHex(a), SRGB), y = rgbToOklab(parseHex(b), SRGB);
  return Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b);
};
for (const spec of ALL_SCALES) {
  const s = buildScale(spec, "light");
  const h500 = s.steps.find((x) => x.level === 500)!.oklch.h;
  const cusp = spec.kind === "chromatic" ? findCusp(h500, SRGB) : { L: 0, C: 0 };
  const rows = s.steps.map((st, i) => {
    const room = maxChromaAt(st.oklch.L, st.oklch.h, SRGB);
    const next = s.steps[i + 1];
    return {
      level: st.level, hex: st.hex,
      L: +st.oklch.L.toFixed(3), C: +st.oklch.C.toFixed(3), h: +st.oklch.h.toFixed(1),
      room: +room.toFixed(3), share: room > 0.002 ? +(st.oklch.C / room).toFixed(2) : null,
      dE: next ? +de(st.hex, next.hex).toFixed(3) : null,
      hDrift: spec.kind === "chromatic" && st.oklch.C > 0.02 ? +(((st.oklch.h - h500 + 540) % 360) - 180).toFixed(1) : null,
      onWhite: +wcagContrastHex(st.hex, "#ffffff").toFixed(2), onBlack: +wcagContrastHex(st.hex, "#000000").toFixed(2),
      apcaWhite: +apcaContrast(st.hex, "#ffffff").toFixed(1),
    };
  });
  out[spec.id] = rows;
  if (!json) {
    console.log(`\n${spec.id}  (${spec.kind})  peak ${s.peak.level} C ${s.peak.C.toFixed(3)}  solid ${s.solid.level.light}  cusp L ${cusp.L.toFixed(3)} C ${cusp.C.toFixed(3)}`);
    console.log("lvl   hex       L     C     h      room  share  dE    hDrift  /white /black");
    for (const r of rows) console.log(
      `${String(r.level).padEnd(5)} ${r.hex} ${r.L.toFixed(3)} ${r.C.toFixed(3)} ${r.h.toFixed(1).padStart(6)} ${r.room.toFixed(3)} ${String(r.share ?? "-").padStart(5)} ${String(r.dE ?? "").padStart(5)} ${String(r.hDrift ?? "").padStart(6)} ${r.onWhite.toFixed(2).padStart(6)} ${r.onBlack.toFixed(2).padStart(6)}`);
  }
}
if (json) console.log(JSON.stringify(out));
