/**
 * Settings (owner, 2026-10-30: "it should follow the chosen system, which can be updated in a settings page like cursors?
 * maybe add a profile and setting control to the bottom left of the electron ui like claude and cursor"), in Cursor's
 * layout: opened from the profile at the Sidebar's foot (or ⌘,) over the current tab, the Sidebar becomes its sections
 * under a back row and a search, the Canvas holds the section's groups of rows (a title and its description, the control
 * at the end), and there is no Inspector. Back, Esc or opening any place closes it.
 *
 * Appearance and Theme are apart (owner, 2026-10-30: "theme is theme and appearance is for the actual electron ui? both
 * would show the same level of customization"; preview https://claude.ai/artifact/Hrzat6VNUQ2C9sHcLZ6ZBp):
 *
 *   General     your name, as the Sidebar's foot shows it
 *   Appearance  the app's own look: Mode, then what the app is drawn in, a system's theme as published (src/app-look.ts)
 *               or a look of its own, which then shows every Theme setting and Material, apart from any system
 *   Theme       the open system's theme, as its Inspector edits it: which system and theme, Live or its unpublished
 *               changes and Publish (src/publish.tsx), then every Theme setting and Material, the exact colours included.
 *               A project's tab shows its system as published, so Theme there opens the system's own tab
 *
 * Both draw every setting with the Inspector's own rows (src/inspector-rows.tsx) in a Settings frame, so a setting is the
 * same control in all three places. Mode, Density and Corner are pictures (Radio's preview cards, each choice drawn in its
 * own scope by src/choice-visuals.tsx); the rest are plain controls. Only settings that work are shown (product UI rule 16).
 *
 * Theme has a live preview beside its rows (owner, 2026-10-30: "add a screen to the right of the theme canvas in settings to
 * preview all the changes live"): a product screen drawn in the theme being edited, in the mode the rows edit, held in view
 * while the rows scroll; on a narrow Canvas it sits above them.
 */
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Badge, Button, Input, Nav, NavGroup, NavItem, Radio, RadioGroup, SearchField, Segmented, Select, SectionHeading } from "@area/react";
import { ArrowLeftIcon, ContrastIcon, PaletteIcon, SettingsIcon } from "@area/icons";
import { MATERIAL_BUNDLES, MATERIAL_LEVERS, SETTING_GROUPS } from "@area/tokens/config";
import { GALLERY_CONTROLS } from "../gallery/controls.ts";
import { activeTheme, asLive, liveOf, versionName, AREA_ID } from "../systems.ts";
import { chromeOf } from "../app-look.ts";
import { tabKind } from "../places.ts";
import { CANVAS_DEFAULTS, canvasAttributes, SidebarList, useStudio, Workspace, type CanvasAxes, type Mode } from "../studio.tsx";
import { MATERIAL_DEFAULT, bundleValue, type MaterialState } from "../material.ts";
import { ResetButton, resetOf, ROW_OF, RowFrame, SettingRow, type Reset, type RowContext } from "../inspector-rows.tsx";
import { ScreenFigure, SCREENS, type ScreenId } from "../setup-screen.tsx";
import { readStored, writeStored } from "../storage.ts";
import { MaterialRows } from "../canvas-settings.tsx";
import { ChoicePreview, ratioOf } from "../choice-visuals.tsx";
import { hasColours } from "../colours.ts";
import { useBrandSheet } from "../brand.ts";
import { PublishDialog } from "../publish.tsx";
import { brandStyle } from "../brand.ts";
import { inMode } from "./theme-settings.ts";

export type SettingsSection = "general" | "appearance" | "theme";
// Cursor's icons for the same sections (its settings nav, read from the bundle 2026-10-30): General the gear, Appearance
// light and dark (its color-mode), and a theme the palette.
const SECTIONS: ReadonlyArray<{ id: SettingsSection; label: string; icon: ReactNode }> = [
  { id: "general", label: "General", icon: <SettingsIcon /> },
  { id: "appearance", label: "Appearance", icon: <ContrastIcon /> },
  { id: "theme", label: "Theme", icon: <PaletteIcon /> },
];

interface Row { section: SettingsSection; group: string; label: string; description: string; control: ReactNode; wide?: boolean }

export function SettingsPage({ section, onSection }: { section: SettingsSection; onSection: (section: SettingsSection | null) => void }) {
  const studio = useStudio();
  const [query, setQuery] = useState("");
  // Esc closes Settings, as it closes an overlay (product UI rule 5).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" && !event.defaultPrevented && !(event.target as Element | null)?.closest?.("input, textarea, select, [role=dialog]")) onSection(null); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onSection]);
  const rows = useRows(onSection);
  const needle = query.trim().toLowerCase();
  const shown = needle ? rows.filter(row => `${row.group} ${row.label} ${row.description}`.toLowerCase().includes(needle)) : rows.filter(row => row.section === section);
  const groups = [...new Set(shown.map(row => row.group))];
  const appLook = useAppLook();
  const themeLook = useThemeLook();
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
      canvas={(rows => !needle && section === "theme" && themeLook
        ? <div className="studio-settings-host"><div className="studio-settings-split">{rows}<ThemePreview /></div></div>
        : rows)(
        <div className="studio-settings">
          {needle ? <h1 className="studio-settings__title">Results for “{query.trim()}”</h1> : section === "theme" ? <ThemeTitle /> : (
            <h1 className="studio-settings__title">{SECTIONS.find(entry => entry.id === section)!.label}</h1>
          )}
          {groups.map(group => {
            const heading = GROUPS[group];
            return (
              <section key={group} className="studio-settings__group" aria-label={heading?.title}>
                {heading?.title ? <SectionHeading className="studio-section-heading" title={needle ? `${SECTION_NAME[heading.section]} › ${heading.title}` : heading.title} lede={needle ? undefined : heading.lede} /> : null}
                <div className="studio-settings__rows">
                  {shown.filter(row => row.group === group).map(row => (
                    <SettingsRow key={row.label} label={row.label} description={row.description} wide={row.wide}>{row.control}</SettingsRow>
                  ))}
                </div>
              </section>
            );
          })}
          {appLook && (needle || section === "appearance") ? <ThemeGroups look={appLook} needle={needle} prefix={needle ? "Appearance" : undefined} /> : null}
          {themeLook && (needle || section === "theme") ? <ThemeGroups look={themeLook} needle={needle} prefix={needle ? "Theme" : undefined} /> : null}
        </div>
      )}
    />
  );
}

const SECTION_NAME: Record<SettingsSection, string> = { general: "General", appearance: "Appearance", theme: "Theme" };
/** Each group's heading; the first group of a section has none. */
const GROUPS: Record<string, { section: SettingsSection; title?: string; lede?: string }> = {
  profile: { section: "general" },
  mode: { section: "appearance" },
  look: { section: "appearance", title: "The app's look", lede: "The app is drawn in one of your systems as it is published, or in a look of its own." },
  editing: { section: "theme" },
};

/** One row: its name over a one-line description, the control at the end; a wide row (pictures) takes the line under them. */
function SettingsRow({ label, description, wide, reset, children }: { label: string; description?: string; wide?: boolean; reset?: Reset; children: ReactNode }) {
  return (
    <div className="studio-settings__row" data-wide={wide ? "" : undefined} data-setting={reset?.setting}>
      <div className="studio-settings__text">
        <span className="studio-settings__name"><span className="studio-settings__label">{label}</span>{reset ? <ResetButton reset={reset} name={label} /> : null}</span>
        {description ? <span className="studio-settings__description">{description}</span> : null}
      </div>
      <div className="studio-settings__control">{children}</div>
    </div>
  );
}

/** Theme's title, with where the open system stands: Live, or its unpublished changes and Publish (src/publish.tsx). */
function ThemeTitle() {
  const { workingSystem, changes, place } = useStudio();
  const [publishing, setPublishing] = useState(false);
  const editable = tabKind(place) !== "project";
  return (
    <div className="studio-settings__head">
      <h1 className="studio-settings__title">Theme</h1>
      {editable ? (
        <div className="studio-settings__actions">
          {changes.length
            ? <Badge size="sm" variant="soft" tone="warning">{changes.length} unpublished {changes.length === 1 ? "change" : "changes"}</Badge>
            : <Badge size="sm" variant="soft" tone="success">Live</Badge>}
          <Button size="sm" disabled={!changes.length} onClick={() => setPublishing(true)}>Publish</Button>
        </div>
      ) : null}
      {publishing ? <PublishDialog onClose={() => setPublishing(false)} /> : null}
    </div>
  );
}

/** A setting's value as the Inspector names it, without the default's mark ("13", "Compact", "10px"). */
const said = (axis: string, value: string) => (GALLERY_CONTROLS.find(entry => entry.axis === axis)?.items.find(item => item.value === value)?.label ?? value).replace(/ \(Default\)$/, "");

function useRows(onSection: (section: SettingsSection | null) => void): Row[] {
  const studio = useStudio();
  const { appLook, setAppLook, systems, chrome, navigate, workingSystem, place } = studio;
  const look = chromeOf(appLook, systems, MATERIAL_DEFAULT);
  const followed = look.system ?? systems[0]!;
  const published = asLive(followed);
  // Theme edits the open system; another system opens in its own tab under Settings, which stays on Theme.
  const editSystem = (id: string) => {
    if (id === workingSystem.id && tabKind(place) !== "project") return onSection("theme");
    navigate({ page: "themes", system: id });
    onSection("theme");
  };
  const mode: Row = { section: "appearance", group: "mode", label: "Mode", description: "Light, dark, or as your Mac is set.", wide: true,
    control: <Pictures label="Mode" value={studio.mode} onChange={value => studio.setMode(value as Mode)}
      options={(["system", "light", "dark"] as const).map(value => ({ value, label: value === "system" ? "System" : value === "light" ? "Light" : "Dark", picture: <ModePicture mode={value} values={chrome.canvas} material={chrome.material} /> }))} /> };
  const panels: Row = { section: "appearance", group: "mode", label: "Panels", description: "Side by side with a line between, or floating on the sidebar's ground.",
    control: <Segmented size="sm" fullWidth aria-label="Panels" value={appLook.panels ?? "sectioned"}
      onValueChange={value => setAppLook({ ...appLook, panels: value === "floating" ? "floating" : undefined })}
      items={[{ value: "sectioned", label: "Sectioned" }, { value: "floating", label: "Floating" }]} /> };
  const drawn: Row = { section: "appearance", group: "look", label: "Drawn in", description: "A system's published theme, or settings only the app uses.",
    control: <Segmented size="sm" fullWidth aria-label="Drawn in" value={appLook.follow ? "system" : "own"}
      onValueChange={value => setAppLook(value === "own" ? { ...appLook, follow: false, own: { ...chrome.canvas }, material: chrome.material } : { ...appLook, follow: true })}
      items={[{ value: "system", label: "A system" }, { value: "own", label: "Its own look" }]} /> };
  const following: Row[] = appLook.follow ? [
    { section: "appearance", group: "look", label: "System", description: "Each project picks its own; this one draws the app.",
      control: <Select size="sm" variant="soft" fullWidth aria-label="System" value={followed.id} onChange={event => setAppLook({ ...appLook, system: event.currentTarget.value, theme: undefined })}>
        {systems.map(entry => <option key={entry.id} value={entry.id}>{versionName(entry.name, liveOf(entry).version)}</option>)}
      </Select> },
    { section: "appearance", group: "look", label: "Theme", description: `One of ${followed.name}'s published themes.`,
      control: <Select size="sm" variant="soft" fullWidth aria-label="Theme" value={look.theme ?? ""} onChange={event => setAppLook({ ...appLook, theme: event.currentTarget.value })}>
        {published.themes.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
      </Select> },
    { section: "appearance", group: "look", label: "Its settings",
      description: `Type ${said("type", chrome.canvas.type)}, ${said("density", chrome.canvas.density).toLowerCase()} density, ${said("radius", chrome.canvas.radius).toLowerCase()} corner, ${said("accent", chrome.canvas.accent).toLowerCase()} accent`,
      control: <Button size="sm" variant="soft" tone="neutral" onClick={() => editSystem(followed.id)}>Edit in Theme</Button> },
  ] : [];
  const editable = tabKind(place) !== "project";
  const theme: Row[] = [
    { section: "theme", group: "editing", label: "System", description: "The system whose theme you are editing.",
      control: <Select size="sm" variant="soft" fullWidth aria-label="Editing system" value={workingSystem.id} onChange={event => editSystem(event.currentTarget.value)}>
        {systems.map(entry => <option key={entry.id} value={entry.id}>{versionName(entry.name, liveOf(entry).version)}</option>)}
      </Select> },
    editable ? { section: "theme", group: "editing", label: "Theme", description: "Changes stay unpublished until you publish them.",
      control: <Select size="sm" variant="soft" fullWidth aria-label="Editing theme" value={activeTheme(workingSystem).id} onChange={event => studio.chooseTheme(event.currentTarget.value)}>
        {workingSystem.themes.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
      </Select> }
      : { section: "theme", group: "editing", label: `Edit ${workingSystem.name}`, description: "This project uses it as published; its themes are edited in its own tab.",
        control: <Button size="sm" variant="soft" tone="neutral" onClick={() => editSystem(workingSystem.id)}>Open {workingSystem.name}</Button> },
  ];
  return [
    { section: "general", group: "profile", label: "Name", description: "As the Sidebar's foot shows it.",
      control: <Input size="sm" variant="soft" fullWidth aria-label="Name" value={studio.profileName} onChange={event => studio.setProfileName(event.currentTarget.value)} /> },
    mode, panels, drawn, ...following, ...theme,
  ];
}

/** A look the theme groups set: its values and Material, and how each is written. */
interface Look {
  values: CanvasAxes;
  material: MaterialState;
  context: RowContext;
  onBundle: (bundle: string) => void;
  onValue: (key: string, value: string) => void;
  lede: string;
}

/** Appearance's own look, while the app has one (Drawn in › Its own look). */
function useAppLook(): Look | null {
  const { appLook, setAppLook, chrome, theme } = useStudio();
  if (appLook.follow) return null;
  const own = (canvas: Record<string, string>, material: MaterialState) => setAppLook({ ...appLook, follow: false, own: canvas, material });
  return {
    values: chrome.canvas, material: chrome.material, lede: "The app's own look, apart from any system.",
    context: { values: chrome.canvas, mode: theme, exact: false, layout: () => "list", set: changes => own({ ...chrome.canvas, ...changes }, chrome.material) },
    onBundle: bundle => own({ ...chrome.canvas, ...(MATERIAL_BUNDLES[bundle]?.layers ?? {}) }, { bundle, overrides: {} }),
    onValue: (key, value) => {
      const { [key]: _, ...rest } = chrome.material.overrides;
      own(chrome.canvas, { ...chrome.material, overrides: value === bundleValue(chrome.material.bundle, key) ? rest : { ...rest, [key]: value } });
    },
  };
}

/** Theme's look: the open system's theme as the Inspector edits it; none in a project's tab, which shows it as published. */
function useThemeLook(): Look | null {
  const { canvas, material, setCanvas, setMaterialBundle, setMaterialValue, theme, brand, place, appLook, workingSystem } = useStudio();
  if (tabKind(place) === "project") return null;
  const followed = appLook.follow && (appLook.system || AREA_ID) === workingSystem.id;
  return {
    values: canvas, material,
    lede: followed ? `The app is drawn in ${workingSystem.name}: it changes when you publish.` : `Changes stay in ${workingSystem.name}'s draft until you publish them.`,
    context: { values: canvas, mode: theme, brand: brandStyle(brand), layout: () => "list", set: changes => { for (const [name, value] of Object.entries(changes)) setCanvas(name as keyof CanvasAxes, value); } },
    onBundle: setMaterialBundle, onValue: setMaterialValue,
  };
}

/** Settings drawn as pictures: Density and Corner (Mode is Appearance's own). */
const PICTURED = new Set(["density", "radius"]);

/**
 * Every Theme setting of a look: the registry's groups and their settings in the Inspector's order (Page, Accent, Emphasis,
 * Size, Shape, Stroke, Shadow, States, Effects), then Material. Light's and dark's pairs show in the mode the app is in, as
 * in the Inspector.
 */
function ThemeGroups({ look, needle, prefix }: { look: Look; needle: string; prefix?: string }) {
  const { theme } = useStudio();
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
  const title = (heading: string) => prefix ? `${prefix} › ${heading}` : heading;
  return (
    <RowFrame.Provider value="settings">
      {groups.map((group, at) => (
        <section key={group.heading} className="studio-settings__group" aria-label={title(group.heading)}>
          <SectionHeading className="studio-section-heading" title={title(group.heading)} lede={at === 0 && !needle ? look.lede : undefined} />
          <div className="studio-settings__rows">
            {group.rows.map(axis => PICTURED.has(axis) ? <PictureRow key={axis} axis={axis} look={look} /> : <SettingRow key={axis} axis={axis} context={look.context} />)}
          </div>
        </section>
      ))}
      {material ? (
        <section className="studio-settings__group" aria-label={title("Material")}>
          <SectionHeading className="studio-section-heading" title={title("Material")} />
          <div className="studio-settings__rows">
            <MaterialRows canvas={look.values} material={look.material} onBundle={look.onBundle} onValue={look.onValue} />
          </div>
        </section>
      ) : null}
    </RowFrame.Provider>
  );
}

/** A setting whose every choice is a picture of it, drawn in that choice's own scope over the look's other settings. */
function PictureRow({ axis, look }: { axis: string; look: Look }) {
  const control = GALLERY_CONTROLS.find(entry => entry.axis === axis)!;
  const value = look.values[axis as keyof CanvasAxes];
  return (
    <SettingsRow label={control.label} description={control.hint} wide reset={resetOf(axis, [axis], look.context)}>
      <Pictures label={control.label} value={value} onChange={next => look.context.set({ [axis]: next })} ratio={ratioOf(axis)} min={axis === "radius" ? 64 : undefined}
        options={control.items.map(item => ({ value: item.value, label: item.label.replace(/ \(Default\)$/, ""),
          picture: <span className="studio-settings__scope" {...canvasAttributes({ ...look.values, [axis]: item.value }, look.material)}><ChoicePreview axis={axis} preset={item.value} /></span> }))} />
    </SettingsRow>
  );
}

/**
 * Choices as pictures (Untitled UI's interface theme, macOS Appearance): Radio's soft preview cards (a control fill, so they read on the rows' plate), the picture centred, the
 * name under it, the chosen card's selected stroke the mark. The row names the group, so its legend is for assistive tech.
 */
function Pictures({ label, value, onChange, options, ratio, min }: { label: string; value: string; onChange: (value: string) => void; options: ReadonlyArray<{ value: string; label: string; picture: ReactNode }>; ratio?: string; min?: number }) {
  const style = { "--area-choice-min": `${min ?? 112}px`, ...(ratio ? { "--area-choice-ratio": ratio } : {}) } as CSSProperties;
  return (
    <RadioGroup label={<span className="area-sr-only">{label}</span>} orientation="horizontal" value={value} onValueChange={onChange} className="studio-settings__pictures" style={style}>
      {options.map(option => <Radio key={option.value} variant="soft" layout="preview" value={option.value} label={option.label} leadingVisual={option.picture} />)}
    </RadioGroup>
  );
}

/** Mode: the app's window in light or dark, in the app's look; System shows both, halved. */
function ModePicture({ mode, values, material }: { mode: Mode; values: CanvasAxes; material: MaterialState }) {
  const window = (theme: "light" | "dark") => (
    <span className="studio-settings__scope" {...canvasAttributes(values, material)} data-area-theme={theme}><ChoicePreview axis="theme" preset={theme} /></span>
  );
  return mode === "system" ? <span className="studio-settings__split">{window("light")}{window("dark")}</span> : window(mode);
}

/**
 * The theme being edited on a product screen, live: every setting, its Material, exact page colors and an exact accent,
 * and a hover preview of a list's option, as the Inspector's specimens take them (src/studio.tsx `shown`). The screen is
 * the person's pick, remembered; the mode is the one the rows edit. A setting's components up close are the theme
 * page's Playground (src/pages/themes.tsx).
 */
function ThemePreview() {
  const { shown, theme, brand, workingSystem } = useStudio();
  const [screen, setScreenState] = useState<ScreenId>(() => {
    const saved = readStored<string>("settings-preview-screen", "area");
    return saved in SCREENS ? saved as ScreenId : "area";
  });
  const setScreen = (next: ScreenId) => { setScreenState(next); writeStored("settings-preview-screen", next); };
  // An exact accent's rule is in the head while it shows (src/brand.ts); the page picks' rule always is (studio.tsx).
  useBrandSheet(brand.on ? brand : null);
  const scope = {
    ...canvasAttributes(shown.canvas, shown.material), "data-area-theme": theme,
    ...(brand.on ? { "data-area-brand": "" } : {}), ...(hasColours(shown.colours) ? { "data-area-colours": "" } : {}),
  };
  return (
    <aside className="studio-settings__preview" aria-label={`Preview of ${activeTheme(workingSystem).name}`}>
      <Select size="sm" variant="soft" fullWidth aria-label="Preview screen" value={screen} onChange={event => setScreen(event.currentTarget.value as ScreenId)}>
        {/* The app itself first: a theme on the app it is made in (owner, 2026-10-30), then the product screens. */}
        {(["area", ...(Object.keys(SCREENS) as ScreenId[]).filter(id => id !== "area")] as ScreenId[]).map(id => <option key={id} value={id}>{SCREENS[id].label}</option>)}
      </Select>
      <ScreenFigure className="studio-settings__screen" screen={screen} scope={scope} fidelity="real" crossfade />
      <p className="studio-settings__description">{activeTheme(workingSystem).name} in {theme === "light" ? "light" : "dark"}, as you change it. Switch light and dark from the header.</p>
    </aside>
  );
}
