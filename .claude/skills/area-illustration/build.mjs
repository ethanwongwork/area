// Area figures: render the figures (figures/index.jsx, Area's real components) to markup, and write a bench to look at them.
//   node build.mjs [out-dir] [--only id,id]  → <out-dir>/index.html (+ area.css): every screen, vignette and component
//   family (its tile filled with its specimens), in Bars, light and dark. Serve the folder and open it in the app's
//   browser pane (SKILL.md, "Look"). Needs `npm run build` first, for Area's CSS and the packages' dist.
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "esbuild";

const HERE = import.meta.dirname;
export const REPO = resolve(HERE, "../../..");
export const AREA_CSS = join(REPO, "packages/styles/dist/area.css");

/** Area's settings at their defaults, as the scope attributes the CSS reads. */
export const DEFAULTS = {
  "data-area-type": "14", "data-area-density": "32", "data-area-neutral": "neutral", "data-area-tint-hue": "auto",
  "data-area-tint-light": "auto", "data-area-tint-dark": "auto", "data-area-ink-tint": "50", "data-area-accent": "blue",
  "data-area-ground-light": "100", "data-area-ground-dark": "8", "data-area-layers-light": "50", "data-area-layers-dark": "50",
  "data-area-card-tone-light": "auto", "data-area-card-tone-dark": "auto", "data-area-action": "neutral",
  "data-area-selection": "accent", "data-area-radius": "8", "data-area-surface": "1", "data-area-stroke": "4",
  "data-area-selected-stroke": "2", "data-area-focus-ring": "hug", "data-area-motion": "210", "data-area-easing": "standard",
  "data-area-pills": "chip badge count switch avatar",
};

/** The figures as markup: { components, settings, screens, errors } (figures/index.jsx, render). */
export async function renderFigures() {
  const out = join(HERE, ".render.mjs");
  await build({
    entryPoints: [join(HERE, "figures/index.jsx")], outfile: out, bundle: true, platform: "node", format: "esm", jsx: "automatic",
    nodePaths: [join(REPO, "node_modules")], logLevel: "warning", loader: { ".css": "empty", ".svg": "text" },
    alias: { "@area/react": join(REPO, "packages/react/dist/modules/index.js"), "@area/icons": join(REPO, "packages/icons/dist/modules/index.js") },
    define: { "process.env.NODE_ENV": '"production"' },
    /* The app's demo registry reaches modules a static render doesn't need: stub them. */
    plugins: [{ name: "stub", setup(b) {
      b.onResolve({ filter: /^(virtual:|@lucasmarkes\/)/ }, (a) => ({ path: a.path, namespace: "stub" }));
      b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: "export default {}; export const Basket = null, Drawer = null, Loupe = null, Plot = null, Rail = null, Sieve = null;", loader: "js" }));
    } }],
    banner: { js: 'import { createRequire as __cr } from "module"; const require = __cr(import.meta.url);' },
  });
  try { return (await import(`${pathToFileURL(out).href}?${Date.now()}`)).render(); } finally { rmSync(out, { force: true }); }
}

/** The stylesheets and the staging script, as strings to inline. */
export function assets() {
  return {
    css: ["engine/abstract.css", "figures/screens.css"].map((f) => readFileSync(join(HERE, f), "utf8")).join("\n"),
    /* The Line pass is an ES module the app imports; the bench inlines it as a script. */
    js: [readFileSync(join(HERE, "engine/line.js"), "utf8"), readFileSync(join(HERE, "engine/stage.js"), "utf8")]
      .map((source) => source.replace(/^import .*$/gm, "").replace(/^export \{[^}]*\};?$/gm, "").replace(/^export /gm, "")).join("\n"),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const dir = resolve(args.find((a) => !a.startsWith("--")) || join(process.cwd(), "area-figures-bench"));
  const only = args.includes("--only") ? args[args.indexOf("--only") + 1].split(",") : null;
  const fidelity = args.includes("--fidelity") ? args[args.indexOf("--fidelity") + 1] : "bars";
  mkdirSync(dir, { recursive: true });
  copyFileSync(AREA_CSS, join(dir, "area.css"));
  const figures = await renderFigures();
  if (figures.errors.length) console.warn(figures.errors.join("\n"));
  const { css, js } = assets();
  writeFileSync(join(dir, "index.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Area figures bench</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="area.css"><style>${css}
body { margin: 0; font: 12px/1.4 system-ui, sans-serif; background: #e9e9ea; }
section { padding: 12px; display: grid; gap: 14px; } .set { display: grid; gap: 6px; } .opts { display: flex; flex-wrap: wrap; gap: 8px; }
.af-stage { border-radius: 6px; }
</style></head><body>
${["light", "dark"].map((theme) => `<section data-theme-bench="${theme}"></section>`).join("")}
<script>${js}
const F = ${JSON.stringify(figures).replace(/<\//g, "<\\/")};
const ONLY = ${JSON.stringify(only)};
const DEFAULTS = ${JSON.stringify(DEFAULTS)};
const FIDELITY = ${JSON.stringify(fidelity)};
for (const sec of document.querySelectorAll("[data-theme-bench]")) {
  const theme = sec.dataset.themeBench, scope = { ...DEFAULTS, "data-area-theme": theme };
  const row = (title) => { const b = document.createElement("div"); b.className = "set"; b.innerHTML = "<b>" + title + " · " + theme + "</b><div class=opts></div>"; sec.append(b); return b.lastChild; };
  for (const [set, frame, k] of [["desktop", [320, 180], 0.3125], ["mobile", [128, 270], 0.3125], ["isolated", [240, 180], 0.5]]) {
    const o = row(set);
    for (const [id, sc] of Object.entries(F.screens[set])) if (!ONLY || ONLY.includes(id)) AFS.stage(o, { html: sc.html, w: frame[0], h: frame[1], fit: k, pad: 1, scope, fidelity: FIDELITY });
  }
  for (const c of F.gallery.filter((c) => !ONLY || ONLY.includes(c.slug))) {
    const st = AFS.stage(row(c.slug), { html: '<div class="af-tile"></div>', w: 240, h: 180, fit: 0.5, pad: 1, scope });
    const box = st.querySelector(".af-tile");
    for (const [i, part] of c.parts.entries()) { box.insertAdjacentHTML("beforeend", part); if (i > 0 && box.offsetHeight > 360) { box.lastElementChild.remove(); break; } }
  }
}
</script></body></html>`);
  console.log(join(dir, "index.html"), figures.errors.length ? `${figures.errors.length} errors` : "");
}
