// Hit-target fixture: interactive families at their smallest size, at Compact (type 12, density 28), each in
// <section data-family="<slug>"> with room around it so a neighbour never lends its own target.
import { createRoot } from "react-dom/client";
import {
  Theme, Button, InputAction, Input, NumberField, Chip, Nav, NavItem, SplitButton, MenuItem, Segmented, ToggleGroup, ToggleGroupItem,
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbEllipsis, BreadcrumbSeparator, BreadcrumbPage, ColorSwatchPicker,
  Step, Tag, Badge, Toggletip, Checkbox, Switch, Radio, RadioGroup, Tabs, Pagination, Slider, TreeView, Calendar, Toast,
} from "@area/react";
import "@area/styles/area.css";

const icon = <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" stroke="currentColor" /></svg>;
const SWATCHES = [{ value: "#e5484d", label: "Red" }, { value: "#3e63dd", label: "Blue" }, { value: "#30a46c", label: "Green" }];
const FAMILIES = {
  "button": <Button size="sm" iconOnly icon={icon} aria-label="Add" />,
  "input": <Input size="sm" aria-label="Find" trailingAction={<InputAction icon={icon} tooltip="Clear" />} />,
  "number-field": <NumberField size="sm" aria-label="Width" defaultValue={4} steppers />,
  "chip": <Chip size="sm" onDismiss={() => {}} dismissLabel="Remove Design">Design</Chip>,
  "nav": <Nav aria-label="Pages"><NavItem href="#a" actions={<Button size="sm" variant="ghost" iconOnly icon={icon} aria-label="Add page" />} revealActions={false}>Overview</NavItem></Nav>,
  "split-button": <SplitButton size="sm" iconOnly icon={icon} menuLabel="More" menu={<MenuItem>Option</MenuItem>}>Add</SplitButton>,
  "segmented": <Segmented size="sm" label="View" items={[{ value: "a", label: "Day" }, { value: "b", label: "Week" }, { value: "c", label: "Month" }]} defaultValue="a" />,
  "toggle-group": <ToggleGroup size="sm" aria-label="Style"><ToggleGroupItem value="b">Bold</ToggleGroupItem><ToggleGroupItem value="i">Italic</ToggleGroupItem></ToggleGroup>,
  "breadcrumb": <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#h">Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbEllipsis items={[{ label: "Projects", href: "#p" }]} /></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Page</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>,
  "color-swatch-picker": <ColorSwatchPicker size="sm" label="Color" items={SWATCHES} defaultValue="#3e63dd" />,
  "step": <Step verb="Read" detail="two files">Details</Step>,
  "tag": <Tag size="md" onDismiss={() => {}} dismissLabel="Remove Docs">Docs</Tag>,
  "badge": <Badge size="sm" onDismiss={() => {}} dismissLabel="Remove New">New</Badge>,
  "toggletip": <Toggletip size="sm" content="More about this" label="About" />,
  "checkbox": <Checkbox size="md" label="Checkbox" />,
  "switch": <Switch size="sm" label="Switch" />,
  "radio": <RadioGroup label="Radio" name="r"><Radio size="md" value="a" label="One" /><Radio size="md" value="b" label="Two" /></RadioGroup>,
  "tabs": <Tabs size="sm" items={[{ value: "a", label: "One" }, { value: "b", label: "Two" }]} defaultValue="a" />,
  "pagination": <Pagination size="sm" pageCount={5} defaultPage={2} />,
  "slider": <div style={{ inlineSize: 200 }}><Slider size="sm" aria-label="Volume" defaultValue={40} /></div>,
  "tree-view": <TreeView size="sm" aria-label="Files" items={[{ id: "a", label: "Folder", children: [{ id: "b", label: "File" }] }]} />,
  "calendar": <Calendar aria-label="Calendar" today="2026-11-11" />,
  "toast": <Toast title="Saved" onDismiss={() => {}}>The page was saved.</Toast>,
};

function App() {
  return <Theme value={{ ui: "compact" }}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 48, padding: 24, inlineSize: 1100 }}>
      {Object.entries(FAMILIES).map(([slug, el]) => <section key={slug} data-family={slug} style={{ padding: 24 }}>{el}</section>)}
    </div>
  </Theme>;
}

createRoot(document.getElementById("root")).render(<App />);
requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
