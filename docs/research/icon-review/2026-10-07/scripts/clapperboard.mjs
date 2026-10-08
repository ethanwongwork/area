// Clapperboard after Fluent movies_and_tv_16: body 11 × 6.5, board raised 1:3 from the body's top-left corner.
import { execFileSync } from "node:child_process";
const [L, T, R, A0, SP, BY] = process.argv.slice(2).map(Number);
const r3 = v => +v.toFixed(3);
const k = 1 / Math.sqrt(10), u = [3 * k, -k], n = [k, 3 * k];
const H = [2.5, 7.5];
const P = (s, h) => [H[0] + s * u[0] - h * n[0], H[1] + s * u[1] - h * n[1]];
const pts = [P(0, 0), P(L, 0), P(L, T), P(0, T)];
const geo = (...a) => execFileSync("node", ["apps/docs/scripts/icon-geometry.mjs", ...a], { encoding: "utf8" }).trim().split("\n").pop();
const board = geo("fillet", pts.map(p => p.map(r3).join(",")).join(" "), `0,0,${R},${R}`);
const clipEnd = a => { const cx = L - R, cy = T - R; let h = T; if (a + T > cx) { for (let lo = 0, hi = T, i = 0; i < 60; i++) { const m = (lo + hi) / 2; ((a + m - cx) ** 2 + (m - cy) ** 2 > R * R && a + m > cx) ? (hi = m) : (lo = m); h = lo; } } return h; };
const stripes = [0, 1, 2].map(i => { const a = A0 + i * SP; const h = clipEnd(a); const p = P(a, 0), q = P(a + h, h); return `M${r3(p[0])} ${r3(p[1])}L${r3(q[0])} ${r3(q[1])}`; }).join("");
const body = `M2.5 7.5H13.5V${BY - 2}A2 2 0 0 1 11.5 ${BY}H4.5A2 2 0 0 1 2.5 ${BY - 2}Z`;
const at = `fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"`;
console.log(`<svg data-set="area-pilot" data-keyline="square" data-angles="free" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path data-filled="solid" d="${body}" ${at}/>
<path d="${board}" ${at}/>
<path d="${stripes}" ${at}/>
</svg>`);
