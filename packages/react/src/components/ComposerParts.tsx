// The chat additions around the Composer: Attachment, ComposerMenu, Queue and Timestamp.
// Specs: docs/specs/{attachment,composer-menu,queue,timestamp}.md.
import { forwardRef, useId, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { attachmentVariants, composerMenuVariants, queueVariants, timestampVariants } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Spinner } from "./primitives.tsx";

// ---- Attachment ----

export interface AttachmentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The image's URL. */
  src: string;
  /** The file's name: names the tile, its remove control and its upload. */
  name: string;
  /** ready (default), uploading (a ring at `progress`), or error (it failed: a mark, a red edge). */
  status?: "ready" | "uploading" | "error";
  /** How far the upload has got, 0 to 100; leave out while it is unknown (the ring turns). */
  progress?: number;
  /** Why it failed, spoken and shown as the tile's tooltip. */
  error?: string;
  /** Shows the remove control. */
  onRemove?: () => void;
}

/** An image attached to a message before it is sent: its thumbnail, a remove control, and its upload. */
export const Attachment = forwardRef<HTMLDivElement, AttachmentProps>(function Attachment(
  { src, name, status = "ready", progress, error, onRemove, className, title, ...rest }, ref,
) {
  const failed = error ?? `${name} could not be uploaded`;
  return (
    <div ref={ref} role="group" aria-label={name} className={attachmentVariants({ status }, className)}
      title={status === "error" ? failed : title} aria-busy={status === "uploading" || undefined} {...rest}>
      <img className="area-attachment__image" src={src} alt="" />
      {status === "uploading" ? (
        <span className="area-attachment__overlay">
          <Spinner size="md" value={progress} label={progress === undefined ? `Uploading ${name}` : undefined}
            valueText={progress === undefined ? undefined : `Uploading ${name}, ${Math.round(progress)}%`} />
        </span>
      ) : status === "error" ? (
        <span className="area-attachment__overlay" role="img" aria-label={failed}><Glyph name="dismiss-circle" /></span>
      ) : null}
      {onRemove ? (
        <button type="button" className="area-attachment__remove" aria-label={`Remove ${name}`} onClick={onRemove}>
          <Glyph name="dismiss" size={12} />
        </button>
      ) : null}
    </div>
  );
});

// ---- Composer menu ----

export interface ComposerMenuItem {
  id: string;
  label: ReactNode;
  /** A 16 icon in the row's icon slot: the file's kind, the command's mark. */
  icon?: ReactNode;
  /** A file's folder, muted at the row's end and cut from its start. */
  path?: string;
}
export interface ComposerMenuGroup { label?: string; items: ComposerMenuItem[] }

export interface ComposerMenuProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Names the list ("Files and folders", "Commands"); the field points at it with aria-controls. */
  label: string;
  groups: ComposerMenuGroup[];
  /** The highlighted row, which the field names with aria-activedescendant (`${id}-${item.id}`). */
  activeId?: string;
  onPick: (item: ComposerMenuItem) => void;
  /** Rows the pointer moves over become the highlighted row. */
  onActiveChange?: (id: string) => void;
  /** Shown when nothing matches. */
  emptyLabel?: string;
}

/** The @ and / suggestions above the Composer. The field keeps focus; the arrows, Enter, Tab and Esc are the field's. */
export const ComposerMenu = forwardRef<HTMLDivElement, ComposerMenuProps>(function ComposerMenu(
  { label, groups, activeId, onPick, onActiveChange, emptyLabel = "No matches", id: idProp, className, ...rest }, ref,
) {
  const own = useId();
  const id = idProp ?? own;
  const empty = groups.every(group => group.items.length === 0);
  return (
    <div ref={ref} id={id} role="listbox" aria-label={label} className={composerMenuVariants({}, ["area-menu", className].filter(Boolean).join(" "))} {...rest}>
      {empty ? <p className="area-composer-menu__empty" role="presentation">{emptyLabel}</p> : null}
      {groups.filter(group => group.items.length).map((group, g) => {
        const rows = group.items.map(item => (
          <div key={item.id} id={`${id}-${item.id}`} role="option" aria-selected={item.id === activeId}
            className="area-menu__item" data-highlighted={item.id === activeId ? "" : undefined}
            onPointerDown={event => event.preventDefault()} onPointerMove={() => onActiveChange?.(item.id)} onClick={() => onPick(item)}>
            {item.icon ? <span className="area-menu__icon" aria-hidden="true">{item.icon}</span> : null}
            <span className="area-menu__text">{item.label}</span>
            {item.path ? <span className="area-composer-menu__path"><bdi>{item.path}</bdi></span> : null}
          </div>
        ));
        return group.label ? (
          <div key={group.label} role="group" aria-labelledby={`${id}-group-${g}`}>
            <div id={`${id}-group-${g}`} className="area-menu__label" role="presentation"><span className="area-menu__label-text">{group.label}</span></div>
            {rows}
          </div>
        ) : <div key={`group-${g}`} role="presentation">{rows}</div>;
      })}
    </div>
  );
});

// ---- Queue ----

export interface QueueItem {
  id: string;
  text: string;
  /** queued (default), sending (dimmed, a spinner), failed (a mark; Retry in place of Send now). */
  status?: "queued" | "sending" | "failed";
}

export interface QueueProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  items: QueueItem[];
  /** "2 queued" by default. */
  title?: ReactNode;
  onSendNow?: (id: string) => void;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Messages waiting their turn above the composer; each can be sent now (stopping the run, Cursor's Send Now) or removed. */
export const Queue = forwardRef<HTMLElement, QueueProps>(function Queue(
  { items, title, onSendNow, onRemove, onRetry, open: openProp, defaultOpen = true, onOpenChange, className, ...rest }, ref,
) {
  const listId = useId();
  const titleId = useId();
  const [own, setOwn] = useState(defaultOpen);
  const open = openProp ?? own;
  return (
    <section ref={ref} className={queueVariants({}, className)} data-open={open ? "" : undefined} aria-labelledby={titleId} {...rest}>
      <button type="button" className="area-queue__head" aria-expanded={open} aria-controls={listId}
        onClick={() => { const next = !open; if (openProp === undefined) setOwn(next); onOpenChange?.(next); }}>
        <span id={titleId} className="area-queue__title">{title ?? `${items.length} queued`}</span>
        <span className="area-queue__chevron" aria-hidden="true"><Glyph name="chevron-down" size={12} /></span>
      </button>
      <ul id={listId} className="area-queue__items" hidden={!open} aria-labelledby={titleId}>
        {items.map(item => {
          const status = item.status ?? "queued";
          return (
            <li key={item.id} className={["area-queue__item", status !== "queued" ? `area-queue__item--${status}` : ""].filter(Boolean).join(" ")}>
              {status === "sending" ? <span className="area-queue__status"><Spinner size="sm" label="Sending" /></span>
                : status === "failed" ? <span className="area-queue__status" role="img" aria-label="Not sent"><Glyph name="dismiss-circle" /></span> : null}
              <span className="area-queue__text">{item.text}</span>
              {status === "sending" ? null : (
                <span className="area-queue__actions">
                  {status === "failed"
                    ? (onRetry ? <Button variant="ghost" tone="neutral" size="sm" onClick={() => onRetry(item.id)}>Retry</Button> : null)
                    : (onSendNow ? <Button variant="ghost" tone="neutral" size="sm" title="Stops the run and sends this now" onClick={() => onSendNow(item.id)}>Send now</Button> : null)}
                  {onRemove ? <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<Glyph name="dismiss" />} aria-label={`Remove “${item.text}”`} onClick={() => onRemove(item.id)} /> : null}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
});

// ---- Timestamp ----

export interface TimestampProps extends Omit<HTMLAttributes<HTMLParagraphElement>, "children"> {
  /** The moment, for the machine-readable `time` (an ISO string or a Date). */
  dateTime: string | Date;
  /** As read: "Today 2:30 PM", "Tue, Oct 14 9:05 AM". Use `formatTimestamp` for Codex's rules. */
  children: ReactNode;
}

/** When a turn was sent, centred between turns after a pause (Codex). */
export const Timestamp = forwardRef<HTMLParagraphElement, TimestampProps>(function Timestamp({ dateTime, children, className, ...rest }, ref) {
  const iso = typeof dateTime === "string" ? dateTime : dateTime.toISOString();
  return <p ref={ref} className={timestampVariants({}, className)} {...rest}><time dateTime={iso}>{children}</time></p>;
});

/**
 * Codex's wording: "Today" / "Yesterday", the weekday within a week, "Tue, Oct 14" within a year, else "Oct 14, 2025";
 * then the time.
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

/** Codex shows a timestamp before a person's turn that comes over an hour after the last one (10 minutes for a reply). */
export const TIMESTAMP_GAP = { user: 3_600_000, assistant: 600_000 } as const;
