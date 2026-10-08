// person-key: the family figure (head r 3 at 6.5, 5; body 1.5–11.5 × 10–13.5) with the key icon's drawing
// at about 0.56 (key.mjs), the body cut round it by the overlap cut. node pkey.mjs "<key args>"  (writes the source)
import { execFileSync } from "node:child_process"; import { writeFileSync } from "node:fs";
const A = process.argv[2], args = process.argv.slice(3);
const svg = execFileSync("node", [A + "/key.mjs", ...args], { encoding: "utf8" });
const kd = svg.match(/ d="([^"]+)"/)[1], hole = (svg.match(/<circle[^>]+>/) || [""])[0];
const S = 'fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"';
const BODY = "M1.5 13.5A3.5 3.5 0 0 1 5 10H8A3.5 3.5 0 0 1 11.5 13.5Z";
const line = execFileSync("node", ["apps/docs/scripts/icon-geometry.mjs", "behind", BODY, kd], { encoding: "utf8" }).trim().split("\n").pop();
const out = `<svg data-set="area-pilot" data-keyline="circle" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle data-filled="solid" cx="6.5" cy="5" r="3" ${S}/>
<path data-filled="line" d="${line}" ${S}/>
<path data-filled="fill" d="${line}Z" ${S}/>
<path data-filled="solid" data-halo="" d="${kd}" ${S}/>
${hole}
</svg>
`;
writeFileSync("apps/docs/assets/area-icons-pilot/person-key.svg", out); console.log(out);
