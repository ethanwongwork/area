#!/usr/bin/env node
// Geometry helpers for drawing Area icons (docs/specs/icons.md). Solve shapes here instead
// of nudging coordinates by eye, then paste the path into the source SVG.
//   node packages/icons/scripts/geometry.mjs fillet "3,1.5 14.5,8 3,14.5" "1.25,1,1.25"
//   node packages/icons/scripts/geometry.mjs open-fillet "2,5.5 8,8.5 14,5.5" "0,1.5,0"
//   node packages/icons/scripts/geometry.mjs mirror "M8 5.5C7.5 3.3 4 2.5 2 4V11.5Z"
//   node packages/icons/scripts/geometry.mjs slash "<d>" "2,2 14,14"          # off icons: one-sided
//   node packages/icons/scripts/geometry.mjs cut "<d>" "8,9 6,11 8,13 | 11,9 13,11" [clear]
//   node packages/icons/scripts/geometry.mjs behind "<back d>" "<front d>" [clear]
//   node packages/icons/scripts/geometry.mjs lobes 12.5 "4.5,10,2.5 7.5,7,3.5 11,9.5,3"
//   node packages/icons/scripts/geometry.mjs transform "<d>" 0.5 [8,8] [dx,dy]
//   node packages/icons/scripts/geometry.mjs gap "<d1>" "<d2>"
// Every command prints absolute M/L/H/V/C/A/Z paths ready for a source SVG.
import { fileURLToPath } from "node:url";

const f = n => String(+n.toFixed(3));
const norm = ([x, y]) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
const WEIGHT = 1.125;            // --area-weight-icon at 16px; gaps are judged in ink at this weight
const OVERLAP = 2.25;            // the overlap cut: a line's width of space at WEIGHT
// The gap scale in ink (docs/specs/icons.md, "Negative space"); anything else is a near miss.
const GAP_STEPS = [["detail", 0.875, 1.125], ["tight", 1.125, 1.75], ["standard", 1.75, 2.0], ["open", 2.5, Infinity]];
export const gapStep = g => GAP_STEPS.find(([, lo, hi]) => g >= lo - 1e-6 && g <= hi + 1e-6)?.[0] ?? null;

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

/** A path scaled by `scale` about `about` and then moved by [dx, dy] (absolute M/L/H/V/C/Q/A/Z).
 *  Radii scale too, so a family part (the cloud, the sparkle) keeps its shape at another size. */
export function transform(d, scale = 1, about = [8, 8], [dx, dy] = [0, 0]) {
  const t = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g); let o = "", i = 0, c = "";
  const n = () => +t[i++], X = () => f(about[0] + (n() - about[0]) * scale + dx), Y = () => f(about[1] + (n() - about[1]) * scale + dy);
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) { c = t[i++]; o += c; if (c === "Z") continue; } else o += " ";
    if (c === "M" || c === "L") o += `${X()} ${Y()}`;
    else if (c === "H") o += X(); else if (c === "V") o += Y();
    else if (c === "C") o += `${X()} ${Y()} ${X()} ${Y()} ${X()} ${Y()}`;
    else if (c === "Q") o += `${X()} ${Y()} ${X()} ${Y()}`;
    else if (c === "A") { const [rx, ry, rot, large, sweep] = [n(), n(), n(), n(), n()]; o += `${f(rx * scale)} ${f(ry * scale)} ${rot} ${large} ${sweep} ${X()} ${Y()}`; }
    else throw new Error(`transform: unsupported command ${c}`);
  }
  return o;
}

/** The upper intersection of two circles [cx, cy, r]. */
const meet = ([x1, y1, r1], [x2, y2, r2]) => {
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
  if (d > r1 + r2 || d < Math.abs(r1 - r2)) throw new Error(`lobes: circles ${x1},${y1},${r1} and ${x2},${y2},${r2} do not meet`);
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const px = x1 + a * dx / d, py = y1 + a * dy / d;
  return [[px + h * dy / d, py - h * dx / d], [px - h * dy / d, py + h * dx / d]].sort((p, q) => p[1] - q[1])[0];
};
/** A lobed outline on a flat foot, left to right: the cloud (and the tree's crown) as circles
 *  [cx, cy, r] joined where they meet, closed along the foot from the last lobe to the first.
 *  lobes(12.5, [[4.5, 10, 2.5], [7.5, 7, 3.5], [11, 9.5, 3]]) is cloud.svg exactly. */
export function lobes(foot, circles) {
  const arc = (C, p, q) => {
    const s = Math.atan2(p[1] - C[1], p[0] - C[0]), e = Math.atan2(q[1] - C[1], q[0] - C[0]);
    const sweep = ((e - s) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    return `A${f(C[2])} ${f(C[2])} 0 ${sweep > Math.PI ? 1 : 0} 1 ${f(q[0])} ${f(q[1])}`;
  };
  const first = circles[0], last = circles.at(-1), start = [first[0], foot];
  let d = `M${f(start[0])} ${f(start[1])}`, p = start;
  for (let k = 0; k < circles.length; k++) {
    const q = k < circles.length - 1 ? meet(circles[k], circles[k + 1]) : [last[0], foot];
    d += arc(circles[k], p, q); p = q;
  }
  return d + "Z";
}

// Path segments with exact sub-segment output, shared by every cut.
const lerp = (a, b, u) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
const lineSeg = (a, b) => ({ at: u => lerp(a, b, u), out: (u0, u1) => { const q = lerp(a, b, u1); return `L${f(q[0])} ${f(q[1])}`; } });
const cubicSeg = (p0, p1, p2, p3) => {
  const at = u => { const v = 1 - u; return [0, 1].map(k => v * v * v * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u * u * u * p3[k]); };
  const split = (q0, q1, q2, q3, u) => { const a = lerp(q0, q1, u), b = lerp(q1, q2, u), c = lerp(q2, q3, u), d = lerp(a, b, u), e = lerp(b, c, u), m = lerp(d, e, u); return [[q0, a, d, m], [m, e, c, q3]]; };
  return { at, out: (u0, u1) => { let q = [p0, p1, p2, p3]; if (u1 < 1) q = split(...q, u1)[0]; if (u0 > 0) q = split(...q, u0 / u1)[1]; return `C${q.slice(1).map(p => `${f(p[0])} ${f(p[1])}`).join(" ")}`; } };
};
const arcSeg = (a, rx, ry, large, sweep, b) => {
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
/** Absolute M/L/H/V/C/S/Q/A/Z as subpaths of segments (Q and S become exact cubics). */
export function parseSegments(d) {
  const t = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? []; let i = 0, c = "";
  const n = () => +t[i++];
  const subpaths = []; let P = [0, 0], start = [0, 0], lastCtrl = null;
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) c = t[i++];
    if (/[a-y]/.test(c)) throw new Error(`geometry: relative command ${c}; author absolute paths`);
    if (c === "M") { P = [n(), n()]; start = P; subpaths.push({ segs: [], closed: false }); c = "L"; lastCtrl = null; continue; }
    const cur = subpaths.at(-1).segs; let Q, ctrl = null;
    if (c === "L") { Q = [n(), n()]; cur.push(lineSeg(P, Q)); }
    else if (c === "H") { Q = [n(), P[1]]; cur.push(lineSeg(P, Q)); }
    else if (c === "V") { Q = [P[0], n()]; cur.push(lineSeg(P, Q)); }
    else if (c === "C") { const p1 = [n(), n()], p2 = [n(), n()]; Q = [n(), n()]; cur.push(cubicSeg(P, p1, p2, Q)); ctrl = p2; }
    else if (c === "S") { const p1 = lastCtrl ? [2 * P[0] - lastCtrl[0], 2 * P[1] - lastCtrl[1]] : P, p2 = [n(), n()]; Q = [n(), n()]; cur.push(cubicSeg(P, p1, p2, Q)); ctrl = p2; }
    else if (c === "Q") { const q = [n(), n()]; Q = [n(), n()]; cur.push(cubicSeg(P, lerp(P, q, 2 / 3), lerp(Q, q, 2 / 3), Q)); }
    else if (c === "A") { const [rx, ry] = [n(), n()]; n(); const [lg, sw] = [n(), n()]; Q = [n(), n()]; cur.push(arcSeg(P, rx, ry, lg, sw, Q)); }
    else if (c === "Z" || c === "z") { if (Math.hypot(P[0] - start[0], P[1] - start[1]) > 1e-9) cur.push(lineSeg(P, start)); subpaths.at(-1).closed = true; P = start; lastCtrl = null; continue; }
    else throw new Error(`geometry: unsupported command ${c}`);
    lastCtrl = ctrl; P = Q;
  }
  return subpaths;
}
/** Points along a path, about every 0.05px, per subpath (for distances and inside tests). */
export function samplePath(d, step = 0.05) {
  return parseSegments(d).map(sp => sp.segs.flatMap(s => {
    let l = 0, q = s.at(0); for (let k = 1; k <= 16; k++) { const w = s.at(k / 16); l += Math.hypot(w[0] - q[0], w[1] - q[1]); q = w; }
    const N = Math.max(2, Math.ceil(l / step)); return Array.from({ length: N + 1 }, (_, k) => s.at(k / N));
  }));
}
const insideRings = (rings, [x, y]) => {
  let inside = false;
  for (const pts of rings) for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const segDistance = ([x1, y1, x2, y2], [x, y]) => {
  const L2 = (x2 - x1) ** 2 + (y2 - y1) ** 2 || 1e-12;
  const u = Math.max(0, Math.min(1, ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / L2));
  return Math.hypot(x - x1 - u * (x2 - x1), y - y1 - u * (y2 - y1));
};

/** The path with every part where `removed(point)` holds taken out. Kept pieces keep their
 *  exact geometry (lines, arcs and cubics are split, not resampled); pieces the cut shortened
 *  below `min` (2px: stubs that read as specks) are dropped. */
export function cutWhere(d, removed, min = 2) {
  let out = "";
  for (const sp of parseSegments(d)) {
    // Kept runs as [segment, u0, u1] pieces; a closed path's first and last runs join.
    const runs = []; let run = null;
    for (const s of sp.segs) {
      const N = 400; let prev = removed(s.at(0)), u0 = 0;
      const edge = (a, b) => { for (let k = 0; k < 40; k++) { const m = (a + b) / 2; removed(s.at(m)) === removed(s.at(a)) ? a = m : b = m; } return (a + b) / 2; };
      if (!prev && !run) run = [];
      for (let k = 1; k <= N; k++) {
        const u = k / N, now = removed(s.at(u));
        if (now !== prev) { const e = edge((k - 1) / N, u); if (now) { run.push([s, u0, e]); runs.push(run); run = null; } else { run = []; u0 = e; } prev = now; }
      }
      if (!prev) run.push([s, u0, 1]);
      u0 = 0;
    }
    if (run) { if (sp.closed && runs.length && sp.segs.length && !removed(sp.segs[0].at(0))) runs[0] = [...run, ...runs[0]]; else runs.push(run); }
    const length = r => r.reduce((sum, [s, a, b]) => { let l = 0, q = s.at(a); for (let k = 1; k <= 50; k++) { const w = s.at(a + (b - a) * k / 50); l += Math.hypot(w[0] - q[0], w[1] - q[1]); q = w; } return sum + l; }, 0);
    // Pieces that start or stop exactly on a segment's end are empty; drop them so no
    // zero-length arc (which has no centre) reaches the output. A subpath the cut never
    // reaches stays whole.
    const whole = length(sp.segs.map(s => [s, 0, 1]));
    for (const r0 of runs) { const r = r0.filter(([, a, b]) => b - a > 1e-6); if (!r.length) continue; const l = length(r); if (l < min && l < whole - 1e-3) continue; const [s0, a0] = r[0], p0 = s0.at(a0); out += `M${f(p0[0])} ${f(p0[1])}` + r.map(([s, a, b]) => s.out(a, b)).join(""); }
  }
  return out;
}

/** A path cut open where a slash (or any stroke segment in front) crosses it: everything
 *  within `clear` of the segment is removed, so the ends stop an overlap cut from the slash
 *  (2.25 between centre-lines: the line's width of space at 1.125). With `oneSided`, only
 *  the side to the right of the segment's direction is cut (above a 2,2 → 14,14 slash): the
 *  shape runs up to the slash from the other side, as Fluent's and Lucide's "off" icons do. */
export function slashCut(d, [x1, y1, x2, y2], clear = OVERLAP, min = 2, oneSided = false) {
  return cutWhere(d, ([x, y]) => {
    if (oneSided && (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1) <= 0) return false;
    return segDistance([x1, y1, x2, y2], [x, y]) < clear;
  }, min);
}

/** A path cut open round lines in front of it (a mark, an arrow, rain, a bolt): every part
 *  within `clear` of any of the polylines is removed. polylines: [[[x, y], …], …]. */
export function cutAround(d, polylines, clear = OVERLAP, min = 1) {
  const segs = polylines.flatMap(pl => pl.slice(1).map((q, k) => [...pl[k], ...q]));
  return cutWhere(d, p => segs.some(s => segDistance(s, p) < clear), min);
}

/** The overlap cut (Shared parts): the back shape stops `clear` short of the front shape
 *  where it passes behind it (people's back figure, coins, cloud-sun's sun). The front is a
 *  closed path; its inside and everything within `clear` of its outline are removed. */
export function cutBehind(back, front, clear = OVERLAP, min = 1) {
  const rings = samplePath(front), pts = rings.flat();
  return cutWhere(back, p => insideRings(rings, p) || pts.some(q => Math.hypot(q[0] - p[0], q[1] - p[1]) < clear), min);
}

/** The ink gap between two stroked paths at WEIGHT, and its step on the gap scale. */
export function inkGap(d1, d2, weight = WEIGHT) {
  const a = samplePath(d1, 0.02).flat(), b = samplePath(d2, 0.02).flat();
  let m = Infinity; for (const p of a) for (const q of b) m = Math.min(m, Math.hypot(p[0] - q[0], p[1] - q[1]));
  const g = m - weight; return { centres: m, gap: g, step: g <= 0 ? "join" : gapStep(g) ?? "near miss" };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [cmd, a, b, c, e] = process.argv.slice(2);
  const pts = s => s.trim().split(/\s+/).map(p => p.split(",").map(Number));
  if (cmd === "fillet" || cmd === "open-fillet") console.log(fillet(pts(a), b.split(",").map(Number), cmd === "fillet"));
  else if (cmd === "mirror") console.log(mirror(a));
  else if (cmd === "slash") console.log(slashCut(a, b.split(/[\s,]+/).map(Number), OVERLAP, 2, c === "--both" ? false : true));
  else if (cmd === "cut") console.log(cutAround(a, b.split("|").map(pts), c ? Number(c) : OVERLAP));
  else if (cmd === "behind") console.log(cutBehind(a, b, c ? Number(c) : OVERLAP));
  else if (cmd === "lobes") console.log(lobes(Number(a), pts(b)));
  else if (cmd === "transform") console.log(transform(a, Number(b), c ? c.split(",").map(Number) : [8, 8], e ? e.split(",").map(Number) : [0, 0]));
  else if (cmd === "gap") { const r = inkGap(a, b); console.log(`${f(r.gap)}px ink (${f(r.centres)} between centre-lines): ${r.step}`); }
  else console.log(`usage: geometry.mjs <command>
  fillet "x,y …" "r,…"            closed polygon with arc corners (0 keeps a corner sharp)
  open-fillet "x,y …" "r,…"       the same, open (end radii ignored)
  mirror "<d>"                    mirror across x = 8
  slash "<d>" "2,2 14,14" [--both]  cut round the shared slash, one-sided (the off icons)
  cut "<d>" "x,y x,y … | …" [clear] cut round lines in front (marks, arrows, rain, a bolt)
  behind "<back d>" "<front d>" [clear]  the overlap cut round a closed shape in front
  lobes <foot> "cx,cy,r …"        a lobed outline on a flat foot (cloud, tree crown)
  transform "<d>" <scale> [ax,ay] [dx,dy]  scale about a point, then move
  gap "<d1>" "<d2>"               ink gap at 1.125 and its step on the gap scale`);
}
