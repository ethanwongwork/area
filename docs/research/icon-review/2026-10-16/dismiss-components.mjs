// The close × before (10) and after (9): the icon beside add, and the components that draw it, rendered from
// packages/react source with the worktree's built area.css; Before swaps in the saved glyphs.ts.
import { build } from "/Users/ethanwong/Desktop/area/node_modules/esbuild/lib/main.js";
import { readFileSync, writeFileSync } from "node:fs";
import { edgeShot } from "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0/docs/research/icon-review/2026-10-07/edge.mjs";
const D = new URL(".", import.meta.url).pathname, W = "/Users/ethanwong/Desktop/area/.claude/worktrees/icon-review-5957f0";
const [out] = process.argv.slice(2);
writeFileSync(D + "c.tsx", `import { createElement as h, Fragment } from "react"; import { renderToStaticMarkup } from "react-dom/server";
import { Badge, Tag, Alert, Button } from "${W}/packages/react/src/index.ts"; import { Glyph } from "${W}/packages/react/src/components/Glyph.tsx";
const noop = () => {};
const cell = (label, node) => h("div", { className: "cell" }, h("div", { className: "lab" }, label), node);
export const html = () => renderToStaticMarkup(h(Fragment, null,
  h("div", { className: "row" },
    cell("Glyph 12 · add / dismiss", h("span", { className: "pair g12" }, h(Glyph, { name: "add", size: 12 }), h(Glyph, { name: "dismiss", size: 12 }))),
    cell("Glyph 16 · add / dismiss", h("span", { className: "pair g16" }, h(Glyph, { name: "add", size: 16 }), h(Glyph, { name: "dismiss", size: 16 }))),
    cell("Glyph 24 · add / dismiss", h("span", { className: "pair g24" }, h(Glyph, { name: "add", size: 24 }), h(Glyph, { name: "dismiss", size: 24 }))),
    cell("Button sm ghost iconOnly", h("span", { className: "pair" }, h(Button, { size: "sm", variant: "ghost", tone: "neutral", iconOnly: true, "aria-label": "Add", icon: h(Glyph, { name: "add", size: 16 }) }, "Add"), h(Button, { size: "sm", variant: "ghost", tone: "neutral", iconOnly: true, "aria-label": "Close", icon: h(Glyph, { name: "dismiss", size: 16 }) }, "Close")))),
  h("div", { className: "row" },
    cell("Badge (dismissible)", h(Badge, { onDismiss: noop, dismissLabel: "Remove" }, "Design")),
    cell("Badge pill", h(Badge, { pill: true, tone: "info", onDismiss: noop, dismissLabel: "Remove" }, "In review")),
    cell("Tag (removable)", h(Tag, { onRemove: noop, removeLabel: "Remove" }, "Figma")),
  ),
  h("div", { className: "row wide" }, cell("Alert (dismissible)", h(Alert, { tone: "info", title: "Update available", onDismiss: noop }, "Restart to finish installing.")))));`);
const plugin = before => ({ name: "glyphs", setup(b) { if (before) b.onResolve({ filter: /\.\/glyphs\.ts$/ }, () => ({ path: D + "glyphs-before.ts" })); } });
const css = readFileSync(W + "/packages/styles/dist/area.css", "utf8");
const page = [];
for (const [label, before] of [["Before · × 10", true], ["After · × 9", false]]) {
  await build({ entryPoints: [D + "c.tsx"], bundle: true, format: "cjs", platform: "node", outfile: D + (before ? "b" : "a") + ".cjs", nodePaths: ["/Users/ethanwong/Desktop/area/node_modules"], jsx: "automatic", logLevel: "error", alias: { "@area/styles/manifest": W + "/packages/styles/src/manifest.ts", "@area/icons": W + "/packages/icons/src/index.ts" }, plugins: [plugin(before)] });
  const { html } = (await import(D + (before ? "b" : "a") + ".cjs?" + Date.now())).default;
  page.push(`<section><h2>${label}</h2>${html()}</section>`);
}
writeFileSync(D + "comp.html", `<!doctype html><html lang="en"><meta charset="utf-8"><style>${css}</style><style>body{margin:20px;font:13px system-ui;background:#fff;color:#1a1a1a}h2{font-size:13px;margin:6px 0 10px}section{padding:10px 0;border-bottom:1px solid #eee}.row{display:flex;gap:24px;align-items:flex-start;margin-bottom:14px}.cell{display:flex;flex-direction:column;gap:6px}.lab{color:#888;font-size:11px}.pair{display:inline-flex;gap:10px;align-items:center}.wide .cell{width:420px}.g12 svg{width:12px;height:12px}.g16 svg{width:16px;height:16px}.g24 svg{width:24px;height:24px}</style><body>${page.join("")}</body></html>`);
await edgeShot(["--user-data-dir=" + D + "pc", "--no-first-run", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=3", "--window-size=820,560"], out, "file://" + D + "comp.html");
console.log(out);
