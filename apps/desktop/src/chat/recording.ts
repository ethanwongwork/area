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
  | { type: "result"; subtype: "success" | "error_during_execution"; duration_ms: number; /** Why it failed (the engine). */ error?: string;
      /** The agent's session (the engine), kept with the chat so it can go on later. */ session?: string };

/** The SDK asked before a tool ran (`canUseTool`): what the Approval shows. */
export interface PermissionRequest { type: "permission_request"; tool_use_id: string; tool_name: string; title: string; description: string; input: ToolInput }
/** A question the agent asks with AskUserQuestion (the chat workflow study, P3): the question card; the run waits. */
export interface AgentQuestion { question: string; header?: string; options: ReadonlyArray<{ label: string; description?: string }>; multiSelect?: boolean }
export interface QuestionRequest { type: "question"; tool_use_id: string; questions: readonly AgentQuestion[] }
export type ChatEvent = SdkMessage | PermissionRequest | QuestionRequest;

/** What Area's own tools describe (electron/agent.cjs `areaTools`), as the chat draws them. */
export interface ShownOption { name: string; difference: string; settings?: Readonly<Record<string, string>> }
export interface ShowOptionsInput { question: string; options: readonly ShownOption[]; recommended?: number; picture?: string }
export interface LoggedChange { thing: string; property: string; from?: string; to: string }
export const SHOW_OPTIONS = "mcp__area__show_options";
export const LOG_CHANGES = "mcp__area__log_changes";
export const ASK = "AskUserQuestion";

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

/** A question the run pauses on (AskUserQuestion's call, then the card); whatever is answered, the rest plays. */
const question = (asked: AgentQuestion): RecordedEvent[] => {
  const id = `toolu_recorded_${++toolCount}`;
  return [
    { wait: 160, message: { type: "assistant", message: { content: [{ type: "tool_use", id, name: ASK, input: { questions: [asked] } }] } } },
    { wait: 120, message: { type: "question", tool_use_id: id, questions: [asked] } },
    { wait: 200, message: { type: "user", message: { content: [{ type: "tool_result", tool_use_id: id, content: "The person answered." }] } } },
  ];
};

const BUTTON = "packages/styles/src/components/button.css";
const SURFACE = "packages/styles/src/components/surface.css";
const STEPS = ["Find the outline Button's hover edge", "Choose the next stroke up", "Edit button.css", "Check it under Contrast More"] as const;

/** Runs that show the chat's own parts (the chat workflow study, 2026-11-08): options as pictures, a question back,
 *  changes in design words with Show code. Recorded, so nothing they show is written. */
const WORKFLOW: Recording[] = [
  {
    id: "card-options",
    prompt: "Show me a few directions for the cards",
    events: [
      ...thinking(1400, "Three directions that differ in one way each: corners, room and lift."),
      ...tool(SHOW_OPTIONS, {
        question: "Which direction suits the cards?",
        options: [
          { name: "Crisp", difference: "Tighter corners, compact", settings: { radius: "4", density: "28" } },
          { name: "Soft", difference: "Rounder corners, more room", settings: { radius: "14", density: "36" } },
          { name: "Lifted", difference: "A deeper shadow at rest", settings: { "shadow-resting": "6", radius: "10" } },
        ],
        recommended: 1,
      } satisfies ShowOptionsInput, "Shown 3 options as pictures.", 200),
      ...text("Here are three directions, each changing one thing. Soft is my pick: rounder corners and more room read calmer at this size. Pick one to try it on the theme."),
      done(4200),
    ],
  },
  {
    id: "calmer-cards",
    prompt: "Make the cards feel calmer",
    events: [
      ...thinking(1300, "Calmer could mean less contrast at the edge or more room inside; ask which."),
      ...question({ question: "What should feel calmer?", header: "Calmer", options: [
        { label: "The edge (Recommended)", description: "A lighter line round each card" },
        { label: "The room inside", description: "More padding round the words" },
        { label: "Both", description: "A lighter line and more room" },
      ] }),
      ...tool("Read", { file_path: SURFACE }, "surface.css (1,679 lines)", 380),
      ...edit(SURFACE, "    --_card-edge: var(--area-card-edge, var(--area-edge-cards));", "    --_card-edge: var(--area-card-edge, var(--area-edge-dividers));", [
        ...text("Okay, I left the cards as they are. Say if you'd like a different step."),
        done(5200),
      ]),
      ...tool(LOG_CHANGES, { changes: [
        { thing: "Cards", property: "Edge", from: "Cards", to: "Dividers" },
      ] satisfies LoggedChange[] }, "Logged 1 design change.", 120),
      ...text("The cards' edge is a step lighter, so they sit quieter on the page.\n\n<!-- more -->\n\nI used the Dividers edge, the one rules between rows take, rather than a new value. Increased contrast still strengthens it, so the cards stay distinct for anyone who needs that."),
      done(8600),
    ],
  },
];

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
  ...WORKFLOW,
];


export const DEFAULT_RECORDING = RECORDINGS[0]!;
export const recordingFor = (prompt: string) => RECORDINGS.find(entry => entry.prompt === prompt) ?? DEFAULT_RECORDING;
