// Builds artifacts/sen-curves.html and sen-tester.html (Variable Kanji) from their templates, noto-complex.json and the copy.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { COPY } from '../e/kanji-lines/copy.js';

const root = resolve(import.meta.dirname, '..');
// The complex-kanji set's skeletons; strokes only.
const data = JSON.parse(readFileSync(resolve(root, 'e/kanji-lines/noto-complex.json'), 'utf8'));
const slim = Object.fromEntries(Object.entries(data).map(([ch, g]) => [ch, { strokes: g.strokes }]));
// The line's geometry, from the Variable Kanji piece's module, inlined into both pages.
const geometry = readFileSync(resolve(root, 'e/variable-kanji/curves.js'), 'utf8')
  .replace(/^export .*$/m, '')
  .trim()
  .replace(/\n/g, '\n  ');
const html = readFileSync(resolve(root, 'artifacts/sen-curves.template.html'), 'utf8')
  .replace('/*DATA*/ {}', JSON.stringify(slim))
  .replace('/*GEOMETRY*/', () => geometry)
  .replace('/*COPY*/ []', JSON.stringify(COPY));
writeFileSync(resolve(root, 'artifacts/sen-curves.html'), html);
console.log(`artifacts/sen-curves.html ${(html.length / 1024).toFixed(0)} KB`);

// The variable kanji canvas: the two kanji's data and the same geometry.
const tester = readFileSync(resolve(root, 'artifacts/sen-tester.template.html'), 'utf8')
  .replace('/*DATA*/ {}', JSON.stringify({ 龍: slim['龍'], 驚: slim['驚'] })) // only the two kanji it shows
  .replace('/*GEOMETRY*/', () => geometry);
writeFileSync(resolve(root, 'artifacts/sen-tester.html'), tester);
console.log(`artifacts/sen-tester.html ${(tester.length / 1024).toFixed(0)} KB`);
