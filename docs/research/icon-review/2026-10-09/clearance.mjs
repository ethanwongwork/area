// Split / knockout clearances (2026-10-09). For every knockout (and inset) over a solid: the smallest
// distance from its centre-line to the solid union's outer edge, sorted into
//   through  — the centre-line leaves the silhouette (a crossing: sawn, or split with ink beyond)
//   graze    — 0 < d ≤ ½ weight: the cut breaks the edge without crossing it (a notch)
//   thin     — ½ < d < 1½ weights: the fill left between cut and edge is under one line weight
//   clear    — d ≥ 1½ weights (≥ 1 weight of fill)
// and for every split ink stub (`stroke` + data-clip): how far the visible ink reaches beyond the edge,
// cap included, in line weights (1 weight = 1.125 drawing units, the 16px line).
//   node docs/research/icon-review/2026-10-09/clearance.mjs   → clearance.json beside this file
import { readFileSync, readdirSync, writeFileSync } from "node:fs"; import { edgeDump } from "../2026-10-07/edge.mjs";
const dir = "apps/docs/assets/area-icons-pilot", here = "docs/research/icon-review/2026-10-09", cache = process.cwd() + "/apps/docs/.cache";
const icons = readdirSync(dir).filter(f => f.endsWith(".svg")).map(f => {
  const src = readFileSync(`${dir}/${f}`, "utf8");
  const els = [...src.matchAll(/<(path|circle|rect)\b([^>]*?)\/?>/g)].map(([, tag, attrs], i) => ({ i, tag, a: Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]])) }));
  return { name: f.replace(".svg", ""), els };
}).filter(ic => ic.els.some(e => ["knockout", "inset", "stroke"].includes(e.a["data-filled"])) && ic.els.some(e => ["solid", "fill"].includes(e.a["data-filled"])));
const page = `<!doctype html><svg id=s xmlns="http://www.w3.org/2000/svg" width=16 height=16 viewBox="0 0 16 16"></svg><pre id=out>pending</pre><script>
const icons = ${JSON.stringify(icons)}, NS = "http://www.w3.org/2000/svg", s = document.getElementById("s"), W = 1.125;
const mk = (e, sw) => { const n = document.createElementNS(NS, e.tag); for (const [k, v] of Object.entries(e.a)) if (!k.startsWith("data-")) n.setAttribute(k, v); n.setAttribute("stroke-width", sw); s.appendChild(n); return n; };
const out = [];
for (const icon of icons) {
  s.innerHTML = "";
  const sn = icon.els.filter(e => ["solid", "fill"].includes(e.a["data-filled"])).map(e => ({ e, n: mk(e, W) }));
  const inU = (x, y) => { const p = new DOMPoint(x, y); return sn.some(({ n, e }) => n.isPointInFill(p) || (e.a.stroke !== "none" && n.isPointInStroke(p))); };
  // distance from a point to the other side of the silhouette (radial search, 0.02 steps)
  const dist = (x, y) => { const inside = inU(x, y); for (let r = 0.02; r < 4; r += 0.02) for (let k = 0; k < 48; k++) { const a = k * Math.PI / 24; if (inU(x + r * Math.cos(a), y + r * Math.sin(a)) !== inside) return inside ? r : -r; } return inside ? 4 : -4; };
  for (const e of icon.els) {
    const role = e.a["data-filled"]; if (!["knockout", "inset", "stroke"].includes(role)) continue;
    const n = mk(e, W); let len = 0; try { len = n.getTotalLength(); } catch { continue; }
    const N = Math.max(10, Math.ceil(len / 0.05)); const clip = e.a["data-clip"]?.split(/\\s+/).map(Number);
    let minIn = 9, anyOut = false, reach = 0, vis = 0;
    for (let k = 0; k <= N; k++) { const p = n.getPointAtLength(len * k / N); const d = dist(p.x, p.y);
      if (role === "stroke") { if (clip && !(p.x >= clip[0] && p.y >= clip[1] && p.x <= clip[2] && p.y <= clip[3])) continue; if (d < 0) { reach = Math.max(reach, -d); vis += len / N; } }
      else { if (d <= 0) anyOut = true; else minIn = Math.min(minIn, d); } }
    if (role === "stroke") out.push({ name: icon.name, i: e.i, role, clip: e.a["data-clip"] || null, reachW: +((reach + W / 2) / W).toFixed(2), visibleLen: +vis.toFixed(2) });
    else { const kind = anyOut ? "through" : minIn <= W / 2 + 0.02 ? "graze" : minIn < 1.5 * W ? "thin" : "clear";
      out.push({ name: icon.name, i: e.i, role, kind, minEdgeDist: anyOut ? 0 : +minIn.toFixed(2), fillLeftW: anyOut ? 0 : +((minIn - W / 2) / W).toFixed(2), split: icon.els.some(q => q.a["data-filled"] === "stroke" && q.a.d === e.a.d) }); }
  }
}
document.getElementById("out").textContent = JSON.stringify(out);
</script>`;
writeFileSync(cache + "/clr-2026-10-09.html", page);
const dom = await edgeDump(["--disable-gpu", "--user-data-dir=" + cache + "/clr-prof"], "file://" + cache + "/clr-2026-10-09.html");
const rows = JSON.parse(dom.match(/<pre id="out">([\s\S]*?)<\/pre>/)[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&"));
writeFileSync(`${here}/clearance.json`, JSON.stringify(rows, null, 1));
const by = k => rows.filter(r => r.kind === k).map(r => `${r.name}#${r.i}${r.split ? "(split)" : ""} ${r.fillLeftW}w`);
console.log("through:", by("through").join(", ")); console.log("graze:", by("graze").join(", ")); console.log("thin:", by("thin").join(", "));
console.log("stubs:", rows.filter(r => r.role === "stroke").map(r => `${r.name}#${r.i} reach ${r.reachW}w`).join(", "));
