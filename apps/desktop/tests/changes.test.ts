// The Changes view's model (docs/research/desktop-app-analysis-2026-11-10, T3): a file's change as numbered hunks
// (src/chat/line-diff.ts), the chat's changed files a file at a time and its line comments (src/chat/changes.ts), and
// the engine's record of each file before and after (electron/agent.cjs `changes`).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { lineDiff } from "../src/chat/line-diff.ts";
import { changedFiles, commentRows, commentsMessage, locate, type LineComment } from "../src/chat/changes.ts";
import type { Turn } from "../src/chat/session.ts";

const require = createRequire(import.meta.url);
const { createEngine } = require("../electron/agent.cjs");

const numbered = (count: number) => Array.from({ length: count }, (_, index) => `line ${index + 1}`);

test("line diff: changed lines keep their numbers, three lines of context, the rest folded", () => {
  const before = numbered(20);
  const after = [...before];
  after[9] = "line ten";
  after.splice(15, 0, "new line");
  const diff = lineDiff(before.join("\n") + "\n", after.join("\n") + "\n");
  assert.equal(diff.added, 2);
  assert.equal(diff.deleted, 1);
  assert.equal(diff.hunks.length, 1, "changes six lines apart share their context");
  assert.equal(diff.hunks[0]!.folded, 6, "lines 1 to 6 are folded");
  const lines = diff.hunks[0]!.lines;
  assert.deepEqual(lines[0], { kind: "context", text: "line 7", old: 7, new: 7 });
  assert.deepEqual(lines.find(line => line.kind === "deleted"), { kind: "deleted", text: "line 10", old: 10 });
  assert.deepEqual(lines.find(line => line.text === "line ten"), { kind: "added", text: "line ten", new: 10 });
  assert.deepEqual(lines.find(line => line.text === "new line"), { kind: "added", text: "new line", new: 16 });
  assert.deepEqual(lines.at(-1), { kind: "context", text: "line 18", old: 18, new: 19 });
});

test("line diff: far changes are two hunks with a fold between; a new file is all added; the same text is no change", () => {
  const before = numbered(40);
  const after = [...before];
  after[1] = "two";
  after[35] = "thirty-six";
  const diff = lineDiff(before.join("\n"), after.join("\n"));
  assert.equal(diff.hunks.length, 2);
  assert.equal(diff.hunks[0]!.folded, undefined);
  assert.equal(diff.hunks[1]!.folded, 27, "lines 6 to 32");
  const made = lineDiff(null, "a\nb\n");
  assert.deepEqual(made.hunks, [{ lines: [{ kind: "added", text: "a", new: 1 }, { kind: "added", text: "b", new: 2 }] }]);
  assert.equal(lineDiff("a\nb\n", null).deleted, 2, "a deleted file is all deleted");
  assert.deepEqual(lineDiff("same\n", "same\n"), { hunks: [], added: 0, deleted: 0 });
});

const edit = (id: string, file: string, from: string, to: string) => ({ kind: "tool" as const, id, name: "Edit", input: { file_path: file, old_string: from, new_string: to }, status: "done" as const });
const turns: Turn[] = [
  { id: "1", author: "user", text: "Make it green", at: 1 },
  { id: "2", author: "assistant", done: true, parts: [edit("a", "/work/shop/src/cart.tsx", "blue", "green"), edit("b", "/work/shop/src/theme.css", "8px", "12px")] },
  { id: "3", author: "user", text: "And bolder", at: 2 },
  { id: "4", author: "assistant", done: true, parts: [edit("c", "/work/shop/src/cart.tsx", "400", "600"), { kind: "tool", id: "d", name: "Edit", input: { file_path: "/work/shop/x.ts" }, status: "error" }] },
];

test("changes: a file once across the chat's turns, in the order first touched; its state follows its edits", () => {
  const files = changedFiles(turns, { a: "pending", b: "pending", c: "pending" }, [], "/work/shop");
  assert.deepEqual(files.map(file => [file.name, file.ids, file.state]), [["src/cart.tsx", ["a", "c"], "pending"], ["src/theme.css", ["b"], "pending"]], "an edit that failed is not a change");
  assert.equal(files[0]!.added, 2);
  assert.equal(files[0]!.hunks.length, 2, "without the file's text, each edit's own lines");
  assert.equal(files[0]!.hunks[0]!.lines[0]!.old, undefined, "and no numbers");
  assert.equal(changedFiles(turns, { a: "kept", b: "pending", c: "kept" })[0]!.state, "kept");
  assert.equal(changedFiles(turns, { a: "kept", b: "pending", c: "pending" })[0]!.state, "pending", "one edit still waits");
  const undone = changedFiles(turns, { a: "undone", b: "kept", c: "undone" })[0]!;
  assert.equal(undone.state, "undone");
  assert.equal(undone.hunks.length, 2, "an undone file still shows what was undone");
  assert.equal(changedFiles(turns, { a: "kept", b: "kept", c: "undone" })[0]!.hunks.length, 1, "a file half undone shows what is left");
  assert.equal(changedFiles(turns, {})[0]!.name, "shop/src/cart.tsx", "without the folder, the path's last three parts");
});

test("changes: with the engine's record, the whole change with line numbers", () => {
  const record = { file: "/work/shop/src/cart.tsx", path: "src/cart.tsx", ids: ["a", "c"], undone: [], before: "one\ncolor: blue\nweight: 400\n", after: "one\ncolor: green\nweight: 600\n", moved: false };
  const [cart, theme] = changedFiles(turns, { a: "pending", b: "pending", c: "pending" }, [record]);
  assert.equal(cart!.name, "src/cart.tsx", "the record's path, from the chat's folder");
  assert.equal(cart!.hunks.length, 1);
  assert.deepEqual(cart!.hunks[0]!.lines.map(line => [line.kind, line.old, line.new]), [["context", 1, 1], ["deleted", 2, undefined], ["deleted", 3, undefined], ["added", undefined, 2], ["added", undefined, 3]]);
  assert.equal(theme!.hunks[0]!.lines[0]!.old, undefined, "a file without a record keeps its edits' lines");
  const large = changedFiles(turns, {}, [{ ...record, before: undefined, after: undefined, large: true }])[0]!;
  assert.equal(large.hunks.length, 2, "a file too long to send falls back to its edits' lines");
});

test("changes: a comment finds its line again, and reads to the agent with its file, line and text", () => {
  const hunks = lineDiff("a\nb\nc\n", "a\nB\nc\n").hunks;
  const added: LineComment = { id: "1", file: "/f", name: "src/cart.tsx", number: 2, text: "B", note: "Use the token" };
  const gone: LineComment = { id: "2", file: "/f", name: "src/cart.tsx", number: 2, deleted: true, text: "b", note: "Why did this go?" };
  assert.deepEqual(locate(hunks, added), { hunk: 0, line: 2 });
  assert.deepEqual(locate(hunks, gone), { hunk: 0, line: 1 });
  assert.equal(locate(hunks, { ...added, number: 9 }), null, "a line no longer in the change");
  assert.deepEqual(commentRows([added, gone]), [{ thing: "src/cart.tsx, line 2", change: "Use the token" }, { thing: "src/cart.tsx, deleted line 2", change: "Why did this go?" }]);
  const message = commentsMessage([added, gone]);
  assert.match(message, /2 comments on lines/);
  assert.match(message, /- src\/cart\.tsx, line 2 \(`B`\): Use the token/);
  assert.match(commentsMessage([{ ...added, number: undefined }]), /a comment on a line:\n- src\/cart\.tsx \(`B`\)/);
});

/** A stand-in SDK whose every query runs the edits it is given, one tool call each, allowed without asking. */
function editingSdk(steps: Array<Array<{ id: string; file: string; from: string | null; to: string }>>) {
  let turn = 0;
  return async () => ({
    query: ({ options }: { options: Record<string, any> }) => {
      const edits = steps[turn++] ?? [];
      async function* run() {
        for (const step of edits) {
          const file = join(options.cwd, step.file);
          const input = { file_path: step.file, old_string: step.from ?? "", new_string: step.to };
          await options.hooks.PreToolUse[0].hooks[0]({ tool_input: input, tool_use_id: step.id });
          writeFileSync(file, step.from === null ? step.to : readFileSync(file, "utf8").replace(step.from, step.to));
          await options.hooks.PostToolUse[0].hooks[0]({ tool_input: input, tool_use_id: step.id });
        }
        yield { type: "result", subtype: "success", is_error: false, duration_ms: 1, session_id: "s" };
      }
      return Object.assign(run(), { interrupt: async () => {}, close: () => {} });
    },
  });
}

test("agent: changes are a file's text before the chat's first edit and after its last; Undo steps a file back", async () => {
  const root = mkdtempSync(join(tmpdir(), "area-changes-"));
  writeFileSync(join(root, "note.txt"), "color: blue\nweight: 400\n");
  const engine = createEngine({ toPage: () => {}, env: {}, root, loadSdk: editingSdk([
    [{ id: "a", file: "note.txt", from: "blue", to: "green" }, { id: "b", file: "new.txt", from: null, to: "made\n" }],
    [{ id: "c", file: "note.txt", from: "400", to: "600" }],
  ]) });
  assert.deepEqual(engine.changes("chat"), [], "a chat that never ran has none");
  await engine.send("chat", { text: "Green" });
  await engine.send("chat", { text: "Bolder" });
  const [note, made] = engine.changes("chat");
  assert.deepEqual(note, { file: join(root, "note.txt"), path: "note.txt", ids: ["a", "c"], undone: [], before: "color: blue\nweight: 400\n", after: "color: green\nweight: 600\n", moved: false });
  assert.deepEqual([made.path, made.before, made.after], ["new.txt", null, "made\n"], "a file the chat made was not there before");

  // A file goes back step by step: its last edit first.
  assert.match(engine.undo("chat", ["a"]).a, /changed since/, "the first edit can't be undone under the second");
  assert.deepEqual(engine.undo("chat", ["c"]), { c: "ok" });
  assert.deepEqual([engine.changes("chat")[0].undone, engine.changes("chat")[0].after], [["c"], "color: green\nweight: 400\n"]);
  assert.deepEqual(engine.undo("chat", ["a"]), { a: "ok" });
  const back = engine.changes("chat")[0];
  assert.deepEqual([back.undone, back.after, back.moved], [["a", "c"], back.before, false], "every edit undone: the file is as it was");

  // Changed outside the chat: the record says so.
  writeFileSync(join(root, "new.txt"), "someone else\n");
  assert.equal(engine.changes("chat")[1].moved, true);
});
