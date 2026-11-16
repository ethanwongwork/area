// EditSummary, EditSummaryChange, EditSummaryFile and Diff: what an agent changed, and how. Spec: docs/specs/edit-summary.md.
import { forwardRef, useId, useState } from "react";
import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { diffVariants, editSummaryVariants, MANIFESTS, type VariantProps } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";

/** +N −N, the change's size, in the change inks and words (`fg-change-added`, `fg-change-deleted`; components audit D6). */
function Counts({ added, deleted }: { added: number; deleted: number }) {
  return (
    <span className="area-edit-summary__counts">
      <span className="area-edit-summary__added"><span aria-hidden="true">{`+${added}`}</span><span className="area-sr-only">{`${added} added`}</span></span>
      <span className="area-edit-summary__deleted"><span aria-hidden="true">{`−${deleted}`}</span><span className="area-sr-only">{`${deleted} deleted`}</span></span>
    </span>
  );
}

/** Where a changed file stands: pending (Undo and Keep), kept or undone (settled). */
export type EditFileStatus = "pending" | "kept" | "undone";
/** The same values as `EditFileStatus`, under the name the `state` prop used. */
export type EditFileState = EditFileStatus;

export interface EditSummaryFileProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The file's name as the row shows it. */
  name: string;
  /** Lines added, shown as +N. */
  added: number;
  /** Lines deleted, shown as −N. */
  deleted?: number;
  /** @deprecated Use `deleted`, which wins. Kept for one release. */
  removed?: number;
  /** pending: Undo and Keep; kept / undone: settled, the actions leave. */
  status?: EditFileStatus;
  /** @deprecated Use `status`, which wins. Kept for one release. */
  state?: EditFileStatus;
  /** Shows Keep while the file is pending; called when it is pressed. */
  onKeep?: () => void;
  /** Shows Undo while the file is pending; called when it is pressed. */
  onUndo?: () => void;
  /** A 16 glyph before the name: the file's kind (a code, image or document glyph). */
  icon?: ReactNode;
  /** The file's Diff, shown under the row when its name is pressed. */
  diff?: ReactNode;
  /** Whether the diff shows (controlled); pair with `onOpenChange`. */
  open?: boolean;
  /** Whether the diff shows at first (uncontrolled). */
  defaultOpen?: boolean;
  /** Called when pressing the file's name shows or hides its diff. */
  onOpenChange?: (open: boolean) => void;
}

/** One changed file: its name and +N −N (a button that opens its diff), and Undo and Keep. */
export const EditSummaryFile = forwardRef<HTMLDivElement, EditSummaryFileProps>(function EditSummaryFile(
  { name, added, deleted, removed, icon, status: statusProp, state: stateProp, onKeep, onUndo, diff, open: openProp, defaultOpen = false, onOpenChange, className, ...rest }, ref,
) {
  const state = statusProp ?? stateProp ?? "pending";
  // A path shows its file name first and its folder after it, muted ("settings.tsx src/pages").
  const cut = name.lastIndexOf("/");
  const base = cut < 0 ? name : name.slice(cut + 1);
  const folder = cut < 0 ? "" : name.slice(0, cut);
  const diffId = useId();
  const [own, setOwn] = useState(defaultOpen);
  const open = openProp ?? own;
  const toggle = () => { const next = !open; if (openProp === undefined) setOwn(next); onOpenChange?.(next); };
  return (
    <>
      <div ref={ref} className={["area-edit-summary__file", className].filter(Boolean).join(" ")} data-open={diff && open ? "" : undefined}
        data-kept={state === "kept" ? "" : undefined} data-undone={state === "undone" ? "" : undefined} {...rest}>
        <button type="button" className="area-edit-summary__name" aria-expanded={diff ? open : undefined} aria-controls={diff ? diffId : undefined}
          onClick={() => { if (diff) toggle(); }}>
          {icon ? <span className="area-edit-summary__icon" aria-hidden="true">{icon}</span> : null}
          <span className="area-edit-summary__base">{base}</span>
          {folder ? <span className="area-edit-summary__folder"><bdi>{folder}</bdi></span> : null}
          <Counts added={added} deleted={deleted ?? removed ?? 0} />
          {diff ? <span className="area-edit-summary__chevron" aria-hidden="true"><Glyph name="chevron-down" size={12} /></span> : null}
        </button>
        {state === "pending" ? (
          <span className="area-edit-summary__actions">
            <Button variant="ghost" tone="neutral" size="sm" onClick={onUndo} aria-label={`Undo ${name}`}>Undo</Button>
            <Button variant="ghost" tone="neutral" size="sm" onClick={onKeep} aria-label={`Keep ${name}`}>Keep</Button>
          </span>
        ) : <span className="area-edit-summary__status">{state === "kept" ? "Kept" : "Undone"}</span>}
      </div>
      {/* Kept in the tree while closed, so aria-controls names it and its close eases (accordion.css, disclosure bodies). */}
      {diff ? <div id={diffId} className="area-edit-summary__diff" hidden={!open}>{diff}</div> : null}
    </>
  );
});

export interface EditSummaryChangeProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "property"> {
  /** What changed, as the design names it: "Save button", "Cards". */
  name: ReactNode;
  /** The property that changed: "Corner". */
  property?: ReactNode;
  /** Its value before and after: "8" and "12". A change with no `from` reads as the property and its new value. */
  from?: ReactNode;
  /** Its value after the change: "12". */
  to: ReactNode;
  /** pending (default), kept or undone: settled rows go quiet, an undone one is struck, as a file's. */
  status?: EditFileStatus;
}

/** One change in the design's words: what changed, then its property from and to, muted after it ("Save button",
 *  "Corner 8 → 12"). No counts and no actions of its own: the summary's Keep all and Undo all settle it. */
export const EditSummaryChange = forwardRef<HTMLDivElement, EditSummaryChangeProps>(function EditSummaryChange(
  { name, property, from, to, status = "pending", className, ...rest }, ref,
) {
  return (
    <div ref={ref} className={["area-edit-summary__change", className].filter(Boolean).join(" ")}
      data-kept={status === "kept" ? "" : undefined} data-undone={status === "undone" ? "" : undefined} {...rest}>
      <span className="area-edit-summary__change-name">{name}</span>
      <span className="area-edit-summary__change-value">
        {property ? <>{property} </> : null}
        {from !== undefined && from !== null && from !== "" ? <>{from}<span aria-hidden="true"> → </span><span className="area-sr-only"> to </span></> : null}
        {to}
      </span>
      {status !== "pending" ? <span className="area-edit-summary__status">{status === "kept" ? "Kept" : "Undone"}</span> : null}
    </div>
  );
});

export interface EditSummaryProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /**
   * The head's title, such as "Edited 2 files" (the caller writes the count); "Edited files" when unset.
   * @default "Edited files"
   */
  title?: ReactNode;
  /** The turn's totals, lines added and deleted, after the title; leave them out for a summary of design changes, which
   *  has no counts. With `code`, they follow Show code instead, the files' own figure. */
  added?: number;
  /** The turn's lines deleted, shown as −N after the title. */
  deleted?: number;
  /** @deprecated Use `deleted`, which wins. Kept for one release. */
  removed?: number;
  /** The files behind the changes (EditSummaryFile rows), folded under a Show code row at the list's foot, so a
   *  summary of design changes (EditSummaryChange rows) reads in the design's words and the code is a click away. */
  code?: ReactNode;
  /** The fold's label: "Show code". */
  codeLabel?: string;
  /** Whether the files show (controlled); pair with `onCodeOpenChange`. */
  codeOpen?: boolean;
  /** Whether the files show at first (uncontrolled). */
  defaultCodeOpen?: boolean;
  /** Called when Show code shows or hides the files. */
  onCodeOpenChange?: (open: boolean) => void;
  /** Keep and Undo for every pending file; leave out when none is pending. */
  onKeepAll?: () => void;
  /** Shows Undo all while a file is pending; called when it is pressed. */
  onUndoAll?: () => void;
  /** surface (default): its own frame. plain: no frame, its words on the text edge around it, as a turn's steps (a chat);
   *  a file's diff keeps its own. */
  variant?: VariantProps<typeof MANIFESTS.editSummary>["variant"];
  /** EditSummaryFile rows. */
  children: ReactNode;
}

/** What an agent changed in a turn: the count and +N −N, Undo all and Keep all, and a row per file. */
export const EditSummary = forwardRef<HTMLElement, EditSummaryProps>(function EditSummary(
  { title, added, deleted: deletedProp, removed, onKeepAll, onUndoAll, variant, code, codeLabel = "Show code", codeOpen, defaultCodeOpen = false, onCodeOpenChange,
    children, className, "aria-label": ariaLabel, ...rest }, ref,
) {
  const titleId = useId();
  const codeId = useId();
  const [ownCode, setOwnCode] = useState(defaultCodeOpen);
  const showCode = codeOpen ?? ownCode;
  const toggleCode = () => { const next = !showCode; if (codeOpen === undefined) setOwnCode(next); onCodeOpenChange?.(next); };
  const deleted = deletedProp ?? removed;
  const counted = added !== undefined || deleted !== undefined;
  return (
    <section ref={ref} className={editSummaryVariants({ variant }, className)} aria-labelledby={ariaLabel ? undefined : titleId} aria-label={ariaLabel} {...rest}>
      <div className="area-edit-summary__head">
        <span id={titleId} className="area-edit-summary__title">{title ?? "Edited files"}</span>
        {counted && !code ? <Counts added={added ?? 0} deleted={deleted ?? 0} /> : null}
        {onKeepAll || onUndoAll ? (
          <span className="area-edit-summary__actions">
            {onUndoAll ? <Button variant="ghost" tone="neutral" size="sm" onClick={onUndoAll}>Undo all</Button> : null}
            {onKeepAll ? <Button variant="ghost" tone="neutral" size="sm" onClick={onKeepAll}>Keep all</Button> : null}
          </span>
        ) : null}
      </div>
      <div className="area-edit-summary__files">
        {children}
        {code ? <>
          <button type="button" className="area-edit-summary__code-toggle" aria-expanded={showCode} aria-controls={codeId}
            data-open={showCode ? "" : undefined} onClick={toggleCode}>
            <span className="area-edit-summary__base">{codeLabel}</span>
            {counted ? <Counts added={added ?? 0} deleted={deleted ?? 0} /> : null}
            <span className="area-edit-summary__chevron" aria-hidden="true"><Glyph name="chevron-down" size={12} /></span>
          </button>
          <div id={codeId} className="area-edit-summary__code" hidden={!showCode}>{code}</div>
        </> : null}
      </div>
    </section>
  );
});

export interface DiffLine {
  /** The shared change words (components audit D6); `removed` is the deprecated spelling of `deleted`. */
  kind: "added" | "deleted" | "context" | "removed";
  text: string;
  /** Line numbers in the old and the new file (a deleted line has no new one; an added line no old one). */
  old?: number;
  new?: number;
}
export interface DiffHunk {
  /** Unchanged lines folded before this hunk ("12 unchanged lines"). */
  folded?: number;
  lines: DiffLine[];
}

/** Where a line is in a Diff: its hunk and its place in it, both from 0. */
export interface DiffLineAt { hunk: number; line: number }
/** Something said about a line, drawn under it: a comment, or the field one is written in. */
export interface DiffNote extends DiffLineAt { content: ReactNode }

export interface DiffProps extends HTMLAttributes<HTMLElement> {
  /** The diff's hunks, each its lines and the unchanged lines folded before it. */
  hunks: DiffHunk[];
  /** Names the diff ("Changes to button.css"); "Changes" when unset. */
  "aria-label"?: string;
  /** @deprecated Use `aria-label`, which wins. Kept for one release: the file's name, read as "Changes to {label}". */
  label?: string;
  /** Comment on a line: each line gets a + button at its start, shown on hover and focus, and this runs when one is
   *  pressed. The buttons are one Tab stop; Up and Down move along the lines. */
  onComment?: (line: DiffLine, at: DiffLineAt) => void;
  /** Notes under their lines, in the interface's type: the comments made, or the field one is being written in. */
  notes?: readonly DiffNote[];
}

const lineName = (line: DiffLine) => {
  const number = line.new ?? line.old;
  return number === undefined ? `Comment on this line: ${line.text.trim().slice(0, 40)}` : `Comment on ${line.new === undefined ? "deleted " : ""}line ${number}`;
};

/** A unified diff in Code block sm's metrics and diff paint: old and new line numbers, a + or − marker and a tint on
 *  added and deleted lines, folds between hunks. A diff
 *  whose lines carry no numbers (an agent's edit before the file is read) draws no number columns. */
export const Diff = forwardRef<HTMLElement, DiffProps>(function Diff({ hunks, label, "aria-label": ariaLabel, onComment, notes, className, ...rest }, ref) {
  const numbered = hunks.some(hunk => hunk.lines.some(line => line.old !== undefined || line.new !== undefined));
  // The comment buttons' one Tab stop: the line last focused, the first until then.
  const [stop, setStop] = useState("0-0");
  const move = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const all = [...(event.currentTarget.closest(".area-diff")?.querySelectorAll<HTMLButtonElement>(".area-diff__comment") ?? [])];
    const next = all[all.indexOf(event.currentTarget) + (event.key === "ArrowDown" ? 1 : -1)];
    if (next) { event.preventDefault(); next.focus(); }
  };
  return (
    <figure ref={ref} className={diffVariants({}, className)} aria-label={ariaLabel ?? (label ? `Changes to ${label}` : "Changes")} tabIndex={0}
      data-commentable={onComment ? "" : undefined} {...rest}>
      <div className="area-diff__lines">
        {hunks.map((hunk, h) => [
          hunk.folded ? <div key={`fold-${h}`} className="area-diff__fold">{`${hunk.folded} unchanged line${hunk.folded === 1 ? "" : "s"}`}</div> : null,
          ...hunk.lines.flatMap((line, l) => { const kind = line.kind === "removed" ? "deleted" : line.kind; const key = `${h}-${l}`; return [
            <div key={key} className={["area-diff__line", kind !== "context" ? `area-diff__line--${kind}` : ""].filter(Boolean).join(" ")}>
              {numbered ? <span className="area-diff__number" aria-hidden="true">{line.old ?? ""}</span> : null}
              {numbered ? <span className="area-diff__number" aria-hidden="true">{line.new ?? ""}</span> : null}
              <span className="area-diff__marker" aria-hidden="true">{kind === "added" ? "+" : kind === "deleted" ? "−" : ""}</span>
              <span className="area-diff__text">
                {kind !== "context" ? <span className="area-sr-only">{kind === "added" ? "Added: " : "Deleted: "}</span> : null}
                {line.text}
              </span>
              {/* Last in the row, so the first cell keeps the start inset; it covers the row's start while shown. */}
              {onComment ? (
                <button type="button" className="area-diff__comment" aria-label={lineName(line)} tabIndex={stop === key ? 0 : -1}
                  onFocus={() => setStop(key)} onKeyDown={move} onClick={() => onComment(line, { hunk: h, line: l })}>
                  <Glyph name="add" size={12} />
                </button>
              ) : null}
            </div>,
            ...(notes ?? []).filter(note => note.hunk === h && note.line === l).map((note, n) => <div key={`${key}-note-${n}`} className="area-diff__note">{note.content}</div>),
          ]; }),
        ])}
      </div>
    </figure>
  );
});
