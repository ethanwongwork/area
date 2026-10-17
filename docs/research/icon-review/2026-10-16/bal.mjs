// Balance loop: node bal.mjs out.png name,name,…  (from the worktree root)
// Lints the named sources (--only --emit), measures each one's apparent size at 24 (√ ink hull, as measure.mjs) against
// the set's median from measure.json and the Lucide / Phosphor reading of the same concept, and renders Before (built
// dist, the restored set) beside After (sources now), between info, square-plus, document and folder at 16 / 24 / 48.
import { build } from "/Users/ethanwong/Desktop/area/node_modules/esbuild/lib/main.js";
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { edgeShot, edgeDump } from "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0/docs/research/icon-review/2026-10-07/edge.mjs";
const D = new URL(".", import.meta.url).pathname, W = "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0";
const [out, list] = process.argv.slice(2); const names = list.split(",");
const REF = ["info", "square-plus", "document", "folder"];
const all = [...new Set([...names, ...REF])];
try { execFileSync("node", [W + "/packages/icons/scripts/generate.mjs", "--only", all.join(","), "--emit", D + "after.tsx"], { cwd: W, stdio: ["ignore", "pipe", "pipe"] }); }
catch (e) { console.log(String(e.stdout) + String(e.stderr)); process.exit(1); }
writeFileSync(D + "e.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup as r } from "react-dom/server"; import * as A from "./after.tsx";
const pas = n => n.split("-").map(s => s[0].toUpperCase() + s.slice(1)).join("");
export const svg = (n, s, f) => r(h(A["Pilot" + pas(n) + (f ? "Filled" : "") + "Icon"], { size: s }));`);
await build({ entryPoints: [D + "e.tsx"], bundle: true, format: "cjs", platform: "node", outfile: D + "e.cjs", nodePaths: ["/Users/ethanwong/Desktop/area/node_modules"], jsx: "automatic", logLevel: "error" });
const { svg: raw } = (await import(D + "e.cjs?" + Date.now())).default;
let k = 0; const svg = (n, s, f) => { const u = "u" + (k++) + "_"; return raw(n, s, f).replace(/id="([^"]+)"/g, (m, i) => 'id="' + u + i + '"').replace(/url\(#([^)]+)\)/g, (m, i) => "url(#" + u + i + ")"); };
const dist = (n, s) => readFileSync(`${W}/packages/icons/dist/svg/${s}/${n}.svg`, "utf8");
const css = "--area-weight-icon:1.125px;--_icon-overlap:4.5px";
// measure After at 24
const meas = names.map(n => ({ n, s: svg(n, 24).replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg" style="${css}"`).replace(/var\(--area-weight-icon\)/g, "1.125px") }));
writeFileSync(D + "m.html", `<!doctype html><body><script>
const it=${JSON.stringify(meas)};const N=96,cv=document.createElement("canvas");cv.width=cv.height=N;const cx=cv.getContext("2d",{willReadFrequently:true});
const ld=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(s.replace(/currentColor/g,"#000").replace(/width="24"/,'width="96"').replace(/height="24"/,'height="96"'))});
(async()=>{const o={};for(const x of it){const im=await ld(x.s);if(!im){o[x.n]="err";continue}cx.clearRect(0,0,N,N);cx.drawImage(im,0,0,N,N);const a=cx.getImageData(0,0,N,N).data;const p=[];let c=0,sy=0;
for(let y=0;y<N;y++){let lo=-1,hi=-1;for(let X=0;X<N;X++){const v=a[(y*N+X)*4+3]/255;if(v>0){c+=v;sy+=v*(y+.5)}if(v>.5){if(lo<0)lo=X;hi=X}}if(lo>=0)p.push([lo,y],[hi+1,y],[lo,y+1],[hi+1,y+1])}
p.sort((u,v)=>u[0]-v[0]||u[1]-v[1]);const cr=(O,A,B)=>(A[0]-O[0])*(B[1]-O[1])-(A[1]-O[1])*(B[0]-O[0]);const hf=l=>{const h=[];for(const q of l){while(h.length>=2&&cr(h.at(-2),h.at(-1),q)<=0)h.pop();h.push(q)}return h};
const H=[...hf(p).slice(0,-1),...hf([...p].reverse()).slice(0,-1)];let ar=0;for(let k=0;k<H.length;k++){const[x1,y1]=H[k],[x2,y2]=H[(k+1)%H.length];ar+=x1*y2-x2*y1}o[x.n]={size:Math.sqrt(Math.abs(ar)/2)/N,cy:sy/c/N}}
const e=document.createElement("pre");e.id="o";e.textContent=JSON.stringify(o);document.body.append(e)})();</script>`);
const dom = await edgeDump(["--user-data-dir=" + D + "pm", "--no-first-run", "--disable-gpu", "--virtual-time-budget=30000"], "file://" + D + "m.html");
const after = JSON.parse(dom.match(/<pre id="o">([\s\S]*?)<\/pre>/)[1].replace(/&quot;/g, '"'));
const M = JSON.parse(readFileSync(D + "measure.json", "utf8"));
const by = {}; for (const r of M) (by[r.name] ||= {})[r.lib] = r;
const shared = Object.keys(by).filter(n => Object.keys(by[n]).length === 3);
const med = l => { const v = shared.map(n => by[n][l].size).sort((a, b) => a - b); return v[v.length >> 1]; };
const mA = med("area"), mL = med("lucide"), mP = med("phosphor");
for (const n of names) {
  const b = by[n]?.area, a = after[n]; const ref = by[n]?.lucide && by[n]?.phosphor ? (by[n].lucide.size / mL + by[n].phosphor.size / mP) / 2 : null;
  console.log(`${n.padEnd(20)} before ${(b.size / mA).toFixed(2)}  after ${(a.size / mA).toFixed(2)}  refs ${ref ? ref.toFixed(2) : "–"}  ${ref ? "vs refs " + ((a.size / mA / ref - 1) * 100).toFixed(0) + "%" : ""}  ink-centre y ${((b.cy - .5) * 16).toFixed(2)} → ${((a.cy - .5) * 16).toFixed(2)}`);
}
const t = (s, inner) => `<span class="t" style="width:${s}px;height:${s}px">${inner}</span>`;
const row = (src, n, lab) => `<div class="r"><span class="l">${lab}</span>` + [16, 24, 48].map(s => `<span class="c">` + REF.slice(0, 2).map(x => t(s, s === 48 ? dist(x, 24).replace(/width="24" height="24"/, 'width="48" height="48"') : dist(x, s))).join("") +
  `<span class="me">${t(s, src(n, s))}</span>` + REF.slice(2).map(x => t(s, s === 48 ? dist(x, 24).replace(/width="24" height="24"/, 'width="48" height="48"') : dist(x, s))).join("") + `</span>`).join("") +
  `<span class="c">${t(24, src(n, 24, 1))}${t(48, src(n, 48, 1))}</span></div>`;
const before = (n, s, f) => s === 48 ? dist(n + (f ? "-filled" : ""), 24).replace(/width="24" height="24"/, 'width="48" height="48"') : dist(n + (f ? "-filled" : ""), s);
writeFileSync(D + "sheet.html", `<!doctype html><meta charset="utf-8"><style>body{font:12px system-ui;margin:16px;background:#fff;color:#1a1a1a;${css}}h3{margin:12px 0 2px;font-size:13px}.r{display:flex;align-items:center;gap:12px;padding:4px 0}.l{width:56px;color:#888}.c{display:flex;align-items:center;gap:5px}.c+.c{border-left:1px solid #ddd;padding-left:12px}.t{display:inline-flex;position:relative;background:#f7f8fa;outline:1px solid #e9ebee}.me .t{background:#fff3c4}svg{display:block}.g{border-bottom:1px solid #eee;padding-bottom:6px}</style>` +
  names.map(n => `<div class="g"><h3>${n}</h3>${row(before, n, "Before")}${row(svg, n, "After")}</div>`).join(""));
await edgeShot(["--user-data-dir=" + D + "ps", "--no-first-run", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=1100,${30 + names.length * 150}`], out, "file://" + D + "sheet.html");
console.log(out);
