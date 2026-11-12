// Captures a still of each experiment for the gallery: public/thumbs/<slug>.jpg.
//
//   npm run thumbs              every experiment
//   npm run thumbs 003 005      only these numbers
//
// Loads each page with ?thumb (frame hidden) at its ratio from experiments.json, waits `at`
// seconds, and screenshots. Uses an installed Chromium browser (Edge or Chrome), headless,
// as a guest with a throwaway profile.
import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const registry = JSON.parse(readFileSync(resolve(root, 'experiments.json'), 'utf8'));
const only = process.argv.slice(2);
const list = only.length ? registry.filter((e) => only.some((n) => e.slug.startsWith(n))) : registry;

const browsers = [
  process.env.CHROME_PATH,
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].filter(Boolean);
const executablePath = browsers.find((p) => existsSync(p));
if (!executablePath) throw new Error('No Chromium browser found. Set CHROME_PATH.');

const server = await createServer({ root, configFile: resolve(root, 'vite.config.js'), server: { port: 5199, strictPort: false }, logLevel: 'error' });
await server.listen();
const base = server.resolvedUrls.local[0];

const browser = await chromium.launch({
  executablePath,
  headless: true,
  // --guest and no implicit sign-in keep Edge out of any real account.
  args: ['--guest', '--disable-features=msImplicitSignin', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--hide-scrollbars'],
});

const LONG = 1200; // long side, px
for (const e of list) {
  const [w, h] = e.ratio.split('/').map(Number);
  const viewport = w >= h ? { width: LONG, height: Math.round((LONG * h) / w) } : { width: Math.round((LONG * w) / h), height: LONG };
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto(`${base}e/${e.slug}/?thumb`, { waitUntil: 'networkidle' });
  await page.waitForTimeout((e.at ?? 2) * 1000);
  const path = resolve(root, 'public/thumbs', `${e.slug}.jpg`);
  await page.screenshot({ path, type: 'jpeg', quality: 88 });
  console.log(`${e.slug}  ${viewport.width}×${viewport.height}${errors.length ? `  errors: ${errors.join('; ')}` : ''}`);
  await page.close();
}

await browser.close();
await server.close();
