import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Dialog, Button } from "../dist/modules/index.js";

test("Dialog renders a labelled dialog surface with a heading and a ghost Button close", () => {
  const html = renderToString(h(Dialog, { title: "Title", description: "Description" }, "Body"));
  assert.match(html, /^<div role="dialog" aria-modal="true" aria-labelledby="([^"]+)-title" aria-describedby="\1-description" class="area-dialog"/);
  assert.match(html, /<h2 class="area-dialog__title" id="[^"]+-title">Title<\/h2>/);
  assert.match(html, /<p class="area-dialog__description" id="[^"]+-description">Description<\/p>/);
  assert.match(html, /class="area-button[^"]*area-button--ghost[^"]*area-button--neutral[^"]*area-dialog__close"[^>]*aria-label="Close dialog"/);
  assert.match(html, /data-area-glyph="dismiss"/);
});

test("Dialog without a close renders no button", () => {
  const html = renderToString(h(Dialog, { title: "Title", showCloseButton: false }));
  assert.doesNotMatch(html, /area-dialog__close/);
});

test("Dialog with a trigger renders the trigger and a native modal dialog that carries the name", () => {
  const html = renderToString(h(Dialog, { title: "Title", description: "Description", trigger: h(Button, null, "Open") }, "Body"));
  const modalId = html.match(/<dialog[^>]*id="([^"]+)"/)[1];
  assert.match(html, new RegExp(`<button[^>]*aria-haspopup="dialog"[^>]*aria-controls="${modalId}"`));
  assert.match(html, /<dialog[^>]*class="area-dialog__modal"[^>]*aria-labelledby="[^"]+-title"[^>]*aria-describedby="[^"]+-description"/);
  assert.match(html, /<dialog[^>]*>\s*<div class="area-dialog"/, "the surface drops its own dialog role inside the native dialog");
  assert.doesNotMatch(html, /<dialog[^>]*\sopen/);
});

test("Toast marks the body as its description when there is a title, and names the dismiss", async () => {
  const { Toast } = await import("../dist/modules/index.js");
  const titled = renderToString(h(Toast, { title: "Saved", onDismiss: () => {} }, "Body"));
  assert.match(titled, /<div class="area-toast__title">Saved<\/div><div class="area-toast__description">Body<\/div>/);
  assert.match(titled, /class="area-button[^"]*area-button--ghost[^"]*area-button--neutral[^"]*"[^>]*aria-label="Dismiss notification"/);
  const plain = renderToString(h(Toast, null, "Body"));
  assert.doesNotMatch(plain, /area-toast__description/);
});

test("NumberField renders a letter scrub handle and hides the unit beside Mixed", async () => {
  const { NumberField } = await import("../dist/modules/index.js");
  const lettered = renderToString(h(NumberField, { "aria-label": "X position", defaultValue: 24, scrub: "X", unit: "px" }));
  assert.match(lettered, /<span class="area-number-field__scrub" aria-hidden="true" title="Drag to adjust">X<\/span>/);
  assert.match(lettered, /class="area-number-field__unit" aria-hidden="true">px</);
  const grip = renderToString(h(NumberField, { "aria-label": "Value", defaultValue: 1, scrub: true }));
  assert.match(grip, /area-number-field__scrub"[^>]*data-glyph=""/);
  const mixed = renderToString(h(NumberField, { "aria-label": "Spacing", mixed: true, unit: "px" }));
  assert.doesNotMatch(mixed, /area-number-field__unit/);
});

test("PanelRow names its group by its captions and reserves an action column", async () => {
  const { PanelRow, PanelSection } = await import("../dist/modules/index.js");
  const html = renderToString(h(PanelRow, { label: ["Opacity", "Corner radius"], action: h("button", null, "x") }, h("span", null, "a"), h("span", null, "b")));
  const ids = [...html.matchAll(/id="([^"]+-label-\d)"/g)].map(m => m[1]);
  assert.equal(ids.length, 2);
  assert.match(html, new RegExp(`role="group" aria-labelledby="${ids.join(" ")}" class="area-panel__row"`));
  assert.match(html, /class="area-panel__row-controls"><span>a<\/span><span>b<\/span><\/div><div class="area-panel__row-action">/);
  const section = renderToString(h(PanelSection, { heading: "Fill", actions: h("button", null, "+") }));
  assert.match(section, /<div class="area-panel__heading"><h3 class="area-panel__heading-text">Fill<\/h3><span class="area-panel__actions">/);
});

test("PropertyList draws handles only when reorderable with two or more items", async () => {
  const { PropertyList, PropertyListItem } = await import("../dist/modules/index.js");
  const two = renderToString(h(PropertyList, { label: "Fills", onReorder: () => {} }, h(PropertyListItem, { key: "a", label: "Red fill", actions: h("button", null, "-") }, "A"), h(PropertyListItem, { key: "b", label: "Blue fill", inactive: true }, "B")));
  assert.match(two, /<ul aria-label="Fills" aria-describedby="[^"]+" class="area-property-list">/);
  assert.equal((two.match(/class="area-property-list__handle"/g) ?? []).length, 2);
  assert.match(two, /aria-label="Reorder Blue fill, position 2 of 2"/);
  assert.match(two, /<li class="area-property-list__item" data-inactive="">/);
  const one = renderToString(h(PropertyList, { label: "Fills", onReorder: () => {} }, h(PropertyListItem, { label: "Red fill" }, "A")));
  assert.doesNotMatch(one, /area-property-list__handle/);
  const fixed = renderToString(h(PropertyList, { label: "Fills" }, h(PropertyListItem, { key: "a", label: "A" }, "A"), h(PropertyListItem, { key: "b", label: "B" }, "B")));
  assert.doesNotMatch(fixed, /area-property-list__handle/);
});

test("A collapsible PanelSection is a heading button that controls its rows", async () => {
  const { PanelSection } = await import("../dist/modules/index.js");
  const closed = renderToString(h(PanelSection, { heading: "Selection colors", collapsible: true, defaultOpen: false, summary: "+2", actions: h("button", null, "+") }, h("span", null, "row")));
  const rows = closed.match(/aria-controls="([^"]+)"/)[1];
  assert.match(closed, /<section class="area-panel__section" data-collapsed="">/);
  assert.match(closed, /<h3 class="area-panel__heading-text"><button type="button" class="area-panel__toggle" aria-expanded="false"/);
  assert.match(closed, /<span class="area-panel__summary">\+2<\/span>/);
  assert.match(closed, new RegExp(`<div id="${rows}" class="area-panel__rows" hidden="">`));
  assert.match(closed, /<\/h3><span class="area-panel__actions">/, "actions stay outside the toggle");
  const open = renderToString(h(PanelSection, { heading: "Layout", collapsible: true, summary: "x" }, h("span", null, "row")));
  assert.match(open, /aria-expanded="true"/);
  assert.doesNotMatch(open, /area-panel__summary/);
});

test("BoxField links padding as a horizontal/vertical pair and splits it per side", async () => {
  const { BoxField } = await import("../dist/modules/index.js");
  const linked = renderToString(h(BoxField, { label: "Padding", defaultValue: [16, 24, 16, 24], name: "padding" }));
  assert.match(linked, /role="group" aria-labelledby="([^"]+)" class="area-box-field area-box-field--md"/);
  assert.match(linked, /<span id="[^"]+" class="area-box-field__label">Padding<\/span>/);
  assert.deepEqual([...linked.matchAll(/aria-label="([^"]+ padding)"/g)].map(m => m[1]), ["Horizontal padding", "Vertical padding"]);
  assert.match(linked, /aria-pressed="false" aria-label="Individual padding per side"/);
  assert.match(linked, /<input type="hidden" name="padding" value="16 24 16 24"\/>/);
  const split = renderToString(h(BoxField, { label: "Padding", defaultIndependent: true, defaultValue: [8, 24, 16, 12] }));
  assert.deepEqual([...split.matchAll(/aria-label="((?:Left|Top|Right|Bottom) padding)"/g)].map(m => m[1]), ["Left padding", "Top padding", "Right padding", "Bottom padding"], "each axis keeps its column");
  assert.match(split, /aria-pressed="true"/);
  const mixed = renderToString(h(BoxField, { label: "Padding", defaultValue: [8, 24, 16, 12] }));
  assert.equal((mixed.match(/placeholder="Mixed"/g) ?? []).length, 2);
});

test("BoxField corners: one wide field linked, four in place split, no toggle when fixed", async () => {
  const { BoxField } = await import("../dist/modules/index.js");
  const linked = renderToString(h(BoxField, { kind: "corners", label: "Corner radius", defaultValue: [8, 8, 8, 8] }));
  assert.match(linked, /area-box-field__field area-box-field__field--wide/);
  assert.match(linked, /aria-label="Corner radius"/);
  const split = renderToString(h(BoxField, { kind: "corners", label: "Corner radius", independent: true, toggle: false, defaultValue: [12, 12, 0, 0] }));
  assert.deepEqual([...split.matchAll(/aria-label="([^"]+) corner radius"/g)].map(m => m[1]), ["Top left", "Top right", "Bottom left", "Bottom right"]);
  assert.doesNotMatch(split, /area-box-field__toggle/);
});

test("A resizable Panel renders a named window-splitter separator with its width", async () => {
  const { Panel } = await import("../dist/modules/index.js");
  const html = renderToString(h(Panel, { resizable: "start", defaultWidth: 240, maxWidth: 360, title: "Design", flush: true }, "rows"));
  assert.match(html, /^<div id="([^"]+)" role="region" aria-labelledby="[^"]+-title" class="area-panel[^"]*area-panel--flush" data-resizable="" style="--area-panel-inline-size:240px">/);
  const id = html.match(/^<div id="([^"]+)"/)[1];
  assert.match(html, new RegExp(`<div role="separator" tabindex="0" class="area-panel__resize" data-edge="start" data-limit="min" aria-orientation="vertical" aria-controls="${id}" aria-label="Resize Design" aria-valuenow="240" aria-valuemin="240" aria-valuemax="360" aria-valuetext="240 pixels \\(minimum\\)"></div>`));
  const fixed = renderToString(h(Panel, { title: "Design" }, "rows"));
  assert.doesNotMatch(fixed, /area-panel__resize|data-resizable|style=|<div id=/);
  assert.match(fixed, /^<div role="region" aria-labelledby="([^"]+)" class="area-panel[^"]*">.*<span class="area-panel__title" id="\1">Design<\/span>/);
  const level = renderToString(h((await import("../dist/modules/index.js")).PanelSection, { heading: "Layout", headingLevel: 2 }));
  assert.match(level, /<h2 class="area-panel__heading">Layout<\/h2>/);
});

test("Combobox is a WAI list-autocomplete combobox over a Menu-styled listbox", async () => {
  const { Combobox } = await import("../dist/modules/index.js");
  const options = [{ value: "inter", label: "Inter" }, { value: "geist", label: "Geist", group: "Recent" }];
  const html = renderToString(h(Combobox, { "aria-label": "Font", options, defaultValue: "inter" }));
  const list = html.match(/aria-controls="([^"]+)"/)[1];
  assert.match(html, /<input class="area-input__control" aria-label="Font" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="[^"]+" autoComplete="off" value="Inter"/);
  assert.match(html, /class="area-input__action-button" aria-label="Show suggestions"/);
  assert.match(html, /tabindex="-1"/i);
  assert.match(html, new RegExp(`<div id="${list}" role="listbox" aria-label="Font" popover="manual" class="area-menu area-combobox__listbox"`));
  assert.match(html, /role="option" aria-selected="true" class="area-menu__item area-combobox__option"><span class="area-menu__text">Inter<\/span>/);
  assert.match(html, /role="group" aria-labelledby="[^"]+" class="area-combobox__group"><div id="[^"]+" class="area-menu__label" role="presentation">Recent<\/div>/);
});

test("CommandPalette is a search combobox over a grouped listbox of Menu rows", async () => {
  const { CommandPalette } = await import("../dist/modules/index.js");
  const items = [{ id: "a", label: "Roadmap", group: "Recent" }, { id: "b", label: "Settings", shortcut: ["cmd", ","], group: "Actions" }, { id: "c", label: "Trash", disabled: true, group: "Actions" }];
  const html = renderToString(h(CommandPalette, { inline: true, items }));
  assert.match(html, /^<div role="search" aria-label="Command palette" class="area-command-palette area-command-palette--inline">/);
  assert.match(html, /<input class="area-command-palette__input" role="combobox" aria-label="Command palette" aria-expanded="true" aria-controls="([^"]+)" aria-autocomplete="list" aria-activedescendant="[^"]+-item-0"/);
  assert.match(html, /role="listbox" aria-label="Command palette" class="area-command-palette__list"/);
  assert.equal((html.match(/role="group"/g) ?? []).length, 2);
  assert.match(html, /role="option" aria-selected="false" aria-disabled="true" class="area-menu__item area-command-palette__item"/);
  assert.match(html, /aria-label="Command plus ,"/);
  const empty = renderToString(h(CommandPalette, { inline: true, items, defaultQuery: "zzz" }));
  assert.match(empty, /area-command-palette__empty" role="presentation">No results</);
});

test("ContextMenu wraps its area without a box and keeps a closed, named popover menu", async () => {
  const { ContextMenu, MenuItem } = await import("../dist/modules/index.js");
  const html = renderToString(h(ContextMenu, { label: "Page actions", menu: h(MenuItem, null, "Copy link") }, h("div", null, "Area")));
  assert.match(html, /^<div class="area-context-menu"><div>Area<\/div><div role="menu" class="area-menu area-context-menu__menu" popover="auto" aria-label="Page actions" tabindex="-1"><\/div><\/div>$/);
});

test("HoverCard anchors a Popover-surface card to its link and adds nothing to the link's name", async () => {
  const { HoverCard } = await import("../dist/modules/index.js");
  const html = renderToString(h(HoverCard, { trigger: h("a", { href: "#ada" }, "@ada") }, "Ada Lovelace"));
  assert.match(html, /^<span class="area-popover-anchor" style="--_popover-anchor:--area-hover-card-[^"]+"><a href="#ada">@ada<\/a>/);
  assert.match(html, /<div id="[^"]+-hover-card" popover="manual" class="area-popover area-popover--bottom area-hover-card">Ada Lovelace<\/div>/);
  assert.doesNotMatch(html, /aria-describedby|role="tooltip"/);
});

test("PromptSuggestions lists named prompt buttons with optional dismiss buttons", async () => {
  const { PromptSuggestions } = await import("../dist/modules/index.js");
  const html = renderToString(h(PromptSuggestions, { suggestions: [{ id: "a", label: "Summarize notes" }], onDismiss: () => {} }));
  assert.match(html, /^<ul aria-label="Suggestions" class="area-prompt-suggestions area-prompt-suggestions--list"><li class="area-prompt-suggestions__row"><button type="button" class="area-prompt-suggestions__item"><span class="area-prompt-suggestions__text">Summarize notes<\/span><\/button>/);
  assert.match(html, /aria-label="Dismiss “Summarize notes”"/);
  const plain = renderToString(h(PromptSuggestions, { suggestions: [{ id: "a", label: "Summarize notes" }] }));
  assert.doesNotMatch(plain, /area-prompt-suggestions__dismiss/);
});

test("PromptSuggestions chips layout renders outline Buttons without dismiss", async () => {
  const { PromptSuggestions } = await import("../dist/modules/index.js");
  const html = renderToString(h(PromptSuggestions, { layout: "chips", suggestions: [{ id: "a", label: "Summarize notes" }], onDismiss: () => {} }));
  assert.match(html, /class="area-prompt-suggestions area-prompt-suggestions--chips"/);
  assert.match(html, /area-button--outline area-button--neutral/);
  assert.doesNotMatch(html, /Dismiss/);
});

test("Message names its author and places the bubble, prose, cursor and actions", async () => {
  const { Message, MessageActions } = await import("../dist/modules/index.js");
  const user = renderToString(h(Message, { author: "user", actions: h(MessageActions, null, h("button", null, "c")) }, "Hi"));
  assert.match(user, /^<article aria-label="You said" class="area-message area-message--user"><div class="area-message__bubble">Hi<\/div><div role="group" aria-label="Message actions" class="area-message__actions">/);
  const streaming = renderToString(h(Message, { author: "assistant", authorName: "ChatGPT", streaming: true }, "Partial"));
  assert.match(streaming, /aria-label="ChatGPT said" aria-busy="true" class="area-message area-message--assistant" data-streaming="">/);
  assert.match(streaming, /<div class="area-message__content"><p>Partial<span class="area-message__cursor" aria-hidden="true"><\/span><\/p><\/div>/);
});

test("ScrollToLatest renders a hidden round outline button until the reader scrolls away", async () => {
  const { ScrollToLatest } = await import("../dist/modules/index.js");
  const html = renderToString(h(ScrollToLatest, { scrollRef: { current: null } }));
  assert.match(html, /^<div class="area-scroll-to-latest"><button type="button" class="area-button area-button--outline area-button--neutral area-button--md area-button--icon-only area-button--pill" aria-label="Scroll to latest" tabindex="-1" aria-hidden="true"/);
});

test("ModelPicker is a ghost menu button over single-choice Menu rows with notes", async () => {
  const { ModelPicker } = await import("../dist/modules/index.js");
  const html = renderToString(h(ModelPicker, { defaultValue: "b", models: [{ value: "a", label: "Auto" }, { value: "b", label: "Instant", description: "Answers right away" }] }));
  assert.match(html, /aria-haspopup="menu" aria-expanded="false" aria-controls="[^"]+-menu" aria-label="Model: Instant"/);
  assert.match(html, /<div role="menu" class="area-menu area-model-picker__menu" id="[^"]+-menu" popover="auto" aria-label="Model">/);
  assert.match(html, /role="menuitemradio" aria-checked="true"[^>]*><span class="area-menu__lines"><span class="area-menu__text">Instant<\/span><span class="area-menu__description">Answers right away<\/span><\/span>/);
});
