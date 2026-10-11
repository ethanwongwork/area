// The static half of @area/icons, rendered from the compiled components (dist/modules): raw SVGs at the size
// curve's masters (16, 20 and 24; larger sizes scale the 24 master, docs/specs/icons.md "Sizes"), a 16px sprite
// and icons.json. The line is Geist's --area-weight-icon (1.125px at 16) as a number, since a file can't read the token.
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const dist = new URL("../dist/", import.meta.url).pathname;
const { icons } = await import(dist + "modules/meta.js");
const WEIGHT = 1.125, SIZES = [16, 20, 24];
// Mask and clip ids are per file (area-<name>[-filled]…), so two inlined files never share one.
const svg = (C, size, id) => renderToStaticMarkup(createElement(C, { weight: WEIGHT, size }))
  .replace(/ aria-hidden="true"| focusable="false"/g, "").replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
  .replace(/area-icon-[A-Za-z0-9]+/g, id);
rmSync(dist + "svg", { recursive: true, force: true });
for (const s of SIZES) mkdirSync(`${dist}svg/${s}`, { recursive: true });
const symbols = [];
for (const meta of icons) {
  const mod = await import(`${dist}modules/generated/icons/${meta.name}.js`);
  const variants = [["", mod[meta.component]], ["-filled", mod[meta.filledComponent]]];
  for (const [suffix, C] of variants) {
    for (const s of SIZES) writeFileSync(`${dist}svg/${s}/${meta.name}${suffix}.svg`, svg(C, s, `area-${meta.name}${suffix}`) + "\n");
    const one = svg(C, 16, `area-${meta.name}${suffix}-m`);
    symbols.push(`<symbol id="area-${meta.name}${suffix}" viewBox="0 0 16 16" fill="none">${one.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</symbol>`);
  }
}
// Hidden by size, not display:none: masks inside a display:none tree don't apply, so the filled symbols that cut
// knockouts would draw as plain solids when the sprite is inlined.
writeFileSync(dist + "sprite.svg", `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute;overflow:hidden" aria-hidden="true">\n${symbols.join("\n")}\n</svg>\n`);
writeFileSync(dist + "icons.json", JSON.stringify(icons, null, 2) + "\n");
console.log(`  wrote ${icons.length * 2 * SIZES.length} SVGs, sprite.svg (${symbols.length} symbols), icons.json`);
