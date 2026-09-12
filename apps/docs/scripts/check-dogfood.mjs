/**
 * Dogfood audit.
 *
 * The documentation is supposed to be built out of the system it documents. This makes
 * that claim checkable rather than asserted: it scans the docs' own stylesheet for values
 * that bypass the token layer -- raw lengths, raw colours, raw font sizes -- and reports
 * every one, plus any element in the built HTML that carries visual styling without an
 * Area class behind it.
 *
 * A short allowlist covers the values a design system genuinely has no opinion about:
 * this site's sidebar width, its reading measure, its breakpoints. Those are declared as
 * named `--docs-*` properties so they read as decisions rather than as stray numbers.
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DOCS_CSS } from "./layout.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Values a design system has no opinion on. Each must be justified here to be allowed. */
const ALLOWED = new Map([
  ["--docs-sidebar", "Width of this site's navigation. Not a system concern."],
  ["--docs-toc", "Width of this site's on-this-page list."],
  ["--docs-topbar", "Height of this site's header."],
  ["--docs-measure", "Reading measure for long-form documentation."],
  ["--docs-max", "Maximum width of this site's shell."],
  ["--docs-blur", "Backdrop blur on this site's header. No Area surface uses blur."],
  ["--docs-axis-col", "Minimum column width in the axis panel."],
  ["--docs-preview-min", "Minimum height of an example preview."],
]);

/** Structural values that carry no visual identity. */
const STRUCTURAL = new Set([
  "0", "0px", "1px", "100%", "100vh", "auto", "none", "1fr", "inherit", "transparent",
  "1 / 1.5", "1%", "50%",
]);

const findings = [];

/* --- 1. Raw values in the docs stylesheet --------------------------------- */

const css = DOCS_CSS
  // Ignore media-query breakpoints and the allowlisted declarations themselves.
  .replace(/@media[^{]+\{/g, "")
  .replace(/\/\*[\s\S]*?\*\//g, "");

const lines = css.split("\n");

for (const [index, line] of lines.entries()) {
  const declaration = line.trim();
  if (!declaration || declaration.endsWith("{") || declaration === "}") continue;

  const match = declaration.match(/^([a-z-]+)\s*:\s*(.+);$/);
  if (!match) continue;
  const [, property, rawValue] = match;

  // A declaration that defines an allowlisted site variable is fine.
  if (ALLOWED.has(property)) continue;

  // Strip every var() call; whatever is left is the part that bypassed the tokens.
  const remainder = rawValue
    .replace(/var\(--area-[a-z0-9-]+\)/g, "")
    .replace(/var\(--docs-[a-z0-9-]+\)/g, "")
    .replace(/color-mix\([^)]*\)/g, "")
    .replace(/calc\(|\)/g, "")
    .trim();

  const suspicious = [
    [/#[0-9a-f]{3,8}\b/i, "raw colour"],
    [/\brgba?\(/i, "raw colour"],
    [/\bhsla?\(/i, "raw colour"],
    [/\boklch\(/i, "raw colour"],
    [/(?<![\w-])\d+(\.\d+)?(px|rem|em)\b/, "raw length"],
  ];

  for (const [pattern, kind] of suspicious) {
    const hit = remainder.match(pattern);
    if (!hit) continue;
    if (STRUCTURAL.has(hit[0])) continue;
    findings.push({
      kind,
      where: `DOCS_CSS line ${index + 1}`,
      detail: `${property}: ${rawValue}`,
      value: hit[0],
    });
  }
}

/* --- 1b. Docs rules that silently lose to the component layer -------------- */

/*
 * DOCS_CSS lives in `area.base`, which the cascade resolves *before* `area.components`.
 * So a docs rule targeting an `.area-*` class never takes effect, and does so silently --
 * no warning, no specificity hint, just a style that does nothing. Caught twice by hand
 * during this build; caught mechanically from here.
 *
 * Properties the component layer never sets (margins, grid placement) are still safe to
 * apply from outside, so those are allowed through.
 */
const LAYERABLE = /^(margin|grid-area|grid-column|grid-row|order|position|inset|z-index|flex)$/;

for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const selector = match[1].trim().replace(/\s+/g, " ");
  const body = match[2];
  if (!/\.area-[a-z0-9-]+/.test(selector)) continue;

  const properties = [...body.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
  if (properties.length === 0) continue;
  if (properties.every((property) => LAYERABLE.test(property.split("-")[0]) || LAYERABLE.test(property))) {
    continue;
  }

  findings.push({
    kind: "dead override",
    where: "DOCS_CSS",
    detail:
      `${selector} sets ${properties.join(", ")} on a component class from area.base, ` +
      `which loses to area.components. Add a variant to the component instead.`,
    value: selector,
  });
}

/* --- 2. Inline styles in the built HTML ----------------------------------- */

const htmlFiles = readdirSync(join(root, "dist")).filter((f) => f.endsWith(".html"));
const inlineRaw = new Map();

for (const file of htmlFiles) {
  const html = readFileSync(join(root, "dist", file), "utf8");
  for (const match of html.matchAll(/style="([^"]*)"/g)) {
    const style = match[1];
    // A style attribute is acceptable when every value in it resolves from a token, or it
    // is a demo's own layout. Flag the ones carrying literal colours or sizes.
    const stripped = style.replace(/var\(--area-[a-z0-9-]+\)/g, "");
    const hit = stripped.match(/#[0-9a-f]{3,8}\b|rgba?\(|(?<![\w-])\d+(\.\d+)?(px|rem)\b/i);
    if (!hit) continue;
    // Classify per declaration, not per string. A style is example framing when every
    // declaration in it is either a token reference, a layout keyword, or an explicit size
    // -- how wide this particular example is drawn is not a decision the system owns.
    const framing = style
      .split(";")
      .map((d) => d.trim())
      .filter(Boolean)
      .every((declaration) => {
        const [property, ...rest] = declaration.split(":");
        const value = rest.join(":").trim();
        if (/^var\(--area-[a-z0-9-]+\)$/.test(value)) return true;
        if (/^(display|flex-direction|align-items|justify-content|flex-wrap)$/.test(property.trim())) return true;
        if (/^(inline-size|max-inline-size|min-inline-size|block-size|min-block-size)$/.test(property.trim())) {
          return /^\d+(px|%)$/.test(value);
        }
        return false;
      });
    const key = style;
    if (!inlineRaw.has(key)) inlineRaw.set(key, { count: 0, files: new Set(), value: hit[0], framing });
    const entry = inlineRaw.get(key);
    entry.count++;
    entry.files.add(file);
  }
}

/* --- 3. Component coverage ------------------------------------------------- */

const { MANIFESTS } = await import(join(root, "..", "..", "packages/styles/src/manifest.ts"));
const allHtml = htmlFiles.map((f) => readFileSync(join(root, "dist", f), "utf8")).join("\n");
const unused = Object.entries(MANIFESTS)
  .filter(([, m]) => !new RegExp(`class="[^"]*\\b${m.block}\\b`).test(allHtml))
  .map(([name]) => name);

/* --- Report ---------------------------------------------------------------- */

console.log("\n  Dogfood audit\n");

const componentsUsed = Object.keys(MANIFESTS).length - unused.length;
console.log(`  components used in docs     ${componentsUsed}/${Object.keys(MANIFESTS).length}`);
if (unused.length) console.log(`  not yet used                ${unused.join(", ")}`);

console.log(`  allowlisted site variables  ${ALLOWED.size}`);
for (const [name, reason] of ALLOWED) console.log(`    ${name.padEnd(16)} ${reason}`);

if (findings.length) {
  console.log(`\n  ${findings.length} raw value(s) in the docs stylesheet:\n`);
  for (const f of findings) console.log(`    [${f.kind}] ${f.where}\n      ${f.detail}`);
} else {
  console.log(`\n  no raw values in the docs stylesheet`);
}

const framing = [...inlineRaw].filter(([, e]) => e.framing);
const raw = [...inlineRaw].filter(([, e]) => !e.framing);

if (framing.length) {
  console.log(`\n  ${framing.length} demo framing width(s) — example layout, not a system concern:`);
  const widths = [...new Set(framing.flatMap(([style]) => [...style.matchAll(/(\d+px)/g)].map((m) => m[1])))];
  console.log(`    ${widths.sort((a, b) => parseInt(a) - parseInt(b)).join(", ")}`);
}

if (raw.length) {
  console.log(`\n  ${raw.length} inline style(s) carrying literal values:\n`);
  for (const [style, entry] of raw.sort((a, b) => b[1].count - a[1].count)) {
    console.log(`    ${entry.count}x  ${style.slice(0, 96)}`);
    console.log(`         ${[...entry.files].slice(0, 3).join(", ")}`);
  }
} else {
  console.log(`\n  no inline styles carrying literal values beyond demo framing`);
}

console.log("");

if (findings.length > 0 || raw.length > 0) {
  console.error("  Dogfood audit failed: the documentation must be built from the system.\n");
  process.exit(1);
}
