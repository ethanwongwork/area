#!/usr/bin/env node
// Every `var(--area-*)` in the component CSS must name a token that exists. A reference to a
// missing custom property is not an error in CSS: the declaration silently becomes invalid
// at computed-value time, so a focus ring written against a misspelt token paints in
// `currentColor` and nothing fails. Public sizing hooks are the exception, and they are
// always written with a fallback: `var(--area-nav-inline-size, 200px)`.
import { readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokenCss = join(root, "../tokens/dist/css");
const walk = dir => readdirSync(dir, { withFileTypes: true })
  .flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);

const defined = new Set();
const collect = text => { for (const match of text.matchAll(/(--area-[a-z0-9-]+)\s*:/g)) defined.add(match[1]); };
for (const file of readdirSync(tokenCss).filter(f => f.endsWith(".css"))) collect(readFileSync(join(tokenCss, file), "utf8"));
const sources = walk(join(root, "src")).filter(f => f.endsWith(".css"));
for (const file of sources) collect(readFileSync(file, "utf8"));

const missing = [];
for (const file of sources) {
  readFileSync(file, "utf8").split("\n").forEach((line, index) => {
    for (const match of line.matchAll(/var\((--area-[a-z0-9-]+)\s*\)/g)) {
      if (!defined.has(match[1])) missing.push(`${basename(file)}:${index + 1} ${match[1]}`);
    }
  });
}

if (missing.length) {
  console.error(`Undefined token references (a hook needs a fallback; anything else is a typo):\n  ${missing.join("\n  ")}`);
  process.exit(1);
}
console.log(`Token references: ${sources.length} files checked, all defined.`);
