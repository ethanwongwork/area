// Icons inside icons (owner, 2026-10-06: "make the key in person key the same as the actual key icon. see if
// there are other instances of icons in other icons as a smaller piece"): each base icon beside every icon
// that holds a smaller copy of it, outline and filled at 48px. After `npm run icons:pilot`:
//   node docs/research/icon-review/2026-10-06/embedded.mjs out.png [group…]
import { build } from "esbuild"; import { writeFileSync } from "node:fs"; import { execFileSync } from "node:child_process";
export const EMBEDDED = {
  key: ["person-key"],
  lock: ["person-lock", "shield-lock", "file-lock", "folder-lock"],
  settings: ["person-settings", "file-cog"],
  search: ["file-search", "folder-search", "square-search", "replace"],
  clock: ["calendar-clock", "clock-alert", "history", "watch", "alarm", "timer"],
  sparkle: ["chat-sparkle", "grid-sparkle", "corners-sparkle", "wand"],
  sun: ["cloud-sun", "brightness"],
  flash: ["cloud-lightning", "battery-charging"],
  pen: ["file-pen", "compose", "signature"],
  person: ["person-chat", "shield-user", "person-circle", "person-square", "id-card", "people"],
  image: ["file-image", "images", "image-plus"],
  code: ["file-code", "chat-code", "code-block"],
  terminal: ["code-block"],
  desktop: ["devices", "screen-share", "desktop-check"],
  phone: ["devices", "tablet"],
  smile: ["smile-plus", "square-smile"],
  undo: ["archive-restore"],
  play: ["play-circle", "desktop-play"],
  "graduation-cap": ["bot-scholar"],
  "chef-hat": ["bot-automator"],
  crown: ["bot-lead"],
  music: ["playlist"],
  cart: ["cart-add"],
  "arrow-up": ["upload", "share", "cloud-upload", "arrow-up-circle", "square-arrow-up"],
};
const [out, ...pick] = process.argv.slice(2);
const groups = Object.entries(EMBEDDED).filter(([k]) => !pick.length || pick.includes(k));
const cache = process.cwd() + "/apps/docs/.cache";
writeFileSync(cache + "/em.tsx", `import { createElement as h } from "react"; import { renderToStaticMarkup } from "react-dom/server"; import { PILOT_ICONS } from "../src/pilot-icons.tsx";
const g = n => { const p = PILOT_ICONS.find(p => p.name === n); if (!p) throw new Error("no icon " + n); return p; };
const cell = (n, base) => h("div", { className: "cell" + (base ? " base" : "") }, h("div", { className: "l" }, n), h("div", { className: "row" }, h(g(n).Icon, { size: 48 }), h(g(n).Filled, { size: 48 }), h(g(n).Icon, { size: 16 }), h(g(n).Filled, { size: 16 })));
export const html = groups => renderToStaticMarkup(h("div", null, ...groups.map(([b, list]) => h("div", { className: "grp", key: b }, cell(b, true), ...list.map(n => cell(n))))));`);
await build({ entryPoints: [cache + "/em.tsx"], bundle: true, format: "esm", platform: "node", outfile: cache + "/em.out.mjs", external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
const { html } = await import(cache + "/em.out.mjs?" + Date.now());
writeFileSync(cache + "/em.html", `<!doctype html><style>body{font:11px system-ui;margin:10px;color:#111;background:#fff;--area-weight-icon:1.125px}.grp{display:flex;flex-wrap:wrap;gap:4px;padding:4px 0;border-bottom:1px solid #eee}.cell{border:1px solid #e6e6e6;border-radius:5px;padding:4px 6px}.base{background:#f4f6ff;border-color:#c9d2ff}.l{color:#555}.row{display:flex;gap:8px;align-items:center}svg{display:block}</style>${html(groups)}`);
const rows = groups.length;
execFileSync("/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=1400,${30 + rows * 82}`, "--screenshot=" + out, "file://" + cache + "/em.html"], { stdio: "ignore" });
console.log(out);
