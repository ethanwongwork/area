// The treatments of 2 Grid Glyphs. Each builds a scene once (mask, patches, inks, motifs)
// and draws it at any time t (seconds) with an optional lens (the pointer, in cells).
// A view can also stack scenes as layers (`compose`), each with its own blend, so two
// treatments, two scripts or two typefaces overprint on one grid.
import { random } from '../../src/glyphs.js';
import { MOTIFS, STITCHES, assign, blobPath, clamp, distance, flowerMask, glyphMask, patches, shapeMask, strokeOrder } from './grid.js';
import { typeface } from './fonts.js';
import { emblem, emblemFonts } from './emblems.js';

export const BUILD = 2.4; // seconds for a piece to fill in
const ease = (x) => 1 - (1 - x) ** 3;
const TAU = Math.PI * 2;

// ── Colour ───────────────────────────────────────────────────────────────────────────

/** Ink sets: bright, but each balanced so no one colour shouts over the rest. */
export const PALETTES = {
  stitch: ['#0a78c8', '#46aef0', '#00a05a', '#1b5e33', '#ff48b0', '#f0484c', '#ff7a2f', '#6f4fb0', '#7a3a3f', '#efc000'],
  riso: ['#ff48b0', '#0078bf', '#ffe800', '#00a95c', '#ff6c2f', '#765ba7'],
  pool: ['#2340ff', '#8ec9ff', '#c6b8ff', '#d4ff4a', '#ff5fa2'],
  tropic: ['#ff3d7f', '#ff8c1a', '#ffd23f', '#00a99d', '#5b3cff'],
  kiln: ['#ff4a1c', '#f59ac4', '#9c9a2e', '#1e4a2c', '#ffb300'],
  candy: ['#ff7aa8', '#ffb86b', '#ffe66d', '#7ee0b8', '#8fb8ff', '#c79bff'],
  garden: ['#ff2e4d', '#ff8fb1', '#ffc94a', '#ff6b2c'],
  leaf: ['#1f8a4c', '#a7e07a', '#0f5c35'],
  night: ['#ff4fa3', '#ffb020', '#3ad6ff', '#b7ff3c', '#9a7bff'],
  sunset: ['#3b1cff', '#c42bff', '#ff2e88', '#ff8a00', '#ffe14d'],
};
const SHADOW_INKS = ['#ff2fa0', '#e8303a', '#2b2b7a', '#ffd400'];

const rgb = (hex) => [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16));
const hex = (c) => `#${c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
const luma = (h) => {
  const [r, g, b] = rgb(h);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};
/** A colour along a list of stops, t 0–1 (wraps when `loop`). */
export function ramp(stops, t, loop = false) {
  const n = stops.length - (loop ? 0 : 1);
  t = loop ? ((t % 1) + 1) % 1 : clamp(t);
  const f = t * n;
  const k = Math.min(n - 1, Math.floor(f));
  const a = rgb(stops[k % stops.length]);
  const b = rgb(stops[(k + 1) % stops.length]);
  const u = f - k;
  return hex(a.map((v, i) => v + (b[i] - v) * u));
}
/** A tint toward white (k 0–1). */
const tint = (h, k) => hex(rgb(h).map((v) => v + (255 - v) * k));

// ── Building ─────────────────────────────────────────────────────────────────────────

const fontKey = (v) => v.font ?? (v.weight === 'light' ? 'kyoto-light' : 'kyoto');

/** Loads every typeface a view and its layers use: Map key → { gf, face }. */
const inherit = (view, l) => ({ cols: view.cols, rows: view.rows, text: view.text, latin: view.latin, font: view.font, axes: view.axes, mask: view.mask, ...l });

export async function prepare(view) {
  const keys = new Set();
  const list = view.layers ? view.layers.map((l) => inherit(view, l)) : [view];
  for (const v of list) if (!v.shape && v.kind !== 'carpet' && v.kind !== 'emblem' && v.text) keys.add(fontKey(v));
  if (view.kind === 'emblem') for (const k of emblemFonts(view)) keys.add(k);
  const out = new Map();
  for (const k of keys) out.set(k, await typeface(k));
  return out;
}

/** Builds a scene for a view with its fonts loaded. */
export function build(view, fonts, seed) {
  if (view.layers) return compose(view, fonts, seed);
  if (view.kind === 'emblem') return emblem({ view, fonts, rng: random(seed) });
  const rng = random(seed);
  const cols = view.cols;
  const rows = view.rows ?? cols;
  let grid = null;
  if (view.shape === 'flower') grid = flowerMask(cols, rows, rng, { petals: view.petals ?? 5 });
  else if (view.kind !== 'carpet') {
    const f = fonts.get(fontKey(view));
    const text = f.face.kana || !view.latin ? view.text : view.latin;
    grid = glyphMask(f.gf, text, cols, rows, { ...(view.mask ?? {}), axes: view.axes ?? {} });
  }
  return SCENES[view.kind]({ view, rng, cols, rows, grid });
}

/** Layers: each a partial view on the parent's grid, drawn in order with its own blend. */
function compose(view, fonts, seed) {
  const layers = view.layers.map((l, k) => ({ l, sc: build(inherit(view, l), fonts, seed + k * 101) }));
  return {
    grid: layers[0].sc.grid,
    ground: view.ground ?? layers[0].sc.ground,
    stats: { cells: layers.reduce((n, { sc }) => n + sc.stats.cells, 0), patches: layers.reduce((n, { sc }) => n + sc.stats.patches, 0) },
    layers: layers.length,
    draw(c, W, t, lens) {
      for (const { l, sc } of layers) {
        c.save();
        c.globalCompositeOperation = l.blend ?? 'source-over';
        c.globalAlpha = l.alpha ?? 1;
        sc.draw(c, W, t - (l.delay ?? 0), lens);
        c.restore();
      }
    },
  };
}

// Pointer lens: 1 at the pointer, 0 at `radius` cells.
const lensAt = (lens, x, y, radius = 4.5) => (lens ? clamp(1 - Math.hypot(x + 0.5 - lens.x, y + 0.5 - lens.y) / radius) : 0);

/** How far a cell of build rank `r` of `total` has come in, 0–1, at time t. */
const shown = (r, total, t, span = 0.04) => {
  const head = (t / BUILD) * (1 + span);
  return clamp((head - r / total) / span);
};

/** Like assign(), but each patch draws from the list for its glyph (label). */
function assignBy(p, grid, listFor, rng) {
  const label = new Array(p.count);
  for (let i = 0; i < grid.cells.length; i++) if (p.of[i] >= 0) label[p.of[i]] = grid.cells[i];
  const out = new Array(p.count);
  for (let k = 0; k < p.count; k++) {
    const list = listFor(label[k]);
    const taken = new Set([...p.near[k]].map((j) => out[j]));
    const free = list.filter((v) => !taken.has(v));
    const pool = free.length ? free : list;
    out[k] = pool[Math.floor(rng() * pool.length)];
  }
  return out;
}

function rules(c, cols, rows, s, colour) {
  c.strokeStyle = colour;
  c.lineWidth = Math.max(0.75, s * 0.04);
  c.beginPath();
  for (let k = 0; k <= cols; k++) {
    c.moveTo(k * s, 0);
    c.lineTo(k * s, rows * s);
  }
  for (let k = 0; k <= rows; k++) {
    c.moveTo(0, k * s);
    c.lineTo(cols * s, k * s);
  }
  c.stroke();
}

const SCENES = {
  // Patches of stitched motifs, each its own ink, by default printed over a second ink
  // slightly out of register. Every few seconds a patch changes its stitch. Options:
  // inks, shadows (false: none), blend, sizeBy 'depth' (stitches grow toward the heart of
  // the stroke), weight (line, in cells), labelInks { label: inks }.
  stitch({ view, rng, grid }) {
    const p = patches(grid, rng, view.area ?? 36);
    const inks = view.inks ?? PALETTES.stitch;
    const ink = view.labelInks ? assignBy(p, grid, (L) => view.labelInks[L] ?? inks, rng) : assign(p, inks, rng);
    const shadows = view.shadows === false ? null : (view.shadows ?? SHADOW_INKS);
    const shadow = shadows && ink.map((c) => {
      const free = shadows.filter((s) => s !== c);
      return free[Math.floor(rng() * free.length)] ?? shadows[0];
    });
    const second = view.second ?? SHADOW_INKS[3];
    const two = ink.map((c) => (rng() < 0.5 && c !== second ? second : null));
    const motifs = view.motifs ?? STITCHES;
    const first = assign(p, motifs, rng);
    const seq = first.map((m) => [m, ...Array.from({ length: 7 }, () => motifs[Math.floor(rng() * motifs.length)])]);
    const period = seq.map(() => 4 + rng() * 9);
    const phase = seq.map(() => rng() * 6);
    const depth = view.sizeBy === 'depth' ? distance(grid, (i) => !grid.cells[i]) : null;
    const dmax = depth ? Math.max(2, ...depth) : 1;
    return {
      grid,
      ground: view.ground ?? '#f4f1ea',
      stats: { cells: p.total, patches: p.count },
      draw(c, W, t, lens) {
        const { cols, rows, cells } = grid;
        const s = W / cols;
        c.save();
        c.lineCap = 'round';
        c.lineJoin = 'round';
        c.globalCompositeOperation = view.blend ?? 'multiply';
        for (const pass of shadow ? [0, 1] : [1]) {
          const ox = pass ? 0 : s * 0.07;
          const oy = pass ? 0 : s * 0.05;
          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
              const i = y * cols + x;
              if (!cells[i]) continue;
              const a = shown(p.rank[i], p.total, t);
              if (a <= 0) continue;
              const k = p.of[i];
              const step = t < BUILD ? 0 : Math.floor((t - BUILD + phase[k]) / period[k]) % seq[k].length;
              const l = lensAt(lens, x, y);
              const m = l > 0.35 ? 'block' : seq[k][step];
              c.strokeStyle = c.fillStyle = pass ? ink[k] : shadow[k];
              let sz = s * (0.5 + 0.5 * ease(a));
              if (depth) sz *= 0.5 + 0.6 * clamp((depth[i] - 1) / (dmax * 0.6));
              c.lineWidth = Math.max(0.6, Math.min(s * (view.weight ?? 0.11), sz * 0.16));
              MOTIFS[m](c, x * s + ox + (s - sz) / 2, y * s + oy + (s - sz) / 2, sz, pass ? two[k] : null);
            }
          }
        }
        c.restore();
      },
    };
  },

  // Routed panels: cells joined with rounded ends and filleted inner corners, each glyph
  // (or patch, with by: 'patch') one flat colour, by default on birch with a ruled grid.
  joinery({ view, rng, grid }) {
    const order = strokeOrder(grid);
    const inks = view.inks ?? ['#e5412d', '#16161f', '#0e8a47', '#2443b5'];
    const labels = [...new Set(grid.cells)].filter(Boolean);
    const offset = view.inks ? 0 : Math.floor(rng() * inks.length);
    const p = view.by === 'patch' ? patches(grid, rng, view.area ?? 60) : null;
    const pInk = p && assign(p, inks, rng);
    const groups = p ? pInk.map((col, k) => ({ col, has: (i) => p.of[i] === k })) : labels.map((L) => ({ col: inks[(L - 1 + offset) % inks.length], has: (i) => grid.cells[i] === L }));
    const r = view.radius ?? 0.5;
    return {
      grid,
      ground: view.ground ?? '#e8d9bc',
      stats: { cells: order.total, patches: groups.length },
      draw(c, W, t) {
        const { cols, rows } = grid;
        const s = W / cols;
        for (const g of groups) {
          c.fillStyle = g.col;
          c.fill(blobPath(grid, (i) => g.has(i) && shown(order.rank[i], order.total, t, 0.001) > 0, s, s * r));
        }
        if (view.rule !== false) rules(c, cols, rows, s, view.rule ?? 'rgba(22, 20, 18, 0.7)');
      },
    };
  },

  // A checkerboard of tiles, one letter in each, printed in two inks that sit a little out
  // of register, with the odd speck where the ink skipped. cell: 'blob' or 'coin' (each
  // cell a circle or a square, a coin toss).
  glazed({ view, rng, grid }) {
    const order = strokeOrder(grid);
    const per = view.text[0].length;
    const TILES = view.tiles ?? [
      { ground: '#f39cc4', ink: '#ff3a1c', under: '#ffb300' },
      { ground: '#9d9b3b', ink: '#1d4728', under: '#5a2a6a' },
    ];
    const round = new Uint8Array(grid.cols * grid.rows).map(() => (rng() < 0.5 ? 1 : 0));
    const specks = Array.from({ length: Math.round(grid.cols * grid.rows * 0.01) }, () => [rng() * grid.cols, rng() * grid.rows, 0.06 + rng() * 0.12]);
    const coins = (c, s, has, ox, oy, lens) => {
      c.beginPath();
      for (let i = 0; i < grid.cells.length; i++) {
        if (!has(i)) continue;
        const x = i % grid.cols;
        const y = (i / grid.cols) | 0;
        const flip = lensAt(lens, x, y, 3.5) > 0.3 ? 1 : 0;
        if (round[i] ^ flip) {
          c.moveTo(ox + x * s + s, oy + y * s + s / 2);
          c.arc(ox + x * s + s / 2, oy + y * s + s / 2, s / 2 + 0.2, 0, TAU);
        } else c.rect(ox + x * s - 0.2, oy + y * s - 0.2, s + 0.4, s + 0.4);
      }
      c.fill();
    };
    return {
      grid,
      ground: view.ground ?? '#0d0d0d',
      stats: { cells: order.total, patches: grid.boxes.length },
      draw(c, W, t, lens) {
        const { cells } = grid;
        const s = W / grid.cols;
        c.save();
        grid.boxes.forEach((b, k) => {
          const tile = TILES[(Math.floor(k / per) + (k % per)) % TILES.length];
          c.fillStyle = tile.ground;
          c.fillRect(Math.round(b.x * s), Math.round(b.y * s), Math.round((b.x + b.w) * s) - Math.round(b.x * s), Math.round((b.y + b.h) * s) - Math.round(b.y * s));
          const has = (i) => cells[i] === k + 1 && shown(order.rank[i], order.total, t, 0.001) > 0;
          c.globalCompositeOperation = 'multiply';
          c.fillStyle = tile.under;
          c.globalAlpha = view.underAlpha ?? 0.55;
          if (view.cell === 'coin') coins(c, s, has, s * 0.22, s * 0.16, lens);
          else c.fill(blobPath(grid, has, s, s * 0.5, s * 0.22, s * 0.16));
          c.globalAlpha = 1;
          c.globalCompositeOperation = 'source-over';
          c.fillStyle = tile.ink;
          if (view.cell === 'coin') coins(c, s, has, 0, 0, lens);
          else c.fill(blobPath(grid, has, s, s * 0.5));
        });
        if (t > BUILD * 0.6 && view.specks !== false) {
          c.fillStyle = 'rgba(20, 16, 10, 0.55)';
          for (const [x, y, r] of specks) {
            c.beginPath();
            c.arc(x * s, y * s, r * s, 0, TAU);
            c.fill();
          }
        }
        c.restore();
      },
    };
  },

  // Each cell of the stroke a coloured tile or a ruled blank, numbered in the order the
  // stroke is walked; numbers fall at any of four turns.
  tiles({ view, rng, grid }) {
    const order = strokeOrder(grid);
    const COLS = view.inks ?? ['#f2553c', '#f6a9c9', '#ffd02e', '#169bd9', '#0f9b6c', '#121212'];
    const line = view.line ?? '#1a1a1a';
    const N = grid.cols * grid.rows;
    const fill = new Array(N);
    const sliver = new Float32Array(N);
    const turn = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      if (!grid.cells[i]) continue;
      fill[i] = rng() < (view.blank ?? 0.4) ? null : COLS[Math.floor(rng() * COLS.length)];
      sliver[i] = fill[i] && rng() < 0.12 ? (rng() < 0.5 ? -1 : 1) * (0.18 + rng() * 0.3) : 0;
      turn[i] = rng() < 0.7 ? 0 : 1 + Math.floor(rng() * 3);
    }
    return {
      grid,
      ground: view.ground ?? '#ffffff',
      stats: { cells: order.total, patches: 1 },
      draw(c, W, t, lens) {
        const { cols, rows, cells } = grid;
        const s = W / cols;
        const lw = Math.max(0.75, s * 0.03);
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.font = `500 ${s * 0.38}px "Inter Tight Variable", system-ui, sans-serif`;
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = y * cols + x;
            if (!cells[i] || shown(order.rank[i], order.total, t, 0.002) <= 0) continue;
            const l = lensAt(lens, x, y, 3.5);
            const f = l > 0.3 ? (fill[i] ? null : COLS[(order.rank[i] * 7) % COLS.length]) : fill[i];
            const px = x * s;
            const py = y * s;
            if (f) {
              c.fillStyle = f;
              const sl = sliver[i];
              if (sl && l <= 0.3) c.fillRect(px, py + (sl > 0 ? 0 : s * (1 + sl)), s, s * Math.abs(sl));
              else c.fillRect(px, py, s, s);
            }
            if (!f || sliver[i]) {
              c.strokeStyle = line;
              c.lineWidth = lw;
              c.strokeRect(px + lw / 2, py + lw / 2, s - lw, s - lw);
            }
            c.fillStyle = f && !sliver[i] ? (luma(f) < 0.6 ? '#ffffff' : '#141414') : line;
            c.save();
            c.translate(px + s / 2, py + s / 2);
            if (turn[i]) c.rotate((turn[i] * Math.PI) / 2);
            c.fillText(String(order.rank[i] + 1), 0, s * 0.02);
            c.restore();
          }
        }
      },
    };
  },

  // Every stroke striped across its width, each stripe with its own small mark; squares
  // grow across the stroke and toward the foot of the letter, and a few loose squares trail
  // off at the edges.
  scale({ view, rng, grid }) {
    const { cols, rows, cells } = grid;
    const p = patches(grid, rng, view.area ?? 18);
    const INKS = view.inks ?? ['#ffffff', '#0c1a8f', '#aaa7ff'];
    const MARKS = ['dot', 'dot', 'slash'];
    const markInk = (h) => (luma(h) > 0.75 ? '#0a0a0a' : luma(h) > 0.5 ? INKS[1] : '#ffffff');
    const stripe = new Int8Array(cols * rows);
    const across = new Float32Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; ) {
        if (!cells[y * cols + x]) {
          x++;
          continue;
        }
        let end = x;
        while (end < cols && cells[y * cols + end]) end++;
        const len = end - x;
        // Wide runs (a bar, a bowl's top) stripe by row instead, so stripes follow the stroke.
        for (let k = 0; k < len; k++) {
          const i = y * cols + x + k;
          stripe[i] = (len > 5 ? y : k) % INKS.length;
          across[i] = len > 1 ? k / (len - 1) : 0.5;
        }
        x = end;
      }
    }
    const ink = (i) => INKS[stripe[i]];
    const inside = distance(grid, (i) => !cells[i]);
    const outside = distance(grid, (i) => cells[i] > 0);
    const loose = [];
    for (let i = 0; i < cols * rows; i++) {
      const y = (i / cols) | 0;
      if (outside[i] > 0 && outside[i] <= 2 && rng() < (outside[i] === 1 ? 0.22 : 0.08) * (0.4 + y / rows)) loose.push(i);
    }
    const looseInk = loose.map(() => INKS[Math.floor(rng() * INKS.length)]);
    const square = (c, cx, cy, side, col) => {
      c.fillStyle = col;
      c.fillRect(cx - side / 2, cy - side / 2, side, side);
    };
    return {
      grid,
      ground: view.ground ?? '#000000',
      stats: { cells: p.total, patches: p.count },
      draw(c, W, t, lens) {
        const s = W / cols;
        for (let i = 0; i < cols * rows; i++) {
          if (!cells[i]) continue;
          const a = shown(p.rank[i], p.total, t, 0.08);
          if (a <= 0) continue;
          const x = i % cols;
          const y = (i / cols) | 0;
          const v = clamp(0.15 + 0.45 * (y / rows) + 0.4 * across[i] + 0.6 * lensAt(lens, x, y, 5));
          const side = s * (0.3 + 0.64 * v) * ease(a);
          const cx = x * s + s / 2;
          const cy = y * s + s / 2;
          square(c, cx, cy, side, ink(i));
          if (side < s * 0.3) continue;
          c.fillStyle = c.strokeStyle = markInk(ink(i));
          c.lineWidth = Math.max(0.75, s * 0.05);
          const m = inside[i] >= 3 ? 'box' : MARKS[stripe[i] % MARKS.length];
          if (m === 'dot') {
            c.beginPath();
            c.arc(cx, cy, side * 0.11, 0, TAU);
            c.fill();
          } else if (m === 'slash') {
            c.beginPath();
            c.moveTo(cx - side * 0.16, cy + side * 0.16);
            c.lineTo(cx + side * 0.16, cy - side * 0.16);
            c.stroke();
          } else {
            c.strokeRect(cx - side * 0.2, cy - side * 0.2, side * 0.4, side * 0.4);
          }
        }
        if (t > BUILD * 0.8) {
          loose.forEach((i, n) => {
            const x = i % cols;
            const y = (i / cols) | 0;
            square(c, x * s + s / 2, y * s + s / 2, s * (0.14 + 0.08 * (y / rows)), looseInk[n]);
          });
        }
      },
    };
  },

  // Circles and squares on one grid, each cell a coin toss; the pointer turns them over.
  // Inks by glyph (default) or by patch (by: 'patch'), optionally over a shadow ink.
  mix({ view, rng, grid }) {
    const { cols, rows } = grid;
    const p = patches(grid, rng, view.area ?? 20);
    const round = new Uint8Array(cols * rows).map(() => (rng() < (view.round ?? 0.55) ? 1 : 0));
    const inks = view.inks ?? ['#ff1a14', '#0c6b3c'];
    const pInk = view.by === 'patch' ? (view.labelInks ? assignBy(p, grid, (L) => view.labelInks[L] ?? inks, rng) : assign(p, inks, rng)) : null;
    const inkOf = (i) => (pInk ? pInk[p.of[i]] : inks[(grid.cells[i] - 1) % inks.length]);
    return {
      grid,
      ground: view.ground ?? '#ffffff',
      stats: { cells: p.total, patches: pInk ? p.count : new Set(grid.cells).size - 1 },
      draw(c, W, t, lens) {
        const s = W / cols;
        c.save();
        for (const pass of view.shadow ? [0, 1] : [1]) {
          const o = pass ? 0 : s * 0.16;
          if (!pass) c.globalCompositeOperation = 'multiply';
          else c.globalCompositeOperation = view.blend ?? 'source-over';
          for (let i = 0; i < cols * rows; i++) {
            if (!grid.cells[i]) continue;
            const a = shown(p.rank[i], p.total, t, 0.06);
            if (a <= 0) continue;
            const x = i % cols;
            const y = (i / cols) | 0;
            const flip = lensAt(lens, x, y, 3.5) > 0.3;
            const side = s * ease(a);
            c.fillStyle = pass ? inkOf(i) : view.shadow;
            c.beginPath();
            if (round[i] !== +flip) c.arc(o + x * s + s / 2, o + y * s + s / 2, side / 2 + 0.25, 0, TAU);
            else c.rect(o + x * s + (s - side) / 2 - 0.25, o + y * s + (s - side) / 2 - 0.25, side + 0.5, side + 0.5);
            c.fill();
          }
        }
        c.restore();
      },
    };
  },

  // A rug of four square panels laid in mosaic tiles: frames, bands, crenellations, an
  // octagon, a target, a checker border. Shapes made only of cells.
  carpet({ view, rng, cols, rows }) {
    const C = { sky: '#9ed2f2', cobalt: '#1f4fd8', red: '#e63a2a', orange: '#f59a2c', pink: '#f4c3dc', green: '#249a4a', mint: '#90d6a8', white: '#ffffff', navy: '#14286e', yellow: '#ffd23a' };
    const m = view.margin ?? 2;
    const g = view.gap ?? 1;
    const q = Math.floor((cols - 2 * m - g) / 2);
    const ring = (x, y) => Math.min(x, y, q - 1 - x, q - 1 - y);
    const PROGRAMS = {
      bands: (x, y) => {
        const r = ring(x, y);
        if (r === 0) return C.sky;
        if (r <= 2) return C.cobalt;
        const band = Math.floor((y - 3) / Math.max(1, Math.floor((q - 6) / 3)));
        return [C.red, C.orange, C.red][Math.min(2, band)];
      },
      crenel: (x, y) => {
        const band = Math.floor(y / 3);
        const row = y % 3;
        if (band % 2 === 0) return row === 0 && x % 2 === 1 ? C.white : C.red;
        return row === 1 && x % 2 === 1 ? C.white : C.cobalt;
      },
      window: (x, y) => {
        const r = ring(x, y);
        if (r === 0) return C.sky;
        if (r === 1) return y === 1 && x > 1 && x < q - 2 && x % 2 === 0 ? C.sky : C.cobalt;
        if (r === 2) return C.sky;
        if (r === 3) return C.cobalt;
        if (r === 4) return C.sky;
        return C.white;
      },
      octagon: (x, y) => {
        const c = (q - 1) / 2;
        const dx = Math.abs(x - c);
        const dy = Math.abs(y - c);
        const d = Math.max(dx, dy, (dx + dy) * 0.74);
        if (d > c + 0.2) return C.pink;
        if (d > c - 1.6) return (x + y) % 6 < 3 ? C.green : C.red;
        return C.mint;
      },
      target: (x, y) => [C.yellow, C.red, C.white, C.navy, C.yellow, C.red, C.white][ring(x, y) % 7],
      checker: (x, y) => {
        const r = ring(x, y);
        const c = (q - 1) / 2;
        if (r <= 1) return (x + y) % 2 ? C.orange : C.white;
        if (Math.abs(x - c) < 1 || Math.abs(y - c) < 1) return C.white;
        return C.cobalt;
      },
    };
    const names = Object.keys(PROGRAMS).sort(() => rng() - 0.5).slice(0, 4);
    const colour = new Array(cols * rows).fill(null);
    const order = new Float32Array(cols * rows);
    names.forEach((name, k) => {
      const qx = m + (k % 2) * (q + g);
      const qy = m + Math.floor(k / 2) * (q + g);
      for (let y = 0; y < q; y++) {
        for (let x = 0; x < q; x++) {
          const i = (qy + y) * cols + qx + x;
          colour[i] = PROGRAMS[name](x, y);
          order[i] = (k + ring(x, y) / (q / 2)) / 4;
        }
      }
    });
    const grid = shapeMask(cols, rows, (x, y) => (colour[y * cols + x] ? 1 : 0));
    const ALL = Object.values(C);
    return {
      grid,
      ground: '#f4f2ee',
      stats: { cells: colour.filter(Boolean).length, patches: 4 },
      programs: names,
      draw(c, W, t, lens) {
        const s = W / cols;
        const inset = s * 0.06;
        for (let i = 0; i < cols * rows; i++) {
          if (!colour[i]) continue;
          const a = clamp((t / BUILD) * 1.2 - order[i]) * 4;
          if (a <= 0) continue;
          const x = i % cols;
          const y = (i / cols) | 0;
          const l = lensAt(lens, x, y, 3);
          c.fillStyle = l > 0.3 ? ALL[(ALL.indexOf(colour[i]) + 3) % ALL.length] : colour[i];
          const side = (s - inset * 2) * ease(clamp(a));
          c.beginPath();
          c.roundRect(x * s + (s - side) / 2, y * s + (s - side) / 2, side, side, s * 0.08);
          c.fill();
        }
      },
    };
  },

  // The carpet's frames, laid around a letter: rings that follow the glyph's own outline,
  // inward through the strokes and outward into a halo. cell: 'tile' (mosaic), 'blob'
  // (moulded bands), 'dot'. tiles: a checker of { ground, inks } per glyph box.
  contour({ view, rng, grid }) {
    const { cols, rows, cells } = grid;
    const inside = distance(grid, (i) => !cells[i]);
    const outside = distance(grid, (i) => cells[i] > 0);
    const band = view.band ?? 1;
    const halo = view.halo ?? 0;
    const inks = view.inks ?? PALETTES.tropic;
    const haloInks = view.haloInks ?? inks.map((h) => tint(h, 0.72));
    const per = view.text?.[0]?.length ?? 1;
    const tileOf = (L) => (view.tiles ? view.tiles[(Math.floor((L - 1) / per) + ((L - 1) % per)) % view.tiles.length] : null);
    // Which glyph each halo cell belongs to: the nearest one.
    const owner = new Int16Array(cols * rows);
    {
      const q = [];
      for (let i = 0; i < cols * rows; i++) if (cells[i]) (owner[i] = cells[i]), q.push(i);
      for (let h = 0; h < q.length; h++) {
        const i = q[h];
        const x = i % cols;
        const y = (i / cols) | 0;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
          const j = ny * cols + nx;
          if (!owner[j]) (owner[j] = owner[i]), q.push(j);
        }
      }
    }
    // Level: 0, 1, 2… inward from the edge; −1, −2… outward.
    const level = new Int16Array(cols * rows);
    let maxIn = 0;
    for (let i = 0; i < cols * rows; i++) {
      if (cells[i]) level[i] = Math.floor((inside[i] - 1) / band);
      else if (outside[i] <= halo) level[i] = -1 - Math.floor((outside[i] - 1) / band);
      else level[i] = -999;
      maxIn = Math.max(maxIn, level[i]);
    }
    const minOut = halo ? -1 - Math.floor((halo - 1) / band) : 0;
    const box = (i) => {
      if (!view.tiles) return true;
      const b = grid.boxes[owner[i] - 1];
      const x = i % cols;
      const y = (i / cols) | 0;
      return b && x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h;
    };
    const colourAt = (i, shift) => {
      const L = level[i];
      const t = tileOf(owner[i]);
      const set = L >= 0 ? (t?.inks ?? inks) : (t?.halo ?? haloInks);
      const k = L >= 0 ? L : -L - 1;
      return set[(((k + shift) % set.length) + set.length) % set.length];
    };
    // Build: the edge first, then inward through the strokes and outward through the halo.
    const at = (L, t) => clamp(((t / BUILD) * 1.3 - (L >= 0 ? L / (maxIn + 1) : 0.3 + (L / (minOut || -1)) * 0.7)) * 3);
    const owners = [...new Set(owner)].filter(Boolean);
    let blobs = null;
    return {
      grid,
      ground: view.ground ?? '#fbf7f0',
      stats: { cells: cells.filter(Boolean).length, patches: maxIn + 1 - minOut },
      draw(c, W, t, lens) {
        const s = W / cols;
        const flow = view.flow && t > BUILD ? Math.floor((t - BUILD) * 2) : 0;
        if (view.tiles) {
          grid.boxes.forEach((b, k) => {
            c.fillStyle = tileOf(k + 1).ground;
            c.fillRect(Math.round(b.x * s), Math.round(b.y * s), Math.round((b.x + b.w) * s) - Math.round(b.x * s), Math.round((b.y + b.h) * s) - Math.round(b.y * s));
          });
        }
        if (view.cell === 'blob') {
          // Nested: each level's blob covers everything inward of it, outermost first, one
          // blob per glyph so each can keep its tile's inks.
          if (!blobs || blobs.W !== W) blobs = { W, paths: new Map() };
          for (let L = minOut; L <= maxIn; L++) {
            if (at(L, t) <= 0) continue;
            for (const g of owners) {
              const key = `${L}:${g}`;
              let path = blobs.paths.get(key);
              if (!path) blobs.paths.set(key, (path = blobPath(grid, (i) => level[i] >= L && owner[i] === g && box(i), s, s * 0.5)));
              const t0 = tileOf(g);
              const set = L >= 0 ? (t0?.inks ?? inks) : (t0?.halo ?? haloInks);
              const k = (L >= 0 ? L : -L - 1) - flow;
              c.fillStyle = set[((k % set.length) + set.length) % set.length];
              c.fill(path);
            }
          }
          return;
        }
        const inset = view.cell === 'dot' ? 0 : s * (view.grout ?? 0.07);
        for (let i = 0; i < cols * rows; i++) {
          const L = level[i];
          if (L === -999 || !box(i)) continue;
          const a = at(L, t);
          if (a <= 0) continue;
          const x = i % cols;
          const y = (i / cols) | 0;
          c.fillStyle = colourAt(i, (lensAt(lens, x, y, 4) > 0.3 ? 1 : 0) - flow);
          const side = (s - inset * 2) * ease(clamp(a));
          c.beginPath();
          if (view.cell === 'dot') c.arc(x * s + s / 2, y * s + s / 2, side * 0.46, 0, TAU);
          else c.roundRect(x * s + (s - side) / 2, y * s + (s - side) / 2, side, side, s * 0.1);
          c.fill();
        }
      },
    };
  },

  // The numbered walk drawn as a thread: each cell joined to the one it was reached from,
  // in a colour that runs along the walk, with a bead at every cell and a needle that
  // travels the stroke once it's built.
  thread({ view, rng, grid }) {
    const order = strokeOrder(grid, { orthogonal: view.steps === 'orthogonal' });
    const stops = view.inks ?? PALETTES.sunset;
    const bead = view.bead ?? null;
    return {
      grid,
      ground: view.ground ?? '#0f0e1a',
      stats: { cells: order.total, patches: 1 },
      draw(c, W, t, lens) {
        const { cols, cells } = grid;
        const s = W / cols;
        c.save();
        c.lineCap = 'round';
        const centre = (i) => [(i % cols) * s + s / 2, ((i / cols) | 0) * s + s / 2];
        for (let i = 0; i < cells.length; i++) {
          if (!cells[i]) continue;
          const a = shown(order.rank[i], order.total, t, 0.002);
          if (a <= 0) continue;
          const [x, y] = centre(i);
          const l = lensAt(lens, i % cols, (i / cols) | 0, 4);
          c.strokeStyle = c.fillStyle = ramp(stops, order.rank[i] / order.total);
          c.lineWidth = s * ((view.weight ?? 0.42) + 0.3 * l);
          const par = order.parent[i];
          if (par >= 0) {
            const [px, py] = centre(par);
            c.beginPath();
            c.moveTo(px, py);
            c.lineTo(x, y);
            c.stroke();
          } else {
            c.beginPath();
            c.arc(x, y, s * 0.42, 0, TAU);
            c.fill();
          }
        }
        if (bead) {
          c.fillStyle = bead;
          for (let i = 0; i < cells.length; i++) {
            if (!cells[i] || shown(order.rank[i], order.total, t, 0.002) <= 0) continue;
            const [x, y] = centre(i);
            c.beginPath();
            c.arc(x, y, s * 0.09, 0, TAU);
            c.fill();
          }
        }
        if (t > BUILD) {
          // The needle: a bright bead running the walk, with a short tail.
          const head = ((t - BUILD) * 60) % order.total;
          for (let i = 0; i < cells.length; i++) {
            if (!cells[i]) continue;
            const d = head - order.rank[i];
            if (d < 0 || d > 14) continue;
            const [x, y] = centre(i);
            c.fillStyle = view.needle ?? '#ffffff';
            c.globalAlpha = 1 - d / 14;
            c.beginPath();
            c.arc(x, y, s * (0.24 - d * 0.01), 0, TAU);
            c.fill();
          }
        }
        c.restore();
      },
    };
  },

  // Halftone: a dot in every cell, its size from how deep it sits in the stroke (edges from
  // the glyph's own coverage), its colour from a gradient across the sheet. field: tiny
  // dots everywhere else, so the letter sits in a screen.
  halftone({ view, rng, grid }) {
    const { cols, rows, cells, cov } = grid;
    const inside = distance(grid, (i) => !cells[i]);
    const stops = view.inks ?? PALETTES.sunset;
    const g = (x, y) => (view.gradient === 'radial' ? Math.hypot(x / cols - 0.5, y / rows - 0.5) * 1.6 : view.gradient === 'vertical' ? y / rows : (x / cols + y / rows) / 2);
    const order = strokeOrder(grid);
    return {
      grid,
      ground: view.ground ?? '#fff8ef',
      stats: { cells: order.total, patches: 1 },
      draw(c, W, t, lens) {
        const s = W / cols;
        const drift = t > BUILD ? (t - BUILD) * 0.03 : 0;
        for (let i = 0; i < cols * rows; i++) {
          const x = i % cols;
          const y = (i / cols) | 0;
          const l = lensAt(lens, x, y, 5);
          let r;
          if (cells[i]) {
            const a = shown(order.rank[i], order.total, t, 0.05);
            if (a <= 0) continue;
            r = (s / 2) * clamp(0.42 + 0.16 * (inside[i] - 1) + 0.4 * l, 0, view.max ?? 1.08) * ease(a);
          } else if (cov && cov[i] > 0.08) r = (s / 2) * clamp(cov[i] * 0.8 + 0.3 * l);
          else if (view.field) r = s * (0.05 + 0.15 * l);
          else continue;
          c.fillStyle = cells[i] || (cov && cov[i] > 0.08) ? ramp(stops, g(x, y) + drift, view.loop) : (view.fieldInk ?? tint(stops[0], 0.75));
          c.beginPath();
          c.arc(x * s + s / 2, y * s + s / 2, r, 0, TAU);
          c.fill();
        }
      },
    };
  },
};
