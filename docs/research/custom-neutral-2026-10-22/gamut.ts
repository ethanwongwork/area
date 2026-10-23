/** The strongest tint sRGB can show at a page's lightness, per hue: where a stronger one would clip. Run with node. */
import { writeFileSync } from "node:fs";
import { oklchToRgb, SRGB } from "../../../packages/tokens/src/color/oklab.ts";
const HUES = Array.from({ length: 24 }, (_, i) => i * 15), LS = [0.98, 0.95, 0.9, 0.2, 0.12];
const inGamut = (L: number, C: number, h: number) => { const rgb = oklchToRgb({ L, C, h }, SRGB); return rgb.every(v => v >= -1e-4 && v <= 1 + 1e-4); };
const out: Record<string, Record<string, number>> = {};
for (const L of LS) { out[L] = {}; for (const h of HUES) { let c = 0; while (c < 0.2 && inGamut(L, c + 0.001, h)) c += 0.001; out[L]![h] = Number(c.toFixed(3)); } }
writeFileSync(new URL("./gamut.json", import.meta.url), JSON.stringify(out, null, 1));
for (const L of LS) console.log(`L ${L}: min ${Math.min(...Object.values(out[L]!))} max ${Math.max(...Object.values(out[L]!))}`, HUES.filter((_, i) => i % 3 === 0).map(h => `${h}:${out[L]![h]}`).join(" "));
