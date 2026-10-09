// FileUpload: a drop zone that takes files by click or drag and drop; FileUploadList and FileUploadItem show
// each file's upload. Spec: docs/specs/file-upload.md.
import { forwardRef, useId, useRef, useState } from "react";
import type { DragEvent, HTMLAttributes, LiHTMLAttributes, ReactNode } from "react";
import { fileUploadItemVariants, fileUploadListVariants, fileUploadVariants, linkVariants, type VariantProps, MANIFESTS } from "../variants.ts";
import { Button } from "./Button.tsx";
import { Glyph } from "./Glyph.tsx";
import { Progress } from "./primitives.tsx";

export interface FileRejection { file: File; reason: "type" | "size" | "count" }

export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, "onDrop"> {
  /** Called with the files that pass `accept`, `maxSize` and `multiple`. */
  onFiles?: (files: File[]) => void;
  /** Called with the files that did not, and why. */
  onReject?: (rejections: FileRejection[]) => void;
  /** As the file input's `accept`: extensions (".pdf") and MIME types ("image/*"). */
  accept?: string;
  multiple?: boolean;
  /** The largest file accepted, in bytes. */
  maxSize?: number;
  /** The line under the prompt, such as the types and size allowed. */
  hint?: ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  /** The input's name, so a form submits the chosen files. */
  name?: string;
  labels?: { action?: string; drag?: string };
}

/** Whether a file matches an `accept` list, as the browser's picker filters it. */
export function fileMatchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const type = file.type.toLowerCase(), fileName = file.name.toLowerCase();
  return accept.split(",").map(part => part.trim().toLowerCase()).filter(Boolean).some(rule =>
    rule.startsWith(".") ? fileName.endsWith(rule) : rule.endsWith("/*") ? type.startsWith(rule.slice(0, -1)) : type === rule);
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload(
  { onFiles, onReject, accept, multiple, maxSize, hint, disabled, invalid, name, labels, className, onClick, ...rest },
  ref,
) {
  const input = useRef<HTMLInputElement>(null);
  const hintId = useId();
  const [dragging, setDragging] = useState(false);
  // dragenter and dragleave fire for every child the pointer crosses; count them to know when files leave.
  const depth = useRef(0);

  const take = (list: FileList | null) => {
    if (!list?.length) return;
    const accepted: File[] = [], rejected: FileRejection[] = [];
    for (const file of Array.from(list)) {
      if (!fileMatchesAccept(file, accept)) rejected.push({ file, reason: "type" });
      else if (maxSize != null && file.size > maxSize) rejected.push({ file, reason: "size" });
      else if (!multiple && accepted.length) rejected.push({ file, reason: "count" });
      else accepted.push(file);
    }
    if (accepted.length) onFiles?.(accepted);
    if (rejected.length) onReject?.(rejected);
  };
  const browse = () => { if (!disabled) input.current?.click(); };
  const drag = (event: DragEvent<HTMLDivElement>) => {
    if (disabled || !event.dataTransfer.types.includes("Files")) return;
    event.preventDefault();
    if (event.type === "dragenter") { depth.current += 1; setDragging(true); }
    if (event.type === "dragleave" && --depth.current <= 0) { depth.current = 0; setDragging(false); }
    if (event.type === "drop") { depth.current = 0; setDragging(false); take(event.dataTransfer.files); }
  };

  return (
    <div ref={ref} className={fileUploadVariants({}, className)}
      data-dragging={dragging ? "" : undefined} data-invalid={invalid ? "" : undefined} data-disabled={disabled ? "" : undefined} {...rest}
      // The whole zone opens the picker; the button inside is its keyboard and assistive-tech handle.
      onClick={event => { onClick?.(event); if (!event.defaultPrevented && !(event.target as HTMLElement).closest("button, input")) browse(); }}
      onDragEnter={drag} onDragOver={drag} onDragLeave={drag} onDrop={drag}>
      <span className={fileUploadVariants.element("icon")} aria-hidden="true"><Glyph name="upload" size={20} /></span>
      <div className={fileUploadVariants.element("text")}>
        <p className={fileUploadVariants.element("prompt")}>
          <button type="button" className={linkVariants({ ink: "action" }, fileUploadVariants.element("action"))} disabled={disabled}
            aria-describedby={hint ? hintId : undefined} aria-invalid={invalid || undefined} onClick={browse}>{labels?.action ?? "Click to upload"}</button>
          {` ${labels?.drag ?? "or drag and drop"}`}
        </p>
        {hint ? <p id={hintId} className={fileUploadVariants.element("hint")}>{hint}</p> : null}
      </div>
      <input ref={input} type="file" className={fileUploadVariants.element("input")} tabIndex={-1} aria-hidden="true"
        accept={accept} multiple={multiple} name={name} disabled={disabled}
        onChange={event => { take(event.currentTarget.files); if (!name) event.currentTarget.value = ""; }} />
    </div>
  );
});

export const FileUploadList = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(function FileUploadList({ className, ...rest }, ref) {
  return <ul ref={ref} className={fileUploadListVariants({}, className)} {...rest} />;
});

/** Bytes as people read them: 720 KB, 1.2 MB. */
export function formatFileSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes, unit = 0;
  while (value >= 1000 && unit < units.length - 1) { value /= 1000; unit += 1; }
  return `${unit === 0 || value >= 10 ? Math.round(value) : Math.round(value * 10) / 10} ${units[unit]}`;
}

export interface FileUploadItemProps extends Omit<LiHTMLAttributes<HTMLLIElement>, "name"> {
  name: ReactNode;
  /** In bytes. */
  size?: number;
  status?: VariantProps<typeof MANIFESTS.fileUploadItem>["status"];
  /** 0 to 100 while uploading. Omit for an upload of unknown length. */
  progress?: number;
  /** What went wrong, shown in place of the status. */
  error?: ReactNode;
  icon?: ReactNode;
  onRemove?: () => void;
  onRetry?: () => void;
  labels?: { uploading?: string; complete?: string; remove?: string; cancel?: string; retry?: string };
}

export const FileUploadItem = forwardRef<HTMLLIElement, FileUploadItemProps>(function FileUploadItem(
  { name, size, status = "uploading", progress, error, icon, onRemove, onRetry, labels, className, ...rest },
  ref,
) {
  const label = typeof name === "string" ? name : "file";
  const statusText = status === "error" ? error ?? "Upload failed" : status === "complete" ? labels?.complete ?? "Complete" : labels?.uploading ?? "Uploading…";
  return (
    <li ref={ref} className={fileUploadItemVariants({ status }, className)} {...rest}>
      <span className={fileUploadItemVariants.element("icon")} aria-hidden="true">{icon ?? <Glyph name="document" size={20} />}</span>
      <div className={fileUploadItemVariants.element("body")}>
        <div className={fileUploadItemVariants.element("header")}>
          <div className={fileUploadItemVariants.element("text")}>
            <p className={fileUploadItemVariants.element("name")}>{name}</p>
            <p className={fileUploadItemVariants.element("meta")}>
              {size != null ? <><span>{formatFileSize(size)}</span><span className={fileUploadItemVariants.element("separator")} aria-hidden="true" /></> : null}
              {/* Announced as it changes: uploading, complete or the error. */}
              <span className={fileUploadItemVariants.element("status")} role="status">
                {status === "complete" ? <Glyph name="check" /> : null}{statusText}
              </span>
            </p>
          </div>
          <div className={fileUploadItemVariants.element("actions")}>
            {status === "error" && onRetry ? <Button variant="ghost" size="sm" iconOnly icon={<Glyph name="reset" />} onClick={onRetry}>{`${labels?.retry ?? "Retry"} ${label}`}</Button> : null}
            {onRemove ? <Button variant="ghost" size="sm" iconOnly icon={<Glyph name="dismiss" />} onClick={onRemove}>
              {`${status === "uploading" ? labels?.cancel ?? "Cancel upload of" : labels?.remove ?? "Remove"} ${label}`}
            </Button> : null}
          </div>
        </div>
        {status === "uploading" ? (
          <div className={fileUploadItemVariants.element("progress")}>
            <Progress size="lg" value={progress} label={`Uploading ${label}`} />
            {progress != null ? <span className={fileUploadItemVariants.element("percent")} aria-hidden="true">{Math.round(progress)}%</span> : null}
          </div>
        ) : null}
      </div>
    </li>
  );
});

