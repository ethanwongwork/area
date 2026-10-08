// Lucide's handshake on Area's grid, ×2/3 so its fingers land on the 45° lattice (lines x − y = −8, −4, 0, 4,
// 4 apart as Lucide's 6; thumb x + y = 10 and 14); fingertips and the thumb tip semicircles r 1.414 on a
// 2.83 chord; the knuckle a 90° r 2 fillet (Lucide's r 3); the right hand's top an r 4 arc (Lucide 5.79)
// tangent to the thumb line, its top at y 2, then a straight run to the right cuff (Lucide's small wrist dip
// dropped); the cuffs slant out 0.5 over 8 (Lucide 1 over 11) and the left hand's top line joins the arc.
//   node handshake2.mjs [noF2]
const noF2 = process.argv[2] === "noF2";
const TL = Number(process.argv[3] ?? 2.5);
const f = n => +n.toFixed(3) + "";
const S = 'fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"';
const r = Math.SQRT2, R = 4, top = 2, cy = top + R, cx = 10 + R * Math.SQRT2 - cy;
const T1 = [cx - R / Math.SQRT2, cy - R / Math.SQRT2];
const cuffX = (x0, x1, y) => x0 + (x1 - x0) * (y - 2) / 8;
const yl = 2.5, Lx = cuffX(TL, 2, yl), Rx = cuffX(16 - TL, 14, yl);
const Lend = [cx - Math.sqrt(R * R - (cy - yl) ** 2), yl];
// tangent from Q to the circle, the upper-right one
const Q = [Rx, yl], dx = Q[0] - cx, dy = Q[1] - cy, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx), b = Math.acos(R / d);
const P = [cx + R * Math.cos(a - b), cy + R * Math.sin(a - b)], P2 = [cx + R * Math.cos(a + b), cy + R * Math.sin(a + b)];
const Pt = P[1] < P2[1] ? P : P2;
const k = 2 / Math.SQRT2, K1 = [9 - k, 5 + k], K2 = [9 + k, 5 + k];
const paths = [
  `M${f(TL)} 2L2 10L5.5 13.5A${f(r)} ${f(r)} 0 0 0 7.5 11.5`,
  `M${f(Lx)} ${yl}H${f(Lend[0])}`,
  `M9 9L11 11A${f(r)} ${f(r)} 0 0 0 13 9L${f(K2[0])} ${f(K2[1])}A2 2 0 0 0 ${f(K1[0])} ${f(K1[1])}L7 7A${f(r)} ${f(r)} 0 0 1 5 5L${f(T1[0])} ${f(T1[1])}A${R} ${R} 0 0 1 ${f(Pt[0])} ${f(Pt[1])}L${f(Q[0])} ${f(Q[1])}`,
  `M${f(16 - TL)} 2L14 10H${f(12 + r)}`,
];
if (!noF2) paths.push(`M7 11L8.5 12.5A${f(r)} ${f(r)} 0 0 0 10.5 10.5`);
console.log(`<svg data-set="area-pilot" data-keyline="circle" data-angles="free" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
${paths.map(d => `<path d="${d}" ${S}/>`).join("\n")}
</svg>`);
