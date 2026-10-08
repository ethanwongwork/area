// Required bite radius for the person-mark family after the body moves up 0.5 (top 10, base 13.5).
// For each badge mark (shifted by DY), the body points within 2.25 of the mark's centre-lines; the bite circle
// about the mark centre must reach the farthest of them.
const DY = Number(process.argv[2] ?? 0), BY = Number(process.argv[3] ?? 13.5), TOP = BY - 3.5;
const body = []; // sample: bottom line, left arc, top, right arc
for (let i = 0; i <= 400; i++) body.push([1.5 + 10 * i / 400, BY]);
for (let i = 0; i <= 200; i++) { const a = -Math.PI / 2 * i / 200; body.push([8 + 3.5 * Math.cos(a), BY + 3.5 * Math.sin(a)]); }
for (let i = 0; i <= 100; i++) body.push([5 + 3 * i / 100, TOP]);
const seg = (p, a, b) => { const [x1, y1] = a, [x2, y2] = b, L = (x2 - x1) ** 2 + (y2 - y1) ** 2 || 1e-12; const u = Math.max(0, Math.min(1, ((p[0] - x1) * (x2 - x1) + (p[1] - y1) * (y2 - y1)) / L)); return Math.hypot(p[0] - x1 - u * (x2 - x1), p[1] - y1 - u * (y2 - y1)); };
const sh = pl => pl.map(([x, y]) => [x, y + DY]);
const ring = (cx, cy, r, n = 96) => Array.from({ length: n + 1 }, (_, i) => [cx + r * Math.cos(2 * Math.PI * i / n), cy + r * Math.sin(2 * Math.PI * i / n)]);
const arc = (cx, cy, r, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; });
const M = {
  add: [[[12.5, 10.5], [12.5, 14.5]], [[10.5, 12.5], [14.5, 12.5]]],
  remove: [[[10.5, 12.5], [14.5, 12.5]]],
  check: [[[10, 12], [11.5, 13.5], [14.5, 10.5]]],
  x: [[[10.75, 10.75], [14.25, 14.25]], [[14.25, 10.75], [10.75, 14.25]]],
  lock: [[...arc(11, 12, 0.5, 180, 90), ...arc(14, 12, 0.5, 90, 0), ...arc(14, 14, 0.5, 0, -90), ...arc(11, 14, 0.5, -90, -180), [10.5, 12]], [[11, 11.5], ...arc(12.5, 10.5, 1.5, 180, 0), [14, 11.5]]],
  settings: [ring(12.5, 12, 1.5), ring(12.5, 12, 2.25)],
};
const C = [12.5, 12.25 + DY];
let worst = 0;
for (const [k, pls] of Object.entries(M)) {
  const P = pls.map(sh); let r = 0, at = null;
  for (const p of body) if (P.some(pl => pl.slice(1).some((q, i) => seg(p, pl[i], q) < 2.25))) { const d = Math.hypot(p[0] - C[0], p[1] - C[1]); if (d > r) { r = d; at = p; } }
  console.log(k.padEnd(9), "needs r", r.toFixed(3), "at", at?.map(v => v.toFixed(3)).join(","));
  worst = Math.max(worst, r);
}
// the circle about C through the bottom line at x = X (X rounded down to 0.25 so it covers the worst)
const xb = C[0] - Math.sqrt(worst ** 2 - (BY - C[1]) ** 2), X = Math.floor(xb * 4) / 4, R = Math.hypot(C[0] - X, BY - C[1]);
// meet with the right shoulder arc (centre 8, BY, r 3.5)
let best = null; for (let i = 0; i <= 20000; i++) { const a = -Math.PI / 2 * i / 20000, p = [8 + 3.5 * Math.cos(a), BY + 3.5 * Math.sin(a)], e = Math.abs(Math.hypot(p[0] - C[0], p[1] - C[1]) - R); if (!best || e < best[0]) best = [e, p]; }
console.log("worst", worst.toFixed(3), "bottom x", xb.toFixed(3), "→", X, "R", R.toFixed(3), "shoulder", best[1].map(v => v.toFixed(3)).join(","));
