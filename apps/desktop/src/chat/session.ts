/**
 * The Chat view's session: the conversation as turns, built from the Agent SDK's messages (src/chat/recording.ts). In
 * Phase 1 and 2 a recorded run played them; in Phase 3 (2026-11-06) the engine in Electron's main process
 * (electron/agent.cjs) sends the same messages over IPC and this reducer reads them unchanged. The Inspector's chat is
 * live wherever the engine answers (the Electron app); in a browser, a capture and the Testing screen's frames it plays
 * the recordings (docs/research/inspector-chat-2026-10-18).
 *
 * Phase 2 adds what the new components draw: the plan (the latest TodoWrite), a pending approval (the run pauses on it
 * until the person answers), and each edit's Keep or Undo.
 */
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { recordingFor, ASK, type ChatEvent, type PermissionRequest, type QuestionRequest, type RecordedEvent, type Recording, type ToolInput } from "./recording.ts";

export type Part =
  | { kind: "text"; text: string; streaming: boolean }
  | { kind: "thinking"; summary: string; startedAt: number; seconds?: number }
  | { kind: "tool"; id: string; name: string; input: ToolInput; status: "running" | "done" | "error"; output?: string };
/** What rides with a person's message, as their bubble shows it (the agent reads the message's `prompt`). */
export type Attached =
  /** The Design view's changes (P9): one card, its title and its lines. */
  | { kind: "changes"; title: string; items: ReadonlyArray<{ thing: string; change: string }> }
  | { kind: "image"; name: string; src: string }
  /** A long paste folded into a chip (P10). */
  | { kind: "paste"; name: string; lines: number }
  /** A design thing from the @ menu (P6): a page, a layer, a component, a token, the theme. */
  | { kind: "thing"; label: string; group: string };
/** How the agent helps (P11): Ask and Suggest change no file. */
export type HelpMode = "ask" | "suggest" | "change";
/** A picture for the agent: its type and its bytes as base64. */
export interface OutgoingImage { name: string; type: string; data: string }
/** What a send carries besides its words. */
export interface SendExtra {
  /** What the agent reads, where it differs from the words the bubble shows (the Design view's changes). */
  prompt?: string;
  attachments?: readonly Attached[];
  images?: readonly OutgoingImage[];
  mode?: HelpMode;
}

export type Turn =
  | { id: string; author: "user"; text: string; context?: string; at: number; prompt?: string; attachments?: readonly Attached[]; mode?: HelpMode;
      /** Restore to here was chosen: every change from this message on was undone. */
      restored?: boolean }
  | { id: string; author: "assistant"; parts: Part[]; done: boolean; stopped?: boolean; seconds?: number; /** Why the run failed (the engine). */ error?: string };

export interface PlanStep { id: string; label: string; status: "complete" | "current" | "pending" | "cancelled" }
export type EditState = "pending" | "kept" | "undone";

export interface QueuedMessage { id: string; text: string; context?: string; extra?: SendExtra; status?: "queued" | "sending" | "failed" }

export interface ChatState {
  turns: Turn[];
  /** Messages written while a run works, sent in order when it finishes (Cursor's queue, Claude Code's "Queue another"). */
  queue: QueuedMessage[];
  /** Stopping a run pauses the queue until the next send (Codex: "Queue paused because you interrupted"). */
  queuePaused?: boolean;
  running: boolean;
  /** The run's plan, from its latest TodoWrite. */
  plan?: PlanStep[];
  /** The tool call waiting on the person (the composer becomes an Approval). */
  approval?: PermissionRequest;
  /** The agent's question waiting on the person (the composer becomes the question card). */
  question?: QuestionRequest;
  /** Each question's answers by its tool call id (question text to answer), or "skipped". */
  answers: Record<string, Readonly<Record<string, string>> | "skipped">;
  /** Keep or Undo per edit (tool call id). */
  edits: Record<string, EditState>;
  /** Why an Undo didn't go through, per edit (the file changed since). */
  undoFailed: Record<string, string>;
}

type Action =
  | { type: "send"; text: string; context?: string; extra?: SendExtra; at: number }
  | { type: "answeredQuestion"; id: string; answers: Readonly<Record<string, string>> | "skipped" }
  | { type: "restored"; turn: string }
  | { type: "message"; message: ChatEvent; at: number }
  | { type: "answered" }
  | { type: "stop"; at: number }
  | { type: "edit"; ids: string[]; state: EditState }
  | { type: "undoFailed"; reasons: Record<string, string> }
  | { type: "enqueue"; text: string; context?: string; extra?: SendExtra }
  | { type: "dequeue"; id: string }
  | { type: "clear" };

let ids = 0;
const nextId = () => `turn-${++ids}`;
const EMPTY: ChatState = { turns: [], queue: [], running: false, edits: {}, undoFailed: {}, answers: {} };

/** The assistant turn being written, with `fn` applied to a copy of its parts. */
function withCurrent(state: ChatState, fn: (parts: Part[], turn: Extract<Turn, { author: "assistant" }>) => Partial<Extract<Turn, { author: "assistant" }>> | void): ChatState {
  const last = state.turns.at(-1);
  if (!last || last.author !== "assistant" || last.done) return state;
  const parts = [...last.parts];
  const patch = fn(parts, last) ?? {};
  return { ...state, turns: [...state.turns.slice(0, -1), { ...last, parts, ...patch }] };
}

const TODO: Record<string, PlanStep["status"]> = { completed: "complete", in_progress: "current", pending: "pending", cancelled: "cancelled" };
function planOf(input: ToolInput): PlanStep[] | undefined {
  const todos = input.todos;
  if (!Array.isArray(todos)) return undefined;
  return todos.map((todo: { content?: unknown; status?: unknown }, index) => ({
    id: String(index), label: String(todo.content ?? ""), status: TODO[String(todo.status)] ?? "pending",
  }));
}

export function reduce(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "clear": return EMPTY;
    case "edit": return { ...state, edits: { ...state.edits, ...Object.fromEntries(action.ids.map(id => [id, action.state])) },
      undoFailed: Object.fromEntries(Object.entries(state.undoFailed).filter(([id]) => !action.ids.includes(id))) };
    case "undoFailed": return { ...state, undoFailed: { ...state.undoFailed, ...action.reasons } };
    case "enqueue": return { ...state, queue: [...state.queue, { id: `queued-${++ids}`, text: action.text, context: action.context, extra: action.extra }] };
    case "answeredQuestion": return { ...state, question: undefined, answers: { ...state.answers, [action.id]: action.answers } };
    case "restored": return { ...state, turns: state.turns.map(turn => turn.id === action.turn && turn.author === "user" ? { ...turn, restored: true } : turn) };
    case "dequeue": return { ...state, queue: state.queue.filter(item => item.id !== action.id) };
    case "answered": return { ...state, approval: undefined };
    case "send": return {
      ...state,
      running: true,
      queuePaused: false,
      plan: undefined,
      approval: undefined,
      question: undefined,
      turns: [...state.turns,
        { id: nextId(), author: "user", text: action.text, context: action.context, at: action.at,
          ...(action.extra?.prompt ? { prompt: action.extra.prompt } : {}), ...(action.extra?.attachments?.length ? { attachments: action.extra.attachments } : {}),
          ...(action.extra?.mode ? { mode: action.extra.mode } : {}) },
        { id: nextId(), author: "assistant", parts: [], done: false }],
    };
    case "stop": return {
      ...withCurrent(state, (parts, turn) => {
        parts.forEach((part, index) => {
          if (part.kind === "text" && part.streaming) parts[index] = { ...part, streaming: false };
          if (part.kind === "tool" && part.status === "running") parts[index] = { ...part, status: "error", output: "Stopped" };
          if (part.kind === "thinking" && part.seconds === undefined) parts[index] = { ...part, seconds: Math.max(1, Math.round((action.at - part.startedAt) / 1000)) };
        });
        return { done: true, stopped: true, seconds: elapsed(turn, action.at) };
      }),
      running: false,
      approval: undefined,
      question: undefined,
      queuePaused: state.queue.length > 0,
    };
    case "message": {
      const { message, at } = action;
      // A question after a stop (it crossed the stop on its way) is dropped: the engine has denied it.
      if (message.type === "permission_request") return state.running ? { ...state, approval: message } : state;
      if (message.type === "question") return state.running ? { ...state, question: message } : state;
      if (message.type === "result") {
        return { ...withCurrent(state, parts => {
          parts.forEach((part, index) => { if (part.kind === "text" && part.streaming) parts[index] = { ...part, streaming: false }; });
          return { done: true, seconds: Math.round(message.duration_ms / 1000), ...(message.error ? { error: message.error } : {}) };
        }), running: false, approval: undefined, question: undefined };
      }
      if (message.type === "stream_event") {
        const delta = message.event.delta;
        return withCurrent(state, parts => {
          const last = parts.at(-1);
          if (delta.type === "thinking_delta") {
            if (last?.kind !== "thinking" || last.seconds !== undefined) parts.push({ kind: "thinking", summary: "", startedAt: at });
          } else if (last?.kind === "text" && last.streaming) {
            parts[parts.length - 1] = { ...last, text: last.text + delta.text };
          } else {
            parts.push({ kind: "text", text: delta.text, streaming: true });
          }
        });
      }
      if (message.type === "assistant") {
        let plan = state.plan;
        let edits = state.edits;
        const next = withCurrent(state, parts => {
          for (const block of message.message.content) {
            const last = parts.at(-1);
            if (block.type === "thinking") {
              if (last?.kind === "thinking" && last.seconds === undefined) parts[parts.length - 1] = { ...last, summary: block.thinking, seconds: Math.max(1, Math.round((at - last.startedAt) / 1000)) };
              else parts.push({ kind: "thinking", summary: block.thinking, startedAt: at, seconds: 1 });
            } else if (block.type === "text") {
              if (last?.kind === "text" && last.streaming) parts[parts.length - 1] = { kind: "text", text: block.text, streaming: false };
              else parts.push({ kind: "text", text: block.text, streaming: false });
            } else {
              parts.push({ kind: "tool", id: block.id, name: block.name, input: block.input, status: "running" });
              if (block.name === "TodoWrite") plan = planOf(block.input) ?? plan;
              if (block.name === "Edit" || block.name === "Write") edits = { ...edits, [block.id]: "pending" };
            }
          }
        });
        return { ...next, plan, edits };
      }
      if (message.type === "user") {
        return withCurrent(state, parts => {
          for (const result of message.message.content) {
            const index = parts.findIndex(part => part.kind === "tool" && part.id === result.tool_use_id);
            const part = parts[index];
            if (part?.kind === "tool") parts[index] = { ...part, status: result.is_error ? "error" : "done", output: result.content };
          }
        });
      }
      return state;
    }
  }
}

function elapsed(turn: Extract<Turn, { author: "assistant" }>, at: number) {
  const first = turn.parts.find((part): part is Extract<Part, { kind: "thinking" }> => part.kind === "thinking");
  return first ? Math.max(1, Math.round((at - first.startedAt) / 1000)) : undefined;
}

export interface ChatSession extends ChatState {
  /** Live: the agent answers (electron/agent.cjs); recorded: a recorded run plays (`recordingFor`). */
  mode: "live" | "recorded";
  /** Send a prompt to the agent, or play the recorded run that answers it. `extra`: what rides with it. */
  send: (text: string, context?: string, extra?: SendExtra) => void;
  /** Answer the pending question (question text to answer), or skip it with null. A recorded run plays on either way. */
  answerQuestion: (answers: Readonly<Record<string, string>> | null) => void;
  /** Restore to before a person's message: every edit from its reply on is undone (P8). */
  restore: (turnId: string) => Promise<void>;
  /** Ask a reply's prompt again, its edits undone first: the same way, or another way (P8, P13). */
  retry: (turnId: string, another?: boolean) => Promise<void>;
  stop: () => void;
  clear: () => void;
  /** Answer the pending approval: yes runs the tool (`always`: and this tool for the rest of the chat); no, with what
   *  to do instead if given. A recorded run plays what follows its yes or its no. */
  answer: (allow: boolean, extra?: { always?: boolean; instead?: string }) => void;
  /** Keep or undo edits (tool call ids). Live, Undo puts the files back (or says why not); a recorded run changes none. */
  setEdits: (ids: string[], state: EditState) => void;
  /** Write a message while a run works: it waits in the queue and is sent when the run finishes. */
  enqueue: (text: string, context?: string, extra?: SendExtra) => void;
  /** Take a message out of the queue. */
  unqueue: (id: string) => void;
  /** Stop the run and send this queued message now (Cursor's Send Now). */
  sendNow: (id: string) => void;
  /** Play a recording to its end at once (a finished conversation, for the Testing screen); approvals answer yes. */
  load: (recording: Recording) => void;
}

const agentBridge = () => typeof window === "undefined" ? undefined : window.areaDesktop?.agent;
let chatCount = 0;
const newChatId = () => `chat-${Date.now().toString(36)}-${++chatCount}`;

export interface ChatSessionOptions {
  /** Talk to the agent when the engine answers (the Inspector's chat; the Testing frames stay recorded). */
  live?: boolean;
  /** The model each prompt goes to (the composer's Model picker). */
  model?: string;
}

/** One conversation and its player. `initial` loads a finished run (the Testing screen's frames). */
export function useChatSession(initial?: Recording, options: ChatSessionOptions = {}): ChatSession {
  const [state, dispatch] = useReducer(reduce, EMPTY);
  const [mode, setMode] = useState<ChatSession["mode"]>("recorded");
  // The engine's conversation: a new id on New chat (the agent's session starts again).
  const chatId = useRef(newChatId());
  const live = useRef(false);
  live.current = mode === "live";
  const model = useRef(options.model);
  model.current = options.model;
  const latest = useRef(state);
  latest.current = state;
  useEffect(() => {
    const agent = options.live ? agentBridge() : undefined;
    if (!agent) return;
    let alive = true;
    agent.status().then(status => { if (alive && status.available) setMode("live"); }, () => {});
    const off = agent.onEvent((chat, message) => { if (chat === chatId.current) dispatch({ type: "message", message: message as ChatEvent, at: Date.now() }); });
    return () => { alive = false; off(); agent.close(chatId.current); };
  }, [options.live]);
  const timer = useRef(0);
  // What is left to play after a paused approval, and what to play on a no.
  const paused = useRef<{ rest: readonly RecordedEvent[]; denied: readonly RecordedEvent[] } | null>(null);
  const halt = () => { window.clearTimeout(timer.current); timer.current = 0; paused.current = null; };
  const play = useCallback((events: readonly RecordedEvent[], instant = false) => {
    if (instant) {
      // A finished run: times are made up so the reasoning reads as it would have; every approval is a yes.
      let at = Date.now();
      for (const event of events) {
        at += event.wait;
        dispatch({ type: "message", message: event.message, at });
        if (event.message.type === "permission_request") dispatch({ type: "answered" });
        if (event.message.type === "question") dispatch({ type: "answeredQuestion", id: event.message.tool_use_id, answers: { [event.message.questions[0]?.question ?? ""]: event.message.questions[0]?.options[0]?.label ?? "" } });
      }
      return;
    }
    let index = 0;
    const step = () => {
      const event = events[index++];
      if (!event) { timer.current = 0; return; }
      timer.current = window.setTimeout(() => {
        dispatch({ type: "message", message: event.message, at: Date.now() });
        if (event.message.type === "permission_request" || event.message.type === "question") { paused.current = { rest: events.slice(index), denied: event.denied ?? [] }; timer.current = 0; return; }
        step();
      }, event.wait);
    };
    step();
  }, []);
  useEffect(() => halt, []);
  const send = useCallback((text: string, context?: string, extra?: SendExtra) => {
    halt();
    dispatch({ type: "send", text, context, extra, at: Date.now() });
    const agent = agentBridge();
    if (live.current && agent) agent.send(chatId.current, { text: extra?.prompt ?? text, context, model: model.current, mode: extra?.mode, images: extra?.images ? [...extra.images] : undefined });
    else play(recordingFor(text).events);
  }, [play]);
  const stop = useCallback(() => {
    halt();
    if (live.current) agentBridge()?.stop(chatId.current);
    dispatch({ type: "stop", at: Date.now() });
  }, []);
  const clear = useCallback(() => {
    halt();
    if (live.current) { agentBridge()?.close(chatId.current); chatId.current = newChatId(); }
    dispatch({ type: "clear" });
  }, []);
  const answer = useCallback((allow: boolean, extra: { always?: boolean; instead?: string } = {}) => {
    const asked = latest.current.approval;
    dispatch({ type: "answered" });
    if (live.current) {
      if (asked) agentBridge()?.answer(chatId.current, asked.tool_use_id, { allow, ...extra });
      return;
    }
    const waiting = paused.current;
    paused.current = null;
    if (waiting) play(allow ? waiting.rest : waiting.denied);
  }, [play]);
  const undoEdits = useCallback(async (ids: string[]) => {
    const agent = agentBridge();
    if (!ids.length) return;
    if (!live.current || !agent) { dispatch({ type: "edit", ids, state: "undone" }); return; }
    try {
      const results = await agent.undo(chatId.current, ids);
      const done = ids.filter(id => results[id] === "ok");
      if (done.length) dispatch({ type: "edit", ids: done, state: "undone" });
      const failed = Object.fromEntries(ids.filter(id => results[id] !== "ok").map(id => [id, results[id] ?? "Couldn't undo this edit."]));
      if (Object.keys(failed).length) dispatch({ type: "undoFailed", reasons: failed });
    } catch (error) { dispatch({ type: "undoFailed", reasons: Object.fromEntries(ids.map(id => [id, String(error)])) }); }
  }, []);
  const setEdits = useCallback((ids: string[], next: EditState) => {
    if (next !== "undone") { dispatch({ type: "edit", ids, state: next }); return; }
    void undoEdits(ids);
  }, [undoEdits]);
  const answerQuestion = useCallback((answers: Readonly<Record<string, string>> | null) => {
    const asked = latest.current.question;
    if (!asked) return;
    dispatch({ type: "answeredQuestion", id: asked.tool_use_id, answers: answers ?? "skipped" });
    if (live.current) { agentBridge()?.answer(chatId.current, asked.tool_use_id, answers ? { answers: { ...answers } } : {}); return; }
    const waiting = paused.current;
    paused.current = null;
    if (waiting) play(waiting.rest);
  }, [play]);
  // The edits a turn and every turn after it made, oldest first, that are not undone yet.
  const editsFrom = (turnId: string) => {
    const { turns, edits } = latest.current;
    const at = turns.findIndex(turn => turn.id === turnId);
    if (at < 0) return [];
    return turns.slice(at).flatMap(turn => turn.author === "assistant"
      ? turn.parts.filter(part => part.kind === "tool" && (part.name === "Edit" || part.name === "Write") && part.status === "done").map(part => (part as { id: string }).id)
      : []).filter(id => edits[id] !== "undone");
  };
  const restore = useCallback(async (turnId: string) => {
    if (latest.current.running) return;
    await undoEdits(editsFrom(turnId));
    dispatch({ type: "restored", turn: turnId });
  }, [undoEdits]);
  const enqueue = useCallback((text: string, context?: string, extra?: SendExtra) => dispatch({ type: "enqueue", text, context, extra }), []);
  const unqueue = useCallback((id: string) => dispatch({ type: "dequeue", id }), []);
  // Send now: the run stops (its turn says so) and the message goes at once.
  const queueRef = useRef(state.queue);
  queueRef.current = state.queue;
  const sendNow = useCallback((id: string) => {
    const item = queueRef.current.find(entry => entry.id === id);
    if (!item) return;
    halt();
    dispatch({ type: "stop", at: Date.now() });
    dispatch({ type: "dequeue", id });
    send(item.text, item.context, item.extra);
  }, [send]);
  const retry = useCallback(async (turnId: string, another = false) => {
    const { turns, running } = latest.current;
    if (running) return;
    const at = turns.findIndex(turn => turn.id === turnId);
    const asked = turns.slice(0, at).reverse().find(turn => turn.author === "user");
    if (!asked || asked.author !== "user") return;
    await undoEdits(editsFrom(turnId));
    const prompt = asked.prompt ?? asked.text;
    send(asked.text, asked.context, {
      ...(asked.attachments ? { attachments: asked.attachments } : {}), ...(asked.mode ? { mode: asked.mode } : {}),
      ...(another ? { prompt: `Try another way, different from your last answer: ${prompt}` } : asked.prompt ? { prompt } : {}),
    });
  }, [undoEdits, send]);
  // When a run finishes, the next queued message goes (not while an approval waits, which keeps the run open).
  useEffect(() => {
    if (state.running || state.approval || state.queuePaused || !state.queue.length) return;
    const [next] = state.queue;
    dispatch({ type: "dequeue", id: next!.id });
    send(next!.text, next!.context, next!.extra);
  }, [state.running, state.approval, state.queuePaused, state.queue, send]);
  const load = useCallback((recording: Recording) => {
    halt();
    dispatch({ type: "clear" });
    dispatch({ type: "send", text: recording.prompt, at: Date.now() });
    play(recording.events, true);
  }, [play]);
  const loaded = useRef(false);
  useEffect(() => { if (initial && !loaded.current) { loaded.current = true; load(initial); } }, [initial, load]);
  return useMemo(() => ({ ...state, mode, send, stop, clear, answer, answerQuestion, restore, retry, setEdits, enqueue, unqueue, sendNow, load }),
    [state, mode, send, stop, clear, answer, answerQuestion, restore, retry, setEdits, enqueue, unqueue, sendNow, load]);
}
