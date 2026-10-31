/**
 * Search everything (⌘K): the Titlebar's field opens Area's Command palette over every place and what it holds (Phase 1:
 * "⌘K across every place"), as Cursor's and Figma's quick open do. Systems and places first, then components, settings, scales, type
 * roles, icon categories and patterns, and each project; icons by name once two letters are typed (808 rows would be noise unasked). A
 * choice opens in the current tab, or, opened from New tab (+, ⌘T), in a new one. Each page's own list is filtered in the Sidebar (src/app-nav.tsx, Takeover).
 */
import { useMemo, useState } from "react";
import { CommandPalette, type CommandItem } from "@area/react";
import { SearchIcon } from "@area/icons";
import { categories as ICON_CATEGORIES, icons as ICON_META } from "@area/icons/meta";
import { ChromeButton, useStudio } from "./studio.tsx";
import { hrefOf, type Place } from "./places.ts";
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
  { place: { page: "home" }, label: "Home", description: "Workspace", group: "Places", keywords: ["projects", "systems", "boards", "recent"] },
  ...([{ page: "theme-setup" }] as Place[]).map(place => ({ place, label: placeLabel(place), description: OPEN_SYSTEM, group: "Places" })),
  ...SYSTEM_SECTIONS.map(entry => ({ place: entry.place, label: entry.label, description: OPEN_SYSTEM, group: "Places" })),
  { place: { page: "inspiration" }, label: "Inspiration", description: "Library", group: "Places", keywords: ["library", "images", "boards", "imagery"] },
  { place: { page: "materials" }, label: "Materials", description: "Labs", group: "Places", keywords: ["lab", "material bundles"] },
  { place: { page: "tests" }, label: "Tests", description: "Labs", group: "Places", keywords: ["lab", "trial", "testing"] },
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

/** Where search is open for: the current tab, a new one (New tab), or closed. */
export type SearchFor = "here" | "new" | null;

export function SearchEverything({ open, onOpenChange }: { open: SearchFor; onOpenChange: (open: SearchFor) => void }) {
  const { navigate, systems, projects, openSystem } = useStudio();
  const [query, setQuery] = useState("");
  const show = (start = "") => { setQuery(start); onOpenChange("here"); };
  // Each system opens on its Themes; a system's own places open in the open system.
  const items = useMemo<CommandItem[]>(() => [
    ...projects.map(project => ({ place: { page: "project", project: project.id } as Place, label: project.name, description: "Project", group: "Projects", keywords: ["project"] })),
    ...systems.map(system => ({ place: { page: "themes", system: system.id } as Place, label: system.name, description: "System", group: "Systems", keywords: ["system"] })),
    ...ENTRIES, ...(query.trim().length >= 2 ? ICONS : []),
  ].map((entry, at) => ({
    id: `${at}:${hrefOf(entry.place)}`, label: entry.label, description: entry.description === OPEN_SYSTEM ? openSystem.name : entry.description, group: entry.group, keywords: entry.keywords,
    onSelect: () => navigate(entry.place, { newTab: open === "new" }),
  })), [navigate, open, query.trim().length >= 2, systems, projects, openSystem.name]);
  return (
    <>
      {/* An icon in the Sidebar's header opens the palette (Cursor's sidebar search; a field in the Titlebar until 2026-10-30). */}
      <ChromeButton label="Search" keys={["⌘", "K"]} shortcut="Meta+K" icon={<SearchIcon />} onClick={() => show()} />
      <CommandPalette items={items} open={open !== null} onOpenChange={next => { onOpenChange(next ? open ?? "here" : null); if (!next) setQuery(""); }} hotkey="mod+k"
        query={query} onQueryChange={setQuery} aria-label={open === "new" ? "Open in a new tab" : "Search everything"}
        placeholder={open === "new" ? "Open in a new tab: a place, component, setting, icon…" : "Search places, components, settings, icons…"}
        emptyText={`Nothing matches “${query}”.`} />
    </>
  );
}
