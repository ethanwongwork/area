/** Real, compact specimens for the component gallery. Framing never rescales controls. */
import { useState } from "react";
import { Alert, Avatar, AvatarGroup, Badge, BadgeAnchor, Button, Card, CardAction, CardDescription, CardFooter, CardMedia, CardTitle, Checkbox, CheckboxGroup, Chip, ChipGroup, ChipLink, Code, CodeBlock, Dialog, Field, Input, Kbd, KbdGroup, Menu, MenuItem, Nav, NavItem, Panel, PanelSection, Popover, Progress, Radio, RadioGroup, Segmented, Select, Separator, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Token, Tooltip } from "@area/react";
import { ArrowIcon, CheckIcon, DismissIcon, DotsFourIcon, InfoIcon, OpenIcon, PersonIcon, PlusIcon, SearchIcon, TokenIcon, TrashIcon } from "../icons.tsx";
import { SliderRangeComposition } from "./slider-range.tsx";

export const GalleryAlert = () => (
  <Alert icon={<InfoIcon />} title="Title">Body copy goes here.</Alert>
);
export const GalleryAlertAccent = () => <Alert tone="accent" icon={<InfoIcon />} title="Title">Body copy goes here.</Alert>;
export const GalleryAlertSuccess = () => <Alert tone="success" icon={<CheckIcon />} title="Title">Body copy goes here.</Alert>;
export const GalleryAlertDanger = () => <Alert tone="danger" icon={<DismissIcon />} title="Title">Body copy goes here.</Alert>;
export const GalleryAlertLink = () => <Alert icon={<InfoIcon />} title="Title" link={<a href="#gallery-alert-multiline">Text link</a>}>Body copy goes here.</Alert>;
export const GalleryAlertAction = () => <Alert icon={<InfoIcon />} title="Title" action={<><Button size="sm" variant="outline">Secondary</Button><Button size="sm">Action</Button></>} onDismiss={() => {}}>Body copy goes here.</Alert>;
export const GalleryAlertMultiline = () => <Alert layout="multiline" icon={<InfoIcon />} title="Title" action={<><Button size="sm" variant="outline">Secondary</Button><Button size="sm">Action</Button></>} onDismiss={() => {}}>Secondary body copy goes here.</Alert>;
export const GalleryAlertDismissible = () => {
  const [visible, setVisible] = useState(true);
  return visible ? <Alert icon={<InfoIcon />} title="Title" onDismiss={() => setVisible(false)}>Body copy goes here.</Alert> : <Button size="sm" variant="outline" onClick={() => setVisible(true)}>Show alert</Button>;
};

export const GalleryAvatar = () => (
  <Avatar fallback="A" alt="Avatar" />
);

export const GalleryAvatarImage = () => <Avatar src="/images/chip-avatar.png" fallback="A" alt="Avatar photo" />;
export const GalleryAvatarImageFallback = () => <Avatar src="/images/avatar-missing.png" fallback="A" alt="Avatar fallback" />;
export const GalleryAvatarTwoInitials = () => <Avatar fallback="AV" alt="Avatar initials" />;
export const GalleryAvatarIcon = () => <Avatar icon={<PersonIcon />} alt="Generic avatar" />;
export const GalleryAvatarGroup = () => <AvatarGroup max={3} aria-label="Project members"><Avatar fallback="AM" alt="Avery Morgan" /><Avatar src="/images/chip-avatar.png" fallback="JW" alt="Jordan Wong" /><Avatar fallback="SK" alt="Sam Kim" /><Avatar fallback="NP" alt="Noah Patel" /><Avatar fallback="RL" alt="Riley Lee" /></AvatarGroup>;
export const GalleryAvatarActive = () => <Avatar active fallback="AM" alt="Active avatar" />;
export const GalleryAvatarAvailability = () => <BadgeAnchor compact placement="bottom-end" overlap="circular" badge={<Badge size="sm" dotOnly tone="success" aria-label="Available" />}><Avatar fallback="AM" role="img" aria-label="Avery Morgan, available" /></BadgeAnchor>;
export const GalleryAvatarNotification = () => <BadgeAnchor compact placement="top-end" overlap="circular" badge={<Badge size="sm" variant="solid" tone="info">2</Badge>}><Avatar src="/images/chip-avatar.png" fallback="JW" alt="Jordan Wong, 2 notifications" /></BadgeAnchor>;
export const GalleryAvatarAccent = () => <Avatar tone="accent" fallback="AC" alt="Accent avatar" />;
export const GalleryAvatarInverse = () => <Avatar tone="inverse" fallback="IN" alt="Inverse avatar" />;
export const GalleryAvatarSquare = () => <Avatar shape="square" fallback="S" alt="Square avatar" />;
export const GalleryAvatarSmall = () => <Avatar size="sm" fallback="S" alt="Small avatar" />;
export const GalleryAvatarMedium = () => <Avatar size="md" fallback="M" alt="Medium avatar" />;
export const GalleryAvatarLarge = () => <Avatar size="lg" fallback="L" alt="Large avatar" />;

export const GalleryBadge = () => (
  <Badge tone="success" dot>Live</Badge>
);

export const GalleryButton = () => (
  <Button>Button</Button>
);

export const GalleryButtonSmall = () => <Button size="sm">Button</Button>;
export const GalleryButtonMedium = () => <Button size="md">Button</Button>;
export const GalleryButtonLarge = () => <Button size="lg">Button</Button>;
export const GalleryButtonSuccess = () => <Button tone="success">Button</Button>;
export const GalleryButtonAccent = () => <Button tone="accent">Button</Button>;
export const GalleryButtonWithIcon = () => <Button icon={<PlusIcon />}>Add item</Button>;
export const GalleryButtonDisabled = () => <Button disabled>Button</Button>;
export const GalleryButtonLoading = () => <Button loading>Saving</Button>;
export const GalleryButtonIconOnly = () => <Button iconOnly icon={<PlusIcon />} aria-label="Add item" />;
export const GalleryButtonSoft = () => <Button variant="soft">Button</Button>;
export const GalleryButtonOutline = () => <Button variant="outline">Button</Button>;
export const GalleryButtonGhost = () => <Button variant="ghost">Button</Button>;
export const GalleryButtonPill = () => <Button pill>Button</Button>;
export const GalleryButtonSelected = () => <Button selected>Selected</Button>;
export const GalleryButtonShortcut = () => <Button aria-keyshortcuts="Meta+Enter">Save <Kbd keys={["cmd", "enter"]} size="small" /></Button>;
export const GalleryButtonNeutralSolid = () => <Button tone="neutral">Button</Button>;
export const GalleryButtonNeutralSoft = () => <Button tone="neutral" variant="soft">Button</Button>;
export const GalleryButtonNeutralOutline = () => <Button tone="neutral" variant="outline">Button</Button>;
export const GalleryButtonNeutralGhost = () => <Button tone="neutral" variant="ghost">Button</Button>;
export const GalleryButtonAccentSolid = () => <Button tone="accent">Button</Button>;
export const GalleryButtonAccentSoft = () => <Button tone="accent" variant="soft">Button</Button>;
export const GalleryButtonAccentOutline = () => <Button tone="accent" variant="outline">Button</Button>;
export const GalleryButtonAccentGhost = () => <Button tone="accent" variant="ghost">Button</Button>;
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
  <Checkbox label="Email updates" defaultChecked />
);

export const GalleryCheckboxSmall = () => <Checkbox size="sm" label="Small" />;
export const GalleryCheckboxMedium = () => <Checkbox size="md" label="Medium" />;
export const GalleryCheckboxLarge = () => <Checkbox size="lg" label="Large" />;
export const GalleryCheckboxSelected = () => <Checkbox label="Selected" defaultChecked />;
export const GalleryCheckboxIndeterminate = () => <Checkbox label="Partial selection" indeterminate />;
export const GalleryCheckboxCaption = () => <Checkbox label="Email updates" caption="Get notified about activity." />;
export const GalleryCheckboxLeadingVisual = () => <Checkbox label="GitHub notifications" leadingVisual={<CheckIcon />} />;
export const GalleryCheckboxCard = () => <Checkbox variant="card" label="Enable notifications" caption="Manage this anytime." leadingVisual={<CheckIcon />} />;
export const GalleryCheckboxInvalid = () => <Checkbox label="Accept terms" invalid />;
export const GalleryCheckboxInvalidChecked = () => <Checkbox label="Required confirmation" defaultChecked invalid />;
export const GalleryCheckboxDisabled = () => <Checkbox label="Unavailable" disabled />;
export const GalleryCheckboxDisabledChecked = () => <Checkbox label="Unavailable selected" defaultChecked disabled />;
export const GalleryCheckboxDisabledIndeterminate = () => <Checkbox label="Unavailable partial selection" indeterminate disabled />;
export const GalleryCheckboxGroup = () => (
  <CheckboxGroup label="Notifications" description="Choose the updates you want.">
    <Checkbox name="gallery-notifications" value="mentions" label="Mentions" defaultChecked />
    <Checkbox name="gallery-notifications" value="replies" label="Replies" />
  </CheckboxGroup>
);
export const GalleryCheckboxGroupInvalid = () => (
  <CheckboxGroup label="Desktop items" error="Choose at least one item.">
    <Checkbox name="gallery-items" value="drives" label="Hard disks" />
    <Checkbox name="gallery-items" value="servers" label="Servers" />
  </CheckboxGroup>
);
export const GalleryCheckboxGroupSuccess = () => (
  <CheckboxGroup label="Release notes" validation="Two channels selected." validationStatus="success">
    <Checkbox name="gallery-release-notes" value="email" label="Email" defaultChecked />
    <Checkbox name="gallery-release-notes" value="in-app" label="In-app" defaultChecked />
  </CheckboxGroup>
);

export const GalleryChip = () => (
  <Chip>Design</Chip>
);

export const GalleryChipSmall = () => <Chip size="sm">Design</Chip>;
export const GalleryChipMedium = () => <Chip size="md">Design</Chip>;
export const GalleryChipLarge = () => <Chip size="lg">Design</Chip>;
export const GalleryChipSwatch = () => <Chip swatch="var(--area-indigo-500)">Indigo</Chip>;
export const GalleryChipIcon = () => <Chip icon={<CheckIcon />}>Published</Chip>;
export const GalleryChipDisabled = () => <Chip disabled>Locked</Chip>;
export const GalleryChipGroup = () => <ChipGroup><Chip defaultSelected>All</Chip><Chip>Open</Chip><Chip>Closed</Chip></ChipGroup>;
export const GalleryChipAssist = () => <Chip variant="assist" icon={<SearchIcon />}>Search</Chip>;
export const GalleryChipFilter = () => <Chip icon={<CheckIcon />}>Filter</Chip>;
export const GalleryChipInput = () => <Chip variant="input">Input</Chip>;
export const GalleryChipSuggestion = () => <Chip variant="suggestion">Suggestion</Chip>;
export const GalleryChipDelete = () => <Chip variant="input" onRemove={() => {}}>Delete</Chip>;
export const GalleryChipClickableDelete = () => <Chip variant="input" clickable onClick={() => {}} onRemove={() => {}}>Delete</Chip>;
export const GalleryChipCustomDelete = () => <Chip variant="input" onRemove={() => {}} removeIcon={<TrashIcon />} removeLabel="Delete">Delete</Chip>;
export const GalleryChipLinkUnderline = () => <ChipLink href="#gallery-section-chip">Link</ChipLink>;
export const GalleryChipLinkIcon = () => <ChipLink href="#gallery-section-chip" treatment="icon" trailingIcon={<OpenIcon />}>Link out</ChipLink>;
export const GalleryChipAvatarInitials = () => <Chip avatar={<Avatar fallback="AV" alt="Avatar initials" />}>Avatar</Chip>;
export const GalleryChipAvatarPhoto = () => <Chip avatar={<Avatar src="/images/chip-avatar.png" alt="Photo" />}>Photo</Chip>;
export const GalleryChipImageFilter = () => <Chip image="/images/chip-pixels.png" imageAlt="">Image</Chip>;
export const GalleryChipInvalid = () => <Chip variant="input" invalid onRemove={() => {}}>Unrecognized tag</Chip>;

export const GalleryCode = () => <Code>const project = "area"</Code>;
export const CodeSubtle = () => <Code subtle>--area-fg-muted</Code>;
export const CodeOnColor = () => <span style={{ background: "var(--area-accent-solid)", borderRadius: "var(--area-radius-standard)", color: "var(--area-fg-on-accent)", padding: "var(--area-space-8)" }}><Code onColor>area</Code></span>;
export const CodeTokenSwatch = () => <Code swatch="var(--area-accent-solid)">--area-accent-solid</Code>;

export const GalleryCodeBlock = () => <CodeBlock code={'import { Button }\n  from "@area/react";'} style={{ inlineSize: "100%" }} />;

export const GalleryDialog = () => (
  <Dialog role="group" aria-modal={undefined} title="Save changes?" description="Keep your latest edits."
    footer={<><Button size="sm" variant="ghost">Cancel</Button><Button size="sm">Save</Button></>}
    style={{ inlineSize: "100%" }} />
);

export const GalleryField = () => (
  <Field label="Email address" description="Use your work email.">
    <Input type="email" placeholder="you@example.com" />
  </Field>
);

export const GalleryFieldSmall = () => <Field label="Email"><Input size="sm" placeholder="Small" /></Field>;
export const GalleryFieldMedium = () => <Field label="Email"><Input size="md" placeholder="Medium" /></Field>;
export const GalleryFieldLarge = () => <Field label="Email"><Input size="lg" placeholder="Large" /></Field>;

export const GalleryInput = () => (
  <Input aria-label="Search the gallery specimen" leadingIcon={<SearchIcon />} placeholder="Search anything" />
);

export const GalleryInputSmall = () => <Input size="sm" aria-label="Small input" placeholder="Small" />;
export const GalleryInputMedium = () => <Input size="md" aria-label="Medium input" placeholder="Medium" />;
export const GalleryInputLarge = () => <Input size="lg" aria-label="Large input" placeholder="Large" />;

export const GalleryKbd = () => (
  <Kbd keys={["cmd", "K"]} />
);
export const GalleryKbdSmall = () => <Kbd keys={["cmd", "K"]} size="small" />;
export const GalleryKbdQuiet = () => <Kbd keys={["cmd", "K"]} size="small" appearance="quiet" />;
export const GalleryKbdChord = () => <Kbd keys={["cmd", "shift", "P"]} />;
export const GalleryKbdSequence = () => (
  <KbdGroup><Kbd keys={["G"]} /><Kbd keys={["I"]} /></KbdGroup>
);
export const GalleryKbdOnColor = () => (
  <Button tone="accent" aria-keyshortcuts="Meta+K">Open <Kbd keys={["cmd", "K"]} size="small" /></Button>
);

export const GalleryMenu = () => (
  <Menu>
    <MenuItem shortcut={<Kbd keys={["cmd", "K"]} size="small" quiet />}>
      <span className="area-menu__icon"><SearchIcon /></span>
      <span className="area-menu__text">Search</span>
    </MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "N"]} size="small" quiet />}>
      <span className="area-menu__icon"><PlusIcon /></span>
      <span className="area-menu__text">New document</span>
    </MenuItem>
    <div className="area-menu__separator" />
    <MenuItem>
      <span className="area-menu__icon"><TokenIcon /></span>
      <span className="area-menu__text">Use connectors</span>
    </MenuItem>
    <MenuItem shortcut={<ArrowIcon />}>
      <span className="area-menu__icon"><DotsFourIcon /></span>
      <span className="area-menu__text">More</span>
    </MenuItem>
    <MenuItem tone="danger" shortcut={<Kbd keys={["cmd", "backspace"]} size="small" quiet />}>
      <span className="area-menu__icon"><DismissIcon /></span>
      <span className="area-menu__text">Delete</span>
    </MenuItem>
  </Menu>
);

export const GalleryNav = () => (
  <Nav aria-label="Gallery navigation specimen" style={{ inlineSize: "100%" }}>
    <NavItem href="#gallery-nav" current>Overview</NavItem><NavItem href="#gallery-nav">Activity</NavItem><NavItem href="#gallery-nav">Settings</NavItem>
  </Nav>
);

export const GalleryPanel = () => (
  <Panel title="Appearance" style={{ inlineSize: "100%" }}>
    <PanelSection>
      <Field orientation="horizontal" label="Style" htmlFor="gallery-panel-style"><Select id="gallery-panel-style" defaultValue="soft"><option value="soft">Soft</option><option value="outline">Outline</option></Select></Field>
      <Field orientation="horizontal" label="Visible" htmlFor="gallery-panel-visible"><Switch id="gallery-panel-visible" defaultChecked /></Field>
    </PanelSection>
  </Panel>
);

export const GalleryPopover = () => (
  <Popover style={{ inlineSize: "100%", minInlineSize: 0 }}><div className="docs-gallery-stack"><Field label="Project name" htmlFor="gallery-project"><Input id="gallery-project" defaultValue="Untitled" /></Field><Button variant="outline" size="sm">Create project</Button></div></Popover>
);

export const GalleryProgress = () => (
  <Progress value={62} label="Upload progress" />
);

export const GalleryRadio = () => (
  <RadioGroup label="Plan" name="gallery-plan" defaultValue="starter">
    <Radio value="starter" label="Starter" />
    <Radio value="pro" label="Pro" />
  </RadioGroup>
);

export const GalleryRadioSmall = () => <Radio size="sm" name="gallery-radio-small" value="small" label="Small" />;
export const GalleryRadioMedium = () => <Radio size="md" name="gallery-radio-medium" value="medium" label="Medium" />;
export const GalleryRadioLarge = () => <Radio size="lg" name="gallery-radio-large" value="large" label="Large" />;
export const GalleryRadioSelected = () => <Radio name="gallery-radio-selected" value="selected" label="Selected" defaultChecked />;
export const GalleryRadioDisabled = () => <Radio name="gallery-radio-disabled" value="disabled" label="Unavailable" disabled />;

export const GallerySegmented = () => (
  <Segmented label="Gallery view specimen" value="design" options={[{ value: "design", label: "Design" }, { value: "preview", label: "Preview" }]} />
);

export const GallerySelect = () => (
  <Select aria-label="Gallery status specimen" defaultValue="draft"><option value="draft">Draft</option><option value="review">In review</option><option value="live">Published</option></Select>
);

export const GallerySelectSmall = () => <Select size="sm" aria-label="Small select" defaultValue="sm"><option value="sm">Small</option></Select>;
export const GallerySelectMedium = () => <Select size="md" aria-label="Medium select" defaultValue="md"><option value="md">Medium</option></Select>;
export const GallerySelectLarge = () => <Select size="lg" aria-label="Large select" defaultValue="lg"><option value="lg">Large</option></Select>;
export const GallerySelectSuccess = () => <Select validationStatus="success" aria-label="Verified region" defaultValue="us"><option value="us">United States</option></Select>;
export const GallerySelectWarning = () => <Select validationStatus="warning" aria-label="Region warning" defaultValue="us"><option value="us">United States</option></Select>;

export const GallerySeparator = () => (
  <div className="docs-gallery-stack"><span className="docs-gallery-caption">Workspace</span><Separator /><span className="docs-gallery-caption">Personal projects</span></div>
);

export const GallerySkeleton = () => (
  <Skeleton shape="text" style={{ inlineSize: "60%" }} />
);

export const GallerySlider = () => <Slider aria-label="Gallery opacity specimen" min={0} max={100} defaultValue={60} readout={value => `${value}%`} />;
export const GallerySliderSmall = () => <Slider aria-label="Small opacity" size="sm" defaultValue={40} readout={value => `${value}%`} />;
export const GallerySliderMedium = () => <Slider aria-label="Medium opacity" size="md" defaultValue={60} readout={value => `${value}%`} />;
export const GallerySliderLarge = () => <Slider aria-label="Large opacity" size="lg" defaultValue={80} readout={value => `${value}%`} />;
export const GallerySliderNeutral = () => <Slider aria-label="Neutral opacity" tone="neutral" defaultValue={45} readout={value => `${value}%`} />;
export const GallerySliderAccent = () => <Slider aria-label="Accent opacity" tone="accent" defaultValue={65} readout={value => `${value}%`} />;
export const GallerySliderWithLabel = () => <Slider label="Volume" labelPosition="top" defaultValue={50} readout={value => `${value}%`} />;
export const GallerySliderLabelOnly = () => <Slider label="Volume" labelPosition="top" defaultValue={50} />;
export const GallerySliderSteps = () => <Slider aria-label="Scale" min={0.5} max={2} step={0.25} defaultValue={1} readout={value => `${value}×`} />;
export const GallerySliderStepMarks = () => <Slider aria-label="Step example" min={0} max={5} step={1} defaultValue={1} stepMarks />;
export const GallerySliderVertical = () => <Slider aria-label="Vertical volume" orientation="vertical" defaultValue={50} style={{ ["--_vertical-length" as string]: "100%" }} />;
export const GallerySliderControlled = () => {
  const [value, setValue] = useState(40);
  return <Slider label="Temperature" labelPosition="top" value={value} onValueChange={setValue} readout={value => `${value}%`} />;
};
export const GallerySliderRangeWithInputs = () => <SliderRangeComposition />;
export const GallerySliderDisabled = () => <Slider aria-label="Locked volume" defaultValue={60} readout={value => `${value}%`} disabled />;
export const GallerySliderBare = () => <Slider aria-label="Brightness" defaultValue={40} />;


export const GallerySpinner = () => (
  <Spinner />
);
export const GallerySpinnerSmall = () => <Spinner size="sm" />;
export const GallerySpinnerMedium = () => <Spinner size="md" />;
export const GallerySpinnerLarge = () => <Spinner size="lg" />;
export const GallerySpinnerAccent = () => <Spinner tone="accent" />;

export const GallerySwitch = () => (
  <Switch label="Notifications" defaultChecked />
);

export const GallerySwitchSmall = () => <Switch size="sm" label="Small" />;
export const GallerySwitchMedium = () => <Switch size="md" label="Medium" />;
export const GallerySwitchLarge = () => <Switch size="lg" label="Large" />;
export const GallerySwitchOn = () => <Switch label="On" defaultChecked />;
export const GallerySwitchDisabled = () => <Switch label="Unavailable" disabled />;

export const GalleryTable = () => (
  <Table><thead><tr><th>Name</th><th>Status</th></tr></thead><tbody><tr><td>Website</td><td><Badge tone="success" dot>Live</Badge></td></tr><tr><td>Brand kit</td><td><Badge>Draft</Badge></td></tr></tbody></Table>
);

export const GalleryTabs = () => (
  <Tabs value="gallery-account" tabs={[{ id: "gallery-account", label: "Account" }, { id: "gallery-security", label: "Security" }]} style={{ inlineSize: "100%" }}><span className="docs-gallery-caption">Manage your account details.</span></Tabs>
);

export const GalleryTextarea = () => <Textarea aria-label="Gallery message specimen" placeholder="Leave a note…" rows={3} />;

export const GalleryTextareaSmall = () => <Textarea size="sm" rows={3} aria-label="Small textarea" placeholder="Small" />;
export const GalleryTextareaMedium = () => <Textarea size="md" rows={3} aria-label="Medium textarea" placeholder="Medium" />;
export const GalleryTextareaLarge = () => <Textarea size="lg" rows={3} aria-label="Large textarea" placeholder="Large" />;

export const GalleryToast = () => <Toast tone="success" icon={<CheckIcon />} style={{ inlineSize: "100%", minInlineSize: 0 }}>Changes saved.</Toast>;

export const GalleryToken = () => (
  <Token swatch="var(--area-accent-solid)">--area-accent-solid</Token>
);

export const GalleryTooltip = () => <Tooltip>Copy to clipboard</Tooltip>;

export const CodeInProse = () => (
  <p>Install the package with <Code>npm install @area/react</Code>.</p>
);

export const CodeBlockPlain = () => <CodeBlock code={'const project = "Area";\nconsole.log(project);'} />;

export const CodeBlockFlush = () => <CodeBlock layout="flush" code={'export default "Area";'} />;

export const SegmentedSizes = () => (
  <div className="docs-gallery-stack">
    <Segmented size="sm" label="Small view" value="list" options={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }]} />
    <Segmented size="md" label="Medium view" value="list" options={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }]} />
    <Segmented size="lg" label="Large view" value="list" options={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }]} />
  </div>
);

export const SegmentedFullWidth = () => (
  <div style={{ inlineSize: 280 }}><Segmented fullWidth label="Viewport" value="desktop" options={[{ value: "desktop", label: "Desktop" }, { value: "mobile", label: "Mobile" }, { value: "tablet", label: "Tablet", disabled: true }]} /></div>
);
