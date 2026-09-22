import { useState } from "react";
import { Alert, Avatar, AvatarGroup, Badge, BadgeAnchor, Button, Card, CardAction, CardDescription, CardFooter, CardMedia, CardTitle, Checkbox, Chip, ChipGroup, Code, Dialog, Field, Input, Kbd, KbdGroup, Label, Menu, MenuItem, Panel, PanelSection, PanelStack, Popover, Progress, Segmented, Select, Separator, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Tooltip } from "@area/react";
import { AlertIcon, AlignBottomIcon, AlignMiddleIcon, AlignTopIcon, ArrowIcon, CheckIcon, DismissIcon, DotsFourIcon, InfoIcon, PersonIcon, PlusIcon, SearchIcon, TokenIcon } from "../icons.tsx";

export const AvatarDefault = () => <Avatar fallback="A" alt="Avatar" />;

export const AvatarImage = () => (
  <Avatar src="/images/chip-avatar.png" fallback="A" alt="Avatar photo" />
);

export const AvatarImageFallback = () => (
  <Avatar src="/images/avatar-missing.png" fallback="A" alt="Avatar fallback" />
);

export const AvatarInitials = () => <><Avatar fallback="A" alt="Single initial avatar" /><Avatar fallback="AV" alt="Two initial avatar" /></>;

export const AvatarIcon = () => <Avatar icon={<PersonIcon />} alt="Generic avatar" />;

export const AvatarGrouped = () => (
  <AvatarGroup max={3} aria-label="Project members"><Avatar fallback="AM" alt="Avery Morgan" /><Avatar src="/images/chip-avatar.png" fallback="JW" alt="Jordan Wong" /><Avatar fallback="SK" alt="Sam Kim" /><Avatar fallback="NP" alt="Noah Patel" /><Avatar fallback="RL" alt="Riley Lee" /></AvatarGroup>
);

export const AvatarActive = () => <Avatar active fallback="AM" alt="Active avatar" />;

export const AvatarAvailability = () => <BadgeAnchor compact placement="bottom-end" overlap="circular" badge={<Badge size="sm" dotOnly tone="success" aria-label="Available" />}><Avatar fallback="AM" role="img" aria-label="Avery Morgan, available" /></BadgeAnchor>;

export const AvatarNotification = () => <BadgeAnchor compact placement="top-end" overlap="circular" badge={<Badge size="sm" variant="solid" tone="info">2</Badge>}><Avatar src="/images/chip-avatar.png" fallback="JW" alt="Jordan Wong, 2 notifications" /></BadgeAnchor>;

export const AvatarTones = () => <><Avatar tone="accent" fallback="AC" alt="Accent avatar" /><Avatar tone="inverse" fallback="IN" alt="Inverse avatar" /></>;

export const AvatarShapes = () => (
  <>
    <Avatar fallback="C" alt="Circle avatar" />
    <Avatar shape="square" fallback="S" alt="Square avatar" />
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
    Body copy goes here.
  </Alert>
);

export const AlertAccent = () => (
  <Alert tone="accent" icon={<InfoIcon />} title="Title" style={{ maxInlineSize: 720 }}>
    Body copy goes here.
  </Alert>
);

export const AlertWithLink = () => (
  <Alert icon={<InfoIcon />} title="Title" link={<a href="#alert-multiline">Text link</a>} style={{ maxInlineSize: 720 }}>
    Body copy goes here.
  </Alert>
);

export const AlertTones = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-12)", inlineSize: 720 }}>
    <Alert tone="success" icon={<CheckIcon />} title="Title">Body copy goes here.</Alert>
    <Alert tone="warning" icon={<AlertIcon />} title="Title">Body copy goes here.</Alert>
    <Alert tone="danger" icon={<AlertIcon />} title="Title">Body copy goes here.</Alert>
  </div>
);

export const AlertAction = () => (
  <Alert icon={<InfoIcon />} title="Title" action={<><Button size="sm" variant="outline">Secondary</Button><Button size="sm">Action</Button></>} onDismiss={() => {}} style={{ maxInlineSize: 720 }}>
    Body copy goes here.
  </Alert>
);

export const AlertMultiline = () => (
  <Alert layout="multiline" icon={<InfoIcon />} title="Title" action={<><Button size="sm" variant="outline">Secondary</Button><Button size="sm">Action</Button></>} onDismiss={() => {}} style={{ maxInlineSize: 720 }}>
    Secondary body copy goes here.
  </Alert>
);

export const AlertDismissible = () => {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <Alert icon={<InfoIcon />} title="Title" onDismiss={() => setVisible(false)} style={{ maxInlineSize: 720 }}>
      Body copy goes here.
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
    <Progress value={62} label="Upload progress" />
  </div>
);

export const ProgressIndeterminate = () => (
  <div style={{ inlineSize: 280 }}>
    <Progress label="Loading" />
  </div>
);

export const TooltipDefault = () => <Tooltip>Copy to clipboard</Tooltip>;

export const MenuDefault = () => (
  <Menu>
    <MenuItem shortcut={<Kbd keys={["cmd", "K"]} quiet />}>
      <span className="area-menu__icon"><SearchIcon /></span>
      <span className="area-menu__text">Search</span>
    </MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "N"]} quiet />}>
      <span className="area-menu__icon"><PlusIcon /></span>
      <span className="area-menu__text">New file</span>
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
    <MenuItem tone="danger" shortcut={<Kbd keys={["cmd", "backspace"]} quiet />}>
      <span className="area-menu__icon"><DismissIcon /></span>
      <span className="area-menu__text">Delete</span>
    </MenuItem>
  </Menu>
);

export const PopoverDefault = () => (
  <Popover>
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-4)" }}>
      <strong>Dimensions</strong>
      <span style={{ color: "var(--area-fg-muted)" }}>Set the size of the layer.</span>
    </div>
  </Popover>
);

export const ToastDefault = () => (
  <Toast tone="success" icon={<CheckIcon />}>
    Changes saved.
  </Toast>
);

export const TableDefault = () => (
  <Table interactive>
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th className="area-table__cell--numeric">Size</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>index.html</td>
        <td>
          <Badge tone="success" dot>
            Live
          </Badge>
        </td>
        <td className="area-table__cell--numeric">12.4 kB</td>
      </tr>
      <tr>
        <td>app.css</td>
        <td>
          <Badge tone="warning">Building</Badge>
        </td>
        <td className="area-table__cell--numeric">86.1 kB</td>
      </tr>
    </tbody>
  </Table>
);

export const TabsDefault = () => (
  <Tabs
    value="account"
    tabs={[
      { id: "account", label: "Account" },
      { id: "password", label: "Password" },
      { id: "team", label: "Team", disabled: true },
    ]}
    style={{ inlineSize: 380 }}
  >
    Make changes to your account here.
  </Tabs>
);

export const DialogDefault = () => (
  <Dialog
    title="Delete project"
    description="This permanently removes the project and everything in it."
    footer={
      <>
        <Button variant="ghost" tone="neutral" size="sm">
          Cancel
        </Button>
        <Button tone="danger" size="sm">
          Delete
        </Button>
      </>
    }
    style={{ inlineSize: 400 }}
  />
);

export const KbdDefault = () => <Kbd keys={["cmd", "K"]} />;

export const KbdSizes = () => (
  <><Kbd keys={["cmd", "K"]} size="small" /> <Kbd keys={["cmd", "K"]} /></>
);

export const KbdButton = () => (
  <>
    <Button variant="outline" tone="neutral" aria-keyshortcuts="Meta+Z">Undo <Kbd keys={["cmd", "Z"]} /></Button>
    <Button tone="neutral" aria-keyshortcuts="Meta+Enter">Save <Kbd keys={["cmd", "enter"]} /></Button>
    <Button tone="success" aria-keyshortcuts="Meta+Enter">Submit <Kbd keys={["cmd", "enter"]} /></Button>
  </>
);

export const KbdOnEmphasis = () => (
  <Tooltip>
    Toggle sidebar <Kbd appearance="on-emphasis" keys={["cmd", "B"]} />
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
      <span className="area-menu__text">Search</span>
    </MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "N"]} quiet />}>
      <span className="area-menu__icon"><PlusIcon /></span>
      <span className="area-menu__text">New file</span>
    </MenuItem>
    <div className="area-menu__separator" />
    <MenuItem tone="danger" shortcut={<Kbd keys={["cmd", "backspace"]} quiet />}>
      <span className="area-menu__icon"><DismissIcon /></span>
      <span className="area-menu__text">Delete</span>
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
    Set <Code>--area-radius-control</Code> to change how rounded a control is. It reads the
    same here as it does in a table.
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
    title="Scroll Variant"
    action={
      <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close" icon={<DismissIcon />} />
    }
    footer={<Button variant="soft" tone="neutral" size="sm" fullWidth>Add Section</Button>}
    style={{ inlineSize: 320, blockSize: 560 }}
  >
    <PanelSection heading="Trigger">
      <Field orientation="horizontal" label="Trigger" htmlFor="panel-trigger">
        <Select size="sm" id="panel-trigger" defaultValue="view">
          <option value="view">Section in View</option>
          <option value="click">On Click</option>
          <option value="load">On Load</option>
        </Select>
      </Field>
      <Field orientation="horizontal" label="Viewport">
        <Segmented
          size="sm"
          fullWidth
          label="Viewport"
          value="bottom"
          options={[
            { value: "top", label: "", icon: <AlignTopIcon /> },
            { value: "middle", label: "", icon: <AlignMiddleIcon /> },
            { value: "bottom", label: "", icon: <AlignBottomIcon /> },
          ]}
        />
      </Field>
      <Field orientation="horizontal" label="Replay">
        <Segmented
          size="sm"
          fullWidth
          label="Replay"
          value="yes"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
      </Field>
      <Field orientation="horizontal" label="Enabled" htmlFor="panel-enabled">
        <Switch size="sm" id="panel-enabled" defaultChecked />
      </Field>
    </PanelSection>

    <PanelSection heading="Style">
      <Field orientation="horizontal" label="Opacity">
        <Slider size="sm" min={0} max={100} defaultValue={80} readout="80" />
      </Field>
      <Field orientation="horizontal" label="Radius" htmlFor="panel-radius">
        <Input size="sm" id="panel-radius" defaultValue="22" suffix="px" />
      </Field>
      <PanelStack>
        <Label>Accent</Label>
        <ChipGroup>
          <Chip size="sm" swatch="var(--area-red-500)">Red</Chip>
          <Chip size="sm" selected swatch="var(--area-indigo-500)">Indigo</Chip>
          <Chip size="sm" swatch="var(--area-teal-600)">Teal</Chip>
        </ChipGroup>
      </PanelStack>
    </PanelSection>

    <PanelSection heading="Content">
      <PanelStack>
        <Label htmlFor="panel-note">Note</Label>
        <Textarea size="sm" id="panel-note" rows={2} placeholder="Describe this variant" />
      </PanelStack>
      <Field orientation="horizontal" label="Loop" htmlFor="panel-loop">
        <Checkbox id="panel-loop" defaultChecked />
      </Field>
      <Field orientation="horizontal" label="Easing" htmlFor="panel-ease">
        <Select size="sm" id="panel-ease" defaultValue="out">
          <option value="out">Ease out</option>
          <option value="linear">Linear</option>
        </Select>
      </Field>
    </PanelSection>
  </Panel>
);
