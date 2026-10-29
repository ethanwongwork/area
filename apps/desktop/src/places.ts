/**
 * Where the app can be (docs/research/app-structure-2026-10-28/README.md, Phase 1): every place has a hash, and the hash
 * says which page draws the Canvas and what is chosen on it. Replaces the Titlebar's eight tabs (TABS, until 2026-10-28):
 *
 *   #home/<item>                             Home: the workspace's brands, boards and recent places (Phase 2); the item a
 *                                            chosen brand, or "new" for New brand
 *   #brand/<brand>/themes/<theme>            the brand's themes
 *   #brand/<brand>/themes/new/<question>     a new theme, made in the Setup chat
 *   #brand/<brand>/foundations               every setting, as Browse showed them
 *   #brand/<brand>/foundations/<page>/<item> Color, Typography, Icons, or one setting group (Page, Accent, … Effects)
 *   #brand/<brand>/components/<item>         a family, or a family's tile (<slug>/<tile>)
 *   #brand/<brand>/patterns/<item>           Testing's screens
 *   #library/<item>                          Imagery's groups and images (<group>/<image>)
 *   #labs/<lab>/<item>                       labs out of the nav (Materials)
 *
 * Projects come in a later phase. A brand is one of the workspace's (src/brands.ts): the app names them with `setBrands`, and a
 * hash naming another brand is no place. Old links (#components/button, #theme, #imagery …) are the Area brand's and redirect
 * (`redirect`), and a tab saved before the places opens where its old tab went. Pure: the routing test (tests/places.test.ts)
 * imports it.
 */

/** A page: what draws the Canvas (and the Sidebar's list, if it has one). */
export type PageId =
  | "home" | "themes" | "theme-setup" | "foundations" | "settings" | "color" | "typography" | "icons"
  | "components" | "patterns" | "library" | "materials";

export interface Place {
  page: PageId;
  /** A brand's page: which brand (its id). Left out, the page is the current tab's brand's (src/studio.tsx `navigate`). */
  brand?: string;
  /** A setting group's page (`settings`): its slug, e.g. "shape". */
  group?: string;
  /** What is chosen on the page, in the page's own key (a family's slug, an icon's name, a group/image). */
  item?: string;
}

/** The workspace's brands, as the app last named them (`setBrands`): each a folder in Application Support (src/brands.ts). */
let brands: ReadonlyArray<{ id: string; name: string }> = [{ id: "area", name: "Area" }];
export function setBrands(list: ReadonlyArray<{ id: string; name: string }>) { brands = list.map(({ id, name }) => ({ id, name })); }
const knownBrand = (id: string | undefined) => brands.some(entry => entry.id === id);
/** A brand's name, by its id. */
export const brandName = (id: string | undefined) => brands.find(entry => entry.id === (id ?? AREA))?.name ?? "Brand";
/** The brand old links and brand-less places mean. */
const AREA = "area";

/** The pages with a list of their own: in the Sidebar it takes the panel over, under a back row (Phase 0's takeover). */
export const LIST_PAGES: ReadonlySet<PageId> = new Set(["color", "typography", "icons", "components", "patterns", "library", "materials"]);

/** A brand's sections that exist (Overview, Visuals, Voice and guidelines and Agent kit come later). */
const SECTIONS = ["themes", "foundations", "components", "patterns"];
/** Foundations' own pages, before the setting groups (which come from the registry's SETTING_GROUPS). */
const FOUNDATION_PAGES = ["color", "typography", "icons"] as const;

/** A setting group's heading as its slug ("Shape" → "shape"). */
export const groupSlug = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const encode = (item?: string) => item ? `/${item.split("/").map(encodeURIComponent).join("/")}` : "";

/** The hash for a place. */
export function hrefOf(place: Place): string {
  const brand = `#brand/${place.brand ?? AREA}`;
  switch (place.page) {
    case "home": return `#home${encode(place.item)}`;
    case "themes": return `${brand}/themes${encode(place.item)}`;
    case "theme-setup": return `${brand}/themes/new${encode(place.item)}`;
    case "foundations": return `${brand}/foundations`;
    case "settings": return `${brand}/foundations/${place.group ?? ""}${encode(place.item)}`;
    case "color": case "typography": case "icons": return `${brand}/foundations/${place.page}${encode(place.item)}`;
    case "components": return `${brand}/components${encode(place.item)}`;
    case "patterns": return `${brand}/patterns${encode(place.item)}`;
    case "library": return `#library${encode(place.item)}`;
    case "materials": return `#labs/materials${encode(place.item)}`;
  }
}

/** Splits a hash into its decoded parts ("#a/b%20c" → ["a", "b c"]). */
const partsOf = (hash: string) => hash.replace(/^#/, "").split("/").map(part => { try { return decodeURIComponent(part); } catch { return part; } });
const rest = (parts: string[]) => parts.filter(Boolean).join("/") || undefined;

/**
 * The place a hash names, or null when it names none (an example screen's own "#settings" link, a brand this workspace
 * doesn't have). An example screen's own "#home" is Home's hash too: the Workspace keeps a specimen's links from leaving
 * the page (src/studio.tsx), so only the app's own links and a typed or launched hash reach here.
 */
export function parsePlace(hash: string): Place | null {
  const [root, ...parts] = partsOf(hash);
  if (root === "home") return { page: "home", item: rest(parts) };
  if (root === "brand") {
    const [brand, section, ...more] = parts;
    if (!brand || !knownBrand(brand)) return null;
    if (section === "themes") return more[0] === "new" ? { page: "theme-setup", brand, item: rest(more.slice(1)) } : { page: "themes", brand, item: rest(more) };
    if (section === "foundations") {
      const [page, ...item] = more;
      if (!page) return { page: "foundations", brand };
      if ((FOUNDATION_PAGES as readonly string[]).includes(page)) return { page: page as PageId, brand, item: rest(item) };
      return { page: "settings", brand, group: page, item: rest(item) };
    }
    if (section === "components") return { page: "components", brand, item: rest(more) };
    if (section === "patterns") return { page: "patterns", brand, item: rest(more) };
    if (!section) return { page: "themes", brand };
    return null;
  }
  if (root === "library") return { page: "library", item: rest(parts) };
  if (root === "labs" && parts[0] === "materials") return { page: "materials", item: rest(parts.slice(1)) };
  return null;
}

/**
 * Where an old link goes (the Titlebar's tabs until 2026-10-28, and their own older names): Theme → Themes (a setting's
 * link to its group's page), Components → Components, Typography, Color and Icons → Foundations, Testing → Patterns,
 * Imagery → Library, Materials → Labs. `groupOf` names a setting's group (its slug), so `#theme/radius` lands on Shape.
 */
export function redirect(hash: string, groupOf?: (setting: string) => string | undefined): Place | null {
  const [root, ...parts] = partsOf(hash);
  const item = rest(parts);
  switch (root) {
    // Theme was the Language tab 2026-10-19 to 20.
    case "theme": case "language": {
      const group = item ? groupOf?.(parts[0]!) : undefined;
      return group ? { page: "settings", brand: AREA, group, item: parts[0] } : item ? { page: "foundations", brand: AREA } : { page: "themes", brand: AREA };
    }
    case "components": return { page: "components", brand: AREA, item };
    case "typography": return { page: "typography", brand: AREA, item };
    case "color": return { page: "color", brand: AREA, item };
    case "icons": return { page: "icons", brand: AREA, item };
    // Testing was the Examples tab until 2026-10-17.
    case "testing": case "examples": return { page: "patterns", brand: AREA, item };
    // Imagery was the Brand tab 2026-10-18 to 24 (#brand/<group>/<image>); a link to a brand's section (#brand/<brand>/
    // themes …) is a place's, or a brand's this app does not have.
    case "imagery": return { page: "library", item };
    case "brand": return knownBrand(parts[0]) || SECTIONS.includes(parts[1] ?? "") ? null : { page: "library", item };
    case "materials": return { page: "materials", item };
    default: return null;
  }
}

/** A hash as a place: a place's own hash, else an old link's redirect, else null. */
export function resolve(hash: string, groupOf?: (setting: string) => string | undefined): Place | null {
  return parsePlace(hash) ?? redirect(hash, groupOf);
}

/** What an open tab holds: Home, a brand, the Library, or a lab. A tab shows one of these and keeps its place within it. */
export type TabKind = "home" | "brand" | "library" | "labs";
export const tabKind = (place: Place): TabKind => place.page === "home" ? "home" : place.page === "library" ? "library" : place.page === "materials" ? "labs" : "brand";
export const tabName = (place: Place): string => {
  const kind = tabKind(place);
  return kind === "brand" ? brandName(place.brand) : ({ home: "Home", library: "Library", labs: "Materials" } as const)[kind];
};
/** What a tab holds, as a key: two tabs on one brand hold the same thing (Home opens a brand in the tab already on it). */
export const tabHolds = (place: Place): string => tabKind(place) === "brand" ? `brand:${place.brand ?? AREA}` : tabKind(place);

/**
 * The Home tab (Figma's file browser tab, `tab--fileBrowserTab`): always first, icon only, never closed, always on Home.
 * It is not saved with the others; the saved `current` may name it.
 */
export const HOME_TAB = "home";

/** An open tab, as saved: where it is, and whether its Sidebar shows the nav or the page's list. */
export interface SavedTab { id: string; hash: string; panel: "nav" | "page" }
export interface SavedTabs { tabs: SavedTab[]; current: string }

/**
 * The tabs to open at launch, after Home: the saved ones, each still a place (a deleted brand's tab is gone); else one tab
 * where the saved tab of the old Titlebar went (Components, Imagery …), once; else none, on Home. A Home tab saved by
 * mistake is dropped: there is only one.
 */
export function restoreTabs(saved: unknown, oldTab: unknown, groupOf?: (setting: string) => string | undefined): SavedTabs {
  if (saved && typeof saved === "object" && Array.isArray((saved as SavedTabs).tabs)) {
    const tabs = (saved as SavedTabs).tabs.filter(tab => tab && typeof tab.id === "string" && tab.id !== HOME_TAB && typeof tab.hash === "string" && parsePlace(tab.hash) && parsePlace(tab.hash)!.page !== "home")
      .map(tab => ({ id: tab.id, hash: tab.hash, panel: tab.panel === "page" ? "page" as const : "nav" as const }));
    const current = (saved as SavedTabs).current;
    return { tabs, current: tabs.some(tab => tab.id === current) ? current : current === HOME_TAB || !tabs.length ? HOME_TAB : tabs[0]!.id };
  }
  const place = typeof oldTab === "string" ? redirect(oldTab, groupOf) : null;
  if (!place) return { tabs: [], current: HOME_TAB };
  return { tabs: [{ id: "t1", hash: hrefOf(place), panel: LIST_PAGES.has(place.page) ? "page" : "nav" }], current: "t1" };
}
