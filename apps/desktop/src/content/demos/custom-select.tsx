/** Custom select gallery specimens: one variant per tile. docs/specs/custom-select.md. */
import { useState, type CSSProperties } from "react";
import { Button, ColorSwatch, CustomSelect, FileImage, FilePage, Folder, type CustomSelectOption } from "@area/react";
import { GlobeIcon, GalleryIcon, KanbanIcon, ListIcon, LockIcon, TableIcon, CalendarIcon } from "@area/icons";

/* Notion's Share popover access levels: a label and a line saying what it allows. */
const access: CustomSelectOption[] = [
  { value: "full", label: "Option one", description: "Description" },
  { value: "edit", label: "Option two", description: "Description" },
  { value: "comment", label: "Option three", description: "Description" },
  { value: "view", label: "Option four" },
];
const general: CustomSelectOption[] = [
  { value: "invited", label: "Option one", icon: <LockIcon /> },
  { value: "web", label: "Option two", icon: <GlobeIcon /> },
];
const layouts: CustomSelectOption[] = [
  { value: "table", label: "Table", icon: <TableIcon />, group: "Group one" },
  { value: "list", label: "List", icon: <ListIcon />, group: "Group one" },
  { value: "board", label: "Board", icon: <KanbanIcon />, group: "Group two" },
  { value: "gallery", label: "Gallery", icon: <GalleryIcon />, group: "Group two" },
  { value: "calendar", label: "Calendar", icon: <CalendarIcon />, group: "Group two" },
];
const frame: CSSProperties = { inlineSize: 240 };

export const GalleryCustomSelect = () => (
  <div style={frame}><CustomSelect fullWidth aria-label="Label" items={access} defaultValue="full" /></div>
);
export const GalleryCustomSelectIcons = () => (
  <div style={frame}><CustomSelect fullWidth aria-label="Label" items={general} defaultValue="invited" /></div>
);
export const GalleryCustomSelectGroups = () => (
  <div style={frame}><CustomSelect fullWidth aria-label="Layout" items={layouts} defaultValue="board" /></div>
);
export const GalleryCustomSelectPlaceholder = () => (
  <div style={frame}><CustomSelect fullWidth aria-label="Label" placeholder="Placeholder" items={access} /></div>
);
export const GalleryCustomSelectSoft = () => (
  <div style={frame}><CustomSelect fullWidth variant="soft" aria-label="Label" items={access} defaultValue="edit" /></div>
);
/* Notion's inline select: no chrome until the pointer is on it, as wide as its value. */
export const GalleryCustomSelectGhost = () => (
  <CustomSelect variant="ghost" size="sm" aria-label="Label" items={access} defaultValue="full" />
);
export const GalleryCustomSelectSm = () => (
  <div style={frame}><CustomSelect fullWidth size="sm" aria-label="Label" items={access} defaultValue="full" /></div>
);
export const GalleryCustomSelectMd = () => (
  <div style={frame}><CustomSelect fullWidth size="md" aria-label="Label" items={access} defaultValue="full" /></div>
);
export const GalleryCustomSelectLg = () => (
  <div style={frame}><CustomSelect fullWidth size="lg" aria-label="Label" items={access} defaultValue="full" /></div>
);
export const GalleryCustomSelectDisabledOption = () => (
  <div style={frame}><CustomSelect fullWidth aria-label="Label" defaultValue="comment"
    items={access.map(option => option.value === "edit" ? { ...option, disabled: true } : option)} /></div>
);
export const GalleryCustomSelectDisabled = () => (
  <div style={frame}><CustomSelect fullWidth disabled aria-label="Label" items={access} defaultValue="full" /></div>
);
export const GalleryCustomSelectInvalid = () => (
  <div style={frame}><CustomSelect fullWidth invalid aria-label="Label" placeholder="Placeholder" items={access} /></div>
);
/* Success and warning, as Select's; read-only shows a value set elsewhere (components audit 2026-11-07, O1, O2). */
export const GalleryCustomSelectSuccess = () => (
  <div style={frame}><CustomSelect fullWidth validationStatus="success" aria-label="Label" items={access} defaultValue="full" /></div>
);
export const GalleryCustomSelectWarning = () => (
  <div style={frame}><CustomSelect fullWidth validationStatus="warning" aria-label="Label" items={access} defaultValue="full" /></div>
);
export const GalleryCustomSelectReadOnly = () => (
  <div style={frame}><CustomSelect fullWidth readOnly aria-label="Label" items={access} defaultValue="full" /></div>
);

/* Layout grid: choices that are pictures; in a Field the list takes the Field's width (the desktop Inspector's 268). Each
   option's preview is drawn over its label; Area's own file figures stand in for a setting's figures. */
const kinds: CustomSelectOption[] = [
  { value: "folder", label: "Option one", preview: <Folder size="sm" /> },
  { value: "page", label: "Option two", preview: <FilePage size="sm" /> },
  { value: "image", label: "Option three", preview: <FileImage size="sm" /> },
];
const field: CSSProperties = { inlineSize: 268 };
export const GalleryCustomSelectGrid = () => (
  <div style={field}><CustomSelect fullWidth layout="grid" aria-label="Label" items={kinds} defaultValue="page" /></div>
);
/* Without a preview a cell draws the option's icon large: a colour as a grid of swatches. */
const colours: CustomSelectOption[] = ["red", "orange", "yellow", "green", "teal", "blue", "indigo", "purple", "pink"].map(name =>
  ({ value: name, label: name[0]!.toUpperCase() + name.slice(1), icon: <ColorSwatch size="sm" color={`var(--area-${name}-500, ${name})`} aria-hidden="true" /> }));
export const GalleryCustomSelectGridSwatches = () => (
  <div style={field}><CustomSelect fullWidth layout="grid" aria-label="Label" items={colours} defaultValue="blue" /></div>
);

/* Several from a long list (components audit V7): a filter field at the top, the chosen options first, Select all;
   the trigger names one or two and counts three or more ("3 selected"). */
const many: CustomSelectOption[] = ["one", "two", "three", "four", "five", "six", "seven", "eight"].map(word => ({ value: word, label: `Option ${word}` }));
export const GalleryCustomSelectFilter = () => (
  <div style={frame}><CustomSelect fullWidth aria-label="Label" items={many} multiple filterable defaultValues={["two", "five", "six"]} /></div>
);
/* Save and Cancel in the footer: the set is a draft until Save keeps it; Cancel, Escape or leaving drop it. */
export const GalleryCustomSelectSave = () => {
  const [kept, setKept] = useState<string[]>(["two"]);
  const [draft, setDraft] = useState<string[]>(kept);
  const [open, setOpen] = useState(false);
  const openChange = (next: boolean) => { setOpen(next); setDraft(kept); };
  return <div style={frame}><CustomSelect fullWidth aria-label="Label" items={many} multiple filterable open={open} onOpenChange={openChange}
    values={open ? draft : kept} onValuesChange={setDraft}
    footer={<>
      <Button size="sm" variant="ghost" onClick={() => openChange(false)}>Cancel</Button>
      <Button size="sm" onClick={() => { setKept(draft); setOpen(false); }}>Save</Button>
    </>} /></div>;
};
