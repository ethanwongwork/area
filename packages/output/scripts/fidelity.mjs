/**
 * Fidelity: does a written system paint exactly what Area paints? For each test system, two pages in Electron:
 *
 *   area.html     Area's full stylesheet (@area/styles dist/area.css) with the theme's data-area-* attributes on <html>,
 *                 the exact colour and accent rules as the app adds them, and a second theme's attributes on a <div>
 *   written.html  the written system's css/index.css, with nothing on <html> but the mode, and the second theme's
 *                 data-area-system-theme on the <div>
 *
 * In light and dark, every --area-* custom property on <html> and on the <div>, and the painted style of a row of
 * components, must be equal. Run: npm run fidelity -w @area/output (needs the tokens, styles and icons builds).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..", "..");
const { loadLibrary, readDefinition, definitionFromSystem, generate, themeAttributes } = await import(pathToFileURL(join(here, "..", "src", "index.ts")).href);
const lib = await loadLibrary(root);
const work = mkdtempSync(join(tmpdir(), "area-fidelity-"));

const SYSTEMS = {
  defaults: [{ id: "default", name: "Default" }],
  varied: [
    { id: "default", name: "Default", settings: { radius: "0", density: "28", type: "12", accent: "150", neutral: "warm", contrast: "4", pills: "button chip", elevation: "6", motion: "0" }, material: { bundle: "glass", overrides: { frost: "3" } }, accent: { on: true, primary: "#00b65c", secondary: "#a785fe" }, colours: { light: "#f6f1e8" } },
    { id: "night", name: "Night", settings: { radius: "pill", density: "36", type: "15", accent: "300", neutral: "cool", elevation: "1" }, material: { bundle: "jelly", overrides: {} } },
  ],
  system: [{ id: "default", name: "Default", settings: { radius: "14", type: "16", density: "32", contrast: "system", neutral: "cool", "layers-light": "60", "card-tone-dark": "25" }, material: { bundle: "soft", overrides: {} }, colours: { light: null, dark: "#101418" } }],
};

// AREA_SYSTEM_FILE=<a system.json the app saved>: its latest version too (the owner's own systems).
if (process.env.AREA_SYSTEM_FILE) SYSTEMS.saved = definitionFromSystem(JSON.parse(readFileSync(process.env.AREA_SYSTEM_FILE, "utf8"))).themes;

const SAMPLES = `
  <button class="area-button area-button--solid area-button--neutral area-button--md">Save</button>
  <button class="area-button area-button--soft area-button--danger area-button--sm">Remove</button>
  <button class="area-button area-button--outline area-button--neutral area-button--lg">More</button>
  <span class="area-badge area-badge--soft area-badge--success area-badge--md">Ready</span>
  <input class="area-input area-input--md" value="Text">
  <div class="area-card area-card--outline"><p>Card</p></div>`;

const css = (path) => pathToFileURL(path).href;
const attrs = (theme) => Object.entries(themeAttributes(theme, lib.tokens.defaultMaterial)).map(([k, v]) => ` data-area-${k}="${v}"`).join("");
const tokenNames = [...new Set([...lib.tokens.defaults.matchAll(/(--area-[a-z0-9-]+)\s*:/g), ...lib.tokens.axes.matchAll(/(--area-[a-z0-9-]+)\s*:/g)].map(m => m[1]))].sort();

const cases = [];
for (const [name, themes] of Object.entries(SYSTEMS)) {
  const def = readDefinition({ system: { id: name, name }, themes });
  const dir = join(work, name);
  const generated = generate(def, lib);
  for (const [path, text] of Object.entries(generated.files)) {
    if (path.includes("#")) continue;
    mkdirSync(dirname(join(dir, path)), { recursive: true });
    writeFileSync(join(dir, path), text);
  }
  const [first, second] = def.themes;
  // The app's own exact-colour and accent rules, on their default selectors.
  const extra = def.themes.map(theme => {
    let out = "";
    if (theme.colours.light || theme.colours.dark) out += lib.engines.colours.colourCss({ page: { ...(theme.colours.light ? { light: theme.colours.light } : {}), ...(theme.colours.dark ? { dark: theme.colours.dark } : {}) } });
    if (theme.accent.on) out += lib.engines.brand.brandCss({ primary: theme.accent.primary, ...(theme.accent.secondary ? { secondary: theme.accent.secondary } : {}) }, { statusColours: theme.accent.status === "own" ? "fixed" : "harmonised" });
    return out;
  }).join("\n");
  const inner = second ? `<div id="scope"${attrs(second)}>${SAMPLES}</div>` : `<div id="scope">${SAMPLES}</div>`;
  writeFileSync(join(dir, "area.html"), `<!doctype html><html${attrs(first)}><head><link rel="stylesheet" href="${css(join(root, "packages/styles/dist/area.css"))}"><style>${extra}</style></head><body>${SAMPLES}${inner}</body></html>`);
  const innerWritten = second ? `<div id="scope" data-area-system-theme="${second.id}">${SAMPLES}</div>` : `<div id="scope">${SAMPLES}</div>`;
  writeFileSync(join(dir, "written.html"), `<!doctype html><html><head><link rel="stylesheet" href="${css(join(dir, "design-system/css/index.css"))}"></head><body>${SAMPLES}${innerWritten}</body></html>`);
  cases.push({ name, dir });
}
writeFileSync(join(work, "job.json"), JSON.stringify({ cases, tokenNames }));
const electron = (await import("electron")).default;
execFileSync(electron, [join(here, "fidelity-electron.cjs"), work], { stdio: ["ignore", "inherit", "inherit"] });
const results = JSON.parse(readFileSync(join(work, "result.json"), "utf8"));

let failed = 0;
for (const result of results) {
  const diffs = [];
  for (const mode of ["light", "dark"]) for (const part of ["root", "scope", "samples"]) {
    const a = result.area[mode][part], b = result.written[mode][part];
    for (const key of Object.keys(a)) if (a[key] !== b[key]) diffs.push(`${mode} ${part} ${key}\n      Area:    ${String(a[key]).slice(0, 160)}\n      written: ${String(b[key]).slice(0, 160)}`);
  }
  const counted = Object.keys(result.area.light.root).length;
  console.log(`${result.name}: ${counted} properties × 2 elements + ${Object.keys(result.area.light.samples).length} painted values, light and dark: ${diffs.length ? `${diffs.length} differ` : "identical"}`);
  for (const d of diffs.slice(0, 12)) console.log(`    ${d}`);
  failed += diffs.length;
}
console.log(failed ? `\nFidelity: ${failed} differences (pages in ${work}).` : "\nFidelity: every written system paints exactly what Area paints.");
process.exit(failed ? 1 : 0);
