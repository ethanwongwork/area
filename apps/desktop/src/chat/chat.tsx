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
 * In the Inspector the transcript is the Panel's body and the composer its footer, with no rule above it; the session
 * lives at the app's level (ChatProvider), so a conversation survives switching tabs and views.
 */
import { createContext, Fragment, useContext, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Approval, Attachment, Button, Chip, CodeBlock, Composer, ComposerMenu, CopyButton, Diff, EditSummary, EditSummaryFile, EmptyState, Message, MessageActions, ModelPicker, Plan, PromptSuggestions, Queue, Reasoning, ScrollToLatest, Step, StepGroup, Timestamp, Tooltip, TurnNotice, formatTimestamp, TIMESTAMP_GAP, type ComposerMenuGroup, type ComposerMenuItem, type DiffHunk } from "@area/react";
import { ChatAddIcon, ChatIcon, CommandIcon, DocumentIcon } from "@area/icons";
import { Markdown } from "./markdown.tsx";
import { RECORDINGS } from "./recording.ts";
import { useChatSession, type ChatSession, type Part, type Turn } from "./session.ts";
import { readStored, writeStored } from "../storage.ts";

/** The models offered (Claude Opus 5.5 by default; the engine passes the value to the Agent SDK, electron/agent.cjs). */
export const CHAT_MODELS = [
  { value: "claude-opus-5-5", label: "Claude Opus 5.5", description: "Most capable for long, agentic work" },
  { value: "claude-sonnet-5-5", label: "Claude Sonnet 5.5", description: "Fast, for everyday edits" },
  { value: "claude-haiku-5-5", label: "Claude Haiku 5.5", description: "Fastest, for quick questions" },
];

const MODEL_KEY = "chat-model";
const MODEL_EVENT = "area-chat-model";
const savedModel = () => { const saved = readStored<string>(MODEL_KEY, CHAT_MODELS[0]!.value); return CHAT_MODELS.some(entry => entry.value === saved) ? saved : CHAT_MODELS[0]!.value; };
/** The model chats start with (Settings › Chat), kept between launches; every reader follows a change. */
export function useDefaultModel(): [string, (model: string) => void] {
  const [model, setModel] = useState(savedModel);
  useEffect(() => {
    const follow = () => setModel(savedModel());
    addEventListener(MODEL_EVENT, follow);
    return () => removeEventListener(MODEL_EVENT, follow);
  }, []);
  return [model, (next: string) => { writeStored(MODEL_KEY, next); dispatchEvent(new Event(MODEL_EVENT)); }];
}

interface ChatContextValue {
  session: ChatSession;
  model: string;
  setModel: (model: string) => void;
  /** What the Canvas has chosen, as the context chip names it ("Button · Default"), or nothing. */
  selection?: string;
  composer: RefObject<HTMLTextAreaElement | null>;
}
const ChatContext = createContext<ChatContextValue | null>(null);
export const useChat = () => {
  const value = useContext(ChatContext);
  if (!value) throw new Error("useChat outside <ChatProvider>");
  return value;
};

/** The app's one conversation, above every tab (src/studio.tsx). */
/** When the turn before `index` ended: a person's message at its time; a reply at its prompt's time plus how long it
 * ran (replies carry no clock of their own). Undefined for the first turn. */
function lastActivity(turns: Turn[], index: number): number | undefined {
  const previous = turns[index - 1];
  if (!previous) return undefined;
  if (previous.author === "user") return previous.at;
  const prompt = turns.slice(0, index - 1).reverse().find(entry => entry.author === "user");
  return prompt && prompt.author === "user" ? prompt.at + (previous.seconds ?? 0) * 1000 : undefined;
}

export function ChatProvider({ selection, children }: { selection?: string; children: ReactNode }) {
  // The composer's menu changes this chat's model; Settings › Chat sets the one chats start with, and this chat follows it.
  const [preferred] = useDefaultModel();
  const [model, setModel] = useState(preferred);
  useEffect(() => setModel(preferred), [preferred]);
  // The app's chat is live wherever the engine answers (the Electron app); elsewhere it plays the recordings.
  const session = useChatSession(undefined, { live: true, model });
  const composer = useRef<HTMLTextAreaElement | null>(null);
  return <ChatContext.Provider value={{ session, model, setModel, selection, composer }}>{children}</ChatContext.Provider>;
}

/** A conversation of its own, for a screen that shows chats side by side (the Testing frames). */
export function ChatScope({ session, selection, children }: { session: ChatSession; selection?: string; children: ReactNode }) {
  const [model, setModel] = useState(CHAT_MODELS[0]!.value);
  const composer = useRef<HTMLTextAreaElement | null>(null);
  return <ChatContext.Provider value={{ session, model, setModel, selection, composer }}>{children}</ChatContext.Provider>;
}

/** A Canvas item's path as words: "button/size-small" → "Button · Size small". */
export const selectionLabel = (item?: string) => item
  ? item.split("/").filter(Boolean).map(part => { const words = decodeURIComponent(part).replace(/[-_]+/g, " "); return words[0]!.toUpperCase() + words.slice(1); }).join(" › ")
  : undefined;

// ---- The transcript --------------------------------------------------------------------------------------------

/** How a tool's call reads while it runs and once it is done (Cursor's and Codex's verb pairs). */
const VERBS: Record<string, readonly [string, string]> = {
  Read: ["Reading", "Read"], Grep: ["Searching", "Searched"], Glob: ["Finding files", "Found files"],
  Edit: ["Editing", "Edited"], MultiEdit: ["Editing", "Edited"], Write: ["Writing", "Wrote"], NotebookEdit: ["Editing", "Edited"], Bash: ["Running", "Ran"],
  Agent: ["Delegating", "Delegated"], Task: ["Delegating", "Delegated"], Skill: ["Loading a skill", "Loaded a skill"], ToolSearch: ["Finding tools", "Found tools"],
  WebFetch: ["Fetching", "Fetched"], WebSearch: ["Searching the web", "Searched the web"], TodoWrite: ["Updating the plan", "Updated the plan"],
};
/** Reads and searches fold into one "Explored" group (Cursor, Codex). */
const EXPLORE = new Set(["Read", "Grep", "Glob"]);
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
  const name = typeof part.input.file_path === "string" ? part.input.file_path.split("/").at(-1)! : "file";
  const hunks: DiffHunk[] = [{ lines: [
    ...before.map(text => ({ kind: "deleted" as const, text })),
    ...after.map(text => ({ kind: "added" as const, text })),
  ] }];
  return { name, added: after.length, removed: before.length, hunks };
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

/**
 * An assistant turn's parts: reasoning as Reasoning, each tool call as a Step, runs of two or more reads and searches
 * folded into "Explored N files"; text keeps Message's 16 between blocks, steps sit 4 apart.
 */
function AssistantParts({ parts }: { parts: Part[] }) {
  const out: ReactNode[] = [];
  let steps: ReactNode[] = [];
  let explore: ToolPart[] = [];
  const flushExplore = () => {
    if (explore.length >= 2) {
      const running = explore.some(part => part.status === "running");
      steps.push(<StepGroup key={`group-${explore[0]!.id}`} verb={running ? "Exploring" : "Explored"} detail={`${explore.length} items`} status={running ? "running" : "done"}>
        {explore.map(part => <ToolStep key={part.id} part={part} />)}
      </StepGroup>);
    } else for (const part of explore) steps.push(<ToolStep key={part.id} part={part} />);
    explore = [];
  };
  const flush = () => {
    flushExplore();
    if (steps.length) out.push(<div key={`steps-${out.length}`} className="studio-chat__steps">{steps}</div>);
    steps = [];
  };
  parts.forEach((part, index) => {
    if (part.kind === "text") { flush(); out.push(<Markdown key={`text-${index}`} text={part.text} />); }
    else if (part.kind === "thinking") { flushExplore(); steps.push(<Reasoning key={`thinking-${index}`} running={part.seconds === undefined} seconds={part.seconds}>{part.summary}</Reasoning>); }
    else if (EXPLORE.has(part.name)) explore.push(part);
    else { flushExplore(); steps.push(<ToolStep key={part.id} part={part} />); }
  });
  flush();
  return <>{out}</>;
}

const plainText = (turn: Extract<Turn, { author: "assistant" }>) =>
  turn.parts.filter((part): part is Extract<Part, { kind: "text" }> => part.kind === "text").map(part => part.text).join("\n\n");

/** The turn's edits, once it is done: Edit summary with Keep and Undo. Live, Undo puts the file back (electron/agent.cjs)
 *  and says why when it can't; a recorded run changes no file either way. */
function TurnEdits({ turn }: { turn: Extract<Turn, { author: "assistant" }> }) {
  const { session } = useChat();
  const edits = turn.parts.filter(isEdit).filter(part => part.status === "done");
  if (!edits.length) return null;
  const files = edits.map(part => ({ id: part.id, ...editOf(part), state: session.edits[part.id] ?? "pending" }));
  const pending = files.filter(file => file.state === "pending").map(file => file.id);
  const failed = files.filter(file => session.undoFailed[file.id]);
  return (<>
    <EditSummary title={`Edited ${files.length} file${files.length === 1 ? "" : "s"}`}
      added={files.reduce((sum, file) => sum + file.added, 0)} deleted={files.reduce((sum, file) => sum + file.removed, 0)}
      onKeepAll={pending.length ? () => session.setEdits(pending, "kept") : undefined}
      onUndoAll={pending.length ? () => session.setEdits(pending, "undone") : undefined}>
      {files.map(file => (
        <EditSummaryFile key={file.id} name={file.name} added={file.added} deleted={file.removed} status={file.state}
          onKeep={() => session.setEdits([file.id], "kept")} onUndo={() => session.setEdits([file.id], "undone")}
          diff={<Diff aria-label={`Changes to ${file.name}`} hunks={file.hunks} />} />
      ))}
    </EditSummary>
    {failed.map(file => <TurnNotice key={file.id} status="error">{`Couldn't undo ${file.name}: ${session.undoFailed[file.id]}`}</TurnNotice>)}
  </>);
}

function TurnView({ turn }: { turn: Turn }) {
  if (turn.author === "user") return <Message author="user" className="studio-chat__turn studio-chat__turn--user">{turn.text}</Message>;
  const text = plainText(turn);
  return (
    <Message author="assistant" authorName="Claude" streaming={!turn.done} className="studio-chat__turn studio-chat__turn--assistant"
      actions={turn.done && text ? (
        <MessageActions>
          <CopyButton value={text} label="Copy reply" variant="ghost" tone="neutral" size="sm" iconOnly />
        </MessageActions>
      ) : undefined}>
      <AssistantParts parts={turn.parts} />
      {turn.done ? <TurnEdits turn={turn} /> : null}
      {turn.stopped ? <TurnNotice status="stopped">You stopped this reply{turn.seconds ? ` after ${turn.seconds}s` : ""}.</TurnNotice> : null}
      {turn.error ? <TurnNotice status="error">{turn.error}</TurnNotice> : null}
    </Message>
  );
}

/**
 * The conversation, or, before the first prompt, what to ask. `scroller` is the element that scrolls (the Panel's body
 * in the Inspector): while its reader is at the end, each new line keeps them there.
 */
export function ChatTranscript({ scroller }: { scroller: RefObject<HTMLElement | null> }) {
  const { session, composer } = useChat();
  const pinned = useRef(true);
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
  if (!session.turns.length) {
    return (
      <div className="studio-chat__empty">
        <EmptyState size="sm" icon={<ChatIcon />} title="Ask about Area"
          description={session.mode === "live" ? "Claude works in this repository and asks before each edit or command."
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
      <div className="studio-chat__transcript" aria-live="polite" aria-busy={session.running || undefined}>
        {session.turns.map((turn, index) => {
          // A time before a person's message that comes over an hour after the conversation's last turn, either side's, or
          // before the first message if it is over an hour old (TIMESTAMP_GAP; never on a reply, never on every message).
          const before = lastActivity(session.turns, index);
          const stamp = turn.author === "user" && (before === undefined ? Date.now() - turn.at > TIMESTAMP_GAP : turn.at - before > TIMESTAMP_GAP);
          return <Fragment key={turn.id}>
            {stamp && turn.author === "user" ? <Timestamp className="studio-chat__stamp" dateTime={new Date(turn.at)}>{formatTimestamp(new Date(turn.at))}</Timestamp> : null}
            <TurnView turn={turn} />
          </Fragment>;
        })}
      </div>
    </>
  );
}

// ---- The composer ----------------------------------------------------------------------------------------------

/** Files the @ menu offers until the engine lists the workspace (Phase 3): real paths in this repo. */
const MENTION_FILES = [
  "packages/styles/src/components/button.css", "packages/styles/src/components/input.css", "packages/styles/src/components/card.css",
  "packages/styles/src/components/composer.css", "packages/styles/src/components/surface.css", "packages/styles/src/components/plan.css",
  "packages/tokens/src/emit/base.ts", "packages/tokens/src/axes/elevation.ts", "docs/specs/button.md", "docs/DESIGN_SYSTEM.md",
  "apps/desktop/src/studio.tsx",
];
/** The commands / offers: only ones that do something now. */
const COMMANDS = [{ id: "new", label: "New chat", description: "Start a new conversation" }];

interface Picked { id: string; name: string; path: string }
interface Attached { id: string; name: string; src: string }
let attachedIds = 0;

/** The @ or / being typed at the end of the draft, and what follows it. */
function triggerOf(draft: string): { char: "@" | "/"; query: string; start: number } | undefined {
  const match = /(^|\s)([@/])([^\s@/]*)$/.exec(draft);
  if (!match) return undefined;
  if (match[2] === "/" && match.index + match[1]!.length !== 0) return undefined; // a command only at the start
  return { char: match[2] as "@" | "/", query: match[3]!.toLowerCase(), start: match.index + match[1]!.length };
}

/** The composer and what rides with it: the Queue and the Plan over it, Scroll to latest above it; inside it the
 *  context row (the selection, @-mentioned files, pasted or dropped images) and the @ and / menu. */
export function ChatComposer({ scroller }: { scroller: RefObject<HTMLElement | null> }) {
  const { session, model, setModel, selection, composer } = useChat();
  const [draft, setDraft] = useState("");
  // The selection rides along until it is dismissed; choosing something else on the Canvas brings it back.
  const [dismissed, setDismissed] = useState<string | undefined>();
  const context = selection && selection !== dismissed ? selection : undefined;
  const [files, setFiles] = useState<Picked[]>([]);
  const [images, setImages] = useState<Attached[]>([]);
  const running = session.turns.at(-1)?.author === "assistant" && session.running;
  // The menu: open while an @ or / is being typed and not dismissed with Esc.
  const menuId = "chat-composer-menu";
  const trigger = triggerOf(draft);
  const [closedAt, setClosedAt] = useState<string | undefined>();
  const groups: ComposerMenuGroup[] = !trigger ? [] : trigger.char === "@"
    ? [{ label: "Files", items: MENTION_FILES.filter(path => path.toLowerCase().includes(trigger.query) && !files.some(file => file.path === path)).slice(0, 8)
        .map(path => ({ id: path.replace(/[^a-z0-9]+/gi, "-"), label: path.split("/").at(-1)!, path: path.split("/").slice(0, -1).join("/"), icon: <DocumentIcon /> })) }]
    : [{ label: "Commands", items: COMMANDS.filter(command => command.id.includes(trigger.query) || command.label.toLowerCase().includes(trigger.query))
        .map(command => ({ id: command.id, label: command.label, path: command.description, icon: <CommandIcon /> })) }];
  const items = groups.flatMap(group => group.items);
  const open = Boolean(trigger) && closedAt !== draft;
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [trigger?.char, trigger?.query]);
  const activeItem = open ? items[Math.min(active, items.length - 1)] : undefined;
  const pick = (item: ComposerMenuItem) => {
    if (!trigger) return;
    const rest = draft.slice(0, trigger.start);
    if (trigger.char === "/") { setDraft(""); if (item.id === "new") { session.clear(); setFiles([]); setImages([]); } composer.current?.focus(); return; }
    const path = MENTION_FILES.find(candidate => candidate.replace(/[^a-z0-9]+/gi, "-") === item.id)!;
    setFiles(list => [...list, { id: item.id, name: path.split("/").at(-1)!, path }]);
    setDraft(rest);
    composer.current?.focus();
  };
  const attach = (list: FileList | null | undefined) => {
    const pictures = [...(list ?? [])].filter(file => file.type.startsWith("image/"));
    if (!pictures.length) return false;
    setImages(current => [...current, ...pictures.map(file => ({ id: `image-${++attachedIds}`, name: file.name || "Pasted image", src: URL.createObjectURL(file) }))]);
    return true;
  };
  const remove = (id: string) => setImages(current => { const gone = current.find(image => image.id === id); if (gone) URL.revokeObjectURL(gone.src); return current.filter(image => image.id !== id); });
  // What the message is about, as the turn records it: the selection, the files, the images.
  const about = () => [context, ...files.map(file => file.name), ...images.map(image => image.name)].filter(Boolean).join(", ") || undefined;
  const sent = () => { setDraft(""); setFiles([]); setImages(current => { current.forEach(image => URL.revokeObjectURL(image.src)); return []; }); };
  const chips = context || files.length || images.length ? <>
    {context ? <Chip kind="input" size="sm" onDismiss={() => setDismissed(selection)}>{context}</Chip> : null}
    {files.map(file => <Chip key={file.id} kind="input" size="sm" icon={<DocumentIcon />} title={file.path}
      onDismiss={() => setFiles(list => list.filter(entry => entry.id !== file.id))}>{file.name}</Chip>)}
    {images.map(image => <Attachment key={image.id} src={image.src} name={image.name} onDismiss={() => remove(image.id)} />)}
  </> : undefined;
  return (
    <div className="studio-chat__composer">
      <ScrollToLatest scrollRef={scroller} focusRef={composer} />
      {/* Messages written while it works wait above the composer, in order (Cursor's queue tray, Codex's rail). */}
      {session.queue.length ? (
        <Queue items={session.queue} title={session.queuePaused ? `${session.queue.length} queued, paused` : undefined}
          onSendNow={session.sendNow} onDismiss={session.unqueue} />
      ) : null}
      {/* The run's plan rides above the composer while it runs (Cursor's tray). */}
      {running && session.plan ? <Plan items={session.plan} /> : null}
      {session.approval ? (
        // The question takes the composer's place until it is answered (Claude Code, Codex). "For this session" allows the
        // tool for the rest of the chat (the engine remembers it; a recorded run plays it as a yes).
        <Approval autoFocus title={session.approval.title} description={session.approval.description}
          items={[{ value: "yes", label: "Yes" }, { value: "session", label: "Yes, for this session" }, { value: "no", label: "No" }]}
          onChoose={value => session.answer(value !== "no", { always: value === "session" })}
          // What to do instead goes to the agent with the no; a recorded run plays its no.
          onInstead={text => session.answer(false, { instead: text })} insteadPlaceholder="Tell Claude what to do instead">
          {session.approval.tool_name === "Edit" || session.approval.tool_name === "Write" ? <Diff aria-label={`Changes to ${String(session.approval.input.file_path ?? "").split("/").at(-1)}`}
            hunks={editOf({ kind: "tool", id: session.approval.tool_use_id, name: session.approval.tool_name, input: session.approval.input, status: "running" }).hunks} />
            : typeof session.approval.input.command === "string" ? <CodeBlock size="sm" lineNumbers={false} code={session.approval.input.command} wrap /> : null}
        </Approval>
      ) : (
        <Composer ref={composer} layout="stacked" value={draft} onValueChange={next => { setDraft(next); }}
          placeholder={session.running ? "Queue another message…" : "Ask about Area, or a change to make"}
          loading={session.running} onStop={session.stop}
          context={chips}
          menu={open ? <ComposerMenu id={menuId} aria-label={trigger?.char === "@" ? "Files" : "Commands"} items={groups}
            activeId={activeItem?.id} onActiveChange={id => setActive(items.findIndex(item => item.id === id))} onPick={pick}
            emptyLabel={trigger?.char === "@" ? "No files found" : "No matching commands"} /> : undefined}
          inputProps={{
            role: "combobox", "aria-expanded": open, "aria-controls": open ? menuId : undefined, "aria-autocomplete": "list",
            "aria-activedescendant": activeItem ? `${menuId}-${activeItem.id}` : undefined,
            onPaste: event => { if (attach(event.clipboardData?.files)) event.preventDefault(); },
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
          onQueue={value => { session.enqueue(value.trim(), about()); sent(); }}
          onSubmit={value => { if (!value.trim()) return; session.send(value.trim(), about()); sent(); }}
          mode={<ModelPicker size="sm" label="Model" items={CHAT_MODELS} value={model} onValueChange={next => setModel(next)} />} />
      )}
    </div>
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
  return (
    <div className="studio-chat-frames">
      <ChatFrame width={256} recording={RECORDINGS[0]!} />
      <ChatFrame width={360} recording={RECORDINGS[1]!} />
      <ChatFrame width={500} recording={RECORDINGS[0]!} />
    </div>
  );
}
