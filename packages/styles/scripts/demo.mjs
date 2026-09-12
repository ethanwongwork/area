/** Builds a self-contained page showing every Button variant, for visual review. */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(root, "dist", "area.css"), "utf8");

const icon = `<span class="area-button__icon" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3.5v9M3.5 8h9"/></svg></span>`;
const label = (t) => `<span class="area-button__label">${t}</span>`;

const btn = (cls, content, attrs = "") =>
  `<button type="button" class="area-button ${cls}"${attrs}>${content}</button>`;

const VARIANTS = ["solid", "soft", "outline", "ghost"];
const TONES = ["accent", "neutral", "danger"];
const SIZES = ["xs", "sm", "md", "lg", "xl"];

function section(title, body) {
  return `<section><h2>${title}</h2><div class="row">${body}</div></section>`;
}

const body = [
  section(
    "Variants",
    VARIANTS.map((v) => btn(`area-button--${v} area-button--accent area-button--md`, label(v))).join(""),
  ),
  ...TONES.map((tone) =>
    section(
      `Tone: ${tone}`,
      VARIANTS.map((v) => btn(`area-button--${v} area-button--${tone} area-button--md`, label(v))).join(""),
    ),
  ),
  section(
    "Sizes",
    SIZES.map((s) => btn(`area-button--solid area-button--accent area-button--${s}`, label(s))).join(""),
  ),
  section(
    "With icon",
    SIZES.map((s) =>
      btn(`area-button--outline area-button--neutral area-button--${s}`, icon + label("Add")),
    ).join(""),
  ),
  section(
    "Icon only",
    SIZES.map((s) =>
      btn(
        `area-button--outline area-button--neutral area-button--${s} area-button--icon-only`,
        icon,
        ' aria-label="Add"',
      ),
    ).join(""),
  ),
  section(
    "States",
    [
      btn("area-button--solid area-button--accent area-button--md", label("Default")),
      btn("area-button--solid area-button--accent area-button--md", label("Disabled"), " disabled"),
      btn("area-button--outline area-button--neutral area-button--md", label("Disabled"), " disabled"),
      btn("area-button--solid area-button--accent area-button--md", label("Focus"), ' id="focusme"'),
    ].join(""),
  ),
].join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Area — Button</title>
<style>${css}</style>
<style>
@layer area.base {
  body { padding: 40px; display: flex; flex-direction: column; gap: 32px; max-width: 900px; }
  h1 { font-size: var(--area-heading-lg-size); line-height: var(--area-heading-lg-leading);
       letter-spacing: var(--area-heading-lg-tracking); font-weight: var(--area-weight-semibold); }
  h2 { font-size: var(--area-text-xs-size); line-height: var(--area-text-xs-leading);
       letter-spacing: 0.06em; text-transform: uppercase; color: var(--area-fg-muted);
       font-weight: var(--area-weight-medium); margin-bottom: 12px; }
  section { display: flex; flex-direction: column; }
  .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
}
</style>
</head>
<body>
<h1>Button</h1>
${body}
<script>document.getElementById('focusme').focus();</script>
</body>
</html>
`;

writeFileSync(join(root, "dist", "button-demo.html"), html, "utf8");
console.log("  dist/button-demo.html");
