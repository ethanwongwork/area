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
 *   Chat        the Inspector Chat's default model, how its work shows, whether its replies are live, and how to sign in
 *   Keyboard    every shortcut the app answers
 *
 * Light and dark are Appearance's Mode alone (owner, 2026-11-07: "move dark mode to the settings control"; none of the
 * three products keeps it in the window, docs/research/settings-2026-11-07/). Search works as Cursor's and ChatGPT's: the
 * results take the Sidebar's list, grouped by section; choosing one opens its section, scrolls to the setting and marks
 * it for 3 s. Esc in the field clears it first, then closes Settings; ⌘, toggles Settings (src/studio.tsx).
 *
 * Theme has a live preview beside its rows (owner, 2026-10-30: "add a screen to the right of the theme canvas in settings to
 * preview all the changes live"): a product screen drawn in the theme being edited, in the mode the rows edit, held in view
 * while the rows scroll; on a narrow Canvas it sits above them.
 */
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { Badge, Button, CodeBlock, Input, Kbd, Nav, NavGroup, NavItem, NumberField, Radio, RadioGroup, SearchField, Segmented, Select, SectionHeading, Switch } from "@area/react";
import { ArrowLeftIcon, ChatIcon, CodeIcon, ContrastIcon, DesktopIcon, KeyboardIcon, MoonIcon, PaletteIcon, SettingsIcon, SunIcon } from "@area/icons";
import { CHAT_MODELS, useDefaultModel, useNotifyAsking, useNotifyEnded, useWorkView } from "../chat/chat.tsx";
import { MATERIAL_BUNDLES, MATERIAL_LEVERS, SETTING_GROUPS } from "@area/tokens/config";
import { GALLERY_CONTROLS } from "../gallery/controls.ts";
import { activeTheme, asLive, liveOf, versionName, AREA_ID } from "../systems.ts";
import { APP_TYPES, chromeOf } from "../app-look.ts";
import { tabKind } from "../places.ts";
import { CANVAS_DEFAULTS, canvasAttributes, SidebarList, useStudio, Workspace, type CanvasAxes, type Mode } from "../studio.tsx";
import { MATERIAL_DEFAULT, bundleValue, type MaterialState } from "../material.ts";
import { CODING_TOOLS, connectSnippets, SCRIPT_PLACEHOLDER } from "../coding-apps.ts";
import { useEditor, useEditors } from "../editors.tsx";
import { useTechTools } from "../tech-tools.ts";
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
import { StatusBadge } from "../tile.tsx";

export type SettingsSection = "general" | "appearance" | "theme" | "chat" | "tools" | "keyboard";
// Cursor's icons for the same sections (its settings nav, read from the bundle 2026-10-30): General the gear, Appearance
// light and dark (its color-mode), and a theme the palette.
const SECTIONS: ReadonlyArray<{ id: SettingsSection; label: string; icon: ReactNode }> = [
  { id: "general", label: "General", icon: <SettingsIcon /> },
  { id: "appearance", label: "Appearance", icon: <ContrastIcon /> },
  { id: "theme", label: "Theme", icon: <PaletteIcon /> },
  { id: "chat", label: "Chat", icon: <ChatIcon /> },
  // Area's tools for the coding apps a person already uses (src/coding-apps.ts).
  { id: "tools", label: "Coding apps", icon: <CodeIcon /> },
  { id: "keyboard", label: "Keyboard", icon: <KeyboardIcon /> },
];

interface Row { section: SettingsSection; group: string; label: string; description: string; control: ReactNode; wide?: boolean }

export function SettingsPage({ section, onSection }: { section: SettingsSection; onSection: (section: SettingsSection | null) => void }) {
  const [query, setQuery] = useState("");
  // Esc closes Settings, as it closes an overlay (product UI rule 5); in the search field it clears the field first.
  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape" && !event.defaultPrevented && !(event.target as Element | null)?.closest?.("input, textarea, select, [role=dialog]")) onSection(null); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [onSection]);
  const rows = useRows(onSection);
  const appLook = useAppLook();
  const themeLook = useThemeLook();
  const { theme } = useStudio();
  const needle = query.trim().toLowerCase();
  const results = needle ? search(indexOf(rows, Boolean(appLook), Boolean(themeLook), theme), needle) : [];
  const shown = rows.filter(row => row.section === section);
  const groups = [...new Set(shown.map(row => row.group))];
  const canvas = useRef<HTMLDivElement>(null);
  const [found, setFound] = useState<Entry & { at: number } | null>(null);
  const open = (entry: Entry) => { onSection(entry.section); setFound({ ...entry, at: Date.now() }); };
  // A chosen result: its row scrolled into view and marked for 3 s (Cursor's), once its section has drawn.
  useLayoutEffect(() => {
    if (!found || found.section !== section || !canvas.current) return;
    const root = canvas.current;
    const row = (found.setting ? root.querySelector<HTMLElement>(`[data-setting="${CSS.escape(found.setting)}"]`) : null)
      ?? [...root.querySelectorAll<HTMLElement>(".studio-settings__row")].find(entry => entry.querySelector(".studio-settings__label")?.textContent === found.label)
      ?? root.querySelector<HTMLElement>(`[aria-label="${CSS.escape(found.group)}"]`);
    if (!row) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollIntoView({ block: "center", behavior: still ? "auto" : "smooth" });
    row.setAttribute("data-found", "");
    const timer = setTimeout(() => row.removeAttribute("data-found"), 3000);
    return () => { clearTimeout(timer); row.removeAttribute("data-found"); };
  }, [found, section]);
  const onSearchKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") { event.preventDefault(); if (query) setQuery(""); else onSection(null); }
    else if (event.key === "ArrowDown" || event.key === "Enter") {
      const first = document.querySelector<HTMLAnchorElement>(".studio-settings-results .area-nav__item");
      if (!first) return;
      event.preventDefault();
      if (event.key === "Enter") first.click(); else first.focus();
    }
  };
  // ↑ and ↓ move through the results; ↑ from the first goes back to the field.
  const onResultsKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const links = [...event.currentTarget.querySelectorAll<HTMLAnchorElement>(".area-nav__item")];
    const at = links.indexOf(document.activeElement as HTMLAnchorElement);
    event.preventDefault();
    if (event.key === "ArrowUp" && at <= 0) { document.querySelector<HTMLInputElement>(".studio-takeover__filter input")?.focus(); return; }
    links[Math.min(links.length - 1, Math.max(0, at + (event.key === "ArrowDown" ? 1 : -1)))]?.focus();
  };
  const sections = [...new Set(results.map(entry => entry.section))];
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
              onKeyDown={onSearchKey} placeholder="Search settings" aria-label="Search settings" />
          </SidebarList>
          <SidebarList>
            {needle ? (
              results.length ? (
                <Nav aria-label="Results" className="studio-settings-results" onKeyDown={onResultsKey}>
                  {sections.map(id => (
                    <NavGroup key={id} label={SECTION_NAME[id]}>
                      {results.filter(entry => entry.section === id).map(entry => (
                        <NavItem key={`${entry.group} ${entry.label}`} href={`#settings-${id}`} icon={SECTIONS.find(item => item.id === id)!.icon}
                          onClick={event => { event.preventDefault(); open(entry); }}>{entry.label}</NavItem>
                      ))}
                    </NavGroup>
                  ))}
                </Nav>
              ) : <p className="studio-settings__none" role="status">No settings match “{query.trim()}”.</p>
            ) : (
              <Nav aria-label="Settings">
                <NavGroup>
                  {SECTIONS.map(entry => (
                    <NavItem key={entry.id} href={`#settings-${entry.id}`} icon={entry.icon} current={section === entry.id}
                      onClick={event => { event.preventDefault(); onSection(entry.id); }}>{entry.label}</NavItem>
                  ))}
                </NavGroup>
              </Nav>
            )}
          </SidebarList>
        </div>
      }
      canvas={(rows => section === "theme" && themeLook
        ? <div className="studio-settings-host"><div className="studio-settings-split">{rows}<ThemePreview /></div></div>
        : rows)(
        <div ref={canvas} className="studio-settings">
          {section === "theme" ? <ThemeTitle /> : <h1 className="studio-settings__title">{SECTION_NAME[section]}</h1>}
          {groups.map(group => {
            const heading = GROUPS[group];
            return (
              <section key={group} className="studio-settings__group" aria-label={heading?.title ?? SECTION_NAME[section]}>
                {heading?.title ? <SectionHeading className="studio-section-heading" title={heading.title} lede={heading.lede} /> : null}
                <div className="studio-settings__rows">
                  {shown.filter(row => row.group === group).map(row => (
                    <SettingsRow key={row.label} label={row.label} description={row.description} wide={row.wide}>{row.control}</SettingsRow>
                  ))}
                </div>
              </section>
            );
          })}
          {appLook && section === "appearance" ? <ThemeGroups look={appLook} /> : null}
          {themeLook && section === "theme" ? <ThemeGroups look={themeLook} /> : null}
        </div>
      )}
    />
  );
}

/** A setting search finds: where it lives, its name, the words it matches on, and its row's setting when it has one. */
interface Entry { section: SettingsSection; group: string; label: string; words: string; setting?: string }

/** Every setting in every section, the Theme groups' rows included (as ThemeGroups draws them). */
function indexOf(rows: Row[], appLook: boolean, themeLook: boolean, theme: "light" | "dark"): Entry[] {
  const plain = rows.map(row => {
    const group = GROUPS[row.group]?.title ?? SECTION_NAME[row.section];
    return { section: row.section, group, label: row.label, words: `${row.description} ${group}` };
  });
  const looks = ([["appearance", appLook], ["theme", themeLook]] as const).filter(([, on]) => on).flatMap(([section]) => [
    ...themeGroupsOf(theme).flatMap(group => group.rows.map(axis => {
      const control = GALLERY_CONTROLS.find(entry => entry.axis === axis);
      const combined = ROW_OF[axis];
      const members = combined ? Object.keys(ROW_OF).filter(key => ROW_OF[key] === combined) : [axis];
      const words = members.map(key => { const each = GALLERY_CONTROLS.find(entry => entry.axis === key); return `${each?.label ?? ""} ${each?.hint ?? ""}`; }).join(" ");
      return { section, group: group.heading, label: combined === "greys" ? "Greys" : control?.label ?? axis, words: `${words} ${group.heading}`, setting: combined === "greys" ? "neutral" : axis };
    })),
    { section, group: "Material", label: "Material", words: MATERIAL_LEVERS.map(lever => lever.label).join(" ") },
  ]);
  return [...plain, ...looks];
}

/** The matches, a name's first: the name, then the rest of its words (Cursor weighs a name far over a description). */
function search(entries: Entry[], needle: string): Entry[] {
  const words = needle.split(/\s+/).filter(Boolean);
  const hit = (text: string) => words.every(word => text.toLowerCase().includes(word));
  const named = entries.filter(entry => hit(entry.label));
  const rest = entries.filter(entry => !named.includes(entry) && hit(`${entry.label} ${entry.words}`));
  return [...named, ...rest];
}

const SECTION_NAME: Record<SettingsSection, string> = { general: "General", appearance: "Appearance", theme: "Theme", chat: "Chat", tools: "Coding apps", keyboard: "Keyboard" };
/** Each group's heading; the first group of a section has none. */
const GROUPS: Record<string, { section: SettingsSection; title?: string; lede?: string }> = {
  profile: { section: "general" },
  mode: { section: "appearance" },
  text: { section: "appearance", title: "Text" },
  access: { section: "appearance", title: "Accessibility" },
  look: { section: "appearance", title: "The app's look", lede: "The app is drawn in one of your systems as it is published, or in a look of its own." },
  editing: { section: "theme" },
  chat: { section: "chat" },
  notices: { section: "chat", title: "Notices" },
  technical: { section: "tools" },
  connect: { section: "tools", title: "Connect a coding app" },
  asks: { section: "tools", title: "What it can ask", lede: "Each is answered from the system written into the project's folder. None changes a file." },
  tabs: { section: "keyboard", title: "Tabs" },
  panels: { section: "keyboard", title: "Panels and places" },
};

/**
 * Every shortcut the app answers (the app menu, electron/main.cjs; the window's keys, src/studio.tsx),
 * as ChatGPT's Keyboard lists them: what it does, its keys at the end.
 */
const SHORTCUTS: ReadonlyArray<{ group: string; label: string; keys: string[] }> = [
  { group: "tabs", label: "New tab", keys: ["⌘", "T"] },
  { group: "tabs", label: "Reopen closed tab", keys: ["⌘", "⇧", "T"] },
  { group: "tabs", label: "Close tab", keys: ["⌘", "W"] },
  { group: "tabs", label: "Next tab", keys: ["⌃", "Tab"] },
  { group: "tabs", label: "Previous tab", keys: ["⌃", "⇧", "Tab"] },
  { group: "tabs", label: "Go to a tab", keys: ["⌘", "1–9"] },
  { group: "panels", label: "Search", keys: ["⌘", "K"] },
  { group: "panels", label: "Home", keys: ["⌘", "⇧", "H"] },
  { group: "panels", label: "Back", keys: ["⌘", "["] },
  { group: "panels", label: "Forward", keys: ["⌘", "]"] },
  { group: "panels", label: "Show or hide the sidebar", keys: ["⌘", "B"] },
  { group: "panels", label: "Show or hide the inspector", keys: ["⌥", "⌘", "B"] },
  { group: "panels", label: "Filter the sidebar's list", keys: ["⌥", "⌘", "F"] },
  { group: "panels", label: "Settings", keys: ["⌘", ","] },
  { group: "panels", label: "Copy link to this place", keys: ["⌘", "⇧", "C"] },
];

/** One row: its name over a one-line description, the control at the end; a wide row (pictures) takes the line under them. */
export function SettingsRow({ label, description, wide, reset, children }: { label: string; description?: string; wide?: boolean; reset?: Reset; children: ReactNode }) {
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
            ? <StatusBadge size="sm" status="draft">{changes.length} {changes.length === 1 ? "change" : "changes"}</StatusBadge>
            : <StatusBadge size="sm" status="published">Live</StatusBadge>}
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
  const [defaultModel, setDefaultModel] = useDefaultModel();
  const [workView, setWorkView] = useWorkView();
  const [notifyEnded, setNotifyEnded] = useNotifyEnded();
  const [notifyAsking, setNotifyAsking] = useNotifyAsking();
  const live = useLiveChat();
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (!copied) return; const timer = setTimeout(() => setCopied(false), 1500); return () => clearTimeout(timer); }, [copied]);
  const look = chromeOf(appLook, systems, MATERIAL_DEFAULT);
  const followed = look.system ?? systems[0]!;
  // The followed system's own Type, under the app's Text size.
  const systemType = chromeOf({ ...appLook, type: undefined }, systems, MATERIAL_DEFAULT).canvas.type ?? "13";
  const published = asLive(followed);
  // Theme edits the open system; another system opens in its own tab under Settings, which stays on Theme.
  const editSystem = (id: string) => {
    if (id === workingSystem.id && tabKind(place) !== "project") return onSection("theme");
    navigate({ page: "themes", system: id });
    onSection("theme");
  };
  const mode: Row = { section: "appearance", group: "mode", label: "Mode", description: "Light, dark, or as your Mac is set.", wide: true,
    control: <Pictures label="Mode" min={200} value={studio.mode} onChange={value => studio.setMode(value as Mode)}
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
      description: `Type ${said("type", systemType)}, ${said("density", chrome.canvas.density).toLowerCase()} density, ${said("radius", chrome.canvas.radius).toLowerCase()} corner, ${said("accent", chrome.canvas.accent).toLowerCase()} accent`,
      control: <Button size="sm" variant="soft" tone="neutral" onClick={() => editSystem(followed.id)}>Edit in Theme</Button> },
  ] : [];
  // Reading and access (Cursor's Typography, Motion and High Contrast groups; owner 2026-11-07): overrides over whatever the
  // app is drawn in. Text size is the followed system's Type unless set; a look of its own sets Type among its settings.
  const textSize: Row[] = appLook.follow ? [{ section: "appearance", group: "text", label: "Text size",
    description: appLook.type ? `${followed.name}'s is ${systemType}.` : `${followed.name}'s, until you change it.`,
    control: <NumberField size="sm" variant="soft" steppers="split" aria-label="Text size" min={Number(APP_TYPES[0])} max={Number(APP_TYPES.at(-1))} step={1}
      value={Number(appLook.type ?? systemType)}
      onValueChange={value => { const next = value == null ? undefined : String(Math.round(value)); setAppLook({ ...appLook, type: next && next !== systemType && (APP_TYPES as readonly string[]).includes(next) ? next : undefined }); }} /> }] : [];
  const access: Row[] = [
    { section: "appearance", group: "access", label: "Reduce motion", description: "Changes happen at once, whatever your Mac is set to.",
      control: <Switch aria-label="Reduce motion" checked={appLook.reduceMotion === true} onChange={event => setAppLook({ ...appLook, reduceMotion: event.currentTarget.checked || undefined })} /> },
    { section: "appearance", group: "access", label: "Follow your Mac's contrast", description: "Stronger edges, focus and state when your Mac increases contrast.",
      control: <Switch aria-label="Follow your Mac's contrast" checked={appLook.followContrast !== false} onChange={event => setAppLook({ ...appLook, followContrast: event.currentTarget.checked ? undefined : false })} /> },
    { section: "appearance", group: "access", label: "Reduce transparency", description: "Solid fills in place of see-through, blurred ones.",
      control: <Switch aria-label="Reduce transparency" checked={appLook.reduceTransparency === true} onChange={event => setAppLook({ ...appLook, reduceTransparency: event.currentTarget.checked || undefined })} /> },
  ];
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
  const chat: Row[] = [
    { section: "chat", group: "chat", label: "Model", description: "What a new chat starts with; the composer's menu changes one chat.",
      control: <Select size="sm" variant="soft" fullWidth aria-label="Model" value={defaultModel} onChange={event => setDefaultModel(event.currentTarget.value)}>
        {CHAT_MODELS.map(entry => <option key={entry.value} value={entry.value}>{entry.label}</option>)}
      </Select> },
    { section: "chat", group: "chat", label: "Work", description: "While Claude works: one line in plain words that opens to its steps, or every step as it happens.",
      control: <Segmented size="sm" fullWidth aria-label="Work" value={workView} onValueChange={value => setWorkView(value === "steps" ? "steps" : "summary")}
        items={[{ value: "summary", label: "Summary" }, { value: "steps", label: "Every step" }]} /> },
    { section: "chat", group: "chat", label: "Replies", description: live
      ? "Claude works in this repository and asks before each edit or command."
      : "Recorded runs: Claude answers live in the Area app.",
      control: <Badge size="sm" variant="soft" tone={live ? "success" : "neutral"}>{live ? "Live" : "Recorded"}</Badge> },
    { section: "chat", group: "notices", label: "When a reply ends", description: "A notice from your Mac while Area is in the background. Its tab shows a mark either way.",
      control: <Switch aria-label="Notice when a reply ends" checked={notifyEnded === "on"} onChange={event => setNotifyEnded(event.currentTarget.checked ? "on" : "off")} /> },
    { section: "chat", group: "notices", label: "When Claude needs an answer", description: "An approval or a question is waiting, and the reply waits with it.",
      control: <Switch aria-label="Notice when Claude needs an answer" checked={notifyAsking === "on"} onChange={event => setNotifyAsking(event.currentTarget.checked ? "on" : "off")} /> },
    { section: "chat", group: "chat", label: "Sign in", description: "Claude answers once this Mac is signed in: run the command in Terminal, or set ANTHROPIC_API_KEY.",
      control: <Button size="sm" variant="soft" tone="neutral" onClick={() => { void navigator.clipboard?.writeText("claude auth login"); setCopied(true); }}>{copied ? "Copied" : "Copy claude auth login"}</Button> },
  ];
  // Coding apps: the line or file that gives each one Area's tools, with this Mac's path to the command in it.
  const script = useAreaCommand();
  const editors = useEditors();
  const [techTools, setTechTools] = useTechTools();
  const [editor, setEditor] = useEditor();
  const tools: Row[] = [
    { section: "tools", group: "connect", label: "Where it works", description: "In a folder a system is written into: open a system's version and choose Write to folder. The coding app then asks Area about that system while it works there.",
      control: <Badge size="sm" variant="soft" tone="neutral">Read only</Badge> },
    { section: "tools", group: "technical", label: "Technical tools", description: "Files, a code editor and a terminal in a project with a folder, for when you work in its code yourself. The terminal runs your own commands, outside Chat's approvals.",
      control: <Switch aria-label="Technical tools" checked={techTools} onChange={event => setTechTools(event.currentTarget.checked)} /> },
    ...(editors.length ? [{ section: "tools" as const, group: "connect", label: "Open files in", description: "Where Open in editor takes a project's file, at its line.",
      control: <Select size="sm" variant="soft" fullWidth aria-label="Open files in" value={editor?.id ?? ""} onChange={event => setEditor(event.currentTarget.value)}>
        {editors.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
      </Select> }] : []),
    ...connectSnippets(script).map((snippet): Row => ({ section: "tools", group: "connect", label: snippet.app, description: snippet.where, wide: true,
      control: <span className="studio-settings__field"><CodeBlock size="sm" lineNumbers={false} wrap language={snippet.language} code={snippet.code.trimEnd()} /></span> })),
    ...CODING_TOOLS.map((tool): Row => ({ section: "tools", group: "asks", label: tool.label, description: tool.description,
      control: <code className="studio-settings__tool">{tool.name}</code> })),
  ];
  const keyboard: Row[] = SHORTCUTS.map(entry => ({ section: "keyboard", group: entry.group, label: entry.label, description: "",
    control: <Kbd keys={entry.keys} size="sm" /> }));
  return [
    { section: "general", group: "profile", label: "Name", description: "As the Sidebar's foot shows it.",
      control: <Input size="sm" variant="soft" fullWidth aria-label="Name" value={studio.profileName} onChange={event => studio.setProfileName(event.currentTarget.value)} /> },
    mode, panels, ...textSize, ...access, drawn, ...following, ...theme, ...chat, ...tools, ...keyboard,
  ];
}

/** Where the `area` command is on this Mac (electron/output.cjs); a stand-in path where the app can't say. */
function useAreaCommand(): string {
  const [script, setScript] = useState(SCRIPT_PLACEHOLDER);
  useEffect(() => {
    let alive = true;
    window.areaDesktop?.output?.command?.().then(path => { if (alive && path) setScript(path); }, () => {});
    return () => { alive = false; };
  }, []);
  return script;
}

/** Whether the Chat's replies are live here: the Electron app's engine answers (electron/agent.cjs). */
function useLiveChat() {
  const [live, setLive] = useState(false);
  useEffect(() => {
    let on = true;
    void window.areaDesktop?.agent?.status().then(status => { if (on) setLive(status.available); }).catch(() => {});
    return () => { on = false; };
  }, []);
  return live;
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
function ThemeGroups({ look }: { look: Look }) {
  const { theme } = useStudio();
  return (
    <RowFrame.Provider value="settings">
      {themeGroupsOf(theme).map((group, at) => (
        <section key={group.heading} className="studio-settings__group" aria-label={group.heading}>
          <SectionHeading className="studio-section-heading" title={group.heading} lede={at === 0 ? look.lede : undefined} />
          <div className="studio-settings__rows">
            {group.rows.map(axis => PICTURED.has(axis) ? <PictureRow key={axis} axis={axis} look={look} /> : <SettingRow key={axis} axis={axis} context={look.context} />)}
          </div>
        </section>
      ))}
      <section className="studio-settings__group" aria-label="Material">
        <SectionHeading className="studio-section-heading" title="Material" />
        <div className="studio-settings__rows">
          <MaterialRows canvas={look.values} material={look.material} onBundle={look.onBundle} onValue={look.onValue} />
        </div>
      </section>
    </RowFrame.Provider>
  );
}

/** The Theme groups' rows, in the mode the app is in: a combined row (Greys, Accent) once, at its first setting. */
function themeGroupsOf(theme: "light" | "dark") {
  return SETTING_GROUPS.map(group => {
    const axes = (group.settings as readonly string[]).filter(axis => axis in CANVAS_DEFAULTS && inMode(axis, theme));
    const drawn = new Set<string>();
    const rows = axes.filter(axis => { const row = ROW_OF[axis]; if (!row) return true; if (drawn.has(row)) return false; drawn.add(row); return true; });
    return { heading: group.heading, rows };
  }).filter(group => group.rows.length);
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
      {options.map(option => <Radio key={option.value} variant="soft" layout="thumbnail" value={option.value} label={option.label} leadingVisual={option.picture} />)}
    </RadioGroup>
  );
}

/** Mode: the app's window in light or dark, in the app's look; System shows both, halved. */
function ModePicture({ mode, values, material }: { mode: Mode; values: CanvasAxes; material: MaterialState }) {
  // The Workspace in a 720 window, its words as bars (owner 2026-11-07: "using real components and ui, scaled down, but not
  // quite as abstract as just abstract ui ... like 720 width"; then "B as bars"): at a picture's size the 1920 screen was
  // texture, this one's parts read.
  const window = (theme: "light" | "dark") => (
    <span className="studio-settings__scope" {...canvasAttributes(values, material)} data-area-theme={theme}>
      <ScreenFigure className="cv-screen" screen="compact" scope={{}} fidelity="bars" />
    </span>
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
  const { shown, theme, brand, workingSystem, mode, setMode } = useStudio();
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
      <div className="studio-settings__preview-bar">
        <Select size="sm" variant="soft" fullWidth aria-label="Preview screen" value={screen} onChange={event => setScreen(event.currentTarget.value as ScreenId)}>
          {/* The app itself first: a theme on the app it is made in (owner, 2026-10-30), then the product screens. */}
          {(["area", ...(Object.keys(SCREENS) as ScreenId[]).filter(id => id !== "area")] as ScreenId[]).map(id => <option key={id} value={id}>{SCREENS[id].label}</option>)}
        </Select>
        {/* The mode the rows edit, the app's Mode (Claude's Theme switch: System, Light, Dark as icons). */}
        <Segmented size="sm" iconOnly aria-label="Mode" value={mode} onValueChange={value => setMode(value as Mode)}
          items={[{ value: "system", label: "System", icon: <DesktopIcon /> }, { value: "light", label: "Light", icon: <SunIcon /> }, { value: "dark", label: "Dark", icon: <MoonIcon /> }]} />
      </div>
      <ScreenFigure className="studio-settings__screen" screen={screen} scope={scope} fidelity="real" crossfade />
      <p className="studio-settings__description">{activeTheme(workingSystem).name} in {theme === "light" ? "light" : "dark"}, as you change it.</p>
    </aside>
  );
}
