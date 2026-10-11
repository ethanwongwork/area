// Board: columns of cards, each column a coloured group with a title, a count Badge, header actions and an
// "Add new" row; cards are links with optional properties and hover actions. docs/specs/board.md.
import { forwardRef, useId } from "react";
import type { AnchorHTMLAttributes, HTMLAttributes, MouseEvent, ReactNode } from "react";
import { cx, type VariantProps, MANIFESTS } from "../variants.ts";
import { Badge } from "./Badge.tsx";
import { Glyph } from "./Glyph.tsx";

type Color = VariantProps<typeof MANIFESTS.boardColumn>["color"];

/** Columns side by side; scrolls sideways when they outgrow the space. */
export const Board = /* @__PURE__ */ forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Board({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-board", className)} {...rest} />;
});

export interface BoardColumnProps extends Omit<HTMLAttributes<HTMLElement>, "title" | "color"> {
  /** The group's name ("In progress"), in plain text. */
  title: ReactNode;
  /** The column's colour: its tint, its count, its cards' edge and its add row. Neutral by default. */
  color?: Color;
  /** How many cards the group holds (may exceed those shown), as a Badge. */
  count?: number;
  /** Buttons at the header's end (add, more). */
  actions?: ReactNode;
  /** Shows the "Add new" row under the cards. */
  onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** The add row's label. */
  addLabel?: ReactNode;
  /** A custom row under the cards, in place of the add row. */
  footer?: ReactNode;
}

/** One group of a Board: its header and a list of BoardCards. */
export const BoardColumn = /* @__PURE__ */ forwardRef<HTMLElement, BoardColumnProps>(function BoardColumn(
  { title, color = "neutral", count, actions, onAdd, addLabel = "Add new", footer, className, children, "aria-labelledby": labelledBy, ...rest },
  ref,
) {
  const id = useId();
  return (
    <section ref={ref} className={cx("area-board-column", `area-board-column--${color}`, className)} aria-labelledby={labelledBy ?? `${id}-title`} {...rest}>
      <div className="area-board-column__header">
        <span id={`${id}-title`} className="area-board-column__title">{title}</span>
        {count != null ? <Badge size="sm" className="area-board-column__count">{count}</Badge> : null}
        {actions ? <div className="area-board-column__actions">{actions}</div> : null}
      </div>
      <ul className="area-board-column__cards">{children}</ul>
      {footer ?? (onAdd ? (
        <div className="area-board-column__footer">
          <button type="button" className="area-board-column__add" onClick={onAdd}>
            <span className="area-board-column__add-icon" aria-hidden="true"><Glyph name="add" /></span>
            {addLabel}
          </button>
        </div>
      ) : null)}
    </section>
  );
});

export interface BoardCardProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  /** The card's title; it is the link that opens the item. */
  title: ReactNode;
  /** The page icon before the title. */
  icon?: ReactNode;
  /** Properties under the title: Tags, dates, people. */
  children?: ReactNode;
  /** Controls shown on hover or focus at the card's top end (edit, more). */
  actions?: ReactNode;
}

/** One item on a Board. The title links to it and its link covers the card; the actions stay separate controls. */
export const BoardCard = /* @__PURE__ */ forwardRef<HTMLAnchorElement, BoardCardProps>(function BoardCard(
  { title, icon, children, actions, className, ...rest },
  ref,
) {
  return (
    <li className={cx("area-board-card", className)}>
      <div className="area-board-card__heading">
        {icon ? <span className="area-board-card__icon" aria-hidden="true">{icon}</span> : null}
        <a ref={ref} className="area-board-card__title" {...rest}>{title}</a>
      </div>
      {children ? <div className="area-board-card__properties">{children}</div> : null}
      {actions ? <div className="area-board-card__actions">{actions}</div> : null}
    </li>
  );
});
