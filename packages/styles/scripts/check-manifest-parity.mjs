import { readFileSync } from 'node:fs';
import { MANIFESTS } from '../src/manifest.ts';
import { checkManifestParity } from './manifest-parity.mjs';
const problems=checkManifestParity(MANIFESTS,readFileSync(new URL('../dist/area.css',import.meta.url),'utf8'));
if(problems.length) {
  console.error(`Manifest parity failed (${problems.length}):\n${problems.join('\n')}`);
  process.exitCode=1;
} else console.log(`  manifest parity ok (${Object.keys(MANIFESTS).length} components; scoped states, modifiers and elements)`);
