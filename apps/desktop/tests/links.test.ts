// Links in and out (docs/research/desktop-app-analysis-2026-11-10, U9): a place's area:// link and back, the same rule
// in the page and in the app, and Open in editor kept to a project's folder.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { hashOfLink, linkOf } from "../src/links.ts";
import { parsePlace, setProjects } from "../src/places.ts";

const require = createRequire(import.meta.url);
const links = require("../electron/links.cjs");

test("links: a place's link opens the same place", () => {
  setProjects([{ id: "launch", name: "Spring launch" }]);
  for (const place of [{ page: "preview", project: "launch" }, { page: "components", system: "area", item: "button" }, { page: "home" }] as const) {
    const link = linkOf(place as never);
    assert.match(link, /^area:\/\//);
    assert.deepEqual(parsePlace(hashOfLink(link)!), parsePlace(`#${link.slice("area://".length)}`), link);
  }
  assert.equal(linkOf({ page: "preview", project: "launch" }), "area://project/launch/preview");
  setProjects([]);
});

test("links: only Area's links, and only a path, pass; the page and the app agree", () => {
  const cases: Array<[unknown, string | null]> = [
    ["area://project/launch/preview", "#project/launch/preview"], ["area:project/launch", "#project/launch"], ["AREA://home/", "#home"],
    ["area://system/area/components/button%20group", "#system/area/components/button%20group"],
    ["https://example.com", null], ["area://", null], ["area://x?y=1", null], ["area://x#y", null], ["area://<script>", null],
    ["area://a b", null], ["javascript:area://x", null], [42, null],
  ];
  for (const [url, hash] of cases) {
    assert.equal(hashOfLink(url), hash, `page: ${String(url)}`);
    assert.equal(links.hashOfLink(url), hash, `app: ${String(url)}`);
  }
});

test("open in editor: only a file inside the project's folder, links followed", () => {
  const root = mkdtempSync(join(tmpdir(), "area-links-"));
  const folder = join(root, "shop"), outside = join(root, "secret.txt");
  mkdirSync(join(folder, "src"), { recursive: true });
  writeFileSync(join(folder, "src", "cart.tsx"), "x");
  writeFileSync(outside, "x");
  symlinkSync(outside, join(folder, "escape.txt"));
  assert.ok(links.inside(folder, join(folder, "src", "cart.tsx")));
  assert.ok(links.inside(folder, "src/cart.tsx"), "a path from the folder");
  assert.ok(links.inside(folder, folder), "the folder itself");
  assert.equal(links.inside(folder, outside), null);
  assert.equal(links.inside(folder, join(folder, "..", "secret.txt")), null);
  assert.equal(links.inside(folder, join(folder, "escape.txt")), null, "a link that leads out of the folder");
  assert.equal(links.inside("relative/folder", "x"), null);
  assert.equal(links.inside(folder, join(folder, "missing.tsx")), null);
  const cursor = links.EDITORS.find((editor: { id: string }) => editor.id === "cursor");
  assert.equal(cursor.url("/Users/david/My Shop/src/cart.tsx", 12), "cursor://file/Users/david/My%20Shop/src/cart.tsx:12");
  assert.equal(cursor.url("/a/b.ts"), "cursor://file/a/b.ts");
});
