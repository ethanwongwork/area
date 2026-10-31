/**
 * What a typeface's file says about it, for the Typography page's About tab: its metrics, axes, styles, features and
 * characters, and the weights and size adjust that hold Area's ramp when it stands in for Geist
 * (docs/research/typefaces-2026-10-31/README.md: the stem method of stem.py, ported). Shared by the generator
 * (scripts/typefaces.mjs, for the faces Area ships) and the Electron main process (electron/main.cjs, for faces installed
 * on the Mac), so both measure the same way. Takes a fontkit font; reads nothing from disk.
 */

/** Geist at 400, 500 and 600, per em (the research's measurements): the reference every face is matched to. */
const GEIST = { xHeight: 0.53, stem: { 400: 0.084, 500: 0.106, 600: 0.128 } };

const round = (value, places = 3) => Number(value.toFixed(places));

/** The path flattened to polygons: curves as 16 straight steps, as the research's pen did. */
function polygons(path) {
  const out = [];
  let current = null, start = null, last = null;
  for (const { command, args } of path.commands) {
    if (command === "moveTo") { current = [[args[0], args[1]]]; out.push(current); start = last = [args[0], args[1]]; }
    else if (command === "lineTo") { last = [args[0], args[1]]; current.push(last); }
    else if (command === "quadraticCurveTo") {
      const [cx, cy, x, y] = args, [x0, y0] = last;
      for (let i = 1; i <= 16; i++) { const t = i / 16, m = 1 - t; current.push([m * m * x0 + 2 * m * t * cx + t * t * x, m * m * y0 + 2 * m * t * cy + t * t * y]); }
      last = [x, y];
    } else if (command === "bezierCurveTo") {
      const [ax, ay, bx, by, x, y] = args, [x0, y0] = last;
      for (let i = 1; i <= 16; i++) {
        const t = i / 16, m = 1 - t;
        current.push([m ** 3 * x0 + 3 * m * m * t * ax + 3 * m * t * t * bx + t ** 3 * x, m ** 3 * y0 + 3 * m * m * t * ay + 3 * m * t * t * by + t ** 3 * y]);
      }
      last = [x, y];
    } else if (command === "closePath" && start) last = start;
  }
  return out;
}

/** The x positions where a horizontal line at `y` crosses the glyph's outline, left to right. */
function crossings(glyph, y) {
  const xs = [];
  for (const points of polygons(glyph.path)) {
    for (let i = 0; i < points.length; i++) {
      const [x1, y1] = points[i], [x2, y2] = points[(i + 1) % points.length];
      if ((y1 <= y && y < y2) || (y2 <= y && y < y1)) xs.push(x1 + ((y - y1) * (x2 - x1)) / (y2 - y1));
    }
  }
  return xs.sort((a, b) => a - b);
}

const top = (font, char) => { const glyph = font.glyphForCodePoint(char.codePointAt(0)); return glyph?.bbox ? glyph.bbox.maxY : 0; };

/** The lowercase stem: the first span where a line at half the x-height crosses "l", per em. */
function stem(font, xHeight) {
  const glyph = font.glyphForCodePoint(108);
  if (!glyph) return null;
  const xs = crossings(glyph, xHeight / 2);
  return xs.length >= 2 ? (xs[1] - xs[0]) / font.unitsPerEm : null;
}

/** The weight whose stem steps as far over this face's 400 as Geist's `target` steps over Geist's. */
function weightFor(stems, target) {
  const ratio = GEIST.stem[target] / GEIST.stem[400];
  const want = stems[400] * ratio;
  if (stems[500] == null || stems[600] == null) return null;
  const w = want <= stems[500] ? 400 + (100 * (want - stems[400])) / (stems[500] - stems[400]) : 500 + (100 * (want - stems[500])) / (stems[600] - stems[500]);
  return Number.isFinite(w) ? Math.round(w / 10) * 10 : null;
}

/** Measurements of one font (a single file, at its default instance), for the About tab's Metrics and Area tuning. */
function measure(font) {
  const em = font.unitsPerEm;
  const xHeight = top(font, "x") || font.xHeight, capHeight = top(font, "H") || font.capHeight;
  const lower = "abcdefghijklmnopqrstuvwxyz".split("").map(char => font.glyphForCodePoint(char.codePointAt(0))).filter(glyph => glyph?.id);
  const average = lower.length ? lower.reduce((sum, glyph) => sum + glyph.advanceWidth, 0) / lower.length : 0;
  const metrics = {
    unitsPerEm: em,
    xHeight: round(xHeight / em), capHeight: round(capHeight / em), xToCap: capHeight ? round(xHeight / capHeight) : null,
    ascender: round(font.ascent / em), descender: round(font.descent / em), lineHeight: round((font.ascent - font.descent + font.lineGap) / em, 2),
    averageWidth: round(average / em),
  };
  const axes = font.variationAxes ?? {};
  const tuning = { xHeightAdjust: xHeight ? round(GEIST.xHeight / (xHeight / em), 2) : null };
  const at = weight => { const instance = axes.wght ? font.getVariation({ wght: Math.max(axes.wght.min, Math.min(axes.wght.max, weight)) }) : font; return stem(instance, xHeight); };
  const s400 = at(400);
  if (s400) {
    tuning.stem = round(s400 / GEIST.stem[400], 2);
    tuning.iconStroke = round(1.125 * (s400 / GEIST.stem[400]), 3);
    if (axes.wght) {
      const stems = { 400: s400, 500: at(500), 600: at(600) };
      tuning.strong = weightFor(stems, 500);
      tuning.emphasis = weightFor(stems, 600);
    }
  }
  tuning.tracking = axes.opsz ? "optical" : "manual";
  return { metrics, tuning };
}

/** The strong and emphasis weights of a static family: the weights on offer whose stems step nearest Geist's. */
function staticWeights(stemsByWeight) {
  // The regular: 400, else the lightest weight at or above it, else the heaviest below it.
  const weights = Object.keys(stemsByWeight).map(Number).sort((a, b) => a - b);
  const regular = weights.includes(400) ? 400 : weights.find(weight => weight > 400) ?? weights[weights.length - 1];
  const base = stemsByWeight[regular];
  if (!base) return {};
  const nearest = target => {
    const want = base * (GEIST.stem[target] / GEIST.stem[400]);
    const options = Object.entries(stemsByWeight).filter(([weight]) => Number(weight) > regular);
    if (!options.length) return null;
    return Number(options.reduce((best, entry) => Math.abs(entry[1] - want) < Math.abs(best[1] - want) ? entry : best)[0]);
  };
  return { strong: nearest(500), emphasis: nearest(600) };
}

/** The axes as rows: tag, name, minimum, default, maximum. */
const axesOf = font => Object.entries(font.variationAxes ?? {}).map(([tag, axis]) => ({ tag, name: axis.name, min: axis.min, default: axis.default, max: axis.max }));

/** The named instances (Thin … Black), where the file still names them (Google's subsets sometimes don't). */
function instancesOf(font) {
  try { return Object.keys(font.namedVariations ?? {}); } catch { return []; }
}

/** Characters as sorted [first, last] ranges. */
function ranges(codePoints) {
  const sorted = [...new Set(codePoints)].filter(cp => cp > 0x1f && cp !== 0x7f).sort((a, b) => a - b);
  const out = [];
  for (const cp of sorted) { const last = out[out.length - 1]; if (last && cp === last[1] + 1) last[1] = cp; else out.push([cp, cp]); }
  return out;
}

/** A font's own words: the name table's fields the About tab shows, where the file has them. */
function names(font) {
  const pick = key => { try { const value = font.getName(key); return value ? String(value).trim() : undefined; } catch { return undefined; } };
  return { family: font.familyName, style: font.subfamilyName, version: font.version, designer: pick("designer"), manufacturer: pick("manufacturer"), copyright: pick("copyright"), licenseURL: pick("licenseURL") };
}

module.exports = { GEIST, measure, staticWeights, stem, axesOf, instancesOf, ranges, names };
