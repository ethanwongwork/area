// Builds e/kanji-lines/strokes.js from KanjiVG stroke files.
//
//   node scripts/kanjivg.mjs <dir of KanjiVG .svg files>
//
// KanjiVG (https://kanjivg.tagaini.net, Ulrich Apel, CC BY-SA 3.0) draws each character as
// stroke centrelines in stroke order, on a 109 × 109 box, each stroke tagged with its kind
// (㇐ horizontal, ㇑ vertical, ㇒ left-falling, ㇔ dot…). The piece keeps only the path data
// and the kind; everything that makes it a typeface happens in lines.js.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { COPY, TITLE } from '../e/kanji-lines/copy.js';

const dir = process.argv[2];
if (!dir) throw new Error('Pass the folder of KanjiVG .svg files.');

const chars = [...new Set([...COPY.join(''), ...TITLE.join('')])];
const out = {};
const missing = [];
for (const ch of chars) {
  const hex = ch.codePointAt(0).toString(16).padStart(5, '0');
  const file = resolve(dir, `${hex}.svg`);
  if (!existsSync(file)) {
    missing.push(ch);
    continue;
  }
  const svg = readFileSync(file, 'utf8');
  const strokes = [...svg.matchAll(/<path[^>]*?kvg:type="([^"]*)"[^>]*?\sd="([^"]+)"|<path[^>]*?\sd="([^"]+)"[^>]*?kvg:type="([^"]*)"/g)].map(
    (m) => [(m[1] ?? m[4]).split('/')[0], m[2] ?? m[3]],
  );
  // Strokes with no kind (kana, punctuation) still count.
  const all = [...svg.matchAll(/<path[^>]*?\sd="([^"]+)"/g)].map((m) => m[1]);
  out[ch] = all.map((d) => [strokes.find((s) => s[1] === d)?.[0] ?? '', d]);
}

const body = Object.entries(out)
  .map(([ch, s]) => `  ${JSON.stringify(ch)}: [${s.map(([t, d]) => `[${JSON.stringify(t)}, ${JSON.stringify(d)}]`).join(', ')}],`)
  .join('\n');

writeFileSync(
  resolve(import.meta.dirname, '../e/kanji-lines/strokes.js'),
  `// Stroke centrelines from KanjiVG (https://kanjivg.tagaini.net), Copyright (C) 2009–2024
// Ulrich Apel, CC BY-SA 3.0 (https://creativecommons.org/licenses/by-sa/3.0/). Shared under
// the same licence. Built by scripts/kanjivg.mjs: [kind, path] per stroke, 109 × 109 box.
// Characters KanjiVG doesn't have (the brackets) are drawn in lines.js.
export default {
${body}
};
`,
);
console.log(`${Object.keys(out).length} characters${missing.length ? `; drawn by hand: ${missing.join(' ')}` : ''}`);
