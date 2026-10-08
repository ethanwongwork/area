// Ten fingerprint candidates (owner, 2026-10-06: "make a bunch of versions of it like 10, look at other
// fingerprint icons from other icon libraries"). Each is constructed on Area's grid (ridges 2.5 apart so the
// filled 1.5 line keeps its gaps, breaks ≥ 2.4 along the ridge), after one library's idea, never traced.
// Writes apps/docs/assets/area-icons-pilot/explore/fingerprint-*.svg.
import { writeFileSync, readFileSync } from "node:fs";
const S = 'fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"';
const f = v => +v.toFixed(3);
// An arc about (cx, cy), radius r, from math angle a0 to a1 in degrees (anticlockwise positive, y up).
const P = (cx, cy, r, a) => [f(cx + r * Math.cos(a * Math.PI / 180)), f(cy - r * Math.sin(a * Math.PI / 180))];
const arc = (cx, cy, r, a0, a1, move = true) => { const [x0, y0] = P(cx, cy, r, a0), [x1, y1] = P(cx, cy, r, a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 < a0 ? 1 : 0;
  return `${move ? `M${x0} ${y0}` : ""}A${r} ${r} 0 ${large} ${sweep} ${x1} ${y1}`; };
const pathsFrom = file => [...readFileSync(file, "utf8").matchAll(/<path d="([^"]+)"/g)].map(m => m[1]);
const C = {
  "swirl": { label: "1 · Swirl (Material, your reference)", d: pathsFrom("apps/docs/assets/area-icons-pilot/fingerprint.svg") },
  "spiral": { label: "2 · Spiral (Android)", d: pathsFrom("apps/docs/.cache/fingerprint-spiral.svg") },
  "loops": { label: "3 · Nested loops (Apple Touch ID)", d: pathsFrom("apps/docs/.cache/fingerprint-loops.svg") },
  "tracks": { label: "4 · Arches on curved tracks (first round today)", d: [
    "M2.661 10.5A19.5 19.5 0 0 1 2.5 8A5.5 5.5 0 0 1 4.111 4.111", "M6.856 2.62A5.5 5.5 0 0 1 13.5 8A19.5 19.5 0 0 1 13.442 9.5",
    "M13.085 12A19.5 19.5 0 0 1 12.708 13.5", "M5.181 6.974A3 3 0 0 1 11 8A17 17 0 0 1 10.086 13.5",
    "M5.058 9.4A17 17 0 0 0 5.224 10.75", "M8 8A14 14 0 0 1 6.874 13.5"] },
  "original": { label: "5 · Original (Phosphor, yesterday)", d: pathsFrom("apps/docs/.cache/fingerprint-original.svg") },
  // Fluent: arches about one centre, a hairpin core, every ridge broken once or twice, legs ending at
  // staggered heights.
  "fluent": { label: "6 · Broken arches (Fluent)", d: [
    "M6.5 13V8.5A1.5 1.5 0 0 1 9.5 8.5V11",
    `M4 12V8.5${arc(8, 8.5, 4, 180, 105, false)}`, `${arc(8, 8.5, 4, 75, 0)}V9.5`, "M12 12V14",
    arc(8, 8.5, 6.5, 200, 135), `${arc(8, 8.5, 6.5, 112, 0)}V10.5`] },
  // Heroicons: arcs leaning left, their left ends running down past the centre, the right ends short.
  "lean": { label: "7 · Leaning arcs (Heroicons)", d: [
    arc(9, 8.5, 1.5, 200, 0) + "V9.5", arc(9, 8.5, 4, 215, 15), arc(9, 8.5, 6.5, 165, 35),
    arc(9, 8.5, 6.5, 205, 235), arc(9, 8.5, 4, -25, -65)] },
  // Tabler: few, bold strokes: two arches with legs and a centre stem.
  "bold": { label: "8 · Two arches and a stem (Tabler)", d: [
    `M2.5 13V8${arc(8, 8, 5.5, 180, 0, false)}V11`, `M5 12.5V8${arc(8, 8, 3, 180, 0, false)}V13`, "M8 8V14"] },
  // Your reference and Material Symbols, fuller: the swirl's arcs keep their left legs, so four lines run
  // down the left like a print.
  "swirl-legs": { label: "9 · Swirl with legs (your reference, fuller)", d: [
    `M2 11${arc(8.25, 9.25, 6.25, 180, 20, false)}`, `M4.5 13V9.25${arc(8.25, 9.25, 3.75, 180, 0, false)}V10.25`,
    `M7 11.5V9.25${arc(8.25, 9.25, 1.25, 180, 0, false)}A3.75 3.75 0 0 0 12.599 12.943`] },
  // Apple's nested loops turned 15° clockwise, as a print sits on a finger.
  "tilted": { label: "10 · Tilted loops (Apple, turned 15°)", rotate: 15, d: pathsFrom("apps/docs/.cache/fingerprint-loops.svg") },
};
// Turn a path about (8, 8) by deg (clockwise on screen); V and H become L, arcs keep radius and flags.
const rotate = (d, deg) => { const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
  const R = (x, y) => [f(8 + (x - 8) * c - (y - 8) * s), f(8 + (x - 8) * s + (y - 8) * c)];
  let x = 0, y = 0, out = ""; const tok = d.match(/[MLHVAZ]|-?\d*\.?\d+/g); let i = 0, cmd; const n = () => +tok[i++];
  while (i < tok.length) { if (/[A-Z]/.test(tok[i])) cmd = tok[i++];
    if (cmd === "M" || cmd === "L") { x = n(); y = n(); out += cmd + R(x, y).join(" "); }
    else if (cmd === "V") { y = n(); out += "L" + R(x, y).join(" "); }
    else if (cmd === "H") { x = n(); out += "L" + R(x, y).join(" "); }
    else if (cmd === "A") { const rx = n(), ry = n(), rot = n(), la = n(), sw = n(); x = n(); y = n(); out += `A${rx} ${ry} ${rot} ${la} ${sw} ${R(x, y).join(" ")}`; }
    else if (cmd === "Z") out += "Z"; }
  return out; };
for (const [key, c] of Object.entries(C)) {
  if (c.rotate) c.d = c.d.map(d => rotate(d, c.rotate));
  const svg = `<svg data-set="area-pilot" data-keyline="circle" data-angles="free" data-group="fingerprint" data-label="${c.label}" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
${c.d.map(d => `<path d="${d}" ${S}/>`).join("\n")}
</svg>
`;
  writeFileSync(`apps/docs/assets/area-icons-pilot/explore/fingerprint-${key}.svg`, svg);
}
console.log(Object.keys(C).length, "candidates");
