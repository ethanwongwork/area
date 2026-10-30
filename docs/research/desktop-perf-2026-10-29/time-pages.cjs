// Times the desktop app's page switches in a hidden Electron window, for each built renderer folder given:
//   electron time-pages.cjs <label>=<dist dir>   (one build per run; INJECT=<css> tries a candidate rule)
// Each run gets its own in-memory session (nothing saved, nothing read from the app's data), no preload (so the app keeps
// its systems in that session's storage), and background throttling off so the hidden window keeps working.
const { app, BrowserWindow } = require("electron");
const { join } = require("node:path");

const runs = process.argv.slice(2).filter(arg => arg.includes("=")).map(arg => arg.split("="));
const HASHES = ["#typography", "#icons", "#color", "#testing", "#theme", "#components", "#components/button", "#home"];

const measure = `(async () => {
  const tick = () => new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });
  const label = () => document.querySelector('.studio-canvas')?.getAttribute('aria-label');
  for (let i = 0; i < 400 && !document.querySelector('.studio'); i++) await new Promise(r => setTimeout(r, 25));
  await new Promise(r => setTimeout(r, 1500));
  const out = {};
  for (let round = 0; round < 3; round++) for (const h of ${JSON.stringify(HASHES)}) {
    const t0 = performance.now();
    location.hash = h;
    // Committed: the app rewrites an old link to its place's own hash in an effect after the page renders (#home keeps
    // its hash, so its Canvas's name says it).
    let n = 0;
    for (; n < 100000; n++) { await tick(); if (h === '#home' ? label() === 'Home' : location.hash !== h) break; }
    void document.body.offsetHeight;
    (out[h] ??= []).push(n >= 100000 ? -1 : Math.round(performance.now() - t0));
    await new Promise(r => setTimeout(r, 200));
  }
  // One setting: the first two-way switch in the Inspector's Theme view, on Components, flipped and back.
  location.hash = '#components';
  for (let i = 0; i < 20; i++) await tick();
  await new Promise(r => setTimeout(r, 500));
  const group = [...document.querySelectorAll('.studio-inspector [role=radiogroup]')].find(g => /Buttons/.test(g.getAttribute('aria-label') || '') || /Buttons/.test(g.closest('.area-field, [class*=row]')?.textContent || ''));
  const setting = [];
  for (let i = 0; i < 4 && group; i++) {
    const target = [...group.querySelectorAll('[role=radio]')].find(r => r.getAttribute('aria-checked') !== 'true');
    const t0 = performance.now();
    target.click();
    for (let n = 0; n < 20; n++) await tick();
    void document.body.offsetHeight;
    setting.push(Math.round(performance.now() - t0));
  }
  return { out, setting };
})()`;

app.whenReady().then(async () => {
  for (const [labelName, dir] of runs) {
    const window = new BrowserWindow({ show: false, width: 1440, height: 900, webPreferences: { partition: `perf-${labelName}`, backgroundThrottling: false, contextIsolation: true, sandbox: true } });
    const t0 = Date.now();
    // The app rewrites the hash as it starts (an old link to its place), which Electron can report as a failed load.
    await window.loadFile(join(dir, "index.html"), { hash: "components" }).catch(() => {});
    const loaded = Date.now() - t0;
    // INJECT: CSS to try (a candidate fix), added before measuring.
    if (process.env.INJECT) await window.webContents.insertCSS(process.env.INJECT);
    const result = await window.webContents.executeJavaScript(measure).catch(error => ({ out: {}, setting: [], error: String(error) }));
    if (result.error) console.log(labelName, result.error);
    const median = list => [...list].sort((a, b) => a - b)[Math.floor(list.length / 2)];
    console.log(`\n${labelName}  (load ${loaded} ms)`);
    for (const [hash, times] of Object.entries(result.out)) console.log(`  ${hash.padEnd(20)} median ${String(median(times)).padStart(5)} ms   [${times.join(", ")}]`);
    console.log(`  setting change       median ${String(median(result.setting)).padStart(5)} ms   [${result.setting.join(", ")}]`);
    window.destroy();
  }
  app.quit();
});
