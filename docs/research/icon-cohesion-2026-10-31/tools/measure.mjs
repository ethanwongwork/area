// Optical measures for a whole icon set, Area's and the open-source libraries', on one scale, so
// cohesion is a number (owner, 2026-10-31: "the icon set really doesnt look that cohesive").
// Each SVG is drawn at 64px (4× a 16px slot, its own stroke scaled with it) in headless Edge and
// measured from the alpha channel:
//   size     √ of the ink's convex-hull area, in 16px units (what the eye reads as size)
//   w, h     ink box, 16px units
//   mass     ink area, 16px² units (how dark the icon is in a row)
//   density  mass / hull area (how heavy it reads inside its own outline)
//   solid    share of the ink thicker than 1.6 × the set's line (dots, blocks, filled glyphs)
//   blob     the largest solid island, 16px² (a ⌀2 dot is about 3.1)
//   cx, cy   ink centroid minus the canvas centre, 16px units (optical balance)
//   holes    enclosed counters; minHole the smallest one's area, 16px²
//   shape    hull area / box area: ≈0.79 round, ≈1 square, ≈0.5 diamond or triangle
// Libraries read from packages/icons/.cache/refs (refs.mjs fetch, plus tabler, heroicons, iconoir).
//   node docs/research/icon-cohesion-2026-10-31/tools/measure.mjs <set> out.json [max]
//   sets: area (dist/svg/16), lucide, phosphor, tabler, heroicons, iconoir, fluent
import { readdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { edgeDump } from "../../icon-review/2026-10-07/edge.mjs";

const ROOT = process.cwd(), REFS = join(ROOT, "packages/icons/.cache/refs");
const SETS = {
  area: { dir: "packages/icons/dist/svg/16", keep: f => !f.endsWith("-filled.svg"), line: 1.125 },
  lucide: { dir: join(REFS, "lucide-static/package/icons"), line: 2 * 16 / 24 },
  phosphor: { dir: join(REFS, "phosphor-icons-core/package/assets/regular"), line: 1 },
  tabler: { dir: join(REFS, "tabler-icons/package/icons/outline"), line: 2 * 16 / 24 },
  heroicons: { dir: join(REFS, "heroicons/package/24/outline"), line: 1 },
  iconoir: { dir: join(REFS, "iconoir/package/icons/regular"), line: 1 },
  fluent: { dir: join(REFS, "fluentui-svg-icons/package/icons"), keep: f => f.endsWith("_16_regular.svg"), line: 1 },
};
const [set, out, max = "100000"] = process.argv.slice(2);
const S = SETS[set];
if (!S || !out) { console.log("usage: measure.mjs <" + Object.keys(SETS).join("|") + "> out.json [max]"); process.exit(1); }
const dir = S.dir.startsWith("/") ? S.dir : join(ROOT, S.dir);
const files = readdirSync(dir).filter(f => f.endsWith(".svg") && (!S.keep || S.keep(f))).sort().slice(0, +max);
const icons = files.map(f => [f.replace(/(_16_regular)?\.svg$/, ""), "data:image/svg+xml;base64," + Buffer.from(
  readFileSync(join(dir, f), "utf8").replace(/<svg\b/, '<svg width="64" height="64"').replace(/(<svg[^>]*?)\swidth="(?!64")[^"]*"/, "$1").replace(/(<svg[^>]*?)\sheight="(?!64")[^"]*"/, "$1")).toString("base64")]);

const page = `<!doctype html><body><pre id=out></pre><script>
const ICONS = ${JSON.stringify(icons)}, LINE = ${S.line}, N = 64, K = 4;
const cv = document.createElement("canvas"); cv.width = cv.height = N; const g = cv.getContext("2d", { willReadFrequently: true });
const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
function hullArea(pts) {
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = l => { const h = []; for (const q of l) { while (h.length >= 2 && cr(h.at(-2), h.at(-1), q) <= 0) h.pop(); h.push(q); } return h; };
  const h = [...half(pts).slice(0, -1), ...half([...pts].reverse()).slice(0, -1)];
  let a = 0; for (let k = 0; k < h.length; k++) { const [x1, y1] = h[k], [x2, y2] = h[(k + 1) % h.length]; a += x1 * y2 - x2 * y1; } return Math.abs(a) / 2;
}
(async () => {
  const res = {};
  for (const [name, src] of ICONS) {
    const im = await load(src); if (!im) continue;
    g.clearRect(0, 0, N, N); g.drawImage(im, 0, 0, N, N);
    const d = g.getImageData(0, 0, N, N).data, a = new Float32Array(N * N);
    let mass = 0, sx = 0, sy = 0, x0 = N, y0 = N, x1 = -1, y1 = -1; const pts = [];
    for (let j = 0; j < N; j++) { let lo = -1, hi = -1; for (let i = 0; i < N; i++) { const v = d[(j * N + i) * 4 + 3] / 255; a[j * N + i] = v; if (v > 0) { mass += v; sx += v * (i + .5); sy += v * (j + .5); } if (v > .5) { if (lo < 0) lo = i; hi = i; } }
      if (lo >= 0) { pts.push([lo, j], [hi + 1, j], [lo, j + 1], [hi + 1, j + 1]); x0 = Math.min(x0, lo); x1 = Math.max(x1, hi + 1); y0 = Math.min(y0, j); y1 = j + 1; } }
    if (!mass || pts.length < 3) continue;
    const hull = hullArea(pts) / K / K;
    // Solid ink: a pixel whose whole disc of radius 0.8 × line (in 64px units) is ink.
    const R = 0.8 * LINE * K, ri = Math.ceil(R), solid = new Uint8Array(N * N); let sol = 0;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { if (a[j * N + i] < .5) continue; let ok = true;
      for (let v = -ri; v <= ri && ok; v++) for (let u = -ri; u <= ri; u++) { if (u * u + v * v > R * R) continue; const x = i + u, y = j + v; if (x < 0 || y < 0 || x >= N || y >= N || a[y * N + x] < .5) { ok = false; break; } }
      if (ok) { solid[j * N + i] = 1; sol++; } }
    // Grow the solid cores back by R to get the solid islands; the largest is the blob.
    const grown = new Uint8Array(N * N);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) if (solid[j * N + i]) for (let v = -ri; v <= ri; v++) for (let u = -ri; u <= ri; u++) { if (u * u + v * v > R * R) continue; const x = i + u, y = j + v; if (x >= 0 && y >= 0 && x < N && y < N && a[y * N + x] >= .5) grown[y * N + x] = 1; }
    let blob = 0, solidArea = 0; const seen = new Uint8Array(N * N);
    for (let k = 0; k < N * N; k++) if (grown[k] && !seen[k]) { let c = 0; const st = [k]; seen[k] = 1; while (st.length) { const m = st.pop(); c++; const x = m % N, y = (m - x) / N; for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= N || yy >= N) continue; const q = yy * N + xx; if (grown[q] && !seen[q]) { seen[q] = 1; st.push(q); } } } blob = Math.max(blob, c); solidArea += c; }
    // Counters: background regions not reached from the border.
    const out = new Uint8Array(N * N), st = []; for (let k = 0; k < N; k++) for (const m of [k, (N - 1) * N + k, k * N, k * N + N - 1]) if (a[m] < .5 && !out[m]) { out[m] = 1; st.push(m); }
    while (st.length) { const m = st.pop(), x = m % N, y = (m - x) / N; for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= N || yy >= N) continue; const q = yy * N + xx; if (a[q] < .5 && !out[q]) { out[q] = 1; st.push(q); } } }
    const holes = []; const hs = new Uint8Array(N * N);
    for (let k = 0; k < N * N; k++) if (a[k] < .5 && !out[k] && !hs[k]) { let c = 0; const s2 = [k]; hs[k] = 1; while (s2.length) { const m = s2.pop(); c++; const x = m % N, y = (m - x) / N; for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= N || yy >= N) continue; const q = yy * N + xx; if (a[q] < .5 && !out[q] && !hs[q]) { hs[q] = 1; s2.push(q); } } } if (c > 3) holes.push(c / K / K); }
    const r3 = v => Math.round(v * 1000) / 1000;
    res[name] = { size: r3(Math.sqrt(hull)), w: r3((x1 - x0) / K), h: r3((y1 - y0) / K), mass: r3(mass / K / K), density: r3(mass / K / K / hull),
      solid: r3(solidArea / Math.max(1, [...a].filter(v => v >= .5).length)), blob: r3(blob / K / K), cx: r3(sx / mass / K - 8), cy: r3(sy / mass / K - 8),
      holes: holes.length, minHole: holes.length ? r3(Math.min(...holes)) : null, shape: r3(hull / ((x1 - x0) * (y1 - y0) / K / K)) };
  }
  document.getElementById("out").textContent = JSON.stringify(res);
})();
</script>`;
const tmp = mkdtempSync(join(ROOT, "packages/icons/.cache/measure-"));
try {
  writeFileSync(join(tmp, "m.html"), page);
  const dom = await edgeDump(["--user-data-dir=" + tmp + "/prof", "--no-first-run", "--disable-gpu", "--virtual-time-budget=600000", "--run-all-compositor-stages-before-draw"], "file://" + tmp + "/m.html");
  const json = dom.match(/<pre id="out">([^<]*)<\/pre>/)?.[1];
  if (!json) { console.error("no result (page did not finish)"); process.exit(1); }
  writeFileSync(out, json.replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
  console.log(`${set}: ${Object.keys(JSON.parse(json.replace(/&quot;/g, '"').replace(/&amp;/g, "&"))).length} icons → ${out}`);
} finally { rmSync(tmp, { recursive: true, force: true }); }
