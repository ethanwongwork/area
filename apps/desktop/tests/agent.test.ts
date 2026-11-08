// The Inspector Chat's engine (electron/agent.cjs) with a stand-in for the Agent SDK: what the page is sent, an
// approval answered yes and no, the session resumed, Undo putting a file back, Stop, a sign-in failure in plain words,
// and the session reducer (src/chat/session.ts) reading what the engine sends.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { reduce, type ChatState } from "../src/chat/session.ts";
import type { ChatEvent } from "../src/chat/recording.ts";

const require = createRequire(import.meta.url);
const { createEngine, forPage, agentEnv } = require("../electron/agent.cjs");

type Options = Record<string, any>;
/** A stand-in SDK: each query asks to edit note.txt (blue → green), runs the edit on a yes, and resumes by session id. */
function fakeSdk(calls: Options[]) {
  return async () => ({
    query: ({ prompt, options }: { prompt: string; options: Options }) => {
      calls.push({ prompt, ...options });
      let interrupted = false;
      const file = join(options.cwd, "note.txt");
      async function* run() {
        yield { type: "system", subtype: "init", session_id: "session-1", parent_tool_use_id: null };
        yield { type: "stream_event", event: { type: "message_start" }, parent_tool_use_id: null, session_id: "session-1" };
        yield { type: "stream_event", event: { type: "content_block_delta", delta: { type: "text_delta", text: "On it." } }, parent_tool_use_id: null, session_id: "session-1" };
        const input = { file_path: file, old_string: "blue", new_string: "green" };
        yield { type: "assistant", message: { content: [{ type: "text", text: "On it." }, { type: "tool_use", id: "toolu_1", name: "Edit", input }] }, parent_tool_use_id: null, session_id: "session-1" };
        // A subagent's own step never reaches the page.
        yield { type: "assistant", message: { content: [{ type: "text", text: "inside a subagent" }] }, parent_tool_use_id: "toolu_0", session_id: "session-1" };
        await options.hooks.PreToolUse[0].hooks[0]({ tool_input: input, tool_use_id: "toolu_1" });
        const controller = new AbortController();
        const decision = await options.canUseTool("Edit", input, { toolUseID: "toolu_1", signal: controller.signal, title: "Edit note.txt?" });
        if (interrupted) return;
        if (decision.behavior === "allow") {
          writeFileSync(file, readFileSync(file, "utf8").replace("blue", "green"));
          await options.hooks.PostToolUse[0].hooks[0]({ tool_input: input, tool_use_id: "toolu_1" });
          yield { type: "user", message: { content: [{ type: "tool_result", tool_use_id: "toolu_1", content: [{ type: "text", text: "Updated note.txt" }] }] }, parent_tool_use_id: null, session_id: "session-1" };
        } else {
          yield { type: "user", message: { content: [{ type: "tool_result", tool_use_id: "toolu_1", content: decision.message, is_error: true }] }, parent_tool_use_id: null, session_id: "session-1" };
        }
        yield { type: "result", subtype: "success", is_error: false, duration_ms: 1200, session_id: "session-1" };
      }
      const iterator = run();
      return Object.assign(iterator, { interrupt: async () => { interrupted = true; }, close: () => { interrupted = true; } });
    },
  });
}

const setup = () => {
  const root = mkdtempSync(join(tmpdir(), "area-agent-"));
  writeFileSync(join(root, "note.txt"), "colour: blue\n");
  const calls: Options[] = [];
  const sent: Array<{ chat: string; message: ChatEvent }> = [];
  const engine = createEngine({ toPage: (chat: string, message: ChatEvent) => sent.push({ chat, message }), loadSdk: fakeSdk(calls), root, env: {} });
  const asked = async () => { for (let i = 0; i < 50 && !sent.some(entry => entry.message.type === "permission_request"); i++) await new Promise(r => setTimeout(r, 5)); };
  return { root, calls, sent, engine, asked, note: () => readFileSync(join(root, "note.txt"), "utf8") };
};

test("agent: a yes runs the edit, the page gets the SDK's messages as the recordings are written, Undo puts it back", async () => {
  const { calls, sent, engine, asked, note } = setup();
  const running = engine.send("chat-a", { text: "Make it green", context: "Dashboard › Analytics", model: "claude-haiku-5-5" });
  await asked();
  const ask = sent.find(entry => entry.message.type === "permission_request")!.message as Extract<ChatEvent, { type: "permission_request" }>;
  assert.equal(ask.title, "Edit note.txt?");
  assert.equal(ask.description, "note.txt", "the file, from the repository's root");
  engine.answer("chat-a", "toolu_1", { allow: true });
  await running;
  assert.equal(note(), "colour: green\n");
  assert.equal(calls[0]!.prompt, "Make it green\n\n(About: Dashboard › Analytics)");
  assert.equal(calls[0]!.model, "claude-haiku-5-5");
  assert.equal(calls[0]!.permissionMode, "default", "it asks before every edit and command");
  assert.equal(calls[0]!.resume, undefined);
  const types = sent.map(entry => entry.message.type);
  assert.deepEqual(types, ["stream_event", "assistant", "permission_request", "user", "result"], "init, message_start and the subagent's step are left out");
  const result = sent.find(entry => entry.message.type === "user")!.message as Extract<ChatEvent, { type: "user" }>;
  assert.equal(result.message.content[0]!.content, "Updated note.txt", "a tool's result as text");
  assert.ok(sent.every(entry => entry.chat === "chat-a"));

  assert.deepEqual(engine.undo("chat-a", ["toolu_1"]), { toolu_1: "ok" });
  assert.equal(note(), "colour: blue\n");
  assert.match(engine.undo("chat-a", ["toolu_1"]).toolu_1, /changed since/, "a second Undo finds the file no longer as the edit left it");

  // The next prompt resumes the chat's session.
  const next = engine.send("chat-a", { text: "Again" });
  await new Promise(r => setTimeout(r, 20));
  engine.answer("chat-a", "toolu_1", { allow: false });
  await next;
  assert.equal(calls[1]!.resume, "session-1");
});

test("agent: a no with what to do instead reaches the agent; for this session stops asking", async () => {
  const { sent, engine, asked, note } = setup();
  const running = engine.send("chat-b", { text: "Make it green" });
  await asked();
  engine.answer("chat-b", "toolu_1", { allow: false, instead: "make it teal" });
  await running;
  assert.equal(note(), "colour: blue\n");
  const result = sent.find(entry => entry.message.type === "user")!.message as Extract<ChatEvent, { type: "user" }>;
  assert.match(result.message.content[0]!.content, /asked instead: make it teal/);

  sent.length = 0;
  const again = engine.send("chat-b", { text: "Make it green" });
  await asked();
  engine.answer("chat-b", "toolu_1", { allow: true, always: true });
  await again;
  sent.length = 0;
  await engine.send("chat-b", { text: "And again" });
  assert.ok(!sent.some(entry => entry.message.type === "permission_request"), "Edit is allowed for the rest of the chat");
});

test("agent: Stop denies the waiting question and nothing more reaches the page", async () => {
  const { sent, engine, asked, note } = setup();
  const running = engine.send("chat-c", { text: "Make it green" });
  await asked();
  const before = sent.length;
  await engine.stop("chat-c");
  await running;
  assert.equal(note(), "colour: blue\n");
  assert.equal(sent.length, before, "no result or tool output after a stop");
});

test("agent: a sign-in failure says how to sign in; a failed request's text isn't drawn as a reply", () => {
  const [result] = forPage({ type: "result", subtype: "success", is_error: true, duration_ms: 60, result: "Failed to authenticate: OAuth session expired and could not be refreshed" });
  assert.equal(result.type, "result");
  assert.equal(result.subtype, "error_during_execution");
  assert.match(result.error, /claude auth login/);
  assert.deepEqual(forPage({ type: "assistant", error: "authentication_failed", message: { content: [{ type: "text", text: "Failed to authenticate" }] }, parent_tool_use_id: null }), []);
  assert.deepEqual(forPage({ type: "stream_event", event: { type: "content_block_delta", delta: { type: "thinking_delta", thinking: "Hm" } }, parent_tool_use_id: null }),
    [{ type: "stream_event", event: { type: "content_block_delta", delta: { type: "thinking_delta", thinking: "Hm" } } }]);
});

test("agent: started from inside a Claude Code session, the agent leaves that session's variables out", () => {
  const env = agentEnv({ PATH: "/bin", CLAUDECODE: "1", CLAUDE_CODE_SESSION_ID: "x", ANTHROPIC_BASE_URL: "http://host", ANTHROPIC_API_KEY: "kept" });
  assert.deepEqual(env, { PATH: "/bin", ANTHROPIC_API_KEY: "kept" });
  assert.deepEqual(agentEnv({ PATH: "/bin", ANTHROPIC_BASE_URL: "http://proxy" }), { PATH: "/bin", ANTHROPIC_BASE_URL: "http://proxy" }, "the person's own base URL stays");
});

test("session: what the engine sends draws the turn; a failure is the turn's error; a question after a stop is dropped", () => {
  let state: ChatState = { turns: [], queue: [], running: false, edits: {}, undoFailed: {} };
  state = reduce(state, { type: "send", text: "Hi", at: 0 });
  state = reduce(state, { type: "message", message: { type: "stream_event", event: { type: "content_block_delta", delta: { type: "text_delta", text: "Hel" } } }, at: 1 });
  state = reduce(state, { type: "message", message: { type: "result", subtype: "error_during_execution", duration_ms: 2000, error: "Claude isn't signed in" }, at: 2 });
  const turn = state.turns.at(-1)!;
  assert.equal(state.running, false);
  assert.ok(turn.author === "assistant" && turn.done && turn.error === "Claude isn't signed in");
  assert.ok(turn.author === "assistant" && turn.parts[0]!.kind === "text" && !turn.parts[0]!.streaming, "the streamed text stops streaming");
  const ask = { type: "permission_request", tool_use_id: "t", tool_name: "Bash", title: "Run it?", description: "", input: {} } as const;
  assert.equal(reduce(state, { type: "message", message: ask, at: 3 }).approval, undefined);
  state = reduce(state, { type: "undoFailed", reasons: { t: "the file has changed since this edit." } });
  assert.equal(state.undoFailed.t, "the file has changed since this edit.");
  assert.equal(reduce(state, { type: "edit", ids: ["t"], state: "kept" }).undoFailed.t, undefined, "a new choice clears the failure");
});
