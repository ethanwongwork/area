// Apparent size (sqrt of the ink's convex-hull area), ink coverage and ink centre for Area (24px outline), and
// Lucide / Phosphor counterparts, all rasterised the same way at 96px. Output: measure.json.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { edgeDump } from "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0/docs/research/icon-review/2026-10-07/edge.mjs";
const D = new URL(".", import.meta.url).pathname, W = "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0";
const R = "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-work-ea140f/packages/icons/.cache/refs";
const map = JSON.parse(readFileSync(W + "/docs/research/icon-audit/area-map.json", "utf8"));
const audit = readFileSync(D + "audit.txt", "utf8").split("\n").map(l => l.match(/^\s+(\S+)\s+(square|circle|horizontal|vertical)\s/)).filter(Boolean).map(m => [m[1], m[2]]);
const items = [];
const clean = s => s.replace(/<!--[\s\S]*?-->/g, "").replace(/currentColor/g, "#000");
for (const [name, key] of audit) {
  items.push({ lib: "area", name, key, svg: clean(readFileSync(`${W}/packages/icons/dist/svg/24/${name}.svg`, "utf8")) });
  const m = map[name] || {};
  const lp = `${R}/lucide-static/package/icons/${m.lucide}.svg`; if (m.lucide && existsSync(lp)) items.push({ lib: "lucide", name, key, svg: clean(readFileSync(lp, "utf8")) });
  const pp = `${R}/phosphor-icons-core/package/assets/regular/${m.phosphor}.svg`; if (m.phosphor && existsSync(pp)) items.push({ lib: "phosphor", name, key, svg: clean(readFileSync(pp, "utf8")).replace(/<svg(?![^>]*xmlns)/, '<svg xmlns="http://www.w3.org/2000/svg"').replace(/<svg/, '<svg width="24" height="24"') });
}
const page = `<!doctype html><meta charset="utf-8"><body><script>
const items = ${JSON.stringify(items)};
const N = 96, cv = document.createElement("canvas"); cv.width = cv.height = N; const cx = cv.getContext("2d", { willReadFrequently: true });
const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s.replace(/width="[^"]*"/, 'width="96"').replace(/height="[^"]*"/, 'height="96"')); });
(async () => {
  const out = [];
  for (const it of items) {
    const img = await load(it.svg); if (!img) { out.push({ ...it, svg: undefined, err: 1 }); continue; }
    cx.clearRect(0, 0, N, N); cx.drawImage(img, 0, 0, N, N);
    const a = cx.getImageData(0, 0, N, N).data; let cov = 0, sx = 0, sy = 0; const pts = [];
    for (let y = 0; y < N; y++) { let lo = -1, hi = -1; for (let x = 0; x < N; x++) { const v = a[(y * N + x) * 4 + 3] / 255; if (v > 0) { cov += v; sx += v * (x + .5); sy += v * (y + .5); } if (v > .5) { if (lo < 0) lo = x; hi = x; } }
      if (lo >= 0) pts.push([lo, y], [hi + 1, y], [lo, y + 1], [hi + 1, y + 1]); }
    pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const cr = (o, p, q) => (p[0] - o[0]) * (q[1] - o[1]) - (p[1] - o[1]) * (q[0] - o[0]);
    const half = l => { const h = []; for (const q of l) { while (h.length >= 2 && cr(h.at(-2), h.at(-1), q) <= 0) h.pop(); h.push(q); } return h; };
    const hull = [...half(pts).slice(0, -1), ...half([...pts].reverse()).slice(0, -1)];
    let ar = 0; for (let k = 0; k < hull.length; k++) { const [x1, y1] = hull[k], [x2, y2] = hull[(k + 1) % hull.length]; ar += x1 * y2 - x2 * y1; }
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    out.push({ lib: it.lib, name: it.name, key: it.key, size: Math.sqrt(Math.abs(ar) / 2) / N, cov: cov / N / N, cx: sx / cov / N, cy: sy / cov / N,
      bw: (Math.max(...xs) - Math.min(...xs)) / N, bh: (Math.max(...ys) - Math.min(...ys)) / N, bcx: (Math.max(...xs) + Math.min(...xs)) / 2 / N, bcy: (Math.max(...ys) + Math.min(...ys)) / 2 / N });
  }
  const pre = document.createElement("pre"); pre.id = "out"; pre.textContent = JSON.stringify(out); document.body.append(pre);
})();
</script>`;
writeFileSync(D + "measure.html", page);
const dom = await edgeDump(["--user-data-dir=" + D + "profM", "--no-first-run", "--disable-gpu", "--virtual-time-budget=120000"], "file://" + D + "measure.html");
const m = dom.match(/<pre id="out">([\s\S]*?)<\/pre>/);
if (!m) { console.log("no output", dom.slice(0, 300)); process.exit(1); }
const data = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
writeFileSync(D + "measure.json", JSON.stringify(data));
const c = {}; for (const d of data) c[d.lib] = (c[d.lib] || 0) + 1; console.log(c, data.filter(d => d.err).length, "errors");
