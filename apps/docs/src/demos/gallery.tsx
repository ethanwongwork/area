/** Real, compact specimens for the component gallery. Framing never rescales controls. */
import { useId, useRef, useState } from "react";
import { Alert, Avatar, AvatarGroup, Badge, BadgeAnchor, Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardMedia, CardTitle, Checkbox, CheckboxGroup, Chip, ChipGroup, ChipLink, Code, CodeBlock, Dialog, Field, Input, Kbd, KbdGroup, Menu, MenuItem, MenuLabel, MenuSearch, MenuSeparator, Nav, NavGroup, NavItem, Panel, PanelSection, Popover, PopoverBody, PopoverDescription, PopoverFooter, PopoverHeader, PopoverMedia, PopoverTitle, Progress, Radio, RadioGroup, Segmented, Select, Separator, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Token, Tooltip } from "@area/react";
import { AlignBottomIcon, AlignMiddleIcon, AlignTopIcon, ArrowIcon, CheckIcon, ChevronIcon, DismissIcon, DotsFourIcon, InfoIcon, OpenIcon, PersonIcon, PlusIcon, SearchIcon, TokenIcon, TrashIcon } from "../icons.tsx";
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
export const GalleryButtonShortcut = () => <Button aria-keyshortcuts="Meta+Enter">Save <Kbd keys={["cmd", "enter"]} /></Button>;
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
export const CodeOnColor = () => <div style={{ alignSelf: "stretch", blockSize: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", inlineSize: "100%", background: "var(--area-accent-solid)", borderRadius: "var(--area-space-24)", color: "var(--area-fg-on-accent)", padding: "var(--area-space-24)" }}><Code onColor>area</Code></div>;
export const CodeTokenSwatch = () => <Code swatch="var(--area-accent-solid)">--area-accent-solid</Code>;

export const CodeInTable = () => (
  <Table aria-label="Package scripts">
    <thead><tr><th>Task</th><th>Command</th><th>Shortcut</th></tr></thead>
    <tbody>
      <tr><td>Build</td><td><Code>npm run build</Code></td><td><Kbd keys={["cmd", "B"]} /></td></tr>
      <tr><td>Test</td><td><Code>npm test</Code></td><td><Kbd keys={["cmd", "T"]} /></td></tr>
    </tbody>
  </Table>
);

const sampleCode = 'import { Button } from "@area/react";\n\nexport function Example() {\n  return <Button>Action</Button>;\n}';
export const GalleryCodeBlock = () => <CodeBlock code={sampleCode} style={{ inlineSize: "100%" }} />;
export const GalleryCodeBlockWrap = () => <CodeBlock layout="wrap" code={'// Supporting example text that wraps to the available width.\nconst label = "Placeholder content for the example";'} style={{ inlineSize: "100%" }} />;
export const GalleryCodeBlockCopy = () => {
  const [message, setMessage] = useState("Copy");
  return <CodeBlock title="example.tsx" code={sampleCode} style={{ inlineSize: "100%" }} actions={<Button variant="ghost" onClick={async () => { try { await navigator.clipboard.writeText(sampleCode); setMessage("Copied"); } catch { setMessage("Copy failed"); } }}><span aria-live="polite">{message}</span></Button>} />;
};

export const GalleryDialog = () => (
  <Dialog role="group" aria-modal={undefined} title="Dialog title" description="Supporting text goes here."
    footer={<><Button variant="ghost">Cancel</Button><Button>Action</Button></>}
    style={{ inlineSize: "100%" }} />
);
export const GalleryDialogForm = () => <Dialog role="group" aria-modal={undefined} title="Dialog title" description="Supporting text goes here." style={{ inlineSize: "100%" }} footer={<><Button variant="ghost">Cancel</Button><Button>Action</Button></>}><Field label="Field label"><Input fullWidth placeholder="Placeholder text" /></Field></Dialog>;
export const GalleryDialogModal = () => {
  const modal = useRef<HTMLDialogElement>(null);
  return <><Button onClick={() => modal.current?.showModal()}>Open dialog</Button><dialog ref={modal} className="area-dialog__modal" aria-label="Dialog title"><Dialog role="group" aria-modal={undefined} title="Dialog title" description="Supporting text goes here." footer={<><Button variant="ghost" onClick={() => modal.current?.close()}>Cancel</Button><Button onClick={() => modal.current?.close()}>Action</Button></>}>Body copy goes here.</Dialog></dialog></>;
};

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
export const GalleryKbdQuiet = () => <Kbd keys={["cmd", "K"]} appearance="quiet" />;
export const GalleryKbdChord = () => <Kbd keys={["cmd", "shift", "P"]} />;
export const GalleryKbdSequence = () => (
  <KbdGroup><Kbd keys={["cmd", "K"]} /><Kbd keys={["P"]} /></KbdGroup>
);
export const GalleryKbdOnColor = () => (
  <Button tone="accent" aria-keyshortcuts="Meta+K">
    Open <Kbd appearance="on-color" keys={["cmd", "K"]} />
  </Button>
);
export const GalleryKbdOnEmphasis = () => (
  <Tooltip>
    Toggle sidebar <Kbd appearance="on-emphasis" keys={["cmd", "B"]} />
  </Tooltip>
);

export const GalleryMenu = () => (
  <Menu aria-label="Menu actions">
    <MenuLabel>Section title</MenuLabel>
    <MenuItem shortcut={<Kbd keys={["cmd", "K"]} quiet />}>
      <span className="area-menu__icon"><SearchIcon /></span>
      <span className="area-menu__text">Action one</span>
    </MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "N"]} quiet />}>
      <span className="area-menu__icon"><PlusIcon /></span>
      <span className="area-menu__text">Action two</span>
    </MenuItem>
    <MenuSeparator />
    <MenuLabel>Another section</MenuLabel>
    <MenuItem>
      <span className="area-menu__icon"><TokenIcon /></span>
      <span className="area-menu__text">Action three</span>
    </MenuItem>
    <MenuItem shortcut={<ArrowIcon />}>
      <span className="area-menu__icon"><DotsFourIcon /></span>
      <span className="area-menu__text">More actions</span>
    </MenuItem>
    <MenuItem tone="danger" shortcut={<Kbd appearance="on-color" keys={["cmd", "backspace"]} />}>
      <span className="area-menu__icon"><DismissIcon /></span>
      <span className="area-menu__text">Delete item</span>
    </MenuItem>
  </Menu>
);

export const GalleryMenuSelected = () => (
  <Menu aria-label="Selection menu">
    <MenuLabel>Section title</MenuLabel>
    <MenuItem data-selected shortcut={<CheckIcon />}><span className="area-menu__text">Option one</span></MenuItem>
    <MenuItem><span className="area-menu__text">Option two</span></MenuItem>
    <MenuItem><span className="area-menu__text">Option three</span></MenuItem>
  </Menu>
);

export const GalleryMenuSearch = () => (
  <MenuSearch>
    <Input aria-label="Search options" leadingIcon={<SearchIcon />} placeholder="Search options" variant="soft" />
    <Menu aria-label="Search results">
      <MenuLabel>Section title</MenuLabel>
      <MenuItem><span className="area-menu__text">Item one</span></MenuItem>
      <MenuItem><span className="area-menu__text">Item two</span></MenuItem>
      <MenuItem><span className="area-menu__text">Item three</span></MenuItem>
    </Menu>
  </MenuSearch>
);

export const GalleryMenuSubmenu = () => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--area-space-8)" }}>
    <Menu aria-label="Primary menu">
      <MenuLabel>Section title</MenuLabel>
      <MenuItem><span className="area-menu__text">Item one</span></MenuItem>
      <MenuItem><span className="area-menu__text">Item two</span></MenuItem>
      <MenuItem shortcut={<ArrowIcon />} data-highlighted><span className="area-menu__text">More items</span></MenuItem>
    </Menu>
    <Menu aria-label="Nested menu" style={{ marginBlockStart: "calc(var(--area-border-width) + var(--area-space-4) + var(--area-control-md) + var(--area-control-md) + var(--area-control-md) + var(--area-space-2) + var(--area-space-2) + var(--area-space-2))" }}>
      <MenuLabel>More items</MenuLabel>
      <MenuItem><span className="area-menu__text">Item one</span></MenuItem>
      <MenuItem><span className="area-menu__text">Item two</span></MenuItem>
      <MenuItem><span className="area-menu__text">Item three</span></MenuItem>
    </Menu>
  </div>
);

export const GalleryMenuDisabled = () => (
  <Menu aria-label="Disabled actions">
    <MenuLabel>Section title</MenuLabel>
    <MenuItem><span className="area-menu__icon"><PlusIcon /></span><span className="area-menu__text">Action one</span></MenuItem>
    <MenuItem disabled><span className="area-menu__icon"><TokenIcon /></span><span className="area-menu__text">Action two</span></MenuItem>
    <MenuSeparator />
    <MenuLabel>Another section</MenuLabel>
    <MenuItem tone="danger"><span className="area-menu__icon"><DismissIcon /></span><span className="area-menu__text">Delete item</span></MenuItem>
  </Menu>
);

/** Embedded controls retain their own native semantics in a grouped menu surface. */
export const GalleryMenuControls = () => {
  const [option, setOption] = useState("one");
  const row = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--area-space-16)", minBlockSize: "var(--area-control-md)", boxSizing: "border-box", paddingInline: "var(--area-space-8)" } as const;
  return (
    <Menu role="group" aria-label="Section title" style={{ marginInline: "auto", inlineSize: "100%", maxInlineSize: "calc(var(--area-space-96) * 3 + var(--area-space-32))", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)" }}>
      <MenuLabel style={{ paddingInline: "var(--area-space-8)" }}>Section title</MenuLabel>
      <div style={row}><span>Item one</span><Switch aria-label="Item one" style={{ minBlockSize: "var(--area-space-20)" }} defaultChecked /></div>
      <div style={row}><span>Item two</span><Segmented label="Item two" value={option} onSelect={setOption} options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} /></div>
      <div style={row}><span>Item three</span><Checkbox aria-label="Item three" defaultChecked /></div>
      <MenuSeparator />
      <div style={row}><span>Item four</span><Button variant="soft">Action</Button></div>
    </Menu>
  );
};

export const GalleryNav = () => (
  <Nav aria-label="Gallery navigation specimen">
    <NavGroup label="Section title">
      <NavItem href="#gallery-nav-default" icon={<DotsFourIcon />} current>Overview</NavItem><NavItem href="#gallery-nav-default" icon={<PersonIcon />} trailing={<Badge size="sm" tone="info">12</Badge>}>Members</NavItem><NavItem href="#gallery-nav-default" icon={<TokenIcon />} trailing={<Badge size="sm" tone="warning">Beta</Badge>}>Library</NavItem>
    </NavGroup>
    <NavGroup label="Another section">
      <NavItem href="#gallery-nav">Item one</NavItem><NavItem href="#gallery-nav">Item two</NavItem><NavItem href="#gallery-nav">Item three</NavItem>
    </NavGroup>
  </Nav>
);

export const GalleryNavMarker = () => (
  <Nav aria-label="Marker navigation specimen" selection="marker">
    <NavGroup label="Section title">
      <NavItem href="#gallery-nav-marker" current>Item one</NavItem><NavItem href="#gallery-nav-marker">Item two</NavItem><NavItem href="#gallery-nav-marker">Item three</NavItem>
    </NavGroup>
    <NavGroup label="Another section">
      <NavItem href="#gallery-nav-marker">Item one</NavItem><NavItem href="#gallery-nav-marker">Item two</NavItem><NavItem href="#gallery-nav-marker">Item three</NavItem>
    </NavGroup>
  </Nav>
);

export const GalleryNavHorizontal = () => (
  <Nav orientation="horizontal" aria-label="Horizontal navigation specimen">
    <NavItem href="#gallery-nav-horizontal" icon={<DotsFourIcon />} current>Overview</NavItem>
    <NavItem href="#gallery-nav-horizontal" icon={<PersonIcon />} trailing={<Badge size="sm" tone="info">4</Badge>}>Team</NavItem>
    <NavItem href="#gallery-nav-horizontal">Settings</NavItem>
  </Nav>
);

export const GalleryNavActions = () => {
  const [open, setOpen] = useState(true);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const id = useId();
  return <Nav aria-label="Navigation with actions">
    <NavGroup label="Workspace">
      <NavItem href="#gallery-nav-actions" icon={<DotsFourIcon />} current actions={<><Button size="sm" variant="ghost" iconOnly icon={<CheckIcon />} aria-label="Save overview" aria-pressed={saved} style={{ background: "transparent", color: saved ? "var(--area-fg-accent)" : "var(--area-fg-muted)" }} onClick={() => setSaved(!saved)} /><Button size="sm" variant="ghost" iconOnly icon={<TokenIcon />} aria-label="Follow overview" aria-pressed={following} style={{ background: "transparent", color: following ? "var(--area-fg-accent)" : "var(--area-fg-muted)" }} onClick={() => setFollowing(!following)} /></>}>Overview</NavItem>
      <NavItem href="#gallery-nav-actions" icon={<TokenIcon />} actions={<Button size="sm" variant="ghost" iconOnly icon={<ChevronIcon />} aria-label="Toggle projects" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} />}>Projects</NavItem>
      <div id={id} hidden={!open}><NavGroup><NavItem href="#gallery-nav-actions" trailing={<Badge size="sm" tone="success" dot>Live</Badge>}>Website</NavItem><NavItem href="#gallery-nav-actions" trailing={<Badge size="sm">3</Badge>}>Brand kit</NavItem></NavGroup></div>
      <NavItem disabled icon={<PersonIcon />}>Archived</NavItem>
    </NavGroup>
  </Nav>;
};

/** Two-column inspector layout; every editable surface is an Area control. */
export const GalleryPanel = () => {
  const id = useId();
  const pair = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--area-space-8)" };
  return <Panel size="sm" title="Frame" aria-label="Frame inspector">
    <PanelSection heading="Position">
      <Segmented fullWidth label="Vertical alignment" defaultValue="top" options={[
        { value: "top", icon: <AlignTopIcon />, label: <span className="area-sr-only">Align top</span> },
        { value: "middle", icon: <AlignMiddleIcon />, label: <span className="area-sr-only">Align middle</span> },
        { value: "bottom", icon: <AlignBottomIcon />, label: <span className="area-sr-only">Align bottom</span> },
      ]} />
      <div style={pair}>
        <Input fullWidth variant="soft" type="number" prefix="X" aria-label="X position" defaultValue={567} />
        <Input fullWidth variant="soft" type="number" prefix="Y" aria-label="Y position" defaultValue={-1804} />
      </div>
    </PanelSection>
    <PanelSection heading="Auto layout">
      <Segmented fullWidth label="Layout flow" defaultValue="vertical" options={[
        { value: "horizontal", label: "Horizontal" }, { value: "vertical", label: "Vertical" },
      ]} />
      <div style={pair}>
        <Input fullWidth variant="soft" type="number" prefix="W" aria-label="Width" min={0} defaultValue={300} />
        <Input fullWidth variant="soft" type="number" prefix="H" aria-label="Height" min={0} defaultValue={300} />
      </div>
      <Field orientation="horizontal" label="Gap" htmlFor={id + "-gap"}><Input fullWidth variant="soft" type="number" id={id + "-gap"} min={0} defaultValue={8} /></Field>
      <Field orientation="horizontal" label="Clip"><Checkbox id={id + "-clip"} aria-label="Clip content" defaultChecked /></Field>
    </PanelSection>
  </Panel>;
};

export const GalleryPanelSections = () => (
  <Panel size="sm" title="Scroll variant" aria-label="Scroll variant settings">
    <PanelSection>
      <Field orientation="horizontal" label="Trigger"><Select aria-label="Trigger" defaultValue="view"><option value="view">In view</option><option value="click">On click</option></Select></Field>
      <Field orientation="horizontal" label="Replay"><Segmented fullWidth label="Replay" defaultValue="yes" options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} /></Field>
      <Field orientation="horizontal" label="Enabled"><Switch aria-label="Enable scroll variant" defaultChecked /></Field>
    </PanelSection>
    <PanelSection heading="Transition">
      <Field orientation="horizontal" label="Easing"><Select aria-label="Easing" defaultValue="out"><option value="out">Ease out</option><option value="linear">Linear</option></Select></Field>
      <Field orientation="horizontal" label="Duration"><Input fullWidth variant="soft" type="number" aria-label="Duration" min={0} defaultValue={300} suffix="ms" /></Field>
      <Field orientation="horizontal" label="Intensity"><Slider aria-label="Transition intensity" defaultValue={75} /></Field>
    </PanelSection>
  </Panel>
);

export const GalleryPanelFooter = () => {
  const [sections, setSections] = useState(2);
  return <Panel size="sm" title="Sections" aria-label="Section mappings" footer={<Button variant="soft" fullWidth icon={<PlusIcon />} onClick={() => setSections(count => count + 1)}>Add section</Button>} style={{ blockSize: 360 }}>
    {Array.from({ length: sections }, (_, index) => <PanelSection key={index}>
      <Field orientation="horizontal" label="Section"><Select aria-label={"Section " + (index + 1)} defaultValue={String(index + 1)}>{Array.from({ length: sections + 1 }, (_, option) => <option key={option} value={String(option + 1)}>#{option + 1}</option>)}</Select></Field>
      <Field orientation="horizontal" label="To"><Input fullWidth variant="soft" type="number" aria-label={"Target for section " + (index + 1)} min={1} defaultValue={index + 2} /></Field>
    </PanelSection>)}
  </Panel>;
};

export const GalleryPopover = () => (
  <Popover aria-label="Tutorial step" role="dialog">
    <PopoverHeader><PopoverTitle>Title</PopoverTitle><Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close" icon={<DismissIcon />} /></PopoverHeader>
    <PopoverBody><PopoverDescription>Spotlight popover text placeholder</PopoverDescription></PopoverBody>
    <PopoverFooter><span>1 of 5</span><Button size="sm" variant="outline">Prev</Button><Button size="sm">Next</Button></PopoverFooter>
  </Popover>
);

export const GalleryPopoverField = () => (
  <Popover aria-label="Popover with field" role="dialog">
    <PopoverHeader><PopoverTitle>Field label</PopoverTitle><Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close" icon={<DismissIcon />} /></PopoverHeader>
    <PopoverBody><Input fullWidth id="gallery-popover-field-input" aria-label="Field label" placeholder="Placeholder text" /></PopoverBody>
    <PopoverFooter><Button size="sm" fullWidth>Action</Button></PopoverFooter>
  </Popover>
);

export const GalleryPopoverImage = () => (
  <Popover aria-label="Skills" role="dialog">
    <PopoverHeader><PopoverTitle>Skills</PopoverTitle><Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close" icon={<DismissIcon />} /></PopoverHeader>
    <PopoverBody><PopoverDescription>Share your skills and experience.</PopoverDescription><PopoverMedia><img src="/images/chip-pixels.png" alt="" /></PopoverMedia></PopoverBody>
  </Popover>
);

export const GalleryProgress = () => (
  <Progress value={62} label="Upload progress" />
);
export const GalleryProgressLabeled = () => (
  <div style={{ display: "grid", gap: "var(--area-space-8)", inlineSize: "100%" }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)" }}><span>Progress</span><span>62%</span></div>
    <Progress value={62} label="Progress, 62 percent" />
  </div>
);
export const GalleryProgressIndeterminate = () => <Progress label="Loading" />;
export const GalleryProgressAccent = () => <Progress value={45} label="Progress, 45 percent" tone="accent" />;
export const GalleryProgressSmall = () => <Progress value={62} label="Small progress" size="sm" />;
export const GalleryProgressMedium = () => <Progress value={62} label="Medium progress" size="md" />;
export const GalleryProgressLarge = () => <Progress value={62} label="Large progress" size="lg" />;

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
  <Segmented label="View" defaultValue="design" options={[{ value: "design", label: "Design" }, { value: "preview", label: "Preview" }]} />
);
export const GallerySegmentedIcons = () => <Segmented label="Alignment" defaultValue="left" options={[{ value: "left", label: "Left", icon: <AlignTopIcon /> }, { value: "center", label: "Center", icon: <AlignMiddleIcon /> }, { value: "right", label: "Right", icon: <AlignBottomIcon /> }]} />;
export const GallerySegmentedIconOnly = () => <Segmented iconOnly label="Vertical alignment" defaultValue="top" options={[{ value: "top", label: "Align top", icon: <AlignTopIcon /> }, { value: "middle", label: "Align middle", icon: <AlignMiddleIcon /> }, { value: "bottom", label: "Align bottom", icon: <AlignBottomIcon /> }]} />;
export const GallerySegmentedFullWidth = () => <Segmented fullWidth label="Viewport" defaultValue="desktop" style={{ inlineSize: "100%" }} options={[{ value: "desktop", label: "Desktop" }, { value: "mobile", label: "Mobile" }, { value: "tablet", label: "Tablet", disabled: true }]} />;
export const GallerySegmentedSmall = () => <Segmented size="sm" label="Small view" defaultValue="one" options={[{ value: "one", label: "Option one" }, { value: "two", label: "Option two" }]} />;
export const GallerySegmentedMedium = () => <Segmented size="md" label="Medium view" defaultValue="one" options={[{ value: "one", label: "Option one" }, { value: "two", label: "Option two" }]} />;
export const GallerySegmentedLarge = () => <Segmented size="lg" label="Large view" defaultValue="one" options={[{ value: "one", label: "Option one" }, { value: "two", label: "Option two" }]} />;

export const GallerySelect = () => (
  <Select aria-label="Gallery status specimen" defaultValue="draft"><option value="draft">Draft</option><option value="review">In review</option><option value="live">Published</option></Select>
);

export const GallerySelectSmall = () => <Select size="sm" aria-label="Small select" defaultValue="sm"><option value="sm">Small</option></Select>;
export const GallerySelectMedium = () => <Select size="md" aria-label="Medium select" defaultValue="md"><option value="md">Medium</option></Select>;
export const GallerySelectLarge = () => <Select size="lg" aria-label="Large select" defaultValue="lg"><option value="lg">Large</option></Select>;
export const GallerySelectSuccess = () => <Select validationStatus="success" aria-label="Verified region" defaultValue="us"><option value="us">United States</option></Select>;
export const GallerySelectWarning = () => <Select validationStatus="warning" aria-label="Region warning" defaultValue="us"><option value="us">United States</option></Select>;

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

export const GallerySkeleton = () => <Skeleton style={{ inlineSize: "100%", fontSize: "var(--area-ui-size)" }} />;
export const GallerySkeletonCircle = () => <Skeleton shape="circle" style={{ inlineSize: "var(--area-control-lg)", blockSize: "var(--area-control-lg)" }} />;
export const GallerySkeletonMedia = () => <Skeleton shape="rectangle" style={{ inlineSize: "100%", aspectRatio: "16 / 9" }} />;
export const GallerySkeletonRounded = () => <Skeleton shape="rounded" style={{ inlineSize: "100%", aspectRatio: "16 / 9" }} />;
export const GallerySkeletonType = () => (
  <div style={{ display: "grid", gap: "var(--area-space-16)", inlineSize: "100%" }}>
    {[{ name: "Display", token: "display-sm" }, { name: "Title", token: "title-md" }, { name: "Body", token: "text-md" }].map(({ name, token }) => (
      <div key={name} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", alignItems: "center", gap: "var(--area-space-12)", fontSize: `var(--area-${token}-size)`, lineHeight: `var(--area-${token}-leading)`, letterSpacing: `var(--area-${token}-tracking)` }}>
        <span>{name}</span><Skeleton style={{ inlineSize: "100%", justifySelf: "end" }} />
      </div>
    ))}
  </div>
);
export const GallerySkeletonCard = () => (
  <div style={{ inlineSize: 300, blockSize: 300, maxInlineSize: "100%" }}><Card aria-label="Loading card" style={{ inlineSize: "100%", blockSize: "100%", gridTemplateRows: "var(--area-space-96) minmax(0, 1fr)" }}>
    <CardMedia><Skeleton shape="rectangle" style={{ inlineSize: "100%", blockSize: "100%" }} /></CardMedia>
    <CardContent style={{ gap: "var(--area-space-12)" }}>
      <Skeleton shape="circle" style={{ inlineSize: "var(--area-control-lg)", blockSize: "var(--area-control-lg)" }} />
      <div style={{ display: "grid", gap: "var(--area-space-8)" }}>
        <Skeleton style={{ inlineSize: "56%", fontSize: "var(--area-text-md-size)" }} />
        <Skeleton style={{ inlineSize: "100%", fontSize: "var(--area-ui-size)" }} />
      </div>
      <CardFooter><Skeleton shape="rounded" style={{ inlineSize: "var(--area-space-80)", blockSize: "var(--area-control-md)" }} /></CardFooter>
    </CardContent>
  </Card></div>
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
export const GallerySpinnerButton = () => <Button loading>Loading</Button>;
export const GallerySpinnerBadge = () => <Badge icon={<Spinner />} tone="neutral">Loading</Badge>;
export const GallerySpinnerInput = () => <Input aria-label="Label" placeholder="Placeholder" loading loaderPosition="trailing" />;
export const GallerySpinnerEmpty = () => (
  <div style={{ display: "grid", justifyItems: "center", gap: "var(--area-space-12)", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)", textAlign: "center" }}>
    <Spinner label="Loading" />
    <span style={{ fontWeight: "var(--area-weight-strong)" }}>Loading content</span>
    <span>Supporting text goes here.</span>
  </div>
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
  <Table aria-label="Projects"><thead><tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col" className="area-table__cell--numeric">Files</th></tr></thead><tbody><tr><td>Website</td><td><Badge size="sm" tone="success" dot>Live</Badge></td><td className="area-table__cell--numeric">24</td></tr><tr><td>Brand kit</td><td><Badge size="sm">Draft</Badge></td><td className="area-table__cell--numeric">8</td></tr></tbody></Table>
);

export const GalleryTableSelectable = () => {
  const [descending, setDescending] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const rows = [{ name: "Website", files: 24 }, { name: "Brand kit", files: 8 }, { name: "Mobile app", files: 16 }].sort((a, b) => descending ? b.files - a.files : a.files - b.files);
  return <Table size="md" aria-label="Selectable projects"><thead><tr><th scope="col" className="area-table__cell--fit"><Checkbox aria-label="Select all projects" checked={selected.length === rows.length} indeterminate={selected.length > 0 && selected.length < rows.length} onChange={event => setSelected(event.target.checked ? rows.map(row => row.name) : [])} /></th><th scope="col">Project</th><th scope="col" aria-sort={descending ? "descending" : "ascending"} className="area-table__cell--numeric"><Button size="sm" variant="ghost" onClick={() => setDescending(!descending)}>Files {descending ? "↓" : "↑"}</Button></th></tr></thead><tbody>{rows.map(row => <tr key={row.name} aria-selected={selected.includes(row.name)}><td><Checkbox aria-label={`Select ${row.name}`} checked={selected.includes(row.name)} onChange={event => setSelected(event.target.checked ? [...selected, row.name] : selected.filter(name => name !== row.name))} /></td><td>{row.name}</td><td className="area-table__cell--numeric">{row.files}</td></tr>)}</tbody></Table>;
};
export const GalleryTableCompact = () => <Table size="sm" aria-label="Storage"><thead><tr><th scope="col">Resource</th><th scope="col" className="area-table__cell--numeric">Size</th></tr></thead><tbody>{["Images", "Documents", "Backups"].map((name, i) => <tr key={name}><td>{name}</td><td className="area-table__cell--numeric">{[120, 32, 256][i]} MB</td></tr>)}</tbody></Table>;
export const GalleryTableStriped = () => <Table striped aria-label="Striped storage"><thead><tr><th scope="col">Resource</th><th scope="col" className="area-table__cell--numeric">Size</th></tr></thead><tbody>{["Images", "Documents", "Backups", "Videos"].map((name, i) => <tr key={name}><td>{name}</td><td className="area-table__cell--numeric">{[120, 32, 256, 480][i]} MB</td></tr>)}</tbody></Table>;
export const GalleryTableDividers = () => <Table columnDividers aria-label="Project ownership"><thead><tr><th scope="col">Project</th><th scope="col">Owner</th><th scope="col">Status</th></tr></thead><tbody><tr><td>Website</td><td>Avery</td><td>Published</td></tr><tr><td>Mobile app</td><td>Jordan</td><td>Draft</td></tr></tbody></Table>;
export const GalleryTableEmpty = () => <Table aria-label="Search results"><thead><tr><th scope="col">Name</th><th scope="col">Status</th></tr></thead><tbody><tr><td colSpan={2}>No projects found. Try a different search.</td></tr></tbody></Table>;
export const GalleryTableLoading = () => <Table aria-label="Loading projects" aria-busy="true"><thead><tr><th scope="col">Name</th><th scope="col">Status</th></tr></thead><tbody>{[0, 1, 2].map(row => <tr key={row}><td><Skeleton shape="text" style={{ inlineSize: "var(--area-space-96)" }} /></td><td><Skeleton shape="text" style={{ inlineSize: "var(--area-space-48)" }} /></td></tr>)}</tbody></Table>;

export const GalleryTabs = () => (
  <Tabs tabs={[{ id: "account", label: "Account", content: "Manage your account details." }, { id: "security", label: "Security", content: "Keep your account secure." }, { id: "billing", label: "Billing", disabled: true }]} style={{ inlineSize: "100%" }} />
);
export const GalleryTabsVertical = () => <Tabs orientation="vertical" label="Project settings" tabs={[{ id: "general", label: "General", content: "Edit project details." }, { id: "members", label: "Members", content: "Manage project access." }, { id: "activity", label: "Activity", content: "View recent changes." }]} />;
export const GalleryTabsSmall = () => <Tabs size="sm" tabs={[{ id: "design", label: "Design", content: "Design view" }, { id: "preview", label: "Preview", content: "Preview view" }]} />;
export const GalleryTabsTrack = () => <Tabs track tabs={[{ id: "design", label: "Design", content: "Design view" }, { id: "preview", label: "Preview", content: "Preview view" }]} />;
export const GalleryTabsBadges = () => <Tabs tabs={[{ id: "members", label: "Members", icon: <PersonIcon />, trailing: <Badge size="sm">4</Badge>, content: "Four people have access." }, { id: "requests", label: "Requests", icon: <InfoIcon />, trailing: <Badge size="sm" tone="info">2</Badge>, content: "Two requests awaiting review." }]} />;

export const GalleryTextarea = () => <Textarea aria-label="Gallery message specimen" placeholder="Leave a note…" rows={3} />;

export const GalleryTextareaSmall = () => <Textarea size="sm" rows={3} aria-label="Small textarea" placeholder="Small" />;
export const GalleryTextareaMedium = () => <Textarea size="md" rows={3} aria-label="Medium textarea" placeholder="Medium" />;
export const GalleryTextareaLarge = () => <Textarea size="lg" rows={3} aria-label="Large textarea" placeholder="Large" />;
export const GalleryTextareaCount = () => {
  const [value, setValue] = useState("");
  return <Field label="Description" description={`${value.length} / 160 characters`}><Textarea fullWidth rows={3} maxLength={160} value={value} onChange={event => setValue(event.target.value)} placeholder="Describe your project…" /></Field>;
};

export const GalleryToast = () => <Toast tone="success" icon={<CheckIcon />}>Changes saved.</Toast>;
export const GalleryToastInfo = () => <Toast tone="info" icon={<InfoIcon />}>Your export is ready.</Toast>;
export const GalleryToastWarning = () => <Toast tone="warning" icon={<InfoIcon />} >Storage almost full.</Toast>;
export const GalleryToastDanger = () => <Toast tone="danger" icon={<DismissIcon />} >Couldn’t save changes.</Toast>;
export const GalleryToastMultiline = () => <Toast tone="info" icon={<InfoIcon />} title="Export ready">Your files are ready to download and share with your team.</Toast>;
export const GalleryToastAction = () => {
  const [visible, setVisible] = useState(true);
  const [undone, setUndone] = useState(false);
  return visible ? <Toast icon={<CheckIcon />} tone="success" onDismiss={() => setVisible(false)} action={!undone ? <Button size="sm" variant="outline" onClick={() => setUndone(true)}>Undo</Button> : undefined}>{undone ? "Project restored." : "Project archived."}</Toast> : <Button variant="outline" onClick={() => { setVisible(true); setUndone(false); }}>Show notification</Button>;
};

export const GalleryToken = () => (
  <Token swatch="var(--area-accent-solid)">--area-accent-solid</Token>
);

export const GalleryTooltip = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--area-space-8)" }}>
    <Tooltip arrow id="gallery-tooltip-copy" side="top">Supporting text</Tooltip>
    <Button aria-describedby="gallery-tooltip-copy" variant="outline">Hover me</Button>
  </div>
);
export const GalleryTooltipKbd = () => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--area-space-8)" }}>
    <Tooltip id="gallery-tooltip-shortcut">Action <Kbd appearance="on-emphasis" keys={["cmd", "K"]} /></Tooltip>
    <Button aria-describedby="gallery-tooltip-shortcut" variant="outline">Hover me</Button>
  </div>
);
export const GalleryTooltipSide = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--area-space-8)" }}>
    <Button aria-describedby="gallery-tooltip-side-label" variant="outline">Hover me</Button>
    <Tooltip arrow id="gallery-tooltip-side-label" side="right">Add to library</Tooltip>
  </div>
);

export const GalleryTooltipBottom = () => <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--area-space-8)" }}><Button variant="outline" aria-describedby="tooltip-bottom">Hover me</Button><Tooltip arrow side="bottom" id="tooltip-bottom">Supporting text</Tooltip></div>;
export const GalleryTooltipLeft = () => <div style={{ display: "flex", alignItems: "center", gap: "var(--area-space-8)" }}><Tooltip arrow side="left" id="tooltip-left">Supporting text</Tooltip><Button variant="outline" aria-describedby="tooltip-left">Hover me</Button></div>;

export const CodeInProse = () => (
  <p>Install the package with <Code>npm install @area/react</Code>.</p>
);

export const CodeBlockPlain = () => <CodeBlock code={'const project = "Area";\nconsole.log(project);'} />;

export const CodeBlockFlush = () => <CodeBlock layout="flush" code={'export default "Area";'} />;

export const SegmentedSizes = () => (
  <div className="docs-gallery-stack">
    <Segmented size="sm" label="Small view" defaultValue="list" options={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }]} />
    <Segmented size="md" label="Medium view" defaultValue="list" options={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }]} />
    <Segmented size="lg" label="Large view" defaultValue="list" options={[{ value: "list", label: "List" }, { value: "grid", label: "Grid" }]} />
  </div>
);

export const SegmentedFullWidth = () => (
  <div style={{ inlineSize: 280 }}><Segmented fullWidth label="Viewport" defaultValue="desktop" options={[{ value: "desktop", label: "Desktop" }, { value: "mobile", label: "Mobile" }, { value: "tablet", label: "Tablet", disabled: true }]} /></div>
);
