// Renders capital letters and figures from installed typefaces into PNG sheets plus metrics,
// so a review page can show trial typefaces as images without shipping the font files
// (trial licences allow testing and pitching, not distribution).
//
//   node scripts/glyph-sheets.mjs <out dir>
//
// Uses an installed Chromium browser (Edge or Chrome), headless, as a guest.
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

const out = resolve(process.argv[2] ?? 'glyph-sheets');
const only = process.argv.slice(3); // optional: just these ids
mkdirSync(out, { recursive: true });
const HOME = homedir();
const LIB = `${HOME}/Library/Fonts`;
const ST = `${HOME}/Downloads/Schick Toikka Library Trial`;
const TRIAL = resolve(import.meta.dirname, '../fonts/trial');

// The candidates: [id, name, foundry, role, file, weight, licence]
export const FACES = [
  ['tiempos-italic', 'Tiempos Text Italic', 'Klim Type Foundry', 'Italic serif', `${LIB}/TestTiemposTextVF-Italic.ttf`, 400, 'Trial'],
  ['signifier-italic', 'Signifier Italic', 'Klim Type Foundry', 'Italic serif', `${LIB}/TestSignifierVF-Italic.ttf`, 300, 'Trial'],
  ['martina-italic', 'Martina Plantijn Italic', 'Klim Type Foundry', 'Italic serif', `${LIB}/TestMartinaPlantijnVF-Italic.ttf`, 400, 'Trial'],
  ['reckless-italic', 'Reckless Italic', 'Displaay', 'Italic serif', `${TRIAL}/RecklessItalicCollectionVF-TRIAL.ttf`, 400, 'Trial'],
  ['edict-italic', 'Edict Display Italic', 'Schick Toikka', 'Italic serif', `${LIB}/EdictDisplayTrial-RegularItalic.otf`, 400, 'Trial'],
  ['right-serif-mono-italic', 'Right Serif Mono Italic', 'Pangram Pangram', 'Italic serif, mono', `${LIB}/PPRightSerifMono-RegularItalic.otf`, 400, 'Free for personal use'],
  ['sohne-schmal', 'Söhne Schmal', 'Klim Type Foundry', 'Condensed sans', `${LIB}/TestSöhneSchmal-Buch.otf`, 400, 'Trial'],
  ['lateral-condensed', 'Lateral Condensed', 'Schick Toikka', 'Condensed sans', `${ST}/Lateral Trial/LateralTrial-CondensedRegular.otf`, 400, 'Trial'],
  ['serrif-compressed', 'Serrif Compressed', 'Displaay', 'Compressed serif', `${HOME}/Downloads/DP_trial-d2f56646-4044-4baa-9c23-a6d5d67d7aeb/Serrif Collection/Serrif Compressed/Desktop package (OTF, TTF)/OTF/SerrifCompressed-TRIAL-Regular.otf`, 400, 'Trial'],
  ['sohne-mono', 'Söhne Mono', 'Klim Type Foundry', 'Mono', `${LIB}/TestSöhneMono-Buch.otf`, 400, 'Trial'],
  ['sohne-mono-extraleicht', 'Söhne Mono Extraleicht', 'Klim Type Foundry', 'Mono', `${LIB}/TestSöhneMono-Extraleicht.otf`, 400, 'Trial'],
  ['sohne-mono-leicht', 'Söhne Mono Leicht', 'Klim Type Foundry', 'Mono', `${LIB}/TestSöhneMono-Leicht.otf`, 400, 'Trial'],
  ['sohne-mono-kraeftig', 'Söhne Mono Kräftig', 'Klim Type Foundry', 'Mono', `${LIB}/TestSöhneMono-Kräftig.otf`, 400, 'Trial'],
  ['areal-mono', 'ABC Areal Mono', 'Dinamo', 'Mono', `${LIB}/ABCArealMonoVariable.ttf`, 400, 'Trial'],
  ['scto-grotesk', 'Scto Grotesk A', 'Schick Toikka', 'Grotesk', `${LIB}/SctoGroteskATrial-Regular.otf`, 400, 'Trial'],
  ['saans', 'Saans', 'Displaay', 'Grotesk', `${LIB}/SaansCollectionVF-TRIAL.ttf`, 400, 'Trial'],
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const SIZE = 128;

const browsers = [process.env.CHROME_PATH, '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
const executablePath = browsers.find((p) => existsSync(p));
const browser = await chromium.launch({ executablePath, headless: true, args: ['--guest', '--disable-features=msImplicitSignin'] });
const page = await browser.newPage();
await page.setContent('<!doctype html><body></body>');

const index = [];
for (const [id, name, foundry, role, file, weight, licence] of FACES) {
  if (only.length && !only.includes(id)) continue;
  if (!existsSync(file)) {
    console.log(`skip ${id}: ${file} not found`);
    continue;
  }
  const b64 = readFileSync(file).toString('base64');
  const res = await page.evaluate(
    async ({ id, b64, weight, CHARS, SIZE }) => {
      const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      const face = new FontFace(`F-${id}`, bytes.buffer, { weight: String(weight) });
      await face.load();
      document.fonts.add(face);
      const font = `${weight} ${SIZE}px "F-${id}"`;
      const m = document.createElement('canvas').getContext('2d');
      m.font = font;
      const pad = 3;
      const glyphs = {};
      let x = 0;
      let top = 0, bottom = 0;
      for (const ch of CHARS) {
        const t = m.measureText(ch);
        const l = -t.actualBoundingBoxLeft, r = t.actualBoundingBoxRight, a = t.actualBoundingBoxAscent, d = t.actualBoundingBoxDescent;
        top = Math.max(top, a);
        bottom = Math.max(bottom, d);
        const w = Math.ceil(r - l) + pad * 2;
        glyphs[ch] = { x, w, l: l - pad, adv: t.width, a: a + pad, d: d + pad };
        x += w + 2;
      }
      const H = Math.ceil(top + bottom) + pad * 2;
      const c = document.createElement('canvas');
      c.width = x;
      c.height = H;
      const g = c.getContext('2d');
      g.font = font;
      g.fillStyle = '#fff';
      g.textBaseline = 'alphabetic';
      const base = Math.ceil(top) + pad;
      for (const ch of CHARS) {
        const gl = glyphs[ch];
        g.fillText(ch, gl.x - gl.l, base);
        gl.y = base - gl.a;
        gl.h = Math.ceil(gl.a + gl.d);
      }
      const cap = m.measureText('H').actualBoundingBoxAscent;
      // Stem: the first run of ink across H, a third of the way down.
      const t = document.createElement('canvas');
      t.width = SIZE * 2;
      t.height = SIZE * 2;
      const tg = t.getContext('2d');
      tg.font = font;
      tg.fillStyle = '#fff';
      tg.fillText('H', SIZE * 0.25, SIZE * 1.5);
      const row = tg.getImageData(0, Math.round(SIZE * 1.5 - cap * 0.7), t.width, 1).data;
      let run = 0, stem = 0;
      for (let i = 0; i < t.width; i++) {
        const a = row[i * 4 + 3] / 255;
        if (a > 0.02) run += a;
        else if (run) {
          stem = run;
          break;
        }
      }
      return { png: c.toDataURL('image/png'), glyphs, cap, size: SIZE, stem };
    },
    { id, b64, weight, CHARS, SIZE },
  );
  writeFileSync(resolve(out, `${id}.png`), Buffer.from(res.png.split(',')[1], 'base64'));
  index.push({ id, name, foundry, role, licence, png: `glyphs/${id}.png`, size: res.size, cap: res.cap, stem: res.stem, glyphs: res.glyphs });
  console.log(`${id}  cap ${res.cap.toFixed(1)}  stem ${res.stem.toFixed(1)}`);
}
writeFileSync(resolve(out, 'faces.json'), JSON.stringify(index));
await browser.close();
