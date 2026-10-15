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
    for (const props of [{}, { size: 12 }, { weight: 1.125, size: 12 }, { size: 24 }, { weight: 1.125, size: 20 }]) {
      assert.equal(strip(renderToStaticMarkup(createElement(mod[meta.component], props))), strip(renderToStaticMarkup(createElement(p.Icon, props))), `${p.name} outline`);
      assert.equal(strip(renderToStaticMarkup(createElement(mod[meta.filledComponent], props))), strip(renderToStaticMarkup(createElement(p.Filled, props))), `${p.name} filled`);
    }
  }
});

test("raw SVGs at 12, 16, 20 and 24, and a sprite symbol for each icon", () => {
  const sprite = readFileSync(dist + "sprite.svg", "utf8");
  assert.doesNotMatch(sprite.slice(0, 200), /display:\s*none/, "masks in a display:none sprite never apply");
  for (const s of [12, 16, 20, 24]) assert.equal(readdirSync(`${dist}svg/${s}`).length, icons.length * 2);
  for (const { name } of icons) for (const suffix of ["", "-filled"]) {
    const file = readFileSync(`${dist}svg/16/${name}${suffix}.svg`, "utf8");
    assert.match(file, /^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.doesNotMatch(file, /aria-hidden|area-icon-/);
    assert.ok(sprite.includes(`<symbol id="area-${name}${suffix}" `), `sprite: ${name}${suffix}`);
  }
  assert.ok(existsSync(dist + "icons.json"));
});

test("decorative by default; title, aria-label or aria-labelledby name it as an image", () => {
  const { SearchIcon } = main;
  const html = props => renderToStaticMarkup(createElement(SearchIcon, props)).match(/^<svg[^>]*>/)[0];
  assert.match(html({}), /aria-hidden="true"/);
  assert.doesNotMatch(html({}), /role=/);
  assert.match(html({}), /focusable="false"/);
  for (const [props, name] of [[{ title: "Search" }, 'aria-label="Search"'], [{ "aria-label": "Find" }, 'aria-label="Find"'], [{ "aria-labelledby": "l" }, 'aria-labelledby="l"']]) {
    const tag = html(props);
    assert.match(tag, /role="img"/);
    assert.doesNotMatch(tag, /aria-hidden/);
    assert.ok(tag.includes(name), tag);
  }
  assert.doesNotMatch(renderToStaticMarkup(createElement(SearchIcon, { title: "Search" })), /<title>/, "no native tooltip");
  assert.match(html({ tabIndex: 0, title: "Search" }), /focusable="true"/);
});

test("icons tied to reading direction mirror in right-to-left text; mirrored overrides", () => {
  const rtl = icons.filter(i => i.rtl === "mirror").map(i => i.name);
  assert.ok(rtl.includes("reply") && rtl.includes("undo") && rtl.includes("indent"));
  for (const literal of ["arrow-left", "chevron-right", "rotate", "check", "search"]) assert.ok(!rtl.includes(literal), literal);
  const tag = (C, props = {}) => renderToStaticMarkup(createElement(C, props)).match(/^<svg[^>]*>/)[0];
  for (const meta of icons) {
    const mod = review[meta.component] ? review : main;
    for (const C of [mod[meta.component], mod[meta.filledComponent]])
      assert.equal(/data-area-rtl="mirror"/.test(tag(C)), meta.rtl === "mirror", meta.name);
  }
  const { ReplyIcon, SearchIcon } = main;
  assert.doesNotMatch(tag(ReplyIcon, { mirrored: false }), /data-area-rtl|scale/);
  assert.match(tag(ReplyIcon, { mirrored: true }), /style="scale:-1 1"/);
  assert.match(tag(SearchIcon, { mirrored: true, style: { color: "red" } }), /style="scale:-1 1;color:red"/);
  assert.match(readFileSync(new URL("../rtl.css", import.meta.url), "utf8"), /\[data-area-rtl="mirror"\]:dir\(rtl\) \{ scale: -1 1; \}/);
});

test("every icon has search keywords, never its own name or another icon's", () => {
  for (const i of icons) {
    assert.ok(i.keywords.length > 0, `${i.name}: keywords`);
    assert.ok(!i.keywords.includes(i.name), `${i.name}: its own name`);
  }
  const by = Object.fromEntries(icons.map(i => [i.name, i]));
  assert.ok(by["person-search"].names.lucide === "user-search");
  assert.ok(by.dismiss.keywords.includes("close") && by.add.names.lucide === "plus");
  assert.ok(!by.undo.keywords.includes("redo"), "a tag naming another icon is dropped");
});

test("a 12px cut draws on the 12px grid at size 12, turned with its base; other sizes scale the 16px drawing", () => {
  const by = Object.fromEntries(icons.map(i => [i.name, i]));
  for (const name of ["chevron-down", "chevron-right", "open", "info", "add", "check", "link", "bell", "arrow-up", "arrow-left", "globe"])
    assert.deepEqual(by[name].cuts, [12], name);
  for (const name of ["search", "dismiss", "help", "book"]) assert.equal(by[name].cuts, undefined, name);
  const { ChevronRightIcon, InfoIcon, SearchIcon } = main;
  const html = (C, props) => renderToStaticMarkup(createElement(C, props));
  // A numeric weight is an explicit 12px icon: the cut alone, in its own grid.
  assert.match(html(InfoIcon, { size: 12, weight: 1.125 }), /^<svg[^>]*viewBox="0 0 12 12" width="12" height="12"/);
  assert.match(html(ChevronRightIcon, { size: 12, weight: 1 }), /rotate\(270 6 6\)/);
  // The token line is the xs slot: both drawings, the cut shown where the slot is 12.
  const slot = html(InfoIcon, { size: 12 });
  assert.match(slot, /^<svg[^>]*viewBox="0 0 16 16" width="12" height="12"/);
  assert.match(slot, /<g style="opacity:calc\(1 - var\(--_glyph-cut, var\(--area-type-icon-xs-cut, 1\)\)\)"><circle cx="7\.5"/);  // info's 16px drawing sits on 7.5 for 1x (2026-10-14)
  assert.match(slot, /<g transform="scale\(1.333333\)" style="opacity:var\(--_glyph-cut, var\(--area-type-icon-xs-cut, 1\)\)"><circle cx="5.5"[^>]*stroke-width:calc\(var\(--area-weight-icon\) \* 0\.8786\)/);
  assert.match(html(InfoIcon, { size: 16 }), /viewBox="0 0 16 16"/);
  assert.doesNotMatch(html(InfoIcon, {}), /opacity/);
  assert.doesNotMatch(html(SearchIcon, { size: 12 }), /opacity|0 0 12 12/);
  assert.match(readFileSync(`${dist}svg/12/info.svg`, "utf8"), /viewBox="0 0 12 12"/);
  assert.match(readFileSync(`${dist}svg/12/info-filled.svg`, "utf8"), /viewBox="0 0 16 16"/, "filled at 12 scales the 16px drawing");
});

test("third-party ink is credited: source in the metadata, its library's licence in THIRD_PARTY_NOTICES.md", () => {
  const notices = readFileSync(new URL("../THIRD_PARTY_NOTICES.md", import.meta.url), "utf8");
  const credited = icons.filter(i => i.source);
  assert.deepEqual(credited.map(i => i.name).sort(), ["globe", "globe-off"]);
  for (const i of credited) {
    assert.ok(notices.includes(`## ${i.source.library}`), i.name);
    assert.match(notices, new RegExp(`\\| ${i.name} \\|`), `${i.name} listed`);
  }
  assert.deepEqual(icons.find(i => i.name === "globe").source, { library: "fluent", names: ["globe_16_regular", "globe_16_filled", "globe_12_regular"] });
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.ok(pkg.files.includes("THIRD_PARTY_NOTICES.md") && pkg.files.includes("CHANGELOG.md"));
});
