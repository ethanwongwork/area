// The person-mark family (owner, 2026-10-06: "the placement of all of these icons are pretty inconsistent, …
// make the ratio of the head to the body size slightly closer to the original person icon"). One small
// figure, the standalone person moved left (head ⌀6, body 10 × 3.5), and every mark centred on one point at
// the lower right, about (12.5, 12) (each on the pixel grid and the diagonal lattice); the body is cut round the mark
// by the overlap cut in the outline and by a one-weight halo when filled (Fluent's person_* set). The filled
// body is the outline's cut body closed, so no strip of it is left under the mark's halo at large sizes.
//   node docs/research/icon-review/2026-10-06/person-family.mjs   (writes the sources)
import { execFileSync } from "node:child_process"; import { writeFileSync } from "node:fs";
const DIR = "apps/docs/assets/area-icons-pilot";
const S = 'fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"';
// The standalone person (head r 3, body 10 × 3.5, r 3.5 shoulders), moved left so it ends at x 1.5.
const HEAD = `<circle data-filled="solid" cx="6.5" cy="5" r="3" ${S}/>`;
const BODY = "M1.5 14A3.5 3.5 0 0 1 5 10.5H8A3.5 3.5 0 0 1 11.5 14Z";
const ring = (cx, cy, r, n = 48) => Array.from({ length: n + 1 }, (_, i) => `${(cx + r * Math.cos(2 * Math.PI * i / n)).toFixed(3)},${(cy + r * Math.sin(2 * Math.PI * i / n)).toFixed(3)}`).join(" ");
const cut = lines => execFileSync("node", ["apps/docs/scripts/icon-geometry.mjs", "cut", BODY, lines], { encoding: "utf8" }).trim().split("\n").pop();
const gear = (cx, cy) => [0, 60, 120, 180, 240, 300].map(a => { const r = a * Math.PI / 180, c = Math.cos(r), s = Math.sin(r);
  const p = d => `${(cx + d * s).toFixed(3)} ${(cy - d * c).toFixed(3)}`; return `M${p(1.5)}L${p(2.25)}`; }).join("");
// Each mark: its drawing (lines drawn in both styles, with a halo copy), solids (data-halo), and the
// polylines the outline body is cut round.
const arc = (cx, cy, r, a0, a1, n = 12) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return `${(cx + r * Math.cos(a)).toFixed(3)},${(cy - r * Math.sin(a)).toFixed(3)}`; }).join(" ");
const MARKS = {
  "person-add": { lines: "M12.5 10.5V14.5M10.5 12.5H14.5", cutBy: "12.5,10.5 12.5,14.5 | 10.5,12.5 14.5,12.5" },
  "person-remove": { lines: "M10.5 12.5H14.5", cutBy: "10.5,12.5 14.5,12.5" },
  "person-check": { lines: "M10 12L11.5 13.5L14.5 10.5", cutBy: "10,12 11.5,13.5 14.5,10.5" },
  "person-x": { lines: "M10.75 10.75L14.25 14.25M14.25 10.75L10.75 14.25", cutBy: "10.75,10.75 14.25,14.25 | 14.25,10.75 10.75,14.25" },
  "person-lock": { solids: [`<rect data-filled="solid" data-halo="" x="10.5" y="11.5" width="4" height="3" rx="0.5" ${S}/>`],
    lines: "M11 11.5V10.5A1.5 1.5 0 0 1 14 10.5V11.5", cutBy: `${arc(11, 12, 0.5, 180, 90, 4)} ${arc(14, 12, 0.5, 90, 0, 4)} ${arc(14, 14, 0.5, 0, -90, 4)} ${arc(11, 14, 0.5, -90, -180, 4)} 10.5,12 | 11,11.5 ${arc(12.5, 10.5, 1.5, 180, 0)} 14,11.5` },
  "person-settings": { solids: [`<circle data-filled="solid" data-halo="" cx="12.5" cy="12" r="1.5" ${S}/>`,
    `<path data-filled="gap" d="M13.25 12A0.75 0.75 0 1 1 11.75 12A0.75 0.75 0 1 1 13.25 12Z" stroke="none" fill="currentColor"/>`],
    lines: gear(12.5, 12), cutBy: `${ring(12.5, 12, 1.5)} | ${ring(12.5, 12, 2.25)}`, angles: ' data-angles="radial"' },
  "person-key": { solids: [`<circle data-filled="solid" data-halo="" cx="12.5" cy="9.5" r="2" ${S}/>`,
    `<path data-filled="gap" d="M13.25 9.5A0.75 0.75 0 1 1 11.75 9.5A0.75 0.75 0 1 1 13.25 9.5Z" stroke="none" fill="currentColor"/>`],
    lines: "M11.086 10.914L8.25 13.75M10.5 11.5L12 13L10.5 14.5L9 13", cutBy: `11.086,10.914 8.25,13.75 | 10.5,11.5 12,13 10.5,14.5 9,13 10.5,11.5 | ${ring(12.5, 9.5, 2)}` },
};
// One round bite for every badge mark (the key, larger, is cut round its own drawing): a circle about
// (12.5, 12.25) through the bottom at 8.25, meeting the right shoulder at 8.246, 10.509 (the most any
// mark needs). The outline body stops on it; the filled body closes along it.
const BITE = { line: "M8.25 14L1.5 14A3.5 3.5 0 0 1 5 10.5L8 10.5A3.5 3.5 0 0 1 8.246 10.509", close: "A4.596 4.596 0 0 0 8.25 14Z" };
for (const [name, m] of Object.entries(MARKS)) {
  const own = name === "person-key", line = own ? cut(m.cutBy) : BITE.line;
  const svg = `<svg data-set="area-pilot" data-keyline="circle"${m.angles ?? ""} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
${HEAD}
<path data-filled="line" d="${line}" ${S}/>
<path data-filled="fill" d="${own ? line + "Z" : line + BITE.close}" ${S}/>
${(m.solids ?? []).join("\n")}${m.solids ? "\n" : ""}<path d="${m.lines}" ${S}/>
<path data-filled="halo" d="${m.lines}" ${S}/>
</svg>
`;
  writeFileSync(`${DIR}/${name}.svg`, svg);
  console.log(name, line);
}
