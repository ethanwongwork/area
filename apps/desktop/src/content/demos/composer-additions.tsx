/**
 * The chat additions around the Composer (docs/research/inspector-chat-2026-10-18, "Chat additions"): the context row,
 * Attachment, Composer menu, Queue and Timestamp. One variant per tile, at the Inspector's narrow column (280), in the
 * system's placeholder copy. Specs: docs/specs/{attachment,composer-menu,queue,timestamp}.md.
 */
import { useState } from "react";
import { Attachment, Chip, Composer, ComposerMenu, Queue, Timestamp, type ComposerMenuGroup, type QueueItem } from "@area/react";
import { CommandIcon, DocumentIcon, FolderIcon } from "@area/icons";

const frame = { inlineSize: 280 };
const image = "images/chip-pixels.png";

// ---- Composer context row ----
export const GalleryComposerContext = () => (
  <div style={frame}>
    <Composer layout="stacked" placeholder="Placeholder"
      context={<><Chip kind="input" size="sm" icon={<DocumentIcon />} onDismiss={() => {}}>Item one</Chip><Chip kind="input" size="sm" onDismiss={() => {}}>Item two</Chip></>} />
  </div>
);
export const GalleryComposerAttachments = () => {
  const [items, setItems] = useState(["Item one", "Item two"]);
  return (
    <div style={frame}>
      <Composer layout="stacked" placeholder="Placeholder"
        context={items.length ? items.map(name => <Attachment key={name} src={image} name={name} onDismiss={() => setItems(list => list.filter(item => item !== name))} />) : undefined} />
    </div>
  );
};

// ---- Attachment ----
export const GalleryAttachment = () => <Attachment src={image} name="Item one" onDismiss={() => {}} />;
export const GalleryAttachmentUploading = () => <Attachment src={image} name="Item one" status="uploading" progress={40} onDismiss={() => {}} />;
export const GalleryAttachmentError = () => <Attachment src={image} name="Item one" status="error" error="Error message" onDismiss={() => {}} />;

// ---- Composer menu ----
const files: ComposerMenuGroup[] = [{ label: "Label", items: [
  { id: "1", label: "Item one", icon: <DocumentIcon />, path: "Value/Value" },
  { id: "2", label: "Item two", icon: <DocumentIcon />, path: "Value/Value/Value/Value" },
  { id: "3", label: "Item three", icon: <FolderIcon />, path: "Value" },
] }];
const commands: ComposerMenuGroup[] = [{ label: "Label", items: [
  { id: "1", label: "Item one", icon: <CommandIcon /> },
  { id: "2", label: "Item two", icon: <CommandIcon /> },
] }];
function MenuDemo({ groups, empty }: { groups: ComposerMenuGroup[]; empty?: boolean }) {
  const [active, setActive] = useState(groups[0]?.items[0]?.id);
  // Room above the composer for the menu it opens upward.
  return (
    <div style={{ ...frame, paddingBlockStart: empty ? 56 : 152 }}>
      <Composer layout="stacked" placeholder="Placeholder" defaultValue={empty ? "@xyz" : "@"}
        menu={<ComposerMenu aria-label="Label" items={empty ? [{ items: [] }] : groups} activeId={active} onActiveChange={setActive} onPick={() => {}} />} />
    </div>
  );
}
export const GalleryComposerMenu = () => <MenuDemo groups={files} />;
export const GalleryComposerMenuCommands = () => <MenuDemo groups={commands} />;
export const GalleryComposerMenuEmpty = () => <MenuDemo groups={files} empty />;

// ---- Queue ----
function QueueDemo({ items, open = true }: { items: QueueItem[]; open?: boolean }) {
  const [list, setList] = useState(items);
  return (
    <div style={frame}>
      <Queue items={list} defaultOpen={open} onSendNow={id => setList(current => current.map(item => item.id === id ? { ...item, status: "sending" } : item))}
        onDismiss={id => setList(current => current.filter(item => item.id !== id))} onRetry={id => setList(current => current.map(item => item.id === id ? { ...item, status: "sending" } : item))} />
    </div>
  );
}
export const GalleryQueue = () => <QueueDemo items={[{ id: "1", text: "Item one" }, { id: "2", text: "Item two" }]} />;
export const GalleryQueueSending = () => <QueueDemo items={[{ id: "1", text: "Item one", status: "sending" }, { id: "2", text: "Item two" }]} />;
export const GalleryQueueFailed = () => <QueueDemo items={[{ id: "1", text: "Item one", status: "failed" }, { id: "2", text: "Item two" }]} />;
export const GalleryQueueFolded = () => <QueueDemo items={[{ id: "1", text: "Item one" }, { id: "2", text: "Item two" }]} open={false} />;

// ---- Timestamp ----
export const GalleryTimestamp = () => <div style={frame}><Timestamp dateTime="2026-10-19T14:30:00">Today 2:30 PM</Timestamp></div>;
