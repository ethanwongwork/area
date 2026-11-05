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
  // A closed diff stays in the tree, hidden, so aria-controls names it and its close eases (2026-10-26).
  assert.match(renderToString(h(EditSummaryFile, { name: "a.css", added: 1, removed: 0, diff, open: false, defaultOpen: true })), /class="area-edit-summary__diff" hidden=""/);
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
  const id = html.match(/<section class="area-approval area-approval--list area-approval--surface" aria-labelledby="([^"]+)"/)[1];
  assert.match(html, new RegExp(`<p id="${id}" class="area-approval__title">Edit a\\.css\\?</p>`));
  assert.match(html, new RegExp(`class="area-approval__options" role="group" aria-labelledby="${id}"`));
  assert.equal((html.match(/class="area-approval__option"/g) ?? []).length, 2);
  assert.match(html, /aria-keyshortcuts="1"><span class="area-approval__key" aria-hidden="true">/);
  // What to do instead is the last row: numbered after the choices, a field with no fill of its own.
  assert.match(html, /<label class="area-approval__option area-approval__instead">/);
  assert.match(html, /<input class="area-approval__field" type="text" aria-label="Tell it what to do instead"[^>]*aria-keyshortcuts="3"/);
  // The row numbers are plain ordinals on the text edge (owner, 2026-11-04, plain answers), not keycaps; a key named in the
  // hint's sentence is still a keycap (Kbd keeps its backplate wherever it is drawn, owner 2026-10-22).
  assert.match(html, /<span class="area-approval__key" aria-hidden="true">1<\/span>/);
  assert.match(html, /<span class="area-approval__key" aria-hidden="true">3<\/span><input class="area-approval__field"/);
  assert.doesNotMatch(html, /area-approval__key" aria-hidden="true"><span class="area-kbd/);
  assert.doesNotMatch(html, /area-kbd--quiet/);
  assert.match(html, /<p class="area-approval__hint"><span class="area-kbd area-kbd--sm area-kbd--default"/);
  assert.match(html, /area-approval__hint/);
});

test("an Approval lays its choices in a grid and draws a choice's picture, inert and out of its name", () => {
  const html = renderToString(h(Approval, { title: "T", layout: "grid", onChoose: () => {},
    items: [{ value: "a", label: "Square", visual: h("i", { className: "pic" }) }, { value: "b", label: "Round" }] }));
  assert.match(html, /<section class="area-approval area-approval--grid area-approval--surface"/);
  // The picture sits beside its button in a tile, never inside it (a picture of real UI holds buttons).
  assert.match(html, /<div class="area-approval__tile"><span class="area-approval__visual" aria-hidden="true" inert=""><i class="pic"><\/i><\/span><button type="button" class="area-approval__option"[^>]*><span class="area-approval__key"/);
  assert.doesNotMatch(html, /<button[^>]*>(?:(?!<\/button>).)*area-approval__visual/);
  assert.equal((html.match(/area-approval__visual/g) ?? []).length, 1);
  assert.throws(() => renderToString(h(Approval, { title: "T", layout: "tiles", items: [], onChoose: () => {} })), /invalid layout/);
});

test("an Approval asks a question: descriptions, the answer given, head actions and a footer", () => {
  const html = renderToString(h(Approval, {
    title: "Which?", items: [{ value: "a", label: "A", description: "What A comes to" }, { value: "b", label: "B" }], value: "a",
    onChoose: () => {}, dismissLabel: "skip", actions: h("span", { id: "pager" }, "1 of 2"), footer: h("button", { id: "go" }, "Continue"),
  }));
  // The description is a line under the label that describes the button; only the chosen row is current.
  const described = html.match(/aria-describedby="([^"]+)"/)[1];
  assert.match(html, new RegExp(`<span id="${described}" class="area-approval__option-description">What A comes to</span>`));
  assert.equal((html.match(/aria-current="true"/g) ?? []).length, 1);
  assert.match(html, /aria-current="true" data-selected=""/);
  // Every row keeps the check's column when an answer is given.
  assert.equal((html.match(/class="area-approval__check"/g) ?? []).length, 2);
  assert.match(html, /<div class="area-approval__actions"><span id="pager">1 of 2<\/span><\/div>/);
  assert.match(html, /<p class="area-approval__hint">[^]*?<\/span> to skip<\/p><div class="area-approval__footer"><button id="go">Continue<\/button><\/div>/);
  // Without value, no check column; without items or a field, no options group.
  assert.doesNotMatch(renderToString(h(Approval, { title: "T", items: [{ value: "a", label: "A" }], onChoose: () => {} })), /area-approval__check/);
  assert.doesNotMatch(renderToString(h(Approval, { title: "T", items: [], onChoose: () => {} }, "detail")), /area-approval__options/);
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
  assert.match(cancelled, /area-plan__item--cancelled[^]*, Cancelled/);
  // Done, cancelled and not started are rings drawn in CSS (one mark family); only a current item without a share spins.
  assert.doesNotMatch(html + cancelled, /area-plan__mark[^>]*>(<!-- -->)?<svg/);
  assert.match(html, /area-plan__item--current"><span class="area-plan__mark"[^>]*><span [^>]*area-spinner/);
  assert.match(renderToString(h(Plan, { items: [], defaultOpen: false })), /aria-expanded="false"[^]*hidden=""/);
});

test("a Plan's bar is one progress bar for the whole plan; its segments and items show each share", () => {
  const items = [
    { id: "1", label: "One", status: "done", meta: "3 of 3" },
    { id: "2", label: "Two", status: "current", progress: 0.5, meta: "2 of 4" },
    { id: "3", label: "Three", status: "pending" },
    { id: "4", label: "Four", status: "pending" },
  ];
  assert.doesNotMatch(renderToString(h(Plan, { items })), /area-plan__bar/);
  const single = renderToString(h(Plan, { items, bar: "single" }));
  assert.match(single, /class="area-plan area-plan--single"/);
  assert.match(single, /class="area-plan__bar" role="progressbar"[^>]*aria-valuenow="25"[^>]*aria-valuetext="1 of 4"/);
  assert.equal(single.match(/area-plan__segment/g).length, 1);
  const segmented = renderToString(h(Plan, { items, bar: "segmented", count: "5 of 12", defaultOpen: false }));
  assert.match(segmented, /<span class="area-plan__count">5 of 12<\/span>/);
  // (1 + 0.5 + 0 + 0) / 4: the segments' mean.
  assert.match(segmented, /aria-valuenow="38"/);
  assert.equal(segmented.match(/area-plan__segment/g).length, 4);
  assert.equal(segmented.match(/role="progressbar"/g).length, 5, "the bar plus four hidden segments");
  assert.equal(segmented.match(/aria-hidden="true" role="progressbar"|role="progressbar"[^>]*aria-hidden="true"/g).length, 4);
  // The bar stays when folded; the list hides.
  assert.match(segmented, /area-plan__bar[^]*hidden=""/);
  assert.match(segmented, /area-plan__mark area-plan__mark--ring" aria-hidden="true" style="--_plan-item-progress:0.5"/);
  assert.match(segmented, /<span class="area-plan__meta">2 of 4<\/span>/);
  assert.doesNotMatch(segmented, /area-plan__item--current[^]*area-spinner[^]*area-plan__item--pending/);
});

test("a Plan on a rail holds its items' detail and the current item's steps in one container", () => {
  const html = renderToString(h(Plan, { rail: true, title: "Title", icon: h("svg", { "data-test": "icon" }), items: [
    { id: "1", label: "One", status: "done", detail: h("span", { className: "chip" }, "Value") },
    { id: "2", label: "Two", status: "current", progress: 0.5, items: [
      { id: "2a", label: "Step one", status: "done", meta: "Value", items: [{ id: "x", label: "Too deep", status: "pending" }] },
      { id: "2b", label: "Step two", status: "pending" },
    ] },
  ] }));
  assert.match(html, /class="area-plan area-plan--none area-plan--rail"/);
  assert.match(html, /<span class="area-plan__icon" aria-hidden="true"><svg data-test="icon"><\/svg><\/span><span id="[^"]+" class="area-plan__title">Title/);
  // Detail sits in the item's words, before its status for assistive tech.
  assert.match(html, /One<span class="area-plan__detail"><span class="chip">Value<\/span><\/span><span class="area-sr-only">, Done/);
  // One level of steps, in an ordered list inside the current item.
  assert.match(html, /area-plan__item--current[^]*<ol class="area-plan__steps"><li class="area-plan__item area-plan__item--done">[^]*Step one[^]*Value[^]*Step two/);
  assert.equal(html.match(/area-plan__steps/g).length, 1);
  assert.doesNotMatch(html, /Too deep/);
});

test("a Turn notice is a status, or an alert when the turn failed", () => {
  assert.match(renderToString(h(TurnNotice, {}, "Stopped")), /^<div role="status" class="area-turn-notice area-turn-notice--stopped"/);
  assert.match(renderToString(h(TurnNotice, { status: "compacted" }, "Compacted")), /^<div role="status" class="area-turn-notice area-turn-notice--compacted"/);
  assert.match(renderToString(h(TurnNotice, { status: "error" }, "Failed")), /^<div role="alert" class="area-turn-notice area-turn-notice--error"/);
  // Tracker pass 2026-11-02: stopped and compacted are a divider line (Codex), so only an error carries a mark.
  assert.doesNotMatch(renderToString(h(TurnNotice, {}, "Stopped")), /area-turn-notice__icon/);
  assert.doesNotMatch(renderToString(h(TurnNotice, { status: "compacted" }, "Compacted")), /area-turn-notice__icon/);
  assert.match(renderToString(h(TurnNotice, { status: "error" }, "Failed")), /area-turn-notice__icon/);
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
