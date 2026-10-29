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
import { createContext, Fragment, isValidElement, useCallback, useContext, useEffect, useInsertionEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type Ref } from "react";
import { Button, Count, Kbd, Nav, NavGroup, NavItem, Panel, SearchField, Titlebar, Tooltip, TreeView, type TreeViewNode } from "@area/react";
import { MoonIcon, PanelLeftFilledIcon, PanelLeftIcon, PanelRightFilledIcon, PanelRightIcon, SunIcon } from "@area/icons";
import { DEPTH_LEVER_AXES, GALLERY_CONTROLS, type GalleryControl } from "./gallery/controls.ts";
import { ComponentsPage } from "./pages/components.tsx";
import { TypographyPage } from "./pages/typography.tsx";
import { IconsPage } from "./pages/icons.tsx";
import { ColorPage } from "./pages/color.tsx";
import { ThemePage } from "./pages/theme.tsx";
import { ExamplesPage } from "./pages/examples.tsx";
import { MaterialsPage } from "./pages/materials.tsx";
import { ImageryPage } from "./pages/imagery.tsx";
import { readStored, writeStored } from "./storage.ts";
import { AppScaleContext, SETUP_SCALE, type AppScale } from "./app-scale.ts";
import { movedFrom, SpecimenScopeContext } from "./specimen-scope.tsx";
import { ChatComposer, ChatProvider, ChatTranscript, selectionLabel, useChat } from "./chat/chat.tsx";
import { MATERIAL_BUNDLES } from "@area/tokens/config";
import { bundleValue, MATERIAL_DEFAULT, materialAttributes, restoreMaterial, type MaterialState } from "./material.ts";
import { restoreBrand, useBrandSheet, type BrandState } from "./brand.ts";
import { PAGE_AXES, hasColours, restoreColours, shownColours, useColoursSheet, type ColoursState } from "./colours.ts";

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
  /* Images in folders, browsed with Area's file explorer components (owner, 2026-10-18, as Brand; renamed 2026-10-24: "dont
     associate them just with brand. rename brand to imagery"; #brand links still open it). */
  { id: "imagery", label: "Imagery" },
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
 * split by theme (2026-10-17) restores as both. A Canvas saved before positions (no `positions` mark, 2026-10-26) has
 * Layer contrast 0 to 8, Card shade −4 to +4, Text tint, Label tint and the state fills 0 to 4, and Grey tint 0 to 16;
 * each restores as its position on 0–100.
 */
/** Marks a saved Canvas whose Layer contrast, Card shade and Text tint are positions (0–100), so restoreCanvas converts only
 * the ones saved before. */
const CANVAS_POSITIONS = 1;
const saveCanvas = (canvas: CanvasAxes) => writeStored("canvas", { ...canvas, positions: CANVAS_POSITIONS });
function restoreCanvas(saved: Partial<CanvasAxes> & { ui?: string; layers?: string; positions?: number }): CanvasAxes {
  const { ui, layers, positions, ...rest } = saved;
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
 * Location: #<tab>/<item>, so a selection survives a reload and can be linked. The item is the
 * page's own key (a component's slug, an icon's name, a scale, a type role) and may have parts of
 * its own: Components opens a family's Stage on one tile as <slug>/<tile>.
 */
function readLocation(): { tab: TabId; item?: string } {
  const [hash, ...item] = decodeURIComponent(location.hash.slice(1)).split("/");
  // Testing was the Examples tab until 2026-10-17, Theme the Language tab 2026-10-19 to 20: an old link or saved tab opens it.
  const renamed = (id?: string) => id === "examples" ? "testing" : id === "language" ? "theme" : id === "brand" ? "imagery" : id;
  const known = TABS.find(entry => entry.id === renamed(hash));
  const stored = TABS.find(entry => entry.id === renamed(readStored<string>("tab", "components")));
  return known ? { tab: known.id, item: item.join("/") || undefined } : { tab: stored?.id ?? "components" };
}

interface StudioState {
  query: string;
  /** The app's mode (the Titlebar's switch): which theme's Ground and Layers the Inspector sets. */
  theme: Theme;
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
  /** The Canvas's brand (src/brand.ts): off, Area's palette, or up to three exact colours. */
  brand: BrandState;
  setBrand: (patch: Partial<BrandState>) => void;
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
  const [brand, setBrandState] = useState<BrandState>(() => restoreBrand(readStored("brand", null)));
  // Picks saved as colours; a Canvas saved before them converts its page presets once (src/colours.ts).
  const [colours, setColoursState] = useState<ColoursState>(() => restoreColours(readStored("colours", null), restoreCanvas(readStored<Partial<CanvasAxes>>("canvas", {})), CANVAS_DEFAULTS));
  useEffect(() => writeStored("colours", colours), [colours]);
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
    root.setAttribute("data-area-theme", theme);
    root.style.display = "none"; void root.offsetHeight; root.style.display = "";
    switchInstantly();
    writeStored("theme", theme);
    window.areaDesktop?.setTheme(theme);
  }, [theme]);

  // The app is drawn in Area's shipped defaults (owner, 2026-10-25: "choose it once and then set it and any further
  // customization through the theme page doesnt impact the ui of the electron app"; was every committed Inspector setting
  // from 2026-10-22): <html> carries the defaults, so the Titlebar, Sidebar and Inspector change only when a default does,
  // and the Inspector's settings paint the specimens alone (src/specimen-scope.tsx).
  const appliedPicks = useRef<string[]>([]);
  const chrome = useMemo(() => ({ canvas: CANVAS_DEFAULTS, material: MATERIAL_DEFAULT }), []);
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
      // The traffic lights stay centred on the Titlebar, which grows with type and density (39 at 13 Compact, 53 at 14/32).
      const bar = document.querySelector(".studio-titlebar")?.getBoundingClientRect().height;
      if (bar) window.areaDesktop?.setTitlebar?.(bar);
    });
    return () => cancelAnimationFrame(frame);
  }, [chrome, theme]);

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

  // The app's chrome inside the Canvas (tile heads, section titles) at the default type and density (src/app-scale.ts).
  const scale = useMemo<AppScale>(() => ({ "data-area-type": CANVAS_DEFAULTS.type, "data-area-density": CANVAS_DEFAULTS.density }), []);
  const state = useMemo<StudioState>(() => ({
    query,
    theme,
    canvas,
    setCanvas: (axis, value) => {
      // A page setting written hands its mode's page back to the settings: the pick would hide it.
      const dropped = (["light", "dark"] as const).filter(mode => colours[mode] !== null && PAGE_AXES[mode].includes(axis));
      if (dropped.length) setColoursState(current => ({ ...current, ...Object.fromEntries(dropped.map(mode => [mode, null])) }));
      setCanvasState(current => {
        const next = { ...current, [axis]: value };
        saveCanvas(next);
        return next;
      });
    },
    material,
    setMaterialBundle: bundle => {
      const next = { bundle, overrides: {} };
      writeStored("material", next);
      setMaterialState(next);
      const layers = MATERIAL_BUNDLES[bundle]?.layers ?? {};
      if (Object.keys(layers).length) setCanvasState(current => {
        const merged = { ...current, ...layers };
        saveCanvas(merged);
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
    shown: { canvas: { ...canvas, ...previewAxes }, material: previewedMaterial ?? material, colours: shownColours(colours, previewAxes) },
    colours,
    setColours: patch => setColoursState(current => ({ ...current, ...patch })),
    brand,
    setBrand: patch => setBrandState(current => {
      const next = { ...current, ...patch };
      writeStored("brand", next);
      return next;
    }),
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
  }), [query, theme, canvas, material, previewAxes, previewedMaterial, brand, colours, item, tab, go, panels, inspectorView]);
  // The picks' one rule is in the head while there are any; the scopes that carry the settings carry data-area-colours.
  useColoursSheet(state.shown.colours);

  const current = TABS.find(entry => entry.id === tab)!;
  return (
    <StudioContext.Provider value={state}>
    <AppScaleContext.Provider value={scale}>
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
          tab === "imagery" ? <ImageryPage /> : <ColorPage />}
      </div>
      </ChatProvider>
    </AppScaleContext.Provider>
    </StudioContext.Provider>
  );
}

/**
 * An icon Button in the app's chrome (Titlebar, Inspector headings): ghost, neutral, small, named
 * by its label, which an Area Tooltip shows below it with the shortcut, if any.
 */
export function ChromeButton({ label, icon, keys, shortcut, onClick, pressed, tabIndex }: { label: string; icon: ReactNode; keys?: string[]; shortcut?: string; onClick: () => void; pressed?: boolean; tabIndex?: number }) {
  // The tooltip repeats the name, so it only shows; the shortcut reaches assistive tech as
  // aria-keyshortcuts ("Meta+B").
  return (
    <Tooltip side="bottom" describes={false} trigger={
      <Button variant="ghost" tone="neutral" size="sm" iconOnly className="studio-bar-icon" icon={icon} aria-label={label} aria-pressed={pressed} aria-keyshortcuts={shortcut} tabIndex={tabIndex} onClick={onClick} />
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
const INSPECTOR_FLOOR: Record<string, number> = {
  "12/28": 260, "12/32": 260, "12/36": 260,
  "13/28": 256, "13/32": 272, "13/36": 304,
  "14/28": 272, "14/32": 296, "14/36": 332,
  "15/28": 324, "15/32": 324, "15/36": 360,
  "16/28": 332, "16/32": 332, "16/36": 368,
};

function usePanelWidth(panel: keyof typeof WIDTHS, type: string, density: string) {
  const limits = WIDTHS[panel];
  const scale = panel === "sidebar" ? (Number(type) || 13) / 13 : 1;
  const min = panel === "inspector" ? INSPECTOR_FLOOR[`${type}/${density}`] ?? limits.min : Math.round(limits.min * scale);
  const max = Math.max(min, Math.round(limits.max * scale));
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
  /** The tab's list, in a <SidebarList>. The Sidebar has no title bar (owner, 2026-10-11). */
  sidebar: ReactNode;
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
   * The Inspector: its three views (InspectorViews), or one body with no views (a lab tab). A page leaves out a view it
   * has nothing for, and the shell leaves out its tab (rule 14: a control that does not apply is left out).
   */
  inspector: ReactNode | InspectorViews;
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
export function canvasAttributes(shown: CanvasAxes, material: Parameters<typeof materialAttributes>[0]): Record<string, string | undefined> {
  return { "data-area-neutral": shown.neutral, "data-area-tint-hue": shown["tint-hue"], "data-area-tint-hue-dark": shown["tint-hue-dark"], "data-area-tint-light": shown["tint-light"], "data-area-tint-dark": shown["tint-dark"], "data-area-ink-tint": shown["ink-tint"], "data-area-accent": shown.accent, "data-area-accent-strength": shown["accent-strength"], "data-area-solid-light": shown["solid-light"], "data-area-solid-dark": shown["solid-dark"], "data-area-label-tint": shown["label-tint"], "data-area-status-colours": shown["status-colours"], "data-area-ground-light": shown["ground-light"], "data-area-ground-dark": shown["ground-dark"], "data-area-layers-light": shown["layers-light"], "data-area-layers-dark": shown["layers-dark"], "data-area-card-tone-light": shown["card-tone-light"], "data-area-card-tone-dark": shown["card-tone-dark"], "data-area-action": shown.action, "data-area-selection": shown.selection, "data-area-contrast": shown.contrast === "system" ? undefined : shown.contrast, "data-area-type": shown.type, "data-area-density": shown.density, "data-area-radius": shown.radius, "data-area-surface": shown.surface, "data-area-shadow-rest": shown["shadow-rest"], "data-area-elevation": shown.elevation, ...Object.fromEntries(DEPTH_LEVER_AXES.map(axis => [`data-area-${axis}`, shown[axis]])), "data-area-motion": shown.motion, "data-area-easing": shown.easing, "data-area-feedback": shown.feedback, "data-area-pills": shown.pills, ...materialAttributes(material) };
}
/** The shipped defaults as attributes: what <html> and the Canvas body carry (PRODUCT_UI.md, rule 18). */
const DEFAULT_ATTRIBUTES = canvasAttributes(CANVAS_DEFAULTS, MATERIAL_DEFAULT);

/*
 * Three columns under the Titlebar, without titles (owner, 2026-10-14, after Framer and Figma):
 * the Canvas has a header for its view options, and its controls, the Sidebar's first row and the
 * Inspector's first heading sit on one line. Every region insets its content by Panel's 14
 * (src/studio.css).
 */
export function Workspace({ sidebar, lead, canvasLead, canvasTitle, canvasActions, canvas, inspector, canvasRef, canvasScope, canvasPicks = true, panels = true }: WorkspaceProps) {
  const studio = useStudio();
  const showSidebar = panels && studio.sidebar, showInspector = panels && studio.inspector;
  const sidebarWidth = usePanelWidth("sidebar", CANVAS_DEFAULTS.type, CANVAS_DEFAULTS.density);
  const inspectorWidth = usePanelWidth("inspector", CANVAS_DEFAULTS.type, CANVAS_DEFAULTS.density);
  // The body, its cards, titles and header are app UI, at the shipped defaults; only the specimens inside take the
  // Inspector's settings and the Material (owner, 2026-10-26: "the actual components themselves that sit inside the
  // containers would be the only things that update with the controls"), through the scope the tiles, the Stage and the
  // samples read (src/specimen-scope.tsx). A tab that keeps its previews to itself (the Theme tab) gives its specimens no
  // scope and restates the Setup scale; System Contrast writes no attribute, so it states the OS's level itself.
  const systemContrast = typeof matchMedia === "function" && matchMedia("(prefers-contrast: more)").matches ? "8" : "0";
  const axes = canvasPicks ? { ...canvasScope, ...DEFAULT_ATTRIBUTES } : { ...DEFAULT_ATTRIBUTES, "data-area-contrast": systemContrast, ...SETUP_SCALE, ...canvasScope };
  // A brand (src/brand.ts) reaches the specimens with the settings: they carry data-area-brand, and its one rule is in the
  // document's head while Brand is on, so the body, cards and titles keep Area's palette.
  const brand = canvasPicks && studio.brand.on ? studio.brand : null;
  useBrandSheet(brand);
  const specimens = useMemo(() => canvasPicks ? { ...movedFrom(canvasAttributes(studio.shown.canvas, studio.shown.material), DEFAULT_ATTRIBUTES), ...(brand ? { "data-area-brand": "" } : {}), ...(hasColours(studio.shown.colours) ? { "data-area-colours": "" } : {}) } : {}, [canvasPicks, studio.shown, brand]);
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
    <div className="studio-workspace" data-sidebar={lead || showSidebar ? "" : undefined} data-inspector={showInspector ? "" : undefined}>
      {/* The Sidebar is chrome on a recessed ground (owner, 2026-10-22; cursor-audit-2026-10-22.md item 4), as the
          Testing screens' sidebars: the Panel is a chrome region painting the fill styles/app.css names (panel.css) and
          declares the recessed ground, so its row plates step from what is under them (layers.css). */}
      {lead ? <div className="studio-lead">{lead}</div> : showSidebar ? (
        <div className="studio-sidebar">
          <Panel flush resizable="end" aria-label="Sidebar" data-area-chrome="" data-area-ground="recessed" {...sidebarWidth}>{sidebar}</Panel>
        </div>
      ) : null}
      <main ref={main} className="studio-canvas" aria-label={canvasTitle}>
        <header className="studio-canvas__bar">{canvasLead}{canvasActions}</header>
        <div ref={canvasRef} className="studio-canvas__body" {...axes}><SpecimenScopeContext.Provider value={specimens}>{canvas}</SpecimenScopeContext.Provider></div>
      </main>
      {showInspector ? (
        <div className="studio-inspector">
          {isViews(inspector) ? <InspectorPanel views={inspector} width={inspectorWidth} />
            : <Panel flush bareBar resizable="start" aria-label="Inspector" {...inspectorWidth}>{inspector}</Panel>}
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
    // A bare bar: no rule under the views (owner, 2026-10-22; cursor-audit-2026-10-22.md item 4), as the Canvas header.
    <Panel flush bareBar resizable="start" aria-label="Inspector" {...width} viewportRef={scroller}
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
 * The Sidebar as a tree (owner, 2026-10-24: "can you make the left nav more like a tree?"): All, then each group a branch
 * that opens and closes, its rows under it, on Area's Tree view (one Tab stop, the arrows, typeahead). A row narrows the
 * Canvas as a Nav row did; a branch only opens and closes. Every branch starts open, and stays as it is set while the tab
 * is open. A pinnable row's id is `key:<key>` and a row under Pinned `pin:<key>` (organize.tsx, PinMenu); without
 * `onSelect` a row selects its key, the prefix dropped.
 *
 * A row may hold rows of its own (owner, 2026-10-25: a component's variants "should live under the tree view … as
 * legitimate standalone design items"). Those branches start closed, and `reveal` opens the ones that hold what the
 * Canvas shows, so the current row is always in view; an `axis:` row only opens and closes, as a group does.
 */
export interface SidebarTreeGroup { id: string; label: string; items: TreeViewNode[] }
export function SidebarTree({ tab, label, count, groups, current, reveal, onSelect }: {
  tab: TabId; label: string; count: number; groups: SidebarTreeGroup[]; current?: string; reveal?: string[]; onSelect?: (id: string) => void;
}) {
  const { select } = useStudio();
  const branches = groups.filter(group => group.items.length).map(group => `group:${group.id}`);
  const [closed, setClosed] = useState<string[]>([]);
  // Nested branches the person opened, and those `reveal` opened for them.
  const [opened, setOpened] = useState<string[]>(reveal ?? []);
  const revealKey = (reveal ?? []).join("|");
  useEffect(() => { if (reveal?.length) setOpened(open => [...new Set([...open, ...reveal])]); }, [revealKey]);
  const items: TreeViewNode[] = [
    { id: "all", label: "All", trailing: <Count count={count} max={9999} /> },
    ...groups.filter(group => group.items.length).map(group => ({ id: `group:${group.id}`, label: group.label, trailing: <Count count={group.items.length} max={9999} />, children: group.items })),
  ];
  const now = current ?? "all";
  const toggle = (id: string) => setOpened(open => open.includes(id) ? open.filter(entry => entry !== id) : [...open, id]);
  return (
    <TreeView aria-label={label} className="studio-sidebar__tree" items={items} currentId={now} selectedIds={[now]}
      expandedIds={[...branches.filter(id => !closed.includes(id)), ...opened]}
      onExpandedChange={ids => { setClosed(branches.filter(id => !ids.includes(id))); setOpened(ids.filter(id => !id.startsWith("group:"))); }}
      onActivate={id => {
        if (id.startsWith("group:")) { setClosed(open => open.includes(id) ? open.filter(entry => entry !== id) : [...open, id]); return; }
        if (id.startsWith("axis:")) { toggle(id); return; }
        if (id === "all") select(""); else if (onSelect) onSelect(id); else select(id.replace(/^(key|pin):/, ""));
      }}
      data-tab={tab} />
  );
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
