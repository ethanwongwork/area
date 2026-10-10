// Filled-treatment inventory (2026-10-09). Reads every Area pilot source (not explore/, status/), lists the
// data-filled roles each icon uses, and measures where each line part lies against the icon's solids:
// samples along the part's centre-line are "core" (inside the solid union, ≥ 0.9 from its edge), "band"
// (within ~0.9 of the edge) or "out". From roles + geometry it assigns relationship classes (README).
//   node docs/research/icon-review/2026-10-09/inventory.mjs   → filled-inventory.json beside this file
import { readFileSync, readdirSync, writeFileSync } from "node:fs"; import { edgeDump } from "../2026-10-07/edge.mjs";
const dir = "apps/docs/assets/area-icons-pilot", here = "docs/research/icon-review/2026-10-09", cache = process.cwd() + "/apps/docs/.cache";
const icons = readdirSync(dir).filter(f => f.endsWith(".svg")).sort().map(f => {
  const src = readFileSync(`${dir}/${f}`, "utf8");
  const els = [...src.matchAll(/<(path|circle|rect)\b([^>]*?)\/?>/g)].map(([, tag, attrs], i) => {
    const a = Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
    return { i, tag, a };
  });
  const svg = Object.fromEntries([...src.match(/<svg[^>]*>/)[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
  return { name: f.replace(".svg", ""), els, rotations: svg["data-rotations"] || null };
});
const page = `<!doctype html><svg id=s xmlns="http://www.w3.org/2000/svg" width=16 height=16 viewBox="0 0 16 16"></svg><pre id=out>pending</pre><script>
const icons = ${JSON.stringify(icons)}, NS = "http://www.w3.org/2000/svg", s = document.getElementById("s");
const mk = (e, sw) => { const n = document.createElementNS(NS, e.tag); for (const [k, v] of Object.entries(e.a)) if (!k.startsWith("data-")) n.setAttribute(k, v);
  n.setAttribute("stroke-width", sw); s.appendChild(n); return n; };
const out = [];
for (const icon of icons) {
  s.innerHTML = "";
  const solids = icon.els.filter(e => ["solid", "fill"].includes(e.a["data-filled"]));
  const sn = solids.map(e => ({ e, n: mk(e, e.a.stroke === "none" || e.a.fill === "currentColor" && !e.a.stroke ? 0.01 : 1.125) }));
  const inU = (x, y) => { const p = new DOMPoint(x, y); return sn.some(({ n, e }) => n.isPointInFill(p) || (e.a.stroke !== "none" && n.isPointInStroke(p))); };
  const D = 0.9, dirs = [...Array(12)].map((_, k) => [Math.cos(k * Math.PI / 6) * D, Math.sin(k * Math.PI / 6) * D]);
  const near = (x, y, r) => [...Array(12)].some((_, k) => inU(x + Math.cos(k * Math.PI / 6) * r, y + Math.sin(k * Math.PI / 6) * r));
  const where = (x, y) => { if (!sn.length) return "out"; const i = inU(x, y); if (i && dirs.every(([dx, dy]) => inU(x + dx, y + dy))) return "core"; if (i || near(x, y, 0.6)) return "band"; return "out"; };
  const parts = [];
  for (const e of icon.els) {
    const role = e.a["data-filled"] || "", stroked = e.a.stroke !== "none" && !(e.a.fill === "currentColor" && !e.a.stroke);
    if (["solid", "fill"].includes(role)) continue;
    const n = mk(e, 1.125); let len = 0; try { len = n.getTotalLength(); } catch {}
    const c = { core: 0, band: 0, out: 0 }; let segs = [], prev = null;
    const N = Math.max(8, Math.ceil(len / 0.1));
    for (let k = 0; k <= N; k++) { const p = n.getPointAtLength(len * k / N); const w = where(p.x, p.y); c[w]++; if (w !== prev) segs.push({ w, from: len * k / N }); prev = w; }
    segs.forEach((g, k) => g.len = +(((segs[k + 1]?.from ?? len) - g.from)).toFixed(2));
    const tot = N + 1;
    parts.push({ i: e.i, tag: e.tag, role: role || "ink", stroked, d: e.a.d || null, clip: e.a["data-clip"] || null, halo: e.a["data-halo"] !== undefined,
      len: +len.toFixed(2), core: +(c.core / tot).toFixed(2), band: +(c.band / tot).toFixed(2), out: +(c.out / tot).toFixed(2), runs: segs.map(g => g.w[0] + g.len).join(" ") });
  }
  out.push({ name: icon.name, parts });
}
document.getElementById("out").textContent = JSON.stringify(out);
</script>`;
writeFileSync(cache + "/inv-2026-10-09.html", page);
const dom = await edgeDump(["--disable-gpu", "--user-data-dir=" + cache + "/inv-prof"], "file://" + cache + "/inv-2026-10-09.html");
const geo = JSON.parse(dom.match(/<pre id="out">([\s\S]*?)<\/pre>/)[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">"));
const SLASH = /0\.909 -0\.682|-0\.682 0\.909|^M2 2L14 14$/;
const rows = icons.map(icon => {
  const g = geo.find(x => x.name === icon.name), roles = {};
  for (const e of icon.els) { const r = e.a["data-filled"] || (e.a.d && SLASH.test(e.a.d) ? "slash" : "ink"); roles[r] = (roles[r] || 0) + 1; if (e.a["data-halo"] !== undefined) roles["data-halo"] = (roles["data-halo"] || 0) + 1; }
  const body = icon.els.some(e => ["solid", "fill"].includes(e.a["data-filled"]));
  const ds = role => icon.els.filter(e => e.a["data-filled"] === role).map(e => e.a.d);
  const strokeDs = ds("stroke"), knockDs = ds("knockout"), haloDs = ds("halo");
  const cls = new Set(), notes = [];
  if (!body) cls.add("line-glyph");
  if (icon.els.some(e => e.a.d && SLASH.test(e.a.d))) cls.add("slash");
  for (const p of g.parts) {
    const r = p.role;
    if (r === "knockout") {
      if (strokeDs.includes(p.d)) cls.add("split-crossing");
      else if (p.out > 0.04) { cls.add("knockout-exits-edge"); notes.push(`knockout #${p.i} ${Math.round(p.out * 100)}% outside (${p.runs})`); }
      else if (p.band > 0.05) { cls.add("knockout-meets-edge"); notes.push(`knockout #${p.i} meets the edge (${p.runs})`); }
      else cls.add("mark-inside");
    }
    if (r === "inset") cls.add("inset");
    if (r === "halo") cls.add("halo");
    if (r === "hole") cls.add("hole");
    if (r === "cut") cls.add("cut");
    if (r === "gap") cls.add(p.stroked ? "gap-seam" : "gap-front-cutout");
    if (r === "stroke" && !p.clip && body) cls.add("ink-filled-only");
    if (r === "stroke" && !body) cls.add("line-glyph-stroke-piece");
    const twinGap = g.parts.find(q => q.role === "gap" && !q.stroked && Math.abs(q.core - p.core) < 0.04 && Math.abs(q.out - p.out) < 0.04 && Math.abs(q.band - p.band) < 0.04);
    if (r === "ink" && body && !(p.d && SLASH.test(p.d)) && !haloDs.includes(p.d)) {
      if (twinGap && p.core >= 0.15) { cls.add(p.out >= 0.1 ? "open-part-crosses-edge" : "open-part-over-body"); notes.push(`ink #${p.i} kept as a line, inside opened by gap #${twinGap.i} (${p.runs})`); }
      else if (p.core >= 0.15 && p.out >= 0.1) { cls.add("ink-crosses-edge"); notes.push(`ink #${p.i} crosses (${p.runs})`); }
      else if (p.core >= 0.15) cls.add("ink-over-solid");
      else if (p.band > 0 || p.core > 0) cls.add("ink-attached");
      else cls.add("ink-beside");
    }
  }
  if (icon.els.some(e => e.a["data-halo"] !== undefined)) cls.add("data-halo-front");
  if (icon.els.filter(e => ["solid", "fill"].includes(e.a["data-filled"])).length > 1) cls.add("multi-solid");
  return { name: icon.name, rotations: icon.rotations, body, roles, classes: [...cls].sort(), notes,
    parts: g.parts.map(({ d, ...p }) => ({ ...p, d: d && d.length > 90 ? d.slice(0, 90) + "…" : d })) };
});
const counts = {}, roleCounts = {};
for (const r of rows) { for (const c of r.classes) counts[c] = (counts[c] || 0) + 1; for (const k of Object.keys(r.roles)) roleCounts[k] = (roleCounts[k] || 0) + 1; }
writeFileSync(`${here}/filled-inventory.json`, JSON.stringify({ generated: "2026-10-09", source: dir, icons: rows.length, withBody: rows.filter(r => r.body).length,
  classCounts: Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1])), roleCounts: Object.fromEntries(Object.entries(roleCounts).sort((a, b) => b[1] - a[1])), rows }, null, 1));
console.log(rows.length, "icons;", rows.filter(r => r.body).length, "with a body"); console.log(counts); console.log(roleCounts);
