// ─── Flow ──────────────────────────────────────────────────────────────────
// The whole poster is one block of type, like a dry-transfer sheet: every line the same
// size and leading, set edge to edge with normal-to-tight spacing.
//
// Organic shapes exist only as a map underneath. As each line is set left to right, the
// shape under the cursor decides what comes next: one shape repeats a glyph, another steps
// through a letter's family (A Á Ă Â Ä …), another takes running copy. Where a line crosses
// from one shape into the next, the only gap is a word space, so the shapes appear as
// changes of texture. Each section is one light ink (color: 'section', the default); or
// colour can flow as a soft airbrushed field sampled per glyph (color: 'flow').
import { fbm, solid, letters } from './util.js';
import { MOXON, KANA, TAGS } from './copy.js';




// Grounds, and ink sets to go on them. Riso on white is the design; the rest are tweaks.
export const GROUNDS = { white: '#FFFFFF', black: '#000000' };
export const PALETTES = {
  riso: ['#ff48b0', '#0078bf', '#00a95c', '#ff6c2f', '#765ba7', '#f15060'],
  fire: ['#ff3b1f', '#ff7a00', '#ffb000', '#e8c400', '#ff4f8b'],
  neon: ['#39ff14', '#ff2bd6', '#00e0ff', '#ffe600', '#ff6a00', '#a15bff'],
  cards: ['#5fd0ff', '#ff7ccb', '#ffe14a', '#9bf04a', '#ff9a5c', '#b48cff', '#4ff0c8'],
  sorbet: ['#ffd3ea', '#cdf7c4', '#fff4ae', '#cfe8ff', '#ffdac6', '#e6d6ff'],
  mono: null, // one ink: the opposite of the ground
};

// Motion drafts. Every one is frame by frame (stop motion), stepping every `hold` frames.
export const MOTIONS = ['still', 'colour step', 'colour wave', 'glyph cycle', 'march', 'drift', 'rub down', 'everything'];

// Which glyphs the patterns draw from.
const isKana = (g) => g.cp >= 0x3040 && g.cp <= 0x30ff;
const CHARACTERS = {
  all: () => true,
  latin: (g) => !isKana(g) && (g.group === 'upper' || g.group === 'lower'),
  caps: (g) => g.group === 'upper',
  accented: (g) => !isKana(g) && g.cp !== undefined && String.fromCodePoint(g.cp).normalize('NFD').length > 1,
  kana: isKana, // hiragana and katakana
  hiragana: (g) => g.cp >= 0x3040 && g.cp <= 0x309f,
  katakana: (g) => g.cp >= 0x30a0 && g.cp <= 0x30ff,
  signs: (g) => g.group === 'figure' || g.group === 'symbol',
};

export const flow = {
  name: 'Flow',
  ratio: 1,
  colors: { paper: '#FFFFFF', ink: '#000000' },
  // The few choices still open; everything else is locked.
  tweaks: [
    { key: 'motion', label: 'Motion', options: MOTIONS },
    { key: 'boil', label: 'Boil', options: ['on', 'off'] },
    { key: 'fps', label: 'Frame rate', options: [6, 8, 12].map((v) => ({ value: v, label: `${v} fps` })) },
    { key: 'background', label: 'Background', options: ['white', 'black'] },
    { key: 'palette', label: 'Inks', options: ['riso', 'fire', 'neon', 'cards', 'sorbet', 'mono'].map((value) => ({ value, swatch: PALETTES[value] ?? ['#000000', '#ffffff'] })) },
    { key: 'characters', label: 'Characters', options: [{ value: 'kana', label: 'Hiragana and katakana' }, 'hiragana', 'katakana', 'all', 'latin', 'caps', 'accented', 'signs'] },
    { key: 'copy', label: 'Copy', options: [{ value: 'moxon', label: 'Moxon, 1683' }, { value: 'kana', label: 'Hiragana and katakana' }, 'tags', 'glyph set', 'none'] },
  ],
  params: {
    background: 'white',
    copy: 'moxon',
    palette: 'riso',
    characters: 'kana',
    color: 'section',
    style: 'one',
    weight: 'bold',
    show: 'type',
    motion: 'drift',
    turbulence: 1,
    boil: 'on',
    fps: 8,
    hold: 2,
    loop: 64, // frames in one loop: 8 s at 8 fps
    drift: 0.01,
    size: 0.019,
    leading: 1.04,
    tracking: -0.01,
    text: 0.3,
    scale: 1.25,
    warp: 1.3,
    sweep: 2.4,
    bands: 9,
    cells: 7,
    hue: 1.1,
  },
  options: { background: Object.keys(GROUNDS), copy: ['kana', 'moxon', 'tags', 'glyph set', 'none'], palette: Object.keys(PALETTES), characters: Object.keys(CHARACTERS), color: ['section', 'flow'], style: ['one', 'mixed'], weight: ['bold', 'medium', 'light'], show: ['type', 'type + shapes', 'shapes'], motion: MOTIONS, boil: ['on', 'off'], fps: [6, 8, 12] },
  ranges: {
    size: [0.008, 0.06, 0.0005],
    leading: [0.8, 1.6, 0.01],
    tracking: [-0.12, 0.2, 0.005],
    text: [0, 1, 0.01],
    scale: [0.3, 4, 0.01],
    warp: [0, 3, 0.01],
    sweep: [0, 4, 0.01],
    bands: [1, 24, 1],
    cells: [1, 40, 1],
    hue: [0.1, 4, 0.01],
    hold: [1, 8, 1],
    drift: [0, 0.05, 0.001],
  },

  draw({ ctx, W, H, gf, rng, noise, p, t = 0 }) {
    // Every motion repeats after `loop` frames: the drift closes into a circle and each roll
    // (boil, turbulence) runs on a beat that divides the loop, so frame `loop` is frame 0.
    const L = Math.max(1, Math.round(Number(p.loop) || 64));
    t = ((Math.round(t) % L) + L) % L;
    const mo = p.motion ?? 'still';
    const all = mo === 'everything';
    const on = (m) => all || mo === m;
    const tick = Math.floor(t / Math.max(1, Number(p.hold) || 2));
    const ground = GROUNDS[p.background] ?? GROUNDS.white;
    const INKS = PALETTES[p.palette] ?? [ground === GROUNDS.black ? '#ffffff' : '#000000'];
    ctx.fillStyle = ground;
    ctx.fillRect(0, 0, W, H);

    // ── The map of shapes ──
    // Built once at t = 0 (it decides what every shape holds, so the still never changes),
    // and again each frame when the map drifts. The drift runs round a closed circle in the
    // noise at `drift` per frame, so the map is home again after one loop; the shapes' seeds
    // circle too, at the speed they used to wander, starting from where they sit.
    const rw = 240;
    const SX = (0.04 * 3 * (Number(p.drift) || 0.01) * L) / (2 * Math.PI);
    const SY = (0.04 * 2.3 * (Number(p.drift) || 0.01) * L) / (2 * Math.PI);
    const cs = W / rw;
    const rh = Math.ceil(H / cs);
    const a = rng.range(0.15, 0.85) * Math.PI;
    const [dx, dy] = [Math.cos(a), Math.sin(a)];
    const seeds0 = Array.from({ length: p.cells }, () => [rng() * W, rng() * H]);
    const buildMap = (D) => {
      const [ta, tb, th] = D ?? [0, 0, 0];
      const field = new Float32Array(rw * rh);
      for (let j = 0; j < rh; j++) {
        for (let i = 0; i < rw; i++) {
          const x = i / rw;
          const y = j / rw;
          const u = x * p.scale;
          const v = y * p.scale;
          const wx = fbm(noise, u + 3.1 + ta, v + 1.7 + tb, 2);
          const wy = fbm(noise, u - 2.3 - tb, v + 5.1 + ta, 2);
          field[j * rw + i] = fbm(noise, u + p.warp * wx, v + p.warp * wy, 3) + 0.5 * p.sweep * (x * dx + y * dy);
        }
      }
      let lo = Infinity;
      let hi = -Infinity;
      for (const v of field) [lo, hi] = [Math.min(lo, v), Math.max(hi, v)];
      const seeds = seeds0.map(([sx, sy], k) => [sx + (Math.cos(th + k) - Math.cos(k)) * W * SX, sy + (Math.sin(th + k * 1.7) - Math.sin(k * 1.7)) * W * SY]);
      const lab = new Int32Array(rw * rh);
      const area = new Map();
      const cent = new Map();
      for (let j = 0; j < rh; j++) {
        for (let i = 0; i < rw; i++) {
          const x = (i + 0.5) * cs;
          const y = (j + 0.5) * cs;
          const band = Math.min(p.bands - 1, Math.floor(((field[j * rw + i] - lo) / (hi - lo)) * p.bands));
          let best = 0;
          let bd = Infinity;
          for (let k = 0; k < seeds.length; k++) {
            const d = Math.hypot(x - seeds[k][0], y - seeds[k][1]) + W * 0.1 * fbm(noise, (x / W) * 2.2 + k * 7.3, (y / W) * 2.2, 2);
            if (d < bd) [bd, best] = [d, k];
          }
          const id = band * 1000 + best;
          lab[j * rw + i] = id;
          area.set(id, (area.get(id) ?? 0) + 1);
          const c = cent.get(id) ?? [0, 0];
          c[0] += x;
          c[1] += y;
          cent.set(id, c);
        }
      }
      for (const [id, c] of cent) cent.set(id, [c[0] / area.get(id), c[1] / area.get(id)]);
      return { lab, area, cent };
    };
    const base = buildMap(null);
    const th = (2 * Math.PI * t) / L;
    const rad = ((Number(p.drift) || 0.01) * L) / (2 * Math.PI);
    const now = on('drift') && t ? buildMap([rad * Math.sin(th), rad * (1 - Math.cos(th)), th]) : base;
    const { lab: lab0, area, cent } = base;
    const lab = now.lab;
    const cellAt = (x, y) => lab[Math.min(rh - 1, Math.max(0, Math.floor(y / cs))) * rw + Math.min(rw - 1, Math.max(0, Math.floor(x / cs)))];

    // ── What each shape holds ──
    const styles = gf.styles ?? [gf];
    const upright = styles.find((st) => st.style === 'Medium') ?? gf;
    // Patterns carry the colour, so by default they're set heavier than the copy.
    const heavy = { bold: /^Extrabold$/, medium: /^Medium$/, light: /^Light$/ }[p.weight];
    const patternStyle = styles.find((st) => heavy?.test(st.style ?? '')) ?? upright;
    const sturdy = styles.filter((st) => !/thin/i.test(st.style ?? ''));
    const readable = styles.filter((st) => /^(Light|Medium)/.test(st.style ?? ''));
    const want = CHARACTERS[p.characters] ?? CHARACTERS.all;
    let pool = solid(gf).filter((g) => want(g) && (p.characters !== 'all' || g.group !== 'symbol' || rng() < 0.5));
    if (!pool.length) pool = solid(gf);
    const families = letters(pool).filter((f) => f.length > (['kana', 'hiragana', 'katakana'].includes(p.characters) ? 1 : 2));
    const markNames = ['quotedblleft', 'quotedblright', 'quoteleft', 'period', 'comma', 'hyphen', 'asterisk', 'colon', 'semicolon', 'exclam', 'question', 'slash'];
    const marks = gf.glyphs.filter((g) => markNames.includes(g.name));
    const ids = [...area.keys()].sort((A, B) => A - B);
    const total = rw * rh;
    // Text goes to the larger shapes until it covers about `text` of the poster.
    const textual = new Set();
    let covered = 0;
    for (const id of ids
      .map((id) => [id, area.get(id) * rng.range(0.3, 1.7)])
      .sort((A, B) => B[1] - A[1])
      .map(([id]) => id)) {
      if (covered >= (p.copy === 'none' ? 0 : p.text) * total) break;
      if (area.get(id) < total * 0.008) continue;
      textual.add(id);
      covered += area.get(id);
    }
    // All text shapes act as one text area, so copy flows across their seams.
    const TEXT = -2;
    const regionAt = (x, y) => {
      const id = cellAt(x, y);
      return textual.has(id) ? TEXT : id;
    };
    // Neighbouring sections never share an ink.
    const near = new Map();
    const touch = (a, b) => {
      if (a === b) return;
      if (!near.has(a)) near.set(a, new Set());
      if (!near.has(b)) near.set(b, new Set());
      near.get(a).add(b);
      near.get(b).add(a);
    };
    const key = (id) => (textual.has(id) ? TEXT : id);
    for (let j = 0; j < rh - 1; j++) {
      for (let i = 0; i < rw - 1; i++) {
        const o = j * rw + i;
        touch(key(lab0[o]), key(lab0[o + 1]));
        touch(key(lab0[o]), key(lab0[o + rw]));
      }
    }
    const inkOf = new Map();
    for (const id of [TEXT, ...ids.filter((id) => !textual.has(id))]) {
      const taken = new Set([...(near.get(id) ?? [])].map((n) => inkOf.get(n)));
      const free = INKS.filter((c) => !taken.has(c));
      inkOf.set(id, rng.pick(free.length ? free : INKS));
    }
    const props = new Map([[TEXT, { id: TEXT, mode: 'text', F: upright, color: inkOf.get(TEXT) }]]);
    for (const id of ids) {
      const color = inkOf.get(key(id));
      if (textual.has(id)) {
        props.set(id, { id, mode: 'text', F: p.style === 'mixed' && readable.length ? rng.pick(readable) : upright, color });
        continue;
      }
      const F = p.style === 'mixed' ? rng.pick(sturdy.length ? sturdy : styles) : patternStyle;
      const r = rng();
      let seq;
      if (r < 0.45) seq = [rng.pick(pool)];
      else if (r < 0.8 && families.length) seq = rng.pick(families);
      else seq = [rng.pick(pool), rng.pick(marks.length ? marks : pool)];
      props.set(id, { id, mode: 'pattern', F, seq, color });
    }

    // ── Motion ──
    // A shape that only appears once the map drifts takes a neighbour's settings.
    const propsOf = (id) => {
      let R = props.get(id);
      if (!R) {
        const known = ids.filter((k) => !textual.has(k));
        R = { ...props.get(known[Math.abs(id * 2654435761) % known.length]), id };
        props.set(id, R);
      }
      return R;
    };
    // Where a shape sits along the sweep, 0 to 1: waves and the rub-down travel this way.
    const along = new Map();
    {
      const vals = [...cent].map(([id, [x, y]]) => [key(id), (x * dx + y * dy) / W]);
      const min = Math.min(...vals.map((v) => v[1]));
      const max = Math.max(...vals.map((v) => v[1]));
      for (const [k, v] of vals) if (!along.has(k)) along.set(k, (v - min) / (max - min || 1));
    }
    const phase = (id) => along.get(id) ?? 0.5;
    // Steps since t = 0, all sections together or staggered along the sweep; 0 at t = 0.
    const stepped = (id, spread) => (spread ? Math.floor(tick - phase(id) * spread) - Math.floor(-phase(id) * spread) : tick);
    const inkStep = (id) => (on('colour step') ? stepped(id, 0) : on('colour wave') ? stepped(id, 5) : 0);
    const colorOf = (R) => {
      const n = INKS.length;
      const i = INKS.indexOf(R.color);
      return INKS[(((i < 0 ? 0 : i) + inkStep(R.id)) % n + n) % n];
    };
    const poolIndex = new Map(pool.map((g, i) => [g.id, i]));
    const nextIn = (g, d) => {
      const i = poolIndex.get(g.id);
      return i === undefined ? g : pool[(((i + d) % pool.length) + pool.length) % pool.length];
    };
    // March: a run of one glyph broken by its neighbour, so the rows visibly travel.
    const seqOf = (R) => (on('march') && R.seq.length === 1 ? [R.seq[0], R.seq[0], R.seq[0], nextIn(R.seq[0], 1)] : R.seq);
    // Rub down: sections arrive one by one along the sweep, hold, then lift off.
    const order = [...along.keys()].sort((A, B) => along.get(A) - along.get(B));
    const rank = new Map(order.map((k, i) => [k, i]));
    // Everything: some pattern sections thin out, drop away and come back, each on its own
    // beat, in whole-frame steps; the copy always stays.
    const beat = (id) => {
      let h = Math.imul((id + 7) ^ 0x5bd1e995, 0x27d4eb2d) >>> 0;
      h ^= h >>> 15;
      return h;
    };
    const fade = (id) => {
      if (!all || id === TEXT || beat(id) % 3 === 0) return 0; // a third never fade
      const P = 56;
      const u = (t + 7 + ((beat(id) >>> 4) % (P - 7))) % P; // nothing thinned at t = 0
      const small = (area.get(id) ?? 0) < total * 0.012;
      // Thin to every other glyph, then every third (small sections go entirely), then back.
      return u < 2 ? 1 : u < 5 ? (small ? 3 : 2) : u < 7 ? 1 : 0;
    };
    // Turbulence (drift): white space opens at random. Once a second each pattern section
    // rolls whether it thins (random glyphs drop) or goes; single glyphs drop too. The copy
    // only loses the odd glyph. The first roll of each loop is always whole, so t = 0 (the
    // still) is whole and the loop's seam holds whole for a second rather than flickering.
    const TURB = [
      { thin: 0, gone: 0, glyph: 0 },
      { thin: 0.1, gone: 0.03, glyph: 0.01 },
      { thin: 0.2, gone: 0.08, glyph: 0.04 },
      { thin: 0.32, gone: 0.16, glyph: 0.1 },
    ][Math.max(0, Math.min(3, Number(p.turbulence) || 0))];
    const hash = (a, b) => {
      let h = Math.imul(a ^ 0x9e3779b1, 0x85ebca6b) ^ Math.imul(b + 0x632be5ab, 0xc2b2ae35);
      h = Math.imul(h ^ (h >>> 13), 0x27d4eb2d);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    };
    const turbulent = !all && TURB.thin + TURB.glyph > 0;
    const gw = Math.floor(t / 8); // single glyphs roll together, once a second
    const stir = (id, n) => {
      if (!turbulent) return true;
      if (id === TEXT) return !gw || hash(n, gw) >= TURB.glyph * 0.4;
      const w = Math.floor(((t + (beat(id) % 8)) % L) / 8); // each section rolls on its own beat, once a second
      if (w) {
        const r = hash(beat(id), w);
        if (r < TURB.gone) return false;
        if (r < TURB.gone + TURB.thin && hash(n, w) < 0.55) return false;
      }
      return !gw || hash(n, gw) >= TURB.glyph;
    };
    const shown = (id, i = 0, n = i) => {
      if (!stir(id, n)) return false;
      const f = fade(id);
      if (f === 3 || (f === 2 && i % 3) || (f === 1 && i % 2)) return false;
      if (!on('rub down') || all) return true;
      const N = order.length;
      const P = Math.ceil(N / 3);
      const u = (t + N) % (2 * N + 2 * P); // one section a frame; t = 0 is the full poster
      const r = rank.get(id) ?? 0;
      if (u < N) return r < u;
      if (u < N + P) return true;
      if (u < 2 * N + P) return r >= u - N - P;
      return false;
    };
    // Boil: every glyph sits a fraction off, re-placed every second frame.
    const boil = p.boil === 'on' && t >= 2; // the still (t = 0, and its held frame) sits exactly
    const jitter = (n) => {
      let h = (n ^ Math.imul(Math.floor(t / 2) + 1, 0x9e3779b1)) >>> 0;
      h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d) >>> 0;
      h = Math.imul(h ^ (h >>> 12), 0x297a2d39) >>> 0;
      return ((h ^ (h >>> 15)) >>> 0) / 4294967296 - 0.5;
    };

    // ── Colour: a soft field across the square, blended through the light inks ──
    const rgb = INKS.map((c) => [1, 3, 5].map((o) => parseInt(c.slice(o, o + 2), 16)));
    const colorAt = (x, y) => {
      const v = fbm(noise, (x / W) * p.hue + 11.3, (y / W) * p.hue - 7.1, 2) * 1.6 + 0.5 + 0.35 * ((x + y) / (W + H));
      const t = (((v % 1) + 1) % 1) * rgb.length;
      const i = Math.floor(t);
      const A = rgb[i % rgb.length];
      const B = rgb[(i + 1) % rgb.length];
      return `rgb(${A.map((c, n) => Math.round(c + (B[n] - c) * (t - i))).join(' ')})`;
    };

    if (p.show !== 'type') {
      ctx.save();
      for (let j = 0; j < rh; j++) {
        for (let i = 0; i < rw; i++) {
          const id = lab[j * rw + i];
          ctx.fillStyle = `hsl(${(id * 47) % 360} 60% ${textual.has(id) ? 30 : 18}%)`;
          ctx.fillRect(i * cs, j * cs, cs + 0.5, cs + 0.5);
        }
      }
      ctx.restore();
      if (p.show === 'shapes') return;
    }

    // ── Set the lines ──
    const size = p.size * W;
    const s = size / gf.upm;
    const lead = size * p.leading;
    const track = p.tracking * size;
    const space = (upright.font.glyphForCodePoint(32).advanceWidth || gf.upm * 0.25) * s;
    const m = space; // the margin on every side is one character space
    // A tag ("last chance to buy") stays together as one token, like a word.
    const words = p.copy === 'tags' ? TAGS.split(' · ') : (p.copy === 'kana' ? KANA : MOXON).split(/\s+/);
    const setGlyphs = p.copy === 'glyph set' ? letters(gf.glyphs) : null;
    let ti = 0;
    let gi = 0;
    const shaped = new Map();
    const tokenFor = (F) => {
      const key = `${F.style}|${setGlyphs ? ti % setGlyphs.length : ti % words.length}`;
      if (!shaped.has(key)) {
        shaped.set(
          key,
          setGlyphs
            ? setGlyphs[ti % setGlyphs.length].map((g) => {
                const id = F.byName.get(g.name) ?? g.id;
                return { id, w: F.adv(id) * s + track };
              })
            : F.shape(words[ti % words.length]).map((q) => ({ id: q.id, w: q.adv * s + track })),
        );
      }
      return shaped.get(key);
    };
    const idIn = (F, g) => (F === gf ? g.id : (F.byName.get(g.name) ?? g.id));
    const hyphenOf = (F) => {
      const id = F.font.glyphForCodePoint(0x2d).id;
      return { id, w: F.adv(id) * s + track };
    };
    let drawn = 0;
    // Glyphs are collected per line, then the line is justified to the right margin.
    let line = [];
    const put = (F, id, x, y, R) => line.push({ F, id, x, R, w: F.adv(id) * s });
    const flush = (y) => {
      if (!line.length) return;
      const last = line[line.length - 1];
      const extra = right - (last.x + last.w);
      const step = line.length > 1 && extra > 0 && extra < size * 2 ? extra / (line.length - 1) : 0;
      line.forEach((g, i) => {
        if (!shown(g.R.id, i, Math.round(y) * 4099 + i)) return;
        let x = g.x + step * i;
        let yy = y;
        let ang = 0;
        if (boil) {
          const n = Math.round(y) * 4099 + i;
          x += jitter(n) * size * 0.07;
          yy += jitter(n + 7919) * size * 0.07;
          ang = jitter(n + 104729) * 0.035;
        }
        ctx.fillStyle = p.color === 'flow' ? colorAt(x, yy) : colorOf(g.R);
        g.F.draw(ctx, g.id, {}, x, yy, size, ang, 'baseline');
        drawn++;
      });
      line = [];
    };

    const right = W - m;
    const probe = size * 0.3; // sample the map at the glyph's middle
    // Lines from the cap height at the top margin to the descender at the bottom margin,
    // the leading eased so both margins come out equal.
    const capTop = gf.capHeight * s;
    const desc = size * 0.22;
    const span = H - 2 * m - capTop - desc;
    const rows = Math.max(1, Math.floor(span / lead) + 1);
    const step = rows > 1 ? span / (rows - 1) : 0;
    for (let r = 0, y = m + capTop; r < rows; r++, y = m + capTop + r * step) {
      let x = m;
      let cur = null;
      let k = 0;
      let gap = false; // a word space is owed before the next word on this line
      let hold = -1; // the current shape is kept until here (it took over a text shape's leftover)
      while (x < right) {
        let id = regionAt(x + size * 0.25, y - probe);
        // Switch shapes only when the next shape continues ahead, so ragged edges don't flicker.
        if (x < hold) id = cur;
        else if (cur !== null && id !== cur && regionAt(x + size * 0.9, y - probe) !== id) id = cur;
        if (cur !== null && id !== cur) {
          x += space;
          cur = id;
          k = 0;
          gap = false;
          continue;
        }
        cur = id;
        const R = propsOf(id);
        if (R.mode === 'pattern') {
          const seq = seqOf(R);
          const kk = on('march') ? k + (r % 2 ? tick : -tick) : k;
          let g = seq[((kk % seq.length) + seq.length) % seq.length];
          if (on('glyph cycle')) g = nextIn(g, stepped(id, 3));
          const gid = idIn(R.F, g);
          const w = R.F.adv(gid) * s + track;
          if (x + w > right) break;
          put(R.F, gid, x, y, R);
          x += w;
          k++;
          continue;
        }
        // Text: whole words where they fit inside the shape; otherwise break with a hyphen.
        const fits = (end) => end <= right && regionAt(end - size * 0.2, y - probe) === id;
        if (gap && gi === 0) {
          x += space;
          gap = false;
          continue;
        }
        const tok = tokenFor(R.F).slice(gi);
        const wTok = tok.reduce((acc, q) => acc + q.w, 0);
        if (fits(x + wTok)) {
          for (const q of tok) {
            put(R.F, q.id, x, y, R);
            x += q.w;
          }
          ti++;
          gi = 0;
          gap = true;
          continue;
        }
        const hy = hyphenOf(R.F);
        let n = 0;
        let w = 0;
        while (n < tok.length && fits(x + w + tok[n].w + hy.w)) w += tok[n++].w;
        if (n >= 2 && tok.length - n >= 2) {
          for (const q of tok.slice(0, n)) {
            put(R.F, q.id, x, y, R);
            x += q.w;
          }
          put(R.F, hy.id, x, y, R);
          x += hy.w;
          gi += n;
        }
        // What's left of this shape on the line is too short for the next word: hand it to
        // the next shape along the line, which starts early after a single space.
        let edge = x;
        while (edge < right && regionAt(edge + size * 0.25, y - probe) === id) edge += size * 0.25;
        edge = Math.max(edge, x + size * 0.25); // always move on
        if (edge >= right) break;
        const next = regionAt(edge + size * 0.25, y - probe);
        if (propsOf(next).mode === 'text') {
          x = edge;
          continue;
        }
        hold = edge;
        cur = next;
        k = 0;
        gap = false;
        x += space;
      }
      flush(y);
    }
    globalThis.__flow = { drawn };
    return { glyphs: drawn, shapes: ids.length };
  },
};
