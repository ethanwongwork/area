// Placing a whole web at once. Given a passage, every letter it uses becomes a point and
// every pair of letters that follow each other becomes an arrow. The letters are then placed
// so the web reads cleanly: arrows long enough to carry a head, as few crossings as
// possible, no arrow passing close to a letter it doesn't join, letters evenly apart, and
// the web filling the square evenly. A line that passes another letter breaks at that
// letter's clearing, so passing close costs most. Pure geometry, no DOM; the review bakes its results.

const W = 1080;
const MARGIN = 92; // letter centres stay this far inside the square
const BEND = (22 * Math.PI) / 180; // the same bend the drawing uses
const CLEAR_R = 74; // a line this close to a letter it doesn't join breaks at the letter's clearing
const COVER = 140; // every part of the square has a letter within this
const FAN = 26; // degrees: any two arrow ends at one letter at least this far apart, so each has room

/** Letters and arrows of a passage. Letters run on across word spaces; nothing crosses a full stop. */
export function webOf(text) {
  const letters = new Set();
  const edges = new Map();
  for (const sentence of text.match(/[^.?!]+[.?!]?/g) ?? []) {
    const ls = [...sentence.toUpperCase()].filter((c) => /[A-Z]/.test(c));
    ls.forEach((l, i) => {
      letters.add(l);
      if (i) edges.set(ls[i - 1] + l, (edges.get(ls[i - 1] + l) ?? 0) + 1);
    });
  }
  return { letters: [...letters], edges: [...edges.keys()].map((k) => [k[0], k[1]]) };
}

function random(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rot = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

/** The arrow from a to b, roughly as drawn, as a few points (ends trimmed). */
function arc(a, b, n = 6) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const d = [dx / L, dy / L];
  const v = rot(d, -BEND), u = rot(d, BEND);
  const g = 34;
  const P0 = [a[0] + v[0] * g, a[1] + v[1] * g];
  const P3 = [b[0] - u[0] * g, b[1] - u[1] * g];
  const span = Math.hypot(P3[0] - P0[0], P3[1] - P0[1]);
  const hl = (span / (2 * Math.sin(BEND))) * (4 / 3) * Math.tan(BEND / 2);
  const P1 = [P0[0] + v[0] * hl, P0[1] + v[1] * hl], P2 = [P3[0] - u[0] * hl, P3[1] - u[1] * hl];
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, s = 1 - t;
    pts.push([s * s * s * P0[0] + 3 * s * s * t * P1[0] + 3 * s * t * t * P2[0] + t * t * t * P3[0], s * s * s * P0[1] + 3 * s * s * t * P1[1] + 3 * s * t * t * P2[1] + t * t * t * P3[1]]);
  }
  return pts;
}

function crosses(p, q) {
  let n = 0;
  for (let i = 1; i < p.length; i++)
    for (let j = 1; j < q.length; j++) {
      const a = p[i - 1], b = p[i], c = q[j - 1], d = q[j];
      const rx = b[0] - a[0], ry = b[1] - a[1], sx = d[0] - c[0], sy = d[1] - c[1];
      const den = rx * sy - ry * sx;
      if (Math.abs(den) < 1e-9) continue;
      const t = ((c[0] - a[0]) * sy - (c[1] - a[1]) * sx) / den;
      const u = ((c[0] - a[0]) * ry - (c[1] - a[1]) * rx) / den;
      if (t > 0 && t < 1 && u > 0 && u < 1) n++;
    }
  return n;
}

const box = (pts) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) (x0 = Math.min(x0, x)), (y0 = Math.min(y0, y)), (x1 = Math.max(x1, x)), (y1 = Math.max(y1, y));
  return [x0, y0, x1, y1];
};

/** What a placement costs; lower reads better. Returns the parts too, for reporting. */
export function cost(pos, letters, edges, { fanWeight = 6 } = {}) {
  const lines = edges.filter(([a, b]) => a !== b).map(([a, b]) => ({ a, b, pts: arc(pos[a], pos[b]) }));
  for (const l of lines) l.box = box(l.pts);
  let length = 0, short = 0, crossing = 0, near = 0, crowd = 0;
  for (const l of lines) {
    const d = Math.hypot(pos[l.b][0] - pos[l.a][0], pos[l.b][1] - pos[l.a][1]);
    length += d;
    if (d < 260) short += (260 - d) ** 2;
  }
  for (let i = 0; i < lines.length; i++)
    for (let j = i + 1; j < lines.length; j++) {
      const p = lines[i], q = lines[j];
      if (p.a === q.a || p.a === q.b || p.b === q.a || p.b === q.b) continue; // they meet at a letter
      if (p.box[0] > q.box[2] || q.box[0] > p.box[2] || p.box[1] > q.box[3] || q.box[1] > p.box[3]) continue;
      crossing += crosses(p.pts, q.pts);
    }
  for (const l of lines)
    for (const k of letters) {
      if (k === l.a || k === l.b) continue;
      const c = pos[k];
      if (c[0] < l.box[0] - 60 || c[0] > l.box[2] + 60 || c[1] < l.box[1] - 60 || c[1] > l.box[3] + 60) continue;
      let m = Infinity;
      for (let i = 1; i < l.pts.length; i++) m = Math.min(m, segDist(c, l.pts[i - 1], l.pts[i]));
      if (m < CLEAR_R) near += CLEAR_R - m;
    }
  for (let i = 0; i < letters.length; i++)
    for (let j = i + 1; j < letters.length; j++) {
      const d = Math.hypot(pos[letters[i]][0] - pos[letters[j]][0], pos[letters[i]][1] - pos[letters[j]][1]);
      if (d < 210) crowd += (210 - d) ** 2;
    }
  // Even cover: no stretch of the square far from every letter.
  let cover = 0;
  for (let i = 0; i < 6; i++)
    for (let j = 0; j < 6; j++) {
      const gx = MARGIN + ((W - 2 * MARGIN) * (i + 0.5)) / 6, gy = MARGIN + ((W - 2 * MARGIN) * (j + 0.5)) / 6;
      let d = Infinity;
      for (const k of letters) d = Math.min(d, Math.hypot(pos[k][0] - gx, pos[k][1] - gy));
      if (d > COVER) cover += (d - COVER) ** 2;
    }
  // Room round each letter: the directions its arrows leave and arrive (with their bend), sorted
  // round the letter; two closer than FAN would crowd, so the drawing would have to push them
  // apart and their lines would bend into each other.
  let fan = 0;
  const ends = new Map(letters.map((k) => [k, []]));
  for (const l of lines) {
    const a = pos[l.a], b = pos[l.b];
    const d = Math.atan2(b[1] - a[1], b[0] - a[0]);
    ends.get(l.a).push(d - BEND); // leaving, turned by the bend
    ends.get(l.b).push(d + BEND + Math.PI); // arriving, seen from the letter
  }
  for (const list of ends.values()) {
    if (list.length < 2) continue;
    const as = list.map((x) => ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)).sort((p, q) => p - q);
    for (let i = 0; i < as.length; i++) {
      const g = ((((i + 1 < as.length ? as[i + 1] : as[0] + 2 * Math.PI) - as[i]) * 180) / Math.PI);
      if (g < FAN) fan += (FAN - g) ** 2;
    }
  }
  const all = box(letters.map((k) => pos[k]));
  const fill = Math.max(0, W - 2 * MARGIN - 40 - (all[2] - all[0])) + Math.max(0, W - 2 * MARGIN - 40 - (all[3] - all[1]));
  const total = length * 0.25 + short * 0.08 + crossing * 220 + near * 45 + crowd * 0.3 + fill * 3 + cover * 0.6 + fan * fanWeight;
  return { total, crossing, near, short, fan };
}

function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}

/**
 * Places the letters: simulated annealing over moves and swaps, then fine nudges.
 * Returns { pos, report }.
 */
export function place(letters, edges, { seed = 1, iters = 9000, fanWeight = 6 } = {}) {
  const rng = random(seed);
  const lo = MARGIN, hi = W - MARGIN;
  const inside = (p) => [Math.min(hi, Math.max(lo, p[0])), Math.min(hi, Math.max(lo, p[1]))];
  const pos = {};
  for (const k of letters) pos[k] = [lo + rng() * (hi - lo), lo + rng() * (hi - lo)];
  let cur = cost(pos, letters, edges, { fanWeight }).total;
  let best = { ...pos }, bestCost = cur;
  for (let i = 0; i < iters; i++) {
    const T = 400 * (1 - i / iters) ** 2 + 0.5;
    const span = 420 * (1 - i / iters) + 12;
    const k = letters[Math.floor(rng() * letters.length)];
    const old = pos[k];
    let other = null, oldOther = null;
    if (rng() < 0.25) {
      other = letters[Math.floor(rng() * letters.length)];
      oldOther = pos[other];
      pos[k] = oldOther;
      pos[other] = old;
    } else pos[k] = inside([old[0] + (rng() - 0.5) * span, old[1] + (rng() - 0.5) * span]);
    const c = cost(pos, letters, edges, { fanWeight }).total;
    if (c < cur || rng() < Math.exp((cur - c) / T)) {
      cur = c;
      if (c < bestCost) (bestCost = c), (best = Object.fromEntries(letters.map((l) => [l, [...pos[l]]])));
    } else {
      pos[k] = old;
      if (other) pos[other] = oldOther;
    }
  }
  const report = cost(best, letters, edges, { fanWeight });
  for (const k of letters) best[k] = best[k].map((v) => Math.round(v));
  return { pos: best, report };
}
