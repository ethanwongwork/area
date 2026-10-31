/**
 * Themes, a system's first section (docs/research/app-structure-2026-10-28, Phases 1 and 2): the open system's themes, each
 * its settings, Material and exact colours (src/systems.ts). The theme the system uses is what the Inspector's Theme view
 * edits and every page of the system paints in; opening another theme (a double-click, or Use in the Inspector) makes it the
 * one used. New theme adds one at Area's values and opens the Setup chat on it (theme-setup.tsx), which writes it.
 *
 * Each card draws Setup's product screen (setup-screen.tsx) in its theme, so a theme is seen by what it does. Exact colours
 * are one rule in the document's head (src/colours.ts, src/brand.ts), drawn for the theme in use alone.
 */
import { Button, PanelSection } from "@area/react";
import { AddIcon } from "@area/icons";
import { canvasAttributes, CANVAS_DEFAULTS, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, Tile, TileGrid } from "../tile.tsx";
import { ViewControls } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { ScreenFigure } from "../setup-screen.tsx";
import { hasColours } from "../colours.ts";
import type { SystemTheme } from "../systems.ts";

/** A theme card is wide enough to read the screen in it: the feed's 300 card (PRODUCT_UI.md, the Canvas feed). */
const THEME_MIN = 300; /* pick */

export function ThemesPage() {
  const { item, select, navigate, shown, brand, theme, openSystem, openTheme, chooseTheme, addTheme } = useStudio();
  const chosen = openSystem.themes.find(entry => entry.id === item) ?? null;
  const scopeOf = (entry: SystemTheme) => entry === openTheme
    ? { ...canvasAttributes(shown.canvas, shown.material), ...(hasColours(shown.colours) ? { "data-area-colours": "" } : {}), ...(brand.on ? { "data-area-brand": "" } : {}), "data-area-theme": theme }
    : { ...canvasAttributes(entry.canvas, entry.material), "data-area-theme": theme };
  const changedOf = (entry: SystemTheme) => (Object.keys(CANVAS_DEFAULTS) as Array<keyof typeof CANVAS_DEFAULTS>).filter(axis => entry.canvas[axis] !== CANVAS_DEFAULTS[axis]).length;
  // The new theme is the one used, so the Setup chat writes it.
  const newTheme = () => { addTheme(); navigate({ page: "theme-setup" }); };
  return (
    <Workspace
      canvasTitle="Themes"
      canvasActions={
        <ViewControls>
          <Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />} onClick={newTheme}>New theme</Button>
        </ViewControls>
      }
      canvas={
        <div className="studio-sections">
          <CanvasSection id="themes" title="Themes" count={openSystem.themes.length} lede={`${openSystem.name} uses ${openTheme.name}. Each theme is the system's settings, Material and exact colors; New theme makes one in a chat.`}>
            <TileGrid span="wide" cards min={THEME_MIN}>
              {openSystem.themes.map(entry => (
                <Tile key={entry.id} span="wide" stage="fit" inert label={entry.name} value={entry === openTheme ? "In use" : undefined}
                  selected={chosen?.id === entry.id} onSelect={() => select(entry.id, { replace: true })}
                  onOpen={() => { if (entry === openTheme) navigate({ page: "foundations" }); else chooseTheme(entry.id); }}>
                  <ScreenFigure className="studio-theme-card" scope={scopeOf(entry)} />
                </Tile>
              ))}
            </TileGrid>
          </CanvasSection>
        </div>
      }
      inspector={{
        theme: <CanvasSettings />,
        design: chosen ? (<>
          <PanelSection>
            <div className="studio-inspector-actions">
              {chosen === openTheme
                ? <Button size="sm" variant="soft" tone="neutral" onClick={() => navigate({ page: "foundations" })}>Foundations</Button>
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
