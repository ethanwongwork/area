// The fingerprint (owner, 2026-10-06: "curved like android's icon"): a two-centre spiral, constructed, not
// traced. Usage: node fingerprint-spiral.mjs 7.75 8.75 1.25 1.25 '[[0,1.55],[1.9,3.0],[3.62,3.85],[4.111,4.889]]'
// (A x, A y, half the turn spacing, the core radius, then the pieces as spiral parameter ranges; the
// second piece gets a straight left leg, V12.75, in the source).
const [ax, ay, s, r0] = process.argv.slice(2, 6).map(Number);
const pieces = JSON.parse(process.argv[6]);
const f = v => +v.toFixed(3);
const pt = t => { const k = Math.min(Math.floor(t), 99), u = t - k, r = r0 + k * s;
  const [cx, th] = k % 2 === 0 ? [ax, Math.PI * u] : [ax + s, Math.PI + Math.PI * u];
  return [f(cx + r * Math.cos(th)), f(ay - r * Math.sin(th)), r]; };
for (const [t0, t1] of pieces) {
  let d = `M${pt(t0).slice(0, 2).join(" ")}`;
  const stops = [t0]; for (let k = Math.floor(t0) + 1; k < t1; k++) stops.push(k); stops.push(t1);
  for (let i = 1; i < stops.length; i++) { const k = Math.floor(stops[i - 1] + 1e-9), r = r0 + k * s, [x, y] = pt(stops[i] - (stops[i] === Math.floor(stops[i]) && i < stops.length ? 1e-9 : 0));
    // sweep 0: anticlockwise on screen (top half-turns run right → left over the top, bottom ones left → right under)
    d += `A${r} ${r} 0 0 0 ${f(x)} ${f(y)}`; }
  console.log(d);
}
