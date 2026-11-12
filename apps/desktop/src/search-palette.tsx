/**
 * Search everything (⌘K): the Titlebar's field opens Area's Command palette over every place and what it holds (Phase 1:
 * "⌘K across every place"), as Cursor's and Figma's quick open do. Systems and places first, then components, settings, scales, type
 * roles, icon categories and patterns, and each project; icons by name once two letters are typed (808 rows would be noise unasked). A
 * choice opens in the current tab, or, opened from New tab (+, ⌘T), in a new one. Each page's own list is filtered in the Sidebar (src/app-nav.tsx, Takeover).
 */
import { useMemo, useState } from "react";
import { CommandPalette, type CommandItem } from "@area/react";
import { AddIcon, AppWindowIcon, ChatAddIcon, ChatIcon, CodeIcon, DesktopIcon, LinkIcon, MoonIcon, PaletteIcon, SearchIcon, SettingsIcon, PanelLeftIcon, PanelRightIcon, SunIcon } from "@area/icons";
import { useChat } from "./chat/chat.tsx";
import { addExploration, addPage } from "./projects.ts";
import { activeTheme } from "./systems.ts";
import { categories as ICON_CATEGORIES, icons as ICON_META } from "@area/icons/meta";
import { ChromeButton, useStudio } from "./studio.tsx";
import { hrefOf, REFERENCE_VIEWS, tabKind as tabKindOf, type Place } from "./places.ts";
import { SYSTEM_SECTIONS, placeLabel } from "./app-nav.tsx";
import { FAMILIES } from "./pages/components.tsx";
import { PATTERNS, TESTS } from "./pages/examples.tsx";
import { modeOfSetting, SETTINGS } from "./pages/theme-settings.ts";
import { groupSlug } from "./places.ts";
import { SCALES, TYPE_ROLES } from "./tokens.ts";

const title = (id: string) => id.replace(/-/g, " ").replace(/^./, letter => letter.toUpperCase());
const categoryOf = (category: string | null) => ICON_CATEGORIES.find(entry => entry.slug === category || entry.name === category);

/** A setting's group, and its theme when it is one of a light and dark pair (Page lightness is each theme's own). */
const settingWhere = (setting: { id: string; heading: string }) => {
  const mode = modeOfSetting(setting.id);
  return mode ? `${setting.heading}, ${mode === "light" ? "Light" : "Dark"}` : setting.heading;
};

/** Every place and item, as palette rows (without their action, which needs the studio). */
/** A system's own place, described by the open system's name when shown (a choice opens it in that system). */
const OPEN_SYSTEM = "";
const ENTRIES: ReadonlyArray<{ place: Place; label: string; description: string; group: string; keywords?: string[] }> = [
  { place: { page: "home" }, label: "Home", description: "Workspace", group: "Places", keywords: ["recent", "latest", "feed"] },
  { place: { page: "projects" }, label: "Projects", description: "Workspace", group: "Places", keywords: ["projects", "all projects"] },
  { place: { page: "systems" }, label: "Systems", description: "Workspace", group: "Places", keywords: ["systems", "design systems", "library"] },
  ...([{ page: "theme-setup" }] as Place[]).map(place => ({ place, label: placeLabel(place), description: OPEN_SYSTEM, group: "Places" })),
  ...SYSTEM_SECTIONS.map(entry => ({ place: entry.place, label: entry.label, description: OPEN_SYSTEM, group: "Places" })),
  ...REFERENCE_VIEWS.map(view => ({ place: { page: "references" as const, item: view.item }, label: view.label, description: "References", group: "Places",
    keywords: ["references", "inspiration", "collections", "explore", "images", "saved"] })),
  { place: { page: "materials" }, label: "Materials", description: "Labs", group: "Places", keywords: ["lab", "material bundles"] },
  { place: { page: "tests" }, label: "Tests", description: "Labs", group: "Places", keywords: ["lab", "trial", "testing"] },
  { place: { page: "feed" }, label: "Feed", description: "Labs", group: "Places", keywords: ["lab", "gallery", "cards", "spacing", "elements"] },
  { place: { page: "chat" }, label: "Chat", description: "Labs", group: "Places", keywords: ["lab", "conversation", "messages", "agent", "composer"] },
  ...FAMILIES.map(family => ({ place: { page: "components" as const, item: family.slug }, label: family.name, description: "Component", group: "Components" })),
  ...SETTINGS.map(setting => ({ place: { page: "settings" as const, group: groupSlug(setting.heading), item: setting.id }, label: setting.title, description: settingWhere(setting), group: "Settings", keywords: [setting.label, setting.id] })),
  ...SCALES.map(scale => ({ place: { page: "color" as const, item: scale.id }, label: title(scale.id), description: "Color scale", group: "Color" })),
  ...TYPE_ROLES.map(role => ({ place: { page: "typography" as const, item: role.id }, label: role.name, description: "Type role", group: "Typography" })),
  ...ICON_CATEGORIES.map(category => ({ place: { page: "icons" as const, item: category.slug }, label: category.name, description: "Icon category", group: "Icons" })),
  ...PATTERNS.map(example => ({ place: { page: "patterns" as const, item: example.id }, label: example.label, description: "Pattern", group: "Patterns" })),
  ...TESTS.map(example => ({ place: { page: "tests" as const, item: example.id }, label: example.label, description: "Test", group: "Labs" })),
];
const ICONS = ICON_META.filter(icon => !icon.aliasOf).map(icon => ({
  place: { page: "icons" as const, item: categoryOf(icon.category)?.slug }, label: title(icon.name), description: `Icon in ${categoryOf(icon.category)?.name ?? "Uncategorised"}`, group: "Icons", keywords: [icon.name, ...icon.keywords],
}));

/**
 * The commands for where the person is. A project's tab adds its own (a page, an exploration, its preview); a system's
 * tab adds its themes to switch to. Each runs what the app's own control runs.
 */
function commandsFor(studio: ReturnType<typeof useStudio>, chat: ReturnType<typeof useChat>): CommandItem[] {
  const { openProject: project, updateProject, navigate, openSystem, setMode, mode, togglePanel, sidebar, inspector, copyLink, openSettings, setInspectorView, showInspector, place } = studio;
  const group = "Commands";
  const openChat = () => { showInspector(); setInspectorView("chat"); requestAnimationFrame(() => requestAnimationFrame(() => chat.composer.current?.focus())); };
  const out: CommandItem[] = [
    { id: "cmd:chat", label: "Open chat", group, shortcut: ["⌘", "L"], icon: <ChatIcon />, keywords: ["ask", "claude", "agent"], onSelect: openChat },
    { id: "cmd:new-chat", label: "New chat", group, icon: <ChatAddIcon />, keywords: ["start", "conversation", "claude"], onSelect: () => { chat.session.clear(); openChat(); } },
    { id: "cmd:copy-link", label: "Copy link to this place", group, shortcut: ["⌘", "⇧", "C"], icon: <LinkIcon />, keywords: ["share", "url", "area://"], onSelect: copyLink },
    { id: "cmd:sidebar", label: sidebar ? "Hide sidebar" : "Show sidebar", group, shortcut: ["⌘", "B"], icon: <PanelLeftIcon />, keywords: ["panel", "toggle"], onSelect: () => togglePanel("sidebar") },
    { id: "cmd:inspector", label: inspector ? "Hide inspector" : "Show inspector", group, shortcut: ["⌥", "⌘", "B"], icon: <PanelRightIcon />, keywords: ["panel", "toggle"], onSelect: () => togglePanel("inspector") },
    ...(["light", "dark", "system"] as const).filter(next => next !== mode).map((next): CommandItem => ({
      id: `cmd:mode-${next}`, label: next === "system" ? "Match my Mac's appearance" : `Switch to ${next}`, group, icon: next === "dark" ? <MoonIcon /> : next === "light" ? <SunIcon /> : <DesktopIcon />,
      // Each its own word only: "dark" finds Switch to dark first, not every mode.
      keywords: ["appearance", "mode", next === "system" ? "automatic" : `${next} mode`], onSelect: () => setMode(next) })),
    { id: "cmd:settings", label: "Open settings", group, shortcut: ["⌘", ","], icon: <SettingsIcon />, keywords: ["preferences"], onSelect: () => openSettings() },
    { id: "cmd:coding-apps", label: "Connect a coding app", group, icon: <CodeIcon />, keywords: ["mcp", "tools", "editor", "connect"], onSelect: () => openSettings("tools") },
  ];
  if (project) {
    const newPage = () => { const made = addPage(project); updateProject(project.id, () => made.project); navigate({ page: "project-page", item: made.page.id }); };
    const newExploration = () => {
      const made = addExploration(project, openSystem.themes.find(entry => entry.id === project.theme) ?? activeTheme(openSystem));
      updateProject(project.id, () => made.project);
      navigate({ page: "exploration", item: made.exploration.id });
    };
    out.push(
      { id: "cmd:new-page", label: "New page", description: project.name, group, icon: <AddIcon />, keywords: ["add", "board", "screen"], onSelect: newPage },
      { id: "cmd:new-exploration", label: "New exploration", description: project.name, group, icon: <AddIcon />, keywords: ["add", "try", "theme"], onSelect: newExploration },
      ...(place.page === "preview" ? [] : [{ id: "cmd:preview", label: "Show the running app", description: project.name, group, icon: <AppWindowIcon />, keywords: ["preview", "localhost", "choose"], onSelect: () => navigate({ page: "preview" }) }]),
    );
  } else if (tabKindOf(place) === "system" && studio.workingSystem.themes.length > 1) {
    out.push({ id: "cmd:theme", label: "Switch theme…", description: studio.workingSystem.name, group, icon: <PaletteIcon />, keywords: ["theme", "edit"], placeholder: "Switch to a theme",
      items: studio.workingSystem.themes.map(theme => ({ id: `cmd:theme-${theme.id}`, label: theme.name, onSelect: () => studio.chooseTheme(theme.id) })) });
  }
  return out;
}

/** Where search is open for: the current tab, a new one (New tab), or closed. */
export type SearchFor = "here" | "new" | null;

export function SearchEverything({ open, onOpenChange }: { open: SearchFor; onOpenChange: (open: SearchFor) => void }) {
  const studio = useStudio();
  const { navigate, systems, projects, openSystem, addTheme } = studio;
  const chat = useChat();
  const [query, setQuery] = useState("");
  const show = (start = "") => { setQuery(start); onOpenChange("here"); };
  // Each system opens on its Themes; a system's own places open in the open system.
  const items = useMemo<CommandItem[]>(() => [
    ...projects.map(project => ({ place: { page: "project", project: project.id } as Place, label: project.name, description: "Project", group: "Projects", keywords: ["project"] })),
    ...systems.map(system => ({ place: { page: "themes", system: system.id } as Place, label: system.name, description: "System", group: "Systems", keywords: ["system"] })),
    ...ENTRIES, ...(query.trim().length >= 2 ? ICONS : []),
  ].map((entry, at) => ({
    id: `${at}:${hrefOf(entry.place)}`, label: entry.label, description: entry.description === OPEN_SYSTEM ? openSystem.name : entry.description, group: entry.group, keywords: entry.keywords,
    // New theme adds the theme first, as Themes' own button does: Setup then never runs over the theme in use.
    onSelect: () => { if (entry.place.page === "theme-setup") addTheme(); navigate(entry.place, { newTab: open === "new" }); },
  })), [navigate, addTheme, open, query.trim().length >= 2, systems, projects, openSystem.name]);
  // Commands (U1, docs/research/desktop-app-analysis-2026-11-10): what the app already does from a menu, a button or a
  // key, run from here, each with its keys so the palette teaches them. Not offered from New tab, which opens a place.
  const commands = useMemo<CommandItem[]>(() => open === "new" ? [] : commandsFor(studio, chat), [open, studio, chat]);
  return (
    <>
      {/* An icon in the Sidebar's header opens the palette (Cursor's sidebar search; a field in the Titlebar until 2026-10-30). */}
      <ChromeButton label="Search" keys={["⌘", "K"]} shortcut="Meta+K" icon={<SearchIcon />} onClick={() => show()} />
      <CommandPalette items={[...commands, ...items]} open={open !== null} onOpenChange={next => { onOpenChange(next ? open ?? "here" : null); if (!next) setQuery(""); }} hotkey="mod+k"
        query={query} onQueryChange={setQuery} aria-label={open === "new" ? "Open in a new tab" : "Search everything"}
        placeholder={open === "new" ? "Open in a new tab: a place, component, setting, icon…" : "Search places, components, settings, icons, or run a command…"}
        emptyText={`Nothing matches “${query}”.`} />
    </>
  );
}
