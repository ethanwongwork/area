// @area/icons after `npm run build -w @area/icons`: the entries split by review status, every component draws
// exactly what the docs' pilot component draws, and the static files cover every icon.
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "esbuild";

const dist = new URL("../dist/", import.meta.url).pathname;
const { icons } = await import(dist + "modules/meta.js");
const main = await import(dist + "modules/index.js");
const review = await import(dist + "modules/review.js");
const pilotSrc = new URL("../../../apps/docs/src/pilot-icons.tsx", import.meta.url).pathname;
// Bundled inside the package (gitignored .cache) so the bundle resolves the workspace's react.
const out = new URL("../.cache/pilot-icons.mjs", import.meta.url).pathname;
await build({ entryPoints: [pilotSrc], bundle: true, format: "esm", platform: "node", outfile: out, external: ["react", "react-dom"], jsx: "automatic", logLevel: "error" });
const { PILOT_ICONS } = await import(out);

test("one record per pilot icon, names unique", () => {
  assert.equal(icons.length, PILOT_ICONS.length);
  assert.deepEqual(icons.map(i => i.name).sort(), PILOT_ICONS.map(i => i.name).sort());
  assert.equal(new Set(icons.map(i => i.component)).size, icons.length);
});

test("the main entry has exactly the approved icons, review the rest", () => {
  const approved = icons.filter(i => i.status === "approved");
  assert.ok(approved.length > 0);
  assert.deepEqual(Object.keys(main).sort(), approved.flatMap(i => [i.component, i.filledComponent]).sort());
  assert.deepEqual(Object.keys(review).sort(), icons.filter(i => i.status !== "approved").flatMap(i => [i.component, i.filledComponent]).sort());
});

test("turns follow their base, aliases the icon they copy", () => {
  const by = Object.fromEntries(icons.map(i => [i.name, i]));
  for (const i of icons) {
    if (i.derivedFrom) assert.ok(by[i.derivedFrom], `${i.name}: base ${i.derivedFrom}`);
    if (i.aliasOf) assert.ok(by[i.aliasOf], `${i.name}: alias of ${i.aliasOf}`);
  }
});

test("every component draws what the docs' pilot component draws", async () => {
  const strip = s => s.replace(/area-icon-[A-Za-z0-9]+/g, "ID");
  for (const p of PILOT_ICONS) {
    const meta = icons.find(i => i.name === p.name), mod = await import(`${dist}modules/generated/icons/${p.name}.js`);
    for (const props of [{}, { size: 24 }, { weight: 1.125, size: 20 }]) {
      assert.equal(strip(renderToStaticMarkup(createElement(mod[meta.component], props))), strip(renderToStaticMarkup(createElement(p.Icon, props))), `${p.name} outline`);
      assert.equal(strip(renderToStaticMarkup(createElement(mod[meta.filledComponent], props))), strip(renderToStaticMarkup(createElement(p.Filled, props))), `${p.name} filled`);
    }
  }
});

test("raw SVGs at 16, 20 and 24, and a sprite symbol for each icon", () => {
  const sprite = readFileSync(dist + "sprite.svg", "utf8");
  assert.doesNotMatch(sprite.slice(0, 200), /display:\s*none/, "masks in a display:none sprite never apply");
  for (const s of [16, 20, 24]) assert.equal(readdirSync(`${dist}svg/${s}`).length, icons.length * 2);
  for (const { name } of icons) for (const suffix of ["", "-filled"]) {
    const file = readFileSync(`${dist}svg/16/${name}${suffix}.svg`, "utf8");
    assert.match(file, /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.doesNotMatch(file, /aria-hidden|area-icon-/);
    assert.ok(sprite.includes(`<symbol id="area-${name}${suffix}" `), `sprite: ${name}${suffix}`);
  }
  assert.ok(existsSync(dist + "icons.json"));
});
