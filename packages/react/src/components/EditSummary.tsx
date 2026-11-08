// EditSummary, EditSummaryFile and Diff: what an agent changed, and how. Spec: docs/specs/edit-summary.md.
import { forwardRef, useId, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
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
  /** Lines added and deleted (the shared change words, components audit D6). */
  added: number;
  deleted?: number;
  /** @deprecated Use `deleted` (2026-11-07). Kept for one release; `deleted` wins. */
  removed?: number;
  /** pending: Undo and Keep; kept / undone: settled, the actions leave. */
  status?: EditFileStatus;
  /** @deprecated Use `status` (an outcome is a status, Governance § 4). Kept for one release; `status` wins. */
  state?: EditFileStatus;
  onKeep?: () => void;
  onUndo?: () => void;
  /** A 16 glyph before the name: the file's kind (a code, image or document glyph). */
  icon?: ReactNode;
  /** The file's Diff, shown under the row when its name is pressed. */
  diff?: ReactNode;
  /** Whether the diff shows (controlled); pair with `onOpenChange`. */
  open?: boolean;
  /** Whether the diff shows at first (uncontrolled). */
  defaultOpen?: boolean;
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

export interface EditSummaryProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The head's title, such as "Edited 2 files" (the caller writes the count); "Edited files" when unset. */
  title?: ReactNode;
  /** The turn's totals: lines added and deleted. */
  added: number;
  deleted?: number;
  /** @deprecated Use `deleted` (2026-11-07). Kept for one release; `deleted` wins. */
  removed?: number;
  /** Keep and Undo for every pending file; leave out when none is pending. */
  onKeepAll?: () => void;
  onUndoAll?: () => void;
  /** surface (default): its own frame. plain: no frame, its words on the text edge around it, as a turn's steps (a chat);
   *  a file's diff keeps its own. */
  variant?: VariantProps<typeof MANIFESTS.editSummary>["variant"];
  /** EditSummaryFile rows. */
  children: ReactNode;
}

/** What an agent changed in a turn: the count and +N −N, Undo all and Keep all, and a row per file. */
export const EditSummary = forwardRef<HTMLElement, EditSummaryProps>(function EditSummary(
  { title, added, deleted, removed, onKeepAll, onUndoAll, variant, children, className, "aria-label": ariaLabel, ...rest }, ref,
) {
  const titleId = useId();
  return (
    <section ref={ref} className={editSummaryVariants({ variant }, className)} aria-labelledby={ariaLabel ? undefined : titleId} aria-label={ariaLabel} {...rest}>
      <div className="area-edit-summary__head">
        <span id={titleId} className="area-edit-summary__title">{title ?? "Edited files"}</span>
        <Counts added={added} deleted={deleted ?? removed ?? 0} />
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

export interface DiffProps extends HTMLAttributes<HTMLElement> {
  hunks: DiffHunk[];
  /** Names the diff ("Changes to button.css"); "Changes" when unset. */
  "aria-label"?: string;
  /** @deprecated Use `aria-label` (it only names the element, DESIGN_SYSTEM.md "Names and collections"). Kept for one
   *  release: the file's name, read as "Changes to {label}"; `aria-label` wins. */
  label?: string;
}

/** A unified diff in Code block sm's metrics and diff paint: old and new line numbers, a + or − marker and a tint on
 *  added and deleted lines, folds between hunks. A diff
 *  whose lines carry no numbers (an agent's edit before the file is read) draws no number columns. */
export const Diff = forwardRef<HTMLElement, DiffProps>(function Diff({ hunks, label, "aria-label": ariaLabel, className, ...rest }, ref) {
  const numbered = hunks.some(hunk => hunk.lines.some(line => line.old !== undefined || line.new !== undefined));
  return (
    <figure ref={ref} className={diffVariants({}, className)} aria-label={ariaLabel ?? (label ? `Changes to ${label}` : "Changes")} tabIndex={0} {...rest}>
      <div className="area-diff__lines">
        {hunks.map((hunk, h) => [
          hunk.folded ? <div key={`fold-${h}`} className="area-diff__fold">{`${hunk.folded} unchanged line${hunk.folded === 1 ? "" : "s"}`}</div> : null,
          ...hunk.lines.map((line, l) => { const kind = line.kind === "removed" ? "deleted" : line.kind; return (
            <div key={`${h}-${l}`} className={["area-diff__line", kind !== "context" ? `area-diff__line--${kind}` : ""].filter(Boolean).join(" ")}>
              {numbered ? <span className="area-diff__number" aria-hidden="true">{line.old ?? ""}</span> : null}
              {numbered ? <span className="area-diff__number" aria-hidden="true">{line.new ?? ""}</span> : null}
              <span className="area-diff__marker" aria-hidden="true">{kind === "added" ? "+" : kind === "deleted" ? "−" : ""}</span>
              <span className="area-diff__text">
                {kind !== "context" ? <span className="area-sr-only">{kind === "added" ? "Added: " : "Deleted: "}</span> : null}
                {line.text}
              </span>
            </div>
          ); }),
        ])}
      </div>
    </figure>
  );
});
