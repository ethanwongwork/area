// EditSummary, EditSummaryFile and Diff: what an agent changed, and how. Spec: docs/specs/edit-summary.md.
import { forwardRef, useId, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { diffVariants, editSummaryVariants } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";

/** +N −N, the change's size, in the success and danger inks. */
function Counts({ added, removed }: { added: number; removed: number }) {
  return (
    <span className="area-edit-summary__counts">
      <span className="area-edit-summary__added"><span aria-hidden="true">{`+${added}`}</span><span className="area-sr-only">{`${added} added`}</span></span>
      <span className="area-edit-summary__removed"><span aria-hidden="true">{`−${removed}`}</span><span className="area-sr-only">{`${removed} removed`}</span></span>
    </span>
  );
}

export type EditFileState = "pending" | "kept" | "undone";

export interface EditSummaryFileProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The file's name as the row shows it. */
  name: string;
  added: number;
  removed: number;
  /** pending: Undo and Keep; kept / undone: settled, the actions leave. */
  state?: EditFileState;
  onKeep?: () => void;
  onUndo?: () => void;
  /** The file's Diff, shown under the row when its name is pressed. */
  diff?: ReactNode;
  defaultOpen?: boolean;
}

/** One changed file: its name and +N −N (a button that opens its diff), and Undo and Keep. */
export const EditSummaryFile = forwardRef<HTMLDivElement, EditSummaryFileProps>(function EditSummaryFile(
  { name, added, removed, state = "pending", onKeep, onUndo, diff, defaultOpen = false, className, ...rest }, ref,
) {
  const diffId = useId();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <div ref={ref} className={["area-edit-summary__file", className].filter(Boolean).join(" ")} data-open={diff && open ? "" : undefined}
        data-kept={state === "kept" ? "" : undefined} data-undone={state === "undone" ? "" : undefined} {...rest}>
        <button type="button" className="area-edit-summary__name" aria-expanded={diff ? open : undefined} aria-controls={diff ? diffId : undefined}
          onClick={() => diff && setOpen(!open)}>
          <span>{name}</span>
          <Counts added={added} removed={removed} />
          {diff ? <span className="area-edit-summary__chevron" aria-hidden="true"><Glyph name="chevron-down" size={12} /></span> : null}
        </button>
        {state === "pending" ? (
          <span className="area-edit-summary__actions">
            <Button variant="ghost" tone="neutral" size="sm" onClick={onUndo} aria-label={`Undo ${name}`}>Undo</Button>
            <Button variant="ghost" tone="neutral" size="sm" onClick={onKeep} aria-label={`Keep ${name}`}>Keep</Button>
          </span>
        ) : <span className="area-edit-summary__status">{state === "kept" ? "Kept" : "Undone"}</span>}
      </div>
      {diff && open ? <div id={diffId} className="area-edit-summary__diff">{diff}</div> : null}
    </>
  );
});

export interface EditSummaryProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** "Edited 2 files"; by default from the number of files. */
  title?: ReactNode;
  /** The turn's totals. */
  added: number;
  removed: number;
  /** Keep and Undo for every pending file; leave out when none is pending. */
  onKeepAll?: () => void;
  onUndoAll?: () => void;
  /** EditSummaryFile rows. */
  children: ReactNode;
}

/** What an agent changed in a turn: the count and +N −N, Undo all and Keep all, and a row per file. */
export const EditSummary = forwardRef<HTMLElement, EditSummaryProps>(function EditSummary(
  { title, added, removed, onKeepAll, onUndoAll, children, className, "aria-label": ariaLabel, ...rest }, ref,
) {
  const titleId = useId();
  return (
    <section ref={ref} className={editSummaryVariants({}, className)} aria-labelledby={ariaLabel ? undefined : titleId} aria-label={ariaLabel} {...rest}>
      <div className="area-edit-summary__head">
        <span id={titleId} className="area-edit-summary__title">{title ?? "Edited files"}</span>
        <Counts added={added} removed={removed} />
        {onKeepAll || onUndoAll ? (
          <span className="area-edit-summary__actions">
            {onUndoAll ? <Button variant="ghost" tone="neutral" size="sm" onClick={onUndoAll}>Undo all</Button> : null}
            {onKeepAll ? <Button variant="ghost" tone="neutral" size="sm" onClick={onKeepAll}>Keep all</Button> : null}
          </span>
        ) : null}
      </div>
      <div className="area-edit-summary__files">{children}</div>
    </section>
  );
});

export interface DiffLine {
  kind: "added" | "removed" | "context";
  text: string;
  /** Line numbers in the old and the new file (a removed line has no new one; an added line no old one). */
  old?: number;
  new?: number;
}
export interface DiffHunk {
  /** Unchanged lines folded before this hunk ("12 unchanged lines"). */
  folded?: number;
  lines: DiffLine[];
}

export interface DiffProps extends HTMLAttributes<HTMLElement> {
  hunks: DiffHunk[];
  /** Names the diff (the file). */
  label?: string;
}

/** A unified diff in Code block sm's metrics and diff paint: old and new line numbers, a + or − marker and a tint on
 *  added and removed lines, folds between hunks. A diff
 *  whose lines carry no numbers (an agent's edit before the file is read) draws no number columns. */
export const Diff = forwardRef<HTMLElement, DiffProps>(function Diff({ hunks, label, className, ...rest }, ref) {
  const numbered = hunks.some(hunk => hunk.lines.some(line => line.old !== undefined || line.new !== undefined));
  return (
    <figure ref={ref} className={diffVariants({}, className)} aria-label={label ? `Changes to ${label}` : "Changes"} tabIndex={0} {...rest}>
      <div className="area-diff__lines">
        {hunks.map((hunk, h) => [
          hunk.folded ? <div key={`fold-${h}`} className="area-diff__fold">{`${hunk.folded} unchanged line${hunk.folded === 1 ? "" : "s"}`}</div> : null,
          ...hunk.lines.map((line, l) => (
            <div key={`${h}-${l}`} className={["area-diff__line", line.kind !== "context" ? `area-diff__line--${line.kind}` : ""].filter(Boolean).join(" ")}>
              {numbered ? <span className="area-diff__number" aria-hidden="true">{line.old ?? ""}</span> : null}
              {numbered ? <span className="area-diff__number" aria-hidden="true">{line.new ?? ""}</span> : null}
              <span className="area-diff__marker" aria-hidden="true">{line.kind === "added" ? "+" : line.kind === "removed" ? "−" : ""}</span>
              <span className="area-diff__text">
                {line.kind !== "context" ? <span className="area-sr-only">{line.kind === "added" ? "Added: " : "Removed: "}</span> : null}
                {line.text}
              </span>
            </div>
          )),
        ])}
      </div>
    </figure>
  );
});
