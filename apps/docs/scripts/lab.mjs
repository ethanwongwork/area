import { build } from 'esbuild';
import { writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
export const LAB_CSS = `
@layer area.base {
  .lab-header, .lab-report { padding: var(--area-gutter-xl); }
  .lab-header h1 { font-size: var(--area-text-xl-size); font-weight: var(--area-weight-strong); }
  .lab-header p, .lab-report p { color: var(--area-fg-muted); }
  .lab-row { display:flex; flex-wrap:wrap; align-items:center; gap:var(--area-space-12); }
  .lab-between { justify-content:space-between; }
  .lab-stack { display:flex; flex-direction:column; gap:var(--area-space-16); min-inline-size:0; }
  .lab-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%, var(--docs-customizer-panel)),1fr)); gap:var(--area-gutter-lg); }
  .lab-stage { padding:var(--area-gutter-xl); background:var(--area-bg-page); color:var(--area-fg-default); border-block:1px solid var(--area-border-decorative); display:flex; flex-direction:column; gap:var(--area-gutter-lg); }
  .lab-stage h2, .lab-report h2 { font-size:var(--area-text-lg-size); font-weight:var(--area-weight-strong); margin:0; }
  .lab-results { padding-inline-start:var(--area-space-24); }
  .lab-results li { padding-block:var(--area-space-8); border-bottom:1px solid var(--area-border-decorative); }
  .lab-report pre { white-space:pre-wrap; overflow-wrap:anywhere; font-size:var(--area-text-xs-size); }
}
`;
export async function buildLab(root, out, docsCSS) {
  const cache = join(root,'.cache');
  await mkdir(cache,{recursive:true});
  const temporary = await mkdtemp(join(cache,'lab-'));
  let html;
  try {
    const entry = join(temporary,'board.mjs');
    await build({entryPoints:[join(root,'src/lab/board.tsx')],bundle:true,format:'esm',platform:'node',jsx:'automatic',outfile:entry,external:['react','react-dom','react/jsx-runtime']});
    const { Board } = await import(pathToFileURL(entry).href);
    html = renderToString(createElement(Board));
  } finally { await rm(temporary,{recursive:true,force:true}); }
  await build({entryPoints:[join(root,'src/lab/client.tsx')],bundle:true,format:'esm',platform:'browser',jsx:'automatic',outfile:join(out,'lab.js'),define:{'process.env.NODE_ENV':'"production"'}});
  await writeFile(join(out,'lab.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>System lab — Area</title><link rel="stylesheet" href="./area.css"><style>${docsCSS}${LAB_CSS}</style></head><body><div id="lab-root">${html}</div><script type="module" src="./lab.js"></script></body></html>`);
}
