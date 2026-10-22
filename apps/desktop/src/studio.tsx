/**
 * Area's desktop app: the gallery that holds every component, icon, type style and colour.
 *
 * Four named regions, so updates can point at one (owner, 2026-10-10):
 *
 *   Titlebar   the header across the top: the six tabs, search, layout toggles, light / dark
 *   Sidebar    the left panel: what the current tab holds, as a list
 *   Canvas     the centre: the selected thing at full size
 *   Inspector  the right panel: canvas settings and facts about the selection
 *
 * Built from Area's own components at the compact UI scale (dense tools: Cursor, Notion), with
 * one divider between the Titlebar and the panels and one between each panel. Each tab is a
 * page (src/pages/) that fills the three panels through <Workspace>.
 */
import { createContext, Fragment, isValidElement, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { Button, Count, Kbd, Nav, NavGroup, NavItem, Panel, SearchField, Titlebar, Tooltip } from "@area/react";
import { MoonIcon, PanelLeftFilledIcon, PanelLeftIcon, PanelRightFilledIcon, PanelRightIcon, SunIcon } from "@area/icons";
import { DEPTH_LEVER_AXES, GALLERY_CONTROLS, type GalleryControl } from "./gallery/controls.ts";
import { ComponentsPage } from "./pages/components.tsx";
import { TypographyPage } from "./pages/typography.tsx";
import { IconsPage } from "./pages/icons.tsx";
import { ColorPage } from "./pages/color.tsx";
import { ThemePage } from "./pages/theme.tsx";
import { ExamplesPage } from "./pages/examples.tsx";
import { MaterialsPage } from "./pages/materials.tsx";
import { BrandPage } from "./pages/brand.tsx";
import { readStored, writeStored } from "./storage.ts";
import { ChatComposer, ChatProvider, ChatTranscript, selectionLabel, useChat } from "./chat/chat.tsx";
import { MATERIAL_BUNDLES } from "@area/tokens/config";
import { bundleValue, materialAttributes, restoreMaterial, type MaterialState } from "./material.ts";

/* Text-only tabs (owner, 2026-10-11: no icons in the Titlebar's tabs). */
export const TABS = [
  /* Theme: the system's settings, the registry's axes, and the Setup flow through them (owner, 2026-10-20: "i want to
     change language back to theme"; Language 2026-10-19 to 20, #language links still open it). */
  { id: "theme", label: "Theme" },
  { id: "components", label: "Components" },
  { id: "typography", label: "Typography" },
  { id: "icons", label: "Icons" },
  { id: "color", label: "Color" },
  /* Whole screens built from Area, to test the defaults and every setting (owner, 2026-10-17; "Examples" until the owner
     renamed it the same day). */
  { id: "testing", label: "Testing" },
  /* The owner's brand inspiration in folders, browsed with Area's file explorer components (owner, 2026-10-18). */
  { id: "brand", label: "Brand" },
  /* A temporary lab for tuning the Material setting's bundles (owner, 2026-10-18); it goes when they are settled. */
  { id: "materials", label: "Materials" },
] as const;
export type TabId = (typeof TABS)[number]["id"];
type Theme = "light" | "dark";

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
 * split by theme (2026-10-17) restores as both.
 */
function restoreCanvas(saved: Partial<CanvasAxes> & { ui?: string; layers?: string }): CanvasAxes {
  const { ui, layers, ...rest } = saved;
  const legacy: Partial<CanvasAxes> = {
    ...(ui === "compact" ? { type: "12", density: "28" } : ui === "default" ? { type: "14", density: "32" } : {}),
    ...(typeof layers === "string" ? { "layers-light": layers, "layers-dark": layers } : {}),
  };
  const merged: Record<string, unknown> = { ...legacy, ...rest };
  const named: Record<string, string> = { compact: "28", default: "32", comfortable: "36" };
  if (typeof merged.density === "string" && merged.density in named) merged.density = named[merged.density];
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

export { APP_SCALE } from "./app-scale.ts";

/**
 * A theme or setting change lands at once (MOTION.md, "Theme / density change"): `data-area-switching` (base.css) stops
 * every transition on `element` for the frame that repaints it, then lets hover and state motion run again.
 */
function switchInstantly(element: HTMLElement | null) {
  if (!element) return;
  element.setAttribute("data-area-switching", "");
  requestAnimationFrame(() => requestAnimationFrame(() => element.removeAttribute("data-area-switching")));
}

/** The Electron shell on macOS (main.tsx sets data-platform, after the imports run, so this is read at render). */
const isMac = () => typeof document !== "undefined" && document.documentElement.dataset.platform === "darwin";

/*
 * Location: #<tab>/<item>, so a selection survives a reload and can be linked. The item is the
 * page's own key (a component's slug, an icon's name, a scale, a type role) and may have parts of
 * its own: Components opens a family's Stage on one tile as <slug>/<tile>.
 */
function readLocation(): { tab: TabId; item?: string } {
  const [hash, ...item] = decodeURIComponent(location.hash.slice(1)).split("/");
  // Testing was the Examples tab until 2026-10-17, Theme the Language tab 2026-10-19 to 20: an old link or saved tab opens it.
  const renamed = (id?: string) => id === "examples" ? "testing" : id === "language" ? "theme" : id;
  const known = TABS.find(entry => entry.id === renamed(hash));
  const stored = TABS.find(entry => entry.id === renamed(readStored<string>("tab", "components")));
  return known ? { tab: known.id, item: item.join("/") || undefined } : { tab: stored?.id ?? "components" };
}

interface StudioState {
  query: string;
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
  shown: { canvas: CanvasAxes; material: MaterialState };
  item?: string;
  /** Go to an item. `replace` swaps the current history entry (a Stage's tile) instead of adding one. */
  select: (item: string, options?: { replace?: boolean }) => void;
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
  const [{ tab, item }, setLocation] = useState(readLocation);
  // src/theme.js has already set the theme before first paint; start from it.
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.getAttribute("data-area-theme") ?? (prefersDark() ? "dark" : "light")) === "dark" ? "dark" : "light");
  const [query, setQuery] = useState("");
  const [canvas, setCanvasState] = useState<CanvasAxes>(() => restoreCanvas(readStored<Partial<CanvasAxes>>("canvas", {})));
  const [material, setMaterialState] = useState<MaterialState>(() => restoreMaterial(readStored("material", null)));
  const [panels, setPanels] = useState(() => readStored("panels", { sidebar: true, inspector: true }));
  const [inspectorView, setInspectorViewState] = useState<InspectorView>(() => {
    const saved = readStored<string>("inspectorView", "theme");
    return INSPECTOR_VIEWS.some(entry => entry.id === saved) ? saved as InspectorView : "theme";
  });
  const [previewAxes, setPreviewAxes] = useState<Partial<CanvasAxes>>({});
  const [previewedMaterial, setPreviewedMaterial] = useState<MaterialState | null>(null);
  const search = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onHash = () => setLocation(readLocation());
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => writeStored("tab", tab), [tab]);

  // The theme is the whole app's, Titlebar included. Area's colours are light-dark() pairs, and
  // Chromium can keep a cached colour when color-scheme flips (docs/THEMING.md): one synchronous
  // restyle re-resolves everything before the next paint.
  useLayoutEffect(() => {
    const root = document.documentElement;
    switchInstantly(root);
    root.setAttribute("data-area-theme", theme);
    root.style.display = "none"; void root.offsetHeight; root.style.display = "";
    writeStored("theme", theme);
    window.areaDesktop?.setTheme(theme);
  }, [theme]);

  // Shortcuts, as the Tooltips name them: ⌘K focuses search; ⌘B and ⌥⌘B show and hide the Sidebar
  // and the Inspector (Cursor's and VS Code's primary and secondary side bars); ⌘[ and ⌘] go back
  // and forward through what the Canvas showed (Finder, Safari, Cursor).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.shiftKey) return;
      const key = event.code === "KeyK" ? "k" : event.code === "KeyB" ? "b" : event.code === "BracketLeft" ? "[" : event.code === "BracketRight" ? "]" : "";
      if (key === "k" && !event.altKey) { event.preventDefault(); search.current?.focus(); search.current?.select(); }
      else if (key === "b") { event.preventDefault(); togglePanel(event.altKey ? "inspector" : "sidebar"); }
      else if ((key === "[" || key === "]") && !event.altKey) { event.preventDefault(); if (key === "[") history.back(); else history.forward(); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const go = useCallback((next: TabId, nextItem?: string, replace = false) => {
    // Each part is encoded on its own, so a Stage reads #components/button/size-small.
    const hash = `#${next}${nextItem ? `/${nextItem.split("/").map(encodeURIComponent).join("/")}` : ""}`;
    if (location.hash !== hash) history[replace ? "replaceState" : "pushState"](null, "", hash);
    setLocation({ tab: next, item: nextItem || undefined });
  }, []);
  const togglePanel = (panel: "sidebar" | "inspector") => setPanels(current => {
    const next = { ...current, [panel]: !current[panel] };
    writeStored("panels", next);
    return next;
  });

  const state = useMemo<StudioState>(() => ({
    query,
    canvas,
    setCanvas: (axis, value) => setCanvasState(current => {
      const next = { ...current, [axis]: value };
      writeStored("canvas", next);
      return next;
    }),
    material,
    setMaterialBundle: bundle => {
      const next = { bundle, overrides: {} };
      writeStored("material", next);
      setMaterialState(next);
      const layers = MATERIAL_BUNDLES[bundle]?.layers ?? {};
      if (Object.keys(layers).length) setCanvasState(current => {
        const merged = { ...current, ...layers };
        writeStored("canvas", merged);
        return merged;
      });
    },
    setMaterialValue: (key, value) => setMaterialState(current => {
      const { [key]: _, ...rest } = current.overrides;
      const next = { ...current, overrides: value === bundleValue(current.bundle, key) ? rest : { ...rest, [key]: value } };
      writeStored("material", next);
      return next;
    }),
    previewCanvas: (axis, value) => setPreviewAxes(current => {
      if (value === null) { if (!(axis in current)) return current; const { [axis]: _, ...rest } = current; return rest; }
      return current[axis] === value ? current : { ...current, [axis]: value };
    }),
    previewMaterial: setPreviewedMaterial,
    shown: { canvas: { ...canvas, ...previewAxes }, material: previewedMaterial ?? material },
    item,
    select: (next, options) => go(tab, next, options?.replace),
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
  }), [query, canvas, material, previewAxes, previewedMaterial, item, tab, go, panels, inspectorView]);

  const current = TABS.find(entry => entry.id === tab)!;
  return (
    <StudioContext.Provider value={state}>
      {/* The conversation outlives tabs and views; the Canvas's selection rides along as its context chip. */}
      <ChatProvider selection={selectionLabel(item)}>
      <ChatShortcut />
      <div className="studio">
        {/* Area's Titlebar (app-shell.css): Panel's bar, the drag region, clear of macOS's traffic lights. */}
        <Titlebar className="studio-titlebar" windowControls={isMac() ? "macos" : undefined} end={<>
          <SearchField ref={search} size="sm" variant="soft" className="studio-titlebar__search" value={query} onValueChange={setQuery}
            placeholder={`Search ${current.label.toLowerCase()}`} aria-label={`Search ${current.label.toLowerCase()}`} shortcut={["⌘", "K"]} />
          {/* Shown panels draw their side filled, as Cursor's layout toggles do. Each names itself
              in an Area Tooltip with its shortcut, not the browser's title. */}
          <ChromeButton label={panels.inspector ? "Hide inspector" : "Show inspector"} keys={["⌥", "⌘", "B"]} shortcut="Alt+Meta+B"
            icon={panels.inspector ? <PanelRightFilledIcon /> : <PanelRightIcon />} onClick={() => togglePanel("inspector")} />
          <ChromeButton label={theme === "dark" ? "Light mode" : "Dark mode"}
            icon={theme === "dark" ? <SunIcon /> : <MoonIcon />} onClick={() => setTheme(theme === "dark" ? "light" : "dark")} />
        </>}>
          {/* The Sidebar's toggle sits at the Sidebar's edge, first in the bar after the traffic
              lights (Cursor's icon tool and IDE); the Inspector's stays at the end, over it. */}
          <ChromeButton label={panels.sidebar ? "Hide sidebar" : "Show sidebar"} keys={["⌘", "B"]} shortcut="Meta+B"
            icon={panels.sidebar ? <PanelLeftFilledIcon /> : <PanelLeftIcon />} onClick={() => togglePanel("sidebar")} />
          <Nav orientation="horizontal" aria-label="Gallery" className="studio-titlebar__tabs">
            {TABS.map(entry => (
              <NavItem key={entry.id} href={`#${entry.id}`} current={entry.id === tab}
                onClick={event => { event.preventDefault(); setQuery(""); go(entry.id); }}>
                {entry.label}
              </NavItem>
            ))}
          </Nav>
        </Titlebar>
        {tab === "theme" ? <ThemePage /> :
          tab === "components" ? <ComponentsPage /> :
          tab === "typography" ? <TypographyPage /> :
          tab === "icons" ? <IconsPage /> :
          tab === "testing" ? <ExamplesPage /> :
          tab === "materials" ? <MaterialsPage /> :
          tab === "brand" ? <BrandPage /> : <ColorPage />}
      </div>
      </ChatProvider>
    </StudioContext.Provider>
  );
}

/**
 * An icon Button in the app's chrome (Titlebar, Inspector headings): ghost, neutral, small, named
 * by its label, which an Area Tooltip shows below it with the shortcut, if any.
 */
export function ChromeButton({ label, icon, keys, shortcut, onClick, pressed }: { label: string; icon: ReactNode; keys?: string[]; shortcut?: string; onClick: () => void; pressed?: boolean }) {
  // The tooltip repeats the name, so it only shows; the shortcut reaches assistive tech as
  // aria-keyshortcuts ("Meta+B").
  return (
    <Tooltip side="bottom" describes={false} trigger={
      <Button variant="ghost" tone="neutral" size="sm" iconOnly className="studio-bar-icon" icon={icon} aria-label={label} aria-pressed={pressed} aria-keyshortcuts={shortcut} onClick={onClick} />
    }>
      {label}{keys ? <> <Kbd keys={keys} size="sm" /></> : null}
    </Tooltip>
  );
}

/* --- Workspace: Sidebar | Canvas | Inspector -------------------------------- */

/*
 * Panel widths, resizable from the inner edge and kept across tabs and launches. Sidebar: Panel's
 * own 240 (a pick), 200 to 360. Inspector: 256, measured as the narrowest at which its one-row
 * controls show their whole labels (at 240 a label-beside Segmented clips "Compact" by 4), up to
 * Panel's 500.
 */
const WIDTHS = {
  sidebar: { initial: 240, min: 200, max: 360 },
  inspector: { initial: 256, min: 256, max: 500 },
} as const;

function usePanelWidth(panel: keyof typeof WIDTHS) {
  const limits = WIDTHS[panel];
  const [width, setWidth] = useState(() => {
    const saved = Number(readStored<Record<string, number>>("widths", {})[panel]);
    return saved >= limits.min && saved <= limits.max ? saved : limits.initial;
  });
  const onWidthChange = (next: number) => {
    setWidth(next);
    writeStored("widths", { ...readStored<Record<string, number>>("widths", {}), [panel]: next });
  };
  return { width, onWidthChange, minWidth: limits.min, maxWidth: limits.max };
}

export interface WorkspaceProps {
  /** The tab's list, in a <SidebarList>. The Sidebar has no title bar (owner, 2026-10-11). */
  sidebar: ReactNode;
  /** At the start of the Canvas bar: the way back from a nested view (a family's Stage). */
  canvasLead?: ReactNode;
  /** What the Canvas shows (a family, "All icons"): the region's accessible name, not drawn
      (owner, 2026-10-14: no titles over the Canvas or the Inspector, as Framer and Figma). */
  canvasTitle: string;
  /** The Canvas's header: filters and the view's options (src/view-controls.tsx). */
  canvasActions?: ReactNode;
  canvas: ReactNode;
  /**
   * The Inspector: its three views (InspectorViews), or one body with no views (a lab tab). A page leaves out a view it
   * has nothing for, and the shell leaves out its tab (rule 14: a control that does not apply is left out).
   */
  inspector: ReactNode | InspectorViews;
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
export function canvasAttributes(shown: CanvasAxes, material: Parameters<typeof materialAttributes>[0]): Record<string, string | undefined> {
  return { "data-area-neutral": shown.neutral, "data-area-accent": shown.accent, "data-area-ground-light": shown["ground-light"], "data-area-ground-dark": shown["ground-dark"], "data-area-layers-light": shown["layers-light"], "data-area-layers-dark": shown["layers-dark"], "data-area-action": shown.action, "data-area-selection": shown.selection, "data-area-contrast": shown.contrast === "system" ? undefined : shown.contrast, "data-area-type": shown.type, "data-area-density": shown.density, "data-area-radius": shown.radius, "data-area-surface": shown.surface, "data-area-shadow-rest": shown["shadow-rest"], "data-area-elevation": shown.elevation, ...Object.fromEntries(DEPTH_LEVER_AXES.map(axis => [`data-area-${axis}`, shown[axis]])), "data-area-motion": shown.motion, "data-area-pills": shown.pills, ...materialAttributes(material) };
}

/*
 * Three columns under the Titlebar, without titles (owner, 2026-10-14, after Framer and Figma):
 * the Canvas has a header for its view options, and its controls, the Sidebar's first row and the
 * Inspector's first heading sit on one line. Every region insets its content by Panel's 14
 * (src/studio.css).
 */
export function Workspace({ sidebar, canvasLead, canvasTitle, canvasActions, canvas, inspector, canvasRef, canvasScope, canvasPicks = true }: WorkspaceProps) {
  const studio = useStudio();
  const sidebarWidth = usePanelWidth("sidebar");
  const inspectorWidth = usePanelWidth("inspector");
  // The Canvas body carries the Inspector's settings on every tab (and the Material, src/material.ts): the colour settings, density (which also lays tiles out
  // as a hairline contact sheet in compact), radius, surface, elevation and the Edge and Depth levers, motion and pills.
  const axes = canvasPicks ? { ...canvasScope, ...canvasAttributes(studio.shown.canvas, studio.shown.material) } : { ...canvasScope };
  // A setting (or a hover preview of one) repaints the Canvas at once rather than fading every tile's colours.
  const main = useRef<HTMLElement>(null);
  const signature = JSON.stringify(axes);
  const painted = useRef(signature);
  useLayoutEffect(() => {
    if (painted.current === signature) return;
    painted.current = signature;
    switchInstantly(main.current);
  }, [signature]);
  return (
    <div className="studio-workspace" data-sidebar={studio.sidebar ? "" : undefined} data-inspector={studio.inspector ? "" : undefined}>
      {studio.sidebar ? (
        <div className="studio-sidebar">
          <Panel flush resizable="end" aria-label="Sidebar" {...sidebarWidth}>{sidebar}</Panel>
        </div>
      ) : null}
      <main ref={main} className="studio-canvas" aria-label={canvasTitle}>
        <header className="studio-canvas__bar">{canvasLead}{canvasActions}</header>
        <div ref={canvasRef} className="studio-canvas__body" {...axes}>{canvas}</div>
      </main>
      {studio.inspector ? (
        <div className="studio-inspector">
          {isViews(inspector) ? <InspectorPanel views={inspector} width={inspectorWidth} />
            : <Panel flush resizable="start" aria-label="Inspector" {...inspectorWidth}>{inspector}</Panel>}
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

function InspectorPanel({ views, width }: { views: InspectorViews; width: ReturnType<typeof usePanelWidth> }) {
  const { inspectorView, setInspectorView } = useStudio();
  const offered = INSPECTOR_VIEWS.filter(entry => entry.id === "chat" || (views[entry.id] != null && views[entry.id] !== false));
  // A tab without the chosen view shows its first; the choice itself is kept for the tabs that have it.
  const shown = offered.find(entry => entry.id === inspectorView) ?? offered[0];
  const chat = shown?.id === "chat";
  // The Chat view's transcript scrolls in the Panel's own body, which it follows to the newest line.
  const scroller = useRef<HTMLDivElement | null>(null);
  return (
    <Panel flush resizable="start" aria-label="Inspector" {...width} viewportRef={scroller}
      bareFooter={chat} footer={chat ? <ChatComposer scroller={scroller} /> : undefined} action={<>
        <Nav orientation="horizontal" aria-label="Inspector views" className="studio-inspector__views">
          {offered.map(entry => (
            <NavItem key={entry.id} href={`#${entry.id}`} current={entry.id === shown?.id}
              onClick={event => { event.preventDefault(); setInspectorView(entry.id); }}>
              {entry.label}
            </NavItem>
          ))}
        </Nav>
      </>}>
      {/* Keyed, so a view opens at its top and its own sections' state starts fresh. */}
      <Fragment key={shown?.id}>{chat ? <ChatTranscript scroller={scroller} /> : shown ? views[shown.id as Exclude<InspectorView, "chat">] : null}</Fragment>
    </Panel>
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
export function SidebarList({ children }: { children: ReactNode }) {
  return <div className="studio-sidebar__list">{children}</div>;
}

/**
 * The Sidebar's first row on every tab: All, the whole tab on the Canvas (the default). The rows
 * under it narrow the Canvas to one family, category, scale, role or setting.
 */
export function SidebarAll({ tab, count, current }: { tab: TabId; count: number; current: boolean }) {
  const { select } = useStudio();
  return (
    <NavGroup>
      <NavItem href={`#${tab}`} current={current} onClick={event => { event.preventDefault(); select(""); }} trailing={<Count count={count} max={9999} />}>All</NavItem>
    </NavGroup>
  );
}
