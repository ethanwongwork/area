// 5 Eddy. Six round rings of type nested about one centre, each tall at one end and small at
// the other (or tallest in the middle). The copy is laid flat once, in each ring at constant
// thickness; a WebGL vertex shader bends it onto its ring on every frame, with that frame's
// turn and profile, so a ring can turn, swell and swap its tall end without being set again.
import { Stack } from './engine.js';
import { COPY } from './copy.js';

// ── The rings ────────────────────────────────────────────────────────────────────────────
// Height profiles along a ring, u from its start (0) to its end (1); M is the small end's share.
const M = 0.28;
const SHAPES = [
  (u) => M + (1 - M) * u, // small → tall
  (u) => M + (1 - M) * Math.sin(Math.PI * u), // tallest in the middle
  (u) => M + (1 - M) * (1 - u), // tall → small
];
const shape = (w, u) => w[0] * SHAPES[0](u) + w[1] * SHAPES[1](u) + w[2] * SHAPES[2](u);
// Each ring keeps its words; its thickness is scaled so the same copy always fills it exactly
// (the harmonic mean of the thickness stays fixed). So the tallest point is this many times the
// ring's mean type size, at worst, through every blend from one profile to the next:
const harm = (w) => { let s = 0; for (let i = 0; i < 400; i++) s += 1 / shape(w, (i + 0.5) / 400); return 400 / s; };
let swell = 0;
for (const [a, b] of [[[1, 0, 0], [0, 1, 0]], [[0, 1, 0], [0, 0, 1]]]) for (let t = 0; t <= 1.0001; t += 0.05) { const w = a.map((x, i) => x * (1 - t) + b[i] * t); let mx = 0; for (let i = 0; i <= 200; i++) mx = Math.max(mx, shape(w, i / 200)); swell = Math.max(swell, mx / harm(w)); }

// Rings nested round one centre, each one gap outside the last at its tallest possible point.
const C = [0.4, 0.58], GAP = 0.02;
const groups = [
  { a0: 200, a1: 420, n: 2, sizes: [1, 0.45], h0: 0.045 },
  { a0: 60, a1: 250, n: 1, h0: 0.035 },
  { a0: 230, a1: 470, n: 3, sizes: [0.4, 1, 0.6], h0: 0.085 },
  { a0: 90, a1: 280, n: 1, h0: 0.03 },
  { a0: 200, a1: 420, n: 2, sizes: [1, 0.3], h0: 0.095 },
  { a0: 250, a1: 400, n: 3, sizes: [0.6, 0.3, 1], h0: 0.11 },
];
let r = 0.08, prev = 0;
const strands = groups.map((g) => { const p = g.h0 * swell; r += prev / 2 + p / 2 + (prev ? GAP : 0); prev = p; return { path: { type: 'arc', c: C, r, a0: g.a0, a1: g.a1 }, n: g.n, sizes: g.sizes, thick: g.h0 }; });

/** Black ground; each ring's ink runs from a pale cool grey at its start to a deeper one at its end. */
export const GROUND = '#000000';
export const INK = ['#cdd2d9', '#b7bec8', '#a2aab5', '#8f98a4', '#7d8794'];
export const GAP_PX = Math.round(GAP * 1080);
export const COMP = { type: 'field', lean: 14, bleed: true, strands };
const GD = { M, swell, ground: GROUND, palettes: { tone: INK } };
export const SWELL = swell;

// Instrument Serif, spaced 0.02 em: the serifs touch at the tightest ring otherwise.
const TRACK = 0.02;
let font = null, layout = null;
export function useFont(f) { font = f; layout = null; }
/** The copy laid flat in each ring at constant thickness, once. */
export const layoutOf = () => layout || (layout = Stack.build(font, COPY.toUpperCase(), { ...COMP, keepFlat: true, track: TRACK }));

// ── Shape along a ring ───────────────────────────────────────────────────────────────────
// A ring's height at u (0 = its start, 1 = its end): small→tall, tallest in the middle,
// tall→small, and a swell centred at p, width sigma, blended by w; m is the floor (smallest share).
const shapeAt = (q, m, u) => m + (1 - m) * (q.w[0] * u + q.w[1] * Math.sin(Math.PI * u) + q.w[2] * (1 - u) + q.w[3] * Math.exp(-(((u - q.p) / q.sigma) ** 2)));
// Where along the ring each share of the flat line lands (32 samples), the scale that keeps the
// same words filling the ring, and the floor, raised if needed so the tallest point never
// passes GD.swell times the ring's mean, the height the spacing between rings allows for.
function profileTable(q, h0) {
  const N = 256, cum = new Float64Array(N + 1);
  const fill = (m) => { let mx = 0; for (let i = 1; i <= N; i++) { const s = shapeAt(q, m, (i - 0.5) / N); mx = Math.max(mx, s); cum[i] = cum[i - 1] + 1 / s / N; } return mx * cum[N]; };
  let m = GD.M; const lim = GD.swell * 0.985; // a margin for peaks between samples
  if (fill(m) > lim) { let lo = m, hi = 0.95; for (let i = 0; i < 18; i++) { const mid = (lo + hi) / 2; if (fill(mid) > lim) lo = mid; else hi = mid; } m = hi; fill(m); }
  const total = cum[N], tbl = new Float32Array(32); let i = 0;
  for (let j = 0; j < 32; j++) { const target = (j / 31) * total; while (i < N - 1 && cum[i + 1] < target) i++; tbl[j] = (i + (target - cum[i]) / (cum[i + 1] - cum[i] || 1)) / N; }
  return { tbl, kappa: h0 * total, m };
}
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

// ── Choreography ─────────────────────────────────────────────────────────────────────────
// Each motion gives, for ring k at time t: its turn, its profile, its reveal and its shade.
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const quint = (x) => (x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2);
const cubic = (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
const sine = (x) => 0.5 - 0.5 * Math.cos(Math.PI * x);
const bell = (x) => (x <= 0 || x >= 1 ? 0 : 0.5 - 0.5 * Math.cos(2 * Math.PI * x)); // 0 → 1 → 0
const span = (t, start, dur) => clamp01((t - start) / dur);
const DEG = Math.PI / 180, dir = (k) => (k % 2 ? -1 : 1);
const base = () => ({ angle: 0, w: [0, 0, 0, 0], p: 0.5, sigma: 0.22, reveal: [-1, 2], shift: 0 });
const STATES = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0]];
const mixW = (a, b, e) => a.map((x, i) => x * (1 - e) + b[i] * e);
// Accents over a drift: a seeded schedule of beats, every 1.3 to 2.6 seconds, each moving one to
// three neighbouring rings a little apart in time. The schedule is fixed, so the page and a
// recording show the same moves at the same moments.
const expo = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 2 ** (20 * x - 10) / 2 : (2 - 2 ** (-20 * x + 10)) / 2);
function schedule(seed, gap, make, zoomFor) {
  let s = seed >>> 0; const rnd = () => { s += 0x6D2B79F5; let x = Math.imul(s ^ s >>> 15, 1 | s); x ^= x + Math.imul(x ^ x >>> 7, 61 | x); return ((x ^ x >>> 14) >>> 0) / 4294967296; };
  const rings = Array.from({ length: 6 }, () => []); rings.beats = [];
  for (let t = 0.8; t < 1800; t += gap[0] + rnd() * (gap[1] - gap[0])) {
    const n = rnd() < 0.5 ? 1 : rnd() < 0.7 ? 2 : 3, k0 = Math.floor(rnd() * 6); let end = t;
    for (let i = 0; i < n; i++) { const k = (k0 + i) % 6, e = { s: t + i * (0.1 + rnd() * 0.08), ...make(rnd, k) }; rings[k].push(e); end = Math.max(end, e.s + e.d); }
    rings.beats.push({ s: t, d: end - t });
  }
  // The camera: every beat moves it to a new zoom, alternating in and out (in: 1.3 to 1.9 times,
  // out: 0.78 to 1.1), over a short span at the beat's start, shorter than the gap to the next beat
  // so one zoom always lands before the next begins (a separate seed, so the moves stay put).
  let z = 1, s2 = (seed * 7919) >>> 0; const r2 = () => { s2 += 0x6D2B79F5; let x = Math.imul(s2 ^ s2 >>> 15, 1 | s2); x ^= x + Math.imul(x ^ x >>> 7, 61 | x); return ((x ^ x >>> 14) >>> 0) / 4294967296; };
  rings.beats.forEach((b, i) => { const next = rings.beats[i + 1]; b.from = z; z = z > 1.2 ? 0.78 + r2() * 0.32 : 1.3 + r2() * 0.6; b.to = z; b.zd = Math.min(zoomFor(b), (next ? next.s - b.s : 9) - 0.05); });
  return rings;
}
// Turns are set by distance along the ring, so an outer ring turns fewer degrees than an inner one
// for the same sweep, and no ring outruns the eye.
const arcDeg = (len, k) => Math.min(170, Math.max(15, (len / COMP.strands[k].path.r) * 180 / Math.PI));
const SNAPS = schedule(11, [0.7, 1.5], (rnd, k) => ({ d: 0.6 + rnd() * 0.35, amt: arcDeg(0.22 + rnd() * 0.26, k) * (rnd() < 0.75 ? dir(k) : -dir(k)), flip: rnd() < 0.6 }), () => 0.6);
const SURGES = schedule(29, [1.0, 1.8], (rnd, k) => ({ d: 1.4 + rnd() * 0.8, amt: arcDeg(0.35 + rnd() * 0.35, k) * dir(k), flip: rnd() < 0.35 }), (b) => Math.min(1.2, b.d));
// The camera's zoom at t: each beat eases from its start zoom to its end zoom with the beat's ease.
function zoomAt(events, ease, t) { let z = 1; for (const b of events.beats) { if (b.s > t) break; z = b.from + (b.to - b.from) * ease(span(t, b.s, b.zd)); } return z; }
// A ring on a drift, with its accents: extra turn eased by `ease`, and at a flip its tall end
// passes through a tall middle to the other end, eased the same way.
function accented(k, t, events, ease, drift, cycle = { breathe: 9, shift: 13 }) {
  // Flips add up: a ring picked again before its last flip lands carries on from where it is.
  const q = base(); let extra = 0, f = 0;
  for (const e of events[k]) { if (e.s > t) break; const x = ease(span(t, e.s, e.d)); extra += e.amt * x; if (e.flip) f += x; }
  const flips = Math.floor(f + 1e-9), flipE = f - flips;
  const from = flips % 2 ? [0, 0, 1, 0] : [1, 0, 0, 0], to = flips % 2 ? [1, 0, 0, 0] : [0, 0, 1, 0], mid = [0, 1, 0, 0];
  const wEnd = flipE <= 0 ? from : flipE < 0.5 ? mixW(from, mid, flipE * 2) : mixW(mid, to, flipE * 2 - 1);
  const breathe = 0.3 * (0.5 + 0.5 * Math.sin((t / cycle.breathe) * 2 * Math.PI + k * 1.3));
  q.w = mixW(wEnd, mid, breathe * (1 - bell(flipE)));
  q.angle = (dir(k) * drift(k) * t + extra) * DEG; q.shift = 0.2 * Math.sin((t / cycle.shift) * 2 * Math.PI + k);
  return q;
}
// ── The 8 second loop, for exports ──
// The same drift and snaps, written as one 8 second cycle that closes: eight beats whose gaps
// (0.7 to 1.5 s) add up to exactly 8 s, the zoom back where it began, every ring an even
// number of flips, and each ring's snaps scaled (by 0.75 to 1.33) and pointed with or against
// its drift so that drift and snaps together turn it a whole number of turns. Breath and shade
// run on 8 s too. Seed 19660 is the one whose snaps needed the least scaling (search: every
// seed to 20000). The cycle is laid four times over; a moment t is read in the third, so every
// ring has its full history and t and t + 8 are the same moment exactly.
export const LOOP = 8;
const DRIFT = (k) => 7.5 - 0.8 * k;
function loopSchedule(seed) {
  let s = seed >>> 0; const rnd = () => { s += 0x6D2B79F5; let x = Math.imul(s ^ s >>> 15, 1 | s); x ^= x + Math.imul(x ^ x >>> 7, 61 | x); return ((x ^ x >>> 14) >>> 0) / 4294967296; };
  const gaps = []; let sum = 0;
  while (sum < LOOP + 1.5) { const g = 0.7 + rnd() * 0.8; gaps.push(g); sum += g; }
  let n = 0, acc = 0, best = Infinity;
  gaps.forEach((g, i) => { acc += g; if ((i + 1) % 2 === 0 && Math.abs(Math.log(LOOP / acc)) < best) { best = Math.abs(Math.log(LOOP / acc)); n = i + 1; } });
  const sc = LOOP / gaps.slice(0, n).reduce((a, b) => a + b, 0);
  const ev = Array.from({ length: 6 }, () => []), beats = [];
  let t = 0.5;
  for (const g of gaps.slice(0, n)) {
    const m = rnd() < 0.5 ? 1 : rnd() < 0.7 ? 2 : 3, k0 = Math.floor(rnd() * 6); let end = t;
    for (let i = 0; i < m; i++) {
      const k = (k0 + i) % 6, e = { s: t + i * (0.1 + rnd() * 0.08), d: 0.6 + rnd() * 0.35, amt: arcDeg(0.22 + rnd() * 0.26, k) * (rnd() < 0.75 ? dir(k) : -dir(k)), flip: rnd() < 0.6 };
      ev[k].push(e); end = Math.max(end, e.s + e.d);
    }
    beats.push({ s: t, d: end - t });
    t += g * sc;
  }
  // Close each ring: an even number of flips, and a whole number of turns over the cycle.
  ev.forEach((list, k) => {
    if (list.filter((e) => e.flip).length % 2) { const e = list.find((x) => !x.flip) ?? list[0]; e.flip = !e.flip; }
    const D = dir(k) * DRIFT(k) * LOOP; let fit = null;
    for (let mask = 0; mask < 1 << list.length; mask++) {
      const A = list.reduce((a, e, i) => a + Math.abs(e.amt) * dir(k) * ((mask >> i) & 1 ? -1 : 1), 0), fwd = list.length - [...list.keys()].filter((i) => (mask >> i) & 1).length;
      for (let turns = -4; turns <= 4; turns++) { const f = (360 * turns - D) / A, c = Math.abs(Math.log(f)) + (fwd ? 0 : 0.05); if (f > 0 && (!fit || c < fit.c)) fit = { f, mask, c }; }
    }
    list.forEach((e, i) => (e.amt = Math.abs(e.amt) * fit.f * dir(k) * ((fit.mask >> i) & 1 ? -1 : 1)));
  });
  // The zoom alternates in and out from 1 and lands back on 1 at the last beat (an out move).
  let z = 1; const r2 = (() => { let s2 = (seed * 7919) >>> 0; return () => { s2 += 0x6D2B79F5; let x = Math.imul(s2 ^ s2 >>> 15, 1 | s2); x ^= x + Math.imul(x ^ x >>> 7, 61 | x); return ((x ^ x >>> 14) >>> 0) / 4294967296; }; })();
  beats.forEach((b, i) => { b.from = z; z = i === beats.length - 1 ? 1 : z > 1.2 ? 0.78 + r2() * 0.32 : 1.3 + r2() * 0.6; b.to = z; });
  // Lay the cycle four times over.
  const out = Array.from({ length: 6 }, () => []); out.beats = [];
  for (let c = 0; c < 4; c++) {
    ev.forEach((list, k) => list.forEach((e) => out[k].push({ ...e, s: e.s + c * LOOP })));
    beats.forEach((b) => out.beats.push({ ...b, s: b.s + c * LOOP }));
  }
  out.forEach((list) => list.sort((a, b) => a.s - b.s));
  out.beats.forEach((b, i) => { const next = out.beats[i + 1]; b.zd = Math.min(0.6, (next ? next.s - b.s : 9) - 0.05); });
  return out;
}
const SNAP_LOOP = loopSchedule(19660);
// t read in the third cycle; the wrap sits half a frame (at 60 fps) after each whole loop, so
// no frame's shutter spans it.
const WRAP = 1 / 120;
const inLoop = (t) => 2 * LOOP + WRAP + ((((t - WRAP) % LOOP) + LOOP) % LOOP);
/** Drift and snap as one seamless 8 second loop: the piece at t + 8 is the piece at t. */
export const SNAP_LOOPED = {
  id: 'snap', period: LOOP,
  pose: (k, t) => accented(k, inLoop(t), SNAP_LOOP, expo, DRIFT, { breathe: LOOP, shift: LOOP }),
  camera: (t) => zoomAt(SNAP_LOOP, expo, inLoop(t)),
};
/** The loop's beats in its first cycle, for picking moments. */
export const LOOP_BEATS = SNAP_LOOP.beats.filter((b) => b.s < LOOP).map((b) => ({ s: b.s, d: b.d, from: b.from, to: b.to }));

const MOTIONS = [
  { id: 'snap', label: 'Drift and snap', note: 'The rings never stop drifting. Every 0.7 to 1.5 seconds, one to three neighbouring rings snap round a fifth to half of the square’s width along their length in under a second, eased in and out very sharply (exponential), often flipping their tall end as they go, then fall back into the drift. Every beat the view zooms too, in and out by turns (out to 0.78 times, in as far as 1.9), in 0.6 seconds with the same sharp easing, so the snap and the zoom land together.', period: 24,
    pose: (k, t) => accented(k, t, SNAPS, expo, (k) => 7.5 - 0.8 * k), camera: (t) => zoomAt(SNAPS, expo, t) },
  { id: 'surge', label: 'Drift and surge', note: 'The same drift, but every 1 to 1.8 seconds a ring speeds up and slows back down over 1.4 to 2.2 seconds, gaining a third to two thirds of the square’s width along its length on its neighbours, eased softly (sine). Sometimes its tall end swaps as it goes, and on every beat the view eases in or out with it (0.78 to 1.9 times).', period: 24,
    pose: (k, t) => accented(k, t, SURGES, sine, (k) => 7.5 - 0.8 * k), camera: (t) => zoomAt(SURGES, sine, t) },
  { id: 'swell', label: 'Swell travels', note: 'A swell runs the length of each ribbon, the type rising as it passes and settling behind it, like a wave under cloth. Rings start one after another from the centre, alternate rings running the other way, over 4.5 seconds each, eased in and out (cubic), then rest.', period: 7,
    pose(k, t) { const q = base(), f = t % 7, e = cubic(span(f, k * 0.32, 4.5)); q.w = [0, 0, 0, 1]; q.p = dir(k) > 0 ? -0.2 + 1.4 * e : 1.2 - 1.4 * e; q.sigma = 0.2; q.angle = dir(k) * 1.2 * t * DEG; return q; } },
  { id: 'turn', label: 'Turn and swap', note: 'The draft’s motion: each ring turns and trades its tall end for its small one, by way of a tall middle, over 4.4 seconds (quintic), inner rings first, alternate rings the other way, then all hold.', period: 7,
    pose(k, t) { const q = base(), n = Math.floor(t / 7), e = quint(span(t - n * 7, k * 0.22, 4.4)); q.w = mixW(STATES[(k + n) % 4], STATES[(k + n + 1) % 4], e); q.angle = dir(k) * [42, 30, 36, 24, 28, 20][k % 6] * (n + e) * DEG; return q; } },
  { id: 'ripple', label: 'Ripple out', note: 'The rings rest flat. Every 6 seconds a swell rises in the middle of the inner ring and passes outward ring by ring, 0.35 seconds apart, each ring nodding a few degrees as it peaks.', period: 6,
    pose(k, t) { const q = base(), a = bell(span(t % 6, k * 0.35, 2.6)); q.w = [0.5 * (1 - a), 0, 0.5 * (1 - a), a]; q.p = 0.5; q.sigma = 0.26; q.angle = dir(k) * 7 * sine(a) * DEG; return q; } },
  { id: 'write', label: 'Write on, wipe off', note: 'Each ring writes itself on from its start, the type swelling at the pen’s head, holds, then wipes away from the start in the same direction, inner rings first. A 10 second loop.', period: 10,
    pose(k, t) { const q = base(), f = t % 10, s = k * 0.3, pw = span(f, s, 3.2), on = cubic(pw), off = cubic(span(f, s + 5.2, 2.8)), head = bell(pw);
      q.reveal = [-0.02 + 1.06 * off, -0.02 + 1.06 * on]; q.w = [1 - head, 0, 0, head]; q.p = q.reveal[1]; q.sigma = 0.16; return q; } },
  { id: 'relay', label: 'Relay', note: 'One ring moves at a time and hands the motion on, like gears: each turns 60 degrees and swaps its tall end for its small one, starting as the ring inside it slows. Six rings, 1.6 seconds apart.', period: 9.6,
    pose(k, t) { const q = base(), n = Math.floor(t / 9.6), e = quint(span(t - n * 9.6, k * 1.6, 2.8)), from = (k + n) % 2 ? [0, 0, 1, 0] : [1, 0, 0, 0], to = (k + n) % 2 ? [1, 0, 0, 0] : [0, 0, 1, 0];
      q.w = e < 0.5 ? mixW(from, [0, 1, 0, 0], e * 2) : mixW([0, 1, 0, 0], to, e * 2 - 1); q.angle = dir(k) * 60 * (n + e) * DEG; return q; } },
  { id: 'drift', label: 'Drift', note: 'No starts or stops: the rings turn continuously, inner faster than outer, alternate rings the other way, while each ring’s profile and shade breathe on their own slow cycle.', period: 24,
    pose(k, t) { const q = base(), ph = (t / 24) * 2 * Math.PI + k * 1.1, c = 0.5 + 0.5 * Math.sin(ph); q.w = [(1 - c) * (0.5 + 0.5 * Math.cos(ph)), c, (1 - c) * (0.5 - 0.5 * Math.cos(ph)), 0]; q.angle = dir(k) * (6 - k * 0.7) * t * DEG; q.shift = 0.25 * Math.sin(ph + 1); return q; } },
];

// ── The ring map on the GPU: flat glyphs in, each ring's turn, profile, reveal and shade as
// uniforms. Stencil then cover, nonzero winding; the cover pass discards outside the reveal.
const VS = `
attribute vec3 a; // flat x, flat y, strand
uniform vec4 S1[6]; uniform vec4 S2[6]; uniform vec4 S3[6]; uniform vec4 S4[6]; uniform vec4 S5[6]; uniform vec4 T[48]; uniform vec4 P[30];
uniform float mode; uniform vec3 cam; uniform vec3 ground; uniform float share;
varying vec3 col; varying float vu; varying vec2 vr;
float tget(int idx) { int q = idx / 4; int r = idx - q * 4; vec4 v = T[q]; if (r == 0) return v.x; if (r == 1) return v.y; if (r == 2) return v.z; return v.w; }
void main() {
  int k = int(a.z + 0.5);
  vec4 s1 = S1[k], s2 = S2[k], s3 = S3[k], s4 = S4[k], s5 = S5[k];
  float xn = a.x / s2.z, f = clamp(xn, 0.0, 1.0) * 31.0;
  int i0 = int(min(floor(f), 30.0));
  float u = mix(tget(k * 32 + i0), tget(k * 32 + i0 + 1), f - float(i0));
  if (xn < 0.0) u += xn * (tget(k * 32 + 1) - tget(k * 32)) * 31.0;
  if (xn > 1.0) u += (xn - 1.0) * (tget(k * 32 + 31) - tget(k * 32 + 30)) * 31.0;
  float uc = clamp(u, 0.0, 1.0), m = s3.w, z = (uc - s4.y) / s4.z;
  float sh = m + (1.0 - m) * (s3.x * uc + s3.y * sin(3.14159265 * uc) + s3.z * (1.0 - uc) + s4.x * exp(-z * z));
  float h = s2.w * sh, d = (0.5 - a.y / s2.y) * h;
  float th = s1.w + s2.x * u, rad = s1.z + sign(s2.x) * d;
  vec2 w = s1.xy + rad * vec2(cos(th), sin(th));
  w = cam.xy + (w - cam.xy) * cam.z; // the camera's zoom about the eddy's centre
  gl_Position = vec4(w.x * 2.0 - 1.0, 1.0 - w.y * 2.0, 0.0, 1.0);
  float g = mode < 0.5 ? clamp(uc + s4.w, 0.0, 1.0) : clamp(w.y, 0.0, 1.0);
  float gf = g * 4.0; int j0 = int(min(floor(gf), 3.0));
  vec3 c0 = P[k * 5].rgb, c1 = P[k * 5 + 1].rgb;
  for (int j = 1; j < 4; j++) if (j == j0) { c0 = P[k * 5 + j].rgb; c1 = P[k * 5 + j + 1].rgb; }
  col = mix(c0, c1, gf - float(j0)); vu = u; vr = s5.xy;
}`;
// Motion blur: each frame averages several moments. Every sample moves the ground towards the
// ink by its share (subtracted on a light ground, added on a dark one), in whole 8-bit steps that
// add up exactly over the samples, so a still letter ends at exactly its ink and a moving one
// leaves a trail of the right weight.
const FS = `precision highp float; varying vec3 col; varying float vu; varying vec2 vr; uniform vec3 ground; uniform float count; uniform float index; uniform float lift;
void main() { if (vu < vr.x || vu > vr.y) discard; vec3 tot = (lift > 0.5 ? col - ground : ground - col) * 255.0;
  gl_FragColor = vec4((floor(tot * (index + 1.0) / count + 0.5) - floor(tot * index / count + 0.5)) / 255.0, 1.0); }`;

function makeRenderer(canvas) {
  const gl = canvas.getContext('webgl', { stencil: true, antialias: true, preserveDrawingBuffer: false });
  if (!gl) return null;
  const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  const buf = gl.createBuffer(), U = {}; for (const n of ['S1', 'S2', 'S3', 'S4', 'S5', 'T', 'P', 'mode', 'ground', 'count', 'index', 'lift', 'cam']) U[n] = gl.getUniformLocation(prog, n);
  const la = gl.getAttribLocation(prog, 'a');
  let loaded = false, count = 0;
  function load() {
    if (loaded) return; loaded = true;
    const L = layoutOf(), out = [];
    for (const g of L.flat) for (const u of g.contours) {
      const pts = [[u[0], u[1]]];
      for (let i = 2; i < u.length; i += 6) {
        const [x0, y0] = pts[pts.length - 1], x1 = u[i], y1 = u[i + 1], x2 = u[i + 2], y2 = u[i + 3], x3 = u[i + 4], y3 = u[i + 5];
        const n = Math.max(1, Math.min(16, Math.ceil((Math.hypot(x1 - x0, y1 - y0) + Math.hypot(x2 - x1, y2 - y1) + Math.hypot(x3 - x2, y3 - y2)) / 2.5)));
        for (let j = 1; j <= n; j++) { const t = j / n, m = 1 - t; pts.push([m * m * m * x0 + 3 * m * m * t * x1 + 3 * m * t * t * x2 + t * t * t * x3, m * m * m * y0 + 3 * m * m * t * y1 + 3 * m * t * t * y2 + t * t * t * y3]); }
      }
      for (let i = 1; i < pts.length - 1; i++) out.push(pts[0][0], pts[0][1], g.strand, pts[i][0], pts[i][1], g.strand, pts[i + 1][0], pts[i + 1][1], g.strand);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(out), gl.STATIC_DRAW); count = out.length / 3;
  }
  // blur: whether to average moments; shutter: the time they span (180 degrees at 60 fps). The
  // number of moments follows the fastest ring: about one per 2.5 px of trail, 1 to 40.
  function draw(motion, t, px, blur = false, shutter = 1 / 120, most = 12) {
    load();
    let samples = 1;
    if (blur) {
      let trail = 0;
      const t0 = Math.max(0, t - shutter / 2), t1 = t0 + shutter; // no moment before the start
      const za = motion.camera ? motion.camera(t0) : 1, zb = motion.camera ? motion.camera(t1) : 1;
      COMP.strands.forEach((s, k) => { const a = motion.pose(k, t0), b = motion.pose(k, t1), R = s.path.r + s.thick * GD.swell / 2; trail = Math.max(trail, (Math.abs(b.angle - a.angle) * Math.max(za, zb) + Math.abs(zb - za)) * R * px); });
      samples = Math.max(1, Math.min(most, Math.ceil(trail / 2.5)));
    }
    if (canvas.width !== px) canvas.width = canvas.height = px;
    gl.viewport(0, 0, px, px);
    const L = layoutOf(), st = COMP.strands, pal = GD.palettes.tone, bg = hex(GD.ground);
    const S1 = new Float32Array(24), S2 = new Float32Array(24), S3 = new Float32Array(24), S4 = new Float32Array(24), S5 = new Float32Array(24), T = new Float32Array(192), PC = new Float32Array(120);
    st.forEach((s, k) => pal.forEach((h, j) => PC.set([...hex(h), 1], (k * 5 + j) * 4)));
    gl.clearColor(bg[0], bg[1], bg[2], 1); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.uniform4fv(U.P, PC); gl.uniform1f(U.mode, 0); gl.uniform3fv(U.ground, bg); gl.uniform1f(U.count, samples);
    // On a dark ground the ink is lighter, so samples add light; on a light ground they take it away.
    const lift = bg[0] + bg[1] + bg[2] < 1.5; gl.uniform1f(U.lift, lift ? 1 : 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(la); gl.vertexAttribPointer(la, 3, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND); gl.blendEquation(lift ? gl.FUNC_ADD : gl.FUNC_REVERSE_SUBTRACT); gl.blendFunc(gl.ONE, gl.ONE);
    gl.enable(gl.STENCIL_TEST);
    for (let i = 0; i < samples; i++) {
      const ti = Math.max(0, samples > 1 ? t + shutter * ((i + 0.5) / samples - 0.5) : t);
      st.forEach((s, k) => {
        const p = s.path, q = motion.pose(k, ti), info = L.strands[k], pr = profileTable(q, s.thick);
        S1.set([p.c[0], p.c[1], p.r, p.a0 * DEG + q.angle], k * 4);
        S2.set([(p.a1 - p.a0) * DEG, info.H, info.Wt, pr.kappa], k * 4);
        S3.set([q.w[0], q.w[1], q.w[2], pr.m], k * 4);
        S4.set([q.w[3], q.p, q.sigma, q.shift], k * 4);
        S5.set([q.reveal[0], q.reveal[1], 0, 0], k * 4);
        T.set(pr.tbl, k * 32);
      });
      for (const [n, v] of [['S1', S1], ['S2', S2], ['S3', S3], ['S4', S4], ['S5', S5], ['T', T]]) gl.uniform4fv(U[n], v);
      gl.uniform1f(U.index, i);
      const c = COMP.strands[0].path.c; gl.uniform3fv(U.cam, [c[0], c[1], motion.camera ? motion.camera(ti) : 1]);
      gl.clearStencil(0); gl.clear(gl.STENCIL_BUFFER_BIT);
      gl.colorMask(false, false, false, false); gl.stencilFunc(gl.ALWAYS, 0, 0xff);
      gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.INCR_WRAP); gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.DECR_WRAP);
      gl.drawArrays(gl.TRIANGLES, 0, count);
      gl.colorMask(true, true, true, false); gl.stencilFunc(gl.NOTEQUAL, 0, 0xff); gl.stencilOp(gl.KEEP, gl.KEEP, gl.ZERO);
      gl.drawArrays(gl.TRIANGLES, 0, count);
    }
    gl.disable(gl.STENCIL_TEST); gl.disable(gl.BLEND); gl.colorMask(true, true, true, true);
  }
  return { draw, gl, count: () => count };
}

export { MOTIONS, makeRenderer };
