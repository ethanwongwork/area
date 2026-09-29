#!/usr/bin/env node
// A review sheet for Area icon sources: each icon at 16, 32 and 96px (line at 1.125), or a
// balance strip of many icons at 16 and 32px with a blurred copy (the squint test). Renders
// with headless Edge or Chrome, so a batch can be judged and sent without the dev server.
//   node apps/docs/scripts/icon-sheet.mjs sheet out.png send.svg play.svg …
//   node apps/docs/scripts/icon-sheet.mjs strip out.png folder info copy search …
//   node apps/docs/scripts/icon-sheet.mjs filled out.png [icon…]   # outline beside filled
//   node apps/docs/scripts/icon-sheet.mjs filled-large out.png icon…  # the same with a 64px row, to inspect cut-outs
//   node apps/docs/scripts/icon-sheet.mjs compare out.png icon…   # Area outline and filled beside Fluent's regular and filled
// Icons are names or paths under assets/area-icons-pilot, comma-separated lists, or a batch
// id from batches.json (batch-43 expands to its icons). Output lands where you ask.
// filled and compare render the generated components (src/pilot-icons.tsx) in one React tree,
// so each mask gets its own useId; separate renders reuse ids and every knockout shows the
// first mask. Run the generator (npm run icons:pilot) first so new sources are included.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, "../assets/area-icons-pilot");
const [mode0, out, ...args] = process.argv.slice(2);
const large = mode0 === "filled-large", mode = large ? "filled" : mode0;
const MODES = ["sheet", "strip", "filled", "compare"];
if (!MODES.includes(mode) || !out || (mode !== "filled" && !args.length)) {
  console.log("usage: icon-sheet.mjs sheet|strip|compare out.png icon… | filled|filled-large out.png [icon…]\n  icon: a name, a path, a comma-separated list, or a batch id (batch-43)"); process.exit(1);
}
// Batch ids expand to their icons; commas split lists (shells that don't split words pass one argument).
const batches = JSON.parse(readFileSync(join(SRC, "batches.json"), "utf8")).batches;
const names = args.flatMap(a => a.split(",")).filter(Boolean).flatMap(n => {
  const id = n.match(/^batch-?(\d+)$/)?.[1], batch = id && batches.find(b => b.id === `batch-${id}`);
  return batch ? Object.keys(batch.icons) : [n];
});
const file = n => [n, join(SRC, n), join(SRC, n + ".svg"), join(SRC, "explore", n + ".svg")].find(p => p.endsWith(".svg") && existsSync(p));
// Filled-only paths (gap, fill, halo) are not part of the outline, so the sheet leaves them out.
const svg = n => { const p = file(n); if (!p) throw new Error(`no icon ${n}`); return readFileSync(p, "utf8").replace(/<path data-filled="(gap|fill|halo|stroke)"[^>]*\/>\n?/g, ""); };
const label = (n, s) => (s.match(/data-label="([^"]*)"/) ?? [, basename(n, ".svg")])[1];

// Fluent references, as gen-icons.mjs maps them (FluentRef<Name>Icon and …FilledIcon).
const fluentFor = name => {
  const camel = name.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());
  const map = readFileSync(join(HERE, "gen-icons.mjs"), "utf8");
  const dir = join(dirname(createRequire(import.meta.url).resolve("@fluentui/svg-icons/package.json")), "icons");
  const load = key => { const id = map.match(new RegExp(`\\b${key}: "([a-z0-9_]+)"`))?.[1]; return id && existsSync(join(dir, id + ".svg")) ? readFileSync(join(dir, id + ".svg"), "utf8").replace("<svg ", `<svg fill="currentColor" `) : ""; };
  return { regular: load(`FluentRef${camel}Icon`), filled: load(`FluentRef${camel}FilledIcon`) };
};

// The generated components size their lines from --area-weight-icon (base.css); the sheet
// defines it so filled lines (4/3) render at their real width.
const css = `body{font:12px system-ui;margin:16px;background:#fff;color:#1a1a1a;--area-weight-icon:1.125px}
svg{width:var(--s);height:var(--s)} ${["filled", "compare"].includes(mode) ? "" : "svg *{stroke-width:1.125}"}
.row{display:flex;align-items:center;gap:24px;padding:8px 0;border-bottom:1px solid #eee}
.l{width:260px}.grid{background:repeating-linear-gradient(#f3f3f3 0 1px,transparent 1px 6px),repeating-linear-gradient(90deg,#f3f3f3 0 1px,transparent 1px 6px)}
.strip{display:flex;gap:calc(var(--s) * .75);align-items:center;padding:8px 0}.blur{filter:blur(2.5px)}
${mode === "filled" ? "body{display:grid;grid-template-columns:repeat(8,1fr);gap:10px 6px}.c{display:flex;flex-direction:column;align-items:center;gap:4px}.c>div{display:flex;gap:6px}svg{width:16px;height:16px}.big svg{width:32px;height:32px}.huge svg{width:64px;height:64px}" : ""}
${mode === "compare" ? ".head{display:flex;gap:24px;color:#888;padding-bottom:6px}.head span:first-child{width:160px}.l{width:160px}.g{display:flex;align-items:center;gap:12px;width:250px}.g svg,.g .f svg{width:16px;height:16px}.g .big svg,.g .f.big svg{width:48px;height:48px}.f{display:inline-flex}" : ""}`;
const components = async body => {
  const { build } = await import("esbuild");
  const cache = join(HERE, "../.cache"), entry = join(cache, "sheet-entry.tsx"), bundle = join(cache, "sheet-entry.mjs");
  mkdirSync(cache, { recursive: true });
  writeFileSync(entry, `import { createElement as h, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PILOT_ICONS } from "../src/pilot-icons.tsx";
export const html = (only, extra) => renderToStaticMarkup(h(Fragment, null, ...(${body})));`);
  await build({ entryPoints: [entry], bundle: true, format: "esm", platform: "node", outfile: bundle, external: ["react", "react-dom", "react-dom/server"], jsx: "automatic", logLevel: "error" });
  const mod = await import(`${bundle}?${Date.now()}`);
  return (only, extra) => mod.html(only, extra);
};
const filledHtml = async () => (await components(`PILOT_ICONS.filter(i => !only.length || only.includes(i.name)).map(({ name, Icon, Filled }) =>
  h("div", { className: "c", key: name }, h("div", null, h(Icon, { size: 16 }), h(Filled, { size: 16 })),
    h("div", { className: "big" }, h(Icon, { size: 32 }), h(Filled, { size: 32 })),
    ...(${large} ? [h("div", { className: "huge" }, h(Icon, { size: 64 }), h(Filled, { size: 64 }))] : []), h("span", null, name)))`))(names, {});
// One row per icon: Area outline and filled at 16 and 48px, then Fluent's regular and filled.
const compareHtml = async () => {
  const refs = Object.fromEntries(names.map(n => [n, fluentFor(n)]));
  const missing = names.filter(n => !refs[n].regular);
  if (missing.length) console.warn(`no Fluent reference mapped for: ${missing.join(", ")} (add FluentRef…Icon in gen-icons.mjs, or record the batch with a fluent stem)`);
  const rows = await components(`only.map(name => { const i = PILOT_ICONS.find(p => p.name === name); if (!i) throw new Error("not generated: " + name + " (run npm run icons:pilot)");
  const raw = (svg, big) => h("span", { className: "f" + (big ? " big" : ""), dangerouslySetInnerHTML: { __html: svg } });
  const r = extra[name];
  return h("div", { className: "row", key: name }, h("span", { className: "l" }, name),
    h("span", { className: "g" }, h(i.Icon, { size: 16 }), h(i.Filled, { size: 16 }), h("span", { className: "big" }, h(i.Icon, { size: 48 })), h("span", { className: "big" }, h(i.Filled, { size: 48 }))),
    h("span", { className: "g" }, raw(r.regular), raw(r.filled), raw(r.regular, true), raw(r.filled, true))); })`);
  return `<div class="head"><span></span><span style="width:250px">Area · outline, filled</span><span>Fluent · regular, filled</span></div>` + rows(names, refs);
};
const html = mode === "filled" ? await filledHtml() : mode === "compare" ? await compareHtml() : mode === "sheet"
  ? names.map(n => { const s = svg(n); return `<div class="row"><span class="l">${label(n, s)}</span>${[16, 32, 96].map(px => `<span class="${px === 96 ? "grid" : ""}" style="--s:${px}px;display:inline-flex">${s}</span>`).join("")}</div>`; }).join("")
  : [16, 32, 16].map((px, i) => `<div class="strip ${i === 2 ? "blur" : ""}" style="--s:${px}px">${names.map(svg).join("")}</div>`).join("");
const dir = mkdtempSync(join(tmpdir(), "icon-sheet-")), page = join(dir, "sheet.html");
writeFileSync(page, `<!doctype html><meta charset=utf-8><style>${css}</style>${html}`);

const browsers = ["/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "google-chrome", "chromium"];
const browser = browsers.find(b => !b.startsWith("/") || existsSync(b));
const size = mode === "filled" ? `${large ? 1300 : 1100},${40 + (large ? 180 : 105) * Math.ceil((names.length || 150) / 8)}`
  : mode === "compare" ? `760,${60 + 70 * names.length}`
  : mode === "sheet" ? `760,${20 + 113 * names.length}` : `${Math.max(400, 40 + names.length * 60)},200`;
execFileSync(browser, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=2", `--window-size=${size}`, `--screenshot=${resolve(out)}`, `file://${page}`], { stdio: "ignore", timeout: 60000 });
console.log(resolve(out));
