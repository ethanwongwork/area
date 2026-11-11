// A project's folder and its chats (owner, 2026-11-10): the project's file keeps a folder; the engine works in it
// (electron/agent.cjs), under the project's instructions, never falling back to Area's repository; a folder's files
// for the @ menu and each place's kept chats (electron/folder.cjs); a kept chat's file and its reopening
// (src/chat/store.ts, src/chat/session.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { newProject, projectFile, readProject, setFolder } from "../src/projects.ts";
import type { Restorers } from "../src/systems.ts";
import { reduce, type ChatState } from "../src/chat/session.ts";
import { chatText, keptChat, readKept, sortKept } from "../src/chat/store.ts";

const require = createRequire(import.meta.url);
const { createEngine } = require("../electron/agent.cjs");

const RESTORE = { canvas: saved => saved, material: saved => saved, colours: saved => saved, accent: saved => saved } as Restorers;
const EMPTY: ChatState = { turns: [], queue: [], running: false, edits: {}, undoFailed: {}, answers: {} };

test("a project keeps its folder in its file; a path that is not absolute is not one", () => {
  const project = newProject("Storefront", "area", "default", [], new Date("2026-11-10T12:00:00Z"));
  assert.equal(project.folder, undefined);
  assert.equal("folder" in projectFile(project), false, "a project without a folder writes none");
  const placed = setFolder(project, "/Users/david/Code/storefront");
  assert.equal(placed.folder, "/Users/david/Code/storefront");
  assert.equal(readProject(JSON.parse(JSON.stringify(projectFile(placed))), RESTORE)!.folder, "/Users/david/Code/storefront");
  assert.equal(setFolder(placed, "Code/storefront").folder, "/Users/david/Code/storefront", "a relative path changes nothing");
  assert.equal(readProject({ ...projectFile(placed), folder: "../elsewhere" }, RESTORE)!.folder, undefined);
  assert.equal("folder" in setFolder(placed, null), false);
});

type Options = Record<string, any>;
/** A stand-in SDK: each query writes hello.txt in its working folder after asking, and says its session. */
function writingSdk(calls: Options[]) {
  let sessions = 0;
  return async () => ({
    query: ({ prompt, options }: { prompt: string; options: Options }) => {
      calls.push({ prompt, ...options });
      const session = options.resume ?? `session-${++sessions}`;
      async function* run() {
        const input = { file_path: "hello.txt", content: "hello\n" };
        await options.hooks.PreToolUse[0].hooks[0]({ tool_input: input, tool_use_id: "toolu_1" });
        const decision = await options.canUseTool("Write", input, { toolUseID: "toolu_1", signal: new AbortController().signal });
        if (decision.behavior === "allow") {
          writeFileSync(join(options.cwd, "hello.txt"), "hello\n");
          await options.hooks.PostToolUse[0].hooks[0]({ tool_input: input, tool_use_id: "toolu_1" });
        }
        yield { type: "result", subtype: "success", is_error: false, duration_ms: 10, session_id: session };
      }
      return Object.assign(run(), { interrupt: async () => {}, close: () => {} });
    },
  });
}
const engineIn = () => {
  const root = mkdtempSync(join(tmpdir(), "area-repo-"));
  const folder = mkdtempSync(join(tmpdir(), "area-project-"));
  const calls: Options[] = [];
  const sent: Array<{ chat: string; message: Options }> = [];
  const engine = createEngine({ toPage: (chat: string, message: Options) => sent.push({ chat, message }), loadSdk: writingSdk(calls), loadZod: async () => ({}), root, env: {} });
  const answer = async (chat: string, allow: boolean) => {
    for (let i = 0; i < 50 && !sent.some(entry => entry.message.type === "permission_request"); i++) await new Promise(r => setTimeout(r, 5));
    engine.answer(chat, "toolu_1", { allow });
  };
  return { root, folder, calls, sent, engine, answer };
};

test("agent: a prompt that names a folder works there, under the project's instructions, and Undo puts its file back", async () => {
  const { root, folder, calls, sent, engine, answer } = engineIn();
  const running = engine.send("chat-a", { text: "Add a hello file", folder, about: { name: "Storefront", system: "Northwind", theme: "Default" } });
  await answer("chat-a", true);
  await running;
  assert.equal(calls[0]!.cwd, folder, "the agent's working folder is the project's");
  assert.ok(existsSync(join(folder, "hello.txt")) && !existsSync(join(root, "hello.txt")), "the file is written in the project, not in Area's repository");
  const ask = sent.find(entry => entry.message.type === "permission_request")!.message;
  assert.equal(ask.description, "hello.txt", "the approval names the file from the project's folder");
  assert.match(calls[0]!.systemPrompt.append, /the folder of the person's project "Storefront"/);
  assert.match(calls[0]!.systemPrompt.append, /design system "Northwind", theme "Default"/);
  assert.doesNotMatch(calls[0]!.systemPrompt.append, /this repository is both/, "Area's own instructions stay in Area's repository");
  assert.equal(calls[0]!.permissionMode, "default", "it still asks before every edit and command");
  assert.equal(sent.at(-1)!.message.session, "session-1", "the result carries the session, to keep with the chat");
  assert.deepEqual(engine.undo("chat-a", ["toolu_1"]), { toolu_1: "ok" });
  assert.ok(!existsSync(join(folder, "hello.txt")), "Undo removes the file the edit made");
});

test("agent: without a folder it works in the repository; a chat whose folder changes starts a new session there", async () => {
  const { root, folder, calls, engine, answer } = engineIn();
  let running = engine.send("chat-b", { text: "One" });
  await answer("chat-b", false);
  await running;
  assert.equal(calls[0]!.cwd, root);
  assert.match(calls[0]!.systemPrompt.append, /this repository is both/);
  running = engine.send("chat-b", { text: "Two" });
  await new Promise(r => setTimeout(r, 20));
  engine.answer("chat-b", "toolu_1", { allow: false });
  await running;
  assert.equal(calls[1]!.resume, "session-1", "the same folder resumes the chat's session");
  running = engine.send("chat-b", { text: "Three", folder });
  await new Promise(r => setTimeout(r, 20));
  engine.answer("chat-b", "toolu_1", { allow: false });
  await running;
  assert.equal(calls[2]!.cwd, folder);
  assert.equal(calls[2]!.resume, undefined, "a session belongs to its folder");
});

test("agent: a folder that is gone fails the prompt in words and never falls back to the repository", async () => {
  const { folder, calls, sent, engine } = engineIn();
  rmSync(folder, { recursive: true });
  await engine.send("chat-c", { text: "Add a hello file", folder });
  assert.equal(calls.length, 0, "no query runs");
  assert.match(sent.at(-1)!.message.error, /folder isn't there any more/);
  await engine.send("chat-c", { text: "Again", folder: "relative/path" });
  assert.equal(calls.length, 0, "a path that is not absolute is not a folder");
});

test("agent: a kept chat's session resumes on its first prompt only", async () => {
  const { folder, calls, engine, answer } = engineIn();
  const running = engine.send("chat-d", { text: "Go on", folder, resume: "session-kept" });
  await answer("chat-d", false);
  await running;
  assert.equal(calls[0]!.resume, "session-kept");
});

test("folder: what a folder is, its files for the @ menu, and chats kept beside their place", async () => {
  // electron/folder.cjs needs Electron only to register; its functions are plain.
  const Module = require("node:module");
  const load = Module._load;
  Module._load = (request: string, ...rest: unknown[]) => request === "electron" ? {} : load(request, ...rest);
  const { folderState, folderFiles, chatsFolder, readChats, writeChat } = require("../electron/folder.cjs");
  Module._load = load;

  const folder = mkdtempSync(join(tmpdir(), "area-folder-"));
  mkdirSync(join(folder, "src"));
  mkdirSync(join(folder, "node_modules", "left-pad"), { recursive: true });
  mkdirSync(join(folder, ".area"));
  writeFileSync(join(folder, "src", "app.tsx"), "");
  writeFileSync(join(folder, "README.md"), "");
  writeFileSync(join(folder, "node_modules", "left-pad", "index.js"), "");
  writeFileSync(join(folder, ".area", "system.json"), "{}");
  assert.deepEqual(folderState(folder), { exists: true, name: folder.split("/").at(-1), git: false, system: true });
  assert.deepEqual(folderState(join(folder, "missing")), { exists: false, name: "missing" });
  assert.equal(folderState("relative").exists, false);
  assert.deepEqual(await folderFiles(folder), ["README.md", "src/app.tsx"], "dependencies and hidden folders are left out");
  assert.deepEqual(await folderFiles(join(folder, "missing")), []);

  const base = mkdtempSync(join(tmpdir(), "area-data-"));
  assert.equal(chatsFolder(base, "project", "storefront"), join(base, "Projects", "storefront", "chats"));
  assert.equal(chatsFolder(base, "system", "northwind"), join(base, "Systems", "northwind", "chats"));
  assert.equal(chatsFolder(base, "app", ""), join(base, "Chats"));
  assert.equal(chatsFolder(base, "project", "../escape"), null, "an id is never a path");
  assert.equal(writeChat(base, "project", "storefront", "chat-1", JSON.stringify({ id: "chat-1", turns: [] })), true);
  assert.equal(writeChat(base, "project", "storefront", "../chat-2", "{}"), false);
  assert.equal(writeChat(base, "project", "storefront", "chat-3", "not json"), false);
  assert.deepEqual(readChats(base, "project", "storefront"), [{ id: "chat-1", turns: [] }]);
  assert.deepEqual(readChats(base, "project", "another"), []);
  assert.equal(JSON.parse(readFileSync(join(base, "Projects", "storefront", "chats", "chat-1.json"), "utf8")).id, "chat-1");
});

test("a chat is kept once a reply is done, as its turns, and opens again with new turn ids", () => {
  let state = reduce(EMPTY, { type: "send", text: "Round the cards\nand the buttons", at: 1000, extra: { attachments: [{ kind: "image", name: "ref.png", src: "data:image/png;base64,AAAA" }] } });
  assert.equal(keptChat("chat-1", state), null, "nothing to keep before a reply is done");
  state = reduce(state, { type: "message", at: 1100, message: { type: "assistant", message: { content: [{ type: "text", text: "Done.\n<!-- more -->\nCorners are 12 now." }, { type: "tool_use", id: "toolu_1", name: "Edit", input: { file_path: "card.css" } }] } } });
  state = reduce(state, { type: "message", at: 1200, message: { type: "result", subtype: "success", duration_ms: 2000, session: "session-9" } });
  assert.equal(state.session, "session-9", "the engine's session is kept in the chat's state");
  const kept = keptChat("chat-1", state, { folder: "/Users/david/Code/storefront", now: 5000 })!;
  assert.equal(kept.title, "Round the cards", "the first prompt's first line");
  assert.equal(kept.session, "session-9");
  assert.equal(kept.folder, "/Users/david/Code/storefront");
  assert.equal(kept.edits.toolu_1, "kept", "an edit still waiting is kept as kept: its Undo record ends with the app");
  const [asked, reply] = kept.turns;
  assert.equal(asked!.author === "user" && asked!.attachments![0]!.kind === "image" && asked!.attachments![0]!.src, "", "a picture keeps its name, never its bytes");
  assert.equal(reply!.author === "assistant" && reply!.parts.find(part => part.kind === "tool")!.status, "error", "a call still running when kept reads as stopped");
  assert.equal(chatText(state.turns), "Person: Round the cards\nand the buttons\n\nClaude: Done.\nCorners are 12 now.");

  const read = readKept(JSON.parse(JSON.stringify(kept)))!;
  assert.deepEqual(read, JSON.parse(JSON.stringify(kept)), "its file reads back as it was written");
  assert.equal(readKept({ id: "chat-1", turns: [{ id: "x", author: "assistant", parts: [] }] }), null, "a file with no prompt is not a chat");
  assert.equal(readKept({ id: "../chat", turns: read.turns }), null);
  assert.deepEqual(sortKept([{ ...kept, id: "old", at: 1 }, { ...kept, id: "new", at: 9 }]).map(chat => chat.id), ["new", "old"]);

  const opened = reduce(state, { type: "open", turns: read.turns, edits: read.edits, answers: read.answers, session: read.session });
  assert.equal(opened.turns.length, 2);
  assert.ok(opened.turns.every((turn, index) => turn.id !== read.turns[index]!.id), "the turns take ids of this launch");
  assert.equal(opened.running, false);
  assert.equal(opened.session, "session-9");
  const next = reduce(opened, { type: "send", text: "Rounder still", at: 9000 });
  assert.equal(next.turns.length, 4, "the conversation goes on from where it was");
});
