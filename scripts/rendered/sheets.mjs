// Contact sheets: per Documentation kind and theme, every family's captured page at a quarter of its CSS size, its top
// 1,400 CSS px, four to a row. An overview for looking, not true scale. Needs a capture with pictures and merge.mjs.
//   node scripts/rendered/sheets.mjs [--out <dir>]     → <out>/sheets/<kind>-light.png, -dark.png
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { OUT } from "./capture.mjs";

const TOP = 1400, SCALE = 0.25, COLUMNS = 4, GAP = 24, CELL = Math.round(1456 * SCALE);

export async function sheets(out = join(OUT, "capture")) {
  const index = JSON.parse(readFileSync(join(out, "index.json"), "utf8"));
  mkdirSync(join(out, "sheets"), { recursive: true });
  const written = [];
  const kinds = [...new Set(index.families.map(family => family.kind))];
  for (const kind of kinds) for (const theme of ["light", "dark"]) {
    const files = index.families.filter(family => family.kind === kind).map(family => join(out, family.slug, `${theme}.png`)).filter(existsSync);
    if (!files.length) continue;
    const tiles = [];
    for (const file of files) {
      const meta = await sharp(file).metadata();
      // The pictures are at device scale 2: TOP CSS px are 2 × TOP image px.
      const height = Math.min(meta.height, TOP * 2);
      // A page captured in a wider window is fitted to the cell.
      const w = Math.min(CELL, Math.round(meta.width * SCALE / 2));
      const input = await sharp(file).extract({ left: 0, top: 0, width: meta.width, height }).resize({ width: w }).png().toBuffer();
      tiles.push({ input, height: (await sharp(input).metadata()).height });
    }
    const rows = [];
    for (let i = 0; i < tiles.length; i += COLUMNS) rows.push(tiles.slice(i, i + COLUMNS));
    const heights = rows.map(row => Math.max(...row.map(tile => tile.height)));
    const width = COLUMNS * CELL + (COLUMNS + 1) * GAP;
    const height = heights.reduce((sum, h) => sum + h + GAP, GAP);
    const composite = [];
    let top = GAP;
    rows.forEach((row, r) => { row.forEach((tile, c) => composite.push({ input: tile.input, top, left: GAP + c * (CELL + GAP) })); top += heights[r] + GAP; });
    const background = theme === "dark" ? { r: 24, g: 24, b: 24, alpha: 1 } : { r: 236, g: 236, b: 236, alpha: 1 };
    const file = join(out, "sheets", `${kind}-${theme}.png`);
    await sharp({ create: { width, height, channels: 4, background } }).composite(composite).png().toFile(file);
    written.push(file);
  }
  return written;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const at = process.argv.indexOf("--out");
  const written = await sheets(at > 0 ? resolve(process.argv[at + 1]) : join(OUT, "capture"));
  console.log(written.join("\n"));
}
