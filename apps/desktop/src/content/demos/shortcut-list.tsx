/** Shortcut list gallery specimens: one variant per tile. docs/specs/shortcut-list.md. */
import { Button, Dialog, KbdGroup, Kbd, ShortcutList, ShortcutListItem } from "@area/react";

const sheet = { inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" };

export const GalleryShortcutList = () => (
  <ShortcutList style={sheet} title="Title">
    <ShortcutListItem label="Item one" keys={["cmd", "K"]} />
    <ShortcutListItem label="Item two" keys={["cmd", "N"]} />
    <ShortcutListItem label="Item three" keys={["cmd", "\\"]} />
  </ShortcutList>
);
/* ChatGPT's sheet: the keys as text in the muted ink. */
export const GalleryShortcutListQuiet = () => (
  <ShortcutList style={sheet} title="Title" quiet>
    <ShortcutListItem label="Item one" keys={["cmd", "K"]} />
    <ShortcutListItem label="Item two" keys={["cmd", "N"]} />
    <ShortcutListItem label="Item three" keys={["cmd", "\\"]} />
  </ShortcutList>
);
/* No title: a list inside a Popover or a Panel that names it already. */
export const GalleryShortcutListUntitled = () => (
  <ShortcutList style={sheet} aria-label="Label">
    <ShortcutListItem label="Item one" keys={["cmd", "B"]} />
    <ShortcutListItem label="Item two" keys={["cmd", "I"]} />
    <ShortcutListItem label="Item three" keys={["cmd", "K"]} />
  </ShortcutList>
);
/* A command with two key combinations, and one pressed in sequence. */
export const GalleryShortcutListAlternates = () => (
  <ShortcutList style={sheet} title="Title">
    <ShortcutListItem label="Item one" keys={[["shift", "cmd", "Delete"], ["shift", "cmd", "Backspace"]]} />
    <ShortcutListItem label="Item two" shortcut={<KbdGroup><Kbd keys={["G"]} /><Kbd keys={["H"]} /></KbdGroup>} />
  </ShortcutList>
);

/* The full sheet in a Dialog, as ChatGPT's Keyboard shortcuts (cmd+/) and Figma's Help › Keyboard shortcuts. */
export const GalleryShortcutListDialog = () => (
  <Dialog trigger={<Button variant="outline" tone="neutral">Keyboard shortcuts</Button>} title="Title">
    <ShortcutList title="Group one">
      <ShortcutListItem label="Item one" keys={["cmd", "K"]} />
      <ShortcutListItem label="Item two" keys={["cmd", "/"]} />
      <ShortcutListItem label="Item three" keys={["cmd", "\\"]} />
    </ShortcutList>
    <ShortcutList title="Group two">
      <ShortcutListItem label="Item one" keys={["cmd", "B"]} />
      <ShortcutListItem label="Item two" keys={["cmd", "I"]} />
      <ShortcutListItem label="Item three" keys={["cmd", "Z"]} />
      <ShortcutListItem label="Item four" keys={[["shift", "cmd", "Z"], ["cmd", "Y"]]} />
    </ShortcutList>
  </Dialog>
);
