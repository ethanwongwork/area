// Finds thin slivers of ink or space (narrower than ~0.6px at 16px) in every icon, outline and filled.
import { build } from "esbuild"; import { writeFileSync, readFileSync } from "node:fs"; import { edgeShot, edgeDump } from "../2026-10-07/edge.mjs";
// SLIVER_SIZE=48 renders through the size prop (the size curve) instead of the 16px drawing enlarged.
const SIZE = process.env.SLIVER_SIZE ? `size: ${Number(process.env.SLIVER_SIZE)}, ` : "";
// LOOK_CACHE and PILOT_TSX (absolute) let parallel sessions check their own emitted icons (2026-10-07).
const cache = process.env.LOOK_CACHE || process.cwd() + "/packages/icons/.cache", only = process.argv[2]?.split(",");
writeFileSync(cache + "/sl.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "${process.env.PILOT_TSX || process.cwd() + "/apps/docs/src/pilot-icons.tsx"}";
export const all = PILOT_ICONS.filter(p => !p.derivedFrom).map(p => ({ name: p.name, o: renderToStaticMarkup(h(p.Icon, { weight: 1.125, ${SIZE}width: 128, height: 128 })), f: renderToStaticMarkup(h(p.Filled, { weight: 1.125, ${SIZE}width: 128, height: 128 })) }));`);
await build({ entryPoints: [cache + "/sl.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/sl.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
let { all } = await import(cache + "/sl.out.mjs?" + Date.now());
if (only) all = all.filter(a => only.includes(a.name));
const SHOT = process.env.SLIVER_PNG;
const page = `<!doctype html><body style="margin:8px;font:11px system-ui"><div id=shots style="display:flex;flex-wrap:wrap;gap:8px"></div><pre id=out>pending</pre><script>
const icons = ${JSON.stringify(all)};
const N = 128, R = 2;  // erosion radius in px at 8x (0.25px at 16px): removes features under ~0.6px
const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg" color="black"')); });
const D = r => { const d = []; for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + 0.5) d.push([x, y]); return d; };
const erode = (m, r = R) => { const o = new Uint8Array(N * N); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { let ok = 1; for (const [dx, dy] of D(r)) { const X = x + dx, Y = y + dy; const val = X < 0 || Y < 0 || X >= N || Y >= N ? 0 : m[Y * N + X]; if (val !== 1) { ok = 0; break; } } o[y * N + x] = ok; } return o; };
const dilate = (m, r = R) => { const o = new Uint8Array(N * N); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (m[y * N + x]) for (const [dx, dy] of D(r)) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < N && Y < N) o[Y * N + X] = 1; } return o; };
const shot = (name, base, masks) => { const c = document.createElement("canvas"); c.width = c.height = N; const x = c.getContext("2d"); x.drawImage(base, 0, 0, N, N); const im = x.getImageData(0, 0, N, N); for (const m of masks) for (let i = 0; i < N * N; i++) if (m[i]) { im.data[i*4]=255; im.data[i*4+1]=0; im.data[i*4+2]=0; im.data[i*4+3]=255; } x.putImageData(im, 0, 0); const d = document.createElement("div"); d.append(c, document.createElement("br"), name); document.getElementById("shots").append(d); };
const comps = (m) => { const seen = new Uint8Array(N * N), out = []; for (let i = 0; i < N * N; i++) if (m[i] && !seen[i]) { let st = [i], n = 0, sx = 0, sy = 0; seen[i] = 1; while (st.length) { const j = st.pop(); n++; sx += j % N; sy += (j / N) | 0; for (const k of [j - 1, j + 1, j - N, j + N]) if (k >= 0 && k < N * N && m[k] && !seen[k]) { seen[k] = 1; st.push(k); } } out.push({ n, x: +(sx / n / 8).toFixed(1), y: +(sy / n / 8).toFixed(1) }); } return out; };
(async () => {
  const c = document.createElement("canvas"); c.width = c.height = N; const g = c.getContext("2d"); const lines = [];
  const raster = async svg => { g.clearRect(0, 0, N, N); g.drawImage(await load(svg), 0, 0, N, N); const d = g.getImageData(0, 0, N, N).data; const m = new Uint8Array(N * N); for (let i = 0; i < N * N; i++) m[i] = d[i * 4 + 3] > 127 ? 1 : 0; return m; };
  let last; const thinParts = (m, r) => { const open = dilate(erode(m, r), r); const t = new Uint8Array(N * N); for (let i = 0; i < N * N; i++) t[i] = m[i] && !open[i] ? 1 : 0; last = t; return comps(t); };
  for (const ic of icons) {
    // 1. Hairlines of ink or space under ~0.6px, outline and filled.
    for (const k of ["o", "f"]) { const ink = await raster(ic[k]); const sp = ink.map(v => 1 - v);
      for (const [m, kind] of [[ink, "ink"], [sp, "space"]]) for (const cc of thinParts(m, 2)) if (cc.n >= 40) lines.push([ic.name, k === "o" ? "outline" : "filled", "hairline " + kind, cc.n, cc.x, cc.y].join("\t")); }
    // 1b. Islands: a small piece of filled ink cut off by knockouts and gaps (file-download's
    // wedges under the arrow's barbs). Dots are islands too, but round: flag only pieces under
    // ~3.5 square units (at 8×) that fill less than 60% of their bounding box and are not the
    // outline's own strokes (rocket's short flame lines are islands in both).
    { const ink = await raster(ic.f), outl = await raster(ic.o); const seen = new Uint8Array(N * N);
      for (let i = 0; i < N * N; i++) if (ink[i] && !seen[i]) { let st = [i], n = 0, x0 = N, x1 = 0, y0 = N, y1 = 0; seen[i] = 1;
        let inOutline = 0; while (st.length) { const j = st.pop(); n++; inOutline += outl[j]; const x = j % N, y = (j / N) | 0; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
          for (const k of [j - 1, j + 1, j - N, j + N]) if (k >= 0 && k < N * N && ink[k] && !seen[k]) { seen[k] = 1; st.push(k); } }
        const box = (x1 - x0 + 1) * (y1 - y0 + 1);
        if (n < 224 && n / box < 0.6 && inOutline / n < 0.8) lines.push([ic.name, "filled", "island", n, +((x0 + x1) / 16).toFixed(1), +((y0 + y1) / 16).toFixed(1)].join("\t")); } }
    // 2. Fill left beside a line drawn over it (narrower than ~1.1px): the solid shows as a sliver.
    const f = ic.f, gi = f.indexOf("<g mask"); if (gi < 0) continue; const ge = f.indexOf("</g>", gi) + 4;
    const fillOnly = await raster(f.slice(0, ge) + "</svg>"), plain = await raster(f.slice(0, f.indexOf("<mask")) + f.slice(ge));
    let any = 0; for (const v of plain) any |= v; if (!any) continue;
    const near = dilate(dilate(dilate(plain, 2), 2), 2);
    const exposed = fillOnly.map((v, i) => v && !plain[i] ? 1 : 0);
    const hits = thinParts(exposed, 4).filter(cc => cc.n >= 60), t = last; for (const cc of hits) lines.push([ic.name, "filled", "fill beside a line", cc.n, cc.x, cc.y].join("\t"));
    if (hits.length) shot(ic.name, await load(f), [t]);
  }
  document.getElementById("out").textContent = lines.join("\\n") || "none";
})();
</script>`;
writeFileSync(cache + "/sl.html", page);
if (SHOT) await edgeShot(["--disable-gpu", "--hide-scrollbars", "--virtual-time-budget=600000", "--window-size=1200,900"], SHOT, "file://" + cache + "/sl.html", 600000);
// A headless run can outlive its output (2026-10-07): edge.mjs stops Edge once the DOM is out.
const dom = await edgeDump(["--disable-gpu", "--virtual-time-budget=600000"], "file://" + cache + "/sl.html");
console.log(dom.match(/<pre id="out">([\s\S]*?)<\/pre>/)?.[1] ?? dom.slice(0, 500));
