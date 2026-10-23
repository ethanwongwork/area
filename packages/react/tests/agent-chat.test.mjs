// The agent chat families (Phase 2 of docs/research/inspector-chat-2026-10-18): Step, StepGroup, Reasoning,
// EditSummary, EditSummaryFile, Diff, Approval, Plan and TurnNotice. Specs: docs/specs/{step,edit-summary,approval,
// plan,turn-notice}.md.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToString } from "react-dom/server";
import { Approval, Diff, EditSummary, EditSummaryFile, Plan, Reasoning, Step, StepGroup, TurnNotice } from "../dist/modules/index.js";

test("a Step is one line; with a body it is a button that opens it", () => {
  const plain = renderToString(h(Step, { verb: "Read", detail: "button.css" }));
  assert.match(plain, /^<div class="area-step"/);
  assert.doesNotMatch(plain, /<button/);
  assert.match(plain, /<span class="area-step__verb">Read<\/span><span class="area-step__detail">button\.css<\/span>/);
  const open = renderToString(h(Step, { verb: "Ran", detail: "npm test", defaultOpen: true }, "output"));
  const button = open.match(/<button[^>]*>/)[0];
  assert.match(button, /aria-expanded="true"/);
  const controls = button.match(/aria-controls="([^"]+)"/)[1];
  assert.match(open, new RegExp(`<div id="${controls}" class="area-step__body">output</div>`));
  assert.match(open, /data-open=""/);
  const closed = renderToString(h(Step, { verb: "Ran", detail: "npm test" }, "output"));
  assert.match(closed, /aria-expanded="false"/);
  assert.match(closed, /class="area-step__body" hidden=""/);
});

test("a running Step is busy and a failed one says so", () => {
  assert.match(renderToString(h(Step, { verb: "Reading", status: "running" })), /data-running="" aria-busy="true"/);
  const failed = renderToString(h(Step, { verb: "Ran", status: "failed" }));
  assert.match(failed, /data-failed=""/);
  assert.match(failed, /<span class="area-sr-only">Failed<\/span>/);
});

test("a StepGroup folds its steps on the rule; Reasoning reads Thinking, then Thought for Ns", () => {
  const group = renderToString(h(StepGroup, { verb: "Explored", detail: "3 items", defaultOpen: true }, h(Step, { verb: "Read", detail: "one" })));
  assert.match(group, /class="area-step area-step--group"/);
  assert.match(group, /<div class="area-step__items"><div class="area-step"/);
  const thinking = renderToString(h(Reasoning, { running: true }));
  assert.match(thinking, /area-step--reasoning/);
  assert.match(thinking, /<span class="area-step__verb">Thinking<\/span>/);
  assert.doesNotMatch(thinking, /<button/);
  const thought = renderToString(h(Reasoning, { seconds: 12 }, "summary"));
  assert.match(thought, /<span class="area-step__verb">Thought<\/span><span class="area-step__detail">for 12s<\/span>/);
  assert.match(thought, /<button/);
});

test("an Edit summary names itself, totals its files and speaks its counts", () => {
  const html = renderToString(h(EditSummary, { title: "Edited 1 file", added: 3, removed: 1, onKeepAll: () => {}, onUndoAll: () => {} },
    h(EditSummaryFile, { name: "button.css", added: 3, removed: 1, diff: h(Diff, { hunks: [] }) })));
  const id = html.match(/<section[^>]*aria-labelledby="([^"]+)"/)[1];
  assert.match(html, new RegExp(`id="${id}" class="area-edit-summary__title">Edited 1 file`));
  assert.match(html, /<span aria-hidden="true">\+3<\/span><span class="area-sr-only">3 added<\/span>/);
  assert.match(html, />Undo all<.*>Keep all</s);
  assert.match(html, /aria-label="Undo button\.css"/);
  assert.match(html, /aria-label="Keep button\.css"/);
  assert.match(html, /class="area-edit-summary__name" aria-expanded="false"/);
});

test("a kept or undone file settles: its actions leave and it says what happened", () => {
  const kept = renderToString(h(EditSummaryFile, { name: "a.css", added: 1, removed: 0, status: "kept" }));
  assert.match(kept, /data-kept=""/);
  assert.match(kept, /<span class="area-edit-summary__status">Kept<\/span>/);
  assert.doesNotMatch(kept, /Undo a\.css/);
  assert.match(renderToString(h(EditSummaryFile, { name: "a.css", added: 1, removed: 0, status: "undone" })), /data-undone=""[^]*>Undone</);
  // The deprecated `state` still works for a release; `status` wins.
  assert.match(renderToString(h(EditSummaryFile, { name: "a.css", added: 1, removed: 0, state: "kept" })), /data-kept=""/);
  assert.match(renderToString(h(EditSummaryFile, { name: "a.css", added: 1, removed: 0, status: "undone", state: "kept" })), /data-undone=""/);
});

test("a file's diff opens from defaultOpen, or from a controlled open", () => {
  const diff = h(Diff, { hunks: [] });
  assert.match(renderToString(h(EditSummaryFile, { name: "a.css", added: 1, removed: 0, diff, defaultOpen: true })), /aria-expanded="true"[^]*area-edit-summary__diff/);
  const controlled = renderToString(h(EditSummaryFile, { name: "a.css", added: 1, removed: 0, diff, open: true, defaultOpen: false, onOpenChange: () => {} }));
  assert.match(controlled, /data-open=""/);
  assert.match(controlled, /aria-expanded="true"/);
  assert.doesNotMatch(renderToString(h(EditSummaryFile, { name: "a.css", added: 1, removed: 0, diff, open: false, defaultOpen: true })), /area-edit-summary__diff/);
});

test("a Diff draws numbers, markers and folds, says which lines changed, and takes focus", () => {
  const html = renderToString(h(Diff, { "aria-label": "Changes to a.css", hunks: [
    { lines: [{ kind: "context", text: "a", old: 1, new: 1 }, { kind: "removed", text: "b", old: 2 }, { kind: "added", text: "c", new: 2 }] },
    { folded: 12, lines: [{ kind: "context", text: "d", old: 15, new: 15 }] },
  ] }));
  // It scrolls sideways, so a keyboard can reach it.
  assert.match(html, /^<figure class="area-diff" aria-label="Changes to a\.css" tabindex="0">/);
  assert.match(html, /class="area-diff__line area-diff__line--removed"/);
  assert.match(html, /class="area-diff__line area-diff__line--added"/);
  assert.match(html, /<span class="area-diff__marker" aria-hidden="true">−<\/span>/);
  assert.match(html, /<span class="area-sr-only">Added: <\/span>c/);
  assert.match(html, /<div class="area-diff__fold">12 unchanged lines<\/div>/);
  const bare = renderToString(h(Diff, { hunks: [{ lines: [{ kind: "added", text: "c" }] }] }));
  assert.doesNotMatch(bare, /area-diff__number/);
  assert.match(bare, /aria-label="Changes"/);
  // The deprecated `label` still names it by its file; `aria-label` wins.
  assert.match(renderToString(h(Diff, { label: "a.css", hunks: [] })), /aria-label="Changes to a\.css"/);
  assert.match(renderToString(h(Diff, { label: "a.css", "aria-label": "Edit", hunks: [] })), /aria-label="Edit"/);
});

test("an Approval numbers its choices, focuses the first only when asked and offers what to do instead", () => {
  const plain = renderToString(h(Approval, { title: "T", items: [{ value: "yes", label: "Yes" }], onChoose: () => {} }));
  assert.doesNotMatch(plain, /autofocus/i);
  // The deprecated `options` still works for a release.
  assert.equal((renderToString(h(Approval, { title: "T", options: [{ value: "yes", label: "Yes" }], onChoose: () => {} })).match(/class="area-approval__option"/g) ?? []).length, 1);
  const html = renderToString(h(Approval, { autoFocus: true, title: "Edit a.css?", description: "Why", items: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }], onChoose: () => {}, onInstead: () => {} }, "detail"));
  const id = html.match(/<section class="area-approval" aria-labelledby="([^"]+)"/)[1];
  assert.match(html, new RegExp(`<p id="${id}" class="area-approval__title">Edit a\\.css\\?</p>`));
  assert.match(html, new RegExp(`class="area-approval__options" role="group" aria-labelledby="${id}"`));
  assert.equal((html.match(/class="area-approval__option"/g) ?? []).length, 2);
  assert.match(html, /aria-keyshortcuts="1"><span class="area-approval__key" aria-hidden="true">/);
  // What to do instead is the last row: numbered after the choices, a field with no fill of its own.
  assert.match(html, /<label class="area-approval__option area-approval__instead">/);
  assert.match(html, /<input class="area-approval__field" type="text" aria-label="Tell it what to do instead"[^>]*aria-keyshortcuts="3"/);
  // Every key is a keycap (owner 2026-10-22): the row numbers are small keycaps, never quiet text.
  assert.equal((html.match(/area-approval__key[^]*?area-kbd area-kbd--sm area-kbd--default/g) ?? []).length >= 2, true);
  assert.doesNotMatch(html, /area-kbd--quiet/);
  assert.match(html, /<p class="area-approval__hint"><span class="area-kbd area-kbd--sm area-kbd--default"/);
  assert.match(html, /area-approval__hint/);
});

test("a Plan counts what is done and says each item's state", () => {
  const html = renderToString(h(Plan, { items: [
    { id: "1", label: "One", status: "done" }, { id: "2", label: "Two", status: "current" }, { id: "3", label: "Three", status: "pending" },
  ] }));
  assert.match(html, /data-open=""/);
  assert.match(html, /<span class="area-plan__count">1 of 3<\/span>/);
  assert.match(html, /area-plan__item area-plan__item--done[^]*One<span class="area-sr-only">, Done<\/span>/);
  assert.match(html, /area-plan__item--current[^]*, In progress/);
  assert.match(html, /area-plan__item--pending[^]*, Not started/);
  const cancelled = renderToString(h(Plan, { items: [{ id: "1", label: "One", status: "cancelled" }] }));
  assert.match(cancelled, /area-plan__item--cancelled[^]*data-area-glyph="dismiss"[^]*, Cancelled/);
  assert.match(renderToString(h(Plan, { items: [], defaultOpen: false })), /aria-expanded="false"[^]*hidden=""/);
});

test("a Turn notice is a status, or an alert when the turn failed", () => {
  assert.match(renderToString(h(TurnNotice, {}, "Stopped")), /^<div role="status" class="area-turn-notice area-turn-notice--stopped"/);
  assert.match(renderToString(h(TurnNotice, { status: "compacted" }, "Compacted")), /^<div role="status" class="area-turn-notice area-turn-notice--compacted"/);
  assert.match(renderToString(h(TurnNotice, { status: "error" }, "Failed")), /^<div role="alert" class="area-turn-notice area-turn-notice--error"/);
  // The deprecated `kind` still works for a release; `status` wins.
  assert.match(renderToString(h(TurnNotice, { kind: "error" }, "Failed")), /^<div role="alert" class="area-turn-notice area-turn-notice--error"/);
  assert.match(renderToString(h(TurnNotice, { status: "stopped", kind: "error" }, "Stopped")), /^<div role="status"/);
});

test("Kbd's gap rule: a Button lifts its trailing keycap out of the label, so the button's gap spaces it", async () => {
  const { Button, Kbd } = await import("../dist/modules/index.js");
  const html = renderToString(h(Button, {}, "Save ", h(Kbd, { keys: ["cmd", "S"] })));
  assert.match(html, /<span class="area-button__label">Save <\/span><span class="area-kbd/);
  assert.doesNotMatch(renderToString(h(Button, {}, "Save")), /area-kbd/);
});
