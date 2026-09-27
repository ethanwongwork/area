#!/usr/bin/env node
// Geometry helpers for drawing Area icons (docs/specs/icons.md). Solve shapes here instead
// of nudging coordinates by eye, then paste the path into the source SVG.
//   node apps/docs/scripts/icon-geometry.mjs fillet "3,1.5 14.5,8 3,14.5" "1.25,1,1.25"
//   node apps/docs/scripts/icon-geometry.mjs open-fillet "2,5.5 8,8.5 14,5.5" "0,1.5,0"
//   node apps/docs/scripts/icon-geometry.mjs mirror "M8 5.5C7.5 3.3 4 2.5 2 4V11.5Z"
//   node apps/docs/scripts/icon-geometry.mjs slash "<d>" "2,2 14,14"   # cut round a slash
import { fileURLToPath } from "node:url";

const f = n => String(+n.toFixed(3));
const norm = ([x, y]) => { const l = Math.hypot(x, y); return [x / l, y / l]; };

/** A polygon whose corners are rounded by the given radii (0 keeps a corner sharp). The
 *  fillets are arcs, so the lint's acute-corner rule (straight joins under 60°) never fires. */
export function fillet(pts, radii, closed = true) {
  const n = pts.length, out = [];
  for (let i = 0; i < n; i++) {
    const P = pts[i], r = radii[i];
    if (!r || (!closed && (i === 0 || i === n - 1))) { out.push({ a: P, b: P }); continue; }
    const A = pts[(i - 1 + n) % n], B = pts[(i + 1) % n];
    const u = norm([A[0] - P[0], A[1] - P[1]]), v = norm([B[0] - P[0], B[1] - P[1]]);
    const t = r / Math.tan(Math.acos(u[0] * v[0] + u[1] * v[1]) / 2);
    const cross = (P[0] - A[0]) * (B[1] - P[1]) - (P[1] - A[1]) * (B[0] - P[0]);
    out.push({ a: [P[0] + u[0] * t, P[1] + u[1] * t], b: [P[0] + v[0] * t, P[1] + v[1] * t], r, sweep: cross > 0 ? 1 : 0 });
  }
  const seg = c => `L${f(c.a[0])} ${f(c.a[1])}` + (c.r ? `A${c.r} ${c.r} 0 0 ${c.sweep} ${f(c.b[0])} ${f(c.b[1])}` : "");
  let d = `M${f(out[0].b[0])} ${f(out[0].b[1])}`;
  for (let i = 1; i < n; i++) d += seg(out[i]);
  return closed ? d + seg(out[0]) + "Z" : d;
}

/** A path mirrored across x = 8 (absolute M/L/H/V/C/A/Z), for the other half of a symmetric
 *  drawing. Whole icons mirror with data-rotations instead. */
export function mirror(d) {
  const t = d.match(/[A-Za-z]|-?\d*\.?\d+/g); let o = "", i = 0, c = "";
  const n = () => +t[i++], x = () => f(16 - n());
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) { c = t[i++]; o += c; if (c === "Z") continue; } else o += " ";
    if (c === "M" || c === "L") o += `${x()} ${f(n())}`;
    else if (c === "H") o += x(); else if (c === "V") o += f(n());
    else if (c === "C") o += `${x()} ${f(n())} ${x()} ${f(n())} ${x()} ${f(n())}`;
    else if (c === "A") { const [rx, ry, rot, large, sweep] = [n(), n(), n(), n(), n()]; o += `${rx} ${ry} ${rot} ${large} ${1 - sweep} ${x()} ${f(n())}`; }
    else throw new Error(`mirror: unsupported command ${c}`);
  }
  return o;
}

/** A path cut open where a slash (or any stroke segment in front) crosses it: everything
 *  within `clear` of the segment is removed, so the ends stop an overlap cut from the slash
 *  (2.25 between centre-lines: the line's width of space at 1.125). With `oneSided`, only
 *  the side to the right of the segment's direction is cut (above a 2,2 → 14,14 slash): the
 *  shape runs up to the slash from the other side, as Fluent's and Lucide's "off" icons do. Absolute M/L/H/V/A/C/Z;
 *  arcs are circular or axis-aligned ellipses. Pieces the cut shortened below `min` (2px:
 *  stubs that would read as specks) are dropped. Returns the pieces as one path. */
export function slashCut(d, [x1, y1, x2, y2], clear = 2.25, min = 2, oneSided = false) {
  const t = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g); let i = 0, c = "";
  const n = () => +t[i++];
  const segs = []; let P = [0, 0], start = [0, 0];
  const line = (a, b) => ({ at: u => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u], out: (u0, u1) => { const q = [a[0] + (b[0] - a[0]) * u1, a[1] + (b[1] - a[1]) * u1]; return `L${f(q[0])} ${f(q[1])}`; } });
  const cubic = (p0, p1, p2, p3) => {
    const at = u => { const v = 1 - u; return [0, 1].map(k => v * v * v * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u * u * u * p3[k]); };
    const lerp = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
    const split = (q0, q1, q2, q3, u) => { const a = lerp(q0, q1, u), b = lerp(q1, q2, u), cc = lerp(q2, q3, u), dd = lerp(a, b, u), e = lerp(b, cc, u), m = lerp(dd, e, u); return [[q0, a, dd, m], [m, e, cc, q3]]; };
    return { at, out: (u0, u1) => { let q = [p0, p1, p2, p3]; if (u1 < 1) q = split(...q, u1)[0]; if (u0 > 0) q = split(...q, u0 / u1)[1]; return `C${q.slice(1).map(p => `${f(p[0])} ${f(p[1])}`).join(" ")}`; } };
  };
  const arc = (a, rx, ry, large, sweep, b) => {
    // Endpoint to centre parameterisation (SVG F.6.5), rotation 0.
    const dx = (a[0] - b[0]) / 2, dy = (a[1] - b[1]) / 2;
    const lam = dx * dx / (rx * rx) + dy * dy / (ry * ry); if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
    const num = rx * rx * ry * ry - rx * rx * dy * dy - ry * ry * dx * dx, den = rx * rx * dy * dy + ry * ry * dx * dx;
    const k = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, num / den));
    const cx = k * rx * dy / ry + (a[0] + b[0]) / 2, cy = -k * ry * dx / rx + (a[1] + b[1]) / 2;
    const th1 = Math.atan2((a[1] - cy) / ry, (a[0] - cx) / rx); let dth = Math.atan2((b[1] - cy) / ry, (b[0] - cx) / rx) - th1;
    if (sweep && dth < 0) dth += 2 * Math.PI; if (!sweep && dth > 0) dth -= 2 * Math.PI;
    const at = u => [cx + rx * Math.cos(th1 + dth * u), cy + ry * Math.sin(th1 + dth * u)];
    return { at, out: (u0, u1) => { const q = at(u1); return `A${f(rx)} ${f(ry)} 0 ${Math.abs(dth * (u1 - u0)) > Math.PI ? 1 : 0} ${sweep} ${f(q[0])} ${f(q[1])}`; } };
  };
  const subpaths = [];
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) c = t[i++];
    if (c === "M") { P = [n(), n()]; start = P; subpaths.push({ segs: [], closed: false }); c = "L"; continue; }
    const cur = subpaths.at(-1).segs; let Q;
    if (c === "L") { Q = [n(), n()]; cur.push(line(P, Q)); }
    else if (c === "H") { Q = [n(), P[1]]; cur.push(line(P, Q)); }
    else if (c === "V") { Q = [P[0], n()]; cur.push(line(P, Q)); }
    else if (c === "C") { const p1 = [n(), n()], p2 = [n(), n()]; Q = [n(), n()]; cur.push(cubic(P, p1, p2, Q)); }
    else if (c === "A") { const [rx, ry] = [n(), n()]; n(); const [lg, sw] = [n(), n()]; Q = [n(), n()]; cur.push(arc(P, rx, ry, lg, sw, Q)); }
    else if (c === "Z") { if (Math.hypot(P[0] - start[0], P[1] - start[1]) > 1e-9) cur.push(line(P, start)); subpaths.at(-1).closed = true; P = start; continue; }
    else throw new Error(`slash: unsupported command ${c}`);
    P = Q;
  }
  const L2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  const inside = ([x, y]) => {
    if (oneSided && (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1) <= 0) return false;
    const u = Math.max(0, Math.min(1, ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / L2));
    return Math.hypot(x - x1 - u * (x2 - x1), y - y1 - u * (y2 - y1)) < clear;
  };
  let out = "";
  for (const sp of subpaths) {
    // Kept runs as [segment, u0, u1] pieces; a closed path's first and last runs join.
    const runs = []; let run = null;
    for (const s of sp.segs) {
      const N = 400; let prev = inside(s.at(0)), u0 = 0;
      const edge = (a, b) => { for (let k = 0; k < 40; k++) { const m = (a + b) / 2; inside(s.at(m)) === inside(s.at(a)) ? a = m : b = m; } return (a + b) / 2; };
      if (!prev && !run) run = [];
      for (let k = 1; k <= N; k++) {
        const u = k / N, now = inside(s.at(u));
        if (now !== prev) { const e = edge((k - 1) / N, u); if (now) { run.push([s, u0, e]); runs.push(run); run = null; } else { run = []; u0 = e; } prev = now; }
      }
      if (!prev) run.push([s, u0, 1]);
      u0 = 0;
    }
    if (run) { if (sp.closed && runs.length && sp.segs.length && !inside(sp.segs[0].at(0))) runs[0] = [...run, ...runs[0]]; else runs.push(run); }
    const length = r => r.reduce((sum, [s, a, b]) => { let l = 0, q = s.at(a); for (let k = 1; k <= 50; k++) { const w = s.at(a + (b - a) * k / 50); l += Math.hypot(w[0] - q[0], w[1] - q[1]); q = w; } return sum + l; }, 0);
    // Pieces that start or stop exactly on a segment's end are empty; drop them so no
    // zero-length arc (which has no centre) reaches the output.
    // A stub is a piece the cut shortened; a subpath the slash never reaches stays whole.
    const whole = length(sp.segs.map(s => [s, 0, 1]));
    for (const r0 of runs) { const r = r0.filter(([, a, b]) => b - a > 1e-6); if (!r.length) continue; const l = length(r); if (l < min && l < whole - 1e-3) continue; const [s0, a0] = r[0], p0 = s0.at(a0); out += `M${f(p0[0])} ${f(p0[1])}` + r.map(([s, a, b]) => s.out(a, b)).join(""); }
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [cmd, a, b] = process.argv.slice(2);
  const pts = s => s.trim().split(/\s+/).map(p => p.split(",").map(Number));
  if (cmd === "fillet" || cmd === "open-fillet") console.log(fillet(pts(a), b.split(",").map(Number), cmd === "fillet"));
  else if (cmd === "mirror") console.log(mirror(a));
  else if (cmd === "slash") console.log(slashCut(a, b.split(/[\s,]+/).map(Number)));
  else console.log("usage: icon-geometry.mjs fillet|open-fillet \"x,y …\" \"r,…\" | mirror \"<d>\"");
}
