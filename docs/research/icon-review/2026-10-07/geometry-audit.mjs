// Three checks the lint missed until 2026-10-07 (reviewers' findings in this pass):
//   kinks    a join between two pieces of one path that bends by 0.5–25° (a curve meeting a line or
//            another curve almost, but not exactly, tangent: strikethrough's 7.3°, superscript's 8.4°);
//   subgaps  gaps between subpaths of one stroked path (the lint measured gaps only between
//            elements: option's bar, party-popper's touching confetti);
//   lattice  45° segments off the diagonal lattice in icons that declare data-angles="free" or
//            "radial" (calendar-check's, copy-check's and spell-check's checks).
//   node docs/research/icon-review/2026-10-07/geometry-audit.mjs [name,name…]
import { readdirSync, readFileSync } from "node:fs";
const DIR = "apps/docs/assets/area-icons-pilot", W = 1.125, JOIN = 0.1;
const GAPS = [[0.875, 1.125], [1.125, 1.75], [1.75, 2.0]], OPEN = 2.5;
const only = process.argv[2]?.split(",");

function arcPoints(x1, y1, rx, ry, phi, large, sweep, x2, y2) {
  const rad = phi * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2, xp = cos * dx + sin * dy, yp = -sin * dx + cos * dy;
  const lambda = xp * xp / (rx * rx) + yp * yp / (ry * ry); if (lambda > 1) { rx *= Math.sqrt(lambda); ry *= Math.sqrt(lambda); }
  const sign = large === sweep ? -1 : 1, num = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp;
  const coef = sign * Math.sqrt(Math.max(0, num / (rx * rx * yp * yp + ry * ry * xp * xp)));
  const cxp = coef * rx * yp / ry, cyp = coef * -(ry * xp) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2, cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = ang(1, 0, (xp - cxp) / rx, (yp - cyp) / ry);
  let dt = ang((xp - cxp) / rx, (yp - cyp) / ry, (-xp - cxp) / rx, (-yp - cyp) / ry);
  if (!sweep && dt > 0) dt -= 2 * Math.PI; else if (sweep && dt < 0) dt += 2 * Math.PI;
  const out = []; for (let k = 0; k <= 2048; k++) { const t = t1 + dt * k / 2048; out.push([cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin, cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos]); }
  return out;
}
// Pieces: each drawing command as its sample list, grouped by subpath.
function pieces(d) {
  const t = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? []; let i = 0, cmd = "", x = 0, y = 0, sx = 0, sy = 0, ctrl = null;
  const subs = []; let cur = null; const n = () => Number(t[i++]);
  const line = (x2, y2) => { const k = Math.max(2, Math.ceil(Math.hypot(x2 - x, y2 - y) / 0.05)); const p = []; for (let j = 0; j <= k; j++) p.push([x + (x2 - x) * j / k, y + (y2 - y) * j / k]); cur.push({ kind: "line", p }); x = x2; y = y2; };
  const cub = c => { const p = []; for (let j = 0; j <= 2048; j++) { const s = j / 2048, u = 1 - s; p.push([u*u*u*x + 3*u*u*s*c[0] + 3*u*s*s*c[2] + s*s*s*c[4], u*u*u*y + 3*u*u*s*c[1] + 3*u*s*s*c[3] + s*s*s*c[5]]); } cur.push({ kind: "curve", p }); x = c[4]; y = c[5]; };
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) cmd = t[i++];
    const last = ctrl; ctrl = null;
    if (cmd === "M") { x = n(); y = n(); sx = x; sy = y; cur = []; subs.push(cur); cmd = "L"; }
    else if (cmd === "L") line(n(), n());
    else if (cmd === "H") line(n(), y);
    else if (cmd === "V") line(x, n());
    else if (cmd === "C") { const c = [n(), n(), n(), n(), n(), n()]; ctrl = [c[2], c[3]]; cub(c); }
    else if (cmd === "S") { const c = [...(last ? [2 * x - last[0], 2 * y - last[1]] : [x, y]), n(), n(), n(), n()]; ctrl = [c[2], c[3]]; cub(c); }
    else if (cmd === "Q") { const c = [n(), n(), n(), n()]; cub([x + 2 / 3 * (c[0] - x), y + 2 / 3 * (c[1] - y), c[2] + 2 / 3 * (c[0] - c[2]), c[3] + 2 / 3 * (c[1] - c[3]), c[2], c[3]]); }
    else if (cmd === "A") { const [rx, ry, rot, la, sw, x2, y2] = [n(), n(), n(), n(), n(), n(), n()]; cur.push({ kind: "curve", p: arcPoints(x, y, rx, ry, rot, la, sw, x2, y2) }); x = x2; y = y2; }
    else if (cmd === "Z" || cmd === "z") { if (Math.hypot(sx - x, sy - y) > 1e-6) line(sx, sy); cur.closed = true; if (i < t.length && !/[A-Za-z]/.test(t[i])) i++; }
    else break;
  }
  return subs;
}
const dir = (p, end) => { const [a, b] = end ? [p[p.length - 2], p[p.length - 1]] : [p[0], p[1]]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
const bend = (u, v) => Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1]))) * 180 / Math.PI;
const attrs = s => Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const step = g => GAPS.some(([lo, hi]) => g >= lo - 1e-6 && g <= hi + 1e-6) || g >= OPEN;

for (const f of readdirSync(DIR).filter(f => f.endsWith(".svg")).sort()) {
  const name = f.replace(".svg", ""); if (only && !only.includes(name)) continue;
  const src = readFileSync(`${DIR}/${f}`, "utf8"), root = attrs(src.match(/<svg\b[^>]*>/)[0]);
  const free = ["free", "radial"].includes(root["data-angles"]);
  for (const [, el] of src.matchAll(/<path\b([^>]*)\/?>/g)) {
    const a = attrs(el); if (!a.d) continue;
    const stroked = a.stroke && a.stroke !== "none";
    const subs = pieces(a.d);
    if (stroked) for (const sub of subs) {
      const js = sub.map((pc, k) => [sub[k - 1] ?? (sub.closed ? sub[sub.length - 1] : null), pc]).filter(([p]) => p);
      for (const [p, q] of js) { if (p.kind === "line" && q.kind === "line") continue; const b = bend(dir(p.p, true), dir(q.p, false)); if (b > 2 && b < 25) console.log(`${name}\tkink\t${b.toFixed(1)}° at ${q.p[0].map(v => +v.toFixed(2)).join(",")}\t${a["data-filled"] ?? ""}`); }
    }
    if (stroked && subs.length > 1) for (let p = 0; p < subs.length; p++) for (let q = p + 1; q < subs.length; q++) {
      const A = subs[p].flatMap(s => s.p), B = subs[q].flatMap(s => s.p); let d = Infinity;
      for (const [ax, ay] of A) for (const [bx, by] of B) { const h = Math.hypot(ax - bx, ay - by); if (h < d) d = h; }
      const g = d - W; if (d <= JOIN || g <= 0) continue;
      if (!step(g)) console.log(`${name}\tsubgap\t${g.toFixed(2)} between subpaths ${p + 1} and ${q + 1}\t${a["data-filled"] ?? ""}`);
    }
    if (free && !["gap", "halo", "fill", "stroke"].includes(a["data-filled"])) for (const sub of subs) for (const pc of sub) if (pc.kind === "line") {
      const [[x1, y1]] = pc.p, [x2, y2] = pc.p[pc.p.length - 1];
      if (Math.abs(Math.abs(x2 - x1) - Math.abs(y2 - y1)) > 1e-3 || Math.abs(x2 - x1) < 1e-3) continue;
      const k = (y2 - y1) / (x2 - x1) > 0 ? x1 - y1 : x1 + y1;
      if (Math.abs(k - Math.round(k)) > 1e-3) console.log(`${name}\tlattice\t${x1},${y1} → ${+x2.toFixed(3)},${+y2.toFixed(3)} (x ${(y2 - y1) / (x2 - x1) > 0 ? "−" : "+"} y = ${+k.toFixed(3)})\t${a["data-filled"] ?? ""}`);
    }
  }
}
