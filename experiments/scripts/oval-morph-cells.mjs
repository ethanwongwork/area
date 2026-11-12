// Samples the glyphs for 6 Oval Morph: e/oval-morph/cells.json, a 24 × 24 cell grid per glyph.
// Run with the dev server up: node scripts/oval-morph-cells.mjs [base url, default http://localhost:5190]
// Needs fonts/trial/Geist-VariableFont_wght.ttf (Geist, SIL Open Font License).
//
// Geist glyphs (OFL) at ONE size, each centred on its own ink in both directions: the scale fits
// the widest glyph across the usable width and the tallest in the usable height. Cells: [x, y, v 0–9, angle 0–35, coherence 0–9].
import { chromium } from 'playwright-core';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';
const SEQ = ['g', 'Ж', 'W', '∞', '&', 'ß', 'R', '∂', '@', 'Ѫ', 'q', '¶', '8', 'Ω', '?', '₴', 'm', 'Ю', 'Q', '∫', 'a', 'Þ', '%', 'λ', 'G', '❸', 'y', '§', 'M', '√', '$', 'Ф', '☺', 'ð', '∑', 'Ø', '#', 'Я', '₪', 'Щ'];
const N = 24, K = 4, MX = 1.2, MY = 1.2; // usable area: N − 2·MX wide, N − 2·MY tall
const browser = await chromium.launch({ executablePath: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', headless: true, args: ['--guest', '--disable-features=msImplicitSignin'] });
const page = await browser.newPage();
await page.goto(`${process.argv[2] ?? 'http://localhost:5190'}/e/grid-glyphs/?thumb`, { waitUntil: 'networkidle' });
const out = await page.evaluate(async ({ SEQ, N, K, MX, MY }) => {
  const { loadGlyphFont, trialFiles } = await import('/src/glyphs.js');
  const gf = await loadGlyphFont(trialFiles().find((f) => /^Geist-Variable/.test(f.name)).url);
  const F = N * K, P = 4; // P: canvas px per fine cell
  const id = (ch) => gf.font.glyphForCodePoint(ch.codePointAt(0)).id;
  // One scale for both weights, from the bold set.
  const B = SEQ.map((ch) => gf.get(id(ch), { wght: 800 }).bbox);
  const tall = Math.max(...B.map((b) => b.maxY - b.minY)), wide = Math.max(...B.map((b) => b.maxX - b.minX));
  const s = Math.min((N - 2 * MX) / wide, (N - 2 * MY) / tall); // cells per font unit
  const baseline = 0;
  const cv = new OffscreenCanvas(F * P, F * P), x = cv.getContext('2d', { willReadFrequently: true });
  const res = { scale: s, baseline, capCells: 710 * s };
  for (const w of [400, 800]) {
    res[w] = SEQ.map((ch) => {
      const g = gf.get(id(ch), { wght: w }), b = g.bbox;
      x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height);
      const u = K * P; // canvas px per coarse cell
      x.translate((N / 2) * u, (N / 2) * u);
      x.scale(s * u, -s * u);
      x.translate(-(b.minX + b.maxX) / 2, -(b.minY + b.maxY) / 2);
      x.fillStyle = '#000'; x.fill(g.path);
      const d = x.getImageData(0, 0, cv.width, cv.height).data;
      const fine = new Float32Array(F * F);
      for (let fy = 0; fy < F; fy++) for (let fx = 0; fx < F; fx++) {
        let sum = 0;
        for (let py = fy * P; py < fy * P + P; py++) for (let px = fx * P; px < fx * P + P; px++) sum += d[(py * cv.width + px) * 4 + 3];
        fine[fy * F + fx] = sum / (P * P * 255);
      }
      const c = (X, Y) => (X < 0 || Y < 0 || X >= F || Y >= F ? 0 : fine[Y * F + X]);
      const pts = [];
      for (let cy = 0; cy < N; cy++) for (let cx = 0; cx < N; cx++) {
        let sum = 0;
        for (let y = 0; y < K; y++) for (let xx = 0; xx < K; xx++) sum += c(cx * K + xx, cy * K + y);
        const v = Math.round((sum / (K * K)) * 9);
        if (v < 1) continue;
        let a2 = 0, b2 = 0, ab = 0;
        const x0 = cx * K + K / 2, y0 = cy * K + K / 2, R = K * 1.5;
        for (let y = Math.floor(y0 - R); y < y0 + R; y++) for (let xx = Math.floor(x0 - R); xx < x0 + R; xx++) {
          const d2 = ((xx + 0.5 - x0) ** 2 + (y + 0.5 - y0) ** 2) / (R * R);
          if (d2 > 1) continue;
          const wt = 1 - d2, gx = c(xx + 1, y) - c(xx - 1, y), gy = c(xx, y + 1) - c(xx, y - 1);
          a2 += wt * gx * gx; b2 += wt * gy * gy; ab += wt * gx * gy;
        }
        const tr = a2 + b2, coh = tr > 1e-6 ? Math.sqrt((a2 - b2) ** 2 + 4 * ab * ab) / tr : 0;
        let ang = 0.5 * Math.atan2(2 * ab, a2 - b2) + Math.PI / 2;
        ang = ((ang % Math.PI) + Math.PI) % Math.PI;
        pts.push(cx, cy, v, Math.round(ang / (Math.PI / 36)) % 36, Math.round(coh * Math.min(1, tr / 0.6) * 9));
      }
      return pts;
    });
  }
  return res;
}, { SEQ, N, K, MX, MY });
await browser.close();
const data = { N, seq: SEQ, light: out[400], bold: out[800] };
writeFileSync(resolve(import.meta.dirname, '../e/oval-morph/cells.json'), JSON.stringify(data));
console.log('scale', out.scale.toFixed(4), 'cap height cells', out.capCells.toFixed(1));
