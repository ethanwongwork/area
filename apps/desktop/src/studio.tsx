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
import { Button, Count, Nav, NavGroup, NavItem, Panel, SearchField } from "@area/react";
import {
  PilotMoonIcon, PilotPanelLeftFilledIcon, PilotPanelLeftIcon, PilotPanelRightFilledIcon, PilotPanelRightIcon, PilotSunIcon,
} from "../../docs/src/pilot-icons.tsx";
import { GALLERY_CONTROLS } from "../../docs/src/gallery/controls.ts";
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

/** The Canvas's own theme settings (the Inspector writes them): density, radius, pills. */
export type CanvasAxes = Record<"ui" | "radius" | "pills", string>;
const CANVAS_DEFAULTS = Object.fromEntries(
  GALLERY_CONTROLS.filter(control => control.axis !== "theme").map(control => [control.axis, control.defaultValue]),
) as CanvasAxes;

/*
 * Location: #<tab>/<item>, so a selection survives a reload and can be linked. The item is the
 * page's own key (a component's slug, an icon's name, a scale, a type role).
 */
function readLocation(): { tab: TabId; item?: string } {
  const [tab, item] = decodeURIComponent(location.hash.slice(1)).split("/");
  const known = TABS.find(entry => entry.id === tab);
  return known ? { tab: known.id, item: item || undefined } : { tab: readStored("tab", "components") as TabId };
}

interface StudioState {
  query: string;
  canvas: CanvasAxes;
  setCanvas: (axis: keyof CanvasAxes, value: string) => void;
  item?: string;
  select: (item: string) => void;
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
  const [canvas, setCanvasState] = useState<CanvasAxes>(() => ({ ...CANVAS_DEFAULTS, ...readStored<Partial<CanvasAxes>>("canvas", {}) }));
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

  // ⌘K / Ctrl+K focuses search, as the field's shortcut hint says.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); search.current?.focus(); search.current?.select(); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const go = useCallback((next: TabId, nextItem?: string) => {
    const hash = `#${next}${nextItem ? `/${encodeURIComponent(nextItem)}` : ""}`;
    if (location.hash !== hash) history.pushState(null, "", hash);
    setLocation({ tab: next, item: nextItem });
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
    select: next => go(tab, next),
    sidebar: panels.sidebar,
    inspector: panels.inspector,
  }), [query, canvas, item, tab, go, panels]);

  const current = TABS.find(entry => entry.id === tab)!;
  return (
    <StudioContext.Provider value={state}>
      <div className="studio">
        <header className="studio-titlebar">
          <Nav orientation="horizontal" aria-label="Gallery" className="studio-titlebar__tabs">
            {TABS.map(entry => (
              <NavItem key={entry.id} href={`#${entry.id}`} current={entry.id === tab}
                onClick={event => { event.preventDefault(); setQuery(""); go(entry.id); }}>
                {entry.label}
              </NavItem>
            ))}
          </Nav>
          <div className="studio-titlebar__end">
            <SearchField ref={search} size="sm" className="studio-titlebar__search" value={query} onValueChange={setQuery}
              placeholder={`Search ${current.label.toLowerCase()}`} aria-label={`Search ${current.label.toLowerCase()}`} shortcut={["⌘", "K"]} />
            {/* Shown panels draw their side filled, as Cursor's layout toggles do. */}
            <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={panels.sidebar ? <PilotPanelLeftFilledIcon /> : <PilotPanelLeftIcon />}
              aria-label={panels.sidebar ? "Hide sidebar" : "Show sidebar"} title={panels.sidebar ? "Hide sidebar" : "Show sidebar"} onClick={() => togglePanel("sidebar")} />
            <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={panels.inspector ? <PilotPanelRightFilledIcon /> : <PilotPanelRightIcon />}
              aria-label={panels.inspector ? "Hide inspector" : "Show inspector"} title={panels.inspector ? "Hide inspector" : "Show inspector"} onClick={() => togglePanel("inspector")} />
            <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={theme === "dark" ? <PilotSunIcon /> : <PilotMoonIcon />}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={theme === "dark" ? "Light mode" : "Dark mode"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} />
          </div>
        </header>
        {tab === "language" ? <LanguagePage /> :
          tab === "components" ? <ComponentsPage /> :
          tab === "typography" ? <TypographyPage /> :
          tab === "icons" ? <IconsPage /> : <ColorPage />}
      </div>
    </StudioContext.Provider>
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
  /** The Canvas's bar: what it shows (a family, "All icons"); also names the region. */
  canvasTitle: string;
  /** Beside the title in the Canvas bar: a status, a count. */
  canvasMeta?: ReactNode;
  /** At the end of the Canvas bar: filters and the grid / list switch (src/view-controls.tsx). */
  canvasActions?: ReactNode;
  canvas: ReactNode;
  /** The Inspector's bar: what is selected. */
  inspectorTitle: ReactNode;
  inspector: ReactNode;
  /** The Canvas's scrolling body (fitting tiles, scrolling a selection into view). */
  canvasRef?: Ref<HTMLDivElement>;
}

/*
 * Three columns under the Titlebar. The Canvas and Inspector are topped by a 41 bar (Panel's: a
 * row, 6 above and below it, and the rule), and the Sidebar's first row sits on the same centre
 * line (SidebarList), so the three columns start level. Every region insets its content by
 * Panel's 14 (src/studio.css).
 */
export function Workspace({ sidebar, canvasTitle, canvasMeta, canvasActions, canvas, inspectorTitle, inspector, canvasRef }: WorkspaceProps) {
  const studio = useStudio();
  const sidebarWidth = usePanelWidth("sidebar");
  const inspectorWidth = usePanelWidth("inspector");
  // The Canvas body carries the Inspector's settings on every tab: density (which also lays tiles out
  // as a hairline contact sheet in compact), radius and pills.
  const axes = { "data-area-ui": studio.canvas.ui, "data-area-radius": studio.canvas.radius, "data-area-pills": studio.canvas.pills };
  return (
    <div className="studio-workspace" data-sidebar={studio.sidebar ? "" : undefined} data-inspector={studio.inspector ? "" : undefined}>
      {studio.sidebar ? (
        <div className="studio-sidebar">
          <Panel flush resizable="end" aria-label="Sidebar" {...sidebarWidth}>{sidebar}</Panel>
        </div>
      ) : null}
      <main className="studio-canvas" aria-label={canvasTitle}>
        <header className="studio-canvas__bar">
          <h1 className="studio-canvas__title">{canvasTitle}</h1>
          {canvasMeta}
          {canvasActions}
        </header>
        <div ref={canvasRef} className="studio-canvas__body" {...axes}>{canvas}</div>
      </main>
      {studio.inspector ? (
        <div className="studio-inspector">
          <Panel flush resizable="start" title={inspectorTitle} titleLevel={2} {...inspectorWidth}>{inspector}</Panel>
        </div>
      ) : null}
    </div>
  );
}

/**
 * The Sidebar's list: its first row starts 8 below the Titlebar, the 8 the Titlebar's controls
 * sit in, which centres a 24 row on the Canvas and Inspector bars' title line (41 + 8 + 12 = 61).
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
