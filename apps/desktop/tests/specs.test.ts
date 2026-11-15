// The Specs tab (src/specs-tab.tsx, plan F7). Two parts:
//
// 1. The measuring's pure helpers (src/specs-measure.ts): a side written as border + shell + slot, a selector's state
//    taken out of its subject, specificity, top-level splitting.
// 2. The tab's numbers against the rendered check's (scripts/rendered, plan F1): Button, Input, Menu's row, Badge and
//    Dialog at the shipped defaults, light. It opens each family's Specs tab in headless Edge over the built app and
//    reads the Defaults column's height, sides (border and shell) and corner, then the same family's Default tile in
//    `.cache/rendered/check/<slug>/light.json`. It needs the built app (`npm run build -w @area/desktop`), a capture
//    (`npm run check:rendered`) and Edge or Chrome; without any of them it skips and says which (CI has none of them).
//    A capture older than the build may disagree for a reason that is not the tab's: re-run check:rendered first.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { side, sideText, specificity, splitTop, stripState, tokensNamed, readsPrivate } from "../src/specs-measure.ts";

test("a side is border + shell + slot, adding to the distance to the content", () => {
  const value = side(1, 9, 10);
  assert.deepEqual(value, { border: 1, shell: 9, slot: 0, total: 10 });
  assert.equal(sideText(value), "1 + 9 + 0 = 10 px");
  assert.equal(sideText(side(1, 6, 7.5)), "1 + 6 + 0.5 = 7.5 px");
});

test("a state's hooks come out of the selector's subject only", () => {
  assert.equal(stripState(".area-button:hover:not(:disabled, [data-disabled])", [":hover"]), ".area-button:not(:disabled, [data-disabled])");
  // The state is an ancestor's: the rule paints a child, not the element.
  assert.equal(stripState(".area-menu__item:hover .area-menu__icon", [":hover"]), null);
  // Inside :not() is not the state.
  assert.equal(stripState(".area-button:hover:not(:disabled)", [":disabled"]), null);
  assert.equal(stripState(".area-button--ghost[data-selected]", ["[data-selected]"]), ".area-button--ghost");
  assert.equal(stripState(".area-tabs__tab[aria-selected=\"true\"]", ['[aria-selected="true"]']), ".area-tabs__tab");
  // A hook must end where the name ends: [data-selected-x] is another attribute.
  assert.equal(stripState(".x[data-selected-x]", ["[data-selected"]), null);
});

test("specificity orders a state's rules", () => {
  assert.deepEqual(specificity(".area-button:hover"), [0, 2, 0]);
  assert.deepEqual(specificity(".area-button:hover:not(:disabled, [data-disabled])"), [0, 3, 0]);
  assert.deepEqual(specificity(":where(.a) .b"), [0, 1, 0]);
  assert.deepEqual(splitTop(".a, .b:not(.c, .d), .e"), [".a", ".b:not(.c, .d)", ".e"]);
});

test("declared values name their tokens", () => {
  assert.deepEqual(tokensNamed("var(--area-focus-width) solid var(--area-focus-color)"), ["focus-width", "focus-color"]);
  assert.equal(readsPrivate("var(--_bg-hover)"), true);
  assert.equal(readsPrivate("var(--area-bg-page)"), false);
});

/* --- Against the rendered check -------------------------------------------------------------------------------- */

const ROOT = fileURLToPath(new URL("../../../", import.meta.url));
const DIST = `${ROOT}apps/desktop/dist/index.html`;
const CHECK = `${ROOT}.cache/rendered/check`;

/** Each family's subject: the root, or a part (Menu's row), as its class in the capture and its part on the tab. */
const SUBJECTS = [
  { slug: "button", cls: "area-button", part: "root" },
  { slug: "input", cls: "area-input", part: "root" },
  { slug: "menu", cls: "area-menu__item", part: "item" },
  { slug: "badge", cls: "area-badge", part: "root" },
  { slug: "dialog", cls: "area-dialog", part: "root" },
];

interface CapturedNode { parent: number; cls: string; r: { h: number }; padding: number[]; border: Array<[number, string, string]>; radius: string[] }

function oracle(slug: string, cls: string) {
  const data = JSON.parse(readFileSync(`${CHECK}/${slug}/light.json`, "utf8")) as { tiles: Array<{ id: string; nodes: CapturedNode[] }> };
  const tile = data.tiles[0]!;
  const node = tile.nodes.find(entry => entry.cls.split(/\s+/).includes(cls));
  if (!node) return undefined;
  return { tile: tile.id, height: node.r.h, border: node.border[3]![0], shell: node.padding[3]!, endBorder: node.border[1]![0], endShell: node.padding[1]!, corner: Number.parseFloat(node.radius[0]!) };
}

async function browserReady(): Promise<string | undefined> {
  if (!existsSync(DIST)) return "no built app (npm run build -w @area/desktop)";
  if (!SUBJECTS.every(({ slug }) => existsSync(`${CHECK}/${slug}/light.json`))) return "no rendered capture (npm run check:rendered)";
  try { (await import("../../../scripts/rendered/cdp-lib.mjs")).browserPath(); } catch { return "no Edge or Chrome"; }
  return undefined;
}

test("the Specs tab's defaults equal the rendered check's measurements", { timeout: 240_000 }, async t => {
  const missing = await browserReady();
  if (missing) { t.skip(missing); return; }
  const { launch } = await import("../../../scripts/rendered/cdp-lib.mjs");
  const { serveCopy } = await import("../../../scripts/rendered/capture.mjs");
  const server = await serveCopy();
  const browser = await launch();
  const wait = (ms: number) => new Promise(done => setTimeout(done, ms));
  try {
    // One page, as the capture keeps one (a guest profile refuses a second tab), loaded afresh for each family.
    const page = await browser.newPage({ width: 1440, height: 900, scale: 1 });
    const stored = { "view:components-family-tab": "specs" };
    await page.call("Page.addScriptToEvaluateOnNewDocument", { source: `try { localStorage.clear(); localStorage.setItem("area-desktop", ${JSON.stringify(JSON.stringify(stored))}); } catch {}` });
    await page.call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: "light" }, { name: "prefers-reduced-motion", value: "reduce" }] });
    for (const { slug, cls, part } of SUBJECTS) {
      const expected = oracle(slug, cls);
      assert.ok(expected, `${slug}: no ${cls} in the capture's Default tile`);
      await page.goto(`${server.url}?theme=light&family=${slug}#system/area/components/${slug}`);
      const query = (spec: string) => `[data-spec-scope="defaults"][data-spec-part="${part}"][data-spec="${spec}"]`;
      let ready = false;
      for (let tries = 0; tries < 200 && !ready; tries++) { ready = await page.eval(`Boolean(document.querySelector('${query("height")}'))`); if (!ready) await wait(100); }
      assert.ok(ready, `${slug}: the Specs tab drew no height for ${part}`);
      const read = await page.eval(`(() => {
        const at = spec => document.querySelector('${query("")}'.replace('data-spec=""', 'data-spec="' + spec + '"'));
        const num = (el, key) => el ? Number(el.dataset[key]) : undefined;
        return { height: num(at("height"), "value"), corner: num(at("corner"), "value") ?? 0,
          border: num(at("start"), "border"), shell: num(at("start"), "shell"), endBorder: num(at("end"), "border"), endShell: num(at("end"), "shell") };
      })()`) as Record<string, number | undefined>;
      const close = (a: number | undefined, b: number, what: string) => assert.ok(a !== undefined && Math.abs(a - b) < 0.02, `${slug} ${part} ${what}: Specs ${a}, rendered check ${b} (tile ${expected!.tile})`);
      close(read.height, expected!.height, "height");
      close(read.corner, expected!.corner, "corner");
      if (read.border !== undefined) { close(read.border, expected!.border, "start border"); close(read.shell, expected!.shell, "start shell"); }
      if (read.endBorder !== undefined) { close(read.endBorder, expected!.endBorder, "end border"); close(read.endShell, expected!.endShell, "end shell"); }
      assert.ok(read.border !== undefined || read.endBorder !== undefined, `${slug}: the Specs tab drew no sides for ${part}`);
    }
  } finally {
    await browser.close();
    await server.close();
  }
});
