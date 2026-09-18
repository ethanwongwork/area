/** Real, compact specimens for the component gallery. Framing never rescales controls. */
import { Alert, Avatar, Badge, Button, Card, CardAction, CardDescription, CardFooter, CardMedia, CardTitle, Checkbox, Chip, Code, CodeBlock, Dialog, Field, Input, Kbd, Menu, MenuItem, Nav, NavItem, Panel, PanelSection, Popover, Progress, Radio, Segmented, Select, Separator, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Token, Tooltip } from "@area/react";
import { ArrowIcon, CheckIcon, DismissIcon, DotsFourIcon, InfoIcon, PlusIcon, SearchIcon, TokenIcon } from "../icons.tsx";

export const GalleryAlert = () => (
  <Alert icon={<InfoIcon />} title="A little heads up">Your trial ends in 3 days.</Alert>
);

export const GalleryAvatar = () => (
  <Avatar fallback="AL" alt="Alex Lee" />
);

export const GalleryBadge = () => (
  <Badge tone="success" dot>Live</Badge>
);

export const GalleryButton = () => (
  <Button>Submit <Kbd keys={["cmd", "enter"]} size="small" quiet /></Button>
);

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

export const GalleryInput = () => (
  <Input aria-label="Search the gallery specimen" leadingIcon={<SearchIcon />} placeholder="Search anything" />
);

export const GalleryKbd = () => (
  <Kbd keys={["cmd", "K"]} />
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
  <Radio name="gallery-plan" value="starter" label="Starter" defaultChecked />
);

export const GallerySegmented = () => (
  <Segmented label="Gallery view specimen" value="design" options={[{ value: "design", label: "Design" }, { value: "preview", label: "Preview" }]} />
);

export const GallerySelect = () => (
  <Select aria-label="Gallery status specimen" defaultValue="draft"><option value="draft">Draft</option><option value="review">In review</option><option value="live">Published</option></Select>
);

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

export const GalleryTable = () => (
  <Table><thead><tr><th>Name</th><th>Status</th></tr></thead><tbody><tr><td>Website</td><td><Badge tone="success" dot>Live</Badge></td></tr><tr><td>Brand kit</td><td><Badge>Draft</Badge></td></tr></tbody></Table>
);

export const GalleryTabs = () => (
  <Tabs value="gallery-account" tabs={[{ id: "gallery-account", label: "Account" }, { id: "gallery-security", label: "Security" }]} style={{ inlineSize: "100%" }}><span className="docs-gallery-caption">Manage your account details.</span></Tabs>
);

export const GalleryTextarea = () => <Textarea aria-label="Gallery message specimen" placeholder="Leave a note…" rows={3} />;

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
