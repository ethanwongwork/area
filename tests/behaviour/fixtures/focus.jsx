// Focus ring fixture: the controls the focus suite rings, in Tab order, inside one Theme scope read from the query
// (?ring=hug|gap|halo|inset|bold&theme=light|dark&selection=neutral|accent&contrast=more). The scope paints the page
// ground, so a ring off its control shows the ground it sits on.
import { createRoot } from "react-dom/client";
import { Theme, Button, Input, Checkbox, Tabs, Menu, MenuItem } from "@area/react";
import "@area/styles/area.css";

const q = new URLSearchParams(location.search);
const value = { "focus-ring": q.get("ring") || "hug", theme: q.get("theme") || "light", selection: q.get("selection") || "neutral" };

function App() {
  return <Theme value={value} data-area-contrast={q.get("contrast") || undefined}
    style={{ background: "var(--area-bg-page)", padding: 32, display: "flex", flexDirection: "column", gap: 24, alignItems: "flex-start" }}>
    <div style={{ display: "flex", gap: 16 }}>
      <Button id="solid" variant="solid">Save</Button>
      <Button id="soft" variant="soft">Save</Button>
      <Button id="outline" variant="outline">Save</Button>
      <Button id="ghost" variant="ghost">Save</Button>
      <Button id="danger" variant="solid" tone="danger">Delete</Button>
    </div>
    <Input id="input" aria-label="Name" placeholder="Name" />
    <div style={{ display: "flex", gap: 16 }}>
      <Checkbox id="checkbox" label="Notify me" />
      <Checkbox id="checked" label="Notify me" defaultChecked />
    </div>
    <Tabs id="tabs" items={[{ value: "a", label: "Overview" }, { value: "b", label: "Activity" }]} defaultValue="a" />
    <Menu trigger={<Button id="trigger">Options</Button>}>
      <MenuItem>Rename</MenuItem>
      <MenuItem>Duplicate</MenuItem>
    </Menu>
  </Theme>;
}

createRoot(document.getElementById("root")).render(<App />);
requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
