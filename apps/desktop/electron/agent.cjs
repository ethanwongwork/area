/**
 * The Inspector Chat's engine (Phase 3 of docs/research/inspector-chat-2026-10-18): the Claude Agent SDK in the main
 * process, working in this repository, sending the page what the recorded runs were written as (src/chat/recording.ts):
 *
 *   stream_event        a text or thinking delta
 *   assistant           a finished block: thinking, text or a tool call
 *   user                a tool's result, as text
 *   result              the turn is over (with `error` when it failed)
 *   permission_request  the SDK's canUseTool asked: the Approval; the run waits for the person's answer
 *   question            the agent asked with AskUserQuestion: the question card; the run waits for the answers
 *
 * One conversation per chat id (the page makes a new one on New chat): each prompt is a query that resumes the chat's
 * Claude Code session, so the agent remembers the turns before it. It asks before every edit and command (the owner's
 * decision, 2026-10-18): the permission mode is "default", so only what the repository's settings already allow runs
 * without asking; "Yes, for this session" allows that tool for the rest of the chat.
 *
 * Keep and Undo are real: every file a tool is about to write is read first (a PreToolUse hook, so an edit a settings
 * rule allowed is covered too) and again after; Undo puts the before back while the file is as the edit left it (a
 * turn's edits are undone newest first, so a file edited twice goes back step by step), and says so when it isn't.
 *
 * Auth is the person's own Claude Code sign-in (`claude auth login`) or ANTHROPIC_API_KEY: the SDK runs its own copy
 * of Claude Code, which reads the same sign-in. When the app is started from inside a Claude Code session, that
 * session's variables (CLAUDE*, its ANTHROPIC_BASE_URL) are left out, so the agent is the person's, not a child of the
 * session that launched the app.
 *
 * `createEngine` is the engine without Electron (apps/desktop/tests/agent.test.ts drives it with a stand-in SDK);
 * `register` puts it on IPC.
 */
const { existsSync, readFileSync, unlinkSync, writeFileSync } = require("node:fs");
const { isAbsolute, join, resolve } = require("node:path");

/** The repository: the agent's working directory. */
const ROOT = resolve(__dirname, "..", "..", "..");
const SYSTEM = [
  "You are the agent in Area's desktop app, in the Inspector's Chat. Area is a design system and the app built from it;",
  "this repository is both. Read AGENTS.md first: it is the repository's working guide and its rules apply to you.",
  "The person is a designer, often not technical: speak in the design's words (screens, components, corners, spacing,",
  "colours, tokens by their names in the Inspector), never in file paths, code or git words, unless they ask for code.",
  "When the person sends design changes from the Design view, make them in the screen's source with Area's own",
  "components, props and tokens (never app-only CSS or literal values).",
  // Short answers, details folded (the chat workflow study, P7).
  "Answer first, in two or three sentences. Use a table or a list only when it is shorter than prose, and no headings in",
  "a short reply. Put reasons and detail after a line that is exactly <!-- more -->; the chat folds what follows under",
  "More. Never repeat the question back.",
  // Questions back (P3): the question tool draws a card with the answers to press.
  "When a request is open in a way that changes the result, ask one question with the AskUserQuestion tool before",
  "working: two to four short answers, the one you recommend first with (Recommended) after its label. Don't ask what",
  "you can find out by looking. End a reply with a question in that tool when the next step is a real choice.",
  // Options side by side (P1, P4): drawn as pictures under the open theme's settings.
  "When the person asks for options, directions or alternatives, or a choice is easier seen than described, call",
  "mcp__area__show_options instead of describing them: two to four options, each a short name and its one difference,",
  "with the theme settings that draw it where a setting can show it. The chat draws each as a picture; the person picks",
  "one and their pick arrives as their next message. Don't edit files for options until one is picked.",
  // Changes in design words (P2).
  "After you change files, call mcp__area__log_changes once with what changed on the design, each change a thing, its",
  "property, and its value before and after in the Inspector's words (Save button, Corner, 8px, 12px). The chat shows",
  "these with Keep and Undo, and the files under Show code.",
  "Don't commit, push or start dev servers unless asked.",
].join(" ");
/** How the agent helps, the composer's + menu (P11): Ask and Suggest change no file. */
const MODES = {
  ask: { note: "The person chose Ask: answer and explain, and change nothing. Don't edit or write files.", readOnly: true },
  suggest: { note: "The person chose Suggest: offer options with mcp__area__show_options or a short plan to pick from, and change no file until they pick.", readOnly: true },
  change: { note: "The person chose Change: make the changes, asking before each edit as usual.", readOnly: false },
};
const WRITE_TOOLS = ["Edit", "Write", "MultiEdit", "NotebookEdit"];
/** The settings an option may name (the Inspector's Theme view): `data-area-<axis>` values, as src/gallery/controls.ts
 *  offers them. The page draws only the ones it knows and ignores the rest. */
const OPTION_SETTINGS = "radius (0 2 4 6 8 10 12 14 pill; 10 by default), density (28 Compact, 32 Default, 36 Comfy), " +
  "type (12 to 16; 13), accent (red orange yellow lime green teal cyan blue indigo purple pink, or a hue in steps of 5), " +
  "action (neutral accent), selection (neutral accent), neutral (neutral cool warm), elevation (0 to 8; 8), " +
  "shadow-resting (0 to 8; 3), stroke (0 to 8 in steps of 0.5; 4), layers-light (0 to 100 in steps of 5; 0), " +
  "ground-light (90 to 100; 100), motion (0 to 300 in steps of 30; 210), surface (hairline 0 0.5 1 1.5 2; 1)";
const SIGN_IN = "Claude isn't signed in on this Mac. Run claude auth login in Terminal, or set ANTHROPIC_API_KEY, then send again.";
const EDIT_TOOLS = "Edit|Write|MultiEdit|NotebookEdit";

function agentEnv(source = process.env) {
  const env = { ...source };
  const nested = Boolean(env.CLAUDECODE);
  for (const key of Object.keys(env)) if (/^CLAUDE/.test(key)) delete env[key];
  if (nested) delete env.ANTHROPIC_BASE_URL;
  return env;
}

const textOf = content => typeof content === "string" ? content
  : Array.isArray(content) ? content.map(block => block?.type === "text" ? block.text : block?.type === "image" ? "[image]" : "").join("\n") : "";
const readOrNull = file => { try { return existsSync(file) ? readFileSync(file, "utf8") : null; } catch { return null; } };
/** A failure in words the person can act on: a sign-in failure says how to sign in. */
const plainError = text => /authenticat|not logged in|oauth|\/login|invalid api key/i.test(text) ? SIGN_IN : text;

/** What one SDK message is for the page (src/chat/session.ts), or nothing. Subagents' own steps stay inside their call. */
function forPage(message) {
  if (message.parent_tool_use_id) return [];
  switch (message.type) {
    case "stream_event": {
      const delta = message.event?.type === "content_block_delta" ? message.event.delta : undefined;
      if (delta?.type === "text_delta") return [{ type: "stream_event", event: { type: "content_block_delta", delta: { type: "text_delta", text: delta.text } } }];
      if (delta?.type === "thinking_delta") return [{ type: "stream_event", event: { type: "content_block_delta", delta: { type: "thinking_delta", thinking: delta.thinking } } }];
      return [];
    }
    case "assistant": {
      // A failed request comes back as a reply whose text is the error: the result says it, as the turn's notice.
      if (message.error) return [];
      const content = (message.message?.content ?? []).flatMap(block =>
        block.type === "text" ? [{ type: "text", text: block.text }]
        : block.type === "thinking" ? [{ type: "thinking", thinking: block.thinking ?? "" }]
        : block.type === "tool_use" ? [{ type: "tool_use", id: block.id, name: block.name, input: block.input ?? {} }] : []);
      return content.length ? [{ type: "assistant", message: { content } }] : [];
    }
    case "user": {
      const content = Array.isArray(message.message?.content) ? message.message.content.filter(block => block.type === "tool_result")
        .map(block => ({ type: "tool_result", tool_use_id: block.tool_use_id, content: textOf(block.content), is_error: Boolean(block.is_error) })) : [];
      return content.length ? [{ type: "user", message: { content } }] : [];
    }
    case "result": {
      const failed = message.subtype !== "success" || message.is_error;
      const error = failed ? plainError(message.errors?.join(" ") || (typeof message.result === "string" && message.result) || String(message.subtype).replace(/_/g, " ")) : undefined;
      return [{ type: "result", subtype: failed ? "error_during_execution" : "success", duration_ms: message.duration_ms ?? 0, ...(error ? { error } : {}) }];
    }
    default: return [];
  }
}

/**
 * Area's own tools (the chat workflow study, P1): what the agent can show beside its words, drawn by the chat as Area UI.
 * They only describe; the page draws them (src/chat/chat.tsx), so each answers at once. `sdk` is the Agent SDK's module,
 * `z` zod's; without either (a stand-in SDK in the tests) there are none.
 */
function areaTools(sdk, z) {
  if (!sdk?.createSdkMcpServer || !sdk?.tool || !z) return undefined;
  const settings = z.record(z.string(), z.string()).optional()
    .describe(`Theme settings that draw this option, as setting name to value: ${OPTION_SETTINGS}. Leave out for an option no setting can show.`);
  const showOptions = sdk.tool("show_options",
    "Show two to four options side by side as pictures for the person to pick from. Use it for directions, alternatives and A or B choices. Their pick arrives as their next message.",
    {
      question: z.string().describe("What the person is choosing, as a short question: Which corners suit the cards?"),
      options: z.array(z.object({
        name: z.string().describe("A short name, one to three words: Rounder"),
        difference: z.string().describe("Its one difference from the others, in a short line: Corners 14, more room"),
        settings,
      })).min(2).max(4),
      recommended: z.number().int().min(0).max(3).optional().describe("The option you recommend, by its index from 0"),
      picture: z.enum(["workspace", "analytics", "settings", "phone"]).optional().describe("Which screen to draw them on; workspace by default"),
    },
    async args => ({ content: [{ type: "text", text: `Shown ${args.options.length} options as pictures. Wait for the person's pick, which arrives as their next message.` }] }));
  const logChanges = sdk.tool("log_changes",
    "Say what your file changes did to the design, in the Inspector's words, once after the edits of a reply. The chat lists them with Keep and Undo, the files under Show code.",
    {
      changes: z.array(z.object({
        thing: z.string().describe("What changed, as the design names it: Save button, Cards, Settings page"),
        property: z.string().describe("The property: Corner, Spacing, Fill, Shadow, Words"),
        from: z.string().optional().describe("Its value before: 8px"),
        to: z.string().describe("Its value after: 12px"),
      })).min(1),
    },
    async args => ({ content: [{ type: "text", text: `Logged ${args.changes.length} design change${args.changes.length === 1 ? "" : "s"}.` }] }));
  return sdk.createSdkMcpServer({ name: "area", version: "1.0.0", tools: [showOptions, logChanges] });
}

/** A prompt with pictures: one user message whose content is the pictures, then the words (streaming input). */
async function* withImages(text, images) {
  yield {
    type: "user", parent_tool_use_id: null,
    message: { role: "user", content: [
      ...images.map(image => ({ type: "image", source: { type: "base64", media_type: image.type, data: image.data } })),
      { type: "text", text },
    ] },
  };
}
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);

/**
 * The engine: `toPage(chat, message)` receives what the page shows. `loadSdk` answers the SDK's module (a stand-in in
 * the tests), `root` is where the agent works, `env` what its process reads.
 */
function createEngine({ toPage, loadSdk, loadZod = () => import("zod"), root = ROOT, env = agentEnv() }) {
  const chats = new Map();
  const chatOf = id => {
    if (!chats.has(id)) chats.set(id, { session: undefined, run: undefined, asks: new Map(), allowed: new Set(), files: new Map() });
    return chats.get(id);
  };
  const pathIn = input => {
    const path = typeof input?.file_path === "string" ? input.file_path : typeof input?.notebook_path === "string" ? input.notebook_path : undefined;
    return path ? (isAbsolute(path) ? path : join(root, path)) : undefined;
  };

  async function status() {
    try { await loadSdk(); return { available: true, cwd: root }; }
    catch (error) { return { available: false, reason: String(error?.message ?? error) }; }
  }

  /** Send a prompt: one query, resuming the chat's session. Resolves when the run is over. */
  async function send(chatId, request) {
    const id = String(chatId);
    const chat = chatOf(id);
    const started = Date.now();
    const run = { stopped: false, ended: false, query: undefined };
    chat.run?.query?.close?.();
    chat.run = run;
    const out = message => {
      if (run.stopped || chat.run !== run) return;
      if (message.type === "result") run.ended = true;
      toPage(id, message);
    };
    const text = request?.context ? `${String(request.text)}\n\n(About: ${String(request.context)})` : String(request?.text ?? "");
    // Pictures reach the agent as pictures (P6); before 2026-11-08 only their names did.
    const images = Array.isArray(request?.images) ? request.images.filter(image => IMAGE_TYPES.has(image?.type) && typeof image?.data === "string") : [];
    const prompt = images.length ? withImages(text, images) : text;
    const mode = MODES[request?.mode] ?? MODES.change;
    const snapshot = async input => {
      const file = pathIn(input.tool_input);
      if (file && input.tool_use_id) chat.files.set(input.tool_use_id, { file, before: readOrNull(file), after: undefined });
      return {};
    };
    const settle = async input => {
      const entry = input.tool_use_id ? chat.files.get(input.tool_use_id) : undefined;
      if (entry) entry.after = readOrNull(entry.file);
      return {};
    };
    const canUseTool = (toolName, input, options) => {
      // Area's own tools only describe what to draw: they never ask.
      if (toolName.startsWith("mcp__area__")) return Promise.resolve({ behavior: "allow", updatedInput: input });
      // A question (P3): the page draws it as a question card; its answers go back as the tool's input.
      if (toolName === "AskUserQuestion") {
        return new Promise(answer => {
          const toolUseId = options.toolUseID;
          options.signal?.addEventListener("abort", () => { chat.asks.delete(toolUseId); answer({ behavior: "deny", message: "Stopped." }); });
          chat.asks.set(toolUseId, reply => {
            chat.asks.delete(toolUseId);
            if (reply?.answers && typeof reply.answers === "object") answer({ behavior: "allow", updatedInput: { ...input, answers: reply.answers } });
            else answer({ behavior: "deny", message: "The person skipped the question. Go on with your best judgement and say what you assumed." });
          });
          out({ type: "question", tool_use_id: toolUseId, questions: Array.isArray(input?.questions) ? input.questions : [] });
        });
      }
      if (chat.allowed.has(toolName)) return Promise.resolve({ behavior: "allow", updatedInput: input });
      return new Promise(answer => {
        const toolUseId = options.toolUseID;
        const deny = message => answer({ behavior: "deny", message });
        options.signal?.addEventListener("abort", () => { chat.asks.delete(toolUseId); deny("Stopped."); });
        chat.asks.set(toolUseId, reply => {
          chat.asks.delete(toolUseId);
          if (reply?.allow) {
            if (reply.always) chat.allowed.add(toolName);
            answer({ behavior: "allow", updatedInput: input });
          } else deny(reply?.instead ? `The person said no, and asked instead: ${reply.instead}` : "The person said no to this.");
        });
        const file = pathIn(input);
        out({
          type: "permission_request", tool_use_id: toolUseId, tool_name: toolName,
          title: options.title ?? `Allow ${options.displayName ?? toolName}?`,
          description: options.description ?? options.decisionReason ?? (file ? file.replace(`${root}/`, "") : ""),
          input,
        });
      });
    };
    try {
      const sdk = await loadSdk();
      const { query } = sdk;
      let z;
      try { z = (await loadZod())?.z; } catch { z = undefined; }
      const area = areaTools(sdk, z);
      run.query = query({
        prompt,
        options: {
          cwd: root,
          model: typeof request?.model === "string" ? request.model : undefined,
          resume: chat.session,
          includePartialMessages: true,
          thinking: { type: "adaptive", display: "summarized" },
          permissionMode: "default",
          // Its questions arrive in canUseTool and are answered from the question card (P3; until 2026-11-08 the tool was
          // off and the agent asked in prose). Ask and Suggest take the writing tools away (P11).
          disallowedTools: mode.readOnly ? WRITE_TOOLS : [],
          ...(area ? { mcpServers: { area }, allowedTools: ["mcp__area__show_options", "mcp__area__log_changes"] } : {}),
          settingSources: ["project", "local"],
          systemPrompt: { type: "preset", preset: "claude_code", append: `${SYSTEM} ${mode.note}` },
          env,
          hooks: {
            PreToolUse: [{ matcher: EDIT_TOOLS, hooks: [snapshot] }],
            PostToolUse: [{ matcher: EDIT_TOOLS, hooks: [settle] }],
          },
          stderr: data => { if (/error/i.test(data)) console.error(`[agent] ${data.trim()}`); },
          canUseTool,
        },
      });
      for await (const message of run.query) {
        if (message.session_id) chat.session = message.session_id;
        for (const each of forPage(message)) out(each);
      }
    } catch (error) {
      // The SDK also throws after a failed result; the result has said it already.
      if (!run.ended) out({ type: "result", subtype: "error_during_execution", duration_ms: Date.now() - started, error: plainError(String(error?.message ?? error)) });
    } finally {
      if (chat.run === run) chat.run = undefined;
    }
  }

  const answer = (chatId, toolUseId, reply) => chats.get(String(chatId))?.asks.get(String(toolUseId))?.(reply);

  async function stop(chatId) {
    const chat = chats.get(String(chatId));
    const run = chat?.run;
    if (!run) return;
    run.stopped = true;
    for (const reply of [...chat.asks.values()]) reply({ allow: false });
    try { await run.query?.interrupt(); } catch { run.query?.close?.(); }
  }

  function close(chatId) {
    const chat = chats.get(String(chatId));
    if (!chat) return;
    if (chat.run) { chat.run.stopped = true; chat.run.query?.close?.(); }
    chats.delete(String(chatId));
  }

  /** Undo edits (tool call ids), newest first: each file goes back to what it was before its edit. "ok" or why not. */
  function undo(chatId, ids) {
    const chat = chats.get(String(chatId));
    const results = {};
    for (const id of [...(ids ?? [])].reverse()) {
      const entry = chat?.files.get(String(id));
      if (!entry) { results[id] = "There is no record of this edit."; continue; }
      try {
        if (entry.after !== undefined && readOrNull(entry.file) === entry.after) {
          if (entry.before === null) unlinkSync(entry.file); else writeFileSync(entry.file, entry.before);
          results[id] = "ok";
        } else results[id] = "the file has changed since this edit.";
      } catch (error) { results[id] = String(error?.message ?? error); }
    }
    return results;
  }

  return { status, send, answer, stop, close, undo };
}

function register(getWindow) {
  const { ipcMain } = require("electron");
  const engine = createEngine({
    toPage: (chat, message) => { const window = getWindow(); if (window && !window.isDestroyed()) window.webContents.send("area:agent-event", chat, message); },
    loadSdk: (() => { let sdk; return () => (sdk ??= import("@anthropic-ai/claude-agent-sdk")); })(),
  });
  ipcMain.handle("area:agent-status", () => engine.status());
  ipcMain.on("area:agent-send", (_event, chat, request) => { engine.send(chat, request); });
  ipcMain.on("area:agent-answer", (_event, chat, toolUseId, reply) => engine.answer(chat, toolUseId, reply));
  ipcMain.on("area:agent-stop", (_event, chat) => { engine.stop(chat); });
  ipcMain.on("area:agent-close", (_event, chat) => engine.close(chat));
  ipcMain.handle("area:agent-undo", (_event, chat, ids) => engine.undo(chat, ids));
}

module.exports = { register, createEngine, forPage, agentEnv };
