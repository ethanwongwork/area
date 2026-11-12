// Every glyph of a variable font as a drawable outline, at any axis setting.
//
// fontkit reads the font file itself, so the whole glyph set is reachable by glyph id:
// stylistic alternates, ligatures and other glyphs with no character of their own included.
// Outlines are cached per (instance, glyph) as Path2D and drawn on a canvas, so every
// glyph can take its own weight, width or contrast.
import { create } from 'fontkit';

// Axis values are rounded to these steps so instances and outlines can be cached.
const STEP = { wght: 25, wdth: 5, CNTR: 5, MONO: 10, slnt: 1, GAPS: 5, XHGT: 10, opsz: 2, DRKM: 1 };

/** Trial font files registered by the trial-fonts Vite plugin: [{ url, name }]. */
export function trialFiles() {
  const meta = document.querySelector('meta[name="trial-font-files"]');
  if (!meta?.content) return [];
  return meta.content.split(',').map((url) => ({ url, name: decodeURIComponent(url.split('/').pop()) }));
}

export async function loadGlyphFont(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  return new GlyphFont(create(new Uint8Array(await res.arrayBuffer())));
}

export class GlyphFont {
  constructor(font) {
    this.font = font;
    this.name = font.familyName.replace(/[\s-]*TRIAL$/i, '').replace(/\s*(VF|Variable)$/i, '');
    this.upm = font.unitsPerEm;
    this.ascent = font.ascent;
    this.descent = font.descent; // negative
    this.capHeight = font.capHeight || font.ascent * 0.7;
    this.xHeight = font.xHeight || this.capHeight * 0.7;
    this.axes = font.variationAxes ?? {};
    this._inst = new Map();
    this._paths = new Map();
    this._adv = new Map();

    /** The whole set: every glyph that has an outline, in the font's own order. */
    // fontkit leaves codePoints empty for glyphs fetched by id, so map the cmap backwards.
    const chars = new Map();
    for (const c of [...font.characterSet].sort((a, b) => a - b)) {
      const id = font.glyphForCodePoint(c).id;
      if (!chars.has(id)) chars.set(id, c);
    }
    this.glyphs = [];
    for (let id = 1; id < font.numGlyphs; id++) {
      const g = font.getGlyph(id);
      if (!g.path.commands.length) continue;
      const cp = chars.get(id);
      this.glyphs.push({ id, name: g.name, cp, group: group(g.name, cp) });
    }
    this.byId = new Map(this.glyphs.map((g) => [g.id, g]));
    this.byName = new Map(this.glyphs.map((g) => [g.name, g.id]));
  }

  /** Glyphs of one group: upper, lower, cyrillic, greek, figure, mark, alternate, symbol. */
  group(...names) {
    return this.glyphs.filter((g) => names.includes(g.group));
  }

  _norm(axes = {}) {
    const out = {};
    let key = '';
    for (const [tag, a] of Object.entries(this.axes)) {
      const step = STEP[tag] ?? 1;
      let v = axes[tag] ?? a.default;
      v = Math.round(Math.min(a.max, Math.max(a.min, v)) / step) * step;
      v = Math.min(a.max, Math.max(a.min, v));
      out[tag] = v;
      key += tag + v;
    }
    return [out, key];
  }

  _instance(axes) {
    const [q, key] = this._norm(axes);
    let f = this._inst.get(key);
    if (!f) {
      f = Object.keys(q).length ? this.font.getVariation(q) : this.font;
      this._inst.set(key, f);
    }
    return [f, key];
  }

  /** { path: Path2D in font units (y up), adv, bbox } */
  get(id, axes) {
    const [f, key] = this._instance(axes);
    const k = `${key}|${id}`;
    let g = this._paths.get(k);
    if (!g) {
      const glyph = f.getGlyph(id);
      g = { path: new Path2D(glyph.path.toSVG()), adv: glyph.advanceWidth, bbox: glyph.path.bbox };
      this._paths.set(k, g);
    }
    return g;
  }

  adv(id, axes) {
    const [f, key] = this._instance(axes);
    const k = `${key}|${id}`;
    let a = this._adv.get(k);
    if (a === undefined) {
      a = f.getGlyph(id).advanceWidth;
      this._adv.set(k, a);
    }
    return a;
  }

  /** Shapes a string with the font's own kerning and ligatures: [{ id, adv }] in font units. */
  shape(text, axes) {
    const [f] = this._instance(axes);
    const run = f.layout(text);
    return run.glyphs.map((g, i) => ({ id: g.id, adv: run.positions[i].xAdvance }));
  }

  /** The width axis value that brings a glyph's advance closest to `target` (font units). */
  fitWidth(id, target, axes = {}) {
    const w = this.axes.wdth;
    if (!w) return axes;
    const lo = this.adv(id, { ...axes, wdth: w.min });
    const hi = this.adv(id, { ...axes, wdth: w.max });
    const t = hi === lo ? 0.5 : (target - lo) / (hi - lo);
    return { ...axes, wdth: w.min + Math.min(1, Math.max(0, t)) * (w.max - w.min) };
  }

  /**
   * Draws a glyph. (x, y) is the anchor: by default the centre of its advance on the
   * line through the middle of the cap height, so glyphs sit centred in a cell.
   */
  draw(ctx, id, axes, x, y, size, angle = 0, anchor = 'centre') {
    const g = this.get(id, axes);
    const s = size / this.upm;
    ctx.save();
    ctx.translate(x, y);
    if (angle) ctx.rotate(angle);
    if (anchor === 'centre') ctx.translate((-g.adv / 2) * s, (this.capHeight / 2) * s);
    ctx.scale(s, -s);
    ctx.fill(g.path);
    ctx.restore();
    return g.adv * s;
  }

  /**
   * Ink coverage of each { id, axes } in a cell of cellW × cellH ems, 0–1, measured by
   * drawing them all into one atlas and counting pixels.
   */
  coverage(list, cellW = 0.6, cellH = 1.15, px = 40) {
    const cw = Math.round(px * cellW);
    const ch = Math.round(px * cellH);
    const cols = 64;
    const rows = Math.ceil(list.length / cols);
    const c = new OffscreenCanvas(cols * cw, rows * ch);
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.fillStyle = '#000';
    list.forEach((item, i) => {
      const x = (i % cols) * cw;
      const y = Math.floor(i / cols) * ch;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, cw, ch);
      ctx.clip();
      this.draw(ctx, item.id, item.axes, x + cw / 2, y + ch / 2, px);
      ctx.restore();
    });
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    return list.map((_, i) => {
      const x0 = (i % cols) * cw;
      const y0 = Math.floor(i / cols) * ch;
      let sum = 0;
      for (let y = y0; y < y0 + ch; y++) {
        let o = (y * c.width + x0) * 4 + 3;
        for (let x = 0; x < cw; x++, o += 4) sum += data[o];
      }
      return sum / (cw * ch * 255);
    });
  }
}

function group(name, cp) {
  if (cp === undefined) return 'alternate';
  if (cp >= 0x400 && cp <= 0x52f) return 'cyrillic';
  if (cp >= 0x370 && cp <= 0x3ff) return 'greek';
  if ((cp >= 0x300 && cp <= 0x36f) || (cp >= 0x2b0 && cp <= 0x2ff)) return 'mark';
  const ch = String.fromCodePoint(cp);
  if (/\p{N}/u.test(ch)) return 'figure';
  if (/\p{Lu}/u.test(ch)) return 'upper';
  if (/\p{L}/u.test(ch)) return 'lower';
  return 'symbol';
}

/** Small seeded random. */
export function random(seed) {
  let a = seed >>> 0;
  const r = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  r.range = (lo, hi) => lo + r() * (hi - lo);
  r.int = (lo, hi) => Math.floor(r.range(lo, hi + 1));
  r.pick = (arr) => arr[Math.floor(r() * arr.length)];
  r.chance = (p) => r() < p;
  return r;
}
