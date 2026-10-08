#!/usr/bin/env node
// Lint the Area icon pilot sources and generate src/pilot-icons.tsx.
//   node apps/docs/scripts/gen-pilot-icons.mjs          # lint + generate
//   node apps/docs/scripts/gen-pilot-icons.mjs --check  # lint only
//   add --report to list each icon's keyline, ink box and centre
//   --only name,name  lint and report just these icons (and their turns), writing nothing:
//                     the quick loop while drawing; the full run still gates every icon
//   --only names --emit file.tsx  also write just those icons' components to file.tsx (a private
//                     preview for parallel drawing; src/pilot-icons.tsx is untouched)
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
const PACKAGE_GLYPHS = { "add": ["add"], "arrow-up": ["arrow-up"], "check": ["check"], "check-inset": ["status-available", 1], "chevron-down": ["chevron-down"], "dismiss": ["dismiss"], "grip": ["grip"], "subtract": ["subtract"], "corner": ["corner"], "corners": ["corners"], "padding-side": ["padding-side"], "padding-axis": ["padding-axis"], "sides": ["sides"], "search": ["search"], "stop": ["stop", undefined, "solid"], "more": ["more-horizontal"] };
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
// Detail (owner, 2026-09-28): more detail beats the strict minimum, so a gap may fall to
// 0.875 (2 between centre-lines) where it adds detail, and tight runs straight into
// standard (1.625–1.75 read the same). The overlap cut stays 1.125 everywhere.
const GAPS = { detail: [0.875, 1.125], tight: [1.125, 1.75], standard: [1.75, 2.0] };
const OPEN = 2.5;
const CLOSE_GAP = 0.875;      // data-gap="close": 2 between centre-lines at 1.125, the one step under tight
const JOIN = 0.1;              // closer than this (centre-lines) counts as a join, not a gap
// Counters use the same scale: a satellite pocket (a clapper cup, a document's fold) may be
// tight; every other enclosed pocket is standard or larger.
// Detail (owner, 2026-09-28): any pocket as wide as the detail gap (0.875) passes, so small rings
// (paw's toes, git's nodes) can stay outlined instead of becoming dots.
const COUNTERS = { detail: [0.875, 1.25], tight: [1.25, 1.75], standard: [1.75, Infinity] };
// Filled variant (docs/specs/icons.md, "Filled"): each shape declares its role. solid fills
// the shape inside its outline edge; knockout cuts the stroke out of the solids at the icon
// weight; hole cuts the shape's interior out. Unmarked shapes are drawn as in the outline.
// An icon with no solid shape (a line glyph) has no filled variant.
// cut: a layer line (fold, flap). Drawn in the outline; in the filled variant it becomes a
//   separation gap at the icon weight with square ends and sharp corners, extended past
//   the silhouette so it runs cleanly through (Fluent's filled layering).
// gap: a separation that exists only in the filled variant (the bell's clapper).
// line: a layer line drawn only in the outline, where a gap takes its place in the filled
//   variant (database's curved band, which a cut can't extend straight out of).
// stroke: a line drawn only in the filled variant, at the filled weight. A slashed line
//   glyph cuts its outline round the slash (line pieces) and its filled lines a little
//   wider (stroke pieces), so both keep their gap beside the slash.
// fill: a solid drawn only in the filled variant. A slashed icon's outline is cut open
//   round the slash (line pieces); its filled variant is the whole shape, parted by gaps.
// A mark or arrow over a solid (a container's plus, a cloud's arrow) is a knockout too: in the
//   filled variant every detail over a solid is negative space. Where it runs out through the
//   silhouette's edge it leaves a notch; the part beyond the edge is not drawn.
// Line glyphs (no solid shape) fill by weight: every stroke at FILLED_WEIGHT_RATIO.
const FILLED_ROLES = ["solid", "knockout", "hole", "cut", "gap", "line", "fill", "stroke", "halo"];
const SOLID_ROLES = ["solid", "fill"];
const FILLED_WEIGHT_RATIO = 4 / 3;
const SIZE_CURVE = 0.45;             // line ∝ size^0.45: Cursor's 1.25px at 16 → 1.5px at 24   // 1.125 → 1.5px, Fluent's filled line weight
// The curve runs to the 24px master and holds there: above 24 the drawing scales whole, so lines,
// cuts and gaps keep the 24px proportions (owner, 2026-10-06: large previews thinned the line while
// the gaps grew). Fluent's own masters: 1.5px at 24, 2 at 32, 2.5 at 48; held, Area is 1.8 and 2.7.
const SIZE_CURVE_MAX = 24;
const BOLD = WEIGHT * FILLED_WEIGHT_RATIO;
const BOLD_GAP_MIN = 0.875;          // detail round (owner, 2026-09-28): the detail step survives the filled line (was 1.0, Cursor's floor)
const RASTER = 8;              // samples per px for the counter check
const onGrid = (v, step) => Math.abs(v / step - Math.round(v / step)) < 1e-6;
const ONLY = (i => i >= 0 ? new Set(process.argv[i + 1].split(",")) : null)(process.argv.indexOf("--only"));
// A near miss names the nearest steps and how far each is, so a fix is a known distance
// (move the shapes, change a radius) rather than trial and error.
const toSteps = (v, steps) => steps.map(([label, lo, hi]) => v < lo ? [label, lo - v, "apart"] : v > hi ? [label, v - hi, "closer"] : null)
  .filter(Boolean).sort((a, b) => a[1] - b[1]).slice(0, 2).map(([label, dv, dir]) => `${r2(dv)} ${dir} for ${label}`).join(", or ");

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
  const segments = [], points = [], samples = [], joins = [], rings = [];
  let ring = [];  // samples per subpath, for inside tests on filled shapes
  const add = (...ps) => { samples.push(...ps); ring.push(...ps); };
  // Straight-to-straight joins (no curve between), for the acute-angle rule.
  let lastSeg = null, firstSeg = null;
  const seg = (x1, y1, x2, y2) => {
    const s = [x1, y1, x2, y2];
    if (Math.hypot(x2 - x1, y2 - y1) < 1e-6) return;
    if (lastSeg) joins.push([lastSeg, s]); else if (!firstSeg) firstSeg = s;
    lastSeg = s;
  };
  const line = (x1, y1, x2, y2) => { const n = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 0.05)); for (let k = 0; k <= n; k++) add([x1 + (x2 - x1) * k / n, y1 + (y2 - y1) * k / n]); };
  let i = 0, cmd = "", x = 0, y = 0, sx = 0, sy = 0, lastCtrl = null;
  const cubic = c => {
    lastSeg = null; firstSeg = firstSeg ?? "curve";
    const pts = []; for (let k = 0; k <= 64; k++) { const t = k / 64, u = 1 - t; pts.push([u * u * u * x + 3 * u * u * t * c[0] + 3 * u * t * t * c[2] + t * t * t * c[4], u * u * u * y + 3 * u * u * t * c[1] + 3 * u * t * t * c[3] + t * t * t * c[5]]); }
    add(...pts); points.push(...pts); x = c[4]; y = c[5];
  };
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++];
    if (/[a-z]/.test(cmd) && cmd !== "z") { fail(name, `relative command "${cmd}" is not allowed; author absolute paths`); return { segments, points, samples }; }
    const ctrl = lastCtrl; lastCtrl = null;
    if (cmd === "M") { x = num(); y = num(); sx = x; sy = y; points.push([x, y]); cmd = "L"; lastSeg = null; firstSeg = null; ring = []; rings.push(ring); }
    else if (cmd === "L") { const nx = num(), ny = num(); segments.push([x, y, nx, ny]); seg(x, y, nx, ny); line(x, y, nx, ny); x = nx; y = ny; points.push([x, y]); }
    else if (cmd === "H") { const nx = num(); segments.push([x, y, nx, y]); seg(x, y, nx, y); line(x, y, nx, y); x = nx; points.push([x, y]); }
    else if (cmd === "V") { const ny = num(); segments.push([x, y, x, ny]); seg(x, y, x, ny); line(x, y, x, ny); y = ny; points.push([x, y]); }
    else if (cmd === "C") { const c = [num(), num(), num(), num(), num(), num()]; cubic(c); lastCtrl = [c[2], c[3]]; }
    // S: the first control point mirrors the previous curve's last one (Lucide's paths use it).
    else if (cmd === "S") { const c = [...(ctrl ? [2 * x - ctrl[0], 2 * y - ctrl[1]] : [x, y]), num(), num(), num(), num()]; cubic(c); lastCtrl = [c[2], c[3]]; }
    else if (cmd === "Q") {
      lastSeg = null; firstSeg = firstSeg ?? "curve";
      const c = [num(), num(), num(), num()];
      for (let k = 0; k <= 32; k++) { const t = k / 32, u = 1 - t; add([u * u * x + 2 * u * t * c[0] + t * t * c[2], u * u * y + 2 * u * t * c[1] + t * t * c[3]]); }
      points.push(...samples.slice(-33)); x = c[2]; y = c[3];
    } else if (cmd === "A") {
      lastSeg = null; firstSeg = firstSeg ?? "curve";
      const [rx, ry, rot, large, sweep] = [num(), num(), num(), num(), num()]; const nx = num(), ny = num();
      const arc = arcPoints(x, y, rx, ry, rot, large, sweep, nx, ny);
      points.push(...arc); add(...arc);
      x = nx; y = ny;
    } else if (cmd === "Z" || cmd === "z") {
      segments.push([x, y, sx, sy]); seg(x, y, sx, sy);
      if (lastSeg && Array.isArray(firstSeg)) joins.push([lastSeg, firstSeg]);
      line(x, y, sx, sy); x = sx; y = sy; if (i < tokens.length && !/[A-Za-z]/.test(tokens[i])) i++; }
    else { fail(name, `unsupported command "${cmd}"`); return { segments, points, samples }; }
  }
  return { segments, points, samples, joins, rings };
}
// Even-odd inside test over a filled shape's rings (its subpaths' samples).
const insideRings = (rings, x, y) => {
  let inside = false;
  for (const pts of rings) for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i], [xj, yj] = pts[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
// How each drawn element puts down ink, for the raster checks: a stroke by distance to its
// centre-line, a dot by radius, a filled path or rect by its inside (bold, stroke-weight).
const inkShapes = elements => elements.map(el => el.stroked ? { pts: el.samples, pad: WEIGHT / 2 }
  : el.tag === "circle" ? { pts: [[Number(el.attrs.cx), Number(el.attrs.cy)]], pad: Number(el.attrs.r) }
  : { pts: el.samples, pad: 0, rings: el.rings ?? [el.samples] });
const inkDistance = ({ pts, pad, rings }, x, y) => {
  if (rings && insideRings(rings, x, y)) return -1;
  let d = Infinity; for (const [px, py] of pts) { const e = Math.hypot(px - x, py - y) - pad; if (e < d) d = e; }
  return d;
};

// The angle between two joined straight segments, measured inside the corner (180 = straight).
const joinAngle = ([ax1, ay1, ax2, ay2], [bx1, by1, bx2, by2]) => {
  const u = [ax1 - ax2, ay1 - ay2], v = [bx2 - bx1, by2 - by1];
  return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))))) * 180 / Math.PI;
};
const ACUTE = 45;   // (60 before the detail round, owner 2026-09-28) straight joins sharper than this need a fillet (an arc) or a wider angle

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
// Rect outline samples with its corner radius: a square-cornered sample put mic's r 2 capsule
// 0.8px too close to its holder.
const rectSamples = (x, y, w, h, rx = 0) => {
  const r = Math.min(rx, w / 2, h / 2), out = [];
  const edge = (x1, y1, x2, y2) => { for (let k = 0; k <= 40; k++) out.push([x1 + (x2 - x1) * k / 40, y1 + (y2 - y1) * k / 40]); };
  const corner = (cx, cy, a0) => { for (let k = 0; k <= 16; k++) { const a = a0 + Math.PI / 2 * k / 16; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
  edge(x + r, y, x + w - r, y); corner(x + w - r, y + r, -Math.PI / 2);
  edge(x + w, y + r, x + w, y + h - r); corner(x + w - r, y + h - r, 0);
  edge(x + w - r, y + h, x + r, y + h); corner(x + r, y + h - r, Math.PI / 2);
  edge(x, y + h - r, x, y + r); corner(x + r, y + r, Math.PI);
  return out;
};
const r2 = v => Math.round(v * 100) / 100;

// Ink membership on a RASTER-per-px grid: strokes by distance to the centre-line samples,
// filled circles by radius. Returns each enclosed counter's widest inscribed disc.
function measureCounters(elements) {
  const n = 16 * RASTER, ink = new Uint8Array(n * n), near = new Float32Array(n * n).fill(Infinity);
  const shapes = inkShapes(elements);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = (i + 0.5) / RASTER, y = (j + 0.5) / RASTER;
    let d = Infinity;
    for (const shape of shapes) { const e = inkDistance(shape, x, y); if (e < d) d = e; if (d < 0) break; }
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
  // A pocket of a few raster cells cut off diagonally at the point of a sharp wedge (a pen's 60°
  // tip) is a raster artefact of the 4-way flood, not a space anyone sees; it is skipped.
  for (let k = 0; k < n * n; k++) if (!ink[k] && !seen[k]) { let widest = 0, cells = 0; flood(k, m => { widest = Math.max(widest, near[m]); cells++; }); if (cells > 4) counters.push(2 * widest + Math.SQRT2 / RASTER); }  // + grid error
  return counters;
}

// Optical audit (--audit): rasterise the ink and measure what the eye reads as size and
// weight. hull = convex hull of the ink (its √area is the apparent size); coverage = ink
// area; density = coverage / hull (how heavy the icon reads inside its own outline).
function opticalAudit(elements) {
  const n = 16 * RASTER, rows = [];
  const shapes = inkShapes(elements);
  let coverage = 0;
  for (let j = 0; j < n; j++) {
    let lo = -1, hi = -1;
    for (let i = 0; i < n; i++) {
      const x = (i + 0.5) / RASTER, y = (j + 0.5) / RASTER;
      let inside = false;
      for (const shape of shapes) { if (shape.rings ? insideRings(shape.rings, x, y) : shape.pts.some(([px, py]) => Math.hypot(px - x, py - y) <= shape.pad)) { inside = true; break; } }
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
  if (ONLY && !ONLY.has(name)) continue;
  const text = readFileSync(join(dir, file), "utf8");
  const root = attrs(text.match(/<svg[^>]*>/)[0]);
  if (root.viewBox !== "0 0 16 16") fail(name, `viewBox must be "0 0 16 16"`);
  // data-alias-of (owner, 2026-10-02): a second name for another icon's drawing, kept because
  // components or demos use it. The body must stay identical to the base's.
  const aliasOf = root["data-alias-of"];
  if (aliasOf) {
    const body = t => t.replace(/<svg[^>]*>/, "").trim();
    const base = join(dir, aliasOf + ".svg");
    if (!existsSync(base)) fail(name, `data-alias-of names ${aliasOf}, which has no source`);
    else if (body(readFileSync(base, "utf8")) !== body(text)) fail(name, `an alias of ${aliasOf} must keep its drawing exactly`);
  }
  const radial = ["radial", "free"].includes(root["data-angles"]);  // radial (gear) or free (triangle): angles set by the concept
  const keyline = root["data-keyline"];
  const notes = [];
  if (soft) sink = notes;
  if (strict && keylines && !KEYLINES[keyline]) fail(name, `data-keyline must be one of ${Object.keys(KEYLINES).join(", ")}`);
  const elements = [];
  const ink = [Infinity, Infinity, -Infinity, -Infinity];
  // Only path, circle and rect are measured; anything else would be drawn but never checked.
  for (const [, tag] of text.matchAll(/<(ellipse|line|polyline|polygon|g|use)\b/g)) fail(name, `<${tag}> is not measured by the lint; draw it as a path`);
  for (const [, tag, body] of text.matchAll(/<(path|circle|rect)\b([^>]*)\/>/g)) {
    const a = attrs(body);
    const stroked = a.stroke && a.stroke !== "none";
    if (["gap", "fill", "stroke", "halo"].includes(a["data-filled"])) {  // filled-only: no outline checks
      if (tag !== "path") fail(name, `a ${a["data-filled"]} is a path`);
      const { stroke, "stroke-width": _w, "stroke-linecap": cap, "stroke-linejoin": _j, "data-filled": filled, "data-clip": clip, ...rest } = a;
      // A fill keeps its samples (for the knockout check); gaps and counters skip filled-only shapes.
      // A gap with stroke="none" and fill="currentColor" is cut out whole (a hub, a hole's visible part).
      elements.push({ tag, attrs: rest, stroked: stroke !== "none", butt: cap === "butt", clip: clip?.split(/\s+/).map(Number), samples: filled === "fill" ? parsePath(name, a.d).samples : [], filled, filledOnly: true });
      continue;
    }
    if (stroked) {
      if (a.stroke !== "currentColor") fail(name, "strokes use currentColor");
      if (a["stroke-width"] !== SOURCE_STROKE) fail(name, `source stroke-width must be ${SOURCE_STROKE}`);
      if (a["stroke-linecap"] !== "round" || a["stroke-linejoin"] !== "round") fail(name, "caps and joins must be round");
      if (a.fill !== "none") fail(name, "stroked shapes must have fill=none");
    } else if (a.fill !== "currentColor") fail(name, "a shape is either stroked or filled with currentColor");
    let points = [], samples = [], rings;
    // Axis-aligned edges on the 0.5px grid: crisp at 2×, and at 1× when on a pixel centre (x.5).
    const grid = (v, what) => { if (strict && !onGrid(v, 0.5)) fail(name, `${what} ${v} is off the 0.5px grid`); };
    if (tag === "path") {
      const parsed = parsePath(name, a.d);
      points = parsed.points; samples = parsed.samples; rings = parsed.rings;
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
      samples = rectSamples(x, y, w, h, Number(a.rx ?? 0)); rings = [samples];
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
      // Each subpath is its own cut (a book's two bands), so each is extended at both ends.
      const ext = ([x1, y1, x2, y2], [px, py]) => { const l = Math.hypot(x2 - x1, y2 - y1); return [px + (px === x1 && py === y1 ? -1 : 1) * 2 * (x2 - x1) / l, py + (px === x1 && py === y1 ? -1 : 1) * 2 * (y2 - y1) / l].map(v => Number(v.toFixed(3))); };
      const subs = tag === "path" ? a.d.split(/(?=M)/).filter(d => d.trim()) : [];
      const parts = subs.map(d => {
        const parsed = parsePath(name, d);
        const first = parsed.segments[0], last = parsed.segments.at(-1);
        const [sx, sy] = parsed.points[0] ?? [], [ex, ey] = parsed.points.at(-1) ?? [];
        if (!first || first[0] !== sx || first[1] !== sy || last[2] !== ex || last[3] !== ey) return null;
        const [ax, ay] = ext(first, [sx, sy]), [bx, by] = ext(last, [ex, ey]);
        return `M${ax} ${ay}L${d.trim().replace(/^M/, "")}L${bx} ${by}`;
      });
      if (!parts.length || parts.includes(null)) fail(name, "a cut must be a path that starts and ends with straight segments");
      else cutD = parts.join("");
    }
    elements.push({ tag, attrs: rest, stroked, samples, rings, filled, cutD });
  }
  // A knockout that reaches a solid's edge runs out through it, square, as a cut does: its
  // round cap would leave a rounded notch in the silhouette (owner, 2026-10-02). Free ends
  // inside the solid keep their round caps, matching the outline's line ends.
  const solidSamples = elements.filter(el => SOLID_ROLES.includes(el.filled)).flatMap(el => el.samples ?? []);
  for (const el of elements) {
    if (el.filled !== "knockout" || el.tag !== "path") continue;
    const ends = [];
    for (const sub of el.attrs.d.split(/(?=M)/).filter(s => s.trim())) {
      if (/z/i.test(sub)) continue; // a closed knockout (globe's meridian) has no free end to run out
      const { segments: segs = [], points: pts = [] } = parsePath(name, sub);
      const first = segs[0], last = segs.at(-1), start = pts[0], end = pts.at(-1);
      const out = (s, p, back) => { const l = Math.hypot(s[2] - s[0], s[3] - s[1]), k = back ? -1 : 1; return [p[0] + k * (s[2] - s[0]) / l, p[1] + k * (s[3] - s[1]) / l].map(v => Number(v.toFixed(3))); };
      const onEdge = p => solidSamples.some(([x, y]) => Math.hypot(x - p[0], y - p[1]) < 0.15);
      if (first && start && first[0] === start[0] && first[1] === start[1] && onEdge(start)) ends.push(`M${start[0]} ${start[1]}L${out(first, start, true).join(" ")}`);
      if (last && end && last[2] === end[0] && last[3] === end[1] && onEdge(end)) ends.push(`M${end[0]} ${end[1]}L${out(last, end, false).join(" ")}`);
    }
    if (ends.length) el.exitD = ends.join("");
  }
  if (!elements.length) fail(name, "no shapes found");
  if (elements.some(el => ["knockout", "hole", "cut", "gap"].includes(el.filled)) && !elements.some(el => SOLID_ROLES.includes(el.filled))) fail(name, "cut-outs need at least one solid shape to cut");
  const drawn = elements.filter(el => !el.filledOnly);
  // A knockout only exists inside its solid. It may run out through the silhouette's edge
  // (cloud upload's stem, a container's plus), leaving a notch; one that never enters the
  // solid would vanish from the filled variant entirely.
  const solids = elements.filter(el => SOLID_ROLES.includes(el.filled));
  const insideSolid = ([x, y]) => solids.some(el => {
    if (el.tag === "circle") return Math.hypot(x - Number(el.attrs.cx), y - Number(el.attrs.cy)) <= Number(el.attrs.r) + WEIGHT / 2 + 0.05;
    if (el.samples.some(([px, py]) => Math.hypot(px - x, py - y) <= WEIGHT / 2 + 0.05)) return true;
    let inside = false; const pts = el.samples;   // even-odd over the sampled outline
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i], [xj, yj] = pts[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  });
  if (strict) for (const el of elements.filter(e => e.filled === "knockout"))
    if (!el.samples.some(insideSolid)) fail(name, "a knockout lies outside every solid; it would vanish when filled");
  // Dots come in two sizes (docs/specs/icons.md, "Shared parts"): ⌀2 for a dot that is the
  // icon or one of its marks, ⌀1.5 for a dot with a stem or a detail set inside a shape.
  // data-dot="free" records an owner-approved exception (quote's marks, rocket's window).
  if (root["data-dot"] === "free") for (const el of elements) if (el.tag === "circle") el.freeDot = true;
  if (strict && root["data-dot"] !== "free") for (const el of elements.filter(e => e.tag === "circle" && !e.stroked))
    if (!["1", "0.75"].includes(el.attrs.r)) fail(name, `a dot is r 1 (⌀2) or r 0.75 (⌀1.5), not r ${el.attrs.r}`);
  // Off states share one slash (M2 2L14 14). data-off="own" records an owner-chosen form
  // (eye-off is a closed eye, volume-off a speaker with a ×, as Fluent's mute).
  if (strict && name.endsWith("-off") && root["data-off"] !== "own" && !elements.some(el => /M2 2L14 14\b/.test(el.attrs.d ?? "")))
    fail(name, `an off icon draws the shared slash M2 2L14 14, or declares data-off="own"`);
  const lineGlyphIcon = !elements.some(el => SOLID_ROLES.includes(el.filled));
  for (const el of drawn) if (el.stroked && el.tag === "path" && lineGlyphIcon) {
    el.boldD = retractFreeEnds(el.attrs.d, drawn.filter(o => o !== el).flatMap(o => o.samples));
    el.boldSamples = parsePath(name, el.boldD).samples;
  }
  // Gaps: separate shapes either join or sit on the gap scale (measured ink to ink).
  const gaps = [];
  const pads = drawn.map(el => el.stroked ? WEIGHT / 2 : 0);
  // In a filled line glyph every stroke is drawn at BOLD; gaps must survive it. Beside solids,
  // strokes keep the icon weight (Fluent's filled paint bucket, align left, delete).
  const lineGlyph = !elements.some(el => SOLID_ROLES.includes(el.filled));
  const boldPads = drawn.map(el => el.stroked && lineGlyph ? BOLD / 2 : pads[drawn.indexOf(el)]);
  // data-part="name": strokes drawn as separate paths but forming one part (a page fold's L, which
  // moves with the weight, and its fixed diagonal) are measured as one shape.
  const partOf = el => el.attrs?.["data-part"];
  const sampleOf = el => partOf(el) ? drawn.filter(o => partOf(o) === partOf(el)).flatMap(o => o.samples) : el.samples;
  for (let p = 0; p < drawn.length; p++) for (let q = p + 1; q < drawn.length; q++) {
    if (partOf(drawn[p]) && partOf(drawn[p]) === partOf(drawn[q])) continue;
    let d = Infinity;
    for (const [ax, ay] of sampleOf(drawn[p])) for (const [bx, by] of sampleOf(drawn[q])) d = Math.min(d, Math.hypot(ax - bx, ay - by));
    if (d <= JOIN) continue;
    const g = d - pads[p] - pads[q];
    if (g <= 0) continue;  // the inks overlap: a join, not a gap
    // Outline-only lines are not drawn in the filled variant, so they have no filled gap.
    const negative = [drawn[p].filled, drawn[q].filled].some(role => ["knockout", "hole", "cut", "line"].includes(role));
    let dBold = Infinity;
    for (const [ax, ay] of drawn[p].boldSamples ?? drawn[p].samples) for (const [bx, by] of drawn[q].boldSamples ?? drawn[q].samples) dBold = Math.min(dBold, Math.hypot(ax - bx, ay - by));
    const gBold = dBold - boldPads[p] - boldPads[q];
    // data-gap="close" (owner-approved, recorded in the spec): one satellite sits a step
    // closer than tight, 2 between centre-lines on the 0.5 grid (battery's terminal).
    const close = root["data-gap"] === "close" && g >= CLOSE_GAP - 1e-6;
    if (!negative && !close && gBold < BOLD_GAP_MIN - 1e-6) fail(name, `shapes ${p + 1} and ${q + 1} close to ${r2(gBold)}px in the filled variant (${BOLD}px line); keep ${BOLD_GAP_MIN}: move them ${r2(BOLD_GAP_MIN - gBold)} apart`);
    // data-gap="aligned" (owner-approved, recorded in the spec): shapes kept on one edge line
    // leave a diagonal gap between standard and open where a rounded corner meets them (qr-code).
    const aligned = root["data-gap"] === "aligned" && g > GAPS.standard[1] && g < OPEN;
    const step = Object.entries(GAPS).find(([, [lo, hi]]) => g >= lo - 1e-6 && g <= hi + 1e-6)?.[0] ?? (g >= OPEN ? "open" : close ? "close" : aligned ? "aligned" : null);
    gaps.push(`${r2(g)}${step ? " " + step : ""}`);
    if (!step) fail(name, `shapes ${p + 1} and ${q + 1} leave a ${r2(g)}px gap; move them ${toSteps(g, [["detail", ...GAPS.detail], ["tight", ...GAPS.tight], ["standard", ...GAPS.standard], ["open", OPEN, Infinity]])} (or join them)`);
  }
  // Counters: rasterise the ink and flood the outside; every enclosed pocket of negative
  // space must hold at least a tight disc, or it reads as a blot at 16px.
  const counters = measureCounters(drawn);
  // data-counter="sliver" (owner-approved, recorded in the spec): a slashed shape keeps
  // Fluent's fuller form, and the sliver between it and the slash stays (mic-off).
  if (root["data-counter"] !== "sliver") for (const c of counters) if (!Object.values(COUNTERS).some(([lo, hi]) => c >= lo - 1e-6 && c <= hi + 1e-6))
    fail(name, `an enclosed counter is ${r2(c)}px across; make it ${toSteps(c, [["detail", ...COUNTERS.detail], ["tight", ...COUNTERS.tight], ["standard", COUNTERS.standard[0], Infinity]]).replaceAll("apart", "larger").replaceAll("closer", "smaller")} (or remove it)`);
  // Keyline: the ink box at WEIGHT fits the icon's optical shape, centred on 8,8.
  if (strict && keylines && KEYLINES[keyline]) {
    const [kw, kh] = KEYLINES[keyline];
    const w = ink[2] - ink[0], h = ink[3] - ink[1];
    if (w > kw + 0.25 || h > kh + 0.25) fail(name, `ink ${r2(w)}×${r2(h)} exceeds the ${keyline} keyline ${kw}×${kh}`);
  }
  sink = errors;
  icons.push({ name, keyline, elements, ink: ink.map(r2), gaps, counters: counters.map(r2), notes, label: root["data-label"] ?? name, group: root["data-group"] ?? "", rotations: root["data-rotations"] ?? "", off: root["data-off"] });
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
// Parts drift (--parts; owner, 2026-10-02, after Cursor's overview tables): a family member
// (<base>-<modifier>) should keep its base's drawing and change it only by the modifier. Report
// the share of the base's outline ink that the member no longer covers (within 0.3px). A corner
// mark or a slash leaves a small share; a part that moved or was redrawn leaves a large one.
// Report only: aliases, mirrors and turns are skipped; the review sheet is `sheets.mjs parts`.
if (process.argv.includes("--parts")) {
  // A family is an object with a solid (folder, cloud, bell…), not a line glyph sharing a name
  // prefix (text-align, list-bullet). A member may move its base (the one cloud, moved): the best
  // shift within 3px counts.
  const DRIFT = 0.2, TOL = 0.3, K = 4, N = 16 * K;
  const byName = new Map(icons.filter(i => !i.derivedFrom).map(i => [i.name, i]));
  const mask = (shapes, tol) => { const m = new Uint8Array(N * N); for (let j = 0; j < N; j++) for (let i = 0; i < N; i++)
    if (shapes.some(s => inkDistance(s, (i + 0.5) / K, (j + 0.5) / K) <= tol)) m[j * N + i] = 1; return m; };
  const rows = [];
  for (const [name, member] of byName) {
    const base = [...byName.keys()].filter(b => name.startsWith(b + "-")).sort((a, b) => b.length - a.length)[0];
    if (!base || !byName.get(base).elements.some(el => SOLID_ROLES.includes(el.filled)) || member.off === "own") continue;
    const b = mask(inkShapes(byName.get(base).elements.filter(el => !el.filledOnly)), 0);
    const m = mask(inkShapes(member.elements.filter(el => !el.filledOnly)), TOL);
    const total = b.reduce((s, v) => s + v, 0);
    let best = 1, shift = [0, 0];
    for (let dy = -3 * K; dy <= 3 * K; dy++) for (let dx = -3 * K; dx <= 3 * K; dx++) {
      let lost = 0;
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) if (b[j * N + i]) {
        const x = i + dx, y = j + dy; if (x < 0 || y < 0 || x >= N || y >= N || !m[y * N + x]) lost++;
      }
      if (lost / total < best) { best = lost / total; shift = [dx / K, dy / K]; }
    }
    rows.push({ name, base, lost: best, shift });
  }
  rows.sort((a, b) => b.lost - a.lost);
  console.log(`parts drift — share of the base's ink a member no longer covers, at the best shift (⚠ over ${DRIFT * 100}%)`);
  for (const { name, base, lost, shift } of rows) console.log(`  ${lost > DRIFT ? "⚠" : " "} ${name.padEnd(24)} from ${base.padEnd(16)} ${(lost * 100).toFixed(0).padStart(3)}%${shift[0] || shift[1] ? `  moved ${shift[0]}, ${shift[1]}` : ""}`);
}
// A keyline is a size to reach, not only a limit (Streamline, Cursor). The x.5 edge rule
// leaves most icons 0.88 under on their long side; more than UNDER marks an icon that reads
// small beside its neighbours. Line glyphs (chevron, check, more) are thin by nature.
const UNDER = 1.5;
if (process.argv.includes("--report") || ONLY) for (const icon of icons.filter(i => !i.derivedFrom)) {
  const [x0, y0, x1, y1] = icon.ink;
  const [kw, kh] = KEYLINES[icon.keyline] ?? [16, 16], under = r2(Math.max(kw, kh) - Math.max(x1 - x0, y1 - y0));
  console.log(`  ${icon.name.padEnd(17)} ${icon.keyline.padEnd(10)} ink ${r2(x1 - x0)}×${r2(y1 - y0)}  centre ${r2((x0 + x1) / 2)},${r2((y0 + y1) / 2)}` +
    (icon.gaps.length ? `  gaps ${icon.gaps.join(", ")}` : "") + (icon.counters.length ? `  counters ${icon.counters.join(", ")}` : "") +
    (under > UNDER ? `  ⚠ ${under} under its keyline` : ""));
}
const EMIT = (i => i >= 0 ? process.argv[i + 1] : null)(process.argv.indexOf("--emit"));
if (process.argv.includes("--check") || (ONLY && !EMIT)) process.exit(0);

const camel = s => s.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const STROKE = `style={{ strokeWidth: sw(weight, size) }} strokeLinecap="round" strokeLinejoin="round"`;
const STROKE_BOLD = `style={{ strokeWidth: sw(weight, size, ${FILLED_WEIGHT_RATIO.toFixed(4)}) }} strokeLinecap="round" strokeLinejoin="round"`;
const STROKE_CUT = `style={{ strokeWidth: sw(weight, size) }} strokeLinecap="butt" strokeLinejoin="miter"`;
// A halo cuts the solids back round a line in front of them by one icon weight each side
// (Fluent's thunderstorm bolt): three weights wide, round, under the line drawn on top.
const STROKE_HALO = `style={{ strokeWidth: haloWidth(weight, size) }} strokeLinecap="round" strokeLinejoin="round"`;
const STROKE_HALO_EDGE = `style={{ strokeWidth: sw(weight, size, 2) }} strokeLinecap="round" strokeLinejoin="round"`;
// Filled: every line, drawn as ink or as negative space (knockouts, cuts, gaps, halos), follows the
// size curve, so the space in a filled icon is the outline's line at every size (owner, 2026-10-06).
const jsx = (el, paint) => {
  const { "data-shift": shift, "data-part": _part, "data-halo": _halo, ...attrs } = { ...el.attrs, ...paint?.attrs };
  const props = Object.entries(attrs).map(([k, v]) => `${camel(k)}="${v}"`);
  if (paint?.stroke ?? el.stroked) {
    let style = paint?.strokeStyle ?? STROKE;
    // data-shift="dx dy": the line moves by (dx, dy) × (16px weight − rendered weight), so an edge
    // that must meet another line's inner edge stays on it as the size curve thins the line
    // (a page fold's L against the diagonal: the pocket stays a closed triangle at every size).
    if (shift) { const [dx, dy] = shift.split(/\s+/); style = style.replace(/style=\{\{ strokeWidth: sw\(weight, (size|undefined)\) \}\}/, `{...lineShift(weight, $1, ${dx}, ${dy})}`); }
    props.push(`stroke="${paint?.color ?? "currentColor"}"`, style);
  } else if (el.tag === "circle" && !el.freeDot && Number(attrs.r) <= 1.25) {
    // A dot is a line's partner (⌀1.5 = 1.33× the line, ⌀2 a mark), so its radius follows the size
    // curve with the line; a fixed r read 2.4× the stem at 48px (owner, 2026-10-05: "the ! dot seems
    // too big compared to the stem"). The r attribute stays as the 16px fallback.
    props.push(`style={{ r: sw(weight, size, ${(Number(attrs.r) / WEIGHT).toFixed(4)}) }}`);
  }
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
  const lineGlyph = !icon.elements.some(el => SOLID_ROLES.includes(el.filled));
  // A line glyph fills by weight: every stroke at BOLD, dots grown by the same amount.
  const bold = el => jsx(el, { strokeStyle: STROKE_BOLD, ...(el.boldD ? { attrs: { d: el.boldD } } : {}) });
  if (lineGlyph) return [...outline.filter(el => el.filled !== "line"), ...icon.elements.filter(el => el.filled === "stroke")]
    .map(el => el.stroked ? bold(el) : jsx(el.tag === "circle" ? boldDot(el) : el));
  // Solids and the lines beside them follow the size curve, as the outline does, so the filled
  // variant's edges and lines are the outline's weight at every size (owner, 2026-10-04: "why is the
  // filled [drawn with] thicker strokes at the largest sizes"). Gaps follow the curve too (2026-10-06).
  const solid = icon.elements.filter(el => SOLID_ROLES.includes(el.filled)).map(el => jsx(el, { attrs: { fill: "currentColor" }, stroke: el.stroked, strokeStyle: STROKE }));
  // Halos part a line (`halo`) or a solid in front (`data-halo`: a clock or gear on a page, a
  // notification dot, a front coin or figure) from the solids behind by one line weight, flush with
  // the part's edge at every size (2026-10-06; it was the outline's fixed 2.25, 1.5× the line above
  // 24px). In the mask: the black halos, then
  // the data-halo solids restored in white (so a halo round a gear's teeth never cuts the gear),
  // then every other cut (a solid's own knockouts still cut it).
  const fronts = icon.elements.filter(el => SOLID_ROLES.includes(el.filled) && el.attrs["data-halo"] !== undefined);
  // An unstroked front (a notification dot, a badge) has its edge on the path itself: its halo is
  // two weights wide on that edge and it is restored without a stroke.
  const frontCuts = [
    ...fronts.map(el => jsx(el, { attrs: { fill: "none" }, stroke: true, color: "black", strokeStyle: el.stroked ? STROKE_HALO : STROKE_HALO_EDGE })),
    ...icon.elements.filter(el => el.filled === "halo").map(el => jsx(el, { attrs: { fill: "none" }, stroke: true, color: "black", strokeStyle: STROKE_HALO })),
    ...fronts.map(el => el.stroked ? jsx(el, { attrs: { fill: "white" }, stroke: true, color: "white", strokeStyle: STROKE }) : jsx(el, { attrs: { fill: "white" }, stroke: false })),
  ];
  const cuts = frontCuts.concat(icon.elements.filter(el => ["knockout", "hole", "cut", "gap"].includes(el.filled)).map(el =>
    el.filled === "knockout" ? jsx(el, { attrs: { fill: "none" }, stroke: true, color: "black" })
    : el.filled === "hole" || (el.filled === "gap" && !el.stroked) ? jsx(el, { attrs: { fill: "black" }, stroke: false })
    : jsx(el, { attrs: { fill: "none", ...(el.cutD ? { d: el.cutD } : {}) }, stroke: true, color: "black", strokeStyle: STROKE_CUT }))
    .concat(icon.elements.filter(el => el.exitD).map(el => jsx({ tag: "path", attrs: { d: el.exitD } }, { attrs: { fill: "none" }, stroke: true, color: "black", strokeStyle: STROKE_CUT }))));
  // Unmarked strokes beside solids stay strokes at the icon weight: the solids carry the
  // emphasis, so the lines keep the outline's exact length and gaps (Fluent's filled cuts).
  const plain = icon.elements.filter(el => !el.filled).map(el => jsx(el, { strokeStyle: STROKE }));
  // A filled-only `stroke` in an icon with solids is ink drawn over the solids at the outline's
  // curve weight: the part of an arrow outside a box or cloud, whose inside part is a knockout.
  // stroke-linecap="butt" ends it flush on the solid's edge, where the knockout takes over.
  // data-clip="x0 y0 x1 y1" keeps only the part inside that box (the tip of an arrow below a
  // cloud's foot, cut flush along the silhouette).
  const inkEls = icon.elements.filter(el => el.filled === "stroke");
  const clips = inkEls.map((el, i) => el.clip ? `<clipPath id={id + "-c${i}"}><rect x="${el.clip[0]}" y="${el.clip[1]}" width="${el.clip[2] - el.clip[0]}" height="${el.clip[3] - el.clip[1]}" /></clipPath>` : null).filter(Boolean);
  const inks = inkEls.map((el, i) => { const line = jsx(el, { strokeStyle: el.butt ? STROKE_CUT : STROKE }); return el.clip ? line.replace(" />", ` clipPath={\`url(#\${id}-c${i})\`} />`) : line; });
  if (!cuts.length) return [...solid, ...plain, ...inks];
  return [
    ...clips,
    `<mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">`,
    `  <rect width="16" height="16" fill="white" />`,
    ...cuts.map(c => "  " + c),
    `</mask>`,
    `<g mask={\`url(#\${id})\`}>`,
    ...solid.map(c => "  " + c),
    `</g>`,
    ...plain,
    ...inks,
  ];
};
// The shared slash's gap is the one cut that must stay flush with a line drawn over
// the fill: it is emitted as the slash itself, shifted one line weight up and right at render
// time (\`slashGap\`), so a thinner line at 32px opens no strip of fill beside the slash.
const SLASH_GAP = "M0.909 -0.682L16.909 15.318";
const filledUniform = (icon, lines) => lines.map(line => line.includes(`d="${SLASH_GAP}"`)
  ? line.replace(`d="${SLASH_GAP}"`, `d="M-1 -1L17 17"`).replace("style={{ strokeWidth: sw(weight, size) }}", "{...slashGap(weight, size)}")
  : line);
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
 *  16 → 24px step (1.25 → 1.5px), up to the ${SIZE_CURVE_MAX}px master; larger icons are that master scaled
 *  whole. In drawing units that is a factor of (min(size, ${SIZE_CURVE_MAX}) / 16)^${(SIZE_CURVE - 1).toFixed(2)}. */
export const sizeFactor = (size?: number) => size ? Math.pow(Math.min(size, ${SIZE_CURVE_MAX}) / 16, ${(SIZE_CURVE - 1).toFixed(2)}) : 1;
export const sw = (weight: number | undefined, size: number | undefined, ratio = 1) => {
  const k = ratio * sizeFactor(size);
  if (weight !== undefined) return weight * k;
  return k === 1 ? "var(--area-weight-icon)" : \`calc(var(--area-weight-icon) * \${k.toFixed(4)})\`;
};
/** A halo's width: the line and one line of space on each side, so the cut round a part in front is
 *  the line's own weight at every size (owner, 2026-10-06: the overlap cut's fixed 2.25 grew to 1.5×
 *  the line above 24px). */
export const haloWidth = (weight: number | undefined, size: number | undefined) => sw(weight, size, 3);
/** data-shift: a line moved by (dx, dy) × (the 16px weight − the rendered weight). Returns the line's
 *  stroke props, as slashGap does: a numeric weight shifts by the SVG transform attribute in user
 *  units, the token weight by a CSS transform computed from the token. */
export const lineShift = (weight: number | undefined, size: number | undefined, dx: number, dy: number) => {
  const w = sw(weight, size), d = 1 - sizeFactor(size);
  if (!d) return { style: { strokeWidth: w } };
  if (weight !== undefined) return { style: { strokeWidth: w }, transform: \`translate(\${(weight * d * dx).toFixed(4)} \${(weight * d * dy).toFixed(4)})\` };
  const t = (k: number) => \`calc(var(--area-weight-icon) * \${(d * k).toFixed(4)})\`;
  return { style: { strokeWidth: w, transform: \`translate(\${t(dx)}, \${t(dy)})\` } };
};
/** The slash's filled gap: the slash shifted one line weight across it (centre to centre).
 *  Returns the slash's stroke props. A numeric weight is drawing units like the path, so the
 *  shift is the SVG transform attribute in user units; the token weight is a CSS length, so
 *  its shift is a CSS transform computed from the token. */
export const slashGap = (weight: number | undefined, size: number | undefined) => {
  const w = sw(weight, size);
  if (typeof w === "number") {
    const t = (w * Math.SQRT1_2).toFixed(4);
    return { style: { strokeWidth: w }, transform: \`translate(\${t} -\${t})\` };
  }
  const t = \`calc(\${w.startsWith("calc") ? w.slice(5, -1) : w} * 0.7071)\`;
  return { style: { strokeWidth: w, transform: \`translate(\${t}, calc(-1 * \${t}))\` } };
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
      ${turn(icon, filledUniform(icon, filledBody(icon))).join("\n      ")}
    </svg>
  );
};` : "")).join("\n\n")}

/** Review batches and owner status, from assets/area-icons-pilot/batches.json. */
export const PILOT_BATCHES = ${JSON.stringify(JSON.parse(readFileSync(join(SRC, "batches.json"), "utf8")).batches.map(({ id, title, icons }) => ({ id, title, icons })))} as const;

export const PILOT_ICONS = [
${icons.map(icon => `  { name: "${icon.name}", keyline: "${icon.keyline}", derivedFrom: ${icon.derivedFrom ? `"${icon.derivedFrom}"` : "undefined"}, Icon: ${component(icon)}Icon, Filled: ${component(icon)}FilledIcon, fill: "${icon.elements.some(el => SOLID_ROLES.includes(el.filled)) ? "solid" : "weight"}" },`).join("\n")}
] as const;
`;
if (EMIT) { writeFileSync(EMIT, tsx); process.exit(0); }
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

// Component glyphs: stroked centre-lines (a rect becomes its path); components render them with
// Glyph.tsx. A "solid" glyph also fills inside its centre-line, as the filled variant's solid role
// does (the stroke keeps the outline's edge): Composer's Stop. A glyph drawn only in filled
// circles (more's dots) is "fill": no stroke, so its dots keep their drawn radius at every size.
const rectD = ({ x, y, width, height, rx = 0 }) => {
  const [l, t, w, h, r] = [x, y, width, height, rx].map(Number);
  const [R, B] = [l + w, t + h];
  if (!r) return `M${l} ${t}H${R}V${B}H${l}Z`;
  const a = `A${r} ${r} 0 0 1`;
  return `M${l + r} ${t}H${R - r}${a} ${R} ${t + r}V${B - r}${a} ${R - r} ${B}H${l + r}${a} ${l} ${B - r}V${t + r}${a} ${l + r} ${t}Z`;
};
const circleD = ({ cx, cy, r }) => {
  const [x, y, rr] = [cx, cy, r].map(Number);
  return `M${x - rr} ${y}A${rr} ${rr} 0 1 0 ${x + rr} ${y}A${rr} ${rr} 0 1 0 ${x - rr} ${y}Z`;
};
const glyphPaint = {};
const glyphData = Object.fromEntries(Object.entries(PACKAGE_GLYPHS).map(([glyph, [source, index, paint]]) => {
  const icon = icons.find(i => i.name === source);
  if (!icon) throw new Error(`glyph ${glyph}: no pilot icon ${source}`);
  const elements = (index === undefined ? icon.elements : [icon.elements[index]]).filter(el => !el.filledOnly);
  const dots = elements.every(el => !el.stroked && el.tag === "circle");
  if (!dots && elements.some(el => !el.stroked || (el.tag !== "path" && el.tag !== "rect"))) throw new Error(`glyph ${glyph}: only stroked paths and rects, or filled circles alone, are supported`);
  if (dots) glyphPaint[glyph] = "fill";
  else if (paint === "solid") glyphPaint[glyph] = "solid";
  return [glyph, elements.map(el => el.tag === "rect" ? rectD(el.attrs) : el.tag === "circle" ? circleD(el.attrs) : el.attrs.d)];
}));
writeFileSync(GLYPHS_OUT, `/** Area-drawn component glyphs, generated from apps/docs/assets/area-icons-pilot by
 * apps/docs/scripts/gen-pilot-icons.mjs. Do not edit by hand. Construction: docs/specs/icons.md.
 * Each glyph is a list of stroked centre-line paths on the 16px grid. */
export const glyphs = ${JSON.stringify(glyphData, null, 2)} as const;
export type GlyphName = keyof typeof glyphs;
/** Glyphs that are not line drawings: "solid" also fills inside the centre-line (the filled
 * variant's solid role); "fill" is filled shapes with no stroke (dots). */
export const glyphPaint: Partial<Record<GlyphName, "solid" | "fill">> = ${JSON.stringify(glyphPaint)};
`);
console.log("wrote packages/react/src/components/glyphs.ts");
