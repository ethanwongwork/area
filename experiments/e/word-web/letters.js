// Word Web, the letter diagram. Back to the references: single letters (or numbers) as the
// points, curved arrows between them, nothing else. A reader moves through Tender Buttons a
// letter at a time (or a word at a time, each word shown as its number); every step draws an
// arrow from the last point to the next.
//
// One rule for every arrow: it leaves its point heading straight out from the centre, bends
// by the same angle as every other arrow, and arrives aimed at the next point's centre,
// stopping the same visible distance from the letter's ink. An arrow read the other way bends
// to the other side. Arrows that arrive at a point from nearly the same direction merge into
// one shared end and one head; arrows that leave from nearly the same direction share one
// stem. Every other end gets its own room round its point, never touching another. Every
// line is solid and as heavy as the letters' own stems. Points sit in fixed places, chosen by the
// layout.
//
// No dependencies. Deterministic: tick() advances 1/60 s.
import { SECTIONS } from './text.js';

// Square, the diagram alone: no title, no running text, tight margins.
export const W = 1080;
export const H = 1080;
export const DT = 1 / 60;
const M = 64;
const EDGE = 58; // from the frame to the outermost letter centres
const REGION = { x0: EDGE, y0: EDGE, x1: W - EDGE, y1: H - EDGE };
const CX = (REGION.x0 + REGION.x1) / 2;
const CY = (REGION.y0 + REGION.y1) / 2;

export const GROUNDS = {
  black: { ground: '#000000', ink: '#ffffff', accent: '#ffb02e', soft: '#6f6e69' },
  white: { ground: '#f4f3ef', ink: '#141413', accent: '#d9480f', soft: '#9d9b95' },
};
export const LAYOUTS = ['scatter', 'cascade', 'ring', 'grid', 'spiral'];
export const POINTS = ['letters', 'numbers'];

const MODE = {
  letters: { cap: 36, slots: 26, keep: 34, hold: 20, step: 0.17, draw: 0.16 },
  numbers: { cap: 26, slots: 30, keep: 26, hold: 16, step: 0.55, draw: 0.38 },
};
const BEND = (22 * Math.PI) / 180; // every arrow's bend
export const MERGES = { off: 0, close: 20, medium: 34, wide: 50 }; // degrees: arrows this close at a point share an end
const TRUNK = 26; // the length of a shared end or stem
const STEM = 14; // every end runs straight out from its letter this far before it bends
const FORK = (18 * Math.PI) / 180; // the least angle between branches where a shared end splits
const clearFor = (lw) => 7 + lw * 0.8; // the visible gap between a letter's ink and any line, every way round
const sepFor = (lw) => 5 + lw; // the visible gap between two arrow ends at one point
const WING = 0.5; // an arrowhead's half-angle
const LOOP_S = 0.42; // a loop's ends sit this far either side of its direction
const headLen = (lw) => 10 + lw * 2.2;
const GAP_OUT = 26; // without a glyph sheet, an arrow starts this far from its point's centre…
const GAP_IN = 31; // …and its tip stops this far from the next one's
const MASK = 22; // without a glyph sheet, lines that pass under a point break around it
const TAU = Math.PI * 2;
const norm = (a) => ((a % TAU) + TAU) % TAU;
const dirOf = (a) => [Math.cos(a), Math.sin(a)];
const between = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));
const circMean = (as) => Math.atan2(as.reduce((s, a) => s + Math.sin(a), 0), as.reduce((s, a) => s + Math.cos(a), 0));
const unit = ([x, y]) => {
  const l = Math.hypot(x, y) || 1;
  return [x / l, y / l];
};
const angle = ([x, y]) => Math.atan2(y, x);

// ── The text ──
const TEXT = SECTIONS.map(([title, body]) => {
  let sentenceStart = true;
  const chunks = body
    .split(/\s+/)
    .filter(Boolean)
    .map((text) => {
      const core = text.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, '') || null;
      const c = { text, core, sentenceStart };
      if (core) sentenceStart = false;
      if (/[.?!]["')]*$/.test(text)) sentenceStart = true;
      return c;
    });
  return { title, chunks };
});

function tokensOf(points, s) {
  const out = [];
  TEXT[s].chunks.forEach((c, ci) => {
    if (!c.core) return;
    if (points === 'numbers') {
      out.push({ key: c.core.toLowerCase(), ci, li: Infinity, brk: out.length === 0 ? 'section' : c.sentenceStart ? 'sentence' : 'none' });
      return;
    }
    [...c.core].filter((ch) => /[A-Za-z]/.test(ch)).forEach((ch, li) => {
      const brk = li > 0 ? 'none' : out.length === 0 ? 'section' : c.sentenceStart ? 'sentence' : 'word';
      out.push({ key: ch.toUpperCase(), ci, li, brk });
    });
  });
  return out;
}

// Letter statistics over the whole text, for placing letters that follow each other close by.
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const STATS = (() => {
  const freq = Object.fromEntries(LETTERS.map((l) => [l, 0]));
  const pair = new Map();
  const first = [];
  for (const { chunks } of TEXT)
    for (const c of chunks) {
      if (!c.core) continue;
      const ls = [...c.core.toUpperCase()].filter((ch) => freq[ch] != null);
      ls.forEach((l, i) => {
        freq[l]++;
        if (!first.includes(l)) first.push(l);
        if (i) {
          const k = [ls[i - 1], l].sort().join('');
          pair.set(k, (pair.get(k) ?? 0) + 1);
        }
      });
    }
  for (const l of LETTERS) if (!first.includes(l)) first.push(l);
  return { freq, pair, first };
})();

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

// ── Layouts: K places, in an order ──
function slotsFor(layout, K, rng) {
  const { x0, y0, x1, y1 } = REGION;
  const w = x1 - x0, h = y1 - y0;
  if (layout === 'ring') {
    const rx = w / 2 - 6, ry = h / 2 - 6;
    return Array.from({ length: K }, (_, i) => {
      const a = -Math.PI / 2 + (i / K) * Math.PI * 2;
      return [CX + Math.cos(a) * rx, CY + Math.sin(a) * ry];
    });
  }
  if (layout === 'grid') {
    const cols = Math.ceil(Math.sqrt(K * (w / h))), rows = Math.ceil(K / cols);
    return Array.from({ length: K }, (_, i) => [x0 + ((i % cols) + 0.5) * (w / cols), y0 + (Math.floor(i / cols) + 0.5) * (h / rows)]);
  }
  if (layout === 'spiral') {
    // Equal steps along an Archimedean spiral, from the middle out.
    const turns = 2.6, rmax = Math.min(w, h) / 2 - 4;
    const pts = [];
    const total = 4000;
    const samples = [];
    let len = 0, prev = null;
    for (let i = 0; i <= total; i++) {
      const th = (i / total) * turns * Math.PI * 2;
      const r = 40 + (rmax - 40) * (i / total);
      const p = [CX + Math.cos(th - Math.PI / 2) * r, CY + Math.sin(th - Math.PI / 2) * r * (h / w)];
      if (prev) len += Math.hypot(p[0] - prev[0], p[1] - prev[1]);
      samples.push([len, p]);
      prev = p;
    }
    for (let k = 0; k < K; k++) {
      const target = (k / (K - 1)) * len;
      pts.push(samples.find(([l]) => l >= target)?.[1] ?? samples[samples.length - 1][1]);
    }
    return pts;
  }
  if (layout === 'cascade') {
    // Down the page in reading order, swinging left and right, like a sentence spelled out.
    return Array.from({ length: K }, (_, i) => {
      const y = y0 + ((i + 0.5) / K) * h;
      const swing = Math.sin(i * 2.25 + 0.6) * 0.5 + Math.sin(i * 0.77) * 0.12;
      return [CX + swing * (w * 0.78), y];
    });
  }
  // Scatter: evenly spread but irregular (best-candidate sampling).
  const pts = [];
  while (pts.length < K) {
    let best = null, bestD = -1;
    for (let c = 0; c < 40; c++) {
      const p = [x0 + rng() * w, y0 + rng() * h];
      let d = Infinity;
      for (const q of pts) d = Math.min(d, Math.hypot(p[0] - q[0], p[1] - q[1]));
      if (d > bestD) (bestD = d), (best = p);
    }
    pts.push(best);
  }
  // In reading order of a path through them, so neighbours in the order are neighbours on the page.
  const ordered = [pts.reduce((a, b) => (a[1] + a[0] * 0.3 < b[1] + b[0] * 0.3 ? a : b))];
  const left = pts.filter((p) => p !== ordered[0]);
  while (left.length) {
    const last = ordered[ordered.length - 1];
    let bi = 0;
    for (let i = 1; i < left.length; i++) if (Math.hypot(left[i][0] - last[0], left[i][1] - last[1]) < Math.hypot(left[bi][0] - last[0], left[bi][1] - last[1])) bi = i;
    ordered.push(left.splice(bi, 1)[0]);
  }
  return ordered;
}

/** Which letter goes in which place. */
function letterOrder(layout, slots, rng) {
  if (layout === 'ring' || layout === 'grid') return LETTERS; // alphabetical
  if (layout === 'cascade') return STATS.first; // order of first appearance
  if (layout === 'spiral') return [...LETTERS].sort((a, b) => STATS.freq[b] - STATS.freq[a]); // most used in the middle
  // Scatter: letters that follow each other often sit close. Start by frequency, then swap to shorten.
  const order = [...LETTERS].sort((a, b) => STATS.freq[b] - STATS.freq[a]);
  const pos = (o) => Object.fromEntries(o.map((l, i) => [l, slots[i]]));
  const cost = (o) => {
    const p = pos(o);
    let c = 0;
    for (const [k, n] of STATS.pair) c += n * Math.hypot(p[k[0]][0] - p[k[1]][0], p[k[0]][1] - p[k[1]][1]);
    // …and the busiest letters toward the middle, so the web sits centred.
    for (const l of LETTERS) c += STATS.freq[l] * 1.2 * Math.hypot(p[l][0] - CX, p[l][1] - CY);
    return c;
  };
  let cur = cost(order);
  for (let i = 0; i < 3000; i++) {
    const a = Math.floor(rng() * 26), b = Math.floor(rng() * 26);
    [order[a], order[b]] = [order[b], order[a]];
    const c = cost(order);
    if (c < cur) cur = c;
    else [order[a], order[b]] = [order[b], order[a]];
  }
  return order;
}

// ── Curves ──
function cubic(P0, P1, P2, P3, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    pts.push([u * u * u * P0[0] + 3 * u * u * t * P1[0] + 3 * u * t * t * P2[0] + t * t * t * P3[0], u * u * u * P0[1] + 3 * u * u * t * P1[1] + 3 * u * t * t * P2[1] + t * t * t * P3[1]]);
  }
  return pts;
}
const rot = ([x, y], a) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
const ease = (t) => 1 - (1 - t) ** 3;
const back = (t) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2; // ease out with a little overshoot

/**
 * Glyph sheets: capitals and figures rendered from a typeface into one image, with metrics
 * (see scripts/glyph-sheets.mjs). Points are drawn from the sheet, tinted per colour.
 */
export class Sheet {
  constructor(face, img) {
    this.face = face;
    this.img = img;
    this.tints = new Map();
  }
  tint(color) {
    if (!this.tints.has(color)) {
      const c = document.createElement('canvas');
      c.width = this.img.naturalWidth;
      c.height = this.img.naturalHeight;
      const x = c.getContext('2d', { colorSpace: 'display-p3' });
      x.drawImage(this.img, 0, 0);
      x.globalCompositeOperation = 'source-in';
      x.fillStyle = color;
      x.fillRect(0, 0, c.width, c.height);
      this.tints.set(color, c);
    }
    return this.tints.get(color);
  }
  /** Lays a label out at cap height `cap`: its parts, and the centre of its ink. */
  layout(label, cap) {
    const s = cap / this.face.cap;
    let pen = 0, l = Infinity, r = -Infinity, top = 0, bottom = 0;
    const parts = [];
    for (const ch of label) {
      const g = this.face.glyphs[ch];
      if (!g) continue;
      parts.push({ g, x: (pen + g.l) * s });
      l = Math.min(l, pen + g.l);
      r = Math.max(r, pen + g.l + g.w);
      top = Math.max(top, g.a);
      bottom = Math.max(bottom, g.d);
      pen += g.adv;
    }
    return { parts, s, cx: ((l + r) / 2) * s, cy: ((bottom - top) / 2) * s, w: (r - l) * s, h: (top + bottom) * s };
  }
  /**
   * The outline of a laid-out label's ink, as points around the centre it's drawn on (at
   * k = 1), with its box and furthest reach. Arrow ends keep their distance from this, not
   * from the glyph box.
   */
  ink(lay) {
    if (lay.ink) return lay.ink;
    if (!this.data) {
      const c = document.createElement('canvas');
      c.width = this.img.naturalWidth;
      c.height = this.img.naturalHeight;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.drawImage(this.img, 0, 0);
      this.data = g.getImageData(0, 0, c.width, c.height).data;
      this.dw = c.width;
      this.dh = c.height;
    }
    const A = (i, j) => (i < 0 || j < 0 || i >= this.dw || j >= this.dh ? 0 : this.data[(j * this.dw + i) * 4 + 3]);
    const pts = [];
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, max = 0;
    for (const { g, x: px } of lay.parts) {
      for (let j = Math.floor(g.y); j < Math.ceil(g.y + g.h); j++)
        for (let i = Math.floor(g.x); i < Math.ceil(g.x + g.w); i++) {
          if (A(i, j) < 128) continue;
          if (A(i - 1, j) >= 128 && A(i + 1, j) >= 128 && A(i, j - 1) >= 128 && A(i, j + 1) >= 128) continue;
          const x = px - lay.cx + (i + 0.5 - g.x) * lay.s;
          const y = -lay.cy - g.a * lay.s + (j + 0.5 - g.y) * lay.s;
          pts.push(x, y);
          (x0 = Math.min(x0, x)), (y0 = Math.min(y0, y)), (x1 = Math.max(x1, x)), (y1 = Math.max(y1, y));
          max = Math.max(max, Math.hypot(x, y));
        }
    }
    // Its outer shape (convex hull), for breaking lines that pass under it.
    const P = [];
    for (let i = 0; i < pts.length; i += 2) P.push([pts[i], pts[i + 1]]);
    P.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lower = [], upper = [];
    for (const p of P) {
      while (lower.length > 1 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
      lower.push(p);
    }
    for (const p of P.reverse()) {
      while (upper.length > 1 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
      upper.push(p);
    }
    const hull = [...lower.slice(0, -1), ...upper.slice(0, -1)];
    lay.ink = { pts: Float32Array.from(pts), box: [x0, y0, x1, y1], max, hull };
    return lay.ink;
  }
  /**
   * Draws a label in a colour that changes every frame, without caching a tinted sheet per
   * colour: the white letters go into a scratch canvas the letter's size, are filled with the
   * colour there, and that is copied in.
   */
  drawLive(x, lay, cx, cy, color) {
    const T = x.getTransform(), sc = Math.hypot(T.a, T.b);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const { g, x: px } of lay.parts) {
      const dx = cx + px - lay.cx, dy = cy - lay.cy - g.a * lay.s;
      (x0 = Math.min(x0, dx)), (y0 = Math.min(y0, dy)), (x1 = Math.max(x1, dx + g.w * lay.s)), (y1 = Math.max(y1, dy + g.h * lay.s));
    }
    const X0 = Math.floor(x0 * sc + T.e) - 1, Y0 = Math.floor(y0 * sc + T.f) - 1;
    const w = Math.ceil(x1 * sc + T.e) + 1 - X0, h = Math.ceil(y1 * sc + T.f) + 1 - Y0;
    const c = (this.scratch ??= document.createElement('canvas'));
    if (c.width < w || c.height < h) (c.width = Math.max(c.width, w)), (c.height = Math.max(c.height, h));
    const s = (this.sx ??= c.getContext('2d', { colorSpace: 'display-p3' }));
    s.setTransform(1, 0, 0, 1, 0, 0);
    s.globalCompositeOperation = 'source-over';
    s.clearRect(0, 0, w, h);
    s.setTransform(sc, 0, 0, sc, T.e - X0, T.f - Y0);
    this.draw(s, lay, cx, cy, '#ffffff');
    s.setTransform(1, 0, 0, 1, 0, 0);
    s.globalCompositeOperation = 'source-in';
    s.fillStyle = color;
    s.fillRect(0, 0, w, h);
    x.save();
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.drawImage(c, 0, 0, w, h, X0, Y0, w, h);
    x.restore();
  }
  draw(x, lay, cx, cy, color, k = 1) {
    const img = this.tint(color);
    const s = lay.s * k;
    for (const { g, x: px } of lay.parts) {
      const dx = cx + (px - lay.cx) * k;
      const dy = cy - lay.cy * k - g.a * s;
      x.drawImage(img, g.x, g.y, g.w, g.h, dx, dy, g.w * s, g.h * s);
    }
  }
}

export class LetterWeb {
  constructor({ layout = 'scatter', points = 'letters', sheet = null, ground = 'black', merge = 'medium', seed = 7 } = {}) {
    this.layout = layout;
    this.merge = ((MERGES[merge] ?? 34) * Math.PI) / 180;
    this.points = points;
    this.m = MODE[points];
    this.sheet = sheet;
    this.colors = GROUNDS[ground];
    this.rng = random(seed);
    this.t = 0;
    this.nodes = new Map();
    this.edges = [];
    this.section = -1;
    this.cur = null;
    this.tok = null;
    this.wait = 0.3;
    this.numbers = new Map(); // word → its number, from first appearance
    this.slots = slotsFor(layout, this.m.slots, random(seed + 1));
    this.taken = new Set();
    if (points === 'letters') {
      const order = letterOrder(layout, this.slots, random(seed + 2));
      this.place = Object.fromEntries(order.map((l, i) => [l, i]));
    }
    this.ticker = { offset: null, chunks: [] };
    this.measure = document.createElement('canvas').getContext('2d');
    this.nextSection();
  }

  nextSection() {
    this.section = (this.section + 1) % TEXT.length;
    this.tokens = tokensOf(this.points, this.section);
    this.ti = -1;
    this.measure.font = `400 22px ${FONT_UI}`;
    const space = this.measure.measureText(' ').width;
    let x = 0;
    this.ticker.chunks = TEXT[this.section].chunks.map((c) => {
      const w = this.measure.measureText(c.text).width;
      const o = { text: c.text, core: c.core, x, w };
      x += w + space;
      return o;
    });
    this.ticker.offset = null;
  }

  label(tok) {
    if (this.points === 'letters') return tok.key;
    if (!this.numbers.has(tok.key)) this.numbers.set(tok.key, this.numbers.size + 1);
    return String(this.numbers.get(tok.key));
  }

  node(tok) {
    let n = this.nodes.get(tok.key);
    if (n) return n;
    const label = this.label(tok);
    let slot;
    if (this.points === 'letters') slot = this.place[tok.key];
    else {
      // Numbers take the places in order, skipping any still in use.
      const K = this.slots.length;
      slot = (Number(label) - 1) % K;
      for (let i = 0; i < K && this.taken.has(slot); i++) slot = (slot + 1) % K;
      this.taken.add(slot);
    }
    const [x, y] = this.slots[slot];
    n = { key: tok.key, label, slot, x, y, alpha: 0, target: 1, born: this.t, hit: -9, lay: null };
    this.nodes.set(tok.key, n);
    return n;
  }

  step() {
    this.ti++;
    if (this.ti >= this.tokens.length) {
      this.nextSection();
      this.ti = 0;
    }
    const tok = this.tokens[this.ti];
    const prev = this.cur;
    const n = this.node(tok);
    n.target = 1;
    n.hit = this.t;
    // Letters run on across a word space; nothing crosses a full stop.
    const link = prev && (tok.brk === 'none' || (this.points === 'letters' && tok.brk === 'word'));
    if (link) {
      // An arrow already on the web is read again: it moves to the front and draws again.
      const old = this.edges.find((e) => e.a === prev && e.b === n);
      if (old) this.edges.splice(this.edges.indexOf(old), 1);
      this.edges.push({ a: prev, b: n, k: 0, prog: 0, alpha: 1, uS: old?.uS, vS: old?.vS, tin: old?.tin ?? 0, tout: old?.tout ?? 0 });
    }
    this.cur = n;
    this.tok = tok;
    const next = this.tokens[this.ti + 1];
    let wait = this.m.step + (this.points === 'numbers' ? 0.015 * tok.key.length : 0);
    if (!next) wait += 1.4;
    else if (next.brk === 'sentence') wait += 0.5;
    else if (next.brk === 'word') wait += 0.12;
    this.wait += wait;
    this.onStep?.();
  }

  tick() {
    this.t += DT;
    this.wait -= DT;
    if (this.wait <= 0) this.step();
    const { keep, hold, draw } = this.m;
    const n = this.edges.length;
    this.edges.forEach((e, i) => {
      e.prog = Math.min(1, e.prog + DT / draw);
      const rank = n - 1 - i;
      const target = rank < hold ? 1 : Math.max(0, 1 - (rank - hold) / (keep - hold));
      e.alpha += (target - e.alpha) * 0.07;
      e.dying = rank >= keep;
    });
    this.edges = this.edges.filter((e) => !(e.dying && e.alpha < 0.01));
    this.bundle();
    const live = new Set();
    for (const e of this.edges) if (!e.dying && e.alpha > 0.05) live.add(e.a).add(e.b);
    for (const node of this.nodes.values()) {
      // Letters stay once set; a number goes when its last arrow does, freeing its place.
      if (this.points === 'numbers') node.target = live.has(node) || node === this.cur ? 1 : 0;
      node.alpha += (node.target - node.alpha) * (node.target ? 0.15 : 0.06);
      if (node.target === 0 && node.alpha < 0.01) {
        this.nodes.delete(node.key);
        this.taken.delete(node.slot);
      }
    }
    if (this.tok) {
      const target = 300 - this.ticker.chunks[this.tok.ci].x;
      this.ticker.offset = this.ticker.offset == null ? target : this.ticker.offset + (target - this.ticker.offset) * 0.1;
    }
  }

  prerun(seconds) {
    for (let i = 0; i < seconds / DT; i++) this.tick();
  }

  stats() {
    return { title: TEXT[this.section].title, section: this.section + 1, sections: TEXT.length };
  }

  /** Each arrow's own directions: out of its point, and into the next, by the one bend. */
  raw(e) {
    const d = unit([e.b.x - e.a.x, e.b.y - e.a.y]);
    const bend = e.bend ?? this.bend ?? BEND;
    return { v: rot(d, -bend), u: rot(d, bend) };
  }

  layOf(n) {
    if (!n.lay && this.sheet) n.lay = this.sheet.layout(n.label, this.m.cap);
    return n.lay;
  }

  /**
   * How far from a point's centre an arrow end sits at angle `phi`, so that every part of it
   * (the head's tip and wings, or a line's square end) keeps the same visible gap from the
   * letter's ink. Ends are radial, so this is a search along the ray, from outside in.
   */
  reach(n, phi, kind) {
    const lw = this.lw, CLEAR = clearFor(lw);
    const miter = lw / (2 * Math.sin(WING));
    const lay = this.layOf(n);
    if (!lay) return kind === 'in' ? GAP_IN + miter : GAP_OUT;
    const q = Math.round((norm(phi) * 360) / Math.PI); // half degrees
    n.reach ??= new Map();
    const key = kind + q;
    // A crowded letter sets all its ends further out by the same `pad` (see arrange()).
    if (n.reach.has(key)) return n.reach.get(key) + (n.pad ?? 0);
    const ink = this.sheet.ink(lay);
    const a = (q * Math.PI) / 360, c = Math.cos(a), s = Math.sin(a);
    const len = headLen(lw);
    // Sample points in the end's own frame: [outward from the end, sideways, gap needed].
    const pts = [];
    if (kind === 'in') {
      pts.push([-miter, 0, CLEAR]);
      for (let t = 0; t <= 1.001; t += 0.25)
        for (const side of [-1, 1]) pts.push([len * Math.cos(WING) * t, side * len * Math.sin(WING) * t, CLEAR + lw / 2]);
      for (let k = 0; k <= len * 1.5; k += 4) pts.push([k, 0, CLEAR + lw / 2]);
    } else {
      pts.push([0, -lw / 2, CLEAR], [0, lw / 2, CLEAR], [0, 0, CLEAR]);
      for (let k = 2; k <= 30; k += 4) pts.push([k, 0, CLEAR + lw / 2]);
    }
    const ok = (g) => pts.every(([al, ac, need]) => clearOf(ink, (g + al) * c - ac * s, (g + al) * s + ac * c, need));
    let g = ink.max + CLEAR + miter + 2;
    while (g > 1 && ok(g - 1)) g -= 1;
    let lo = g - 1, hi = g;
    for (let i = 0; i < 6; i++) {
      const mid = (lo + hi) / 2;
      if (ok(mid)) hi = mid;
      else lo = mid;
    }
    n.reach.set(key, hi);
    return hi + (n.pad ?? 0);
  }

  /**
   * An end's width at each distance from its point's centre, for spacing ends: a head is a
   * point at its tip and widest at its wings; a line keeps its own width.
   */
  profile(n, phi, kind) {
    const g = this.reach(n, phi, kind), lw = this.lw;
    if (kind !== 'in') return [[g, lw / 2]];
    const len = headLen(lw), miter = lw / (2 * Math.sin(WING));
    return [[g - miter, 0], [g, lw / 2], [g + len * Math.cos(WING), len * Math.sin(WING) + lw / 2], [g + len * Math.cos(WING) + 0.01, lw / 2]];
  }

  /**
   * Arranging the ends at one point. Arrows arriving from nearly the same side share one end
   * and head; arrows leaving nearly the same way share one stem (within the merge angle).
   * Every other end gets its own room round the point, with the same gap to its
   * neighbours: ends move as little as they can to make room, keeping their order, and when
   * there isn't room the nearest ends of a kind merge.
   */
  arrange(n, ends) {
    const plain = ends.filter((x) => x.kind !== 'loop');
    const items = [];
    for (const kind of ['in', 'out']) {
      const list = plain.filter((x) => x.kind === kind).sort((p, q) => norm(p.ideal) - norm(q.ideal));
      const groups = [];
      for (const x of list) {
        const g = groups[groups.length - 1];
        if (g && norm(x.ideal) - norm(g[0].ideal) < this.merge) g.push(x);
        else groups.push([x]);
      }
      if (groups.length > 1) {
        const f = groups[0], l = groups[groups.length - 1];
        if (norm(f[0].ideal) + TAU - norm(l[0].ideal) < this.merge) groups[0] = [...groups.pop(), ...f];
      }
      for (const g of groups) items.push({ kind, ends: g });
    }
    // Loops go to the most open side that stays inside the frame and clear of other points.
    for (const x of ends.filter((x) => x.kind === 'loop')) {
      const taken = [...plain.map((p) => p.ideal), ...items.filter((it) => it.kind === 'loop').map((it) => it.ideal)];
      let best = -Infinity, L = 0;
      for (let i = 0; i < 72; i++) {
        const ang = (i / 72) * TAU;
        const tip = [n.x + Math.cos(ang) * 110, n.y + Math.sin(ang) * 110];
        if (tip[0] < 24 || tip[0] > W - 24 || tip[1] < 24 || tip[1] > H - 24) continue;
        let near = Infinity;
        for (const m of this.nodes.values()) if (m !== n) near = Math.min(near, Math.hypot(m.x - tip[0], m.y - tip[1]));
        const room = taken.length ? Math.min(...taken.map((t) => between(t, ang))) : Math.PI;
        const score = room * 180 + Math.min(near, 220) * 0.5;
        if (score > best) (best = score), (L = ang);
      }
      items.push({ kind: 'loop', ends: [x], ideal: L });
    }
    const size = (it) => {
      if (it.kind !== 'loop') {
        it.ideal = circMean(it.ends.map((x) => x.ideal));
        // Lean a hair toward where the arrows go, so two ends that would sit at the same angle
        // take the order that keeps their lines from crossing.
        const far = circMean(it.ends.map((x) => { const m = x.kind === 'in' ? x.e.a : x.e.b; return Math.atan2(m.y - n.y, m.x - n.x); }));
        it.ideal += 0.03 * Math.atan2(Math.sin(far - it.ideal), Math.cos(far - it.ideal));
      }
      it.w = it.kind === 'loop' ? 4 : it.ends.length;
      if (it.kind === 'loop') {
        it.lo = { off: -LOOP_S, prof: this.profile(n, it.ideal - LOOP_S, 'out') };
        it.hi = { off: LOOP_S, prof: this.profile(n, it.ideal + LOOP_S, 'in') };
      } else it.lo = it.hi = { off: 0, prof: this.profile(n, it.ideal, it.kind) };
    };
    items.forEach(size);
    // The angle two neighbouring ends need between them: checked at every distance where both exist.
    const width = (prof, r) => {
      if (r < prof[0][0]) return null;
      for (let i = prof.length - 1; i >= 0; i--)
        if (r >= prof[i][0]) {
          const nx = prof[i + 1];
          if (!nx) return prof[i][1];
          const t = (r - prof[i][0]) / (nx[0] - prof[i][0]);
          return prof[i][1] + (nx[1] - prof[i][1]) * t;
        }
      return null;
    };
    const need = (p, q) => {
      let ang = 0;
      for (const r of [...p.map((x) => x[0]), ...q.map((x) => x[0])]) {
        const a = width(p, r), b = width(q, r);
        // Ends that start almost at the letter's centre (into the crook of an L, say) are
        // measured from a little way out, or the angle they ask for runs to whole turns.
        if (a == null || b == null || r < 12) continue;
        ang = Math.max(ang, (a + b + sepFor(this.lw)) / r);
      }
      return ang;
    };
    n.extra ??= new Map();
    const key = (it) => it.kind + ':' + it.ends.map((x) => x.e.a.key + x.e.b.key).sort().join(',');
    const sep = (i, j) => i.hi.off - j.lo.off + need(i.hi.prof, j.lo.prof) + (n.extra.get(key(i) + '|' + key(j)) ?? 0) + (n.extra.get(key(j) + '|' + key(i)) ?? 0);
    // Not enough room round the point: first set every end further out, all by the same step,
    // so there is more room round the letter for the same gaps, until they fit with a little
    // to spare; only then, if they still don't, merge the closest two ends of a kind.
    const totalSep = () => {
      const sorted = [...items].sort((p, q) => norm(p.ideal) - norm(q.ideal));
      let t = 0;
      sorted.forEach((it, i) => (t += sep(it, sorted[(i + 1) % sorted.length])));
      return sorted.length < 2 ? 0 : t;
    };
    n.pad ??= 0;
    while (totalSep() > TAU * 0.86 && n.pad < 60) {
      n.pad += 3;
      items.forEach(size);
    }
    for (;;) {
      const sorted = [...items].sort((p, q) => norm(p.ideal) - norm(q.ideal));
      let total = 0;
      sorted.forEach((it, i) => (total += sep(it, sorted[(i + 1) % sorted.length])));
      if (sorted.length < 2 || total <= TAU) break;
      let pair = null, d = Infinity;
      for (const kind of ['in', 'out']) {
        const ks = sorted.filter((it) => it.kind === kind);
        if (ks.length < 2) continue;
        ks.forEach((it, i) => {
          const nx = ks[(i + 1) % ks.length];
          const dd = between(it.ideal, nx.ideal);
          if (nx !== it && dd < d) (d = dd), (pair = [it, nx]);
        });
      }
      if (!pair) break;
      pair[0].ends.push(...pair[1].ends);
      items.splice(items.indexOf(pair[1]), 1);
      size(pair[0]);
    }
    // The angle left over round the letter once every end has its room: the fanning in
    // tighten() may only spend this.
    {
      const sorted = [...items].sort((p, q) => norm(p.ideal) - norm(q.ideal));
      let total = 0;
      if (sorted.length > 1) sorted.forEach((it, i) => (total += sep(it, sorted[(i + 1) % sorted.length])));
      n.slack = TAU - total;
    }
    const phi = fitCircle(items, sep);
    n.items = items.map((it, i) => ({ key: key(it), edges: it.ends.map((x) => x.e), a: phi[i] }));
    items.forEach((it, i) => {
      const a = phi[i];
      // Where a shared end splits, its branches leave at their own angles, at least FORK apart,
      // so they part at once instead of running side by side.
      const branch = new Map();
      if (it.kind !== 'loop' && it.ends.length > 1) {
        const rel = (x) => Math.atan2(Math.sin(x.ideal - it.ideal), Math.cos(x.ideal - it.ideal));
        const ends = [...it.ends].sort((p, q) => rel(p) - rel(q));
        const y = isotonic(ends.map((x, k) => rel(x) - k * FORK), ends.map(() => 1));
        ends.forEach((x, k) => branch.set(x.e, a + y[k] + k * FORK));
      }
      for (const { e } of it.ends) {
        const t = (e.target ??= {});
        if (it.kind === 'loop') {
          t.loop = a;
          t.gin = this.reach(n, a + LOOP_S, 'in');
          t.gout = this.reach(n, a - LOOP_S, 'out');
        } else if (it.kind === 'in') {
          t.in = a;
          t.gin = this.reach(n, a, 'in');
          t.tin = it.ends.length > 1 ? TRUNK : STEM;
          t.bin = branch.get(e) ?? a;
        } else {
          t.out = a;
          t.gout = this.reach(n, a, 'out');
          t.tout = it.ends.length > 1 ? TRUNK : STEM;
          t.bout = branch.get(e) ?? a;
        }
      }
    });
  }

  /** Arranges the ends at every point, and eases each arrow toward its arrangement. */
  bundle(rate = 0.12) {
    const live = this.edges.filter((e) => e.alpha > 0.02);
    const at = new Map();
    const add = (n, end) => {
      if (!at.has(n)) at.set(n, []);
      at.get(n).push(end);
    };
    for (const e of live) {
      e.target = {};
      if (e.a === e.b) {
        add(e.a, { e, kind: 'loop' });
        continue;
      }
      e.r = this.raw(e);
      add(e.b, { e, kind: 'in', ideal: angle([-e.r.u[0], -e.r.u[1]]) });
      add(e.a, { e, kind: 'out', ideal: angle(e.r.v) });
    }
    for (const [n, ends] of at) this.arrange(n, ends);
    const vec = (cur, a) => {
      const t = dirOf(a);
      return cur ? unit([cur[0] + (t[0] - cur[0]) * rate, cur[1] + (t[1] - cur[1]) * rate]) : t;
    };
    const num = (cur, t) => (cur == null ? t : cur + (t - cur) * rate);
    for (const e of live) {
      const t = e.target;
      if (t.loop != null) e.loopV = vec(e.loopV, t.loop);
      if (t.in != null) e.uS = vec(e.uS && [-e.uS[0], -e.uS[1]], t.in).map((v) => -v);
      if (t.out != null) e.vS = vec(e.vS, t.out);
      if (t.bin != null) e.uB = vec(e.uB && [-e.uB[0], -e.uB[1]], t.bin).map((v) => -v);
      if (t.bout != null) e.vB = vec(e.vB, t.bout);
      if (t.gin != null) e.gin = num(e.gin, t.gin);
      if (t.gout != null) e.gout = num(e.gout, t.gout);
      e.tin = num(e.tin, t.tin ?? 0);
      e.tout = num(e.tout, t.tout ?? 0);
    }
  }

  /**
   * Checks the drawn arrows near each point: where two neighbouring ends' lines come closer
   * than the gap (their bends can lean together just after they leave), they're given more
   * room. Returns whether anything changed.
   */
  tighten(step = 0.04) {
    // Two ends leaving a letter close together are fanned apart until their lines keep the open
    // gap (as clear.js checks it) all the way out, but only while the letter has angle to spare;
    // where it has none, the layout has to give it room.
    const lw = this.lw, gap = 2 * lw + 8;
    let changed = false;
    for (const n of this.nodes.values()) {
      if (!n.items || n.items.length < 2) continue;
      let spare = (n.slack ?? 0) - 0.15;
      const R0 = 120;
      const near = (e) => {
        const { pts, dir } = this.curve(e), segs = [];
        for (let i = 1; i < pts.length; i++)
          if (Math.hypot(pts[i - 1][0] - n.x, pts[i - 1][1] - n.y) < R0 || Math.hypot(pts[i][0] - n.x, pts[i][1] - n.y) < R0) segs.push([pts[i - 1], pts[i]]);
        if (e.b === n) {
          // The head's wings.
          const tip = pts[pts.length - 1], len = headLen(lw), ang = Math.atan2(dir[1], dir[0]);
          for (const w of [-WING, WING]) segs.push([tip, [tip[0] - Math.cos(ang + w) * len, tip[1] - Math.sin(ang + w) * len]]);
        }
        return segs;
      };
      const sorted = [...n.items].sort((p, q) => norm(p.a) - norm(q.a));
      sorted.forEach((it, i) => {
        const nx = sorted[(i + 1) % sorted.length];
        if (nx === it) return;
        // Only the near side between two ends: the long way round, their lines can't meet.
        if (norm(nx.a - it.a) > Math.PI) return;
        const A = it.edges.flatMap(near), B = nx.edges.flatMap(near);
        let d = Infinity;
        for (const [p, q] of A) for (const [r, t] of B) d = Math.min(d, segSeg(p, q, r, t));
        if (d < gap && spare > step) {
          spare -= step;
          const k = it.key + '|' + nx.key;
          n.extra.set(k, (n.extra.get(k) ?? 0) + step);
          changed = true;
        }
      });
    }
    return changed;
  }

  /** The arrow as a polyline: a stem out, a near-circular bend, a straight end in. */
  curve(e) {
    const a = [e.a.x, e.a.y], b = [e.b.x, e.b.y];
    const miter = this.lw / (2 * Math.sin(WING));
    const gin = e.gin ?? GAP_IN + miter;
    const gout = e.gout ?? GAP_OUT;
    if (e.a === e.b) {
      const L = angle(e.loopV ?? [0, -1]);
      const h = 95;
      const v = dirOf(L - LOOP_S), u = dirOf(L + LOOP_S);
      const P0 = [a[0] + v[0] * gout, a[1] + v[1] * gout];
      const P3 = [a[0] + u[0] * gin, a[1] + u[1] * gin];
      return { pts: cubic(P0, [P0[0] + v[0] * h, P0[1] + v[1] * h], [P3[0] + u[0] * h, P3[1] + u[1] * h], P3, 36), dir: [-u[0], -u[1]] };
    }
    const r = e.r ?? this.raw(e);
    const v = e.vS ?? r.v, u = e.uS ?? r.u;
    const P0 = [a[0] + v[0] * gout, a[1] + v[1] * gout];
    const S1 = [P0[0] + v[0] * e.tout, P0[1] + v[1] * e.tout];
    const T = [b[0] - u[0] * gin, b[1] - u[1] * gin];
    const Mg = [T[0] - u[0] * e.tin, T[1] - u[1] * e.tin];
    // A branch of a shared end leaves (or joins) the trunk at its own angle.
    const vb = e.vB ?? v, ub = e.uB ?? u;
    // Handles for a near-circular arc that turns from vb to ub.
    const span = Math.hypot(Mg[0] - S1[0], Mg[1] - S1[1]);
    const turn = Math.abs(Math.atan2(vb[0] * ub[1] - vb[1] * ub[0], vb[0] * ub[0] + vb[1] * ub[1]));
    const hl = turn < 0.01 ? span / 3 : (span / (2 * Math.sin(turn / 2))) * (4 / 3) * Math.tan(turn / 4);
    const mid = cubic(S1, [S1[0] + vb[0] * hl, S1[1] + vb[1] * hl], [Mg[0] - ub[0] * hl, Mg[1] - ub[1] * hl], Mg, 36);
    return { pts: [P0, ...mid, T], dir: u, ends: [e.tout, e.tin] };
  }

  /** Everything drawn, as a box: every line, head, loop and letter. */
  bounds() {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const add = (x, y, r) => ((x0 = Math.min(x0, x - r)), (y0 = Math.min(y0, y - r)), (x1 = Math.max(x1, x + r)), (y1 = Math.max(y1, y + r)));
    const lw = this.lw, len = headLen(lw);
    for (const e of this.edges) {
      const { pts, dir } = this.curve(e);
      for (const [x, y] of pts) add(x, y, lw / 2);
      const tip = pts[pts.length - 1], ang = angle(dir);
      for (const w of [-WING, WING]) add(tip[0] - Math.cos(ang + w) * len, tip[1] - Math.sin(ang + w) * len, lw / 2);
    }
    for (const n of this.nodes.values()) {
      const lay = this.layOf(n);
      if (lay && this.sheet) {
        const [bx0, by0, bx1, by1] = this.sheet.ink(lay).box;
        add(n.x + bx0, n.y + by0, 0);
        add(n.x + bx1, n.y + by1, 0);
      } else add(n.x, n.y, MASK);
    }
    return [x0, y0, x1, y1];
  }

  /**
   * Fits the drawing to the square: moves the letters toward or away from the middle until
   * everything drawn sits inside `margin`, centred. Arrow ends keep their fixed gaps, so this
   * settles over a few rounds.
   */
  fitFrame(margin) {
    for (let k = 0; k < 8; k++) {
      const [x0, y0, x1, y1] = this.bounds();
      const s = Math.min((W - 2 * margin) / (x1 - x0), (H - 2 * margin) / (y1 - y0), 1.12);
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      if (Math.abs(s - 1) < 0.002 && Math.abs(cx - W / 2) < 0.5 && Math.abs(cy - H / 2) < 0.5) return;
      for (const n of this.nodes.values()) {
        n.x = W / 2 + (n.x - cx) * s;
        n.y = H / 2 + (n.y - cy) * s;
      }
      this.bundle(1);
    }
  }

  /**
   * Each letter's clearing: a circle just past the furthest of its own straight ends (stems,
   * trunks and heads), with the gap two ends keep. Lines that don't join the letter break at it.
   */
  rings() {
    const lw = this.lw, out = new Map();
    for (const n of this.nodes.values()) {
      const lay = this.layOf(n);
      out.set(n, lay && this.sheet ? this.sheet.ink(lay).max + clearFor(lw) : MASK);
    }
    const grow = (n, r) => out.set(n, Math.max(out.get(n), r + sepFor(lw) / 2));
    for (const e of this.edges) {
      if (e.a === e.b) {
        grow(e.a, Math.max(e.gin ?? 0, e.gout ?? 0) + STEM);
        continue;
      }
      grow(e.a, (e.gout ?? GAP_OUT) + (e.tout ?? 0));
      grow(e.b, (e.gin ?? GAP_IN) + Math.max(e.tin ?? 0, headLen(lw)));
    }
    return out;
  }

  /**
   * Draws the web with a look: the whole web at `dim`, letters at `letterDim`, and on top the
   * lit arrows (`lit`: arrow → { p drawn so far, a alpha }) and lit letters (`litNodes`:
   * letter → { a }). `palette` is 'ink', 'rainbow' (the hue circle at full chroma) or 'bloom'
   * (the luminous blues, golds and pinks). Each letter takes a place on the palette by its
   * direction from the web's middle; each arrow leaves in its letter's colour and runs forward
   * through a short stretch of the palette. At `time` (seconds) the palette moves on: colour
   * streams out of every letter and along its arrows, tail to head, at one speed.
   * With `pulse` the ink itself travels as a light along the arrows. With `baseInk` the faint
   * web stays in the one ink and only the light is coloured. No glow. Every arrow end is
   * drawn over a gap in the ground, so no line touches it.
   */
  drawLook(x, scale, L = {}) {
    const { ground, ink } = this.colors;
    const white = this.colors === GROUNDS.white;
    const dim = L.dim ?? 1, letterDim = L.letterDim ?? 1;
    const pal = L.palette ?? (L.rainbow ? 'rainbow' : 'ink');
    const pulse = pal === 'ink' && !!L.pulse;
    const time = L.time ?? 0;
    x.save();
    x.scale(scale, scale);
    x.fillStyle = ground;
    x.fillRect(0, 0, W, H);
    const lw = this.lw, len = headLen(lw);
    x.lineCap = 'butt';
    x.lineJoin = 'miter';
    x.miterLimit = 6;
    const nodes = [...this.nodes.values()];
    for (const n of nodes) this.layOf(n);
    const mx = nodes.reduce((s, n) => s + n.x, 0) / nodes.length, my = nodes.reduce((s, n) => s + n.y, 0) / nodes.length;
    // A letter's place on the palette (0–1, round), and where the palette has moved to.
    const home = (n) => norm(Math.atan2(n.y - my, n.x - mx)) / TAU;
    const now = (n) => home(n) - time * FLOW_RATE;
    const [ir, ig, ib] = rgbOf(ink);
    const col = (ph) => {
      if (pal === 'rainbow') return spectral(ph * 360, white);
      if (pal === 'bloom') return bloom(ph, white);
      if (pulse) return `rgba(${ir},${ig},${ib},${(PULSE_FLOOR + (1 - PULSE_FLOOR) * pulseAt(ph)).toFixed(3)})`;
      return ink;
    };
    const coloured = pal !== 'ink' || pulse;
    const paint = (e, base) => {
      if (base && L.baseInk) return ink;
      if (fstops && e.a !== e.b) {
        // The whole arrow in the flower's colours, centre to tip, wherever it runs.
        const at = arcAt(e), g = x.createLinearGradient(e.a.x, e.a.y, e.b.x, e.b.y);
        for (let k = 0; k <= 24; k++) g.addColorStop(k / 24, fieldTint(field(...at(k / 24)), 1));
        return g;
      }
      if (fstops) return fieldTint(field(e.a.x, e.a.y), 1);
      if (!coloured) return ink;
      if (e.a === e.b) return col(now(e.a));
      // Out of its letter in the letter's own colour, then forward through a short stretch of
      // the palette, the same stretch for the same length everywhere, so colour streams out of
      // every letter along its arrows at one speed.
      const len = Math.hypot(e.b.x - e.a.x, e.b.y - e.a.y);
      const turns = len / (pulse ? PULSE_WAVE : FLOW_WAVE);
      const g = x.createLinearGradient(e.a.x, e.a.y, e.b.x, e.b.y);
      const n = Math.min(64, Math.max(6, Math.ceil(turns * (pulse ? 48 : 32))));
      const p0 = now(e.a);
      for (let k = 0; k <= n; k++) g.addColorStop(k / n, col(p0 + (turns * k) / n));
      return g;
    };
    // A comet on arrow e: its front at `p` (0 at the tail letter, 1 at the head; past 1 the
    // front waits in the head while the rest drains in), `tail` long, fading out at both ends.
    // Its colour runs from the sending letter's to the receiving one's, the short way round.
    const tint = (ph, a) => {
      if (pal === 'ink') return `rgba(${ir},${ig},${ib},${a.toFixed(3)})`;
      return col(ph).replace(')', ` / ${a.toFixed(3)})`);
    };
    // A flower's colours: `flower` is a list of [radius, colour] stops, the radius a fraction of
    // the ring the letters sit on (0 the middle, 1 the letters). A comet then takes its colour
    // from where it is in the flower, centre to petal tip, as it crosses.
    const ringR = nodes.reduce((s, n) => s + Math.hypot(n.x - mx, n.y - my), 0) / nodes.length || 1;
    const fstops = L.flower?.map(([r, hex]) => [r, rgbOf(hex).map((v) => v / 255)]);
    const field = (px, py) => {
      const r = Math.hypot(px - mx, py - my) / ringR;
      let k = 0;
      while (k < fstops.length - 2 && fstops[k + 1][0] < r) k++;
      const [r0, c0] = fstops[k], [r1, c1] = fstops[k + 1];
      const f = Math.min(1, Math.max(0, (r - r0) / (r1 - r0 || 1)));
      const e = f * f * (3 - 2 * f);
      return c0.map((v, j) => v + (c1[j] - v) * e);
    };
    const fieldTint = ([r, g, b], a) => `color(display-p3 ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} / ${a.toFixed(3)})`;
    // Where along its own arc an arrow is, by its projection on the line from a to b (0–1).
    const arcAt = (e) => {
      const { pts } = this.curve(e);
      const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, L2 = dx * dx + dy * dy || 1;
      const qs = pts.map(([px, py]) => ((px - e.a.x) * dx + (py - e.a.y) * dy) / L2);
      return (q) => {
        let i = 1;
        while (i < qs.length - 1 && qs[i] < q) i++;
        const f = Math.min(1, Math.max(0, (q - qs[i - 1]) / (qs[i] - qs[i - 1] || 1)));
        return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f];
      };
    };
    const comet = (e, p, tail) => {
      if (fstops && e.a !== e.b) {
        const at = arcAt(e);
        const front = Math.min(1, p), back = p - tail, lo = Math.max(0, back);
        const g = x.createLinearGradient(e.a.x, e.a.y, e.b.x, e.b.y);
        if (lo > 0) g.addColorStop(0, fieldTint(field(...at(0)), 0));
        const n = 24;
        for (let k = 0; k <= n; k++) {
          const q = lo + ((front - lo) * k) / n;
          const w = Math.min(1, Math.max(0, (q - back) / (p - back)));
          g.addColorStop(q, fieldTint(field(...at(q)), Math.sin(Math.PI * w ** 0.8) ** 1.4));
        }
        if (front < 1) g.addColorStop(Math.min(1, front + 1e-4), fieldTint(field(...at(front)), 0));
        return g;
      }
      const pa = now(e.a);
      if (e.a === e.b) return tint(pa, Math.sin(Math.PI * Math.min(1, Math.max(0, p / (1 + tail)))));
      const d = ((((now(e.b) - pa) % 1) + 1.5) % 1) - 0.5;
      const front = Math.min(1, p), back = p - tail;
      const g = x.createLinearGradient(e.a.x, e.a.y, e.b.x, e.b.y);
      const lo = Math.max(0, back);
      if (lo > 0) g.addColorStop(0, tint(pa, 0));
      // Strength along the comet: 0 at its back and at its front, fullest a little ahead of the
      // middle, so over a white web it rises out of white and settles back into it.
      const n = 20;
      for (let k = 0; k <= n; k++) {
        const q = lo + ((front - lo) * k) / n;
        const w = Math.min(1, Math.max(0, (q - back) / (p - back)));
        g.addColorStop(q, tint(pa + d * q, Math.sin(Math.PI * w ** 0.8) ** 1.4));
      }
      if (front < 1) g.addColorStop(Math.min(1, front + 1e-4), tint(pa + d * front, 0));
      return g;
    };
    // Each arrow as its polyline (cut at `p` while it's drawing) and its head.
    const shape = (e, p) => {
      const { pts, dir } = this.curve(e);
      const last = Math.max(1, Math.round(p * (pts.length - 1)));
      const body = pts.slice(0, last + 1);
      const tip = body[body.length - 1], prev = body[body.length - 2];
      const ang = angle(p >= 1 ? dir : unit([tip[0] - prev[0], tip[1] - prev[1]]));
      const head = [[tip[0] - Math.cos(ang - WING) * len, tip[1] - Math.sin(ang - WING) * len], tip, [tip[0] - Math.cos(ang + WING) * len, tip[1] - Math.sin(ang + WING) * len]];
      return { body, head, done: p >= 1 };
    };
    // Every letter sits in a round clearing that reaches just past its own arrow ends. A line
    // that passes a letter it doesn't join breaks once, at the clearing's edge.
    const rings = this.rings();
    // Lines join round (a fork reads as one knot); heads keep their sharp tips.
    const stroke = (lines, heads, style, alpha) => {
      x.globalAlpha = Math.min(1, alpha);
      x.strokeStyle = style;
      x.lineWidth = lw;
      for (const [list, join] of [[lines, 'round'], [heads, 'miter']]) {
        if (!list.length) continue;
        x.lineJoin = join;
        x.beginPath();
        for (const l of list) l.forEach(([px, py], i) => x[i ? 'lineTo' : 'moveTo'](px, py));
        x.stroke();
      }
    };
    const list = [];
    if (dim > 0) for (const e of this.edges) list.push([e, 1, dim, true]);
    if (L.lit) for (const [e, s] of L.lit) list.push([e, s.p, s.a, false]);
    const shapes = list.filter(([, , a]) => a >= 0.005).map(([e, p, a, base]) => ({ e, a, s: shape(e, p), style: paint(e, base) }));
    // Comets: packets of colour running along whole arrows. The arrow is stroked in full with a
    // gradient that is clear except for the comet, so it breaks at clearings like any line and
    // its head lights only as the comet reaches it.
    if (L.comets) for (const c of L.comets) shapes.push({ e: c.e, a: 1, s: shape(c.e, 1), style: comet(c.e, c.p, c.tail) });
    for (const { s, style, a } of shapes) stroke([s.body], s.done ? [] : [s.head], style, a);
    x.globalAlpha = 1;
    x.fillStyle = ground;
    for (const n of nodes) {
      x.beginPath();
      x.arc(n.x, n.y, rings.get(n), 0, TAU);
      x.fill();
    }
    for (const { e, s, style, a } of shapes) {
      const ends = [within(s.body, e.a, rings.get(e.a))];
      if (s.done) ends.push(within([...s.body].reverse(), e.b, rings.get(e.b)));
      stroke(ends, [s.head], style, a);
    }
    // Letters, then their light.
    for (const n of nodes) {
      if (!this.sheet || !n.lay) continue;
      const ph = now(n);
      const c = fstops ? fieldTint(field(n.x, n.y), 1) : pal === 'ink' ? ink : col(ph);
      const fade = pulse ? PULSE_FLOOR + (1 - PULSE_FLOOR) * pulseAt(ph) : 1;
      const put = (color, a) => {
        x.globalAlpha = Math.min(1, a);
        if (color === ink) this.sheet.draw(x, n.lay, n.x, n.y, ink, 1);
        else this.sheet.drawLive(x, n.lay, n.x, n.y, color);
      };
      put(L.baseInk ? ink : c, letterDim * (L.baseInk ? 1 : fade));
      const lit = L.litNodes?.get(n);
      if (lit && lit.a > 0.005) put(c, lit.a);
    }
    x.globalAlpha = 1;
    x.restore();
  }

  /** Line weight: the stem of the letters at the size they're set. */
  get lw() {
    const f = this.sheet?.face;
    return f?.stem ? (f.stem * this.m.cap) / f.cap : 1.7;
  }

  draw(x, scale) {
    const { ground, ink, accent, soft } = this.colors;
    x.save();
    x.scale(scale, scale);
    x.fillStyle = ground;
    x.fillRect(0, 0, W, H);
    const lw = this.lw;
    x.lineCap = 'butt';
    x.lineJoin = 'miter';
    x.miterLimit = 6;

    for (const n of this.nodes.values()) this.layOf(n);

    const newest = this.edges[this.edges.length - 1];
    for (const e of this.edges) {
      const alpha = e.alpha * Math.min(e.a.alpha, e.b.alpha);
      if (alpha < 0.01) continue;
      const { pts, dir } = this.curve(e);
      const p = ease(e.prog);
      const last = Math.max(1, Math.round(p * (pts.length - 1)));
      const col = e === newest && e.prog < 1 ? accent : ink;
      x.globalAlpha = alpha;
      x.strokeStyle = col;
      x.lineWidth = lw;
      x.beginPath();
      x.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i <= last; i++) x.lineTo(pts[i][0], pts[i][1]);
      x.stroke();
      // The head: at the drawing tip, along the curve; on arrival, aimed exactly at the centre.
      const tip = pts[last];
      const prev = pts[last - 1];
      let d = p >= 1 ? dir : [tip[0] - prev[0], tip[1] - prev[1]];
      const dl = Math.hypot(d[0], d[1]) || 1;
      d = [d[0] / dl, d[1] / dl];
      const len = headLen(lw), wing = WING;
      const ang = Math.atan2(d[1], d[0]);
      x.beginPath();
      x.moveTo(tip[0] - Math.cos(ang - wing) * len, tip[1] - Math.sin(ang - wing) * len);
      x.lineTo(tip[0], tip[1]);
      x.lineTo(tip[0] - Math.cos(ang + wing) * len, tip[1] - Math.sin(ang + wing) * len);
      x.stroke();
    }
    x.globalAlpha = 1;

    // Points. A line that passes under a letter it doesn't join breaks just short of the
    // letter's outer shape, grown by most of the gap every arrow end keeps.
    for (const n of this.nodes.values()) {
      if (n.alpha < 0.01) continue;
      const age = this.t - n.born;
      const grow = Math.min(1, back(Math.min(1, age / 0.35)));
      const bump = 1 + 0.14 * Math.max(0, 1 - (this.t - n.hit) / 0.3);
      const k = grow * bump;
      x.globalAlpha = n.alpha;
      const col = n === this.cur ? accent : ink;
      if (this.sheet && n.lay) {
        const { hull } = this.sheet.ink(n.lay);
        x.fillStyle = x.strokeStyle = ground;
        x.lineJoin = 'round';
        x.lineWidth = clearFor(lw) * 1.6 * k;
        x.beginPath();
        hull.forEach(([hx, hy], i) => x[i ? 'lineTo' : 'moveTo'](n.x + hx * k, n.y + hy * k));
        x.closePath();
        x.fill();
        x.stroke();
        x.lineJoin = 'miter';
        this.sheet.draw(x, n.lay, n.x, n.y, col, k);
      } else {
        x.fillStyle = ground;
        x.beginPath();
        x.arc(n.x, n.y, MASK * k, 0, Math.PI * 2);
        x.fill();
        x.fillStyle = col;
        x.font = `italic 400 ${Math.round(this.m.cap * 1.38 * k)}px ${FONT_FALLBACK}`;
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillText(n.label, n.x, n.y);
      }
    }
    x.globalAlpha = 1;
    if (this.frame) this.drawFrame(x, { ink, accent, soft });
    x.restore();
  }

  drawFrame(x, { ink, accent, soft }) {
    const s = this.stats();
    x.font = `400 16px ${FONT_UI}`;
    x.letterSpacing = '1.4px';
    x.textBaseline = 'alphabetic';
    x.fillStyle = soft;
    x.textAlign = 'left';
    x.fillText(s.title, M, 84);
    x.textAlign = 'right';
    x.fillText(`${String(s.section).padStart(2, '0')}/${s.sections}`, W - M, 84);
    x.letterSpacing = '0px';
    // The line being read: the current word, and in letters the letters read so far, in the accent.
    const y = H - 84;
    x.font = `400 22px ${FONT_UI}`;
    x.textAlign = 'left';
    const off = this.ticker.offset ?? 0;
    const fade = 140;
    const ci = this.tok?.ci ?? -1;
    this.ticker.chunks.forEach((c, i) => {
      const left = c.x + off;
      if (left + c.w < M || left > W - M) return;
      const vis = Math.max(0, Math.min(1, (left - M) / fade, (W - M - (left + c.w)) / fade));
      if (vis <= 0) return;
      if (i !== ci) {
        x.globalAlpha = vis * (i < ci ? 0.75 : 0.3);
        x.fillStyle = ink;
        x.fillText(c.text, left, y);
        return;
      }
      let cut = c.text.length;
      if (Number.isFinite(this.tok.li)) {
        let seen = 0;
        for (let k = c.text.indexOf(c.core); k < c.text.length; k++) {
          if (/[A-Za-z]/.test(c.text[k]) && ++seen > this.tok.li + 1) break;
          cut = k + 1;
        }
      }
      const head = c.text.slice(0, cut);
      x.globalAlpha = vis;
      x.fillStyle = accent;
      x.fillText(head, left, y);
      x.globalAlpha = vis * 0.3;
      x.fillStyle = ink;
      x.fillText(c.text.slice(cut), left + x.measureText(head).width, y);
    });
    x.globalAlpha = 1;
  }
}

const FONT_UI = '"IBM Plex Mono", ui-monospace, Menlo, monospace';
const FONT_FALLBACK = '"Newsreader", Georgia, serif';

/**
 * A whole passage at once, still: every letter at its placed position (from place.js) and
 * every arrow drawn in full, with merged ends settled.
 */
export function stillWeb({ letters, edges, pos, labels = null, sheet = null, ground = 'black', merge = 'medium', margin = 30, bend = null }) {
  const web = new LetterWeb({ layout: 'scatter', points: 'letters', sheet, ground, merge });
  if (bend != null) web.bend = (bend * Math.PI) / 180; // degrees; every arrow's bend, 22 unless a piece sets its own
  web.nodes = new Map(letters.map((k) => [k, { key: k, label: labels?.[k] ?? k, slot: -1, x: pos[k][0], y: pos[k][1], alpha: 1, target: 1, born: -9, hit: -9, lay: null }]));
  web.edges = edges.map(([a, b, bend]) => ({ bend: bend == null ? undefined : (bend * Math.PI) / 180, a: web.nodes.get(a), b: web.nodes.get(b), k: 0, prog: 1, alpha: 1, tin: 0, tout: 0 }));
  web.cur = null;
  web.tok = null;
  web.bundle(1);
  for (let i = 0; i < 30 && web.tighten(); i++) web.bundle(1);
  // Nothing leaves the square: fit, then re-check the ends at the new spacing, and fit again.
  web.fitFrame(margin);
  for (let i = 0; i < 30 && web.tighten(); i++) web.bundle(1);
  web.fitFrame(margin);
  return web;
}

/** A polyline from its start until it first leaves the circle round `c` of radius `r` (a hair past). */
function within(pts, c, r) {
  const out = [pts[0]];
  r += 0.5;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
    const d1 = Math.hypot(x1 - c.x, y1 - c.y);
    if (d1 > r) {
      // Where the segment crosses the circle.
      let lo = 0, hi = 1;
      for (let k = 0; k < 20; k++) {
        const m = (lo + hi) / 2;
        if (Math.hypot(x0 + (x1 - x0) * m - c.x, y0 + (y1 - y0) * m - c.y) > r) hi = m;
        else lo = m;
      }
      out.push([x0 + (x1 - x0) * hi, y0 + (y1 - y0) * hi]);
      return out;
    }
    out.push(pts[i]);
  }
  return out;
}

/**
 * The most vivid colour at a hue: the display's own primaries and their mixes at full
 * strength (HSV saturation and value 1, in Display P3 where the canvas has it). On white,
 * the same colour a step darker so thin lines hold their contrast.
 */
function spectral(h, onWhite = false) {
  h = ((h % 360) + 360) % 360;
  const f = (n) => {
    const k = (n + h / 60) % 6;
    return 1 - Math.max(0, Math.min(k, 4 - k, 1));
  };
  const v = onWhite ? 0.82 : 1;
  const [r, g, b] = [f(5), f(3), f(1)].map((c) => (c * v).toFixed(3));
  return `color(display-p3 ${r} ${g} ${b})`;
}

// Moving colour: the palette turns this much a second, and one turn spans this far along an
// arrow, so colour travels FLOW_RATE × FLOW_WAVE a second (112 of the square's 1,080).
export const FLOW_RATE = 0.08;
const FLOW_WAVE = 1400;
const PULSE_WAVE = 700;
// A pulse of ink: the faint part of the wave, and the light's width (in turns).
const PULSE_FLOOR = 0.3;
const PULSE_WIDTH = 0.09;
function pulseAt(ph) {
  const d = Math.abs((((ph % 1) + 1.5) % 1) - 0.5);
  return Math.exp(-((d / PULSE_WIDTH) ** 2));
}
function rgbOf(hex) {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

/**
 * Bloom: the luminous palette of a glossy rainbow knot, read from the reference's own pixels
 * (the most vivid quarter of each hue): deep cobalt, electric blue, aqua, a little chartreuse,
 * gold, orange, red, raspberry, magenta, orchid and lilac, round again to cobalt. Each colour
 * keeps a share of the turn near its share of the reference. Blended in OKLab, set in Display P3
 * at the same values, so the wider screen shows them at their most vivid. On white, a step darker.
 */
const BLOOM_KEYS = [
  ['#0532c4', 1.1], ['#015bce', 1.1], ['#0292e5', 1], ['#4fd3d0', 0.8], ['#c8d43a', 0.55], ['#ffc414', 0.9],
  ['#fd7b29', 1], ['#f40334', 0.9], ['#fa055b', 0.8], ['#e81c95', 0.8], ['#cb6cd7', 0.8], ['#9775de', 0.7],
];
const BLOOM = [[], []];
{
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
  const toLab = (hex) => {
    const [r, g, b] = rgbOf(hex).map((v) => lin(v / 255));
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
  };
  const toRgb = ([L, a, b]) => {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s].map((c) => gam(Math.min(1, Math.max(0, c))));
  };
  const labs = BLOOM_KEYS.map(([h]) => toLab(h));
  const total = BLOOM_KEYS.reduce((s, [, w]) => s + w, 0);
  const at = [];
  BLOOM_KEYS.reduce((s, [, w]) => (at.push(s / total), s + w), 0);
  for (let i = 0; i < 720; i++) {
    const t = i / 720;
    let k = at.length - 1;
    while (at[k] > t) k--;
    const k1 = (k + 1) % at.length, span = (k1 ? at[k1] : 1) - at[k];
    const f = (t - at[k]) / span, e = f * f * (3 - 2 * f); // eased, so each colour holds a moment
    const lab = labs[k].map((v, j) => v + (labs[k1][j] - v) * e);
    const rgb = toRgb(lab);
    for (const [w, v] of [[0, 1], [1, 0.8]]) BLOOM[w].push(`color(display-p3 ${rgb.map((c) => (c * v).toFixed(3)).join(' ')})`);
  }
}
function bloom(ph, onWhite = false) {
  const i = Math.floor((((ph % 1) + 1) % 1) * 720) % 720;
  return BLOOM[onWhite ? 1 : 0][i];
}

/** True when every point of the ink is at least `need` from (x, y). */
function clearOf(ink, x, y, need) {
  const [x0, y0, x1, y1] = ink.box;
  const dx = Math.max(x0 - x, 0, x - x1), dy = Math.max(y0 - y, 0, y - y1);
  const n2 = need * need;
  if (dx * dx + dy * dy >= n2) return true;
  const p = ink.pts;
  for (let i = 0; i < p.length; i += 2) {
    const a = p[i] - x, b = p[i + 1] - y;
    if (a * a + b * b < n2) return false;
  }
  return true;
}

/** Least-squares nondecreasing fit (pool adjacent violators). */
function isotonic(t, w) {
  const blocks = [];
  for (let i = 0; i < t.length; i++) {
    blocks.push({ v: t[i], w: w[i], n: 1 });
    while (blocks.length > 1 && blocks[blocks.length - 2].v > blocks[blocks.length - 1].v) {
      const q = blocks.pop(), p = blocks[blocks.length - 1];
      p.v = (p.v * p.w + q.v * q.w) / (p.w + q.w);
      p.w += q.w;
      p.n += q.n;
    }
  }
  return blocks.flatMap((b) => Array(b.n).fill(b.v));
}

/**
 * Angles around a circle as close to their ideals as possible (weighted least squares) with
 * each neighbour at least sep(i, j) further round. Tries every place to open the circle.
 */
function fitCircle(items, sep) {
  const n = items.length;
  if (n < 2) return items.map((it) => it.ideal);
  const order = items.map((_, i) => i).sort((p, q) => norm(items[p].ideal) - norm(items[q].ideal));
  let best = null;
  for (let cut = 0; cut < n; cut++) {
    const seq = [...order.slice(cut), ...order.slice(0, cut)];
    const a = [], c = [0];
    for (let k = 0; k < n; k++) {
      let v = norm(items[seq[k]].ideal);
      if (k && v < a[k - 1]) v += TAU;
      a.push(v);
      if (k) c.push(c[k - 1] + sep(items[seq[k - 1]], items[seq[k]]));
    }
    const y = isotonic(a.map((v, k) => v - c[k]), seq.map((i) => items[i].w));
    const phi = y.map((v, k) => v + c[k]);
    let cost = 0;
    phi.forEach((v, k) => (cost += items[seq[k]].w * (v - a[k]) ** 2));
    const short = sep(items[seq[n - 1]], items[seq[0]]) - (phi[0] + TAU - phi[n - 1]);
    if (short > 1e-6) cost += 1e3 + short * 1e4;
    if (!best || cost < best.cost) best = { cost, seq, phi };
  }
  const out = [];
  best.seq.forEach((i, k) => (out[i] = best.phi[k]));
  return out;
}

function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}
function segSeg(p, q, r, t) {
  const o = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  if (o(p, q, r) * o(p, q, t) < 0 && o(r, t, p) * o(r, t, q) < 0) return 0;
  return Math.min(segDist(p, r, t), segDist(q, r, t), segDist(r, p, q), segDist(t, p, q));
}
