// Exports every piece's set for posting, and the stills for the views gallery.
//
//   node scripts/export-set.mjs                 every published piece that lists its views
//   node scripts/export-set.mjs word-web eddy   only these
//   node scripts/export-set.mjs --no-video      stills only (fast)
//   node scripts/export-set.mjs --zip           and zip exports/ when done
//
// For each piece, from public/views/<slug>/views.json:
//   exports/<NN slug>/<NN id>.png             every view, 2160 px (the carousel, in order)
//   exports/<NN slug>/<NN id>-1080.mp4        moving views: whole loops, ≥ 8 s, H.264
//   exports/<NN slug>/<NN id>-2160.mp4        the same at 2160 px (masters)
//   exports/<NN slug>/all-views.png           every view in one grid, 2160 px
//   exports/<NN slug>/caption.txt             the caption to post
//   exports/<NN slug>/credits.txt             colophon, licences, what blocks posting
//   public/views/<slug>/<id>.jpg              720 px stills for the views gallery
//
// Each view is drawn by the piece's own render(t, size) (src/export.js), frame by frame, so
// loops close exactly. Uses an installed Chromium browser (Edge or Chrome), headless, as a
// guest. Prints what it is doing as it goes; a full run takes about ten minutes.
import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const flag = (f) => args.includes(f);
const only = args.filter((a) => !a.startsWith('--'));
const registry = JSON.parse(readFileSync(resolve(root, 'experiments.json'), 'utf8'));
const viewsOf = (slug) => {
  const p = resolve(root, 'public/views', slug, 'views.json');
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')).views : null;
};
const pieces = registry
  .filter((e) => !e.draft && Number.isInteger(e.number) && viewsOf(e.slug))
  .filter((e) => !only.length || only.includes(e.slug))
  .sort((a, b) => a.number - b.number);
const out = resolve(root, 'exports');
const nn = (n) => String(n).padStart(2, '0');
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

const browsers = [process.env.CHROME_PATH, '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
const server = await createServer({ root, configFile: resolve(root, 'vite.config.js'), server: { port: 5331, strictPort: false }, logLevel: 'error' });
await server.listen();
const base = server.resolvedUrls.local[0];
const browser = await chromium.launch({ executablePath: browsers.find((p) => existsSync(p)), headless: true, args: ['--guest', '--disable-features=msImplicitSignin', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars', '--force-color-profile=srgb'] });

const report = [];
for (const e of pieces) {
  const views = viewsOf(e.slug);
  const dir = resolve(out, `${nn(e.number)} ${e.slug}`);
  const pub = resolve(root, 'public/views', e.slug);
  mkdirSync(dir, { recursive: true });
  log(`${e.number} ${e.slug}: ${views.length} views`);
  const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1200, height: 1200 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  // Downloads land where `name` says: a path relative to the piece's export folder, or pub:.
  const saved = new Map();
  page.on('download', async (d) => {
    const name = d.suggestedFilename();
    const to = name.startsWith('pub--') ? resolve(pub, name.slice(5)) : resolve(dir, name);
    const done = d.saveAs(to).then(() => to);
    saved.set(name, done);
  });
  const waitFor = async (name) => {
    for (let i = 0; i < 2400 && !saved.has(name); i++) await new Promise((r) => setTimeout(r, 100));
    return saved.get(name);
  };
  const open = async (params) => {
    const q = new URLSearchParams({ thumb: '', ...params });
    await page.goto(`${base}e/${e.slug}/?${q}`);
    await page.waitForFunction(() => window.__export?.ready, null, { timeout: 120000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
  };
  const piece = { slug: e.slug, number: e.number, views: [] };
  for (const [i, v] of views.entries()) {
    await open(v.params ?? {});
    const name = `${nn(i + 1)} ${v.id}`;
    const opts = { t: v.t ?? 0, zoom: v.zoom, focus: v.focus };
    await page.evaluate(
      async ({ name, opts, id, large }) => {
        const r = await import('/src/record.js');
        await r.still({ ...opts, size: 2160, name: `${name}.png`, thumb: 720, thumbName: `pub--${id}.jpg` });
        if (large) await r.still({ ...opts, size: 1440, name: `pub--${id}-large.jpg` });
      },
      { name, opts, id: v.id, large: !!v.zoom },
    );
    await waitFor(`${name}.png`);
    await waitFor(`pub--${v.id}.jpg`);
    if (v.zoom) {
      await waitFor(`pub--${v.id}-large.jpg`);
    }
    const info = await page.evaluate(async () => {
      const r = await import('/src/record.js');
      return { loop: window.__export.loop, fps: window.__export.fps, gap: r.loopGap() };
    });
    const row = { id: v.id, label: v.label, loop: info.loop, fps: info.fps, gap: +info.gap.toFixed(2) };
    if (v.video && info.loop > 0 && !flag('--no-video')) {
      const loops = v.loops ?? Math.max(1, Math.ceil((v.seconds ?? 8) / info.loop - 1e-6));
      for (const size of [1080, 2160]) {
        const file = `${name}-${size}.mp4`;
        const t0 = Date.now();
        const r = await page.evaluate(({ size, file, loops, opts }) => import('/src/record.js').then((m) => m.video({ size, loops, name: file, zoom: opts.zoom, focus: opts.focus })), { size, file, loops, opts });
        await waitFor(file);
        log(`  ${file}: ${r.frames} frames, ${r.seconds.toFixed(2)} s (${((Date.now() - t0) / 1000).toFixed(0)} s to make)`);
        row.video = `${r.seconds.toFixed(2)} s, ${loops} loop${loops > 1 ? 's' : ''} at ${info.fps} fps`;
      }
    }
    piece.views.push(row);
    log(`  ${name}: still${row.video ? ', video' : ''}${info.loop ? `, loop ${info.loop.toFixed(2)} s, end-to-start gap ${row.gap}` : ''}`);
  }
  // The caption, from the panel (the page without ?thumb).
  await page.goto(`${base}e/${e.slug}/`);
  await page.waitForFunction(() => window.__export?.ready, null, { timeout: 120000 });
  const caption = (await page.evaluate(() => window.__caption?.())) ?? e.title;
  writeFileSync(resolve(dir, 'caption.txt'), caption.trim() + '\n');
  // Every view in one grid.
  await page.evaluate(
    async ({ slug, ids }) => {
      const n = ids.length, cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols), S = 2160, gap = 24;
      const cell = Math.floor((S - gap * (cols + 1)) / cols);
      const c = document.createElement('canvas');
      c.width = S;
      c.height = gap + rows * (cell + gap);
      const g = c.getContext('2d');
      g.fillStyle = '#fff';
      g.fillRect(0, 0, c.width, c.height);
      for (const [i, id] of ids.entries()) {
        const img = new Image();
        img.src = `/views/${slug}/${id}.jpg?${Date.now()}`;
        await img.decode();
        g.drawImage(img, gap + (i % cols) * (cell + gap), gap + Math.floor(i / cols) * (cell + gap), cell, cell);
      }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(await new Promise((r) => c.toBlob(r, 'image/png')));
      a.download = 'all-views.png';
      a.click();
    },
    { slug: e.slug, ids: views.map((v) => v.id) },
  );
  await waitFor('all-views.png');
  await Promise.all(saved.values());
  writeFileSync(resolve(dir, 'credits.txt'), credits(e, views, piece));
  if (errors.length) log(`  page errors: ${[...new Set(errors)].join(' | ')}`);
  piece.errors = [...new Set(errors)];
  report.push(piece);
  await ctx.close();
}
await browser.close();
await server.close();

writeFileSync(resolve(out, 'README.txt'), readme(report));
writeFileSync(resolve(out, 'report.json'), JSON.stringify(report, null, 2));
if (flag('--zip')) {
  const name = `experiments-for-posting-${new Date().toISOString().slice(0, 10)}.zip`;
  rmSync(resolve(root, name), { force: true });
  execFileSync('zip', ['-r', '-q', '-X', resolve(root, name), '.', '-x', 'report.json', '-x', '*.DS_Store'], { cwd: out });
  renameSync(resolve(root, name), resolve(out, '..', name));
  log(`zip: ${resolve(root, name)}`);
}
log('done');

function blocking(e) {
  // The colophon's typeface lines, without folder names (fonts/trial is just where trials live).
  const type = (e.colophon ?? []).filter(([k]) => /type/i.test(k)).map(([, v]) => v).join(' ').replace(/fonts\/trial\S*/gi, '');
  const notes = [];
  if (/trial/i.test(type)) notes.push('a trial typeface: trial licences allow testing, not posting. Buy a licence (or switch to the free fallback) before posting.');
  if (/personal use|free for personal/i.test(type)) notes.push('a "free for personal use" typeface: posting on social media needs the commercial licence.');
  return notes;
}

function credits(e, views, piece) {
  const lines = [`${e.number} ${e.title}`, e.date ?? '', ''];
  for (const [k, v] of e.colophon ?? []) lines.push(`${k}: ${v}`);
  lines.push('', 'Before posting:');
  const b = blocking(e);
  lines.push(...(b.length ? b.map((x) => `- ${x}`) : ['- nothing blocks posting: every typeface and source used here is free to publish.']));
  lines.push('', 'Files, in carousel order:');
  for (const [i, v] of views.entries()) {
    const row = piece.views[i];
    lines.push(`${nn(i + 1)} ${v.id}.png  ${v.label}. ${v.note ?? ''}${row?.video ? `\n   ${nn(i + 1)} ${v.id}-1080.mp4 / -2160.mp4  moving: ${row.video}` : ''}`);
  }
  lines.push('all-views.png  every view in one grid.');
  return lines.join('\n') + '\n';
}

function readme(report) {
  const L = [
    'Experiments, ready to post',
    '',
    'One folder per piece, numbered as in the gallery. In each:',
    '- NN <view>.png: every view at 2160 x 2160 px, in carousel order (01 is the hero).',
    '- NN <view>-1080.mp4: moving views, H.264 at 1080 x 1080 (what Instagram shows), whole loops, at least 8 s,',
    '  each frame drawn at its own moment so the loop closes exactly; set the post to loop.',
    '- NN <view>-2160.mp4: the same at 2160 x 2160, for masters and other platforms.',
    '- all-views.png: the set in one grid.',
    '- caption.txt: the caption to paste.',
    '- credits.txt: typefaces, copy and tools, and what must be licensed before posting.',
    '',
    'Before posting, these pieces use a typeface that is not licensed for posting:',
  ];
  const e = (slug) => registry.find((r) => r.slug === slug);
  const blocked = report.filter((p) => blocking(e(p.slug)).length);
  L.push(...(blocked.length ? blocked.map((p) => `- ${nn(p.number)} ${p.slug}: ${blocking(e(p.slug)).join(' ')}`) : ['- none']));
  L.push('', 'Pieces:');
  for (const p of report) L.push(`- ${nn(p.number)} ${p.slug}: ${p.views.length} views, ${p.views.filter((v) => v.video).length} moving`);
  return L.join('\n') + '\n';
}
