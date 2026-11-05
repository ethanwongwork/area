// Measures the Workspace screen as the browser draws it: Electron loads screen.html at a device pixel ratio, then reports
// boxes off the device-pixel grid, stroke widths in device pixels, text's cap centre against its control, and shadows.
// Usage: electron measure.cjs <screen.html> <dpr> <out-prefix> [query]
const { app, BrowserWindow } = require("electron");
const { writeFileSync } = require("node:fs");
const [file, dpr, out, query = ""] = process.argv.slice(process.argv.findIndex(a => a.endsWith("measure.cjs")) + 1);
app.commandLine.appendSwitch("force-device-scale-factor", dpr);
app.setPath("userData", require("node:path").join(require("node:os").tmpdir(), "area-fidelity"));
app.whenReady().then(main).catch(e => { console.error(e); app.exit(1); });
async function main() {
  const win = new BrowserWindow({ width: 1920, height: 1080, show: false, paintWhenInitiallyHidden: true, useContentSize: true, webPreferences: { backgroundThrottling: false } });
  await win.loadURL("file://" + file + (query ? "?" + query : ""));
  await new Promise(r => setTimeout(r, 3000));
  const data = await win.webContents.executeJavaScript(`(() => {
    const dpr = devicePixelRatio, off = v => Math.abs(v * dpr - Math.round(v * dpr)) > 0.02;
    const root = document.querySelector('.ws-window');
    const all = [...root.querySelectorAll('*')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
    const name = el => el.className && typeof el.className === 'string' ? el.className.split(' ').filter(c => c.startsWith('area-') || c.startsWith('ws-'))[0] || el.tagName.toLowerCase() : el.tagName.toLowerCase();
    // 1. Painted boxes (a fill, an edge or a shadow) whose edges fall between device pixels.
    const painted = all.filter(el => { const s = getComputedStyle(el); return parseFloat(s.borderTopWidth) > 0 || parseFloat(s.borderBottomWidth) > 0 || s.boxShadow !== 'none' || (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent'); });
    const offGrid = painted.filter(el => { const r = el.getBoundingClientRect(); return off(r.left) || off(r.top) || off(r.right) || off(r.bottom); });
    const offByClass = {}; offGrid.forEach(el => { const n = name(el); offByClass[n] = (offByClass[n] || 0) + 1; });
    const offSamples = offGrid.slice(0, 400).map(el => { const r = el.getBoundingClientRect(); return [name(el), +r.left.toFixed(3), +r.top.toFixed(3), +r.width.toFixed(3), +r.height.toFixed(3)]; });
    // 2. Strokes, in device pixels.
    const strokes = {}; painted.forEach(el => { const s = getComputedStyle(el); for (const side of ['Top','Bottom','Left','Right']) { const w = parseFloat(s['border' + side + 'Width']); if (w > 0) { const k = (w * dpr).toFixed(2); strokes[k] = (strokes[k] || 0) + 1; } } });
    // inset box-shadow strokes (Area draws many edges as inset shadows)
    const shadows = {}; painted.forEach(el => { const v = getComputedStyle(el).boxShadow; if (v !== 'none') shadows[v] = (shadows[v] || []).concat(name(el)); });
    // 3. Text: each control-sized element with its own text, the cap's centre against its box's centre.
    const ctx = document.createElement('canvas').getContext('2d');
    const caps = [];
    all.forEach(el => {
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      if (!own) return;
      const s = getComputedStyle(el), r = el.getBoundingClientRect();
      ctx.font = s.fontWeight + ' ' + s.fontSize + ' ' + s.fontFamily;
      const m = ctx.measureText('H');
      const range = document.createRange(); range.selectNodeContents(el); const lines = [...range.getClientRects()]; if (!lines.length) return;
      const line = lines[0], lh = parseFloat(s.lineHeight) || line.height;
      const fa = m.fontBoundingBoxAscent, fd = m.fontBoundingBoxDescent, cap = m.actualBoundingBoxAscent;
      const baseline = line.top + (line.height - (fa + fd)) / 2 + fa;
      const capMid = baseline - cap / 2;
      // its control: the nearest ancestor (or itself) with a painted box under 48 tall
      let box = el; while (box && box !== root) { const bs = getComputedStyle(box), br = box.getBoundingClientRect(); if (br.height <= 48 && br.height >= 16 && (bs.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(bs.borderTopWidth) > 0 || bs.boxShadow !== 'none')) break; box = box.parentElement; }
      const font = { size: s.fontSize, line: s.lineHeight, weight: s.fontWeight, baselineFrac: +((baseline * dpr) % 1).toFixed(2) };
      if (box && box !== root) { const br = box.getBoundingClientRect(); caps.push({ text: el.textContent.trim().slice(0, 24), el: name(el), box: name(box), boxH: +br.height.toFixed(2), offset: +(capMid - (br.top + br.height / 2)).toFixed(2), ...font }); }
      else caps.push({ text: el.textContent.trim().slice(0, 24), el: name(el), box: null, ...font });
    });
    const sizes = {}; caps.forEach(c => { const k = c.size + '/' + c.line + ' ' + c.weight; sizes[k] = (sizes[k] || 0) + 1; });
    // 4. Computed lengths that are not whole pixels (gaps, paddings, radii) on painted boxes.
    const frac = {}; painted.forEach(el => { const s = getComputedStyle(el); for (const p of ['paddingTop','paddingLeft','rowGap','columnGap','borderTopLeftRadius','height']) { const v = parseFloat(s[p]); if (v && Math.abs(v - Math.round(v)) > 0.01) { const k = p + ' ' + v.toFixed(2); frac[k] = (frac[k] || 0) + 1; } } });
    return JSON.stringify({ dpr, elements: all.length, painted: painted.length, offGrid: offGrid.length, offByClass, offSamples, strokes, shadows: Object.entries(shadows).map(([v, els]) => [v, els.length, [...new Set(els)].slice(0, 6)]), caps, sizes, frac });
  })()`);
  writeFileSync(out + ".json", data);
  const img = await win.webContents.capturePage();
  writeFileSync(out + ".png", img.toPNG());
  app.quit();
}
