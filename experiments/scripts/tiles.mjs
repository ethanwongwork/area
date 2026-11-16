// Screenshots each `.glyph svg` on a page, one PNG per tile: node scripts/tiles.mjs <url> <out prefix>
import { chromium } from 'playwright-core';

const [url, out] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  headless: true,
  args: ['--guest', '--disable-features=msImplicitSignin'],
});
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: Number(process.env.DPR ?? 1), colorScheme: process.env.SCHEME ?? 'light' });
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto(url);
await page.waitForTimeout(800);
const els = await page.$$('.glyph svg');
for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: `${out}-${i}.png` });
await browser.close();
