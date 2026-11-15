// The line's geometry: vectors, cubic segments, corners rounded as circular arcs written as one
// cubic, and L-shaped meetings merged into one path. Shared by the Variable Kanji piece and,
// through scripts/sen-specimen.mjs, inlined into the curves and tester artifacts.

// ———————————————————————————— vectors
const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const len = (a) => Math.hypot(a[0], a[1]);
const unit = (a) => { const n = len(a) || 1; return [a[0] / n, a[1] / n]; };
const dist = (a, b) => len(sub(a, b));
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const perp = (a) => [-a[1], a[0]];
const hash = (x, y) => { const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return s - Math.floor(s); };

// ———————————————————————————— strokes as segments (lines and cubics)
function parse(d) {
  const t = d.match(/[MLCZ]|-?\d+(?:\.\d+)?/g);
  const segs = [];
  let cur = null;
  let closed = false;
  for (let i = 0; i < t.length; ) {
    const c = t[i++];
    if (c === 'M') cur = [+t[i++], +t[i++]];
    else if (c === 'L') { const q = [+t[i++], +t[i++]]; segs.push({ c: false, p: [cur, q] }); cur = q; }
    else if (c === 'C') { const a = [+t[i++], +t[i++]]; const b = [+t[i++], +t[i++]]; const e = [+t[i++], +t[i++]]; segs.push({ c: true, p: [cur, a, b, e] }); cur = e; }
    else if (c === 'Z') closed = true;
  }
  return { segs, closed };
}
const bez = (p, t) => { const s = 1 - t; return add(add(mul(p[0], s * s * s), mul(p[1], 3 * s * s * t)), add(mul(p[2], 3 * s * t * t), mul(p[3], t * t * t))); };
function split(p, t) {
  const a = lerp(p[0], p[1], t), b = lerp(p[1], p[2], t), c = lerp(p[2], p[3], t);
  const d = lerp(a, b, t), e = lerp(b, c, t), f = lerp(d, e, t);
  return [[p[0], a, d, f], [f, e, c, p[3]]];
}
function segLen(s) {
  if (!s.c) return dist(s.p[0], s.p[1]);
  let L = 0, prev = s.p[0];
  for (let k = 1; k <= 24; k++) { const q = bez(s.p, k / 24); L += dist(prev, q); prev = q; }
  return L;
}
/** Parameter at which the arc length from the start reaches `target`. */
function paramAt(s, target) {
  let L = 0, prev = s.p[0];
  for (let k = 1; k <= 64; k++) {
    const q = bez(s.p, k / 64), step = dist(prev, q);
    if (L + step >= target) return (k - 1 + (target - L) / (step || 1)) / 64;
    L += step; prev = q;
  }
  return 1;
}
const startTan = (s) => unit(sub(s.c ? (dist(s.p[1], s.p[0]) > 0.5 ? s.p[1] : s.p[2]) : s.p[1], s.p[0]));
const endTan = (s) => (s.c ? unit(sub(s.p[3], dist(s.p[2], s.p[3]) > 0.5 ? s.p[2] : s.p[1])) : unit(sub(s.p[1], s.p[0])));
function trimEnd(s, t) {
  if (!s.c) return { ...s, p: [s.p[0], add(s.p[1], mul(unit(sub(s.p[0], s.p[1])), t))] };
  return { ...s, p: split(s.p, paramAt(s, segLen(s) - t))[0] };
}
function trimStart(s, t) {
  if (!s.c) return { ...s, p: [add(s.p[0], mul(unit(sub(s.p[1], s.p[0])), t)), s.p[1]] };
  return { ...s, p: split(s.p, paramAt(s, t))[1] };
}

/** The arc joining segment a's end to segment b's start, with both trimmed back. */
function corner(s, nx, r) {
  const u = endTan(s), v = startTan(nx);
  const phi = Math.acos(Math.max(-1, Math.min(1, dot(u, v))));
  if (phi < (25 * Math.PI) / 180) return null; // only real corners
  const half = Math.tan(Math.min(phi, 3.0) / 2);
  const t = Math.min(r * half, segLen(s) * 0.48, segLen(nx) * 0.48);
  if (t < 10) return null; // too short to round without a crowd of points
  const rr = t / half;
  const a = trimEnd(s, t), b = trimStart(nx, t);
  const A = a.p.at(-1), B = b.p[0];
  const k = (4 / 3) * Math.tan(phi / 4) * rr;
  return { a, b, arc: { c: true, fillet: true, p: [A, add(A, mul(endTan(a), k)), sub(B, mul(startTan(b), k)), B] } };
}

/** Rounds every corner with a circular arc of radius r, written as one cubic. */
function fillet(st, r) {
  if (!r) return st;
  const segs = st.segs.map((s) => ({ c: s.c, p: s.p.map((q) => q.slice()) }));
  const out = [];
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i], nx = segs[i + 1];
    if (!nx) { out.push(s); break; }
    const k = corner(s, nx, r);
    if (!k) { out.push(s); continue; }
    out.push(k.a, k.arc);
    segs[i + 1] = k.b;
  }
  // A closed path also turns where it closes.
  if (st.closed && out.length > 1) {
    const k = corner(out.at(-1), out[0], r);
    if (k) { out[out.length - 1] = k.a; out[0] = k.b; out.push(k.arc); }
  }
  return { ...st, segs: out };
}

const ptAt = (s, t) => (s.c ? bez(s.p, t) : lerp(s.p[0], s.p[1], t));
const reverseSegs = (segs) => segs.slice().reverse().map((s) => ({ ...s, p: s.p.slice().reverse() }));
function splitSeg(s, t) {
  if (s.c) { const [a, b] = split(s.p, t); return [{ c: true, p: a }, { c: true, p: b }]; }
  const m = lerp(s.p[0], s.p[1], t);
  return [{ c: false, p: [s.p[0], m] }, { c: false, p: [m, s.p[1]] }];
}
/** Where on a stroke a point lies: segment, parameter, distance, arc length from the start. */
function locate(st, P, skip = () => false) {
  let best = null, acc = 0;
  st.segs.forEach((s, si) => {
    const n = s.c ? 48 : 64, L = segLen(s);
    for (let j = 0; j <= n; j++) {
      const t = j / n, at = acc + L * t;
      if (skip(at)) continue;
      const d = dist(ptAt(s, t), P);
      if (!best || d < best.d) best = { si, t, d, at };
    }
    acc += L;
  });
  return best && { ...best, total: acc };
}
function cutAt(st, si, t) {
  const [h, k] = splitSeg(st.segs[si], t);
  const head = [...st.segs.slice(0, si), h].filter((s) => segLen(s) > 0.5);
  const tail = [k, ...st.segs.slice(si + 1)].filter((s) => segLen(s) > 0.5);
  return [head, tail];
}

/**
 * Turns L-shaped meetings into corners. Where a stroke's joined end lands on another
 * stroke within `reach` of that stroke's end, the overshoot is cut and the two become
 * one path with a corner, which fillet() can round. A path that meets itself closes.
 */
function mergeCorners(strokes, reach = 90) {
  let list = strokes.map((s) => ({ ...s }));
  for (let guard = 0; guard < 40; guard++) {
    let done = true;
    for (const A of list) {
      if (A.closed) continue;
      for (const atEnd of [false, true]) {
        const k = atEnd ? 1 : 0;
        if (!A.joined[k]) continue;
        const P = atEnd ? A.segs.at(-1).p.at(-1) : A.segs[0].p[0];
        // Meeting itself: the far end of the same path, near its end.
        const own = locate(A, P, (at) => (atEnd ? at > segTotal(A) - 60 : at < 60));
        if (own && own.d < 10 && segTotal(A) > 300 && !(atEnd ? A.segs.at(-1).c : A.segs[0].c)) {
          const far = atEnd ? own.at : own.total - own.at;
          if (far < reach) {
            // The end lands near the start (or the start near the end): drop the overshoot, close the loop.
            const [head, tail] = cutAt(A, own.si, own.t);
            A.segs = atEnd ? tail : head;
            A.closed = true;
            A.joined = [false, false];
            done = false;
            break;
          }
        }
        let best = null;
        for (const B of list) {
          if (B === A || B.closed) continue;
          const l = locate(B, P);
          if (l && l.d < 10 && (!best || l.d < best.l.d)) best = { B, l };
        }
        if (!best) continue;
        const { B, l } = best;
        const nearStart = l.at < l.total - l.at;
        if (Math.min(l.at, l.total - l.at) > reach) continue;
        // Only an L of two real strokes, running within 20° of square where they meet,
        // becomes a corner (a dot touching a bar, or a diagonal, stays apart).
        if (segTotal(A) < 60 || segTotal(B) < 60) continue;
        const aSeg = atEnd ? A.segs.at(-1) : A.segs[0];
        const da = atEnd ? endTan(aSeg) : startTan(aSeg);
        const db = startTan(splitSeg(B.segs[l.si], Math.min(0.999, Math.max(0.001, l.t)))[1]);
        if (Math.abs(dot(da, db)) > Math.cos((70 * Math.PI) / 180)) continue;
        const [head, tail] = cutAt(B, l.si, l.t);
        const keep = nearStart ? tail : reverseSegs(head);
        const aSegs = atEnd ? A.segs : reverseSegs(A.segs);
        const merged = { segs: [...aSegs, ...keep], closed: false, joined: [atEnd ? A.joined[0] : A.joined[1], nearStart ? B.joined[1] : B.joined[0]] };
        list = [...list.filter((s) => s !== A && s !== B), merged];
        done = false;
        break;
      }
      if (!done) break;
    }
    if (done) break;
  }
  return list;
}
const segTotal = (st) => st.segs.reduce((t, s) => t + segLen(s), 0);

export { parse, fillet, mergeCorners, segLen, trimStart, trimEnd, dot, endTan, startTan, bez };
