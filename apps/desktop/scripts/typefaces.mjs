/**
 * Builds the typeface library's facts from the font files Area ships (src/content/typefaces/catalogue.mjs; the
 * research: docs/research/typefaces-2026-10-31). Run after changing the catalogue or a font package:
 *
 *   node apps/desktop/scripts/typefaces.mjs
 *
 * Writes, all committed:
 *   src/content/typefaces/generated/faces.json   per face: CSS family, styles, axes, named instances, features,
 *                                                characters (as ranges, with counts by Unicode block), metrics, tuning
 *   src/content/typefaces/generated/unicode.json the Unicode name of every character a face has, and the blocks
 *   src/content/typefaces/generated/files.json   the font files the renderer copies into dist/fonts (scripts/renderer.mjs)
 *   src/styles/typefaces.css                     an @font-face rule per file, under the face's own family name
 *                                                ("area-face-<id>"), so a face downloads only when it is drawn
 *
 * Sources: Fontsource packages (Google Fonts' files, per-script subsets with their unicode-range), the geist package
 * (Vercel's own build, with italics and stylistic sets), and assets/fonts/<id> (libre foundries' files with their OFL).
 * Licensed faces are not here: the main process measures them on the Mac (electron/main.cjs).
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { TYPEFACES } from "../src/content/typefaces/catalogue.mjs";

const require = createRequire(import.meta.url);
const fontkit = require("fontkit");
const wawoff2 = require("wawoff2");
const { measure, staticWeights, stem, axesOf, instancesOf, ranges, names } = require("./typeface-facts.cjs");

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = resolve(root, "../..");
const out = join(root, "src/content/typefaces/generated");
const UNICODE = "https://www.unicode.org/Public/16.0.0/ucd";

/** A package's folder, wherever npm put it. */
const packageDir = name => {
  // Some packages (geist) don't export package.json: look in the node_modules folders Node would search.
  const dir = require.resolve.paths(name).map(folder => join(folder, name)).find(folder => existsSync(join(folder, "package.json")));
  if (!dir) throw new Error(`${name} is not installed: npm install at the repository root`);
  return dir;
};

/** The @font-face rules in a Fontsource stylesheet. */
function parseCss(file) {
  const css = readFileSync(file, "utf8");
  return [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map(([, body]) => {
    const get = key => body.match(new RegExp(`${key}:\\s*([^;]+);`))?.[1].trim();
    return {
      style: get("font-style") ?? "normal",
      weight: get("font-weight") ?? "400",
      stretch: get("font-stretch"),
      file: join(dirname(file), get("src").match(/url\(\.?\/?([^)]+\.woff2)\)/)[1]),
      unicodeRange: get("unicode-range"),
    };
  });
}

/** The stylesheets that load every axis a variable package has, in normal and italic. */
function fontsourceRules(pkg) {
  const dir = packageDir(pkg);
  const sheets = readdirSync(dir).filter(name => name.endsWith(".css"));
  if (pkg.startsWith("@fontsource-variable/")) {
    const best = ["full", "standard", "opsz", "wdth", "wght"].find(name => sheets.includes(`${name}.css`)) ?? "index";
    return [`${best}.css`, `${best}-italic.css`].filter(name => sheets.includes(name)).flatMap(name => parseCss(join(dir, name)));
  }
  // A static family: every weight's stylesheet (index.css repeats 400).
  return sheets.filter(name => name !== "index.css").flatMap(name => parseCss(join(dir, name)));
}

/** The geist package's files for one of its folders: the variable fonts, roman and italic. */
function geistRules(folder) {
  const dir = join(packageDir("geist"), "dist/fonts", folder);
  return readdirSync(dir).filter(name => /(Variable|VF|\[wght\])\.woff2$/.test(name)).map(name => ({
    style: /Italic/.test(name) ? "italic" : "normal", weight: "100 900", file: join(dir, name),
  }));
}

/** A libre face's vendored files: weight and style read from each file. */
function libreRules(folder) {
  const dir = join(root, "assets/fonts", folder);
  return readdirSync(dir).filter(name => /\.(woff2|otf|ttf)$/.test(name)).map(name => {
    const font = fontkit.openSync(join(dir, name));
    const axes = font.variationAxes ?? {};
    const weight = axes.wght ? `${axes.wght.min} ${axes.wght.max}` : String(font["OS/2"]?.usWeightClass ?? 400);
    const italic = (font["OS/2"]?.fsSelection?.italic) || /italic|oblique/i.test(font.subfamilyName ?? "");
    return { style: italic ? "italic" : "normal", weight, file: join(dir, name) };
  });
}

/** A font file as fontkit reads it; WOFF2 is decompressed first, since fontkit can't vary a WOFF2's outlines. */
async function open(file) {
  const bytes = readFileSync(file);
  return fontkit.create(file.endsWith(".woff2") ? Buffer.from(await wawoff2.decompress(bytes)) : bytes);
}

async function blocks() {
  const text = await (await fetch(`${UNICODE}/Blocks.txt`)).text();
  return [...text.matchAll(/^([0-9A-F]+)\.\.([0-9A-F]+); (.+)$/gm)].map(([, a, b, name]) => [parseInt(a, 16), parseInt(b, 16), name.trim()]);
}

async function unicodeNames() {
  const text = await (await fetch(`${UNICODE}/UnicodeData.txt`)).text();
  const map = new Map();
  for (const line of text.split("\n")) {
    const [hex, name, category, , , , , , , , oldName] = line.split(";");
    if (!hex) continue;
    map.set(parseInt(hex, 16), { name: name.startsWith("<") ? (oldName || name.replace(/[<>]/g, "")) : name, category });
  }
  return map;
}

const blockOf = (list, cp) => list.find(([a, b]) => cp >= a && cp <= b)?.[2] ?? "Unassigned";

async function main() {
  const BLOCKS = await blocks();
  const NAMES = await unicodeNames();
  const faces = {}, files = [], css = [], used = new Set();

  for (const face of TYPEFACES) {
    const { source } = face;
    const rules = source.fontsource ? fontsourceRules(source.fontsource) : source.geist ? geistRules(source.geist) : source.files ? libreRules(source.files) : null;
    if (!rules) continue;
    const family = `area-face-${face.id}`;
    const seen = new Set();
    for (const rule of rules) {
      const to = `fonts/${face.id}/${basename(rule.file)}`;
      if (!seen.has(to)) { files.push({ from: relative(repo, rule.file), to }); seen.add(to); }
      const format = rule.file.endsWith(".woff2") ? "woff2" : rule.file.endsWith(".otf") ? "opentype" : "truetype";
      css.push(`@font-face { font-family: "${family}"; font-style: ${rule.style}; font-weight: ${rule.weight};${rule.stretch ? ` font-stretch: ${rule.stretch};` : ""} font-display: swap; src: url("../${to}") format("${format}");${rule.unicodeRange ? ` unicode-range: ${rule.unicodeRange};` : ""} }`);
    }

    // Characters: every file of the roman style (Fontsource splits a family by script). Metrics and axes: the file with
    // a lowercase x (the Latin subset), at its default instance.
    const roman = rules.filter(rule => rule.style === "normal");
    // One at a time: the WOFF2 decoder (wasm) isn't safe to run concurrently.
    const fonts = [];
    for (const file of new Set((roman.length ? roman : rules).map(rule => rule.file))) fonts.push({ file, font: await open(file) });
    const codePoints = fonts.flatMap(({ font }) => font.characterSet);
    for (const cp of codePoints) used.add(cp);
    // The Latin file nearest the regular weight: a static family's files come in any order (Bold sorts before Regular).
    const distance = rule => { const [low, high = low] = String(rule.weight).split(" ").map(Number); return 400 < low ? low - 400 : 400 > high ? 400 - high : 0; };
    const byWeight = [...(roman.length ? roman : rules)].sort((a, b) => distance(a) - distance(b)).map(rule => fonts.find(entry => entry.file === rule.file)).filter(Boolean);
    const latin = byWeight.find(({ font }) => font.glyphForCodePoint(120)?.id && font.glyphForCodePoint(72)?.id)?.font ?? fonts[0].font;
    const { metrics, tuning } = measure(latin);
    // A static family's strong and emphasis: measured across its weights' files.
    if (!latin.variationAxes?.wght) {
      const stems = {};
      for (const rule of roman) {
        const weight = Number(String(rule.weight).split(" ")[0]);
        const font = fonts.find(entry => entry.file === rule.file)?.font;
        const s = font?.glyphForCodePoint(120)?.id ? stem(font, font.glyphForCodePoint(120).bbox.maxY) : null;
        if (s && !(weight in stems)) stems[weight] = s;
      }
      Object.assign(tuning, staticWeights(stems));
    }
    const features = [...new Set(fonts.flatMap(({ font }) => font.availableFeatures ?? []))].sort();
    const counts = {};
    for (const cp of new Set(codePoints)) { if (cp <= 0x1f || cp === 0x7f) continue; const block = blockOf(BLOCKS, cp); counts[block] = (counts[block] ?? 0) + 1; }
    const styles = [...new Map(rules.map(rule => [`${rule.weight}|${rule.style}`, { weight: rule.weight, style: rule.style }])).values()];
    faces[face.id] = {
      family,
      names: names(latin),
      styles,
      axes: axesOf(latin),
      instances: instancesOf(latin),
      features,
      characters: new Set(codePoints.filter(cp => cp > 0x1f && cp !== 0x7f)).size,
      ranges: ranges(codePoints),
      blocks: counts,
      metrics,
      tuning,
      files: seen.size,
    };
    console.log(`${face.name.padEnd(28)} ${String(faces[face.id].characters).padStart(5)} chars  x ${metrics.xHeight}  stem ${tuning.stem ?? "-"}  strong ${tuning.strong ?? "-"}  bold ${tuning.emphasis ?? "-"}  ${faces[face.id].axes.map(axis => axis.tag).join(" ")}`);
  }

  // Unicode names for every character a shipped face has; Latin, Greek and Cyrillic in full, for installed faces.
  const names_ = {};
  const always = BLOCKS.filter(([, , name]) => /^(Basic Latin|Latin|Greek|Cyrillic|General Punctuation|Currency Symbols|Letterlike Symbols|Number Forms|Arrows|Mathematical Operators|Box Drawing|Geometric Shapes|Spacing Modifier Letters|Combining Diacritical Marks|Superscripts and Subscripts|Alphabetic Presentation Forms)/.test(name));
  for (const [a, b] of always) for (let cp = a; cp <= b; cp++) used.add(cp);
  for (const cp of [...used].sort((x, y) => x - y)) { const entry = NAMES.get(cp); if (entry && cp > 0x1f) names_[cp.toString(16).toUpperCase()] = entry.name; }

  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "faces.json"), JSON.stringify(faces));
  writeFileSync(join(out, "files.json"), JSON.stringify(files, null, 1));
  writeFileSync(join(out, "unicode.json"), JSON.stringify({ version: "16.0.0", blocks: BLOCKS, names: names_ }));
  writeFileSync(join(root, "src/styles/typefaces.css"), `/* Generated by scripts/typefaces.mjs: the typeface library's faces, each under its own family name. Don't edit. */\n${css.join("\n")}\n`);
  console.log(`${Object.keys(faces).length} faces, ${files.length} files, ${Object.keys(names_).length} character names`);
}

await main();
