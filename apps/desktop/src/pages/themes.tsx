/**
 * Themes, a brand's first section (docs/research/app-structure-2026-10-28, Phase 1): the brand's themes, each its
 * settings, Material and exact colours. Area has one, Default, which is what the Inspector's Theme view edits; New theme
 * opens the Setup chat (theme-setup.tsx), which writes the same settings. Several themes per brand come in Phase 2, when
 * the settings become the open brand's theme.
 *
 * The card draws Setup's product screen (setup-screen.tsx) in the theme, so a theme is seen by what it does.
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

/** A theme card is wide enough to read the screen in it: the feed's 300 card (PRODUCT_UI.md, the Canvas feed). */
const THEME_MIN = 300; /* pick */

export function ThemesPage() {
  const { item, select, navigate, shown, brand, theme, canvas } = useStudio();
  const chosen = item === "default";
  const scope = { ...canvasAttributes(shown.canvas, shown.material), ...(hasColours(shown.colours) ? { "data-area-colours": "" } : {}), ...(brand.on ? { "data-area-brand": "" } : {}), "data-area-theme": theme };
  const changed = (Object.keys(CANVAS_DEFAULTS) as Array<keyof typeof CANVAS_DEFAULTS>).filter(axis => canvas[axis] !== CANVAS_DEFAULTS[axis]).length;
  return (
    <Workspace
      canvasTitle="Themes"
      canvasActions={
        <ViewControls>
          <Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />} onClick={() => navigate({ page: "theme-setup" })}>New theme</Button>
        </ViewControls>
      }
      canvas={
        <div className="studio-sections">
          <CanvasSection id="themes" title="Themes" count={1} lede="Each theme is a brand's settings, Material and exact colours. New theme makes one in a chat.">
            <TileGrid span="wide" cards min={THEME_MIN}>
              <Tile span="wide" stage="fit" inert label="Default" selected={chosen} onSelect={() => select("default")}
                onOpen={() => navigate({ page: "foundations" })}>
                <ScreenFigure className="studio-theme-card" scope={scope} />
              </Tile>
            </TileGrid>
          </CanvasSection>
        </div>
      }
      inspector={{
        theme: <CanvasSettings />,
        design: (
          <PanelSection heading={chosen ? "Default" : "Themes"}>
            <Facts label="Theme" items={chosen ? [
              ["Name", "Default"],
              ["Changed", changed ? `${changed} of ${Object.keys(CANVAS_DEFAULTS).length} settings` : "None: Area's defaults"],
            ] : [
              ["Themes", 1],
              ["Edited in", "Inspector › Theme, or New theme"],
            ]} />
          </PanelSection>
        ),
      }}
    />
  );
}
