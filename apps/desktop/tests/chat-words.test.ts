// The Chat's design words (src/chat/words.ts; the chat workflow study, P2 and P5): files as the design knows them, steps
// in plain words, a run of work as one line. Run:
//   node --test apps/desktop/tests/chat-words.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { plainName, plainStep, workLine } from "../src/chat/words.ts";
import type { Part } from "../src/chat/session.ts";

test("a file reads as the design knows it", () => {
  assert.equal(plainName("packages/styles/src/components/button.css"), "Button's styles");
  assert.equal(plainName("packages/styles/src/components/edit-summary.css"), "Edit summary's styles");
  assert.equal(plainName("/repo/packages/react/src/components/EditSummary.tsx"), "the Edit summary component");
  assert.equal(plainName("docs/specs/composer.md"), "Composer's notes");
  assert.equal(plainName("apps/desktop/src/content/examples/settings.tsx"), "the Settings screen");
  assert.equal(plainName("packages/tokens/src/emit/base.ts"), "the theme's tokens");
  assert.equal(plainName("AGENTS.md"), "the working guide");
  assert.equal(plainName("notes.txt"), "notes.txt", "anything else keeps its name");
});

test("a step reads in plain words, live and past", () => {
  assert.deepEqual(plainStep("Read", { file_path: "packages/styles/src/components/card.css" }), ["Looking at Card's styles", "Looked at Card's styles"]);
  assert.deepEqual(plainStep("Edit", { file_path: "apps/desktop/src/content/examples/settings.tsx" }), ["Changing the Settings screen", "Changed the Settings screen"]);
  assert.deepEqual(plainStep("Bash", { command: "npm test" }), ["Running a check", "Ran a check"], "never the command");
  assert.deepEqual(plainStep("Grep", { pattern: "--_card-edge" }), ["Searching the design system", "Searched the design system"]);
});

const tool = (name: string, input: Record<string, unknown>, status: "running" | "done" = "done"): Part => ({ kind: "tool", id: `${name}-${JSON.stringify(input)}`, name, input, status });

test("a run of work is one line: its current step while it works, what it came to once done", () => {
  const run: Part[] = [
    { kind: "thinking", summary: "", startedAt: 0, seconds: 2 },
    tool("Read", { file_path: "a/button.css" }), tool("Grep", { pattern: "x" }), tool("Read", { file_path: "a/card.css" }),
    tool("Edit", { file_path: "a/card.css" }), tool("Edit", { file_path: "a/card.css" }), tool("Bash", { command: "npm test" }),
  ];
  assert.equal(workLine(run, false), "Looked at 3 things, made 1 change, ran 1 check", "two edits to one file are one change");
  assert.equal(workLine(run, false, 18), "Worked 18s, looked at 3 things, made 1 change, ran 1 check");
  assert.equal(workLine([...run, tool("Read", { file_path: "packages/styles/src/components/menu.css" }, "running")], true), "Looking at Menu's styles");
  assert.equal(workLine([{ kind: "thinking", summary: "", startedAt: 0 }], true), "Thinking");
  assert.equal(workLine([{ kind: "thinking", summary: "", startedAt: 0, seconds: 1 }], false), "Thought it through");
});
