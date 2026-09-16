import { Alert, Avatar, Badge, Button, Card, CardDescription, CardFooter, CardTitle, Checkbox, Chip, ChipGroup, Dialog, Field, Input, Kbd, Label, Menu, MenuItem, Panel, PanelSection, PanelStack, Popover, Progress, Segmented, Select, Separator, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Token, Tooltip } from "@area/react";
import { AlertIcon, AlignBottomIcon, AlignMiddleIcon, AlignTopIcon, CheckIcon, DismissIcon, InfoIcon } from "../icons.tsx";

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
  <Card style={{ inlineSize: 320 }}>
    <CardTitle>Deploy to production</CardTitle>
    <CardDescription>This will make your changes live for everyone.</CardDescription>
    <CardFooter>
      <Button variant="ghost" tone="neutral" size="sm">
        Cancel
      </Button>
      <Button size="sm">Deploy</Button>
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
    <MenuItem shortcut="⌘K">Search</MenuItem>
    <MenuItem shortcut="⌘N">New file</MenuItem>
    <div className="area-menu__separator" />
    <MenuItem tone="danger">Delete</MenuItem>
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
    <MenuItem shortcut={<Kbd keys={["cmd", "K"]} size="small" quiet />}>Search</MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "N"]} size="small" quiet />}>New file</MenuItem>
    <div className="area-menu__separator" />
    <MenuItem tone="danger" shortcut={<Kbd keys={["cmd", "backspace"]} size="small" quiet />}>
      Delete
    </MenuItem>
  </Menu>
);

export const TokenDefault = () => <Token>--area-space-16</Token>;

export const TokenSwatch = () => (
  <>
    <Token swatch="var(--area-accent-solid)">--area-accent-solid</Token>
    <Token swatch="var(--area-danger-solid)">--area-danger-solid</Token>
  </>
);

export const TokenInProse = () => (
  <div style={{ inlineSize: 380 }}>
    Set <Token>--area-radius-control</Token> to change how rounded a control is. It reads the
    same here as it does in a table.
  </div>
);

export const TokenSubtle = () => (
  <>
    <Token>--area-blue-500</Token>
    <Token subtle>--area-accent-solid</Token>
  </>
);

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
      <Button variant="ghost" tone="neutral" size="xs" iconOnly aria-label="Close" icon={<DismissIcon />} />
    }
    footer={<Button variant="soft" tone="neutral" size="sm" fullWidth>Add Section</Button>}
    style={{ inlineSize: 320, blockSize: 560 }}
  >
    <PanelSection heading="Trigger">
      <Field inline label="Trigger" htmlFor="panel-trigger">
        <Select size="sm" id="panel-trigger" defaultValue="view">
          <option value="view">Section in View</option>
          <option value="click">On Click</option>
          <option value="load">On Load</option>
        </Select>
      </Field>
      <Field inline label="Viewport">
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
      <Field inline label="Replay">
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
      <Field inline label="Enabled" htmlFor="panel-enabled">
        <Switch size="sm" id="panel-enabled" defaultChecked />
      </Field>
    </PanelSection>

    <PanelSection heading="Style">
      <Field inline label="Opacity">
        <Slider size="sm" min={0} max={100} defaultValue={80} readout="80" />
      </Field>
      <Field inline label="Radius" htmlFor="panel-radius">
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
      <Field inline label="Loop" htmlFor="panel-loop">
        <Checkbox id="panel-loop" defaultChecked />
      </Field>
      <Field inline label="Easing" htmlFor="panel-ease">
        <Select size="sm" id="panel-ease" defaultValue="out">
          <option value="out">Ease out</option>
          <option value="linear">Linear</option>
        </Select>
      </Field>
    </PanelSection>
  </Panel>
);
