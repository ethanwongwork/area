// Screenshots a page: node scripts/shot.mjs <url> <out.png> [width] [height]; SCHEME=dark, DPR=2, CLICK=<selector,...>
import { chromium } from 'playwright-core';

const [url, out, w = 1440, h = 1000] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  headless: true,
  args: ['--guest', '--disable-features=msImplicitSignin'],
});
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: Number(process.env.DPR ?? 1), colorScheme: process.env.SCHEME ?? 'light' });
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto(url);
await page.waitForTimeout(800);
for (const sel of (process.env.CLICK ?? '').split(',').filter(Boolean)) await page.click(sel);
await page.waitForTimeout(Number(process.env.WAIT ?? 200));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
