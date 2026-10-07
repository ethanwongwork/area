// Gaps that are the offset of a front part's outline (one 16px weight, 1.125 out) become data-halo on
// that part (owner, 2026-10-06: the space must be the line's weight at every size; a fixed offset with a
// thinner line left a hair of the back solid on the front's edge above 24px). Dry run by default.
//   node docs/research/icon-review/2026-10-06/gap-to-halo.mjs [--write]
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
const dir = "apps/docs/assets/area-icons-pilot", WRITE = process.argv.includes("--write");
const SLASH_GAP = "M0.909 -0.682L16.909 15.318";
// Sample an absolute path (M L H V C Q A Z) every ~0.05 units.
function sample(d) {
  const t = d.match(/[MLHVCQAZ]|-?\d*\.?\d+(?:e-?\d+)?/gi), pts = [];
  let i = 0, cmd, x = 0, y = 0, sx = 0, sy = 0;
  const num = () => Number(t[i++]);
  const line = (x1, y1) => { const n = Math.max(1, Math.ceil(Math.hypot(x1 - x, y1 - y) / 0.05)); for (let k = 1; k <= n; k++) pts.push([x + (x1 - x) * k / n, y + (y1 - y) * k / n]); x = x1; y = y1; };
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) cmd = t[i++];
    if (cmd === "M") { x = sx = num(); y = sy = num(); pts.push([x, y]); cmd = "L"; }
    else if (cmd === "L") line(num(), num());
    else if (cmd === "H") line(num(), y);
    else if (cmd === "V") line(x, num());
    else if (cmd === "Z") { line(sx, sy); }
    else if (cmd === "C" || cmd === "Q") {
      const c = cmd === "C" ? [num(), num(), num(), num(), num(), num()] : [num(), num(), num(), num()];
      const [ex, ey] = c.slice(-2), x0 = x, y0 = y;
      for (let k = 1; k <= 60; k++) { const u = k / 60, v = 1 - u; let px, py;
        if (cmd === "C") { px = v*v*v*x0 + 3*v*v*u*c[0] + 3*v*u*u*c[2] + u*u*u*ex; py = v*v*v*y0 + 3*v*v*u*c[1] + 3*v*u*u*c[3] + u*u*u*ey; }
        else { px = v*v*x0 + 2*v*u*c[0] + u*u*ex; py = v*v*y0 + 2*v*u*c[1] + u*u*ey; }
        pts.push([px, py]); }
      x = ex; y = ey;
    } else if (cmd === "A") {
      let rx = num(), ry = num(); const rot = num() * Math.PI / 180, large = num(), sweep = num(), ex = num(), ey = num();
      const cs = Math.cos(rot), sn = Math.sin(rot), dx = (x - ex) / 2, dy = (y - ey) / 2;
      const x1 = cs * dx + sn * dy, y1 = -sn * dx + cs * dy;
      const lam = x1 * x1 / (rx * rx) + y1 * y1 / (ry * ry); if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
      let f = Math.sqrt(Math.max(0, (rx*rx*ry*ry - rx*rx*y1*y1 - ry*ry*x1*x1) / (rx*rx*y1*y1 + ry*ry*x1*x1))); if (large === sweep) f = -f;
      const cxp = f * rx * y1 / ry, cyp = -f * ry * x1 / rx, cx = cs * cxp - sn * cyp + (x + ex) / 2, cy = sn * cxp + cs * cyp + (y + ey) / 2;
      const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
      const a1 = ang(1, 0, (x1 - cxp) / rx, (y1 - cyp) / ry); let da = ang((x1 - cxp) / rx, (y1 - cyp) / ry, (-x1 - cxp) / rx, (-y1 - cyp) / ry);
      if (!sweep && da > 0) da -= 2 * Math.PI; if (sweep && da < 0) da += 2 * Math.PI;
      const n = Math.max(8, Math.ceil(Math.abs(da) * Math.max(rx, ry) / 0.05));
      for (let k = 1; k <= n; k++) { const a = a1 + da * k / n; pts.push([cx + cs * rx * Math.cos(a) - sn * ry * Math.sin(a), cy + sn * rx * Math.cos(a) + cs * ry * Math.sin(a)]); }
      x = ex; y = ey;
    } else throw new Error("unsupported " + cmd);
  }
  return pts;
}
const outline = (tag, a) => tag === "path" ? sample(a.d)
  : tag === "circle" ? sample(`M${+a.cx + +a.r} ${a.cy}A${a.r} ${a.r} 0 1 1 ${+a.cx - +a.r} ${a.cy}A${a.r} ${a.r} 0 1 1 ${+a.cx + +a.r} ${a.cy}Z`)
  : (() => { const x = +a.x, y = +a.y, w = +a.width, h = +a.height, r = +(a.rx || 0);
      return sample(`M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`); })();
const report = [];
for (const file of readdirSync(dir).filter(f => f.endsWith(".svg"))) {
  let src = readFileSync(`${dir}/${file}`, "utf8");
  const els = [...src.matchAll(/<(path|circle|rect)\b([^>]*?)\/?>/g)].map(m => ({ raw: m[0], tag: m[1], a: Object.fromEntries([...m[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(k => [k[1], k[2]])) }));
  const gaps = els.filter(e => e.a["data-filled"] === "gap" && e.a.stroke !== "none" && e.a.d !== SLASH_GAP);
  if (!gaps.length) continue;
  // Fronts: solids, and unmarked filled dots (a notification dot). An unstroked front's edge is its
  // path, so its gap sits half a weight out; a stroked one's a whole weight.
  const fronts = els.filter(e => ["solid", "fill"].includes(e.a["data-filled"]) || (!e.a["data-filled"] && e.a.fill === "currentColor"));
  const unstroked = e => e.a.fill === "currentColor" && (!e.a.stroke || e.a.stroke === "none");
  for (const gap of gaps) {
    const gp = sample(gap.a.d).filter(([x, y]) => x > 0.5 && x < 15.5 && y > 0.5 && y < 15.5);
    let best = null;
    for (const f of fronts) {
      const fp = outline(f.tag, f.a);
      const near = gp.map(([x, y]) => Math.min(...fp.map(([u, v]) => Math.hypot(u - x, v - y))));
      const offset = unstroked(f) ? 0.5625 : 1.125;
      const on = near.filter(d => Math.abs(d - offset) < 0.09).length / near.length;
      if (!best || on > best.on) best = { f, on };
    }
    const name = file.replace(".svg", "");
    if (best && best.on > 0.7) {
      report.push(`${name}: gap → data-halo on ${best.f.tag} ${(best.f.a.d || "").slice(0, 28)}… (${(best.on * 100).toFixed(0)}% on the offset)`);
      if (WRITE) {
        const role = best.f.a["data-filled"] ? "" : `data-filled="solid" `;
        const next = best.f.raw.includes("data-halo") ? best.f.raw : best.f.raw.replace(/^<(\w+) /, `<$1 ${role}data-halo="" `);
        src = src.replace(best.f.raw, next);
        src = src.replace(gap.raw + "\n", "").replace(gap.raw, "");
        best.f.raw = next;
      }
    } else report.push(`${name}: KEEP gap ${gap.a.d.slice(0, 40)}… (best ${best ? (best.on * 100).toFixed(0) : 0}%)`);
  }
  if (WRITE) writeFileSync(`${dir}/${file}`, src);
}
console.log(report.join("\n"));
