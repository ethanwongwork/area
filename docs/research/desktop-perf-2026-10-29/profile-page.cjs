// CPU-profiles one page switch of the desktop app in a hidden Electron window and prints where the time went:
//   electron profile-page.cjs <dist dir> <hash> [from-hash]
// The profiler is Chromium's, reached through Electron's own webContents.debugger (no debugging port). Self time is grouped
// by function and by source line in app.js (an unminified dev build keeps the names).
const { app, BrowserWindow } = require("electron");
const { join } = require("node:path");

const [dir, hash, from = "#typography"] = process.argv.slice(2).filter(arg => !arg.startsWith("--"));

app.on("window-all-closed", () => {});
app.whenReady().then(async () => {
  const window = new BrowserWindow({ show: false, width: 1440, height: 900, webPreferences: { partition: "profile", backgroundThrottling: false, contextIsolation: true, sandbox: true } });
  await window.loadFile(join(dir, "index.html"), { hash: from.slice(1) }).catch(() => {});
  const run = code => window.webContents.executeJavaScript(code);
  await run(`(async () => { for (let i = 0; i < 400 && !document.querySelector('.studio'); i++) await new Promise(r => setTimeout(r, 25)); await new Promise(r => setTimeout(r, 1500)); })()`);
  const dbg = window.webContents.debugger;
  dbg.attach("1.3");
  await dbg.sendCommand("Profiler.enable");
  await dbg.sendCommand("Profiler.setSamplingInterval", { interval: 200 });
  await dbg.sendCommand("Profiler.start");
  const took = await run(`(async () => {
    const tick = () => new Promise(r => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });
    const t0 = performance.now();
    location.hash = ${JSON.stringify(hash)};
    for (let n = 0; n < 100000; n++) { await tick(); if (location.hash !== ${JSON.stringify(hash)}) break; }
    void document.body.offsetHeight;
    return Math.round(performance.now() - t0);
  })()`);
  const { profile } = await dbg.sendCommand("Profiler.stop");
  dbg.detach();

  // Self time per node: samples × interval.
  const byId = new Map(profile.nodes.map(node => [node.id, node]));
  const counts = new Map();
  for (const id of profile.samples) counts.set(id, (counts.get(id) ?? 0) + 1);
  const dt = (profile.endTime - profile.startTime) / 1000 / profile.samples.length;
  const byFn = new Map(), byLine = new Map();
  let total = 0;
  for (const [id, n] of counts) {
    const frame = byId.get(id).callFrame;
    const ms = n * dt;
    total += ms;
    const name = frame.functionName || "(anonymous)";
    const where = `${frame.url.split("/").pop()}:${frame.lineNumber + 1}`;
    byFn.set(name, (byFn.get(name) ?? 0) + ms);
    byLine.set(`${name} @ ${where}`, (byLine.get(`${name} @ ${where}`) ?? 0) + ms);
  }
  // Inclusive time for app functions: walk parents.
  const parent = new Map();
  for (const node of profile.nodes) for (const child of node.children ?? []) parent.set(child, node.id);
  const inclusive = new Map();
  for (const [id, n] of counts) {
    const seen = new Set();
    for (let at = id; at !== undefined; at = parent.get(at)) {
      const frame = byId.get(at).callFrame;
      if (!frame.url.endsWith("app.js")) continue;
      const key = `${frame.functionName || "(anonymous)"} @ ${frame.lineNumber + 1}`;
      if (seen.has(key)) continue;
      seen.add(key);
      inclusive.set(key, (inclusive.get(key) ?? 0) + n * dt);
    }
  }
  const top = (map, count) => [...map].sort((a, b) => b[1] - a[1]).slice(0, count).map(([k, v]) => `  ${v.toFixed(0).padStart(6)} ms  ${k}`).join("\n");
  console.log(`${hash}: ${took} ms to commit; ${total.toFixed(0)} ms sampled\n\nSelf time by function:\n${top(byFn, 25)}\n\nSelf time by line:\n${top(byLine, 15)}\n\nInclusive time, app functions:\n${top(inclusive, 40)}`);
  app.quit();
});
