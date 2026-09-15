import { resolve, relative, isAbsolute, join } from 'node:path';
/** Staged output is limited to the docs cache; never recursively remove an arbitrary env path. */
export function docsOutput(root) {
  if (!process.env.AREA_DOCS_OUT) return join(root, 'dist');
  const target = resolve(process.env.AREA_DOCS_OUT);
  const within = relative(join(root, '.cache'), target);
  if (!within || within === '..' || within.startsWith('../') || isAbsolute(within)) throw new Error('AREA_DOCS_OUT must be a child of apps/docs/.cache');
  return target;
}
