/**
 * The Changes view (owner, 2026-11-10: "Yes, build Changes"; docs/research/desktop-app-analysis-2026-11-10, T3): in a
 * project's tab the Inspector's Code view lists what the project's chat has changed, a file at a time, with its lines
 * added and deleted, its change with line numbers, and Keep or Undo for each file and for all. A + on a line writes a
 * comment under it; the comments go to Chat together as one card, as the Design view's changes do (P9).
 *
 * It reads the showing place's conversation (src/chat/chat.tsx): Keep and Undo here and in the chat's own Edit summary
 * are the same edits, so one settles the other.
 */
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Button, Diff, EditSummary, EditSummaryFile, Input, PanelSection, TurnNotice, type DiffLine, type DiffLineAt } from "@area/react";
import { useStudio } from "../studio.tsx";
import { folderName } from "../output.ts";
import { useChat } from "./chat.tsx";
import { placeKey } from "./store.ts";
import type { FileRecord } from "./session.ts";
import { OpenInEditor } from "../editors.tsx";
import { ProjectVersions } from "./versions.tsx";
import { changedFiles, commentRows, commentsMessage, locate, type ChangedFile, type LineComment } from "./changes.ts";

// ---- Comments waiting to be sent, per place: they outlive a change of the Inspector's view ----------------------

const waiting = new Map<string, LineComment[]>();
const EVENT = "area-change-comments";
const NONE: LineComment[] = [];
let made = 0;
function useComments(place: string): [LineComment[], (next: LineComment[]) => void] {
  const [, bump] = useState(0);
  useEffect(() => {
    const follow = () => bump(count => count + 1);
    addEventListener(EVENT, follow);
    return () => removeEventListener(EVENT, follow);
  }, []);
  return [waiting.get(place) ?? NONE, next => { if (next.length) waiting.set(place, next); else waiting.delete(place); dispatchEvent(new Event(EVENT)); }];
}

/** The showing chat's changed files, with the engine's record of each once it answers. */
function useChangedFiles(): ChangedFile[] {
  const { session, folder } = useChat();
  const [records, setRecords] = useState<FileRecord[]>([]);
  // Asked again when an edit lands or is undone, and when a run ends.
  const key = `${session.running}|${Object.entries(session.edits).map(([id, state]) => `${id}:${state === "undone" ? "u" : ""}`).join(",")}|${session.turns.length}`;
  const { changes } = session;
  useEffect(() => {
    let alive = true;
    changes().then(next => { if (alive) setRecords(next); });
    return () => { alive = false; };
  }, [key, changes]);
  return useMemo(() => changedFiles(session.turns, session.edits, records, folder), [session.turns, session.edits, records, folder]);
}

/** How many files wait on Keep or Undo in the showing chat: the Code view's count in a project's tab. */
export function usePendingFiles(): number {
  const { session } = useChat();
  return useMemo(() => changedFiles(session.turns, session.edits).filter(file => file.state === "pending").length, [session.turns, session.edits]);
}

/** The field a comment is written in, under its line: Enter adds it, Esc leaves it. */
function CommentDraft({ onAdd, onCancel }: { onAdd: (note: string) => void; onCancel: () => void }) {
  const [note, setNote] = useState("");
  const submit = (event: FormEvent) => { event.preventDefault(); if (note.trim()) onAdd(note.trim()); };
  return (
    <form className="studio-changes__draft" onSubmit={submit} onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); onCancel(); } }}>
      <span className="studio-changes__field">
        <Input size="sm" fullWidth autoFocus aria-label="Comment" placeholder="Comment on this line" value={note} onChange={event => setNote(event.target.value)} />
      </span>
      <Button size="sm" variant="soft" tone="neutral" type="submit" disabled={!note.trim()}>Add</Button>
    </form>
  );
}

/** The first line a file's change touches in the new file, where Open in editor puts the cursor. */
const firstChanged = (file: ChangedFile) => file.hunks.flatMap(hunk => hunk.lines).find(line => line.kind === "added" && line.new !== undefined)?.new
  ?? file.hunks.flatMap(hunk => hunk.lines).find(line => line.new !== undefined)?.new;

function FileChange({ file, open, comments, onComments }: { file: ChangedFile; open: boolean; comments: LineComment[]; onComments: (next: LineComment[]) => void }) {
  const { session, folder } = useChat();
  const [draft, setDraft] = useState<(DiffLineAt & { line: number; of: DiffLine }) | null>(null);
  const mine = comments.filter(comment => comment.file === file.file);
  const pending = file.ids.filter(id => (session.edits[id] ?? "pending") === "pending");
  const live = file.ids.filter(id => session.edits[id] !== "undone");
  const notes = [
    ...mine.flatMap(comment => {
      const at = locate(file.hunks, comment);
      return at ? [{ ...at, content: (
        <div className="studio-changes__note">
          <span className="studio-changes__note-text">{comment.note}</span>
          <Button size="sm" variant="ghost" tone="neutral" aria-label={`Remove comment: ${comment.note}`} onClick={() => onComments(comments.filter(entry => entry.id !== comment.id))}>Remove</Button>
        </div>
      ) }] : [];
    }),
    ...(draft ? [{ hunk: draft.hunk, line: draft.line, content: (
      <CommentDraft onCancel={() => setDraft(null)} onAdd={note => {
        const gone = draft.of.kind === "deleted" || draft.of.kind === "removed";
        const number = gone ? draft.of.old : draft.of.new;
        onComments([...comments, { id: `comment-${++made}`, file: file.file, name: file.name, ...(number !== undefined ? { number } : {}), ...(gone ? { deleted: true } : {}), text: draft.of.text, note }]);
        setDraft(null);
      }} />
    ) }] : []),
  ];
  return (
    <EditSummaryFile name={file.name} added={file.added} deleted={file.deleted} status={file.state} defaultOpen={open}
      onKeep={() => session.setEdits(pending, "kept")} onUndo={() => session.setEdits(live, "undone")}
      diff={<>
        <Diff aria-label={`Changes to ${file.name}`} hunks={file.hunks} notes={notes}
          onComment={file.state === "undone" ? undefined : (line, at) => setDraft({ ...at, of: line })} />
        {folder && file.state !== "undone" ? <div className="studio-changes__open"><OpenInEditor folder={folder} path={file.file} line={firstChanged(file)} /></div> : null}
      </>} />
  );
}

/** The Inspector's Code view in a project's tab. */
export function ChatChanges() {
  const { setInspectorView, openProject } = useStudio();
  const { session, place, folder, setChanges, setDraft, composer } = useChat();
  const files = useChangedFiles();
  const [comments, setComments] = useComments(placeKey(place));
  const versions = folder && openProject ? <ProjectVersions folder={folder} project={openProject.name} /> : null;
  if (!files.length) {
    return (<>
      <PanelSection heading="Changes">
        <p className="studio-inspector-note">{`No changes yet. What Chat changes${folder ? ` in ${folderName(folder)}` : ""} shows here, a file at a time, to keep or undo.`}</p>
      </PanelSection>
      {versions}
    </>);
  }
  const pending = files.filter(file => file.state === "pending");
  const live = files.filter(file => file.state !== "undone");
  const pendingIds = pending.flatMap(file => file.ids.filter(id => (session.edits[id] ?? "pending") === "pending"));
  // Undo all takes back every pending file whole, its kept edits too: a file goes back step by step.
  const undoIds = pending.flatMap(file => file.ids.filter(id => session.edits[id] !== "undone"));
  const failed = files.filter(file => file.ids.some(id => session.undoFailed[id]));
  const send = () => {
    const sent = comments;
    setChanges({
      title: sent.length === 1 ? "1 comment on the changes" : `${sent.length} comments on the changes`,
      items: commentRows(sent), prompt: commentsMessage(sent),
      onSent: () => setComments((waiting.get(placeKey(place)) ?? []).filter(entry => !sent.includes(entry))),
    });
    setDraft(current => current.trim() ? current : sent.length === 1 ? "Take this comment in." : "Take these comments in.");
    setInspectorView("chat");
    requestAnimationFrame(() => composer.current?.focus());
  };
  return (<>
    <PanelSection heading="Changes">
      <EditSummary variant="plain" title={live.length === 1 ? "1 file" : `${live.length} files`}
        added={live.reduce((sum, file) => sum + file.added, 0)} deleted={live.reduce((sum, file) => sum + file.deleted, 0)}
        onKeepAll={pendingIds.length && !session.running ? () => session.setEdits(pendingIds, "kept") : undefined}
        onUndoAll={undoIds.length && !session.running ? () => session.setEdits(undoIds, "undone") : undefined}>
        {files.map(file => <FileChange key={file.file} file={file} open={files.length === 1} comments={comments} onComments={setComments} />)}
      </EditSummary>
      {failed.map(file => <TurnNotice key={file.file} status="error">{`Couldn't undo ${file.name}: ${session.undoFailed[file.ids.find(id => session.undoFailed[id])!]}`}</TurnNotice>)}
      {comments.length ? (
        <div className="studio-inspector-actions studio-changes__send">
          <Button size="sm" variant="soft" tone="neutral" onClick={() => setComments([])}>{comments.length === 1 ? "Clear 1 comment" : `Clear ${comments.length} comments`}</Button>
          <Button size="sm" variant="solid" onClick={send}>Send to chat</Button>
        </div>
      ) : null}
    </PanelSection>
    {versions}
  </>);
}
