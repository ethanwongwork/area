/** Immutable snapshots keep a failed/in-flight build away from the live preview. */
import { readFile, readdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';

export async function readSnapshot(directory, prefix = '') {
  const files = new Map();
  for (const entry of await readdir(join(directory, prefix), { withFileTypes: true })) {
    const path = join(prefix, entry.name);
    if (entry.isDirectory()) {
      for (const [key, value] of await readSnapshot(directory, path)) files.set(key, value);
    } else if (entry.isFile()) files.set('/' + path.split('\\').join('/'), await readFile(join(directory, path)));
  }
  if (!prefix && !files.has('/index.html')) throw new Error('Preview has no index.html');
  return files;
}

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const reloadScript = revision => `<script type="module">const revision=${revision}; setInterval(async()=>{try{const next=await(await fetch('/__area_revision')).text();if(String(revision)!==next)location.reload();}catch{}},1000);</script>`;
export function createPreview(initial, { reload = false } = {}) {
  let snapshot = initial, revision = 0;
  const server = createServer((req, res) => {
    let path;
    try { path = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname); }
    catch { res.writeHead(400).end('Bad request'); return; }
    res.setHeader('cache-control', 'no-store, must-revalidate');
    if (reload && path === '/__area_revision') { res.end(String(revision)); return; }
    if (path === '/') path = '/index.html';
    const body = snapshot.get(path);
    if (!body) { res.writeHead(404).end('Not found'); return; }
    res.setHeader('content-type', TYPES[extname(path)] ?? 'application/octet-stream');
    res.end(reload && path.endsWith('.html') ? body.toString().replace('</body>', reloadScript(revision) + '</body>') : body);
  });
  return { server, publish(next) { if (!next.has('/index.html')) throw new Error('Preview has no index.html'); snapshot = next; revision++; } };
}

/** Serializes builds; changes arriving during one build request exactly one follow-up. */
export function buildQueue(build, onError = console.error) {
  let pending = false, running;
  return function request() {
    pending = true;
    if (!running) running = (async () => {
      while (pending) { pending = false; try { await build(); } catch (error) { onError(error); } }
    })().finally(() => { running = undefined; });
    return running;
  };
}
