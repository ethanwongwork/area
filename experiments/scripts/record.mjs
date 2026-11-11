// Records a piece's canvas as video, in real time, with the browser's own encoder.
//
//   node scripts/record.mjs <url> <out file, .mp4 or .webm> <seconds> [width] [height]
//
// Loads the page frameless (?thumb), starts it playing (the piece exposes play() on a
// window.__<name> handle with its canvas), and records canvas.captureStream at 60 fps.
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';

const [url, out, seconds = 6, w = 900, h = 1200] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  headless: true,
  args: ['--guest', '--disable-features=msImplicitSignin', '--hide-scrollbars', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto(url);
await page.waitForFunction(() => Object.keys(window).some((k) => k.startsWith('__') && window[k]?.canvas));
const result = await page.evaluate(async (ms) => {
  const handle = Object.values(window).find((v) => v && v.canvas instanceof HTMLCanvasElement && typeof v.play === 'function');
  const types = ['video/mp4;codecs=avc1.640028', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
  const mimeType = types.find((t) => MediaRecorder.isTypeSupported(t));
  const rec = new MediaRecorder(handle.canvas.captureStream(60), { mimeType, videoBitsPerSecond: 6e6 });
  const chunks = [];
  rec.ondataavailable = (e) => chunks.push(e.data);
  const done = new Promise((r) => (rec.onstop = r));
  handle.play();
  rec.start();
  await new Promise((r) => setTimeout(r, ms));
  rec.stop();
  await done;
  const buf = new Uint8Array(await new Blob(chunks, { type: mimeType }).arrayBuffer());
  let bin = '';
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return { mimeType, data: btoa(bin) };
}, Number(seconds) * 1000);
const file = result.mimeType.includes('mp4') ? out.replace(/\.\w+$/, '.mp4') : out.replace(/\.\w+$/, '.webm');
writeFileSync(file, Buffer.from(result.data, 'base64'));
console.log(file, result.mimeType, `${(Buffer.from(result.data, 'base64').length / 1e6).toFixed(1)} MB`);
await browser.close();
