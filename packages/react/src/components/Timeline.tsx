// Timeline and TimelineItem: events in order along one line, each with a marker (Figma's version
// history, Notion's page updates). An ordered list of list items. Spec: docs/specs/timeline.md.
import { forwardRef } from "react";
import type { HTMLAttributes, OlHTMLAttributes, ReactNode } from "react";
import { timelineVariants, timelineItemVariants } from "../variants.ts";

export type TimelineProps = OlHTMLAttributes<HTMLOListElement>;

export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline({ className, ...rest }, ref) {
  // role="list" keeps list semantics where list-style: none drops them (Safari, VoiceOver).
  return <ol ref={ref} role="list" className={timelineVariants({}, className)} {...rest} />;
});

export interface TimelineItemProps extends Omit<HTMLAttributes<HTMLLIElement>, "title"> {
  /** What happened: "Published", "David Tee edited Launch plan". */
  title?: ReactNode;
  /** When it happened, last on the event's line. */
  time?: ReactNode;
  /** A machine-readable date for `time` (ISO 8601); renders it as a `<time>`. */
  dateTime?: string;
  /** More about the event: who, where. After the title, before the time, joined with dots. */
  meta?: ReactNode;
  /** A 16px icon as the mark, with no plate behind it (decorative). */
  icon?: ReactNode;
  /** An element that fills the marker instead, such as an Avatar. */
  media?: ReactNode;
  /** The current or latest event: its mark paints the Selection role, and the item is `aria-current`. */
  current?: boolean;
  /** Details under the time: text, a quote, a card. */
  children?: ReactNode;
}

export const TimelineItem = forwardRef<HTMLLIElement, TimelineItemProps>(function TimelineItem(
  { title, time, dateTime, meta, icon, media, current, children, className, ...rest },
  ref,
) {
  const el = timelineItemVariants.element;
  const marker = media ? <span className={el("media")}>{media}</span>
    : icon ? <span className={el("icon")}>{icon}</span>
    : <span className={el("dot")} />;
  const when = time == null ? null : dateTime ? <time dateTime={dateTime}>{time}</time> : time;
  // One line: the title, then who or where and when, each after a dot, all at one size; the time comes last.
  const after = [meta, when].filter(part => part != null && part !== false);
  const sep = <span className={el("sep")} aria-hidden="true">·</span>;
  return (
    <li ref={ref} aria-current={current ? "true" : undefined} className={timelineItemVariants({ current }, className)} {...rest}>
      <span className={el("marker")} aria-hidden={media ? undefined : true}>{marker}</span>
      <div className={el("content")}>
        {title != null || after.length ? (
          <div className={el("line")}>
            {title != null ? <span className={el("title")}>{title}</span> : null}
            {after.map((part, index) => (
              <span key={index} className={el("meta")}>{title != null || index > 0 ? sep : null}{part}</span>
            ))}
          </div>
        ) : null}
        {children != null ? <div className={el("body")}>{children}</div> : null}
      </div>
    </li>
  );
});

export { timelineVariants, timelineItemVariants };
