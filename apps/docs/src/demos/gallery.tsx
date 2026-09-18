/** Real, compact specimens for the component gallery. Framing never rescales controls. */
import { Alert, Avatar, Badge, Button, Card, CardAction, CardDescription, CardFooter, CardMedia, CardTitle, Checkbox, CheckboxGroup, Chip, Code, CodeBlock, Dialog, Field, Input, Kbd, KbdGroup, Menu, MenuItem, Nav, NavItem, Panel, PanelSection, Popover, Progress, Radio, RadioGroup, Segmented, Select, Separator, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Token, Tooltip } from "@area/react";
import { ArrowIcon, CheckIcon, DismissIcon, DotsFourIcon, InfoIcon, PlusIcon, SearchIcon, TokenIcon } from "../icons.tsx";

export const GalleryAlert = () => (
  <Alert icon={<InfoIcon />} title="A little heads up">Your trial ends in 3 days.</Alert>
);

export const GalleryAvatar = () => (
  <Avatar fallback="AL" alt="Alex Lee" />
);

export const GalleryAvatarSmall = () => <Avatar size="sm" fallback="AL" alt="Alex Lee" />;
export const GalleryAvatarMedium = () => <Avatar size="md" fallback="AL" alt="Alex Lee" />;
export const GalleryAvatarLarge = () => <Avatar size="lg" fallback="AL" alt="Alex Lee" />;

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

export const GalleryCard = () => (
  <Card style={{ inlineSize: "100%" }}>
    <CardMedia>
      <span className="area-card__media-cluster" aria-hidden="true">
        <span className="area-card__media-tile"><InfoIcon /></span>
        <span className="area-card__media-tile"><DotsFourIcon /></span>
        <span className="area-card__media-tile"><TokenIcon /></span>
      </span>
      <span className="area-card__media-caption">Area</span>
    </CardMedia>
    <CardTitle>Project toolkit</CardTitle>
    <CardDescription>A shared place for tools, notes, and integrations.</CardDescription>
    <CardAction href="#"><TokenIcon /><span>Open integrations</span><ArrowIcon /></CardAction>
    <CardFooter><Button size="sm" variant="outline">Previous</Button><Button size="sm" tone="accent">Continue</Button></CardFooter>
  </Card>
);

export const GalleryCheckbox = () => (
  <Checkbox label="Email updates" defaultChecked />
);

export const GalleryCheckboxSmall = () => <Checkbox size="sm" label="Small" />;
export const GalleryCheckboxMedium = () => <Checkbox size="md" label="Medium" />;
export const GalleryCheckboxLarge = () => <Checkbox size="lg" label="Large" />;
export const GalleryCheckboxExtraSmall = () => <Checkbox size="xs" label="Extra small" />;
export const GalleryCheckboxExtraLarge = () => <Checkbox size="xl" label="Extra large" />;
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
  <Chip selected>Design</Chip>
);

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

export const GalleryInputExtraSmall = () => <Input size="xs" aria-label="Extra small input" placeholder="Extra small" />;
export const GalleryInputSmall = () => <Input size="sm" aria-label="Small input" placeholder="Small" />;
export const GalleryInputMedium = () => <Input size="md" aria-label="Medium input" placeholder="Medium" />;
export const GalleryInputLarge = () => <Input size="lg" aria-label="Large input" placeholder="Large" />;
export const GalleryInputExtraLarge = () => <Input size="xl" aria-label="Extra large input" placeholder="Extra large" />;

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
export const GalleryRadioExtraSmall = () => <Radio size="xs" name="gallery-radio-xs" value="xs" label="Extra small" />;
export const GalleryRadioExtraLarge = () => <Radio size="xl" name="gallery-radio-xl" value="xl" label="Extra large" />;
export const GalleryRadioSelected = () => <Radio name="gallery-radio-selected" value="selected" label="Selected" defaultChecked />;
export const GalleryRadioDisabled = () => <Radio name="gallery-radio-disabled" value="disabled" label="Unavailable" disabled />;

export const GallerySegmented = () => (
  <Segmented label="Gallery view specimen" value="design" options={[{ value: "design", label: "Design" }, { value: "preview", label: "Preview" }]} />
);

export const GallerySelect = () => (
  <Select aria-label="Gallery status specimen" defaultValue="draft"><option value="draft">Draft</option><option value="review">In review</option><option value="live">Published</option></Select>
);

export const GallerySelectExtraSmall = () => <Select size="xs" aria-label="Extra small select" defaultValue="xs"><option value="xs">Extra small</option></Select>;
export const GallerySelectSmall = () => <Select size="sm" aria-label="Small select" defaultValue="sm"><option value="sm">Small</option></Select>;
export const GallerySelectMedium = () => <Select size="md" aria-label="Medium select" defaultValue="md"><option value="md">Medium</option></Select>;
export const GallerySelectLarge = () => <Select size="lg" aria-label="Large select" defaultValue="lg"><option value="lg">Large</option></Select>;
export const GallerySelectExtraLarge = () => <Select size="xl" aria-label="Extra large select" defaultValue="xl"><option value="xl">Extra large</option></Select>;
export const GallerySelectSuccess = () => <Select validationStatus="success" aria-label="Verified region" defaultValue="us"><option value="us">United States</option></Select>;
export const GallerySelectWarning = () => <Select validationStatus="warning" aria-label="Region warning" defaultValue="us"><option value="us">United States</option></Select>;

export const GallerySeparator = () => (
  <div className="docs-gallery-stack"><span className="docs-gallery-caption">Workspace</span><Separator /><span className="docs-gallery-caption">Personal projects</span></div>
);

export const GallerySkeleton = () => (
  <Skeleton shape="text" style={{ inlineSize: "60%" }} />
);

export const GallerySlider = () => <Slider aria-label="Gallery opacity specimen" min={0} max={100} defaultValue={60} />;

export const GallerySpinner = () => (
  <Spinner />
);

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
