const { app, BrowserWindow } = require("electron");
const { writeFileSync } = require("node:fs");
const [url, out] = process.argv.slice(-2);
// The hidden window's profile goes in the system temp folder, never the repository (its cache and storage are browser state).
app.setPath("userData", require("node:path").join(require("node:os").tmpdir(), "area-feed-kit-capture"));
app.whenReady().then(async () => {
  const win = new BrowserWindow({ width: 1440, height: 900, show: false, paintWhenInitiallyHidden: true, webPreferences: { backgroundThrottling: false } });
  await win.loadURL(url);
  await new Promise(r => setTimeout(r, 8000));
  const data = await win.webContents.executeJavaScript(`(async () => {
    const body = document.querySelector('.studio-canvas__body');
    for (let y = 0; y < body.scrollHeight; y += 600) { body.scrollTop = y; await new Promise(r => setTimeout(r, 150)); }
    body.scrollTop = 0; await new Promise(r => setTimeout(r, 800));
    // A select's choice is a property, not markup: mark each chosen option, so the still shows what the app shows.
    body.querySelectorAll('select').forEach(select => [...select.options].forEach(option => option.toggleAttribute('selected', option.selected)));
    const clone = body.cloneNode(true);
    let n = 0; clone.querySelectorAll('.studio-images img').forEach(img => { img.setAttribute('data-kit-art', String(n++)); img.removeAttribute('src'); img.removeAttribute('srcset'); });
    const html = [...document.documentElement.attributes].map(a => [a.name, a.value]);
    clone.querySelectorAll('img[src]').forEach(img => img.setAttribute('src', img.src)); const sections = [...body.querySelectorAll('.studio-feed > .studio-section')].map(s => [s.id, s.querySelector('[id$="-title"]')?.textContent?.trim()]);
    return JSON.stringify({ html, body: clone.outerHTML, sections, width: body.clientWidth });
  })()`);
  writeFileSync(out, data);
  console.log("saved", data.length);
  app.quit();
});
