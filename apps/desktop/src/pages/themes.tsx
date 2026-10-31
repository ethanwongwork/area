/**
 * Themes, a system's first section (docs/research/app-structure-2026-10-28, Phases 1 and 2): the open system's themes, each
 * its settings, Material and exact colours (src/systems.ts). The theme the system uses is what the Inspector's Theme view
 * edits and every page of the system paints in; opening another theme (a double-click, or Use in the Inspector) makes it the
 * one used. New theme adds one at Area's values and opens the Setup chat on it (theme-setup.tsx), which writes it.
 *
 * Each card draws Setup's product screen (setup-screen.tsx) in its theme, so a theme is seen by what it does. Exact colours
 * are one rule in the document's head (src/colours.ts, src/brand.ts), drawn for the theme in use alone.
 *
 * Three views of the Canvas. Screen, the first (owner, 2026-10-31): the theme in use on the Workspace, alone on a grey
 * ground, fitted or zoomed, its mode, ground and states in the header (src/screen-viewer.tsx, a trial of how a project's
 * screens are viewed). Close-up (the Playground, owner 2026-10-30: "focus on the actual theme playground/creation/editing
 * experience"): one setting at a time, the Inspector row last pressed or focused (`data-setting`, src/inspector-rows.tsx),
 * its components in bento tiles at 1× or 2× as the component review page does (src/setting-preview.tsx), live as the row
 * moves and while a list's option is hovered. Themes is the cards.
 */
import { useEffect, useState, type SyntheticEvent } from "react";
import { Button, PanelSection } from "@area/react";
import { AddIcon } from "@area/icons";
import { canvasAttributes, CANVAS_DEFAULTS, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, Tile, TileGrid } from "../tile.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewLead } from "../view-controls.tsx";
import { Playground, settingHint, settingName } from "../setting-preview.tsx";
import { Facts } from "../facts.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { SHOWCASE, ScreenFigure } from "../setup-screen.tsx";
import { useScreenViewer } from "../screen-viewer.tsx";
import { hasColours } from "../colours.ts";
import type { SystemTheme } from "../systems.ts";

/** A theme card is wide enough to read the screen in it: the feed's 300 card (PRODUCT_UI.md, the Canvas feed). */
const THEME_MIN = 300; /* pick */

export function ThemesPage() {
  const { item, select, navigate, place, shown, brand, theme, openSystem, openTheme, chooseTheme, addTheme } = useStudio();
  const chosen = openSystem.themes.find(entry => entry.id === item) ?? null;
  const scopeOf = (entry: SystemTheme) => entry === openTheme
    ? { ...canvasAttributes(shown.canvas, shown.material), ...(hasColours(shown.colours) ? { "data-area-colours": "" } : {}), ...(brand.on ? { "data-area-brand": "" } : {}), "data-area-theme": theme }
    : { ...canvasAttributes(entry.canvas, entry.material), "data-area-theme": theme };
  const changedOf = (entry: SystemTheme) => (Object.keys(CANVAS_DEFAULTS) as Array<keyof typeof CANVAS_DEFAULTS>).filter(axis => entry.canvas[axis] !== CANVAS_DEFAULTS[axis]).length;
  // The new theme is the one used, so the Setup chat writes it.
  const newTheme = () => { addTheme(); navigate({ page: "theme-setup" }); };
  const [view, setView] = useViewOption<"screen" | "close-up" | "themes">("themes-view", "screen", ["screen", "close-up", "themes"]);
  const viewer = useScreenViewer({ scope: scopeOf(openTheme), appMode: theme });
  // An old Foundations link to one setting opens on its close-up.
  useEffect(() => { if (place.page === "settings" && place.item) setView("close-up"); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const [zoom, setZoom] = useViewOption<"1" | "2">("playground-zoom", "2", ["1", "2"]);
  // The Inspector row last pressed or focused: what the Playground shows; an old Foundations link to one setting opens on it.
  const [touched, setTouched] = useState<string | null>(() => place.page === "settings" && place.item ? place.item : null);
  const touch = (event: SyntheticEvent) => {
    const setting = (event.target as Element | null)?.closest?.("[data-setting]")?.getAttribute("data-setting");
    if (setting) setTouched(setting);
  };
  return (
    <Workspace
      canvasTitle="Themes"
      // What is shown at the header's start, as menus; how (zoom, New theme) at its end.
      canvasLead={
        <ViewLead>
          <ViewFilter label="View" align="start" value={view} onChange={setView}
            options={[{ value: "screen", label: "Screen" }, { value: "close-up", label: "Close-up" }, { value: "themes", label: "Themes" }]} />
          {view === "screen" ? viewer.lead : null}
          {view === "close-up" ? <ViewFilter label="Scale" align="start" value={zoom} onChange={setZoom}
            options={[{ value: "1", label: "1×" }, { value: "2", label: "2×" }]} /> : null}
        </ViewLead>
      }
      canvasActions={
        <ViewControls>
          {view === "screen" ? viewer.controls : null}
          {view === "themes" ? <Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />} onClick={newTheme}>New theme</Button> : null}
        </ViewControls>
      }
      // The page's own headings stay at the app's look; the Playground's tiles and the cards take the theme.
      canvasPicks={false}
      canvas={view === "screen" ? viewer.stage : view === "close-up" ? (
        <div className="studio-sections">
          <CanvasSection id="playground" title={touched ? settingName(touched) : "Close-up"}
            lede={touched ? settingHint(touched) ?? `What ${settingName(touched)} changes, as you change it.` : "Change a setting in the Inspector to see the components it changes, up close."}>
            {touched ? <Playground setting={touched} zoom={zoom} scope={scopeOf(openTheme)} values={shown.canvas} /> : null}
          </CanvasSection>
        </div>
      ) : (
        <div className="studio-sections">
          <CanvasSection id="themes" title="Themes" count={openSystem.themes.length} lede={`${openSystem.name} uses ${openTheme.name}. Each theme is the system's settings, Material and exact colors; New theme makes one in a chat.`}>
            <TileGrid span="wide" cards min={THEME_MIN}>
              {openSystem.themes.map(entry => (
                <Tile key={entry.id} span="wide" stage="fit" inert label={entry.name} value={entry === openTheme ? "In use" : undefined}
                  selected={chosen?.id === entry.id} onSelect={() => select(entry.id, { replace: true })}
                  onOpen={() => { if (entry === openTheme) setView("screen"); else chooseTheme(entry.id); }}>
                  <ScreenFigure className="studio-theme-card" hold={SHOWCASE} scope={scopeOf(entry)} />
                </Tile>
              ))}
            </TileGrid>
          </CanvasSection>
        </div>
      )}
      inspector={{
        // A wrapper that draws nothing (display: contents), so the Inspector's sections keep their layout.
        theme: <div className="studio-contents" onPointerDownCapture={touch} onFocusCapture={touch}><CanvasSettings /></div>,
        design: chosen ? (<>
          <PanelSection>
            <div className="studio-inspector-actions">
              {chosen === openTheme
                ? <Button size="sm" variant="soft" tone="neutral" onClick={() => setView("screen")}>View on a screen</Button>
                : <Button size="sm" variant="soft" tone="neutral" onClick={() => chooseTheme(chosen.id)}>Use</Button>}
            </div>
          </PanelSection>
          <PanelSection heading={chosen.name}>
            <Facts label="Theme" items={[
              ["Name", chosen.name],
              ["In use", chosen === openTheme ? "Yes" : "No"],
              ["Changed", changedOf(chosen) ? `${changedOf(chosen)} of ${Object.keys(CANVAS_DEFAULTS).length} settings` : "None: Area's defaults"],
            ]} />
          </PanelSection>
        </>) : (
          <PanelSection heading="Themes">
            <Facts label="Theme" items={[
              ["Themes", openSystem.themes.length],
              ["In use", openTheme.name],
              ["Edited in", "Inspector › Theme, or New theme"],
            ]} />
          </PanelSection>
        ),
      }}
    />
  );
}
