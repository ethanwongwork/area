/** File upload gallery specimens: one variant per tile. docs/specs/file-upload.md. */
import { useEffect, useRef, useState } from "react";
import { FileUpload, FileUploadItem, FileUploadList } from "@area/react";
import { FileAudioIcon, FileCodeIcon, FileImageIcon, FilePdfIcon, FileSpreadsheetIcon, FileVideoIcon, FileZipIcon } from "@area/icons";

const width = { inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" };
const hint = "PDF, PNG or JPG, up to 10 MB";

/* A file's type icon, from its name (and MIME type when the browser gives one); other files keep the item's
   default document glyph. The item's slot draws it at 20. */
const typeIcon = (name: string, type = "") => {
  const ext = name.slice(name.lastIndexOf(".") + 1).toLowerCase();
  const Icon = ext === "pdf" || type === "application/pdf" ? FilePdfIcon
    : type.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg", "heic"].includes(ext) ? FileImageIcon
    : type.startsWith("video/") || ["mp4", "mov", "webm"].includes(ext) ? FileVideoIcon
    : type.startsWith("audio/") || ["mp3", "wav", "m4a"].includes(ext) ? FileAudioIcon
    : ["csv", "xls", "xlsx", "numbers"].includes(ext) ? FileSpreadsheetIcon
    : ["zip", "gz", "tar", "rar", "7z"].includes(ext) ? FileZipIcon
    : ["js", "ts", "tsx", "jsx", "json", "css", "html", "py", "md"].includes(ext) ? FileCodeIcon
    : undefined;
  return Icon ? <Icon size={20} /> : undefined;
};

export const GalleryFileUpload = () => <FileUpload style={width} accept=".pdf,.png,.jpg,image/png,image/jpeg,application/pdf" maxSize={10_000_000} multiple hint={hint} />;
/* Files held over the zone. */
export const GalleryFileUploadDragging = () => <FileUpload style={width} hint={hint} data-dragging="" />;
export const GalleryFileUploadInvalid = () => <FileUpload style={width} invalid hint="Error message" />;
export const GalleryFileUploadDisabled = () => <FileUpload style={width} disabled hint={hint} />;
export const GalleryFileUploadItemUploading = () => <FileUploadList style={width}><FileUploadItem name="Document.pdf" icon={typeIcon("Document.pdf")} size={2_400_000} status="uploading" progress={40} onRemove={() => {}} /></FileUploadList>;
export const GalleryFileUploadItemComplete = () => <FileUploadList style={width}><FileUploadItem name="Image.png" icon={typeIcon("Image.png")} size={720_000} status="complete" onRemove={() => {}} /></FileUploadList>;
export const GalleryFileUploadItemError = () => <FileUploadList style={width}><FileUploadItem name="File.pdf" icon={typeIcon("File.pdf")} size={14_200_000} status="error" error="Error message" onRetry={() => {}} onRemove={() => {}} /></FileUploadList>;

/* The whole flow: choose or drop files, and each one uploads (simulated) into the list below. */
type Upload = { id: number; file: File; progress: number; status: "uploading" | "complete" | "error"; error?: string };
export const GalleryFileUploadFlow = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const next = useRef(0);
  useEffect(() => {
    if (!uploads.some(upload => upload.status === "uploading")) return;
    const timer = setInterval(() => setUploads(list => list.map(upload => upload.status !== "uploading" ? upload
      : upload.progress >= 100 ? { ...upload, status: "complete" } : { ...upload, progress: Math.min(100, upload.progress + 20) })), 400);
    return () => clearInterval(timer);
  }, [uploads]);
  const add = (files: File[]) => setUploads(list => [...list, ...files.map(file => ({ id: next.current++, file, progress: 0, status: "uploading" as const }))]);
  return (
    <div style={{ ...width, display: "grid", gap: "var(--area-space-12)" }}>
      <FileUpload multiple maxSize={10_000_000} hint={hint} onFiles={add}
        onReject={rejected => setUploads(list => [...list, ...rejected.map(({ file, reason }) => ({ id: next.current++, file, progress: 0, status: "error" as const, error: reason === "size" ? "Over 10 MB" : "Not a supported type" }))])} />
      {uploads.length ? <FileUploadList>
        {uploads.map(upload => <FileUploadItem key={upload.id} name={upload.file.name} icon={typeIcon(upload.file.name, upload.file.type)} size={upload.file.size} status={upload.status} progress={upload.progress} error={upload.error}
          onRetry={() => setUploads(list => list.map(item => item.id === upload.id ? { ...item, status: "uploading", progress: 0, error: undefined } : item))}
          onRemove={() => setUploads(list => list.filter(item => item.id !== upload.id))} />)}
      </FileUploadList> : null}
    </div>
  );
};
