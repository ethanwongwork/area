/**
 * Settings (owner, 2026-10-30: "it should follow the chosen system, which can be updated in a settings page like cursors?
 * maybe add a profile and setting control to the bottom left of the electron ui like claude and cursor"), in Cursor's
 * layout: opened from the profile at the Sidebar's foot (or ⌘,) over the current tab, the Sidebar becomes its sections
 * under a back row and a search, the Canvas holds the section's groups of rows (a title and its description, the control
 * at the end), and there is no Inspector. Back, Esc or opening any place closes it.
 *
 *   General     your name, as the Sidebar's foot shows it
 *   Appearance  Mode; the system and theme the app is drawn in, as published (src/app-look.ts); then every Theme setting
 *               the Inspector has (owner, 2026-10-30: "the area design system theme controls (all of them) mapped to a
 *               settings page like that"), under the registry's headings, and Material, as the app's own look: shown as
 *               the followed theme sets them, and changing one stops following. Drawn by the Inspector's own rows
 *               (src/inspector-rows.tsx) in a Settings frame, so a setting is the same control in both places. The open
 *               system's exact colours (Page colour, Accent's Exact colour) stay in its Theme view: they act on that theme.
 *
 * Only settings that work are shown (product UI rule 16).
 */
import { useEffect, useState, type ReactNode } from "react";
import { Button, Input, Nav, NavGroup, NavItem, SearchField, Segmented, Select, SectionHeading, Switch } from "@area/react";
import { ArrowLeftIcon, PaletteIcon, PersonIcon } from "@area/icons";
import { MATERIAL_BUNDLES, MATERIAL_LEVERS, SETTING_GROUPS } from "@area/tokens/config";
import { GALLERY_CONTROLS } from "../gallery/controls.ts";
import { asLive } from "../systems.ts";
import { chromeOf } from "../app-look.ts";
import { CANVAS_DEFAULTS, SidebarList, useStudio, Workspace, type CanvasAxes, type Mode } from "../studio.tsx";
import { MATERIAL_DEFAULT, bundleValue, type MaterialState } from "../material.ts";
import { ROW_OF, RowFrame, SettingRow, type RowContext } from "../inspector-rows.tsx";
import { MaterialRows } from "../canvas-settings.tsx";
import { inMode } from "./theme-settings.ts";

export type SettingsSection = "general" | "appearance";
const SECTIONS: ReadonlyArray<{ id: SettingsSection; label: string; icon: ReactNode }> = [
  { id: "general", label: "General", icon: <PersonIcon /> },
  { id: "appearance", label: "Appearance", icon: <PaletteIcon /> },
];

interface Row { section: SettingsSection; group: string; label: string; description: string; control: ReactNode; disabled?: boolean }

export function SettingsPage({ section, onSection }: { section: SettingsSection; onSection: (section: SettingsSection | null) => void }) {
  const studio = useStudio();
  const [query, setQuery] = useState("");
  // Esc closes Settings, as it closes an overlay (product UI rule 5).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" && !event.defaultPrevented && !(event.target as Element | null)?.closest?.("input, textarea, select, [role=dialog]")) onSection(null); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onSection]);
  const rows = useRows();
  const needle = query.trim().toLowerCase();
  const shown = needle ? rows.filter(row => `${row.group} ${row.label} ${row.description}`.toLowerCase().includes(needle)) : rows.filter(row => row.section === section);
  const groups = [...new Set(shown.map(row => row.group))];
  return (
    <Workspace
      canvasTitle="Settings"
      nav={
        <div className="studio-takeover">
          <SidebarList>
            <Nav aria-label="Back">
              <NavItem href="#" icon={<ArrowLeftIcon />} onClick={event => { event.preventDefault(); onSection(null); }}>Back</NavItem>
            </Nav>
            <SearchField size="sm" variant="soft" fullWidth className="studio-takeover__filter" value={query} onValueChange={setQuery}
              placeholder="Search settings" aria-label="Search settings" />
          </SidebarList>
          <SidebarList>
            <Nav aria-label="Settings">
              <NavGroup>
                {SECTIONS.map(entry => (
                  <NavItem key={entry.id} href={`#settings-${entry.id}`} icon={entry.icon} current={!needle && section === entry.id}
                    onClick={event => { event.preventDefault(); setQuery(""); onSection(entry.id); }}>{entry.label}</NavItem>
                ))}
              </NavGroup>
            </Nav>
          </SidebarList>
        </div>
      }
      canvas={
        <div className="studio-settings">
          <h1 className="studio-settings__title">{needle ? `Results for “${query.trim()}”` : SECTIONS.find(entry => entry.id === section)!.label}</h1>
          {groups.length || (section === "appearance" || needle) ? groups.map(group => {
            const own = shown.filter(row => row.group === group);
            const heading = GROUPS[group];
            return (
              <section key={group} className="studio-settings__group" aria-label={heading?.title}>
                {heading?.title ? <SectionHeading className="studio-section-heading" title={heading.title} lede={heading.lede?.(studio)} /> : null}
                <div className="studio-settings__rows">
                  {own.map(row => (
                    <div key={row.label} className="studio-settings__row" data-disabled={row.disabled ? "" : undefined}>
                      <div className="studio-settings__text">
                        <span className="studio-settings__label">{row.label}</span>
                        <span className="studio-settings__description">{row.description}</span>
                      </div>
                      <div className="studio-settings__control">{row.control}</div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }) : null}
          {needle || section === "appearance" ? <ThemeGroups needle={needle} /> : null}
        </div>
      }
    />
  );
}

/** Each group's heading; the first group of a section has none. */
const GROUPS: Record<string, { title?: string; lede?: (studio: ReturnType<typeof useStudio>) => string }> = {
  profile: {},
  mode: {},
  interface: { title: "Interface", lede: () => "The app is drawn in one of your systems, as that system is published. Edit the system to change the app." },
};

function useRows(): Row[] {
  const studio = useStudio();
  const { appLook, setAppLook, systems, chrome, navigate } = studio;
  const look = chromeOf(appLook, systems, MATERIAL_DEFAULT);
  const followed = look.system ?? systems[0]!;
  const published = asLive(followed);
  return [
    { section: "general", group: "profile", label: "Name", description: "As the Sidebar's foot shows it.",
      control: <Input size="sm" variant="soft" fullWidth aria-label="Name" value={studio.profileName} onChange={event => studio.setProfileName(event.currentTarget.value)} /> },
    { section: "appearance", group: "mode", label: "Mode", description: "Light, dark, or as your Mac is set.",
      control: <Segmented size="sm" fullWidth aria-label="Mode" value={studio.mode} onValueChange={value => studio.setMode(value as Mode)}
        items={[{ value: "system", label: "System" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} /> },
    { section: "appearance", group: "interface", label: "Follow a system", description: "Off: give the app settings of its own, below.",
      control: <Switch aria-label="Follow a system" checked={appLook.follow}
        onChange={() => setAppLook(appLook.follow ? { ...appLook, follow: false, own: { ...chrome.canvas } } : { ...appLook, follow: true })} /> },
    { section: "appearance", group: "interface", label: "System", description: "Each project picks its own; this one draws the app.", disabled: !appLook.follow,
      control: <Select size="sm" variant="soft" fullWidth aria-label="System" value={followed.id} disabled={!appLook.follow}
        onChange={event => setAppLook({ ...appLook, system: event.currentTarget.value, theme: undefined })}>
        {systems.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
      </Select> },
    { section: "appearance", group: "interface", label: "Theme", description: `One of ${followed.name}'s published themes.`, disabled: !appLook.follow,
      control: <Select size="sm" variant="soft" fullWidth aria-label="Theme" value={look.theme ?? ""} disabled={!appLook.follow}
        onChange={event => setAppLook({ ...appLook, theme: event.currentTarget.value })}>
        {published.themes.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
      </Select> },
    { section: "appearance", group: "interface", label: `Edit ${followed.name}`, description: "Change its theme in the Library and publish it; the app follows.", disabled: !appLook.follow,
      control: <Button size="sm" variant="soft" tone="neutral" disabled={!appLook.follow} onClick={() => navigate({ page: "themes", system: followed.id })}>Open {followed.name}</Button> },
  ];
}

/**
 * Every Theme setting, as the app's own look: the registry's groups and their settings in the Inspector's order (Page,
 * Accent, Emphasis, Size, Shape, Stroke, Shadow, States, Effects), then Material. Light's and dark's pairs show in the mode
 * the app is in, as in the Inspector. A row shows what the app is drawn in; changing it gives the app that look as its own,
 * apart from the system (Follow a system off).
 */
function ThemeGroups({ needle }: { needle: string }) {
  const studio = useStudio();
  const { appLook, setAppLook, chrome, theme } = studio;
  const own = (canvas: Record<string, string>, material: MaterialState) => setAppLook({ ...appLook, follow: false, own: canvas, material });
  const context: RowContext = {
    values: chrome.canvas, mode: theme, exact: false, layout: () => "list",
    set: changes => own({ ...chrome.canvas, ...changes }, chrome.material),
  };
  const matches = (words: string) => !needle || words.toLowerCase().includes(needle);
  const groups = SETTING_GROUPS.map(group => {
    const axes = (group.settings as readonly string[]).filter(axis => axis in CANVAS_DEFAULTS && inMode(axis, theme)).filter(axis => {
      const control = GALLERY_CONTROLS.find(entry => entry.axis === axis);
      return matches(`${group.heading} ${control?.label ?? ""} ${control?.hint ?? ""} ${ROW_OF[axis] ?? ""}`);
    });
    const drawn = new Set<string>();
    // A combined row (Greys, Accent) draws once, at the first setting it stands for.
    const rows = axes.filter(axis => { const row = ROW_OF[axis]; if (!row) return true; if (drawn.has(row)) return false; drawn.add(row); return true; });
    return { heading: group.heading, rows };
  }).filter(group => group.rows.length);
  const material = matches(`material ${MATERIAL_LEVERS.map(lever => lever.label).join(" ")}`);
  const followed = chromeOf(appLook, studio.systems, MATERIAL_DEFAULT).system;
  const lede = appLook.follow && followed ? `Shown as ${followed.name} sets them. Changing one gives the app its own look, apart from the system.` : "The app's own look, apart from any system.";
  return (
    <RowFrame.Provider value="settings">
      {groups.map((group, at) => (
        <section key={group.heading} className="studio-settings__group" aria-label={group.heading}>
          <SectionHeading className="studio-section-heading" title={group.heading} lede={at === 0 && !needle ? lede : undefined} />
          <div className="studio-settings__rows">
            {group.rows.map(axis => <SettingRow key={axis} axis={axis} context={context} />)}
          </div>
        </section>
      ))}
      {material ? (
        <section className="studio-settings__group" aria-label="Material">
          <SectionHeading className="studio-section-heading" title="Material" />
          <div className="studio-settings__rows">
            <MaterialRows canvas={chrome.canvas} material={chrome.material}
              onBundle={bundle => own({ ...chrome.canvas, ...(MATERIAL_BUNDLES[bundle]?.layers ?? {}) }, { bundle, overrides: {} })}
              onValue={(key, value) => {
                const { [key]: _, ...rest } = chrome.material.overrides;
                own(chrome.canvas, { ...chrome.material, overrides: value === bundleValue(chrome.material.bundle, key) ? rest : { ...rest, [key]: value } });
              }} />
          </div>
        </section>
      ) : null}
      {needle && !groups.length && !material ? <p className="studio-muted">No theme setting matches “{needle}”.</p> : null}
    </RowFrame.Provider>
  );
}
