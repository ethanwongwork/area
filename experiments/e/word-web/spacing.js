// How evenly a web's lines are spaced. Samples every line every 5 units (away from the letters,
// whose ends are spaced by the engine) and scores:
//   crowd   share of the drawn length that runs near-parallel and close to another line
//           (under GAP apart, within 35°), weighted by how close and how parallel;
//   knot    places where more than 4 lines pass within one 44-unit cell;
//   reach   how near the middle the arrows come, as a share of the radius (petals need < 0.5).
const GAP = 40, CELL = 44, NEAR = 50;
export function spacing(web) {
  const nodes = [...web.nodes.values()];
  const mx = nodes.reduce((s, n) => s + n.x, 0) / nodes.length, my = nodes.reduce((s, n) => s + n.y, 0) / nodes.length;
  const R = nodes.reduce((s, n) => s + Math.hypot(n.x - mx, n.y - my), 0) / nodes.length;
  const rings = web.rings();
  const samples = [];
  let reach = Infinity, total = 0;
  web.edges.forEach((e, ei) => {
    const { pts } = web.curve(e);
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      const L = Math.hypot(x1 - x0, y1 - y0), m = Math.max(1, Math.round(L / 5));
      const t = [(x1 - x0) / (L || 1), (y1 - y0) / (L || 1)];
      for (let k = 0; k < m; k++) {
        const x = x0 + ((x1 - x0) * k) / m, y = y0 + ((y1 - y0) * k) / m;
        reach = Math.min(reach, Math.hypot(x - mx, y - my) / R);
        if (nodes.some((n) => Math.hypot(n.x - x, n.y - y) < rings.get(n) * 1.25)) continue;
        samples.push({ x, y, t, ei });
        total += L / m;
      }
    }
  });
  const grid = new Map(), cells = new Map();
  const key = (i, j) => i * 10000 + j;
  for (const s of samples) {
    const k = key(Math.floor(s.x / GAP), Math.floor(s.y / GAP));
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(s);
    const c = key(Math.floor(s.x / CELL), Math.floor(s.y / CELL));
    if (!cells.has(c)) cells.set(c, new Set());
    cells.get(c).add(s.ei);
  }
  let crowd = 0;
  for (const s of samples) {
    const gi = Math.floor(s.x / GAP), gj = Math.floor(s.y / GAP);
    let worst = 0;
    for (let a = -1; a <= 1; a++)
      for (let b = -1; b <= 1; b++)
        for (const q of grid.get(key(gi + a, gj + b)) ?? []) {
          if (q.ei === s.ei) continue;
          const d = Math.hypot(q.x - s.x, q.y - s.y);
          if (d >= GAP) continue;
          const ang = (Math.acos(Math.min(1, Math.abs(s.t[0] * q.t[0] + s.t[1] * q.t[1]))) * 180) / Math.PI;
          if (ang >= 35) continue;
          worst = Math.max(worst, ((GAP - d) / GAP) * (1 - ang / 35));
        }
    crowd += worst * 5;
  }
  let knot = 0;
  for (const set of cells.values()) if (set.size > 4) knot += (set.size - 4) ** 2;
  crowd /= total || 1;
  // Crossings: where every two arrows cross, and at what angle.
  const polys = web.edges.map((e) => web.curve(e).pts);
  const xs = [];
  for (let i = 0; i < polys.length; i++)
    for (let j = i + 1; j < polys.length; j++) {
      const P = polys[i], Q = polys[j];
      for (let a = 1; a < P.length; a++)
        for (let b = 1; b < Q.length; b++) {
          const [p0, p1] = [P[a - 1], P[a]], [q0, q1] = [Q[b - 1], Q[b]];
          const rx = p1[0] - p0[0], ry = p1[1] - p0[1], sx = q1[0] - q0[0], sy = q1[1] - q0[1];
          const den = rx * sy - ry * sx;
          if (Math.abs(den) < 1e-9) continue;
          const t = ((q0[0] - p0[0]) * sy - (q0[1] - p0[1]) * sx) / den, u = ((q0[0] - p0[0]) * ry - (q0[1] - p0[1]) * rx) / den;
          if (t < 0 || t > 1 || u < 0 || u > 1) continue;
          const ang = (Math.acos(Math.min(1, Math.abs(rx * sx + ry * sy) / (Math.hypot(rx, ry) * Math.hypot(sx, sy)))) * 180) / Math.PI;
          xs.push({ x: p0[0] + rx * t, y: p0[1] + ry * t, ang });
        }
    }
  let shallow = 0, sliver = 0, byLetter = 0;
  for (const c of xs) {
    if (c.ang < 35) shallow += (35 - c.ang) / 35;
    for (const n of nodes) {
      const d = Math.hypot(n.x - c.x, n.y - c.y), r = rings.get(n) * 2.4;
      if (d < r) byLetter += (r - d) / r;
    }
  }
  const nn = xs.map((c, i) => Math.min(Infinity, ...xs.filter((_, j) => j !== i).map((o) => Math.hypot(o.x - c.x, o.y - c.y))));
  for (const d of nn) if (d < NEAR) sliver += (NEAR - d) / NEAR;
  const finite = nn.filter(Number.isFinite), mean = finite.reduce((s, d) => s + d, 0) / (finite.length || 1);
  const even = finite.length ? Math.sqrt(finite.reduce((s, d) => s + (d - mean) ** 2, 0) / finite.length) / mean : 0;
  const per = Math.max(1, xs.length);
  const score = crowd * 60 + knot * 0.5 + (shallow / per) * 30 + (sliver / per) * 30 + (byLetter / nodes.length) * 10 + even * 8 + Math.max(0, reach - 0.5) * 200;
  return { crowd, knot, reach, crossings: xs.length, shallow: shallow / per, sliver: sliver / per, byLetter: byLetter / nodes.length, even, score };
}
