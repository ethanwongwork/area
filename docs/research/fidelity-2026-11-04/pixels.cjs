// Prints a column (or row) of grey levels from a capture. Usage: electron pixels.cjs <png> col <x> <y0> <y1> | row <y> <x0> <x1>
const { app, nativeImage } = require("electron");
const a = process.argv.slice(process.argv.findIndex(v => v.endsWith("pixels.cjs")) + 1);
app.whenReady().then(() => {
  const img = nativeImage.createFromPath(a[0]); const { width } = img.getSize(); const buf = img.toBitmap();
  const at = (x, y) => { const i = (y * width + x) * 4; return Math.round((buf[i] + buf[i + 1] + buf[i + 2]) / 3); };
  const [kind, p, s, e] = [a[1], +a[2], +a[3], +a[4]];
  const out = []; for (let t = s; t <= e; t++) out.push(kind === "col" ? at(p, t) : at(t, p));
  console.log(out.join(" ")); app.quit();
});
