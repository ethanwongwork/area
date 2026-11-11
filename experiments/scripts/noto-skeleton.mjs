// Centrelines from Noto Sans JP: the stroke skeletons for Sen's curved cut.
// Noto Sans JP © Google LLC, SIL Open Font License 1.1 (https://openfontlicense.org). The derived
// data in e/kanji-lines/noto-*.json is shared under the same licence.
//
//   node scripts/noto-skeleton.mjs <NotoSansJP[wght].ttf> [chars]
//
// Writes e/kanji-lines/noto-strokes.json: for each character, its strokes as cubic Bézier
// paths on a 1000-unit em (y down, 0 = the em's top), each end marked free or joined.
//
// The method, per glyph, at Noto's Thin instance (strokes 30 units wide):
//   1. Outline. Noto draws strokes as overlapping shapes; each shape (with its holes) is
//      one group.
//   2. Skeleton. Each group is filled into a bitmap at 2 units a pixel and thinned
//      (Zhang–Suen) to a one-pixel line.
//   3. Graph. The line becomes nodes (ends, junctions) and edges. Spurs shorter than a
//      stroke width are pruned; junctions closer than a stroke width are merged.
//   4. Junctions. Each edge is trimmed back from its junction, where thinning bends it,
//      and its direction is fitted beyond that. Edges that continue each other (within
//      35°) are joined through the junction; an edge that stops there ends exactly on the
//      line of the stroke it meets.
//   5. Ends. A free end is extended along its direction to the tip of Noto's outline. If
//      that tip lies inside another stroke, the end is joined to that stroke instead.
//   6. Curves. Each path is split at its corners (a turn of more than 40° within 18 units,
//      rebuilt as the meeting point of the straight runs either side). Each piece is then
//      drawn with as few points as fit within 5 units of Noto's smoothed line: one curve,
//      then straight runs as lines, then one more point at a time, on a level or upright
//      extreme where there is one. Curves are Hobby's (METAFONT's): curvature continuous
//      through every smooth point; a lone curve between two set directions takes its handle
//      lengths from the data, never past where the directions meet. No curve may dip past
//      its ends without a point there, or S-bend where Noto's line does not.
//   7. Joints. Every joined end is moved onto the centreline of the stroke it meets. With
//      flat (butt) ends and one line width for every stroke, an end on a centreline is
//      covered by that stroke's ink at any weight: nothing gaps and nothing pokes through.
import * as fontkit from 'fontkit';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { COPY, TITLE } from '../e/kanji-lines/copy.js';

const [fontPath, only, outName = 'noto-strokes.json'] = process.argv.slice(2);
if (!fontPath) throw new Error('Pass the Noto Sans JP variable font.');
const font = fontkit.openSync(fontPath).getVariation({ wght: 100 });

const TOP = 880; // the ideographic em runs from 880 down to -120 in Noto's units
const S = 2; // font units per pixel
const WT = 30; // Noto Thin's stroke width
const PAD = 3;
const DEMO = ['字', '線', '語', '書'];

// ———————————————————————————— geometry helpers

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const norm = (a) => Math.hypot(a[0], a[1]);
const unit = (a) => {
  const n = norm(a) || 1;
  return [a[0] / n, a[1] / n];
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** Intersection of lines p + t·d and q + s·e, or null when parallel. */
function meet(p, d, q, e) {
  const den = cross(d, e);
  if (Math.abs(den) < 1e-6) return null;
  const t = cross(sub(q, p), e) / den;
  return add(p, mul(d, t));
}

/** Principal direction of points (total least squares), oriented along `hint`. */
function fitDir(pts, hint) {
  if (pts.length < 2) return unit(hint);
  const c = pts.reduce((s, p) => add(s, p), [0, 0]).map((v) => v / pts.length);
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (const p of pts) {
    const d = sub(p, c);
    sxx += d[0] * d[0];
    sxy += d[0] * d[1];
    syy += d[1] * d[1];
  }
  const a = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  const d = [Math.cos(a), Math.sin(a)];
  return dot(d, hint) < 0 ? mul(d, -1) : d;
}

const pathLen = (pts) => pts.slice(1).reduce((s, p, i) => s + dist(p, pts[i]), 0);

/** Points of a polyline within [from, to] units of arc length from its start. */
function stretch(pts, from, to) {
  const out = [];
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    if (i) s += dist(pts[i], pts[i - 1]);
    if (s >= from && s <= to) out.push(pts[i]);
    if (s > to) break;
  }
  return out;
}

function pointInPolys(p, polys) {
  let inside = false;
  for (const poly of polys) {
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i];
      const [xj, yj] = poly[j];
      if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
}

/** Nearest forward hit of the ray p + t·d (t > 0) on the polygons' edges. */
function rayHit(p, d, polys, maxT) {
  let best = null;
  for (const poly of polys) {
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[j];
      const e = sub(poly[i], a);
      const den = cross(d, e);
      if (Math.abs(den) < 1e-9) continue;
      const t = cross(sub(a, p), e) / den;
      const u = cross(sub(a, p), d) / den;
      if (t > 0 && t < maxT && u >= 0 && u <= 1 && (!best || t < best)) best = t;
    }
  }
  return best;
}

// ———————————————————————————— 1. outlines

function outlines(glyph) {
  const polys = [];
  let cur = null;
  let at = [0, 0];
  const P = (x, y) => [x, TOP - y];
  for (const { command, args } of glyph.path.commands) {
    if (command === 'moveTo') {
      cur = [P(...args)];
      polys.push(cur);
      at = cur[0];
    } else if (command === 'lineTo') {
      at = P(...args);
      cur.push(at);
    } else if (command === 'quadraticCurveTo') {
      const c = P(args[0], args[1]);
      const e = P(args[2], args[3]);
      for (let k = 1; k <= 8; k++) {
        const t = k / 8;
        cur.push(lerp2(lerp2(at, c, t), lerp2(c, e, t), t));
      }
      at = e;
    } else if (command === 'bezierCurveTo') {
      const c1 = P(args[0], args[1]);
      const c2 = P(args[2], args[3]);
      const e = P(args[4], args[5]);
      for (let k = 1; k <= 10; k++) {
        const t = k / 10;
        const a = lerp2(lerp2(at, c1, t), lerp2(c1, c2, t), t);
        const b = lerp2(lerp2(c1, c2, t), lerp2(c2, e, t), t);
        cur.push(lerp2(a, b, t));
      }
      at = e;
    }
  }
  const area = (p) => p.reduce((s, q, i) => s + cross(p[(i + p.length - 1) % p.length], q), 0) / 2;
  const withArea = polys.filter((p) => p.length > 2).map((p) => ({ p, a: area(p) }));
  if (!withArea.length) return [];
  const outerSign = Math.sign(withArea.reduce((m, x) => (Math.abs(x.a) > Math.abs(m.a) ? x : m)).a);
  const outers = withArea.filter((x) => Math.sign(x.a) === outerSign).map((x) => ({ polys: [x.p], a: Math.abs(x.a) }));
  for (const h of withArea.filter((x) => Math.sign(x.a) !== outerSign)) {
    const host = outers.filter((o) => pointInPolys(h.p[0], [o.polys[0]])).sort((m, n) => m.a - n.a)[0];
    if (host) host.polys.push(h.p);
  }
  return outers.map((o) => o.polys);
}

// ———————————————————————————— 2. skeleton

function rasterize(polys) {
  const xs = polys.flat().map((p) => p[0]);
  const ys = polys.flat().map((p) => p[1]);
  const x0 = Math.min(...xs) - PAD * S;
  const y0 = Math.min(...ys) - PAD * S;
  const w = Math.ceil((Math.max(...xs) - x0) / S) + PAD * 2;
  const h = Math.ceil((Math.max(...ys) - y0) / S) + PAD * 2;
  const img = new Uint8Array(w * h);
  for (let j = 0; j < h; j++) {
    const y = y0 + (j + 0.5) * S;
    const hits = [];
    for (const poly of polys) {
      for (let i = 0, k = poly.length - 1; i < poly.length; k = i++) {
        const [xa, ya] = poly[k];
        const [xb, yb] = poly[i];
        if (ya > y !== yb > y) hits.push(xa + ((y - ya) * (xb - xa)) / (yb - ya));
      }
    }
    hits.sort((a, b) => a - b);
    for (let n = 0; n + 1 < hits.length; n += 2) {
      const a = Math.max(0, Math.ceil((hits[n] - x0) / S - 0.5));
      const b = Math.min(w - 1, Math.floor((hits[n + 1] - x0) / S - 0.5));
      for (let i = a; i <= b; i++) img[j * w + i] = 1;
    }
  }
  return { img, w, h, x0, y0 };
}

function thin({ img, w, h }) {
  const at = (x, y) => img[y * w + x];
  let changed = true;
  while (changed) {
    changed = false;
    for (const step of [0, 1]) {
      const del = [];
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          if (!at(x, y)) continue;
          const p = [at(x, y - 1), at(x + 1, y - 1), at(x + 1, y), at(x + 1, y + 1), at(x, y + 1), at(x - 1, y + 1), at(x - 1, y), at(x - 1, y - 1)];
          const B = p.reduce((s, v) => s + v, 0);
          if (B < 2 || B > 6) continue;
          let A = 0;
          for (let i = 0; i < 8; i++) if (!p[i] && p[(i + 1) % 8]) A++;
          if (A !== 1) continue;
          const [p2, , p4, , p6, , p8] = p;
          if (step === 0 ? p2 * p4 * p6 || p4 * p6 * p8 : p2 * p4 * p8 || p2 * p6 * p8) continue;
          del.push(y * w + x);
        }
      }
      for (const i of del) img[i] = 0;
      if (del.length) changed = true;
    }
  }
}

// ———————————————————————————— 3. graph

const N8 = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

function graph(r) {
  const { img, w, h, x0, y0 } = r;
  const on = (i) => img[i] === 1;
  const nb = (i) => {
    const x = i % w;
    const y = (i / w) | 0;
    const out = [];
    for (const [dx, dy] of N8) {
      const X = x + dx;
      const Y = y + dy;
      if (X >= 0 && Y >= 0 && X < w && Y < h && img[Y * w + X]) out.push(Y * w + X);
    }
    return out;
  };
  const U = (i) => [x0 + ((i % w) + 0.5) * S, y0 + (((i / w) | 0) + 0.5) * S];

  // Node pixels: ends and branch points. Neighbouring node pixels form one node.
  const pix = [];
  for (let i = 0; i < img.length; i++) if (on(i)) pix.push(i);
  const isNode = new Set(pix.filter((i) => nb(i).length !== 2));
  // Absorb pixels whose every neighbour is a node pixel (tiny loops in branch points).
  let grew = true;
  while (grew) {
    grew = false;
    for (const i of pix) if (!isNode.has(i) && nb(i).every((j) => isNode.has(j))) isNode.add(i), (grew = true);
  }
  const nodeOf = new Map();
  const nodes = [];
  for (const i of isNode) {
    if (nodeOf.has(i)) continue;
    const id = nodes.length;
    const members = [];
    const stack = [i];
    nodeOf.set(i, id);
    while (stack.length) {
      const k = stack.pop();
      members.push(k);
      for (const j of nb(k)) if (isNode.has(j) && !nodeOf.has(j)) nodeOf.set(j, id), stack.push(j);
    }
    const c = members.map(U).reduce((s, p) => add(s, p), [0, 0]).map((v) => v / members.length);
    nodes.push({ id, p: c, edges: [] });
  }

  const edges = [];
  const seen = new Set();
  const addEdge = (a, b, pts) => {
    const e = { id: edges.length, a, b, pts };
    edges.push(e);
    nodes[a].edges.push(e);
    if (b !== a) nodes[b].edges.push(e);
  };
  for (const n of nodes) {
    const members = [...nodeOf].filter(([, id]) => id === n.id).map(([i]) => i);
    for (const m of members) {
      for (const first of nb(m)) {
        if (isNode.has(first) || seen.has(first)) continue;
        const pts = [n.p];
        let prev = m;
        let cur = first;
        let end = null;
        while (true) {
          seen.add(cur);
          pts.push(U(cur));
          const ns = nb(cur).filter((j) => j !== prev);
          const hit = ns.find((j) => isNode.has(j) && !(nodeOf.get(j) === n.id && pts.length < 3));
          if (hit !== undefined) {
            end = nodeOf.get(hit);
            break;
          }
          const step = ns.find((j) => !isNode.has(j) && !seen.has(j));
          if (step === undefined) {
            end = n.id;
            break;
          }
          prev = cur;
          cur = step;
        }
        pts.push(nodes[end].p);
        addEdge(n.id, end, pts);
      }
    }
  }
  // Loops with no node at all (。).
  const loops = [];
  for (const i of pix) {
    if (isNode.has(i) || seen.has(i)) continue;
    const pts = [];
    let prev = -1;
    let cur = i;
    while (cur !== undefined && !seen.has(cur)) {
      seen.add(cur);
      pts.push(U(cur));
      const next = nb(cur).find((j) => j !== prev && !seen.has(j));
      prev = cur;
      cur = next;
    }
    if (pts.length > 6) loops.push(pts);
  }
  return { nodes, edges, loops };
}

/** The other node of an edge, and its points oriented away from node n. */
const outward = (e, n) => (e.a === n.id ? e.pts : e.pts.slice().reverse());
const other = (e, n) => (e.a === n.id ? e.b : e.a);

function simplify(g) {
  const { nodes } = g;
  let edges = g.edges;
  const alive = (e) => !e.dead;
  const deg = (n) => n.edges.filter(alive).length;
  let changed = true;
  while (changed) {
    changed = false;
    // Prune spurs: short edges from a branch point to a free end.
    for (const e of edges) {
      if (e.dead) continue;
      const A = nodes[e.a];
      const B = nodes[e.b];
      const L = pathLen(e.pts);
      const spur = (end, base) => deg(end) === 1 && deg(base) >= 3 && L < WT * 0.8;
      if (spur(A, B) || spur(B, A)) (e.dead = true), (changed = true);
    }
    // Merge branch points joined by a short edge.
    for (const e of edges) {
      if (e.dead || e.a === e.b) continue;
      const A = nodes[e.a];
      const B = nodes[e.b];
      if (deg(A) >= 3 && deg(B) >= 3 && pathLen(e.pts) < WT * 1.1) {
        e.dead = true;
        A.p = lerp2(A.p, B.p, 0.5);
        for (const f of B.edges) {
          if (f.dead) continue;
          if (f.a === B.id) f.a = A.id;
          if (f.b === B.id) f.b = A.id;
          A.edges.push(f);
        }
        B.edges = [];
        changed = true;
      }
    }
    // A node left with two edges joins them into one.
    for (const n of nodes) {
      const live = n.edges.filter(alive);
      if (live.length !== 2 || live[0] === live[1]) continue;
      const [e, f] = live;
      const pe = outward(e, n).slice().reverse(); // ends at n
      const pf = outward(f, n);
      const merged = { id: edges.length, a: other(e, n), b: other(f, n), pts: [...pe.slice(0, -1), ...pf.slice(1)] };
      e.dead = f.dead = true;
      n.edges = [];
      edges = [...edges, merged];
      nodes[merged.a].edges.push(merged);
      if (merged.b !== merged.a) nodes[merged.b].edges.push(merged);
      changed = true;
      break;
    }
  }
  g.edges = edges.filter(alive);
  for (const n of nodes) n.edges = n.edges.filter(alive);
  return g;
}

// ———————————————————————————— 4. junctions → paths

const TRIM = WT * 1.4;

function paths(g) {
  const { nodes, edges } = g;
  // For each edge end: the trimmed points and where it goes next.
  const ends = new Map(); // `${edge.id}:${0|1}` → { link?, joinPoint?, joinTo? }
  const trimmed = new Map(edges.map((e) => [e.id, e.pts.slice()]));
  const cuts = new Map();
  for (const n of nodes) {
    if (n.edges.length < 3) continue;
    const arms = n.edges.map((e) => {
      const which = e.a === n.id ? 0 : 1;
      const pts = outward(e, n);
      const L = pathLen(pts);
      const cut = Math.min(TRIM, L * 0.45);
      const rest = stretch(pts, cut, Infinity);
      const dir = fitDir(stretch(pts, cut, cut + WT * 2.2), sub(pts.at(-1), pts[0]));
      return { e, which, rest, q: rest[0] ?? pts.at(-1), dir };
    });
    // Pair arms that continue each other.
    const pairs = [];
    const used = new Set();
    const cand = [];
    for (let i = 0; i < arms.length; i++) for (let j = i + 1; j < arms.length; j++) cand.push([i, j, -dot(arms[i].dir, arms[j].dir)]);
    cand.sort((m, n) => n[2] - m[2]);
    for (const [i, j, s] of cand) {
      if (s < Math.cos((35 * Math.PI) / 180) || used.has(i) || used.has(j)) continue;
      used.add(i), used.add(j), pairs.push([i, j]);
    }
    if (!pairs.length) {
      // A Y with no straight pair: let the two most nearly continuing arms pass through.
      const [i, j, s] = cand[0];
      if (s > 0.2) used.add(i), used.add(j), pairs.push([i, j]);
    }
    for (const [i, j] of pairs) {
      const a = arms[i];
      const b = arms[j];
      ends.set(`${a.e.id}:${a.which}`, { link: `${b.e.id}:${b.which}` });
      ends.set(`${b.e.id}:${b.which}`, { link: `${a.e.id}:${a.which}` });
    }
    arms.forEach((arm, k) => {
      setTrim(trimmed, arm);
      if (used.has(k)) return;
      // A stem: it ends on the nearest through line.
      let best = null;
      for (const [i, j] of pairs) {
        const through = sub(arms[j].q, arms[i].q);
        const hit = meet(arm.q, mul(arm.dir, -1), arms[i].q, unit(through));
        if (hit && (!best || dist(hit, arm.q) < best.d)) best = { d: dist(hit, arm.q), hit, to: arms[i].e.id };
      }
      ends.set(`${arm.e.id}:${arm.which}`, best ? { joinPoint: best.hit, joinEdge: best.to } : { joinPoint: n.p });
    });
  }

  function setTrim(map, arm) {
    // How many points this end loses: `rest` is the run kept beyond the trim.
    if (arm.rest.length < 2) return;
    const cut = arm.e.pts.length - arm.rest.length;
    cuts.set(`${arm.e.id}:${arm.which}`, cut);
  }
  for (const e of edges) {
    const a = cuts.get(`${e.id}:0`) ?? 0;
    const b = cuts.get(`${e.id}:1`) ?? 0;
    const n = e.pts.length;
    trimmed.set(e.id, a + b < n - 1 ? e.pts.slice(a, n - b) : e.pts.slice(Math.min(a, n - 2), Math.max(n - b, Math.min(a, n - 2) + 2)));
  }

  // Walk edges into paths.
  const out = [];
  const done = new Set();
  const walk = (startKey) => {
    const pts = [];
    const info = { start: null, end: null, edges: [] };
    let key = startKey;
    let closed = false;
    while (true) {
      const [id, w] = key.split(':').map(Number);
      if (done.has(id)) {
        closed = true;
        break;
      }
      done.add(id);
      info.edges.push(id);
      let seg = trimmed.get(id);
      if (w === 1) seg = seg.slice().reverse();
      const startEnd = ends.get(key);
      if (!pts.length) {
        if (startEnd?.joinPoint) pts.push(startEnd.joinPoint);
        info.start = startEnd?.joinPoint ? { joined: true, edge: startEnd.joinEdge } : { joined: false };
      }
      pts.push(...seg);
      const outKey = `${id}:${1 - w}`;
      const e = ends.get(outKey);
      if (e?.link) {
        key = e.link;
        continue;
      }
      if (e?.joinPoint) pts.push(e.joinPoint);
      info.end = e?.joinPoint ? { joined: true, edge: e.joinEdge } : { joined: false };
      break;
    }
    return { pts: dedupe(pts), closed, ...info };
  };
  for (const e of edges) {
    for (const w of [0, 1]) {
      const key = `${e.id}:${w}`;
      if (done.has(e.id) || ends.get(key)?.link) continue;
      out.push(walk(key));
    }
  }
  for (const e of edges) if (!done.has(e.id)) out.push(walk(`${e.id}:0`)); // closed chains
  for (const loop of g.loops) out.push({ pts: loop, closed: true, start: { joined: false }, end: { joined: false }, edges: [] });
  return out;
}

function dedupe(pts) {
  return pts.filter((p, i) => !i || dist(p, pts[i - 1]) > 0.5);
}

// ———————————————————————————— 6. curves

function resample(pts, step, closed) {
  const L = pathLen(closed ? [...pts, pts[0]] : pts);
  const n = Math.max(2, Math.round(L / step));
  const src = closed ? [...pts, pts[0]] : pts;
  const out = [];
  let i = 0;
  let acc = 0;
  for (let k = 0; k <= n; k++) {
    const target = (L * k) / n;
    while (i < src.length - 2 && acc + dist(src[i], src[i + 1]) < target) acc += dist(src[i], src[i + 1]), i++;
    const seg = dist(src[i], src[i + 1]) || 1;
    out.push(lerp2(src[i], src[i + 1], Math.min(1, (target - acc) / seg)));
  }
  if (closed) out.pop();
  return out;
}

function smooth(pts, closed, passes = 2) {
  let p = pts;
  for (let k = 0; k < passes; k++) {
    p = p.map((q, i) => {
      if (!closed && (i === 0 || i === p.length - 1)) return q;
      const a = p[(i - 1 + p.length) % p.length];
      const b = p[(i + 1) % p.length];
      return [(a[0] + 2 * q[0] + b[0]) / 4, (a[1] + 2 * q[1] + b[1]) / 4];
    });
  }
  return p;
}

function rdpIdx(pts, eps, lo = 0, hi = pts.length - 1, out = new Set([0, pts.length - 1])) {
  let max = 0;
  let at = -1;
  const a = pts[lo];
  const b = pts[hi];
  const L = dist(a, b) || 1e-9;
  for (let i = lo + 1; i < hi; i++) {
    const d = Math.abs(cross(sub(b, a), sub(pts[i], a))) / L;
    if (d > max) (max = d), (at = i);
  }
  if (max > eps) {
    out.add(at);
    rdpIdx(pts, eps, lo, at, out);
    rdpIdx(pts, eps, at, hi, out);
  }
  return out;
}

/** Splits at corners; each corner is rebuilt as the meeting point of the fitted directions on either side. */
function corners(pts) {
  // A corner is where the line turns more than 40° within 18 units either side: a bend
  // tighter than any curve Sen draws smooth (the template rounds it at one radius).
  const K = 9;
  const turnAt = (i) => Math.acos(Math.max(-1, Math.min(1, dot(unit(sub(pts[i], pts[i - K])), unit(sub(pts[i + K], pts[i]))))));
  const idx = [];
  for (let i = K; i < pts.length - K; i++) {
    const t = turnAt(i);
    if (t < (40 * Math.PI) / 180) continue;
    if ((i > K && turnAt(i - 1) > t) || (i + 1 < pts.length - K && turnAt(i + 1) >= t)) continue;
    if (idx.length && i - idx.at(-1) < K * 2) continue;
    idx.push(i);
  }
  const cs = [];
  for (const i of idx) {
    const b = pts[i];
    const before = pts.slice(0, i + 1).reverse();
    const after = pts.slice(i);
    // Noto rounds some bends: step back past the round until both sides run straight.
    for (const gap of [12, 18, 24, 30, 38, 46, 56]) {
      const pb = stretch(before, gap, gap + 36);
      const pa = stretch(after, gap, gap + 36);
      if (pb.length < 2 || pa.length < 2) break;
      const db = fitDir(pb, sub(pb[0], pb.at(-1)));
      const da = fitDir(pa, sub(pa.at(-1), pa[0]));
      // Both sides straight here, and still heading the same way further on (not mid-bend).
      if (Math.max(maxDev(pb, pb[0], pb.at(-1)), maxDev(pa, pa[0], pa.at(-1))) > 1.5) continue;
      const fb = stretch(before, gap + 18, gap + 54);
      const fa = stretch(after, gap + 18, gap + 54);
      if (fb.length >= 2 && dot(db, fitDir(fb, sub(fb[0], fb.at(-1)))) < Math.cos((4 * Math.PI) / 180)) continue;
      if (fa.length >= 2 && dot(da, fitDir(fa, sub(fa.at(-1), fa[0]))) < Math.cos((4 * Math.PI) / 180)) continue;
      const corner = meet(pb[0], db, pa[0], da);
      if (!corner || dist(corner, b) > 20 + gap) continue;
      cs.push({ i, corner, cutB: indexAtArc(before, gap), cutA: indexAtArc(after, gap) });
      break;
    }
  }
  // Build pieces: each piece runs between corners, with the chamfer replaced by the corner point.
  if (!cs.length) return [pts];
  const pieces = [];
  let start = 0;
  let head = null;
  for (const c of cs) {
    const endAt = c.i - c.cutB;
    const piece = [...(head ? [head] : []), ...pts.slice(start, Math.max(start + 1, endAt) + 1), c.corner];
    pieces.push(piece);
    head = c.corner;
    start = c.i + c.cutA;
  }
  pieces.push([head, ...pts.slice(Math.min(start, pts.length - 1))]);
  return pieces.map(dedupe).filter((p) => p.length >= 2);
}

function indexAtArc(pts, s) {
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    acc += dist(pts[i], pts[i - 1]);
    if (acc >= s) return i;
  }
  return pts.length - 1;
}

// Schneider, "An Algorithm for Automatically Fitting Digitized Curves", Graphics Gems (1990).
function fitCubics(d, err, t1, t2) {
  if (d.length === 2) {
    const L = dist(d[0], d[1]) / 3;
    return [[d[0], add(d[0], mul(t1, L)), add(d[1], mul(t2, L)), d[1]]];
  }
  let u = chordParams(d);
  let bez = generate(d, u, t1, t2);
  let [maxErr, split] = maxError(d, bez, u);
  if (maxErr < err) return [bez];
  if (maxErr < err * 4) {
    for (let k = 0; k < 20; k++) {
      u = u.map((ui, i) => newton(bez, d[i], ui));
      bez = generate(d, u, t1, t2);
      [maxErr, split] = maxError(d, bez, u);
      if (maxErr < err) return [bez];
    }
  }
  split = Math.max(1, Math.min(d.length - 2, split));
  const tc = snapAxis(unit(sub(d[Math.max(0, split - 3)], d[Math.min(d.length - 1, split + 3)])));
  return [...fitCubics(d.slice(0, split + 1), err, t1, tc), ...fitCubics(d.slice(split), err, mul(tc, -1), t2)];
}
function chordParams(d) {
  const u = [0];
  for (let i = 1; i < d.length; i++) u.push(u[i - 1] + dist(d[i], d[i - 1]));
  return u.map((x) => x / u.at(-1));
}
const B = (b, t) => {
  const s = 1 - t;
  return add(add(mul(b[0], s * s * s), mul(b[1], 3 * s * s * t)), add(mul(b[2], 3 * s * t * t), mul(b[3], t * t * t)));
};
function generate(d, u, t1, t2) {
  const first = d[0];
  const last = d.at(-1);
  let c00 = 0;
  let c01 = 0;
  let c11 = 0;
  let x0 = 0;
  let x1 = 0;
  u.forEach((t, i) => {
    const s = 1 - t;
    const b0 = s * s * s;
    const b1 = 3 * s * s * t;
    const b2 = 3 * s * t * t;
    const b3 = t * t * t;
    const A1 = mul(t1, b1);
    const A2 = mul(t2, b2);
    c00 += dot(A1, A1);
    c01 += dot(A1, A2);
    c11 += dot(A2, A2);
    const tmp = sub(d[i], add(mul(first, b0 + b1), mul(last, b2 + b3)));
    x0 += dot(A1, tmp);
    x1 += dot(A2, tmp);
  });
  const det = c00 * c11 - c01 * c01;
  let a1 = det ? (x0 * c11 - x1 * c01) / det : 0;
  let a2 = det ? (c00 * x1 - c01 * x0) / det : 0;
  const L = dist(first, last);
  if (a1 < L * 1e-3 || a2 < L * 1e-3) a1 = a2 = L / 3;
  return [first, add(first, mul(t1, a1)), add(last, mul(t2, a2)), last];
}
function maxError(d, bez, u) {
  let max = 0;
  let at = (d.length / 2) | 0;
  d.forEach((p, i) => {
    const e = dist(B(bez, u[i]), p);
    if (e > max) (max = e), (at = i);
  });
  return [max, at];
}
function newton(b, p, t) {
  const d1 = [mul(sub(b[1], b[0]), 3), mul(sub(b[2], b[1]), 3), mul(sub(b[3], b[2]), 3)];
  const d2 = [mul(sub(d1[1], d1[0]), 2), mul(sub(d1[2], d1[1]), 2)];
  const q = sub(B(b, t), p);
  const s = 1 - t;
  const q1 = add(add(mul(d1[0], s * s), mul(d1[1], 2 * s * t)), mul(d1[2], t * t));
  const q2 = add(mul(d2[0], s), mul(d2[1], t));
  const den = dot(q1, q1) + dot(q, q2);
  if (!den) return t;
  return Math.max(0, Math.min(1, t - dot(q, q1) / den));
}

const LEVEL = Math.sin((3 * Math.PI) / 180);

/** Cubic pieces → segments: near-straight cubics as lines, near-level or plumb lines set exactly. */
function segments(cubics) {
  const segs = cubics.map((b) => {
    const chord = sub(b[3], b[0]);
    const L = norm(chord) || 1;
    const off = (p) => Math.abs(cross(chord, sub(p, b[0]))) / L;
    return off(b[1]) < 1.5 && off(b[2]) < 1.5 ? { line: true, p: [b[0], b[3]] } : { line: false, p: b };
  });
  // Merge consecutive collinear lines.
  const merged = [];
  for (const s of segs) {
    const last = merged.at(-1);
    if (last?.line && s.line) {
      const d1 = unit(sub(last.p[1], last.p[0]));
      const d2 = unit(sub(s.p[1], s.p[0]));
      if (dot(d1, d2) > Math.cos((2 * Math.PI) / 180)) {
        last.p[1] = s.p[1];
        continue;
      }
    }
    merged.push({ line: s.line, p: s.p.map((q) => q.slice()) });
  }
  // Share points between neighbours, then square up lines.
  for (let i = 1; i < merged.length; i++) merged[i].p[0] = merged[i - 1].p.at(-1);
  for (const s of merged) {
    if (!s.line) continue;
    const [a, b] = s.p;
    const L = dist(a, b) || 1;
    if (Math.abs(b[1] - a[1]) / L < LEVEL) a[1] = b[1] = (a[1] + b[1]) / 2;
    else if (Math.abs(b[0] - a[0]) / L < LEVEL) a[0] = b[0] = (a[0] + b[0]) / 2;
  }
  return merged;
}

// The fitting is drawn the way a type designer places points: a straight run is one line;
// a curve gets an on-curve point only where it turns exactly level or upright (its
// extremes), with the handles there set level or upright too, and is otherwise one cubic
// per span, split again only if it strays more than FIT units from the smoothed line.
const FIT = 4;

/** Gaussian smoothing on points 2 units apart; open ends stay put. */
function gauss(pts, sigma, closed = false) {
  const r = Math.ceil((sigma * 2.5) / 2);
  const w = Array.from({ length: r + 1 }, (_, k) => Math.exp(-((k * 2) ** 2) / (2 * sigma * sigma)));
  const n = pts.length;
  return pts.map((p, i) => {
    const reach = closed ? r : Math.min(r, i, n - 1 - i);
    let sx = 0, sy = 0, sw = 0;
    for (let k = -reach; k <= reach; k++) {
      const q = pts[(i + k + n) % n];
      sx += q[0] * w[Math.abs(k)];
      sy += q[1] * w[Math.abs(k)];
      sw += w[Math.abs(k)];
    }
    return [sx / sw, sy / sw];
  });
}
function maxDev(pts, a, b) {
  const L = dist(a, b) || 1e-9;
  let m = 0;
  for (const q of pts) m = Math.max(m, Math.abs(cross(sub(b, a), sub(q, a))) / L);
  return m;
}
/** Sets a direction exactly level or upright when it is within `tol` degrees of one. */
function snapAxis(t, tol = 5) {
  const s = Math.sin((tol * Math.PI) / 180);
  if (Math.abs(t[1]) < s) return [Math.sign(t[0]) || 1, 0];
  if (Math.abs(t[0]) < s) return [0, Math.sign(t[1]) || 1];
  return t;
}
const tanAt = (p, i, span = 5) => unit(sub(p[Math.min(p.length - 1, i + span)], p[Math.max(0, i - span)]));
/** How far from the start a polyline stays straight (within tol), as an index. */
function straightRun(p, tol) {
  let k = 1;
  let misses = 0;
  for (let j = 2; j < p.length; j++) {
    if (maxDev(p.slice(0, j + 1), p[0], p[j]) <= tol) (k = j), (misses = 0);
    else if (++misses > 6) break;
  }
  return k;
}

/** One smooth run (no corners) of points 2 units apart → segments. */
function fitRun(p, t0, t1, closed = false) {
  // Extremes: where the direction passes through level or upright.
  const splits = [];
  const n = p.length;
  const d = p.map((_, i) => tanAt(p, i));
  // A sign change counts only when the direction holds it for 10 samples (20 units) either side.
  const mean = (a, b, k) => {
    let t = 0;
    for (let j = a; j < b; j++) t += d[j][k];
    return t / (b - a);
  };
  const H = 10;
  for (let i = H; i < n - H; i++) {
    let axis = null;
    for (const k of [0, 1]) {
      const before = mean(i - H, i, k);
      const after = mean(i, i + H, k);
      if (Math.sign(before) !== Math.sign(after) && Math.abs(before) > 0.06 && Math.abs(after) > 0.06 && Math.sign(d[i - 1][k]) !== Math.sign(d[i][k])) {
        const o = 1 - k; // the other component sets the direction of travel
        axis = k === 0 ? [0, Math.sign(d[i][1])] : [Math.sign(d[i][0]), 0];
        if (Math.abs(d[i][o]) < 0.5) axis = null;
      }
    }
    if (!axis) continue;
    if (splits.length && i - splits.at(-1).i < 15) continue;
    splits.push({ i, t: axis });
  }
  const nodes = [{ i: 0, t: t0 }, ...splits, { i: n - 1, t: t1 }];
  const out = [];
  for (let k = 0; k + 1 < nodes.length; k++) {
    const a = nodes[k], b = nodes[k + 1];
    out.push(...fitCubics(p.slice(a.i, b.i + 1), FIT, a.t, mul(b.t, -1)).map((c) => ({ line: false, p: c })));
  }
  return out;
}

/** One cubic through pts with the given end directions, if it stays within tol; else null. */
function fitOne(pts, t0, t1, tol) {
  if (pts.length < 3) return null;
  let u = chordParams(pts);
  let c = generate(pts, u, t0, t1);
  for (let k = 0; k < 16; k++) {
    u = u.map((ui, j) => newton(c, pts[j], ui));
    c = generate(pts, u, t0, t1);
  }
  return maxError(pts, c, u)[0] < tol ? c : null;
}

// ———— Hobby's curves (Hobby 1986; Knuth, METAFONT: The Program §§274–276, tension 1).
// Through given points and end directions, Hobby solves for the direction at each interior
// point so that the curvature is continuous through it, and sets each handle's length from
// the angles alone. The curves are as smooth as the points allow, with no handle tuned by
// hand or by least squares.
const ang = (v) => Math.atan2(v[1], v[0]);
const wrapA = (a) => Math.atan2(Math.sin(a), Math.cos(a));
const rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
function velocity(t, f) {
  const st = Math.sin(t), sf = Math.sin(f), ct = Math.cos(t), cf = Math.cos(f);
  const num = 2 + Math.SQRT2 * (st - sf / 16) * (sf - st / 16) * (ct - cf);
  const den = 3 * (1 + 0.5 * (Math.sqrt(5) - 1) * ct + 0.5 * (3 - Math.sqrt(5)) * cf);
  return Math.min(num / den, 1);
}
function solve(A, b) {
  const n = b.length;
  const M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = 0; r < n; r++) {
      if (r === c || !M[c][c]) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((r, i) => r[n] / (r[i] || 1));
}
/** Cubics through knots z with the travel direction fixed at both ends. */
function hobby(z, t0, t1) {
  const n = z.length - 1;
  const d = [];
  const c = [];
  for (let k = 0; k < n; k++) {
    const v = sub(z[k + 1], z[k]);
    d.push(norm(v) || 1e-6);
    c.push(ang(v));
  }
  const psi = [0];
  for (let k = 1; k < n; k++) psi.push(wrapA(c[k] - c[k - 1]));
  const theta = new Array(n).fill(0);
  theta[0] = wrapA(ang(t0) - c[0]);
  const phiN = wrapA(c[n - 1] - ang(t1));
  const m = n - 1;
  if (m > 0) {
    const A = Array.from({ length: m }, () => new Array(m).fill(0));
    const b = new Array(m).fill(0);
    for (let k = 1; k <= m; k++) {
      const r = k - 1;
      if (k === 1) b[r] -= theta[0] / d[0];
      else A[r][r - 1] += 1 / d[k - 1];
      A[r][r] += 2 / d[k - 1] + 2 / d[k];
      b[r] -= (2 * psi[k]) / d[k - 1];
      if (k + 1 < n) (A[r][r + 1] += 1 / d[k]), (b[r] -= psi[k + 1] / d[k]);
      else b[r] += phiN / d[k];
    }
    solve(A, b).forEach((v, i) => (theta[i + 1] = v));
  }
  const out = [];
  for (let k = 0; k < n; k++) {
    const th = theta[k];
    const ph = k + 1 < n ? wrapA(-psi[k + 1] - theta[k + 1]) : phiN;
    const u = mul(sub(z[k + 1], z[k]), 1 / d[k]);
    out.push([z[k], add(z[k], mul(rot(u, th), velocity(th, ph) * d[k])), sub(z[k + 1], mul(rot(u, -ph), velocity(ph, th) * d[k])), z[k + 1]]);
  }
  return out;
}

const TOL = 5; // how far a curve may stray from Noto's smoothed centreline, in units

/** Where a run turns exactly level or upright (held for 20 units either side), with that direction. */
function extremes(p) {
  const n = p.length;
  const d = p.map((_, i) => tanAt(p, i));
  const mean = (a, b, k) => {
    let t = 0;
    for (let j = a; j < b; j++) t += d[j][k];
    return t / (b - a);
  };
  const H = 10;
  const out = [];
  for (let i = H; i < n - H; i++) {
    for (const k of [0, 1]) {
      const before = mean(i - H, i, k);
      const after = mean(i, i + H, k);
      if (Math.sign(before) === Math.sign(after) || Math.abs(before) < 0.06 || Math.abs(after) < 0.06) continue;
      if (Math.sign(d[i - 1][k]) === Math.sign(d[i][k])) continue;
      const o = 1 - k;
      if (Math.abs(d[i][o]) < 0.5) continue;
      out.push({ i, t: k === 0 ? [0, Math.sign(d[i][1])] : [Math.sign(d[i][0]), 0] });
    }
  }
  return out;
}

/** Distance from each sample to a cubic: the worst, and where. */
function errOf(c, p, a, b) {
  const q = Array.from({ length: 81 }, (_, k) => B(c, k / 80));
  let max = 0;
  let at = a;
  for (let i = a; i <= b; i++) {
    let m = Infinity;
    for (let j = 0; j + 1 < q.length; j++) {
      const e = sub(q[j + 1], q[j]);
      const t = Math.max(0, Math.min(1, dot(sub(p[i], q[j]), e) / (dot(e, e) || 1)));
      m = Math.min(m, dist(p[i], add(q[j], mul(e, t))));
    }
    if (m > max) (max = m), (at = i);
  }
  return [max, at];
}

/**
 * A lone curve between two set directions takes its handle lengths from the data (least
 * squares, as a designer drags handles), kept between a third and 1.6× Hobby's and never
 * past the point where the two directions meet, so it cannot bulge or loop.
 */
function fitLengths(c, pts, t0, t1) {
  const back = mul(t1, -1);
  let u = chordParams(pts);
  let b = c;
  for (let k = 0; k < 6; k++) {
    b = generate(pts, u, t0, back);
    u = u.map((ui, j) => newton(b, pts[j], ui));
  }
  const hob = [dist(c[0], c[1]), dist(c[3], c[2])];
  // Where the two directions meet: c0 + s0·t0 = c3 − s1·t1.
  let lim = [Infinity, Infinity];
  const den = cross(t0, t1);
  if (Math.abs(den) > 1e-6) {
    const w = sub(c[3], c[0]);
    const s0 = cross(w, t1) / den;
    const s1 = cross(t0, w) / den;
    if (s0 > 0 && s1 > 0) lim = [s0 * 0.95, s1 * 0.95];
  }
  const len = [dist(b[0], b[1]), dist(b[3], b[2])].map((L, k) => Math.min(lim[k], Math.max(hob[k] / 3, Math.min(L, hob[k] * 1.6))));
  if (dot(sub(b[1], b[0]), t0) < 0) len[0] = hob[0];
  if (dot(sub(b[2], b[3]), back) < 0) len[1] = hob[1];
  return [c[0], add(c[0], mul(t0, len[0])), add(c[3], mul(back, len[1])), c[3]];
}

/** Knots (sample indices; t fixed for extremes and ends, null where Hobby chooses) → cubics. */
function hobbyKnots(p, knots) {
  const out = [];
  let s = 0;
  for (let k = 1; k < knots.length; k++) {
    if (!knots[k].t) continue;
    const run = knots.slice(s, k + 1);
    const cs = hobby(run.map((q) => q.at ?? p[q.i]), knots[s].t, knots[k].t);
    if (cs.length === 1 && knots[k].i - knots[s].i >= 6) cs[0] = fitLengths(cs[0], p.slice(knots[s].i, knots[k].i + 1), knots[s].t, knots[k].t);
    out.push(...cs);
    s = k;
  }
  return out;
}

/** A corner-free piece → as few segments as fit: a line, or Hobby's curve through the fewest points. */
function fitPiece(piece) {
  const raw = resample(piece, 2, false);
  if (raw.length < 3) return [{ line: true, p: [piece[0].slice(), piece.at(-1).slice()] }];
  const p = gauss(raw, 10);
  p[0] = piece[0].slice();
  p[p.length - 1] = piece.at(-1).slice();
  // A run that stays within TOL of its chord once smoothed is a line.
  if (maxDev(p, p[0], p.at(-1)) < TOL) return [{ line: true, p: [p[0], p.at(-1)] }];
  const last = p.length - 1;
  const W = Math.min(12, (last / 3) | 0);
  const tStart = snapAxis(unit(sub(p[W], p[0])), 6);
  const tEnd = snapAxis(unit(sub(p[last], p[last - W])), 6);
  // Through a point Hobby places, a curve may S-bend (handles either side of its chord) only
  // where Noto's line does: anything else is a wobble, however close it stays.
  const wobbles = (c, a, b) => {
    const ch = sub(c[3], c[0]);
    const L = norm(ch) || 1;
    const side = (q) => cross(ch, sub(q, c[0])) / L;
    const h1 = side(c[1]), h2 = side(c[2]);
    if (!(Math.abs(h1) > 0.5 && Math.abs(h2) > 0.5 && Math.sign(h1) !== Math.sign(h2))) return false;
    let lo = 0, hi = 0;
    for (let i = a; i <= b; i++) (lo = Math.min(lo, side(p[i]))), (hi = Math.max(hi, side(p[i])));
    return lo > -1.5 || hi < 1.5;
  };
  // Points at extremes: a curve may not run past both its ends, level or upright, between
  // its points (a dip or bulge with no point there).
  const overshoots = (c) => {
    for (const k of [0, 1]) {
      const a = c[1][k] - c[0][k], b = c[2][k] - c[1][k], d = c[3][k] - c[2][k];
      const A = a - 2 * b + d, Bq = 2 * (b - a), C = a;
      const roots = Math.abs(A) < 1e-9 ? (Math.abs(Bq) < 1e-9 ? [] : [-C / Bq]) : (() => {
        const disc = Bq * Bq - 4 * A * C;
        if (disc < 0) return [];
        const r = Math.sqrt(disc);
        return [(-Bq + r) / (2 * A), (-Bq - r) / (2 * A)];
      })();
      const lo = Math.min(c[0][k], c[3][k]) - 0.75, hi = Math.max(c[0][k], c[3][k]) + 0.75;
      for (const t of roots) {
        if (t <= 0.02 || t >= 0.98) continue;
        const v = B(c, t)[k];
        if (v < lo || v > hi) return true;
      }
    }
    return false;
  };
  const errors = (knots) => {
    let worst = -1, we = 0, wat = 0, bad = 0;
    hobbyKnots(p, knots).forEach((c, k) => {
      const [e, at] = errOf(c, p, knots[k].i, knots[k + 1].i);
      if (((!knots[k].t || !knots[k + 1].t) && wobbles(c, knots[k].i, knots[k + 1].i)) || overshoots(c)) bad++;
      if (e > we) (we = e), (worst = k), (wat = at);
    });
    return { worst: we > TOL || bad ? worst : -1, we: bad ? Math.max(we, TOL + bad) : we, wat };
  };
  // Straight runs: at the ends from 40 units, inside from 70 and straighter (else the flat
  // middle of a gentle sweep would count). Each becomes a line, joined tangent to its curves.
  const runs = [];
  {
    const lead = straightRun(p, 1.5);
    if (lead * 2 >= 40 && (last - lead) * 2 > 30) runs.push([0, lead]);
    const tail = last - straightRun(p.slice().reverse(), 1.5);
    let i = runs.length ? runs[0][1] + 8 : 8;
    while (i < tail - 8) {
      const j = i + straightRun(p.slice(i, tail - 8), 1.5);
      if ((j - i) * 2 >= 70) runs.push([i, j]), (i = j + 8);
      else i += 4;
    }
    if ((last - tail) * 2 >= 40 && (tail - (runs.at(-1)?.[1] ?? 0)) * 2 > 30) runs.push([tail, last]);
    // Neighbouring runs both set level (or both upright) are one line.
    for (let k = runs.length - 1; k > 0; k--) {
      const [a0, b0] = runs[k - 1], [a1, b1] = runs[k];
      const t0 = snapAxis(unit(sub(p[b0], p[a0])), 6), t1 = snapAxis(unit(sub(p[b1], p[a1])), 6);
      const axis = (t) => t[0] === 0 || t[1] === 0;
      if (a1 - b0 < 16 && axis(t0) && axis(t1) && dot(t0, t1) > 0.99) runs.splice(k - 1, 2, [a0, b1]);
    }
  }
  const addRun = (ks, [a, b]) => {
    const t = snapAxis(unit(sub(p[b], p[a])), 6);
    // A run set level or upright is drawn so before the curves are fitted to it.
    const pos = [p[a].slice(), p[b].slice()];
    for (const k of [0, 1]) if (t[k] === 0) pos[0][k] = pos[1][k] = (p[a][k] + p[b][k]) / 2;
    let out = ks.filter((k) => k.i <= a || k.i >= b || k.t).map((k) => ({ ...k }));
    [a, b].forEach((i, j) => {
      const at = out.findIndex((k) => k.i >= i);
      if (out[at].i === i) Object.assign(out[at], { t, ...(i === 0 || i === last ? {} : { at: pos[j] }) });
      else out.splice(at, 0, { i, t, at: pos[j] });
    });
    return out;
  };
  const ext = extremes(p);
  const addKnot = (ks, { worst, wat }) => {
    const a = ks[worst].i;
    const b = ks[worst + 1].i;
    if (b - a < 16) return null;
    // On an extreme when the span has one, else at the span's apex.
    const cand = ext.filter((e) => e.i > a + 6 && e.i < b - 6);
    let pick;
    if (cand.length) pick = cand.reduce((m, e) => (Math.abs(e.i - wat) < Math.abs(m.i - wat) ? e : m));
    else {
      let best = a + 1;
      let bd = -1;
      for (let i = a + 4; i <= b - 4; i++) {
        const dv = maxDev([p[i]], p[a], p[b]);
        if (dv > bd) (bd = dv), (best = i);
      }
      pick = { i: best, t: null };
    }
    const out = ks.map((k) => ({ ...k }));
    out.splice(worst + 1, 0, pick);
    return out;
  };
  // Fewest points first: one curve; then, step by step, whichever addition costs fewest
  // points (a run inside costs two, a run at an end or one more point costs one) and fits
  // best.
  let knots = [{ i: 0, t: tStart }, { i: last, t: tEnd }];
  const used = new Set();
  for (let iter = 0; iter < 8; iter++) {
    const cur = errors(knots);
    if (cur.worst < 0) break;
    const opts = [];
    runs.forEach((r, ri) => {
      if (used.has(ri)) return;
      const ks = addRun(knots, r);
      opts.push({ ks, ri, cost: ks.length - knots.length });
    });
    const k1 = addKnot(knots, cur);
    if (k1) opts.push({ ks: k1, cost: 1 });
    if (!opts.length) break;
    for (const o of opts) o.e = errors(o.ks).we;
    const fits = opts.filter((o) => o.e <= TOL).sort((x, y) => x.cost - y.cost || x.e - y.e);
    const pick = fits[0] ?? opts.sort((x, y) => x.e * (1 + 0.6 * (x.cost - 1)) - y.e * (1 + 0.6 * (y.cost - 1)))[0];
    knots = pick.ks;
    if (pick.ri != null) used.add(pick.ri);
  }
  return hobbyKnots(p, knots).map((c) => ({ line: false, p: c }));
}

function fitPath(path) {
  const { closed } = path;
  if (closed) {
    let p = gauss(resample(path.pts, 2, true), 8, true);
    // Start at the top, where the direction is level.
    const top = p.reduce((m, q, i) => (q[1] < p[m][1] ? i : m), 0);
    p = [...p.slice(top), ...p.slice(0, top), p[top]];
    const t = [Math.sign(p[3][0] - p[0][0]) || 1, 0];
    return { closed: true, segs: tidy(fitRun(p, t, t)) };
  }
  let pts = resample(path.pts, 2, false);
  if (pts.length < 2) return null;
  pts = smooth(pts, false, 2);
  const out = [];
  for (const piece of corners(pts)) out.push(...fitPiece(piece));
  return { closed: false, segs: tidy(out, false) };
}

/** Near-straight cubics → lines, collinear lines merged, points shared, lines and handles squared up. */
/** Points along a cubic, 2 units apart. */
function cubicPts(b) {
  const L = Math.max(8, Math.ceil(dist(b[0], b[3]) / 2));
  return Array.from({ length: L + 1 }, (_, k) => B(b, k / L));
}

/** Folds neighbouring cubics into one wherever one cubic still fits within FIT. */
function fold(items) {
  let list = items.slice();
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i + 1 < list.length; i++) {
      const a = list[i];
      const b = list[i + 1];
      if (a.line && b.line) continue;
      const asCubic = (q) => (q.line ? [q.p[0], lerp2(q.p[0], q.p[1], 1 / 3), lerp2(q.p[0], q.p[1], 2 / 3), q.p[1]] : q.p);
      const A = asCubic(a);
      const Bc = asCubic(b);
      const ta = unit(sub(A[3], A[2]));
      const tb = unit(sub(Bc[1], Bc[0]));
      if (dot(ta, tb) < Math.cos((6 * Math.PI) / 180)) continue; // a corner stays
      const pts = [...cubicPts(A), ...cubicPts(Bc).slice(1)];
      const c = fitOne(pts, unit(sub(A[1], A[0])), unit(sub(Bc[2], Bc[3])), FIT * 0.9);
      if (c) {
        list = [...list.slice(0, i), { line: false, p: c }, ...list.slice(i + 2)];
        changed = true;
        break;
      }
    }
  }
  return list;
}

function tidy(items, folding = true) {
  if (folding) items = fold(items);
  const segs = items.map((s) => {
    if (s.line) return s;
    const b = s.p;
    const chord = sub(b[3], b[0]);
    const L = norm(chord) || 1;
    const off = (q) => Math.abs(cross(chord, sub(q, b[0]))) / L;
    return off(b[1]) < 1.2 && off(b[2]) < 1.2 ? { line: true, p: [b[0], b[3]] } : s;
  });
  const merged = [];
  for (const s of segs) {
    const prev = merged.at(-1);
    if (prev?.line && s.line && dot(unit(sub(prev.p[1], prev.p[0])), unit(sub(s.p[1], s.p[0]))) > Math.cos((2 * Math.PI) / 180)) {
      prev.p[1] = s.p[1].slice();
      continue;
    }
    merged.push({ line: s.line, p: s.p.map((q) => q.slice()) });
  }
  for (let i = 1; i < merged.length; i++) merged[i].p[0] = merged[i - 1].p.at(-1);
  // Lines within 3° of level or upright are set so.
  for (const s of merged) {
    if (!s.line) continue;
    const [a, b] = s.p;
    const L = dist(a, b) || 1;
    if (Math.abs(b[1] - a[1]) / L < LEVEL) a[1] = b[1] = (a[1] + b[1]) / 2;
    else if (Math.abs(b[0] - a[0]) / L < LEVEL) a[0] = b[0] = (a[0] + b[0]) / 2;
  }
  // Handles: on the line they continue, else level or upright when within 5°.
  merged.forEach((s, i) => {
    if (s.line) return;
    const fix = (anchor, h, along) => {
      const v = sub(h, anchor);
      const L = norm(v);
      if (!L) return;
      let dir = unit(v);
      if (along && dot(dir, along) > Math.cos((12 * Math.PI) / 180)) dir = along;
      else dir = snapAxis(dir);
      const q = add(anchor, mul(dir, L));
      h[0] = q[0];
      h[1] = q[1];
    };
    const prev = merged[i - 1];
    const next = merged[i + 1];
    fix(s.p[0], s.p[1], prev?.line ? unit(sub(prev.p[1], prev.p[0])) : null);
    fix(s.p[3], s.p[2], next?.line ? unit(sub(next.p[0], next.p[1])) : null);
  });
  return merged;
}

// ———————————————————————————— 5 & 7. ends and joints

function endDir(pts, atEnd) {
  const run = atEnd ? pts.slice().reverse() : pts;
  const near = stretch(run, 0, WT * 1.5);
  return fitDir(near.length >= 2 ? near : run.slice(0, 2), sub(run[0], run[Math.min(run.length - 1, 3)]));
}

function sampleSegs(segs, n = 12) {
  const out = [];
  for (const s of segs) {
    if (s.line) out.push(s.p[0], s.p[1]);
    else for (let k = 0; k <= n; k++) out.push(B(s.p, k / n));
  }
  return out;
}

/** Where the ray p + t·d first crosses a polyline, or the nearest point on it. */
function onto(p, d, poly) {
  let best = null;
  for (let i = 0; i + 1 < poly.length; i++) {
    const a = poly[i];
    const e = sub(poly[i + 1], a);
    const den = cross(d, e);
    if (Math.abs(den) < 1e-9) continue;
    const t = cross(sub(a, p), e) / den;
    const u = cross(sub(a, p), d) / den;
    if (u >= -0.02 && u <= 1.02 && Math.abs(t) < WT * 2.5 && (!best || Math.abs(t) < Math.abs(best.t))) best = { t, q: add(p, mul(d, t)) };
  }
  if (best) return best.q;
  let near = null;
  for (let i = 0; i + 1 < poly.length; i++) {
    const a = poly[i];
    const e = sub(poly[i + 1], a);
    const t = Math.max(0, Math.min(1, dot(sub(p, a), e) / (dot(e, e) || 1)));
    const q = add(a, mul(e, t));
    if (!near || dist(q, p) < dist(near, p)) near = q;
  }
  return near;
}

function moveEnd(stroke, atEnd, q) {
  const segs = stroke.segs;
  if (!atEnd) {
    const s = segs[0];
    const delta = sub(q, s.p[0]);
    s.p[0] = q;
    if (!s.line) s.p[1] = add(s.p[1], delta);
  } else {
    const s = segs.at(-1);
    const n = s.p.length - 1;
    const delta = sub(q, s.p[n]);
    s.p[n] = q;
    if (!s.line) s.p[n - 1] = add(s.p[n - 1], delta);
  }
}

// ———————————————————————————— per glyph

function skeleton(ch) {
  const glyph = font.glyphForCodePoint(ch.codePointAt(0));
  const groups = outlines(glyph);
  const all = [];
  const pixels = [];
  groups.forEach((polys, gi) => {
    const r = rasterize(polys);
    thin(r);
    if (DEMO.includes(ch)) for (let i = 0; i < r.img.length; i++) if (r.img[i]) pixels.push([r.x0 + ((i % r.w) + 0.5) * S, r.y0 + (((i / r.w) | 0) + 0.5) * S].map((v) => Math.round(v)));
    const g = simplify(graph(r));
    for (const p of paths(g)) {
      if (pathLen(p.pts) < 6) continue;
      all.push({ ...p, group: gi, edgeIds: p.edges });
    }
  });

  // Even spacing first: junction trimming can leave long jumps between points.
  for (const s of all) s.pts = resample(s.pts, 2, s.closed);

  // 5. Free ends run on to the tip of the outline; a tip inside another stroke joins it.
  for (const s of all) {
    if (s.closed) continue;
    for (const atEnd of [false, true]) {
      const info = atEnd ? s.end : s.start;
      const end = atEnd ? s.pts.at(-1) : s.pts[0];
      if (info.joined) {
        info.target = all.find((o) => o !== s && o.group === s.group && o.edgeIds.includes(info.edge));
        continue;
      }
      // Thinning bends a line within half a stroke width of its tip: drop that, aim from
      // the stretch behind it, and run on to the outline.
      const run = atEnd ? s.pts.slice().reverse() : s.pts.slice();
      const L = pathLen(run);
      const drop = L > WT * 3 ? WT * 0.6 : 0;
      const kept = drop ? stretch(run, drop, Infinity) : run;
      const aim = stretch(run, drop, drop + WT * 1.6);
      const d = fitDir(aim.length >= 2 ? aim : run.slice(0, 2), sub(run[0], run[Math.min(run.length - 1, 4)]));
      const from = kept[0] ?? end;
      const t = rayHit(from, d, groups[s.group], WT * 3);
      const tip = t ? add(from, mul(d, t)) : end;
      const rebuilt = [tip, ...kept];
      s.pts = atEnd ? rebuilt.reverse() : rebuilt;
      const host = groups.findIndex((polys, gi) => gi !== s.group && pointInPolys(tip, polys));
      if (host >= 0) {
        // Ink touches another stroke here: join the nearest stroke of that shape.
        let best = null;
        for (const o of all) {
          if (o.group !== host) continue;
          const dd = Math.min(...o.pts.map((q) => dist(q, tip)));
          if (!best || dd < best.d) best = { d: dd, o };
        }
        if (best) Object.assign(info, { joined: true, target: best.o, cross: true });
      }
    }
  }

  // Two strokes that each end inside the other at one corner become one stroke with a corner.
  for (const s of all) {
    for (const atEnd of [false, true]) {
      const info = atEnd ? s.end : s.start;
      if (!info?.joined || !info.cross || s.dead) continue;
      const o = info.target;
      if (!o || o.dead || o.closed) continue;
      for (const oEnd of [false, true]) {
        const oi = oEnd ? o.end : o.start;
        if (!oi?.joined || oi.target !== s) continue;
        const p = atEnd ? s.pts.at(-1) : s.pts[0];
        const q = oEnd ? o.pts.at(-1) : o.pts[0];
        if (dist(p, q) > WT * 2) continue;
        // Only two real strokes meeting near square make a corner (not a dot touching a bar).
        if (pathLen(s.pts) < WT * 4 || pathLen(o.pts) < WT * 4) continue;
        if (Math.abs(dot(endDir(s.pts, atEnd), endDir(o.pts, oEnd))) > Math.cos((55 * Math.PI) / 180)) continue;
        const sp = atEnd ? s.pts : s.pts.slice().reverse(); // runs into the corner
        const op = oEnd ? o.pts.slice().reverse() : o.pts; // runs out of it
        const corner = meet(sp.at(-1), endDir(sp, true), op[0], endDir(op, false)) ?? lerp2(p, q, 0.5);
        const keepS = atEnd ? s.start : s.end;
        const keepO = oEnd ? o.start : o.end;
        s.pts = [...sp.slice(0, -1), corner, ...op.slice(1)];
        s.start = keepS;
        s.end = keepO;
        if (keepO?.target === s) keepO.target = s;
        o.dead = true;
        for (const x of all) for (const k of ['start', 'end']) if (x[k]?.target === o) x[k].target = s;
      }
    }
  }

  const live = all.filter((s) => !s.dead);
  const strokes = live.map((s) => ({ src: s, ...fitPath(s) })).filter((s) => s.segs?.length);

  // Hooks: a short last segment that turns back at a free end is cut, as are stubs.
  const segDir = (sg, atEnd) => (atEnd ? unit(sub(sg.p.at(-1), sg.p.at(-2))) : unit(sub(sg.p[1], sg.p[0])));
  const segLength = (sg) => (sg.line ? dist(sg.p[0], sg.p[1]) : pathLen(cubicPts(sg.p)));
  for (const st of strokes) {
    if (st.closed) continue;
    for (const atEnd of [true, false]) {
      const info = atEnd ? st.src.end : st.src.start;
      if (info?.joined) continue;
      while (st.segs.length >= 2) {
        const last = atEnd ? st.segs.at(-1) : st.segs[0];
        const prev = atEnd ? st.segs.at(-2) : st.segs[1];
        const L = segLength(last);
        const turn = Math.acos(Math.max(-1, Math.min(1, atEnd ? dot(segDir(prev, true), segDir(last, false)) : dot(segDir(last, true), segDir(prev, false)))));
        if (L < 14 || (L < 40 && turn > (45 * Math.PI) / 180)) {
          if (atEnd) st.segs.pop();
          else st.segs.shift();
        } else break;
      }
    }
  }

  // 7. Joined ends move onto the centreline of the stroke they meet.
  const bySrc = new Map(strokes.map((s) => [s.src, s]));
  for (let pass = 0; pass < 2; pass++) {
    for (const st of strokes) {
      if (st.closed) continue;
      for (const atEnd of [false, true]) {
        const info = atEnd ? st.src.end : st.src.start;
        if (!info?.joined) continue;
        const target = bySrc.get(info.target);
        if (!target || target === st) continue;
        const segs = st.segs;
        const s = atEnd ? segs.at(-1) : segs[0];
        const end = atEnd ? s.p.at(-1) : s.p[0];
        const prev = atEnd ? s.p.at(-2) : s.p[1];
        const d = unit(sub(end, prev));
        const q = onto(end, d, sampleSegs(target.segs));
        if (q && dist(q, end) < WT * 2.5) moveEnd(st, atEnd, q);
        info.on = true;
      }
    }
  }

  return {
    strokes: strokes.map((s) => ({
      closed: s.closed,
      joined: s.closed ? [false, false] : [!!s.src.start?.joined, !!s.src.end?.joined],
      d: toD(s.segs, s.closed),
    })),
    ...(DEMO.includes(ch) ? { pixels, raw: live.map((x) => x.pts.map((q) => q.map((v) => Math.round(v)))) } : {}),
    outline: groups.map((polys) => polys.map((poly) => `M${poly.map((p) => p.map((v) => +v.toFixed(1)).join(' ')).join('L')}Z`).join('')).join(''),
  };
}

const f1 = (v) => +v.toFixed(1);
function toD(segs, closed) {
  let d = `M${f1(segs[0].p[0][0])} ${f1(segs[0].p[0][1])}`;
  for (const s of segs) {
    if (s.line) d += `L${f1(s.p[1][0])} ${f1(s.p[1][1])}`;
    else d += `C${s.p.slice(1).map((q) => `${f1(q[0])} ${f1(q[1])}`).join(' ')}`;
  }
  return closed ? `${d}Z` : d;
}

// ———————————————————————————— run

const chars = only ? [...only] : [...new Set([...TITLE.join(''), ...COPY.join('')])];
const out = {};
for (const ch of chars) {
  try {
    out[ch] = skeleton(ch);
  } catch (e) {
    console.log(`${ch}: ${e.message}`);
  }
}
const file = resolve(import.meta.dirname, '../e/kanji-lines', outName);
writeFileSync(file, JSON.stringify(out));
console.log(`${Object.keys(out).length} glyphs, ${Object.values(out).reduce((n, g) => n + g.strokes.length, 0)} strokes → ${file}`);
