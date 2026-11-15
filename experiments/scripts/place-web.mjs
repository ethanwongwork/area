// Bakes layouts for long single words: each word's letters placed by e/word-web/place.js from
// several seeds, the best few kept as that word's layouts. The gallery then keeps only the
// layouts that pass the drawn-line check (e/word-web/clear.js, run in a browser by
// scripts/check-web.mjs).
//
//   node scripts/place-web.mjs <out file> [word id …] [--seeds 16] [--keep 8] [--fan 6]
//
// --fan weights the room round each letter (every two arrow ends 26° apart); dense words with
// a hub letter need it higher.
import { writeFileSync } from 'node:fs';
import { webOf, place } from '../e/word-web/place.js';

// Long words, each spelled once from its first letter to its last.
export const WORDS = [
  ['pneumonoultramicroscopicsilicovolcanoconiosis', 'Pneumonoultramicroscopicsilicovolcanoconiosis', 'A lung disease from fine volcanic dust, coined in 1935 to be the longest word in English dictionaries.'],
  ['honorificabilitudinitatibus', 'Honorificabilitudinitatibus', 'Shakespeare, Love’s Labour’s Lost (1598). The longest word in his plays; it alternates consonant and vowel throughout.'],
  ['floccinaucinihilipilification', 'Floccinaucinihilipilification', 'The act of judging something worthless. An 18th-century Eton coinage from four Latin words for nothing.'],
  ['antidisestablishmentarianism', 'Antidisestablishmentarianism', 'Opposition to separating the Church of England from the state, 19th century.'],
  ['pseudopseudohypoparathyroidism', 'Pseudopseudohypoparathyroidism', 'A rare inherited condition that looks like one that looks like a third. Among the longest words in major dictionaries not coined to be long.'],
  ['hippopotomonstrosesquippedaliophobia', 'Hippopotomonstrosesquippedaliophobia', 'A joke name for the fear of long words, built from hippopotamus, monster and sesquipedalian.'],
  ['electroencephalographically', 'Electroencephalographically', 'By means of a recording of the brain’s electrical activity.'],
  ['spectrophotofluorometrically', 'Spectrophotofluorometrically', 'By measuring the light a substance gives off when lit, one wavelength at a time.'],
  ['otorhinolaryngological', 'Otorhinolaryngological', 'Of ear, nose and throat medicine, from the Greek for ear, nose and larynx.'],
  ['incomprehensibilities', 'Incomprehensibilities', 'Things that can’t be understood. Twenty-one letters of plain English.'],
  ['sesquipedalian', 'Sesquipedalian', 'Given to long words; from Horace’s “words a foot and a half long”.'],
  ['subdermatoglyphic', 'Subdermatoglyphic', 'Beneath the ridges of the fingertips. Seventeen letters and none repeated, so it draws as a single path.'],
  ['uncopyrightable', 'Uncopyrightable', 'Fifteen letters, none repeated: one of the longest everyday English words that uses no letter twice.'],
];

if (process.argv[1]?.endsWith('place-web.mjs')) {
  const args = process.argv.slice(2);
  const opt = (k, d) => (args.includes(k) ? Number(args[args.indexOf(k) + 1]) : d);
  const out = args[0] ?? 'placements.json';
  const ids = args.slice(1).filter((a, i, all) => !a.startsWith('--') && !all[i - 1]?.startsWith('--'));
  const seeds = opt('--seeds', 16), keep = opt('--keep', 8), fanWeight = opt('--fan', 6);
  const result = [];
  for (const [id, name, about] of WORDS.filter(([id]) => !ids.length || ids.includes(id))) {
    const { letters, edges } = webOf(name);
    const t0 = Date.now();
    const runs = [];
    for (let seed = 1; seed <= seeds; seed++) {
      const r = place(letters, edges, { seed, iters: edges.length > 40 ? 60000 : 30000, fanWeight });
      runs.push({ seed, pos: r.pos, cost: Math.round(r.report.total), crossings: r.report.crossing, near: Math.round(r.report.near), fan: Math.round(r.report.fan) });
    }
    runs.sort((a, b) => a.cost - b.cost);
    console.log(`${id}: ${letters.length} letters, ${edges.length} arrows, best ${runs.slice(0, 3).map((r) => `seed ${r.seed} cost ${r.cost} x${r.crossings} fan ${r.fan}`).join('; ')} (${Date.now() - t0} ms)`);
    result.push({ id, name, text: name, about, word: true, letters, edges, layouts: runs.slice(0, keep) });
  }
  writeFileSync(out, JSON.stringify(result));
}
