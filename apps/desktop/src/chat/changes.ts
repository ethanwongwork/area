/**
 * What a chat has changed, a file at a time (the Changes view; docs/research/desktop-app-analysis-2026-11-10, T3).
 * The chat's own Edit summary is a turn's edits; this is the conversation's, each file once: its change from before the
 * chat's first edit to after its last, with line numbers where the engine has the file's text (electron/agent.cjs
 * `changes`), and the edits' own lines where it doesn't (a recorded run, a chat opened again after the app closed).
 * Pure: the changes test imports it.
 */
import type { DiffHunk } from "@area/react";
import type { ChatState, EditState, FileRecord, Turn } from "./session.ts";
import { lineDiff } from "./line-diff.ts";

export interface ChangedFile {
  /** The file's path as the edits named it. */
  file: string;
  /** Its path as the list shows it: from the folder the chat works in. */
  name: string;
  /** Its edits (tool call ids), oldest first. */
  ids: string[];
  /** Pending while any edit waits on Keep or Undo; undone once every edit is. */
  state: EditState;
  hunks: DiffHunk[];
  added: number;
  deleted: number;
  /** The file was changed outside the chat since its last edit. */
  moved: boolean;
}

type Edit = { id: string; file: string; before: string[]; after: string[] };
const editsOf = (turns: readonly Turn[]): Edit[] => turns.flatMap(turn => turn.author !== "assistant" ? [] : turn.parts.flatMap(part => {
  if (part.kind !== "tool" || (part.name !== "Edit" && part.name !== "Write") || part.status !== "done") return [];
  const { old_string, new_string, content, file_path } = part.input as Record<string, unknown>;
  return [{
    id: part.id, file: typeof file_path === "string" ? file_path : "file",
    before: typeof old_string === "string" ? old_string.split("\n") : [],
    after: typeof new_string === "string" ? new_string.split("\n") : typeof content === "string" ? content.split("\n") : [],
  }];
}));

const shown = (file: string, root?: string) => root && file.startsWith(`${root}/`) ? file.slice(root.length + 1) : file.startsWith("/") ? file.split("/").slice(-3).join("/") : file;

/** The chat's changed files in the order it first touched each. `root` is the folder it works in, when known. */
export function changedFiles(turns: readonly Turn[], edits: ChatState["edits"], records: readonly FileRecord[] = [], root?: string): ChangedFile[] {
  const files = new Map<string, Edit[]>();
  for (const edit of editsOf(turns)) files.set(edit.file, [...(files.get(edit.file) ?? []), edit]);
  return [...files].map(([file, list]) => {
    const ids = list.map(edit => edit.id);
    const live = list.filter(edit => edits[edit.id] !== "undone");
    const state: EditState = !live.length ? "undone" : live.every(edit => edits[edit.id] === "kept") ? "kept" : "pending";
    const record = records.find(entry => entry.ids.some(id => ids.includes(id)));
    const name = record && !record.path.startsWith("/") ? record.path : shown(file, root);
    if (record && !record.large && live.length) {
      const diff = lineDiff(record.before, record.after);
      if (diff.hunks.length) return { file, name, ids, state, moved: record.moved, ...diff };
    }
    // Without the file's text: each edit's own lines, out then in, unnumbered. An undone file shows what was undone.
    const told = live.length ? live : list;
    return {
      file, name, ids, state, moved: Boolean(record?.moved && live.length),
      hunks: told.map(edit => ({ lines: [...edit.before.map(text => ({ kind: "deleted" as const, text })), ...edit.after.map(text => ({ kind: "added" as const, text }))] })),
      added: told.reduce((sum, edit) => sum + edit.after.length, 0), deleted: told.reduce((sum, edit) => sum + edit.before.length, 0),
    };
  });
}

/** A comment on a line of a change, as it waits to be sent to Chat. */
export interface LineComment {
  id: string;
  file: string;
  name: string;
  /** The line's number, in the new file unless it was deleted; none where the diff has no numbers. */
  number?: number;
  deleted?: boolean;
  /** The line's own text. */
  text: string;
  note: string;
}

/** Where a comment's line is in a file's hunks now, or null when the line is no longer in the change. */
export function locate(hunks: readonly DiffHunk[], comment: Pick<LineComment, "number" | "deleted" | "text">): { hunk: number; line: number } | null {
  for (let h = 0; h < hunks.length; h++) for (let l = 0; l < hunks[h]!.lines.length; l++) {
    const line = hunks[h]!.lines[l]!;
    const gone = line.kind === "deleted" || line.kind === "removed";
    if (line.text === comment.text && gone === Boolean(comment.deleted) && (gone ? line.old : line.new) === comment.number) return { hunk: h, line: l };
  }
  return null;
}

const where = (comment: LineComment) => comment.number === undefined ? comment.name : `${comment.name}, ${comment.deleted ? "deleted line" : "line"} ${comment.number}`;
/** The comments as their card's rows in the composer: where, and what was said. */
export const commentRows = (comments: readonly LineComment[]) => comments.map(comment => ({ thing: where(comment), change: comment.note }));
/** The comments as the agent reads them: each with its file, its line and the line's own text. */
export const commentsMessage = (comments: readonly LineComment[]) => [
  `The person reviewed your changes and left ${comments.length === 1 ? "a comment on a line" : `${comments.length} comments on lines`}:`,
  ...comments.map(comment => `- ${where(comment)} (\`${comment.text.trim().slice(0, 160)}\`): ${comment.note}`),
  "Act on each one, changing only what it asks for, then say what you changed.",
].join("\n");
