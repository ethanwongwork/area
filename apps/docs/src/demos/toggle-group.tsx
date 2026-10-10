/** Toggle group gallery specimens: one variant per tile. docs/specs/toggle-group.md. */
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem, Toolbar, ToolbarSeparator } from "@area/react";
import { FluentBoldIcon, FluentRefItalicIcon, FluentRefUnderlineIcon, FluentStrikethroughIcon } from "../icons.tsx";

/* The formatting set every reference shows: any of bold, italic, underline and strikethrough. */
const marks = [
  { value: "bold", label: "Bold", icon: <FluentBoldIcon /> },
  { value: "italic", label: "Italic", icon: <FluentRefItalicIcon /> },
  { value: "underline", label: "Underline", icon: <FluentRefUnderlineIcon /> },
  { value: "strikethrough", label: "Strikethrough", icon: <FluentStrikethroughIcon /> },
];
const Marks = ({ only = marks.length }: { only?: number }) => <>{marks.slice(0, only).map(mark => <ToggleGroupItem key={mark.value} value={mark.value} iconOnly icon={mark.icon}>{mark.label}</ToggleGroupItem>)}</>;
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const GalleryToggleGroup = () => <ToggleGroup aria-label="Text style" defaultValue={["bold"]}><Marks /></ToggleGroup>;
export const GalleryToggleGroupOutline = () => <ToggleGroup aria-label="Text style" variant="outline" defaultValue={["bold"]}><Marks /></ToggleGroup>;
export const GalleryToggleGroupGhost = () => <ToggleGroup aria-label="Text style" variant="ghost" defaultValue={["bold"]}><Marks /></ToggleGroup>;
export const GalleryToggleGroupSm = () => <ToggleGroup aria-label="Text style" size="sm" defaultValue={["bold"]}><Marks /></ToggleGroup>;
export const GalleryToggleGroupLg = () => <ToggleGroup aria-label="Text style" size="lg" defaultValue={["bold"]}><Marks /></ToggleGroup>;
/* Text toggles: the weekdays a repeat runs on, any number of them. */
export const GalleryToggleGroupText = () => (
  <ToggleGroup aria-label="Repeat on" defaultValue={["Mon", "Wed", "Fri"]}>{days.map(day => <ToggleGroupItem key={day} value={day}>{day}</ToggleGroupItem>)}</ToggleGroup>
);
/* At most one: a line under or through the text, or neither (press the pressed one to release it). */
export const GalleryToggleGroupSingle = () => {
  const [value, setValue] = useState<string[]>(["underline"]);
  return (
    <ToggleGroup aria-label="Text decoration" selectionMode="single" value={value} onValueChange={setValue}>
      <ToggleGroupItem value="underline" iconOnly icon={<FluentRefUnderlineIcon />}>Underline</ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" iconOnly icon={<FluentStrikethroughIcon />}>Strikethrough</ToggleGroupItem>
    </ToggleGroup>
  );
};
export const GalleryToggleGroupDisabled = () => <ToggleGroup aria-label="Text style" disabled defaultValue={["bold"]}><Marks /></ToggleGroup>;
export const GalleryToggleGroupFullWidth = () => (
  <div style={{ inlineSize: "calc(var(--area-space-96) * 3)", maxInlineSize: "100%" }}>
    <ToggleGroup aria-label="Repeat on" fullWidth defaultValue={["Mon", "Wed", "Fri"]}>{days.map(day => <ToggleGroupItem key={day} value={day}>{day}</ToggleGroupItem>)}</ToggleGroup>
  </div>
);
/* In a Toolbar the set is a ghost group whose toggles join the toolbar's arrow keys (one Tab stop for the bar). */
export const GalleryToggleGroupToolbar = () => (
  <Toolbar aria-label="Formatting" variant="surface">
    <ToggleGroup aria-label="Text style" variant="ghost" defaultValue={["bold", "italic"]}><Marks only={2} /></ToggleGroup>
    <ToolbarSeparator />
    <ToggleGroup aria-label="Text decoration" variant="ghost" selectionMode="single">
      <ToggleGroupItem value="underline" iconOnly icon={<FluentRefUnderlineIcon />}>Underline</ToggleGroupItem>
      <ToggleGroupItem value="strikethrough" iconOnly icon={<FluentStrikethroughIcon />}>Strikethrough</ToggleGroupItem>
    </ToggleGroup>
  </Toolbar>
);
