// The person-mark family on the person with the smaller gap (2 between centre-lines: head r 3 at 6.5, 5;
// body 1.5–11.5 × 10–13.5, r 3.5 shoulders). Marks move by DY (whole steps keep the grid and lattice);
// one round bite about (12.5, 12.25 + DY) solved by bite.mjs. Writes the sources (run from the repo root).
//   node family.mjs <DY> <bottomX> <R>
import { writeFileSync } from "node:fs";
const DY = Number(process.argv[2]), X = Number(process.argv[3]), R = Number(process.argv[4]);
const DIR = "apps/docs/assets/area-icons-pilot", BY = 13.5, TOP = 10;
const S = 'fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"';
const f = v => +v.toFixed(3) + "";
const HEAD = `<circle data-filled="solid" cx="6.5" cy="5" r="3" ${S}/>`;
const C = [12.5, 12.25 + DY];
// the bite meets the right shoulder (centre 8, BY, r 3.5) or, if it reaches past it, the top line
let sh = null; for (let i = 0; i <= 200000; i++) { const a = -Math.PI / 2 * i / 200000, p = [8 + 3.5 * Math.cos(a), BY + 3.5 * Math.sin(a)], e = Math.abs(Math.hypot(p[0] - C[0], p[1] - C[1]) - R); if (!sh || e < sh[0]) sh = [e, p]; }
let end;
if (sh[0] < 1e-3 && sh[1][0] > 8 + 1e-3) end = `L8 ${TOP}A3.5 3.5 0 0 1 ${f(sh[1][0])} ${f(sh[1][1])}`;
else { const x = C[0] - Math.sqrt(R * R - (TOP - C[1]) ** 2); end = `L${f(Math.min(x, 8))} ${TOP}`; }
const LINE = `M${f(X)} ${BY}L1.5 ${BY}A3.5 3.5 0 0 1 5 ${TOP}` + end;
const CLOSE = `A${f(R)} ${f(R)} 0 0 0 ${f(X)} ${BY}Z`;
const y = v => f(v + DY);
const gear = (cx, cy) => [0, 60, 120, 180, 240, 300].map(a => { const r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  const p = d => `${(cx + d * s).toFixed(3)} ${(cy - d * c).toFixed(3)}`; return `M${p(1.5)}L${p(2.25)}`; }).join("");
const gy = 12 + DY;
const MARKS = {
  "person-add": { lines: `M12.5 ${y(10.5)}V${y(14.5)}M10.5 ${y(12.5)}H14.5` },
  "person-remove": { lines: `M10.5 ${y(12.5)}H14.5` },
  "person-check": { lines: `M10 ${y(12)}L11.5 ${y(13.5)}L14.5 ${y(10.5)}` },
  "person-x": { lines: `M10.75 ${y(10.75)}L14.25 ${y(14.25)}M14.25 ${y(10.75)}L10.75 ${y(14.25)}` },
  "person-lock": { solids: [`<rect data-filled="solid" data-halo="" x="10.5" y="${y(11.5)}" width="4" height="3" rx="0.5" ${S}/>`],
    lines: `M11 ${y(11.5)}V${y(10.5)}A1.5 1.5 0 0 1 14 ${y(10.5)}V${y(11.5)}` },
  "person-settings": { solids: [`<circle data-filled="solid" data-halo="" cx="12.5" cy="${gy}" r="1.5" ${S}/>`,
    `<path data-filled="gap" d="M13.25 ${gy}A0.75 0.75 0 1 1 11.75 ${gy}A0.75 0.75 0 1 1 13.25 ${gy}Z" stroke="none" fill="currentColor"/>`],
    lines: gear(12.5, gy), angles: ' data-angles="radial"' },
};
for (const [name, m] of Object.entries(MARKS)) {
  const svg = `<svg data-set="area-pilot" data-keyline="circle"${m.angles ?? ""} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
${HEAD}
<path data-filled="line" d="${LINE}" ${S}/>
<path data-filled="fill" d="${LINE}${CLOSE}" ${S}/>
${(m.solids ?? []).join("\n")}${m.solids ? "\n" : ""}<path d="${m.lines}" ${S}/>
<path data-filled="halo" d="${m.lines}" ${S}/>
</svg>
`;
  writeFileSync(`${DIR}/${name}.svg`, svg);
}
console.log(LINE, CLOSE);
