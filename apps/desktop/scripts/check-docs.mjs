/**
 * Every Documentation entry (src/content/documentation/*.mjs) must describe the family as it is: parts and states the
 * manifest declares, families that exist, keys Kbd can draw, and Do / Don't rows on both sides. Run after a build of
 * @area/styles (the manifest is read from its dist):
 *
 *   npm run check:docs -w @area/desktop            errors only
 *   npm run check:docs -w @area/desktop -- --gaps  also lists families, parts and states with no entry yet
 *   npm run check:docs -w @area/desktop -- button  one family, with its gaps
 *   npm run check:docs -w @area/desktop -- --write  also regenerates DESIGN_SYSTEM.md's Strokes group table
 *
 * Then the docs' own numbers (system evaluation F6, 2026-11-11): the family, file and block counts quoted in
 * COMPONENTS.md and ARCHITECTURE.md against the registry, the Strokes group table against axes/stroke-groups.ts and
 * the CSS that reads each group, and a lint: a comment or doc line that says "at the default" / "by default" and
 * quotes a token's px value that differs from that token resolved at the shipped defaults (type 13, density 32,
 * Corner 10; packages/tokens/dist/css/tokens.css, so run after a tokens build).
 */
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { MANIFESTS } from "@area/styles/manifest";

const app = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { COMPONENT_PAGES } = await import(app + "/src/content/pages.mjs");
const { DOCUMENTATION_GROUPS } = await import(app + "/src/content/documentation.mjs");

const args = process.argv.slice(2);
const showGaps = args.includes("--gaps");
const only = args.find(arg => !arg.startsWith("--"));

const families = new Map(COMPONENT_PAGES.filter(page => !page.docsOnly).map(page => [page.slug, page]));
// Key names Kbd draws as a legend (primitives.tsx KEY_GLYPHS), plus the named keys it prints as written.
const GLYPH_KEYS = ["cmd", "meta", "shift", "alt", "option", "ctrl", "control", "enter", "return", "backspace", "delete",
  "escape", "esc", "tab", "space", "up", "down", "left", "right"];
const NAMED_KEYS = ["home", "end", "pageup", "pagedown", "contextmenu", "menu", "mod"];
const keyOk = key => GLYPH_KEYS.includes(key.toLowerCase()) || NAMED_KEYS.includes(key.toLowerCase()) || /^f([1-9]|1[0-2])$/i.test(key) || /^[A-Za-z0-9/.,\[\]\-=;']$/.test(key);
const ARIA = /^(aria-[a-z]+|role(="[a-z ]+")?|inert|hidden|popover|tabindex|disabled|readonly|required|alt|lang|dir|title|scope|headers|for|id|name|type|open|value|datetime|cite|href|target|rel|download|autocomplete|inputmode|spellcheck|contenteditable|data-[a-z-]+)$/;

const errors = [];
const gaps = [];
const seen = new Map();
const text = (where, value, max = 240) => {
  if (typeof value !== "string" || !value.trim()) errors.push(`${where}: empty text`);
  else if (value.length > max) errors.push(`${where}: ${value.length} characters; keep it under ${max}, one sentence or two`);
  else if (/\b(TODO|TBD|lorem)\b/i.test(value)) errors.push(`${where}: placeholder text`);
};

for (const [group, entries] of Object.entries(DOCUMENTATION_GROUPS)) {
  for (const [slug, doc] of Object.entries(entries)) {
    if (only && slug !== only) continue;
    const at = `${group}.mjs › ${slug}`;
    if (seen.has(slug)) errors.push(`${at}: also in ${seen.get(slug)}.mjs`);
    seen.set(slug, group);
    const page = families.get(slug);
    if (!page) { errors.push(`${at}: no family with this slug in pages.mjs`); continue; }
    const manifest = page.manifest ? MANIFESTS[page.manifest] : undefined;
    const known = new Set(["instead", "practices", "parts", "states", "keyboard", "aria"]);
    for (const key of Object.keys(doc)) if (!known.has(key)) errors.push(`${at}: unknown field "${key}"`);

    for (const [i, row] of (doc.instead ?? []).entries()) {
      const [when, slugs, why] = row;
      text(`${at} › instead[${i}] situation`, when, 160);
      text(`${at} › instead[${i}] why`, why);
      if (!Array.isArray(slugs) || !slugs.length) errors.push(`${at} › instead[${i}]: name at least one family`);
      for (const other of slugs ?? []) {
        if (other === slug) errors.push(`${at} › instead[${i}]: points at itself`);
        else if (!families.has(other)) errors.push(`${at} › instead[${i}]: "${other}" is not a family slug`);
      }
    }

    const practices = doc.practices ?? [];
    for (const [i, [kind, guidance]] of practices.entries()) {
      if (kind !== "Do" && kind !== "Don't") errors.push(`${at} › practices[${i}]: "${kind}" is not Do or Don't`);
      text(`${at} › practices[${i}]`, guidance);
    }
    if (practices.length && (!practices.some(([k]) => k === "Do") || !practices.some(([k]) => k === "Don't")))
      errors.push(`${at} › practices: give both Do and Don't rows`);
    const dos = practices.filter(([k]) => k === "Do").map(([, g]) => g);
    if (practices.length) {
      const order = practices.map(([k]) => k).join(",");
      if (order !== [...dos.map(() => "Do"), ...practices.filter(([k]) => k === "Don't").map(() => "Don't")].join(","))
        errors.push(`${at} › practices: list every Do before the first Don't`);
    }

    const elements = new Set(["root", ...(manifest?.elements ?? [])]);
    for (const [part, about] of Object.entries(doc.parts ?? {})) {
      if (!manifest) errors.push(`${at} › parts: the family has no manifest, so the tab shows no Anatomy`);
      else if (!elements.has(part)) errors.push(`${at} › parts.${part}: not a manifest element of ${manifest.block} (${[...elements].join(", ")})`);
      text(`${at} › parts.${part}`, about);
    }
    const states = new Set(manifest?.states ?? []);
    for (const [state, about] of Object.entries(doc.states ?? {})) {
      if (!states.has(state)) errors.push(`${at} › states.${state}: not a manifest state of ${manifest?.block ?? slug} (${[...states].join(", ") || "none"})`);
      text(`${at} › states.${state}`, about);
    }

    for (const [i, [keys, action]] of (doc.keyboard ?? []).entries()) {
      for (const key of String(keys).split(" or ").flatMap(chord => chord.split("+"))) {
        if (!keyOk(key)) errors.push(`${at} › keyboard[${i}]: "${key}" is not a key name Kbd draws (Tab, Enter, Space, Escape, Up, Down, Left, Right, Home, End, Shift, Cmd, a letter)`);
      }
      text(`${at} › keyboard[${i}]`, action);
    }
    for (const [i, [attributes, when]] of (doc.aria ?? []).entries()) {
      for (const name of String(attributes).split(", ")) if (!ARIA.test(name)) errors.push(`${at} › aria[${i}]: "${name}" is not an attribute name`);
      text(`${at} › aria[${i}]`, when);
    }

    if (showGaps || only) {
      for (const part of elements) if (!(part in (doc.parts ?? {}))) gaps.push(`${slug}: part "${part}" has no description`);
      for (const state of states) if (!(state in (doc.states ?? {}))) gaps.push(`${slug}: state "${state}" has no description`);
      for (const field of ["instead", "practices"]) if (!doc[field]?.length) gaps.push(`${slug}: no ${field}`);
    }
  }
}
if (showGaps && !only) for (const slug of families.keys()) if (!seen.has(slug)) gaps.push(`${slug}: no entry`);

// --- The docs' own numbers (F6) -------------------------------------------------------------------------------------
const root = resolve(app, "../..");
const read = path => readFileSync(join(root, path), "utf8");
const walk = (dir, ext) => readdirSync(join(root, dir)).flatMap(name => {
  const path = join(dir, name);
  if (statSync(join(root, path)).isDirectory()) return name === "node_modules" || name === "dist" ? [] : walk(path, ext);
  return ext.some(end => name.endsWith(end)) ? [path] : [];
});
const { DEPRECATED_COMPONENTS } = await import(app + "/src/content/component-status.mjs");
const quoted = (doc, pattern, what, want) => {
  const match = pattern.exec(read(doc));
  if (!match) errors.push(`${doc}: the sentence that quotes ${what} is gone (the check looks for ${pattern})`);
  else if (Number(match[1]) !== want) errors.push(`${doc}: says ${match[1]} ${what}; the registry has ${want}`);
};
const live = [...families.values()].filter(page => !DEPRECATED_COMPONENTS.has(page.slug));
quoted("docs/COMPONENTS.md", /^(\d+) families, plus /m, "families", live.length);
// The library table names every live family once and no deprecated one.
{
  const table = read("docs/COMPONENTS.md").split("## Library")[1]?.split("\n## ")[0] ?? "";
  const listed = table.split("\n").filter(line => /^\| (?!Group|---)/.test(line))
    .flatMap(line => line.split("|")[2].split(", ").map(name => name.replace(/\s*\(.*$/, "").trim()).filter(Boolean));
  const names = new Map(live.map(page => [page.name, page.slug]));
  for (const name of listed) if (!names.has(name)) errors.push(`docs/COMPONENTS.md › Library: "${name}" is not a live family name in pages.mjs`);
  for (const name of names.keys()) if (!listed.includes(name)) errors.push(`docs/COMPONENTS.md › Library: ${name} is missing from the groups`);
}
quoted("docs/ARCHITECTURE.md", /the (\d+) component files/, "component files", walk("packages/styles/src/components", [".css"]).length);
quoted("docs/ARCHITECTURE.md", /there are (\d+) blocks/, "blocks", Object.keys(MANIFESTS).length);
quoted("docs/ARCHITECTURE.md", /(\d+) families \(one deprecated\), plus the icon pilot/, "families in pages.mjs", families.size);
{
  const css = read("packages/styles/src/components/surface.css");
  const held = Object.values(MANIFESTS).map(m => m.block).filter(block => new RegExp(`^\\s*\\.${block}\\s*\\{`, "m").test(css));
  quoted("docs/ARCHITECTURE.md", /`surface\.css` holds (\d+) blocks/, "blocks in surface.css", held.length);
}

// The Strokes group table: generated from the groups and the CSS that reads each one.
{
  const { STROKE_GROUPS, STROKE_GROUP_STEP } = await import(join(root, "packages/tokens/src/axes/stroke-groups.ts"));
  const sheets = walk("packages/styles/src", [".css"]).filter(path => !/\/(layers|forced-colors)\.css$/.test(path)).map(path => [path, read(path)]);
  const all = walk("packages/styles/src", [".css"]).map(path => read(path)).join("\n");
  const rows = STROKE_GROUPS.map(group => {
    const names = [`--area-edge-${group.id}`];
    // One level of alias (layers.css: --area-input-edge-soft: var(--area-edge-fields)).
    for (const m of all.matchAll(new RegExp(`(--area-[a-z0-9-]+)\\s*:\\s*var\\(--area-edge-${group.id}\\)`, "g"))) names.push(m[1]);
    const readers = sheets.filter(([, text]) => names.some(name => new RegExp(`var\\(${name}[,)]`).test(text)))
      .map(([path]) => "`" + path.split("/").pop() + "`").sort();
    return `| ${group.label} | ${group.amount} (${group.amount * STROKE_GROUP_STEP}%) | ${group.hint} | ${readers.join(", ") || "none"} |`;
  });
  const table = ["| Group | Amount | What it draws | Read in |", "|---|---|---|---|", ...rows].join("\n");
  const doc = read("docs/DESIGN_SYSTEM.md");
  const block = /(<!-- strokes:begin[^\n]*-->\n)([\s\S]*?)(\n<!-- strokes:end -->)/;
  const current = block.exec(doc);
  if (!current) errors.push("docs/DESIGN_SYSTEM.md: the strokes:begin / strokes:end markers are gone");
  else if (current[2] !== table) {
    if (args.includes("--write")) { writeFileSync(join(root, "docs/DESIGN_SYSTEM.md"), doc.replace(block, `$1${table}$3`)); console.log("wrote  docs/DESIGN_SYSTEM.md › Strokes group table"); }
    else errors.push("docs/DESIGN_SYSTEM.md › Strokes: the group table differs from axes/stroke-groups.ts and the CSS that reads each group; regenerate it with -- --write");
  }
}

// The default-value lint. It resolves a token only when its default is plain px arithmetic (var, calc, min, max,
// clamp, round, abs, sign over px and numbers); it compares a number only where a line names the token next to it
// ("gap-row (12)", "radius-container 16") or where a declaration that is exactly one var() carries the comment. It
// cannot cover: a component's own --_* values and rendered sums (a bar's height, a label's start), em / rem / ch
// tokens (tracking, the input widths), colours and shadow percentages, numbers with no token named beside them, and
// a clause that names another type, density or corner (it is skipped as intended).
function resolveDefaults(css) {
  const decls = new Map([...css.matchAll(/^\s*(--area-[a-z0-9-]+)\s*:\s*([^;]*);/gm)].map(m => [m[1], m[2].trim()]));
  const cache = new Map();
  const value = name => {
    if (cache.has(name)) return cache.get(name);
    cache.set(name, null);
    let out = null;
    if (decls.has(name)) { try { out = evaluate(decls.get(name)); } catch { out = null; } }
    cache.set(name, out);
    return out;
  };
  function evaluate(src) {
    let i = 0;
    const ws = () => { while (/\s/.test(src[i] ?? "")) i++; };
    const peek = () => { ws(); return src[i]; };
    const expect = ch => { ws(); if (src[i] !== ch) throw new Error(ch); i++; };
    const zero = (a, u) => (a.n === 0 && a.u === "" && u === "px" ? { n: 0, u } : a);
    const add = (a, b, sign) => { a = zero(a, b.u); b = zero(b, a.u); if (a.u !== b.u) throw new Error("unit"); return { n: a.n + sign * b.n, u: a.u }; };
    const sum = () => {
      let left = product();
      for (;;) { ws(); if ((src[i] === "+" || src[i] === "-") && /\s/.test(src[i + 1] ?? "")) { const op = src[i++]; left = add(left, product(), op === "+" ? 1 : -1); } else return left; }
    };
    const product = () => {
      let left = unary();
      for (;;) {
        const ch = peek();
        if (ch === "*") { i++; const r = unary(); if (left.u && r.u) throw new Error("unit"); left = { n: left.n * r.n, u: left.u || r.u }; }
        else if (ch === "/") { i++; const r = unary(); if (r.u && r.u !== left.u) throw new Error("unit"); left = { n: left.n / r.n, u: r.u ? "" : left.u }; }
        else return left;
      }
    };
    const unary = () => { if (peek() === "-" && !/[0-9.]/.test(src[i + 1] ?? "")) { i++; const v = unary(); return { n: -v.n, u: v.u }; } return atom(); };
    const list = () => {
      const out = [];
      expect("(");
      for (;;) {
        ws();
        const word = /^(nearest|up|down|to-zero)\b/.exec(src.slice(i));
        if (word) { i += word[0].length; out.push(word[1]); } else out.push(sum());
        const ch = peek(); i++;
        if (ch === ")") return out;
        if (ch !== ",") throw new Error("args");
      }
    };
    const atom = () => {
      ws();
      const num = /^-?(\d+\.?\d*|\.\d+)(px|%|[a-z]+)?/.exec(src.slice(i));
      if (num) { i += num[0].length; if (num[2] && num[2] !== "px") throw new Error("unit"); return { n: parseFloat(num[0]), u: num[2] ?? "" }; }
      if (src[i] === "(") { i++; const v = sum(); expect(")"); return v; }
      const fn = /^([a-z-]+)(?=\()/.exec(src.slice(i));
      if (!fn) throw new Error("token");
      i += fn[0].length;
      if (fn[1] === "var") {
        expect("("); ws();
        const ref = /^--[a-z0-9-]+/.exec(src.slice(i));
        if (!ref) throw new Error("var");
        i += ref[0].length;
        let fallback = null;
        if (peek() === ",") { i++; fallback = sum(); }
        expect(")");
        const v = value(ref[0]) ?? fallback;
        if (!v) throw new Error("unresolved");
        return v;
      }
      const a = list();
      const same = () => { const u = a.find(x => x.u)?.u ?? ""; return [a.map(x => { if (x.u !== u && !(x.n === 0 && !x.u)) throw new Error("unit"); return x.n; }), u]; };
      if (fn[1] === "calc") return a[0];
      if (fn[1] === "min" || fn[1] === "max") { const [n, u] = same(); return { n: Math[fn[1]](...n), u }; }
      if (fn[1] === "clamp") { const [[lo, v, hi], u] = same(); return { n: Math.min(Math.max(v, lo), hi), u }; }
      if (fn[1] === "abs") return { n: Math.abs(a[0].n), u: a[0].u };
      if (fn[1] === "sign") return { n: Math.sign(a[0].n), u: "" };
      if (fn[1] === "round") {
        const [mode, v, step = { n: 1, u: v.u }] = typeof a[0] === "string" ? a : ["nearest", ...a];
        const q = v.n / step.n;
        const r = mode === "down" ? Math.floor(q) : mode === "up" ? Math.ceil(q) : mode === "to-zero" ? Math.trunc(q) : Math.floor(q + 0.5);
        return { n: r * step.n, u: v.u };
      }
      throw new Error(fn[1]);
    };
    const out = sum(); ws();
    if (i < src.length) throw new Error("trailing");
    return out;
  }
  const px = new Map();
  for (const name of decls.keys()) { const v = value(name); if (v?.u === "px") px.set(name, +v.n.toFixed(3)); }
  // Device-dependent: hairlines and the icon stroke snap to the screen's pixel.
  px.delete("--area-device-pixel"); px.delete("--area-weight-icon");
  return px;
}
{
  let tokensCss = "";
  try { tokensCss = read("packages/tokens/dist/css/tokens.css"); } catch { errors.push("packages/tokens/dist/css/tokens.css is missing: build @area/tokens before check:docs"); }
  const values = resolveDefaults(tokensCss);
  const DEFAULT = /\b(at the default|by default|at default)\b/i;
  const OTHER = /\b(type 1[24-6]|at 1[24-6]\b|compact|comfortable|density (?!32\b)\d+|corner (?!10\b)\d+|at pill|radius (?!10\b)\d+|was\b|until\b|before\b)/i;
  const names = [...values.keys()].map(name => name.slice("--area-".length)).sort((a, b) => b.length - a.length);
  const near = new RegExp(`(?<![a-z-])(?:--area-)?(${names.join("|")})(?![a-z0-9-])\`?\\s*(?:\\(|:|=|is\\b|,)?\\s*(-?\\d+(?:\\.\\d+)?)(?:px)?(?![\\d/.%])`, "g");
  const lint = [];
  const check = (where, text) => {
    if (!DEFAULT.test(text)) return;
    for (const clause of text.split(/;|\.\s|—/)) {
      if (OTHER.test(clause)) continue;
      for (const m of clause.matchAll(near)) {
        const want = values.get(`--area-${m[1]}`);
        if (Math.abs(want - Number(m[2])) > 0.01) lint.push(`${where}: says ${m[1]} ${m[2]}; it is ${want} at the default`);
      }
    }
  };
  const commentsOf = (src, slashes) => {
    const out = [];
    let open = false;
    src.split("\n").forEach((line, index) => {
      let rest = line, text = "";
      for (;;) {
        if (open) { const end = rest.indexOf("*/"); if (end < 0) { text += " " + rest; break; } text += " " + rest.slice(0, end); rest = rest.slice(end + 2); open = false; continue; }
        const start = rest.indexOf("/*");
        const slash = slashes ? rest.search(/(^|[^:])\/\//) : -1;
        if (slash >= 0 && (start < 0 || slash < start)) { text += " " + rest.slice(slash).replace(/^[^/]*\/\//, ""); break; }
        if (start < 0) break;
        rest = rest.slice(start + 2); open = true;
      }
      if (text.trim()) out.push([index + 1, text, line]);
    });
    return out;
  };
  for (const [dir, ext, slashes] of [["packages/styles/src", [".css"], false], ["packages/tokens/src", [".ts"], true], ["packages/react/src", [".ts", ".tsx"], true]]) {
    for (const path of walk(dir, ext)) {
      for (const [line, text, raw] of commentsOf(read(path), slashes)) {
        check(`${path}:${line}`, text);
        // A declaration's own comment: `prop: var(--area-x); /* … N at the default */`, one declaration on the line.
        const decl = /^[^;]*:\s*var\((--area-[a-z0-9-]+)\);\s*\/[*/]/.exec(raw);
        const num = /(?<![\d/.])(-?\d+(?:\.\d+)?)(?:px)? (?:at the default|by default)/.exec(text);
        if (decl && values.has(decl[1]) && num && !OTHER.test(text.slice(0, num.index + num[0].length)) && Math.abs(Number(num[1]) - values.get(decl[1])) > 0.01)
          lint.push(`${path}:${line}: says ${num[1]} at the default beside ${decl[1]}; it is ${values.get(decl[1])}`);
      }
    }
  }
  for (const doc of ["DESIGN_SYSTEM", "THEMING", "MOTION", "CONTRAST", "COMPONENTS", "ARCHITECTURE"])
    read(`docs/${doc}.md`).split("\n").forEach((line, index) => check(`docs/${doc}.md:${index + 1}`, line));
  for (const finding of lint) errors.push(`default value  ${finding} (quote the formula, or the value at type 13 / density 32 / Corner 10, or name the setting the number is at)`);
}

for (const gap of gaps) console.log(`gap    ${gap}`);
for (const error of errors) console.error(`error  ${error}`);
console.log(`\n  documentation: ${seen.size} of ${families.size} families, ${errors.length} error${errors.length === 1 ? "" : "s"}${showGaps || only ? `, ${gaps.length} gap${gaps.length === 1 ? "" : "s"}` : ""}`);
process.exit(errors.length ? 1 : 0);
