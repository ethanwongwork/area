/**
 * Recorded runs for the Inspector's Chat view (Phase 1 of docs/research/inspector-chat-2026-10-18): what the agent would
 * stream, written as the Claude Agent SDK's messages (code.claude.com/docs/en/agent-sdk/typescript), so the view model
 * that plays them is the one the live engine will feed in Phase 3. Only the fields the view reads are written.
 *
 *   stream_event   a partial: a text or thinking delta (the SDK sends these with `includePartialMessages`)
 *   assistant      a finished content block: thinking, text or a tool call (`tool_use`)
 *   user           a tool's result (`tool_result`), back from the tool that ran
 *   result         the turn is over
 *
 * Beside them, one event of the app's own: `permission_request`, what the engine sends when the SDK's `canUseTool`
 * asks (Phase 3); the run pauses on it until the person answers, and `denied` is played instead of the rest on a no.
 *
 * Each event waits `wait` ms after the one before. A recording is honest about what it is: its approval says that
 * choosing changes no file, and nothing is written (Phase 2).
 */

export type ToolInput = Readonly<Record<string, unknown>>;
export type SdkMessage =
  | { type: "stream_event"; event: { type: "content_block_delta"; delta: { type: "text_delta"; text: string } | { type: "thinking_delta"; thinking: string } } }
  | { type: "assistant"; message: { content: ReadonlyArray<
      | { type: "thinking"; thinking: string }
      | { type: "text"; text: string }
      | { type: "tool_use"; id: string; name: string; input: ToolInput }> } }
  | { type: "user"; message: { content: ReadonlyArray<{ type: "tool_result"; tool_use_id: string; content: string; is_error?: boolean }> } }
  | { type: "result"; subtype: "success" | "error_during_execution"; duration_ms: number; /** Why it failed (the engine). */ error?: string };

/** The SDK asked before a tool ran (`canUseTool`): what the Approval shows. */
export interface PermissionRequest { type: "permission_request"; tool_use_id: string; tool_name: string; title: string; description: string; input: ToolInput }
export type ChatEvent = SdkMessage | PermissionRequest;

export interface RecordedEvent { wait: number; message: ChatEvent; /** Played instead of the rest when the person says no. */ denied?: RecordedEvent[] }
export interface Recording { id: string; prompt: string; events: readonly RecordedEvent[] }

// Authoring helpers: each returns the SDK messages for one beat of a run.
let toolCount = 0;
const thinking = (ms: number, summary: string): RecordedEvent[] => [
  { wait: 120, message: { type: "stream_event", event: { type: "content_block_delta", delta: { type: "thinking_delta", thinking: "" } } } },
  { wait: ms, message: { type: "assistant", message: { content: [{ type: "thinking", thinking: summary }] } } },
];
const tool = (name: string, input: ToolInput, output: string, ms = 450): RecordedEvent[] => {
  const id = `toolu_recorded_${++toolCount}`;
  return [
    { wait: 160, message: { type: "assistant", message: { content: [{ type: "tool_use", id, name, input }] } } },
    { wait: ms, message: { type: "user", message: { content: [{ type: "tool_result", tool_use_id: id, content: output }] } } },
  ];
};
/** Text streams as the SDK's deltas do, a few words at a time, then lands whole. */
const text = (markdown: string): RecordedEvent[] => {
  const words = markdown.match(/\S+\s*|\s+/g) ?? [];
  const deltas: RecordedEvent[] = [];
  for (let i = 0; i < words.length; i += 3) {
    deltas.push({ wait: 45, message: { type: "stream_event", event: { type: "content_block_delta", delta: { type: "text_delta", text: words.slice(i, i + 3).join("") } } } });
  }
  return [...deltas, { wait: 30, message: { type: "assistant", message: { content: [{ type: "text", text: markdown }] } } }];
};
const done = (ms: number): RecordedEvent => ({ wait: 80, message: { type: "result", subtype: "success", duration_ms: ms } });
/** Claude Code's TodoWrite: the plan, all of it, each time it changes. */
const plan = (statuses: string, labels: readonly string[]): RecordedEvent[] => {
  const key: Record<string, string> = { d: "completed", c: "in_progress", p: "pending" };
  return tool("TodoWrite", { todos: labels.map((content, index) => ({ content, status: key[statuses[index]!] })) }, "Plan updated", 120);
};
/** An edit the SDK asks about first: the request, then (on yes) the edit and its result; on no, the denied beats. */
const edit = (file: string, oldString: string, newString: string, denied: RecordedEvent[]): RecordedEvent[] => {
  const id = `toolu_recorded_${++toolCount}`;
  const name = file.split("/").at(-1)!;
  return [
    { wait: 200, message: { type: "permission_request", tool_use_id: id, tool_name: "Edit", title: `Edit ${name}?`, description: "A recorded run: choosing does not change any file.", input: { file_path: file, old_string: oldString, new_string: newString } }, denied },
    { wait: 120, message: { type: "assistant", message: { content: [{ type: "tool_use", id, name: "Edit", input: { file_path: file, old_string: oldString, new_string: newString } }] } } },
    { wait: 520, message: { type: "user", message: { content: [{ type: "tool_result", tool_use_id: id, content: `Updated ${name}` }] } } },
  ];
};

const BUTTON = "packages/styles/src/components/button.css";
const STEPS = ["Find the outline Button's hover edge", "Choose the next stroke up", "Edit button.css", "Check it under Contrast More"] as const;

export const RECORDINGS: readonly Recording[] = [
  {
    id: "outline-hover",
    prompt: "Make the outline Button's hover a step darker",
    events: [
      ...thinking(2400, "Find where the outline Button sets its hover edge, and the next stroke up."),
      ...plan("cppp", STEPS),
      ...tool("Grep", { pattern: "_line-hover", path: BUTTON }, "button.css: --_line-hover: var(--area-edge-control-hover);"),
      ...tool("Read", { file_path: BUTTON }, "button.css (490 lines)", 380),
      ...tool("Grep", { pattern: "edge-control-strong", path: "packages/tokens/src/emit/base.ts" }, "base.ts: [`${PREFIX}edge-control-strong`]: contrastMix(strokeEdge(\"hover\"), …)", 420),
      ...plan("dcpp", STEPS),
      ...text("The outline Button's hover edge is `--_line-hover`, which the neutral tone sets to `--area-edge-control-hover`, the step every control takes on hover. One step darker is `--area-edge-control-strong`, the edge an unchecked Checkbox takes under the pointer. The change is one line in `button.css`."),
      ...plan("ddcp", STEPS),
      ...edit(BUTTON, "    --_line-hover: var(--area-edge-control-hover);", "    --_line-hover: var(--area-edge-control-strong);", [
        ...text("Okay, I left `button.css` as it is. Say if you'd like a smaller step instead."),
        done(6400),
      ]),
      ...plan("dddc", STEPS),
      ...tool("Grep", { pattern: "stroke-control-hover", path: "packages/tokens/src/emit/base.ts" }, "base.ts: edge-control-strong → stroke-control-hover at More", 360),
      ...plan("dddd", STEPS),
      ...text("Done. The outline Button now steps to the strong edge on hover.\n\n- **Fields stay where they are.** Input and Select keep the regular hover edge, so an outline Button beside a field reads a little stronger under the pointer.\n- **Contrast More is unchanged.** Both edges reach the same 3:1 stroke there.\n\nKeep or undo the edit below."),
      done(11800),
    ],
  },
  {
    id: "card-lift",
    prompt: "Why does a linked Card lift on hover?",
    events: [
      ...thinking(1200, "Look up the Card's hover rule and where its lift comes from."),
      ...tool("Read", { file_path: "packages/styles/src/components/surface.css" }, "surface.css (1,679 lines)", 420),
      ...tool("Read", { file_path: "docs/research/card-hover-2026-10-18.md" }, "card-hover-2026-10-18.md (21 lines)", 300),
      ...text("A linked Card lifts instead of changing its edge because you asked for **no stroke change, a subtle shadow and smooth motion** on 2026-10-18.\n\n### How it works\n\n1. At rest it shows its resting lift, `shadow-resting`.\n2. Under the pointer the lift steps to `shadow-lift`, Fluent's shadow8 at half the Menu's strength, set by Floating.\n3. A press drops the lift at once.\n\n| Moment | Shadow | Timing |\n| --- | --- | --- |\n| In | `shadow-lift` | fast, ease-out |\n| Out | `shadow-resting` | base, ease-in |\n\nAt Floating 0 there is no lift to show, so the edge steps instead. The measurements behind it are in `docs/research/card-hover-2026-10-18.md`."),
      done(5600),
    ],
  },
];

export const DEFAULT_RECORDING = RECORDINGS[0]!;
export const recordingFor = (prompt: string) => RECORDINGS.find(entry => entry.prompt === prompt) ?? DEFAULT_RECORDING;
