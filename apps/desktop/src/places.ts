/**
 * Where the app can be (docs/research/app-structure-2026-10-28/README.md, Phase 1): every place has a hash, and the hash
 * says which page draws the Canvas and what is chosen on it. Replaces the Titlebar's eight tabs (TABS, until 2026-10-28):
 *
 *   #home/<item>                             Home: the workspace's projects, Library and recent places; the item a chosen
 *                                            system or project, "new" for New system, "new-project" for New project
 *   #system/<system>/themes/<theme>            the system's themes
 *   #system/<system>/themes/new/<question>     a new theme, made in the Setup chat
 *   #system/<system>/themes/settings/<group>/<item>  Themes on one setting (its group: Page, Accent, … Effects)
 *   #system/<system>/tokens/<group>            every token, in tiers, narrowed to one group (2026-10-31)
 *   #system/<system>/colors/<item>             the color scales (and typography/<role>, icons/<category>, illustrations/<section>)
 *   #system/<system>/spacing                   a foundation that had been settings only (and shape, elevation, motion)
 *   #system/<system>/components/<item>         a family, or a family's tile (<slug>/<tile>)
 *   #system/<system>/patterns/<item>           the system's screens
 *   #system/<system>/history/<version>         the system's publishes, newest first
 *   #project/<project>/<item>                  a project's overview (the IA of 2026-10-29: projects make new things)
 *   #project/<project>/pages/<page>/<layer>    one of its pages, and a layer on it
 *   #project/<project>/explorations/<id>       an exploration: a theme tried on the project's system
 *   #project/<project>/versions/<id>           its saved versions
 *   #projects/<item>                         every project, as cards (2026-11-01: one of the Sidebar's four places); the item
 *                                            a chosen project
 *   #systems/<item>                          every system, as cards; the item a chosen system
 *   #references/<item>                       References (Inspiration until 2026-10-31, the Library page until 2026-10-29): Saved
 *                                            at its root, "discover" and "following", a collection and its images
 *                                            (<collection>/<image>)
 *   #labs/<lab>/<item>                       labs out of the nav (Materials, Tests, Feed: every feed element, 2026-11-01)
 *
 * A system is one of the workspace's (src/systems.ts) and a project one of its projects (src/projects.ts): the app names
 * them with `setSystems` and `setProjects`, and a hash naming another is no place. Old links (#components/button, #theme, #imagery, #brand/area/… …) are the Area system's and redirect
 * (`redirect`), and a tab saved before the places opens where its old tab went. Pure: the routing test (tests/places.test.ts)
 * imports it.
 */

/** A page: what draws the Canvas (and the Sidebar's list, if it has one). */
export type PageId =
  | "home" | "themes" | "theme-setup" | "foundations" | "settings" | "tokens" | "color" | "typography" | "icons" | "illustrations"
  | "spacing" | "shape" | "elevation" | "motion"
  | "components" | "patterns" | "history" | "references" | "materials" | "tests" | "feed" | "chat"
  | "project" | "project-page" | "exploration" | "versions" | "projects" | "systems";

export interface Place {
  page: PageId;
  /** A system's page: which system (its id). Left out, the page is the current tab's system's (src/studio.tsx `navigate`). */
  system?: string;
  /** A project's page: which project (its id). */
  project?: string;
  /** A setting group's page (`settings`): its slug, e.g. "shape". */
  group?: string;
  /** What is chosen on the page, in the page's own key (a family's slug, an icon's name, a group/image). */
  item?: string;
}

/** The workspace's systems, as the app last named them (`setSystems`): each a folder in Application Support (src/systems.ts). */
let systems: ReadonlyArray<{ id: string; name: string }> = [{ id: "area", name: "Area" }];
export function setSystems(list: ReadonlyArray<{ id: string; name: string }>) { systems = list.map(({ id, name }) => ({ id, name })); }
const knownSystem = (id: string | undefined) => systems.some(entry => entry.id === id);
/** A system's name, by its id. */
export const systemName = (id: string | undefined) => systems.find(entry => entry.id === (id ?? AREA))?.name ?? "System";
/** The workspace's projects, as the app last named them (`setProjects`). */
let projects: ReadonlyArray<{ id: string; name: string }> = [];
export function setProjects(list: ReadonlyArray<{ id: string; name: string }>) { projects = list.map(({ id, name }) => ({ id, name })); }
const knownProject = (id: string | undefined) => projects.some(entry => entry.id === id);
/** A project's name, by its id. */
export const projectName = (id: string | undefined) => projects.find(entry => entry.id === id)?.name ?? "Project";
/** A project's pages, their own: they draw its tree in the Sidebar and never a system's. */
export const PROJECT_PAGES: ReadonlySet<PageId> = new Set(["project", "project-page", "exploration", "versions"]);
/** The system old links and system-less places mean. */
const AREA = "area";

/** The pages with a list of their own: in the Sidebar it takes the panel over, under a back row (Phase 0's takeover). */
export const LIST_PAGES: ReadonlySet<PageId> = new Set(["tokens", "color", "typography", "icons", "illustrations", "components", "patterns", "references", "materials", "tests"]);

/** A system's sections, as their hashes say them (Foundations until 2026-10-31 held Colors, Typography and Icons). */
const SECTIONS = ["themes", "tokens", "colors", "typography", "spacing", "shape", "elevation", "motion", "icons", "illustrations", "components", "patterns", "history"];
/** The foundations that had been settings only, each a page since 2026-10-31. */
const FOUNDATION_SECTIONS = ["tokens", "spacing", "shape", "elevation", "motion"] as const;
/** Foundations' own pages, which old /foundations/<page> links name before the setting groups. */
const FOUNDATION_PAGES = ["color", "typography", "icons"] as const;

/** Patterns' screens that moved to Labs › Tests (2026-10-31; src/pages/examples.tsx TESTS): their old links follow. */
const MOVED_TO_TESTS = new Set(["hairline", "stroke-groups"]);
const patternsPlace = (system: string, item: string | undefined): Place =>
  item && MOVED_TO_TESTS.has(item.split("/")[0]!) ? { page: "tests", item } : { page: "patterns", system, item };

/** References' views: what others share and what you keep (Saved, its root; its collections are the page's list). */
export const REFERENCE_VIEWS: ReadonlyArray<{ item?: string; label: string }> = [
  { item: "discover", label: "Discover" },
  { item: "following", label: "Following" },
  { label: "Saved" },
];
/** Which of References' views an item is on, or none for Saved's (a collection, and an image in it). */
export const referenceView = (item?: string) => REFERENCE_VIEWS.find(view => view.item && view.item === item?.split("/")[0])?.item;

/** A setting group's heading as its slug ("Shape" → "shape"). */
export const groupSlug = (heading: string) => heading.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const encode = (item?: string) => item ? `/${item.split("/").map(encodeURIComponent).join("/")}` : "";

/** The hash for a place. */
export function hrefOf(place: Place): string {
  const system = `#system/${place.system ?? AREA}`;
  switch (place.page) {
    case "home": return `#home${encode(place.item)}`;
    case "themes": return `${system}/themes${encode(place.item)}`;
    case "theme-setup": return `${system}/themes/new${encode(place.item)}`;
    case "foundations": return `${system}/themes/settings`;
    case "settings": return `${system}/themes/settings/${place.group ?? ""}${encode(place.item)}`;
    case "color": return `${system}/colors${encode(place.item)}`;
    case "typography": case "icons": case "illustrations": case "tokens": case "spacing": case "shape": case "elevation": case "motion": return `${system}/${place.page}${encode(place.item)}`;
    case "components": return `${system}/components${encode(place.item)}`;
    case "patterns": return `${system}/patterns${encode(place.item)}`;
    case "history": return `${system}/history${encode(place.item)}`;
    case "references": return `#references${encode(place.item)}`;
    case "projects": return `#projects${encode(place.item)}`;
    case "systems": return `#systems${encode(place.item)}`;
    case "project": return `#project/${place.project ?? ""}${encode(place.item)}`;
    case "project-page": return `#project/${place.project ?? ""}/pages${encode(place.item)}`;
    case "exploration": return `#project/${place.project ?? ""}/explorations${encode(place.item)}`;
    case "versions": return `#project/${place.project ?? ""}/versions${encode(place.item)}`;
    case "materials": return `#labs/materials${encode(place.item)}`;
    case "tests": return `#labs/tests${encode(place.item)}`;
    case "feed": return `#labs/feed${encode(place.item)}`;
    case "chat": return `#labs/chat${encode(place.item)}`;
  }
}

/** Splits a hash into its decoded parts ("#a/b%20c" → ["a", "b c"]). */
const partsOf = (hash: string) => hash.replace(/^#/, "").split("/").map(part => { try { return decodeURIComponent(part); } catch { return part; } });
const rest = (parts: string[]) => parts.filter(Boolean).join("/") || undefined;

/**
 * The place a hash names, or null when it names none (an example screen's own "#settings" link, a system this workspace
 * doesn't have). An example screen's own "#home" is Home's hash too: the Workspace keeps a specimen's links from leaving
 * the page (src/studio.tsx), so only the app's own links and a typed or launched hash reach here.
 */
export function parsePlace(hash: string): Place | null {
  const [root, ...parts] = partsOf(hash);
  if (root === "home") return { page: "home", item: rest(parts) };
  if (root === "system") {
    const [system, section, ...more] = parts;
    if (!system || !knownSystem(system)) return null;
    if (section === "themes") {
      if (more[0] === "new") return { page: "theme-setup", system, item: rest(more.slice(1)) };
      if (more[0] !== "settings") return { page: "themes", system, item: rest(more) };
      const [, group, ...item] = more;
      return group ? { page: "settings", system, group, item: rest(item) } : { page: "foundations", system };
    }
    if (section === "colors") return { page: "color", system, item: rest(more) };
    if (section === "typography" || section === "icons" || section === "illustrations") return { page: section, system, item: rest(more) };
    if ((FOUNDATION_SECTIONS as readonly string[]).includes(section ?? "")) return { page: section as PageId, system, item: rest(more) };
    // An old link: Foundations held Colors, Typography, Icons and the setting groups until 2026-10-31.
    if (section === "foundations") {
      const [page, ...item] = more;
      if (!page) return { page: "foundations", system };
      if ((FOUNDATION_PAGES as readonly string[]).includes(page)) return { page: page as PageId, system, item: rest(item) };
      return { page: "settings", system, group: page, item: rest(item) };
    }
    if (section === "components") return { page: "components", system, item: rest(more) };
    if (section === "patterns") return patternsPlace(system, rest(more));
    if (section === "history") return { page: "history", system, item: rest(more) };
    if (!section) return { page: "themes", system };
    return null;
  }
  if (root === "project") {
    const [project, section, ...more] = parts;
    if (!project || !knownProject(project)) return null;
    if (section === "pages" && more[0]) return { page: "project-page", project, item: rest(more) };
    if (section === "explorations" && more[0]) return { page: "exploration", project, item: rest(more) };
    if (section === "versions") return { page: "versions", project, item: rest(more) };
    return { page: "project", project, item: rest([section ?? "", ...more]) };
  }
  if (root === "references") return { page: "references", item: rest(parts) };
  if (root === "projects") return { page: "projects", item: rest(parts) };
  if (root === "systems") return { page: "systems", item: rest(parts) };
  if (root === "labs" && parts[0] === "materials") return { page: "materials", item: rest(parts.slice(1)) };
  if (root === "labs" && parts[0] === "tests") return { page: "tests", item: rest(parts.slice(1)) };
  if (root === "labs" && parts[0] === "feed") return { page: "feed", item: rest(parts.slice(1)) };
  if (root === "labs" && parts[0] === "chat") return { page: "chat", item: rest(parts.slice(1)) };
  return null;
}

/**
 * Where an old link goes (the Titlebar's tabs until 2026-10-28, and their own older names): Theme → Themes (a setting's
 * link to its group's page), Components → Components, Typography, Color and Icons → their sections, Testing → Patterns,
 * Imagery, the Library page and Inspiration → References, Materials → Labs. `groupOf` names a setting's group (its slug), so `#theme/radius` lands on Shape.
 */
export function redirect(hash: string, groupOf?: (setting: string) => string | undefined): Place | null {
  const [root, ...parts] = partsOf(hash);
  const item = rest(parts);
  switch (root) {
    // Theme was the Language tab 2026-10-19 to 20.
    case "theme": case "language": {
      const group = item ? groupOf?.(parts[0]!) : undefined;
      return group ? { page: "settings", system: AREA, group, item: parts[0] } : item ? { page: "foundations", system: AREA } : { page: "themes", system: AREA };
    }
    case "components": return { page: "components", system: AREA, item };
    case "typography": return { page: "typography", system: AREA, item };
    case "color": return { page: "color", system: AREA, item };
    case "icons": return { page: "icons", system: AREA, item };
    // Testing was the Examples tab until 2026-10-17.
    case "testing": case "examples": return patternsPlace(AREA, item);
    // Imagery was the Brand tab 2026-10-18 to 24 (#brand/<group>/<image>), then the Library, Inspiration once the Library
    // became what's live (2026-10-29), and References since 2026-10-31 (owner: "references is good"). Systems were brands
    // until 2026-10-29 (#brand/<system>/<section>/…): the same place under #system/, or none for a system this app doesn't have.
    case "imagery": case "library": case "inspiration": return { page: "references", item };
    case "brand": return knownSystem(parts[0]) || SECTIONS.includes(parts[1] ?? "")
      ? parsePlace(`#system/${parts.map(part => encodeURIComponent(part)).join("/")}`)
      : { page: "references", item };
    case "materials": return { page: "materials", item };
    default: return null;
  }
}

/** A hash as a place: a place's own hash, else an old link's redirect, else null. */
export function resolve(hash: string, groupOf?: (setting: string) => string | undefined): Place | null {
  return parsePlace(hash) ?? redirect(hash, groupOf);
}

/**
 * What an open tab holds: Home, References, Projects (every project), Systems (every system), one system, one project, or a lab (owner, 2026-10-29:
 * "tabs can be libraries or projects … the tab itself in the canvas will always just be the project itself"). A tab
 * never changes what it holds: what is inside it (a system's sections, a project's pages, explorations and versions) is
 * reached through the Sidebar, and anything else opens in the tab holding it, or a new one.
 */
export type TabKind = "home" | "system" | "project" | "references" | "projects" | "systems" | "labs";
export const tabKind = (place: Place): TabKind =>
  place.page === "home" ? "home" : place.page === "references" ? "references" : place.page === "projects" ? "projects" : place.page === "systems" ? "systems" : place.page === "materials" || place.page === "tests" || place.page === "feed" || place.page === "chat" ? "labs" : PROJECT_PAGES.has(place.page) ? "project" : "system";
export const tabName = (place: Place): string => {
  const kind = tabKind(place);
  return kind === "system" ? systemName(place.system) : kind === "project" ? projectName(place.project)
    : kind === "labs" ? (place.page === "tests" ? "Tests" : place.page === "feed" ? "Feed" : place.page === "chat" ? "Chat" : "Materials") : ({ home: "Home", references: "References", projects: "Projects", systems: "Systems" } as const)[kind];
};
/** What a tab holds, as a key: two places in one system or project are in the same tab. */
export const tabHolds = (place: Place): string => {
  const kind = tabKind(place);
  return kind === "system" ? `system:${place.system ?? AREA}` : kind === "project" ? `project:${place.project ?? ""}` : kind === "labs" ? `labs:${place.page}` : kind;
};

/**
 * The Home tab (Figma's file browser tab, `tab--fileBrowserTab`): always first, icon only, never closed, always on Home.
 * It is not saved with the others; the saved `current` may name it.
 */
export const HOME_TAB = "home";

/** An open tab, as saved: where it is, and whether its Sidebar shows the nav or the page's list. */
export interface SavedTab { id: string; hash: string; panel: "nav" | "page" }
export interface SavedTabs { tabs: SavedTab[]; current: string }

/**
 * The tabs to open at launch, after Home: the saved ones, each still a place (a deleted system's tab is gone); else one tab
 * where the saved tab of the old Titlebar went (Components, Imagery …), once; else none, on Home. A Home tab saved by
 * mistake is dropped: there is only one.
 */
export function restoreTabs(saved: unknown, oldTab: unknown, groupOf?: (setting: string) => string | undefined): SavedTabs {
  if (saved && typeof saved === "object" && Array.isArray((saved as SavedTabs).tabs)) {
    // A tab saved before systems (#brand/area/…) opens where its link now goes.
    const tabs = (saved as SavedTabs).tabs.flatMap(tab => {
      const place = tab && typeof tab.id === "string" && tab.id !== HOME_TAB && typeof tab.hash === "string" ? resolve(tab.hash, groupOf) : null;
      return place && place.page !== "home" ? [{ id: tab.id, hash: hrefOf(place), panel: tab.panel === "page" ? "page" as const : "nav" as const }] : [];
    });
    const current = (saved as SavedTabs).current;
    return { tabs, current: tabs.some(tab => tab.id === current) ? current : current === HOME_TAB || !tabs.length ? HOME_TAB : tabs[0]!.id };
  }
  const place = typeof oldTab === "string" ? redirect(oldTab, groupOf) : null;
  if (!place) return { tabs: [], current: HOME_TAB };
  return { tabs: [{ id: "t1", hash: hrefOf(place), panel: LIST_PAGES.has(place.page) ? "page" : "nav" }], current: "t1" };
}
