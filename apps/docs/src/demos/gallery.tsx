/** Real, compact specimens for the component gallery. Framing never rescales controls. */
import { useId, useRef, useState } from "react";
import { Alert, Avatar, AvatarGroup, Badge, BadgeAnchor, Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardMedia, CardTitle, Checkbox, CheckboxGroup, Chip, ChipGroup, ChipLink, Code, CodeBlock, Dialog, Field, Input, Kbd, KbdGroup, Menu, MenuItem, MenuLabel, MenuSearch, MenuSeparator, Nav, NavGroup, NavItem, Panel, PanelSection, Popover, PopoverBody, PopoverDescription, PopoverFooter, PopoverHeader, PopoverMedia, PopoverTitle, Progress, Radio, RadioGroup, Segmented, Select, Separator, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Token, Tooltip } from "@area/react";
import { AlignBottomIcon, AlignMiddleIcon, AlignTopIcon, ArrowIcon, CheckIcon, ChevronIcon, DismissIcon, DotsFourIcon, InfoIcon, OpenIcon, PersonIcon, PlusIcon, SearchIcon, TokenIcon, TrashIcon } from "../icons.tsx";
import { SliderRangeComposition } from "./slider-range.tsx";
// @ts-expect-error — the docs' own highlighter is authored in JavaScript.
import { highlight } from "../../scripts/layout.mjs";

export const GalleryAlert = () => (
  <Alert icon={<InfoIcon />} title="Title">Body text</Alert>
);
export const GalleryAlertAccent = () => <Alert tone="accent" icon={<InfoIcon />} title="Title">Body text</Alert>;
export const GalleryAlertSuccess = () => <Alert tone="success" icon={<CheckIcon />} title="Title">Body text</Alert>;
export const GalleryAlertDanger = () => <Alert tone="danger" icon={<DismissIcon />} title="Title">Body text</Alert>;
export const GalleryAlertLink = () => <Alert icon={<InfoIcon />} title="Title" link={<a href="#gallery-alert-multiline">Link</a>}>Body text</Alert>;
export const GalleryAlertAction = () => <Alert icon={<InfoIcon />} title="Title" action={<Button size="sm">Action</Button>}>Body text</Alert>;
export const GalleryAlertMultiline = () => <Alert layout="multiline" icon={<InfoIcon />} title="Title">Body text that wraps onto a second line</Alert>;
export const GalleryAlertDismissible = () => {
  const [visible, setVisible] = useState(true);
  return visible ? <Alert icon={<InfoIcon />} title="Title" onDismiss={() => setVisible(false)}>Body text</Alert> : <Button size="sm" variant="outline" onClick={() => setVisible(true)}>Show alert</Button>;
};

export const GalleryAvatar = () => (
  <Avatar fallback="A" alt="Avatar" />
);

export const GalleryAvatarImage = () => <Avatar src="/images/chip-avatar.png" fallback="A" alt="Avatar" />;
export const GalleryAvatarImageFallback = () => <Avatar src="/images/avatar-missing.png" fallback="A" alt="Avatar" />;
export const GalleryAvatarTwoInitials = () => <Avatar fallback="AV" alt="Avatar" />;
export const GalleryAvatarIcon = () => <Avatar icon={<PersonIcon />} alt="Avatar" />;
export const GalleryAvatarGroup = () => <AvatarGroup max={3} aria-label="Avatars"><Avatar fallback="A" alt="Avatar" /><Avatar src="/images/chip-avatar.png" fallback="B" alt="Avatar" /><Avatar fallback="C" alt="Avatar" /><Avatar fallback="D" alt="Avatar" /><Avatar fallback="E" alt="Avatar" /></AvatarGroup>;
export const GalleryAvatarActive = () => <Avatar active fallback="A" alt="Avatar" />;
export const GalleryAvatarAvailability = () => <BadgeAnchor compact placement="bottom-end" overlap="circular" badge={<Badge size="sm" dotOnly tone="success" aria-label="Available" />}><Avatar fallback="A" role="img" aria-label="Avatar, available" /></BadgeAnchor>;
export const GalleryAvatarNotification = () => <BadgeAnchor compact placement="top-end" overlap="circular" badge={<Badge size="sm" variant="solid" tone="info">2</Badge>}><Avatar src="/images/chip-avatar.png" fallback="A" alt="Avatar, 2 notifications" /></BadgeAnchor>;
export const GalleryAvatarAccent = () => <Avatar tone="accent" fallback="A" alt="Avatar" />;
export const GalleryAvatarInverse = () => <Avatar tone="inverse" fallback="A" alt="Avatar" />;
export const GalleryAvatarSquare = () => <Avatar shape="square" fallback="A" alt="Avatar" />;
export const GalleryAvatarSmall = () => <Avatar size="sm" fallback="S" alt="Small avatar" />;
export const GalleryAvatarMedium = () => <Avatar size="md" fallback="M" alt="Medium avatar" />;
export const GalleryAvatarLarge = () => <Avatar size="lg" fallback="L" alt="Large avatar" />;

export const GalleryBadge = () => (
  <Badge tone="success" dot>Badge</Badge>
);

export const GalleryButton = () => (
  <Button>Button</Button>
);

export const GalleryButtonSmall = () => <Button size="sm">Button</Button>;
export const GalleryButtonMedium = () => <Button size="md">Button</Button>;
export const GalleryButtonLarge = () => <Button size="lg">Button</Button>;
export const GalleryButtonSuccess = () => <Button tone="success">Button</Button>;
export const GalleryButtonAccent = () => <Button tone="accent">Button</Button>;
export const GalleryButtonWithIcon = () => <Button icon={<PlusIcon />}>Button</Button>;
export const GalleryButtonDisabled = () => <Button disabled>Button</Button>;
export const GalleryButtonLoading = () => <Button loading>Button</Button>;
export const GalleryButtonIconOnly = () => <Button iconOnly icon={<PlusIcon />} aria-label="Add item" />;
export const GalleryButtonSoft = () => <Button variant="soft">Button</Button>;
export const GalleryButtonOutline = () => <Button variant="outline">Button</Button>;
export const GalleryButtonGhost = () => <Button variant="ghost">Button</Button>;
export const GalleryButtonPill = () => <Button pill>Button</Button>;
export const GalleryButtonSelected = () => <Button selected>Selected</Button>;
export const GalleryButtonShortcut = () => <Button aria-keyshortcuts="Meta+Enter">Button <Kbd keys={["cmd", "enter"]} /></Button>;
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
  <Checkbox label="Label" defaultChecked />
);

export const GalleryCheckboxSmall = () => <Checkbox size="sm" label="Small" />;
export const GalleryCheckboxMedium = () => <Checkbox size="md" label="Medium" />;
export const GalleryCheckboxLarge = () => <Checkbox size="lg" label="Large" />;
export const GalleryCheckboxSelected = () => <Checkbox label="Label" defaultChecked />;
export const GalleryCheckboxIndeterminate = () => <Checkbox label="Label" indeterminate />;
export const GalleryCheckboxCaption = () => <Checkbox label="Label" caption="Description" />;
export const GalleryCheckboxLeadingVisual = () => <Checkbox label="Label" leadingVisual={<CheckIcon />} />;
export const GalleryCheckboxCard = () => <Checkbox variant="card" label="Label" caption="Description" leadingVisual={<CheckIcon />} />;
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

export const GalleryChipSmall = () => <Chip size="sm">Chip</Chip>;
export const GalleryChipMedium = () => <Chip size="md">Chip</Chip>;
export const GalleryChipLarge = () => <Chip size="lg">Chip</Chip>;
export const GalleryChipSwatch = () => <Chip swatch="var(--area-indigo-500)">Indigo</Chip>;
export const GalleryChipIcon = () => <Chip icon={<CheckIcon />}>Chip</Chip>;
export const GalleryChipDisabled = () => <Chip disabled>Chip</Chip>;
export const GalleryChipGroup = () => <ChipGroup><Chip defaultSelected>Item one</Chip><Chip>Item two</Chip><Chip>Item three</Chip></ChipGroup>;
export const GalleryChipAssist = () => <Chip kind="assist" icon={<SearchIcon />}>Assist</Chip>;
export const GalleryChipFilter = () => <Chip icon={<CheckIcon />}>Filter</Chip>;
export const GalleryChipInput = () => <Chip kind="input">Input</Chip>;
export const GalleryChipSuggestion = () => <Chip kind="suggestion">Suggestion</Chip>;
export const GalleryChipDelete = () => <Chip kind="input" onRemove={() => {}}>Chip</Chip>;
export const GalleryChipClickableDelete = () => <Chip kind="input" clickable onClick={() => {}} onRemove={() => {}}>Chip</Chip>;
export const GalleryChipCustomDelete = () => <Chip kind="input" onRemove={() => {}} removeIcon={<TrashIcon />} removeLabel="Delete">Chip</Chip>;
export const GalleryChipLinkUnderline = () => <ChipLink href="#gallery-section-chip">Link</ChipLink>;
export const GalleryChipLinkIcon = () => <ChipLink href="#gallery-section-chip" treatment="icon" trailingIcon={<OpenIcon />}>Link out</ChipLink>;
export const GalleryChipAvatarInitials = () => <Chip avatar={<Avatar fallback="AV" alt="Avatar" />}>Avatar</Chip>;
export const GalleryChipAvatarPhoto = () => <Chip avatar={<Avatar src="/images/chip-avatar.png" alt="Avatar" />}>Avatar</Chip>;
export const GalleryChipImageFilter = () => <Chip image="/images/chip-pixels.png" imageAlt="">Image</Chip>;
export const GalleryChipInvalid = () => <Chip kind="input" invalid onRemove={() => {}}>Chip</Chip>;

export const GalleryCode = () => <Code>Code</Code>;
export const CodeSubtle = () => <Code subtle>Code</Code>;
export const CodeOnColor = () => <div style={{ alignSelf: "stretch", blockSize: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", inlineSize: "100%", background: "var(--area-accent-solid)", borderRadius: "var(--area-space-24)", color: "var(--area-fg-on-accent)", padding: "var(--area-space-24)" }}><Code onColor>Code</Code></div>;
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
    html={highlight('export const theme = {\n  accent: "indigo",\n  accent: "purple",\n  radius: "standard",\n};')}
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
  return <CodeBlock title="example.tsx" languages={["tsx", "css"]} value={language} onLanguageChange={setLanguage} html={highlight(samples[language]!)} style={{ inlineSize: "100%" }} />;
};

export const CodeBlockLanguageTabs = () => {
  const [language, setLanguage] = useState("tsx");
  const samples: Record<string, string> = {
    tsx: 'import { Button } from "@area/react";\n\nexport function Example() {\n  return <Button>Button</Button>;\n}',
    css: ".area-button {\n  border-radius: var(--area-radius-control);\n}",
  };
  return <CodeBlock title="example.tsx" languages={["tsx", "css"]} languageTabs value={language} onLanguageChange={setLanguage} html={highlight(samples[language]!)} style={{ inlineSize: "100%" }} />;
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
export const GalleryDialogModal = () => {
  const modal = useRef<HTMLDialogElement>(null);
  return <><Button onClick={() => modal.current?.showModal()}>Open dialog</Button><dialog ref={modal} className="area-dialog__modal" aria-label="Title"><Dialog role="group" aria-modal={undefined} title="Title" description="Description" footer={<><Button variant="ghost" onClick={() => modal.current?.close()}>Cancel</Button><Button onClick={() => modal.current?.close()}>Action</Button></>}>Body text</Dialog></dialog></>;
};

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
    Button <Kbd appearance="on-color" keys={["cmd", "K"]} />
  </Button>
);
export const GalleryKbdOnEmphasis = () => (
  <Tooltip>
    Description <Kbd appearance="on-emphasis" keys={["cmd", "B"]} />
  </Tooltip>
);

export const GalleryMenu = () => (
  <Menu aria-label="Label">
    <MenuItem><span className="area-menu__text">Item one</span></MenuItem>
    <MenuItem><span className="area-menu__text">Item two</span></MenuItem>
    <MenuItem><span className="area-menu__text">Item three</span></MenuItem>
  </Menu>
);
export const GalleryMenuShortcuts = () => <Menu aria-label="Label"><MenuItem shortcut={<Kbd keys={["cmd", "K"]} quiet />}><span className="area-menu__text">Item one</span></MenuItem><MenuItem shortcut={<Kbd keys={["cmd", "N"]} quiet />}><span className="area-menu__text">Item two</span></MenuItem></Menu>;

export const GalleryMenuSelected = () => (
  <Menu aria-label="Label">
    <MenuLabel>Label</MenuLabel>
    <MenuItem data-selected shortcut={<CheckIcon />}><span className="area-menu__text">Option one</span></MenuItem>
    <MenuItem><span className="area-menu__text">Option two</span></MenuItem>
    <MenuItem><span className="area-menu__text">Option three</span></MenuItem>
  </Menu>
);

export const GalleryMenuSearch = () => (
  <MenuSearch>
    <Input aria-label="Label" leadingIcon={<SearchIcon />} placeholder="Placeholder" variant="soft" />
    <Menu aria-label="Label">
      <MenuLabel>Label</MenuLabel>
      <MenuItem><span className="area-menu__text">Item one</span></MenuItem>
      <MenuItem><span className="area-menu__text">Item two</span></MenuItem>
      <MenuItem><span className="area-menu__text">Item three</span></MenuItem>
    </Menu>
  </MenuSearch>
);

export const GalleryMenuSubmenu = () => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--area-space-8)" }}>
    <Menu aria-label="Label">
      <MenuLabel>Label</MenuLabel>
      <MenuItem><span className="area-menu__text">Item one</span></MenuItem>
      <MenuItem><span className="area-menu__text">Item two</span></MenuItem>
      <MenuItem shortcut={<ArrowIcon />} data-highlighted><span className="area-menu__text">Item three</span></MenuItem>
    </Menu>
    <Menu aria-label="Label" style={{ marginBlockStart: "calc(var(--area-border-width) + var(--area-space-4) + var(--area-control-md) + var(--area-control-md) + var(--area-control-md) + var(--area-space-2) + var(--area-space-2) + var(--area-space-2))" }}>
      <MenuLabel>Item three</MenuLabel>
      <MenuItem><span className="area-menu__text">Item one</span></MenuItem>
      <MenuItem><span className="area-menu__text">Item two</span></MenuItem>
      <MenuItem><span className="area-menu__text">Item three</span></MenuItem>
    </Menu>
  </div>
);

export const GalleryMenuDisabled = () => (
  <Menu aria-label="Label">
    <MenuItem><span className="area-menu__text">Item one</span></MenuItem>
    <MenuItem disabled><span className="area-menu__text">Item two</span></MenuItem>
    <MenuItem><span className="area-menu__text">Item three</span></MenuItem>
  </Menu>
);
export const GalleryMenuDanger = () => <Menu aria-label="Label"><MenuItem><span className="area-menu__text">Item one</span></MenuItem><MenuItem tone="danger"><span className="area-menu__text">Item two</span></MenuItem></Menu>;

/** Embedded controls retain their own native semantics in a grouped menu surface. */
export const GalleryMenuControls = () => {
  const [option, setOption] = useState("one");
  const row = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--area-space-16)", minBlockSize: "var(--area-control-md)", boxSizing: "border-box", paddingInline: "var(--area-space-8)" } as const;
  return (
    <Menu role="group" aria-label="Label" style={{ marginInline: "auto", inlineSize: "100%", maxInlineSize: "calc(var(--area-space-96) * 3 + var(--area-space-32))", fontSize: "var(--area-ui-size)", lineHeight: "var(--area-ui-leading)" }}>
      <MenuLabel style={{ paddingInline: "var(--area-space-8)" }}>Label</MenuLabel>
      <div style={row}><span>Item one</span><Switch aria-label="Item one" style={{ minBlockSize: "var(--area-space-20)" }} defaultChecked /></div>
      <div style={row}><span>Item two</span><Segmented label="Item two" value={option} onSelect={setOption} options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} /></div>
      <div style={row}><span>Item three</span><Checkbox aria-label="Item three" defaultChecked /></div>
      <MenuSeparator />
      <div style={row}><span>Item four</span><Button variant="soft">Action</Button></div>
    </Menu>
  );
};

export const GalleryNav = () => (
  <Nav aria-label="Label">
    <NavItem href="#gallery-nav-default" current>Item one</NavItem><NavItem href="#gallery-nav-default">Item two</NavItem><NavItem href="#gallery-nav-default">Item three</NavItem>
  </Nav>
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
export const GalleryNavIcons = () => <Nav aria-label="Label"><NavItem href="#gallery-nav-icons" icon={<DotsFourIcon />} current>Item one</NavItem><NavItem href="#gallery-nav-icons" icon={<PersonIcon />}>Item two</NavItem><NavItem href="#gallery-nav-icons" icon={<TokenIcon />}>Item three</NavItem></Nav>;
export const GalleryNavCounts = () => <Nav aria-label="Label"><NavItem href="#gallery-nav-counts" current trailing={<Badge size="sm">1</Badge>}>Item one</NavItem><NavItem href="#gallery-nav-counts" trailing={<Badge size="sm">2</Badge>}>Item two</NavItem><NavItem href="#gallery-nav-counts">Item three</NavItem></Nav>;

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
  return <Nav aria-label="Label"><NavItem href="#gallery-nav-expandable" actions={<Button size="sm" variant="ghost" iconOnly icon={<ChevronIcon />} aria-label="Toggle items" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} />}>Item one</NavItem><div id={id} hidden={!open}><NavGroup><NavItem href="#gallery-nav-expandable">Item two</NavItem><NavItem href="#gallery-nav-expandable">Item three</NavItem></NavGroup></div></Nav>;
};

/** Two-column inspector layout; every editable surface is an Area control. */
export const GalleryPanel = () => {
  const id = useId();
  const pair = { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "var(--area-space-8)" };
  return <Panel size="sm" title="Title" aria-label="Label">
    <PanelSection heading="Label">
      <Segmented fullWidth label="Label" defaultValue="top" options={[
        { value: "top", icon: <AlignTopIcon />, label: <span className="area-sr-only">Align top</span> },
        { value: "middle", icon: <AlignMiddleIcon />, label: <span className="area-sr-only">Align middle</span> },
        { value: "bottom", icon: <AlignBottomIcon />, label: <span className="area-sr-only">Align bottom</span> },
      ]} />
      <div style={pair}>
        <Input fullWidth variant="soft" type="number" prefix="X" aria-label="Label" defaultValue={0} />
        <Input fullWidth variant="soft" type="number" prefix="Y" aria-label="Label" defaultValue={0} />
      </div>
    </PanelSection>
    <PanelSection heading="Label">
      <Segmented fullWidth label="Label" defaultValue="one" options={[
        { value: "one", label: "One" }, { value: "two", label: "Two" },
      ]} />
      <div style={pair}>
        <Input fullWidth variant="soft" type="number" prefix="W" aria-label="Label" min={0} defaultValue={100} />
        <Input fullWidth variant="soft" type="number" prefix="H" aria-label="Label" min={0} defaultValue={100} />
      </div>
      <Field orientation="horizontal" label="Label" htmlFor={id + "-gap"}><Input fullWidth variant="soft" type="number" id={id + "-gap"} min={0} defaultValue={8} /></Field>
      <Field orientation="horizontal" label="Label"><Checkbox id={id + "-clip"} aria-label="Label" defaultChecked /></Field>
    </PanelSection>
  </Panel>;
};

export const GalleryPanelSections = () => (
  <Panel size="sm" title="Title" aria-label="Label">
    <PanelSection>
      <Field orientation="horizontal" label="Label"><Select aria-label="Label" defaultValue="one"><option value="one">Option one</option><option value="two">Option two</option></Select></Field>
      <Field orientation="horizontal" label="Label"><Segmented fullWidth label="Label" defaultValue="one" options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} /></Field>
      <Field orientation="horizontal" label="Label"><Switch aria-label="Label" defaultChecked /></Field>
    </PanelSection>
    <PanelSection heading="Label">
      <Field orientation="horizontal" label="Label"><Select aria-label="Label" defaultValue="one"><option value="one">Option one</option><option value="two">Option two</option></Select></Field>
      <Field orientation="horizontal" label="Label"><Input fullWidth variant="soft" type="number" aria-label="Label" min={0} defaultValue={300} suffix="ms" /></Field>
      <Field orientation="horizontal" label="Label"><Slider aria-label="Label" defaultValue={75} /></Field>
    </PanelSection>
  </Panel>
);

export const GalleryPanelFooter = () => {
  const [sections, setSections] = useState(2);
  return <Panel size="sm" title="Title" aria-label="Label" footer={<Button variant="soft" fullWidth icon={<PlusIcon />} onClick={() => setSections(count => count + 1)}>Action</Button>} style={{ blockSize: 360 }}>
    {Array.from({ length: sections }, (_, index) => <PanelSection key={index}>
      <Field orientation="horizontal" label="Label"><Select aria-label="Label" defaultValue={String(index + 1)}>{Array.from({ length: sections + 1 }, (_, option) => <option key={option} value={String(option + 1)}>{option + 1}</option>)}</Select></Field>
      <Field orientation="horizontal" label="Label"><Input fullWidth variant="soft" type="number" aria-label="Label" min={1} defaultValue={index + 2} /></Field>
    </PanelSection>)}
  </Panel>;
};

export const GalleryPopover = () => (
  <Popover aria-label="Label" role="dialog">
    <PopoverHeader><PopoverTitle>Title</PopoverTitle><Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close" icon={<DismissIcon />} /></PopoverHeader>
    <PopoverBody><PopoverDescription>Description</PopoverDescription></PopoverBody>
    <PopoverFooter><span>1 of 5</span><Button size="sm" variant="outline">Prev</Button><Button size="sm">Next</Button></PopoverFooter>
  </Popover>
);

export const GalleryPopoverField = () => (
  <Popover aria-label="Label" role="dialog">
    <PopoverHeader><PopoverTitle>Title</PopoverTitle><Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close" icon={<DismissIcon />} /></PopoverHeader>
    <PopoverBody><Input fullWidth id="gallery-popover-field-input" aria-label="Label" placeholder="Placeholder" /></PopoverBody>
    <PopoverFooter><Button size="sm" fullWidth>Action</Button></PopoverFooter>
  </Popover>
);

export const GalleryPopoverImage = () => (
  <Popover aria-label="Label" role="dialog">
    <PopoverHeader><PopoverTitle>Title</PopoverTitle><Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close" icon={<DismissIcon />} /></PopoverHeader>
    <PopoverBody><PopoverDescription>Description</PopoverDescription><PopoverMedia><img src="/images/chip-pixels.png" alt="" /></PopoverMedia></PopoverBody>
  </Popover>
);

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
export const GalleryProgressAccent = () => <Progress value={45} label="Label, 45 percent" tone="accent" />;
export const GalleryProgressSmall = () => <Progress value={62} label="Small progress" size="sm" />;
export const GalleryProgressMedium = () => <Progress value={62} label="Medium progress" size="md" />;
export const GalleryProgressLarge = () => <Progress value={62} label="Large progress" size="lg" />;

export const GalleryRadio = () => (
  <RadioGroup label="Label" name="gallery-plan" defaultValue="one">
    <Radio value="one" label="Option one" />
    <Radio value="two" label="Option two" />
  </RadioGroup>
);

export const GalleryRadioSmall = () => <Radio size="sm" name="gallery-radio-small" value="small" label="Small" />;
export const GalleryRadioMedium = () => <Radio size="md" name="gallery-radio-medium" value="medium" label="Medium" />;
export const GalleryRadioLarge = () => <Radio size="lg" name="gallery-radio-large" value="large" label="Large" />;
export const GalleryRadioSelected = () => <Radio name="gallery-radio-selected" value="selected" label="Label" defaultChecked />;
export const GalleryRadioDisabled = () => <Radio name="gallery-radio-disabled" value="disabled" label="Label" disabled />;

export const GallerySegmented = () => (
  <Segmented label="Label" defaultValue="one" options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />
);
export const GallerySegmentedIcons = () => <Segmented label="Label" defaultValue="top" options={[{ value: "top", label: "Top", icon: <AlignTopIcon /> }, { value: "middle", label: "Middle", icon: <AlignMiddleIcon /> }, { value: "bottom", label: "Bottom", icon: <AlignBottomIcon /> }]} />;
export const GallerySegmentedIconOnly = () => <Segmented iconOnly label="Label" defaultValue="top" options={[{ value: "top", label: "Align top", icon: <AlignTopIcon /> }, { value: "middle", label: "Align middle", icon: <AlignMiddleIcon /> }, { value: "bottom", label: "Align bottom", icon: <AlignBottomIcon /> }]} />;
export const GallerySegmentedFullWidth = () => <Segmented fullWidth label="Label" defaultValue="one" style={{ inlineSize: "100%" }} options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three" }]} />;
export const GallerySegmentedDisabled = () => <Segmented label="Label" defaultValue="one" options={[{ value: "one", label: "One" }, { value: "two", label: "Two", disabled: true }, { value: "three", label: "Three" }]} />;
export const GallerySegmentedSmall = () => <Segmented size="sm" label="Label" defaultValue="one" options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />;
export const GallerySegmentedMedium = () => <Segmented size="md" label="Label" defaultValue="one" options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />;
export const GallerySegmentedLarge = () => <Segmented size="lg" label="Label" defaultValue="one" options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />;

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

export const GallerySlider = () => <Slider aria-label="Label" min={0} max={100} defaultValue={60} readout={value => `${value}%`} />;
export const GallerySliderSmall = () => <Slider aria-label="Label" size="sm" defaultValue={40} readout={value => `${value}%`} />;
export const GallerySliderMedium = () => <Slider aria-label="Label" size="md" defaultValue={60} readout={value => `${value}%`} />;
export const GallerySliderLarge = () => <Slider aria-label="Label" size="lg" defaultValue={80} readout={value => `${value}%`} />;
export const GallerySliderNeutral = () => <Slider aria-label="Label" tone="neutral" defaultValue={45} readout={value => `${value}%`} />;
export const GallerySliderAccent = () => <Slider aria-label="Label" tone="accent" defaultValue={65} readout={value => `${value}%`} />;
export const GallerySliderWithLabel = () => <Slider label="Label" labelPosition="top" defaultValue={50} readout={value => `${value}%`} />;
export const GallerySliderLabelOnly = () => <Slider label="Label" labelPosition="top" defaultValue={50} />;
export const GallerySliderSteps = () => <Slider aria-label="Label" min={0.5} max={2} step={0.25} defaultValue={1} readout={value => `${value}×`} />;
export const GallerySliderStepMarks = () => <Slider aria-label="Label" min={0} max={5} step={1} defaultValue={1} stepMarks />;
export const GallerySliderVertical = () => <Slider aria-label="Label" orientation="vertical" defaultValue={50} style={{ ["--_vertical-length" as string]: "100%" }} />;
export const GallerySliderControlled = () => {
  const [value, setValue] = useState(40);
  return <Slider label="Label" labelPosition="top" value={value} onValueChange={setValue} readout={value => `${value}%`} />;
};
export const GallerySliderRangeWithInputs = () => <SliderRangeComposition />;
export const GallerySliderDisabled = () => <Slider aria-label="Label" defaultValue={60} readout={value => `${value}%`} disabled />;
export const GallerySliderBare = () => <Slider aria-label="Label" defaultValue={40} />;


export const GallerySpinner = () => (
  <Spinner />
);
export const GallerySpinnerSmall = () => <Spinner size="sm" />;
export const GallerySpinnerMedium = () => <Spinner size="md" />;
export const GallerySpinnerLarge = () => <Spinner size="lg" />;
export const GallerySpinnerAccent = () => <Spinner tone="accent" />;
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

export const GallerySwitchSmall = () => <Switch size="sm" label="Small" />;
export const GallerySwitchMedium = () => <Switch size="md" label="Medium" />;
export const GallerySwitchLarge = () => <Switch size="lg" label="Large" />;
export const GallerySwitchOn = () => <Switch label="On" defaultChecked />;
export const GallerySwitchDisabled = () => <Switch label="Label" disabled />;

export const GalleryTable = () => (
  <Table aria-label="Table"><thead><tr><th scope="col">Name</th><th scope="col">Status</th><th scope="col" className="area-table__cell--numeric">Value</th></tr></thead><tbody><tr><td>Item one</td><td><Badge size="sm" tone="success" dot>Status</Badge></td><td className="area-table__cell--numeric">1</td></tr><tr><td>Item two</td><td><Badge size="sm">Status</Badge></td><td className="area-table__cell--numeric">2</td></tr></tbody></Table>
);

export const GalleryTableSelectable = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const rows = ["Item one", "Item two", "Item three"];
  return <Table aria-label="Table"><thead><tr><th scope="col" className="area-table__cell--fit"><Checkbox aria-label="Select all rows" checked={selected.length === rows.length} indeterminate={selected.length > 0 && selected.length < rows.length} onChange={event => setSelected(event.target.checked ? rows : [])} /></th><th scope="col">Name</th></tr></thead><tbody>{rows.map(name => <tr key={name} aria-selected={selected.includes(name)}><td><Checkbox aria-label={`Select ${name}`} checked={selected.includes(name)} onChange={event => setSelected(event.target.checked ? [...selected, name] : selected.filter(item => item !== name))} /></td><td>{name}</td></tr>)}</tbody></Table>;
};
export const GalleryTableSorting = () => {
  const [descending, setDescending] = useState(false);
  const rows = [{ name: "Item one", value: 1 }, { name: "Item two", value: 12 }, { name: "Item three", value: 128 }].sort((a, b) => descending ? b.value - a.value : a.value - b.value);
  return <Table aria-label="Table"><thead><tr><th scope="col">Name</th><th scope="col" aria-sort={descending ? "descending" : "ascending"} className="area-table__cell--numeric"><Button size="sm" variant="ghost" onClick={() => setDescending(!descending)}>Value {descending ? "↓" : "↑"}</Button></th></tr></thead><tbody>{rows.map(row => <tr key={row.name}><td>{row.name}</td><td className="area-table__cell--numeric">{row.value}</td></tr>)}</tbody></Table>;
};
export const GalleryTableCompact = () => <Table size="sm" aria-label="Table"><thead><tr><th scope="col">Name</th><th scope="col" className="area-table__cell--numeric">Value</th></tr></thead><tbody>{["Item one", "Item two", "Item three"].map((name, i) => <tr key={name}><td>{name}</td><td className="area-table__cell--numeric">{[1, 12, 128][i]} MB</td></tr>)}</tbody></Table>;
export const GalleryTableStriped = () => <Table striped aria-label="Table"><thead><tr><th scope="col">Name</th><th scope="col" className="area-table__cell--numeric">Value</th></tr></thead><tbody>{["Item one", "Item two", "Item three", "Item four"].map((name, i) => <tr key={name}><td>{name}</td><td className="area-table__cell--numeric">{[1, 12, 128, 1024][i]} MB</td></tr>)}</tbody></Table>;
export const GalleryTableDividers = () => <Table columnDividers aria-label="Table"><thead><tr><th scope="col">Name</th><th scope="col">Label</th><th scope="col">Status</th></tr></thead><tbody><tr><td>Item one</td><td>Label</td><td>Status</td></tr><tr><td>Item two</td><td>Label</td><td>Status</td></tr></tbody></Table>;
export const GalleryTableEmpty = () => <Table aria-label="Table"><thead><tr><th scope="col">Name</th><th scope="col">Status</th></tr></thead><tbody><tr><td colSpan={2}>No items</td></tr></tbody></Table>;
export const GalleryTableLoading = () => <Table aria-label="Table" aria-busy="true"><thead><tr><th scope="col">Name</th><th scope="col">Status</th></tr></thead><tbody>{[0, 1, 2].map(row => <tr key={row}><td><Skeleton shape="text" style={{ inlineSize: "var(--area-space-96)" }} /></td><td><Skeleton shape="text" style={{ inlineSize: "var(--area-space-48)" }} /></td></tr>)}</tbody></Table>;

export const GalleryTabs = () => (
  <Tabs tabs={[{ id: "one", label: "Item one", content: "Body text" }, { id: "two", label: "Item two", content: "Body text" }, { id: "three", label: "Item three", content: "Body text" }]} style={{ inlineSize: "100%" }} />
);
export const GalleryTabsDisabled = () => <Tabs tabs={[{ id: "one", label: "Item one", content: "Body text" }, { id: "two", label: "Item two", disabled: true, content: "Body text" }, { id: "three", label: "Item three", content: "Body text" }]} />;
export const GalleryTabsVertical = () => <Tabs orientation="vertical" label="Label" tabs={[{ id: "one", label: "Item one", content: "Body text" }, { id: "two", label: "Item two", content: "Body text" }, { id: "three", label: "Item three", content: "Body text" }]} />;
export const GalleryTabsSmall = () => <Tabs size="sm" tabs={[{ id: "one", label: "Item one", content: "Body text" }, { id: "two", label: "Item two", content: "Body text" }]} />;
export const GalleryTabsTrack = () => <Tabs track tabs={[{ id: "one", label: "Item one", content: "Body text" }, { id: "two", label: "Item two", content: "Body text" }]} />;
export const GalleryTabsIcons = () => <Tabs tabs={[{ id: "one", label: "Item one", icon: <PersonIcon />, content: "Body text" }, { id: "two", label: "Item two", icon: <InfoIcon />, content: "Body text" }]} />;
export const GalleryTabsCounts = () => <Tabs tabs={[{ id: "one", label: "Item one", trailing: <Badge size="sm">1</Badge>, content: "Body text" }, { id: "two", label: "Item two", trailing: <Badge size="sm">2</Badge>, content: "Body text" }]} />;

export const GalleryTextarea = () => <Textarea aria-label="Label" placeholder="Placeholder" rows={3} />;

export const GalleryTextareaSmall = () => <Textarea size="sm" rows={3} aria-label="Label" placeholder="Small" />;
export const GalleryTextareaMedium = () => <Textarea size="md" rows={3} aria-label="Label" placeholder="Medium" />;
export const GalleryTextareaLarge = () => <Textarea size="lg" rows={3} aria-label="Label" placeholder="Large" />;
export const GalleryTextareaCount = () => {
  const [value, setValue] = useState("");
  return <Field label="Label" description={`${value.length} / 160 characters`}><Textarea fullWidth rows={3} maxLength={160} value={value} onChange={event => setValue(event.target.value)} placeholder="Placeholder" /></Field>;
};

export const GalleryToast = () => <Toast tone="success" icon={<CheckIcon />}>Body text</Toast>;
export const GalleryToastInfo = () => <Toast tone="info" icon={<InfoIcon />}>Body text</Toast>;
export const GalleryToastWarning = () => <Toast tone="warning" icon={<InfoIcon />} >Body text</Toast>;
export const GalleryToastDanger = () => <Toast tone="danger" icon={<DismissIcon />} >Body text</Toast>;
export const GalleryToastTitle = () => <Toast tone="info" icon={<InfoIcon />} title="Title">Body text</Toast>;
export const GalleryToastMultiline = () => <Toast tone="info" icon={<InfoIcon />} style={{ inlineSize: "calc(var(--area-space-96) * 2 + var(--area-space-48))" }}>Body text that wraps onto a second line</Toast>;
export const GalleryToastAction = () => {
  const [undone, setUndone] = useState(false);
  return <Toast icon={<CheckIcon />} tone="success" action={!undone ? <Button size="sm" variant="outline" onClick={() => setUndone(true)}>Undo</Button> : undefined}>Body text</Toast>;
};
export const GalleryToastDismissible = () => {
  const [visible, setVisible] = useState(true);
  return visible ? <Toast icon={<CheckIcon />} tone="success" onDismiss={() => setVisible(false)}>Body text</Toast> : <Button variant="outline" onClick={() => setVisible(true)}>Show notification</Button>;
};

export const GalleryToken = () => (
  <Token swatch="var(--area-accent-solid)">--area-accent-solid</Token>
);

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
    <Tooltip id="gallery-tooltip-shortcut">Description <Kbd appearance="on-emphasis" keys={["cmd", "K"]} /></Tooltip>
    <Button aria-describedby="gallery-tooltip-shortcut" variant="outline">Button</Button>
  </div>
);
export const GalleryTooltipSide = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--area-space-8)" }}>
    <Button aria-describedby="gallery-tooltip-side-label" variant="outline">Button</Button>
    <Tooltip id="gallery-tooltip-side-label" side="right">Description</Tooltip>
  </div>
);

export const GalleryTooltipBottom = () => <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--area-space-8)" }}><Button variant="outline" aria-describedby="tooltip-bottom">Button</Button><Tooltip side="bottom" id="tooltip-bottom">Description</Tooltip></div>;
export const GalleryTooltipLeft = () => <div style={{ display: "flex", alignItems: "center", gap: "var(--area-space-8)" }}><Tooltip side="left" id="tooltip-left">Description</Tooltip><Button variant="outline" aria-describedby="tooltip-left">Button</Button></div>;

export const CodeInProse = () => (
  <p>Install the package with <Code>npm install @area/react</Code>.</p>
);

export const SegmentedSizes = () => (
  <div className="docs-gallery-stack">
    <Segmented size="sm" label="Label" defaultValue="one" options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />
    <Segmented size="md" label="Label" defaultValue="one" options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />
    <Segmented size="lg" label="Label" defaultValue="one" options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }]} />
  </div>
);

export const SegmentedFullWidth = () => (
  <div style={{ inlineSize: 280 }}><Segmented fullWidth label="Label" defaultValue="one" options={[{ value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "three", label: "Three", disabled: true }]} /></div>
);
