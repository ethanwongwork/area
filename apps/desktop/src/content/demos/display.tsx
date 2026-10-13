import { useState } from "react";
import { Alert, Avatar, AvatarGroup, Badge, Indicator, IndicatorAnchor, Button, Checkbox, Chip, ChipGroup, Dialog, Field, Input, Kbd, KbdGroup, Label, Menu, MenuItem, Panel, PanelSection, PanelStack, Popover, PopoverDescription, PopoverHeader, PopoverTitle, Progress, Segmented, Select, Separator, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Tooltip } from "@area/react";
import { AlertIcon, AlignBottomIcon, AlignMiddleIcon, AlignTopIcon, ArrowIcon, CheckIcon, DismissIcon, DotsFourIcon, InfoIcon, PersonIcon, PlusIcon, SearchIcon, TokenIcon } from "../../../../docs/src/icons.tsx";

export const AvatarDefault = () => <Avatar fallback="D" alt="David Tee" />;

export const AvatarImage = () => (
  <Avatar src="images/david-tee.jpg" fallback="D" alt="David Tee" />
);

export const AvatarImageFallback = () => (
  <Avatar src="images/avatar-missing.png" fallback="D" alt="David Tee" />
);

export const AvatarInitials = () => <><Avatar fallback="D" alt="David Tee" /><Avatar fallback="DT" alt="David Tee" /></>;

export const AvatarIcon = () => <Avatar icon={<PersonIcon />} alt="David Tee" />;

export const AvatarGrouped = () => (
  <AvatarGroup max={3} aria-label="David Tee and 4 teams"><Avatar src="images/david-tee.jpg" fallback="DT" alt="David Tee" /><Avatar shape="square" fallback="D" alt="Design team" /><Avatar shape="square" fallback="R" alt="Research team" /><Avatar shape="square" fallback="P" alt="Platform team" /><Avatar shape="square" fallback="S" alt="Support team" /></AvatarGroup>
);

export const AvatarActive = () => <Avatar active fallback="D" alt="David Tee" />;

export const AvatarAvailability = () => <IndicatorAnchor inset placement="bottom-end" overlap="circular" indicator={<Indicator status="available" size="sm" />}><Avatar fallback="D" role="img" aria-label="David Tee, available" /></IndicatorAnchor>;

export const AvatarNotification = () => <IndicatorAnchor inset placement="top-end" overlap="circular" indicator={<Indicator count={2} />}><Avatar src="images/david-tee.jpg" fallback="D" alt="David Tee, 2 notifications" /></IndicatorAnchor>;

export const AvatarTones = () => <><Avatar fallback="D" alt="David Tee" /><Avatar tone="inverse" fallback="D" alt="David Tee" /></>;

export const AvatarShapes = () => (
  <>
    <Avatar fallback="D" alt="David Tee" />
    <Avatar shape="square" fallback="D" alt="Design team" />
  </>
);

export const AvatarSizes = () => (
  <>
    <Avatar size="sm" fallback="D" alt="David Tee" />
    <Avatar size="md" fallback="D" alt="David Tee" />
    <Avatar size="lg" fallback="D" alt="David Tee" />
  </>
);


export const AlertDefault = () => (
  <Alert icon={<InfoIcon />} title="Title" style={{ maxInlineSize: 720 }}>
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

export const SpinnerDefault = () => <Spinner label="Loading" />;

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
    <MenuItem shortcut={<Kbd keys={["cmd", "K"]} variant="quiet" />} icon={<SearchIcon />}>Item one</MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "N"]} variant="quiet" />} icon={<PlusIcon />}>Item two</MenuItem>
    <div className="area-menu__separator" />
    <MenuItem icon={<TokenIcon />}>Item three</MenuItem>
    <MenuItem shortcut={<ArrowIcon />} icon={<DotsFourIcon />}>Item four</MenuItem>
    <MenuItem tone="danger" shortcut={<Kbd keys={["cmd", "backspace"]} variant="quiet" />} icon={<DismissIcon />}>Item five</MenuItem>
  </Menu>
);

export const PopoverDefault = () => (
  <Popover role="dialog">
    <PopoverHeader><PopoverTitle>Title</PopoverTitle><PopoverDescription>Description</PopoverDescription></PopoverHeader>
  </Popover>
);

export const ToastDefault = () => <Toast>Body text</Toast>;

export const TableDefault = () => (
  <Table aria-label="Items">
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
    items={[
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
  <><Kbd keys={["cmd", "K"]} size="sm" /> <Kbd keys={["cmd", "K"]} /></>
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
    Description <Kbd keys={["cmd", "B"]} />
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
    <MenuItem shortcut={<Kbd keys={["cmd", "K"]} variant="quiet" />} icon={<SearchIcon />}>Item one</MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "N"]} variant="quiet" />} icon={<PlusIcon />}>Item two</MenuItem>
    <div className="area-menu__separator" />
    <MenuItem tone="danger" shortcut={<Kbd keys={["cmd", "backspace"]} variant="quiet" />} icon={<DismissIcon />}>Item three</MenuItem>
  </Menu>
);

/*
 * Every control the system has, in one panel, at one tier and one field style.
 *
 * It is the size audit made visible as much as it is a demo: a select, a segmented
 * control, a chip, a slider and an input all sit on the medium height with soft fields, so
 * any one of them rendering at a different height is visible as a ragged right edge rather
 * than as a number in a table.
 */
export const PanelEverything = () => (
  <Panel
    size="md"
    title="Title"
    action={
      <Button variant="ghost" tone="neutral" size="sm" iconOnly aria-label="Close" icon={<DismissIcon />} />
    }
    footer={<Button variant="soft" tone="neutral" fullWidth>Action</Button>}
    style={{ blockSize: 560 }}
  >
    <PanelSection heading="Label">
      <Field orientation="horizontal" label="Label" htmlFor="panel-trigger">
        <Select variant="soft" fullWidth id="panel-trigger" defaultValue="one">
          <option value="one">Option one</option>
          <option value="two">Option two</option>
          <option value="three">Option three</option>
        </Select>
      </Field>
      <Field orientation="horizontal" label="Label">
        <Segmented
          fullWidth
          aria-label="Label"
          value="top"
          items={[
            { value: "top", icon: <AlignTopIcon />, label: <span className="area-sr-only">Align top</span> },
            { value: "middle", icon: <AlignMiddleIcon />, label: <span className="area-sr-only">Align middle</span> },
            { value: "bottom", icon: <AlignBottomIcon />, label: <span className="area-sr-only">Align bottom</span> },
          ]}
        />
      </Field>
      <Field orientation="horizontal" label="Label">
        <Segmented
          fullWidth
          aria-label="Label"
          value="one"
          items={[
            { value: "one", label: "One" },
            { value: "two", label: "Two" },
          ]}
        />
      </Field>
      <Field orientation="horizontal" label="Label" htmlFor="panel-enabled">
        <Switch id="panel-enabled" defaultChecked />
      </Field>
    </PanelSection>

    <PanelSection heading="Label">
      <Field orientation="horizontal" label="Label">
        <Slider min={0} max={100} defaultValue={80} readout="80" />
      </Field>
      <Field orientation="horizontal" label="Label" htmlFor="panel-radius">
        <Input variant="soft" fullWidth id="panel-radius" defaultValue="22" suffix="px" />
      </Field>
      <PanelStack>
        <Label>Label</Label>
        <ChipGroup aria-label="Filters">
          <Chip swatch="var(--area-red-500)">Red</Chip>
          <Chip selected swatch="var(--area-indigo-500)">Indigo</Chip>
          <Chip swatch="var(--area-teal-600)">Teal</Chip>
        </ChipGroup>
      </PanelStack>
    </PanelSection>

    <PanelSection heading="Label">
      <PanelStack>
        <Label htmlFor="panel-note">Label</Label>
        <Textarea variant="soft" fullWidth id="panel-note" rows={2} placeholder="Placeholder" />
      </PanelStack>
      <Field orientation="horizontal" label="Label" htmlFor="panel-loop">
        <Checkbox id="panel-loop" defaultChecked />
      </Field>
      <Field orientation="horizontal" label="Label" htmlFor="panel-ease">
        <Select variant="soft" fullWidth id="panel-ease" defaultValue="one">
          <option value="one">Option one</option>
          <option value="two">Option two</option>
        </Select>
      </Field>
    </PanelSection>
  </Panel>
);
