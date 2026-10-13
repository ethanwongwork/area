/**
 * Components: two levels, one gallery (owner, 2026-10-12: "keep the gallery grid as a wayfinding
 * experience … stage will be the isolated view … a seamless experience").
 *
 *   All    every family's tiles on one grid: the whole system at a glance (or a list of families)
 *   Stage  one family: the tile on the Stage at its real size with its code attached, the family's
 *          tiles under it in their groups, then its props, anatomy and states (src/stage.tsx)
 *
 * The two share tiles, labels, order, zoom and Canvas settings, so opening a family reads as
 * zooming into its section. A tile opens with a double-click, the Inspector's Open or ⌘↓, and the
 * Stage starts on that tile; a family's name opens it on its first tile. Escape, ⌘↑, ⌘[ or All go
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
import { Badge, Button, Code, Count, EmptyState, Kbd, Link, Nav, NavGroup, NavItem, PanelSection, Segmented, Table, TableLink, Tooltip } from "@area/react";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, OpenIcon, ResetIcon } from "@area/icons";
import { MANIFESTS } from "@area/styles/manifest";
import SNIPPETS from "virtual:demo-snippets";
import { CopyButton } from "../../../docs/src/gallery/icon-browser.tsx";
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
import { Facts, PropsTable } from "../facts.tsx";
import { Selection } from "../inspector.tsx";
import { APP_SCALE } from "../app-scale.ts";
import { Tile, TileGrid } from "../tile.tsx";
import { Anatomy, Properties, Stage, States, useStageKeys } from "../stage.tsx";
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
/** A tile's element id, so the grid can bring it back into view after the Stage. */
const tileDomId = (key: string) => `tile-${key.replace("/", "--")}`;

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

/** A family's tiles on the All grid. Double-clicking one opens the family's Stage on it. */
function FamilyTiles({ family, selected, onSelect, onOpen, reveal, onRevealed }: {
  family: Family; selected?: string; onSelect: (key: string) => void; onOpen: (key: string) => void; reveal?: string; onRevealed: () => void;
}) {
  const tiles = TILES.get(family.slug)!;
  // Back from the Stage: the tile it showed comes into view, and focus returns to the family's name.
  useEffect(() => {
    if (!reveal?.startsWith(`${family.slug}/`)) return;
    document.getElementById(tileDomId(reveal))?.scrollIntoView({ block: "center" });
    document.querySelector<HTMLElement>(`#family-${family.slug} a`)?.focus({ preventScroll: true });
    onRevealed();
  }, [reveal]);
  if (!tiles.length) return <EmptyState title="No tiles yet" description="This family has no gallery specimens." />;
  return (
    <TileGrid span="wide">
      {tiles.map(entry => {
        const key = `${family.slug}/${entry.id}`;
        return (
          <Tile key={key} id={tileDomId(key)} span="wide" stage="fit" label={entry.label} aria-label={`${family.name}: ${entry.label}`}
            selected={key === selected} onSelect={() => onSelect(key)} onOpen={() => onOpen(key)}>
            <TileBoundary><Demo name={entry.demo} /></TileBoundary>
          </Tile>
        );
      })}
    </TileGrid>
  );
}

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
 * One family on the All canvas. It renders (and fits) its tiles once it comes within a screen of
 * the view, and keeps them: 80 families and nearly 900 demos at once held the Canvas for 2s. Until
 * then a placeholder holds about its height (rows of the 5:4 tiles), so the scroll bar is honest.
 */
function FamilySection({ family, selected, onSelect, onOpen, onOpenTile, zoom, reveal, onRevealed }: {
  family: Family; selected?: string; onSelect: (key: string) => void; onOpen: () => void; onOpenTile: (key: string) => void; zoom: string; reveal?: string; onRevealed: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || near) return;
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) setNear(true); }, { rootMargin: "100% 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [near]);
  useFit(ref, `${near}:${zoom}`, near);
  const rows = Math.ceil(TILES.get(family.slug)!.length / 3);
  return (
    <section ref={ref} className="studio-section" aria-labelledby={`family-${family.slug}`} data-fit="">
      <h2 className="studio-canvas__section-title" id={`family-${family.slug}`} {...APP_SCALE}>
        <a href={`#components/${family.slug}`} className="studio-section__link" data-key={family.slug} data-name={family.name} onClick={event => { event.preventDefault(); onOpen(); }}>{family.name}</a>
      </h2>
      {near ? <FamilyTiles family={family} selected={selected} onSelect={onSelect} onOpen={onOpenTile} reveal={reveal} onRevealed={onRevealed} /> : <div style={{ blockSize: `${rows * 256}px` }} />}
    </section>
  );
}

/**
 * The Stage's page for one family: the Stage, the family's tiles in their groups (the same tiles as
 * on the grid, labelled by their value under the group's heading), then the reference.
 */
function FamilyStage({ family, tiles, tile, config, onSelectTile, onChange, zoom, replays }: {
  family: Family; tiles: Tile[]; tile: Tile; config: Config | null; onSelectTile: (tile: Tile) => void; onChange: (prop: string, value: PropValue) => void; zoom: string; replays: number;
}) {
  const playground = PLAYGROUNDS[family.slug];
  const strips = useRef<HTMLDivElement>(null);
  useFit(strips, `${family.slug}:${zoom}`);
  const onStage = config && playground ? matchingTile(playground, tiles, config) : tile;
  const manifest = manifestOf(family);
  const groups = SPECIMEN_GROUPS.map((group: string) => [group, tiles.filter(entry => entry.group === group)] as const).filter(([, list]: readonly [string, Tile[]]) => list.length);
  return (
    <div className="studio-sections">
      <Stage zoom={zoom} replays={replays}
        label={config && playground ? onStage?.label ?? "Custom" : tile.label}
        code={config && playground ? configCode(playground, config) : SNIPPETS[tile.demo]}>
        <TileBoundary>{config && playground ? renderConfig(playground, config, onChange) : <Demo name={tile.demo} />}</TileBoundary>
      </Stage>
      {/* The family's tiles: one grid, each group a run of it under its heading, so small groups share
          a row instead of each starting its own (src/studio.css, .studio-strips). */}
      <div ref={strips} data-fit="" data-zoom={zoom}>
        <div className="studio-grid studio-grid--wide studio-strips">
          {groups.map(([group, list]: readonly [string, Tile[]]) => (
            <section key={group} className="studio-strip" style={{ "--_count": list.length } as CSSProperties} aria-labelledby={`group-${group}`}>
              <h2 className="studio-canvas__section-title" id={`group-${group}`} {...APP_SCALE}>
                {group} <span className="studio-muted studio-tabular">{list.length}</span>
              </h2>
              {list.map(entry => (
                <Tile key={entry.id} span="wide" stage="fit" label={group === "Default" ? entry.label : entry.value} aria-label={`${family.name}: ${entry.label}`}
                  selected={entry.id === onStage?.id} onSelect={() => onSelectTile(entry)}>
                  <TileBoundary><Demo name={entry.demo} /></TileBoundary>
                </Tile>
              ))}
            </section>
          ))}
        </div>
      </div>
      {/* The reference: documentation, not specimens, so it keeps the app's compact scale and default
          radius whatever the Canvas previews (owner, 2026-10-11: props at full width, under the tiles). */}
      {family.api?.length ? (
        <section className="studio-section" aria-labelledby="family-props" {...APP_SCALE}>
          <h2 className="studio-canvas__section-title" id="family-props">Props</h2>
          <PropsTable api={family.api} />
        </section>
      ) : null}
      {manifest ? (
        <section className="studio-section" aria-labelledby="family-anatomy" {...APP_SCALE}>
          <h2 className="studio-canvas__section-title" id="family-anatomy">Anatomy</h2>
          <Anatomy manifest={manifest} />
        </section>
      ) : null}
      {manifest?.states?.length ? (
        <section className="studio-section" aria-labelledby="family-states" {...APP_SCALE}>
          <h2 className="studio-canvas__section-title" id="family-states">States</h2>
          <States manifest={manifest} />
        </section>
      ) : null}
    </div>
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
  // Zoom (owner, 2026-10-12): specimens at up to 2x on tiles twice the minimum, for close reading.
  const [zoom, setZoom] = useViewOption<"1" | "2">("components-zoom", "1", ["1", "2"]);
  const [status, setStatus] = useViewOption<"all" | Status>("components-status", "all", ["all", "complete", "review", "unrefined"]);
  // The grid's selection: one tile, as "<family>/<tile id>". The Inspector describes it.
  const [selected, setSelected] = useState<string>();
  const [reveal, setReveal] = useState<string>();
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
    setReveal(key);
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

  // All fits section by section (FamilySection); the Stage fits its own tiles (FamilyStage).
  const counts = { complete: 0, review: 0, unrefined: 0 };
  for (const entry of FAMILIES) counts[statusOf(entry)]++;
  const total = FAMILIES.reduce((sum, entry) => sum + TILES.get(entry.slug)!.length, 0);
  const subject = family ?? selectedFamily;
  const zoomControl = (
    <Segmented size="sm" aria-label="Zoom" value={zoom} onValueChange={next => setZoom(next as "1" | "2")}
      items={[{ value: "1", label: "1×" }, { value: "2", label: "2×" }]} />
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
      canvasMeta={<span className="studio-muted studio-tabular">{family ? tiles.length : onCanvas.length}</span>}
      canvasActions={family ? (
        <ViewControls>
          <ChromeButton label="Replay" icon={<ResetIcon />} onClick={() => setReplays(count => count + 1)} />
          {zoomControl}
          <ChromeButton label={previous ? `Previous: ${previous.name}` : "Previous"} icon={<ChevronLeftIcon />} onClick={() => previous && select(previous.slug)} />
          <ChromeButton label={following ? `Next: ${following.name}` : "Next"} icon={<ChevronRightIcon />} onClick={() => following && select(following.slug)} />
        </ViewControls>
      ) : (
        <ViewControls>
          <ViewFilter label="Status" value={status} onChange={setStatus}
            options={[{ value: "all", label: "All statuses" }, { value: "complete", label: "Complete" }, { value: "review", label: "In review" }, { value: "unrefined", label: "Unrefined" }]} />
          <ArrangeMenu arrangement={arrangement} sorts={SORTS} groups={GROUPS} directions={DIRECTIONS[arrangement.sort]} />
          {mode === "grid" ? zoomControl : null}
          <ViewSwitch value={mode} onChange={setMode} />
        </ViewControls>
      )}
      canvasRef={canvas}
      canvas={family ? (
        stageTile
          ? <FamilyStage family={family} tiles={tiles} tile={stageTile} config={config} onSelectTile={selectTile} onChange={change} zoom={zoom} replays={replays} />
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
                  <td className="area-table__cell--numeric">{TILES.get(entry.slug)!.length}</td>
                  <td>{entry.imports ?? entry.exportName ? <Code>{entry.imports ?? entry.exportName}</Code> : <span className="studio-muted">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </Table>
      ) : (
        <PinMenu pins={pins} label="Component"><div className="studio-sections" data-zoom={zoom}>
          {onCanvas.map(entry => (
            <FamilySection key={entry.slug} family={entry} selected={selected} onSelect={setSelected} onOpen={() => select(entry.slug)} onOpenTile={open}
              zoom={zoom} reveal={reveal} onRevealed={() => setReveal(undefined)} />
          ))}
        </div></PinMenu>
      ) : <EmptyState title="No components" description={`Nothing matches “${query}”.`} />}
      inspectorTitle={subject?.name ?? "All components"}
      inspector={
        <>
          <CanvasSettings />
          {/* On a composition tile the Properties show the defaults; an edit puts a configured instance
              on the Stage in its place. */}
          {family && playground ? (
            <Properties playground={playground} config={config ?? initialConfig(playground)} changed={Boolean(config) && !sameConfig(config!, initialConfig(playground))} onChange={change} onReset={reset} />
          ) : null}
          {family ? (
            <FamilyInspector family={family} pinned={pins.has(family.slug)} onPin={() => pins.toggle(family.slug)}
              tile={config && playground ? matchingTile(playground, tiles, config) : stageTile}
              code={config && playground ? configCode(playground, config) : stageTile ? SNIPPETS[stageTile.demo] : undefined} />
          ) : selectedFamily ? (
            <FamilyInspector family={selectedFamily} pinned={pins.has(selectedFamily.slug)} onPin={() => pins.toggle(selectedFamily.slug)}
              tile={selectedTile} code={selectedTile ? SNIPPETS[selectedTile.demo] : undefined} onOpen={selected ? () => open(selected) : undefined} />
          ) : (
            <PanelSection heading="Library">
              <Facts label="Library" items={[
                ["Package", <Code>@area/react</Code>],
                ["Families", FAMILIES.length],
                ["Complete", counts.complete],
                ["In review", counts.review],
                counts.unrefined ? ["Unrefined", counts.unrefined] : null,
                ["Tiles", total],
              ]} />
            </PanelSection>
          )}
        </>
      }
    />
  );
}

/**
 * The Inspector for a family, or one of its tiles: what to copy, then its facts in the shared order.
 * On the grid a selected tile also opens on the Stage (⌘↓); on the Stage the code is what it shows.
 */
function FamilyInspector({ family, tile, code, pinned, onPin, onOpen }: {
  family: Family; tile?: Tile; code?: string; pinned: boolean; onPin: () => void; onOpen?: () => void;
}) {
  const names = importsOf(family);
  const manifest = manifestOf(family);
  const status = statusOf(family);
  return (
    <>
      {names || code ? (
        <Selection>
          {code ? <CopyButton label="Copy code" icon={<CopyIcon />} fullWidth copy={() => navigator.clipboard.writeText(code)} /> : null}
          {names ? <CopyButton label="Copy import" icon={<CopyIcon />} fullWidth copy={() => navigator.clipboard.writeText(importLine(names))} /> : null}
        </Selection>
      ) : null}
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
          ["Demo", <Code>{tile.demo}</Code>],
          tile.note ? ["Note", tile.note] : null,
        ] : [
          names ? ["Import", <Code>{names}</Code>] : null,
          manifest ? ["Class", <Code>.{manifest.block}</Code>] : null,
          manifest && Object.keys(manifest.variants).length ? ["Variants", Object.entries(manifest.variants).map(([axis, values]) => `${axis} ${values.length}`).join(" · ")] : null,
          manifest && Object.keys(manifest.defaults).length ? ["Defaults", Object.values(manifest.defaults).join(", ")] : null,
          ["Status", <Badge size="sm" tone={STATUS_TONE[status]} variant="soft">{STATUS_LABEL[status]}</Badge>],
          ["Tiles", TILES.get(family.slug)!.length],
          manifest ? ["Purpose", manifest.description] : null,
          ["Spec", <Link href={specUrl(family)} target="_blank" rel="noreferrer">{family.slug}.md</Link>],
        ]} />
      </PanelSection>
    </>
  );
}
