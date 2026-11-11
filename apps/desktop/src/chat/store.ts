/**
 * Kept chats (owner, 2026-11-10; docs/research/desktop-app-analysis-2026-11-10, U4): a chat belongs to the place it was
 * started in, a project, a system, or the app for anywhere else, and is kept beside it, one file each
 * (electron/folder.cjs: `Projects/<id>/chats/<chat>.json`). Before, the last 20 sat in the browser's storage, shared
 * by every tab, as words only; a kept chat holds its turns, so it opens again as it was, and the agent's session, so
 * the agent remembers it while its folder is the same.
 *
 * Pure but for the bridge at the end: the chat test imports `keptChat` and `readKept`.
 */
import { useEffect, useState } from "react";
import type { ChatState, Part, Turn } from "./session.ts";

/** Where a chat belongs. The app's own (Home, References, Labs) has no id. */
export interface ChatPlace { kind: "project" | "system" | "app"; id: string }
export const APP_PLACE: ChatPlace = { kind: "app", id: "" };
export const placeKey = (place: ChatPlace) => `${place.kind}:${place.id}`;

export const KEPT_VERSION = 1;
/** What a kept chat's words hold for the @ menu (a past chat brought into a new one). */
const TEXT_LIMIT = 6000;

export interface KeptChat {
  version: number;
  id: string;
  /** Its first prompt, cut to a line. */
  title: string;
  /** When it started and when it last changed, in milliseconds. */
  created: number;
  at: number;
  /** The folder it worked in (a project's), and the agent's session there: reopened in the same folder, it goes on. */
  folder?: string;
  session?: string;
  turns: Turn[];
  edits: ChatState["edits"];
  answers: ChatState["answers"];
  /** What was said, in words, as the agent reads a past chat. */
  text: string;
}

const replyText = (turn: Extract<Turn, { author: "assistant" }>) =>
  turn.parts.filter((part): part is Extract<Part, { kind: "text" }> => part.kind === "text").map(part => part.text.replace(/\n?<!-- more -->\n?/, "\n")).join("\n").trim();
/** A conversation in words: who said what. */
export const chatText = (turns: readonly Turn[]) =>
  turns.map(turn => turn.author === "user" ? `Person: ${turn.text}` : `Claude: ${replyText(turn)}`).join("\n\n").slice(0, TEXT_LIMIT);

/** A turn as its file holds it: a picture keeps its name, never its bytes; nothing is left streaming or running. */
function settled(turn: Turn): Turn {
  if (turn.author === "user") {
    return turn.attachments ? { ...turn, attachments: turn.attachments.map(entry => entry.kind === "image" ? { ...entry, src: "" } : entry) } : turn;
  }
  return {
    ...turn, done: true,
    parts: turn.parts.map(part => part.kind === "text" ? { ...part, streaming: false }
      : part.kind === "tool" && part.status === "running" ? { ...part, status: "error" as const, output: "Stopped" }
      : part.kind === "thinking" && part.seconds === undefined ? { ...part, seconds: 1 } : part),
  };
}

/**
 * A conversation as it is kept, or null while there is nothing to keep (no prompt, or no reply finished yet).
 * An edit still waiting on Keep or Undo is kept as kept: its Undo record lives only while the app runs.
 */
export function keptChat(id: string, state: Pick<ChatState, "turns" | "edits" | "answers" | "session">, extra: { folder?: string; created?: number; now?: number } = {}): KeptChat | null {
  const first = state.turns.find(turn => turn.author === "user");
  if (!first || first.author !== "user" || !state.turns.some(turn => turn.author === "assistant" && turn.done)) return null;
  const now = extra.now ?? Date.now();
  return {
    version: KEPT_VERSION, id, title: first.text.trim().split("\n")[0]!.slice(0, 120) || "Chat", created: extra.created ?? first.at, at: now,
    ...(extra.folder ? { folder: extra.folder } : {}), ...(state.session ? { session: state.session } : {}),
    turns: state.turns.map(settled),
    edits: Object.fromEntries(Object.entries(state.edits).map(([edit, value]) => [edit, value === "pending" ? "kept" : value])),
    answers: state.answers,
    text: chatText(state.turns),
  };
}

const isPart = (value: unknown): value is Part => {
  const part = value as { kind?: unknown; text?: unknown; summary?: unknown; id?: unknown; name?: unknown };
  return Boolean(part) && (part.kind === "text" ? typeof part.text === "string" : part.kind === "thinking" ? typeof part.summary === "string"
    : part.kind === "tool" ? typeof part.id === "string" && typeof part.name === "string" : false);
};
const isTurn = (value: unknown): value is Turn => {
  const turn = value as { author?: unknown; text?: unknown; parts?: unknown; id?: unknown };
  if (!turn || typeof turn.id !== "string") return false;
  return turn.author === "user" ? typeof turn.text === "string" : turn.author === "assistant" && Array.isArray(turn.parts) && turn.parts.every(isPart);
};

/** A kept chat read from its file, each part checked, or null when the file is not one. */
export function readKept(saved: unknown): KeptChat | null {
  if (!saved || typeof saved !== "object") return null;
  const s = saved as Record<string, unknown>;
  if (typeof s.id !== "string" || !/^[a-z0-9-]{1,64}$/.test(s.id) || !Array.isArray(s.turns)) return null;
  const turns = s.turns.filter(isTurn).map(settled);
  if (!turns.some(turn => turn.author === "user")) return null;
  const at = typeof s.at === "number" && Number.isFinite(s.at) ? s.at : 0;
  const record = (value: unknown) => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, never> : {};
  return {
    version: KEPT_VERSION, id: s.id, title: typeof s.title === "string" && s.title.trim() ? s.title.trim() : "Chat",
    created: typeof s.created === "number" && Number.isFinite(s.created) ? s.created : at, at,
    ...(typeof s.folder === "string" && s.folder ? { folder: s.folder } : {}), ...(typeof s.session === "string" && s.session ? { session: s.session } : {}),
    turns, edits: record(s.edits), answers: record(s.answers), text: typeof s.text === "string" ? s.text : chatText(turns),
  };
}

/** Kept chats in a list's order: the newest change first. */
export const sortKept = (chats: readonly KeptChat[]) => [...chats].sort((a, b) => b.at - a.at);

// ---- The bridge: each place's list, read once, then kept here and written through -------------------------------

const lists = new Map<string, KeptChat[]>();
const loading = new Map<string, Promise<void>>();
const EVENT = "area-kept-chats";
const bridge = () => typeof window === "undefined" ? undefined : window.areaDesktop?.chats;
const changed = () => { if (typeof dispatchEvent === "function") dispatchEvent(new Event(EVENT)); };

function load(place: ChatPlace): void {
  const key = placeKey(place);
  if (lists.has(key) || loading.has(key)) return;
  const chats = bridge();
  if (!chats) { lists.set(key, []); return; }
  loading.set(key, chats.read(place.kind, place.id).then(files => {
    // A chat kept while the list was being read stays; the file's copy of it is the older one.
    const now = lists.get(key) ?? [];
    const read = files.map(readKept).filter((chat): chat is KeptChat => Boolean(chat) && !now.some(other => other.id === chat!.id));
    lists.set(key, sortKept([...now, ...read]));
  }, () => { if (!lists.has(key)) lists.set(key, []); }).then(() => { loading.delete(key); changed(); }));
}

/** Keep a chat in its place: its file written, the place's list updated. */
export function keepChat(place: ChatPlace, chat: KeptChat): void {
  const key = placeKey(place);
  lists.set(key, sortKept([chat, ...(lists.get(key) ?? []).filter(other => other.id !== chat.id)]));
  bridge()?.write(place.kind, place.id, chat.id, JSON.stringify(chat));
  changed();
}

/** Delete a kept chat: its file moves to the Trash. */
export function deleteChat(place: ChatPlace, id: string): void {
  const key = placeKey(place);
  lists.set(key, (lists.get(key) ?? []).filter(other => other.id !== id));
  bridge()?.trash(place.kind, place.id, id);
  changed();
}

/** A place's kept chats, newest first; every reader follows a change. Empty until the files are read. */
export function useKeptChats(place: ChatPlace): KeptChat[] {
  const key = placeKey(place);
  const [, bump] = useState(0);
  useEffect(() => {
    load({ kind: place.kind, id: place.id });
    const follow = () => bump(count => count + 1);
    addEventListener(EVENT, follow);
    return () => removeEventListener(EVENT, follow);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  return lists.get(key) ?? EMPTY;
}
const EMPTY: KeptChat[] = [];

/** A new chat's id, as its file is named. */
let made = 0;
export const newChatId = () => `chat-${Date.now().toString(36)}-${(++made).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
