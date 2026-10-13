/** Custom select gallery specimens: one variant per tile. docs/specs/custom-select.md. */
import type { CSSProperties } from "react";
import { CustomSelect, type CustomSelectOption } from "@area/react";
import { GlobeIcon, GalleryIcon, KanbanIcon, ListIcon, LockIcon, TableIcon, CalendarIcon } from "@area/icons";

/* Notion's Share popover access levels: a label and a line saying what it allows. */
const access: CustomSelectOption[] = [
  { value: "full", label: "Full access", description: "Edit, suggest, comment, and share" },
  { value: "edit", label: "Can edit", description: "Edit, suggest, and comment" },
  { value: "comment", label: "Can comment", description: "Suggest and comment" },
  { value: "view", label: "Can view" },
];
const general: CustomSelectOption[] = [
  { value: "invited", label: "Only people invited", icon: <LockIcon /> },
  { value: "web", label: "Anyone on the web with link", icon: <GlobeIcon /> },
];
const layouts: CustomSelectOption[] = [
  { value: "table", label: "Table", icon: <TableIcon />, group: "Data" },
  { value: "list", label: "List", icon: <ListIcon />, group: "Data" },
  { value: "board", label: "Board", icon: <KanbanIcon />, group: "Visual" },
  { value: "gallery", label: "Gallery", icon: <GalleryIcon />, group: "Visual" },
  { value: "calendar", label: "Calendar", icon: <CalendarIcon />, group: "Visual" },
];
const frame: CSSProperties = { inlineSize: 240 };

export const GalleryCustomSelect = () => (
  <div style={frame}><CustomSelect fullWidth aria-label="Access" items={access} defaultValue="full" /></div>
);
export const GalleryCustomSelectIcons = () => (
  <div style={frame}><CustomSelect fullWidth aria-label="General access" items={general} defaultValue="invited" /></div>
);
export const GalleryCustomSelectGroups = () => (
  <div style={frame}><CustomSelect fullWidth aria-label="Layout" items={layouts} defaultValue="board" /></div>
);
export const GalleryCustomSelectPlaceholder = () => (
  <div style={frame}><CustomSelect fullWidth aria-label="Access" placeholder="Choose access" items={access} /></div>
);
export const GalleryCustomSelectSoft = () => (
  <div style={frame}><CustomSelect fullWidth variant="soft" aria-label="Access" items={access} defaultValue="edit" /></div>
);
/* Notion's inline select: no chrome until the pointer is on it, as wide as its value. */
export const GalleryCustomSelectGhost = () => (
  <CustomSelect variant="ghost" size="sm" aria-label="Access" items={access} defaultValue="full" />
);
export const GalleryCustomSelectSm = () => (
  <div style={frame}><CustomSelect fullWidth size="sm" aria-label="Access" items={access} defaultValue="full" /></div>
);
export const GalleryCustomSelectMd = () => (
  <div style={frame}><CustomSelect fullWidth size="md" aria-label="Access" items={access} defaultValue="full" /></div>
);
export const GalleryCustomSelectLg = () => (
  <div style={frame}><CustomSelect fullWidth size="lg" aria-label="Access" items={access} defaultValue="full" /></div>
);
export const GalleryCustomSelectDisabledOption = () => (
  <div style={frame}><CustomSelect fullWidth aria-label="Access" defaultValue="comment"
    items={access.map(option => option.value === "edit" ? { ...option, disabled: true } : option)} /></div>
);
export const GalleryCustomSelectDisabled = () => (
  <div style={frame}><CustomSelect fullWidth disabled aria-label="Access" items={access} defaultValue="full" /></div>
);
export const GalleryCustomSelectInvalid = () => (
  <div style={frame}><CustomSelect fullWidth invalid aria-label="Access" placeholder="Choose access" items={access} /></div>
);
