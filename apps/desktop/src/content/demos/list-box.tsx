/** List box gallery specimens: one variant per tile. docs/specs/list-box.md. */
import { ColorSwatch, ListBox, ListBoxItem, ListBoxSection } from "@area/react";
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, BellIcon, CalendarIcon, ClockIcon, FolderIcon, HeartIcon, HomeIcon, SearchIcon, StarIcon } from "@area/icons";

const list = { inlineSize: "calc(var(--area-space-80) * 3)", maxInlineSize: "100%" };
const grid = { inlineSize: "calc(var(--area-space-80) * 4)", maxInlineSize: "100%" };

/* A list: Menu's rows, the chosen one on the active plate with its check. One Tab stop; Up and Down move. */
export const GalleryListBox = () => (
  <ListBox aria-label="Sort by" defaultValue="modified" style={list}>
    <ListBoxItem value="name">Name</ListBoxItem>
    <ListBoxItem value="modified">Date modified</ListBoxItem>
    <ListBoxItem value="created">Date created</ListBoxItem>
    <ListBoxItem value="size">Size</ListBoxItem>
  </ListBox>
);

const ICONS = [["home", HomeIcon], ["search", SearchIcon], ["bell", BellIcon], ["calendar", CalendarIcon], ["clock", ClockIcon], ["folder", FolderIcon],
  ["heart", HeartIcon], ["star", StarIcon], ["arrow-up", ArrowUpIcon], ["arrow-right", ArrowRightIcon], ["arrow-down", ArrowDownIcon], ["arrow-left", ArrowLeftIcon]] as const;
const name = (id: string) => id.replace(/-/g, " ").replace(/^./, c => c.toUpperCase());

/* A grid, as the app's Icons tab: Left and Right in reading order, Up and Down to the nearest icon above or below, typing jumps to a name. */
export const GalleryListBoxGrid = () => (
  <ListBox layout="grid" aria-label="Icon" defaultValue="star" style={grid}>
    {ICONS.map(([id, Icon]) => <ListBoxItem key={id} value={id} textValue={name(id)} aria-label={name(id)}><Icon size={16} aria-hidden="true" /></ListBoxItem>)}
  </ListBox>
);

/* Sections: each a named group, the arrows crossing from one to the next. */
export const GalleryListBoxSections = () => (
  <ListBox layout="grid" aria-label="Icon" defaultValue="clock" style={grid}>
    <ListBoxSection title="Objects">
      {ICONS.slice(0, 8).map(([id, Icon]) => <ListBoxItem key={id} value={id} textValue={name(id)} aria-label={name(id)}><Icon size={16} aria-hidden="true" /></ListBoxItem>)}
    </ListBoxSection>
    <ListBoxSection title="Arrows">
      {ICONS.slice(8).map(([id, Icon]) => <ListBoxItem key={id} value={id} textValue={name(id)} aria-label={name(id)}><Icon size={16} aria-hidden="true" /></ListBoxItem>)}
    </ListBoxSection>
  </ListBox>
);

const STEPS = [100, 200, 300, 400, 500, 600, 700, 800];
/* Swatches: the option is the cell, its content any mark. */
export const GalleryListBoxSwatches = () => (
  <ListBox layout="grid" aria-label="Blue step" defaultValue="500" style={grid}>
    {STEPS.map(step => (
      <ListBoxItem key={step} value={String(step)} textValue={`Blue ${step}`} aria-label={`Blue ${step}`}>
        <ColorSwatch size="md" color={`var(--area-blue-${step})`} aria-hidden="true" />
      </ListBoxItem>
    ))}
  </ListBox>
);

/* Selection follows focus: a preview beside the set follows the arrows. */
export const GalleryListBoxFollowsFocus = () => (
  <ListBox aria-label="Theme" defaultValue="system" selectionFollowsFocus style={list}>
    <ListBoxItem value="light">Light</ListBoxItem>
    <ListBoxItem value="dark">Dark</ListBoxItem>
    <ListBoxItem value="system">System</ListBoxItem>
  </ListBox>
);

/* A disabled option is skipped by the arrows and can't be chosen. */
export const GalleryListBoxDisabledOption = () => (
  <ListBox aria-label="Export format" defaultValue="png" style={list}>
    <ListBoxItem value="png">PNG</ListBoxItem>
    <ListBoxItem value="svg">SVG</ListBoxItem>
    <ListBoxItem value="pdf" disabled>PDF</ListBoxItem>
  </ListBox>
);

export const GalleryListBoxDisabled = () => (
  <ListBox aria-label="Export format" defaultValue="png" disabled style={list}>
    <ListBoxItem value="png">PNG</ListBoxItem>
    <ListBoxItem value="svg">SVG</ListBoxItem>
  </ListBox>
);
