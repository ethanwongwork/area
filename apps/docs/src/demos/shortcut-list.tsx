/** Shortcut list gallery specimens: one variant per tile. docs/specs/shortcut-list.md. */
import { Button, Dialog, KbdGroup, Kbd, ShortcutList, ShortcutListItem } from "@area/react";

const sheet = { inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" };

export const GalleryShortcutList = () => (
  <ShortcutList style={sheet} title="General">
    <ShortcutListItem label="Search" keys={["cmd", "K"]} />
    <ShortcutListItem label="New page" keys={["cmd", "N"]} />
    <ShortcutListItem label="Toggle sidebar" keys={["cmd", "\\"]} />
  </ShortcutList>
);
/* ChatGPT's sheet: the keys as text in the muted ink. */
export const GalleryShortcutListQuiet = () => (
  <ShortcutList style={sheet} title="General" quiet>
    <ShortcutListItem label="Search" keys={["cmd", "K"]} />
    <ShortcutListItem label="New page" keys={["cmd", "N"]} />
    <ShortcutListItem label="Toggle sidebar" keys={["cmd", "\\"]} />
  </ShortcutList>
);
/* No title: a list inside a Popover or a Panel that names it already. */
export const GalleryShortcutListUntitled = () => (
  <ShortcutList style={sheet} aria-label="Shortcuts">
    <ShortcutListItem label="Bold" keys={["cmd", "B"]} />
    <ShortcutListItem label="Italic" keys={["cmd", "I"]} />
    <ShortcutListItem label="Link" keys={["cmd", "K"]} />
  </ShortcutList>
);
/* A command with two key combinations, and one pressed in sequence. */
export const GalleryShortcutListAlternates = () => (
  <ShortcutList style={sheet} title="Pages">
    <ShortcutListItem label="Delete page" keys={[["shift", "cmd", "Delete"], ["shift", "cmd", "Backspace"]]} />
    <ShortcutListItem label="Go to home" shortcut={<KbdGroup><Kbd keys={["G"]} /><Kbd keys={["H"]} /></KbdGroup>} />
  </ShortcutList>
);

/* The full sheet in a Dialog, as ChatGPT's Keyboard shortcuts (cmd+/) and Figma's Help › Keyboard shortcuts. */
export const GalleryShortcutListDialog = () => (
  <Dialog trigger={<Button variant="outline" tone="neutral">Keyboard shortcuts</Button>} title="Keyboard shortcuts">
    <ShortcutList title="General">
      <ShortcutListItem label="Search" keys={["cmd", "K"]} />
      <ShortcutListItem label="Show shortcuts" keys={["cmd", "/"]} />
      <ShortcutListItem label="Toggle sidebar" keys={["cmd", "\\"]} />
    </ShortcutList>
    <ShortcutList title="Editing">
      <ShortcutListItem label="Bold" keys={["cmd", "B"]} />
      <ShortcutListItem label="Italic" keys={["cmd", "I"]} />
      <ShortcutListItem label="Undo" keys={["cmd", "Z"]} />
      <ShortcutListItem label="Redo" keys={[["shift", "cmd", "Z"], ["cmd", "Y"]]} />
    </ShortcutList>
  </Dialog>
);
