/**
 * Area's desktop app: the gallery that holds every component, icon, type style and colour.
 *
 * Four named regions, so updates can point at one (owner, 2026-10-10):
 *
 *   Titlebar   the header across the top: the five tabs, search, layout toggles, light / dark
 *   Sidebar    the left panel: what the current tab holds, as a list
 *   Canvas     the centre: the selected thing at full size
 *   Inspector  the right panel: canvas settings and facts about the selection
 *
 * Built from Area's own components at the compact UI scale (dense tools: Cursor, Notion), with
 * one divider between the Titlebar and the panels and one between each panel. Each tab is a
 * page (src/pages/) that fills the three panels through <Workspace>.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { Button, Count, Kbd, Nav, NavGroup, NavItem, Panel, SearchField, Titlebar, Tooltip } from "@area/react";
import { MoonIcon, PanelLeftFilledIcon, PanelLeftIcon, PanelRightFilledIcon, PanelRightIcon, SunIcon } from "@area/icons";
import { GALLERY_CONTROLS } from "./gallery/controls.ts";
import { ComponentsPage } from "./pages/components.tsx";
import { TypographyPage } from "./pages/typography.tsx";
import { IconsPage } from "./pages/icons.tsx";
import { ColorPage } from "./pages/color.tsx";
import { LanguagePage } from "./pages/language.tsx";
import { readStored, writeStored } from "./storage.ts";

/* Text-only tabs (owner, 2026-10-11: no icons in the Titlebar's tabs). */
export const TABS = [
  { id: "language", label: "Language" },
  { id: "components", label: "Components" },
  { id: "typography", label: "Typography" },
  { id: "icons", label: "Icons" },
  { id: "color", label: "Color" },
] as const;
export type TabId = (typeof TABS)[number]["id"];
type Theme = "light" | "dark";

/** The Canvas's own theme settings (the Inspector writes them): the colour settings, the Layers (light and dark ground, layer
 * contrast), contrast, type size, density, radius, surface, elevation,
 * motion, pills. */
export type CanvasAxes = Record<"neutral" | "accent" | "ground-light" | "ground-dark" | "layers" | "action" | "selection" | "contrast" | "type" | "density" | "radius" | "surface" | "elevation" | "motion" | "pills", string>;
const CANVAS_DEFAULTS = Object.fromEntries(
  GALLERY_CONTROLS.filter(control => control.axis !== "theme").map(control => [control.axis, control.defaultValue]),
) as CanvasAxes;
/**
 * The saved Canvas, each setting kept only while it is still one of its control's options: an
 * elevation saved before it became a number (`minimal`, `standard` …) or a hand-edited value would
 * otherwise leave its Select blank and match no preset. Keys no control reads are dropped. A Canvas
 * from before the type / density split (`ui`: compact or default) restores as its two settings, and
 * a density saved by name (compact, default, comfortable) as its number.
 */
function restoreCanvas(saved: Partial<CanvasAxes> & { ui?: string }): CanvasAxes {
  const { ui, ...rest } = saved;
  const legacy: Partial<CanvasAxes> = ui === "compact" ? { type: "12", density: "28" } : ui === "default" ? { type: "14", density: "32" } : {};
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

/** The Electron shell on macOS (main.tsx sets data-platform, after the imports run, so this is read at render). */
const isMac = () => typeof document !== "undefined" && document.documentElement.dataset.platform === "darwin";

/*
 * Location: #<tab>/<item>, so a selection survives a reload and can be linked. The item is the
 * page's own key (a component's slug, an icon's name, a scale, a type role) and may have parts of
 * its own: Components opens a family's Stage on one tile as <slug>/<tile>.
 */
function readLocation(): { tab: TabId; item?: string } {
  const [tab, ...item] = decodeURIComponent(location.hash.slice(1)).split("/");
  const known = TABS.find(entry => entry.id === tab);
  return known ? { tab: known.id, item: item.join("/") || undefined } : { tab: readStored("tab", "components") as TabId };
}

interface StudioState {
  query: string;
  canvas: CanvasAxes;
  setCanvas: (axis: keyof CanvasAxes, value: string) => void;
  item?: string;
  /** Go to an item. `replace` swaps the current history entry (a Stage's tile) instead of adding one. */
  select: (item: string, options?: { replace?: boolean }) => void;
  sidebar: boolean;
  inspector: boolean;
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
  const [panels, setPanels] = useState(() => readStored("panels", { sidebar: true, inspector: true }));
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
  useEffect(() => {
    const root = document.documentElement;
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
    item,
    select: (next, options) => go(tab, next, options?.replace),
    sidebar: panels.sidebar,
    inspector: panels.inspector,
  }), [query, canvas, item, tab, go, panels]);

  const current = TABS.find(entry => entry.id === tab)!;
  return (
    <StudioContext.Provider value={state}>
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
        {tab === "language" ? <LanguagePage /> :
          tab === "components" ? <ComponentsPage /> :
          tab === "typography" ? <TypographyPage /> :
          tab === "icons" ? <IconsPage /> : <ColorPage />}
      </div>
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
  inspector: ReactNode;
  /** The Canvas's scrolling body (fitting tiles, scrolling a selection into view). */
  canvasRef?: Ref<HTMLDivElement>;
}

/*
 * Three columns under the Titlebar, without titles (owner, 2026-10-14, after Framer and Figma):
 * the Canvas has a header for its view options, and its controls, the Sidebar's first row and the
 * Inspector's first heading sit on one line. Every region insets its content by Panel's 14
 * (src/studio.css).
 */
export function Workspace({ sidebar, canvasLead, canvasTitle, canvasActions, canvas, inspector, canvasRef }: WorkspaceProps) {
  const studio = useStudio();
  const sidebarWidth = usePanelWidth("sidebar");
  const inspectorWidth = usePanelWidth("inspector");
  // The Canvas body carries the Inspector's settings on every tab: the colour settings, density (which also lays tiles out
  // as a hairline contact sheet in compact), radius, surface, elevation, motion and pills.
  const axes = { "data-area-neutral": studio.canvas.neutral, "data-area-accent": studio.canvas.accent, "data-area-ground-light": studio.canvas["ground-light"], "data-area-ground-dark": studio.canvas["ground-dark"], "data-area-layers": studio.canvas.layers, "data-area-action": studio.canvas.action, "data-area-selection": studio.canvas.selection, "data-area-contrast": studio.canvas.contrast === "system" ? undefined : studio.canvas.contrast, "data-area-type": studio.canvas.type, "data-area-density": studio.canvas.density, "data-area-radius": studio.canvas.radius, "data-area-surface": studio.canvas.surface, "data-area-elevation": studio.canvas.elevation, "data-area-motion": studio.canvas.motion, "data-area-pills": studio.canvas.pills };
  return (
    <div className="studio-workspace" data-sidebar={studio.sidebar ? "" : undefined} data-inspector={studio.inspector ? "" : undefined}>
      {studio.sidebar ? (
        <div className="studio-sidebar">
          <Panel flush resizable="end" aria-label="Sidebar" {...sidebarWidth}>{sidebar}</Panel>
        </div>
      ) : null}
      <main className="studio-canvas" aria-label={canvasTitle}>
        <header className="studio-canvas__bar">{canvasLead}{canvasActions}</header>
        <div ref={canvasRef} className="studio-canvas__body" {...axes}>{canvas}</div>
      </main>
      {studio.inspector ? (
        <div className="studio-inspector">
          <Panel flush resizable="start" aria-label="Inspector" {...inspectorWidth}>{inspector}</Panel>
        </div>
      ) : null}
    </div>
  );
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
