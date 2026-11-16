// Attachment, one of the chat additions around the Composer. Spec: docs/specs/attachment.md.
import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { attachmentVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { useAnnouncement } from "./announce.ts";
import { Badge } from "./Badge.tsx";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Spinner } from "./Spinner.tsx";
// ---- Attachment ----

export type AttachmentStatus = Exclude<NonNullable<VariantProps<typeof MANIFESTS.attachment>["status"]>, "ready">;

export interface AttachmentProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** What is attached: an image (default), a file, a quote (pasted or quoted text) or a video. */
  kind?: VariantProps<typeof MANIFESTS.attachment>["kind"];
  /** The image's URL; a video's poster. A video without one shows its ground and the play mark. */
  src?: string;
  /** The file's name: names the tile, its remove control, its retry and its upload. */
  name: string;
  /**
   * `complete` (default), `uploading` (a ring at `progress`), or `error` (a mark, a red edge, and Retry when
   * `onRetry` is passed). `ready` is a deprecated alias of `complete`.
   */
  status?: AttachmentStatus | /** @deprecated use "complete" */ "ready";
  /** How far the upload has got, 0 to 100; leave out while it is unknown (the ring turns). */
  progress?: number;
  /**
   * Why it failed, spoken and shown as the tile's tooltip.
   * @default "<name> could not be uploaded"
   */
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
  /** @deprecated Use `onDismiss`, which wins. Kept for one release. */
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

