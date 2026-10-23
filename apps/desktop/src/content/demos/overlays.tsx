/** Anchored overlays: Popover, Menu and Tooltip opened from a trigger. */
import { Button, Field, Input, Kbd, Menu, MenuItem, MenuLabel, MenuSeparator, Popover, PopoverBody, PopoverDescription, PopoverHeader, PopoverTitle, Tooltip } from "@area/react";
import { ChevronDownIcon, SearchIcon, SettingsIcon } from "@area/icons";

export const GalleryOverlayPopover = () => (
  <Popover trigger={<Button variant="outline">Open</Button>}>
    <PopoverHeader><PopoverTitle>Title</PopoverTitle></PopoverHeader>
    <PopoverBody>
      <PopoverDescription>Description</PopoverDescription>
      <Field label="Label"><Input fullWidth placeholder="Placeholder" /></Field>
    </PopoverBody>
  </Popover>
);

export const GalleryOverlayPopoverArrow = () => (
  <Popover trigger={<Button variant="outline">Open</Button>} side="top" arrow>
    <PopoverHeader><PopoverTitle>Title</PopoverTitle></PopoverHeader>
    <PopoverBody><PopoverDescription>Description</PopoverDescription></PopoverBody>
  </Popover>
);

export const GalleryOverlayMenu = () => (
  <Menu trigger={<Button variant="outline" trailingIcon={<ChevronDownIcon />}>Button</Button>}>
    <MenuItem shortcut={<Kbd keys={["cmd", "D"]} size="sm" />}>Item one</MenuItem>
    <MenuItem>Item two</MenuItem>
    <MenuItem disabled>Item three</MenuItem>
    <MenuSeparator />
    <MenuItem tone="danger">Delete</MenuItem>
  </Menu>
);

export const GalleryOverlayMenuGroups = () => (
  <Menu trigger={<Button variant="ghost" iconOnly aria-label="Settings" icon={<SettingsIcon />} />} align="end">
    <MenuLabel>Label</MenuLabel>
    <MenuItem>Item one</MenuItem>
    <MenuItem>Item two</MenuItem>
    <MenuSeparator />
    <MenuLabel>Label</MenuLabel>
    <MenuItem>Item three</MenuItem>
  </Menu>
);

export const GalleryOverlayTooltip = () => (
  <Tooltip trigger={<Button variant="ghost" iconOnly aria-label="Search" icon={<SearchIcon />} />}>Search</Tooltip>
);

export const GalleryOverlayTooltipShortcut = () => (
  <Tooltip trigger={<Button variant="outline">Button</Button>} side="bottom">Description <Kbd keys={["cmd", "S"]}  size="sm" /></Tooltip>
);
