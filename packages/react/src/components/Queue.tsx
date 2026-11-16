// Queue, one of the chat additions around the Composer. Spec: docs/specs/queue.md.
import { forwardRef, useId, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { queueVariants } from "../variants.ts";
import { useAnnouncement } from "./announce.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Spinner } from "./Spinner.tsx";
// ---- Queue ----

export interface QueueItem {
  id: string;
  text: string;
  /** queued (default), sending (dimmed, a spinner), error (a mark; Retry in place of Send now). queued and sending are
   * the Queue's own words; error is every family's (Governance § 4, 2026-11-07). `failed` is a deprecated alias. */
  status?: "queued" | "sending" | "error" | /** @deprecated use "error" */ "failed";
}

export interface QueueProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** The waiting messages, in the order they will be sent. */
  items: QueueItem[];
  /** "2 queued" by default. */
  title?: ReactNode;
  /** Shows each row's Send now control, which stops the run and sends that message; called with its id. */
  onSendNow?: (id: string) => void;
  /** Removes a message from the queue: shows each row's remove control. */
  onDismiss?: (id: string) => void;
  /** @deprecated Use `onDismiss`, which wins. Kept for one release. */
  onRemove?: (id: string) => void;
  /** Shows Retry on a message that failed to send; called with its id. */
  onRetry?: (id: string) => void;
  /** Whether the list is shown under the head, controlled. */
  open?: boolean;
  /** Whether the list starts shown, uncontrolled; shown by default. */
  defaultOpen?: boolean;
  /** Called when the head folds or unfolds the list. */
  onOpenChange?: (open: boolean) => void;
}

/** Messages waiting their turn above the composer; each can be sent now (stopping the run) or removed. */
export const Queue = forwardRef<HTMLElement, QueueProps>(function Queue(
  { items, title, onSendNow, onDismiss: onDismissProp, onRemove, onRetry, open: openProp, defaultOpen = true, onOpenChange, className, ...rest }, ref,
) {
  const onDismiss = onDismissProp ?? onRemove;
  const listId = useId();
  const titleId = useId();
  const [own, setOwn] = useState(defaultOpen);
  const open = openProp ?? own;
  // A message that could not be sent is said with its words, as Message and Attachment say theirs (components audit O6).
  const unsent = items.filter(item => item.status === "error" || item.status === "failed").map(item => `“${item.text}”`);
  useAnnouncement(unsent.length ? `${unsent.join(", ")}: Not sent` : null);
  return (
    <section ref={ref} className={queueVariants({}, className)} data-open={open ? "" : undefined} aria-labelledby={titleId} {...rest}>
      <button type="button" className="area-queue__head" aria-expanded={open} aria-controls={listId}
        onClick={() => { const next = !open; if (openProp === undefined) setOwn(next); onOpenChange?.(next); }}>
        <span id={titleId} className="area-queue__title">{title ?? `${items.length} queued`}</span>
        <span className="area-queue__chevron" aria-hidden="true"><Glyph name="chevron-down" size={12} /></span>
      </button>
      <ol id={listId} className="area-queue__items" hidden={!open} aria-labelledby={titleId}>
        {items.map(item => {
          const status = item.status === "failed" ? "error" : item.status ?? "queued";
          return (
            <li key={item.id} className={["area-queue__item", status !== "queued" ? `area-queue__item--${status}` : ""].filter(Boolean).join(" ")}>
              {status === "sending" ? <span className="area-queue__status"><Spinner size="sm" label="Sending" /></span>
                : status === "error" ? <span className="area-queue__status" role="img" aria-label="Not sent"><Glyph name="dismiss-circle" /></span> : null}
              <span className="area-queue__text">{item.text}</span>
              {status === "sending" ? null : (
                <span className="area-queue__actions">
                  {status === "error"
                    ? (onRetry ? <Button variant="ghost" tone="neutral" size="sm" onClick={() => onRetry(item.id)}>Retry</Button> : null)
                    : (onSendNow ? <Button variant="ghost" tone="neutral" size="sm" title="Stops the run and sends this now" onClick={() => onSendNow(item.id)}>Send now</Button> : null)}
                  {onDismiss ? <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<Glyph name="dismiss" />} aria-label={`Remove “${item.text}”`} onClick={() => onDismiss(item.id)} /> : null}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
});

