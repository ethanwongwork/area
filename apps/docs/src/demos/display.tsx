import { useState } from "react";
import { Alert, Avatar, AvatarGroup, Badge, Indicator, IndicatorAnchor, Button, Card, CardAction, CardDescription, CardFooter, CardMedia, CardTitle, Checkbox, Chip, ChipGroup, Code, Dialog, Field, Input, Kbd, KbdGroup, Label, Menu, MenuItem, Panel, PanelSection, PanelStack, Popover, PopoverDescription, PopoverHeader, PopoverTitle, Progress, Segmented, Select, Separator, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Tooltip } from "@area/react";
import { AlertIcon, AlignBottomIcon, AlignMiddleIcon, AlignTopIcon, ArrowIcon, CheckIcon, DismissIcon, DotsFourIcon, InfoIcon, PersonIcon, PlusIcon, SearchIcon, TokenIcon } from "../icons.tsx";

export const AvatarDefault = () => <Avatar fallback="A" alt="Avatar" />;

export const AvatarImage = () => (
  <Avatar src="/images/chip-avatar.png" fallback="A" alt="Avatar" />
);

export const AvatarImageFallback = () => (
  <Avatar src="/images/avatar-missing.png" fallback="A" alt="Avatar" />
);

export const AvatarInitials = () => <><Avatar fallback="A" alt="Avatar" /><Avatar fallback="AV" alt="Avatar" /></>;

export const AvatarIcon = () => <Avatar icon={<PersonIcon />} alt="Avatar" />;

export const AvatarGrouped = () => (
  <AvatarGroup max={3} aria-label="Avatars"><Avatar fallback="A" alt="Avatar" /><Avatar src="/images/chip-avatar.png" fallback="B" alt="Avatar" /><Avatar fallback="C" alt="Avatar" /><Avatar fallback="D" alt="Avatar" /><Avatar fallback="E" alt="Avatar" /></AvatarGroup>
);

export const AvatarActive = () => <Avatar active fallback="A" alt="Avatar" />;

export const AvatarAvailability = () => <IndicatorAnchor compact placement="bottom-end" overlap="circular" indicator={<Indicator status="available" size="sm" />}><Avatar fallback="A" role="img" aria-label="Avatar, available" /></IndicatorAnchor>;

export const AvatarNotification = () => <IndicatorAnchor compact placement="top-end" overlap="circular" indicator={<Indicator count={2} />}><Avatar src="/images/chip-avatar.png" fallback="A" alt="Avatar, 2 notifications" /></IndicatorAnchor>;

export const AvatarTones = () => <><Avatar tone="accent" fallback="A" alt="Avatar" /><Avatar tone="inverse" fallback="A" alt="Avatar" /></>;

export const AvatarShapes = () => (
  <>
    <Avatar fallback="A" alt="Avatar" />
    <Avatar shape="square" fallback="A" alt="Avatar" />
  </>
);

export const AvatarSizes = () => (
  <>
    <Avatar size="sm" fallback="S" alt="Small avatar" />
    <Avatar size="md" fallback="M" alt="Medium avatar" />
    <Avatar size="lg" fallback="L" alt="Large avatar" />
  </>
);


export const AlertDefault = () => (
  <Alert icon={<InfoIcon />} title="Title" style={{ maxInlineSize: 720 }}>
    Body text
  </Alert>
);

export const AlertAccent = () => (
  <Alert tone="accent" icon={<InfoIcon />} title="Title" style={{ maxInlineSize: 720 }}>
    Body text
  </Alert>
);

export const AlertWithLink = () => (
  <Alert icon={<InfoIcon />} title="Title" link={<a href="#alert-multiline">Link</a>} style={{ maxInlineSize: 720 }}>
    Body text
  </Alert>
);

export const AlertTones = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-12)", inlineSize: 720 }}>
    <Alert tone="success" icon={<CheckIcon />} title="Title">Body text</Alert>
    <Alert tone="warning" icon={<AlertIcon />} title="Title">Body text</Alert>
    <Alert tone="danger" icon={<AlertIcon />} title="Title">Body text</Alert>
  </div>
);

export const AlertAction = () => (
  <Alert icon={<InfoIcon />} title="Title" action={<><Button size="sm" variant="outline">Secondary</Button><Button size="sm">Action</Button></>} onDismiss={() => {}} style={{ maxInlineSize: 720 }}>
    Body text
  </Alert>
);

export const AlertMultiline = () => (
  <Alert layout="multiline" icon={<InfoIcon />} title="Title" action={<><Button size="sm" variant="outline">Secondary</Button><Button size="sm">Action</Button></>} onDismiss={() => {}} style={{ maxInlineSize: 720 }}>
    Body text that wraps onto a second line
  </Alert>
);

export const AlertDismissible = () => {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <Alert icon={<InfoIcon />} title="Title" onDismiss={() => setVisible(false)} style={{ maxInlineSize: 720 }}>
      Body text
    </Alert>
  ) : <Button variant="outline" size="sm" onClick={() => setVisible(true)}>Show alert</Button>;
};

export const SeparatorDefault = () => (
  <div style={{ inlineSize: 280 }}>
    <Separator />
  </div>
);

export const SkeletonDefault = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-8)", inlineSize: 280 }}>
    <Skeleton shape="text" style={{ inlineSize: "60%" }} />
    <Skeleton shape="text" />
    <Skeleton shape="text" style={{ inlineSize: "80%" }} />
  </div>
);

export const SpinnerDefault = () => (
  <>
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
  </>
);

export const ProgressDefault = () => (
  <div style={{ inlineSize: 280 }}>
    <Progress value={62} label="Label" />
  </div>
);

export const ProgressIndeterminate = () => (
  <div style={{ inlineSize: 280 }}>
    <Progress label="Label" />
  </div>
);

export const TooltipDefault = () => <Tooltip>Description</Tooltip>;

export const MenuDefault = () => (
  <Menu>
    <MenuItem shortcut={<Kbd keys={["cmd", "K"]} quiet />}>
      <span className="area-menu__icon"><SearchIcon /></span>
      <span className="area-menu__text">Item one</span>
    </MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "N"]} quiet />}>
      <span className="area-menu__icon"><PlusIcon /></span>
      <span className="area-menu__text">Item two</span>
    </MenuItem>
    <div className="area-menu__separator" />
    <MenuItem>
      <span className="area-menu__icon"><TokenIcon /></span>
      <span className="area-menu__text">Item three</span>
    </MenuItem>
    <MenuItem shortcut={<ArrowIcon />}>
      <span className="area-menu__icon"><DotsFourIcon /></span>
      <span className="area-menu__text">Item four</span>
    </MenuItem>
    <MenuItem tone="danger" shortcut={<Kbd keys={["cmd", "backspace"]} quiet />}>
      <span className="area-menu__icon"><DismissIcon /></span>
      <span className="area-menu__text">Item five</span>
    </MenuItem>
  </Menu>
);

export const PopoverDefault = () => (
  <Popover aria-label="Title" role="dialog">
    <PopoverHeader><PopoverTitle>Title</PopoverTitle><PopoverDescription>Description</PopoverDescription></PopoverHeader>
  </Popover>
);

export const ToastDefault = () => (
  <Toast tone="success" icon={<CheckIcon />}>
    Body text
  </Toast>
);

export const TableDefault = () => (
  <Table interactive>
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th className="area-table__cell--numeric">Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Item one</td>
        <td>
          <Badge tone="success" dot>
            Status
          </Badge>
        </td>
        <td className="area-table__cell--numeric">1</td>
      </tr>
      <tr>
        <td>Item two</td>
        <td>
          <Badge tone="warning">Status</Badge>
        </td>
        <td className="area-table__cell--numeric">2</td>
      </tr>
    </tbody>
  </Table>
);

export const TabsDefault = () => (
  <Tabs
    value="one"
    tabs={[
      { id: "one", label: "Item one" },
      { id: "two", label: "Item two" },
      { id: "three", label: "Item three" },
    ]}
    style={{ inlineSize: 380 }}
  >
    Body text
  </Tabs>
);

export const DialogDefault = () => (
  <Dialog
    title="Title"
    description="Description"
    footer={
      <>
        <Button variant="ghost">
          Cancel
        </Button>
        <Button>
          Action
        </Button>
      </>
    }
    style={{ inlineSize: 400 }}
  >Body text</Dialog>
);

export const KbdDefault = () => <Kbd keys={["cmd", "K"]} />;

export const KbdSizes = () => (
  <><Kbd keys={["cmd", "K"]} size="small" /> <Kbd keys={["cmd", "K"]} /></>
);

export const KbdButton = () => (
  <>
    <Button variant="outline" tone="neutral" aria-keyshortcuts="Meta+Z">Button <Kbd keys={["cmd", "Z"]} /></Button>
    <Button tone="neutral" aria-keyshortcuts="Meta+Enter">Button <Kbd keys={["cmd", "enter"]} /></Button>
    <Button tone="success" aria-keyshortcuts="Meta+Enter">Button <Kbd keys={["cmd", "enter"]} /></Button>
  </>
);

export const KbdOnEmphasis = () => (
  <Tooltip>
    Description <Kbd appearance="on-emphasis" keys={["cmd", "B"]} />
  </Tooltip>
);

export const KbdSequence = () => (
  <KbdGroup>
    <Kbd keys={["cmd", "K"]} />
    <Kbd keys={["P"]} />
  </KbdGroup>
);

export const KbdKeyMap = () => (
  <>
    <Kbd keys={["cmd", "shift", "P"]} />
    <Kbd keys={["ctrl", "shift", "M"]} />
    <Kbd keys={["alt", "tab"]} />
    <Kbd keys={["escape"]} />
    <Kbd keys={["enter"]} />
    <Kbd keys={["space"]} />
  </>
);

export const MenuWithShortcuts = () => (
  <Menu>
    <MenuItem shortcut={<Kbd keys={["cmd", "K"]} quiet />}>
      <span className="area-menu__icon"><SearchIcon /></span>
      <span className="area-menu__text">Item one</span>
    </MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "N"]} quiet />}>
      <span className="area-menu__icon"><PlusIcon /></span>
      <span className="area-menu__text">Item two</span>
    </MenuItem>
    <div className="area-menu__separator" />
    <MenuItem tone="danger" shortcut={<Kbd keys={["cmd", "backspace"]} quiet />}>
      <span className="area-menu__icon"><DismissIcon /></span>
      <span className="area-menu__text">Item three</span>
    </MenuItem>
  </Menu>
);

export const TokenDefault = () => <Code>--area-space-16</Code>;

export const TokenSwatch = () => (
  <Code swatch="var(--area-accent-solid)">--area-accent-solid</Code>
);

export const TokenOnColor = () => (
  <div style={{ background: "var(--area-accent-solid)", color: "var(--area-fg-on-accent)", padding: "var(--area-space-12)", inlineSize: "fit-content", borderRadius: "var(--area-radius-container)" }}>
    <Code onColor>--area-fg-on-accent</Code>
  </div>
);

export const TokenInProse = () => (
  <div style={{ inlineSize: 380 }}>
    Set <Code>--area-radius-control</Code> to change how rounded a control is.
  </div>
);

export const TokenSubtle = () => <Code subtle>--area-accent-solid</Code>;

/*
 * Every control the system has, in one panel, at one tier.
 *
 * It is the size audit made visible as much as it is a demo: a select, a segmented
 * control, a chip, a slider and an input all sit on `sm`, so any one of them rendering at
 * a different height is visible as a ragged right edge rather than as a number in a table.
 */
export const PanelEverything = () => (
  <Panel
    size="md"
    title="Title"
    action={
      <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close" icon={<DismissIcon />} />
    }
    footer={<Button variant="soft" tone="neutral" size="sm" fullWidth>Action</Button>}
    style={{ inlineSize: 320, blockSize: 560 }}
  >
    <PanelSection heading="Label">
      <Field orientation="horizontal" label="Label" htmlFor="panel-trigger">
        <Select size="sm" id="panel-trigger" defaultValue="one">
          <option value="one">Option one</option>
          <option value="two">Option two</option>
          <option value="three">Option three</option>
        </Select>
      </Field>
      <Field orientation="horizontal" label="Label">
        <Segmented
          size="sm"
          fullWidth
          label="Label"
          value="top"
          options={[
            { value: "top", icon: <AlignTopIcon />, label: <span className="area-sr-only">Align top</span> },
            { value: "middle", icon: <AlignMiddleIcon />, label: <span className="area-sr-only">Align middle</span> },
            { value: "bottom", icon: <AlignBottomIcon />, label: <span className="area-sr-only">Align bottom</span> },
          ]}
        />
      </Field>
      <Field orientation="horizontal" label="Label">
        <Segmented
          size="sm"
          fullWidth
          label="Label"
          value="one"
          options={[
            { value: "one", label: "One" },
            { value: "two", label: "Two" },
          ]}
        />
      </Field>
      <Field orientation="horizontal" label="Label" htmlFor="panel-enabled">
        <Switch size="sm" id="panel-enabled" defaultChecked />
      </Field>
    </PanelSection>

    <PanelSection heading="Label">
      <Field orientation="horizontal" label="Label">
        <Slider size="sm" min={0} max={100} defaultValue={80} readout="80" />
      </Field>
      <Field orientation="horizontal" label="Label" htmlFor="panel-radius">
        <Input size="sm" id="panel-radius" defaultValue="22" suffix="px" />
      </Field>
      <PanelStack>
        <Label>Label</Label>
        <ChipGroup>
          <Chip size="sm" swatch="var(--area-red-500)">Red</Chip>
          <Chip size="sm" selected swatch="var(--area-indigo-500)">Indigo</Chip>
          <Chip size="sm" swatch="var(--area-teal-600)">Teal</Chip>
        </ChipGroup>
      </PanelStack>
    </PanelSection>

    <PanelSection heading="Label">
      <PanelStack>
        <Label htmlFor="panel-note">Label</Label>
        <Textarea size="sm" id="panel-note" rows={2} placeholder="Placeholder" />
      </PanelStack>
      <Field orientation="horizontal" label="Label" htmlFor="panel-loop">
        <Checkbox id="panel-loop" defaultChecked />
      </Field>
      <Field orientation="horizontal" label="Label" htmlFor="panel-ease">
        <Select size="sm" id="panel-ease" defaultValue="one">
          <option value="one">Option one</option>
          <option value="two">Option two</option>
        </Select>
      </Field>
    </PanelSection>
  </Panel>
);
