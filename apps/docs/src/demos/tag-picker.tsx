/** Tag picker gallery specimens: one variant per tile. docs/specs/tag-picker.md. */
import { useState } from "react";
import type { CSSProperties } from "react";
import { TagPicker, type TagOption } from "@area/react";

/* Notion's status tags (captures/tag-picker): yellow, green, blue and purple map onto Badge tones. */
const tags: TagOption[] = [
  { value: "later", label: "later", tone: "caution" },
  { value: "complete", label: "complete", tone: "success" },
  { value: "personal", label: "personal", tone: "info" },
  { value: "work", label: "work", tone: "discovery" },
];
const topics: TagOption[] = ["Design", "Engineering", "Research", "Marketing", "Sales", "Support", "Finance"].map((label, index) => ({
  value: label.toLowerCase(), label, tone: (["info", "success", "caution", "discovery", "danger", "warning", "neutral"] as const)[index],
}));
const frame: CSSProperties = { inlineSize: 280 };

export const GalleryTagPicker = () => {
  const [items, setItems] = useState(tags);
  return <div style={frame}><TagPicker fullWidth aria-label="Status" items={items} defaultValue={["personal"]}
    onCreate={text => setItems(list => [...list, { value: text.toLowerCase(), label: text, tone: "neutral" }])} /></div>;
};
export const GalleryTagPickerPlaceholder = () => (
  <div style={frame}><TagPicker fullWidth aria-label="Status" placeholder="Add tags" items={tags} /></div>
);
export const GalleryTagPickerWrap = () => (
  <div style={frame}><TagPicker fullWidth aria-label="Teams" items={topics} defaultValue={["design", "engineering", "research", "marketing", "sales"]} /></div>
);
export const GalleryTagPickerSoft = () => (
  <div style={frame}><TagPicker fullWidth variant="soft" aria-label="Status" items={tags} defaultValue={["later", "work"]} /></div>
);
export const GalleryTagPickerSm = () => (
  <div style={frame}><TagPicker fullWidth size="sm" aria-label="Status" items={tags} defaultValue={["personal"]} /></div>
);
export const GalleryTagPickerMd = () => (
  <div style={frame}><TagPicker fullWidth size="md" aria-label="Status" items={tags} defaultValue={["personal"]} /></div>
);
export const GalleryTagPickerLg = () => (
  <div style={frame}><TagPicker fullWidth size="lg" aria-label="Status" items={tags} defaultValue={["personal"]} /></div>
);
export const GalleryTagPickerDisabled = () => (
  <div style={frame}><TagPicker fullWidth disabled aria-label="Status" items={tags} defaultValue={["complete"]} /></div>
);
export const GalleryTagPickerInvalid = () => (
  <div style={frame}><TagPicker fullWidth invalid aria-label="Status" placeholder="Add tags" items={tags} /></div>
);
