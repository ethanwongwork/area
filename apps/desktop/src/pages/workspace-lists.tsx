/**
 * Projects and Systems (owner, 2026-11-01: "what if the top header portion has home references projects and systems"):
 * two of the Sidebar's four places, each a tab of its own as References is, the workspace's projects or systems as
 * cards. A card selects (the Inspector shows it) and opens on a double-click, ⌘ in a tab of its own; New project and
 * New system are the bar's, Home's dialogs. The Sidebar lists the same under its rule (src/app-nav.tsx).
 *
 *   ProjectsPage  #projects/<project>   each project drawn in the theme it uses, as Home's feed draws it
 *   SystemsPage   #systems/<system>     each system's chosen theme as published
 */
import { Button, EmptyState, PanelSection } from "@area/react";
import { AddIcon } from "@area/icons";
import { canvasAttributes, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, Tile, TileGrid } from "../tile.tsx";
import { ViewControls } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { SHOWCASE, ScreenFigure } from "../setup-screen.tsx";
import { ThemeScreen } from "../publish.tsx";
import { activeTheme, asLive, liveOf, ORIGIN_LABEL, versionName } from "../systems.ts";
import { systemName } from "../places.ts";
import type { Project } from "../projects.ts";

/** A card's least width: the project overview's (src/pages/project.tsx CARD_MIN). */
const CARD_MIN = 300; /* pick */
const plural = (count: number, one: string, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;

export function ProjectsPage() {
  const { projects, systems, item, select, navigate, theme } = useStudio();
  const chosen = projects.find(entry => entry.id === item) ?? null;
  const newProject = () => navigate({ page: "home", item: "new-project" });
  // A project's card draws the theme it uses, as its system publishes it (Home's projectScope).
  const scope = (entry: Project) => {
    const system = systems.find(other => other.id === entry.system);
    const used = system ? asLive(system).themes.find(other => other.id === entry.theme) ?? activeTheme(asLive(system)) : null;
    return used ? { ...canvasAttributes(used.canvas, used.material), "data-area-theme": theme } : { "data-area-theme": theme };
  };
  return (
    <Workspace
      canvasTitle="Projects"
      canvasActions={<ViewControls><Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />} onClick={newProject}>New project</Button></ViewControls>}
      canvas={
        <div className="studio-sections">
          <CanvasSection id="projects" title="Projects" count={projects.length} lede="Where new things are made, each in one system's published look.">
            {projects.length ? (
              <TileGrid span="wide" cards min={CARD_MIN}>
                {projects.map(entry => (
                  <Tile key={entry.id} span="wide" stage="screen" inert label={entry.name} value={`${systemName(entry.system)}, ${plural(entry.pages.length, "page")}`}
                    selected={chosen?.id === entry.id} onSelect={() => select(entry.id, { replace: true })}
                    onOpen={how => navigate({ page: "project", project: entry.id }, { newTab: how?.newTab })}>
                    <ScreenFigure className="studio-theme-card" hold={SHOWCASE} scope={scope(entry)} />
                  </Tile>
                ))}
              </TileGrid>
            ) : (
              <EmptyState size="sm" title="No projects yet" description="A project makes new things in one system's published look."
                actions={<Button size="sm" variant="soft" tone="neutral" onClick={newProject}>New project</Button>} />
            )}
          </CanvasSection>
        </div>
      }
      inspector={{
        design: chosen ? (<>
          <PanelSection><div className="studio-inspector-actions"><Button size="sm" variant="soft" tone="neutral" onClick={() => navigate({ page: "project", project: chosen.id })}>Open</Button></div></PanelSection>
          <PanelSection heading={chosen.name}>
            <Facts label="Project" items={[["Uses", systemName(chosen.system)], ["Pages", chosen.pages.length], ["Explorations", chosen.explorations.length], ["Versions", chosen.versions.length]]} />
          </PanelSection>
        </>) : (
          <PanelSection heading="Projects"><Facts label="Projects" items={[["Projects", projects.length]]} /></PanelSection>
        ),
      }}
    />
  );
}

export function SystemsPage() {
  const { systems, item, select, navigate, theme } = useStudio();
  const chosen = systems.find(entry => entry.id === item) ?? null;
  const newSystem = () => navigate({ page: "home", item: "new" });
  return (
    <Workspace
      canvasTitle="Systems"
      canvasActions={<ViewControls><Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />} onClick={newSystem}>New system</Button></ViewControls>}
      canvas={
        <div className="studio-sections">
          <CanvasSection id="systems" title="Systems" count={systems.length} lede="Each a look and its rules, published in versions that projects use.">
            <TileGrid span="wide" cards min={CARD_MIN}>
              {systems.map(entry => {
                const live = liveOf(entry);
                return (
                  <Tile key={entry.id} span="wide" stage="screen" inert label={entry.name} status="published"
                    value="Live"
                    selected={chosen?.id === entry.id} onSelect={() => select(entry.id, { replace: true })}
                    onOpen={how => navigate({ page: "themes", system: entry.id }, { newTab: how?.newTab })}>
                    <ThemeScreen theme={activeTheme(asLive(entry))} mode={theme} />
                  </Tile>
                );
              })}
            </TileGrid>
          </CanvasSection>
        </div>
      }
      inspector={{
        design: chosen ? (<>
          <PanelSection><div className="studio-inspector-actions"><Button size="sm" variant="soft" tone="neutral" onClick={() => navigate({ page: "themes", system: chosen.id })}>Open</Button></div></PanelSection>
          <PanelSection heading={chosen.name}>
            <Facts label="System" items={[["Began from", ORIGIN_LABEL[chosen.origin]], ["Version", versionName(chosen.name, liveOf(chosen).version)], ["Themes", chosen.themes.length]]} />
          </PanelSection>
        </>) : (
          <PanelSection heading="Systems"><Facts label="Systems" items={[["Systems", systems.length]]} /></PanelSection>
        ),
      }}
    />
  );
}
