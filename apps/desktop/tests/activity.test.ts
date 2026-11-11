// What a chat is doing, for the tab's mark and a notice (chat/activity.ts; docs/research/desktop-app-analysis-2026-11-10, T10).
import { test } from "node:test";
import assert from "node:assert/strict";
import { activityOf, noticeOf } from "../src/chat/activity.ts";

const ON = { ended: true, asking: true };

test("activity: working, asking, and an ended reply kept until its tab shows", () => {
  assert.equal(activityOf({ running: true }, null, true), "working");
  assert.equal(activityOf({ running: true, approval: {} }, null, false), "asking");
  assert.equal(activityOf({ running: true, question: {} }, null, false), "asking");
  assert.equal(activityOf({ running: false }, "done", false), "done");
  assert.equal(activityOf({ running: false }, "failed", false), "failed");
  assert.equal(activityOf({ running: false }, "done", true), null, "seen: no mark");
  assert.equal(activityOf({ running: false }, null, false), null);
});

test("notices: asking and ending say so, once, in a line of the reply; each can be turned off", () => {
  assert.deepEqual(noticeOf("asking", "working", "Storefront", "", ON), { title: "Storefront", body: "Claude needs your answer to go on." });
  assert.equal(noticeOf("asking", "asking", "Storefront", "", ON), null, "no second notice for the same state");
  assert.deepEqual(noticeOf("done", "working", "Storefront", "Made the **buy buttons** darker.\n<!-- more -->\nDetails here.", ON),
    { title: "Storefront", body: "Made the buy buttons darker." });
  assert.equal(noticeOf("done", "working", "Storefront", "", ON)!.body, "Claude finished.");
  assert.equal(noticeOf("done", "working", "Storefront", "x".repeat(300), ON)!.body.length, 140);
  assert.match(noticeOf("failed", "working", "Area", "", ON)!.body, /didn't finish/);
  assert.equal(noticeOf("done", null, "Area", "Hi", ON), null, "a chat opened already done says nothing");
  assert.equal(noticeOf("working", null, "Area", "", ON), null, "starting work says nothing");
  assert.equal(noticeOf("done", "working", "Area", "Hi", { ended: false, asking: true }), null);
  assert.equal(noticeOf("asking", "working", "Area", "", { ended: true, asking: false }), null);
});
