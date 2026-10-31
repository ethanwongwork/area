/**
 * The Inspector's information as Area's Description list (owner, 2026-10-30, docs/research/inspector-panel-2026-10-30,
 * "One Inspector grid"; it was a Table, owner 2026-10-11/12): term / value rows on the panel's own label column, so a
 * fact's value starts where a Field's control does, rows packed at a small control's height, no frame and no rules.
 *
 * Prose (what something is for, a note) is not a value: it reads as a muted paragraph under the list, at the panel's
 * width, rather than wrapping down a narrow value column (a tile's note took seven lines there).
 */
import type { ReactNode } from "react";
import { DescriptionList, DescriptionListItem } from "@area/react";

export type Fact = readonly [term: ReactNode, value: ReactNode];

export function Facts({ items, label, note }: {
  items: ReadonlyArray<Fact | null | false | undefined>;
  label: string;
  /** A sentence or two about the thing, under the list. */
  note?: ReactNode;
}) {
  return (
    <>
      <DescriptionList layout="columns" aria-label={label}>
        {items.filter((item): item is Fact => Boolean(item)).map(([term, value], index) => (
          <DescriptionListItem key={index} term={term}>{value}</DescriptionListItem>
        ))}
      </DescriptionList>
      {note ? <p className="studio-inspector-note">{note}</p> : null}
    </>
  );
}
