import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Panel, PanelSection, PanelRow, PanelStack, MANIFESTS } from "../dist/modules/index.js";

for (const [axis, values] of Object.entries(MANIFESTS.panel.variants)) {
  for (const value of values) {
    // packages/styles/src/manifest.ts:427; packages/react/src/components/primitives.tsx:549.
    test(`Panel ${axis}=${value} renders its manifest hook`, () => {
      const html = renderToString(h(Panel, { title: "Inspector", [axis]: value }));
      const root = html.match(/<div\b[^>]*>/)[0];
      assert.ok(root.match(/class="([^"]*)"/)[1].split(" ").includes(`${MANIFESTS.panel.block}--${value}`), root);
    });
  }
}

// packages/react/src/components/primitives.tsx:491-562,636-657: titled region, disjoint bar/body/footer and captioned row group.
test("Panel composes a named region with sections, rows, stacks and footer", () => {
  const html = renderToString(h(Panel, { title: "Inspector", id: "inspector", className: "custom", "aria-describedby": "help", flush: true, bareBar: true, bareFooter: true, actionColumn: true, action: h("button", { "aria-label": "Close inspector" }, "Close"), footer: "Footer" }, h(PanelSection, { heading: "Layout", headingLevel: 4, actions: h("button", { "aria-label": "Add layout" }, "+") }, h(PanelRow, { label: ["Width", "Height"], action: h("button", { "aria-label": "Link dimensions" }, "Link") }, h("input", { "aria-label": "Width" }), h("input", { "aria-label": "Height" })), h(PanelStack, { id: "stack", className: "custom-stack" }, "Details"))));
  const root = html.match(/<div[^>]*>/)[0];
  for (const attr of ['id="inspector"', 'role="region"', 'aria-describedby="help"']) assert.ok(root.includes(attr));
  assert.match(root, /class="[^"]* custom"/);
  for (const flag of MANIFESTS.panel.booleans) assert.ok(root.includes(`area-panel--${flag}`));
  const title = root.match(/aria-labelledby="([^"]+)"/)[1];
  assert.ok(html.includes(`class="area-panel__title" id="${title}">Inspector`));
  assert.match(html, /<header class="area-panel__bar">/);
  // The body is a ScrollArea; sections sit inside its content slot.
  assert.match(html, /<\/header><div class="[^"]*\barea-panel__body"><div class="area-scroll-area__viewport"><div class="area-scroll-area__content"><section/);
  assert.match(html, /<h4 class="area-panel__heading-text">Layout<\/h4><span class="area-panel__actions"><button/);
  const row = html.match(/<div role="group"[^>]*>/)[0];
  const labels = [...html.matchAll(/<span id="([^"]+)" class="area-panel__row-label">/g)].map(m => m[1]);
  assert.equal(labels.length, 2);
  assert.ok(row.includes(`aria-labelledby="${labels.join(" ")}"`));
  assert.match(html, /area-panel__row-controls"><input aria-label="Width"\/><input aria-label="Height"\/><\/div><div class="area-panel__row-action"><button/);
  assert.match(html, /class="area-panel__stack custom-stack" id="stack">Details/);
  assert.match(html, /<footer class="area-panel__footer">Footer<\/footer>/);
});

// packages/react/src/components/primitives.tsx:491-551,515-518: aria-label overrides title; separator controls the resizable region.
test("Panel resize handle exposes the controlled region, width and limits", () => {
  for (const [width, limit] of [[240, "min"], [320, undefined], [500, "max"]]) {
    const html = renderToString(h(Panel, { title: "Inspector", "aria-label": "Properties", id: "panel", resizable: "start", width }));
    const root = html.match(/<div[^>]*>/)[0];
    assert.match(root, /role="region" aria-label="Properties"/);
    assert.doesNotMatch(root, /aria-labelledby/);
    assert.match(root, /data-resizable=""/);
    assert.ok(root.includes(`--area-panel-inline-size:${width}px`));
    const handle = html.match(/<div role="separator"[^>]*>/)[0];
    for (const attr of ['tabindex="0"', 'data-edge="start"', 'aria-orientation="vertical"', 'aria-controls="panel"', 'aria-label="Resize Properties"', `aria-valuenow="${width}"`, 'aria-valuemin="240"', 'aria-valuemax="500"']) assert.ok(handle.includes(attr));
    assert.equal(handle.includes('data-limit='), !!limit);
    if (limit) assert.ok(handle.includes(`data-limit="${limit}"`));
  }
});

// packages/react/src/components/primitives.tsx:584-619: native heading/button disclosure controls hidden rows; action stays outside toggle.
test("PanelSection renders both controlled and initial disclosure states", () => {
  for (const state of [{ open: false, defaultOpen: true }, { defaultOpen: false }, { open: true }]) {
    const open = state.open ?? state.defaultOpen;
    const html = renderToString(h(PanelSection, { ...state, heading: "Fill", collapsible: true, summary: "+2", id: "fill", className: "custom", "aria-label": "Fill section", actions: h("button", { "aria-label": "Add fill" }, "+") }, "Rows"));
    assert.match(html, /<section class="area-panel__section custom"[^>]*id="fill"[^>]*aria-label="Fill section"/);
    const toggle = html.match(/<button[^>]*aria-expanded[^>]*>/)[0];
    assert.ok(toggle.includes(`aria-expanded="${open}"`));
    const target = toggle.match(/aria-controls="([^"]+)"/)[1];
    assert.ok(html.includes(`<div id="${target}" class="area-panel__rows"${open ? "" : ' hidden=""'}>Rows</div>`));
    assert.equal(html.includes('data-collapsed=""'), !open);
    assert.equal(html.includes('area-panel__summary'), !open);
    assert.match(html, /<\/button><\/h3><span class="area-panel__actions"><button aria-label="Add fill"/);
  }
});

// Inspector panel study (owner 2026-10-30): a section's count is part of its heading; revealActions marks the section.
test("PanelSection count sits in the heading, and revealActions needs actions", () => {
  const plain = renderToString(h(PanelSection, { heading: "Snapshots", count: 3 }, "rows"));
  assert.match(plain, /<h3 class="area-panel__heading">Snapshots<span class="area-panel__count">3<\/span><\/h3>/);
  const revealed = renderToString(h(PanelSection, { heading: "Tile", revealActions: true, actions: h("button", { "aria-label": "Pin" }) }, "rows"));
  assert.match(revealed, /class="area-panel__section area-panel__section--reveal"/);
  const bare = renderToString(h(PanelSection, { heading: "Tile", revealActions: true }, "rows"));
  assert.doesNotMatch(bare, /--reveal/);
  const collapsible = renderToString(h(PanelSection, { heading: "Code", collapsible: true, count: "12 lines" }, "rows"));
  assert.match(collapsible, /<span class="area-panel__toggle-text">Code<span class="area-panel__count">12 lines<\/span><\/span>/);
});
