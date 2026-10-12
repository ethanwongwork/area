/** File upload gallery specimens: one variant per tile. docs/specs/file-upload.md. */
import { useEffect, useRef, useState } from "react";
import { FileUpload, FileUploadItem, FileUploadList } from "@area/react";

const width = { inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" };
const hint = "PDF, PNG or JPG, up to 10 MB";

export const GalleryFileUpload = () => <FileUpload style={width} accept=".pdf,.png,.jpg,image/png,image/jpeg,application/pdf" maxSize={10_000_000} multiple hint={hint} />;
/* Files held over the zone. */
export const GalleryFileUploadDragging = () => <FileUpload style={width} hint={hint} data-dragging="" />;
export const GalleryFileUploadInvalid = () => <FileUpload style={width} invalid hint="That file is over 10 MB. Choose a smaller one." />;
export const GalleryFileUploadDisabled = () => <FileUpload style={width} disabled hint={hint} />;
export const GalleryFileUploadItemUploading = () => <FileUploadList style={width}><FileUploadItem name="Brand guidelines.pdf" size={2_400_000} status="uploading" progress={40} onRemove={() => {}} /></FileUploadList>;
export const GalleryFileUploadItemComplete = () => <FileUploadList style={width}><FileUploadItem name="Hero image.png" size={720_000} status="complete" onRemove={() => {}} /></FileUploadList>;
export const GalleryFileUploadItemError = () => <FileUploadList style={width}><FileUploadItem name="Quarterly report.pdf" size={14_200_000} status="error" error="Over 10 MB" onRetry={() => {}} onRemove={() => {}} /></FileUploadList>;

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
        {uploads.map(upload => <FileUploadItem key={upload.id} name={upload.file.name} size={upload.file.size} status={upload.status} progress={upload.progress} error={upload.error}
          onRetry={() => setUploads(list => list.map(item => item.id === upload.id ? { ...item, status: "uploading", progress: 0, error: undefined } : item))}
          onRemove={() => setUploads(list => list.filter(item => item.id !== upload.id))} />)}
      </FileUploadList> : null}
    </div>
  );
};
