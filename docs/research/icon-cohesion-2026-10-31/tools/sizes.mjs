// Optical measures at every shipped size (owner, 2026-11-01: "measuring ink, measuring optical size at all sizes").
// The build's 16, 20 and 24px SVGs (each with its own line from the size curve) and 32 / 48 (the 24 drawing scaled, as
// the package ships them) are drawn at 4× in headless Edge. Per icon and size, in units of the slot (1 = the slot):
//   size     √ of the ink's convex-hull area / slot
//   mass     ink area / slot²            density  mass / hull
//   cx, cy   ink centroid − slot centre, / slot (optical balance)
//   holes    enclosed counters; minHole  the smallest, / slot²
// Writes { size: { icon: {…} } } for docs/research/icon-cohesion-2026-10-31/tools/sizes.py.
//   node docs/research/icon-cohesion-2026-10-31/tools/sizes.mjs out.json
import { readdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { edgeDump } from "../../icon-review/2026-10-07/edge.mjs";

const ROOT = process.cwd(), DIST = join(ROOT, "packages/icons/dist/svg");
const out = process.argv[2];
const SIZES = [[16, 16], [20, 20], [24, 24], [32, 24], [48, 24]];
const names = readdirSync(join(DIST, "16")).filter(f => f.endsWith(".svg") && !f.endsWith("-filled.svg")).map(f => f.slice(0, -4)).sort();
const data = {};
for (const [, src] of SIZES) for (const n of names) data[`${src}/${n}`] ??= "data:image/svg+xml;base64," + Buffer.from(readFileSync(join(DIST, String(src), n + ".svg"), "utf8")
  .replace(/(<svg[^>]*?)\swidth="[^"]*"/, "$1").replace(/(<svg[^>]*?)\sheight="[^"]*"/, "$1").replace(/<svg\b/, '<svg width="256" height="256"')).toString("base64");
const page = `<!doctype html><body><pre id=out></pre><script>
const DATA = ${JSON.stringify(data)}, NAMES = ${JSON.stringify(names)}, SIZES = ${JSON.stringify(SIZES)};
const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
const hullArea = pts => { pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = l => { const h = []; for (const q of l) { while (h.length >= 2 && cr(h.at(-2), h.at(-1), q) <= 0) h.pop(); h.push(q); } return h; };
  const h = [...half(pts).slice(0, -1), ...half([...pts].reverse()).slice(0, -1)]; let a = 0; for (let k = 0; k < h.length; k++) { const [x1, y1] = h[k], [x2, y2] = h[(k + 1) % h.length]; a += x1 * y2 - x2 * y1; } return Math.abs(a) / 2; };
(async () => { const res = {};
  for (const [size, src] of SIZES) { const N = size * 4, cv = document.createElement("canvas"); cv.width = cv.height = N; const g = cv.getContext("2d", { willReadFrequently: true }); res[size] = {};
    for (const n of NAMES) { const im = await load(DATA[src + "/" + n]); if (!im) continue; g.clearRect(0, 0, N, N); g.drawImage(im, 0, 0, N, N);
      const d = g.getImageData(0, 0, N, N).data; let mass = 0, sx = 0, sy = 0; const pts = [], a = new Float32Array(N * N);
      for (let j = 0; j < N; j++) { let lo = -1, hi = -1; for (let i = 0; i < N; i++) { const v = d[(j * N + i) * 4 + 3] / 255; a[j * N + i] = v; if (v > 0) { mass += v; sx += v * (i + .5); sy += v * (j + .5); } if (v > .5) { if (lo < 0) lo = i; hi = i; } } if (lo >= 0) pts.push([lo, j], [hi + 1, j], [lo, j + 1], [hi + 1, j + 1]); }
      if (!mass || pts.length < 3) continue; const hull = hullArea(pts);
      const outside = new Uint8Array(N * N), st = []; for (let k = 0; k < N; k++) for (const m of [k, (N - 1) * N + k, k * N, k * N + N - 1]) if (a[m] < .5 && !outside[m]) { outside[m] = 1; st.push(m); }
      while (st.length) { const m = st.pop(), x = m % N, y = (m - x) / N; for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= N || yy >= N) continue; const q = yy * N + xx; if (a[q] < .5 && !outside[q]) { outside[q] = 1; st.push(q); } } }
      const holes = [], seen = new Uint8Array(N * N); for (let k = 0; k < N * N; k++) if (a[k] < .5 && !outside[k] && !seen[k]) { let c = 0; const s2 = [k]; seen[k] = 1; while (s2.length) { const m = s2.pop(); c++; const x = m % N, y = (m - x) / N; for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= N || yy >= N) continue; const q = yy * N + xx; if (a[q] < .5 && !outside[q] && !seen[q]) { seen[q] = 1; s2.push(q); } } } if (c > 3) holes.push(c / N / N); }
      const r4 = v => Math.round(v * 1e4) / 1e4;
      res[size][n] = { size: r4(Math.sqrt(hull) / N), mass: r4(mass / N / N), density: r4(mass / hull), cx: r4(sx / mass / N - .5), cy: r4(sy / mass / N - .5), holes: holes.length, minHole: holes.length ? r4(Math.min(...holes)) : null };
    } }
  document.getElementById("out").textContent = JSON.stringify(res); })();
</script>`;
const tmp = mkdtempSync(join(ROOT, "packages/icons/.cache/sizes-"));
try {
  writeFileSync(join(tmp, "m.html"), page);
  const dom = await edgeDump(["--user-data-dir=" + tmp + "/prof", "--no-first-run", "--disable-gpu", "--force-device-scale-factor=1", "--virtual-time-budget=1200000"], "file://" + tmp + "/m.html", 1200000);
  const json = dom.match(/<pre id="out">([^<]*)<\/pre>/)?.[1];
  if (!json) { console.error("no result"); process.exit(1); }
  writeFileSync(out, json.replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
  console.log(`${names.length} icons × ${SIZES.length} sizes → ${out}`);
} finally { rmSync(tmp, { recursive: true, force: true }); }
