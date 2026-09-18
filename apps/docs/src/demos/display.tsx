import { Alert, Avatar, Badge, Button, Card, CardAction, CardDescription, CardFooter, CardMedia, CardTitle, Checkbox, Chip, ChipGroup, Code, Dialog, Field, Input, Kbd, Label, Menu, MenuItem, Panel, PanelSection, PanelStack, Popover, Progress, Segmented, Select, Separator, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Tooltip } from "@area/react";
import { AlertIcon, AlignBottomIcon, AlignMiddleIcon, AlignTopIcon, ArrowIcon, CheckIcon, DismissIcon, DotsFourIcon, InfoIcon, PlusIcon, SearchIcon, TokenIcon } from "../icons.tsx";

export const BadgeDefault = () => <Badge>Badge</Badge>;

export const BadgeTones = () => (
  <>
    <Badge tone="neutral">Neutral</Badge>
    <Badge tone="accent">Accent</Badge>
    <Badge tone="success">Success</Badge>
    <Badge tone="warning">Warning</Badge>
    <Badge tone="danger">Danger</Badge>
  </>
);

export const BadgeVariants = () => (
  <>
    <Badge variant="solid" tone="accent">
      Solid
    </Badge>
    <Badge variant="outline">Outline</Badge>
    <Badge tone="success" dot>
      Live
    </Badge>
  </>
);

export const AvatarDefault = () => <Avatar fallback="EW" alt="Ethan Wong" />;

export const AvatarSizes = () => (
  <>
    <Avatar size="xs" fallback="XS" />
    <Avatar size="sm" fallback="SM" />
    <Avatar size="md" fallback="MD" />
    <Avatar size="lg" fallback="LG" />
    <Avatar size="xl" fallback="XL" />
  </>
);

export const CardDefault = () => (
  <Card style={{ inlineSize: 420 }}>
    <CardMedia>
      <span className="area-card__media-cluster" aria-hidden="true">
        <span className="area-card__media-tile"><InfoIcon /></span>
        <span className="area-card__media-tile"><DotsFourIcon /></span>
        <span className="area-card__media-tile"><TokenIcon /></span>
        <span className="area-card__media-tile"><CheckIcon /></span>
      </span>
      <span className="area-card__media-caption">Area</span>
    </CardMedia>
    <CardTitle>High-performance toolkit</CardTitle>
    <CardDescription>Full access to tools that keep work fast, integrated, and calm.</CardDescription>
    <CardAction href="#">
      <TokenIcon />
      <span>Read more about integrations</span>
      <ArrowIcon />
    </CardAction>
    <CardFooter>
      <Button variant="outline" tone="neutral" size="sm">Previous</Button>
      <span className="area-card__steps" aria-label="Step 2 of 4">
        <span className="area-card__step" />
        <span className="area-card__step" data-current />
        <span className="area-card__step" />
        <span className="area-card__step" />
      </span>
      <Button tone="accent" size="sm">Continue</Button>
    </CardFooter>
  </Card>
);

export const AlertDefault = () => (
  <Alert icon={<InfoIcon />} title="Heads up" style={{ inlineSize: 380 }}>
    Your trial ends in 3 days.
  </Alert>
);

export const AlertTones = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "var(--area-space-12)", inlineSize: 380 }}>
    <Alert tone="success" icon={<CheckIcon />} title="Deployed" />
    <Alert tone="warning" icon={<AlertIcon />} title="Usage is at 90%" />
    <Alert tone="danger" icon={<AlertIcon />} title="Build failed" />
  </div>
);

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
    <MenuItem shortcut={<Kbd keys={["cmd", "K"]} size="small" quiet />}>
      <span className="area-menu__icon"><SearchIcon /></span>
      <span className="area-menu__text">Search</span>
    </MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "N"]} size="small" quiet />}>
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
    <MenuItem tone="danger" shortcut={<Kbd keys={["cmd", "backspace"]} size="small" quiet />}>
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
  <Button variant="outline" tone="neutral" size="sm">
    Duplicate <Kbd keys={["cmd", "D"]} size="small" quiet />
  </Button>
);

export const KbdSequence = () => (
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
    <MenuItem shortcut={<Kbd keys={["cmd", "K"]} size="small" quiet />}>
      <span className="area-menu__icon"><SearchIcon /></span>
      <span className="area-menu__text">Search</span>
    </MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "N"]} size="small" quiet />}>
      <span className="area-menu__icon"><PlusIcon /></span>
      <span className="area-menu__text">New file</span>
    </MenuItem>
    <div className="area-menu__separator" />
    <MenuItem tone="danger" shortcut={<Kbd keys={["cmd", "backspace"]} size="small" quiet />}>
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
          <Chip size="xs" swatch="var(--area-red-500)">Red</Chip>
          <Chip size="xs" selected swatch="var(--area-indigo-500)">Indigo</Chip>
          <Chip size="xs" swatch="var(--area-teal-600)">Teal</Chip>
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
