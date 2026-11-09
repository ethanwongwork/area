/** Tag picker gallery specimens: one variant per tile. docs/specs/tag-picker.md. */
import { useState } from "react";
import type { CSSProperties } from "react";
import { TagPicker, type TagOption } from "@area/react";

/* Notion's status tags (captures/tag-picker): yellow, green, blue and purple map onto Badge tones. */
const tags: TagOption[] = [
  { value: "one", label: "Tag one", tone: "caution" },
  { value: "two", label: "Tag two", tone: "success" },
  { value: "three", label: "Tag three", tone: "info" },
  { value: "four", label: "Tag four", tone: "discovery" },
];
const topics: TagOption[] = ["one", "two", "three", "four", "five", "six", "seven"].map((value, index) => ({
  value, label: `Tag ${value}`, tone: (["info", "success", "caution", "discovery", "danger", "warning", "neutral"] as const)[index],
}));
const frame: CSSProperties = { inlineSize: 280 };

export const GalleryTagPicker = () => {
  const [items, setItems] = useState(tags);
  return <div style={frame}><TagPicker fullWidth aria-label="Label" items={items} defaultValue={["three"]}
    onCreate={text => setItems(list => [...list, { value: text.toLowerCase(), label: text, tone: "neutral" }])} /></div>;
};
export const GalleryTagPickerPlaceholder = () => (
  <div style={frame}><TagPicker fullWidth aria-label="Label" placeholder="Placeholder" items={tags} /></div>
);
export const GalleryTagPickerWrap = () => (
  <div style={frame}><TagPicker fullWidth aria-label="Label" items={topics} defaultValue={["one", "two", "three", "four", "five"]} /></div>
);
export const GalleryTagPickerSoft = () => (
  <div style={frame}><TagPicker fullWidth variant="soft" aria-label="Label" items={tags} defaultValue={["one", "four"]} /></div>
);
export const GalleryTagPickerSm = () => (
  <div style={frame}><TagPicker fullWidth size="sm" aria-label="Label" items={tags} defaultValue={["three"]} /></div>
);
export const GalleryTagPickerMd = () => (
  <div style={frame}><TagPicker fullWidth size="md" aria-label="Label" items={tags} defaultValue={["three"]} /></div>
);
export const GalleryTagPickerLg = () => (
  <div style={frame}><TagPicker fullWidth size="lg" aria-label="Label" items={tags} defaultValue={["three"]} /></div>
);
export const GalleryTagPickerDisabled = () => (
  <div style={frame}><TagPicker fullWidth disabled aria-label="Label" items={tags} defaultValue={["two"]} /></div>
);
export const GalleryTagPickerInvalid = () => (
  <div style={frame}><TagPicker fullWidth invalid aria-label="Label" placeholder="Placeholder" items={tags} /></div>
);
/* Success and warning, as Input's (components audit 2026-11-07, O1). */
export const GalleryTagPickerSuccess = () => (
  <div style={frame}><TagPicker fullWidth validationStatus="success" aria-label="Label" placeholder="Placeholder" items={tags} /></div>
);
export const GalleryTagPickerWarning = () => (
  <div style={frame}><TagPicker fullWidth validationStatus="warning" aria-label="Label" placeholder="Placeholder" items={tags} /></div>
);
