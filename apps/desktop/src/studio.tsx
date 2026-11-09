/**
 * Area's desktop app: the gallery that holds every component, icon, type style and colour.
 *
 * Three named regions, each with its own header on the window's top line (owner, 2026-10-30, after Cursor; a Titlebar
 * spanned them from 2026-10-10 until then):
 *
 *   Sidebar    the left panel: window controls, its toggle and search, back and forward; the nav (src/app-nav.tsx), or the
 *              page's own list taking it over; the profile and Settings at its foot
 *   Canvas     the centre: the open tabs over the selected thing at full size
 *   Inspector  the right panel: its views, theme settings and facts about the selection
 *
 * Built from Area's own components in the app's own look (its chosen system's theme, src/app-look.ts), with one divider
 * between each panel. Each place (src/places.ts) is a page (src/pages/) that fills the panels through <Workspace>;
 * Settings (src/pages/settings.tsx) opens over the current tab.
 */
import { createContext, Fragment, isValidElement, useCallback, useContext, useEffect, useInsertionEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode, type Ref } from "react";
import { Avatar, Button, Count, Kbd, Nav, NavGroup, NavItem, Panel, Titlebar, Tooltip, TreeView, type TreeViewNode } from "@area/react";
import { ArrowLeftIcon, ArrowRightIcon, BookmarkIcon, PanelLeftFilledIcon, PanelLeftIcon, PanelRightFilledIcon, PanelRightIcon, SettingsIcon } from "@area/icons";
import { DEPTH_LEVER_AXES, GALLERY_CONTROLS, type GalleryControl } from "./gallery/controls.ts";
import { ComponentsPage } from "./pages/components.tsx";
import { TypographyPage } from "./pages/typography.tsx";
import { IconsPage } from "./pages/icons.tsx";
import { IllustrationsPage } from "./pages/illustrations.tsx";
import { ColorPage } from "./pages/color.tsx";
import { ThemePage } from "./pages/theme.tsx";
import { ExamplesPage } from "./pages/examples.tsx";
import { MaterialsPage } from "./pages/materials.tsx";
import { FeedLabPage } from "./pages/feed-lab.tsx";
import { ChatLabPage } from "./pages/chat-lab.tsx";
import { ImageryPage } from "./pages/imagery.tsx";
import { TokensPage } from "./pages/tokens.tsx";
import { FoundationPage } from "./pages/foundation.tsx";
import { HistoryPage } from "./pages/history.tsx";
import { ExplorationPage, ProjectOverview, ProjectPageView, VersionsPage } from "./pages/project.tsx";
import { PublishControls } from "./publish.tsx";
import { readStored, writeStored } from "./storage.ts";
import { AppScaleContext, InheritedScaleContext, SETUP_SCALE, type AppScale } from "./app-scale.ts";
import { movedFrom, SpecimenScopeContext } from "./specimen-scope.tsx";
import { libraryOutput } from "./inventory.tsx";
import { ChatComposer, ChatProvider, ChatTranscript, selectionLabel, useChat } from "./chat/chat.tsx";
import { MATERIAL_BUNDLES, SETTING_GROUPS } from "@area/tokens/config";
import { groupSlug, HOME_TAB, hrefOf, LIST_PAGES, parsePlace, resolve, restoreTabs, setProjects, setSystems, tabHolds, tabKind, type Place } from "./places.ts";
import { AppNav, AppTabs, PageList } from "./app-nav.tsx";
import { SearchEverything, type SearchFor } from "./search-palette.tsx";
import { ThemesPage } from "./pages/themes.tsx";
import { HomePage } from "./pages/home.tsx";
import { ProjectsPage, SystemsPage } from "./pages/workspace-lists.tsx";
import { bundleValue, MATERIAL_DEFAULT, materialAttributes, restoreMaterial, type MaterialState } from "./material.ts";
import { restoreBrand, useBrandSheet, type BrandState } from "./brand.ts";
import { PAGE_AXES, hasColours, restoreColours, shownColours, useColoursSheet, type ColoursState } from "./colours.ts";
import { activeTheme, AREA_ID, asLive, asRelease, changesOf, followedVersion, liveOf, systemFile, loadSystems, newTheme, publish, publishTheme, revertTo, starterSystem, withTheme, type Change, type ReleaseKind, type System, type SystemLibrary, type SystemOrigin, type SystemTheme, type Restorers } from "./systems.ts";
import { loadProjects, newProject, projectFile, recordIteration, type Project } from "./projects.ts";
import { chromeOf, restoreAppLook, type AppLook } from "./app-look.ts";
import { SettingsPage, type SettingsSection } from "./pages/settings.tsx";

type Theme = "light" | "dark";

/** A setting's group, as its page's slug (#theme/radius → Foundations › Shape). */
const SETTING_GROUP = new Map(SETTING_GROUPS.flatMap(group => group.settings.map(id => [id, groupSlug(group.heading)] as const)));
const groupOf = (setting: string) => SETTING_GROUP.get(setting);

/** The Canvas's own theme settings (the Inspector writes them): the colour settings, the Layers (light and dark ground, layer
 * contrast), contrast, type size, density, radius, surface, elevation,
 * motion, pills. */
export type CanvasAxes = Record<Exclude<GalleryControl["axis"], "theme">, string>;
export const CANVAS_DEFAULTS = Object.fromEntries(
  GALLERY_CONTROLS.filter(control => control.axis !== "theme").map(control => [control.axis, control.defaultValue]),
) as CanvasAxes;
/**
 * The saved Canvas, each setting kept only while it is still one of its control's options: an
 * elevation saved before it became a number (`minimal`, `standard` …) or a hand-edited value would
 * otherwise leave its Select blank and match no preset. Keys no control reads are dropped. A Canvas
 * from before the type / density split (`ui`: compact or default) restores as its two settings, and
 * a density saved by name (compact, default, comfortable) as its number. One Layers contrast saved before it
 * split by theme (2026-10-17) restores as both. A Canvas saved before positions (no `positions` mark, 2026-10-26) has
 * Layer contrast 0 to 8, Card shade −4 to +4, Text tint, Label tint and the state fills 0 to 4, and Grey tint 0 to 16;
 * each restores as its position on 0–100.
 */
/** Marks a saved Canvas whose Layer contrast, Card shade and Text tint are positions (0–100), so restoreCanvas converts only
 * the ones saved before. */
const CANVAS_POSITIONS = 1;
/** Marks a saved Canvas whose Series lightness is sky's palette step (350 or 400, 2026-11-02, round 18), not a lightness
 * (2: blue's, 66–78, default 70; unmarked: one shared, 66–80, default 79), so restoreCanvas moves only older ones. */
const CANVAS_SERIES = 3;
/** A theme's Canvas as its system file holds it: marked as positions and as blue's Series lightness. */
const markCanvas = (canvas: CanvasAxes) => ({ ...canvas, positions: CANVAS_POSITIONS, series: CANVAS_SERIES });
function restoreCanvas(saved: Partial<CanvasAxes> & { ui?: string; layers?: string; positions?: number; series?: number }): CanvasAxes {
  const { ui, layers, positions, series, ...rest } = saved;
  const legacy: Partial<CanvasAxes> = {
    ...(ui === "compact" ? { type: "12", density: "28" } : ui === "default" ? { type: "14", density: "32" } : {}),
    ...(typeof layers === "string" ? { "layers-light": layers, "layers-dark": layers } : {}),
  };
  const merged: Record<string, unknown> = { ...legacy, ...rest };
  const named: Record<string, string> = { compact: "28", default: "32", comfortable: "36" };
  if (typeof merged.density === "string" && merged.density in named) merged.density = named[merged.density];
  // Contrast has nine levels since 2026-10-22: Standard, Medium and More restore as 0, 4 and 8.
  const contrastNamed: Record<string, string> = { standard: "0", medium: "4", more: "8" };
  if (typeof merged.contrast === "string" && merged.contrast in contrastNamed) merged.contrast = contrastNamed[merged.contrast];
  // Positions (2026-10-26): a step saved before them is its share of the old range, on 0–100 (Layers 4 is 50, Card shade −1
  // is −25, Text tint 2 is 50, Grey tint 1 is 6), rounded away from 0 at a half, as the marks are (@area/tokens
  // color/layers.ts `positionOf`).
  if (positions !== CANVAS_POSITIONS) {
    const scaled = (axis: string, per: number) => {
      const step = Number(merged[axis]);
      if (typeof merged[axis] === "string" && merged[axis] !== "" && Number.isFinite(step)) merged[axis] = String(Math.sign(step) * Math.round(Math.abs(step) * per));
    };
    for (const axis of ["layers-light", "layers-dark"]) scaled(axis, 100 / 8);
    for (const axis of ["card-tone-light", "card-tone-dark"]) scaled(axis, 100 / 4);
    for (const axis of ["ink-tint", "label-tint", "fill-hover", "fill-selected", "fill-pressed"]) scaled(axis, 25);
    for (const axis of ["tint-light", "tint-dark"]) scaled(axis, 100 / 16);
  }
  // Series lightness became sky's palette step (data views round 18, 2026-11-02): a lightness saved before (blue's,
  // or unmarked, the old shared one 9 higher) lands on 350, or on 400 where it was a deep pick (blue's 67 or under).
  if (series !== CANVAS_SERIES && typeof merged["series-lightness"] === "string") {
    const old = Number(merged["series-lightness"]);
    const blue = series === 2 ? old : old - 9;
    if (Number.isFinite(old) && old < 100) merged["series-lightness"] = blue <= 67 ? "400" : "350";
  }
  const canvas = { ...CANVAS_DEFAULTS };
  for (const control of GALLERY_CONTROLS) {
    if (control.axis === "theme") continue;
    const value = merged[control.axis];
    if (typeof value !== "string") continue;
    const known = control.items.map(item => item.value);
    // A set keeps the shapes it still knows (an empty set is a choice: every shape follows Radius).
    if (control.kind === "chips") canvas[control.axis] = value.split(" ").filter(name => known.includes(name)).join(" ");
    else if (known.includes(value)) canvas[control.axis] = value;
  }
  return canvas;
}

/** How a system's themes are checked on the way in (src/systems.ts): as the app restored its own saved settings. */
const RESTORE: Restorers = {
  canvas: saved => restoreCanvas((saved && typeof saved === "object" ? saved : {}) as Partial<CanvasAxes>),
  material: restoreMaterial,
  colours: (saved, canvas) => restoreColours(saved, canvas, CANVAS_DEFAULTS),
  accent: restoreBrand,
};

/*
 * The systems' store: Electron's (one system.json each in Application Support/Area/Systems, electron/main.cjs), or this
 * browser's own storage in the preview and a capture (`systems`; `brands` until 2026-10-29). Read once at launch; with no
 * Area system saved, the settings the app kept before systems (localStorage canvas, material, colours, brand) become its
 * Default theme, once, and are written at
 * once. Those old keys are left as they were and no longer read.
 */
const disk = () => typeof window !== "undefined" ? window.areaDesktop?.systems : undefined;
function openSystems(): System[] {
  const files = disk()?.read() ?? readStored<unknown[]>("systems", readStored<unknown[]>("brands", []));
  const { systems, migrated } = loadSystems(Array.isArray(files) ? files : [],
    () => ({ canvas: readStored("canvas", {}), material: readStored("material", null), colours: readStored("colours", null), brand: readStored("brand", null) }), RESTORE);
  if (migrated) saveSystems(systems, [migrated.id]);
  setSystems(systems);
  return systems;
}
// Each release also says what it holds as the code generator reads it (inventory.tsx libraryOutput).
const fileText = (system: System) => JSON.stringify(systemFile(system, markCanvas, libraryOutput), null, 2);
/** Writes the systems named by `ids` (all of them in this browser's storage, which keeps one list). */
function saveSystems(systems: readonly System[], ids: readonly string[]) {
  const store = disk();
  if (store) for (const system of systems) { if (ids.includes(system.id)) store.write(system.id, fileText(system)); }
  else writeStored("systems", systems.map(system => systemFile(system, markCanvas, libraryOutput)));
}

/** The projects (src/projects.ts), as the systems: Application Support in Electron, this browser's storage otherwise. */
const projectDisk = () => typeof window !== "undefined" ? window.areaDesktop?.projects : undefined;
function openProjects(): Project[] {
  const files = projectDisk()?.read() ?? readStored<unknown[]>("projects", []);
  const projects = loadProjects(Array.isArray(files) ? files : [], RESTORE);
  setProjects(projects);
  return projects;
}
/** Writes the projects named by `ids` (all of them in this browser's storage, which keeps one list). */
function saveProjects(projects: readonly Project[], ids: readonly string[]) {
  const store = projectDisk();
  if (store) for (const project of projects) { if (ids.includes(project.id)) store.write(project.id, JSON.stringify(projectFile(project, markCanvas), null, 2)); }
  else writeStored("projects", projects.map(project => projectFile(project, markCanvas)));
}

/**
 * Writes what changed in a list of systems or projects a moment later (a slider's drag writes once), each to its own
 * file, and before the window closes, so a change in the last moment is kept.
 */
function useWrites<T extends { id: string }>(list: readonly T[], save: (list: readonly T[], ids: readonly string[]) => void) {
  const changed = useRef(new Set<string>());
  const written = useRef(list);
  useEffect(() => {
    for (const entry of list) if (!written.current.includes(entry)) changed.current.add(entry.id);
    // One deleted: its folder is in the Trash already; this browser's one list is written again without it.
    for (const entry of written.current) if (!list.some(other => other.id === entry.id)) changed.current.add(entry.id);
    written.current = list;
    if (!changed.current.size) return;
    const timer = setTimeout(() => { save(list, [...changed.current]); changed.current.clear(); }, 250);
    return () => clearTimeout(timer);
  }, [list]);
  useEffect(() => {
    const flush = () => { if (changed.current.size) { save(written.current, [...changed.current]); changed.current.clear(); } };
    addEventListener("pagehide", flush);
    return () => removeEventListener("pagehide", flush);
  }, []);
}

/** A computed colour (rgb(), color(srgb …), oklab …) as #rrggbb, read from one painted pixel. */
function paintedHex(color: string): string {
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return "";
  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return `#${[r, g, b].map(channel => channel!.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * A theme or setting change lands at once (MOTION.md, "Theme / density change"). Called where a change is written; once
 * the commit has written all of them (a microtask, before the frame), it styles the document once, as the frame would
 * have, and finishes every transition that started, so colours jump rather than fade. It set `data-area-switching`
 * (base.css) for two frames on each scope until 2026-10-25, and taking it off restyled the scope a second time: 130 to
 * 210ms a setting, twice (traced in headless Edge).
 */
let switching = false;
function switchInstantly() {
  if (switching) return;
  switching = true;
  queueMicrotask(() => {
    switching = false;
    for (const animation of document.getAnimations()) if (animation instanceof CSSTransition) animation.finish();
  });
}

/** The Electron shell on macOS (main.tsx sets data-platform, after the imports run, so this is read at render). */
const isMac = () => typeof document !== "undefined" && document.documentElement.dataset.platform === "darwin";

/*
 * Location: a place (src/places.ts), so a selection survives a reload and can be linked. The item is the page's own key
 * (a component's slug, an icon's name, a scale, a type role) and may have parts of its own: Components opens a family's
 * Stage on one tile as <slug>/<tile>.
 *
 * Tabs work as a browser's (Phase 0, owner 2026-10-28): each open tab holds one thing (a system, the Library, a
 * lab) and keeps its own place, its Sidebar (the nav or the page's own list) and its history, which back and forward
 * (⌘[ and ⌘]) walk. The hash mirrors the current tab's place; the tabs and their places are saved and reopen at launch.
 */
interface OpenTab { id: string; place: Place; panel: "nav" | "page"; back: Place[]; forward: Place[] }
interface Tabs { list: OpenTab[]; current: string }

/** The Home tab: always first, always on Home (src/places.ts, HOME_TAB). */
const homeTab = (): OpenTab => ({ id: HOME_TAB, place: { page: "home" }, panel: "nav", back: [], forward: [] });

function openTabs(): Tabs {
  const saved = restoreTabs(readStored("tabs", null), readStored("tab", null), groupOf);
  const list: OpenTab[] = [homeTab(), ...saved.tabs.map(tab => ({ id: tab.id, place: parsePlace(tab.hash)!, panel: tab.panel, back: [], forward: [] }))];
  // A link the app was opened with (electron --hash=, a reload) opens in the current tab; on Home, in a tab of its own.
  const launched = location.hash ? resolve(location.hash, groupOf) : null;
  if (launched?.page === "home") return { list, current: HOME_TAB };
  if (launched) {
    const at = list.findIndex(tab => tab.id === saved.current);
    if (at <= 0) {
      const added: OpenTab = { id: newTabId(), place: launched, panel: LIST_PAGES.has(launched.page) ? "page" : "nav", back: [], forward: [] };
      return { list: [...list, added], current: added.id };
    }
    list[at] = { ...list[at]!, place: launched, panel: launched.page === list[at]!.place.page ? list[at]!.panel : LIST_PAGES.has(launched.page) ? "page" : "nav" };
  }
  return { list, current: saved.current };
}
const newTabId = () => `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** A place visited, for Home's Recent: its hash and when, newest first, one entry a place, at most 24. */
export interface Visit { hash: string; at: number }
function rememberPlace(place: Place) {
  const hash = hrefOf(place);
  const visits = readStored<Visit[]>("recent", []);
  writeStored("recent", [{ hash, at: Date.now() }, ...(Array.isArray(visits) ? visits : []).filter(visit => visit && visit.hash !== hash)].slice(0, 24));
}

/** How a place is opened: in the current tab (the default) or a new one, as a new step of its history or in place of it. */
export interface NavigateOptions { newTab?: boolean; replace?: boolean; panel?: "nav" | "page" }

/** Light, Dark, or as the Mac is set (Settings › Appearance › Mode; the Canvas header's switch sets Light or Dark). */
export type Mode = "system" | "light" | "dark";

interface StudioState {
  query: string;
  setQuery: (query: string) => void;
  /** The app's mode as drawn: which theme's Ground and Layers the Inspector sets. */
  theme: Theme;
  mode: Mode;
  setMode: (mode: Mode) => void;
  /**
   * What the app itself is drawn in (src/app-look.ts; owner, 2026-10-30): the followed system's theme as published, or the
   * app's own settings. `<html>`, the app's scale and the panel widths take it; the specimens take the open theme over it.
   */
  chrome: { canvas: CanvasAxes; material: MaterialState };
  appLook: AppLook;
  setAppLook: (look: AppLook) => void;
  /** Settings, open over the current tab at one of its sections (Cursor's settings), or null. */
  settings: SettingsSection | null;
  openSettings: (section?: SettingsSection) => void;
  closeSettings: () => void;
  /** The name at the Sidebar's foot (Settings › General). */
  profileName: string;
  setProfileName: (name: string) => void;
  canvas: CanvasAxes;
  setCanvas: (axis: keyof CanvasAxes, value: string) => void;
  /** The Canvas's Material (src/material.ts): a bundle and the levers moved away from it. */
  material: MaterialState;
  /** Load a bundle: every lever returns to it, and the Layers settings it is drawn for (Soft's gray, flat page) apply. */
  setMaterialBundle: (bundle: string) => void;
  /** Move one lever, switch or the stroke styles; its bundle's own value clears the override. */
  setMaterialValue: (key: string, value: string) => void;
  /**
   * Hover preview (owner, 2026-10-18: "see more visibly what each change means"; docs/research/settings-pickers-2026-10-18):
   * the option a setting's list is on paints the Canvas until the list closes, without being saved. `null` ends it.
   */
  previewCanvas: (axis: keyof CanvasAxes, value: string | null) => void;
  /** The Material a list is on (a bundle, or one lever moved), or `null`. */
  previewMaterial: (state: MaterialState | null) => void;
  /** What the Canvas paints: the saved settings with any preview over them. */
  shown: { canvas: CanvasAxes; material: MaterialState; colours: ColoursState };
  /** The Canvas's exact page colours (src/colours.ts): a pick per mode, or none where the page settings decide. */
  colours: ColoursState;
  setColours: (patch: Partial<ColoursState>) => void;
  /** The Canvas's exact accent (src/brand.ts): off, Area's palette, or up to three exact colours. */
  brand: BrandState;
  setBrand: (patch: Partial<BrandState>) => void;
  /** The workspace's systems (src/systems.ts), Area first. */
  systems: readonly System[];
  /**
   * The open system: the current tab's, or on Home, the Library or a lab the last one a tab showed. Its chosen theme is what
   * `canvas`, `material`, `colours` and `brand` are, what the Inspector's Theme view edits and every page paints in.
   */
  openSystem: System;
  /** The open system's chosen theme. */
  openTheme: SystemTheme;
  /** A new system from the Area Starter (or a described one, which the Setup chat then makes): saved, not yet opened. */
  createSystem: (name: string, origin: SystemOrigin) => System;
  renameSystem: (id: string, name: string) => void;
  /** Moves a system's folder to the Trash and closes its tabs. The Area system stays. */
  deleteSystem: (id: string) => void;
  /**
   * The open system's working copy (what its owners edit in place). `openSystem` is it, or its Live release where the tab
   * shows Live: a project's tab always (a project uses what the Library publishes), a system's tab when Live is chosen.
   */
  workingSystem: System;
  /** Whether the tab shows its system as published rather than its working copy. */
  live: boolean;
  /** A system tab's switch between Live and Working; editing anything switches back to Working. */
  setLive: (live: boolean) => void;
  /** What the open system's working copy changed since Live. */
  changes: Change[];
  /**
   * Changes the open system's library (src/library.ts: what it includes and how each family is built, for every theme).
   * Shown Live, the edit switches the tab to the working copy, as a theme's does; a project's tab never edits it.
   */
  updateLibrary: (change: (library: SystemLibrary) => SystemLibrary) => void;
  /** Publishes the open system's working copy as its next version. */
  publishSystem: (kind: Exclude<ReleaseKind, "first">, note: string) => void;
  /** Sets the open system's working copy back to Live, or to an earlier version. */
  revertSystem: (version?: string) => void;
  /** The workspace's projects (src/projects.ts), oldest first. */
  projects: readonly Project[];
  /** The current tab's project, or null in any other tab. */
  openProject: Project | null;
  createProject: (name: string, system: string, theme: string) => Project;
  /** Changes a project (its pages, layers, explorations or versions). */
  updateProject: (id: string, change: (project: Project) => Project) => void;
  /** Moves a project's folder to the Trash and closes its tabs. */
  deleteProject: (id: string) => void;
  /** Publishes one of the open project's explorations to its system: in place of the theme it came from, or as a new one. */
  publishExploration: (id: string, replaces: boolean, kind: Exclude<ReleaseKind, "first">, note: string) => void;
  /** Makes one of the open system's themes its chosen one. */
  chooseTheme: (id: string) => void;
  /** Adds a theme to the open system at Area's shipped values and chooses it. */
  addTheme: () => SystemTheme;
  /** Where the current tab is. */
  place: Place;
  /** Open a place (src/places.ts). */
  navigate: (place: Place, options?: NavigateOptions) => void;
  item?: string;
  /** Go to an item on the current page. `replace` swaps the current history entry (a Stage's tile) instead of adding one. */
  select: (item: string, options?: { replace?: boolean }) => void;
  /** The current tab's Sidebar: the nav, or the page's own list taking the panel over (a page with one). */
  panel: "nav" | "page";
  setPanel: (panel: "nav" | "page") => void;
  sidebar: boolean;
  inspector: boolean;
  /** The Inspector's view (Theme, Design or Code), kept across tabs and launches. */
  inspectorView: InspectorView;
  setInspectorView: (view: InspectorView) => void;
  /** Shows the Inspector if it is hidden (the Chat view's ⌘L). */
  showInspector: () => void;
}
const StudioContext = createContext<StudioState | null>(null);
export const useStudio = () => {
  const state = useContext(StudioContext);
  if (!state) throw new Error("useStudio outside <Studio>");
  return state;
};

const prefersDark = () => typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches;

export function Studio() {
  // The systems first: the saved tabs' places name them.
  const [systems, setSystemList] = useState<System[]>(openSystems);
  setSystems(systems);
  const [projects, setProjectList] = useState<Project[]>(openProjects);
  setProjects(projects);
  const [tabs, setTabs] = useState<Tabs>(openTabs);
  const tab = tabs.list.find(entry => entry.id === tabs.current) ?? tabs.list[0]!;
  const { place } = tab;
  const item = place.item;
  // The open system: the current tab's, a project tab's system, else the last a tab showed (Home, References and labs
  // paint in it).
  const openProject = tabKind(place) === "project" ? projects.find(entry => entry.id === place.project) ?? null : null;
  const lastSystem = useRef(AREA_ID);
  if (tabKind(place) === "system") lastSystem.current = place.system ?? AREA_ID;
  if (openProject) lastSystem.current = openProject.system;
  const workingSystem = systems.find(entry => entry.id === lastSystem.current) ?? systems[0]!;
  // Systems shown Live in their tabs. A project always sees its system as published.
  const [liveViews, setLiveViews] = useState<ReadonlySet<string>>(() => new Set());
  const live = Boolean(openProject) || (tabKind(place) === "system" && liveViews.has(workingSystem.id));
  // A project sees its system as the version it follows (systems.ts followedVersion; docs/research/system-inventory-2026-11-08
  // Q7): its own, and the Fixes and Adds after it, until a release that Needs work in products waits for its Update.
  const projectRelease = openProject ? followedVersion(workingSystem, openProject.release) : null;
  const openSystem = useMemo(() => projectRelease ? asRelease(workingSystem, projectRelease) : live ? asLive(workingSystem) : workingSystem, [projectRelease, live, workingSystem]);
  const exploration = openProject && place.page === "exploration" ? openProject.explorations.find(entry => entry.id === item) ?? null : null;
  const openTheme = exploration?.theme
    ?? (openProject ? openSystem.themes.find(entry => entry.id === openProject.theme) ?? activeTheme(openSystem) : activeTheme(openSystem));
  const { canvas, material, colours, accent: brand } = openTheme;
  const changes = useMemo(() => changesOf(workingSystem), [workingSystem]);
  useWrites(systems, saveSystems);
  useWrites(projects, saveProjects);
  // What the Inspector's Theme view edits: an exploration in its project's tab, else the open system's working copy (a
  // project's other pages edit nothing: they show the system as published).
  const editing = useRef({ system: workingSystem.id, project: openProject?.id, exploration: exploration?.id, live });
  editing.current = { system: workingSystem.id, project: openProject?.id, exploration: exploration?.id, live };
  /** Leaves Live for the working copy: editing a system shown Live edits what will be published next. */
  const toWorking = useCallback((id: string) => setLiveViews(views => { if (!views.has(id)) return views; const next = new Set(views); next.delete(id); return next; }), []);
  /** Changes the edited theme. */
  const updateTheme = useCallback((change: (theme: SystemTheme) => SystemTheme) => {
    const at = editing.current;
    if (at.exploration) {
      setProjectList(list => list.map(project => project.id !== at.project ? project
        : { ...project, explorations: project.explorations.map(entry => entry.id === at.exploration ? { ...entry, theme: change(entry.theme) } : entry) }));
      return;
    }
    if (at.project) return;
    if (at.live) toWorking(at.system);
    setSystemList(list => list.map(entry => entry.id === at.system ? withTheme(entry, change) : entry));
  }, [toWorking]);
  /** Changes the edited system's library (every theme shares it). */
  const updateLibrary = useCallback((change: (library: SystemLibrary) => SystemLibrary) => {
    const at = editing.current;
    if (at.project) return;
    if (at.live) toWorking(at.system);
    setSystemList(list => list.map(entry => entry.id === at.system ? { ...entry, library: change(entry.library) } : entry));
  }, [toWorking]);
  // The mode is saved as "light", "dark" or "system" (src/theme.js reads it before first paint and follows the Mac for
  // anything but light or dark); the theme drawn is the mode, or the Mac's while it is System.
  // A launch's ?theme= (electron/main.cjs --theme, for captures) wins, as src/theme.js lets it.
  const [mode, setModeState] = useState<Mode>(() => {
    const saved = new URLSearchParams(location.search).get("theme") ?? readStored<string>("theme", "system");
    return saved === "light" || saved === "dark" ? saved : "system";
  });
  const [osDark, setOsDark] = useState(prefersDark);
  useEffect(() => {
    if (typeof matchMedia !== "function") return;
    const query = matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setOsDark(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  const theme: Theme = mode === "system" ? (osDark ? "dark" : "light") : mode;
  const setMode = useCallback((next: Mode) => { setModeState(next); writeStored("theme", next); }, []);
  // The app's own look (src/app-look.ts): Area's chosen theme as published until the person picks another in Settings.
  const [appLook, setAppLookState] = useState<AppLook>(() => {
    const look = restoreAppLook(readStored("appLook", null), CANVAS_DEFAULTS);
    // The canvas restores as a theme's does (old values, unknown options); the Material as Material does.
    return { ...look, own: restoreCanvas(look.own), ...(look.material ? { material: restoreMaterial(look.material) } : {}) };
  });
  const setAppLook = useCallback((look: AppLook) => { setAppLookState(look); writeStored("appLook", look); }, []);
  const [settings, setSettings] = useState<SettingsSection | null>(null);
  // ⌘, toggles Settings (Cursor's). The app menu's accelerator and the window's key handler may both see one press, so a
  // second toggle within 200 ms is the same press.
  const toggled = useRef(0);
  const toggleSettings = useCallback(() => {
    const now = performance.now();
    if (now - toggled.current < 200) return;
    toggled.current = now;
    setSettings(current => current ? null : "appearance");
  }, []);
  const [profileName, setProfileNameState] = useState(() => readStored<string>("profileName", "David Tee"));
  const setProfileName = useCallback((name: string) => { setProfileNameState(name); writeStored("profileName", name); }, []);
  const [query, setQuery] = useState("");
  const [panels, setPanels] = useState(() => readStored("panels", { sidebar: true, inspector: true }));
  const [inspectorView, setInspectorViewState] = useState<InspectorView>(() => {
    const saved = readStored<string>("inspectorView", "theme");
    return INSPECTOR_VIEWS.some(entry => entry.id === saved) ? saved as InspectorView : "theme";
  });
  const [previewAxes, setPreviewAxes] = useState<Partial<CanvasAxes>>({});
  const [previewedMaterial, setPreviewedMaterial] = useState<MaterialState | null>(null);
  const [searching, setSearching] = useState<SearchFor>(null);

  // The tabs and each one's place are saved (replacing the old Titlebar's saved tab), and the hash shows the current place.
  useEffect(() => {
    writeStored("tabs", { tabs: tabs.list.filter(entry => entry.id !== HOME_TAB).map(entry => ({ id: entry.id, hash: hrefOf(entry.place), panel: entry.panel })), current: tab.id });
    const hash = hrefOf(place);
    if (location.hash !== hash) history.replaceState(null, "", hash);
  }, [tabs, tab.id, place]);
  // Home's Recent: the places visited, newest first (src/pages/home.tsx).
  useEffect(() => { if (place.page !== "home") rememberPlace(place); }, [place]);

  /** Changes the current tab, or opens a new one. */
  const navigate = useCallback((to: Place, options: NavigateOptions = {}) => {
    setSettings(null);
    setTabs(current => {
      const open = current.list.find(entry => entry.id === current.current) ?? current.list[0]!;
      // Home is its own tab, whatever opens it; what is chosen on it changes there.
      if (to.page === "home") return navigateIn({ ...current, current: HOME_TAB }, current.list[0]!, to, { ...options, newTab: false });
      // A system's page without a system is the current tab's system's (a page's own links; a project's system in its
      // tab), else the open one's; a project's page without a project is the current tab's project's.
      const next: Place = tabKind(to) === "system" && !to.system ? { ...to, system: tabKind(open.place) === "system" ? open.place.system ?? AREA_ID : lastSystem.current }
        : tabKind(to) === "project" && !to.project ? { ...to, project: open.place.project } : to;
      // A tab never changes what it holds (owner, 2026-10-29: "the tab itself … will always just be the project itself"):
      // a place in another system, project or References opens in the tab already holding it, else a new tab.
      if (!options.newTab && tabHolds(next) !== tabHolds(open.place)) {
        const holder = current.list.find(entry => entry.id !== HOME_TAB && tabHolds(entry.place) === tabHolds(next));
        if (!holder) return navigateIn(current, open, next, { ...options, newTab: true });
        return navigateIn({ ...current, current: holder.id }, holder, next, options);
      }
      return navigateIn(current, open, next, options);
    });
  }, []);
  /** Opens `next` in `open`, or in a new tab after it. */
  const navigateIn = (current: Tabs, open: OpenTab, next: Place, options: NavigateOptions): Tabs => {
      const samePage = next.page === open.place.page && next.group === open.place.group;
      const panel = options.panel ?? (samePage && !options.newTab ? open.panel : LIST_PAGES.has(next.page) ? "page" : "nav");
      if (options.newTab) {
        const added: OpenTab = { id: newTabId(), place: next, panel, back: [], forward: [] };
        // Next to the tab it came from; from Home, at the end (Figma's file browser).
        const at = open.id === HOME_TAB ? current.list.length - 1 : current.list.indexOf(open);
        return { list: [...current.list.slice(0, at + 1), added, ...current.list.slice(at + 1)], current: added.id };
      }
      if (hrefOf(next) === hrefOf(open.place) && panel === open.panel) return current;
      const changed: OpenTab = options.replace || hrefOf(next) === hrefOf(open.place)
        ? { ...open, place: next, panel }
        : { ...open, place: next, panel, back: [...open.back, open.place].slice(-100), forward: [] };
      return { ...current, list: current.list.map(entry => entry === open ? changed : entry) };
  };
  // A different page starts unfiltered, as a tab change did.
  const pageKey = `${place.page}/${place.group ?? ""}`;
  useEffect(() => setQuery(""), [pageKey, tab.id]);
  /** Back (−1) or forward (+1) through the current tab's places. */
  const step = useCallback((by: -1 | 1) => setTabs(current => {
    const open = current.list.find(entry => entry.id === current.current) ?? current.list[0]!;
    const from = by < 0 ? open.back : open.forward;
    if (!from.length) return current;
    const to = from[from.length - 1]!;
    const samePage = to.page === open.place.page && to.group === open.place.group;
    const changed: OpenTab = by < 0
      ? { ...open, place: to, back: from.slice(0, -1), forward: [...open.forward, open.place], panel: samePage ? open.panel : LIST_PAGES.has(to.page) ? "page" : "nav" }
      : { ...open, place: to, forward: from.slice(0, -1), back: [...open.back, open.place], panel: samePage ? open.panel : LIST_PAGES.has(to.page) ? "page" : "nav" };
    return { ...current, list: current.list.map(entry => entry === open ? changed : entry) };
  }), []);
  const selectTab = useCallback((id: string) => setTabs(current => current.list.some(entry => entry.id === id) ? { ...current, current: id } : current), []);
  /** Tabs closed this session, newest last, with where each stood: ⌘⇧T reopens them in turn. */
  const closed = useRef<Array<{ tab: OpenTab; at: number }>>([]);
  /** Closes a tab; the one after it (or before, at the end) takes its place, Home once none is left. Home never closes. */
  const closeTab = useCallback((id: string) => setTabs(current => {
    const at = current.list.findIndex(entry => entry.id === id);
    if (at <= 0 || id === HOME_TAB) return current;
    closed.current = [...closed.current.filter(entry => entry.tab.id !== id), { tab: current.list[at]!, at }].slice(-20);
    const list = current.list.filter(entry => entry.id !== id);
    return { list, current: current.current === id ? list[Math.min(at, list.length - 1)]!.id : current.current };
  }), []);
  /*
   * The tab commands (the app menu's, electron/main.cjs, and the same keys in a browser where it lets them through): ⌘T
   * new tab (search), ⌘⇧T reopen the last closed tab where it stood, ⌘⇧H Home, ⌘W close the current tab (Home stays),
   * ⌃Tab and ⌃⇧Tab the next and previous tab (Home among them), ⌘1–8 that tab after Home and ⌘9 the last, as a browser
   * numbers its tabs and Figma its file tabs after the fixed Home tab.
   */
  const runTabCommand = useCallback((command: TabCommand, index?: number) => {
    if (command === "new-tab") { setSearching("new"); return; }
    if (command === "settings") { toggleSettings(); return; }
    if (command === "close-tab") { closeTab(tabsRef.current.current); return; }
    if (command === "home") { setTabs(current => current.current === HOME_TAB ? current : { ...current, current: HOME_TAB }); return; }
    setTabs(current => {
      const at = current.list.findIndex(entry => entry.id === current.current);
      if (command === "reopen-tab") {
        const last = closed.current.pop();
        if (!last) return current;
        const tab = { ...last.tab, id: current.list.some(entry => entry.id === last.tab.id) ? newTabId() : last.tab.id };
        const list = [...current.list.slice(0, last.at), tab, ...current.list.slice(last.at)];
        return { list, current: tab.id };
      }
      const to = command === "next-tab" ? (at + 1) % current.list.length
        : command === "previous-tab" ? (at - 1 + current.list.length) % current.list.length
        : index === 9 ? current.list.length - 1 : (index ?? 1);
      const target = current.list[to];
      return target && target.id !== current.current ? { ...current, current: target.id } : current;
    });
  }, [closeTab]);
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;
  // The systems as last rendered, so a system made and opened in one handler is already known to the places.
  const systemsRef = useRef(systems);
  systemsRef.current = systems;
  const projectsRef = useRef(projects);
  projectsRef.current = projects;
  useEffect(() => window.areaDesktop?.onCommand?.(runTabCommand), [runTabCommand]);

  // A link followed natively (an old #components/button in a page's text, a hand-typed hash) opens in the current tab; a
  // hash that names no place (an example screen's own "#settings") changes nothing.
  useEffect(() => {
    const onHash = () => {
      const next = resolve(location.hash, groupOf);
      if (next) navigate(next);
    };
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, [navigate]);

  // The theme is the whole app's, Titlebar included. Area's colours are light-dark() pairs, and
  // Chromium can keep a cached colour when color-scheme flips (docs/THEMING.md): one synchronous
  // restyle re-resolves everything before the next paint.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-area-theme", theme);
    root.style.display = "none"; void root.offsetHeight; root.style.display = "";
    switchInstantly();
    window.areaDesktop?.setTheme(theme);
  }, [theme]);

  // The app is drawn in its chosen system's published theme, or settings of its own (owner, 2026-10-30: "it should follow
  // the chosen system, which can be updated in a settings page"; src/app-look.ts). From 2026-10-25 it was Area's shipped
  // defaults, and before that every committed Inspector setting. <html> carries it, so the Sidebar, the Canvas's own chrome
  // and the Inspector change when that theme is published or the person picks another; the Inspector's settings paint the
  // specimens alone (src/specimen-scope.tsx), over the app's look.
  const appliedPicks = useRef<string[]>([]);
  // The Mac's increased contrast (Settings › Appearance, Follow your Mac's contrast): while it is on, it wins over a theme's
  // own contrast, as the tokens follow it wherever no contrast is set.
  const moreContrast = useMacPreference("(prefers-contrast: more)");
  const chrome = useMemo(() => {
    const look = chromeOf(appLook, systems, MATERIAL_DEFAULT);
    const canvas = look.canvas as CanvasAxes, material = look.material as MaterialState;
    return {
      canvas: appLook.followContrast !== false && moreContrast ? { ...canvas, contrast: "system" } as CanvasAxes : canvas,
      // Reduce transparency: the Material's see-through levers at 0, as prefers-reduced-transparency resolves (material.css).
      material: appLook.reduceTransparency ? { ...material, overrides: { ...material.overrides, transparency: "0", frost: "0" } } : material,
    };
  }, [appLook, systems, moreContrast]);
  // Written as an insertion effect, which runs before every layout effect of the commit, so the first layout read in the
  // commit (a Segmented measuring its thumb) finds <html> styled.
  useInsertionEffect(() => {
    const root = document.documentElement;
    const picks = canvasAttributes(chrome.canvas, chrome.material);
    for (const name of appliedPicks.current) if (!(name in picks) || picks[name as keyof typeof picks] === undefined) root.removeAttribute(name);
    for (const [name, value] of Object.entries(picks)) if (value !== undefined) root.setAttribute(name, value);
    appliedPicks.current = Object.keys(picks);
    switchInstantly();
  }, [chrome]);
  useLayoutEffect(() => {
    // Read back on the next frame, so the restyle is the browser's own rather than forced here.
    const frame = requestAnimationFrame(() => {
      // The window's own ground (seen while it resizes) is the page's, as the chosen ground paints it.
      window.areaDesktop?.setGround?.(paintedHex(getComputedStyle(document.body).backgroundColor));
      // The traffic lights stay centred on the headers' line, which grows with type and density (39 at 13 Compact, 53 at 14/32).
      // Floating panels set the headers 8 down, so the lights centre on the header's middle, not its height's.
      const head = document.querySelector(".studio-head")?.getBoundingClientRect();
      if (head?.height) window.areaDesktop?.setTitlebar?.(head.top * 2 + head.height);
    });
    return () => cancelAnimationFrame(frame);
  }, [chrome, theme, appLook.panels]);

  // Shortcuts, as the Tooltips name them: ⌘B and ⌥⌘B show and hide the Sidebar and the Inspector (Cursor's and VS Code's
  // primary and secondary side bars); ⌘[ and ⌘] go back and forward through the tab's places (Finder, Safari, Cursor).
  // ⌘K opens search (src/search-palette.tsx), ⌘T search for a new tab (a browser's new tab).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && !event.altKey && event.code === "KeyH") { event.preventDefault(); runTabCommand("home"); return; }
      if (!(event.metaKey || event.ctrlKey) || event.shiftKey) return;
      const key = event.code === "KeyB" ? "b" : event.code === "BracketLeft" ? "[" : event.code === "BracketRight" ? "]" : event.code === "KeyT" ? "t" : event.code === "Comma" ? "," : "";
      // ⌘, opens Settings (every Mac app's key; the app menu's Settings… in Electron).
      if (key === "," && !event.altKey) { event.preventDefault(); toggleSettings(); return; }
      // In Electron the app menu takes ⌘T, ⌘W, ⌘1–9 and ⌃Tab (runTabCommand); a browser keeps most of them for itself.
      if (key === "t" && !event.altKey) { event.preventDefault(); runTabCommand("new-tab"); }
      else if (key === "b") { event.preventDefault(); togglePanel(event.altKey ? "inspector" : "sidebar"); }
      else if ((key === "[" || key === "]") && !event.altKey) { event.preventDefault(); step(key === "[" ? -1 : 1); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [step, runTabCommand]);

  const togglePanel = (panel: "sidebar" | "inspector") => setPanels(current => {
    const next = { ...current, [panel]: !current[panel] };
    writeStored("panels", next);
    return next;
  });

  // The app's chrome inside the Canvas (tile heads, section titles) at the app's own type and density (src/app-scale.ts).
  const scale = useMemo<AppScale>(() => ({ "data-area-type": chrome.canvas.type, "data-area-density": chrome.canvas.density }), [chrome]);
  const state = useMemo<StudioState>(() => ({
    query,
    setQuery,
    theme,
    mode,
    setMode,
    chrome,
    appLook,
    setAppLook,
    settings,
    openSettings: section => setSettings(section ?? "appearance"),
    closeSettings: () => setSettings(null),
    profileName,
    setProfileName,
    canvas,
    setCanvas: (axis, value) => updateTheme(current => {
      // A page setting written hands its mode's page back to the settings: the pick would hide it.
      const dropped = (["light", "dark"] as const).filter(mode => current.colours[mode] !== null && PAGE_AXES[mode].includes(axis));
      return { ...current, canvas: { ...current.canvas, [axis]: value }, colours: dropped.length ? { ...current.colours, ...Object.fromEntries(dropped.map(mode => [mode, null])) } : current.colours };
    }),
    material,
    setMaterialBundle: bundle => updateTheme(current => {
      // Loading a bundle applies the Layers settings it is drawn for (Soft's gray, flat page).
      const layers = MATERIAL_BUNDLES[bundle]?.layers ?? {};
      return { ...current, material: { bundle, overrides: {} }, canvas: Object.keys(layers).length ? { ...current.canvas, ...layers } : current.canvas };
    }),
    setMaterialValue: (key, value) => updateTheme(current => {
      const { [key]: _, ...rest } = current.material.overrides;
      return { ...current, material: { ...current.material, overrides: value === bundleValue(current.material.bundle, key) ? rest : { ...rest, [key]: value } } };
    }),
    previewCanvas: (axis, value) => setPreviewAxes(current => {
      if (value === null) { if (!(axis in current)) return current; const { [axis]: _, ...rest } = current; return rest; }
      return current[axis] === value ? current : { ...current, [axis]: value };
    }),
    previewMaterial: setPreviewedMaterial,
    shown: { canvas: { ...canvas, ...previewAxes }, material: previewedMaterial ?? material, colours: shownColours(colours, previewAxes) },
    colours,
    setColours: patch => updateTheme(current => ({ ...current, colours: { ...current.colours, ...patch } })),
    brand,
    setBrand: patch => updateTheme(current => ({ ...current, accent: { ...current.accent, ...patch } })),
    systems,
    openSystem,
    openTheme,
    workingSystem,
    live,
    updateLibrary,
    setLive: on => setLiveViews(views => {
      const id = workingSystem.id;
      if (views.has(id) === on) return views;
      const next = new Set(views);
      if (on) next.add(id); else next.delete(id);
      return next;
    }),
    changes,
    publishSystem: (kind, note) => {
      const id = workingSystem.id;
      toWorking(id);
      setSystemList(list => list.map(entry => entry.id === id ? publish(entry, kind, note) : entry));
    },
    revertSystem: version => {
      const id = workingSystem.id;
      toWorking(id);
      setSystemList(list => list.map(entry => entry.id === id ? revertTo(entry, version) : entry));
    },
    projects,
    openProject,
    createProject: (name, system, theme) => {
      // A project keeps the version it was made with until it updates (systems.ts followedVersion).
      const on = systems.find(entry => entry.id === system);
      const made = newProject(name, system, theme, projectsRef.current.map(entry => entry.id), new Date(), on ? liveOf(on).version : undefined);
      projectsRef.current = [...projectsRef.current, made];
      setProjects(projectsRef.current);
      setProjectList(list => [...list, made]);
      return made;
    },
    // Every change to a project's pages is kept as an iteration (projects.ts recordIteration), whoever made it.
    updateProject: (id, change) => setProjectList(list => list.map(entry => entry.id === id ? recordIteration(entry, change(entry)) : entry)),
    deleteProject: id => {
      projectDisk()?.trash(id);
      setTabs(current => {
        const list = current.list.filter(entry => tabHolds(entry.place) !== `project:${id}`);
        return { list, current: list.some(entry => entry.id === current.current) ? current.current : HOME_TAB };
      });
      setProjectList(list => list.filter(entry => entry.id !== id));
    },
    publishExploration: (id, replaces, kind, note) => {
      const project = openProject;
      const chosen = project?.explorations.find(entry => entry.id === id);
      const system = project && systems.find(entry => entry.id === project.system);
      if (!project || !chosen || !system) return;
      const from = system.themes.find(entry => entry.id === chosen.from);
      const taken = new Set(system.themes.map(entry => entry.id));
      let themeId = `${project.id}-${chosen.id}`, n = 2;
      while (!replaces && taken.has(themeId)) themeId = `${project.id}-${chosen.id}-${n++}`;
      const theme = replaces && from ? { ...chosen.theme, id: from.id, name: from.name } : { ...chosen.theme, id: themeId, name: chosen.name };
      const published = publishTheme(system, theme, replaces && from ? from.id : null, kind, note, project.name);
      const version = published.releases[published.releases.length - 1]!.version;
      setSystemList(list => list.map(entry => entry.id === system.id ? published : entry));
      setProjectList(list => list.map(entry => entry.id !== project.id ? entry
        // Publishing from a project takes it to the version it made (projects.ts `release`).
        : { ...entry, release: version, explorations: entry.explorations.map(other => other.id === id ? { ...other, published: version } : other) }));
    },
    createSystem: (name, origin) => {
      const made = starterSystem(name, systemsRef.current.map(entry => entry.id), RESTORE, origin);
      systemsRef.current = [...systemsRef.current, made];
      setSystems(systemsRef.current);
      setSystemList(list => [...list, made]);
      return made;
    },
    renameSystem: (id, name) => { if (name.trim()) setSystemList(list => list.map(entry => entry.id === id ? { ...entry, name: name.trim() } : entry)); },
    deleteSystem: id => {
      if (id === AREA_ID) return;
      disk()?.trash(id);
      setTabs(current => {
        const list = current.list.filter(entry => tabHolds(entry.place) !== `system:${id}`);
        return { list, current: list.some(entry => entry.id === current.current) ? current.current : HOME_TAB };
      });
      if (lastSystem.current === id) lastSystem.current = AREA_ID;
      setSystemList(list => list.filter(entry => entry.id !== id));
    },
    chooseTheme: id => {
      const systemId = lastSystem.current;
      // A theme only Live has (one removed from the working copy) can't be chosen to edit.
      if (!workingSystem.themes.some(theme => theme.id === id)) return;
      toWorking(systemId);
      setSystemList(list => list.map(entry => entry.id === systemId && entry.themes.some(theme => theme.id === id) ? { ...entry, theme: id } : entry));
    },
    addTheme: () => {
      const made = newTheme(workingSystem, RESTORE);
      const systemId = workingSystem.id;
      toWorking(systemId);
      setSystemList(list => list.map(entry => entry.id === systemId ? { ...entry, themes: [...entry.themes, made], theme: made.id } : entry));
      return made;
    },
    place,
    navigate,
    item,
    select: (next, options) => navigate({ ...place, item: next || undefined }, { replace: options?.replace }),
    panel: tab.panel,
    setPanel: next => navigate(place, { panel: next, replace: true }),
    sidebar: panels.sidebar,
    inspector: panels.inspector,
    inspectorView,
    setInspectorView: view => { writeStored("inspectorView", view); setInspectorViewState(view); },
    showInspector: () => setPanels(current => {
      if (current.inspector) return current;
      const next = { ...current, inspector: true };
      writeStored("panels", next);
      return next;
    }),
  }), [query, theme, mode, setMode, chrome, appLook, setAppLook, settings, profileName, setProfileName, canvas, material, previewAxes, previewedMaterial, brand, colours, systems, openSystem, openTheme, workingSystem, live, updateLibrary, changes, projects, openProject, toWorking, updateTheme, item, place, navigate, tab.panel, panels, inspectorView]);
  // The picks' one rule is in the head while there are any; the scopes that carry the settings carry data-area-colours.
  useColoursSheet(state.shown.colours);

  const references = tabs.list.find(entry => entry.place.page === "references");
  return (
    <StudioContext.Provider value={state}>
    <AppScaleContext.Provider value={scale}>
    {/* <html> carries the app's scale (the chrome's defaults), so chrome outside the Canvas body states none of its own. */}
    <InheritedScaleContext.Provider value={scale}>
      {/* The conversation outlives tabs and views; the Canvas's selection rides along as its context chip. */}
      {/* On a project's page the chip names the page and layer, not their ids ("Dashboard › Analytics dashboard"). */}
      <ChatProvider selection={projectSelection(openProject, place) ?? selectionLabel(item)}>
      <ChatShortcut />
      <div className="studio" data-panels={appLook.panels === "floating" ? "floating" : undefined}>
        {/* No bar across the window (owner, 2026-10-30, after Cursor: "the full sectioning of the ui into 3 distinct parts each
            with their own header"): each region has a header on the window's top line, and this strip under them is the
            window's drag region in Electron, each control in it a hole (app.css). Was Area's Titlebar, Phase 0's variation A. */}
        <div className="studio-drag" aria-hidden="true" />
        <ShellContext.Provider value={{
          mac: isMac(),
          // Shown panels draw their side filled, as Cursor's layout toggles do. Each names itself in an Area Tooltip with its
          // shortcut, not the browser's title.
          sidebarToggle: <ChromeButton label={panels.sidebar ? "Hide sidebar" : "Show sidebar"} keys={["⌘", "B"]} shortcut="Meta+B"
            icon={panels.sidebar ? <PanelLeftFilledIcon /> : <PanelLeftIcon />} onClick={() => togglePanel("sidebar")} />,
          history: <>
            <ChromeButton label="Back" keys={["⌘", "["]} shortcut="Meta+BracketLeft" icon={<ArrowLeftIcon />} disabled={!tab.back.length} onClick={() => step(-1)} />
            <ChromeButton label="Forward" keys={["⌘", "]"]} shortcut="Meta+BracketRight" icon={<ArrowRightIcon />} disabled={!tab.forward.length} onClick={() => step(1)} />
          </>,
          search: <SearchEverything open={searching} onOpenChange={setSearching} />,
          tabs: <AppTabs tabs={tabs.list} current={tab.id} onSelect={selectTab} onClose={closeTab} onNew={() => setSearching("new")} />,
          canvasEnd: <>
            <ChromeButton label="References" icon={<BookmarkIcon />}
              onClick={() => references ? selectTab(references.id) : navigate({ page: "references" }, { newTab: true })} />
          </>,
          inspectorToggle: <ChromeButton label={panels.inspector ? "Hide inspector" : "Show inspector"} keys={["⌥", "⌘", "B"]} shortcut="Alt+Meta+B"
            icon={panels.inspector ? <PanelRightFilledIcon /> : <PanelRightIcon />} onClick={() => togglePanel("inspector")} />,
        }}>
        {/* Keyed by tab, so a tab opens on its own page's state rather than the last tab's. Settings opens over the tab. */}
        <Fragment key={settings ? "settings" : tab.id}>{
          settings ? <SettingsPage section={settings} onSection={setSettings} /> :
          place.page === "home" ? <HomePage /> :
          place.page === "projects" ? <ProjectsPage /> :
          place.page === "systems" ? <SystemsPage /> :
          place.page === "themes" ? <ThemesPage /> :
          place.page === "theme-setup" ? <ThemePage flow="setup" /> :
          // Foundations is gone (2026-10-30); its old links open Themes, on the setting they named.
          place.page === "foundations" || place.page === "settings" ? <ThemesPage /> :
          place.page === "components" ? <ComponentsPage /> :
          place.page === "typography" ? <TypographyPage /> :
          place.page === "tokens" ? <TokensPage /> :
          place.page === "spacing" || place.page === "shape" || place.page === "elevation" || place.page === "motion" ? <FoundationPage key={place.page} id={place.page} /> :
          place.page === "icons" ? <IconsPage /> :
          place.page === "illustrations" ? <IllustrationsPage /> :
          place.page === "patterns" ? <ExamplesPage /> :
          place.page === "history" ? <HistoryPage /> :
          place.page === "project" ? <ProjectOverview /> :
          place.page === "project-page" ? <ProjectPageView /> :
          place.page === "exploration" ? <ExplorationPage /> :
          place.page === "versions" ? <VersionsPage /> :
          place.page === "materials" ? <MaterialsPage /> :
          place.page === "tests" ? <ExamplesPage lab /> :
          place.page === "feed" ? <FeedLabPage /> :
          place.page === "chat" ? <ChatLabPage /> :
          place.page === "references" ? <ImageryPage /> : <ColorPage />
        }</Fragment>
        </ShellContext.Provider>
      </div>
      </ChatProvider>
    </InheritedScaleContext.Provider>
    </AppScaleContext.Provider>
    </StudioContext.Provider>
  );
}

/** The window's controls, which the Workspace places in its regions' headers (the Titlebar held them until 2026-10-30). */
interface Shell {
  /** macOS: the first header on the window's start clears the traffic lights. */
  mac: boolean;
  sidebarToggle: ReactNode;
  history: ReactNode;
  search: ReactNode;
  tabs: ReactNode;
  canvasEnd: ReactNode;
  inspectorToggle: ReactNode;
}
const ShellContext = createContext<Shell | null>(null);

/**
 * An icon Button in the app's chrome (Titlebar, Inspector headings): ghost, neutral, small, named
 * by its label, which an Area Tooltip shows below it with the shortcut, if any.
 */
export function ChromeButton({ label, icon, keys, shortcut, onClick, pressed, disabled, tabIndex }: { label: string; icon: ReactNode; keys?: string[]; shortcut?: string; onClick: () => void; pressed?: boolean; disabled?: boolean; tabIndex?: number }) {
  // The tooltip repeats the name, so it only shows; the shortcut reaches assistive tech as
  // aria-keyshortcuts ("Meta+B").
  return (
    <Tooltip side="bottom" describes={false} trigger={
      <Button variant="ghost" tone="neutral" size="sm" iconOnly className="studio-bar-icon" icon={icon} aria-label={label} aria-pressed={pressed} aria-keyshortcuts={shortcut} disabled={disabled} tabIndex={tabIndex} onClick={onClick} />
    }>
      {label}{keys ? <> <Kbd keys={keys} size="sm" /></> : null}
    </Tooltip>
  );
}

/* --- Workspace: Sidebar | Canvas | Inspector -------------------------------- */

/*
 * Panel widths, resizable from the inner edge and kept across tabs and launches. Sidebar: Panel's
 * own 240 (a pick), 200 to 360, at type 13, scaled by type / 13 and kept in type-13 pixels (its long names end in an
 * ellipsis by design). Inspector: up to Panel's 500, never narrower than its one-row controls need to show their
 * whole labels (at 240 a label-beside Segmented clipped "Compact" by 4). The app takes the chosen type and density
 * (PRODUCT_UI.md rule 18), so that floor is measured per pair: the narrowest width at which no label's text exceeds
 * its box, rounded up to the 4 grid (2026-10-22: 255 → 256 at 13/28, 366 → 368 at 16/36).
 */
const WIDTHS = {
  sidebar: { initial: 240, min: 200, max: 360 },
  inspector: { initial: 256, min: 256, max: 500 },
} as const;
// Since 2026-10-30 its header holds its views and its toggle (the Titlebar held the toggle), and that row is the wider
// need: the views at their natural width, the toggle, the bar's insets and a gap, measured per pair and rounded up to the 4
// grid (13/32: 272 → 296); the larger of that and the controls' floor.
const INSPECTOR_FLOOR: Record<string, number> = {
  "12/28": 268, "12/32": 284, "12/36": 284,
  "13/28": 280, "13/32": 296, "13/36": 328,
  "14/28": 304, "14/32": 324, "14/36": 352,
  "15/28": 348, "15/32": 348, "15/36": 376,
  "16/28": 360, "16/32": 360, "16/36": 388,
};

/**
 * The Sidebar's least width while it holds a section's list (Components' tiles four levels down, a page's layers with
 * their pictures, Colors' scales; owner, 2026-11-01: "in pages where more room is needed, the left nav can automatically
 * expand slightly to a minimum width"): Claude's sidebar, `--df-sidebar-width: 288px` (desktop 4.4212 bundle,
 * docs/research/claude-code-ui-audit-2026-10-31.md), at type 13, scaled as the rest. A width dragged wider is kept; on
 * a page without a list the Sidebar goes back to its own width. Panel eases the change (MOTION.md, "Panel width").
 */
const LIST_FLOOR = 288; /* spec: Claude's sidebar */

function usePanelWidth(panel: keyof typeof WIDTHS, type: string, density: string, floor?: number) {
  const limits = WIDTHS[panel];
  const scale = panel === "sidebar" ? (Number(type) || 13) / 13 : 1;
  const max0 = Math.round(limits.max * scale);
  const least = panel === "inspector" ? INSPECTOR_FLOOR[`${type}/${density}`] ?? limits.min : Math.round(limits.min * scale);
  // A page's floor raises the least width, never past the most.
  const min = Math.max(least, Math.min(max0, floor ? Math.round(floor * scale) : 0));
  const max = Math.max(min, max0);
  const [base, setBase] = useState(() => {
    const saved = Number(readStored<Record<string, number>>("widths", {})[panel]);
    return saved >= limits.min && saved <= limits.max ? saved : limits.initial;
  });
  const onWidthChange = (next: number) => {
    const kept = Math.min(limits.max, Math.max(limits.min, Math.round(next / scale)));
    setBase(kept);
    writeStored("widths", { ...readStored<Record<string, number>>("widths", {}), [panel]: kept });
  };
  return { width: Math.min(max, Math.max(min, Math.round(base * scale))), onWidthChange, minWidth: min, maxWidth: max };
}

export interface WorkspaceProps {
  /**
   * The page's own list, in a <SidebarList>: it takes the Sidebar over, under a back row to the nav and a filter (Phase 0's
   * takeover). A page without one leaves it out, and the Sidebar shows the nav (src/app-nav.tsx).
   */
  sidebar?: ReactNode;
  /** At the start of the Canvas bar: the way back from a nested view (a family's Stage), or what the Canvas shows. */
  canvasLead?: ReactNode;
  /**
   * A region the tab draws itself in the Sidebar's place, at the app's scale like the Inspector, shown whatever the
   * Sidebar toggle says: Theme setup's chat (a Panel of its own). Its bar sits on the line the Canvas header shares, so
   * the Canvas header holds the view's controls and no row of its own is added (owner, 2026-10-28: "fix the header on the
   * theme page").
   */
  lead?: ReactNode;
  /** What the Canvas shows (a family, "All icons"): the region's accessible name, not drawn
      (owner, 2026-10-14: no titles over the Canvas or the Inspector, as Framer and Figma). */
  canvasTitle: string;
  /** The Canvas's header: filters and the view's options (src/view-controls.tsx). */
  canvasActions?: ReactNode;
  canvas: ReactNode;
  /**
   * The Inspector: its three views (InspectorViews), or one body with no views (a lab tab). Every page has Design (what is
   * chosen, else the page itself); Theme where the Canvas draws in the open theme; Code where what is chosen is code. A page
   * leaves out a view it has nothing for, and the shell leaves out its tab (rule 14: a control that does not apply is left
   * out). Left out, the page has no Inspector and no toggle for one (Settings).
   */
  inspector?: ReactNode | InspectorViews;
  /** Pinned at the Design view's foot, as Chat's composer is at its view's (a project page's change log). */
  inspectorFooter?: ReactNode;
  /** The Sidebar's own nav in place of the tab's (Settings' sections). */
  nav?: ReactNode;
  /**
   * The Sidebar and the Inspector: shown as the person last left them (the default), or left out for a view that is its
   * own two panels (Setup, owner 2026-10-24: "dont need all these panels open ... a 2 panel view"). Leaving them out never
   * changes the saved panels, so the other tabs keep theirs.
   */
  panels?: boolean;
  /** The Canvas's scrolling body (fitting tiles, scrolling a selection into view). */
  canvasRef?: Ref<HTMLDivElement>;
  /** Attributes the Canvas's body takes beyond the Inspector's settings: a tab's own preview (the Theme tab's mode). */
  canvasScope?: Record<string, string>;
  /**
   * Whether the Canvas's body carries the Inspector's settings (true by default). A tab that sets them (the Theme tab)
   * passes false, so its own questions, buttons and cards stay at the app's defaults while a person chooses, and scopes
   * its previews with `canvasAttributes` itself (owner, 2026-10-21: "the theming experience does not change its own ui
   * as you make choices").
   */
  canvasPicks?: boolean;
}

/** The Inspector's settings and the Material as the attributes a scope takes (the Canvas's body, or a preview's). */
/** Whether a media query about the Mac's settings matches, kept current as the Mac's settings change. */
function useMacPreference(query: string): boolean {
  const [matches, setMatches] = useState(() => typeof matchMedia === "function" && matchMedia(query).matches);
  useEffect(() => {
    if (typeof matchMedia !== "function") return;
    const list = matchMedia(query);
    const change = () => setMatches(list.matches);
    list.addEventListener("change", change);
    change();
    return () => list.removeEventListener("change", change);
  }, [query]);
  return matches;
}

export function canvasAttributes(shown: CanvasAxes, material: Parameters<typeof materialAttributes>[0]): Record<string, string | undefined> {
  return { "data-area-neutral": shown.neutral, "data-area-tint-hue": shown["tint-hue"], "data-area-tint-hue-dark": shown["tint-hue-dark"], "data-area-tint-light": shown["tint-light"], "data-area-tint-dark": shown["tint-dark"], "data-area-ink-tint": shown["ink-tint"], "data-area-accent": shown.accent, "data-area-accent-strength": shown["accent-strength"], "data-area-solid-light": shown["solid-light"], "data-area-solid-dark": shown["solid-dark"], "data-area-label-tint": shown["label-tint"], "data-area-status-colours": shown["status-colours"], "data-area-tone-tint": shown["tone-tint"], "data-area-tone-contrast": shown["tone-contrast"], "data-area-series-lightness": shown["series-lightness"], "data-area-ground-light": shown["ground-light"], "data-area-ground-dark": shown["ground-dark"], "data-area-layers-light": shown["layers-light"], "data-area-layers-dark": shown["layers-dark"], "data-area-card-tone-light": shown["card-tone-light"], "data-area-card-tone-dark": shown["card-tone-dark"], "data-area-action": shown.action, "data-area-selection": shown.selection, "data-area-contrast": shown.contrast === "system" ? undefined : shown.contrast, "data-area-type": shown.type, "data-area-density": shown.density, "data-area-radius": shown.radius, "data-area-surface": shown.surface, "data-area-shadow-rest": shown["shadow-rest"], "data-area-elevation": shown.elevation, ...Object.fromEntries(DEPTH_LEVER_AXES.map(axis => [`data-area-${axis}`, shown[axis]])), "data-area-motion": shown.motion, "data-area-easing": shown.easing, "data-area-feedback": shown.feedback, "data-area-pills": shown.pills, ...materialAttributes(material) };
}

/**
 * A specimen's own in-page links stay in the specimen: an example screen's "#home" or "#settings", a demo's "#library". The
 * app's own links in the Canvas and the Inspector handle their clicks (and prevent the browser's); a hash link whose click
 * nothing handled is a specimen's, and following it would open Home or the Library (Home's hash is "#home" since Phase 2).
 */
function keepSpecimenLinks(event: ReactMouseEvent<HTMLElement>) {
  if (!event.defaultPrevented && event.target instanceof Element && event.target.closest("a[href^='#']")) event.preventDefault();
}

/*
 * Three columns, each with its own header on the window's top line (owner, 2026-10-30, after Cursor's agents window; a
 * Titlebar spanned them until then), and no titles (owner, 2026-10-14, after Framer and Figma):
 *   Sidebar    its Panel's bar: the window controls' room (macOS), the Sidebar's toggle and search; back and forward at
 *              its end. The profile and Settings at its foot.
 *   Canvas     a plain Titlebar: the open tabs; References at its end (light and dark are Settings › Appearance's Mode,
 *              owner 2026-11-07). With the Sidebar hidden it starts
 *              with the window controls' room, the toggle, search and back and forward; with the Inspector hidden it ends
 *              with that toggle.
 *   Inspector  its Panel's bar: its views, and its toggle at the end.
 * Under them, on one line, the Canvas's view options and the Sidebar's first row; the Inspector's first heading sits a
 * little under it. The Sidebar and Inspector inset their content by Panel's md inset (14, 18 at Comfortable), the Canvas
 * by its feed margin (src/styles/app.css).
 */
export function Workspace({ sidebar, nav, lead, canvasLead, canvasTitle, canvasActions, canvas, inspector, inspectorFooter, canvasRef, canvasScope, canvasPicks = true, panels = true }: WorkspaceProps) {
  const studio = useStudio();
  const shell = useContext(ShellContext)!;
  const showSidebar = panels && studio.sidebar, showInspector = panels && studio.inspector && inspector !== undefined;
  // Floating panels (app-look.ts AppPanels): the Inspector is a floating Panel, not a docked one.
  const floating = studio.appLook.panels === "floating";
  // The panels take the app's own type and density (its chosen system's theme, src/app-look.ts).
  // With a section's list the Sidebar is at least LIST_FLOOR wide (Settings' own nav keeps the Sidebar's width).
  const sidebarWidth = usePanelWidth("sidebar", studio.chrome.canvas.type, studio.chrome.canvas.density, sidebar && !nav ? LIST_FLOOR : undefined);
  const inspectorWidth = usePanelWidth("inspector", studio.chrome.canvas.type, studio.chrome.canvas.density);
  const chromeAttributes = useMemo(() => canvasAttributes(studio.chrome.canvas, studio.chrome.material), [studio.chrome]);
  // The body, its cards, titles and header are app UI, at the shipped defaults; only the specimens inside take the
  // Inspector's settings and the Material (owner, 2026-10-26: "the actual components themselves that sit inside the
  // containers would be the only things that update with the controls"), through the scope the tiles, the Stage and the
  // samples read (src/specimen-scope.tsx). A tab that keeps its previews to itself (the Theme tab) gives its specimens no
  // scope and restates the Setup scale; System Contrast writes no attribute, so it states the OS's level itself.
  const systemContrast = typeof matchMedia === "function" && matchMedia("(prefers-contrast: more)").matches ? "8" : "0";
  const axes = canvasPicks ? { ...canvasScope, ...chromeAttributes } : { ...chromeAttributes, "data-area-contrast": systemContrast, ...SETUP_SCALE, ...canvasScope };
  // A brand (src/brand.ts) reaches the specimens with the settings: they carry data-area-brand, and its one rule is in the
  // document's head while Brand is on, so the body, cards and titles keep Area's palette.
  const brand = canvasPicks && studio.brand.on ? studio.brand : null;
  useBrandSheet(brand);
  // The scale the Canvas body sets, which the chrome drawn in it inherits (src/app-scale.ts).
  const bodyScale = useMemo<AppScale>(() => ({ "data-area-type": axes["data-area-type"]!, "data-area-density": axes["data-area-density"]! }), [axes["data-area-type"], axes["data-area-density"]]);
  const specimens = useMemo(() => canvasPicks ? { ...movedFrom(canvasAttributes(studio.shown.canvas, studio.shown.material), chromeAttributes), ...(brand ? { "data-area-brand": "" } : {}), ...(hasColours(studio.shown.colours) ? { "data-area-colours": "" } : {}) } : {}, [canvasPicks, studio.shown, brand, chromeAttributes]);
  // A setting (or a hover preview of one) repaints the Canvas at once rather than fading every tile's colours.
  const main = useRef<HTMLElement>(null);
  const signature = JSON.stringify([axes, specimens, brand]);
  const painted = useRef(signature);
  useLayoutEffect(() => {
    if (painted.current === signature) return;
    painted.current = signature;
    switchInstantly();
  }, [signature]);
  return (
    <div className="studio-workspace" data-sidebar={lead || showSidebar ? "" : undefined} data-inspector={showInspector ? "" : undefined}
      data-area-chrome={floating ? "" : undefined}>
      {/* The Sidebar is chrome on a recessed ground (owner, 2026-10-22; cursor-audit-2026-10-22.md item 4), as the
          Testing screens' sidebars: the Panel is a chrome region painting the fill styles/app.css names (panel.css) and
          declares the recessed ground, so its row plates step from what is under them (layers.css). */}
      {/* A lead (Setup's chat) has its own Panel; its header row above it holds search and back and forward. */}
      {lead ? (
        <div className="studio-lead">
          <Titlebar variant="plain" size="sm" className="studio-head studio-head--lead" windowControls={shell.mac ? "macos" : undefined} end={shell.history}>{shell.search}</Titlebar>
          {lead}
        </div>
      ) : showSidebar ? (
        <div className="studio-sidebar">
          <Panel flush windowBar resizable="end" aria-label="Sidebar" data-area-chrome="" data-area-ground="recessed" {...sidebarWidth}
            action={<>
              <span className="studio-head__group">{shell.mac ? <span className="studio-head__lights" aria-hidden="true" /> : null}{shell.sidebarToggle}{shell.search}</span>
              <span className="studio-head__group">{shell.history}</span>
            </>}
            bareFooter footer={<ProfileFoot />}>
            {/* The nav always, then the page's own list under it (app-nav.tsx PageList; the Takeover replaced the nav).
                Components' families are its list again since the one tree (2026-11-01; the nav's rows 10-31 to 11-01). */}
            {/* Home and References held at the top, then one scroll: the tree, then a page's list (app-nav.tsx AppNav). */}
            {nav ?? (
              <div className="studio-sidebar__split">
                <AppNav>{sidebar ? <PageList>{sidebar}</PageList> : null}</AppNav>
              </div>
            )}
          </Panel>
        </div>
      ) : null}
      <main ref={main} className="studio-canvas" aria-label={canvasTitle}>
        <Titlebar variant="plain" size="sm" className="studio-head studio-head--canvas" windowControls={!lead && !showSidebar && shell.mac ? "macos" : undefined}
          end={<>{shell.canvasEnd}{inspector !== undefined && !showInspector ? shell.inspectorToggle : null}</>}>
          {!lead && !showSidebar ? <>{shell.sidebarToggle}{shell.search}{shell.history}</> : null}
          {shell.tabs}
        </Titlebar>
        <header className="studio-canvas__bar">{canvasLead}{canvasActions}<PublishControls /></header>
        <div ref={canvasRef} className="studio-canvas__body" {...axes} onClick={keepSpecimenLinks}><SpecimenScopeContext.Provider value={specimens}><InheritedScaleContext.Provider value={bodyScale}>{canvas}</InheritedScaleContext.Provider></SpecimenScopeContext.Provider></div>
      </main>
      {showInspector ? (
        <div className="studio-inspector" onClick={keepSpecimenLinks}>
          {isViews(inspector) ? <InspectorPanel views={inspector} width={inspectorWidth} end={shell.inspectorToggle} designFooter={inspectorFooter} />
            : <Panel flush={!floating} bareBar windowBar resizable="start" aria-label="Inspector" {...inspectorWidth} action={<span className="studio-head__group studio-head__group--end">{shell.inspectorToggle}</span>}>{inspector}</Panel>}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The Inspector's views (owner, 2026-10-18: "a figma style panel based on dev mode and the standard design panel … the
 * tab controls at the top … separate the current inspector to themes, design, and code"), as Figma's Design | Prototype
 * and Dev Mode: Theme holds the Canvas settings (src/canvas-settings.tsx); Design what is chosen, what it is (its
 * preview, properties, values, status, purpose); Code how to use it (copy actions, import, class, tokens, code, the
 * measured box). One view at a time, chosen by Nav pills in the Panel's bar (the Titlebar's tabs, Figma's filled pills;
 * Tabs keeps the underline, docs/specs/tabs.md), the bar on the line the Canvas header and the Sidebar's first row share.
 */
export type InspectorView = "theme" | "design" | "code" | "chat";
export type InspectorViews = Partial<Record<Exclude<InspectorView, "chat">, ReactNode>>;
/** Chat is the app's, not a tab's: every tab offers it, last (src/chat/chat.tsx; owner, 2026-10-18). */
const INSPECTOR_VIEWS: ReadonlyArray<{ id: InspectorView; label: string }> = [
  // Theme, as the tab (owner, 2026-10-20; Language 2026-10-19 to 20): the tab and the Inspector use one word.
  { id: "theme", label: "Theme" },
  { id: "design", label: "Design" },
  { id: "code", label: "Code" },
  { id: "chat", label: "Chat" },
];
const isViews = (value: ReactNode | InspectorViews): value is InspectorViews =>
  value !== null && typeof value === "object" && !isValidElement(value) && !Array.isArray(value) && !(Symbol.iterator in value);

function InspectorPanel({ views, width, end, designFooter }: { views: InspectorViews; width: ReturnType<typeof usePanelWidth>; end: ReactNode; designFooter?: ReactNode }) {
  const { inspectorView, setInspectorView, appLook } = useStudio();
  const floating = appLook.panels === "floating";
  const offered = INSPECTOR_VIEWS.filter(entry => entry.id === "chat" || (views[entry.id] != null && views[entry.id] !== false));
  // A page without the chosen view shows Design (2026-10-31; its first until then, so Code on a family became Theme on
  // Themes); the choice itself is kept for the pages that have it.
  const shown = offered.find(entry => entry.id === inspectorView) ?? offered.find(entry => entry.id === "design") ?? offered[0];
  const chat = shown?.id === "chat";
  // The Chat view's transcript scrolls in the Panel's own body, which it follows to the newest line.
  const scroller = useRef<HTMLDivElement | null>(null);
  return (
    // A bare bar: no rule under the views (owner, 2026-10-22; cursor-audit-2026-10-22.md item 4), as the Canvas header.
    <Panel flush={!floating} bareBar windowBar resizable="start" aria-label="Inspector" {...width} viewportRef={scroller}
      bareFooter={chat} footer={chat ? <ChatComposer scroller={scroller} /> : shown?.id === "design" && designFooter ? designFooter : undefined} action={<>
        <Nav orientation="horizontal" aria-label="Inspector views" className="studio-inspector__views">
          {offered.map(entry => (
            <NavItem key={entry.id} href={`#${entry.id}`} current={entry.id === shown?.id}
              onClick={event => { event.preventDefault(); setInspectorView(entry.id); }}>
              {entry.label}
            </NavItem>
          ))}
        </Nav>
        {/* The Inspector's toggle at its header's end, as Cursor's right panel's. */}
        <span className="studio-head__group">{end}</span>
      </>}>
      {/* Keyed, so a view opens at its top and its own sections' state starts fresh. */}
      <Fragment key={shown?.id}>{chat ? <ChatTranscript scroller={scroller} /> : shown ? <InspectorView>{views[shown.id as Exclude<InspectorView, "chat">]}</InspectorView> : null}</Fragment>
    </Panel>
  );
}

/**
 * An Inspector view's content. It says whether it opens on a section heading (`data-lead="heading"`), which app.css puts on
 * the line the Sidebar's first row and the Canvas bar share (owner pick q-line, 2026-10-31); a view that opens on a preview
 * (a typeface's Design) keeps the panel's inset. Read from what is drawn, as a view's content changes with the selection.
 */
function InspectorView({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const view = ref.current;
    if (!view) return;
    const mark = () => {
      const first = view.firstElementChild;
      const heading = first?.classList.contains("area-panel__section") && first.firstElementChild?.classList.contains("area-panel__heading");
      if (heading) view.dataset.lead = "heading"; else delete view.dataset.lead;
    };
    mark();
    const watch = new MutationObserver(mark);
    watch.observe(view, { childList: true, subtree: true });
    return () => watch.disconnect();
  }, []);
  return <div ref={ref} className="studio-inspector__view">{children}</div>;
}

/**
 * The Sidebar's foot (owner, 2026-10-30: "a profile and setting control to the bottom left of the electron ui like claude
 * and cursor"): the person's avatar and name, then Settings (⌘,), which opens over the current tab.
 */
function ProfileFoot() {
  const { profileName, openSettings, closeSettings, settings } = useStudio();
  const initials = profileName.split(/\s+/).filter(Boolean).slice(0, 2).map(word => word[0]!.toUpperCase()).join("") || "?";
  return (
    <div className="studio-profile">
      <Avatar size="sm" fallback={initials} alt="" />
      <span className="studio-profile__name">{profileName}</span>
      {/* Pressed while Settings is open, and a second click closes it (Cursor's gear: "Settings" / "Close Settings"). */}
      <ChromeButton label={settings ? "Close settings" : "Settings"} keys={["⌘", ","]} shortcut="Meta+Comma" icon={<SettingsIcon />} pressed={settings !== null}
        onClick={() => settings ? closeSettings() : openSettings()} />
    </div>
  );
}

/**
 * ⌘L opens the Chat view and puts the cursor in its composer (Cursor's chat key), showing the Inspector if it is hidden.
 * Esc in the composer stops a running reply (src/chat/chat.tsx).
 */
function ChatShortcut() {
  const { setInspectorView, showInspector } = useStudio();
  const { composer } = useChat();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.shiftKey || event.altKey || event.code !== "KeyL") return;
      event.preventDefault();
      showInspector();
      setInspectorView("chat");
      requestAnimationFrame(() => requestAnimationFrame(() => composer.current?.focus()));
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [setInspectorView, showInspector, composer]);
  return null;
}

/**
 * The Sidebar's list: its row plates sit 6 from the Titlebar, the sides and the foot, so its first
 * row's text shares a line with the Canvas header's controls and the Inspector's first heading.
 */
/** A project page's chosen page and layer, by name, for the Chat's context chip; undefined elsewhere. */
function projectSelection(project: Project | null, place: Place): string | undefined {
  if (!project || place.page !== "project-page") return undefined;
  const [pageId, layerId] = (place.item ?? "").split("/");
  const page = project.pages.find(entry => entry.id === pageId) ?? project.pages[0];
  const layer = page?.layers.find(entry => entry.id === layerId) ?? page?.layers[0];
  return page ? [page.name, layer?.name].filter(Boolean).join(" › ") : undefined;
}

export function SidebarList({ children }: { children: ReactNode }) {
  return <div className="studio-sidebar__list">{children}</div>;
}

/**
 * The Sidebar as a tree (owner, 2026-10-24: "can you make the left nav more like a tree?"): All, then each group a branch
 * that opens and closes, its rows under it, on Area's Tree view (one Tab stop, the arrows, typeahead). A row narrows the
 * Canvas as a Nav row did; a branch only opens and closes. Every branch starts open, and stays as it is set while the page
 * is open. A pinnable row's id is `key:<key>` and a row under Pinned `pin:<key>` (organize.tsx, PinMenu); without
 * `onSelect` a row selects its key, the prefix dropped.
 *
 * A row may hold rows of its own (owner, 2026-10-25: a component's variants "should live under the tree view … as
 * legitimate standalone design items"). Those branches start closed, and `reveal` opens the ones that hold what the
 * Canvas shows, so the current row is always in view; an `axis:` row only opens and closes, as a group does.
 */
export interface SidebarTreeGroup { id: string; label: string; items: TreeViewNode[] }
export function SidebarTree({ label, count, groups, current, reveal, onSelect, all = true }: {
  label: string; count: number; groups: SidebarTreeGroup[]; current?: string; reveal?: string[]; onSelect?: (id: string) => void;
  /** The All row; left out where the nav above already has a row for the whole (References' Saved). */
  all?: boolean;
}) {
  const { select } = useStudio();
  const branches = groups.filter(group => group.items.length).map(group => `group:${group.id}`);
  const [closed, setClosed] = useState<string[]>([]);
  // Nested branches the person opened, and those `reveal` opened for them.
  const [opened, setOpened] = useState<string[]>(reveal ?? []);
  const revealKey = (reveal ?? []).join("|");
  useEffect(() => { if (reveal?.length) setOpened(open => [...new Set([...open, ...reveal])]); }, [revealKey]);
  const items: TreeViewNode[] = [
    ...(all ? [{ id: "all", label: "All", trailing: <Count variant="soft" size="sm" count={count} max={9999} /> }] : []),
    ...groups.filter(group => group.items.length).map(group => ({ id: `group:${group.id}`, label: group.label, trailing: <Count variant="soft" size="sm" count={group.items.length} max={9999} />, children: group.items })),
  ];
  const now = current ?? (all ? "all" : undefined);
  const toggle = (id: string) => setOpened(open => open.includes(id) ? open.filter(entry => entry !== id) : [...open, id]);
  return (
    // The open branches you're inside stay pinned as their rows scroll (owner pick r4-path, 2026-11-01).
    <TreeView aria-label={label} className="studio-sidebar__tree" stickyBranches items={items} currentId={now} selectedIds={now ? [now] : []}
      expandedIds={[...branches.filter(id => !closed.includes(id)), ...opened]}
      onExpandedChange={ids => { setClosed(branches.filter(id => !ids.includes(id))); setOpened(ids.filter(id => !id.startsWith("group:"))); }}
      onActivate={id => {
        if (id.startsWith("group:")) { setClosed(open => open.includes(id) ? open.filter(entry => entry !== id) : [...open, id]); return; }
        if (id.startsWith("axis:")) { toggle(id); return; }
        if (id === "all") select(""); else if (onSelect) onSelect(id); else select(id.replace(/^(key|pin):/, ""));
      }} />
  );
}

/**
 * The first row of a page's list: All, the whole page on the Canvas (the default). The rows
 * under it narrow the Canvas to one family, category, scale, role or setting.
 */
export function SidebarAll({ count, current }: { count: number; current: boolean }) {
  const { place, select } = useStudio();
  return (
    <NavGroup>
      <NavItem href={hrefOf({ ...place, item: undefined })} current={current} onClick={event => { event.preventDefault(); select(""); }} trailing={<Count variant="soft" size="sm" count={count} max={9999} />}>All</NavItem>
    </NavGroup>
  );
}
