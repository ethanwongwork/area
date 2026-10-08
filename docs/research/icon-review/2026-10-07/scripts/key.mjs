// Phosphor's key on Area's grid: a round bow, a wide blade on the 45° axis x + y = cx + cy, its end squared
// to the axes (left side, bottom) with an r 0.5 corner, and Phosphor's two-step bit on the lower edge.
//   node key.mjs cx cy r U Lo left bottom "steps" [hx,hy]  → prints the svg
// U, Lo: the blade's upper and lower edges as x + y; steps: the bit's corners after the bottom, "x1 y1 x2 y2 …"
// read as H x1 V y1 H x2 V y2 … ending on the lower edge.
const [cx, cy, r, U, Lo, L, B] = process.argv.slice(2, 9).map(Number), steps = process.argv[9].trim().split(/\s+/).map(Number);
const [hx, hy] = (process.argv[10] ?? "").split(",").map(Number);
const f = v => +v.toFixed(3) + "";
// the circle meets x + y = c at the point nearer the blade (lower left)
const meet = c => { const d = (c - cx - cy) / Math.SQRT2, t = Math.sqrt(r * r - d * d); // foot of the perpendicular, then along (-1, 1)/√2
  const fx = cx + d / Math.SQRT2, fy = cy + d / Math.SQRT2; return [fx - t / Math.SQRT2, fy + t / Math.SQRT2]; };
const [ux, uy] = meet(U), [lx, ly] = meet(Lo);
const fr = 0.5; // bottom-left corner
let d = `M${f(ux)} ${f(uy)}L${f(L)} ${f(U - L)}V${f(B - fr)}A${fr} ${fr} 0 0 0 ${f(L + fr)} ${f(B)}`;
for (let i = 0; i < steps.length; i += 2) d += `H${f(steps[i])}V${f(steps[i + 1])}`;
const ex = steps[steps.length - 2], ey = steps[steps.length - 1];
if (Math.abs(Lo - ey - ex) > 1e-9) d += `H${f(Lo - ey)}`;
d += `L${f(lx)} ${f(ly)}A${r} ${r} 0 1 0 ${f(ux)} ${f(uy)}Z`;
const S = 'fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"';
console.log(`<svg data-set="area-pilot" data-keyline="circle" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path data-filled="solid" d="${d}" ${S}/>
${isNaN(hx) ? "" : `<circle data-filled="hole" cx="${hx}" cy="${hy}" r="0.75" fill="currentColor"/>\n`}</svg>`);
