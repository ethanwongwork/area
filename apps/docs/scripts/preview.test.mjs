import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPreview, readSnapshot, buildQueue } from './preview.mjs';

test('snapshot publication is atomic; invalid builds retain the last successful page', async t => {
  const directory = await mkdtemp(join(tmpdir(), 'area-preview-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await writeFile(join(directory, 'index.html'), '<body>before</body>');
  const preview = createPreview(await readSnapshot(directory), { reload: true });
  await new Promise(resolve => preview.server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => preview.server.close(resolve)));
  const origin = `http://127.0.0.1:${preview.server.address().port}`;
  const get = path => fetch(origin + path);
  await writeFile(join(directory, 'index.html'), 'in-flight');
  assert.match(await (await get('/')).text(), /before/);
  assert.throws(() => preview.publish(new Map()), /index/);
  assert.match(await (await get('/')).text(), /before/);
  preview.publish(await readSnapshot(directory));
  assert.equal(await (await get('/')).text(), 'in-flight');
  assert.equal(await (await get('/__area_revision')).text(), '1');
  assert.equal((await get('/%ZZ')).status, 400);
  assert.equal((await get('/%2e%2e%2fpackage.json')).status, 404);
});

test('build queue serializes bursts and recovers after failure', async () => {
  let release, count = 0; const errors = [];
  const request = buildQueue(async () => {
    count++;
    if (count === 1) { await new Promise(resolve => release = resolve); throw new Error('invalid source'); }
  }, error => errors.push(error.message));
  const done = request(); request(); request(); release(); await done;
  assert.equal(count, 2); assert.deepEqual(errors, ['invalid source']);
  await request(); assert.equal(count, 3);
});

test('staged output rejects paths outside the disposable docs cache', async () => {
  const { docsOutput } = await import('./output.mjs');
  const previous = process.env.AREA_DOCS_OUT;
  try {
    delete process.env.AREA_DOCS_OUT;
    assert.equal(docsOutput('/project/apps/docs'), '/project/apps/docs/dist');
    for (const path of ['/project', '/project/apps/docs/.cache', '/project/apps/docs/.cache/../src']) {
      process.env.AREA_DOCS_OUT = path; assert.throws(() => docsOutput('/project/apps/docs'), /child/);
    }
    process.env.AREA_DOCS_OUT = '/project/apps/docs/.cache/preview-123';
    assert.equal(docsOutput('/project/apps/docs'), process.env.AREA_DOCS_OUT);
  } finally {
    if (previous === undefined) delete process.env.AREA_DOCS_OUT;
    else process.env.AREA_DOCS_OUT = previous;
  }
});

test('duplicate notifications and unchanged writes do not rebuild; edits and deletion do', async t => {
  const { sourceChanges } = await import('./source-watch.mjs');
  const directory = await mkdtemp(join(tmpdir(), 'area-source-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, 'source.ts');
  await writeFile(path, 'before');
  const changed = sourceChanges([directory]);
  assert.equal(changed(path), false);
  await writeFile(path, 'before'); assert.equal(changed(path), false);
  await writeFile(path, 'after'); assert.equal(changed(path), true);
  assert.equal(changed(path), false);
  await rm(path); assert.equal(changed(path), true); assert.equal(changed(path), false);
  await writeFile(path, 'restored'); assert.equal(changed(path), true);
  assert.equal(changed(join(directory, 'dist', 'area.css')), false);
});
