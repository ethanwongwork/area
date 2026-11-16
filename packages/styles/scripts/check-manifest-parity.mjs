import { readFileSync } from 'node:fs';
import { MANIFESTS } from '../src/manifest.ts';
import { checkManifestParity, checkVocabulary } from './manifest-parity.mjs';
import * as vocabulary from './vocabulary.mjs';
const css=readFileSync(new URL('../dist/area.css',import.meta.url),'utf8');
// The React side of the vocabulary needs the TypeScript compiler; test:contracts checks it.
const problems=[...checkManifestParity(MANIFESTS,css),...checkVocabulary({manifests:MANIFESTS,css},vocabulary)];
if(problems.length) {
  console.error(`Manifest parity failed (${problems.length}):\n${problems.join('\n')}`);
  process.exitCode=1;
} else console.log(`  manifest parity ok (${Object.keys(MANIFESTS).length} components; scoped states, modifiers, elements and one vocabulary)`);
