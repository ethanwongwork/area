/**
 * Search everything (⌘K): the Titlebar's field opens Area's Command palette over every place and what it holds (Phase 1:
 * "⌘K across every place"), as Cursor's and Figma's quick open do. Places first, then components, settings, scales, type
 * roles, icon categories and patterns; icons by name once two letters are typed (808 rows would be noise unasked). A
 * choice opens in the current tab, or, opened from New tab (+, ⌘T), in a new one. Each page's own list is filtered in the Sidebar (src/app-nav.tsx, Takeover).
 */
import { useMemo, useState } from "react";
import { CommandPalette, SearchField, type CommandItem } from "@area/react";
import { categories as ICON_CATEGORIES, icons as ICON_META } from "@area/icons/meta";
import { useStudio } from "./studio.tsx";
import { hrefOf, type Place } from "./places.ts";
import { FOUNDATIONS, placeLabel } from "./app-nav.tsx";
import { FAMILIES } from "./pages/components.tsx";
import { EXAMPLES } from "./pages/examples.tsx";
import { SETTINGS } from "./pages/theme-settings.ts";
import { groupSlug } from "./places.ts";
import { SCALES, TYPE_ROLES } from "./tokens.ts";

const title = (id: string) => id.replace(/-/g, " ").replace(/^./, letter => letter.toUpperCase());
const categoryOf = (category: string | null) => ICON_CATEGORIES.find(entry => entry.slug === category || entry.name === category);

/** Every place and item, as palette rows (without their action, which needs the studio). */
const ENTRIES: ReadonlyArray<{ place: Place; label: string; description: string; group: string; keywords?: string[] }> = [
  ...([{ page: "themes" }, { page: "theme-setup" }, { page: "foundations" }] as Place[]).map(place => ({ place, label: placeLabel(place), description: "Area", group: "Places" })),
  ...FOUNDATIONS.map(entry => ({ place: entry.place, label: entry.label, description: "Foundations", group: "Places" })),
  ...([{ page: "components" }, { page: "patterns" }, { page: "library" }] as Place[]).map(place => ({ place, label: placeLabel(place), description: place.page === "library" ? "Workspace" : "Area", group: "Places" })),
  { place: { page: "materials" }, label: "Materials", description: "Labs", group: "Places", keywords: ["lab", "material bundles"] },
  ...FAMILIES.map(family => ({ place: { page: "components" as const, item: family.slug }, label: family.name, description: "Component", group: "Components" })),
  ...SETTINGS.map(setting => ({ place: { page: "settings" as const, group: groupSlug(setting.heading), item: setting.id }, label: setting.title, description: setting.heading, group: "Settings", keywords: [setting.label, setting.id] })),
  ...SCALES.map(scale => ({ place: { page: "color" as const, item: scale.id }, label: title(scale.id), description: "Color scale", group: "Color" })),
  ...TYPE_ROLES.map(role => ({ place: { page: "typography" as const, item: role.id }, label: role.name, description: "Type role", group: "Typography" })),
  ...ICON_CATEGORIES.map(category => ({ place: { page: "icons" as const, item: category.slug }, label: category.name, description: "Icon category", group: "Icons" })),
  ...EXAMPLES.map(example => ({ place: { page: "patterns" as const, item: example.id }, label: example.label, description: "Pattern", group: "Patterns" })),
];
const ICONS = ICON_META.filter(icon => !icon.aliasOf).map(icon => ({
  place: { page: "icons" as const, item: categoryOf(icon.category)?.slug }, label: title(icon.name), description: `Icon · ${categoryOf(icon.category)?.name ?? "Uncategorised"}`, group: "Icons", keywords: [icon.name, ...icon.keywords],
}));

/** Where search is open for: the current tab, a new one (New tab), or closed. */
export type SearchFor = "here" | "new" | null;

export function SearchEverything({ open, onOpenChange }: { open: SearchFor; onOpenChange: (open: SearchFor) => void }) {
  const { navigate } = useStudio();
  const [query, setQuery] = useState("");
  const show = (start = "") => { setQuery(start); onOpenChange("here"); };
  const items = useMemo<CommandItem[]>(() => [...ENTRIES, ...(query.trim().length >= 2 ? ICONS : [])].map((entry, at) => ({
    id: `${at}:${hrefOf(entry.place)}`, label: entry.label, description: entry.description, group: entry.group, keywords: entry.keywords,
    onSelect: () => navigate(entry.place, { newTab: open === "new" }),
  })), [navigate, open, query.trim().length >= 2]);
  return (
    <>
      {/* The field only opens the palette: a click, Enter, or the first letter typed (which the palette's field takes). */}
      <SearchField size="sm" variant="soft" className="studio-titlebar__search" readOnly value="" placeholder="Search" aria-label="Search everything"
        aria-haspopup="dialog" shortcut={["⌘", "K"]} onClick={() => show()}
        onKeyDown={event => {
          if (event.metaKey || event.ctrlKey || event.altKey) return;
          if (event.key.length === 1 && event.key !== " ") { event.preventDefault(); show(event.key); }
          else if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") { event.preventDefault(); show(); }
        }} />
      <CommandPalette items={items} open={open !== null} onOpenChange={next => { onOpenChange(next ? open ?? "here" : null); if (!next) setQuery(""); }} hotkey="mod+k"
        query={query} onQueryChange={setQuery} aria-label={open === "new" ? "Open in a new tab" : "Search everything"}
        placeholder={open === "new" ? "Open in a new tab: a place, component, setting, icon…" : "Search places, components, settings, icons…"}
        emptyText={`Nothing matches “${query}”.`} />
    </>
  );
}
