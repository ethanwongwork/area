/**
 * Testing (the Examples tab until 2026-10-17): whole screens built only from Area, to test the system the way a product would use it (owner,
 * 2026-10-17). The Sidebar lists the examples; the Canvas shows the chosen one at full size, inside the Canvas's
 * settings, so every Inspector setting (colour, Layers, type, density, radius, surface, elevation, motion) reaches it;
 * All shows each example as a tile. The Inspector holds every Canvas setting, then the example's facts.
 */
import { Code, Count, EmptyState, Nav, NavGroup, NavItem, PanelSection } from "@area/react";
import { SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { Tile, TileGrid } from "../tile.tsx";
import { Facts } from "../facts.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { matches } from "../search.ts";
import { AnalyticsDashboard } from "../content/examples/analytics.tsx";

const EXAMPLES = [
  {
    id: "analytics",
    label: "Analytics dashboard",
    description: "A product analytics overview: sidebar, top bar, filters, KPI cards, a chart, a table and activity.",
    families: ["Titlebar", "Nav", "Breadcrumb", "Search field", "Button", "Tooltip", "Avatar", "Section heading", "Segmented", "Date range picker", "Select", "Menu", "Alert", "Card", "Badge", "Meter", "Tabs", "Table", "Pagination", "Timeline", "Dialog", "Field", "Input", "Switch", "Checkbox", "Toast"],
    gaps: ["Chart: Area has no chart component; the line chart is an SVG drawn in Area's tokens."],
    Screen: AnalyticsDashboard,
  },
] as const;

export function ExamplesPage() {
  const { query, item, select } = useStudio();
  const shown = EXAMPLES.filter(entry => matches(query, entry.label, entry.description, ...entry.families));
  const example = EXAMPLES.find(entry => entry.id === item);
  return (
    <Workspace
      sidebar={<SidebarList>{
        <Nav aria-label="Testing">
          <SidebarAll tab="testing" count={shown.length} current={!example} />
          <NavGroup label="Screens">
            {shown.map(entry => (
              <NavItem key={entry.id} href={`#testing/${entry.id}`} current={entry.id === example?.id}
                onClick={event => { event.preventDefault(); select(entry.id); }}
                trailing={<Count count={entry.families.length} />}>
                {entry.label}
              </NavItem>
            ))}
          </NavGroup>
        </Nav>
      }</SidebarList>}
      canvasTitle={example ? example.label : "All tests"}
      canvas={example ? (
        <div className="ex-canvas"><example.Screen /></div>
      ) : !shown.length ? (
        <EmptyState title="Nothing to test" description={`Nothing matches “${query}”.`} />
      ) : (
        <TileGrid span="wide">
          {shown.map(entry => (
            <Tile key={entry.id} span="wide" stage="center" inert card label={entry.label} openOnClick onOpen={() => select(entry.id)}>
              <div className="ex-thumb" aria-hidden="true"><entry.Screen /></div>
            </Tile>
          ))}
        </TileGrid>
      )}
      inspector={
        <>
          <CanvasSettings />
          <PanelSection heading={example ? "Screen" : "Testing"}>
            <Facts label={example ? "Screen" : "Testing"} items={example ? [
              ["Screen", example.label],
              ["Shows", example.description],
              ["Families", `${example.families.length}: ${example.families.join(", ")}`],
              ["Not from Area", example.gaps.join(" ")],
              ["Source", <Code>apps/desktop/src/content/examples/{example.id}.tsx</Code>],
            ] : [
              ["Screens", EXAMPLES.length],
              ["Purpose", "Whole screens built only from Area, to test the defaults and every setting the way a product would."],
            ]} />
          </PanelSection>
        </>
      }
    />
  );
}
