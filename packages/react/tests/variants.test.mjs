import { test } from "node:test";
import assert from "node:assert/strict";
import { stateAttributes } from "../dist/modules/index.js";

const manifest = {
  block: "area-a", description: "", variants: {}, defaults: {},
  states: ["open", "busy", "selected", "shown"],
  stateAttributes: { open: "open", busy: "aria-busy", shown: ":popover-open" },
};

test("stateAttributes writes each state's hook: data-*, ARIA or native", () => {
  assert.deepEqual(stateAttributes(manifest, { selected: true, busy: true, open: true }), { "data-selected": "", "aria-busy": "true", open: true });
  assert.deepEqual(stateAttributes(manifest, { selected: false }), {});
});

test("a pseudo-class hook is the browser's, so stateAttributes writes no attribute for it", () => {
  assert.deepEqual(stateAttributes(manifest, { shown: true }), {});
  assert.deepEqual(stateAttributes(manifest, { shown: true, selected: true }), { "data-selected": "" });
});

test("stateAttributes rejects an undeclared state", () => {
  assert.throws(() => stateAttributes(manifest, { dragging: true }), RangeError);
});
