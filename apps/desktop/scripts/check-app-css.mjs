#!/usr/bin/env node
/**
 * App CSS styles only app classes (docs/PRODUCT_UI.md, rule 13). This check reads the app's stylesheets
 * (src/studio.css and src/styles/*.css) and fails on any rule whose subject, the last compound of its selector, is an
 * Area class (`.area-*`): such a rule restyles a component from outside it. Area classes inside `:has()`, `:not()`,
 * `:is()` or `:where()`, or as an ancestor, only say where a rule applies and pass.
 *
 * KNOWN lists the rules that did this when the check was written (cursor-audit-2026-10-22.md item 10), each with what
 * it needs: a public hook or prop on the component (a gap, recorded in PRODUCT_UI.md "Open component gaps"), or an
 * app wrapper. Fixing one means removing it here; a new one fails.
 *
 *   node scripts/check-app-css.mjs
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const src = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const files = ["studio.css", ...readdirSync(join(src, "styles")).filter(name => name.endsWith(".css")).map(name => `styles/${name}`)];

const KNOWN = {
  // Gaps: the component needs a public hook or prop.
  ".area-list-box--grid .area-list-box__item.gallery-plain": "List box: a grid option whose content draws its own frame (no plate, the content's corner)",
  ".lang-state-hover.area-input": "a forced-state hook, so a specimen can show hover at rest (Theme previews)",
  ".lang-state-focus-field.area-input": "a forced-state hook (focus) for specimens",
  ".lang-state-lift.area-card": "a forced-state hook (lift) for specimens",
  ".area-menu__item.lang-state-pressed": "a forced-state hook (pressed) for specimens",
  ".ex-set-row__control .area-fieldset__legend": "Fieldset: a visually hidden legend option",
  // Placement: an app wrapper takes it.
  ".ex-side__foot .area-nav": "placement: an app wrapper hangs the Nav's plates",
  ".sc-pad > .area-badge": "placement: an app wrapper positions the Badge",
  ".sc-bm__mark > .area-badge": "placement: an app wrapper positions the Badge",
  // Abstract board: a reference piece's own paint on an Area component; move it to tokens on the scene's scope.
  ".sc-gold__actions .area-button": "Abstract board: the reference's mono face; set the font token on the scene",
  ".sc-glass--bar .area-button": "Abstract board: glass button tokens; set them on the bar's scope",
  ".sc-week__day .area-button": "Abstract board: the reference's 18px dates; a Button text-size hook",
  ".sc-light.area-button--caution": "Abstract board: a coloured glow; no Button hook for a coloured shadow",
  ".sc-light.area-button--success": "Abstract board: a coloured glow; no Button hook for a coloured shadow",
};

/** The subject compound of a selector: its last compound, with functional pseudo-classes removed. */
const subject = selector => {
  const parts = selector.trim().split(/\s*[>+~]\s*|\s+(?![^(]*\))/).filter(Boolean);
  return (parts.at(-1) ?? "").replace(/:(?:not|has|is|where)\((?:[^()]|\([^()]*\))*\)/g, "");
};
/** The selector as KNOWN writes it: functional pseudo-classes on the subject dropped. */
const key = selector => selector.trim().replace(/\s+/g, " ").replace(/:(?:not|has|is|where)\((?:[^()]|\([^()]*\))*\)$/g, "");

const found = new Map();
for (const file of files) {
  const text = readFileSync(join(src, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, prelude] of text.matchAll(/([^{};]+)\{[^{}]*\}/g)) {
    if (prelude.trim().startsWith("@")) continue;
    for (const selector of prelude.split(/,(?![^(]*\))/)) {
      if (/\.area-/.test(subject(selector))) found.set(key(selector), file);
    }
  }
}

const unknown = [...found].filter(([selector]) => !(selector in KNOWN));
const fixed = Object.keys(KNOWN).filter(selector => !found.has(selector));
console.log(`\n  app CSS: ${found.size} rules style an Area component (${found.size - unknown.length} known, each with its gap)`);
for (const selector of fixed) console.log(`  fixed, remove from KNOWN: ${selector}`);
if (unknown.length) {
  console.error("\n  New rules that restyle an Area component (product UI rule 13). Fix the component, add a public hook,");
  console.error("  or lay it out from an app wrapper:\n");
  for (const [selector, file] of unknown) console.error(`    ${file}: ${selector}`);
  process.exit(1);
}
