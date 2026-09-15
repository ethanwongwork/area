import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
const ignored = new Set(['dist', 'node_modules', '.cache', '.git']);
const source = path => /\.(?:tsx?|mjs|css|json|svg)$/.test(path);
function fingerprint(path) {
  try { return createHash('sha256').update(readFileSync(path)).digest('hex'); }
  catch (error) { if (error.code === 'ENOENT' || error.code === 'EISDIR') return null; throw error; }
}
/** FSEvents can repeat or report metadata changes. Rebuild only when bytes change. */
export function sourceChanges(directories, files = []) {
  const previous = new Map();
  function seed(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (ignored.has(entry.name)) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) seed(path);
      else if (entry.isFile() && source(path)) previous.set(path, fingerprint(path));
    }
  }
  directories.forEach(seed);
  files.forEach(path => previous.set(path, fingerprint(path)));
  return path => {
    if (!source(path) || path.split(/[/\\]/).some(part => ignored.has(part))) return false;
    const next = fingerprint(path);
    if ((previous.get(path) ?? null) === next) return false;
    previous.set(path, next);
    return true;
  };
}
