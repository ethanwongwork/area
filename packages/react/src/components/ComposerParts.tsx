// The chat additions around the Composer: Attachment, ComposerMenu, Queue and Timestamp.
// Specs: docs/specs/{attachment,composer-menu,queue,timestamp}.md.
import { forwardRef, useId, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { attachmentVariants, composerMenuVariants, queueVariants, timestampVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { useAnnouncement } from "./announce.ts";
import { Badge } from "./Badge.tsx";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Spinner } from "./primitives.tsx";

// ---- Attachment ----

export type AttachmentStatus = "complete" | "uploading" | "error";

export interface AttachmentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** What is attached: an image (default), a file, a quote (pasted or quoted text) or a video. */
  kind?: VariantProps<typeof MANIFESTS.attachment>["kind"];
  /** The image's URL; a video's poster. A video without one shows its ground and the play mark. */
  src?: string;
  /** The file's name: names the tile, its remove control, its retry and its upload. */
  name: string;
  /** complete (default), uploading (a ring at `progress`), or error (it failed: a mark, a red edge, and Retry when
   *  `onRetry` is passed). The shared status words (Governance § 4); `ready` is a deprecated alias of `complete`. */
  status?: AttachmentStatus | /** @deprecated use "complete" */ "ready";
  /** How far the upload has got, 0 to 100; leave out while it is unknown (the ring turns). */
  progress?: number;
  /** Why it failed, spoken and shown as the tile's tooltip. */
  error?: string;
  /** Shows Retry on a failed tile; called when it is pressed. */
  onRetry?: () => void;
  /** A short mark on the tile: a file's type (its extension, upper case, by default; `null` for none), a video's
   *  length ("0:42"), a quote's source ("Pasted"). */
  badge?: ReactNode;
  /** A file's icon beside its name (an `@area/icons` file icon at 16); a document by default. */
  icon?: ReactNode;
  /** A quote's words, cut to 240 characters and to the tile's lines. */
  text?: string;
  /** Shows the remove control; called when it is pressed. */
  onDismiss?: () => void;
  /** Names the remove control; "Remove {name}" by default. */
  dismissLabel?: string;
  /** @deprecated Use `onDismiss` (a close is `onDismiss` / `dismissLabel`, Governance § 4). Kept for one release;
   *  `onDismiss` wins. */
  onRemove?: () => void;
}

/* spec: a quote's words are cut to 240 characters (docs/research/components-audit-2026-11-07/chat-apps.md, Attachment). */
const QUOTE_LIMIT = 240;
const extension = (name: string) => { const dot = name.lastIndexOf("."); return dot > 0 && dot < name.length - 1 ? name.slice(dot + 1).toUpperCase() : undefined; };

/** Something attached to a message before it is sent: an image, a file, a quote or a video, with a remove control and
 *  its upload's progress or failure. */
export const Attachment = forwardRef<HTMLDivElement, AttachmentProps>(function Attachment(
  { kind = "image", src, name, status: statusProp, progress, error, onRetry, badge: badgeProp, icon, text, onDismiss: onDismissProp, dismissLabel, onRemove, className, title, ...rest }, ref,
) {
  const onDismiss = onDismissProp ?? onRemove;
  const status: AttachmentStatus = statusProp === "ready" || statusProp === undefined ? "complete" : statusProp;
  const failed = error ?? `${name} could not be uploaded`;
  // The upload's end is said with the file's name (DESIGN_SYSTEM.md, Announcements): "Item one: Complete".
  useAnnouncement(status === "uploading" ? null : `${name}: ${status === "error" ? error ?? "Upload failed" : "Complete"}`);
  const badge = badgeProp === undefined ? (kind === "file" ? extension(name) : undefined) : badgeProp;
  const quote = text && text.length > QUOTE_LIMIT ? `${text.slice(0, QUOTE_LIMIT).trimEnd()}…` : text;
  const tip = status === "error" ? failed : title ?? (kind === "file" ? name : kind === "quote" ? text : undefined);
  const mark = badge != null && badge !== false && badge !== "" ? badge : null;
  return (
    <div ref={ref} role="group" aria-label={name} className={attachmentVariants({ kind, status }, className)}
      title={tip} aria-busy={status === "uploading" || undefined} {...rest}>
      {(kind === "image" || kind === "video") && src ? <img className="area-attachment__image" src={src} alt="" /> : null}
      {kind === "video" ? <span className="area-attachment__play" aria-hidden="true"><Glyph name="play-filled" size={12} /></span> : null}
      {kind === "file" ? (
        <span className="area-attachment__body">
          <span className="area-attachment__head">
            <span className="area-attachment__icon" aria-hidden="true">{icon ?? <Glyph name="document" />}</span>
            <span className="area-attachment__name" aria-hidden="true">{name}</span>
          </span>
          {mark !== null ? <Badge size="sm" className="area-attachment__badge">{mark}</Badge> : null}
        </span>
      ) : kind === "quote" ? (
        <span className="area-attachment__body">
          <blockquote className="area-attachment__quote"><span className="area-attachment__text">{quote}</span></blockquote>
          {mark !== null ? <Badge size="sm" className="area-attachment__badge">{mark}</Badge> : null}
        </span>
      ) : kind === "video" && mark !== null ? <span className="area-attachment__badge">{mark}</span> : null}
      {status === "uploading" ? (
        <span className="area-attachment__overlay">
          <Spinner size="md" value={progress} label={`Uploading ${name}`}
            valueText={progress === undefined ? undefined : `Uploading ${name}, ${Math.round(progress)}%`} />
        </span>
      ) : status === "error" ? (
        <span className="area-attachment__overlay">
          <span className="area-attachment__mark" role="img" aria-label={failed}><Glyph name="dismiss-circle" /></span>
          {onRetry ? <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<Glyph name="reset" />} onClick={onRetry}>{`Retry ${name}`}</Button> : null}
        </span>
      ) : null}
      {onDismiss ? (
        <button type="button" className="area-attachment__dismiss" aria-label={dismissLabel ?? `Remove ${name}`} onClick={onDismiss}>
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

interface ComposerMenuBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "aria-label"> {
  /** The highlighted row, which the field names with aria-activedescendant (`${id}-${item.id}`). */
  activeId?: string;
  onPick: (item: ComposerMenuItem) => void;
  /** Rows the pointer moves over become the highlighted row. */
  onActiveChange?: (id: string) => void;
  /** Shown when nothing matches. */
  emptyLabel?: string;
}

type ComposerMenuName =
  | {
    /** Names the list ("Files and folders", "Commands"); the field points at it with aria-controls. */
    "aria-label": string;
    label?: undefined;
  }
  | {
    "aria-label"?: string;
    /** @deprecated Use `aria-label` (it only names the element, DESIGN_SYSTEM.md "Names and collections"). Kept for
     *  one release; `aria-label` wins. */
    label: string;
  };

type ComposerMenuCollection =
  | {
    /** The rows, in groups; a group's `label` is its visible heading. */
    items: ComposerMenuGroup[];
    groups?: undefined;
  }
  | {
    items?: undefined;
    /** @deprecated Use `items` (a collection is `items`, Governance § 4). Kept for one release. */
    groups: ComposerMenuGroup[];
  };

export type ComposerMenuProps = ComposerMenuBaseProps & ComposerMenuName & ComposerMenuCollection;

/** The @ and / suggestions above the Composer. The field keeps focus; the arrows, Enter, Tab and Esc are the field's. */
export const ComposerMenu = forwardRef<HTMLDivElement, ComposerMenuProps>(function ComposerMenu(
  { "aria-label": ariaLabel, label, items, groups: groupsProp, activeId, onPick, onActiveChange, emptyLabel = "No matches", id: idProp, className, ...rest }, ref,
) {
  const groups = items ?? groupsProp ?? [];
  const own = useId();
  const id = idProp ?? own;
  const empty = groups.every(group => group.items.length === 0);
  return (
    <div ref={ref} id={id} role="listbox" aria-label={ariaLabel ?? label} className={composerMenuVariants({}, ["area-menu", className].filter(Boolean).join(" "))} {...rest}>
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
  /** queued (default), sending (dimmed, a spinner), error (a mark; Retry in place of Send now). queued and sending are
   * the Queue's own words; error is every family's (Governance § 4, 2026-11-07). `failed` is a deprecated alias. */
  status?: "queued" | "sending" | "error" | /** @deprecated use "error" */ "failed";
}

export interface QueueProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  items: QueueItem[];
  /** "2 queued" by default. */
  title?: ReactNode;
  onSendNow?: (id: string) => void;
  /** Removes a message from the queue: shows each row's remove control. */
  onDismiss?: (id: string) => void;
  /** @deprecated Use `onDismiss` (a close is `onDismiss` / `dismissLabel`, Governance § 4). Kept for one release;
   *  `onDismiss` wins. */
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Messages waiting their turn above the composer; each can be sent now (stopping the run, Cursor's Send Now) or removed. */
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

/**
 * A timestamp goes before a person's message that comes over an hour after the conversation's last turn, either
 * person's or agent's (Codex's pause rule). Replies never get one: a reply follows the message it answers
 * (owner, 2026-10-19). Milliseconds.
 */
export const TIMESTAMP_GAP = 3_600_000;
