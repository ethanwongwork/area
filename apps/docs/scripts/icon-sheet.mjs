#!/usr/bin/env node
// A review sheet for Area icon sources: each icon at 16, 32 and 96px (line at 1.125), or a
// balance strip of many icons at 16 and 32px with a blurred copy (the squint test). Renders
// with headless Edge or Chrome, so a batch can be judged and sent without the dev server.
//   node apps/docs/scripts/icon-sheet.mjs sheet out.png send.svg play.svg …
//   node apps/docs/scripts/icon-sheet.mjs strip out.png folder info copy search …
//   node apps/docs/scripts/icon-sheet.mjs filled out.png [icon…]   # outline beside filled
//   node apps/docs/scripts/icon-sheet.mjs filled-large out.png icon…  # the same with a 64px row, to inspect cut-outs
// Icons are names or paths under assets/area-icons-pilot. Output lands where you ask.
// filled renders the generated components (src/pilot-icons.tsx) in one React tree, so each
// mask gets its own useId; separate renders reuse ids and every knockout shows the first mask.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = join(dirname(fileURLToPath(import.meta.url)), "../assets/area-icons-pilot");
const [mode0, out, ...names] = process.argv.slice(2);
const large = mode0 === "filled-large", mode = large ? "filled" : mode0;
if (!["sheet", "strip", "filled"].includes(mode) || !out || (mode !== "filled" && !names.length)) {
  console.log("usage: icon-sheet.mjs sheet|strip out.png icon… | filled|filled-large out.png [icon…]"); process.exit(1);
}
const file = n => [n, join(SRC, n), join(SRC, n + ".svg"), join(SRC, "explore", n + ".svg")].find(p => p.endsWith(".svg") && existsSync(p));
// Filled-only gap paths are not part of the outline, so the sheet leaves them out.
const svg = n => { const p = file(n); if (!p) throw new Error(`no icon ${n}`); return readFileSync(p, "utf8").replace(/<path data-filled="(gap|fill)"[^>]*\/>\n?/g, ""); };
const label = (n, s) => (s.match(/data-label="([^"]*)"/) ?? [, basename(n, ".svg")])[1];

// The generated components size their lines from --area-weight-icon (base.css); the sheet
// defines it so filled lines (4/3) render at their real width.
const css = `body{font:12px system-ui;margin:16px;background:#fff;color:#1a1a1a;--area-weight-icon:1.125px}
svg{width:var(--s);height:var(--s)} ${mode === "filled" ? "" : "svg *{stroke-width:1.125}"}
.row{display:flex;align-items:center;gap:24px;padding:8px 0;border-bottom:1px solid #eee}
.l{width:260px}.grid{background:repeating-linear-gradient(#f3f3f3 0 1px,transparent 1px 6px),repeating-linear-gradient(90deg,#f3f3f3 0 1px,transparent 1px 6px)}
.strip{display:flex;gap:calc(var(--s) * .75);align-items:center;padding:8px 0}.blur{filter:blur(2.5px)}
${mode === "filled" ? "body{display:grid;grid-template-columns:repeat(8,1fr);gap:10px 6px}.c{display:flex;flex-direction:column;align-items:center;gap:4px}.c>div{display:flex;gap:6px}svg{width:16px;height:16px}.big svg{width:32px;height:32px}.huge svg{width:64px;height:64px}" : ""}`;
const filledHtml = async () => {
  const { build } = await import("esbuild");
  const cache = join(dirname(fileURLToPath(import.meta.url)), "../.cache"), entry = join(cache, "filled-entry.tsx"), bundle = join(cache, "filled-check.mjs");
  mkdirSync(cache, { recursive: true });
  writeFileSync(entry, `const large = ${large};
import { createElement as h, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PILOT_ICONS } from "../src/pilot-icons.tsx";
export const html = only => renderToStaticMarkup(h(Fragment, null, ...PILOT_ICONS.filter(i => !only.length || only.includes(i.name)).map(({ name, Icon, Filled }) =>
  h("div", { className: "c", key: name }, h("div", null, h(Icon, { size: 16 }), h(Filled, { size: 16 })),
    h("div", { className: "big" }, h(Icon, { size: 32 }), h(Filled, { size: 32 })),
    ...(large ? [h("div", { className: "huge" }, h(Icon, { size: 64 }), h(Filled, { size: 64 }))] : []), h("span", null, name)))));`);
  await build({ entryPoints: [entry], bundle: true, format: "esm", platform: "node", outfile: bundle, external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
  return (await import(`${bundle}?${Date.now()}`)).html(names);
};
const html = mode === "filled" ? await filledHtml() : mode === "sheet"
  ? names.map(n => { const s = svg(n); return `<div class="row"><span class="l">${label(n, s)}</span>${[16, 32, 96].map(px => `<span class="${px === 96 ? "grid" : ""}" style="--s:${px}px;display:inline-flex">${s}</span>`).join("")}</div>`; }).join("")
  : [16, 32, 16].map((px, i) => `<div class="strip ${i === 2 ? "blur" : ""}" style="--s:${px}px">${names.map(svg).join("")}</div>`).join("");
const dir = mkdtempSync(join(tmpdir(), "icon-sheet-")), page = join(dir, "sheet.html");
writeFileSync(page, `<!doctype html><meta charset=utf-8><style>${css}</style>${html}`);

const browsers = ["/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "google-chrome", "chromium"];
const browser = browsers.find(b => !b.startsWith("/") || existsSync(b));
const size = mode === "filled" ? `${large ? 1300 : 1100},${40 + (large ? 180 : 105) * Math.ceil((names.length || 150) / 8)}` : mode === "sheet" ? `760,${20 + 113 * names.length}` : `${Math.max(400, 40 + names.length * 60)},200`;
execFileSync(browser, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=${size}`, `--screenshot=${resolve(out)}`, `file://${page}`], { stdio: "ignore" });
console.log(resolve(out));
