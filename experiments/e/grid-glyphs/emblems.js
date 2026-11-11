// Emblems for 2 Grid Glyphs: objects built from grid cells, a word knocked out of each,
// with stitched ornaments around them, on black. After a cross-stitch book cover (a fish
// and a vase, their names set vertically in the negative space, foil and fluoro inks) and
// a dot-matrix film whose dots stretch into ovals and merge as a wave runs through them.
import { clamp, glyphMask } from './grid.js';

const TAU = Math.PI * 2;

// ── Colour ───────────────────────────────────────────────────────────────────────────

const rgb = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
const hex = (c) => `#${c.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('')}`;
const mix = (a, b, t) => hex(rgb(a).map((v, i) => v + (rgb(b)[i] - v) * t));
function ramp(stops, t) {
  if (stops.length === 1) return stops[0];
  const f = clamp(t) * (stops.length - 1);
  const k = Math.min(stops.length - 2, Math.floor(f));
  return mix(stops[k], stops[k + 1], f - k);
}

/** Saturated inks for a black ground. */
export const INKS = {
  gold: ['#fff200', '#ffb000', '#ff6a00'],
  lime: ['#c6ff00', '#00e05a', '#00c2ff'],
  magenta: ['#ff00a8', '#ff2a2a', '#ff8a00'],
  blue: ['#0038ff', '#0090ff', '#00f0ff'],
  violet: ['#7a00ff', '#d400ff', '#ff00a8'],
  fire: ['#ffe100', '#ff5a00', '#ff0055'],
  orange: ['#ff5a1f'],
  red: ['#ff1f3d'],
  cyan: ['#00e5ff'],
  green: ['#00e05a'],
  pink: ['#ff3fb4'],
};

// ── Shapes: half-width (a fraction of the item's width) down its height ───────────────

const PROFILES = {
  vase: [[0, 0.2], [0.05, 0.26], [0.09, 0.16], [0.22, 0.13], [0.34, 0.3], [0.52, 0.48], [0.7, 0.42], [0.83, 0.22], [0.9, 0.15], [0.94, 0.24], [1, 0.28]],
  fish: [[0, 0.05], [0.06, 0.2], [0.16, 0.34], [0.3, 0.46], [0.45, 0.48], [0.6, 0.4], [0.72, 0.22], [0.78, 0.1], [0.82, 0.14], [0.9, 0.34], [0.97, 0.48], [1, 0.48]],
  bottle: [[0, 0.11], [0.04, 0.13], [0.07, 0.1], [0.24, 0.1], [0.33, 0.27], [0.4, 0.38], [0.92, 0.38], [1, 0.34]],
  lantern: [[0, 0.2], [0.05, 0.2], [0.07, 0.32], [0.16, 0.43], [0.5, 0.49], [0.84, 0.43], [0.93, 0.32], [0.95, 0.2], [1, 0.2]],
  bell: [[0, 0.05], [0.05, 0.09], [0.08, 0.16], [0.2, 0.24], [0.55, 0.3], [0.75, 0.36], [0.88, 0.47], [0.93, 0.49], [0.95, 0.12], [1, 0.12]],
  pear: [[0, 0.04], [0.07, 0.06], [0.12, 0.14], [0.3, 0.2], [0.48, 0.32], [0.7, 0.47], [0.86, 0.45], [0.96, 0.3], [1, 0.16]],
  goblet: [[0, 0.46], [0.32, 0.42], [0.46, 0.26], [0.52, 0.08], [0.8, 0.08], [0.88, 0.26], [1, 0.38]],
};

const halfWidth = (profile, t) => {
  for (let k = 1; k < profile.length; k++) {
    const [t1, w1] = profile[k];
    const [t0, w0] = profile[k - 1];
    if (t <= t1) return w0 + ((w1 - w0) * (t - t0)) / Math.max(1e-6, t1 - t0);
  }
  return profile.at(-1)[1];
};

// Cell kinds.
const BODY = 1;
const LETTER = 2;
const ORNAMENT = 3;

/** Lays every item of a view onto one grid: kind, owning item and gradient position per cell. */
function layout(view, fonts) {
  const cols = view.cols;
  const rows = view.rows ?? cols;
  const N = cols * rows;
  const kind = new Uint8Array(N);
  const owner = new Int16Array(N).fill(-1);
  const put = (x, y, k, n) => {
    if (x < 0 || y < 0 || x >= cols || y >= rows) return;
    const i = y * cols + x;
    if (kind[i] && k === BODY) return;
    kind[i] = k;
    owner[i] = n;
  };
  const items = view.items.map((it) => ({ ...it, top: it.y, height: it.h ?? it.r * 2 + 1 }));

  items.forEach((it, n) => {
    if (it.shape) {
      // The silhouette on the item's own grid, upright or lying on its side.
      const { w, h } = it;
      const m = new Uint8Array(w * h);
      const P = PROFILES[it.shape];
      if (!it.horizontal) {
        for (let j = 0; j < h; j++) {
          const hw = halfWidth(P, (j + 0.5) / h) * w;
          for (let i = 0; i < w; i++) if (Math.abs(i + 0.5 - w / 2) <= hw) m[j * w + i] = 1;
        }
      } else {
        for (let i = 0; i < w; i++) {
          const hh = halfWidth(P, (i + 0.5) / w) * h;
          for (let j = 0; j < h; j++) if (Math.abs(j + 0.5 - h / 2) <= hh) m[j * w + i] = 1;
        }
      }
      for (let k = 0; k < w * h; k++) if (m[k]) put(it.x + (k % w), it.y + ((k / w) | 0), BODY, n);
      // Stitched teeth on every other row (or column) down both edges.
      if (it.teeth !== false) {
        const lines = it.horizontal ? w : h;
        for (let l = 2; l < lines - 1; l += 2) {
          let lo = -1;
          let hi = -1;
          const len = it.horizontal ? h : w;
          for (let q = 0; q < len; q++) {
            const k = it.horizontal ? q * w + l : l * w + q;
            if (m[k]) (lo = lo < 0 ? q : lo), (hi = q);
          }
          if (lo < 0) continue;
          if (it.horizontal) (put(it.x + l, it.y + lo - 1, BODY, n), put(it.x + l, it.y + hi + 1, BODY, n));
          else (put(it.x + lo - 1, it.y + l, BODY, n), put(it.x + hi + 1, it.y + l, BODY, n));
        }
      }
      if (it.word) knockWord(it, n, m);
      if (it.eye) {
        const [ex, ey] = [Math.round(it.eye[0] * w), Math.round(it.eye[1] * h)];
        for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
          const gi = (it.y + ey + dy) * cols + it.x + ex + dx;
          if (kind[gi] === BODY && owner[gi] === n) kind[gi] = LETTER;
        }
      }
    } else if (it.word) {
      // A word on its own: its cells are the body.
      const f = fonts.get(it.font ?? 'kyoto');
      const text = f.face.kana || !it.latin ? it.word : it.latin;
      const g = glyphMask(f.gf, Array.isArray(text) ? text : [text], it.w, it.h, { margin: 0, gap: it.gap ?? 2, axes: it.axes ?? {}, threshold: it.threshold ?? 0.5 });
      for (let j = 0; j < it.h; j++) for (let i = 0; i < it.w; i++) if (g.cells[j * it.w + i]) put(it.x + i, it.y + j, BODY, n);
    } else if (it.ornament === 'diamonds') {
      for (let k = 0; k < (it.n ?? 3); k++) {
        const cy = it.y + it.r + k * (2 * it.r + 1);
        for (let dy = -it.r; dy <= it.r; dy++) for (let dx = -it.r; dx <= it.r; dx++) if (Math.abs(dx) + Math.abs(dy) <= it.r) put(it.x + dx, cy + dy, ORNAMENT, n);
      }
      it.top = it.y;
      it.height = (it.n ?? 3) * (2 * it.r + 1);
    } else if (it.ornament === 'rosette') {
      const R = it.r;
      for (let dy = -R - 2; dy <= R + 2; dy++) {
        for (let dx = -R - 2; dx <= R + 2; dx++) {
          const d = Math.hypot(dx, dy);
          const a = Math.atan2(dy, dx);
          const spoke = Math.abs(Math.sin(4 * a)) * d < 0.75 && d <= R + 0.5;
          const ring = d > R * 0.55 && d < R * 0.55 + 1.1;
          const hub = d < 1.3;
          const knob = Math.abs(Math.sin(4 * a)) * d < 1.2 && d > R + 0.5 && d < R + 2.2;
          if (spoke || ring || hub || knob) put(it.x + dx, it.y + dy, ORNAMENT, n);
        }
      }
      it.top = it.y - R - 2;
      it.height = 2 * R + 5;
    } else if (it.ornament === 'border') {
      // A running border of small diamonds and dots.
      for (let i = 0; i < it.w; i++) {
        const k = i % 4;
        if (k === 0) put(it.x + i, it.y + 1, ORNAMENT, n);
        if (k === 2) for (const [dx, dy] of [[0, 0], [-1, 1], [1, 1], [0, 1], [0, 2]]) put(it.x + i + dx, it.y + dy, ORNAMENT, n);
      }
      it.top = it.y;
      it.height = 3;
    }
  });

  /**
   * Sets a word inside an object as large as fits: one glyph per line (dir 'v') or one
   * line (dir 'h'), its box kept `pad` cells inside the silhouette, nearest wordAt.
   */
  function knockWord(it, n, m) {
    const { w, h } = it;
    const f = fonts.get(it.font ?? 'kyoto');
    const word = f.face.kana || !it.latin ? it.word : it.latin;
    const vertical = (it.dir ?? (it.horizontal ? 'h' : 'v')) === 'v';
    // Lines of the word: given, one glyph per line (vertical), or one line.
    const lines = Array.isArray(word) ? word : vertical ? [...word] : [word];
    const longest = Math.max(...lines.map((l) => [...l].length));
    const gap = it.gap ?? 1;
    const pad = it.pad ?? 1;
    // Prefix sums of cells outside the silhouette, to test a box in one step.
    const out = new Int32Array((w + 1) * (h + 1));
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) out[(j + 1) * (w + 1) + i + 1] = (m[j * w + i] ? 0 : 1) + out[j * (w + 1) + i + 1] + out[(j + 1) * (w + 1) + i] - out[j * (w + 1) + i];
    const clear = (x0, y0, x1, y1) => x0 >= 0 && y0 >= 0 && x1 <= w && y1 <= h && out[y1 * (w + 1) + x1] - out[y0 * (w + 1) + x1] - out[y1 * (w + 1) + x0] + out[y0 * (w + 1) + x0] === 0;
    const [tx, ty] = [(it.wordX ?? 0.5) * w, (it.wordAt ?? 0.5) * h];
    for (let H = Math.min(h, w); H >= 4; H--) {
      const glyphW = Math.round(H * (it.aspect ?? 0.95));
      const bw = longest * glyphW + (longest - 1) * gap;
      const bh = lines.length * H + (lines.length - 1) * gap;
      let best = null;
      for (let y = 0; y + bh <= h; y++) {
        for (let x = 0; x + bw <= w; x++) {
          if (!clear(x - pad, y - pad, x + bw + pad, y + bh + pad)) continue;
          const d = Math.hypot(x + bw / 2 - tx, y + bh / 2 - ty);
          if (!best || d < best.d) best = { x, y, d };
        }
      }
      if (!best) continue;
      const g = glyphMask(f.gf, lines, bw, bh, { margin: 0, gap, axes: it.axes ?? {}, threshold: it.threshold ?? 0.35 });
      for (let j = 0; j < bh; j++) {
        for (let i = 0; i < bw; i++) {
          if (!g.cells[j * bw + i]) continue;
          const gi = (it.y + best.y + j) * cols + it.x + best.x + i;
          if (kind[gi] === BODY && owner[gi] === n) kind[gi] = LETTER;
        }
      }
      return;
    }
  }

  return { cols, rows, kind, owner, items };
}

/**
 * The emblem scene. view.cell: 'perforated' (a square with a hole punched in it), 'oval'
 * (dots that stretch and merge in a travelling wave), 'cross' (a cross-stitch), 'bead'.
 * view.knock: how the word's cells show: 'dot' (a small bright dot) or 'clear'.
 */
export function emblem({ view, fonts }) {
  const g = layout(view, fonts);
  const { cols, rows, kind, owner, items } = g;
  const ground = view.ground ?? '#000000';
  const build = (i) => {
    const it = items[owner[i]];
    const y = (i / cols) | 0;
    return clamp((y - it.top) / Math.max(1, it.height)) * 0.7 + (owner[i] / items.length) * 0.3;
  };
  const filled = kind.reduce((n, k) => n + (k ? 1 : 0), 0);
  return {
    grid: { cols, rows, cells: kind },
    ground,
    stats: { cells: filled, patches: items.length },
    draw(c, W, t, lens) {
      const s = W / cols;
      const BUILD = 2.4;
      const sheen = t > BUILD ? (((t - BUILD) * 0.22) % 1.6) - 0.3 : -9;
      for (let i = 0; i < cols * rows; i++) {
        const x = i % cols;
        const y = (i / cols) | 0;
        const cx = x * s + s / 2;
        const cy = y * s + s / 2;
        const k = kind[i];
        const lensV = lens ? clamp(1 - Math.hypot(x + 0.5 - lens.x, y + 0.5 - lens.y) / 5) : 0;
        // The film's wave: dots swell and stretch sideways as it passes.
        const wave = view.cell === 'oval' ? 0.5 + 0.5 * Math.sin(x * 0.22 + y * 0.09 - t * 1.6) : 0;
        if (!k) {
          if (view.field && view.cell === 'oval') {
            const r = s * 0.5 * (0.08 + 0.22 * wave ** 3 + 0.3 * lensV);
            c.fillStyle = view.field;
            c.beginPath();
            c.ellipse(cx, cy, r * 1.4, r, 0, 0, TAU);
            c.fill();
          }
          continue;
        }
        const a = clamp(((t / BUILD) * 1.25 - build(i)) * 5);
        if (a <= 0) continue;
        const it = items[owner[i]];
        const ty = clamp((y - it.top) / Math.max(1, it.height - 1));
        let ink = ramp(it.inks ?? INKS.gold, ty);
        if (it.ribs && k === BODY && (y - it.top) % it.ribs === 0) ink = mix(ink, '#000000', 0.45);
        // A glint that runs down the foil.
        const glint = clamp(1 - Math.abs(ty - sheen) / 0.07);
        if (glint > 0 && it.foil !== false) ink = mix(ink, '#ffffff', glint * 0.55);
        const e = 1 - (1 - a) ** 3;
        if (k === LETTER) {
          if (view.knock === 'clear') continue;
          if (view.knock === 'dot') {
            c.fillStyle = it.letter ?? '#ffffff';
            c.beginPath();
            c.arc(cx, cy, s * (0.17 + 0.12 * lensV) * e, 0, TAU);
            c.fill();
            continue;
          }
          ink = it.letter ?? '#ffffff';
        }
        c.fillStyle = ink;
        c.strokeStyle = ink;
        const cell = it.cell ?? view.cell ?? 'perforated';
        if (cell === 'perforated') {
          const g0 = s * 0.06;
          const side = (s - 2 * g0) * e;
          c.fillRect(cx - side / 2, cy - side / 2, side, side);
          c.fillStyle = ground;
          c.beginPath();
          c.arc(cx, cy, s * (0.2 + 0.14 * lensV) * e, 0, TAU);
          c.fill();
        } else if (cell === 'oval') {
          const rx = s * 0.5 * (0.45 + 0.75 * wave + 0.3 * lensV) * e;
          const ry = s * 0.5 * (0.7 + 0.25 * (1 - wave)) * e;
          c.beginPath();
          c.ellipse(cx, cy, rx, ry, 0, 0, TAU);
          c.fill();
        } else if (cell === 'cross') {
          c.lineWidth = s * 0.17;
          c.lineCap = 'round';
          const r = s * 0.36 * e;
          c.beginPath();
          c.moveTo(cx - r, cy - r);
          c.lineTo(cx + r, cy + r);
          c.moveTo(cx + r, cy - r);
          c.lineTo(cx - r, cy + r);
          c.stroke();
        } else {
          c.beginPath();
          c.arc(cx, cy, s * 0.46 * e, 0, TAU);
          c.fill();
          c.fillStyle = ground;
          c.beginPath();
          c.arc(cx, cy, s * (0.14 + 0.12 * lensV) * e, 0, TAU);
          c.fill();
        }
      }
    },
  };
}

/** Typeface keys an emblem view uses. */
export const emblemFonts = (view) => (view.items ?? []).filter((it) => it.word).map((it) => it.font ?? 'kyoto');
