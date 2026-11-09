/**
 * The chat additions around the Composer (docs/research/inspector-chat-2026-10-18, "Chat additions"): the context row,
 * Attachment, Composer menu, Queue and Timestamp. One variant per tile, at the Inspector's narrow column (280), in the
 * system's placeholder copy. Specs: docs/specs/{attachment,composer-menu,queue,timestamp}.md.
 */
import { useId, useState } from "react";
import type { ReactNode } from "react";
import { Attachment, Chip, Composer, ComposerMenu, Message, Queue, Timestamp, withMentions, type ComposerMenuGroup, type MentionToken, type QueueItem } from "@area/react";
import { CommandIcon, DocumentIcon, FilePdfIcon, FolderIcon, LinkIcon, PeopleIcon, PersonIcon } from "@area/icons";

const frame = { inlineSize: 280 };
const image = "images/chip-pixels.png";

// ---- Composer expanded (the chat workflow study, 2026-11-08) ----
/** A long draft: past eight lines Expand shows at the field's top end; expanded fills the container (here 320 tall). */
export const GalleryComposerExpanded = () => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div style={{ ...frame, blockSize: 320, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <Composer layout="stacked" placeholder="Placeholder" expandable expanded={expanded} onExpandedChange={setExpanded}
        defaultValue={Array.from({ length: 12 }, (_, index) => `Body text ${index + 1}`).join("\n")} />
    </div>
  );
};

// ---- Composer context row ----
export const GalleryComposerContext = () => (
  <div style={frame}>
    <Composer layout="stacked" placeholder="Placeholder"
      context={<><Chip kind="input" size="sm" icon={<DocumentIcon />} onDismiss={() => {}}>Item one</Chip><Chip kind="input" size="sm" onDismiss={() => {}}>Item two</Chip></>} />
  </div>
);
export const GalleryComposerAttachments = () => {
  const [items, setItems] = useState(["Item one", "Item two.pdf", "Item three"]);
  const remove = (name: string) => () => setItems(list => list.filter(item => item !== name));
  const tile = (name: string) => name.endsWith(".pdf")
    ? <Attachment key={name} kind="file" name={name} icon={<FilePdfIcon />} onDismiss={remove(name)} />
    : name === "Item three" ? <Attachment key={name} kind="quote" name={name} text="Body text" onDismiss={remove(name)} />
    : <Attachment key={name} src={image} name={name} onDismiss={remove(name)} />;
  return (
    <div style={frame}>
      <Composer layout="stacked" placeholder="Placeholder" context={items.length ? items.map(tile) : undefined} />
    </div>
  );
};

// ---- Attachment ----
export const GalleryAttachment = () => <Attachment src={image} name="Item one" onDismiss={() => {}} />;
export const GalleryAttachmentUploading = () => <Attachment src={image} name="Item one" status="uploading" progress={40} onDismiss={() => {}} />;
/* Retry uploads it again: the ring, then the tile is complete (a demo's stand-in upload). */
export const GalleryAttachmentError = () => {
  const [status, setStatus] = useState<"complete" | "uploading" | "error">("error");
  const retry = () => { setStatus("uploading"); window.setTimeout(() => setStatus("complete"), 1500); };
  return <Attachment src={image} name="Item one" status={status} error="Error message" onRetry={retry} onDismiss={() => {}} />;
};
/* The kinds beside the image (components audit V10): a file with its type, a quote, a video with its length. */
export const GalleryAttachmentFile = () => <Attachment kind="file" name="Item one.pdf" icon={<FilePdfIcon />} onDismiss={() => {}} />;
export const GalleryAttachmentQuote = () => <Attachment kind="quote" name="Item one" text="Body text that wraps onto a second line, long enough to show the tile's lines" onDismiss={() => {}} />;
export const GalleryAttachmentVideo = () => <Attachment kind="video" src={image} name="Item one" badge="0:42" onDismiss={() => {}} />;

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

/*
 * Mentions (components audit N3, docs/specs/mention.md): @ lists people (David Tee, then teams), files and pages; a pick
 * writes the mention's words into the draft ("@David Tee "), and the sent message draws them as Mentions (withMentions).
 * The field drives the list as the chat's does: arrows move, Enter or Tab picks, Escape closes.
 */
/* Each with its row's 16 icon in the list and the Mention it becomes. */
const MENTIONS: { id: string; group: string; row: ReactNode; token: MentionToken }[] = [
  { id: "david-tee", group: "People", row: <PersonIcon />, token: { label: "David Tee" } },
  { id: "design-team", group: "People", row: <PeopleIcon />, token: { label: "Design team", icon: <PeopleIcon size={12} /> } },
  { id: "research-team", group: "People", row: <PeopleIcon />, token: { label: "Research team", icon: <PeopleIcon size={12} /> } },
  { id: "item-one", group: "Files", row: <DocumentIcon />, token: { label: "Item one.pdf", kind: "file" } },
  { id: "item-two", group: "Pages", row: <LinkIcon />, token: { label: "Item two", kind: "page" } },
];
export const GalleryComposerMenuMentions = () => {
  const id = useId();
  const [draft, setDraft] = useState("Body text @");
  const [picked, setPicked] = useState<MentionToken[]>([]);
  const [sent, setSent] = useState<{ text: string; mentions: MentionToken[] } | null>(null);
  const [active, setActive] = useState(0);
  const [closedAt, setClosedAt] = useState<string>();
  // The @ being typed at the end of the draft, and what follows it.
  const at = /(^|\s)@([^\s@]*)$/.exec(draft);
  const query = at ? at[2]!.toLowerCase() : "";
  const matches = at ? MENTIONS.filter(mention => mention.token.label.toLowerCase().includes(query)) : [];
  const groups: ComposerMenuGroup[] = ["People", "Files", "Pages"].map(label => ({ label, items: matches.filter(mention => mention.group === label)
    .map(mention => ({ id: mention.id, label: mention.token.label, icon: mention.row })) }));
  const open = Boolean(at) && closedAt !== draft;
  const current = open ? matches[Math.min(active, matches.length - 1)] : undefined;
  const pick = (choice: string) => {
    const mention = MENTIONS.find(entry => entry.id === choice);
    if (!mention || !at) return;
    setDraft(`${draft.slice(0, at.index + at[1]!.length)}@${mention.token.label} `);
    setPicked(list => list.some(entry => entry.label === mention.token.label) ? list : [...list, mention.token]);
    setActive(0);
  };
  return (
    <div style={{ ...frame, display: "grid", gap: "var(--area-space-12)" }}>
      {sent ? <Message author="user">{withMentions(sent.text, sent.mentions)}</Message> : null}
      <div style={{ paddingBlockStart: open ? 240 : 0 }}>
        <Composer layout="stacked" placeholder="Placeholder" value={draft} onValueChange={next => { setDraft(next); setActive(0); }}
          onSubmit={value => { if (!value.trim()) return; setSent({ text: value.trim(), mentions: picked }); setDraft(""); setPicked([]); }}
          menu={open ? <ComposerMenu id={id} aria-label="People, files and pages" items={groups} emptyLabel="No matches"
            activeId={current?.id} onActiveChange={next => setActive(matches.findIndex(mention => mention.id === next))} onPick={item => pick(item.id)} /> : undefined}
          inputProps={{ role: "combobox", "aria-expanded": open, "aria-controls": open ? id : undefined, "aria-autocomplete": "list",
            "aria-activedescendant": current ? `${id}-${current.id}` : undefined }}
          onInputKeyDown={event => {
            if (!open) return;
            if (matches.length && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
              event.preventDefault();
              setActive(index => (index + (event.key === "ArrowDown" ? 1 : -1) + matches.length) % matches.length);
            } else if (current && (event.key === "Enter" || event.key === "Tab") && !event.shiftKey) {
              event.preventDefault();
              pick(current.id);
            } else if (event.key === "Escape") { event.preventDefault(); setClosedAt(draft); }
          }} />
      </div>
    </div>
  );
};

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
export const GalleryQueueFailed = () => <QueueDemo items={[{ id: "1", text: "Item one", status: "error" }, { id: "2", text: "Item two" }]} />;
export const GalleryQueueFolded = () => <QueueDemo items={[{ id: "1", text: "Item one" }, { id: "2", text: "Item two" }]} open={false} />;

// ---- Timestamp ----
export const GalleryTimestamp = () => <div style={frame}><Timestamp dateTime="2026-10-19T14:30:00">Today 2:30 PM</Timestamp></div>;
