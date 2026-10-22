/**
 * Settings: an Appearance settings screen built only from Area (owner, 2026-10-21, after Untitled UI's Appearance page:
 * a label and its description beside each control, theme thumbnails, swatches, a switch, a select, then Cancel and
 * Save). The Theme setup's stage draws it as its desktop sample, so fields, choices, cards and edges all show a pick.
 * People: David Tee.
 */
import {
  Avatar, Button, ColorSwatchPicker, Nav, NavGroup, NavItem, RadioGroup, Radio, SectionHeading, Select, Separator, Switch,
} from "@area/react";
import { BellIcon, HomeIcon, PaletteIcon, PersonIcon, SettingsIcon } from "@area/icons";
import type { ReactNode } from "react";

const SWATCHES = [
  { value: "#171717", label: "Black" }, { value: "#7C3AED", label: "Purple" }, { value: "#4F46E5", label: "Indigo" },
  { value: "#2563EB", label: "Blue" }, { value: "#0EA5E9", label: "Sky" }, { value: "#0891B2", label: "Cyan" }, { value: "#16A34A", label: "Green" },
];

/** A theme's thumbnail: a tiny window in that theme's own ground (a sidebar, a header, rows). */
function ThemeThumb({ theme }: { theme: "light" | "dark" | "system" }) {
  const half = (mode: "light" | "dark") => (
    <span className="ex-thumbui" data-area-theme={mode}>
      <span className="ex-thumbui__side"><i /><i /><i /><i /></span>
      <span className="ex-thumbui__main"><b /><i /><i /></span>
    </span>
  );
  return theme === "system"
    ? <span className="ex-thumbui-pair" aria-hidden="true">{half("light")}{half("dark")}</span>
    : <span className="ex-thumbui-pair" aria-hidden="true">{half(theme)}</span>;
}

function Row({ label, description, children }: { label: string; description: string; children: ReactNode }) {
  return (
    <div className="ex-set-row">
      <div className="ex-set-row__label"><strong>{label}</strong><span>{description}</span></div>
      <div className="ex-set-row__control">{children}</div>
    </div>
  );
}

export function SettingsScreen() {
  return (
    <div className="ex-app ex-app--settings">
      <aside className="ex-side">
        <div className="ex-brand"><Avatar size="sm" fallback="DT" alt="David Tee" /> David Tee</div>
        <Nav aria-label="Settings">
          <NavGroup>
            <NavItem href="#home" icon={<HomeIcon />}>Home</NavItem>
            <NavItem href="#profile" icon={<PersonIcon />}>Profile</NavItem>
            <NavItem href="#appearance" current icon={<PaletteIcon />}>Appearance</NavItem>
            <NavItem href="#notifications" icon={<BellIcon />}>Notifications</NavItem>
            <NavItem href="#general" icon={<SettingsIcon />}>General</NavItem>
          </NavGroup>
        </Nav>
      </aside>
      <div className="ex-body">
        <main className="ex-main ex-set">
          <SectionHeading level={2} title="Appearance" lede="Change how the app looks and feels on this device." />
          <Separator />
          <Row label="Brand colour" description="Select or customise your brand colour.">
            <ColorSwatchPicker label="Brand colour" size="md" layout="row" defaultValue="#2563EB" items={SWATCHES} />
          </Row>
          <Separator />
          <Row label="Interface theme" description="Select or customise your interface theme.">
            {/* Each theme a thumbnail over its radio (Radio's visual slot holds an icon, not a picture). */}
            <RadioGroup label="Interface theme" name="ex-theme" defaultValue="system" orientation="horizontal">
              {(["system", "light", "dark"] as const).map(theme => (
                <div key={theme} className="ex-theme-option">
                  <ThemeThumb theme={theme} />
                  <Radio value={theme} label={theme === "system" ? "System preference" : theme === "light" ? "Light" : "Dark"} />
                </div>
              ))}
            </RadioGroup>
          </Row>
          <Separator />
          <Row label="Transparent sidebar" description="Make the desktop sidebar transparent.">
            <Switch aria-label="Transparent sidebar" defaultChecked />
          </Row>
          <Separator />
          <Row label="Sidebar feature" description="What shows in the desktop sidebar.">
            <Select aria-label="Sidebar feature" defaultValue="recent"><option value="recent">Recent changes</option><option value="pinned">Pinned</option></Select>
          </Row>
          <Separator />
          <Row label="Tables view" description="How tables are displayed in the app.">
            <RadioGroup label="Tables view" name="ex-tables" defaultValue="default" orientation="horizontal">
              <Radio variant="card" value="default" label="Default" />
              <Radio variant="card" value="compact" label="Compact" />
            </RadioGroup>
          </Row>
          <div className="ex-set-foot">
            <Button variant="outline" tone="neutral">Cancel</Button>
            <Button>Save changes</Button>
          </div>
        </main>
      </div>
    </div>
  );
}
