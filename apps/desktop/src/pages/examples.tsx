/**
 * Patterns (Testing before the places, the Examples tab until 2026-10-17): whole screens built only from Area, to test the system the way a
 * product would use it (owner, 2026-10-17). A screen that tries something out (a trial package, a bench of one setting) is a
 * test, in Labs › Tests, not a pattern (2026-10-31): a project adds patterns only. The Sidebar lists the examples; the Canvas shows the chosen one at full size, inside the Canvas's
 * settings, so every Inspector setting (colour, Layers, type, density, radius, surface, elevation, motion) reaches it;
 * All shows each example as a tile, which opens it in the design viewer (src/design-viewer.tsx, 2026-10-31) at its own
 * width (`width`, a desktop's 1440 unless it says), fitted, in Light, Dark or both, ← and → stepping through the list. The Inspector holds every Canvas setting, then the example's facts.
 */
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Code, Count, EmptyState, Nav, NavGroup, NavItem, PanelSection } from "@area/react";
import { SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { useDesignViewer } from "../design-viewer.tsx";
import { openDesign, useCardArrival } from "../morph.ts";
import { Specimen } from "../specimen-scope.tsx";
import { ViewControls, ViewLead } from "../view-controls.tsx";
import { hrefOf } from "../places.ts";
import { Tile, TileGrid, WhenVisible, type OpenHow } from "../tile.tsx";
import { Facts } from "../facts.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { matches } from "../search.ts";
import { AnalyticsDashboard } from "../content/examples/analytics.tsx";
import { ChatScreen } from "../chat/chat.tsx";
import { ABSTRACT_BOARD, AbstractBoard } from "../content/examples/abstract-board.tsx";
import { MobileScreen } from "../content/examples/mobile.tsx";
import { SettingsScreen } from "../content/examples/settings.tsx";
import { HairlineScreen } from "../content/examples/hairline.tsx";
import { StrokeGroupsScreen } from "../content/examples/stroke-groups.tsx";
import { WorkspaceScreen } from "../content/examples/workspace.tsx";
import { SHOWCASE } from "../setup-screen.tsx";

export const EXAMPLES = [
  {
    id: "analytics",
    label: "Analytics dashboard",
    description: "A product analytics overview: sidebar, top bar, filters, KPI cards, a chart, a table and activity.",
    families: ["Titlebar", "Nav", "Breadcrumb", "Search field", "Button", "Tooltip", "Avatar", "Section heading", "Segmented", "Date range picker", "Select", "Menu", "Alert", "Card", "Badge", "Meter", "Tabs", "Table", "Pagination", "Timeline", "Dialog", "Field", "Input", "Switch", "Checkbox", "Toast"],
    gaps: ["Chart: Area has no chart component; the line chart is an SVG drawn in Area's tokens."],
    Screen: AnalyticsDashboard,
  },
  {
    id: "chat",
    label: "Chat in the Inspector",
    description: "The Inspector's Chat view at its narrowest (256), a middle width (360) and its widest (500), each a finished recorded run.",
    families: ["Message", "Composer", "Model picker", "Prompt suggestions", "Scroll to latest", "Chip", "Code block", "Code", "Copy button", "Table", "Link", "Empty state", "Tooltip"],
    gaps: ["Steps and reasoning are plain lines until Phase 2's Step and Reasoning components; markdown is app-level until it is reviewed (docs/research/inspector-chat-2026-10-18)."],
    Screen: ChatScreen,
  },
  {
    id: "abstract-board",
    label: "Abstract board",
    description: "The owner's Pinterest board oval / abstract (26 interface pieces), each rebuilt from Area's components alone, at Area's defaults.",
    families: ["Panel", "Number field", "Select", "Segmented", "Toggle group", "Nav", "Search field", "Alignment picker", "Box field", "Box model", "Card", "Badge", "Folder", "Avatar", "Count", "Checkbox", "Radio", "Switch", "Date picker", "Pagination", "Dialog", "Menu", "Toolbar", "Titlebar", "Composer", "Kbd", "Custom select", "Table", "Split button", "Button", "Skeleton"],
    gaps: ABSTRACT_BOARD.flatMap(piece => piece.gaps.map(gap => `${piece.id} ${piece.title}: ${gap}`)),
    Screen: AbstractBoard,
  },
  {
    id: "settings",
    label: "Appearance settings",
    description: "A settings page after Untitled UI's Appearance: a label and its description beside each control, theme thumbnails, swatches, a switch, a select, then Cancel and Save (2026-10-21).",
    families: ["Nav", "Avatar", "Section heading", "Separator", "Color swatch picker", "Radio", "Switch", "Select", "Button"],
    gaps: [],
    Screen: SettingsScreen,
  },
  {
    id: "mobile",
    label: "Mobile Today",
    description: "A phone's Today at 390, after a journal app: times down a dashed line, a note, tasks with chips, a card, a composer at the foot (2026-10-21).",
    families: ["Button", "Segmented", "Checkbox", "Chip", "Card", "Avatar", "Badge", "Composer"],
    gaps: ["The dashed time line and the time pills are app CSS: Timeline has no dashed line or pill markers."],
    // A phone draws its own body and corner.
    width: 390, bare: true,
    Screen: MobileScreen,
  },
  {
    id: "hairline",
    label: "Hairline empty states (trial)",
    test: true,
    description: "Lucas Marques's isometric line figures (@lucasmarkes/hairline 0.5.1, MIT) above Empty states, themed with Area's tokens; each answers the pointer (2026-10-24).",
    families: ["Empty state", "Button", "Segmented"],
    gaps: ["Empty state has no figure slot: its icon slot holds a 16 glyph, so the figure sits above it.", "The figures are a third-party package on trial, not part of Area."],
    Screen: HairlineScreen,
  },
  {
    id: "workspace",
    label: "Workspace",
    description: "The showcase every theme is seen on (2026-10-30): a generic desktop app at 1920 × 1080, with its menu open and its toast showing.",
    families: ["Panel", "Nav", "Card", "Alert", "Table", "Badge", "Avatar", "Composer", "Field", "Select", "Segmented", "Slider", "Chip", "Switch", "Radio", "Menu", "Toast", "Meter", "Kbd", "Count", "Tabs"],
    gaps: ["The window's lights are app CSS: Area has no window-controls part."],
    width: 1920,
    Screen: () => <WorkspaceScreen hold={new Set(SHOWCASE)} />,
  },
  {
    id: "stroke-groups",
    label: "Stroke groups",
    test: true,
    description: "Every stroke group (Inspector › Stroke), each group's members in one cell at the Canvas's settings (2026-10-30).",
    families: ["Card", "Panel", "Menu", "Popover", "Dialog", "Alert", "Toast", "Code block", "Table", "Input", "Select", "Button", "Segmented", "Slider", "Switch", "Progress", "Radio", "Badge", "Chip", "Count", "Kbd", "Avatar"],
    gaps: [],
    Screen: StrokeGroupsScreen,
  },
] as const;

type Example = typeof EXAMPLES[number];
const isTest = (entry: Example) => "test" in entry && entry.test;
/** A screen's width in the viewer: its own, else a desktop's. */
const DESKTOP = 1440; /* pick: a laptop's common width */
const widthOf = (entry: Example) => "width" in entry ? entry.width : DESKTOP;
const isBare = (entry: Example) => "bare" in entry && entry.bare;
/** A screen as the design viewer draws it (src/design-viewer.tsx): Patterns, Tests and a project's screen layers. */
export const screenDesign = (entry: Example) => ({
  width: widthOf(entry), frame: isBare(entry) ? "bare" as const : "window" as const,
  render: (mode: "light" | "dark") => <Specimen className={isBare(entry) ? undefined : "studio-viewer__design"} data-area-theme={mode}><entry.Screen /></Specimen>,
});
/** The system's screens: what Patterns lists and a project adds. */
export const PATTERNS = EXAMPLES.filter(entry => !isTest(entry));
/** The screens that try something out: Labs › Tests. */
export const TESTS = EXAMPLES.filter(isTest);

/** Patterns, or with `lab` the Tests lab: the same page over its own screens. */
export function ExamplesPage({ lab = false }: { lab?: boolean }) {
  const { query, item, select, theme, navigate } = useStudio();
  const list = lab ? TESTS : PATTERNS;
  const page = lab ? "tests" as const : "patterns" as const;
  const shown = list.filter(entry => matches(query, entry.label, entry.description, ...entry.families));
  const example = list.find(entry => entry.id === item);
  // The viewer steps through the list it was opened from (the search's results, else every screen).
  const siblings = example && shown.includes(example) ? shown : list;
  const at = example ? siblings.indexOf(example) : -1;
  // ⌘-click opens the screen in a tab of its own (owner's pick, 2026-10-31); otherwise it opens here, from its card.
  const open = (id: string, how?: OpenHow) => {
    if (how?.newTab) { navigate({ page, item: id }, { newTab: true }); return; }
    openDesign(`${page}:${id}`);
    select(id);
  };
  const viewed = example ?? list[0]!;
  const viewer = useDesignViewer({
    active: Boolean(example), design: `${page}:${viewed.id}`, label: viewed.label, appMode: theme, ...screenDesign(viewed),
    back: { label: lab ? "Back to Tests" : "Back to Patterns", onBack: () => select("") },
    step: { index: at, count: siblings.length, noun: "screen", onStep: by => select(siblings[(at + by + siblings.length) % siblings.length]!.id, { replace: true }) },
  });
  useCardArrival();
  return (
    <Workspace
      sidebar={<SidebarList>{
        <Nav aria-label={lab ? "Tests" : "Patterns"}>
          <SidebarAll count={shown.length} current={!example} />
          <NavGroup label="Screens">
            {shown.map(entry => (
              <NavItem key={entry.id} href={hrefOf({ page, item: entry.id })} current={entry.id === example?.id}
                onClick={event => { event.preventDefault(); select(entry.id); }}
                trailing={<Count count={entry.families.length} />}>
                {entry.label}
              </NavItem>
            ))}
          </NavGroup>
        </Nav>
      }</SidebarList>}
      canvasTitle={example ? example.label : lab ? "All tests" : "All patterns"}
      canvasLead={example ? <ViewLead>{viewer.lead}</ViewLead> : undefined}
      canvasActions={example ? <ViewControls>{viewer.controls}</ViewControls> : undefined}
      canvas={example ? viewer.stage : !shown.length ? (
        <EmptyState title={lab ? "No tests" : "No patterns"} description={`Nothing matches “${query}”.`} />
      ) : (
        <TileGrid span="wide" cards>
          {shown.map(entry => (
            <Tile key={entry.id} span="wide" stage="center" shape="wide" inert card label={entry.label} openOnClick onOpen={how => open(entry.id, how)} data-design={`${page}:${entry.id}`}>
              {/* A whole screen per tile: each draws as it nears the view (tile.tsx WhenVisible). */}
              <WhenVisible estimate={320}><WidthZoom><div className="ex-thumb" aria-hidden="true"><entry.Screen /></div></WidthZoom></WhenVisible>
            </Tile>
          ))}
        </TileGrid>
      )}
      inspector={{
        theme: <CanvasSettings />,
        design: (
          <PanelSection heading={example ? "Screen" : lab ? "Tests" : "Patterns"}>
            <Facts label={example ? "Screen" : lab ? "Tests" : "Patterns"} items={example ? [
              ["Screen", example.label],
              ["Families", `${example.families.length}: ${example.families.join(", ")}`],
              ["Not from Area", example.gaps.join(" ")],
            ] : [
              ["Screens", list.length],
            ]} note={example ? example.description : lab
              ? "Screens that try something out: a trial package, or one setting's every member side by side. Projects don't add them."
              : "Whole screens built only from Area, to see the defaults and every setting the way a product would."} />
          </PanelSection>
        ),
        code: example ? (
          <PanelSection heading="Source">
            <Facts label="Source" items={[["File", <Code>apps/desktop/src/content/examples/{example.id}.tsx</Code>]]} />
          </PanelSection>
        ) : undefined,
      }}
    />
  );
}

/**
 * A screen's thumbnail: laid out at its own width (1200) and zoomed to the tile's, so its top reads as the screen does
 * and the rest crops at the tile's foot (it was a fixed 0.42, wider than a plain tile's view).
 */
export function WidthZoom({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.4);
  useLayoutEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const observer = new ResizeObserver(() => {
      const style = getComputedStyle(host);
      const width = host.clientWidth - parseFloat(style.paddingInlineStart) - parseFloat(style.paddingInlineEnd);
      if (width > 0) setZoom(Math.floor((width / 1200) * 1000) / 1000);
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="ex-thumb-zoom" style={{ zoom }}>{children}</div>;
}
