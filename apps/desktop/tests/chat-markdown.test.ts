// The Chat view's markdown parser on streaming text: every prefix of every recorded reply, and the shapes that once
// hung it (a table row before its separator; a list whose first line is indented). Run:
//   node --test apps/desktop/tests/chat-markdown.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { parse } from "../src/chat/markdown-parse.ts";
import { RECORDINGS } from "../src/chat/recording.ts";

const replies = RECORDINGS.flatMap(recording => recording.events.flatMap(event =>
  event.message.type === "assistant" ? event.message.message.content.flatMap(block => block.type === "text" ? [block.text] : []) : []));

test("every streaming prefix of every recorded reply parses", () => {
  assert.ok(replies.length >= 3);
  for (const reply of replies) for (let end = 0; end <= reply.length; end++) parse(reply.slice(0, end));
});

test("a table row before its separator is a paragraph, then a table once the separator arrives", () => {
  assert.deepEqual(parse("| A | B |").map(block => block.kind), ["paragraph"]);
  assert.deepEqual(parse("| A | B |\n| --- | --- |\n| 1 | 2 |").map(block => block.kind), ["table"]);
});

test("a list whose first line is indented still moves on", () => {
  const blocks = parse("  - one\n  - two\nafter");
  assert.equal(blocks[0]!.kind, "list");
  assert.equal(blocks.at(-1)!.kind, "paragraph");
});

test("an unclosed fence is code so far", () => {
  const [block] = parse("```css\n.a {");
  assert.deepEqual(block, { kind: "code", language: "css", code: ".a {" });
});

test("stray markers never hang: lone pipes, hashes, quotes and fences", () => {
  for (const text of ["|", "| |", "#", "###", ">", "``", "```", "-", "1.", "  ", "|\n|", "- a\n    - b\n  c"]) parse(text);
});
