import { watch } from 'node:fs';
import { sourceChanges } from './source-watch.mjs';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildQueue, createPreview, readSnapshot } from './preview.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const cache = join(root, 'apps/docs/.cache');
await mkdir(cache, { recursive: true });
let initial = new Map();
try { initial = await readSnapshot(join(root, 'apps/docs/dist')); } catch {}
const preview = createPreview(initial, { reload: true });
preview.server.listen(Number(process.env.PORT ?? 4321), '127.0.0.1', () => console.log('Area preview → http://localhost:' + (process.env.PORT ?? 4321)));
preview.server.on('error', error => { console.error(error.message); process.exit(1); });
let child, timer;
const request = buildQueue(async () => {
  const stage = await mkdtemp(join(cache, 'preview-'));
  try {
    await new Promise((resolveBuild, reject) => {
      child = spawn('npm', ['run', 'build:docs'], { cwd: root, stdio: 'inherit', env: { ...process.env, AREA_DOCS_OUT: stage } });
      child.once('error', reject);
      child.once('exit', code => code === 0 ? resolveBuild() : reject(new Error('Build failed; keeping the last successful preview.')));
    });
    preview.publish(await readSnapshot(stage));
    console.log('Area preview updated.');
  } finally { child = undefined; await rm(stage, { recursive: true, force: true }); }
});
const directories = ['packages', 'apps/docs', 'scripts'].map(path => join(root, path));
const config = join(root, 'package.json');
const changed = sourceChanges(directories, [config]);
function onChange(path) {
  try {
    if (!changed(path)) return;
    console.log('Source changed:', path);
    clearTimeout(timer); timer = setTimeout(request, 150);
  } catch (error) { console.error('Could not read changed source:', error); }
}
const watchers = directories.map(directory => watch(directory, { recursive: true }, (_event, filename) => {
  if (filename) onChange(join(directory, filename));
}));
watchers.push(watch(config, () => onChange(config)));
await request();
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
  clearTimeout(timer); watchers.forEach(w => w.close()); child?.kill('SIGTERM'); preview.server.close(); process.exit(0);
});
