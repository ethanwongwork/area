import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Popover, PopoverHeader, PopoverTitle, PopoverDescription, PopoverBody, PopoverFooter, PopoverMedia, MANIFESTS } from "../dist/modules/index.js";

for (const side of MANIFESTS.popover.variants.side) {
  // packages/styles/src/manifest.ts:552; packages/react/src/components/primitives.tsx:1033: side and arrow hooks.
  test(`Popover side=${side} renders its manifest hook`, () => {
    const html = renderToString(h(Popover, { side, arrow: true }, "Details"));
    const root = html.match(/<div[^>]*>/)[0];
    const classes = root.match(/class="([^"]+)"/)[1].split(" ");
    assert.ok(classes.includes(`area-popover--${side}`));
    assert.ok(classes.includes("area-popover--arrow"));
  });
}

// packages/react/src/components/primitives.tsx:1033-1049: native surface props and documented compound parts, decorative arrow.
test("Popover composes a named inline dialog with header, body, media and footer", () => {
  const html = renderToString(h(Popover, { id: "details", className: "custom", role: "dialog", "aria-labelledby": "title", "aria-describedby": "description", arrow: true }, h(PopoverMedia, null, h("img", { src: "data:,", alt: "Preview" })), h(PopoverHeader, null, h(PopoverTitle, { id: "title" }, "Details"), h(PopoverDescription, { id: "description" }, "About this project")), h(PopoverBody, null, "Body"), h(PopoverFooter, null, h("button", { disabled: true }, "Continue"))));
  const root = html.match(/<div[^>]*>/)[0];
  for (const attr of ['id="details"', 'role="dialog"', 'aria-labelledby="title"', 'aria-describedby="description"']) assert.ok(root.includes(attr));
  assert.match(root, /class="[^"]* custom"/);
  assert.match(html, /area-popover__media"><img/);
  assert.match(html, /area-popover__header"><h2 class="area-popover__title" id="title">Details<\/h2><div class="area-popover__description" id="description">About this project/);
  assert.match(html, /area-popover__body">Body<\/div><div class="area-popover__footer"><button disabled="">Continue/);
  assert.match(html, /<svg class="area-popover__arrow"[^>]*aria-hidden="true" focusable="false"/);
});

// packages/react/src/components/Overlays.tsx:73-99; docs/specs/popover.md:110-111: trigger points at a nonmodal named dialog.
test("Popover connects its trigger and serializes controlled/initial expanded state", () => {
  for (const state of [{ open: false }, { open: true }, { defaultOpen: true }]) {
    const html = renderToString(h(Popover, { ...state, "aria-label": "Details", className: "custom", "aria-describedby": "help", trigger: h("button", { id: "trigger", disabled: true }, "Show details") }, h("button", null, "Continue")));
    const trigger = html.match(/<button[^>]*>/)[0];
    const surface = html.match(/<div[^>]*role="dialog"[^>]*>/)[0];
    const target = trigger.match(/aria-controls="([^"]+)"/)[1];
    for (const attr of ['id="trigger"', 'disabled=""', 'aria-haspopup="dialog"', `aria-expanded="${state.open ?? state.defaultOpen}"`, `popoverTarget="${target}"`]) assert.ok(trigger.includes(attr), attr);
    for (const attr of [`id="${target}"`, 'aria-label="Details"', 'aria-describedby="help"', 'popover="auto"', 'tabindex="-1"']) assert.ok(surface.includes(attr));
    assert.match(surface, /class="[^"]* custom"/);
    assert.doesNotMatch(surface, /aria-modal/);
  }
});

// packages/react/src/components/primitives.tsx:1034 and Overlays.tsx:99: native id in rest is overwritten by generated overlay props.
test.skip("Popover preserves a caller-provided surface id with a trigger (known bug: generated overlay id overwrites caller id)", () => {
  const html = renderToString(h(Popover, { id: "caller-surface", "aria-label": "Details", trigger: h("button", null, "Details") }, "Details"));
  const surface = html.match(/<div[^>]*role="dialog"[^>]*>/)[0];
  assert.match(surface, / id="caller-surface"/);
  assert.match(html.match(/<button[^>]*>/)[0], /aria-controls="caller-surface"/);
});
