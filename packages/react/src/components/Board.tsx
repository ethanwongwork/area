// Board: Notion's board view. Columns of cards, each column a Tag-toned group with a count; cards are links with
// optional properties and hover actions. docs/specs/board.md.
import { forwardRef, useId } from "react";
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cx, type VariantProps, MANIFESTS } from "../variants.ts";
import { Count } from "./Count.tsx";
import { Tag } from "./Tag.tsx";

type Tone = VariantProps<typeof MANIFESTS.tag>["tone"];

/** Columns side by side; scrolls sideways when they outgrow the space. */
export const Board = /* @__PURE__ */ forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Board({ className, ...rest }, ref) {
  return <div ref={ref} className={cx("area-board", className)} {...rest} />;
});

export interface BoardColumnProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The group's value ("work"). Shown as a Tag in the column's tone, or as plain text with `plainTitle`. */
  title: ReactNode;
  /** Tag's tones; the column's tint and its cards' edge follow it. */
  tone?: Tone;
  /** The group has no value (Notion's "No Status"): the title is plain text, not a Tag. */
  plainTitle?: boolean;
  /** How many cards the group holds (may exceed those shown). */
  count?: number;
  /** Controls at the header's end (add, more). */
  actions?: ReactNode;
  /** A row under the cards, such as a "New page" button. */
  footer?: ReactNode;
}

/** One group of a Board: its header and a list of BoardCards. */
export const BoardColumn = /* @__PURE__ */ forwardRef<HTMLElement, BoardColumnProps>(function BoardColumn(
  { title, tone = "neutral", plainTitle = false, count, actions, footer, className, children, "aria-labelledby": labelledBy, ...rest },
  ref,
) {
  const id = useId();
  return (
    <section ref={ref} className={cx("area-board-column", `area-board-column--${tone}`, className)} aria-labelledby={labelledBy ?? `${id}-title`} {...rest}>
      <div className="area-board-column__header">
        {plainTitle ? <span id={`${id}-title`} className="area-board-column__title">{title}</span>
          : <Tag id={`${id}-title`} tone={tone}>{title}</Tag>}
        {count != null ? <Count count={count} showZero /> : null}
        {actions ? <div className="area-board-column__actions">{actions}</div> : null}
      </div>
      <ul className="area-board-column__cards">{children}</ul>
      {footer ? <div className="area-board-column__footer">{footer}</div> : null}
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
