#!/usr/bin/env node
// Lint the Area icon pilot sources and generate src/pilot-icons.tsx.
//   node apps/docs/scripts/gen-pilot-icons.mjs          # lint + generate
//   node apps/docs/scripts/gen-pilot-icons.mjs --check  # lint only
//   add --report to list each icon's keyline, ink box and centre
// Construction rules: docs/specs/icons.md. Sources are stroked centre-line drawings on a
// 16px grid; the generated component takes the stroke width as a prop.
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "assets/area-icons-pilot");
const OUT = join(ROOT, "src/pilot-icons.tsx");
const STATUS_SRC = join(SRC, "status");
const STATUS_OUT = join(ROOT, "../../packages/react/src/components/status-marks.ts");
const GLYPHS_OUT = join(ROOT, "../../packages/react/src/components/glyphs.ts");
// Pilot icons that components draw themselves, replacing Fluent family by family
// (docs/specs/icons.md, "Components"). A glyph is a whole icon, or one element of one
// (check-inset is the check inside the Available ring, for boxed checks).
const PACKAGE_GLYPHS = { "arrow-up": ["arrow-up"], "check": ["check"], "check-inset": ["status-available", 1], "chevron-down": ["chevron-down"], "dismiss": ["dismiss"] };
const LIVE = [1.5, 14.5];      // stroke centrelines stay inside this box (ink 0.94–15.06 at 1.125px)
const LIVE_FILL = [1, 15];     // filled shapes (dots) stay inside this box
const WEIGHT = 1.125;          // --area-weight-icon; keylines and gaps are judged at this weight
const SOURCE_STROKE = "1.25";  // sources are authored at the heaviest compared weight
// Cursor's optical keylines at 16px, as ink boxes centred on 8,8 (docs/specs/icons.md).
const KEYLINES = { square: [13, 13], circle: [14, 14], horizontal: [14, 11], vertical: [11, 14] };
// Negative space, measured in ink at WEIGHT (docs/specs/icons.md, "Negative space").
// Gaps between separate shapes come from a two-step scale, so every gap is intentional:
// tight (satellites: clapper, i dot, a gear's hub) and standard (parallel strokes, pupils,
// bars), or open (≥ 2.5, no longer read as a gap). Cursor: cuts of 2.5 grid units or less blur.
// tight starts at the stroke weight: an overlap cut (a shape passing behind another) leaves
// a gap equal to the line (owner, round 4); 2.25px between centre-lines at 1.125.
const GAPS = { tight: [1.125, 1.625], standard: [1.75, 2.0] };
const OPEN = 2.5;
const JOIN = 0.1;              // closer than this (centre-lines) counts as a join, not a gap
// Counters use the same scale: a satellite pocket (a clapper cup, a document's fold) may be
// tight; every other enclosed pocket is standard or larger.
const COUNTERS = { tight: [1.25, 1.625], standard: [1.75, Infinity] };
// Filled variant (docs/specs/icons.md, "Filled"): each shape declares its role. solid fills
// the shape inside its outline edge; knockout cuts the stroke out of the solids at the icon
// weight; hole cuts the shape's interior out. Unmarked shapes are drawn as in the outline.
// An icon with no solid shape (a line glyph) has no filled variant.
// cut: a layer line (fold, flap). Drawn in the outline; in the filled variant it becomes a
//   separation gap at the icon weight with square ends and sharp corners, extended past
//   the silhouette so it runs cleanly through (Fluent's filled layering).
// gap: a separation that exists only in the filled variant (the bell's clapper).
// Line glyphs (no solid shape) fill by weight: every stroke at FILLED_WEIGHT_RATIO.
const FILLED_ROLES = ["solid", "knockout", "hole", "cut", "gap"];
const FILLED_WEIGHT_RATIO = 4 / 3;
const SIZE_CURVE = 0.45;             // line ∝ size^0.45: Cursor's 1.25px at 16 → 1.5px at 24   // 1.125 → 1.5px, Fluent's filled line weight
const BOLD = WEIGHT * FILLED_WEIGHT_RATIO;
const BOLD_GAP_MIN = 1.0;            // 2.5px between centre-lines at 1.5px: Cursor's floor
const RASTER = 8;              // samples per px for the counter check
const onGrid = (v, step) => Math.abs(v / step - Math.round(v / step)) < 1e-6;

const attrs = tag => Object.fromEntries([...tag.matchAll(/([A-Za-z-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const errors = [];
let sink = errors;  // exploration candidates collect their findings instead of failing
const fail = (name, message) => sink.push(`${name}: ${message}`);

// Sample an SVG elliptical arc (endpoint parameterisation, SVG 1.1 appendix F.6.5).
function arcPoints(x1, y1, rx, ry, rotDeg, large, sweep, x2, y2) {
  const phi = rotDeg * Math.PI / 180, cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const xp = cos * dx + sin * dy, yp = -sin * dx + cos * dy;
  const lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
  if (lambda > 1) { rx *= Math.sqrt(lambda); ry *= Math.sqrt(lambda); }
  const sign = large === sweep ? -1 : 1;
  const num = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp;
  const coef = sign * Math.sqrt(Math.max(0, num / (rx * rx * yp * yp + ry * ry * xp * xp)));
  const cxp = coef * (rx * yp) / ry, cyp = coef * -(ry * xp) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2, cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const angle = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = angle(1, 0, (xp - cxp) / rx, (yp - cyp) / ry);
  let dt = angle((xp - cxp) / rx, (yp - cyp) / ry, (-xp - cxp) / rx, (-yp - cyp) / ry);
  if (!sweep && dt > 0) dt -= 2 * Math.PI; else if (sweep && dt < 0) dt += 2 * Math.PI;
  const out = [];
  for (let k = 0; k <= 64; k++) {
    const t = t1 + dt * k / 64;
    out.push([cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin, cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos]);
  }
  return out;
}

// Absolute M/L/H/V/A/C/Z only. Returns line segments and every point that bounds the shape.
function parsePath(name, d) {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const segments = [], points = [], samples = [], joins = [];
  // Straight-to-straight joins (no curve between), for the acute-angle rule.
  let lastSeg = null, firstSeg = null;
  const seg = (x1, y1, x2, y2) => {
    const s = [x1, y1, x2, y2];
    if (Math.hypot(x2 - x1, y2 - y1) < 1e-6) return;
    if (lastSeg) joins.push([lastSeg, s]); else if (!firstSeg) firstSeg = s;
    lastSeg = s;
  };
  const line = (x1, y1, x2, y2) => { const n = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 0.05)); for (let k = 0; k <= n; k++) samples.push([x1 + (x2 - x1) * k / n, y1 + (y2 - y1) * k / n]); };
  let i = 0, cmd = "", x = 0, y = 0, sx = 0, sy = 0;
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++];
    if (/[a-z]/.test(cmd) && cmd !== "z") { fail(name, `relative command "${cmd}" is not allowed; author absolute paths`); return { segments, points, samples }; }
    if (cmd === "M") { x = num(); y = num(); sx = x; sy = y; points.push([x, y]); cmd = "L"; lastSeg = null; firstSeg = null; }
    else if (cmd === "L") { const nx = num(), ny = num(); segments.push([x, y, nx, ny]); seg(x, y, nx, ny); line(x, y, nx, ny); x = nx; y = ny; points.push([x, y]); }
    else if (cmd === "H") { const nx = num(); segments.push([x, y, nx, y]); seg(x, y, nx, y); line(x, y, nx, y); x = nx; points.push([x, y]); }
    else if (cmd === "V") { const ny = num(); segments.push([x, y, x, ny]); seg(x, y, x, ny); line(x, y, x, ny); y = ny; points.push([x, y]); }
    else if (cmd === "C") {
      lastSeg = null; firstSeg = firstSeg ?? "curve";
      const c = [num(), num(), num(), num(), num(), num()];
      for (let k = 0; k <= 64; k++) { const t = k / 64, u = 1 - t; samples.push([u * u * u * x + 3 * u * u * t * c[0] + 3 * u * t * t * c[2] + t * t * t * c[4], u * u * u * y + 3 * u * u * t * c[1] + 3 * u * t * t * c[3] + t * t * t * c[5]]); }
      points.push(...samples.slice(-65)); x = c[4]; y = c[5];
    } else if (cmd === "Q") {
      lastSeg = null; firstSeg = firstSeg ?? "curve";
      const c = [num(), num(), num(), num()];
      for (let k = 0; k <= 32; k++) { const t = k / 32, u = 1 - t; samples.push([u * u * x + 2 * u * t * c[0] + t * t * c[2], u * u * y + 2 * u * t * c[1] + t * t * c[3]]); }
      points.push(...samples.slice(-33)); x = c[2]; y = c[3];
    } else if (cmd === "A") {
      lastSeg = null; firstSeg = firstSeg ?? "curve";
      const [rx, ry, rot, large, sweep] = [num(), num(), num(), num(), num()]; const nx = num(), ny = num();
      const arc = arcPoints(x, y, rx, ry, rot, large, sweep, nx, ny);
      points.push(...arc); samples.push(...arc);
      x = nx; y = ny;
    } else if (cmd === "Z" || cmd === "z") {
      segments.push([x, y, sx, sy]); seg(x, y, sx, sy);
      if (lastSeg && Array.isArray(firstSeg)) joins.push([lastSeg, firstSeg]);
      line(x, y, sx, sy); x = sx; y = sy; if (i < tokens.length && !/[A-Za-z]/.test(tokens[i])) i++; }
    else { fail(name, `unsupported command "${cmd}"`); return { segments, points, samples }; }
  }
  return { segments, points, samples, joins };
}

// The angle between two joined straight segments, measured inside the corner (180 = straight).
const joinAngle = ([ax1, ay1, ax2, ay2], [bx1, by1, bx2, by2]) => {
  const u = [ax1 - ax2, ay1 - ay2], v = [bx2 - bx1, by2 - by1];
  return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))))) * 180 / Math.PI;
};
const ACUTE = 60;   // straight joins sharper than this need a fillet (an arc) or a wider angle

// Filled line glyphs draw at BOLD, which grows each round cap by (BOLD − WEIGHT) / 2. Free
// ends (touching nothing else) retract by that amount along their straight end segment, so
// the visible length and every gap stay exactly as in the outline.
const RETRACT = (BOLD - WEIGHT) / 2;
function retractFreeEnds(d, others) {
  if (/[Zz]/.test(d)) return d;
  return d.match(/M[^M]*/g).map((sub, index, subs) => {
    const near = [...others, ...subs.filter((_, j) => j !== index).flatMap(o => parsePath("retract", o).samples)];
    const free = ([x, y]) => near.every(([ox, oy]) => Math.hypot(ox - x, oy - y) > 0.3);
    const { segments, points } = parsePath("retract", sub);
    const tokens = sub.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g);
    const fmt = v => Number(v.toFixed(3));
    const first = segments[0], [sx, sy] = points[0];
    if (first && first[0] === sx && first[1] === sy && free([sx, sy])) {
      const l = Math.hypot(first[2] - sx, first[3] - sy);
      tokens[1] = fmt(sx + RETRACT * (first[2] - sx) / l); tokens[2] = fmt(sy + RETRACT * (first[3] - sy) / l);
    }
    // An arc end retracts along the arc itself: the new end is the arc sample RETRACT away,
    // which stays on the same circle, so the arc keeps its radius and flags.
    const along = (pts, from) => { let run = 0; for (let k = 1; k < pts.length; k++) { run += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]); if (run >= RETRACT) return pts[k]; } return from; };
    const cmds = tokens.filter(t => /[A-Za-z]/.test(t));
    if (cmds[1] === "A" && !(first && first[0] === sx && first[1] === sy) && free([sx, sy])) {
      const arc = parsePath("retract", sub).samples;
      const [nx, ny] = along(arc, [sx, sy]); tokens[1] = fmt(nx); tokens[2] = fmt(ny);
    }
    const last = segments.at(-1), [ex, ey] = points.at(-1);
    const at = tokens.findLastIndex(t => /[A-Za-z]/.test(t));
    if (tokens[at] === "A" && tokens.length - at === 8 && free([ex, ey])) {
      const arc = parsePath("retract", sub).samples;
      const [nx, ny] = along([...arc].reverse(), [ex, ey]); tokens[at + 6] = fmt(nx); tokens[at + 7] = fmt(ny);
    }
    if (last && last[2] === ex && last[3] === ey && at > 0 && free([ex, ey]) && tokens.length - at <= 3) {
      const l = Math.hypot(ex - last[0], ey - last[1]);
      const nx = fmt(ex - RETRACT * (ex - last[0]) / l), ny = fmt(ey - RETRACT * (ey - last[1]) / l);
      if (tokens[at] === "H") tokens[at + 1] = nx; else if (tokens[at] === "V") tokens[at + 1] = ny; else if (tokens[at] === "L") { tokens[at + 1] = nx; tokens[at + 2] = ny; }
    }
    return tokens.join(" ");
  }).join(" ");
}

// Circle outline samples, for gap measurement.
const ring = (cx, cy, r) => Array.from({ length: 129 }, (_, k) => [cx + r * Math.cos(k * Math.PI / 64), cy + r * Math.sin(k * Math.PI / 64)]);
const rectSamples = (x, y, w, h) => [[x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]]
  .flatMap(([x1, y1, x2, y2]) => Array.from({ length: 41 }, (_, k) => [x1 + (x2 - x1) * k / 40, y1 + (y2 - y1) * k / 40]));
const r2 = v => Math.round(v * 100) / 100;

// Ink membership on a RASTER-per-px grid: strokes by distance to the centre-line samples,
// filled circles by radius. Returns each enclosed counter's widest inscribed disc.
function measureCounters(elements) {
  const n = 16 * RASTER, ink = new Uint8Array(n * n), near = new Float32Array(n * n).fill(Infinity);
  const shapes = elements.map(el => el.stroked ? { pts: el.samples, pad: WEIGHT / 2 }
    : el.tag === "circle" ? { pts: [[Number(el.attrs.cx), Number(el.attrs.cy)]], pad: Number(el.attrs.r) } : { pts: el.samples, pad: 0 });
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = (i + 0.5) / RASTER, y = (j + 0.5) / RASTER;
    let d = Infinity;
    for (const { pts, pad } of shapes) for (const [px, py] of pts) {
      const e = Math.hypot(px - x, py - y) - pad; if (e < d) d = e;
    }
    near[j * n + i] = d; if (d <= 0) ink[j * n + i] = 1;
  }
  const seen = new Uint8Array(n * n), flood = (start, visit) => {
    const stack = [start]; seen[start] = 1;
    while (stack.length) {
      const k = stack.pop(); visit(k);
      const i = k % n, j = (k - i) / n;
      for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const a = i + di, b = j + dj; if (a < 0 || b < 0 || a >= n || b >= n) continue;
        const m = b * n + a; if (!seen[m] && !ink[m]) { seen[m] = 1; stack.push(m); }
      }
    }
  };
  for (let k = 0; k < n; k++) for (const m of [k, (n - 1) * n + k, k * n, k * n + n - 1]) if (!ink[m] && !seen[m]) flood(m, () => {});
  const counters = [];
  for (let k = 0; k < n * n; k++) if (!ink[k] && !seen[k]) { let widest = 0; flood(k, m => { widest = Math.max(widest, near[m]); }); counters.push(2 * widest + Math.SQRT2 / RASTER); }  // + grid error
  return counters;
}

// Optical audit (--audit): rasterise the ink and measure what the eye reads as size and
// weight. hull = convex hull of the ink (its √area is the apparent size); coverage = ink
// area; density = coverage / hull (how heavy the icon reads inside its own outline).
function opticalAudit(elements) {
  const n = 16 * RASTER, rows = [];
  const shapes = elements.map(el => el.stroked ? { pts: el.samples, pad: WEIGHT / 2 }
    : el.tag === "circle" ? { pts: [[Number(el.attrs.cx), Number(el.attrs.cy)]], pad: Number(el.attrs.r) } : { pts: el.samples, pad: 0 });
  let coverage = 0;
  for (let j = 0; j < n; j++) {
    let lo = -1, hi = -1;
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) / RASTER, y = (j + 0.5) / RASTER;
      let inside = false;
      for (const { pts, pad } of shapes) { for (const [px, py] of pts) if (Math.hypot(px - x, py - y) <= pad) { inside = true; break; } if (inside) break; }
      if (inside) { coverage++; if (lo < 0) lo = i; hi = i; }
    }
    if (lo >= 0) rows.push([lo / RASTER, j / RASTER], [(hi + 1) / RASTER, j / RASTER], [lo / RASTER, (j + 1) / RASTER], [(hi + 1) / RASTER, (j + 1) / RASTER]);
  }
  const pts = rows.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = list => { const h = []; for (const q of list) { while (h.length >= 2 && cross(h.at(-2), h.at(-1), q) <= 0) h.pop(); h.push(q); } return h; };
  const hull = [...half(pts).slice(0, -1), ...half([...pts].reverse()).slice(0, -1)];
  let area = 0; for (let k = 0; k < hull.length; k++) { const [x1, y1] = hull[k], [x2, y2] = hull[(k + 1) % hull.length]; area += x1 * y2 - x2 * y1; }
  area = Math.abs(area) / 2; coverage /= RASTER * RASTER;
  return { size: Math.sqrt(area), coverage, density: coverage / area };
}

// strict: the full construction system (grid, lattice, keylines unless keylines: false).
function load(dir, { strict, soft = false, keylines = true }) {
const icons = [];
for (const file of readdirSync(dir).filter(f => f.endsWith(".svg")).sort()) {
  const name = file.replace(/\.svg$/, "");
  const text = readFileSync(join(dir, file), "utf8");
  const root = attrs(text.match(/<svg[^>]*>/)[0]);
  if (root.viewBox !== "0 0 16 16") fail(name, `viewBox must be "0 0 16 16"`);
  const radial = ["radial", "free"].includes(root["data-angles"]);  // radial (gear) or free (triangle): angles set by the concept
  const keyline = root["data-keyline"];
  const notes = [];
  if (soft) sink = notes;
  if (strict && keylines && !KEYLINES[keyline]) fail(name, `data-keyline must be one of ${Object.keys(KEYLINES).join(", ")}`);
  const elements = [];
  const ink = [Infinity, Infinity, -Infinity, -Infinity];
  for (const [, tag, body] of text.matchAll(/<(path|circle|rect)\b([^>]*)\/>/g)) {
    const a = attrs(body);
    const stroked = a.stroke && a.stroke !== "none";
    if (a["data-filled"] === "gap") {  // filled-only separation: no outline checks
      if (tag !== "path") fail(name, "a gap is a path");
      const { stroke, "stroke-width": _w, "stroke-linecap": _c, "stroke-linejoin": _j, "data-filled": filled, ...rest } = a;
      elements.push({ tag, attrs: rest, stroked: true, samples: [], filled, filledOnly: true });
      continue;
    }
    if (stroked) {
      if (a.stroke !== "currentColor") fail(name, "strokes use currentColor");
      if (a["stroke-width"] !== SOURCE_STROKE) fail(name, `source stroke-width must be ${SOURCE_STROKE}`);
      if (a["stroke-linecap"] !== "round" || a["stroke-linejoin"] !== "round") fail(name, "caps and joins must be round");
      if (a.fill !== "none") fail(name, "stroked shapes must have fill=none");
    } else if (a.fill !== "currentColor") fail(name, "a shape is either stroked or filled with currentColor");
    let points = [], samples = [];
    // Axis-aligned edges on the 0.5px grid: crisp at 2×, and at 1× when on a pixel centre (x.5).
    const grid = (v, what) => { if (strict && !onGrid(v, 0.5)) fail(name, `${what} ${v} is off the 0.5px grid`); };
    if (tag === "path") {
      const parsed = parsePath(name, a.d);
      points = parsed.points; samples = parsed.samples;
      // Acute corners pinch the negative space inside them into thin, sharp wedges.
      // data-acute="sharp" (owner-approved, recorded in the spec): the icon's points are
      // meant to be sharp, as a lightning bolt's are; the stroke fills the point solid.
      if (strict && stroked && root["data-acute"] !== "sharp") for (const [p, q] of parsed.joins) {
        const angle = joinAngle(p, q);
        if (angle < ACUTE - 1e-6) fail(name, `corner at ${r2(p[2])},${r2(p[3])} is ${r2(angle)}°; below ${ACUTE}° round it with an arc (r ≥ 1) or open the angle`);
      }
      for (const [x1, y1, x2, y2] of parsed.segments) {
        if (Math.hypot(x2 - x1, y2 - y1) < 0.01) continue;
        if (!radial) {
          const angle = Math.abs(Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI) % 45;
          if (Math.min(angle, 45 - angle) > 0.01) fail(name, `segment ${x1},${y1} → ${x2},${y2} is not at 0°, 45° or 90°`);
        }
        if (x1 === x2) grid(x1, "vertical stroke at x"); else if (y1 === y2) grid(y1, "horizontal stroke at y");
        // 45° lines run through pixel corners or centres (x − y or x + y whole), which is
        // measurably sharper at 1× and 2× than a line crossing pixel edges mid-way.
        else if (strict && !radial && !onGrid((y2 - y1) / (x2 - x1) > 0 ? x1 - y1 : x1 + y1, 1)) fail(name, `diagonal ${x1},${y1} → ${x2},${y2} is off the diagonal pixel lattice (x ${(y2 - y1) / (x2 - x1) > 0 ? "−" : "+"} y must be whole)`);
      }
    } else if (tag === "circle") {
      const [cx, cy, r] = [a.cx, a.cy, a.r].map(Number);
      points = [[cx - r, cy - r], [cx + r, cy + r]];
      samples = ring(cx, cy, r);
      if (stroked) { grid(cx - r, "circle extreme"); grid(cy - r, "circle extreme"); }
    } else {
      const [x, y, w, h] = [a.x, a.y, a.width, a.height].map(Number);
      points = [[x, y], [x + w, y + h]];
      samples = rectSamples(x, y, w, h);
      for (const v of [x, y, x + w, y + h]) grid(v, "rect edge");
    }
    const [lo, hi] = stroked ? LIVE : LIVE_FILL;
    for (const [px, py] of points) {
      if (px < lo - 1e-6 || px > hi + 1e-6 || py < lo - 1e-6 || py > hi + 1e-6) {
        fail(name, `${stroked ? "centreline" : "fill"} at ${r2(px)},${r2(py)} leaves the ${lo}–${hi} drawing area`); break;
      }
    }
    const pad = stroked ? WEIGHT / 2 : 0;
    for (const [px, py] of points) { ink[0] = Math.min(ink[0], px - pad); ink[1] = Math.min(ink[1], py - pad); ink[2] = Math.max(ink[2], px + pad); ink[3] = Math.max(ink[3], py + pad); }
    const { stroke, "stroke-width": _w, "stroke-linecap": _c, "stroke-linejoin": _j, "data-filled": filled, ...rest } = a;
    if (filled && !FILLED_ROLES.includes(filled)) fail(name, `data-filled must be one of ${FILLED_ROLES.join(", ")}`);
    if (filled === "knockout" && !stroked) fail(name, "a knockout is a stroke cut from the fill; use hole for a filled shape");
    let cutD;
    if (filled === "cut") {
      // Extend both ends 2px along their first and last straight segments so the gap exits
      // the silhouette instead of ending in a rounded notch inside it.
      const parsed = tag === "path" ? parsePath(name, a.d) : null;
      const first = parsed?.segments[0], last = parsed?.segments.at(-1);
      const [sx, sy] = parsed?.points[0] ?? [], [ex, ey] = parsed?.points.at(-1) ?? [];
      if (!first || first[0] !== sx || first[1] !== sy || last[2] !== ex || last[3] !== ey) fail(name, "a cut must be a path that starts and ends with straight segments");
      else {
        const ext = ([x1, y1, x2, y2], [px, py]) => { const l = Math.hypot(x2 - x1, y2 - y1); return [px + (px === x1 && py === y1 ? -1 : 1) * 2 * (x2 - x1) / l, py + (px === x1 && py === y1 ? -1 : 1) * 2 * (y2 - y1) / l].map(v => Number(v.toFixed(3))); };
        const [ax, ay] = ext(first, [sx, sy]), [bx, by] = ext(last, [ex, ey]);
        cutD = `M${ax} ${ay}L${a.d.replace(/^M/, "")}L${bx} ${by}`;
      }
    }
    elements.push({ tag, attrs: rest, stroked, samples, filled, cutD });
  }
  if (!elements.length) fail(name, "no shapes found");
  if (elements.some(el => el.filled) && !elements.some(el => el.filled === "solid")) fail(name, "cut-outs need at least one solid shape to cut");
  const drawn = elements.filter(el => !el.filledOnly);
  const lineGlyphIcon = !elements.some(el => el.filled === "solid");
  for (const el of drawn) if (el.stroked && el.tag === "path" && (lineGlyphIcon || !el.filled)) {
    el.boldD = retractFreeEnds(el.attrs.d, drawn.filter(o => o !== el).flatMap(o => o.samples));
    el.boldSamples = parsePath(name, el.boldD).samples;
  }
  // Gaps: separate shapes either join or sit on the gap scale (measured ink to ink).
  const gaps = [];
  const pads = drawn.map(el => el.stroked ? WEIGHT / 2 : 0);
  // In the filled variant, strokes that stay strokes are drawn at BOLD; gaps must survive it.
  const lineGlyph = !elements.some(el => el.filled === "solid");
  const boldPads = drawn.map(el => el.stroked && (lineGlyph || !el.filled) ? BOLD / 2 : pads[drawn.indexOf(el)]);
  for (let p = 0; p < drawn.length; p++) for (let q = p + 1; q < drawn.length; q++) {
    let d = Infinity;
    for (const [ax, ay] of drawn[p].samples) for (const [bx, by] of drawn[q].samples) d = Math.min(d, Math.hypot(ax - bx, ay - by));
    if (d <= JOIN) continue;
    const g = d - pads[p] - pads[q];
    const negative = [drawn[p].filled, drawn[q].filled].some(role => ["knockout", "hole", "cut"].includes(role));
    let dBold = Infinity;
    for (const [ax, ay] of drawn[p].boldSamples ?? drawn[p].samples) for (const [bx, by] of drawn[q].boldSamples ?? drawn[q].samples) dBold = Math.min(dBold, Math.hypot(ax - bx, ay - by));
    const gBold = dBold - boldPads[p] - boldPads[q];
    if (!negative && gBold < BOLD_GAP_MIN - 1e-6) fail(name, `shapes ${p + 1} and ${q + 1} close to ${r2(gBold)}px in the filled variant (${BOLD}px line); keep ${BOLD_GAP_MIN}`);
    const step = Object.entries(GAPS).find(([, [lo, hi]]) => g >= lo - 1e-6 && g <= hi + 1e-6)?.[0] ?? (g >= OPEN ? "open" : null);
    gaps.push(`${r2(g)}${step ? " " + step : ""}`);
    if (!step) fail(name, `shapes ${p + 1} and ${q + 1} leave a ${r2(g)}px gap; use tight ${GAPS.tight.join("–")}, standard ${GAPS.standard.join("–")}, open ≥ ${OPEN}, or join them`);
  }
  // Counters: rasterise the ink and flood the outside; every enclosed pocket of negative
  // space must hold at least a tight disc, or it reads as a blot at 16px.
  const counters = measureCounters(drawn);
  for (const c of counters) if (!Object.values(COUNTERS).some(([lo, hi]) => c >= lo - 1e-6 && c <= hi + 1e-6))
    fail(name, `an enclosed counter is ${r2(c)}px across; make it tight ${COUNTERS.tight.join("–")}, standard ≥ ${COUNTERS.standard[0]}, or remove it`);
  // Keyline: the ink box at WEIGHT fits the icon's optical shape, centred on 8,8.
  if (strict && keylines && KEYLINES[keyline]) {
    const [kw, kh] = KEYLINES[keyline];
    const w = ink[2] - ink[0], h = ink[3] - ink[1];
    if (w > kw + 0.25 || h > kh + 0.25) fail(name, `ink ${r2(w)}×${r2(h)} exceeds the ${keyline} keyline ${kw}×${kh}`);
  }
  sink = errors;
  icons.push({ name, keyline, elements, ink: ink.map(r2), gaps, counters: counters.map(r2), notes, label: root["data-label"] ?? name, group: root["data-group"] ?? "", rotations: root["data-rotations"] ?? "" });
}
return icons;
}
// Directional families are one drawing plus rotations about the centre or mirrors
// (data-rotations="chevron-right:270 align-right:flipx …"). A quarter turn keeps the 0.5px grid and the diagonal lattice,
// so rotated icons inherit every rule; the keyline swaps for 90° and 270°.
const SWAP = { horizontal: "vertical", vertical: "horizontal" };
const icons = load(SRC, { strict: true }).flatMap(icon => [icon, ...icon.rotations.split(/\s+/).filter(Boolean).map(spec => {
  const [name, turn] = spec.split(":");
  // flipx / flipy mirror across the centre (align-right from align-left); a mirror keeps
  // the grid and swaps the two diagonal lattice conditions, so every rule still holds.
  if (turn === "flipx" || turn === "flipy") return { ...icon, name, flip: turn, derivedFrom: icon.name };
  // transpose mirrors across the diagonal (x ↔ y): a horizontal family becomes vertical
  // with the same reading order (align-left → align-top keeps the long bar first).
  if (turn === "transpose") return { ...icon, name, flip: turn, derivedFrom: icon.name, keyline: SWAP[icon.keyline] ?? icon.keyline };
  const rotate = Number(turn);
  if (![90, 180, 270].includes(rotate)) { fail(icon.name, `derivation ${spec} must be 90, 180, 270, flipx, flipy or transpose`); return null; }
  return { ...icon, name, rotate, derivedFrom: icon.name, keyline: rotate === 180 ? icon.keyline : SWAP[icon.keyline] ?? icon.keyline };
}).filter(Boolean)]).sort((a, b) => a.name.localeCompare(b.name));
// Candidates under review (docs/specs/icons.md): linted with the same rules, findings shown
// on the gallery's exploration sheet instead of failing the build.
const EXPLORE_SRC = join(SRC, "explore");
const explore = existsSync(EXPLORE_SRC) ? load(EXPLORE_SRC, { strict: true, soft: true }) : [];
// Status marks sit inside the Presence ring at 10–20px: every rule but keylines applies.
const statuses = load(STATUS_SRC, { strict: true, keylines: false });

if (errors.length) { console.error(errors.map(e => "✗ " + e).join("\n")); process.exit(1); }
console.log(`icon lint ok (${icons.length} icons, ${statuses.length} status marks)`);
if (process.argv.includes("--audit")) {
  const rows = icons.filter(i => !i.derivedFrom).map(icon => ({ icon, ...opticalAudit(icon.elements.filter(el => !el.filledOnly)) }));
  const median = list => { const v = [...list].sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
  const mSize = median(rows.map(r => r.size)), mDensity = median(rows.map(r => r.density));
  console.log(`optical audit — median apparent size ${r2(mSize)}, median density ${r2(mDensity)}`);
  for (const { icon, size, coverage, density } of rows.sort((a, b) => a.size - b.size))
    console.log(`  ${icon.name.padEnd(17)} ${icon.keyline.padEnd(10)} size ${r2(size).toFixed(2).padStart(5)} (${(size / mSize * 100 - 100).toFixed(0).padStart(3)}%)  ink ${r2(coverage).toFixed(1).padStart(5)}  density ${r2(density).toFixed(2)} (${(density / mDensity * 100 - 100).toFixed(0).padStart(3)}%)`);
}
if (process.argv.includes("--report")) for (const icon of icons.filter(i => !i.derivedFrom)) {
  const [x0, y0, x1, y1] = icon.ink;
  console.log(`  ${icon.name.padEnd(17)} ${icon.keyline.padEnd(10)} ink ${r2(x1 - x0)}×${r2(y1 - y0)}  centre ${r2((x0 + x1) / 2)},${r2((y0 + y1) / 2)}` +
    (icon.gaps.length ? `  gaps ${icon.gaps.join(", ")}` : "") + (icon.counters.length ? `  counters ${icon.counters.join(", ")}` : ""));
}
if (process.argv.includes("--check")) process.exit(0);

const camel = s => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const STROKE = `style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round"`;
const STROKE_BOLD = `style={{ strokeWidth: sw(weight, size, ${FILLED_WEIGHT_RATIO.toFixed(4)}) }} strokeLinecap="round" strokeLinejoin="round"`;
const STROKE_CUT = `style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter"`;
const jsx = (el, paint) => {
  const attrs = { ...el.attrs, ...paint?.attrs };
  const props = Object.entries(attrs).map(([k, v]) => `${camel(k)}="${v}"`);
  if (paint?.stroke ?? el.stroked) props.push(`stroke="${paint?.color ?? "currentColor"}"`, paint?.strokeStyle ?? STROKE);
  return `<${el.tag} ${props.join(" ")} />`;
};
const component = icon => `Pilot${camel("-" + icon.name)}`;
// A rotated icon wraps its whole drawing (mask included) in one rotation about the centre.
const TRANSFORMS = { flipx: "matrix(-1 0 0 1 16 0)", flipy: "matrix(1 0 0 -1 0 16)", transpose: "matrix(0 1 1 0 0 0)" };
const turn = (icon, lines) => {
  const transform = icon.rotate ? `rotate(${icon.rotate} 8 8)` : TRANSFORMS[icon.flip];
  return transform ? [`<g transform="${transform}">`, ...lines.map(l => "  " + l), `</g>`] : lines;
};
const hasFilled = () => true;  // every icon has a filled variant: solids, or a heavier line
const boldDot = el => ({ ...el, attrs: { ...el.attrs, r: String(Number(el.attrs.r) + (BOLD - WEIGHT) / 2) } });
// Solids keep their stroke, so the filled silhouette has the outline's exact outer edge.
const filledBody = icon => {
  const outline = icon.elements.filter(el => !el.filledOnly);
  const lineGlyph = !icon.elements.some(el => el.filled === "solid");
  // A line glyph fills by weight: every stroke at BOLD, dots grown by the same amount.
  const bold = el => jsx(el, { strokeStyle: STROKE_BOLD, ...(el.boldD ? { attrs: { d: el.boldD } } : {}) });
  if (lineGlyph) return outline.map(el => el.stroked ? bold(el) : jsx(el.tag === "circle" ? boldDot(el) : el));
  const solid = icon.elements.filter(el => el.filled === "solid").map(el => jsx(el, { attrs: { fill: "currentColor" }, stroke: el.stroked }));
  const cuts = icon.elements.filter(el => ["knockout", "hole", "cut", "gap"].includes(el.filled)).map(el =>
    el.filled === "knockout" ? jsx(el, { attrs: { fill: "none" }, stroke: true, color: "black" })
    : el.filled === "hole" ? jsx(el, { attrs: { fill: "black" }, stroke: false })
    : jsx(el, { attrs: { fill: "none", ...(el.cutD ? { d: el.cutD } : {}) }, stroke: true, color: "black", strokeStyle: STROKE_CUT }));
  // Unmarked strokes stay strokes, drawn at BOLD like every other filled line.
  const plain = icon.elements.filter(el => !el.filled).map(el => el.stroked ? bold(el) : jsx(el));
  if (!cuts.length) return [...solid, ...plain];
  return [
    `<mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">`,
    `  <rect width="16" height="16" fill="white" />`,
    ...cuts.map(c => "  " + c),
    `</mask>`,
    `<g mask={\`url(#\${id})\`}>`,
    ...solid.map(c => "  " + c),
    `</g>`,
    ...plain,
  ];
};
const tsx = `/**
 * Area icon pilot, generated from apps/docs/assets/area-icons-pilot by
 * scripts/gen-pilot-icons.mjs. Do not edit by hand. Construction: docs/specs/icons.md.
 * Each icon is a stroked 16px drawing. The line weight follows --area-weight-icon (1.125px for
 * Geist); pass \`weight\` in CSS pixels to override it, as the gallery comparison does.
 * Filled variants are derived from each shape's data-filled role; cut-outs use a mask.
 */
import { useId, type SVGProps } from "react";

/** weight: line in CSS px at 16px (overrides --area-weight-icon). size: rendered size in px;
 *  the line then follows the size curve instead of scaling with the drawing. */
export type PilotIconProps = Omit<SVGProps<SVGSVGElement>, "stroke"> & { weight?: number; size?: number };
/** Size curve (docs/specs/icons.md, "Sizes"): the line grows with size^${SIZE_CURVE}, Cursor's
 *  16 → 24px step (1.25 → 1.5px). In drawing units that is a factor of (size / 16)^${(SIZE_CURVE - 1).toFixed(2)}. */
export const sizeFactor = (size?: number) => size ? Math.pow(size / 16, ${(SIZE_CURVE - 1).toFixed(2)}) : 1;
export const sw = (weight: number | undefined, size: number | undefined, ratio = 1) => {
  const k = ratio * sizeFactor(size);
  if (weight !== undefined) return weight * k;
  return k === 1 ? "var(--area-weight-icon)" : \`calc(var(--area-weight-icon) * \${k.toFixed(4)})\`;
};
const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;
const useMaskId = () => "area-icon-" + useId().replace(/[^A-Za-z0-9-]/g, "");

${icons.map(icon => `export const ${component(icon)}Icon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    ${turn(icon, icon.elements.filter(el => !el.filledOnly).map(el => jsx(el))).join("\n    ")}
  </svg>
);` + (hasFilled(icon) ? `

export const ${component(icon)}FilledIcon = ({ weight, size, ...props }: PilotIconProps) => {
  ${filledBody(icon).some(line => line.includes("mask")) ? "const id = useMaskId();\n  " : ""}return (
    <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
      ${turn(icon, filledBody(icon)).join("\n      ")}
    </svg>
  );
};` : "")).join("\n\n")}

/** Review batches and owner status, from assets/area-icons-pilot/batches.json. */
export const PILOT_BATCHES = ${JSON.stringify(JSON.parse(readFileSync(join(SRC, "batches.json"), "utf8")).batches.map(({ id, title, icons }) => ({ id, title, icons })))} as const;

export const PILOT_ICONS = [
${icons.map(icon => `  { name: "${icon.name}", keyline: "${icon.keyline}", derivedFrom: ${icon.derivedFrom ? `"${icon.derivedFrom}"` : "undefined"}, Icon: ${component(icon)}Icon, Filled: ${component(icon)}FilledIcon, fill: "${icon.elements.some(el => el.filled === "solid") ? "solid" : "weight"}" },`).join("\n")}
] as const;
`;
writeFileSync(OUT, tsx);
console.log(`wrote ${OUT.replace(ROOT + "/", "")}`);

// Presence status marks: the inner glyph only. The ring is the Presence shell's CSS border,
// and every stroke uses --area-weight-icon with non-scaling strokes, so all status sizes
// share one line weight.
const marks = Object.fromEntries(statuses.map(icon => [icon.name, icon.elements.map(el => ({ tag: el.tag, ...el.attrs, stroked: el.stroked }))]));
writeFileSync(STATUS_OUT, `/** Area-drawn presence marks, generated from apps/docs/assets/area-icons-pilot/status by
 * apps/docs/scripts/gen-pilot-icons.mjs. Do not edit by hand. Construction: docs/specs/icons.md. */
export const statusMarks = ${JSON.stringify(marks, null, 2)} as const;
`);
console.log("wrote packages/react/src/components/status-marks.ts");

// Exploration candidates, grouped for side-by-side review with their measurements.
const EXPLORE_OUT = join(ROOT, "src/pilot-explore.tsx");
writeFileSync(EXPLORE_OUT, `/** Area icon candidates under review, generated from apps/docs/assets/area-icons-pilot/explore
 * by scripts/gen-pilot-icons.mjs. Do not edit by hand. Each carries its lint measurements. */
import type { ReactElement } from "react";
import { sw, type PilotIconProps } from "./pilot-icons.tsx";

export type ExploreCandidate = {
  group: string; label: string; Icon: (props: PilotIconProps) => ReactElement;
  gaps: readonly string[]; counters: readonly number[]; notes: readonly string[];
};

const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;

${explore.map(icon => `const ${component(icon)}Icon = ({ weight, size, ...props }: PilotIconProps) => (
  <svg {...base} {...(size ? { width: size, height: size } : {})} {...props}>
    ${icon.elements.map(el => jsx(el)).join("\n    ")}
  </svg>
);`).join("\n\n")}

export const EXPLORE: readonly ExploreCandidate[] = [
${explore.map(icon => `  { group: ${JSON.stringify(icon.group)}, label: ${JSON.stringify(icon.label)}, Icon: ${component(icon)}Icon, gaps: ${JSON.stringify(icon.gaps)}, counters: ${JSON.stringify(icon.counters)}, notes: ${JSON.stringify(icon.notes.map(n => n.replace(/^[^:]+: /, "")))} },`).join("\n")}
];
`);
console.log(`wrote src/pilot-explore.tsx (${explore.length} candidates)`);

// Component glyphs: stroked centre-lines only; components render them with Glyph.tsx.
const glyphData = Object.fromEntries(Object.entries(PACKAGE_GLYPHS).map(([glyph, [source, index]]) => {
  const icon = icons.find(i => i.name === source);
  if (!icon) throw new Error(`glyph ${glyph}: no pilot icon ${source}`);
  const elements = (index === undefined ? icon.elements : [icon.elements[index]]).filter(el => !el.filledOnly);
  if (elements.some(el => !el.stroked || el.tag !== "path")) throw new Error(`glyph ${glyph}: only stroked paths are supported`);
  return [glyph, elements.map(el => el.attrs.d)];
}));
writeFileSync(GLYPHS_OUT, `/** Area-drawn component glyphs, generated from apps/docs/assets/area-icons-pilot by
 * apps/docs/scripts/gen-pilot-icons.mjs. Do not edit by hand. Construction: docs/specs/icons.md.
 * Each glyph is a list of stroked centre-line paths on the 16px grid. */
export const glyphs = ${JSON.stringify(glyphData, null, 2)} as const;
export type GlyphName = keyof typeof glyphs;
`);
console.log("wrote packages/react/src/components/glyphs.ts");
