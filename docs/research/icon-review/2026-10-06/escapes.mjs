// Knockouts that leave their solid (owner, 2026-10-06: "the arrow in import is just an inverse shape").
// A knockout's part outside every solid vanishes in the filled variant, so the part changes colour
// at the edge. Lists each icon whose knockout ink lies outside the solids (beyond a 1px edge band).
//   node docs/research/icon-review/2026-10-06/escapes.mjs
import { readFileSync, readdirSync, writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
const dir = "apps/docs/assets/area-icons-pilot", cache = process.cwd() + "/apps/docs/.cache";
const shapes = readdirSync(dir).filter(f => f.endsWith(".svg")).map(f => {
  const src = readFileSync(`${dir}/${f}`, "utf8");
  const els = [...src.matchAll(/<(path|circle|rect)\b([^>]*)\/?>/g)].map(([, tag, attrs]) => {
    const a = Object.fromEntries([...attrs.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
    return { tag, a };
  });
  return { name: f.replace(".svg", ""), els };
}).filter(s => s.els.some(e => e.a["data-filled"] === "knockout"));
const page = `<!doctype html><pre id=out>pending</pre><script>
const icons = ${JSON.stringify(shapes)}, N = 160, k = N / 16;
const path = e => { if (e.tag === "path") return new Path2D(e.a.d); const p = new Path2D();
  if (e.tag === "circle") p.arc(+e.a.cx, +e.a.cy, +e.a.r, 0, 7);
  else p.roundRect(+e.a.x, +e.a.y, +e.a.width, +e.a.height, +(e.a.rx || 0)); return p; };
const out = [];
for (const icon of icons) {
  const c = new OffscreenCanvas(N, N), g = c.getContext("2d"); g.scale(k, k); g.lineCap = g.lineJoin = "round";
  for (const e of icon.els.filter(e => ["solid", "fill"].includes(e.a["data-filled"]))) { g.fill(path(e)); if (e.a.fill !== "currentColor") { g.lineWidth = 1.125 + 2; g.stroke(path(e)); } }
  const solid = g.getImageData(0, 0, N, N).data;
  const c2 = new OffscreenCanvas(N, N), h = c2.getContext("2d"); h.scale(k, k); h.lineCap = h.lineJoin = "round"; h.lineWidth = 1.125;
  for (const e of icon.els.filter(e => e.a["data-filled"] === "knockout")) { if (e.a.fill === "currentColor") h.fill(path(e)); else h.stroke(path(e)); }
  const ko = h.getImageData(0, 0, N, N).data;
  let outside = 0, total = 0; for (let i = 3; i < ko.length; i += 4) if (ko[i] > 128) { total++; if (solid[i] < 128) outside++; }
  if (outside > 0.02 * total) out.push(icon.name + " " + (100 * outside / total).toFixed(0) + "%");
}
document.getElementById("out").textContent = out.join("\\n") || "none";
</script>`;
writeFileSync(cache + "/esc.html", page);
const dom = execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--dump-dom", "file://" + cache + "/esc.html"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
console.log(dom.match(/<pre id="out">([\s\S]*?)<\/pre>/)[1]);
