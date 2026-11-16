// Flowers: bakes each flower grown from its name (e/word-web/flowers.js) to JSON, at its picked
// growth or at several, for pages that don't run the generator themselves.
//
//   node scripts/flower-web.mjs <out file>              each flower at its picked growth
//   node scripts/flower-web.mjs <out file> 1,2,3,4      each flower at these growths
import { writeFileSync } from 'node:fs';
import { FLOWERS, grow } from '../e/word-web/flowers.js';

const [out = 'flowers.json', seeds] = process.argv.slice(2);
const result = FLOWERS.flatMap((f) => (seeds ? seeds.split(',').map(Number) : [f.seed]).map((s) => grow(f, s)));
writeFileSync(out, JSON.stringify(result));
console.log(`${result.length} flowers → ${out}`);
