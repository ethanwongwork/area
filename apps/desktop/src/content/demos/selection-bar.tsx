/** Selection bar gallery specimens: one variant per tile. docs/specs/selection-bar.md. */
import { useState } from "react";
import { Button, Checkbox, SelectionBar } from "@area/react";
import { CopyIcon, TrashIcon } from "@area/icons";

/* A list's width: the bar takes the place of the list's head. */
const list = { inlineSize: "calc(var(--area-space-96) * 5)", maxInlineSize: "100%" };
const actions = <>
  <Button variant="ghost" tone="neutral" size="sm" icon={<CopyIcon />}>Action</Button>
  <Button variant="ghost" tone="danger" size="sm" icon={<TrashIcon />}>Delete</Button>
</>;

export const GallerySelectionBar = () => (
  <SelectionBar style={list} count={3} onClear={() => {}}>{actions}</SelectionBar>
);
/* Floating: over the bottom of the region it scrolls in, on the floating surface. */
export const GallerySelectionBarFloating = () => (
  <SelectionBar floating count={3} onClear={() => {}}>{actions}</SelectionBar>
);
/* Behavior: the bar comes with the first selection and goes with the last; Clear (or Escape in the bar) clears it and
   puts focus back on the row it came from. The count is said each time it changes. */
export const GallerySelectionBarList = () => {
  const items = ["Item one", "Item two", "Item three"];
  const [selected, setSelected] = useState<string[]>(["Item one"]);
  const toggle = (item: string) => setSelected(now => now.includes(item) ? now.filter(entry => entry !== item) : items.filter(entry => entry === item || now.includes(entry)));
  return (
    <div style={{ ...list, display: "grid", gap: "var(--area-space-8)" }}>
      <SelectionBar count={selected.length} onClear={() => setSelected([])}>
        <Button variant="ghost" tone="danger" size="sm" icon={<TrashIcon />}>Delete</Button>
      </SelectionBar>
      {items.map(item => <Checkbox key={item} label={item} checked={selected.includes(item)} onChange={() => toggle(item)} />)}
    </div>
  );
};
