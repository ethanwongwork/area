/**
 * The Inspector's Chat view (Phase 1 of docs/research/inspector-chat-2026-10-18; owner, 2026-10-18: "Go with your
 * recommendations on all six decisions and start Phase 1: the Chat view on a recorded run").
 *
 * Two pieces, so the Inspector and the Testing screen can place them: the transcript (Message turns, markdown, the
 * run's steps as Step, Step group and Reasoning, its edits as an Edit summary, a stopped turn's Turn notice; Phase 2) and
 * the composer (the run's Plan above it, an Approval in its place while the agent asks) (Area's stacked Composer, the Canvas selection as a
 * removable context chip, the Model picker, Stop while a reply streams, Scroll to latest above it). The transcript
 * follows the newest line while the reader is at the end, and leaves them be once they scroll up (Cursor sticks within
 * a few pixels of the end).
 *
 * The chat workflow (docs/research/chat-workflow-2026-11-08; owner, 2026-11-08, "Take all recs"), for designers:
 *   P1, P4  the agent's options drawn as pictures to pick from (chat-parts.tsx OptionSet)
 *   P2      changes in the design's words, the files under Show code; approvals in plain words, their code folded
 *   P3      the agent's questions as a card in the composer's place, the answer kept in the conversation
 *   P5      the work folded into one line in plain words (Settings › Chat › Work: Summary or Every step)
 *   P6      the @ menu offers design things (this page, components, the theme's settings, past chats) before files;
 *           pictures reach the agent as pictures
 *   P7      replies lead with the answer, details folded under More
 *   P8, P13 Restore to here and Edit on a person's message; Try again and Try another way on a reply; Ask about this on
 *           selected words
 *   P9      the Design view's changes ride in the composer as one card
 *   P10     the composer grows to eight lines, then Expand; starters in the / menu; a long paste becomes a chip
 *   P11     the + menu says how Claude helps: Ask, Suggest or Change
 *
 * In the Inspector the transcript is the Panel's body and the composer its footer, with no rule above it; the session
 * lives at the app's level (ChatProvider), so a conversation survives switching tabs and views.
 */
import { createContext, Fragment, useContext, useEffect, useLayoutEffect, useRef, useState, type Dispatch, type ReactNode, type RefObject, type SetStateAction } from "react";
import { Accordion, AccordionItem, Approval, Attachment, Button, Chip, CodeBlock, Composer, ComposerMenu, CopyButton, Diff, EditSummary, EditSummaryChange, EditSummaryFile, EmptyState, Menu, MenuItem, MenuLabel, MenuSeparator, Message, MessageActions, ModelPicker, Plan, PromptSuggestions, Queue, Reasoning, ScrollToLatest, Step, StepGroup, Timestamp, Tooltip, TurnNotice, formatTimestamp, TIMESTAMP_GAP, type ComposerMenuGroup, type ComposerMenuItem, type DiffHunk } from "@area/react";
import { AddIcon, ChatAddIcon, ChatIcon, ChatQuestionIcon, CommandIcon, ComponentIcon, DocumentIcon, HistoryIcon, ImagePlusIcon, LayersIcon, LightbulbIcon, PaletteIcon, PencilIcon, RotateIcon, TextQuoteIcon } from "@area/icons";
import { RECORDINGS, ASK, LOG_CHANGES, SHOW_OPTIONS, type LoggedChange } from "./recording.ts";
import { useChatSession, type Attached, type ChatSession, type HelpMode, type OutgoingImage, type Part, type SendExtra, type Turn } from "./session.ts";
import { AskedQuestion, OptionSet, QuestionCard, ReplyText } from "./chat-parts.tsx";
import { plainName, plainStep, workLine } from "./words.ts";
import { readStored, writeStored } from "../storage.ts";
import { useStudio } from "../studio.tsx";
import { FAMILIES } from "../pages/components.tsx";
import { GALLERY_CONTROLS } from "../gallery/controls.ts";

/** The models offered (Claude Opus 5.5 by default; the engine passes the value to the Agent SDK, electron/agent.cjs). */
export const CHAT_MODELS = [
  { value: "claude-opus-5-5", label: "Claude Opus 5.5", description: "Most capable for long, agentic work" },
  { value: "claude-sonnet-5-5", label: "Claude Sonnet 5.5", description: "Fast, for everyday edits" },
  { value: "claude-haiku-5-5", label: "Claude Haiku 5.5", description: "Fastest, for quick questions" },
];

/** A stored choice every reader follows (Settings › Chat writes it, the chat reads it). */
function useStoredChoice<T extends string>(key: string, event: string, fallback: T, valid: (value: string) => boolean): [T, (value: T) => void] {
  const saved = () => { const value = readStored<string>(key, fallback); return (valid(value) ? value : fallback) as T; };
  const [value, setValue] = useState(saved);
  useEffect(() => {
    const follow = () => setValue(saved());
    addEventListener(event, follow);
    return () => removeEventListener(event, follow);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return [value, (next: T) => { writeStored(key, next); dispatchEvent(new Event(event)); }];
}

/** The model chats start with (Settings › Chat), kept between launches; every reader follows a change. */
export const useDefaultModel = () => useStoredChoice<string>("chat-model", "area-chat-model", CHAT_MODELS[0]!.value, value => CHAT_MODELS.some(entry => entry.value === value));
/** How the work shows (Settings › Chat › Work, P5): one line in plain words, or every step. */
export type WorkView = "summary" | "steps";
export const useWorkView = () => useStoredChoice<WorkView>("chat-work", "area-chat-work", "summary", value => value === "summary" || value === "steps");

/** A finished conversation, kept so a new one can bring it in from the @ menu (P6): its first prompt as its title, when
 *  it last changed, and what was said, in words. */
export interface PastChat { id: string; title: string; at: number; text: string }
const HISTORY_KEY = "chat-history", HISTORY_EVENT = "area-chat-history", HISTORY_LIMIT = 20, HISTORY_TEXT = 6000;
const readHistory = () => { const saved = readStored<PastChat[]>(HISTORY_KEY, []); return Array.isArray(saved) ? saved.filter(entry => entry && typeof entry.id === "string") : []; };
/** The kept conversations, newest first; every reader follows a change. */
export function usePastChats(): PastChat[] {
  const [chats, setChats] = useState(readHistory);
  useEffect(() => {
    const follow = () => setChats(readHistory());
    addEventListener(HISTORY_EVENT, follow);
    return () => removeEventListener(HISTORY_EVENT, follow);
  }, []);
  return chats;
}
function keepChat(chat: PastChat) {
  writeStored(HISTORY_KEY, [chat, ...readHistory().filter(entry => entry.id !== chat.id)].slice(0, HISTORY_LIMIT));
  dispatchEvent(new Event(HISTORY_EVENT));
}
/** A conversation in words, as the agent reads a past chat: who said what, the reply's text without its More marker. */
const chatText = (turns: readonly Turn[]) => turns.map(turn => turn.author === "user" ? `Person: ${turn.text}` : `Claude: ${plainText(turn)}`).join("\n\n").slice(0, HISTORY_TEXT);
let conversations = 0;
const newConversation = () => `conversation-${Date.now().toString(36)}-${++conversations}`;

/** The Design view's changes waiting in the composer (P9): the card, what the agent reads, and what happens once sent. */
export interface ChangeSet { title: string; items: ReadonlyArray<{ thing: string; change: string }>; prompt: string; onSent?: () => void }

interface ChatContextValue {
  session: ChatSession;
  model: string;
  setModel: (model: string) => void;
  /** What the Canvas has chosen, as the context chip names it ("Button · Default"), or nothing. */
  selection?: string;
  composer: RefObject<HTMLTextAreaElement | null>;
  /** The composer's draft, here so a reply's Ask about this and a message's Edit can write into it. */
  draft: string;
  setDraft: Dispatch<SetStateAction<string>>;
  /** The Design view's changes waiting to be sent (P9), or null. */
  changes: ChangeSet | null;
  setChanges: (changes: ChangeSet | null) => void;
  /** This conversation's id among the kept ones, so the @ menu leaves it out. */
  conversation: string;
}
const ChatContext = createContext<ChatContextValue | null>(null);
export const useChat = () => {
  const value = useContext(ChatContext);
  if (!value) throw new Error("useChat outside <ChatProvider>");
  return value;
};

/** When the turn before `index` ended: a person's message at its time; a reply at its prompt's time plus how long it
 * ran (replies carry no clock of their own). Undefined for the first turn. */
function lastActivity(turns: Turn[], index: number): number | undefined {
  const previous = turns[index - 1];
  if (!previous) return undefined;
  if (previous.author === "user") return previous.at;
  const prompt = turns.slice(0, index - 1).reverse().find(entry => entry.author === "user");
  return prompt && prompt.author === "user" ? prompt.at + (previous.seconds ?? 0) * 1000 : undefined;
}

/** The app's one conversation, above every tab (src/studio.tsx). */
export function ChatProvider({ selection, children }: { selection?: string; children: ReactNode }) {
  // The composer's menu changes this chat's model; Settings › Chat sets the one chats start with, and this chat follows it.
  const [preferred] = useDefaultModel();
  const [model, setModel] = useState(preferred);
  useEffect(() => setModel(preferred), [preferred]);
  // The app's chat is live wherever the engine answers (the Electron app); elsewhere it plays the recordings.
  const session = useChatSession(undefined, { live: true, model });
  const composer = useRef<HTMLTextAreaElement | null>(null);
  const [draft, setDraft] = useState("");
  const [changes, setChanges] = useState<ChangeSet | null>(null);
  // Each finished turn keeps the conversation (P6: past chats in the @ menu); New chat starts another.
  const [conversation, setConversation] = useState(newConversation);
  useEffect(() => {
    if (!session.turns.length) { setConversation(newConversation()); return; }
    const first = session.turns.find(turn => turn.author === "user");
    if (session.running || !first || first.author !== "user" || !session.turns.some(turn => turn.author === "assistant" && turn.done)) return;
    keepChat({ id: conversation, title: first.text.slice(0, 120), at: Date.now(), text: chatText(session.turns) });
  }, [session.turns, session.running]); // eslint-disable-line react-hooks/exhaustive-deps
  return <ChatContext.Provider value={{ session, model, setModel, selection, composer, draft, setDraft, changes, setChanges, conversation }}>{children}</ChatContext.Provider>;
}

/** A conversation of its own, for a screen that shows chats side by side (the Testing frames). */
export function ChatScope({ session, selection, children }: { session: ChatSession; selection?: string; children: ReactNode }) {
  const [model, setModel] = useState(CHAT_MODELS[0]!.value);
  const composer = useRef<HTMLTextAreaElement | null>(null);
  const [draft, setDraft] = useState("");
  const [changes, setChanges] = useState<ChangeSet | null>(null);
  return <ChatContext.Provider value={{ session, model, setModel, selection, composer, draft, setDraft, changes, setChanges, conversation: "" }}>{children}</ChatContext.Provider>;
}

/** A Canvas item's path as words: "button/size-small" → "Button · Size small". */
export const selectionLabel = (item?: string) => item
  ? item.split("/").filter(Boolean).map(part => { const words = decodeURIComponent(part).replace(/[-_]+/g, " "); return words[0]!.toUpperCase() + words.slice(1); }).join(" › ")
  : undefined;

// ---- The transcript --------------------------------------------------------------------------------------------

/** How a tool's call reads while it runs and once it is done, in Every step (Cursor's and Codex's verb pairs). */
const VERBS: Record<string, readonly [string, string]> = {
  Read: ["Reading", "Read"], Grep: ["Searching", "Searched"], Glob: ["Finding files", "Found files"],
  Edit: ["Editing", "Edited"], MultiEdit: ["Editing", "Edited"], Write: ["Writing", "Wrote"], NotebookEdit: ["Editing", "Edited"], Bash: ["Running", "Ran"],
  Agent: ["Delegating", "Delegated"], Task: ["Delegating", "Delegated"], Skill: ["Loading a skill", "Loaded a skill"], ToolSearch: ["Finding tools", "Found tools"],
  WebFetch: ["Fetching", "Fetched"], WebSearch: ["Searching the web", "Searched the web"], TodoWrite: ["Updating the plan", "Updated the plan"],
};
/** Reads and searches fold into one "Explored" group (Cursor, Codex). */
const EXPLORE = new Set(["Read", "Grep", "Glob"]);
/** Tools the chat draws as UI of their own, never as a step. */
const DRAWN = new Set([SHOW_OPTIONS, LOG_CHANGES, ASK]);
const detailOf = (input: Readonly<Record<string, unknown>>) => {
  if (typeof input.description === "string" && typeof input.prompt === "string") return input.description;
  if (typeof input.skill === "string") return input.skill;
  const path = typeof input.file_path === "string" ? input.file_path.split("/").at(-1) : undefined;
  const pattern = typeof input.pattern === "string" ? input.pattern : undefined;
  const command = typeof input.command === "string" ? input.command : undefined;
  const where = typeof input.path === "string" ? ` in ${input.path.split("/").at(-1)}` : "";
  return path ?? (pattern ? `${pattern}${where}` : command) ?? "";
};

type ToolPart = Extract<Part, { kind: "tool" }>;
/** An Edit's change as a Diff: its old lines out, its new lines in; a Write's text, all in. No line numbers yet. */
function editOf(part: ToolPart) {
  const before = typeof part.input.old_string === "string" ? part.input.old_string.split("\n") : [];
  const after = typeof part.input.new_string === "string" ? part.input.new_string.split("\n")
    : typeof part.input.content === "string" ? part.input.content.split("\n") : [];
  const path = typeof part.input.file_path === "string" ? part.input.file_path : "file";
  const name = path.split("/").at(-1)!;
  const hunks: DiffHunk[] = [{ lines: [
    ...before.map(text => ({ kind: "deleted" as const, text })),
    ...after.map(text => ({ kind: "added" as const, text })),
  ] }];
  return { name, path, added: after.length, removed: before.length, hunks };
}
const isEdit = (part: Part): part is ToolPart => part.kind === "tool" && (part.name === "Edit" || part.name === "Write");

/** One tool call as a Step: its verb pair, what it acted on, and its output (or its diff) when opened. */
function ToolStep({ part }: { part: ToolPart }) {
  const [live, past] = VERBS[part.name] ?? [part.name, part.name];
  const status = part.status === "running" ? "running" : part.status === "error" ? "error" : "complete";
  if (part.name === "TodoWrite") {
    const plan = Array.isArray(part.input.todos) ? part.input.todos as Array<{ status?: string }> : [];
    return <Step verb={part.status === "running" ? live : past} detail={`${plan.filter(todo => todo.status === "completed").length} of ${plan.length} done`} status={status} />;
  }
  if (part.name === "Edit" || part.name === "Write") {
    const edit = editOf(part);
    return <Step verb={part.status === "running" ? live : past} detail={edit.name} status={status}
      meta={part.status === "done" ? `+${edit.added} −${edit.removed}` : undefined}>
      {part.status === "done" ? <Diff aria-label={`Changes to ${edit.name}`} hunks={edit.hunks} /> : null}
    </Step>;
  }
  return <Step verb={part.status === "running" ? live : past} detail={detailOf(part.input)} status={status}>
    {part.output && part.status !== "running" ? <CodeBlock size="sm" lineNumbers={false} code={part.output} wrap /> : null}
  </Step>;
}

/** One tool call in plain words, inside the folded line (P5): "Looked at Button's styles", its output a click away. */
function PlainStep({ part }: { part: ToolPart }) {
  const [live, past] = plainStep(part.name, part.input);
  const status = part.status === "running" ? "running" : part.status === "error" ? "error" : "complete";
  return <Step verb={part.status === "running" ? live : past} status={status}>
    {isEdit(part) && part.status === "done" ? <Diff aria-label={`Changes to ${editOf(part).name}`} hunks={editOf(part).hunks} />
      : part.output && part.status !== "running" ? <CodeBlock size="sm" lineNumbers={false} code={part.output} wrap /> : null}
  </Step>;
}

/**
 * An assistant turn's parts. Text keeps Message's 16 between blocks (its More folded, P7); the agent's options and
 * questions are drawn as UI where they came; the rest is work. In Summary (P5) each run of work between them is one
 * line in plain words that opens to its steps; in Every step each tool call is a Step, runs of reads folded into
 * "Explored N items".
 */
function AssistantParts({ turn, view }: { turn: Extract<Turn, { author: "assistant" }>; view: WorkView }) {
  const { session } = useChat();
  const parts = turn.parts;
  const out: ReactNode[] = [];
  let run: Part[] = [];
  let runEnd = -1;
  const lastWork = (() => { for (let i = parts.length - 1; i >= 0; i--) { const part = parts[i]!; if (part.kind === "thinking" || (part.kind === "tool" && !DRAWN.has(part.name))) return i; } return -1; })();
  const flushSummary = () => {
    if (!run.length) return;
    const endsAt = runEnd;
    const running = !turn.done && run.some(part => (part.kind === "thinking" && part.seconds === undefined) || (part.kind === "tool" && part.status === "running"));
    const failed = run.some(part => part.kind === "tool" && part.status === "error");
    const label = workLine(run, running, turn.done && endsAt === lastWork ? turn.seconds : undefined);
    out.push(<StepGroup key={`work-${out.length}`} verb={label} status={running ? "running" : failed ? "error" : "complete"}>
      {run.map((part, index) => part.kind === "thinking"
        ? <Reasoning key={`thinking-${index}`} running={part.seconds === undefined} seconds={part.seconds}>{part.summary}</Reasoning>
        : part.kind === "tool" ? <PlainStep key={part.id} part={part} /> : null)}
    </StepGroup>);
    run = [];
  };
  let steps: ReactNode[] = [];
  let explore: ToolPart[] = [];
  const flushExplore = () => {
    if (explore.length >= 2) {
      const running = explore.some(part => part.status === "running");
      steps.push(<StepGroup key={`group-${explore[0]!.id}`} verb={running ? "Exploring" : "Explored"} detail={`${explore.length} items`} status={running ? "running" : "complete"}>
        {explore.map(part => <ToolStep key={part.id} part={part} />)}
      </StepGroup>);
    } else for (const part of explore) steps.push(<ToolStep key={part.id} part={part} />);
    explore = [];
  };
  const flushSteps = () => {
    flushExplore();
    if (steps.length) out.push(<div key={`steps-${out.length}`} className="studio-chat__steps">{steps}</div>);
    steps = [];
  };
  const flush = () => view === "summary" ? flushSummary() : flushSteps();
  parts.forEach((part, index) => {
    if (part.kind === "text") { flush(); out.push(<ReplyText key={`text-${index}`} text={part.text} />); return; }
    if (part.kind === "tool" && part.name === LOG_CHANGES) return; // drawn in the turn's Edit summary
    if (part.kind === "tool" && part.name === SHOW_OPTIONS) { flush(); out.push(<OptionSet key={part.id} part={part} session={session} />); return; }
    if (part.kind === "tool" && part.name === ASK) { flush(); out.push(<AskedQuestion key={part.id} part={part} answers={session.answers[part.id]} />); return; }
    if (view === "summary") { run.push(part); runEnd = index; return; }
    if (part.kind === "thinking") { flushExplore(); steps.push(<Reasoning key={`thinking-${index}`} running={part.seconds === undefined} seconds={part.seconds}>{part.summary}</Reasoning>); }
    else if (EXPLORE.has(part.name)) explore.push(part);
    else { flushExplore(); steps.push(<ToolStep key={part.id} part={part} />); }
  });
  flush();
  return <>{out}</>;
}

const plainText = (turn: Extract<Turn, { author: "assistant" }>) =>
  turn.parts.filter((part): part is Extract<Part, { kind: "text" }> => part.kind === "text").map(part => part.text.split(/<!--\s*more\s*-->/i).join("")).join("\n\n");

/**
 * The turn's edits, once it is done: Edit summary with Keep and Undo. With the agent's own account of them (log_changes,
 * P2) it reads in the design's words, a row a change ("Cards", "Edge Cards → Dividers"), and the files fold under Show
 * code; without one, a row a file. Live, Undo puts the file back (electron/agent.cjs) and says why when it can't; a
 * recorded run changes no file either way.
 */
function TurnEdits({ turn }: { turn: Extract<Turn, { author: "assistant" }> }) {
  const { session } = useChat();
  const edits = turn.parts.filter(isEdit).filter(part => part.status === "done");
  if (!edits.length) return null;
  const files = edits.map(part => ({ id: part.id, ...editOf(part), state: session.edits[part.id] ?? "pending" }));
  const pending = files.filter(file => file.state === "pending").map(file => file.id);
  const failed = files.filter(file => session.undoFailed[file.id]);
  const added = files.reduce((sum, file) => sum + file.added, 0), removed = files.reduce((sum, file) => sum + file.removed, 0);
  const logged = turn.parts.flatMap(part => part.kind === "tool" && part.name === LOG_CHANGES && Array.isArray(part.input.changes) ? part.input.changes as LoggedChange[] : []);
  const rows = files.map(file => (
    <EditSummaryFile key={file.id} name={file.path.includes("/") ? file.path.split("/").slice(-3).join("/") : file.name} added={file.added} deleted={file.removed} status={file.state}
      onKeep={() => session.setEdits([file.id], "kept")} onUndo={() => session.setEdits([file.id], "undone")}
      diff={<Diff aria-label={`Changes to ${file.name}`} hunks={file.hunks} />} />
  ));
  const settled = files.every(file => file.state === "kept") ? "kept" : files.every(file => file.state === "undone") ? "undone" : "pending";
  return (<>
    {logged.length ? (
      <EditSummary title={`Changed ${logged.length === 1 ? "1 thing" : `${logged.length} things`}`} added={added} deleted={removed}
        onKeepAll={pending.length ? () => session.setEdits(pending, "kept") : undefined}
        onUndoAll={pending.length ? () => session.setEdits(pending, "undone") : undefined}
        code={rows}>
        {logged.map((change, index) => <EditSummaryChange key={index} name={change.thing} property={change.property} from={change.from} to={change.to} status={settled} />)}
      </EditSummary>
    ) : (
      <EditSummary title={`Edited ${files.length} file${files.length === 1 ? "" : "s"}`} added={added} deleted={removed}
        onKeepAll={pending.length ? () => session.setEdits(pending, "kept") : undefined}
        onUndoAll={pending.length ? () => session.setEdits(pending, "undone") : undefined}>
        {rows}
      </EditSummary>
    )}
    {failed.map(file => <TurnNotice key={file.id} status="error">{`Couldn't undo ${plainName(file.path)}: ${session.undoFailed[file.id]}`}</TurnNotice>)}
  </>);
}

/** What rode with a person's message, over their bubble: the Design view's changes as one card, pictures, things. */
function SentWith({ attachments }: { attachments: readonly Attached[] }) {
  const changes = attachments.filter((entry): entry is Extract<Attached, { kind: "changes" }> => entry.kind === "changes");
  const rest = attachments.filter(entry => entry.kind !== "changes");
  return <div className="studio-chat__sent-with">
    {changes.map((set, index) => (
      <EditSummary key={index} title={set.title} className="studio-chat__change-card">
        {set.items.map((item, at) => <EditSummaryChange key={at} name={item.thing} to={item.change} />)}
      </EditSummary>
    ))}
    {rest.length ? <div className="studio-chat__sent-chips">
      {rest.map((entry, index) => entry.kind === "image" ? <Attachment key={index} src={entry.src} name={entry.name} />
        : <Chip key={index} size="sm" icon={entry.kind === "paste" ? <TextQuoteIcon /> : thingIcon(entry.group)}>
          {entry.kind === "paste" ? `${entry.name}, ${entry.lines} lines` : entry.label}
        </Chip>)}
    </div> : null}
  </div>;
}

/** A small icon-only action with its name in a tooltip (Message actions). */
const Act = ({ label, icon, onClick, disabled }: { label: string; icon: ReactNode; onClick: () => void; disabled?: boolean }) => (
  <Tooltip side="bottom" describes={false} trigger={<Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label={label} icon={icon} disabled={disabled} onClick={onClick} />}>{label}</Tooltip>
);

function TurnView({ turn, view }: { turn: Turn; view: WorkView }) {
  const { session, setDraft, composer } = useChat();
  if (turn.author === "user") {
    // Edit and Restore to here (P8, P13): both undo every change from this message on; Edit also puts its words back.
    return <>
      {turn.attachments?.length ? <SentWith attachments={turn.attachments} /> : null}
      <Message author="user" className="studio-chat__turn studio-chat__turn--user"
        actions={!session.running ? <MessageActions>
          <Act label="Edit" icon={<PencilIcon />} onClick={() => { void session.restore(turn.id); setDraft(turn.text); composer.current?.focus(); }} />
          <Act label="Restore to here" icon={<HistoryIcon />} onClick={() => void session.restore(turn.id)} />
        </MessageActions> : undefined}>
        {turn.text}
      </Message>
      {turn.restored ? <p className="studio-chat__restored">Restored to here: changes made after this message were undone.</p> : null}
    </>;
  }
  const text = plainText(turn);
  return (
    <Message author="assistant" authorName="Claude" streaming={!turn.done} className="studio-chat__turn studio-chat__turn--assistant"
      actions={turn.done ? (
        <MessageActions>
          {text ? <CopyButton value={text} label="Copy reply" variant="ghost" tone="neutral" size="sm" iconOnly /> : null}
          <Act label="Try again" icon={<RotateIcon />} disabled={session.running} onClick={() => void session.retry(turn.id)} />
          <Act label="Try another way" icon={<LightbulbIcon />} disabled={session.running} onClick={() => void session.retry(turn.id, true)} />
        </MessageActions>
      ) : undefined}>
      <AssistantParts turn={turn} view={view} />
      {turn.done ? <TurnEdits turn={turn} /> : null}
      {turn.stopped ? <TurnNotice status="stopped">You stopped this reply{turn.seconds ? ` after ${turn.seconds}s` : ""}.</TurnNotice> : null}
      {turn.error ? <TurnNotice status="error">{turn.error}</TurnNotice> : null}
    </Message>
  );
}

/**
 * The conversation, or, before the first prompt, what to ask. `scroller` is the element that scrolls (the Panel's body
 * in the Inspector): while its reader is at the end, each new line keeps them there. Words selected in a reply offer
 * Ask about this (P13), which quotes them into the composer.
 */
export function ChatTranscript({ scroller }: { scroller: RefObject<HTMLElement | null> }) {
  const { session, composer, setDraft } = useChat();
  const [view] = useWorkView();
  const pinned = useRef(true);
  const transcript = useRef<HTMLDivElement | null>(null);
  const [quote, setQuote] = useState<{ text: string; top: number; left: number } | null>(null);
  useEffect(() => {
    const element = scroller.current;
    if (!element) return;
    const onScroll = () => { pinned.current = element.scrollHeight - element.scrollTop - element.clientHeight < 8; };
    element.addEventListener("scroll", onScroll, { passive: true });
    return () => element.removeEventListener("scroll", onScroll);
  }, [scroller]);
  useLayoutEffect(() => {
    const element = scroller.current;
    if (element && pinned.current) element.scrollTop = element.scrollHeight;
  }, [session.turns, scroller]);
  const noticeSelection = () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() ?? "";
    const box = transcript.current;
    if (!selection || !text || !box || selection.rangeCount === 0) { setQuote(null); return; }
    const range = selection.getRangeAt(0);
    const reply = (range.commonAncestorContainer instanceof Element ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement)?.closest(".studio-chat__turn--assistant");
    if (!reply || !box.contains(reply)) { setQuote(null); return; }
    const rect = range.getBoundingClientRect(), outer = box.getBoundingClientRect();
    setQuote({ text, top: rect.bottom - outer.top + 4, left: Math.max(0, Math.min(rect.left - outer.left, outer.width - 120)) });
  };
  if (!session.turns.length) {
    return (
      <div className="studio-chat__empty">
        <EmptyState size="sm" icon={<ChatIcon />} title="Ask about Area"
          description={session.mode === "live" ? "Claude works in this repository and asks before each change."
            : "Replies here are recorded runs: Claude answers in the Area app."} />
        <PromptSuggestions layout="chips" label="Suggested prompts"
          items={RECORDINGS.map(recording => ({ id: recording.id, label: recording.prompt }))}
          onSelect={suggestion => { session.send(suggestion.label); composer.current?.focus(); }} />
      </div>
    );
  }
  const title = session.turns.find(turn => turn.author === "user");
  return (
    <>
      {/* The conversation's head: its first prompt as its title, and New chat (Claude Code's header). It stays while the
          turns scroll under it; the Inspector's bar holds the view pills, with no room for it at 256. */}
      <div className="studio-chat__head">
        <span className="studio-chat__title">{title?.author === "user" ? title.text : "Chat"}</span>
        <NewChatButton />
      </div>
      <div ref={transcript} className="studio-chat__transcript" aria-live="polite" aria-busy={session.running || undefined}
        onMouseUp={noticeSelection} onKeyUp={event => { if (event.shiftKey) noticeSelection(); }}>
        {session.turns.map((turn, index) => {
          // A time before a person's message that comes over an hour after the conversation's last turn, either side's, or
          // before the first message if it is over an hour old (TIMESTAMP_GAP; never on a reply, never on every message).
          const before = lastActivity(session.turns, index);
          const stamp = turn.author === "user" && (before === undefined ? Date.now() - turn.at > TIMESTAMP_GAP : turn.at - before > TIMESTAMP_GAP);
          return <Fragment key={turn.id}>
            {stamp && turn.author === "user" ? <Timestamp className="studio-chat__stamp" dateTime={new Date(turn.at)}>{formatTimestamp(new Date(turn.at))}</Timestamp> : null}
            <TurnView turn={turn} view={view} />
          </Fragment>;
        })}
        {quote ? (
          <span className="studio-chat__ask-about" style={{ insetBlockStart: `${quote.top}px`, insetInlineStart: `${quote.left}px` }}>
            <Button size="sm" variant="soft" tone="neutral" icon={<ChatQuestionIcon />} onMouseDown={event => event.preventDefault()}
              onClick={() => { const quoted = quote.text.split("\n").map(line => `> ${line}`).join("\n"); setDraft(current => `${quoted}\n\n${current}`); setQuote(null); window.getSelection()?.removeAllRanges(); composer.current?.focus(); }}>
              Ask about this
            </Button>
          </span>
        ) : null}
      </div>
    </>
  );
}

// ---- The composer ----------------------------------------------------------------------------------------------

/** Files the @ menu offers after the design things (P6): real paths in this repo, for whoever wants a file. */
const MENTION_FILES = [
  "packages/styles/src/components/button.css", "packages/styles/src/components/input.css", "packages/styles/src/components/card.css",
  "packages/styles/src/components/composer.css", "packages/styles/src/components/surface.css", "packages/styles/src/components/plan.css",
  "packages/tokens/src/emit/base.ts", "packages/tokens/src/axes/elevation.ts", "docs/specs/button.md", "docs/DESIGN_SYSTEM.md",
  "apps/desktop/src/studio.tsx",
];
/** The / menu: New chat, then starters that fill an outline to complete (P10). */
const COMMANDS = [
  { id: "new", label: "New chat", description: "Start a new conversation" },
  { id: "explore", label: "Explore options for…", description: "Options side by side to pick from", fill: "Explore options for " },
  { id: "match", label: "Match a reference…", description: "Attach a picture, then say what to match", fill: "Match this reference: " },
  { id: "tidy", label: "Tidy the spacing on…", description: "Even gaps and insets on a screen or component", fill: "Tidy the spacing on " },
  { id: "explain", label: "Explain how…", description: "An answer, nothing changed", fill: "Explain how ", help: "ask" as HelpMode },
];
/** Theme settings the @ menu offers (P6), by their Inspector names. */
const THEME_SETTINGS = ["radius", "density", "type", "accent", "action", "elevation", "shadow-resting", "stroke", "motion"] as const;

/** How Claude helps (P11): each with one plain line, Ask and Suggest changing nothing. */
const HELP: ReadonlyArray<{ value: HelpMode; label: string; note: string; placeholder: string }> = [
  { value: "ask", label: "Ask", note: "Answers, changes nothing", placeholder: "Ask a question; nothing changes" },
  { value: "suggest", label: "Suggest", note: "Options to pick from first", placeholder: "Ask for options to pick from" },
  { value: "change", label: "Change", note: "Makes changes, asking first", placeholder: "Ask about Area, or a change to make" },
];

/** A thing picked from the @ menu: what the chip says, and what the agent reads. */
interface Thing { id: string; label: string; group: string; about: string; /** Muted at the row's end (a past chat's date). */ detail?: string }
interface Picked { id: string; file: File; name: string; src: string }
interface Pasted { id: string; name: string; text: string; lines: number }
let attachedIds = 0;
/** A paste this long folds into a chip (P10; a reference folds long pastes into a "Clipboard (N lines)" pill). */
const LONG_PASTE = { lines: 12, characters: 1200 };

const thingIcon = (group: string) => group === "Components" ? <ComponentIcon /> : group === "This page" ? <LayersIcon /> : group === "Theme" ? <PaletteIcon /> : group === "Past chats" ? <ChatIcon /> : <DocumentIcon />;

/** The @ or / being typed at the end of the draft, and what follows it. */
function triggerOf(draft: string): { char: "@" | "/"; query: string; start: number } | undefined {
  const match = /(^|\s)([@/])([^\s@/]*)$/.exec(draft);
  if (!match) return undefined;
  if (match[2] === "/" && match.index + match[1]!.length !== 0) return undefined; // a command only at the start
  return { char: match[2] as "@" | "/", query: match[3]!.toLowerCase(), start: match.index + match[1]!.length };
}

const base64Of = (file: File) => new Promise<string>((done, fail) => {
  const reader = new FileReader();
  reader.onload = () => done(String(reader.result).replace(/^data:[^,]*,/, ""));
  reader.onerror = () => fail(reader.error);
  reader.readAsDataURL(file);
});

/** The design things the @ menu offers: this page and its layers (in a project), components, the theme's settings. */
function useThings(): Thing[] {
  const studio = useStudio();
  const { conversation } = useChat();
  const past = usePastChats();
  const things: Thing[] = [];
  const project = studio.openProject;
  if (project) {
    for (const page of project.pages) {
      things.push({ id: `page-${page.id}`, label: page.name, group: "This page", about: `the ${page.name} page of the project ${project.name}` });
      for (const layer of page.layers) things.push({ id: `layer-${page.id}-${layer.id}`, label: `${page.name} › ${layer.name}`, group: "This page", about: `the ${layer.name} layer (${layer.kind} ${layer.ref}) on the ${page.name} page of the project ${project.name}` });
    }
  }
  for (const family of FAMILIES) things.push({ id: `component-${family.slug}`, label: family.name, group: "Components", about: `the ${family.name} component (its spec: docs/specs/${family.slug}.md)` });
  things.push({ id: "theme", label: `${studio.openSystem.name} › ${studio.openTheme.name}`, group: "Theme", about: `the ${studio.openTheme.name} theme of the ${studio.openSystem.name} system, as the Inspector's Theme view sets it` });
  for (const axis of THEME_SETTINGS) {
    const control = GALLERY_CONTROLS.find(entry => entry.axis === axis);
    if (!control) continue;
    const value = (studio.canvas as unknown as Record<string, string>)[axis] ?? control.defaultValue;
    const said = control.items.find(item => item.value === value)?.label?.replace(/ \(Default\)$/, "") ?? value;
    things.push({ id: `setting-${axis}`, label: `${control.label}: ${said}`, group: "Theme", about: `the theme setting ${control.label} (data-area-${axis}), now ${said}` });
  }
  for (const chat of past) {
    if (chat.id === conversation) continue;
    const when = new Date(chat.at).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    things.push({ id: `chat-${chat.id}`, label: chat.title.length > 48 ? `${chat.title.slice(0, 47)}…` : chat.title, group: "Past chats", detail: when,
      about: `an earlier chat, "${chat.title}", from ${when}. What was said:\n${chat.text}` });
  }
  return things;
}

/** The composer and what rides with it: the Queue and the Plan over it, Scroll to latest above it; inside it the
 *  context row (the selection, @-mentioned things, pictures, a long paste, the Design view's changes, how Claude helps)
 *  and the @ and / menu. An Approval or the agent's question takes its place while the agent asks. */
export function ChatComposer({ scroller }: { scroller: RefObject<HTMLElement | null> }) {
  const { session, model, setModel, selection, composer, draft, setDraft, changes, setChanges } = useChat();
  // The selection rides along until it is dismissed; choosing something else on the Canvas brings it back.
  const [dismissed, setDismissed] = useState<string | undefined>();
  const context = selection && selection !== dismissed ? selection : undefined;
  const [things, setThings] = useState<Thing[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [images, setImages] = useState<Picked[]>([]);
  const [pastes, setPastes] = useState<Pasted[]>([]);
  const [help, setHelp] = useState<HelpMode>("change");
  const [expanded, setExpanded] = useState(false);
  const root = useRef<HTMLDivElement | null>(null);
  const [room, setRoom] = useState<number | undefined>();
  const picker = useRef<HTMLInputElement | null>(null);
  const offered = useThings();
  const running = session.turns.at(-1)?.author === "assistant" && session.running;
  // Expanded (P10): the composer takes the panel's height, the transcript's room and its own, less a line of the turns.
  useLayoutEffect(() => {
    if (!expanded) { setRoom(undefined); return; }
    const own = root.current?.offsetHeight ?? 0, above = scroller.current?.clientHeight ?? 0;
    setRoom(Math.max(own, Math.round(above + own - 48)));
  }, [expanded, scroller]);
  // The menu: open while an @ or / is being typed and not dismissed with Esc.
  const menuId = "chat-composer-menu";
  const trigger = triggerOf(draft);
  const [closedAt, setClosedAt] = useState<string | undefined>();
  const matches = (text: string) => !trigger || text.toLowerCase().includes(trigger.query);
  const groups: ComposerMenuGroup[] = !trigger ? [] : trigger.char === "@"
    ? (["This page", "Components", "Theme", "Past chats"] as const).map((label): ComposerMenuGroup => ({
        label, items: offered.filter(thing => thing.group === label && matches(thing.label) && !things.some(entry => entry.id === thing.id)).slice(0, label === "Components" ? 6 : label === "Past chats" ? 4 : 5)
          .map(thing => ({ id: thing.id, label: thing.label, ...(thing.detail ? { path: thing.detail } : {}), icon: thingIcon(thing.group) })),
      })).concat([{ label: "Files", items: MENTION_FILES.filter(path => matches(path) && !files.includes(path)).slice(0, trigger.query ? 5 : 3)
        .map(path => ({ id: `file-${path.replace(/[^a-z0-9]+/gi, "-")}`, label: path.split("/").at(-1)!, path: path.split("/").slice(0, -1).join("/"), icon: <DocumentIcon /> })) }])
      .filter(group => group.items.length)
    : [{ label: "Commands", items: COMMANDS.filter(command => command.id.includes(trigger.query) || command.label.toLowerCase().includes(trigger.query))
        .map(command => ({ id: command.id, label: command.label, path: command.description, icon: command.id === "new" ? <CommandIcon /> : <TextQuoteIcon /> })) }];
  const items = groups.flatMap(group => group.items);
  const open = Boolean(trigger) && closedAt !== draft;
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [trigger?.char, trigger?.query]);
  const activeItem = open ? items[Math.min(active, items.length - 1)] : undefined;
  const pick = (item: ComposerMenuItem) => {
    if (!trigger) return;
    const rest = draft.slice(0, trigger.start);
    if (trigger.char === "/") {
      const command = COMMANDS.find(entry => entry.id === item.id);
      if (item.id === "new") { setDraft(""); session.clear(); clearAll(); }
      else if (command?.fill) { setDraft(command.fill); if (command.help) setHelp(command.help); }
      composer.current?.focus();
      return;
    }
    if (item.id.startsWith("file-")) {
      const path = MENTION_FILES.find(candidate => `file-${candidate.replace(/[^a-z0-9]+/gi, "-")}` === item.id);
      if (path) setFiles(list => [...list, path]);
    } else {
      const thing = offered.find(entry => entry.id === item.id);
      if (thing) setThings(list => [...list, thing]);
    }
    setDraft(rest);
    composer.current?.focus();
  };
  const attach = (list: FileList | readonly File[] | null | undefined) => {
    const pictures = [...(list ?? [])].filter(file => file.type.startsWith("image/"));
    if (!pictures.length) return false;
    setImages(current => [...current, ...pictures.map(file => ({ id: `image-${++attachedIds}`, file, name: file.name || "Pasted image", src: URL.createObjectURL(file) }))]);
    return true;
  };
  const removeImage = (id: string) => setImages(current => { const gone = current.find(image => image.id === id); if (gone) URL.revokeObjectURL(gone.src); return current.filter(image => image.id !== id); });
  const clearAll = () => { setThings([]); setFiles([]); setPastes([]); setImages(current => { current.forEach(image => URL.revokeObjectURL(image.src)); return []; }); };
  // What the agent reads about the message (the bubble shows the things' names): the selection, things, files, pictures.
  const about = () => [context, ...things.map(thing => thing.about), ...files, ...images.map(image => `a picture, ${image.name}`)].filter(Boolean).join("; ") || undefined;
  /** Everything a send carries: the words as the bubble shows them, and what the agent reads. */
  const compose = async (value: string): Promise<{ text: string; extra: SendExtra }> => {
    const pasted = pastes.map(paste => `${paste.name}:\n${paste.text}`).join("\n\n");
    const words = value.trim() || (changes ? "Make these changes." : "");
    const prompt = [words, pasted, changes?.prompt].filter(Boolean).join("\n\n");
    const outgoing: OutgoingImage[] = images.length && session.mode === "live"
      ? await Promise.all(images.map(async image => ({ name: image.name, type: image.file.type, data: await base64Of(image.file) }))) : [];
    const attachments: Attached[] = [
      ...(changes ? [{ kind: "changes" as const, title: changes.title, items: changes.items }] : []),
      ...things.map(thing => ({ kind: "thing" as const, label: thing.label, group: thing.group })),
      ...files.map(path => ({ kind: "thing" as const, label: path.split("/").at(-1)!, group: "Files" })),
      ...pastes.map(paste => ({ kind: "paste" as const, name: paste.name, lines: paste.lines })),
      // The bubble keeps its own copy of each picture (the composer's are let go once sent).
      ...images.map(image => ({ kind: "image" as const, name: image.name, src: URL.createObjectURL(image.file) })),
    ];
    return { text: words, extra: { ...(prompt !== words ? { prompt } : {}), ...(attachments.length ? { attachments } : {}), ...(outgoing.length ? { images: outgoing } : {}), mode: help } };
  };
  const sent = () => { setDraft(""); clearAll(); changes?.onSent?.(); setChanges(null); setExpanded(false); };
  const submit = async (value: string, queue = false) => {
    const { text, extra } = await compose(value);
    if (!text) return;
    const ctx = about();
    sent();
    if (queue) session.enqueue(text, ctx, extra);
    else session.send(text, ctx, extra);
  };
  const helpNow = HELP.find(entry => entry.value === help)!;
  const chips = context || things.length || files.length || images.length || pastes.length || changes || help !== "change" ? <>
    {help !== "change" ? <Chip kind="input" size="sm" icon={help === "ask" ? <ChatQuestionIcon /> : <LightbulbIcon />} title={helpNow.note}
      onDismiss={() => setHelp("change")}>{helpNow.label}</Chip> : null}
    {changes ? <Chip kind="input" size="sm" icon={<PencilIcon />} title={changes.items.map(item => `${item.thing}: ${item.change}`).join("\n")}
      onDismiss={() => setChanges(null)}>{changes.title}</Chip> : null}
    {context ? <Chip kind="input" size="sm" onDismiss={() => setDismissed(selection)}>{context}</Chip> : null}
    {things.map(thing => <Chip key={thing.id} kind="input" size="sm" icon={thingIcon(thing.group)} title={thing.about}
      onDismiss={() => setThings(list => list.filter(entry => entry.id !== thing.id))}>{thing.label}</Chip>)}
    {files.map(path => <Chip key={path} kind="input" size="sm" icon={<DocumentIcon />} title={path}
      onDismiss={() => setFiles(list => list.filter(entry => entry !== path))}>{path.split("/").at(-1)}</Chip>)}
    {pastes.map(paste => <Chip key={paste.id} kind="input" size="sm" icon={<TextQuoteIcon />} title={paste.text.slice(0, 400)}
      onDismiss={() => setPastes(list => list.filter(entry => entry.id !== paste.id))}>{`${paste.name}, ${paste.lines} lines`}</Chip>)}
    {images.map(image => <Attachment key={image.id} src={image.src} name={image.name} onDismiss={() => removeImage(image.id)} />)}
  </> : undefined;
  // The + menu (P11): how Claude helps first, each with its plain line, then what can be added.
  const plus = (
    <Menu aria-label="Add and how Claude helps" side="top" align="start" tooltip="Add"
      trigger={<Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Add" icon={<AddIcon />} />}>
      <MenuLabel>How Claude helps</MenuLabel>
      {HELP.map(entry => (
        <MenuItem key={entry.value} radio checked={help === entry.value} onClick={() => setHelp(entry.value)}>
          {entry.label}<span className="studio-chat__aside">{entry.note}</span>
        </MenuItem>
      ))}
      <MenuSeparator />
      <MenuItem icon={<ImagePlusIcon />} onClick={() => picker.current?.click()}>Add a picture</MenuItem>
      <MenuItem icon={<ComponentIcon />} onClick={() => { setDraft(current => `${current}${current && !/\s$/.test(current) ? " " : ""}@`); composer.current?.focus(); }}>Mention a design thing</MenuItem>
    </Menu>
  );
  return (
    <div ref={root} className="studio-chat__composer" data-expanded={expanded ? "" : undefined} style={room ? { blockSize: `${room}px` } : undefined}>
      {expanded ? null : <ScrollToLatest scrollRef={scroller} focusRef={composer} />}
      {/* Messages written while it works wait above the composer, in order (Cursor's queue tray, Codex's rail). */}
      {session.queue.length ? (
        <Queue items={session.queue} title={session.queuePaused ? `${session.queue.length} queued, paused` : undefined}
          onSendNow={session.sendNow} onDismiss={session.unqueue} />
      ) : null}
      {/* The run's plan rides above the composer while it runs (Cursor's tray). */}
      {running && session.plan ? <Plan items={session.plan} /> : null}
      <input ref={picker} type="file" accept="image/*" multiple hidden tabIndex={-1} aria-hidden="true"
        onChange={event => { attach(event.target.files); event.target.value = ""; composer.current?.focus(); }} />
      {session.question ? (
        // The agent's question in the composer's place (P3), one at a time; Skip or Esc goes on without an answer.
        <QuestionCard request={session.question} onAnswer={session.answerQuestion} />
      ) : session.approval ? (
        // The ask takes the composer's place until it is answered (Claude Code, Codex), in plain words (P2): what it would
        // change, the code folded under Show code. "For this session" allows the tool for the rest of the chat.
        <ApprovalAsk />
      ) : (
        <Composer ref={composer} layout="stacked" value={draft} onValueChange={next => { setDraft(next); }}
          placeholder={session.running ? "Queue another message…" : helpNow.placeholder}
          loading={session.running} onStop={session.stop}
          context={chips}
          expandable expanded={expanded} onExpandedChange={setExpanded}
          menu={open && items.length ? <ComposerMenu id={menuId} aria-label={trigger?.char === "@" ? "Mention" : "Commands"} items={groups}
            activeId={activeItem?.id} onActiveChange={id => setActive(items.findIndex(item => item.id === id))} onPick={pick}
            emptyLabel={trigger?.char === "@" ? "Nothing found" : "No matching commands"} /> : undefined}
          inputProps={{
            role: "combobox", "aria-expanded": open, "aria-controls": open ? menuId : undefined, "aria-autocomplete": "list",
            "aria-activedescendant": activeItem ? `${menuId}-${activeItem.id}` : undefined,
            onPaste: event => {
              if (attach(event.clipboardData?.files)) { event.preventDefault(); return; }
              // A long paste folds into a chip (P10), its words sent with the message.
              const text = event.clipboardData?.getData("text/plain") ?? "";
              const lines = text.split("\n").length;
              if (lines > LONG_PASTE.lines || text.length > LONG_PASTE.characters) {
                event.preventDefault();
                setPastes(list => [...list, { id: `paste-${++attachedIds}`, name: "Pasted text", text, lines }]);
              }
            },
          }}
          onDragOver={event => { if ([...event.dataTransfer.items].some(item => item.type.startsWith("image/"))) event.preventDefault(); }}
          onDrop={event => { if (attach(event.dataTransfer.files)) event.preventDefault(); }}
          onInputKeyDown={event => {
            if (open && items.length && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
              event.preventDefault();
              setActive(current => (current + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length);
            } else if (open && activeItem && (event.key === "Enter" || event.key === "Tab") && !event.shiftKey) {
              event.preventDefault();
              pick(activeItem);
            } else if (open && event.key === "Escape") {
              event.preventDefault();
              setClosedAt(draft);
            } else if (event.key === "Escape" && session.running) { event.preventDefault(); session.stop(); }
          }}
          onQueue={value => { void submit(value, true); }}
          onSubmit={value => { void submit(value); }}
          leadingActions={plus}
          mode={<ModelPicker size="sm" label="Model" items={CHAT_MODELS} value={model} onValueChange={next => setModel(next)} />} />
      )}
    </div>
  );
}

/** An ask before an edit or a command, in plain words (P2): what it would change, the code a click away. */
function ApprovalAsk() {
  const { session } = useChat();
  const asked = session.approval!;
  const path = typeof asked.input.file_path === "string" ? asked.input.file_path : undefined;
  const editing = asked.tool_name === "Edit" || asked.tool_name === "Write" || asked.tool_name === "MultiEdit";
  const command = typeof asked.input.command === "string" ? asked.input.command : undefined;
  const title = editing && path ? `Change ${plainName(path)}?` : asked.tool_name === "Bash" ? "Run a check?" : asked.title;
  const description = editing && path ? `${path.split("/").at(-1)}${asked.description && !asked.description.endsWith(path.split("/").at(-1) ?? "") ? `. ${asked.description}` : ""}`
    : asked.tool_name === "Bash" ? (typeof asked.input.description === "string" ? asked.input.description : "A command in this repository") : asked.description;
  const code = editing ? <Diff aria-label={`Changes to ${path?.split("/").at(-1) ?? "the file"}`}
    hunks={editOf({ kind: "tool", id: asked.tool_use_id, name: asked.tool_name, input: asked.input, status: "running" }).hunks} />
    : command ? <CodeBlock size="sm" lineNumbers={false} code={command} wrap /> : null;
  return (
    <Approval autoFocus title={title} description={description}
      items={[{ value: "yes", label: "Yes" }, { value: "session", label: "Yes, for this session" }, { value: "no", label: "No" }]}
      onChoose={value => session.answer(value !== "no", { always: value === "session" })}
      // What to do instead goes to the agent with the no; a recorded run plays its no.
      onInstead={text => session.answer(false, { instead: text })} insteadPlaceholder="Tell Claude what to do instead">
      {code ? <Accordion variant="plain" size="sm" className="studio-chat__show-code"><AccordionItem value="code" heading="Show code">{code}</AccordionItem></Accordion> : null}
    </Approval>
  );
}

/** Starts a new conversation, from the conversation's head. */
export function NewChatButton() {
  const { session, composer } = useChat();
  return (
    <Tooltip side="bottom" describes={false} trigger={
      <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<ChatAddIcon />} aria-label="New chat"
        disabled={!session.turns.length} onClick={() => { session.clear(); composer.current?.focus(); }} />
    }>New chat</Tooltip>
  );
}

// ---- The Testing screen ----------------------------------------------------------------------------------------

/** One chat in a fixed-width frame, its own scroller and session, playing a recording to its end. */
function ChatFrame({ width, recording }: { width: number; recording: (typeof RECORDINGS)[number] }) {
  const session = useChatSession(recording);
  const scroller = useRef<HTMLDivElement | null>(null);
  return (
    <ChatScope session={session} selection="Button › Default">
      <figure className="studio-chat-frame" style={{ inlineSize: `${width}px` }}>
        <figcaption className="studio-chat-frame__label">{width} wide</figcaption>
        <div className="studio-chat-frame__panel">
          <div ref={scroller} className="studio-chat-frame__body"><ChatTranscript scroller={scroller} /></div>
          <div className="studio-chat-frame__foot"><ChatComposer scroller={scroller} /></div>
        </div>
      </figure>
    </ChatScope>
  );
}

/** The Chat view at the Inspector's narrowest, a middle width and its widest, each a finished recorded run. */
export function ChatScreen() {
  const find = (id: string) => RECORDINGS.find(recording => recording.id === id) ?? RECORDINGS[0]!;
  return (
    <div className="studio-chat-frames">
      <ChatFrame width={256} recording={RECORDINGS[0]!} />
      <ChatFrame width={360} recording={find("card-options")} />
      <ChatFrame width={500} recording={find("calmer-cards")} />
    </div>
  );
}
