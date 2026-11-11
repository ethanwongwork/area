// Technical tools (docs/research/desktop-app-analysis-2026-11-10, T6): the folder's tree, the terminal's lines
// (src/files.ts), and reading, saving and running commands in a project's folder (electron/tools.cjs).
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, symlinkSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { appendOutput, fileTree, foldersOf } from "../src/files.ts";

const require = createRequire(import.meta.url);
const { readText, writeText, createTerminal, plainOutput } = require("../electron/tools.cjs");

test("files: paths become a tree, folders first, each by name", () => {
  const tree = fileTree(["src/b.tsx", "README.md", "src/a.tsx", "src/ui/Button.tsx", "package.json"]);
  assert.deepEqual(tree.map(node => node.id), ["dir:src", "package.json", "README.md"]);
  assert.deepEqual(tree[0]!.children!.map(node => node.id), ["dir:src/ui", "src/a.tsx", "src/b.tsx"]);
  assert.deepEqual(foldersOf("src/ui/Button.tsx"), ["dir:src", "dir:src/ui"]);
});

test("terminal lines: output splits at line ends, a line left open takes what comes next", () => {
  let lines = appendOutput([], "one\ntw", "out");
  lines = appendOutput(lines, "o\nthree\n", "out");
  assert.deepEqual(lines.map(line => line.text), ["one\n", "two\n", "three\n"]);
  assert.equal(appendOutput(lines, "bad\n", "err").at(-1)!.stream, "err");
  assert.equal(appendOutput([], "x\n".repeat(50), "out", 10).length, 10, "the oldest lines go past the limit");
  assert.equal(plainOutput("\u001b[32mgreen\u001b[0m done\r\n"), "green done\r\n");
});

test("files: read and save only inside the folder; a file changed elsewhere since it was read isn't overwritten", () => {
  const root = mkdtempSync(join(tmpdir(), "area-files-"));
  const folder = join(root, "shop");
  mkdirSync(join(folder, "src"), { recursive: true });
  writeFileSync(join(folder, "src", "app.tsx"), "export const App = () => null;\n");
  writeFileSync(join(root, "secret.txt"), "x");
  symlinkSync(join(root, "secret.txt"), join(folder, "escape.txt"));
  writeFileSync(join(folder, "image.png"), Buffer.from([137, 80, 78, 71, 0, 1]));

  const read = readText(folder, "src/app.tsx");
  assert.equal(read.path, "src/app.tsx");
  assert.match(read.text, /App/);
  assert.match(readText(folder, "../secret.txt").error, /isn't in the project's folder/);
  assert.match(readText(folder, "escape.txt").error, /isn't in the project's folder/);
  assert.match(readText(folder, "image.png").error, /isn't text/);

  const saved = writeText(folder, "src/app.tsx", "export const App = () => 1;\n", read.at);
  assert.equal(saved.ok, true);
  assert.equal(readFileSync(join(folder, "src", "app.tsx"), "utf8"), "export const App = () => 1;\n");
  assert.equal(writeText(folder, "src/new.css", ".x {}\n").ok, true, "a new file beside the others");
  assert.match(writeText(folder, "../outside.txt", "x").error, /isn't in the project's folder/);
  assert.match(writeText(folder, "escape.txt", "x").error, /isn't in the project's folder/);
  // Changed in another app since it was read: refused.
  const later = new Date(Date.now() + 5000);
  utimesSync(join(folder, "src", "app.tsx"), later, later);
  assert.match(writeText(folder, "src/app.tsx", "lost", saved.at).error, /changed in another app/);
});

test("terminal: a command runs in the folder, its output and end come back, and Stop stops it", async () => {
  const folder = mkdtempSync(join(tmpdir(), "area-term-"));
  writeFileSync(join(folder, "hello.txt"), "hi\n");
  const events: Array<[string, ...unknown[]]> = [];
  const terminal = createTerminal({ send: (channel: string, ...args: unknown[]) => events.push([channel, ...args]), shell: "/bin/sh" });
  const ended = (id: string) => new Promise<void>(done => { const tick = () => events.some(event => event[0] === "area:term-exit" && event[1] === id) ? done() : setTimeout(tick, 20); tick(); });
  terminal.run("a", folder, "pwd; cat hello.txt; echo oops >&2; exit 3");
  await ended("a");
  const out = events.filter(event => event[0] === "area:term-out" && event[1] === "a");
  assert.match(out.filter(event => event[3] === "out").map(event => event[2]).join(""), /area-term-[\s\S]*hi/);
  assert.match(out.filter(event => event[3] === "err").map(event => event[2]).join(""), /oops/);
  assert.equal((events.find(event => event[0] === "area:term-exit" && event[1] === "a")![2] as { code: number }).code, 3);

  terminal.run("b", folder, "read line; echo got $line");
  terminal.input("b", "blue");
  await ended("b");
  assert.match(events.filter(event => event[0] === "area:term-out" && event[1] === "b").map(event => event[2]).join(""), /got blue/);

  terminal.run("c", folder, "sleep 30");
  setTimeout(() => terminal.stop("c"), 100);
  const started = Date.now();
  await ended("c");
  assert.ok(Date.now() - started < 5000, "stopped, not left to run");

  terminal.run("d", join(folder, "missing"), "pwd");
  assert.match((events.find(event => event[0] === "area:term-exit" && event[1] === "d")![2] as { error: string }).error, /isn't there/);
});
