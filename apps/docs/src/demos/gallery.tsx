/** Real, compact specimens for the component gallery. Framing never rescales controls. */
import { Alert, Avatar, Badge, Button, Card, CardDescription, CardFooter, CardTitle, Checkbox, Chip, ChipGroup, Code, CodeBlock, Dialog, Field, Input, Kbd, Menu, MenuItem, Nav, NavItem, Panel, PanelSection, Popover, Progress, Radio, Segmented, Select, Separator, Skeleton, Slider, Spinner, Switch, Table, Tabs, Textarea, Toast, Token, Tooltip } from "@area/react";
import { CheckIcon, InfoIcon, SearchIcon } from "../icons.tsx";

export const GalleryAlert = () => (
  <div className="docs-gallery-stack">
    <Alert icon={<InfoIcon />} title="A little heads up">Your trial ends in 3 days.</Alert>
    <Alert tone="success" icon={<CheckIcon />} title="Changes saved" />
  </div>
);

export const GalleryAvatar = () => (
  <div className="docs-gallery-row">
    <Avatar size="sm" fallback="EW" alt="Ethan Wong" />
    <Avatar fallback="AL" alt="Alex Lee" />
    <Avatar size="lg" fallback="MK" alt="Morgan Kim" />
  </div>
);

export const GalleryBadge = () => (
  <div className="docs-gallery-row">
    <Badge>Draft</Badge><Badge tone="accent">New</Badge>
    <Badge tone="success" dot>Live</Badge><Badge variant="outline">Review</Badge>
  </div>
);

export const GalleryButton = () => (
  <div className="docs-gallery-stack">
    <div className="docs-gallery-row"><Button>Continue</Button><Button variant="soft">Save</Button></div>
    <div className="docs-gallery-row"><Button variant="outline">Preview</Button><Button variant="ghost">Cancel</Button></div>
  </div>
);

export const GalleryCard = () => (
  <Card style={{ inlineSize: "100%" }}>
    <CardTitle>Project notes</CardTitle>
    <CardDescription>A shared place for ideas.</CardDescription>
    <CardFooter><Button size="sm" variant="outline">Open project</Button></CardFooter>
  </Card>
);

export const GalleryCheckbox = () => (
  <div className="docs-gallery-stack">
    <Checkbox label="Email updates" defaultChecked />
    <Checkbox label="Product news" />
    <Checkbox label="Weekly digest" disabled />
  </div>
);

export const GalleryChip = () => (
  <ChipGroup><Chip selected>All</Chip><Chip>Design</Chip><Chip>Product</Chip></ChipGroup>
);

export const GalleryCode = () => <Code>npm install @area/react</Code>;

export const GalleryCodeBlock = () => <CodeBlock code={'import { Button }\n  from "@area/react";'} style={{ inlineSize: "100%" }} />;

export const GalleryDialog = () => (
  <Dialog role="group" aria-modal={undefined} title="Save changes?" description="Keep your latest edits."
    footer={<><Button size="sm" variant="ghost">Cancel</Button><Button size="sm">Save</Button></>}
    style={{ inlineSize: "100%" }} />
);

export const GalleryField = () => (
  <Field label="Email address" htmlFor="gallery-email" description="Use your work email.">
    <Input id="gallery-email" type="email" placeholder="you@example.com" />
  </Field>
);

export const GalleryInput = () => (
  <div className="docs-gallery-stack">
    <Input aria-label="Search the gallery specimen" icon={<SearchIcon />} placeholder="Search anything" />
    <Input aria-label="Amount specimen" prefix="$" suffix="USD" placeholder="0.00" />
  </div>
);

export const GalleryKbd = () => (
  <div className="docs-gallery-row"><Kbd keys={["cmd", "K"]} /><Kbd keys={["shift", "enter"]} /><Kbd keys={["escape"]} /></div>
);

export const GalleryMenu = () => (
  <Menu><MenuItem shortcut={<Kbd keys={["cmd", "K"]} quiet />}>Search</MenuItem><MenuItem>New document</MenuItem><MenuItem tone="danger">Delete</MenuItem></Menu>
);

export const GalleryNav = () => (
  <Nav aria-label="Gallery navigation specimen" style={{ inlineSize: "100%" }}>
    <NavItem href="#gallery-nav" current>Overview</NavItem><NavItem href="#gallery-nav">Activity</NavItem><NavItem href="#gallery-nav">Settings</NavItem>
  </Nav>
);

export const GalleryPanel = () => (
  <Panel size="sm" title="Appearance" style={{ inlineSize: "100%" }}>
    <PanelSection>
      <Field inline label="Style" htmlFor="gallery-panel-style"><Select size="sm" id="gallery-panel-style" defaultValue="soft"><option value="soft">Soft</option><option value="outline">Outline</option></Select></Field>
      <Field inline label="Visible" htmlFor="gallery-panel-visible"><Switch size="sm" id="gallery-panel-visible" defaultChecked /></Field>
    </PanelSection>
  </Panel>
);

export const GalleryPopover = () => (
  <Popover style={{ inlineSize: "100%", minInlineSize: 0 }}><div className="docs-gallery-stack"><Field label="Project name" htmlFor="gallery-project"><Input id="gallery-project" defaultValue="Untitled" /></Field><Button variant="outline" size="sm">Create project</Button></div></Popover>
);

export const GalleryProgress = () => (
  <div className="docs-gallery-stack"><Progress value={62} label="Upload progress" /><Progress label="Loading" /></div>
);

export const GalleryRadio = () => (
  <div className="docs-gallery-stack"><Radio name="gallery-plan" value="starter" label="Starter" defaultChecked /><Radio name="gallery-plan" value="pro" label="Pro" /><Radio name="gallery-plan" value="team" label="Team" /></div>
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
  <div className="docs-gallery-stack"><Skeleton shape="text" style={{ inlineSize: "60%" }} /><Skeleton shape="text" /><Skeleton shape="text" style={{ inlineSize: "80%" }} /></div>
);

export const GallerySlider = () => <Slider aria-label="Gallery opacity specimen" min={0} max={100} defaultValue={60} />;

export const GallerySpinner = () => (
  <div className="docs-gallery-row"><Spinner size="sm" /><Spinner /><Spinner size="lg" /></div>
);

export const GallerySwitch = () => (
  <div className="docs-gallery-stack"><Switch label="Notifications" defaultChecked /><Switch label="Do not disturb" /></div>
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
  <div className="docs-gallery-stack"><Token swatch="var(--area-accent-solid)">--area-accent-solid</Token><Token>--area-space-16</Token></div>
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
