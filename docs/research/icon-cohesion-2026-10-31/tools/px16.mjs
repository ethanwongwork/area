// How each icon lands on a 1× 16px grid (owner, 2026-11-01: "at 16 size some of the lines can become very
// dense/clumped and some icons ink just looks really off"). Each SVG is drawn into a 16 × 16 canvas at device
// scale 1, as a 1× screen shows it, and scored from the alpha of its 256 pixels:
//   clump   pixels whose whole 2 × 2 block is dark (≥ 0.75): ink fused into a blob, not a line
//   grey    ink pixels between 0.15 and 0.6: half-covered pixels, the blur of a line off the pixel grid
//   ink     summed alpha (how dark the icon is at 1×)
//   dark    pixels ≥ 0.75
// Sets as in measure.mjs; Area from dist/svg/16.
//   node docs/research/icon-cohesion-2026-10-31/tools/px16.mjs <set> out.json
import { readdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { edgeDump } from "../../icon-review/2026-10-07/edge.mjs";

const ROOT = process.cwd(), REFS = join(ROOT, "packages/icons/.cache/refs");
const SETS = {
  area: { dir: process.env.AREA_DIR || "packages/icons/dist/svg/16", keep: f => !f.endsWith("-filled.svg") },
  lucide: { dir: join(REFS, "lucide-static/package/icons") },
  phosphor: { dir: join(REFS, "phosphor-icons-core/package/assets/regular") },
};
const [set, out] = process.argv.slice(2);
const S = SETS[set];
const dir = S.dir.startsWith("/") ? S.dir : join(ROOT, S.dir);
const files = readdirSync(dir).filter(f => f.endsWith(".svg") && (!S.keep || S.keep(f))).sort();
const icons = files.map(f => [f.replace(/\.svg$/, ""), "data:image/svg+xml;base64," + Buffer.from(
  readFileSync(join(dir, f), "utf8").replace(/stroke-width="1\.25"/g, 'stroke-width="1.125"')
    .replace(/<(path|circle|rect)\b[^>]*data-filled="(gap|fill|stroke|halo|inset)"[^>]*\/>/g, "")
    .replace(/(<svg[^>]*?)\swidth="[^"]*"/, "$1").replace(/(<svg[^>]*?)\sheight="[^"]*"/, "$1").replace(/<svg\b/, '<svg width="16" height="16"')).toString("base64")]);
const page = `<!doctype html><body><pre id=out></pre><script>
const ICONS = ${JSON.stringify(icons)};
const cv = document.createElement("canvas"); cv.width = cv.height = 16; const g = cv.getContext("2d", { willReadFrequently: true });
const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
(async () => { const res = {};
  for (const [name, src] of ICONS) { const im = await load(src); if (!im) continue;
    g.clearRect(0, 0, 16, 16); g.drawImage(im, 0, 0, 16, 16);
    const d = g.getImageData(0, 0, 16, 16).data, a = []; for (let k = 0; k < 256; k++) a.push(d[k * 4 + 3] / 255);
    let ink = 0, grey = 0, dark = 0, inkPx = 0, clump = 0;
    for (const v of a) { ink += v; if (v > 0.05) inkPx++; if (v >= 0.15 && v <= 0.6) grey++; if (v >= 0.75) dark++; }
    const at = (x, y) => (x < 0 || y < 0 || x > 15 || y > 15) ? 0 : a[y * 16 + x];
    const cl = new Set();
    for (let y = 0; y < 15; y++) for (let x = 0; x < 15; x++) if (at(x, y) >= .75 && at(x + 1, y) >= .75 && at(x, y + 1) >= .75 && at(x + 1, y + 1) >= .75) [y * 16 + x, y * 16 + x + 1, (y + 1) * 16 + x, (y + 1) * 16 + x + 1].forEach(k => cl.add(k));
    clump = cl.size;
    res[name] = { ink: +ink.toFixed(2), inkPx, grey, dark, clump, greyShare: +(grey / Math.max(1, inkPx)).toFixed(3), clumpShare: +(clump / Math.max(1, dark)).toFixed(3), px: a.map(v => Math.round(v * 9)).join("") };
  }
  document.getElementById("out").textContent = JSON.stringify(res); })();
</script>`;
const tmp = mkdtempSync(join(ROOT, "packages/icons/.cache/px16-"));
try {
  writeFileSync(join(tmp, "m.html"), page);
  const dom = await edgeDump(["--user-data-dir=" + tmp + "/prof", "--no-first-run", "--disable-gpu", "--force-device-scale-factor=1", "--virtual-time-budget=600000"], "file://" + tmp + "/m.html");
  const json = dom.match(/<pre id="out">([^<]*)<\/pre>/)?.[1];
  if (!json) { console.error("no result"); process.exit(1); }
  writeFileSync(out, json.replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
  console.log(`${set}: ${Object.keys(JSON.parse(json.replace(/&quot;/g, '"'))).length} → ${out}`);
} finally { rmSync(tmp, { recursive: true, force: true }); }
