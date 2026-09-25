#!/usr/bin/env node
// Compare area-capture JSON files slot by slot and print a Markdown measurement table.
//   node scripts/capture-compare.mjs docs/specs/captures/indicator/*.json
//   node scripts/capture-compare.mjs --slots shell,text a.json b.json
// Columns are captures (source · variant · state · theme); rows are slot properties.
// Values are read from the files verbatim; nothing is estimated or rounded beyond capture.
import { readFileSync } from "node:fs";
import { basename } from "node:path";

const args = process.argv.slice(2);
// --fingerprint prints the hash a pasted copy of area-capture.js must report.
if (args[0] === "--fingerprint") {
  console.log(await fingerprintOf());
  process.exit(0);
}
let only = null;
const files = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--slots") only = args[++i].split(",");
  else files.push(args[i]);
}
if (!files.length) {
  console.error("Usage: node scripts/capture-compare.mjs [--slots a,b] capture.json ...");
  process.exit(1);
}

// Same FNV-1a as area-capture.js. JSON.stringify(JSON.parse(x)) reproduces the capture's
// compact serialization, so any edit or transcription error changes the checksum.
function fnv(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
}

let failed = false;
const expected = await fingerprintOf();
async function fingerprintOf() {
  const { runInNewContext } = await import("node:vm");
  const source = readFileSync(new URL("../apps/docs/public/area-capture.js", import.meta.url), "utf8");
  const context = { document: { createElement: () => ({ getContext: () => ({}) }) } };
  context.globalThis = context;
  runInNewContext(source, context);
  return context.areaCapture.fingerprint();
}
const captures = files.map(file => {
  const data = JSON.parse(readFileSync(file, "utf8"));
  if (data.tool !== "area-capture") throw new Error(`${file} is not an area-capture file`);
  const { checksum, ...rest } = data;
  if (checksum !== fnv(JSON.stringify(rest))) { console.error(`Checksum mismatch: ${file}`); failed = true; }
  if (data.fingerprint !== expected) console.error(`Note: ${file} was captured with a different area-capture.js (${data.fingerprint ?? "none"}; current ${expected}).`);
  return { file, data };
});
if (failed) process.exit(1);

// Effective computed value: captures omit inherited values equal to the parent's.
function effective(nodes, node, prop) {
  for (let n = node; n; n = n.parent === undefined ? null : nodes[n.parent]) {
    if (n.style[prop] !== undefined) return n.style[prop];
  }
  return undefined;
}

const PROPERTIES = [
  ["size", (n) => `${n.box[2]} × ${n.box[3]}`],
  ["edge from parent (t r b l)", (n) => n.edge?.join(" ")],
  ["edge from shell (t r b l)", (n, c) => c.shell && n !== c.shell ? edgeFrom(c.shell, n.box) : undefined],
  ["padding", (n) => n.padding ?? "0"],
  ["border", (n) => n.border ? `${n.border} ${n.borderStyle} ${n.borderColor}` : "0"],
  ["radius", (n) => radius(n.style)],
  ["display / direction", (n) => [n.style.display, n.style["flex-direction"]].filter(Boolean).join(" ")],
  ["align / justify", (n) => [n.style["align-items"], n.style["justify-content"]].filter(Boolean).join(" · ") || undefined],
  ["gap (row / column)", (n) => [n.style["row-gap"], n.style["column-gap"]].filter(Boolean).join(" / ") || undefined],
  ["position / inset", (n) => n.style.position ? [n.style.position, ["top", "right", "bottom", "left"].map(k => n.style[k] ?? "auto").join(" ")].join(" ") : undefined],
  ["transform", (n) => n.style.transform],
  ["font", (n, c) => hasText(c.nodes, n) ? font(c.nodes, n) : undefined],
  ["color", (n, c) => hasText(c.nodes, n) || n.svg ? effective(c.nodes, n, "color") : undefined],
  ["background", (n) => [n.style["background-color"], n.style["background-image"]].filter(Boolean).join(" ") || undefined],
  ["shadow", (n) => n.style["box-shadow"]],
  ["opacity", (n) => n.style.opacity],
  ["outline", (n) => n.style["outline-style"] ? `${n.style["outline-width"]} ${n.style["outline-style"]} ${n.style["outline-color"]} offset ${n.style["outline-offset"] ?? "0px"}` : undefined],
  ["text cap top / baseline from shell", (n, c) => textInShell(n, c.shell)],
  ["text cap / x height", (n) => n.text ? `${n.text.capHeight} / ${n.text.xHeight}` : undefined],
  ["svg viewBox · rendered", (n) => n.svg ? `${n.svg.viewBox} · ${n.box[2]} × ${n.box[3]}` : undefined],
  ["svg ink from shell (t r b l)", (n, c) => n.svg?.ink && c.shell ? edgeFrom(c.shell, n.svg.ink) : undefined],
  ["fill", (n, c) => n.svg ? effective(c.nodes, n, "fill") : undefined],
  ["pseudo", (n) => n.pseudo ? Object.entries(n.pseudo).map(([k, v]) => `${k} ${v.size} ${v.background} r=${v.radius}`).join("; ") : undefined],
];

// Type and ink only matter for layers that draw text (themselves or through descendants).
function hasText(nodes, node) {
  if (node.text) return true;
  return nodes.some(n => n.text && isDescendant(nodes, n, node));
}
function isDescendant(nodes, n, ancestor) {
  for (let p = n.parent === undefined ? null : nodes[n.parent]; p; p = p.parent === undefined ? null : nodes[p.parent]) if (p === ancestor) return true;
  return false;
}
function edgeFrom(shell, box) {
  const [sx, sy, sw, sh] = shell.box, [x, y, w, h] = box;
  const r = v => Math.round(v * 100) / 100;
  return [r(y - sy), r(sx + sw - (x + w)), r(sy + sh - (y + h)), r(x - sx)].join(" ");
}
function radius(style) {
  const corners = ["border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius"].map(k => style[k] ?? "0px");
  return new Set(corners).size === 1 ? corners[0] : corners.join(" ");
}
function font(nodes, node) {
  const size = effective(nodes, node, "font-size"), line = effective(nodes, node, "line-height");
  const weight = effective(nodes, node, "font-weight"), family = effective(nodes, node, "font-family");
  if (!size) return undefined;
  return `${size}/${line} ${weight} ${String(family).split(",")[0]}`;
}
function textInShell(node, shell) {
  const line = node.text?.lines?.[0];
  if (!line || !shell) return undefined;
  const r = v => Math.round(v * 100) / 100;
  const top = shell.box[1], bottom = shell.box[1] + shell.box[3];
  return `cap +${r(line.capTop - top)} · baseline −${r(bottom - line.baseline)} · start +${r(line.left - shell.box[0])} · end −${r(shell.box[0] + shell.box[2] - line.right)}`;
}

const label = ({ data, file }) => {
  const m = data.meta;
  return [m.source, m.variant, m.state, m.theme].filter(Boolean).join(" · ") || basename(file);
};
const slotNames = [...new Set(captures.flatMap(({ data }) => Object.keys(data.slots)))].filter(s => !only || only.includes(s));
if (!slotNames.length) {
  console.error("No named slots found. Capture with { slots: { shell: el, text: '...' } }.");
  process.exit(1);
}

const escape = v => String(v).replaceAll("|", "\\|");
const out = [`| slot · property | ${captures.map(label).map(escape).join(" | ")} |`, `|---|${captures.map(() => "---").join("|")}|`];
for (const slot of slotNames) {
  for (const [prop, read] of PROPERTIES) {
    const cells = captures.map(({ data }) => {
      const index = data.slots[slot];
      if (index === undefined) return "—";
      if (index === null) return "not found";
      const context = { nodes: data.nodes, shell: data.slots.shell == null ? null : data.nodes[data.slots.shell] };
      return read(data.nodes[index], context) ?? "";
    });
    if (cells.every(c => c === "" || c === "—")) continue;
    out.push(`| **${slot}** ${prop} | ${cells.map(escape).join(" | ")} |`);
  }
}
console.log(out.join("\n"));
console.log(`\nSources:\n${captures.map(({ data, file }) => `- ${label({ data, file })}: ${data.meta.url} (captured ${data.meta.captured}, dpr ${data.meta.devicePixelRatio}, zoom ${data.meta.zoom}) — ${file}`).join("\n")}`);
