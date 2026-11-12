// Four layout drafts. Each draws a still poster from the whole glyph set of one variable
// font; motion comes later. Every layout gets { ctx, W, H, gf, rng, noise, p }.
import { MONO, clamp, lerp, fbm, shuffle, solid, letters, caption } from './util.js';
import { flow } from './flow.js';
// ─── Topo ──────────────────────────────────────────────────────────────────
// A typed contour map. A grid of typewriter cells over a field of hills; each hill is set
// in one part of the glyph set (capitals, Cyrillic, Greek, figures, alternates…), and every
// contour up the hill steps to the next glyph in the font's order, so climbing walks
// A Á Ă Ắ Ặ … Width fits each glyph to the cell; weight rises with height.
export const topo = {
  name: 'Topo',
  params: { cols: 84, pitch: 0.6, leading: 1.08, hills: 6, levels: 13, stride: 1, gap: 0.12, roughness: 0.22 },
  ranges: {
    cols: [30, 180, 1],
    pitch: [0.45, 0.9, 0.01],
    leading: [0.8, 1.6, 0.01],
    hills: [1, 10, 1],
    levels: [6, 90, 1],
    stride: [1, 12, 1],
    gap: [0, 0.6, 0.01],
    roughness: [0, 0.6, 0.01],
  },
  draw({ ctx, W, H, gf, rng, noise, p }) {
    const cw = W / p.cols;
    const size = cw / p.pitch;
    const ch = size * p.leading;
    const rows = Math.ceil(H / ch);
    const target = p.pitch * gf.upm;

    // Each part of the set as a list of letters, each letter with its accented and
    // alternate forms: a band is one letter, its forms step up through the band.
    const sets = shuffle(
      rng,
      ['upper', 'lower', 'cyrillic', 'greek', 'figure', 'alternate', 'symbol'].map((n) => letters(gf.group(n))).filter((s) => s.length > 6),
    );
    const sea = letters(gf.group('mark'));
    const hills = Array.from({ length: p.hills }, (_, i) => ({
      x: rng.range(0.05, 0.95) * W,
      y: rng.range(0.05, 0.95) * H,
      r: rng.range(0.12, 0.3) * W,
      a: rng.range(0.55, 1),
      set: sets[i % sets.length],
      off: rng.int(0, 400),
    }));
    const wght = gf.axes.wght;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < p.cols; c++) {
        const x = (c + 0.5) * cw;
        const y = (r + 0.5) * ch;
        let h = 0;
        let best = hills[0];
        let bv = -1;
        for (const k of hills) {
          const v = k.a * Math.exp(-((x - k.x) ** 2 + (y - k.y) ** 2) / (k.r * k.r));
          h += v;
          if (v > bv) [bv, best] = [v, k];
        }
        h += p.roughness * fbm(noise, (x / W) * 3, (y / W) * 3);
        const lv = Math.max(0, h) * p.levels;
        const level = Math.floor(lv);
        const frac = lv - level;
        if (frac < p.gap) continue;
        const set = level < 1 ? sea : best.set;
        if (!set.length) continue;
        const forms = set[(best.off + level * p.stride) % set.length];
        const g = forms[Math.min(forms.length - 1, Math.floor(((frac - p.gap) / (1 - p.gap)) * forms.length))];
        const axes = gf.fitWidth(g.id, target, {
          MONO: gf.axes.MONO?.max,
          wght: wght ? lerp(lerp(wght.min, wght.max, 0.15), lerp(wght.min, wght.max, 0.7), clamp(level / p.levels)) : undefined,
        });
        gf.draw(ctx, g.id, axes, x, y, size);
      }
    }
  },
};

// ─── Ink ───────────────────────────────────────────────────────────────────
// Classic character shading with the whole set as the ramp. Every glyph is measured for
// ink at several weights (width fitted to the cell), sorted dark to light, and a lit,
// inflated letter from the same font is set in those glyphs.
const ramps = new Map();
export const ink = {
  name: 'Ink',
  params: { cols: 104, pitch: 0.6, leading: 1.08, weights: 4, puff: 0.022, relief: 34, body: 0.85, shadow: 0.3, ground: 0, variety: 6, gamma: 1.1 },
  ranges: {
    cols: [40, 200, 1],
    pitch: [0.45, 0.9, 0.01],
    leading: [0.8, 1.6, 0.01],
    weights: [1, 8, 1],
    puff: [0.005, 0.2, 0.005],
    relief: [1, 80, 1],
    body: [0, 1, 0.01],
    shadow: [0, 1, 0.01],
    ground: [0, 0.3, 0.01],
    variety: [0, 40, 1],
    gamma: [0.5, 2.5, 0.01],
  },
  draw({ ctx, W, H, gf, rng, p }) {
    const cw = W / p.cols;
    const size = cw / p.pitch;
    const ch = size * p.leading;
    const rows = Math.ceil(H / ch);

    // The ramp: every glyph × weights, measured once per font and cell.
    const rk = `${gf.name}|${p.pitch}|${p.leading}|${p.weights}`;
    let ramp = ramps.get(rk);
    if (!ramp) {
      const w = gf.axes.wght;
      const weights = w ? Array.from({ length: p.weights }, (_, i) => lerp(w.min, w.max, p.weights === 1 ? 0.5 : i / (p.weights - 1))) : [undefined];
      const list = [];
      for (const g of gf.glyphs) for (const wt of weights) list.push({ id: g.id, axes: gf.fitWidth(g.id, p.pitch * gf.upm, { wght: wt, MONO: gf.axes.MONO?.max }) });
      const cov = gf.coverage(list, p.pitch, p.leading);
      ramp = list.map((it, i) => ({ ...it, cov: cov[i] })).filter((it) => it.cov > 0.004).sort((a, b) => a.cov - b.cov);
      ramps.set(rk, ramp);
    }
    const top = ramp[ramp.length - 1].cov;

    // The image: one heavy glyph, blurred into a height field and lit from the top left.
    const names = ['ampersand', 'at', 'germandbls', 'AE', 'OE', 'uni0416', 'uni042F', 'Omega', 'uni03A9', 'Psi', 'section', 'Q', 'R', 'g', 'a', 'S', 'f_f_i', 'T_h', 'K.ss04', 'g.ss02'];
    const pool = gf.glyphs.filter((g) => names.includes(g.name));
    const hero = rng.pick(pool.length ? pool : solid(gf));
    const w = gf.axes.wght;
    const heroAxes = { wght: w ? lerp(w.min, w.max, 0.62) : undefined, CNTR: gf.axes.CNTR ? lerp(gf.axes.CNTR.min, gf.axes.CNTR.max, 0.4) : undefined };
    const hg = gf.get(hero.id, heroAxes);
    const sw = p.cols * 3;
    const sh = rows * 3;
    const sx = sw / W;
    const sy = sh / (rows * ch);
    const b = hg.bbox;
    const k = Math.min((0.8 * W) / (b.maxX - b.minX), (0.78 * H) / (b.maxY - b.minY));
    const mask = document.createElement('canvas');
    mask.width = sw;
    mask.height = sh;
    const m = mask.getContext('2d', { willReadFrequently: true });
    const paint = (dx = 0, dy = 0, blur = 0) => {
      m.save();
      m.clearRect(0, 0, sw, sh);
      m.filter = blur ? `blur(${blur}px)` : 'none';
      m.fillStyle = '#000';
      m.scale(sx, sy);
      m.translate(W / 2 - ((b.minX + b.maxX) / 2) * k + dx, H * 0.48 + ((b.minY + b.maxY) / 2) * k + dy);
      m.scale(k, -k);
      m.fill(hg.path);
      m.restore();
      const d = m.getImageData(0, 0, sw, sh).data;
      const out = new Float32Array(sw * sh);
      for (let i = 0; i < out.length; i++) out[i] = d[i * 4 + 3] / 255;
      return out;
    };
    const solidMask = paint();
    const height = paint(0, 0, p.puff * sw);
    const shadow = paint(W * 0.018, W * 0.026, p.puff * sw * 0.6);
    const L = [-0.5, -0.7, 1.1];
    const ll = Math.hypot(...L);
    const lx = L[0] / ll, ly = L[1] / ll, lz = L[2] / ll;
    const hx = lx, hy = ly, hz = lz + 1;
    const hl = Math.hypot(hx, hy, hz);
    const dark = new Float32Array(sw * sh);
    for (let y = 1; y < sh - 1; y++) {
      for (let x = 1; x < sw - 1; x++) {
        const i = y * sw + x;
        const mm = solidMask[i];
        const hgt = (j) => Math.sqrt(height[j]);
        const gx = (hgt(i + 1) - hgt(i - 1)) * p.relief;
        const gy = (hgt(i + sw) - hgt(i - sw)) * p.relief;
        const nl = Math.hypot(gx, gy, 1);
        const nx = -gx / nl, ny = -gy / nl, nz = 1 / nl;
        const diff = Math.max(0, nx * lx + ny * ly + nz * lz);
        const spec = Math.max(0, (nx * hx + ny * hy + nz * hz) / hl) ** 40;
        const lit = clamp(0.92 * diff ** 1.6 + 0.8 * spec);
        const outside = p.ground + shadow[i] * (1 - solidMask[i]) * p.shadow;
        dark[i] = mm * (1 - lit * p.body) + (1 - mm) * outside;
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < p.cols; c++) {
        let d = 0;
        for (let yy = 0; yy < 3; yy++) for (let xx = 0; xx < 3; xx++) d += dark[(r * 3 + yy) * sw + c * 3 + xx];
        d /= 9;
        if (d < 0.02) continue;
        const want = d ** p.gamma * top;
        let lo = 0;
        let hi = ramp.length - 1;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (ramp[mid].cov < want) lo = mid + 1;
          else hi = mid;
        }
        const j = Math.min(ramp.length - 1, Math.max(0, lo + Math.round((rng() * 2 - 1) * p.variety)));
        const it = ramp[j];
        gf.draw(ctx, it.id, it.axes, (c + 0.5) * cw, (r + 0.5) * ch, size);
      }
    }
  },
};

// ─── Sheet ─────────────────────────────────────────────────────────────────
// A dry-transfer lettering sheet: capitals, lower case, then figures and signs, each
// repeated by how often it's needed, then every glyph in the font once, smallest last.
const FREQ = { e: 127, t: 91, a: 82, o: 75, i: 70, n: 67, s: 63, h: 61, r: 60, d: 43, l: 40, c: 28, u: 28, m: 24, w: 24, f: 22, g: 20, y: 20, p: 19, b: 15, v: 10, k: 8, j: 2, x: 2, q: 1, z: 1 };
export const sheet = {
  name: 'Sheet',
  params: { wght: 560, wdth: 100, CNTR: 100, repeats: 7, gap: 0.16, margin: 0.06 },
  ranges: { wght: [100, 900, 1], wdth: [50, 150, 1], CNTR: [10, 100, 1], repeats: [1, 14, 1], gap: [0, 0.8, 0.01], margin: [0.02, 0.12, 0.005] },
  draw({ ctx, W, H, gf, p }) {
    const axes = { wght: p.wght, wdth: p.wdth, CNTR: p.CNTR };
    const m = p.margin * W;
    const byChar = (ch) => gf.glyphs.find((g) => g.cp === ch.codePointAt(0));
    const runs = (chars, max) =>
      [...chars].map((ch) => [byChar(ch), Math.max(1, Math.round(((FREQ[ch.toLowerCase()] ?? 20) / 127) * max))]).filter(([g]) => g);
    const used = new Set();
    const caps = runs('ABCDEFGHIJKLMNOPQRSTUVWXYZ', p.repeats);
    const lower = runs('abcdefghijklmnopqrstuvwxyz', p.repeats + 2);
    const signs = gf.group('figure', 'symbol').map((g) => [g, g.group === 'figure' && g.cp < 0x80 ? 3 : 1]);
    for (const [g] of [...caps, ...lower, ...signs]) used.add(g.id);
    const rest = gf.glyphs.filter((g) => !used.has(g.id)).map((g) => [g, 1]);
    const blocks = [
      { label: 'Capitals', runs: caps, size: 0.088 },
      { label: 'Lower case', runs: lower, size: 0.056 },
      { label: 'Figures and signs', runs: signs, size: 0.03 },
      { label: 'Accents, alternates, ligatures, Cyrillic, Greek', runs: rest, size: 0.0175 },
    ];

    // Lay out at a scale, return the height; shrink until it fits the sheet.
    const layout = (scale, draw) => {
      let y = m + W * 0.05;
      for (const blk of blocks) {
        const size = blk.size * W * scale;
        const line = size * 1.06;
        if (draw) {
          ctx.fillRect(m, y - W * 0.012, W - 2 * m, Math.max(0.5, W * 0.0008));
          caption(ctx, `${blk.label}`, m, y + W * 0.004, W * 0.0085);
          caption(ctx, `${Math.round(((size / W) * 297) / 0.3528)} pt`, W - m, y + W * 0.004, W * 0.0085, 'right');
        }
        y += W * 0.012 + size * 0.86;
        let x = m;
        const gap = size * p.gap;
        for (const [g, count] of blk.runs) {
          for (let i = 0; i < count; i++) {
            const adv = (gf.adv(g.id, axes) / gf.upm) * size;
            if (x + adv > W - m) {
              x = m;
              y += line;
            }
            if (draw) gf.draw(ctx, g.id, axes, x, y, size, 0, 'baseline');
            x += adv + (i === count - 1 ? gap * 2.4 : gap);
          }
        }
        y += line * 0.5 + W * 0.03;
      }
      return y;
    };
    let lo = 0.3;
    let hi = 1.6;
    for (let i = 0; i < 14; i++) {
      const mid = (lo + hi) / 2;
      if (layout(mid, false) < H - m) lo = mid;
      else hi = mid;
    }
    caption(ctx, `${gf.name}`, m, m + W * 0.012, W * 0.0105);
    caption(ctx, `${gf.glyphs.length} glyphs · wght ${p.wght} · wdth ${p.wdth} · cntr ${p.CNTR}`, W - m, m + W * 0.012, W * 0.0105, 'right');
    layout(lo, true);
  },
};

export const layouts = { flow, topo, ink, sheet };
