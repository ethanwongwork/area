import { Alert, Avatar, Badge, Button, Card, CardDescription, CardFooter, CardTitle, Dialog, Kbd, Menu, MenuItem, Popover, Progress, Separator, Skeleton, Spinner, Table, Tabs, Toast, Token, Tooltip } from "@area/react";
import { AlertIcon, CheckIcon, InfoIcon } from "../icons.tsx";

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

export const KbdSequence = () => (
  <>
    <Kbd keys={["cmd", "shift", "P"]} />
    <Kbd keys={["ctrl", "shift", "M"]} />
    <Kbd keys={["escape"]} />
    <Kbd keys={["enter"]} />
  </>
);

export const MenuWithShortcuts = () => (
  <Menu>
    <MenuItem shortcut={<Kbd keys={["cmd", "K"]} quiet />}>Search</MenuItem>
    <MenuItem shortcut={<Kbd keys={["cmd", "N"]} quiet />}>New file</MenuItem>
    <div className="area-menu__separator" />
    <MenuItem tone="danger" shortcut={<Kbd keys={["cmd", "backspace"]} quiet />}>
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
