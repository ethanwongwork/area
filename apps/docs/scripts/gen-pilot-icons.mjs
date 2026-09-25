#!/usr/bin/env node
// Lint the Area icon pilot sources and generate src/pilot-icons.tsx.
//   node apps/docs/scripts/gen-pilot-icons.mjs          # lint + generate
//   node apps/docs/scripts/gen-pilot-icons.mjs --check  # lint only
// Construction rules: docs/specs/icons.md. Sources are stroked centre-line drawings on a
// 16px grid; the generated component takes the stroke width as a prop.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "assets/area-icons-pilot");
const OUT = join(ROOT, "src/pilot-icons.tsx");
const STATUS_SRC = join(SRC, "status");
const STATUS_OUT = join(ROOT, "../../packages/react/src/components/status-marks.ts");
const LIVE = [1, 15];          // drawing area inside the 16px box
const MAX_STROKE = 1.25;       // heaviest pilot weight; bounds include half of it
const SOURCE_STROKE = "1.25";  // sources are authored at the heaviest weight

const attrs = tag => Object.fromEntries([...tag.matchAll(/([A-Za-z-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const errors = [];
const fail = (name, message) => errors.push(`${name}: ${message}`);

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
  const segments = [], points = [];
  let i = 0, cmd = "", x = 0, y = 0, sx = 0, sy = 0;
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) cmd = tokens[i++];
    if (/[a-z]/.test(cmd) && cmd !== "z") { fail(name, `relative command "${cmd}" is not allowed; author absolute paths`); return { segments, points }; }
    if (cmd === "M") { x = num(); y = num(); sx = x; sy = y; points.push([x, y]); cmd = "L"; }
    else if (cmd === "L") { const nx = num(), ny = num(); segments.push([x, y, nx, ny]); x = nx; y = ny; points.push([x, y]); }
    else if (cmd === "H") { const nx = num(); segments.push([x, y, nx, y]); x = nx; points.push([x, y]); }
    else if (cmd === "V") { const ny = num(); segments.push([x, y, x, ny]); y = ny; points.push([x, y]); }
    else if (cmd === "C") { const c = [num(), num(), num(), num(), num(), num()]; points.push([c[0], c[1]], [c[2], c[3]], [c[4], c[5]]); x = c[4]; y = c[5]; }
    else if (cmd === "A") {
      const [rx, ry, rot, large, sweep] = [num(), num(), num(), num(), num()]; const nx = num(), ny = num();
      points.push(...arcPoints(x, y, rx, ry, rot, large, sweep, nx, ny));
      x = nx; y = ny;
    } else if (cmd === "Z" || cmd === "z") { segments.push([x, y, sx, sy]); x = sx; y = sy; if (i < tokens.length && !/[A-Za-z]/.test(tokens[i])) i++; }
    else { fail(name, `unsupported command "${cmd}"`); return { segments, points }; }
  }
  return { segments, points };
}

function load(dir) {
const icons = [];
for (const file of readdirSync(dir).filter(f => f.endsWith(".svg")).sort()) {
  const name = file.replace(/\.svg$/, "");
  const text = readFileSync(join(dir, file), "utf8");
  const root = attrs(text.match(/<svg[^>]*>/)[0]);
  if (root.viewBox !== "0 0 16 16") fail(name, `viewBox must be "0 0 16 16"`);
  const radial = root["data-angles"] === "radial";
  const elements = [];
  for (const [, tag, body] of text.matchAll(/<(path|circle|rect)\b([^>]*)\/>/g)) {
    const a = attrs(body);
    const stroked = a.stroke && a.stroke !== "none";
    if (stroked) {
      if (a.stroke !== "currentColor") fail(name, "strokes use currentColor");
      if (a["stroke-width"] !== SOURCE_STROKE) fail(name, `source stroke-width must be ${SOURCE_STROKE}`);
      if (a["stroke-linecap"] !== "round" || a["stroke-linejoin"] !== "round") fail(name, "caps and joins must be round");
      if (a.fill !== "none") fail(name, "stroked shapes must have fill=none");
    } else if (a.fill !== "currentColor") fail(name, "a shape is either stroked or filled with currentColor");
    const pad = stroked ? MAX_STROKE / 2 : 0;
    let points = [];
    if (tag === "path") {
      const { segments, points: p } = parsePath(name, a.d);
      points = p;
      if (!radial) for (const [x1, y1, x2, y2] of segments) {
        const angle = Math.abs(Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI) % 45;
        if (Math.min(angle, 45 - angle) > 0.01 && Math.hypot(x2 - x1, y2 - y1) > 0.01) fail(name, `segment ${x1},${y1} → ${x2},${y2} is not at 0°, 45° or 90°`);
      }
    } else if (tag === "circle") {
      const [cx, cy, r] = [a.cx, a.cy, a.r].map(Number);
      points = [[cx - r, cy - r], [cx + r, cy + r]];
    } else {
      const [x, y, w, h] = [a.x, a.y, a.width, a.height].map(Number);
      points = [[x, y], [x + w, y + h]];
    }
    for (const [px, py] of points) {
      if (px - pad < LIVE[0] - 1e-6 || px + pad > LIVE[1] + 1e-6 || py - pad < LIVE[0] - 1e-6 || py + pad > LIVE[1] + 1e-6) {
        fail(name, `ink at ${px},${py} leaves the ${LIVE[0]}–${LIVE[1]} drawing area`); break;
      }
    }
    const { stroke, "stroke-width": _w, "stroke-linecap": _c, "stroke-linejoin": _j, ...rest } = a;
    elements.push({ tag, attrs: rest, stroked });
  }
  if (!elements.length) fail(name, "no shapes found");
  icons.push({ name, elements });
}
return icons;
}
const icons = load(SRC);
const statuses = load(STATUS_SRC);

if (errors.length) { console.error(errors.map(e => "✗ " + e).join("\n")); process.exit(1); }
console.log(`icon lint ok (${icons.length} icons, ${statuses.length} status marks)`);
if (process.argv.includes("--check")) process.exit(0);

const camel = s => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const jsx = el => {
  const props = Object.entries(el.attrs).map(([k, v]) => `${camel(k)}="${v}"`);
  if (el.stroked) props.push(`stroke="currentColor"`, `style={{ strokeWidth: weight ?? "var(--area-weight-icon, 1.125px)" }}`, `strokeLinecap="round"`, `strokeLinejoin="round"`);
  return `<${el.tag} ${props.join(" ")} />`;
};
const tsx = `/**
 * Area icon pilot, generated from apps/docs/assets/area-icons-pilot by
 * scripts/gen-pilot-icons.mjs. Do not edit by hand. Construction: docs/specs/icons.md.
 * Each icon is a stroked 16px drawing. The line weight follows --area-weight-icon (1.125px for
 * Geist); pass \`weight\` in CSS pixels to override it, as the gallery comparison does.
 */
import type { SVGProps } from "react";

export type PilotIconProps = Omit<SVGProps<SVGSVGElement>, "stroke"> & { weight?: number };
const base = { viewBox: "0 0 16 16", width: 16, height: 16, fill: "none", "aria-hidden": true, focusable: false } as const;

${icons.map(icon => `export const Pilot${camel("-" + icon.name)}Icon = ({ weight, ...props }: PilotIconProps) => (
  <svg {...base} {...props}>
    ${icon.elements.map(jsx).join("\n    ")}
  </svg>
);`).join("\n\n")}

export const PILOT_ICONS = [
${icons.map(icon => `  { name: "${icon.name}", Icon: Pilot${camel("-" + icon.name)}Icon },`).join("\n")}
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
