// Checks a drawn web for lines that overlap or nearly touch. Lines may cross; they may not run
// along each other, cross so shallowly they read as one, or pass so close they nearly touch, and
// no arrowhead may sit against another line. Works on what is actually drawn: every arrow's
// line and head, minus the parts hidden in other letters' clearings.
//
//   clearance(web) → { problems: [{ x, y, kind, a, b }], gap }
//
// kind: 'overlap'  two lines closer than the gap for a stretch, not at a crossing
//       'shallow'  two lines crossing at under 20°, which reads as one line
//       'head'     an arrowhead's wing closer than the gap to another line
//
// The gap scales with the line weight: two line widths plus 8 units in the open; round a letter,
// where ends are set at their own spacing, the ends' spacing.

const SHALLOW = 20;

export function clearance(web) {
  const lw = web.lw;
  const GAP = 2 * lw + 8, NEAR_END = 5 + lw * 1.5;
  const rings = web.rings();
  const nodes = [...web.nodes.values()];
  const hidden = (x, y, e) => nodes.some((n) => n !== e.a && n !== e.b && Math.hypot(n.x - x, n.y - y) < rings.get(n));
  const atEnd = (x, y, e) => [e.a, e.b].find((n) => Math.hypot(n.x - x, n.y - y) < rings.get(n)) ?? null;

  // Every edge as visible samples (every 3 units) and its segments; heads as wing segments.
  const lines = web.edges.map((e, i) => {
    const { pts, dir } = web.curve(e);
    const segs = [], samples = [];
    for (let k = 1; k < pts.length; k++) {
      const [x0, y0] = pts[k - 1], [x1, y1] = pts[k];
      segs.push([pts[k - 1], pts[k]]);
      const L = Math.hypot(x1 - x0, y1 - y0), m = Math.max(1, Math.round(L / 3));
      for (let j = 0; j < m; j++) {
        const x = x0 + ((x1 - x0) * j) / m, y = y0 + ((y1 - y0) * j) / m;
        if (!hidden(x, y, e)) samples.push({ x, y, end: atEnd(x, y, e), head: false });
      }
    }
    // The head's two wings.
    const tip = pts[pts.length - 1], ang = Math.atan2(dir[1], dir[0]), len = 10 + lw * 2.2;
    for (const w of [-0.5, 0.5]) {
      const end = [tip[0] - Math.cos(ang + w) * len, tip[1] - Math.sin(ang + w) * len];
      for (let j = 0; j <= 6; j++) samples.push({ x: tip[0] + ((end[0] - tip[0]) * j) / 6, y: tip[1] + ((end[1] - tip[1]) * j) / 6, end: e.a === e.b ? e.a : e.b, head: true });
    }
    return { e, i, segs, samples, box: box(pts, len + GAP) };
  });

  const problems = [];
  for (let i = 0; i < lines.length; i++)
    for (let j = i + 1; j < lines.length; j++) {
      const A = lines[i], B = lines[j];
      if (A.box[0] > B.box[2] || B.box[0] > A.box[2] || A.box[1] > B.box[3] || B.box[1] > A.box[3]) continue;
      // Crossings, and how far either side of each a close approach is just the crossing.
      const xs = [];
      for (const [p, q] of A.segs)
        for (const [r, s] of B.segs) {
          const c = cross(p, q, r, s);
          if (!c) continue;
          const shared = [A.e.a, A.e.b].find((n) => n === B.e.a || n === B.e.b);
          if (shared && Math.hypot(c.x - shared.x, c.y - shared.y) < rings.get(shared)) continue;
          if (hidden(c.x, c.y, A.e) || hidden(c.x, c.y, B.e)) continue;
          xs.push(c);
          if (c.ang < SHALLOW) problems.push({ x: c.x, y: c.y, kind: 'shallow', a: A.i, b: B.i });
        }
      const explained = (x, y, gap) => xs.some((c) => Math.hypot(c.x - x, c.y - y) < (gap / Math.sin((Math.max(c.ang, SHALLOW) * Math.PI) / 180)) * 1.15);
      let last = null;
      for (const sa of A.samples) {
        for (const sb of B.samples) {
          const d = Math.hypot(sa.x - sb.x, sa.y - sb.y);
          // Round a shared letter, ends are spaced by the letter's own gap; elsewhere, the open gap.
          const both = sa.end && sa.end === sb.end;
          const gap = both ? NEAR_END : GAP;
          if (d >= gap) continue;
          if (explained(sa.x, sa.y, gap)) continue;
          const kind = sa.head || sb.head ? 'head' : 'overlap';
          if (last && Math.hypot(last.x - sa.x, last.y - sa.y) < 30) continue; // one mark per stretch
          last = { x: (sa.x + sb.x) / 2, y: (sa.y + sb.y) / 2, kind, a: A.i, b: B.i, d };
          problems.push(last);
          break;
        }
      }
    }
  return { problems, gap: GAP };
}

function box(pts, pad) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) (x0 = Math.min(x0, x)), (y0 = Math.min(y0, y)), (x1 = Math.max(x1, x)), (y1 = Math.max(y1, y));
  return [x0 - pad, y0 - pad, x1 + pad, y1 + pad];
}

function cross(p, q, r, s) {
  const rx = q[0] - p[0], ry = q[1] - p[1], sx = s[0] - r[0], sy = s[1] - r[1];
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-9) return null;
  const t = ((r[0] - p[0]) * sy - (r[1] - p[1]) * sx) / den, u = ((r[0] - p[0]) * ry - (r[1] - p[1]) * rx) / den;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  const ang = (Math.acos(Math.min(1, Math.abs(rx * sx + ry * sy) / (Math.hypot(rx, ry) * Math.hypot(sx, sy)))) * 180) / Math.PI;
  return { x: p[0] + rx * t, y: p[1] + ry * t, ang };
}
