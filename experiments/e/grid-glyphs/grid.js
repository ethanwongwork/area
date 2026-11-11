// The grid engine for 2 Grid Glyphs.
//
// A form (a glyph from a font, or a drawn shape) is rasterised onto a grid of cells. The
// filled cells are cut into patches that grow along the strokes, each patch takes an ink
// and a motif, and a renderer draws every cell from a small vocabulary: stitches, blocks
// with filleted corners, numbered tiles, squares that scale, circles and squares, mosaic.

const TAU = Math.PI * 2;
const STRETCH = [
  [50, 'ultra-condensed'],
  [62.5, 'extra-condensed'],
  [75, 'condensed'],
  [87.5, 'semi-condensed'],
  [100, 'normal'],
  [112.5, 'semi-expanded'],
  [125, 'expanded'],
  [150, 'extra-expanded'],
  [200, 'ultra-expanded'],
];
export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

// ── Masks ────────────────────────────────────────────────────────────────────────────

/**
 * Lays glyphs out in rows of boxes on a cols × rows grid and samples their coverage.
 * Every glyph shares one scale, so a set reads as one size. Cells hold the glyph's
 * label (1, 2, …) or 0.
 */
export function glyphMask(gf, lines, cols, rows, { margin = 2, gap = 2, inset = 0, threshold = 0.5, axes = {}, offset = [0, 0], scale: fixedScale = null } = {}) {
  const R = 8; // px per cell when sampling
  const n = lines.length;
  const boxH = (rows - 2 * margin - gap * (n - 1)) / n;
  const items = [];
  lines.forEach((line, r) => {
    const chars = [...line];
    const boxW = (cols - 2 * margin - gap * (chars.length - 1)) / chars.length;
    chars.forEach((ch, c) => {
      const id = gf.css ? ch : gf.font.glyphForCodePoint(ch.codePointAt(0)).id;
      const box = { x: margin + c * (boxW + gap), y: margin + r * (boxH + gap), w: boxW, h: boxH };
      items.push({ ch, id, box });
    });
  });
  // Browser-drawn fonts: set the weight and width, then measure each glyph's ink box.
  const css = gf.css && new OffscreenCanvas(8, 8).getContext('2d');
  const setFont = (x, size) => {
    x.font = `${axes.wght ?? 400} ${size}px "${gf.css}"`;
    x.fontStretch = STRETCH.reduce((a, b) => (Math.abs(b[0] - (axes.wdth ?? 100)) < Math.abs(a[0] - (axes.wdth ?? 100)) ? b : a))[1];
    x.textBaseline = 'alphabetic';
  };
  if (css) setFont(css, 1000);
  let scale = fixedScale ?? Infinity;
  for (const it of items) {
    const m = css?.measureText(it.ch);
    const b = css ? { minX: -m.actualBoundingBoxLeft, maxX: m.actualBoundingBoxRight, minY: -m.actualBoundingBoxDescent, maxY: m.actualBoundingBoxAscent } : gf.get(it.id, axes).bbox;
    it.bbox = b;
    const bw = Math.max(1, b.maxX - b.minX);
    const bh = Math.max(1, b.maxY - b.minY);
    if (!fixedScale) scale = Math.min(scale, (it.box.w - 2 * inset) / bw, (it.box.h - 2 * inset) / bh);
  }

  const cells = new Int16Array(cols * rows);
  const cov = new Float32Array(cols * rows);
  const c = new OffscreenCanvas(cols * R, rows * R);
  const x = c.getContext('2d', { willReadFrequently: true });
  items.forEach((it, i) => {
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.clearRect(0, 0, c.width, c.height);
    const b = it.bbox;
    x.translate((it.box.x + it.box.w / 2 + offset[0]) * R, (it.box.y + it.box.h / 2 + offset[1]) * R);
    x.fillStyle = '#000';
    if (css) {
      x.scale(scale * R, scale * R);
      x.translate(-(b.minX + b.maxX) / 2, (b.minY + b.maxY) / 2);
      setFont(x, 1000);
      x.fillText(it.ch, 0, 0);
    } else {
      x.scale(scale * R, -scale * R);
      x.translate(-(b.minX + b.maxX) / 2, -(b.minY + b.maxY) / 2);
      x.fill(gf.get(it.id, axes).path);
    }
    const data = x.getImageData(0, 0, c.width, c.height).data;
    const x0 = Math.max(0, Math.floor(it.box.x + Math.min(0, offset[0])));
    const y0 = Math.max(0, Math.floor(it.box.y + Math.min(0, offset[1])));
    const x1 = Math.min(cols, Math.ceil(it.box.x + it.box.w + Math.max(0, offset[0])));
    const y1 = Math.min(rows, Math.ceil(it.box.y + it.box.h + Math.max(0, offset[1])));
    for (let cy = y0; cy < y1; cy++) {
      for (let cx = x0; cx < x1; cx++) {
        let sum = 0;
        for (let py = cy * R; py < cy * R + R; py++) {
          let o = (py * c.width + cx * R) * 4 + 3;
          for (let px = 0; px < R; px++, o += 4) sum += data[o];
        }
        const v = sum / (R * R * 255);
        const k = cy * cols + cx;
        if (v > cov[k]) cov[k] = v;
        if (v >= threshold) cells[k] = i + 1;
      }
    }
  });
  return { cols, rows, cells, cov, scale, boxes: items.map((it) => it.box), chars: items.map((it) => it.ch) };
}

/** A mask from a function of the cell: (x, y) → label (0 = empty). */
export function shapeMask(cols, rows, fn) {
  const cells = new Int16Array(cols * rows);
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) cells[y * cols + x] = fn(x, y) | 0;
  return { cols, rows, cells, cov: null, boxes: [] };
}

/** A flower: petals from a polar curve, a hole at the heart, a stem and two leaves. */
export function flowerMask(cols, rows, rng, { petals = 5 } = {}) {
  const cx = cols * 0.56;
  const cy = rows * 0.38;
  const R = cols * 0.33;
  const turn = rng() * TAU;
  // Stem: a quadratic curve from under the flower down and to the left.
  const p0 = [cx - R * 0.1, cy + R * 0.3];
  const p1 = [cx - R * 0.25, rows * 0.82];
  const p2 = [cols * 0.16, rows - 2.5];
  const stem = Array.from({ length: 80 }, (_, k) => {
    const t = k / 79;
    const m = 1 - t;
    return [m * m * p0[0] + 2 * m * t * p1[0] + t * t * p2[0], m * m * p0[1] + 2 * m * t * p1[1] + t * t * p2[1]];
  });
  // Leaves: rotated ellipses off the stem, one each side.
  const leaves = [
    { at: stem[38], a: -0.5, side: -1 },
    { at: stem[62], a: 0.35, side: 1 },
  ].map(({ at, a, side }) => ({ x: at[0] + side * 2.4 * Math.cos(a), y: at[1] + side * 2.4 * Math.sin(a), a, rx: 2.6, ry: 1.15 }));
  return shapeMask(cols, rows, (x, y) => {
    const px = x + 0.5;
    const py = y + 0.5;
    const dx = px - cx;
    const dy = py - cy;
    const r = Math.hypot(dx, dy);
    const a = Math.atan2(dy, dx) + turn;
    const edge = R * (0.22 + 0.78 * Math.abs(Math.cos((petals / 2) * a)) ** 0.7) + (rng() - 0.5) * 0.6;
    if (r < edge && r > 2.1) return 1;
    if (r <= 2.1) return 0;
    if (stem.some(([sx, sy]) => Math.hypot(px - sx, py - sy) < 0.62)) return 2;
    for (const l of leaves) {
      const u = (px - l.x) * Math.cos(l.a) + (py - l.y) * Math.sin(l.a);
      const v = -(px - l.x) * Math.sin(l.a) + (py - l.y) * Math.cos(l.a);
      if ((u / l.rx) ** 2 + (v / l.ry) ** 2 < 1) return 2;
    }
    return 0;
  });
}

// ── Fields ───────────────────────────────────────────────────────────────────────────

const N4 = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
const N8 = [...N4, [1, 1], [-1, 1], [1, -1], [-1, -1]];

/** 4-neighbour distance from every cell to the nearest cell where `from(i)` is true. */
export function distance(grid, from) {
  const { cols, rows } = grid;
  const d = new Int16Array(cols * rows).fill(-1);
  const q = [];
  for (let i = 0; i < cols * rows; i++) if (from(i)) (d[i] = 0), q.push(i);
  for (let h = 0; h < q.length; h++) {
    const i = q[h];
    const x = i % cols;
    const y = (i / cols) | 0;
    for (const [dx, dy] of N4) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const j = ny * cols + nx;
      if (d[j] < 0) (d[j] = d[i] + 1), q.push(j);
    }
  }
  return d;
}

/**
 * Cuts the filled cells into patches of about `area` cells that grow along the strokes
 * (a multi-source flood from spaced seeds, never across glyphs). Returns the patch of
 * each cell, the order cells were reached (the build order), and patch neighbours.
 */
export function patches(grid, rng, area = 40) {
  const { cols, rows, cells } = grid;
  const N = cols * rows;
  const patch = new Int32Array(N).fill(-1);
  const rank = new Int32Array(N).fill(-1);
  const filled = [];
  for (let i = 0; i < N; i++) if (cells[i]) filled.push(i);
  const shuffled = filled.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const spacing = Math.sqrt(area) * 0.95;
  const seeds = [];
  for (const i of shuffled) {
    const x = i % cols;
    const y = (i / cols) | 0;
    if (seeds.every((s) => Math.max(Math.abs((s % cols) - x), Math.abs(((s / cols) | 0) - y)) >= spacing)) seeds.push(i);
  }

  let order = 0;
  const grow = (start) => {
    const q = [];
    for (const s of start) {
      if (patch[s] >= 0) continue;
      patch[s] = s;
      rank[s] = order++;
      q.push(s);
    }
    for (let h = 0; h < q.length; h++) {
      const i = q[h];
      const x = i % cols;
      const y = (i / cols) | 0;
      // A shuffled neighbour order keeps patch borders ragged, like stitched areas.
      const nb = N4.slice().sort(() => rng() - 0.5);
      for (const [dx, dy] of nb) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const j = ny * cols + nx;
        if (!cells[j] || cells[j] !== cells[i] || patch[j] >= 0) continue;
        patch[j] = patch[i];
        rank[j] = order++;
        q.push(j);
      }
    }
  };
  grow(seeds);
  for (const i of filled) if (patch[i] < 0) grow([i]); // islands the seeds missed

  const ids = [...new Set(filled.map((i) => patch[i]))];
  const index = new Map(ids.map((id, k) => [id, k]));
  const of = new Int32Array(N).fill(-1);
  for (const i of filled) of[i] = index.get(patch[i]);
  const near = ids.map(() => new Set());
  for (const i of filled) {
    const x = i % cols;
    const y = (i / cols) | 0;
    for (const [dx, dy] of N4) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const j = ny * cols + nx;
      if (of[j] >= 0 && of[j] !== of[i]) near[of[i]].add(of[j]);
    }
  }
  return { of, rank, count: ids.length, near, total: order };
}

/**
 * Order along each stroke from its top-left end: one flood per connected part, orthogonal
 * steps before diagonal ones. `parent` is the cell each was reached from (a spanning tree).
 */
export function strokeOrder(grid, { orthogonal = false } = {}) {
  const { cols, rows, cells } = grid;
  const N = cols * rows;
  const rank = new Int32Array(N).fill(-1);
  const parent = new Int32Array(N).fill(-1);
  let order = 0;
  for (let s = 0; s < N; s++) {
    if (!cells[s] || rank[s] >= 0) continue;
    const q = [s];
    rank[s] = order++;
    for (let h = 0; h < q.length; h++) {
      const i = q[h];
      const x = i % cols;
      const y = (i / cols) | 0;
      for (const [dx, dy] of orthogonal ? N4 : N8) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const j = ny * cols + nx;
        if (cells[j] && rank[j] < 0) (rank[j] = order++), (parent[j] = i), q.push(j);
      }
    }
  }
  return { rank, parent, total: order };
}

/** Gives each patch an item from `list`, never the same as a neighbour, spreading use. */
export function assign(p, list, rng, avoid = null) {
  const out = new Array(p.count);
  const used = new Map(list.map((v) => [v, 0]));
  for (let k = 0; k < p.count; k++) {
    const taken = new Set([...p.near[k]].map((j) => out[j]).filter((v) => v !== undefined));
    if (avoid) taken.add(avoid[k]);
    const free = list.filter((v) => !taken.has(v));
    const pool = free.length ? free : list;
    const least = Math.min(...pool.map((v) => used.get(v)));
    const pick = pool.filter((v) => used.get(v) <= least + 1);
    out[k] = pick[Math.floor(rng() * pick.length)];
    used.set(out[k], used.get(out[k]) + 1);
  }
  return out;
}

// ── Motifs: one cell's stitch ────────────────────────────────────────────────────────

/** Each draws in a cell at (x, y) of size s with the current stroke and fill; `two` is a second ink. */
export const MOTIFS = {
  ring(c, x, y, s) {
    c.beginPath();
    c.arc(x + s / 2, y + s / 2, s * 0.32, 0, TAU);
    c.stroke();
  },
  ringDot(c, x, y, s, two) {
    MOTIFS.ring(c, x, y, s);
    c.save();
    if (two) c.fillStyle = two;
    c.beginPath();
    c.arc(x + s / 2, y + s / 2, s * 0.12, 0, TAU);
    c.fill();
    c.restore();
  },
  doubleRing(c, x, y, s) {
    c.beginPath();
    c.arc(x + s / 2, y + s / 2, s * 0.34, 0, TAU);
    c.moveTo(x + s / 2 + s * 0.14, y + s / 2);
    c.arc(x + s / 2, y + s / 2, s * 0.14, 0, TAU);
    c.stroke();
  },
  square(c, x, y, s) {
    c.beginPath();
    c.roundRect(x + s * 0.16, y + s * 0.16, s * 0.68, s * 0.68, s * 0.14);
    c.stroke();
  },
  squareDot(c, x, y, s, two) {
    MOTIFS.square(c, x, y, s);
    c.save();
    if (two) c.strokeStyle = two;
    c.beginPath();
    c.arc(x + s / 2, y + s / 2, s * 0.13, 0, TAU);
    c.stroke();
    c.restore();
  },
  nested(c, x, y, s) {
    c.beginPath();
    c.rect(x + s * 0.15, y + s * 0.15, s * 0.7, s * 0.7);
    c.rect(x + s * 0.38, y + s * 0.38, s * 0.24, s * 0.24);
    c.stroke();
  },
  spiral(c, x, y, s) {
    poly(c, x, y, s, [
      [0.16, 0.84],
      [0.16, 0.16],
      [0.84, 0.16],
      [0.84, 0.84],
      [0.38, 0.84],
      [0.38, 0.38],
      [0.62, 0.38],
      [0.62, 0.62],
    ]);
  },
  meander(c, x, y, s) {
    poly(c, x, y, s, [
      [0.84, 0.16],
      [0.16, 0.16],
      [0.16, 0.5],
      [0.84, 0.5],
      [0.84, 0.84],
      [0.16, 0.84],
    ]);
  },
  cross(c, x, y, s) {
    c.beginPath();
    c.moveTo(x + s * 0.12, y + s * 0.12);
    c.lineTo(x + s * 0.88, y + s * 0.88);
    c.moveTo(x + s * 0.88, y + s * 0.12);
    c.lineTo(x + s * 0.12, y + s * 0.88);
    c.stroke();
  },
  plus(c, x, y, s) {
    c.beginPath();
    c.moveTo(x + s / 2, y + s * 0.12);
    c.lineTo(x + s / 2, y + s * 0.88);
    c.moveTo(x + s * 0.12, y + s / 2);
    c.lineTo(x + s * 0.88, y + s / 2);
    c.stroke();
  },
  hash(c, x, y, s) {
    c.beginPath();
    for (const k of [0.34, 0.66]) {
      c.moveTo(x + s * k, y + s * 0.1);
      c.lineTo(x + s * k, y + s * 0.9);
      c.moveTo(x + s * 0.1, y + s * k);
      c.lineTo(x + s * 0.9, y + s * k);
    }
    c.stroke();
  },
  diamond(c, x, y, s) {
    poly(c, x, y, s, [
      [0.5, 0.12],
      [0.88, 0.5],
      [0.5, 0.88],
      [0.12, 0.5],
      [0.5, 0.12],
    ]);
  },
  block(c, x, y, s) {
    c.beginPath();
    c.roundRect(x + s * 0.1, y + s * 0.1, s * 0.8, s * 0.8, s * 0.16);
    c.fill();
  },
};

function poly(c, x, y, s, pts) {
  c.beginPath();
  pts.forEach(([u, v], i) => (i ? c.lineTo(x + u * s, y + v * s) : c.moveTo(x + u * s, y + v * s)));
  c.stroke();
}

export const STITCHES = ['cross', 'ring', 'ringDot', 'doubleRing', 'square', 'squareDot', 'nested', 'spiral', 'meander', 'plus', 'hash', 'diamond'];

// ── Blocks: filled cells joined, convex corners rounded, concave corners filleted ─────

/**
 * Adds the union of the cells where `inside(i)` holds to `path`, as one shape: a corner
 * rounds where both its sides are open, and an empty corner between two filled sides
 * takes a fillet, so cells read as one moulded piece, the way a router would cut it.
 */
export function blobPath(grid, inside, s, r, ox = 0, oy = 0, path = new Path2D()) {
  const { cols, rows } = grid;
  const at = (x, y) => x >= 0 && y >= 0 && x < cols && y < rows && inside(y * cols + x);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const px = ox + x * s;
      const py = oy + y * s;
      if (at(x, y)) {
        const l = at(x - 1, y);
        const rt = at(x + 1, y);
        const u = at(x, y - 1);
        const d = at(x, y + 1);
        // A corner stays square where a diagonal neighbour joins it through the fillets.
        const round = (h, v, dx, dy) => !h && !v && !at(x + dx, y + dy);
        // A hair of overlap so neighbouring cells never show a seam.
        const e = 0.25;
        path.roundRect(px - (l ? e : 0), py - (u ? e : 0), s + (l ? e : 0) + (rt ? e : 0), s + (u ? e : 0) + (d ? e : 0), [
          round(l, u, -1, -1) ? r : 0,
          round(rt, u, 1, -1) ? r : 0,
          round(rt, d, 1, 1) ? r : 0,
          round(l, d, -1, 1) ? r : 0,
        ]);
        continue;
      }
      // Fillets in an empty cell's corners.
      for (const [sx, sy] of [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ]) {
        if (!at(x + sx, y) || !at(x, y + sy)) continue;
        const cx = px + (sx > 0 ? s : 0);
        const cy = py + (sy > 0 ? s : 0);
        const dx = -sx; // into the cell
        const dy = -sy;
        path.moveTo(cx, cy);
        path.lineTo(cx + dx * r, cy);
        path.arcTo(cx, cy, cx, cy + dy * r, r);
        path.lineTo(cx, cy);
        path.closePath();
      }
    }
  }
  return path;
}
