/**
 * CSS <-> manifest parity.
 *
 * The highest-leverage check in the repo. It walks the built stylesheet and fails if:
 *
 *   - a variant the manifest declares has no selector implementing it, or
 *   - a selector exists under a component's block that the manifest never declared.
 *
 * Both directions matter. The first catches a React prop that renders a class doing
 * nothing -- the failure mode where a component silently ignores half its API. The
 * second catches CSS that has grown past its declared surface, which is how a component
 * ends up with variants nobody documented and nobody can safely remove.
 */
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

const { MANIFESTS } = await import(join(root, "src", "manifest.ts"));
const css = readFileSync(join(root, "dist", "area.css"), "utf8");

/** Strip comments so a commented-out selector never counts as implemented. */
const source = css.replace(/\/\*[\s\S]*?\*\//g, "");

const problems = [];

for (const [name, manifest] of Object.entries(MANIFESTS)) {
  const { block } = manifest;

  if (!new RegExp(`\\.${block}\\b`).test(source)) {
    problems.push(`${name}: no rule defines the base class .${block}`);
    continue;
  }

  // Forward: every declared variant and boolean must have a selector.
  const declared = new Set();
  for (const values of Object.values(manifest.variants)) {
    for (const value of values) declared.add(`${block}--${value}`);
  }
  for (const flag of manifest.booleans ?? []) declared.add(`${block}--${flag}`);

  for (const className of declared) {
    if (!new RegExp(`\\.${className}\\b`).test(source)) {
      problems.push(`${name}: manifest declares "${className}" but no selector implements it`);
    }
  }

  // Every declared sub-element must exist too.
  for (const element of manifest.elements ?? []) {
    const className = `${block}__${element}`;
    if (!new RegExp(`\\.${className}\\b`).test(source)) {
      problems.push(`${name}: manifest declares element "${className}" but no selector implements it`);
    }
  }

  // Reverse: every modifier selector in the CSS must be declared.
  const used = new Set();
  for (const match of source.matchAll(new RegExp(`\\.${block}--([a-z0-9-]+)`, "g"))) {
    used.add(`${block}--${match[1]}`);
  }
  for (const className of used) {
    if (!declared.has(className)) {
      problems.push(
        `${name}: stylesheet defines "${className}" but the manifest does not declare it ` +
          `(add it to the manifest, or delete the rule)`,
      );
    }
  }

  // Every declared state must appear as a data attribute selector.
  for (const state of manifest.states ?? []) {
    if (!new RegExp(`\\[data-${state}\\]`).test(source)) {
      problems.push(`${name}: manifest declares state "${state}" but no [data-${state}] selector uses it`);
    }
  }

  // Defaults must name real variant values.
  for (const [group, value] of Object.entries(manifest.defaults)) {
    if (!manifest.variants[group]?.includes(value)) {
      problems.push(`${name}: default ${group}="${value}" is not among that group's declared values`);
    }
  }
}

if (problems.length > 0) {
  console.error(`\n  Manifest parity failed with ${problems.length} problem(s):\n`);
  for (const p of problems) console.error(`    ${p}`);
  console.error("");
  process.exit(1);
}

const count = Object.keys(MANIFESTS).length;
console.log(`  manifest parity ok  (${count} component${count === 1 ? "" : "s"})\n`);
