/**
 * The Preview (owner, 2026-11-10: "Yes, build preview"; docs/research/desktop-app-analysis-2026-11-10, T2): the
 * project's own app, running on this Mac, shown on the Canvas in a <webview>, and the Choose tool that reads the
 * element a person points at so Chat can be told about it.
 *
 * Only this Mac's own addresses load (localhost, 127.0.0.1, [::1], *.localhost; http or https): the address is parsed
 * here and the guest is refused anything else, at attach and at every navigation; a link that leaves opens in the
 * browser. The guest has no preload, no Node and its own session ("preview"), so the person's app never reaches
 * Area's data and Area's page never reaches into it: everything asked of the guest is asked from here.
 *
 *   area:preview-check   an address as typed → { url } when it is one of this Mac's, and whether anything answers there
 *   area:preview-pick    turn Choose on: resolves with the element clicked (what it is, its styles, its picture), or
 *                        null when Choose is turned off or Esc is pressed in the app
 *   area:preview-cancel  turn Choose off
 *   area:preview-style   set one style on the chosen element, in the running page only; answers the element again
 *   area:preview-clear   let the chosen element go (its outline leaves)
 *   area:preview-open    open the address in the browser
 *
 * Never in a capture. `localUrl` and `PICKER` are exported for the preview test.
 */
const LOCAL = host => host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host.endsWith(".localhost");

/** An address as typed ("5173", "localhost:5173", "http://127.0.0.1:3000/shop") as a URL on this Mac, or null. */
function localUrl(text) {
  if (typeof text !== "string") return null;
  let value = text.trim();
  if (!value) return null;
  if (/^\d{2,5}$/.test(value)) value = `localhost:${value}`;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) value = `http://${value}`;
  let url;
  try { url = new URL(value); } catch { return null; }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  if (!LOCAL(url.hostname) || url.username || url.password) return null;
  return url;
}

/** The styles read from a chosen element, by the names the page asks for them. */
const STYLES = ["color", "background-color", "font-family", "font-size", "font-weight", "line-height", "letter-spacing",
  "padding", "margin", "gap", "border-radius", "border-width", "border-style", "border-color", "box-shadow", "opacity", "display"];

/**
 * What runs in the person's page. `__areaPreview.pick()` draws a frame over the element under the pointer and resolves
 * with the one clicked (the click never reaches the page), or null on Esc or `cancel()`. `describe()` is the chosen
 * element again, after a style was set. The frame is in a closed shadow root, so the page's styles never touch it and
 * it is never the element chosen. A function's source, so the test can read it and the page gets it as it is.
 */
const PICKER = String(function install(STYLES) {
  if (window.__areaPreview) return;
  const host = document.createElement("area-preview-frame");
  host.style.cssText = "all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;";
  const root = host.attachShadow({ mode: "closed" });
  const hover = document.createElement("div"), held = document.createElement("div");
  const frame = "position: fixed; box-sizing: border-box; pointer-events: none; display: none; border-radius: 2px;";
  hover.style.cssText = `${frame} outline: 1px solid #0d6efd; background: rgba(13, 110, 253, 0.08);`;
  held.style.cssText = `${frame} outline: 2px solid #0d6efd;`;
  root.append(hover, held);
  const place = (box, element) => {
    if (!element || !element.isConnected) { box.style.display = "none"; return; }
    const rect = element.getBoundingClientRect();
    box.style.display = "block";
    box.style.left = `${rect.left}px`; box.style.top = `${rect.top}px`; box.style.width = `${rect.width}px`; box.style.height = `${rect.height}px`;
  };
  let chosen = null, done = null, over = null;
  const mount = () => { if (!host.isConnected) document.documentElement.append(host); };
  // A React component's name and source, where a development build keeps them on the element.
  const component = element => {
    const key = Object.keys(element).find(name => name.startsWith("__reactFiber$"));
    let fiber = key ? element[key] : null, source = null, name = null;
    for (let depth = 0; fiber && depth < 40 && !name; depth++, fiber = fiber.return) {
      if (!source && fiber._debugSource) source = fiber._debugSource;
      const type = fiber.type;
      if (typeof type === "function" || (type && typeof type === "object" && (type.displayName || type.render))) {
        name = type.displayName || type.name || (type.render && (type.render.displayName || type.render.name)) || null;
      }
    }
    return { name: name || undefined, source: source && source.fileName ? `${source.fileName}:${source.lineNumber}` : undefined };
  };
  // A short path a person or an agent can find the element by: ids, classes, and its place among its siblings.
  const selector = element => {
    const parts = [];
    for (let node = element; node && node.nodeType === 1 && node !== document.documentElement && parts.length < 5; node = node.parentElement) {
      if (node.id) { parts.unshift(`#${CSS.escape(node.id)}`); break; }
      const classes = [...node.classList].filter(name => name.length < 40).slice(0, 2).map(name => `.${CSS.escape(name)}`).join("");
      const same = node.parentElement ? [...node.parentElement.children].filter(other => other.tagName === node.tagName) : [];
      parts.unshift(`${node.tagName.toLowerCase()}${classes}${same.length > 1 ? `:nth-of-type(${same.indexOf(node) + 1})` : ""}`);
    }
    return parts.join(" > ");
  };
  const describe = () => {
    const element = chosen;
    if (!element || !element.isConnected) return null;
    const rect = element.getBoundingClientRect(), computed = getComputedStyle(element), made = component(element);
    place(held, element);
    return {
      tag: element.tagName.toLowerCase(), id: element.id || undefined, classes: [...element.classList].slice(0, 12),
      role: element.getAttribute("role") || undefined, label: element.getAttribute("aria-label") || undefined,
      text: (element.innerText || element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 200) || undefined,
      selector: selector(element), component: made.name, source: made.source,
      rect: { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
      styles: Object.fromEntries(STYLES.map(name => [name, computed.getPropertyValue(name)])),
      page: location.pathname + location.search,
    };
  };
  const at = event => { const element = document.elementFromPoint(event.clientX, event.clientY); return element && element !== host ? element : null; };
  const move = event => { over = at(event); place(hover, over); };
  const swallow = event => { event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation(); };
  const click = event => { swallow(event); const element = at(event); if (element) { chosen = element; finish(describe()); } };
  const key = event => { if (event.key === "Escape") { swallow(event); finish(null); } };
  const follow = () => { place(held, chosen); place(hover, over); };
  const SWALLOWED = ["mousedown", "mouseup", "pointerdown", "pointerup", "dblclick", "contextmenu", "submit"];
  function finish(value) {
    removeEventListener("mousemove", move, true); removeEventListener("click", click, true); removeEventListener("keydown", key, true);
    for (const name of SWALLOWED) removeEventListener(name, swallow, true);
    document.documentElement.style.cursor = "";
    hover.style.display = "none"; over = null;
    const resolve = done; done = null;
    if (resolve) resolve(value);
  }
  addEventListener("scroll", follow, true);
  addEventListener("resize", follow);
  window.__areaPreview = {
    pick() {
      finish(null);
      mount();
      addEventListener("mousemove", move, true); addEventListener("click", click, true); addEventListener("keydown", key, true);
      for (const name of SWALLOWED) addEventListener(name, swallow, true);
      document.documentElement.style.cursor = "crosshair";
      return new Promise(resolve => { done = resolve; });
    },
    cancel() { finish(null); },
    describe,
    style(name, value) { if (chosen && chosen.isConnected) chosen.style.setProperty(name, value); return describe(); },
    clear() { chosen = null; held.style.display = "none"; },
    // The chosen element's frame leaves for its picture, and comes back after.
    frame(show) { if (show) place(held, chosen); else held.style.display = "none"; return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(true)))); },
  };
});

function register(getWindow) {
  const { app, ipcMain, net, shell } = require("electron");
  let guest = null;
  const live = () => guest && !guest.isDestroyed() ? guest : null;
  const run = async code => { const contents = live(); if (!contents) return null; try { return await contents.executeJavaScript(code, true); } catch { return null; } };
  const ready = () => run(`(${PICKER})(${JSON.stringify(STYLES)})`);
  /** The chosen element with its picture: the page's own pixels inside its box, with a little room around it. */
  const pictured = async element => {
    const contents = live();
    if (!element || !contents) return element ?? null;
    try {
      const room = 8, { x, y, width, height } = element.rect;
      if (width < 1 || height < 1) return element;
      await run("window.__areaPreview && window.__areaPreview.frame(false)");
      const image = await contents.capturePage({ x: Math.max(0, Math.round(x - room)), y: Math.max(0, Math.round(y - room)), width: Math.min(1600, Math.round(width + room * 2)), height: Math.min(1200, Math.round(height + room * 2)) });
      await run("window.__areaPreview && window.__areaPreview.frame(true)");
      return image.isEmpty() ? element : { ...element, picture: image.toDataURL() };
    } catch { return element; }
  };

  app.on("web-contents-created", (_event, contents) => {
    if (contents.getType() === "window") {
      // The guest gets nothing of Area's: no preload, no Node, its own session, and only an address on this Mac.
      contents.on("will-attach-webview", (event, preferences, params) => {
        delete preferences.preload;
        preferences.nodeIntegration = false; preferences.contextIsolation = true; preferences.sandbox = true; preferences.webSecurity = true;
        params.partition = "preview";
        if (!localUrl(params.src)) event.preventDefault();
      });
      contents.on("did-attach-webview", (_attached, attached) => { guest = attached; });
      return;
    }
    if (contents.getType() !== "webview") return;
    const leave = (event, url) => { if (!localUrl(url)) { event.preventDefault(); if (/^https?:/i.test(url)) shell.openExternal(url); } };
    contents.on("will-navigate", leave);
    contents.on("will-redirect", leave);
    contents.setWindowOpenHandler(({ url }) => { if (localUrl(url)) contents.loadURL(url); else if (/^https?:/i.test(url)) shell.openExternal(url); return { action: "deny" }; });
    contents.on("destroyed", () => { if (guest === contents) guest = null; });
  });

  ipcMain.handle("area:preview-check", async (_event, address) => {
    const url = localUrl(address);
    if (!url) return { url: null, running: false };
    // Anything that answers counts, an error page too: the app is there.
    const running = await new Promise(resolve => {
      const timer = setTimeout(() => { try { request.abort(); } catch {} resolve(false); }, 2500);
      const request = net.request({ url: url.href, method: "GET" });
      request.on("response", () => { clearTimeout(timer); try { request.abort(); } catch {} resolve(true); });
      request.on("error", () => { clearTimeout(timer); resolve(false); });
      request.end();
    });
    return { url: url.href, running };
  });
  ipcMain.handle("area:preview-pick", async () => { await ready(); return pictured(await run("window.__areaPreview.pick()")); });
  ipcMain.on("area:preview-cancel", () => { run("window.__areaPreview && window.__areaPreview.cancel()"); });
  ipcMain.handle("area:preview-style", async (_event, name, value) => {
    if (typeof name !== "string" || !STYLES.includes(name) || typeof value !== "string" || value.length > 200) return null;
    return pictured(await run(`window.__areaPreview ? window.__areaPreview.style(${JSON.stringify(name)}, ${JSON.stringify(value)}) : null`));
  });
  ipcMain.on("area:preview-clear", () => { run("window.__areaPreview && window.__areaPreview.clear()"); });
  ipcMain.on("area:preview-open", (_event, address) => { const url = localUrl(address); if (url) shell.openExternal(url.href); });
}

module.exports = { register, localUrl, PICKER, STYLES };
