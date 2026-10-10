/** Real, compact specimens for the component gallery. Framing never rescales controls. */
import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, ReactNode, MouseEvent } from "react";
import { AREA_COLOR_GRID, SliderRange, Alert, AlignmentPicker, Avatar, Calendar, AvatarGroup, Badge, Indicator, IndicatorAnchor, Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, ButtonGroup, Card, CardContent, CardMedia, Checkbox, CheckboxGroup, Chip, Count, ChipGroup, ChipLink, Code, CodeBlock, ColorField, ColorPicker, ColorSwatch, ColorSwatchPicker, Composer, Dialog, Field, Input, InputAction, InputGroup, InputGroupText, Kbd, KbdGroup, Menu, MenuItem, MenuLabel, MenuSeparator, MenuSub, Nav, NavGroup, NavItem, NumberField, Panel, PanelSection, Popover, PopoverBody, PopoverClose, PopoverDescription, PopoverFooter, PopoverHeader, PopoverMedia, PopoverTitle, Progress, Radio, RadioGroup, Segmented, Select, Separator, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Toaster, useToaster, Toolbar, ToolbarGroup, ToolbarItem, ToolbarOverflow, ToolbarSeparator, Tooltip, TreeView, type AlignmentPosition, BoxField, Combobox, CommandPalette, ContextMenu, HoverCard, Message, MessageActions, ModelPicker, PromptSuggestions, ScrollToLatest, SplitButton, PanelRow, PropertyList, PropertyListItem, type BoxValue, type ComboboxOption, type CommandItem, type TreeViewNode } from "@area/react";
import { FluentPanelLeftIcon, FluentRefPointerIcon, FluentFrameIcon, FluentRectangleIcon, FluentPenIcon, FluentTextTIcon, FluentCommentIcon, FluentRefPaintbrushIcon, FluentDesignIcon, FluentPlayIcon, FluentRefCodeIcon, FluentBoldIcon, FluentRefItalicIcon, FluentRefUnderlineIcon, FluentStrikethroughIcon, FluentTextAlignLeftIcon, FluentTextAlignCenterIcon, FluentTextAlignRightIcon, AlignBottomIcon, AlignMiddleIcon, AlignTopIcon, CheckIcon, ChevronIcon, DismissIcon, DocumentIcon, DotsFourIcon, EyeIcon, EyeSlashIcon, FolderIcon, InfoIcon, OpacityIcon, RotateIcon, OpenIcon, PersonSmallIcon, PersonIcon, PlusIcon, SearchIcon, TokenIcon, TrashIcon, EditIcon, ThumbLikeIcon, ThumbDislikeIcon, SpeakerIcon, RegenerateIcon, FluentCopyIcon, AlertIcon, AlignCenterHorizontalIcon, AlignLeftIcon, AlignRightIcon, AngleIcon, AspectRatioIcon, AutoLayoutIcon, BarsThreeIcon, CornerRadiusIcon, CornersIcon, FlipHorizontalIcon, FlipVerticalIcon, FlowFreeIcon, FlowHorizontalIcon, FlowVerticalIcon, FlowWrapIcon, LinkIcon, MoreIcon, SettingsIcon, SlidersIcon, SubtractIcon, FluentRefCalendarIcon } from "../icons.tsx";
import { PilotArrowDownIcon, PilotArrowUpIcon, PilotDocumentIcon, PilotFolderFilledIcon, PilotMoreHorizontalIcon, PilotPaletteIcon, PilotCornerIcon, PilotTextIcon, PilotGridIcon, PilotLayersIcon, PilotSunIcon, PilotListIcon, PilotKanbanIcon } from "../pilot-icons.tsx";
// @ts-expect-error — the docs' own highlighter is authored in JavaScript.
import { highlight } from "../../scripts/layout.mjs";

/* Emphasis roles (DESIGN_SYSTEM.md): a tile shows the accent by scoping the role, not by a tone. */
const ActionAccent = ({ children }: { children: ReactNode }) => <div data-area-action="accent" style={{ display: "contents" }}>{children}</div>;
const SelectionAccent = ({ children }: { children: ReactNode }) => <div data-area-selection="accent" style={{ display: "contents" }}>{children}</div>;

export const GalleryBreadcrumb = () => (
  <Breadcrumb><BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="#gallery-breadcrumb-default">Item one</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="#gallery-breadcrumb-default">Item two</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Item three</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList></Breadcrumb>
);
export const GalleryBreadcrumbCollapsed = () => (
  <Breadcrumb><BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="#gallery-breadcrumb-collapsed">Item one</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbEllipsis items={[{ label: "Item two", href: "#gallery-breadcrumb-collapsed" }, { label: "Item three", href: "#gallery-breadcrumb-collapsed" }]} /></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="#gallery-breadcrumb-collapsed">Item four</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Item five</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList></Breadcrumb>
);
export const GalleryBreadcrumbIcons = () => (
  <Breadcrumb><BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="#gallery-breadcrumb-icons"><FolderIcon /> Projects</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage><DocumentIcon /> Files</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList></Breadcrumb>
);
export const GalleryAlert = () => (
  <Alert icon={<InfoIcon />} title="Title">Body text</Alert>
);
export const GalleryAlertSuccess = () => <Alert tone="success" icon={<CheckIcon />} title="Title">Body text</Alert>;
export const GalleryAlertDanger = () => <Alert tone="danger" icon={<AlertIcon />} title="Title">Body text</Alert>;
export const GalleryAlertLink = () => <Alert icon={<InfoIcon />} title="Title" link={<a href="#gallery-alert-multiline">Link</a>}>Body text</Alert>;
export const GalleryAlertAction = () => <Alert icon={<InfoIcon />} title="Title" action={<Button size="sm" variant="outline">Action</Button>}>Body text</Alert>;
export const GalleryAlertBanner = () => <Alert layout="banner" title="Title" link={<a href="#gallery-alert-layout-banner">Learn more</a>}>Body text</Alert>;
export const GalleryAlertBannerIcon = () => <Alert layout="banner" tone="info" icon={<InfoIcon />} title="Title" link={<a href="#gallery-alert-banner-icon">Learn more</a>}>Body text</Alert>;
export const GalleryAlertBannerStatus = () => <Alert layout="banner" title="Title" action={<Badge variant="solid">Status</Badge>}>Body text</Alert>;
export const GalleryAlertBannerFlush = () => <Alert layout="banner" flush title="Title" link={<a href="#gallery-alert-layout-banner-flush">Learn more</a>}>Body text</Alert>;
export const GalleryAlertBannerDismissible = () => {
  const [open, setOpen] = useState(true);
  return open
    ? <Alert layout="banner" title="Title" action={<Button size="sm">Action</Button>} onDismiss={() => setOpen(false)}>Body text</Alert>
    : <Button size="sm" onClick={() => setOpen(true)}>Show banner</Button>;
};
export const GalleryAlertMultiline = () => <Alert layout="multiline" icon={<InfoIcon />} title="Title">Body text that wraps onto a second line</Alert>;
export const GalleryAlertDismissible = () => {
  const [visible, setVisible] = useState(true);
  return visible ? <Alert icon={<InfoIcon />} title="Title" onDismiss={() => setVisible(false)}>Body text</Alert> : <Button size="sm" variant="outline" onClick={() => setVisible(true)}>Show alert</Button>;
};

export const GalleryAvatar = () => (
  <Avatar fallback="D" alt="David Tee" />
);

export const GalleryAvatarImage = () => <Avatar src="/images/david-tee.jpg" fallback="D" alt="David Tee" />;
export const GalleryAvatarImageFallback = () => <Avatar src="/images/avatar-missing.png" fallback="D" alt="David Tee" />;
export const GalleryAvatarTwoInitials = () => <Avatar fallback="DT" alt="David Tee" />;
export const GalleryAvatarIcon = () => <Avatar icon={<PersonIcon />} alt="David Tee" />;
export const GalleryAvatarGroup = () => <AvatarGroup max={3} aria-label="David Tee and 4 teams"><Avatar src="/images/david-tee.jpg" fallback="DT" alt="David Tee" /><Avatar shape="square" fallback="D" alt="Design team" /><Avatar shape="square" fallback="R" alt="Research team" /><Avatar shape="square" fallback="P" alt="Platform team" /><Avatar shape="square" fallback="S" alt="Support team" /></AvatarGroup>;
export const GalleryAvatarActive = () => <Avatar active fallback="D" alt="David Tee" />;
export const GalleryAvatarAvailability = () => <IndicatorAnchor inset placement="bottom-end" overlap="circular" indicator={<Indicator status="available" size="sm" />}><Avatar fallback="D" role="img" aria-label="David Tee, available" /></IndicatorAnchor>;
export const GalleryAvatarNotification = () => <IndicatorAnchor inset placement="top-end" overlap="circular" indicator={<Indicator count={2} />}><Avatar src="/images/david-tee.jpg" fallback="D" alt="David Tee, 2 notifications" /></IndicatorAnchor>;
export const GalleryAvatarInverse = () => <Avatar tone="inverse" fallback="D" alt="David Tee" />;
export const GalleryAvatarSquare = () => <Avatar shape="square" fallback="D" alt="Design team" />;
export const GalleryAvatarSmall = () => <Avatar size="sm" fallback="D" alt="David Tee" />;
export const GalleryAvatarMedium = () => <Avatar size="md" fallback="D" alt="David Tee" />;
export const GalleryAvatarLarge = () => <Avatar size="lg" fallback="D" alt="David Tee" />;

export const GalleryBadge = () => (
  <Badge tone="success" dot>Badge</Badge>
);

export const GalleryButton = () => (
  <Button>Button</Button>
);

export const GalleryButtonSmall = () => <Button size="sm">Button</Button>;
export const GalleryButtonMedium = () => <Button size="md">Button</Button>;
export const GalleryButtonLarge = () => <Button size="lg">Button</Button>;
export const GalleryButtonActionAccent = () => <ActionAccent><Button>Button</Button></ActionAccent>;
export const GalleryButtonWithIcon = () => <Button icon={<PlusIcon />}>Button</Button>;
export const GalleryButtonTrailingIcon = () => <Button variant="ghost" tone="neutral" trailingIcon={<ChevronIcon />}>Button</Button>;
export const GalleryButtonDisabled = () => <Button disabled>Button</Button>;
export const GalleryButtonLoading = () => <Button loading>Button</Button>;
export const GalleryButtonIconOnly = () => <Button iconOnly icon={<PlusIcon />} aria-label="Add item" />;
export const GalleryButtonPill = () => <Button pill>Button</Button>;
/* Every real toggle is ghost (Toolbar, Button group), so the Selected tile is ghost; a solid
   "selected" equals its hover and is not a supported toggle (audit A-13). */
export const GalleryButtonSelected = () => <Button variant="ghost" selected>Selected</Button>;
export const GalleryButtonAlignStart = () => <div style={{ display: "grid", justifyItems: "start" }}><p style={{ margin: 0 }}>Body text</p><Button variant="ghost" align="start">Button</Button></div>;
export const GalleryButtonAlignEnd = () => <div style={{ display: "grid", justifyItems: "end" }}><p style={{ margin: 0 }}>Body text</p><Button variant="ghost" align="end">Button</Button></div>;
export const GalleryButtonFullWidth = () => <div style={{ inlineSize: "calc(var(--area-space-96) * 3)" }}><Button fullWidth>Button</Button></div>;
export const GalleryButtonShortcut = () => <Button aria-keyshortcuts="Meta+Enter">Button <Kbd keys={["cmd", "enter"]} /></Button>;
/* Split button (docs/specs/split-button.md): one variant per tile; every menu is live. */
const SplitDemo = ({ label, items, ...props }: { label: string; items: string[] } & Omit<Parameters<typeof SplitButton>[0], "children" | "menu">) => {
  const [done, setDone] = useState("");
  return <div>
    <SplitButton {...props} onClick={() => setDone(label)} menu={items.map((item) => <MenuItem key={item} onClick={() => setDone(item)}>{item}</MenuItem>)}>{label}</SplitButton>
    <span className="area-sr-only" role="status">{done}</span>
  </div>;
};
const saveItems = ["Option one", "Option two", "Option three"];
export const GallerySplitButton = () => <SplitDemo label="Action" items={saveItems} menuLabel="More options" />;
export const GallerySplitButtonAccent = () => <ActionAccent><SplitDemo label="Action" items={["Option one", "Option two"]} menuLabel="More options" /></ActionAccent>;
export const GallerySplitButtonSoft = () => <SplitDemo label="Action" variant="soft" tone="neutral" items={saveItems} menuLabel="More options" />;
export const GallerySplitButtonOutline = () => <SplitDemo label="Action" variant="outline" tone="neutral" items={saveItems} menuLabel="More options" />;
export const GallerySplitButtonIcon = () => <SplitDemo label="Add" variant="outline" tone="neutral" icon={<PlusIcon />} items={["Item one", "Item two"]} menuLabel="More to add" />;
export const GallerySplitButtonSmall = () => <SplitDemo label="Action" size="sm" items={saveItems} menuLabel="More options" />;
export const GallerySplitButtonMedium = () => <SplitDemo label="Action" size="md" items={saveItems} menuLabel="More options" />;
export const GallerySplitButtonLarge = () => <SplitDemo label="Action" size="lg" items={saveItems} menuLabel="More options" />;
export const GallerySplitButtonGhostText = () => <SplitDemo label="Action" variant="ghost" tone="neutral" items={saveItems} menuLabel="More options" />;
/* Figma's tool with its menu (figma--split-tool--*): icon-only ghost, the plates 1px apart. */
export const GallerySplitButtonGhostIcon = () => {
  const [tool, setTool] = useState("move");
  return <SplitButton variant="ghost" iconOnly icon={<FluentRefPointerIcon />} selected menuLabel="Move tools"
    menu={([["move", "Move", "V"], ["hand", "Hand tool", "H"], ["scale", "Scale", "K"]] as const).map(([id, label, key]) =>
      <MenuItem key={id} checked={tool === id} shortcut={key} onClick={() => setTool(id)}>{label}</MenuItem>)}>Move</SplitButton>;
};
export const GallerySplitButtonGhostIconRest = () => (
  <SplitButton variant="ghost" iconOnly icon={<FluentFrameIcon />} menuLabel="Frame tools"
    menu={<><MenuItem shortcut="F">Frame</MenuItem><MenuItem shortcut="⇧S">Section</MenuItem></>}>Frame</SplitButton>
);
export const GallerySplitButtonDisabled = () => <SplitDemo label="Action" disabled items={saveItems} menuLabel="More options" />;
export const GalleryButtonGroupCommands = () => {
  const [command, setCommand] = useState("");
  return <div><ButtonGroup aria-label="Vertical alignment"><Button variant="ghost" iconOnly icon={<AlignTopIcon />} aria-label="Align top" onClick={() => setCommand("Aligned top")} /><Button variant="ghost" iconOnly icon={<AlignMiddleIcon />} aria-label="Align middle" onClick={() => setCommand("Aligned middle")} /><Button variant="ghost" iconOnly icon={<AlignBottomIcon />} aria-label="Align bottom" onClick={() => setCommand("Aligned bottom")} /></ButtonGroup><span className="area-sr-only" role="status">{command}</span></div>;
};
export const GalleryButtonGroupText = () => {
  const [pressed, setPressed] = useState(false);
  return <ButtonGroup variant="outline" aria-label="Text options"><Button variant="ghost" selected={pressed} onClick={() => setPressed(!pressed)}>Item one</Button><Button variant="ghost" onClick={() => setPressed(false)}>Item two</Button></ButtonGroup>;
};

/* ButtonGroup variants: one per tile (docs/specs/button-group.md). Each button is its own command. */
const GroupDemo = ({ variant, size, labels, icons, disabledIndex }: { variant?: "soft" | "outline"; size?: "sm" | "md" | "lg"; labels: string[]; icons?: ReactNode[]; disabledIndex?: number }) => {
  const [last, setLast] = useState("");
  return <div><ButtonGroup variant={variant} size={size} aria-label="Formatting">
    {labels.map((label, index) => icons && !label
      ? <Button key={index} variant="ghost" iconOnly icon={icons[index]} aria-label={["Align top", "Align middle", "Align bottom"][index]} disabled={index === disabledIndex} onClick={() => setLast(String(index))} />
      : <Button key={label} variant="ghost" icon={icons?.[index]} disabled={index === disabledIndex} onClick={() => setLast(label)}>{label}</Button>)}
  </ButtonGroup><span className="area-sr-only" role="status">{last}</span></div>;
};
const alignIcons = [<AlignTopIcon key="t" />, <AlignMiddleIcon key="m" />, <AlignBottomIcon key="b" />];
const groupLabels = ["One", "Two", "Three"];
export const GalleryButtonGroupSoftText = () => <GroupDemo labels={groupLabels} />;
export const GalleryButtonGroupOutlineText = () => <GroupDemo variant="outline" labels={groupLabels} />;
export const GalleryButtonGroupOutlineIcons = () => <GroupDemo variant="outline" labels={["", "", ""]} icons={alignIcons} />;
export const GalleryButtonGroupIconLabels = () => <GroupDemo variant="outline" labels={["Copy", "Link"]} icons={[<DocumentIcon key="c" />, <LinkIcon key="l" />]} />;
export const GalleryButtonGroupSmall = () => <GroupDemo size="sm" labels={groupLabels} />;
export const GalleryButtonGroupMedium = () => <GroupDemo size="md" labels={groupLabels} />;
export const GalleryButtonGroupLarge = () => <GroupDemo size="lg" labels={groupLabels} />;
export const GalleryButtonGroupFullWidth = () => <div style={{ inlineSize: "var(--area-space-96)", minInlineSize: "calc(var(--area-space-96) * 3)" }}><ButtonGroup fullWidth aria-label="Options"><Button variant="ghost">One</Button><Button variant="ghost">Two</Button></ButtonGroup></div>;
export const GalleryButtonGroupDisabled = () => <GroupDemo variant="outline" labels={["Undo", "Redo"]} disabledIndex={1} />;
/*
 * Toolbar (docs/specs/toolbar.md): Figma's toolbelt. Each creation tool is an icon-only ghost
 * SplitButton, the tool and its menu of related tools (figma--split-tool--*); the mode switch is a
 * Segmented control. The chosen tool takes Button's selected fill.
 */
const figmaTools = [
  { id: "move", label: "Move", icon: <FluentRefPointerIcon />, menu: [["move", "Move", "V"], ["hand", "Hand tool", "H"], ["scale", "Scale", "K"]] },
  { id: "frame", label: "Frame", icon: <FluentFrameIcon />, menu: [["frame", "Frame", "F"], ["section", "Section", "⇧S"], ["slice", "Slice", "S"]] },
  { id: "rectangle", label: "Rectangle", icon: <FluentRectangleIcon />, menu: [["rectangle", "Rectangle", "R"], ["line", "Line", "L"], ["ellipse", "Ellipse", "O"]] },
  { id: "pen", label: "Pen", icon: <FluentPenIcon />, menu: [["pen", "Pen", "P"], ["pencil", "Pencil", "⇧P"]] },
  { id: "text", label: "Text", icon: <FluentTextTIcon /> },
  { id: "comment", label: "Comment", icon: <FluentCommentIcon /> },
] as const;
const figmaModes = [
  { value: "draw", label: "Draw", icon: <FluentRefPaintbrushIcon /> },
  { value: "design", label: "Design", icon: <FluentDesignIcon /> },
  { value: "prototype", label: "Present", icon: <FluentPlayIcon /> },
  { value: "dev", label: "Code", icon: <FluentRefCodeIcon /> },
];
export const GalleryToolbar = () => {
  const [tool, setTool] = useState("move");
  const [picked, setPicked] = useState<Record<string, string>>({});
  return <Toolbar aria-label="Tools" variant="surface">
    <ToolbarGroup aria-label="Creation tools">
      {figmaTools.map(item => "menu" in item
        ? <SplitButton key={item.id} variant="ghost" iconOnly icon={item.icon} selected={tool === item.id} onClick={() => setTool(item.id)}
            menuLabel={`${item.label} tools`} menu={item.menu.map(([id, label, key]) => <MenuItem key={id} checked={(picked[item.id] ?? item.menu[0][0]) === id} shortcut={key}
              onClick={() => { setPicked(current => ({ ...current, [item.id]: id })); setTool(item.id); }}>{label}</MenuItem>)}>{item.label}</SplitButton>
        : <ToolbarItem key={item.id}><Button variant="ghost" iconOnly icon={item.icon} aria-label={item.label} selected={tool === item.id} onClick={() => setTool(item.id)} /></ToolbarItem>)}
    </ToolbarGroup>
    <ToolbarSeparator />
    <Segmented iconOnly aria-label="Mode" defaultValue="design" items={figmaModes} />
  </Toolbar>;
};
/* Text formatting (owner references, 2026-09-27): soft fields, pressed toggles, alignment as a Segmented control. */
const textStyles = [{ id: "bold", label: "Bold", icon: <FluentBoldIcon /> }, { id: "italic", label: "Italic", icon: <FluentRefItalicIcon /> }, { id: "underline", label: "Underline", icon: <FluentRefUnderlineIcon /> }];
const textAligns = [{ value: "left", label: "Align left", icon: <FluentTextAlignLeftIcon /> }, { value: "center", label: "Align center", icon: <FluentTextAlignCenterIcon /> }, { value: "right", label: "Align right", icon: <FluentTextAlignRightIcon /> }];
export const GalleryToolbarFormatting = () => {
  const [styles, setStyles] = useState<string[]>(["bold"]);
  return <Toolbar aria-label="Text formatting" variant="surface">
    <ToolbarGroup aria-label="Font">
      <ToolbarItem><Select variant="soft" aria-label="Font" defaultValue="inter-semibold"><option value="inter-regular">Inter · Regular</option><option value="inter-semibold">Inter · Semibold</option><option value="geist-regular">Geist · Regular</option></Select></ToolbarItem>
      <ToolbarItem><Select variant="soft" aria-label="Font size" defaultValue="14"><option value="12">12px</option><option value="14">14px</option><option value="16">16px</option></Select></ToolbarItem>
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarGroup aria-label="Style">
      {textStyles.map(item => <ToolbarItem key={item.id}><Button variant="ghost" iconOnly icon={item.icon} aria-label={item.label} selected={styles.includes(item.id)}
        onClick={() => setStyles(list => list.includes(item.id) ? list.filter(id => id !== item.id) : [...list, item.id])} /></ToolbarItem>)}
    </ToolbarGroup>
    <ToolbarSeparator />
    <Segmented iconOnly aria-label="Alignment" defaultValue="left" items={textAligns} />
  </Toolbar>;
};
export const GalleryToolbarFullWidth = () => (
  <div style={{ inlineSize: "calc(var(--area-space-96) * 4)" }}>
    <Toolbar aria-label="Vertical alignment" variant="surface" fullWidth>
      <ToolbarItem><Button variant="ghost" iconOnly icon={<AlignTopIcon />} aria-label="Align top" /></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly icon={<AlignMiddleIcon />} aria-label="Align middle" /></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly icon={<AlignBottomIcon />} aria-label="Align bottom" /></ToolbarItem>
    </Toolbar>
  </div>
);
export const GalleryToolbarPlain = () => (
  <Toolbar aria-label="Editing commands">
    <ToolbarGroup aria-label="Text style">
      <ToolbarItem><Button variant="ghost" iconOnly icon={<FluentBoldIcon />} aria-label="Bold" selected /></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly icon={<FluentRefItalicIcon />} aria-label="Italic" /></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly icon={<FluentRefUnderlineIcon />} aria-label="Underline" /></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly icon={<FluentStrikethroughIcon />} aria-label="Strikethrough" /></ToolbarItem>
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarItem><Button variant="ghost" iconOnly icon={<LinkIcon />} aria-label="Link" /></ToolbarItem>
  </Toolbar>
);
export const GalleryToolbarVertical = () => (
  <Toolbar orientation="vertical" variant="surface" aria-label="Arrange vertically">
    <ToolbarGroup aria-label="Vertical alignment">
      <ToolbarItem><Button variant="ghost" iconOnly icon={<AlignTopIcon />} aria-label="Align top" selected /></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly icon={<AlignMiddleIcon />} aria-label="Align middle" /></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly icon={<AlignBottomIcon />} aria-label="Align bottom" /></ToolbarItem>
    </ToolbarGroup>
  </Toolbar>
);
export const GalleryToolbarSizes = () => (
  <div style={{ display: "grid", gap: "var(--area-space-16)", justifyItems: "start" }}>
  {(["sm", "md", "lg"] as const).map(size => <Toolbar key={size} size={size} variant="surface" aria-label={`${size} toolbar`}>
    <ToolbarGroup aria-label="Style">
      <ToolbarItem><Button variant="ghost" iconOnly icon={<FluentBoldIcon />} aria-label="Bold" selected /></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly icon={<FluentRefItalicIcon />} aria-label="Italic" /></ToolbarItem>
    </ToolbarGroup>
    <ToolbarSeparator />
    <Segmented iconOnly aria-label="Alignment" defaultValue="left" items={textAligns} />
  </Toolbar>)}
  </div>
);
export const GalleryToolbarOverflow = () => {
  const [command, setCommand] = useState("");
  return <div>
    <Toolbar aria-label="Arrange objects" variant="surface">
      <ToolbarGroup aria-label="Vertical alignment">
        <ToolbarItem><Button variant="ghost" iconOnly icon={<AlignTopIcon />} aria-label="Align top" onClick={() => setCommand("Aligned top")} /></ToolbarItem>
        <ToolbarItem><Button variant="ghost" iconOnly icon={<AlignMiddleIcon />} aria-label="Align middle" onClick={() => setCommand("Aligned middle")} /></ToolbarItem>
        <ToolbarItem><Button variant="ghost" iconOnly icon={<AlignBottomIcon />} aria-label="Align bottom" onClick={() => setCommand("Aligned bottom")} /></ToolbarItem>
      </ToolbarGroup>
      <ToolbarOverflow>
        <MenuItem onClick={() => setCommand("Item one")}>Item one</MenuItem>
        <MenuItem onClick={() => setCommand("Deleted")}>Delete</MenuItem>
      </ToolbarOverflow>
    </Toolbar>
    <span className="area-sr-only" role="status">{command}</span>
  </div>;
};
/* One size per tile (owner, 2026-09-27: "always split sizes up into their own container"). */
export const GalleryColorSwatchPickerSizeSm = () => (
  <ColorSwatchPicker label="sm palette" size="sm" layout="row" defaultValue="#BF8C02" items={[
    { value: "#BF8C02", label: "Yellow 500" }, { value: "#00A797", label: "Teal" }, { value: "#8D4DF3", label: "Violet" },
  ]} />
);
export const GalleryColorFieldSizeSm = () => (
  <Field label="Fill"><ColorField size="sm" defaultValue="#00A797" /></Field>
);
export const GalleryColorSwatchSizeSm = () => (
  <ColorSwatch color="#00A797" size="sm" />
);
export const GalleryToolbarSizeSm = () => (
  <Toolbar size="sm" variant="surface" aria-label="Text formatting">
    <ToolbarGroup aria-label="Style">
      <ToolbarItem><Button variant="ghost" iconOnly icon={<FluentBoldIcon />} aria-label="Bold" selected /></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly icon={<FluentRefItalicIcon />} aria-label="Italic" /></ToolbarItem>
    </ToolbarGroup>
    <ToolbarSeparator />
    <Segmented iconOnly aria-label="Alignment" defaultValue="left" items={textAligns} />
  </Toolbar>
);
export const GalleryColorSwatchPickerSizeMd = () => (
  <ColorSwatchPicker label="md palette" size="md" layout="row" defaultValue="#BF8C02" items={[
    { value: "#BF8C02", label: "Yellow 500" }, { value: "#00A797", label: "Teal" }, { value: "#8D4DF3", label: "Violet" },
  ]} />
);
export const GalleryColorFieldSizeMd = () => (
  <Field label="Fill"><ColorField size="md" defaultValue="#00A797" /></Field>
);
export const GalleryColorSwatchSizeMd = () => (
  <ColorSwatch color="#00A797" size="md" />
);
export const GalleryToolbarSizeMd = () => (
  <Toolbar size="md" variant="surface" aria-label="Text formatting">
    <ToolbarGroup aria-label="Style">
      <ToolbarItem><Button variant="ghost" iconOnly icon={<FluentBoldIcon />} aria-label="Bold" selected /></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly icon={<FluentRefItalicIcon />} aria-label="Italic" /></ToolbarItem>
    </ToolbarGroup>
    <ToolbarSeparator />
    <Segmented iconOnly aria-label="Alignment" defaultValue="left" items={textAligns} />
  </Toolbar>
);
export const GalleryColorSwatchPickerSizeLg = () => (
  <ColorSwatchPicker label="lg palette" size="lg" layout="row" defaultValue="#BF8C02" items={[
    { value: "#BF8C02", label: "Yellow 500" }, { value: "#00A797", label: "Teal" }, { value: "#8D4DF3", label: "Violet" },
  ]} />
);
export const GalleryColorFieldSizeLg = () => (
  <Field label="Fill"><ColorField size="lg" defaultValue="#00A797" /></Field>
);
export const GalleryColorSwatchSizeLg = () => (
  <ColorSwatch color="#00A797" size="lg" />
);
export const GalleryToolbarSizeLg = () => (
  <Toolbar size="lg" variant="surface" aria-label="Text formatting">
    <ToolbarGroup aria-label="Style">
      <ToolbarItem><Button variant="ghost" iconOnly icon={<FluentBoldIcon />} aria-label="Bold" selected /></ToolbarItem>
      <ToolbarItem><Button variant="ghost" iconOnly icon={<FluentRefItalicIcon />} aria-label="Italic" /></ToolbarItem>
    </ToolbarGroup>
    <ToolbarSeparator />
    <Segmented size="lg" iconOnly aria-label="Alignment" defaultValue="left" items={textAligns} />
  </Toolbar>
);
/* The picker fills its parent (2026-10-04); demos frame it at Figma's Layout column, 88 wide (88 x 56). */
const AlignmentFrame = ({ children }: { children: ReactNode }) => <div style={{ inlineSize: "88px" }}>{children}</div>;
export const GalleryAlignmentPickerDefault = () => <AlignmentFrame><AlignmentPicker label="Object alignment" /></AlignmentFrame>;
export const GalleryAlignmentPicker = () => {
  const [position, setPosition] = useState<AlignmentPosition>("center");
  return <div style={{ display: "flex", alignItems: "center", gap: "var(--area-space-16)" }}>
    <AlignmentFrame><AlignmentPicker label="Object alignment" value={position} onValueChange={setPosition} /></AlignmentFrame>
    <span role="status">{position.replace("-", " ")}</span>
  </div>;
};
/** Hover previews the position under the pointer (Figma's alignment grid). */
export const GalleryAlignmentPickerHover = () => <AlignmentFrame><AlignmentPicker label="Object alignment" defaultValue="top-left" data-preview="bottom-right" /></AlignmentFrame>;
export const GalleryAlignmentPickerPlain = () => <AlignmentFrame><AlignmentPicker label="Image anchor" variant="plain" defaultValue="top-left" /></AlignmentFrame>;
export const GalleryAlignmentPickerDisabled = () => <AlignmentFrame><AlignmentPicker label="Locked position" defaultValue="bottom-right" disabled /></AlignmentFrame>;
export const GalleryAlignmentPickerForm = () => {
  const [submitted, setSubmitted] = useState("");
  return <form onReset={() => setSubmitted("")} onSubmit={event => {
    event.preventDefault();
    setSubmitted(String(new FormData(event.currentTarget).get("alignment") ?? ""));
  }} style={{ display: "flex", alignItems: "center", gap: "var(--area-space-12)" }}>
    <AlignmentFrame><AlignmentPicker label="Saved alignment" name="alignment" defaultValue="top-left" /></AlignmentFrame>
    <Button type="reset" variant="ghost" size="sm">Reset</Button>
    <Button type="submit" variant="soft" size="sm">Apply</Button>
    <output>{submitted}</output>
  </form>;
};
export const GalleryColorField = () => <Field label="Fill"><ColorField defaultValue="#8D4DF3" /></Field>;
export const GalleryColorFieldFullWidth = () => <div style={{ inlineSize: "calc(var(--area-space-96) * 3)" }}><Field label="Fill"><ColorField fullWidth defaultValue="#8D4DF3" /></Field></div>;
export const GalleryColorFieldAlpha = () => <Field label="Overlay"><ColorField alpha variant="soft" defaultValue="#8D4DF380" /></Field>;
export const GalleryColorFieldControlled = () => {
  const [color, setColor] = useState("#EA7401");
  return <div style={{ display: "flex", alignItems: "center", gap: "var(--area-space-16)" }}>
    <Field label="Accent"><ColorField value={color} onValueChange={setColor} /></Field>
    <ColorSwatch color={color} size="lg" />
  </div>;
};
export const GalleryColorFieldSizes = () => (
  <div style={{ display: "flex", alignItems: "end", gap: "var(--area-space-16)" }}>
    {(["sm", "md", "lg"] as const).map(size => <Field key={size} label={size}><ColorField size={size} defaultValue="#00A797" /></Field>)}
  </div>
);
export const GalleryColorFieldDisabled = () => <Field label="Locked fill"><ColorField defaultValue="#00A797" disabled /></Field>;
export const GalleryColorFieldForm = () => {
  const [submitted, setSubmitted] = useState("");
  return <form onReset={() => setSubmitted("")} onSubmit={event => {
    event.preventDefault();
    setSubmitted(String(new FormData(event.currentTarget).get("fill") ?? ""));
  }} style={{ display: "flex", alignItems: "end", gap: "var(--area-space-12)" }}>
    <Field label="Fill"><ColorField alpha name="fill" defaultValue="#00A797" required /></Field>
    <Button type="reset" variant="ghost" size="sm">Reset</Button>
    <Button type="submit" variant="soft" size="sm">Apply</Button>
    <output>{submitted}</output>
  </form>;
};
export const GalleryColorSwatch = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--area-space-16)" }}>
    <ColorSwatch color="#8D4DF3" />
    <ColorSwatch color="#8D4DF380" />
    <ColorSwatch color="#00000000" />
  </div>
);
export const GalleryColorSwatchSizes = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--area-space-16)" }}>
    {(["sm", "md", "lg"] as const).map(size => <ColorSwatch key={size} color="#00A797" size={size} />)}
  </div>
);
export const GalleryColorSwatchPicker = () => (
<ColorSwatchPicker label="Fill color" name="fill" defaultValue="#8D4DF3" items={[
  { value: "#E80945", label: "Red 500" }, { value: "#EA7401", label: "Orange 500" },
  { value: "#BF8C02", label: "Yellow 500" }, { value: "#01AA4E", label: "Green 500" },
  { value: "#00A797", label: "Teal" }, { value: "#006DF5", label: "Blue 500" },
  { value: "#5C5DFE", label: "Indigo" }, { value: "#8D4DF3", label: "Violet" },
  { value: "#DF127D", label: "Pink 500" }, { value: "#03A0C8", label: "Cyan 500" },
  { value: "#717579", label: "Cool 500" }, { value: "#747474", label: "Neutral 500" },
]} />
);
export const GalleryColorSwatchPickerPalette = () => {
  const [color, setColor] = useState("#006DF5");
  return <div style={{ inlineSize: "calc(var(--area-space-96) * 2 + var(--area-space-32))", maxInlineSize: "100%" }}>
    <ColorSwatchPicker label="Area palette" layout="palette" columns={AREA_COLOR_GRID.columns} items={AREA_COLOR_GRID.options} value={color} onValueChange={setColor} />
  </div>;
};
export const GalleryColorSwatchPickerRow = () => (
<ColorSwatchPicker label="Overlay color" layout="row" defaultValue="#8D4DF380" items={[
  { value: "#8D4DF3", label: "Solid violet" }, { value: "#8D4DF3C0", label: "Violet at 75%" },
  { value: "#8D4DF380", label: "Violet at 50%" }, { value: "#8D4DF340", label: "Violet at 25%" },
  { value: "#00000000", label: "Transparent" },
]} />
);
export const GalleryColorSwatchPickerSizes = () => (
<div style={{ display: "flex", alignItems: "center", gap: "var(--area-space-16)" }}>
  {(["sm", "md", "lg"] as const).map(size => <ColorSwatchPicker key={size} label={`${size} palette`} size={size} layout="row" defaultValue="#BF8C02" items={[
    { value: "#BF8C02", label: "Yellow 500" }, { value: "#00A797", label: "Teal" }, { value: "#8D4DF3", label: "Violet" },
  ]} />)}
</div>
);
export const GalleryColorSwatchPickerForm = () => {
  const [submitted, setSubmitted] = useState("");
  return <form onReset={() => setSubmitted("")} onSubmit={event => {
    event.preventDefault();
    setSubmitted(String(new FormData(event.currentTarget).get("theme-color") ?? ""));
  }} style={{ display: "flex", alignItems: "center", gap: "var(--area-space-12)" }}>
    <ColorSwatchPicker label="Theme color" name="theme-color" defaultValue="#00A797" layout="row" required items={[
      { value: "#00A797", label: "Teal" }, { value: "#8D4DF3", label: "Violet" },
      { value: "#BF8C02", label: "Yellow 500" }, { value: "#E80945", label: "Red 500", disabled: true },
    ]} />
    <Button type="reset" variant="ghost" size="sm">Reset</Button>
    <Button type="submit" variant="soft" size="sm">Apply</Button>
    <output>{submitted}</output>
  </form>;
};
export const GalleryButtonNeutralSolid = () => <Button tone="neutral">Button</Button>;
export const GalleryButtonNeutralSoft = () => <Button tone="neutral" variant="soft">Button</Button>;
export const GalleryButtonNeutralOutline = () => <Button tone="neutral" variant="outline">Button</Button>;
export const GalleryButtonNeutralGhost = () => <Button tone="neutral" variant="ghost">Button</Button>;
export const GalleryButtonInfoSolid = () => <Button tone="info">Button</Button>;
export const GalleryButtonInfoSoft = () => <Button tone="info" variant="soft">Button</Button>;
export const GalleryButtonInfoOutline = () => <Button tone="info" variant="outline">Button</Button>;
export const GalleryButtonInfoGhost = () => <Button tone="info" variant="ghost">Button</Button>;
export const GalleryButtonSuccessSolid = () => <Button tone="success">Button</Button>;
export const GalleryButtonSuccessSoft = () => <Button tone="success" variant="soft">Button</Button>;
export const GalleryButtonSuccessOutline = () => <Button tone="success" variant="outline">Button</Button>;
export const GalleryButtonSuccessGhost = () => <Button tone="success" variant="ghost">Button</Button>;
export const GalleryButtonWarningSolid = () => <Button tone="warning">Button</Button>;
export const GalleryButtonWarningSoft = () => <Button tone="warning" variant="soft">Button</Button>;
export const GalleryButtonWarningOutline = () => <Button tone="warning" variant="outline">Button</Button>;
export const GalleryButtonWarningGhost = () => <Button tone="warning" variant="ghost">Button</Button>;
export const GalleryButtonCautionSolid = () => <Button tone="caution">Button</Button>;
export const GalleryButtonCautionSoft = () => <Button tone="caution" variant="soft">Button</Button>;
export const GalleryButtonCautionOutline = () => <Button tone="caution" variant="outline">Button</Button>;
export const GalleryButtonCautionGhost = () => <Button tone="caution" variant="ghost">Button</Button>;
export const GalleryButtonDangerSolid = () => <Button tone="danger">Button</Button>;
export const GalleryButtonDangerSoft = () => <Button tone="danger" variant="soft">Button</Button>;
export const GalleryButtonDangerOutline = () => <Button tone="danger" variant="outline">Button</Button>;
export const GalleryButtonDangerGhost = () => <Button tone="danger" variant="ghost">Button</Button>;
export const GalleryButtonDiscoverySolid = () => <Button tone="discovery">Button</Button>;
export const GalleryButtonDiscoverySoft = () => <Button tone="discovery" variant="soft">Button</Button>;
export const GalleryButtonDiscoveryOutline = () => <Button tone="discovery" variant="outline">Button</Button>;
export const GalleryButtonDiscoveryGhost = () => <Button tone="discovery" variant="ghost">Button</Button>;


export const GalleryCheckbox = () => (
  <Checkbox label="Label" defaultChecked />
);

export const GalleryCheckboxMedium = () => <Checkbox size="md" label="Medium" />;
export const GalleryCheckboxLarge = () => <Checkbox size="lg" label="Large" />;
export const GalleryCheckboxSelected = () => <Checkbox label="Label" defaultChecked />;
export const GalleryCheckboxIndeterminate = () => <Checkbox label="Label" indeterminate />;
export const GalleryCheckboxCaption = () => <Checkbox label="Label" caption="Description" />;
export const GalleryCheckboxLeadingVisual = () => <Checkbox label="Label" leadingVisual={<CheckIcon />} />;
/* Checkbox and Radio cards (owner, 2026-09-28: references with the control at the end and a
   chosen card outlined). One layout per tile. */
export const GalleryCheckboxCard = () => (
  <CheckboxGroup label="Label" style={{ inlineSize: "320px" }}>
    <Checkbox variant="card" label="Item one" caption="Description" leadingVisual={<PersonIcon />} defaultChecked />
    <Checkbox variant="card" label="Item two" caption="Description" leadingVisual={<DocumentIcon />} />
  </CheckboxGroup>
);
export const GalleryCheckboxCardTile = () => (
  <CheckboxGroup label="Customize" style={{ inlineSize: "520px" }}>
    <Checkbox variant="card" layout="tile" label="Colors" leadingVisual={<PilotPaletteIcon size={20} />} defaultChecked />
    <Checkbox variant="card" layout="tile" label="Corners" leadingVisual={<PilotCornerIcon size={20} />} />
    <Checkbox variant="card" layout="tile" label="Typography" leadingVisual={<PilotTextIcon size={20} />} />
    <Checkbox variant="card" layout="tile" label="Spacing" leadingVisual={<PilotGridIcon size={20} />} />
    <Checkbox variant="card" layout="tile" label="Layers" leadingVisual={<PilotLayersIcon size={20} />} defaultChecked />
    <Checkbox variant="card" layout="tile" label="Theming" leadingVisual={<PilotSunIcon size={20} />} />
  </CheckboxGroup>
);
export const GalleryCheckboxCardAccent = () => (
  <SelectionAccent><CheckboxGroup label="Label" style={{ inlineSize: "320px" }}>
    <Checkbox variant="card" label="Item one" caption="Description" leadingVisual={<PersonIcon />} defaultChecked />
    <Checkbox variant="card" label="Item two" caption="Description" leadingVisual={<DocumentIcon />} />
  </CheckboxGroup></SelectionAccent>
);
export const GalleryCheckboxInvalid = () => <Checkbox label="Label" invalid />;
export const GalleryCheckboxInvalidChecked = () => <Checkbox label="Label" defaultChecked invalid />;
export const GalleryCheckboxDisabled = () => <Checkbox label="Label" disabled />;
export const GalleryCheckboxDisabledChecked = () => <Checkbox label="Label" defaultChecked disabled />;
export const GalleryCheckboxDisabledIndeterminate = () => <Checkbox label="Label" indeterminate disabled />;
export const GalleryCheckboxGroup = () => (
  <CheckboxGroup label="Label" description="Description">
    <Checkbox name="gallery-notifications" value="one" label="Option one" defaultChecked />
    <Checkbox name="gallery-notifications" value="two" label="Option two" />
  </CheckboxGroup>
);
export const GalleryCheckboxGroupInvalid = () => (
  <CheckboxGroup label="Label" error="Error message">
    <Checkbox name="gallery-items" value="one" label="Option one" />
    <Checkbox name="gallery-items" value="two" label="Option two" />
  </CheckboxGroup>
);
export const GalleryCheckboxGroupSuccess = () => (
  <CheckboxGroup label="Label" validation="Success message" validationStatus="success">
    <Checkbox name="gallery-release-notes" value="one" label="Option one" defaultChecked />
    <Checkbox name="gallery-release-notes" value="two" label="Option two" defaultChecked />
  </CheckboxGroup>
);

export const GalleryChip = () => (
  <Chip>Chip</Chip>
);

/** Follows the radius setting instead of a pill (2026-10-03). */
export const GalleryChipRounded = () => <Chip pill={false}>Chip</Chip>;
export const GalleryChipSmall = () => <Chip size="sm">Chip</Chip>;
export const GalleryChipMedium = () => <Chip size="md">Chip</Chip>;
export const GalleryChipLarge = () => <Chip size="lg">Chip</Chip>;
export const GalleryChipSwatch = () => <Chip swatch="var(--area-indigo-500)">Indigo</Chip>;
export const GalleryChipIcon = () => <Chip icon={<CheckIcon />}>Chip</Chip>;
export const GalleryChipDisabled = () => <Chip disabled>Chip</Chip>;
export const GalleryChipGroup = () => <ChipGroup aria-label="Filters"><Chip defaultSelected>Item one</Chip><Chip>Item two</Chip><Chip>Item three</Chip></ChipGroup>;
export const GalleryChipAssist = () => <Chip kind="assist" icon={<SearchIcon />}>Assist</Chip>;
export const GalleryChipFilter = () => <Chip icon={<CheckIcon />}>Filter</Chip>;
export const GalleryChipInput = () => <Chip kind="input">Input</Chip>;
export const GalleryChipSuggestion = () => <Chip kind="suggestion">Suggestion</Chip>;
export const GalleryChipDelete = () => <Chip kind="input" onDismiss={() => {}}>Chip</Chip>;
export const GalleryChipClickableDelete = () => <Chip kind="input" clickable onClick={() => {}} onDismiss={() => {}}>Chip</Chip>;
export const GalleryChipCustomDelete = () => <Chip kind="input" onDismiss={() => {}} dismissIcon={<TrashIcon />} dismissLabel="Delete">Chip</Chip>;
export const GalleryChipLinkUnderline = () => <ChipLink href="#gallery-section-chip">Link</ChipLink>;
export const GalleryChipLinkIcon = () => <ChipLink href="#gallery-section-chip" treatment="icon" trailingIcon={<OpenIcon />}>Link out</ChipLink>;
export const GalleryChipAvatarInitials = () => <Chip avatar={<Avatar fallback="DT" alt="" />}>David Tee</Chip>;
export const GalleryChipAvatarPhoto = () => <Chip avatar={<Avatar src="/images/david-tee.jpg" alt="" />}>David Tee</Chip>;
export const GalleryChipImageFilter = () => <Chip image="/images/chip-pixels.png" imageAlt="">Image</Chip>;
export const GalleryChipInvalid = () => <Chip kind="input" invalid onDismiss={() => {}}>Chip</Chip>;

export const GalleryCode = () => <Code>Code</Code>;
export const CodeSubtle = () => <Code subtle>Code</Code>;
export const CodeOnColor = () => <div style={{ alignSelf: "stretch", blockSize: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", inlineSize: "100%", background: "var(--area-accent-solid)", borderRadius: "var(--area-radius-container)", color: "var(--area-fg-on-accent)", padding: "var(--area-space-24)" }}><Code onColor>Code</Code></div>;
export const CodeTokenSwatch = () => <Code swatch="var(--area-accent-solid)">--area-accent-solid</Code>;

export const CodeInTable = () => (
  <Table aria-label="Table">
    <thead><tr><th>Label</th><th>Value</th><th>Shortcut</th></tr></thead>
    <tbody>
      <tr><td>Item one</td><td><Code>npm run build</Code></td><td><Kbd keys={["cmd", "B"]} /></td></tr>
      <tr><td>Item two</td><td><Code>npm test</Code></td><td><Kbd keys={["cmd", "T"]} /></td></tr>
    </tbody>
  </Table>
);

/*
 * Code block variants.
 *
 * Every demo is a standalone snippet, so each one carries its own sample rather than
 * sharing a module-level constant the reader would have to go and find. The samples are
 * pre-highlighted with the same build-time highlighter the documentation chrome uses,
 * which is what the `html` prop is for.
 */
export const CodeBlockDefault = () => (
  <CodeBlock
    title="example.tsx"
    language="tsx"
    style={{ inlineSize: "100%" }}
    html={highlight('import { Button } from "@area/react";\n\nexport function Example() {\n  return <Button>Button</Button>;\n}')}
  />
);

export const CodeBlockPlain = () => (
  <CodeBlock
    style={{ inlineSize: "100%" }}
    html={highlight('const value = "Code";\nconsole.log(value);')}
  />
);

export const CodeBlockHighlighted = () => (
  <CodeBlock
    title="example.tsx"
    language="tsx"
    highlightLines={[3, 4]}
    style={{ inlineSize: "100%" }}
    html={highlight('import { Button } from "@area/react";\n\nexport function Example() {\n  return <Button>Button</Button>;\n}')}
  />
);

export const CodeBlockDiff = () => (
  <CodeBlock
    title="theme.ts"
    language="ts"
    marks={{ 2: "removed", 3: "added" }}
    style={{ inlineSize: "100%" }}
    html={highlight('export const theme = {\n  accent: "indigo",\n  accent: "purple",\n  radius: "8",\n};')}
  />
);

export const CodeBlockLinked = () => (
  <CodeBlock
    title="example.tsx"
    language="tsx"
    linkLines
    highlightLines={[4]}
    style={{ inlineSize: "100%" }}
    html={highlight('import { Button } from "@area/react";\n\nexport function Example() {\n  return <Button>Button</Button>;\n}')}
  />
);

export const CodeBlockLanguages = () => {
  const [language, setLanguage] = useState("tsx");
  const samples: Record<string, string> = {
    tsx: 'import { Button } from "@area/react";\n\nexport function Example() {\n  return <Button>Button</Button>;\n}',
    css: ".area-button {\n  border-radius: var(--area-radius-control);\n}",
  };
  return <CodeBlock title="example.tsx" languages={["tsx", "css"]} value={language} onValueChange={setLanguage} html={highlight(samples[language]!)} style={{ inlineSize: "100%" }} />;
};

export const CodeBlockLanguageTabs = () => {
  const [language, setLanguage] = useState("tsx");
  const samples: Record<string, string> = {
    tsx: 'import { Button } from "@area/react";\n\nexport function Example() {\n  return <Button>Button</Button>;\n}',
    css: ".area-button {\n  border-radius: var(--area-radius-control);\n}",
  };
  return <CodeBlock title="example.tsx" languages={["tsx", "css"]} languageTabs value={language} onValueChange={setLanguage} html={highlight(samples[language]!)} style={{ inlineSize: "100%" }} />;
};

export const CodeBlockUnnumbered = () => (
  <CodeBlock
    title="example.tsx"
    language="tsx"
    lineNumbers={false}
    style={{ inlineSize: "100%" }}
    html={highlight('import { Button } from "@area/react";\n\nexport function Example() {\n  return <Button>Button</Button>;\n}')}
  />
);

export const CodeBlockWrap = () => (
  <CodeBlock
    wrap
    style={{ inlineSize: "100%" }}
    code={'// A comment long enough to wrap to the available width.\nconst value = "Placeholder";'}
  />
);

export const CodeBlockCollapsed = () => (
  <CodeBlock
    title="example.tsx"
    language="tsx"
    collapsible
    defaultCollapsed
    style={{ inlineSize: "100%" }}
    html={highlight('import { Button } from "@area/react";\n\nexport function Example() {\n  return (\n    <div>\n      <Button>Button</Button>\n      <Button variant="soft">Button</Button>\n      <Button variant="outline">Button</Button>\n      <Button variant="ghost">Button</Button>\n      <Button disabled>Button</Button>\n    </div>\n  );\n}')}
  />
);

export const CodeBlockFlush = () => <CodeBlock flush code={'export default value;'} />;

export const GalleryDialog = () => (
  <Dialog role="group" aria-modal={undefined} title="Title" description="Description"
    footer={<><Button variant="ghost">Cancel</Button><Button>Action</Button></>}
    style={{ inlineSize: "100%" }} />
);
export const GalleryDialogNoClose = () => <Dialog role="group" aria-modal={undefined} showCloseButton={false} title="Title" description="Description" footer={<Button>Action</Button>} style={{ inlineSize: "100%" }} />;
export const GalleryDialogForm = () => <Dialog role="group" aria-modal={undefined} title="Title" description="Description" style={{ inlineSize: "100%" }} footer={<><Button variant="ghost">Cancel</Button><Button>Action</Button></>}><Field label="Label"><Input fullWidth placeholder="Placeholder" /></Field></Dialog>;
export const GalleryDialogScrollable = () => <Dialog role="group" aria-modal={undefined} title="Title" description="Description" footer={<Button>Action</Button>} style={{ inlineSize: "100%", maxBlockSize: "calc(var(--area-space-96) * 3)" }}><div style={{ display: "grid", gap: "var(--area-space-12)" }}>{Array.from({ length: 8 }, (_, index) => <p key={index} style={{ margin: 0 }}>Body text {index + 1}</p>)}</div></Dialog>;
/* Footer actions close the enclosing native dialog; an app would act first. */
const closeDialog = (event: MouseEvent<HTMLButtonElement>) => event.currentTarget.closest("dialog")?.close();
/* Modal: the trigger opens a native modal dialog; the close, Escape or a click on the scrim closes it. */
export const GalleryDialogModal = () => (
  <Dialog trigger={<Button variant="outline" tone="neutral">Open dialog</Button>} title="Title" description="Description"
    footer={<><Button variant="ghost" onClick={closeDialog}>Cancel</Button><Button onClick={closeDialog}>Action</Button></>}>Body text</Dialog>
);

export const GalleryField = () => (
  <Field label="Label" description="Description">
    <Input type="email" placeholder="Placeholder" />
  </Field>
);

export const GalleryFieldSmall = () => <Field label="Label"><Input size="sm" placeholder="Small" /></Field>;
export const GalleryFieldMedium = () => <Field label="Label"><Input size="md" placeholder="Medium" /></Field>;
export const GalleryFieldLarge = () => <Field label="Label"><Input size="lg" placeholder="Large" /></Field>;

export const GalleryInput = () => (
  <Input aria-label="Label" leadingIcon={<SearchIcon />} placeholder="Placeholder" />
);

export const GalleryInputSmall = () => <Input size="sm" aria-label="Label" placeholder="Small" />;
export const GalleryInputMedium = () => <Input size="md" aria-label="Label" placeholder="Medium" />;
export const GalleryInputLarge = () => <Input size="lg" aria-label="Label" placeholder="Large" />;
export const GalleryInputText = () => <Field label="Label"><Input defaultValue="Value" /></Field>;
export const GalleryInputSearch = () => <Field label="Search"><Input type="search" leadingIcon={<SearchIcon />} placeholder="Search" /></Field>;
/*
 * A date field built from the system's own parts (owner, 2026-09-28: "use the real one"): the
 * Input shows the date and opens Calendar in a Popover anchored to the whole field, and the
 * calendar glyph is a trailing icon in the shared icon slot. Field's ids reach the Input.
 */
const formatDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const DateInput = ({ defaultValue, ...field }: { defaultValue: string } & Record<string, unknown>) => {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const shell = useRef<HTMLElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const surface = useRef<HTMLDivElement | null>(null);
  // Open on the chosen day, the grid's roving stop, rather than the first button (Previous month).
  useEffect(() => { if (open) surface.current?.querySelector<HTMLElement>("[role=grid] [tabindex='0']")?.focus(); }, [open]);
  return <Popover ref={surface} open={open} onOpenChange={setOpen} anchor={shell} align="start" aria-label="Choose date"
    trigger={<Input {...field} ref={(node: HTMLInputElement | null) => { input.current = node; shell.current = node?.closest(".area-input") ?? null; }}
      readOnly value={formatDate(value)} trailingIcon={<FluentRefCalendarIcon />}
      /* A text input is not a popover invoker: open it here rather than through popovertarget. */
      onClick={event => { event.preventDefault(); setOpen(true); }}
      onKeyDown={event => { if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpen(true); } }} />}>
    <Calendar variant="plain" aria-label="Date" today={calendarToday} value={value} onValueChange={next => { if (next) setValue(next as string); setOpen(false); input.current?.focus(); }} />
  </Popover>;
};
export const GalleryInputDate = () => <Field label="Date"><DateInput defaultValue="2026-09-23" /></Field>;
export const GalleryInputPhone = () => <Field label="Phone"><Input type="tel" prefix="+1" defaultValue="1" autoComplete="tel" /></Field>;
export const GalleryInputPassword = () => {
  const [visible, setVisible] = useState(false);
  return <Field label="Password"><Input type={visible ? "text" : "password"} defaultValue="AreaDesign" trailingAction={<InputAction icon={visible ? <EyeSlashIcon /> : <EyeIcon />} tooltip={visible ? "Hide password" : "Show password"} onClick={() => setVisible(!visible)} />} /></Field>;
};
/* Figma's collapsed "Selection colors" summary: 16px chips and a muted count. */
const SelectionColors = () => <><ColorSwatch color="#FFFFFF" size="sm" /><ColorSwatch color="#0055FF" size="sm" /><ColorSwatch color="#FFB800" size="sm" /><span>+2</span></>;
export const GalleryPanelCollapsible = () => (
  <Panel size="sm" title="Frame" aria-label="Collapsible sections">
    <PanelSection collapsible heading="Layout" actions={inspectorButton("Add auto layout", <AutoLayoutIcon />)}>
      <PanelRow label="Dimensions">
        <NumberField size="sm" variant="soft" fullWidth aria-label="Width" defaultValue={320} grouping={false} scrub="W" />
        <NumberField size="sm" variant="soft" fullWidth aria-label="Height" defaultValue={240} grouping={false} scrub="H" />
      </PanelRow>
    </PanelSection>
    <PanelSection collapsible heading="Selection colors" defaultOpen={false} summary={<SelectionColors />}>
      <PanelRow><ColorField size="sm" variant="soft" fullWidth aria-label="Selection color 1" defaultValue="#FFFFFF" /></PanelRow>
      <PanelRow><ColorField size="sm" variant="soft" fullWidth aria-label="Selection color 2" defaultValue="#0055FF" /></PanelRow>
      <PanelRow><ColorField size="sm" variant="soft" fullWidth aria-label="Selection color 3" defaultValue="#FFB800" /></PanelRow>
    </PanelSection>
    <PanelSection collapsible heading="Export" defaultOpen={false} actions={inspectorButton("Add export setting", <PlusIcon />)} />
  </Panel>
);

/*
 * Property list (docs/specs/property-list.md): Figma's fill stack. The heading's + adds a fill
 * at the top, each row hides or removes its fill, and the handle reorders by pointer or keys.
 */
type Fill = { id: number; color: string; visible: boolean };
const FillsSection = ({ initial }: { initial: string[] }) => {
  const [fills, setFills] = useState<Fill[]>(() => initial.map((color, index) => ({ id: index, color, visible: true })));
  const next = useRef(initial.length);
  const add = () => setFills(list => [{ id: next.current++, color: "#D9D9D9", visible: true }, ...list]);
  const reorder = (from: number, to: number) => setFills(list => { const copy = [...list]; const [item] = copy.splice(from, 1); if (item) copy.splice(to, 0, item); return copy; });
  return <PanelSection collapsible heading="Fill" actions={<>{inspectorButton("Styles", <DotsFourIcon />)}{inspectorButton("Add fill", <PlusIcon />)}</>} onClick={event => { if ((event.target as HTMLElement).closest("[aria-label='Add fill']")) add(); }}>
    {fills.length ? <PropertyList label="Fills" onReorder={reorder}>
      {fills.map(fill => { const name = `${fill.color.slice(1, 7)} fill`; return <PropertyListItem key={fill.id} label={name} inactive={!fill.visible} actions={<>
        <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={`Hide ${name}`} aria-pressed={!fill.visible}
          icon={fill.visible ? <EyeIcon /> : <EyeSlashIcon />} onClick={() => setFills(list => list.map(item => item.id === fill.id ? { ...item, visible: !item.visible } : item))} />
        <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={`Remove ${name}`} icon={<SubtractIcon />}
          onClick={() => setFills(list => list.filter(item => item.id !== fill.id))} />
      </>}>
        <ColorField size="sm" variant="soft" alpha fullWidth aria-label={`${name} color`} defaultValue={fill.color} />
      </PropertyListItem>; })}
    </PropertyList> : null}
  </PanelSection>;
};
/* Panels at the controls' sm tier, the panel audit rule (audit F-28 B, owner 2026-09-30). Inspector tiles take the Figma recipe's 280: at default density (14px text) a 240 panel's value
   column cannot hold a six-digit hex beside its opacity (docs/specs/property-list.md). */
export const GalleryPropertyListFills = () => (
  <Panel size="sm" title="Rectangle" aria-label="Fill properties" style={{ "--area-panel-inline-size": "280px" } as CSSProperties}><FillsSection initial={["#0055FF", "#FFB800CC", "#00A797"]} /></Panel>
);
export const GalleryPropertyListSingle = () => (
  <Panel size="sm" title="Rectangle" aria-label="Fill properties" style={{ "--area-panel-inline-size": "280px" } as CSSProperties}><FillsSection initial={["#8D4DF3"]} /></Panel>
);
export const GalleryPropertyListEffects = () => {
  const [effects, setEffects] = useState([{ id: 0, kind: "drop", visible: true }, { id: 1, kind: "inner", visible: false }]);
  const reorder = (from: number, to: number) => setEffects(list => { const copy = [...list]; const [item] = copy.splice(from, 1); if (item) copy.splice(to, 0, item); return copy; });
  return <Panel size="sm" title="Card" aria-label="Effect properties" style={{ "--area-panel-inline-size": "280px" } as CSSProperties}>
    <PanelSection heading="Effects" actions={inspectorButton("Add effect", <PlusIcon />)}>
      <PropertyList label="Effects" onReorder={reorder}>
        {effects.map((effect, index) => <PropertyListItem key={effect.id} label={`${effect.kind === "drop" ? "Drop shadow" : "Inner shadow"} effect`} inactive={!effect.visible} actions={<>
          <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={`Hide effect ${index + 1}`} aria-pressed={!effect.visible}
            icon={effect.visible ? <EyeIcon /> : <EyeSlashIcon />} onClick={() => setEffects(list => list.map(item => item.id === effect.id ? { ...item, visible: !item.visible } : item))} />
          <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={`Remove effect ${index + 1}`} icon={<SubtractIcon />} onClick={() => setEffects(list => list.filter(item => item.id !== effect.id))} />
        </>}>
          <InputGroup size="sm" variant="soft" fullWidth aria-label={`Effect ${index + 1}`}>
            <InputGroupText visual aria-hidden="true"><SlidersIcon /></InputGroupText>
            <Select size="sm" aria-label={`Effect ${index + 1} type`} defaultValue={effect.kind}><option value="drop">Drop shadow</option><option value="inner">Inner shadow</option><option value="blur">Layer blur</option></Select>
          </InputGroup>
        </PropertyListItem>)}
      </PropertyList>
    </PanelSection>
  </Panel>;
};

/*
 * Figma's Design panel, rebuilt from Area parts (docs/specs/inspector.md): PanelSection headings
 * with actions, PanelRow's two columns and trailing square, soft NumberFields whose letter or
 * icon is the scrub handle, full-width ButtonGroups, Segmented and the alpha ColorField.
 */
const inspectorButton = (label: string, icon: ReactNode) => <Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label={label} icon={icon} />;
const inspectorGroup = (label: string, items: Array<[string, ReactNode]>) => (
  <ButtonGroup size="sm" fullWidth aria-label={label}>
    {items.map(([name, icon]) => <Button key={name} size="sm" variant="ghost" tone="neutral" iconOnly aria-label={name} icon={icon} />)}
  </ButtonGroup>
);
/*
 * Box field in the recipe (docs/specs/box-field.md). Padding appears once the frame has a flow
 * (Figma shows it only for auto layout) and splits in place; corner radius keeps Figma's one
 * field beside opacity, and its Independent corners button opens the four corners in a popover
 * (Figma's "Corner radius details panel").
 */
const LayoutSection = () => {
  const [flow, setFlow] = useState("vertical");
  return <PanelSection collapsible heading="Layout" actions={inspectorButton("Add auto layout", <AutoLayoutIcon />)}>
    <PanelRow label="Flow">
      <Segmented size="sm" iconOnly fullWidth aria-label="Flow" value={flow} onValueChange={setFlow} items={[
        { value: "free", label: "Freeform", icon: <FlowFreeIcon /> },
        { value: "vertical", label: "Vertical", icon: <FlowVerticalIcon /> },
        { value: "horizontal", label: "Horizontal", icon: <FlowHorizontalIcon /> },
        { value: "wrap", label: "Wrap", icon: <FlowWrapIcon /> },
      ]} />
    </PanelRow>
    <PanelRow label="Dimensions" action={inspectorButton("Constrain proportions", <AspectRatioIcon />)}>
      <NumberField size="sm" variant="soft" fullWidth aria-label="Width" defaultValue={1202} min={0} grouping={false} scrub="W" />
      <NumberField size="sm" variant="soft" fullWidth aria-label="Height" defaultValue={815} min={0} grouping={false} scrub="H" />
    </PanelRow>
    {flow !== "free" ? <BoxField size="sm" variant="soft" label="Padding" defaultValue={[16, 24, 16, 24]} /> : null}
    <PanelRow><Checkbox label="Clip content" defaultChecked /></PanelRow>
  </PanelSection>;
};
const AppearanceSection = () => {
  const [radius, setRadius] = useState<BoxValue>([8, 8, 8, 8]);
  const [first, ...rest] = radius;
  const mixed = rest.some(value => value !== first);
  return <PanelSection collapsible heading="Appearance" actions={inspectorButton("Hide", <EyeIcon />)}>
    <PanelRow label={["Opacity", "Corner radius"]} action={
      <Popover side="bottom" aria-label="Corner radius" style={{ inlineSize: 240 } as CSSProperties}
        trigger={<Button size="sm" variant="ghost" tone="neutral" iconOnly aria-label="Independent corners" icon={<CornersIcon />} />}>
        <PopoverBody><BoxField kind="corners" size="sm" variant="soft" label="Corner radius" independent toggle={false} value={radius} onValueChange={setRadius} /></PopoverBody>
      </Popover>}>
      <NumberField size="sm" variant="soft" fullWidth aria-label="Opacity" defaultValue={100} min={0} max={100} unit="%" scrub={<OpacityIcon />} />
      <NumberField size="sm" variant="soft" fullWidth aria-label="Corner radius" min={0} scrub={<CornerRadiusIcon />}
        value={mixed ? null : first ?? null} mixed={mixed} onValueChange={next => setRadius([next, next, next, next])} />
    </PanelRow>
  </PanelSection>;
};

const BoxFieldFrame = ({ children }: { children: ReactNode }) => <div style={{ inlineSize: 240 }}>{children}</div>;
export const GalleryBoxFieldNoToggle = () => <BoxFieldFrame><BoxField label="Padding" toggle={false} defaultValue={[16, 24, 16, 24]} /></BoxFieldFrame>;
export const GalleryBoxFieldPadding = () => <BoxFieldFrame><BoxField label="Padding" defaultValue={[16, 24, 16, 24]} /></BoxFieldFrame>;
export const GalleryBoxFieldPaddingIndividual = () => <BoxFieldFrame><BoxField label="Padding" defaultIndependent defaultValue={[8, 24, 16, 24]} /></BoxFieldFrame>;
export const GalleryBoxFieldPaddingMixed = () => <BoxFieldFrame><BoxField label="Padding" defaultValue={[8, 24, 16, 12]} /></BoxFieldFrame>;
export const GalleryBoxFieldCorners = () => <BoxFieldFrame><BoxField kind="corners" label="Corner radius" defaultValue={[8, 8, 8, 8]} /></BoxFieldFrame>;
export const GalleryBoxFieldCornersIndividual = () => <BoxFieldFrame><BoxField kind="corners" label="Corner radius" defaultIndependent defaultValue={[12, 12, 0, 0]} /></BoxFieldFrame>;
export const GalleryBoxFieldSoft = () => <BoxFieldFrame><BoxField variant="soft" label="Padding" defaultValue={[16, 24, 16, 24]} /></BoxFieldFrame>;
export const GalleryBoxFieldSm = () => <BoxFieldFrame><BoxField size="sm" label="Padding" defaultValue={[16, 24, 16, 24]} /></BoxFieldFrame>;
export const GalleryBoxFieldLg = () => <BoxFieldFrame><BoxField size="lg" label="Padding" defaultValue={[16, 24, 16, 24]} /></BoxFieldFrame>;
export const GalleryBoxFieldDisabled = () => <BoxFieldFrame><BoxField disabled label="Padding" defaultValue={[16, 24, 16, 24]} /></BoxFieldFrame>;

/*
 * Resizable panel (docs/specs/resizable-panel.md): a docked inspector with its separator on the
 * start edge, and a sidebar with it on the end edge. The canvas beside each takes what is left.
 */
const resizeStage: CSSProperties = { display: "flex", inlineSize: 520, maxInlineSize: "100%", blockSize: 320 };
const resizeCanvas: CSSProperties = { flex: 1, minInlineSize: 0, background: "var(--area-bg-subtle)" };
const ResizableRows = () => <>
  <PanelSection heading="Layout">
    {/* The action column is reserved on every row (actionColumn), so Dimensions carries Figma's constrain toggle
        there; empty, it read as a wide right margin (owner, review round 2, 2026-10-09). */}
    <PanelRow label="Dimensions" action={inspectorButton("Constrain proportions", <AspectRatioIcon />)}>
      <NumberField size="sm" variant="soft" fullWidth aria-label="Width" defaultValue={1202} min={0} grouping={false} scrub="W" />
      <NumberField size="sm" variant="soft" fullWidth aria-label="Height" defaultValue={815} min={0} grouping={false} scrub="H" />
    </PanelRow>
    <BoxField size="sm" variant="soft" label="Padding" defaultValue={[16, 24, 16, 24]} />
  </PanelSection>
</>;
export const GalleryPanelResizable = () => (
  <div style={resizeStage}>
    <div style={resizeCanvas} aria-hidden="true" />
    <Panel size="sm" flush actionColumn resizable="start" defaultWidth={240} maxWidth={360} title="Design" aria-label="Design">
      <ResizableRows />
    </Panel>
  </div>
);
export const GalleryPanelResizableSidebar = () => (
  <div style={resizeStage}>
    <Panel size="sm" flush resizable="end" defaultWidth={240} maxWidth={360} title="Layers" aria-label="Layers">
      <PanelSection heading="Pages"><TreeView aria-label="Pages" items={[{ id: "cover", label: "Cover" }, { id: "components", label: "Components" }]} defaultSelectedIds={["cover"]} /></PanelSection>
    </Panel>
    <div style={resizeCanvas} aria-hidden="true" />
  </div>
);

/*
 * Combobox (docs/specs/combobox.md). An editable field whose list filters as you type; the
 * list is Menu's surface and rows. Figma's font size is the custom-value case.
 */
const fontOptions: ComboboxOption[] = ["Inter", "Geist", "IBM Plex Sans", "Source Sans 3", "Work Sans", "Manrope", "DM Sans", "Space Grotesk"].map(label => ({ value: label.toLowerCase().replace(/\s+/g, "-"), label }));
const fontSizes: ComboboxOption[] = [10, 11, 12, 13, 14, 16, 20, 24, 32, 36, 40, 48, 64, 96, 128].map(size => ({ value: String(size), label: String(size) }));
const comboFrame: CSSProperties = { inlineSize: 240 };
export const GalleryCombobox = () => <div style={comboFrame}><Combobox fullWidth aria-label="Font" placeholder="Choose a font" items={fontOptions} defaultValue="inter" /></div>;
export const GalleryComboboxCustom = () => <div style={comboFrame}><Combobox fullWidth aria-label="Font size" items={fontSizes} defaultValue="16" allowsCustomValue inputMode="decimal" /></div>;
export const GalleryComboboxGroups = () => (
  <div style={comboFrame}><Combobox fullWidth aria-label="Font" placeholder="Choose a font" items={[
    ...["Inter", "Geist"].map(label => ({ value: `recent-${label}`, label, group: "Recent" })),
    ...fontOptions.filter(option => !["inter", "geist"].includes(option.value)).map(option => ({ ...option, group: "All fonts" })),
  ]} /></div>
);
export const GalleryComboboxCreate = () => {
  const [tags, setTags] = useState<ComboboxOption[]>(["Design", "Engineering", "Research"].map(label => ({ value: label.toLowerCase(), label })));
  return <div style={comboFrame}><Combobox fullWidth aria-label="Tag" placeholder="Search or create a tag" items={tags}
    onCreate={text => setTags(list => [...list, { value: text.toLowerCase(), label: text }])} /></div>;
};
export const GalleryComboboxRich = () => (
  <div style={comboFrame}><Combobox fullWidth aria-label="Assignee" placeholder="Assign to" items={[
    { value: "david-tee", label: "David Tee", icon: <PersonSmallIcon />, description: "Owner" },
    { value: "design", label: "Design team", icon: <PersonSmallIcon />, description: "Editors" },
    { value: "engineering", label: "Engineering team", icon: <PersonSmallIcon />, description: "Viewers" },
  ]} /></div>
);
export const GalleryComboboxDisabledOption = () => (
  <div style={comboFrame}><Combobox fullWidth aria-label="Assignee" placeholder="Assign to" items={[
    { value: "david-tee", label: "David Tee" },
    { value: "design", label: "Design team" },
    { value: "guest", label: "Guest", description: "Invited", disabled: true },
  ]} /></div>
);
export const GalleryComboboxSoft = () => <div style={comboFrame}><Combobox fullWidth variant="soft" aria-label="Font" items={fontOptions} defaultValue="geist" /></div>;
export const GalleryComboboxSm = () => <div style={comboFrame}><Combobox fullWidth size="sm" aria-label="Font" items={fontOptions} defaultValue="geist" /></div>;
export const GalleryComboboxLg = () => <div style={comboFrame}><Combobox fullWidth size="lg" aria-label="Font" items={fontOptions} defaultValue="geist" /></div>;
export const GalleryComboboxDisabled = () => <div style={comboFrame}><Combobox fullWidth disabled aria-label="Font" items={fontOptions} defaultValue="inter" /></div>;
export const GalleryComboboxInvalid = () => <div style={comboFrame}><Combobox fullWidth invalid aria-label="Font" placeholder="Choose a font" items={fontOptions} /></div>;

/*
 * Command palette (docs/specs/command-palette.md): Notion's "Search or ask" shape — a search
 * row, grouped results, key hints — with Menu's rows.
 */
const paletteItems: CommandItem[] = [
  { id: "roadmap", label: "Item one", description: "Description", icon: <DocumentIcon />, group: "Recent" },
  { id: "tokens", label: "Item two", description: "Description", icon: <DocumentIcon />, group: "Recent" },
  { id: "research", label: "Item three", icon: <FolderIcon />, group: "Recent" },
  { id: "new", label: "New page", icon: <PlusIcon />, shortcut: ["cmd", "n"], group: "Actions" },
  { id: "link", label: "Copy link", icon: <LinkIcon />, shortcut: ["cmd", "shift", "c"], group: "Actions" },
  { id: "settings", label: "Settings", icon: <SettingsIcon />, shortcut: ["cmd", ","], group: "Actions" },
  { id: "trash", label: "Trash", icon: <TrashIcon />, group: "Actions", disabled: true },
];
export const GalleryCommandPalette = () => <CommandPalette inline items={paletteItems} placeholder="Search or ask…" />;
export const GalleryCommandPaletteModal = () => {
  const [open, setOpen] = useState(false);
  return <>
    <Button variant="outline" icon={<SearchIcon />} onClick={() => setOpen(true)}>Search<Kbd keys={["cmd", "k"]} size="sm" variant="quiet" /></Button>
    <CommandPalette open={open} onOpenChange={setOpen} hotkey="mod+k" items={paletteItems} placeholder="Search or ask…" />
  </>;
};
export const GalleryCommandPaletteEmpty = () => <CommandPalette inline items={paletteItems} defaultQuery="Placeholder" emptyText="No results for “Quarterly plan”" />;
export const GalleryCommandPaletteNoFooter = () => <CommandPalette inline footer={false} items={paletteItems.filter(item => item.group === "Actions")} placeholder="Run a command…" />;

/*
 * Context menu (docs/specs/context-menu.md): Menu, opened at the pointer. Right-click the
 * area, or focus it and press Shift+F10 (or the Menu key).
 */
const contextArea: CSSProperties = { display: "grid", placeItems: "center", inlineSize: "calc(var(--area-space-96) * 2 + var(--area-space-48))", minBlockSize: "var(--area-space-96)", border: "var(--area-border-width) dashed var(--area-border-default)", borderRadius: "var(--area-radius-container)", color: "var(--area-fg-muted)" };
const pageActions = <>
  <MenuItem shortcut={<Kbd keys={["cmd", "l"]} size="sm" variant="quiet" />} icon={<LinkIcon />}>Copy link</MenuItem>
  <MenuItem icon={<DocumentIcon />}>Duplicate</MenuItem>
  <MenuItem icon={<OpenIcon />}>Open in new tab</MenuItem>
  <MenuSeparator />
  <MenuItem tone="danger" icon={<TrashIcon />}>Move to Trash</MenuItem>
</>;
export const GalleryContextMenu = () => (
  <ContextMenu menuLabel="Page actions" menu={pageActions}>
    <div style={contextArea} tabIndex={0}>Right-click here</div>
  </ContextMenu>
);
export const GalleryContextMenuTree = () => (
  <ContextMenu menuLabel="Layer actions" menu={pageActions}>
    <div style={{ inlineSize: 240 }}><TreeView aria-label="Layers" items={[{ id: "frame", label: "Frame 1", children: [{ id: "title", label: "Title" }, { id: "image", label: "Image" }] }]} defaultExpandedIds={["frame"]} /></div>
  </ContextMenu>
);
export const GalleryContextMenuDisabled = () => (
  <ContextMenu menuLabel="Page actions" menu={<>
    <MenuItem icon={<LinkIcon />}>Copy link</MenuItem>
    <MenuItem disabled icon={<DocumentIcon />}>Duplicate</MenuItem>
    <MenuItem disabled tone="danger" icon={<TrashIcon />}>Move to Trash</MenuItem>
  </>}>
    <div style={contextArea} tabIndex={0}>Read-only page</div>
  </ContextMenu>
);

/*
 * Hover card (docs/specs/hover-card.md): Popover's surface, opened after the pointer rests on a
 * link for 700ms (or on keyboard focus), closed 300ms after it leaves both.
 */
const personCard = <>
  <div className="area-hover-card__identity"><Avatar size="lg" fallback="DT" /><div><PopoverTitle level={false}>David Tee</PopoverTitle><span className="area-hover-card__meta">@david</span></div></div>
  <PopoverDescription>Description</PopoverDescription>
  <div className="area-hover-card__meta"><span>Label</span><span>Value</span></div>
</>;
/* A div, not a p: the card holds blocks, and an HTML parser closes a <p> at the first block,
   so server HTML inside a paragraph would not match the React tree it hydrates. */
export const GalleryHoverCard = () => (
  <div>Reviewed by <HoverCard trigger={<a href="#david">@david</a>}>{personCard}</HoverCard> yesterday.</div>
);
export const GalleryHoverCardPage = () => (
  <div>Body text <HoverCard trigger={<a href="#title">Title</a>}>
    <div><PopoverTitle level={false}>Title</PopoverTitle><PopoverDescription>Description</PopoverDescription></div>
    <div className="area-hover-card__meta"><span><DocumentIcon />Label</span><span>Value</span></div>
  </HoverCard> body text.</div>
);
export const GalleryHoverCardSource = () => (
  <div>Area measures every value<HoverCard trigger={<a href="#source" aria-label="Source: component adaptation">¹</a>}>
    <div><PopoverTitle level={false}>Component adaptation</PopoverTitle><PopoverDescription>Every visible value traces to a capture or a pinned source line recorded in the spec.</PopoverDescription></div>
    <div className="area-hover-card__meta"><span><LinkIcon />docs/COMPONENT_ADAPTATION.md</span></div>
  </HoverCard>.</div>
);
export const GalleryHoverCardTop = () => (
  <div>Owned by <HoverCard side="top" trigger={<a href="#david-top">@david</a>}>{personCard}</HoverCard></div>
);

/*
 * Prompt suggestions (docs/specs/prompt-suggestions.md): ChatGPT's home rows under the
 * composer, 24 below it; choosing one fills the composer.
 */
const starterPrompts = [
  { id: "one", label: "Item one", icon: <DocumentIcon /> },
  { id: "two", label: "Item two", icon: <SearchIcon /> },
  { id: "three", label: "Item three", icon: <SettingsIcon /> },
];
export const GalleryPromptSuggestions = () => {
  const [draft, setDraft] = useState("");
  const [list, setList] = useState(starterPrompts);
  return <div style={{ display: "grid", gap: "calc(var(--area-space-24) - var(--area-space-8) * var(--area-ui-dense))", inlineSize: "calc(var(--area-space-96) * 5)", maxInlineSize: "100%" }}>
    <Composer value={draft} onValueChange={setDraft} placeholder="Placeholder" leadingActions={<Button variant="ghost" iconOnly icon={<PlusIcon />} aria-label="Add files" />} />
    {draft ? null : <PromptSuggestions items={list} onSelect={item => setDraft(item.label)} onDismiss={item => setList(rows => rows.filter(row => row.id !== item.id))} />}
  </div>;
};
export const GalleryPromptSuggestionsPlain = () => <PromptSuggestions items={starterPrompts.map(({ icon: _icon, ...rest }) => rest)} />;
export const GalleryPromptSuggestionsChips = () => {
  const [draft, setDraft] = useState("");
  return <div style={{ display: "grid", gap: "calc(var(--area-space-24) - var(--area-space-8) * var(--area-ui-dense))", inlineSize: "calc(var(--area-space-96) * 5)", maxInlineSize: "100%" }}>
    <Composer value={draft} onValueChange={setDraft} placeholder="Placeholder" leadingActions={<Button variant="ghost" iconOnly icon={<PlusIcon />} aria-label="Add files" />} />
    {draft ? null : <PromptSuggestions layout="chips" items={[
      { id: "one", label: "Item one", icon: <DocumentIcon /> },
      { id: "two", label: "Item two", icon: <SearchIcon /> },
      { id: "three", label: "Item three", icon: <SettingsIcon /> },
    ]} onSelect={item => setDraft(item.label)} />}
  </div>;
};

/*
 * Message (docs/specs/message.md): ChatGPT's turns — the person's bubble at the end of the
 * column, the assistant's prose across it, each with a row of muted icon actions.
 */
const actionButton = (label: string, icon: ReactNode) => <Button variant="ghost" tone="neutral" iconOnly aria-label={label} icon={icon} />;
const assistantActions = <MessageActions>
  {actionButton("Copy", <FluentCopyIcon />)}{actionButton("Good response", <ThumbLikeIcon />)}{actionButton("Bad response", <ThumbDislikeIcon />)}
  {actionButton("Read aloud", <SpeakerIcon />)}{actionButton("Regenerate", <RegenerateIcon />)}{actionButton("More actions", <MoreIcon />)}
</MessageActions>;
const userActions = <MessageActions>{actionButton("Copy message", <FluentCopyIcon />)}{actionButton("Edit message", <EditIcon />)}</MessageActions>;
const conversation: CSSProperties = { display: "grid", gap: "var(--area-space-24)", inlineSize: "calc(var(--area-space-96) * 5)", maxInlineSize: "100%" };
export const GalleryMessage = () => (
  <div style={conversation}>
    <Message author="user" actions={userActions}>Body text</Message>
    <Message author="assistant" authorName="Assistant" actions={assistantActions}>
      <p>Body text</p>
      <p>Body text</p>
    </Message>
  </div>
);
export const GalleryMessageUser = () => (
  <div style={conversation}><Message author="user" actions={userActions}>Body text</Message></div>
);
export const GalleryMessageAssistant = () => (
  <div style={conversation}>
    <Message author="assistant" authorName="Assistant" actions={assistantActions}>
      <p>Body text</p>
    </Message>
  </div>
);
export const GalleryMessageStreaming = () => (
  <div style={conversation}>
    <Message author="assistant" authorName="Assistant" streaming actions={assistantActions}>Body text</Message>
  </div>
);
export const GalleryMessageLong = () => (
  <div style={conversation}>
    <Message author="user" actions={userActions}>{"Body text\nBody text that wraps onto a second line, long enough to show the bubble's width cap and its inset on every side"}</Message>
  </div>
);

/*
 * Scroll to latest (docs/specs/scroll-to-latest.md): scroll the conversation up and the round
 * button appears 24 above the composer; it returns to the newest message.
 */
export const GalleryScrollToLatest = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  return <div style={{ display: "grid", gridTemplateRows: "minmax(0, 1fr) auto", gap: "var(--area-space-16)", inlineSize: "calc(var(--area-space-96) * 5)", maxInlineSize: "100%", blockSize: "calc(var(--area-space-96) * 4)" }}>
    <div ref={scrollRef} style={{ overflowY: "auto", display: "grid", gap: "var(--area-space-24)", alignContent: "start" }}>
      {["Item one", "Item two", "Item three"].map((question, index) => <div key={question} style={{ display: "grid", gap: "var(--area-space-24)" }}>
        <Message author="user">{question}</Message>
        <Message author="assistant" authorName="Assistant" actions={index === 2 ? assistantActions : undefined}>
          <p>Body text</p>
          <p>Body text</p>
        </Message>
      </div>)}
    </div>
    <div style={{ position: "relative" }}>
      <ScrollToLatest scrollRef={scrollRef} />
      <Composer placeholder="Placeholder" leadingActions={<Button variant="ghost" iconOnly icon={<PlusIcon />} aria-label="Add files" />} />
    </div>
  </div>;
};

/*
 * Model picker (docs/specs/model-picker.md): ChatGPT's "Instant ⌄" — a ghost trigger in the
 * composer opening a Menu of single-choice rows with notes.
 */
const modelOptions = [
  { value: "one", label: "Option one", description: "Description" },
  { value: "two", label: "Option two", description: "Description" },
  { value: "three", label: "Option three", description: "Description" },
];
export const GalleryModelPicker = () => (
  <div style={{ inlineSize: "calc(var(--area-space-96) * 5)", maxInlineSize: "100%" }}>
    <Composer placeholder="Placeholder" leadingActions={<Button variant="ghost" iconOnly icon={<PlusIcon />} aria-label="Add files" />}
      mode={<ModelPicker items={modelOptions} defaultValue="two" />} />
  </div>
);
export const GalleryModelPickerHeading = () => (
  <ModelPicker heading="Label" defaultValue="one" items={[
    { value: "one", label: "Option one" },
    { value: "two", label: "Option two", description: "Description" },
    { value: "three", label: "Option three", description: "Description", disabled: true },
  ]} />
);

export const GalleryPanelFigma = () => (
  <Panel size="sm" actionColumn title="Frame" aria-label="Design properties" style={{ "--area-panel-inline-size": "280px" } as CSSProperties} action={inspectorButton("More frame actions", <MoreIcon />)}>
    <PanelSection collapsible heading="Position">
      <PanelRow label="Alignment" action={inspectorButton("Distribute", <BarsThreeIcon />)}>
        {inspectorGroup("Horizontal alignment", [["Align left", <AlignLeftIcon />], ["Align horizontal centers", <AlignCenterHorizontalIcon />], ["Align right", <AlignRightIcon />]])}
        {inspectorGroup("Vertical alignment", [["Align top", <AlignTopIcon />], ["Align vertical centers", <AlignMiddleIcon />], ["Align bottom", <AlignBottomIcon />]])}
      </PanelRow>
      <PanelRow label="Position">
        <NumberField size="sm" variant="soft" fullWidth aria-label="X position" defaultValue={0} scrub="X" />
        <NumberField size="sm" variant="soft" fullWidth aria-label="Y position" defaultValue={0} scrub="Y" />
      </PanelRow>
      <PanelRow label="Rotation">
        <NumberField size="sm" variant="soft" fullWidth aria-label="Rotation" defaultValue={0} unit="°" scrub={<AngleIcon />} />
        {inspectorGroup("Transform", [["Rotate 90°", <RotateIcon />], ["Flip horizontal", <FlipHorizontalIcon />], ["Flip vertical", <FlipVerticalIcon />]])}
      </PanelRow>
    </PanelSection>
    <LayoutSection />
    <AppearanceSection />
    <FillsSection initial={["#0055FF"]} />
    <PanelSection collapsible heading="Selection colors" defaultOpen={false} summary={<SelectionColors />}>
      <PanelRow><ColorField size="sm" variant="soft" fullWidth aria-label="Selection color 1" defaultValue="#FFFFFF" /></PanelRow>
      <PanelRow><ColorField size="sm" variant="soft" fullWidth aria-label="Selection color 2" defaultValue="#0055FF" /></PanelRow>
    </PanelSection>
    <PanelSection collapsible heading="Stroke" actions={inspectorButton("Add stroke", <PlusIcon />)} />
    <PanelSection collapsible heading="Export" actions={inspectorButton("Add export setting", <PlusIcon />)} />
  </Panel>
);

export const GalleryNumberFieldPlain = () => <Field label="Label"><NumberField defaultValue={4} min={0} steppers /></Field>;

export const GalleryInputGroupAffixes = () => <InputGroup aria-label="Label"><InputGroupText aria-hidden="true">$</InputGroupText><Input aria-label="Value" defaultValue="24.00" inputMode="decimal" /><InputGroupText aria-hidden="true">USD</InputGroupText></InputGroup>;
export const GalleryInputGroupPair = () => <div className="docs-paired-fields"><InputGroup variant="soft" fullWidth aria-label="X position"><InputGroupText visual aria-hidden="true">X</InputGroupText><NumberField aria-label="X position" defaultValue={24} /></InputGroup><InputGroup variant="soft" fullWidth aria-label="Y position"><InputGroupText visual aria-hidden="true">Y</InputGroupText><NumberField aria-label="Y position" defaultValue={48} /></InputGroup></div>;
export const GalleryInputGroupIcon = () => <InputGroup aria-label="Search by keyword"><InputGroupText visual aria-hidden="true"><SearchIcon /></InputGroupText><Input type="search" aria-label="Search by keyword" placeholder="Search" /></InputGroup>;
export const GalleryInputGroupOpacity = () => <InputGroup variant="soft" aria-label="Opacity"><InputGroupText visual aria-hidden="true"><OpacityIcon /></InputGroupText><NumberField aria-label="Opacity" defaultValue={100} min={0} max={100} unit="%" /></InputGroup>;
export const GalleryInputGroupRotation = () => <InputGroup variant="soft" aria-label="Rotation"><InputGroupText visual aria-hidden="true"><RotateIcon /></InputGroupText><NumberField aria-label="Rotation" defaultValue={0} unit="°" /></InputGroup>;
export const GalleryInputGroupLetter = () => <InputGroup aria-label="Width"><InputGroupText visual aria-hidden="true">W</InputGroupText><NumberField aria-label="Width" defaultValue={300} /></InputGroup>;
export const GalleryInputGroupMode = () => <InputGroup aria-label="Width and unit"><Select aria-label="Unit" defaultValue="px"><option value="px">px</option><option value="percent">%</option></Select><NumberField aria-label="Width" defaultValue={320} min={0} /></InputGroup>;
export const GalleryInputGroupPhone = () => <InputGroup aria-label="Phone number"><Select aria-label="Country code" defaultValue="+1"><option value="+1">+1</option><option value="+44">+44</option><option value="+61">+61</option></Select><Input type="tel" aria-label="Phone number" defaultValue="555 0100" /></InputGroup>;
export const GalleryInputGroupAction = () => {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  return <div><InputGroup aria-label="Search"><Input type="search" aria-label="Search terms" placeholder="Search" value={query} onChange={event => setQuery(event.target.value)} /><Button type="button" variant="ghost" iconOnly icon={<SearchIcon />} aria-label="Run search" onClick={() => setSubmitted(query)} /></InputGroup>{submitted && <span role="status" className="area-sr-only">Searched for {submitted}</span>}</div>;
};

export const GalleryKbd = () => (
  <Kbd keys={["cmd", "K"]} />
);
export const GalleryKbdSmall = () => <Kbd keys={["cmd", "K"]} size="sm" />;
export const GalleryKbdQuiet = () => <Kbd keys={["cmd", "K"]} variant="quiet" />;
export const GalleryKbdChord = () => <Kbd keys={["cmd", "shift", "P"]} />;
export const GalleryKbdSequence = () => (
  <KbdGroup><Kbd keys={["cmd", "K"]} /><Kbd keys={["P"]} /></KbdGroup>
);
export const GalleryKbdOnColor = () => (
  <ActionAccent><Button aria-keyshortcuts="Meta+K">
    Button <Kbd variant="on-color" keys={["cmd", "K"]} />
  </Button></ActionAccent>
);
export const GalleryKbdOnEmphasis = () => (
  <Tooltip>
    Description <Kbd keys={["cmd", "B"]} />
  </Tooltip>
);

/* Kbd in context (owner, 2026-09-28: "show as many examples to show it in context"). One host per
   tile; the host decides the keycap's appearance, the corner is 6 everywhere. */
export const GalleryKbdInMenu = () => (
  <Menu aria-label="Page actions">
    <MenuItem shortcut={<Kbd keys={["cmd", "L"]} />} icon={<LinkIcon />}>Copy link</MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "D"]} />} icon={<DocumentIcon />}>Duplicate</MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "shift", "P"]} />} icon={<OpenIcon />}>Move to</MenuItem>
    <MenuSeparator />
    <MenuItem tone="danger" shortcut={<Kbd keys={["cmd", "backspace"]} />} icon={<TrashIcon />}>Delete</MenuItem>
  </Menu>
);
export const GalleryKbdInCommandPalette = () => <CommandPalette inline items={paletteItems.filter(item => item.group === "Actions" && !item.disabled)} placeholder="Run a command…" />;
export const GalleryKbdInSearchField = () => <Input type="search" aria-label="Search" placeholder="Search or ask" aria-keyshortcuts="Meta+K" leadingIcon={<SearchIcon />} suffix={<Kbd keys={["cmd", "K"]} size="sm" />} />;
export const GalleryKbdInNav = () => (
  <Nav aria-label="Workspace">
    <NavItem href="#gallery-kbd-template-in-nav" icon={<SearchIcon />} trailing={<Kbd keys={["cmd", "K"]} size="sm" />}>Search</NavItem>
    <NavItem href="#gallery-kbd-template-in-nav" icon={<EditIcon />} trailing={<Kbd keys={["cmd", "N"]} size="sm" />}>New page</NavItem>
    <NavItem href="#gallery-kbd-template-in-nav" icon={<SettingsIcon />} trailing={<Kbd keys={["cmd", ","]} size="sm" />}>Settings</NavItem>
  </Nav>
);
export const GalleryKbdInOutlineButton = () => <Button variant="outline" tone="neutral" icon={<SearchIcon />} aria-keyshortcuts="Meta+K">Search <Kbd keys={["cmd", "K"]} /></Button>;
export const GalleryKbdInGhostButton = () => <Button variant="ghost" tone="neutral" icon={<PlusIcon />} aria-keyshortcuts="Meta+N">New page <Kbd keys={["cmd", "N"]} /></Button>;
export const GalleryKbdInSoftButton = () => <Button variant="soft" tone="neutral" aria-keyshortcuts="Meta+Z">Undo <Kbd keys={["cmd", "Z"]} /></Button>;
export const GalleryKbdInSmallButton = () => <Button size="sm" variant="outline" tone="neutral" aria-keyshortcuts="Meta+Z">Undo <Kbd keys={["cmd", "Z"]} size="sm" /></Button>;
export const GalleryKbdInLargeButton = () => <Button size="lg" aria-keyshortcuts="Meta+Enter">Send <Kbd keys={["cmd", "enter"]} /></Button>;
export const GalleryKbdInFooter = () => (
  <div style={{ display: "flex", gap: "var(--area-space-8)" }}>
    <Button variant="outline" tone="neutral" aria-keyshortcuts="Escape">Cancel <Kbd keys={["escape"]} /></Button>
    <Button aria-keyshortcuts="Meta+Enter">Save <Kbd keys={["cmd", "enter"]} /></Button>
  </div>
);
export const GalleryKbdInText = () => (
  <div style={{ maxInlineSize: "240px" }}>Press <Kbd keys={["cmd", "K"]} /> to search, then <Kbd keys={["enter"]} /> to open the first result.</div>
);
export const GalleryKbdInTable = () => (
  <Table aria-label="Keyboard shortcuts">
    <thead><tr><th scope="col">Action</th><th scope="col">Shortcut</th></tr></thead>
    <tbody>
      <tr><td>Search</td><td><Kbd keys={["cmd", "K"]} /></td></tr>
      <tr><td>New page</td><td><Kbd keys={["cmd", "N"]} /></td></tr>
      <tr><td>Go to settings</td><td><KbdGroup><Kbd keys={["G"]} /><Kbd keys={["S"]} /></KbdGroup></td></tr>
    </tbody>
  </Table>
);

export const GalleryMenu = () => (
  <Menu aria-label="Label">
    <MenuItem><span className="area-menu__text">Item one</span></MenuItem>
    <MenuItem><span className="area-menu__text">Item two</span></MenuItem>
    <MenuItem><span className="area-menu__text">Item three</span></MenuItem>
  </Menu>
);
export const GalleryMenuShortcuts = () => <Menu aria-label="Label"><MenuItem shortcut={<Kbd keys={["cmd", "K"]} variant="quiet" />}><span className="area-menu__text">Item one</span></MenuItem><MenuItem shortcut={<Kbd keys={["cmd", "N"]} variant="quiet" />}><span className="area-menu__text">Item two</span></MenuItem></Menu>;

export const GalleryMenuSelected = () => (
  <Menu aria-label="Label">
    <MenuLabel>Label</MenuLabel>
    <MenuItem radio checked><span className="area-menu__text">Option one</span></MenuItem>
    <MenuItem radio checked={false}><span className="area-menu__text">Option two</span></MenuItem>
    <MenuItem radio checked={false}><span className="area-menu__text">Option three</span></MenuItem>
  </Menu>
);

/* A real submenu (audit D-10): Right or Enter opens it, Left or Escape returns to its row. */
export const GalleryMenuSubmenu = () => (
  <Menu aria-label="Page actions" trigger={<Button variant="outline">Page</Button>}>
    <MenuItem icon={<LinkIcon />}>Copy link</MenuItem>
    <MenuItem icon={<DocumentIcon />}>Duplicate</MenuItem>
    <MenuSub label="Move to" icon={<OpenIcon />}>
      <MenuItem>Item one</MenuItem>
      <MenuItem>Item two</MenuItem>
      <MenuItem>Item three</MenuItem>
    </MenuSub>
    <MenuSeparator />
    <MenuItem tone="danger" icon={<TrashIcon />}>Move to Trash</MenuItem>
  </Menu>
);

export const GalleryMenuDisabled = () => (
  <Menu aria-label="Label">
    <MenuItem><span className="area-menu__text">Item one</span></MenuItem>
    <MenuItem disabled><span className="area-menu__text">Item two</span></MenuItem>
    <MenuItem><span className="area-menu__text">Item three</span></MenuItem>
  </Menu>
);
export const GalleryMenuDanger = () => <Menu aria-label="Label"><MenuItem><span className="area-menu__text">Item one</span></MenuItem><MenuItem tone="danger"><span className="area-menu__text">Item two</span></MenuItem></Menu>;

/* Icon rows, a separator and a danger action, as ChatGPT's chat actions (docs/specs/menu.md). */
const MenuIconRows = ({ style, dangerStyle, highlightDanger, separatorStyle }: { style?: CSSProperties; dangerStyle?: CSSProperties; highlightDanger?: boolean; separatorStyle?: CSSProperties }) => (
  <Menu aria-label="Page actions" style={style}>
    <MenuItem shortcut="⌘L" icon={<LinkIcon />}>Copy link</MenuItem>
    <MenuItem icon={<OpenIcon />}>Open in new tab</MenuItem>
    <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
    <MenuSeparator style={separatorStyle} />
    <MenuItem tone="danger" style={dangerStyle} {...(highlightDanger ? { "data-highlighted": "" } : {})} icon={<TrashIcon />}>Delete</MenuItem>
  </Menu>
);
export const GalleryMenuIcons = () => <MenuIconRows />;

/*
 * Checkable rows (docs/specs/menu.md): each row is one menu item and the control; the switch or
 * check only shows state. Mixed controls such as a segmented choice belong in a Popover.
 */
export const GalleryMenuControls = () => {
  const [on, setOn] = useState<Record<string, boolean>>({ small: false, full: true, comments: true, backlinks: false });
  const toggle = (key: string) => () => setOn((state) => ({ ...state, [key]: !state[key] }));
  return (
    <Menu aria-label="Page options">
      <MenuLabel>Page</MenuLabel>
      <MenuItem indicator="switch" checked={on.small} onClick={toggle("small")}><span className="area-menu__text">Small text</span></MenuItem>
      <MenuItem indicator="switch" checked={on.full} onClick={toggle("full")}><span className="area-menu__text">Full width</span></MenuItem>
      <MenuSeparator />
      <MenuLabel>Show</MenuLabel>
      <MenuItem checked={on.comments} onClick={toggle("comments")}><span className="area-menu__text">Comments</span></MenuItem>
      <MenuItem checked={on.backlinks} onClick={toggle("backlinks")}><span className="area-menu__text">Backlinks</span></MenuItem>
    </Menu>
  );
};

export const GalleryNav = () => (
  <Nav aria-label="Label">
    <NavItem href="#gallery-nav-default" current>Item one</NavItem><NavItem href="#gallery-nav-default">Item two</NavItem><NavItem href="#gallery-nav-default">Item three</NavItem>
  </Nav>
);
/* Nav in full context (owner, 2026-09-27): ChatGPT's sidebar layout, every part an Area
   component: a header with the product name and two icon actions, icon rows, titled sections
   (Projects, Recents) and the account row pinned to the bottom. */
export const GalleryNavSidebar = () => (
  <aside aria-label="Sidebar" style={{ display: "flex", flexDirection: "column", inlineSize: "calc(var(--area-space-96) * 2.75)", blockSize: "calc(var(--area-space-96) * 6)", background: "var(--area-bg-subtle)", borderInlineEnd: "var(--area-border-width) solid var(--area-border-decorative)" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--area-space-8) var(--area-space-8) var(--area-space-8) var(--area-space-16)" }}>
      <span>Area</span>
      <span style={{ display: "flex" }}>
        <Button variant="ghost" iconOnly icon={<SearchIcon />} aria-label="Search chats" />
        <Button variant="ghost" iconOnly icon={<FluentPanelLeftIcon />} aria-label="Close sidebar" />
      </span>
    </div>
    <div style={{ flex: 1, minBlockSize: 0, overflowY: "auto", padding: "0 var(--area-space-8)" }}>
      <Nav aria-label="Chats">
        <NavGroup>
          <NavItem href="#gallery-nav-sidebar" icon={<EditIcon />} current>New chat</NavItem>
          <NavItem href="#gallery-nav-sidebar" icon={<DocumentIcon />}>Library</NavItem>
          <NavItem href="#gallery-nav-sidebar" icon={<DotsFourIcon />}>Apps</NavItem>
        </NavGroup>
        <NavGroup label="Projects">
          <NavItem href="#gallery-nav-sidebar" icon={<FolderIcon />}>Design system</NavItem>
          <NavItem href="#gallery-nav-sidebar" icon={<FolderIcon />}>Launch plan</NavItem>
        </NavGroup>
        <NavGroup label="Recents">
          <NavItem href="#gallery-nav-sidebar" actions={<Button size="sm" variant="ghost" iconOnly icon={<MoreIcon />} aria-label="Chat options" />}>Inspector panel fields</NavItem>
          <NavItem href="#gallery-nav-sidebar">Toolbar split buttons</NavItem>
          <NavItem href="#gallery-nav-sidebar">Calendar spacing</NavItem>
          <NavItem href="#gallery-nav-sidebar">Toast colours</NavItem>
        </NavGroup>
      </Nav>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--area-space-8)", padding: "var(--area-space-12) var(--area-space-16)" }}>
      <Avatar size="sm" fallback="DT" role="img" aria-label="David Tee" />
      <span style={{ display: "grid" }}><span>David Tee</span><span style={{ color: "var(--area-fg-muted)", fontSize: "var(--area-text-xs-size)", lineHeight: "var(--area-text-xs-leading)" }}>Plus</span></span>
    </div>
  </aside>
);
export const GalleryNavGrouped = () => (
  <Nav aria-label="Label">
    <NavGroup label="Label">
      <NavItem href="#gallery-nav-grouped" current>Item one</NavItem><NavItem href="#gallery-nav-grouped">Item two</NavItem>
    </NavGroup>
    <NavGroup label="Label">
      <NavItem href="#gallery-nav-grouped">Item three</NavItem><NavItem href="#gallery-nav-grouped">Item four</NavItem>
    </NavGroup>
  </Nav>
);
export const GalleryNavIcons = () => <Nav aria-label="Label"><NavItem href="#gallery-nav-icons" icon={<DotsFourIcon />} current>Item one</NavItem><NavItem href="#gallery-nav-icons" icon={<PersonSmallIcon />}>Item two</NavItem><NavItem href="#gallery-nav-icons" icon={<TokenIcon />}>Item three</NavItem></Nav>;
export const GalleryNavCounts = () => <Nav aria-label="Label"><NavItem href="#gallery-nav-counts" current trailing={<Count count={12} />}>Item one</NavItem><NavItem href="#gallery-nav-counts" trailing={<Count count={3} />}>Item two</NavItem><NavItem href="#gallery-nav-counts">Item three</NavItem></Nav>;

export const GalleryNavMarker = () => (
  <Nav aria-label="Label" selection="marker">
      <NavItem href="#gallery-nav-marker" current>Item one</NavItem><NavItem href="#gallery-nav-marker">Item two</NavItem><NavItem href="#gallery-nav-marker">Item three</NavItem>
  </Nav>
);

export const GalleryNavHorizontal = () => (
  <Nav orientation="horizontal" aria-label="Label">
    <NavItem href="#gallery-nav-horizontal" current>Item one</NavItem>
    <NavItem href="#gallery-nav-horizontal">Item two</NavItem>
    <NavItem href="#gallery-nav-horizontal">Item three</NavItem>
  </Nav>
);

export const GalleryNavActions = () => {
  const [saved, setSaved] = useState(false);
  return <Nav aria-label="Label">
      <NavItem href="#gallery-nav-actions" current actions={<Button size="sm" variant="ghost" iconOnly icon={<CheckIcon />} aria-label="Save" aria-pressed={saved} onClick={() => setSaved(!saved)} />}>Item one</NavItem>
      <NavItem href="#gallery-nav-actions">Item two</NavItem>
  </Nav>;
};
export const GalleryNavExpandable = () => {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <Nav aria-label="Label"><NavItem href="#gallery-nav-expandable" actions={<Button size="sm" variant="ghost" iconOnly icon={<ChevronIcon />} aria-label="Toggle items" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} />}>Item one</NavItem><div id={id} hidden={!open}><NavGroup nested><NavItem href="#gallery-nav-expandable">Item two</NavItem><NavItem href="#gallery-nav-expandable">Item three</NavItem></NavGroup></div></Nav>;
};

/** Two-column inspector layout; every editable surface is an Area control. */
/*
 * Panel tiles (docs/specs/inspector.md, audit 2026-09-26): every body is PanelRow with controls
 * at the panel's tier (sm panel, sm controls), so the family shows one inspector row.
 */
type PanelTier = "sm" | "md";
const PanelSampleRows = ({ tier = "md" }: { tier?: PanelTier }) => {
  const size = tier;
  return <>
    <PanelSection heading="Position">
      <PanelRow label="Alignment">
        <Segmented size={size} iconOnly fullWidth aria-label="Vertical alignment" defaultValue="top" items={[
          { value: "top", label: "Align top", icon: <AlignTopIcon /> },
          { value: "middle", label: "Align middle", icon: <AlignMiddleIcon /> },
          { value: "bottom", label: "Align bottom", icon: <AlignBottomIcon /> },
        ]} />
      </PanelRow>
      <PanelRow label="Position">
        <NumberField size={size} variant="soft" fullWidth aria-label="X position" defaultValue={0} scrub="X" />
        <NumberField size={size} variant="soft" fullWidth aria-label="Y position" defaultValue={0} scrub="Y" />
      </PanelRow>
    </PanelSection>
    <PanelSection heading="Layout" actions={<Button size={size} variant="ghost" tone="neutral" iconOnly aria-label="Add auto layout" icon={<AutoLayoutIcon />} />}>
      <PanelRow label="Dimensions" action={<Button size={size} variant="ghost" tone="neutral" iconOnly aria-label="Constrain proportions" icon={<AspectRatioIcon />} />}>
        <NumberField size={size} variant="soft" fullWidth aria-label="Width" defaultValue={320} min={0} grouping={false} scrub="W" />
        <NumberField size={size} variant="soft" fullWidth aria-label="Height" defaultValue={240} min={0} grouping={false} scrub="H" />
      </PanelRow>
    </PanelSection>
  </>;
};
const panelMore = (size: PanelTier) => <Button size={size} variant="ghost" tone="neutral" iconOnly aria-label="More actions" icon={<MoreIcon />} />;
export const GalleryPanel = () => (
  <Panel title="Frame" action={panelMore("md")}><PanelSampleRows /></Panel>
);
export const GalleryPanelSections = () => (
  <Panel title="Motion">
    <PanelSection>
      <PanelRow label="Easing"><Select fullWidth variant="soft" aria-label="Easing" defaultValue="ease-out"><option value="ease-out">Ease out</option><option value="linear">Linear</option></Select></PanelRow>
      <PanelRow label="Direction"><Segmented fullWidth aria-label="Direction" defaultValue="in" items={[{ value: "in", label: "In" }, { value: "out", label: "Out" }]} /></PanelRow>
    </PanelSection>
    <PanelSection heading="Timing">
      <PanelRow label={["Duration", "Delay"]}>
        <NumberField variant="soft" fullWidth aria-label="Duration" defaultValue={300} min={0} unit="ms" />
        <NumberField variant="soft" fullWidth aria-label="Delay" defaultValue={0} min={0} unit="ms" />
      </PanelRow>
      <PanelRow><Checkbox label="Reduce motion" /></PanelRow>
    </PanelSection>
  </Panel>
);
export const GalleryPanelFooter = () => {
  const [effects, setEffects] = useState(2);
  return <Panel title="Effects" style={{ blockSize: 360 }}
    footer={<Button variant="soft" fullWidth icon={<PlusIcon />} onClick={() => setEffects(count => count + 1)}>Add effect</Button>}>
    {Array.from({ length: effects }, (_, index) => <PanelSection key={index} heading={`Effect ${index + 1}`}>
      <PanelRow label={["Blur", "Spread"]}>
        <NumberField variant="soft" fullWidth aria-label={`Effect ${index + 1} blur`} min={0} defaultValue={4 * (index + 1)} />
        <NumberField variant="soft" fullWidth aria-label={`Effect ${index + 1} spread`} defaultValue={0} />
      </PanelRow>
    </PanelSection>)}
  </Panel>;
};
export const GalleryPanelSm = () => <Panel size="sm" title="Frame" action={panelMore("sm")}><PanelSampleRows tier="sm" /></Panel>;
/* md shown a little wider than the 240 default (owner, 2026-09-28): the roomier tier at a roomier width. */
export const GalleryPanelMd = () => <Panel size="md" title="Frame" action={panelMore("md")} style={{ "--area-panel-inline-size": "280px" } as CSSProperties}><PanelSampleRows tier="md" /></Panel>;
export const GalleryPanelFlush = () => <Panel flush title="Frame" action={panelMore("md")}><PanelSampleRows /></Panel>;
export const GalleryPanelBareBar = () => <Panel bareBar title="Frame" action={panelMore("md")}><PanelSampleRows /></Panel>;

/* Anchored: the trigger opens the popover beside it, 4px away; Escape or a click outside closes it. */
export const GalleryPopoverTrigger = () => {
  const [size, setSize] = useState({ width: "320", height: "240" });
  return (
    <Popover side="bottom" trigger={<Button variant="outline" tone="neutral">Button</Button>}>
      <PopoverHeader><PopoverTitle>Title</PopoverTitle><PopoverDescription>Description</PopoverDescription></PopoverHeader>
      <PopoverBody>
        <Input fullWidth aria-label="Width" value={size.width} onChange={(event) => setSize({ ...size, width: event.target.value })} />
        <Input fullWidth aria-label="Height" value={size.height} onChange={(event) => setSize({ ...size, height: event.target.value })} />
      </PopoverBody>
    </Popover>
  );
};

export const GalleryPopover = () => (
  <Popover role="dialog">
    <PopoverHeader><PopoverTitle>Title</PopoverTitle><PopoverDescription>Description</PopoverDescription><PopoverClose /></PopoverHeader>
    <PopoverFooter><span style={{ color: "var(--area-fg-muted)" }}>1</span><Button size="sm" variant="outline">Secondary</Button><Button size="sm">Action</Button></PopoverFooter>
  </Popover>
);

export const GalleryPopoverField = () => (
  <Popover role="dialog">
    <PopoverHeader><PopoverTitle>Title</PopoverTitle><PopoverClose /></PopoverHeader>
    <PopoverBody><Input fullWidth id="gallery-popover-field-input" aria-label="Label" placeholder="Placeholder" /></PopoverBody>
    <PopoverFooter><Button size="sm" fullWidth>Action</Button></PopoverFooter>
  </Popover>
);

export const GalleryPopoverImage = () => (
  <Popover role="dialog">
    <PopoverHeader><PopoverTitle>Title</PopoverTitle><PopoverDescription>Description</PopoverDescription><PopoverClose /></PopoverHeader>
    <PopoverBody><PopoverMedia><img src="/images/chip-pixels.png" alt="" /></PopoverMedia></PopoverBody>
  </Popover>
);

/* Arrow: one tile per side. `side` names where the popover sits, so the arrow points back at the trigger. */
const PopoverArrowSample = ({ side }: { side: "top" | "right" | "bottom" | "left" }) => (
  <Popover role="dialog" side={side} arrow style={{ "--area-popover-inline-size": "calc(var(--area-space-96) * 2)" } as CSSProperties}>
    <PopoverHeader><PopoverTitle>Title</PopoverTitle><PopoverDescription>Description</PopoverDescription></PopoverHeader>
  </Popover>
);
export const GalleryPopoverArrowTop = () => <PopoverArrowSample side="top" />;
export const GalleryPopoverArrowRight = () => <PopoverArrowSample side="right" />;
export const GalleryPopoverArrowBottom = () => <PopoverArrowSample side="bottom" />;
export const GalleryPopoverArrowLeft = () => <PopoverArrowSample side="left" />;

export const GalleryProgress = () => (
  <Progress value={62} label="Label" />
);
export const GalleryProgressLabeled = () => (
  <div style={{ display: "grid", gap: "var(--area-space-8)", inlineSize: "100%" }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)" }}><span>Label</span><span>62%</span></div>
    <Progress value={62} label="Label, 62 percent" />
  </div>
);
export const GalleryProgressIndeterminate = () => <Progress label="Label" />;
export const GalleryProgressAccent = () => <SelectionAccent><Progress value={45} label="Label, 45 percent" /></SelectionAccent>;
export const GalleryProgressSmall = () => <Progress value={62} label="Small progress" size="sm" />;
export const GalleryProgressMedium = () => <Progress value={62} label="Medium progress" size="md" />;
export const GalleryProgressLarge = () => <Progress value={62} label="Large progress" size="lg" />;

export const GalleryRadioCard = () => (
  <RadioGroup label="Label" name="gallery-radio-card" defaultValue="basic" style={{ inlineSize: "320px" }}>
    <Radio variant="card" value="basic" label="Option one" caption="Description" leadingVisual={<PersonIcon />} />
    <Radio variant="card" value="business" label="Option two" caption="Description" leadingVisual={<FolderIcon />} />
    <Radio variant="card" value="enterprise" label="Option three" caption="Description" leadingVisual={<TokenIcon />} />
  </RadioGroup>
);
export const GalleryRadioCardTile = () => (
  <RadioGroup label="Layout" name="gallery-radio-card-tile" defaultValue="grid" style={{ inlineSize: "520px" }}>
    <Radio variant="card" layout="tile" value="list" label="List" leadingVisual={<PilotListIcon size={20} />} />
    <Radio variant="card" layout="tile" value="grid" label="Grid" leadingVisual={<PilotGridIcon size={20} />} />
    <Radio variant="card" layout="tile" value="board" label="Board" leadingVisual={<PilotKanbanIcon size={20} />} />
  </RadioGroup>
);
export const GalleryRadio = () => (
  <RadioGroup label="Label" name="gallery-plan" defaultValue="one">
    <Radio value="one" label="Option one" />
    <Radio value="two" label="Option two" />
  </RadioGroup>
);

export const GalleryRadioMedium = () => <Radio size="md" name="gallery-radio-medium" value="medium" label="Medium" />;
export const GalleryRadioLarge = () => <Radio size="lg" name="gallery-radio-large" value="large" label="Large" />;
export const GalleryRadioSelected = () => <Radio name="gallery-radio-selected" value="selected" label="Label" defaultChecked />;
export const GalleryRadioDisabled = () => <Radio name="gallery-radio-disabled" value="disabled" label="Label" disabled />;
export const GalleryRadioDisabledSelected = () => <Radio name="gallery-radio-disabled-selected" value="disabled" label="Label" disabled defaultChecked />;
export const GalleryRadioCardAccent = () => (
  <SelectionAccent><RadioGroup label="Label" name="gallery-radio-card-accent" defaultValue="one" style={{ inlineSize: "320px" }}>
    <Radio variant="card" value="one" label="Option one" caption="Description" leadingVisual={<PersonIcon />} />
    <Radio variant="card" value="two" label="Option two" caption="Description" leadingVisual={<FolderIcon />} />
  </RadioGroup></SelectionAccent>
);

export const GallerySegmented = () => (
  <Segmented aria-label="Label" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />
);
export const GallerySegmentedIcons = () => <Segmented aria-label="Label" defaultValue="top" items={[{ value: "top", label: "Top", icon: <AlignTopIcon /> }, { value: "middle", label: "Middle", icon: <AlignMiddleIcon /> }, { value: "bottom", label: "Bottom", icon: <AlignBottomIcon /> }]} />;
export const GallerySegmentedIconOnly = () => <Segmented iconOnly aria-label="Label" defaultValue="top" items={[{ value: "top", label: "Align top", icon: <AlignTopIcon /> }, { value: "middle", label: "Align middle", icon: <AlignMiddleIcon /> }, { value: "bottom", label: "Align bottom", icon: <AlignBottomIcon /> }]} />;
export const GallerySegmentedFullWidth = () => <Segmented fullWidth aria-label="Label" defaultValue="one" style={{ inlineSize: "100%" }} items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }]} />;
export const GallerySegmentedDisabled = () => <Segmented aria-label="Label" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two", disabled: true }, { value: "three", label: "Three" }]} />;
export const GallerySegmentedSmall = () => <Segmented size="sm" aria-label="Label" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />;
export const GallerySegmentedMedium = () => <Segmented size="md" aria-label="Label" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />;
export const GallerySegmentedLarge = () => <Segmented size="lg" aria-label="Label" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />;

export const GallerySelect = () => (
  <Select aria-label="Label" defaultValue="one"><option value="one">Option one</option><option value="two">Option two</option><option value="three">Option three</option></Select>
);

export const GallerySelectSmall = () => <Select size="sm" aria-label="Label" defaultValue="sm"><option value="sm">Small</option></Select>;
export const GallerySelectMedium = () => <Select size="md" aria-label="Label" defaultValue="md"><option value="md">Medium</option></Select>;
export const GallerySelectLarge = () => <Select size="lg" aria-label="Label" defaultValue="lg"><option value="lg">Large</option></Select>;
export const GallerySelectSuccess = () => <Select validationStatus="success" aria-label="Label" defaultValue="one"><option value="one">Option one</option></Select>;
export const GallerySelectWarning = () => <Select validationStatus="warning" aria-label="Label" defaultValue="one"><option value="one">Option one</option></Select>;

const SeparatorList = ({ inset = false }: { inset?: boolean }) => (
  <div style={{ border: "var(--area-border-width) solid var(--area-border-decorative)", borderRadius: "var(--area-radius-container)", inlineSize: "100%", overflow: "hidden", textAlign: "start", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)", paddingBlock: "var(--area-space-8)" }}>
    <div style={{ paddingInline: "var(--area-space-16)" }}>Item one</div>
    <Separator inset={inset} spacing="normal" />
    <div style={{ paddingInline: "var(--area-space-16)" }}>Item two</div>
    <Separator inset={inset} spacing="normal" />
    <div style={{ paddingInline: "var(--area-space-16)" }}>Item three</div>
  </div>
);
export const GallerySeparatorFullWidth = () => <SeparatorList />;
export const GallerySeparatorInset = () => <SeparatorList inset />;
const SeparatorToolbar = ({ inset = false }: { inset?: boolean }) => (
  <div style={{ alignItems: "stretch", border: "var(--area-border-width) solid var(--area-border-decorative)", borderRadius: "var(--area-radius-container)", display: "flex", gap: "var(--area-space-4)", padding: "var(--area-space-4)", textAlign: "start" }}>
    <Button aria-label="Align top" icon={<AlignTopIcon />} iconOnly variant="ghost" />
    <Button aria-label="Align middle" icon={<AlignMiddleIcon />} iconOnly variant="ghost" />
    <Button aria-label="Align bottom" icon={<AlignBottomIcon />} iconOnly variant="ghost" />
    <Separator inset={inset} orientation="vertical" style={inset ? undefined : { marginBlock: "calc(-1 * var(--area-space-4))" }} />
    <Button aria-label="More options" icon={<DotsFourIcon />} iconOnly variant="ghost" />
  </div>
);
export const GallerySeparatorVerticalFull = () => <SeparatorToolbar />;
export const GallerySeparatorVerticalInset = () => (
  <div style={{ display: "flex", alignItems: "center", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)", textAlign: "start" }}>
    <span>Item one</span><Separator inset orientation="vertical" spacing="normal" style={{ marginBlock: "calc((1lh - 1cap) / 2)" }} />
    <span>Item two</span><Separator inset orientation="vertical" spacing="normal" style={{ marginBlock: "calc((1lh - 1cap) / 2)" }} />
    <span>Item three</span>
  </div>
);

export const GallerySkeleton = () => <Skeleton />;
export const GallerySkeletonText = () => <Skeleton shape="text" style={{ fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)" }} />;
export const GallerySkeletonCircle = () => <Skeleton shape="circle" />;
export const GallerySkeletonType = () => (
  <div style={{ display: "grid", gap: "var(--area-space-16)", inlineSize: "100%" }}>
    {[{ name: "Display", token: "display-sm" }, { name: "Title", token: "title-md" }, { name: "Body", token: "text-md" }].map(({ name, token }) => (
      <div key={name} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", alignItems: "center", gap: "var(--area-space-12)", fontSize: `var(--area-${token}-size)`, lineHeight: `var(--area-${token}-leading)`, letterSpacing: `var(--area-${token}-tracking)` }}>
        <span>{name}</span><Skeleton shape="text" />
      </div>
    ))}
  </div>
);
export const GallerySkeletonStatic = () => <Skeleton animated={false} />;
export const GallerySkeletonParagraph = () => <Skeleton lines={3} style={{ inlineSize: "100%", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)" }} />;
/* The placeholder painted on the real element: it keeps the Button's size and corner. */
export const GallerySkeletonWrap = () => <Skeleton><Button size="md">Action</Button></Skeleton>;
/* A nav or history list while it loads: an icon placeholder and a label line per 32px row
   (Notion's sidebar placeholders, ChatGPT's history shimmer). */
export const GallerySkeletonList = () => (
  <div style={{ display: "grid", inlineSize: "100%", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)" }}>
    {["72%", "54%", "64%"].map(width => (
      <div key={width} style={{ display: "flex", alignItems: "center", gap: "var(--area-gap-md)", blockSize: "var(--area-control-md)", paddingInline: "var(--area-space-8)" }}>
        <Skeleton style={{ inlineSize: "var(--area-icon-md)", blockSize: "var(--area-icon-md)", flex: "none" }} />
        <Skeleton shape="text" style={{ inlineSize: width }} />
      </div>
    ))}
  </div>
);
/* A media object while it loads (Primer's comment skeleton, MUI's media example): avatar, a
   title line, then two lines of text. */
export const GallerySkeletonMediaObject = () => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--area-space-12)", inlineSize: "100%", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)" }}>
    <Skeleton shape="circle" style={{ flex: "none" }} />
    <div style={{ flex: "1 1 auto", minInlineSize: 0 }}>
      <Skeleton shape="text" style={{ inlineSize: "40%" }} />
      <Skeleton lines={2} />
    </div>
  </div>
);
/* A card while it loads: the media box, the title and a paragraph, on the card's own insets;
   controls are left out (Primer, MUI, Carbon; owner 2026-09-28). */
export const GallerySkeletonCard = () => (
  <div style={{ inlineSize: 210, maxInlineSize: "100%" }}><Card role="region" aria-label="Loading card" aria-busy="true" style={{ inlineSize: "100%" }}>
    <CardMedia><Skeleton style={{ blockSize: "100%" }} /></CardMedia>
    <CardContent>
      <Skeleton shape="text" style={{ inlineSize: "56%", fontSize: "var(--area-text-md-size)", lineHeight: "var(--area-text-md-leading)" }} />
      <Skeleton lines={2} style={{ fontSize: "var(--area-text-sm-size)", lineHeight: "var(--area-text-sm-leading)" }} />
    </CardContent>
  </Card></div>
);

export const GallerySlider = () => <Slider aria-label="Label" min={0} max={100} defaultValue={60} readout={value => `${value}%`} />;
export const GallerySliderSmall = () => <Slider aria-label="Label" size="sm" defaultValue={40} readout={value => `${value}%`} />;
export const GallerySliderMedium = () => <Slider aria-label="Label" size="md" defaultValue={60} readout={value => `${value}%`} />;
export const GallerySliderLarge = () => <Slider aria-label="Label" size="lg" defaultValue={80} readout={value => `${value}%`} />;
export const GallerySliderAccent = () => <SelectionAccent><Slider aria-label="Label" defaultValue={65} readout={value => `${value}%`} /></SelectionAccent>;
export const GallerySliderWithLabel = () => <Slider label="Label" labelPosition="top" defaultValue={50} readout={value => `${value}%`} />;
export const GallerySliderLabelOnly = () => <Slider label="Label" labelPosition="top" defaultValue={50} />;
export const GallerySliderSteps = () => <Slider aria-label="Label" min={0.5} max={2} step={0.25} defaultValue={1} readout={value => `${value}×`} />;
export const GallerySliderStepMarks = () => <Slider aria-label="Label" min={0} max={5} step={1} defaultValue={1} stepMarks />;
export const GallerySliderVertical = () => <Slider aria-label="Label" orientation="vertical" defaultValue={50} />;
export const GallerySliderControlled = () => {
  const [value, setValue] = useState(40);
  return <Slider label="Label" labelPosition="top" value={value} onValueChange={setValue} readout={value => `${value}%`} />;
};
export const GallerySliderRangeWithInputs = () => <SliderRange defaultValue={[42, 75]} />;
export const GallerySliderDisabled = () => <Slider aria-label="Label" defaultValue={60} readout={value => `${value}%`} disabled />;
export const GallerySliderBare = () => <Slider aria-label="Label" defaultValue={40} />;


export const GallerySpinner = () => (
  <Spinner />
);
export const GallerySpinnerSmall = () => <Spinner size="sm" />;
export const GallerySpinnerMedium = () => <Spinner size="md" />;
export const GallerySpinnerLarge = () => <Spinner size="lg" />;
export const GallerySpinnerAccent = () => <SelectionAccent><Spinner /></SelectionAccent>;
export const GallerySpinnerButton = () => <Button loading>Button</Button>;
export const GallerySpinnerBadge = () => <Badge icon={<Spinner />} tone="neutral">Badge</Badge>;
export const GallerySpinnerInput = () => <Input aria-label="Label" placeholder="Placeholder" loading loaderPosition="trailing" />;
export const GallerySpinnerEmpty = () => (
  <div style={{ display: "grid", justifyItems: "center", gap: "var(--area-space-12)", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)", textAlign: "center" }}>
    <Spinner label="Loading" />
    <span style={{ fontWeight: "var(--area-weight-strong)" }}>Title</span>
    <span>Description</span>
  </div>
);

export const GallerySwitch = () => (
  <Switch label="Label" defaultChecked />
);

export const GalleryTable = () => (
  <Table aria-label="Table"><thead><tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col" className="area-table__cell--numeric">Value</th></tr></thead><tbody><tr><td>Item one</td><td><Badge tone="success" dot>Status</Badge></td><td className="area-table__cell--numeric">1</td></tr><tr><td>Item two</td><td><Badge>Status</Badge></td><td className="area-table__cell--numeric">2</td></tr></tbody></Table>
);

export const GalleryTableSelectable = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const rows = ["Item one", "Item two", "Item three"];
  return <Table aria-label="Table"><thead><tr><th scope="col" className="area-table__cell--fit"><Checkbox aria-label="Select all rows" checked={selected.length === rows.length} indeterminate={selected.length > 0 && selected.length < rows.length} onChange={event => setSelected(event.target.checked ? rows : [])} /></th><th scope="col">Name</th></tr></thead><tbody>{rows.map(name => <tr key={name} data-selected={selected.includes(name) ? "" : undefined}><td><Checkbox aria-label={`Select ${name}`} checked={selected.includes(name)} onChange={event => setSelected(event.target.checked ? [...selected, name] : selected.filter(item => item !== name))} /></td><td>{name}</td></tr>)}</tbody></Table>;
};
export const GalleryTableSorting = () => {
  const [descending, setDescending] = useState(false);
  const rows = [{ name: "Item one", value: 1 }, { name: "Item two", value: 12 }, { name: "Item three", value: 128 }].sort((a, b) => descending ? b.value - a.value : a.value - b.value);
  return <Table aria-label="Table"><thead><tr><th scope="col">Name</th><th scope="col" aria-sort={descending ? "descending" : "ascending"} className="area-table__cell--numeric"><Button size="sm" variant="ghost" align="end" trailingIcon={descending ? <PilotArrowDownIcon /> : <PilotArrowUpIcon />} onClick={() => setDescending(!descending)}>Value</Button></th></tr></thead><tbody>{rows.map(row => <tr key={row.name}><td>{row.name}</td><td className="area-table__cell--numeric">{row.value}</td></tr>)}</tbody></Table>;
};
export const GalleryTableCompact = () => <Table size="sm" aria-label="Table"><thead><tr><th scope="col">Name</th><th scope="col" className="area-table__cell--numeric">Value</th></tr></thead><tbody>{["Item one", "Item two", "Item three"].map((name, i) => <tr key={name}><td>{name}</td><td className="area-table__cell--numeric">{[1, 12, 128][i]} MB</td></tr>)}</tbody></Table>;
export const GalleryTableStriped = () => <Table striped aria-label="Table"><thead><tr><th scope="col">Name</th><th scope="col" className="area-table__cell--numeric">Value</th></tr></thead><tbody>{["Item one", "Item two", "Item three", "Item four"].map((name, i) => <tr key={name}><td>{name}</td><td className="area-table__cell--numeric">{[1, 12, 128, 1024][i]} MB</td></tr>)}</tbody></Table>;
export const GalleryTableDividers = () => <Table columnDividers aria-label="Table"><thead><tr><th scope="col">Name</th><th scope="col">Label</th><th scope="col">Status</th></tr></thead><tbody><tr><td>Item one</td><td>Label</td><td>Status</td></tr><tr><td>Item two</td><td>Label</td><td>Status</td></tr></tbody></Table>;
export const GalleryTableEmpty = () => <Table aria-label="Table"><thead><tr><th scope="col">Name</th><th scope="col">Status</th></tr></thead><tbody><tr><td colSpan={2}>No items</td></tr></tbody></Table>;
export const GalleryTableLoading = () => <Table aria-label="Table" aria-busy="true"><thead><tr><th scope="col">Name</th><th scope="col">Status</th></tr></thead><tbody>{[0, 1, 2].map(row => <tr key={row}><td><Skeleton shape="text" style={{ inlineSize: "var(--area-space-96)" }} /></td><td><Skeleton shape="text" style={{ inlineSize: "var(--area-space-48)" }} /></td></tr>)}</tbody></Table>;

export const GalleryTabs = () => (
  <Tabs aria-label="Tabs, default" items={[{ id: "one", label: "Item one", content: "Body text" }, { id: "two", label: "Item two", content: "Body text" }, { id: "three", label: "Item three", content: "Body text" }]} style={{ inlineSize: "100%" }} />
);
export const GalleryTabsDisabled = () => <Tabs aria-label="Tabs, disabled" items={[{ id: "one", label: "Item one", content: "Body text" }, { id: "two", label: "Item two", disabled: true, content: "Body text" }, { id: "three", label: "Item three", content: "Body text" }]} />;
export const GalleryTabsVertical = () => <Tabs aria-label="Tabs, vertical" orientation="vertical" items={[{ id: "one", label: "Item one", content: "Body text" }, { id: "two", label: "Item two", content: "Body text" }, { id: "three", label: "Item three", content: "Body text" }]} />;
export const GalleryTabsSmall = () => <Tabs aria-label="Tabs, small" size="sm" items={[{ id: "one", label: "Item one", content: "Body text" }, { id: "two", label: "Item two", content: "Body text" }]} />;
export const GalleryTabsTrack = () => <Tabs aria-label="Tabs, track" track items={[{ id: "one", label: "Item one", content: "Body text" }, { id: "two", label: "Item two", content: "Body text" }]} />;
export const GalleryTabsIcons = () => <Tabs aria-label="Tabs, icons" items={[{ id: "one", label: "Item one", icon: <PersonSmallIcon />, content: "Body text" }, { id: "two", label: "Item two", icon: <InfoIcon />, content: "Body text" }]} />;
export const GalleryTabsCounts = () => <Tabs aria-label="Tabs, counts" items={[{ id: "one", label: "Item one", trailing: <Count variant="soft" count={12} />, content: "Body text" }, { id: "two", label: "Item two", trailing: <Count variant="soft" count={3} />, content: "Body text" }]} />;

export const GalleryTextarea = () => <Textarea aria-label="Label" placeholder="Placeholder" rows={3} />;

export const GalleryTextareaSmall = () => <Textarea size="sm" rows={3} aria-label="Label" placeholder="Small" />;
export const GalleryTextareaMedium = () => <Textarea size="md" rows={3} aria-label="Label" placeholder="Medium" />;
export const GalleryTextareaCount = () => {
  const [value, setValue] = useState("");
  return <Field label="Label" description={`${value.length} / 160 characters`}><Textarea fullWidth rows={3} maxLength={160} value={value} onChange={event => setValue(event.target.value)} placeholder="Placeholder" /></Field>;
};

export const GalleryToast = () => <Toast tone="success" icon={<CheckIcon />}>Body text</Toast>;
export const GalleryToastInfo = () => <Toast tone="info" icon={<InfoIcon />}>Body text</Toast>;
export const GalleryToastWarning = () => <Toast tone="warning" icon={<AlertIcon />}>Body text</Toast>;
export const GalleryToastDanger = () => <Toast tone="danger" icon={<AlertIcon />}>Body text</Toast>;
export const GalleryToastTitle = () => <Toast tone="info" icon={<InfoIcon />} title="Title">Body text</Toast>;
export const GalleryToastMultiline = () => <Toast tone="info" icon={<InfoIcon />} style={{ inlineSize: "calc(var(--area-space-96) * 2 + var(--area-space-48))" }}>Body text that wraps onto a second line</Toast>;
export const GalleryToastAction = () => {
  const [undone, setUndone] = useState(false);
  return <Toast icon={<CheckIcon />} tone="success" action={!undone ? <Button size="sm" variant="outline" onClick={() => setUndone(true)}>Undo</Button> : undefined}>Body text</Toast>;
};
/* A Toaster (audit E-11): announced through its own live regions, paused on hover and focus,
   5s by default, an Undo toast stays until dismissed; F8 reaches the stack. */
const ToasterButtons = () => {
  const toaster = useToaster();
  return <div style={{ display: "flex", gap: "var(--area-space-8)" }}>
    <Button variant="outline" onClick={() => toaster.show({ tone: "success", icon: <CheckIcon />, message: "Body text" })}>Action</Button>
    <Button variant="outline" onClick={() => { const id = toaster.show({ icon: <TrashIcon />, message: "Body text", action: <Button size="sm" variant="outline" onClick={() => toaster.dismiss(id)}>Undo</Button> }); }}>Delete</Button>
  </div>;
};
export const GalleryToaster = () => <Toaster><ToasterButtons /></Toaster>;
export const GalleryToastDismissible = () => {
  const [visible, setVisible] = useState(true);
  return visible ? <Toast icon={<CheckIcon />} tone="success" onDismiss={() => setVisible(false)}>Body text</Toast> : <Button variant="outline" onClick={() => setVisible(true)}>Show notification</Button>;
};

export const GalleryTooltip = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--area-space-8)" }}>
    <Tooltip id="gallery-tooltip-copy">Description</Tooltip>
    <Button aria-describedby="gallery-tooltip-copy" variant="outline">Button</Button>
  </div>
);
export const GalleryTooltipArrow = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--area-space-8)" }}>
    <Tooltip arrow id="gallery-tooltip-arrow-content">Description</Tooltip>
    <Button aria-describedby="gallery-tooltip-arrow-content" variant="outline">Button</Button>
  </div>
);
export const GalleryTooltipKbd = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--area-space-8)" }}>
    <Tooltip id="gallery-tooltip-shortcut">Description <Kbd keys={["cmd", "K"]} /></Tooltip>
    <Button aria-describedby="gallery-tooltip-shortcut" variant="outline">Button</Button>
  </div>
);
export const GalleryTooltipSide = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--area-space-8)" }}>
    <Button aria-describedby="gallery-tooltip-side-label" variant="outline">Button</Button>
    <Tooltip id="gallery-tooltip-side-label" side="right">Description</Tooltip>
  </div>
);

export const GalleryTooltipBottom = () => <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--area-space-4)" }}><Button variant="outline" aria-describedby="tooltip-bottom">Button</Button><Tooltip side="bottom" id="tooltip-bottom">Description</Tooltip></div>;
export const GalleryTooltipLeft = () => <div style={{ display: "flex", alignItems: "center", gap: "var(--area-space-4)" }}><Tooltip side="left" id="tooltip-left">Description</Tooltip><Button variant="outline" aria-describedby="tooltip-left">Button</Button></div>;

export const CodeInProse = () => (
  <p>Install the package with <Code>npm install @area/react</Code>.</p>
);

export const SegmentedSizes = () => (
  <div className="docs-gallery-stack">
    <Segmented size="sm" aria-label="Label" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />
    <Segmented size="md" aria-label="Label" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />
    <Segmented size="lg" aria-label="Label" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />
  </div>
);

export const SegmentedFullWidth = () => (
  <div style={{ inlineSize: 280 }}><Segmented fullWidth aria-label="Label" defaultValue="one" items={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three", disabled: true }]} /></div>
);

const fileTree = [
  { id: "src", label: "src", icon: <FolderIcon />, children: [
    { id: "components", label: "components", icon: <FolderIcon />, children: [
      { id: "avatar", label: "Avatar.tsx", icon: <DocumentIcon />, trailing: "A" },
      { id: "button", label: "Button.tsx", icon: <DocumentIcon />, trailing: "M" },
    ] },
    { id: "index", label: "index.ts", icon: <DocumentIcon /> },
  ] },
  { id: "package", label: "package.json", icon: <DocumentIcon /> },
];
const filterTree = [
  { id: "markets", label: "Item one", trailing: "85", children: [
    { id: "open", label: "Item two", trailing: "24" },
    { id: "funding", label: "Item three", trailing: "12", children: [
      { id: "positive", label: "Option one", trailing: "4" },
      { id: "negative", label: "Option two", trailing: "3" },
    ] },
    { id: "spot", label: "Item four", trailing: "110" },
  ] },
  { id: "setup", label: "Item five", trailing: "27" },
];
export const GalleryTreeViewFiles = () => {
  const [current, setCurrent] = useState("button");
  return <TreeView aria-label="Project files" items={fileTree} defaultExpandedIds={["src", "components"]} currentId={current} selectedIds={[current]} onActivate={setCurrent} />;
};
/* Folders as filled glyphs in one hue (owner, pass 2). */
const blueFolder = <PilotFolderFilledIcon style={{ color: "var(--area-fg-info)" }} />;
const filledTree = [
  { id: "src", label: "src", icon: blueFolder, children: [
    { id: "components", label: "components", icon: blueFolder, children: [
      { id: "avatar", label: "Avatar.tsx", icon: <PilotDocumentIcon />, trailing: "A" },
      { id: "button", label: "Button.tsx", icon: <PilotDocumentIcon />, trailing: "M" },
    ] },
    { id: "index", label: "index.ts", icon: <PilotDocumentIcon /> },
  ] },
  { id: "public", label: "public", icon: blueFolder, children: [{ id: "favicon", label: "favicon.svg", icon: <PilotDocumentIcon /> }] },
  { id: "package", label: "package.json", icon: <PilotDocumentIcon /> },
];
export const GalleryTreeViewFilledFolders = () => {
  const [current, setCurrent] = useState("button");
  return <TreeView aria-label="Project files with filled folders" items={filledTree} defaultExpandedIds={["src", "components"]} currentId={current} selectedIds={[current]} onActivate={setCurrent} />;
};
/*
 * Figma-style layers: row controls at the end. Visibility is pinned while a layer is hidden.
 * Layer-type glyphs (frame, rectangle, component) are not drawn yet; these are stand-ins.
 */
const LayerControls = ({ name, hidden, onToggle }: { name: string; hidden: boolean; onToggle: () => void }) => <>
  <Button variant="ghost" size="sm" iconOnly tabIndex={-1} icon={<PilotMoreHorizontalIcon />} aria-label={`More options for ${name}`} />
  <Button variant="ghost" size="sm" iconOnly tabIndex={-1} data-pinned={hidden ? "" : undefined} icon={hidden ? <EyeSlashIcon /> : <EyeIcon />} aria-label={hidden ? `Show ${name}` : `Hide ${name}`} aria-pressed={hidden} onClick={onToggle} />
</>;
export const GalleryTreeViewLayers = () => {
  const [hidden, setHidden] = useState<string[]>(["rect-6"]);
  const [current, setCurrent] = useState("rect-5");
  const layer = (id: string, label: string, icon: ReactNode, children?: TreeViewNode[]): TreeViewNode => ({ id, label, icon, children,
    actions: <LayerControls name={label} hidden={hidden.includes(id)} onToggle={() => setHidden(list => list.includes(id) ? list.filter(item => item !== id) : [...list, id])} /> });
  const items = [
    layer("frame", "Frame 19", <AutoLayoutIcon />, [
      layer("rect-5", "Rectangle 5", <CornersIcon />),
      layer("rect-7", "Rectangle 7", <CornersIcon />),
      layer("rect-6", "Rectangle 6", <CornersIcon />),
      layer("rect-4", "Rectangle 4", <CornersIcon />),
    ]),
    layer("globe", "Globe", <span style={{ display: "contents", color: "var(--area-fg-discovery)" }}><TokenIcon /></span>),
  ];
  return <TreeView aria-label="Layers" items={items} defaultExpandedIds={["frame"]} selectedIds={[current]} onActivate={setCurrent} />;
};
export const GalleryTreeViewFilters = () => <TreeView aria-label="Filters" selectionMode="checkbox" items={filterTree} defaultExpandedIds={["markets", "funding"]} defaultSelectedIds={["open"]} />;

export const GalleryComposerInline = () => {
  const [sent, setSent] = useState("");
  return <div style={{ inlineSize: "100%" }}><Composer label="Label" placeholder="Placeholder" leadingActions={<Button variant="ghost" iconOnly icon={<PlusIcon />} aria-label="Add attachment" onClick={() => setSent("Attachment action")} />} trailingActions={<Button variant="ghost" iconOnly icon={<SearchIcon />} aria-label="Search tools" onClick={() => setSent("Search tools action")} />} onSubmit={setSent} /><span className="area-sr-only" role="status">{sent && `Sent: ${sent}`}</span></div>;
};
export const GalleryComposerStacked = () => {
  const [sent, setSent] = useState("");
  const [mode, setMode] = useState("Option one");
  return <div style={{ inlineSize: "100%" }}><Composer layout="stacked" label="Label" placeholder="Placeholder" mode={<ModelPicker label="Label" value={mode} onValueChange={setMode} items={[{ value: "Option one", label: "Option one" }, { value: "Option two", label: "Option two" }]} />} leadingActions={<Button variant="ghost" iconOnly icon={<PlusIcon />} aria-label="Add attachment" onClick={() => setSent("Attachment action")} />} onSubmit={setSent} /><span className="area-sr-only" role="status">{sent && `Sent: ${sent}`}</span></div>;
};
const archivedTree = [
  { id: "src", label: "src", icon: <FolderIcon />, children: [
    { id: "button", label: "Button.tsx", icon: <DocumentIcon /> },
    { id: "legacy", label: "Legacy.tsx", icon: <DocumentIcon />, trailing: "Locked", disabled: true },
  ] },
];
export const GalleryTreeViewDisabled = () => <TreeView aria-label="Project with a locked file" items={archivedTree} defaultExpandedIds={["src"]} defaultSelectedIds={["button"]} />;
export const GalleryTreeViewCollapsed = () => <TreeView aria-label="Collapsed project" items={fileTree} defaultSelectedIds={["src"]} />;
export const GalleryComposerPrefilled = () => {
  const [value, setValue] = useState("Body text");
  const [sent, setSent] = useState("");
  return <div style={{ inlineSize: "100%" }}><Composer layout="stacked" label="Label" value={value} onValueChange={setValue} onSubmit={message => { setSent(message); setValue(""); }} /><span className="area-sr-only" role="status">{sent && `Sent: ${sent}`}</span></div>;
};
export const GalleryComposerDisabled = () => <Composer label="Label" placeholder="Placeholder" disabled />;
export const GalleryComposerLoading = () => <Composer label="Label" placeholder="Placeholder" defaultValue="Body text" loading onStop={() => {}} leadingActions={<Button variant="ghost" iconOnly icon={<PlusIcon />} aria-label="Add attachment" />} />;
export const GalleryComposerPill = () => <Composer label="Label" placeholder="Placeholder" defaultValue="Body text" submitPill leadingActions={<Button variant="ghost" iconOnly icon={<PlusIcon />} aria-label="Add attachment" />} />;

export const GalleryColorFieldSplit = () => (
<div style={{display: "grid", gap: "var(--area-space-8)"}}>
  {["#1E1E1E", "#D9D9D9", "#FFFFFF"].map((color, i) => <ColorField key={color} alpha variant="soft" defaultValue={color} aria-label={`Fill ${i + 1}`} opacityLabel={`Fill ${i + 1} opacity`} />)}
</div>
);
/** In a parent that sets both dimensions, the grid fills it. */
export const GalleryAlignmentPickerFill = () => <div style={{ inlineSize: "220px", blockSize: "112px" }}><AlignmentPicker label="Fill alignment" defaultValue="center" /></div>;
const pickerSwatches = [
  {value: "#01AA4E", label: "Green 500"}, {value: "#006DF5", label: "Blue 500"},
  {value: "#5C5DFE", label: "Indigo 500"}, {value: "#8D4DF3", label: "Purple 500"},
  {value: "#DF127D", label: "Pink 500"}, {value: "#E80945", label: "Red 500"},
  {value: "#EA7401", label: "Orange 500"}, {value: "#00A797", label: "Teal 500"},
];
export const GalleryColorPicker = () => {
  const [swatches, setSwatches] = useState(pickerSwatches);
  return <ColorPicker label="Fill" defaultValue="#8D4DF3" swatches={swatches} onAddSwatch={value => setSwatches(current => current.some(item => item.value === value) ? current : [...current, {value, label: value}])} />;
};
const allViews = ["spectrum", "grid", "sliders"] as const;
export const GalleryColorPickerViews = () => <ColorPicker label="Fill" defaultValue="#8D4DF3" views={allViews} preview />;
export const GalleryColorPickerGrid = () => <ColorPicker label="Fill" defaultValue="#006DF5" views={allViews} defaultView="grid" />;
export const GalleryColorPickerSliders = () => <ColorPicker label="Fill" defaultValue="#DF127D" views={allViews} defaultView="sliders" defaultModel="oklch" />;
export const GalleryColorPickerModelOklch = () => <ColorPicker label="Fill" defaultValue="#01AA4E" defaultModel="oklch" />;
export const GalleryColorPickerContrast = () => <ColorPicker label="Text" defaultValue="#5C5DFE" contrast={{ background: "#FFFFFF", level: "AA" }} />;
export const GalleryColorPickerPreview = () => <ColorPicker label="Fill" defaultValue="#EA7401" preview />;
export const GalleryColorPickerHeader = () => {
  const [open, setOpen] = useState(true);
  return open
    ? <ColorPicker label="Fill" defaultValue="#006DF5" header={<><span>Fill</span><Button variant="ghost" size="sm" iconOnly icon={<DismissIcon />} aria-label="Close fill picker" onClick={() => setOpen(false)} /></>} />
    : <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>Reopen fill picker</Button>;
};
export const GalleryColorPickerModelRgb = () => <ColorPicker label="Stroke" defaultValue="#EA7401" defaultModel="rgb" />;
export const GalleryColorPickerModelHsl = () => <ColorPicker label="Shadow" defaultValue="#1E1E1E66" defaultModel="hsl" />;
export const GalleryColorPickerModelCss = () => <ColorPicker label="Background" defaultValue="#00A79780" defaultModel="css" />;
export const GalleryColorPickerOpaque = () => <ColorPicker label="Page background" defaultValue="#F5F5F5" alpha={false} />;
/* Plain drops the floating plate, for a picker inside a Popover or Panel (audit F-20). */
export const GalleryColorPickerPlain = () => <ColorPicker variant="plain" label="Fill" defaultValue="#8D4DF3" alpha={false} />;
export const GalleryColorPickerDisabled = () => <ColorPicker label="Locked fill" defaultValue="#8D4DF3" disabled swatches={pickerSwatches.slice(0, 4)} />;

/* Calendar. A fixed "today" keeps the gallery deterministic. */
const calendarToday = "2026-09-26";
export const GalleryCalendar = () => <Calendar aria-label="Due date" today={calendarToday} defaultValue="2026-09-15" />;
export const GalleryCalendarRange = () => <Calendar aria-label="Trip dates" selectionMode="range" today={calendarToday} defaultValue={{ start: "2026-09-15", end: "2026-09-19" }} />;
export const GalleryCalendarTwoMonths = () => <Calendar aria-label="Report period" selectionMode="range" visibleMonths={2} today={calendarToday} defaultValue={{ start: "2026-09-24", end: "2026-10-06" }} />;
export const GalleryCalendarMultiple = () => <Calendar aria-label="Office days" selectionMode="multiple" today={calendarToday} defaultValue={["2026-09-08", "2026-09-10", "2026-09-15", "2026-09-17"]} />;
export const GalleryCalendarUnavailable = () => <Calendar aria-label="Booking date" today={calendarToday} defaultMonth="2026-09" min="2026-09-03" max="2026-10-10" isDateUnavailable={date => ["2026-09-12", "2026-09-13", "2026-09-22"].includes(date)} />;
export const GalleryCalendarMonday = () => <Calendar aria-label="Sprint start" firstDayOfWeek={1} locale="en-GB" today={calendarToday} defaultValue="2026-09-28" />;
export const GalleryCalendarPlain = () => <Calendar variant="plain" aria-label="Publish date" today={calendarToday} defaultValue="2026-09-30" />;
export const GalleryCalendarAccent = () => <SelectionAccent><Calendar aria-label="Launch window" selectionMode="range" today={calendarToday} defaultValue={{ start: "2026-09-15", end: "2026-09-19" }} /></SelectionAccent>;
/* Calendar day treatments (docs/specs/calendar.md). */
const weekend = (date: string) => [0, 6].includes(new Date(`${date}T12:00`).getDay());
export const GalleryCalendarCircle = () => <Calendar days="circle" weekdayStyle="narrow" aria-label="Appointment date" today={calendarToday} defaultValue="2026-09-08" min="2026-09-08" max="2026-10-10" isDateUnavailable={weekend} />;
export const GalleryCalendarTile = () => <Calendar days="tile" weekdayStyle="abbreviated" firstDayOfWeek={1} locale="en-GB" aria-label="Delivery date" today={calendarToday} defaultValue="2026-09-16" showOutsideDays={false} min="2026-09-16" isDateUnavailable={date => ["2026-09-18", "2026-09-19", "2026-09-20", "2026-09-26", "2026-09-27"].includes(date)} />;
export const GalleryCalendarMarkers = () => <Calendar firstDayOfWeek={1} aria-label="Send date" today={calendarToday} defaultValue="2026-09-21" markers={{ "2026-09-04": "info", "2026-09-14": "info", "2026-09-29": "neutral", "2026-10-08": "neutral" }} />;
export const GalleryCalendarWeek = () => <Calendar layout="week" firstDayOfWeek={1} aria-label="Visit day" today={calendarToday} defaultValue="2026-09-30" markers={{ "2026-10-01": "info" }} />;
const scheduleTimes = ["8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "1:00 PM"];
/* Schedule: the calendar surface (Calendar variant="surface": 8 top, 12 sides, the floating lift)
   split by a rule; the time list is a column of the grid's 36px cells holding 32px plates, 14 from
   each side like the day plates, and scrolls within the calendar's height. docs/specs/calendar.md. */
export const GalleryCalendarSchedule = () => {
  const [date, setDate] = useState<string | null>("2026-09-28");
  const [time, setTime] = useState("10:00 AM");
  const [scheduled, setScheduled] = useState("");
  const label = date ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T12:00`)) : "No date";
  const rule = "var(--area-border-width) solid var(--area-border-decorative)";
  return <div className="area-calendar area-calendar--surface" style={{ display: "grid", padding: 0 }}>
    <div style={{ display: "flex" }}>
      <div style={{ padding: "calc(var(--area-space-8) - var(--area-border-width)) calc(var(--area-space-12) - var(--area-border-width)) var(--area-space-12)" }}>
        <Calendar variant="plain" aria-label="Send date" firstDayOfWeek={1} today={calendarToday} value={date} onValueChange={setDate} min={calendarToday} markers={{ "2026-10-04": "info", "2026-10-14": "info" }} />
      </div>
      <div style={{ position: "relative", inlineSize: "calc(var(--area-space-96) + var(--area-space-24))", borderInlineStart: rule }}>
        <div role="group" aria-label="Send time" style={{ position: "absolute", inset: 0, display: "grid", alignContent: "start", gap: "var(--area-space-4)", padding: "var(--area-space-8) calc(var(--area-space-12) - var(--area-border-width) + var(--area-space-2))", overflowY: "auto", scrollPaddingBlock: "var(--area-space-8)" }}>
          {scheduleTimes.map(item => <Button key={item} variant="ghost" size="md" fullWidth selected={item === time} onClick={() => setTime(item)}>{item}</Button>)}
        </div>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "var(--area-space-8)", padding: "var(--area-space-8) calc(var(--area-space-12) - var(--area-border-width))", borderBlockStart: rule }}>
      <Button variant="ghost" size="sm" onClick={() => setScheduled("")}>Cancel</Button>
      <span style={{ marginInlineStart: "auto", color: "var(--area-fg-muted)", fontSize: "var(--area-control-sm-text)", lineHeight: "var(--area-control-sm-leading)", fontVariantNumeric: "tabular-nums" }}>{label} · {time}</span>
      <Button variant="outline" size="sm" disabled={!date} onClick={() => setScheduled(`${label} ${time}`)}>Schedule</Button>
    </div>
    <span className="area-sr-only" role="status">{scheduled && `Scheduled for ${scheduled}`}</span>
  </div>;
};
export const GalleryCalendarDisabled = () => <Calendar aria-label="Locked date" today={calendarToday} defaultValue="2026-09-15" disabled />;

/* The Selection role in the accent (DESIGN_SYSTEM.md, "Emphasis roles"): scoped with
   data-area-selection="accent", as a theme would set it. */
export const GalleryCheckboxAccent = () => <SelectionAccent><Checkbox label="Label" defaultChecked /></SelectionAccent>;
export const GalleryRadioAccent = () => <SelectionAccent><Radio name="gallery-radio-accent" value="accent" label="Label" defaultChecked /></SelectionAccent>;
export const GalleryChipAccent = () => <SelectionAccent><ChipGroup aria-label="Filters"><Chip defaultSelected>Selected</Chip><Chip>Item</Chip></ChipGroup></SelectionAccent>;
export const GalleryAlignmentPickerAccent = () => <SelectionAccent><AlignmentFrame><AlignmentPicker label="Object alignment" defaultValue="top-left" /></AlignmentFrame></SelectionAccent>;
