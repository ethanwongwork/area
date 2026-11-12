// Builds artifacts/sen-curves.html and sen-tester.html (Variable Kanji) from their templates, noto-complex.json and the copy.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { COPY } from '../e/kanji-lines/copy.js';

const root = resolve(import.meta.dirname, '..');
// The complex-kanji set's skeletons; strokes only.
const data = JSON.parse(readFileSync(resolve(root, 'e/kanji-lines/noto-complex.json'), 'utf8'));
const slim = Object.fromEntries(Object.entries(data).map(([ch, g]) => [ch, { strokes: g.strokes }]));
const html = readFileSync(resolve(root, 'artifacts/sen-curves.template.html'), 'utf8')
  .replace('/*DATA*/ {}', JSON.stringify(slim))
  .replace('/*COPY*/ []', JSON.stringify(COPY));
writeFileSync(resolve(root, 'artifacts/sen-curves.html'), html);
console.log(`artifacts/sen-curves.html ${(html.length / 1024).toFixed(0)} KB`);

// The variable kanji canvas: the two kanji's data, and the curves page's geometry (vectors through mergeCorners) shared, not copied.
const curves = readFileSync(resolve(root, 'artifacts/sen-curves.template.html'), 'utf8');
const from = curves.indexOf('// ———————————————————————————— vectors');
const to = curves.indexOf('// ———————————————————————————— one glyph');
if (from < 0 || to < 0) throw new Error('geometry block not found in sen-curves.template.html');
const tester = readFileSync(resolve(root, 'artifacts/sen-tester.template.html'), 'utf8')
  .replace('/*DATA*/ {}', JSON.stringify({ 龍: slim['龍'], 驚: slim['驚'] })) // only the two kanji it shows
  .replace('/*GEOMETRY*/', () => curves.slice(from, to));
writeFileSync(resolve(root, 'artifacts/sen-tester.html'), tester);
console.log(`artifacts/sen-tester.html ${(tester.length / 1024).toFixed(0)} KB`);
