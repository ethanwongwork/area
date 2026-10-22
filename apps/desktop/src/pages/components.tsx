/**
 * Components: two levels, one gallery (owner, 2026-10-12: "keep the gallery grid as a wayfinding
 * experience … stage will be the isolated view … a seamless experience").
 *
 *   All    one card per family, its default specimen (owner, 2026-10-14: "just 1 of each
 *          component"): the whole system at a glance (or a list of families); a click opens it
 *   Stage  one family, in tabs (src/family-tabs.tsx; owner, 2026-10-18): Overview, the tile on the Stage at its
 *          real size with its code under it and the family's tiles in their groups (src/stage.tsx); Documentation;
 *          API; Code; Spec
 *
 * The two share tiles, labels, order, zoom and Canvas settings, so opening a family reads as
 * zooming into its section. A card opens its family's Stage with a click (owner, 2026-10-14:
 * "when i click on a component, shouldnt i see it in full view?"), Enter on its name, or ⌘↓. Escape, ⌘↑, ⌘[ or All go
 * back, with the tile last on the Stage selected and scrolled into view on the grid.
 *
 * The Inspector holds the Canvas settings, then what is chosen (docs/PRODUCT_UI.md, rule 14): on the
 * Stage its Properties (src/content/playgrounds.tsx), then the tile's or family's copy actions and facts
 * (src/inspector.tsx): code and import to copy; import, class, variants, defaults, status, purpose
 * and spec, from the styles manifest and docs/specs.
 *
 * The tiles come from the app's own content (src/content/: specimens.mjs over pages.mjs, the demos
 * in registry.tsx), labelled and ordered by specimen-names.mjs, and fitted by src/gallery/fit.ts.
 */
import { Component, createElement, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as AreaReact from "@area/react";
import { Badge, Button, Code, Count, EmptyState, Kbd, Link, Nav, NavGroup, NavItem, PanelSection, SectionHeading, Select, Table, TableCell, TableLink, Tabs, Tooltip, ZoomControl } from "@area/react";
import { ArrowLeftIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, OpenIcon, ResetIcon } from "@area/icons";
import { MANIFESTS } from "@area/styles/manifest";
import SNIPPETS from "virtual:demo-snippets";
import { CopyButton } from "../copy.tsx";
// @ts-expect-error — the gallery's page content and status registry are authored in JavaScript.
import { COMPONENT_PAGES } from "../content/pages.mjs";
// @ts-expect-error — as above.
import { componentStatus } from "../content/component-status.mjs";
// @ts-expect-error — as above.
import { componentSpecimens, demoWrapper } from "../content/specimens.mjs";
// @ts-expect-error — as above.
import { SPECIMEN_GROUPS, specimenGroup, specimenLabel, specimenName } from "../content/specimen-names.mjs";
import { DEMOS } from "../content/registry.tsx";
import { PLAYGROUNDS, configCode, initialConfig, renderConfig, sameConfig, tileConfig, type Config, type Playground, type PropValue } from "../content/playgrounds.tsx";
import { fitTiles } from "../gallery/fit.ts";
import { CanvasSettings } from "../canvas-settings.tsx";
import { Facts } from "../facts.tsx";
import { SpecimenBox } from "../specimen-box.tsx";
import { CodeWell, Selection } from "../inspector.tsx";
import { ApiTab, CodeTab, DocumentationTab, FAMILY_TAB_IDS, FAMILY_TABS, SpecTab, type FamilyInfo, type FamilyManifest, type FamilyTab } from "../family-tabs.tsx";
import { APP_SCALE } from "../app-scale.ts";
import { CanvasSection, Tile, TileGrid } from "../tile.tsx";
import { Properties, Stage, useStageKeys } from "../stage.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { ChromeButton, SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { matches } from "../search.ts";
import { ArrangeMenu, groupBy, PinButton, PinMenu, sortBy, useArrangement, usePins } from "../organize.tsx";

interface Example { id: string; title: string; demo: string; note?: string; group?: string }
interface Family { slug: string; name: string; docsOnly?: boolean; imports?: string; exportName?: string; manifest?: string; api?: string[][]; examples: Example[] }
/** A gallery tile: its specimen name (size-sm), group (Sizes) and value in that group (sm). */
interface Tile { id: string; name: string; group: string; value: string; label: string; demo: string; note?: string }
/* The family's manifest (packages/styles/src/manifest.ts): its sentence, block, axes, defaults, parts and states. */
interface ManifestLike { block: string; description: string; variants: Record<string, readonly string[]>; defaults: Record<string, string>; elements?: readonly string[]; states?: readonly string[]; stateAttributes?: Record<string, string> }

const FAMILIES = (COMPONENT_PAGES as Family[]).filter(family => !family.docsOnly).sort((a, b) => a.name.localeCompare(b.name));
const STATUS_LABEL = { complete: "Complete", review: "In review", unrefined: "Unrefined" } as const;
const STATUS_TONE = { complete: "success", review: "caution", unrefined: "neutral" } as const;
type Status = keyof typeof STATUS_LABEL;
const manifestOf = (family: Family) => family.manifest ? (MANIFESTS as unknown as Record<string, ManifestLike>)[family.manifest] : undefined;
/* What a family exports from @area/react: its recorded names, else its own name when the package
   exports it ("date-picker" -> DatePicker). Every gallery family resolves (checked 2026-10-12). */
const pascal = (slug: string) => slug.split("-").map(word => word[0]!.toUpperCase() + word.slice(1)).join("");
const importsOf = (family: Family) => family.imports ?? family.exportName ?? (pascal(family.slug) in AreaReact ? pascal(family.slug) : undefined);
const importLine = (names: string) => `import { ${names} } from "@area/react";`;
/* Every family has a spec (docs/specs/<slug>.md, checked 2026-10-12); origin on GitHub is canonical. */
const specUrl = (family: Family) => `https://github.com/ethanwongwork/area/blob/main/docs/specs/${family.slug}.md`;

/* A family's tiles, labelled group / value and in group order, as component-gallery.mjs does. */
function tilesOf(family: Family): Tile[] {
  const specimens = componentSpecimens(family, (name: string) => name in DEMOS) as Example[];
  const hasDefault = specimens.some(example => specimenName(example, family.slug) === "default");
  const notes = new Map(family.examples.map(example => [example.demo, example.note]));
  return specimens.map((example, index) => {
    const name = specimenName(example, family.slug) as string;
    const group: string = !hasDefault && index === 0 ? "Default" : (example.group ?? specimenGroup(name, family.slug));
    const value: string = group === "Default" && !hasDefault ? name : specimenLabel(name, group);
    return { order: SPECIMEN_GROUPS.indexOf(group), tile: { id: example.id, name, group, value, label: group === "Default" ? value : `${group} / ${value}`, demo: example.demo, note: example.note ?? notes.get(example.demo) } };
  }).sort((a, b) => a.order - b.order).map(entry => entry.tile);
}

/** One demo failing to render shows on its tile instead of taking the Canvas down. */
class TileBoundary extends Component<{ children: ReactNode }, { error?: Error }> {
  override state: { error?: Error } = {};
  static getDerivedStateFromError(error: Error) { return { error }; }
  override render() { return this.state.error ? <p className="studio-tile-error">{this.state.error.message}</p> : this.props.children; }
}

function Demo({ name }: { name: string }) {
  const demo = createElement(DEMOS[name] as () => ReactNode);
  const wrapper = demoWrapper(name);
  if (!wrapper) return demo;
  // The inline style is the docs gallery's (a CSS declaration list), applied as written.
  return <div ref={node => { if (node) node.setAttribute("style", wrapper.style); }}>{demo}</div>;
}

/** Tile counts, computed once: the Sidebar shows one per family. */
const TILES = new Map(FAMILIES.map(family => [family.slug, tilesOf(family)]));
const statusOf = (family: Family) => componentStatus(family.slug) as Status;
/*
 * Zoom (src/gallery/fit.ts; owner, 2026-10-18: "the default should be the automatic scaling approach based on the
 * largest components, then there should just be Auto, Fit 50% 75% 80% 90% 100%, 110%, 125%, 150% 175% 200%"):
 *   auto  each specimen at most at its size group's scale, the largest at 75% (the default)
 *   fit   each specimen as large as its card allows, up to 200%
 *   0.5…2 every specimen at exactly that scale
 * − and + step through the percentages; from Auto or Fit, which have no one place on that scale, they step from 100%.
 */
const ZOOM_STOPS = [0.5, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];
const VIEWS = { auto: "Auto", fit: "Fit" } as const;
const ZOOMS = [...Object.keys(VIEWS), ...ZOOM_STOPS.map(String)] as const;
type Zoom = string;
const named = (zoom: Zoom): zoom is keyof typeof VIEWS => zoom in VIEWS;
/** What a zoomed region carries: the zoom for fit.ts, and the scale tiles and the Stage size by (Auto and Fit are 1). */
const zoomScope = (zoom: Zoom) => ({ "data-zoom": zoom, style: { "--_zoom": named(zoom) ? 1 : Number(zoom) } as CSSProperties });

/**
 * A card's copy action (owner, 2026-10-14: "make the 3 dot menu a copy button"): a ghost icon Button
 * named in its Area Tooltip (rule 4) that copies the specimen's code and shows a check for a moment.
 */
function CopyCode({ code, name }: { code?: string; name: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(timer);
  }, [done]);
  if (!code) return null;
  return (
    <Tooltip side="bottom" describes={false} trigger={
      <Button variant="ghost" tone="neutral" size="sm" iconOnly className="studio-bar-icon" icon={done ? <CheckIcon /> : <CopyIcon />}
        aria-label={done ? "Copied" : `Copy ${name} code`}
        onClick={async () => { try { await navigator.clipboard.writeText(code); setDone(true); } catch {} }} />
    }>{done ? "Copied" : "Copy code"}</Tooltip>
  );
}

/* Sort and group (src/organize.tsx). The default is the Sidebar as it was: A to Z, In review first. */
const SORTS = [{ value: "name", label: "Name" }, { value: "status", label: "Status" }, { value: "tiles", label: "Tile count" }] as const;
const GROUPS = [{ value: "review", label: "In review first" }, { value: "status", label: "Status" }, { value: "letter", label: "First letter" }, { value: "none", label: "None" }] as const;
type Sort = (typeof SORTS)[number]["value"];
type Group = (typeof GROUPS)[number]["value"];
const STATUS_ORDER: Status[] = ["complete", "review", "unrefined"];
const DIRECTIONS: Record<Sort, readonly [string, string]> = {
  name: ["A to Z", "Z to A"],
  status: ["Complete first", "Unrefined first"],
  tiles: ["Fewest first", "Most first"],
};

/** Fits the tiles inside a container once fonts have settled, and stops when it unmounts. */
function useFit(ref: { current: HTMLElement | null }, key: unknown, enabled = true) {
  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    let cleanup = () => {};
    let live = true;
    node.removeAttribute("data-fitted");
    document.fonts.ready.then(() => { if (live) cleanup = fitTiles(node); });
    return () => { live = false; cleanup(); };
  }, [key, enabled]);
}

/*
 * All: one card per family, its default specimen, under the arrangement's groups (owner, 2026-10-14:
 * "just 1 of each component, the main default variant"); the variants are on the family's Stage. A
 * click on the card (not on a control inside its specimen) opens the Stage, as does Enter on its
 * name; ninety specimens fit in one pass (the per-family sections held nearly 900).
 */
function Overview({ groups, selected, onOpen, zoom, containerless }: { groups: Array<[string, Family[]]>; selected?: string; onOpen: (slug: string) => void; zoom: string; containerless: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = groups.filter(([, list]) => list.length);
  useFit(ref, `${shown.map(([label, list]) => `${label}:${list.map(entry => entry.slug).join(",")}`).join("|")}:${zoom}`);
  // One group needs no title: the Sidebar's All row already says what this is.
  const titled = shown.length > 1;
  return (
    <div ref={ref} className="studio-sections" data-fit="" {...zoomScope(zoom)}>
      {shown.map(([label, list]) => (
        <CanvasSection key={label} id={`group-${label.toLowerCase().replace(/\W+/g, "-")}`} title={titled ? label : undefined}>
          <TileGrid span="wide" cards>
            {list.map(entry => {
              const first = TILES.get(entry.slug)![0];
              return (
                <Tile key={entry.slug} container="asset" id={`family-${entry.slug}`} span="wide" stage="fit" card containerless={containerless} openOnClick aria-label={entry.name} data-key={entry.slug} data-name={entry.name}
                  label={<a href={`#components/${entry.slug}`} className="studio-section__link" onClick={event => { event.preventDefault(); onOpen(entry.slug); }}>{entry.name}</a>}
                  selected={entry.slug === selected} onOpen={() => onOpen(entry.slug)}
                  actions={<CopyCode code={first ? SNIPPETS[first.demo] : undefined} name={entry.name} />}>
                  {first ? <TileBoundary><Demo name={first.demo} /></TileBoundary> : null}
                </Tile>
              );
            })}
          </TileGrid>
        </CanvasSection>
      ))}
    </div>
  );
}

/**
 * A family's Overview tab: the Stage, then the family's tiles in their groups (the same tiles as on the grid,
 * labelled by their value under the group's heading). The reference is in the other tabs (src/family-tabs.tsx).
 */
function FamilyOverview({ family, tiles, tile, config, onSelectTile, onChange, zoom, replays, containerless }: {
  family: Family; tiles: Tile[]; tile: Tile; config: Config | null; onSelectTile: (tile: Tile) => void; onChange: (prop: string, value: PropValue) => void; zoom: string; replays: number; containerless: boolean;
}) {
  const playground = PLAYGROUNDS[family.slug];
  const strips = useRef<HTMLDivElement>(null);
  useFit(strips, `${family.slug}:${zoom}`);
  const onStage = config && playground ? matchingTile(playground, tiles, config) : tile;
  const groups = SPECIMEN_GROUPS.map((group: string) => [group, tiles.filter(entry => entry.group === group)] as const).filter(([, list]: readonly [string, Tile[]]) => list.length);
  return (
    <div className="studio-sections" {...zoomScope(zoom)}>
      <Stage zoom={zoom} replays={replays}
        label={config && playground ? onStage?.label ?? "Custom" : tile.label}
        code={config && playground ? configCode(playground, config) : SNIPPETS[tile.demo]}>
        <TileBoundary>{config && playground ? renderConfig(playground, config, onChange) : <Demo name={tile.demo} />}</TileBoundary>
      </Stage>
      {/* The family's tiles: one grid, each group a run of it under its heading, so small groups share
          a row instead of each starting its own (src/studio.css, .studio-strips). */}
      <div ref={strips} data-fit="" {...zoomScope(zoom)}>
        <div className="studio-grid studio-grid--wide studio-grid--cards studio-strips">
          {groups.map(([group, list]: readonly [string, Tile[]]) => (
            <section key={group} className="studio-strip" style={{ "--_count": list.length } as CSSProperties} aria-labelledby={`group-${group}`}>
              <SectionHeading className="studio-section-heading" titleId={`group-${group}`} {...APP_SCALE}
                title={<>{group} <span className="studio-muted studio-tabular">{list.length}</span></>} />
              {list.map(entry => (
                <Tile key={entry.id} container="asset" span="wide" stage="fit" card containerless={containerless} label={group === "Default" ? entry.label : entry.value} aria-label={`${family.name}: ${entry.label}`}
                  selected={entry.id === onStage?.id} onSelect={() => onSelectTile(entry)}
                  actions={<CopyCode code={SNIPPETS[entry.demo]} name={`${family.name} ${entry.label}`} />}>
                  <TileBoundary><Demo name={entry.demo} /></TileBoundary>
                </Tile>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * A family's page: its tabs (Area's Tabs at the app's scale, as the Canvas bar's controls), then the chosen tab. The
 * reference keeps the app's compact scale and default radius whatever the Canvas previews (owner, 2026-10-11).
 */
function FamilyPage({ family, tab, onTab, overview, onOpenFamily }: {
  family: Family; tab: FamilyTab; onTab: (tab: FamilyTab) => void; overview: ReactNode; onOpenFamily: (slug: string) => void;
}) {
  const status = statusOf(family);
  const info: FamilyInfo = {
    slug: family.slug, name: family.name, imports: importsOf(family), manifest: manifestOf(family) as FamilyManifest | undefined, api: family.api,
    status: { label: STATUS_LABEL[status], tone: STATUS_TONE[status] },
    demos: TILES.get(family.slug)!.map(entry => ({ label: entry.label, code: SNIPPETS[entry.demo] })),
  };
  const familyName = (slug: string) => FAMILIES.find(entry => entry.slug === slug)?.name;
  // The tab list is app chrome at the app's scale; the Overview panel takes the Canvas's type and density back, so
  // the Stage and tiles preview the Inspector's settings as they did before the tabs.
  const canvas = useStudio().shown.canvas;
  return (
    <Tabs className="studio-family-tabs" size="sm" aria-label={`${family.name} views`} value={tab} onValueChange={next => onTab(next as FamilyTab)}
      items={FAMILY_TABS.map(entry => ({ id: entry.id, label: entry.label }))} {...APP_SCALE}>
      <div className="studio-family-tabs__panel" {...(tab === "overview" ? { "data-area-type": canvas.type, "data-area-density": canvas.density } : {})}>
        {tab === "overview" ? overview
          : tab === "documentation" ? <DocumentationTab family={info} onOpenFamily={onOpenFamily} familyName={familyName} />
          : tab === "api" ? <ApiTab family={info} />
          : tab === "code" ? <CodeTab family={info} />
          : <SpecTab family={info} />}
      </div>
    </Tabs>
  );
}

/** The tile whose specimen is exactly this configuration, if any. */
function matchingTile(playground: Playground, tiles: Tile[], config: Config) {
  return tiles.find(entry => { const own = tileConfig(playground, entry.name); return own !== null && sameConfig(own, config); });
}

export function ComponentsPage() {
  const { query, item, select } = useStudio();
  // The Sidebar's choice: every family (All, the default) or one family's Stage, on one of its tiles.
  const [slug = "", tileId] = (item ?? "").split("/");
  const family = FAMILIES.find(entry => entry.slug === slug);
  const shown = FAMILIES.filter(entry => matches(query, entry.name, entry.slug));
  const [mode, setMode] = useViewOption<ViewMode>("components", "grid", ["grid", "list"]);
  // Zoom (owner, 2026-10-12: a closer view; 2026-10-14: a − 100% + control, Fit at the gallery's own
  // ratios): Fit, the default, or an exact 50% to 200% (src/gallery/fit.ts). A new key: the old "1"
  // and "2" meant at most 100% and 200%.
  // A new key again (2026-10-18): the old "fit" was today's Auto.
  const [zoom, setZoom] = useViewOption<Zoom>("components-zoom", "auto", ZOOMS);
  // Container (owner, 2026-10-19: "i want the containerless design to be tested on components first"): the tiles
  // framed, or containerless, each specimen on the Canvas's ground with its frame's edge shown on hover and selection.
  const [container, setContainer] = useViewOption<"framed" | "containerless">("components-container", "framed", ["framed", "containerless"]);
  const [status, setStatus] = useViewOption<"all" | Status>("components-status", "all", ["all", "complete", "review", "unrefined"]);
  // A family's tab (src/family-tabs.tsx), kept from family to family, so Next reads the next family's Documentation.
  const [familyTab, setFamilyTab] = useViewOption<FamilyTab>("components-family-tab", "overview", FAMILY_TAB_IDS);
  const onOverview = familyTab === "overview";
  // The grid's selection: the family whose Stage was last open, as "<family>/<tile id>", marked on its
  // card when the Stage closes. The Inspector describes it.
  const [selected, setSelected] = useState<string>();
  const [selectedSlug, selectedId] = selected?.split("/") ?? [];
  const selectedFamily = family ? undefined : FAMILIES.find(entry => entry.slug === selectedSlug);
  const selectedTile = selectedFamily ? TILES.get(selectedFamily.slug)!.find(entry => entry.id === selectedId) : undefined;

  // The Stage: the tile in the location, or the family's first. A family with a playground shows a
  // configured instance the Properties edit; `edit` holds the edit for the tile it started from.
  const tiles = family ? TILES.get(family.slug)! : [];
  const stageTile = tiles.find(entry => entry.id === tileId) ?? tiles[0];
  const playground = family ? PLAYGROUNDS[family.slug] : undefined;
  const stageKey = family && stageTile ? `${family.slug}/${stageTile.id}` : "";
  const [edit, setEdit] = useState<{ key: string; config: Config } | null>(null);
  const [replays, setReplays] = useState(0);
  const config = playground && stageTile ? (edit?.key === stageKey ? edit.config : tileConfig(playground, stageTile.name)) : null;

  const arrangement = useArrangement<Sort, Group>("components", { sort: "name", descending: false, group: "review" }, SORTS, GROUPS);
  const pins = usePins("components");
  const sorted = arrangement.sort === "name" ? sortBy(shown, entry => entry.name, arrangement.descending)
    : arrangement.sort === "status" ? sortBy(sortBy(shown, entry => entry.name), entry => STATUS_ORDER.indexOf(statusOf(entry)), arrangement.descending)
    : sortBy(sortBy(shown, entry => entry.name), entry => TILES.get(entry.slug)!.length, arrangement.descending);
  const groups: Array<[string, Family[]]> = arrangement.group === "review"
    ? [["In review", sorted.filter(entry => statusOf(entry) === "review")], ["Components", sorted.filter(entry => statusOf(entry) !== "review")]]
    : arrangement.group === "status" ? groupBy(sorted, entry => STATUS_LABEL[statusOf(entry)], (arrangement.descending && arrangement.sort === "status" ? [...STATUS_ORDER].reverse() : STATUS_ORDER).map(name => STATUS_LABEL[name]))
    : arrangement.group === "letter" ? groupBy(sorted, entry => entry.name[0]!.toUpperCase())
    : [["Components", sorted]];
  // The Canvas runs in the Sidebar's order, so the two read the same way down.
  const ordered = groups.flatMap(([, list]) => list);
  const onCanvas = ordered.filter(entry => status === "all" || statusOf(entry) === status);
  const pinned = pins.pins.map(key => FAMILIES.find(entry => entry.slug === key)).filter((entry): entry is Family => Boolean(entry && shown.includes(entry)));
  const navItem = (entry: Family) => (
    <NavItem key={entry.slug} href={`#components/${entry.slug}`} current={entry.slug === family?.slug} data-key={entry.slug} data-name={entry.name}
      onClick={event => { event.preventDefault(); select(entry.slug); }}
      trailing={<Count count={TILES.get(entry.slug)!.length} />}>
      {entry.name}
    </NavItem>
  );

  // Opening and leaving the Stage. Opening keeps the tile; leaving, by any route (Escape, ⌘↑, ⌘[,
  // All), selects the tile the Stage last showed and brings it into view on the grid.
  const open = (key: string) => select(key);
  const back = () => select("");
  const lastStage = useRef<string | undefined>(undefined);
  if (family && stageTile) lastStage.current = stageKey;
  const canvas = useRef<HTMLDivElement>(null);
  useEffect(() => {
    canvas.current?.scrollTo({ top: 0 });
    setEdit(null);
    if (family || !lastStage.current) return;
    const key = lastStage.current;
    lastStage.current = undefined;
    setSelected(key);
    document.getElementById(`family-${key.split("/")[0]}`)?.scrollIntoView({ block: "start" });
  }, [family?.slug]);
  useStageKeys({ onBack: back, enabled: Boolean(family) });
  // ⌘↓ opens the selected tile (Finder's Open).
  useEffect(() => {
    if (family || !selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowDown" || !(event.metaKey || event.ctrlKey) || event.altKey || event.shiftKey) return;
      event.preventDefault();
      open(selected);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [family, selected]);

  // Properties: an edit that lands on a tile's own configuration moves the Stage to that tile.
  const change = (prop: string, value: PropValue) => {
    if (!playground || !family) return;
    const next = { ...(config ?? initialConfig(playground)), [prop]: value };
    const match = matchingTile(playground, tiles, next);
    if (match && match.id !== stageTile?.id) select(`${family.slug}/${match.id}`, { replace: true });
    setEdit({ key: match ? `${family.slug}/${match.id}` : stageKey, config: next });
  };
  const reset = () => {
    if (!family || !playground) return;
    const first = matchingTile(playground, tiles, initialConfig(playground)) ?? tiles[0]!;
    setEdit(null);
    select(`${family.slug}/${first.id}`, { replace: true });
  };
  const selectTile = (entry: Tile) => {
    if (!family) return;
    setEdit(null);
    select(`${family.slug}/${entry.id}`, { replace: true });
  };

  // Previous and next family, in the Sidebar's order.
  const sequence = ordered.some(entry => entry.slug === family?.slug) ? ordered : FAMILIES;
  const at = family ? sequence.indexOf(family) : -1;
  const previous = at > 0 ? sequence[at - 1] : undefined;
  const following = at >= 0 ? sequence[at + 1] : undefined;

  // All fits section by section (FamilySection); the Stage fits its own tiles (FamilyOverview).
  const counts = { complete: 0, review: 0, unrefined: 0 };
  for (const entry of FAMILIES) counts[statusOf(entry)]++;
  const total = FAMILIES.reduce((sum, entry) => sum + TILES.get(entry.slug)!.length, 0);
  const zoomControl = (
    <ZoomControl stepper size="sm" value={named(zoom) ? 1 : Number(zoom)} valueLabel={named(zoom) ? VIEWS[zoom] : undefined}
      min={ZOOM_STOPS[0]} max={ZOOM_STOPS.at(-1)} stops={ZOOM_STOPS} presets={ZOOM_STOPS} stepRows={false} field={false}
      presetLabel={stop => `${Math.round(stop * 100)}%`}
      views={Object.entries(VIEWS).map(([id, label]) => ({ label, selected: zoom === id, onSelect: () => setZoom(id) }))}
      onValueChange={next => setZoom(String(next))} />
  );

  // How the tiles are drawn, after the zoom (PRODUCT_UI rule 14: zoom, style, size).
  const containerControl = (
    <Select size="sm" variant="soft" aria-label="Container" value={container} onChange={event => setContainer(event.currentTarget.value as "framed" | "containerless")}>
      <option value="framed">Framed</option>
      <option value="containerless">Containerless</option>
    </Select>
  );

  return (
    <Workspace
      sidebar={
        <SidebarList>
          <PinMenu pins={pins} label="Components">
            <Nav aria-label="Components">
              <SidebarAll tab="components" count={shown.length} current={!family} />
              {pinned.length ? <NavGroup label="Pinned">{pinned.map(navItem)}</NavGroup> : null}
              {groups.filter(([, list]) => list.length).map(([label, list]) => (
                <NavGroup key={label} label={label}>{list.map(navItem)}</NavGroup>
              ))}
            </Nav>
          </PinMenu>
        </SidebarList>
      }
      canvasLead={family ? (
        <Tooltip side="bottom" describes={false} trigger={
          <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<ArrowLeftIcon />} aria-label="All components" aria-keyshortcuts="Escape" onClick={back} />
        }>All components <Kbd keys={["Esc"]} size="sm" /></Tooltip>
      ) : undefined}
      canvasTitle={family ? family.name : "All components"}
      canvasActions={family ? (
        <ViewControls>
          {/* Replay and zoom view the Stage and tiles, on Overview only (a control that does not apply is left out). */}
          {onOverview ? <ChromeButton label="Replay" icon={<ResetIcon />} onClick={() => setReplays(count => count + 1)} /> : null}
          {onOverview ? zoomControl : null}
          {onOverview ? containerControl : null}
          <ChromeButton label={previous ? `Previous: ${previous.name}` : "Previous"} icon={<ChevronLeftIcon />} onClick={() => previous && select(previous.slug)} />
          <ChromeButton label={following ? `Next: ${following.name}` : "Next"} icon={<ChevronRightIcon />} onClick={() => following && select(following.slug)} />
        </ViewControls>
      ) : (
        <ViewControls>
          <ViewFilter label="Status" value={status} onChange={setStatus}
            options={[{ value: "all", label: "All statuses" }, { value: "complete", label: "Complete" }, { value: "review", label: "In review" }, { value: "unrefined", label: "Unrefined" }]} />
          <ArrangeMenu arrangement={arrangement} sorts={SORTS} groups={GROUPS} directions={DIRECTIONS[arrangement.sort]} />
          {mode === "grid" ? zoomControl : null}
          {mode === "grid" ? containerControl : null}
          <ViewSwitch value={mode} onChange={setMode} />
        </ViewControls>
      )}
      canvasRef={canvas}
      canvas={family ? (
        stageTile
          ? <FamilyPage family={family} tab={familyTab} onTab={setFamilyTab} onOpenFamily={open}
              overview={<FamilyOverview family={family} tiles={tiles} tile={stageTile} config={config} onSelectTile={selectTile} onChange={change} zoom={zoom} replays={replays} containerless={container === "containerless"} />} />
          : <EmptyState title="No tiles yet" description="This family has no gallery specimens." />
      ) : onCanvas.length ? mode === "list" ? (
        // List: one row per family, its status, tile count and import.
          <Table size="md" interactive flush aria-label="Components">
            <thead><tr><th scope="col">Family</th><th scope="col">Status</th><th scope="col">Tiles</th><th scope="col">Import</th></tr></thead>
            <tbody>
              {onCanvas.map(entry => (
                <tr key={entry.slug}>
                  <td><TableLink href={`#components/${entry.slug}`} onClick={event => { event.preventDefault(); select(entry.slug); }}>{entry.name}</TableLink></td>
                  <td><Badge size="sm" tone={STATUS_TONE[statusOf(entry)]} variant="soft">{STATUS_LABEL[statusOf(entry)]}</Badge></td>
                  <TableCell numeric>{TILES.get(entry.slug)!.length}</TableCell>
                  <td>{entry.imports ?? entry.exportName ? <Code>{entry.imports ?? entry.exportName}</Code> : <span className="studio-muted">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </Table>
      ) : (
        <PinMenu pins={pins} label="Component">
          <Overview groups={groups.map(([label, list]) => [label, list.filter(entry => status === "all" || statusOf(entry) === status)])}
            selected={selectedSlug} onOpen={open} zoom={zoom} containerless={container === "containerless"} />
        </PinMenu>
      ) : <EmptyState title="No components" description={`Nothing matches “${query}”.`} />}
      inspector={{
        theme: <CanvasSettings />,
        // Design: what is chosen. On a composition tile the Properties show the defaults; an edit puts a configured
        // instance on the Stage in its place.
        design: (
          <>
            {/* Properties edit the Stage, so they show on the Overview tab only (main, 2026-10-19). */}
            {family && playground && onOverview ? (
              <Properties playground={playground} config={config ?? initialConfig(playground)} changed={Boolean(config) && !sameConfig(config!, initialConfig(playground))} onChange={change} onReset={reset} />
            ) : null}
            {family ? (
              <FamilyDesign family={family} pinned={pins.has(family.slug)} onPin={() => pins.toggle(family.slug)}
                tile={config && playground ? matchingTile(playground, tiles, config) : stageTile} />
            ) : selectedFamily ? (
              <FamilyDesign family={selectedFamily} pinned={pins.has(selectedFamily.slug)} onPin={() => pins.toggle(selectedFamily.slug)}
                tile={selectedTile} onOpen={selected ? () => open(selected) : undefined} />
            ) : (
              <PanelSection heading="Library">
                <Facts label="Library" items={[
                  ["Families", FAMILIES.length],
                  ["Complete", counts.complete],
                  ["In review", counts.review],
                  counts.unrefined ? ["Unrefined", counts.unrefined] : null,
                  ["Tiles", total],
                ]} />
              </PanelSection>
            )}
          </>
        ),
        // Code: how to use it, and on the Stage the specimen measured, as Figma's Dev Mode.
        code: family ? (
          <FamilyCode family={family} measure={stageKey + JSON.stringify(config)}
            code={config && playground ? configCode(playground, config) : stageTile ? SNIPPETS[stageTile.demo] : undefined} />
        ) : selectedFamily ? (
          <FamilyCode family={selectedFamily} code={selectedTile ? SNIPPETS[selectedTile.demo] : undefined} />
        ) : (
          <PanelSection heading="Package">
            <CodeWell code={`npm install @area/react @area/styles\n\nimport "@area/styles";\nimport { Button } from "@area/react";`} />
          </PanelSection>
        ),
      }}
    />
  );
}

/**
 * Design, for a family or one of its tiles: its facts in the shared order (what it is, its values, status, purpose,
 * source). On the grid a selected tile also opens on the Stage (⌘↓).
 */
function FamilyDesign({ family, tile, pinned, onPin, onOpen }: {
  family: Family; tile?: Tile; pinned: boolean; onPin: () => void; onOpen?: () => void;
}) {
  const manifest = manifestOf(family);
  const status = statusOf(family);
  return (
    <PanelSection heading={tile ? "Tile" : "Family"} actions={
      <>
        {onOpen ? (
          <Tooltip side="bottom" describes={false} trigger={
            <Button variant="ghost" tone="neutral" size="sm" icon={<OpenIcon />} aria-keyshortcuts="Meta+ArrowDown" onClick={onOpen}>Open</Button>
          }>Open on the Stage <Kbd keys={["⌘", "↓"]} size="sm" /></Tooltip>
        ) : null}
        <PinButton name={family.name} pinned={pinned} onToggle={onPin} />
      </>
    }>
      <Facts label={tile ? "Tile" : "Family"} items={tile ? [
        ["Specimen", tile.label],
        ["Family", family.name],
        tile.note ? ["Note", tile.note] : null,
        ["Status", <Badge size="sm" tone={STATUS_TONE[status]} variant="soft">{STATUS_LABEL[status]}</Badge>],
      ] : [
        manifest && Object.keys(manifest.variants).length ? ["Variants", Object.entries(manifest.variants).map(([axis, values]) => `${axis} ${values.length}`).join(" · ")] : null,
        manifest && Object.keys(manifest.defaults).length ? ["Defaults", Object.values(manifest.defaults).join(", ")] : null,
        ["Status", <Badge size="sm" tone={STATUS_TONE[status]} variant="soft">{STATUS_LABEL[status]}</Badge>],
        ["Tiles", TILES.get(family.slug)!.length],
        manifest ? ["Purpose", manifest.description] : null,
        ["Spec", <Link href={specUrl(family)} target="_blank" rel="noreferrer">{family.slug}.md</Link>],
      ]} />
    </PanelSection>
  );
}

/**
 * Code, for a family or one of its tiles: what to copy, the import and the code in wells, the class and its modifiers,
 * then (on the Stage, `measure` set) the specimen's measured box and paint (src/specimen-box.tsx).
 */
function FamilyCode({ family, code, measure }: { family: Family; code?: string; measure?: string }) {
  const names = importsOf(family);
  const manifest = manifestOf(family);
  return (
    <>
      {names || code ? (
        <Selection>
          {code ? <CopyButton label="Copy code" icon={<CopyIcon />} fullWidth value={() => code} /> : null}
          {names ? <CopyButton label="Copy import" icon={<CopyIcon />} fullWidth value={() => importLine(names)} /> : null}
        </Selection>
      ) : null}
      {names ? <PanelSection heading="Import"><CodeWell code={importLine(names)} wrap /></PanelSection> : null}
      {code ? <PanelSection heading="Code"><CodeWell code={code} /></PanelSection> : null}
      {manifest ? (
        <PanelSection heading="Class">
          <Facts label="Class" items={[
            ["Block", <Code>.{manifest.block}</Code>],
            ...Object.entries(manifest.variants).map(([axis, values]) => [axis[0]!.toUpperCase() + axis.slice(1), values.map(value => `--${value}`).join(" ")] as const),
            manifest.defaults && Object.keys(manifest.defaults).length ? ["Defaults", Object.entries(manifest.defaults).map(([axis, value]) => `${axis} ${value}`).join(", ")] : null,
          ]} />
        </PanelSection>
      ) : null}
      {measure !== undefined ? <SpecimenBox watch={measure} /> : null}
    </>
  );
}
