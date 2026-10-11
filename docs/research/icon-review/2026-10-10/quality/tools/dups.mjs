// Find outline strokes drawn twice: two outline-drawn elements sharing a segment.
// Usage: node docs/research/icon-review/2026-10-10/quality/tools/dups.mjs apps/docs/assets/area-icons-pilot [name,name…]
// A stroke drawn twice in the outline reads darker at 1× (flag-off 2026-10-07, mic-off 2026-10-10). Edges shared by two
// closed shapes (panels, video, headphones) also show; those are a generator-level question, not per-icon defects.
import { readFileSync, readdirSync } from "node:fs";
const DIR = process.argv[2];
const ONLY = ["gap","fill","stroke","halo","inset"];
const attrs = s => Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
function segs(el) {
  const a = el.a, out = [];
  if (el.tag === "rect") { const x=+a.x,y=+a.y,w=+a.width,h=+a.height,r=+(a.rx||0);
    out.push(["L",x+r,y,x+w-r,y],["L",x+w,y+r,x+w,y+h-r],["L",x+r,y+h,x+w-r,y+h],["L",x,y+r,x,y+h-r]); return out; }
  if (el.tag === "circle") { out.push(["C",+a.cx,+a.cy,+a.r]); return out; }
  if (el.tag !== "path") return out;
  const t = a.d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g); let i=0,cx=0,cy=0,sx=0,sy=0,cmd;
  const n = () => +t[i++];
  while (i < t.length) { if (/[A-Za-z]/.test(t[i])) cmd = t[i++];
    if (cmd==="M"){cx=n();cy=n();sx=cx;sy=cy;cmd="L";continue;}
    if (cmd==="L"){const x=n(),y=n();out.push(["L",cx,cy,x,y]);cx=x;cy=y;}
    else if (cmd==="H"){const x=n();out.push(["L",cx,cy,x,cy]);cx=x;}
    else if (cmd==="V"){const y=n();out.push(["L",cx,cy,cx,y]);cy=y;}
    else if (cmd==="Z"){out.push(["L",cx,cy,sx,sy]);cx=sx;cy=sy;}
    else if (cmd==="A"){const rx=n(),ry=n(),rot=n(),la=n(),sw=n(),x=n(),y=n();out.push(["A",cx,cy,x,y,rx,ry,sw]);cx=x;cy=y;}
    else if (cmd==="Q"){const a1=n(),b1=n(),x=n(),y=n();out.push(["Q",cx,cy,x,y,a1,b1]);cx=x;cy=y;}
    else if (cmd==="C"){const a1=n(),b1=n(),a2=n(),b2=n(),x=n(),y=n();out.push(["Q",cx,cy,x,y,a1,b1,a2,b2]);cx=x;cy=y;}
    else throw new Error("cmd "+cmd+" in "+a.d); }
  return out;
}
const near=(a,b)=>Math.abs(a-b)<0.02;
function lineOverlap(p,q){ // collinear overlapping straight segments
  const [ ,x0,y0,x1,y1]=p,[ ,u0,v0,u1,v1]=q; const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy); if(L<0.05)return 0;
  const cr=(x,y)=>((x-x0)*dy-(y-y0)*dx)/L; if(Math.abs(cr(u0,v0))>0.02||Math.abs(cr(u1,v1))>0.02)return 0;
  const pr=(x,y)=>((x-x0)*dx+(y-y0)*dy)/L; const a=Math.min(pr(u0,v0),pr(u1,v1)),b=Math.max(pr(u0,v0),pr(u1,v1));
  return Math.max(0,Math.min(L,b)-Math.max(0,a)); }
function same(p,q){ if(p[0]==="L"&&q[0]==="L") return lineOverlap(p,q)>0.3;
  if(p[0]!==q[0]) return false;
  if(p[0]==="C") return p.slice(1).every((v,k)=>near(v,q[k+1]));
  if(p[0]==="A"){ const sameR=near(p[5],q[5])&&near(p[6],q[6]);
    const st=(near(p[1],q[1])&&near(p[2],q[2])&&p[7]===q[7])||(near(p[3],q[3])&&near(p[4],q[4])&&p[7]===q[7])||(near(p[1],q[3])&&near(p[2],q[4])&&p[7]!==q[7]);
    return sameR&&st; }
  if(p[0]==="Q") return (p.slice(1).every((v,k)=>near(v,q[k+1])));
  return false; }
const names = process.argv[3] ? process.argv[3].split(",") : readdirSync(DIR).filter(f=>f.endsWith(".svg")).map(f=>f.slice(0,-4));
for (const name of names) { let src; try { src = readFileSync(`${DIR}/${name}.svg`,"utf8"); } catch { continue; }
  const els=[...src.matchAll(/<(path|rect|circle)\s([^>]*)\/?>/g)].map((m,k)=>({tag:m[1],a:attrs(m[2]),k}))
    .filter(e=>!ONLY.includes(e.a["data-filled"]) && (e.a.stroke==="currentColor"));
  const S=els.map(e=>{try{return segs(e)}catch(err){return []}});
  for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){
    const hits=[];for(const p of S[i])for(const q of S[j])if(same(p,q))hits.push(p[0]+" "+p.slice(1,5).map(v=>+v.toFixed(3)).join(","));
    if(hits.length) console.log(`${name}\telements ${els[i].k}(${els[i].a["data-filled"]||"ink"}) & ${els[j].k}(${els[j].a["data-filled"]||"ink"})\t${hits.slice(0,3).join(" | ")}`); }
}
