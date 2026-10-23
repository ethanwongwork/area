// Groups sweep.mjs output by the role a text plays (title, label, description, value, meta) and lists, per role, the
// type styles in use and the visible gaps to what follows, with the families behind each value, so outliers show.
//   node analyze.mjs <text.json> [types|gaps|all]
import { readFileSync } from "node:fs";

const r = JSON.parse(readFileSync(process.argv[2], "utf8"));
const mode = process.argv[3] ?? "all";
const ROLE = [
  ["title", /__(title|heading|header-title|name|headline)\b|area-section-heading|area-dialog__title|area-card__title/],
  ["label", /__(label|legend|term|key|field-label)\b|legend\b|area-label\b/],
  ["description", /__(description|desc|hint|caption|subtitle|helper|secondary|support|body|text|copy)\b/],
  ["meta", /__(meta|count|time|timestamp|trailing|detail|shortcut|suffix|prefix|unit)\b/],
  ["value", /__(value|definition|data)\b/],
];
const roleOf = part => ROLE.find(([, re]) => re.test(part))?.[0] ?? "";
const inkOf = (hex, tok) => hex === tok.fgDefault ? "default" : hex === tok.fgMuted ? "muted" : hex === tok.fgSubtle ? "subtle" : hex;
const style = x => `${x.size}/${x.leading} ${x.weight}`;
const spread = c => c && (/space-(between|around)/.test(c.justify) || c.nextMargin === "auto");
const fmt = m => [...m].sort((a, b) => b[1].size - a[1].size).map(([k, fams]) => `    ${k.padEnd(28)} ${fams.size} · ${[...fams].slice(0, 14).join(", ")}${fams.size > 14 ? " …" : ""}`).join("\n");

const types = new Map(), below = new Map(), beside = new Map(), icons = new Map();
const add = (map, group, key, fam) => { if (!map.has(group)) map.set(group, new Map()); const g = map.get(group); if (!g.has(key)) g.set(key, new Set()); g.get(key).add(fam); };
for (const [slug, f] of Object.entries(r.families)) {
  if (!f.rows) continue;
  for (const x of f.rows) {
    const role = roleOf(x.part); if (!role) continue;
    const ink = inkOf(x.ink, f.tok);
    if (["#fafafa", "#ffffff"].includes(x.ink) && !/default|muted/.test(ink)) continue; // ink on a solid fill
    add(types, role, `${style(x)} ${ink}`, slug);
    if (x.below && !spread(x.below.ctx)) { const toRole = x.below.kind === "text" ? roleOf(x.below.to) || "text" : x.below.kind; add(below, `${role} → ${toRole}`, String(Math.round(x.below.gap)), `${slug}:${x.part.split(".")[0].replace("area-", "")}`); }
    if (x.beside && !spread(x.beside.ctx)) add(beside, `${role} → ${x.beside.kind === "text" ? roleOf(x.beside.to) || "text" : x.beside.kind}`, String(Math.round(x.beside.gap)), `${slug}:${x.part.split(".")[0].replace("area-", "")}`);
    if (x.icon) add(icons, `icon ${x.icon.size} → ${role} ${x.size}`, String(Math.round(x.icon.gap)), slug);
  }
}
const print = (title, map) => { console.log(`\n# ${title}`); for (const [g, m] of [...map].sort()) console.log(`\n  ${g}\n${fmt(m)}`); };
if (mode !== "gaps") print("Type styles by role (size/leading weight ink · families)", types);
if (mode !== "types") { print("Below: text baseline to next visible top (px)", below); print("Beside: text ink end to next visible start (px)", beside); print("Icon to text (px)", icons); }
