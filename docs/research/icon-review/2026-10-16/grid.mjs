// The whole set in a shuffled grid (fixed seed), outline at one size: the "two random icons side by side" test.
// node grid.mjs out.png size [seed]
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { edgeShot } from "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0/docs/research/icon-review/2026-10-07/edge.mjs";
const D = new URL(".", import.meta.url).pathname, W = "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0";
const [out, size = "24", seed0 = "7"] = process.argv.slice(2); const s = +size;
const names = readFileSync(D + "audit.txt", "utf8").split("\n").map(l => l.match(/^\s+(\S+)\s+(square|circle|horizontal|vertical)\s/)?.[1]).filter(Boolean);
let seed = +seed0; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
for (let i = names.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [names[i], names[j]] = [names[j], names[i]]; }
const svg = n => readFileSync(`${W}/packages/icons/dist/svg/${Math.min(s, 24)}/${n}.svg`, "utf8").replace(/width="\d+" height="\d+"/, `width="${s}" height="${s}"`);
const cols = 30, gap = Math.round(s * 0.75);
writeFileSync(D + "grid.html", `<!doctype html><meta charset="utf-8"><style>body{margin:${gap}px;background:#fff;color:#1a1a1a}.g{display:grid;grid-template-columns:repeat(${cols},${s}px);gap:${gap}px}svg{display:block}</style><div class="g">${names.map(n => `<span title="${n}">${svg(n)}</span>`).join("")}</div>`);
const rows = Math.ceil(names.length / cols);
await edgeShot(["--user-data-dir=" + D + "pg", "--no-first-run", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=${cols * (s + gap) + gap},${rows * (s + gap) + gap * 2}`], out, "file://" + D + "grid.html");
console.log(out, names.length);
