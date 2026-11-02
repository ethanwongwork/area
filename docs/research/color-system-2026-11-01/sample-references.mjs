/**
 * Samples the owner's reference images (OpenAI gradients, Polar Signals, ChatGPT card) at a coarse grid and reports
 * each cell's OKLCH, then clusters them by hue. Approximate: JPEG/PNG compression, blur and grain.
 *   node docs/research/color-system-2026-11-01/sample-references.mjs <image> [...]
 */
import sharp from "sharp";
import Color from "colorjs.io";

const COLS = 16, ROWS = 9;
for (const file of process.argv.slice(2)) {
  const { data, info } = await sharp(file).resize(COLS, ROWS, { fit: "fill", kernel: "cubic" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const cells = [];
  for (let i = 0; i < info.width * info.height; i++) {
    const [r, g, b] = [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];
    const c = new Color("srgb", [r / 255, g / 255, b / 255]).to("oklch");
    const [L, C, h] = c.coords;
    cells.push({ hex: new Color("srgb", [r / 255, g / 255, b / 255]).toString({ format: "hex" }), L, C, h: Number.isNaN(h) ? 0 : h });
  }
  const chromatic = cells.filter(c => c.C > 0.03);
  const bins = new Map();
  for (const c of chromatic) { const k = Math.round(c.h / 20) * 20 % 360; (bins.get(k) ?? bins.set(k, []).get(k)).push(c); }
  console.log(`\n${file.split("/").pop()}  ${chromatic.length}/${cells.length} chromatic cells`);
  for (const [k, list] of [...bins].sort((a, b) => a[0] - b[0])) {
    if (list.length < 2) continue;
    const avg = (f) => list.reduce((s, c) => s + f(c), 0) / list.length;
    const maxC = list.reduce((a, c) => c.C > a.C ? c : a);
    console.log(`  h~${String(k).padStart(3)}  n ${String(list.length).padStart(3)}  L ${avg(c => c.L).toFixed(2)} (${Math.min(...list.map(c => c.L)).toFixed(2)}–${Math.max(...list.map(c => c.L)).toFixed(2)})  C ${avg(c => c.C).toFixed(3)} (max ${maxC.C.toFixed(3)} ${maxC.hex} L ${maxC.L.toFixed(2)})`);
  }
}
