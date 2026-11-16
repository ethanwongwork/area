// Timestamp, one of the chat additions around the Composer. Spec: docs/specs/timestamp.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { timestampVariants } from "../variants.ts";
// ---- Timestamp ----

export interface TimestampProps extends Omit<HTMLAttributes<HTMLParagraphElement>, "children"> {
  /** The moment, for the machine-readable `time` (an ISO string or a Date). */
  dateTime: string | Date;
  /** The time as read: "Today 2:30 PM", "Tue, Oct 14 9:05 AM". `formatTimestamp` writes it. */
  children: ReactNode;
}

/** When a turn was sent, centered between turns after a pause. */
export const Timestamp = forwardRef<HTMLParagraphElement, TimestampProps>(function Timestamp({ dateTime, children, className, ...rest }, ref) {
  const iso = typeof dateTime === "string" ? dateTime : dateTime.toISOString();
  return <p ref={ref} className={timestampVariants({}, className)} {...rest}><time dateTime={iso}>{children}</time></p>;
});

/**
 * A Timestamp's words: "Today" / "Yesterday", the weekday within a week, "Tue, Oct 14" within a year, else
 * "Oct 14, 2025"; then the time.
 */
export function formatTimestamp(date: Date, now: Date = new Date(), locale?: string): string {
  const day = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((day(now) - day(date)) / 86_400_000);
  const time = date.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
  const when = days === 0 ? "Today" : days === 1 ? "Yesterday"
    : days <= 7 ? date.toLocaleDateString(locale, { weekday: "long" })
    : days <= 365 ? date.toLocaleDateString(locale, { weekday: "short", month: "short", day: "numeric" })
    : date.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" });
  return `${when} ${time}`;
}

/**
 * A timestamp goes before a person's message that comes over an hour after the conversation's last turn, either
 * person's or agent's. Replies never get one: a reply follows the message it answers. Milliseconds.
 */
export const TIMESTAMP_GAP = 3_600_000;
