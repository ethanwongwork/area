/**
 * Components: two levels, one gallery (owner, 2026-10-12: "keep the gallery grid as a wayfinding
 * experience … stage will be the isolated view … a seamless experience").
 *
 *   Overview  every family as a section of its variants, one row each until Show all (owner, 2026-10-25: a gallery
 *             of "all the designs … what variants go under which design … almost like a menu"; it was All, one card
 *             per family): the whole system at a glance (or a list of families)
 *   Single    one tile, in its family's tabs (src/family-tabs.tsx): Preview, the tile on the Stage at its real size
 *             with its code under it (src/stage.tsx); Documentation; API; Code; Spec
 *
 * The two share tiles, labels, order, zoom and Canvas settings. A card opens its tile on the Stage with a click, Enter,
 * or ⌘↓, growing into it; Escape, ⌘↑, ⌘[, the Overview button or the breadcrumb go back, the Stage shrinking into its
 * card, the family's section open and the tile selected, and Back (or Escape again) returns to it. The Sidebar lists
 * each family's variants under it (owner, 2026-10-25).
 *
 * The Inspector holds the Canvas settings, then what is chosen (docs/PRODUCT_UI.md, rule 14): on the
 * Stage its Properties (src/content/playgrounds.tsx), then the tile's or family's copy actions and facts
 * (src/inspector.tsx): code and import to copy; import, class, variants, defaults, status, purpose
 * and spec, from the styles manifest and docs/specs.
 *
 * The tiles come from the app's own content (src/content/: specimens.mjs over pages.mjs, the demos
 * in registry.tsx), labelled and ordered by specimen-names.mjs, and fitted by src/gallery/fit.ts.
 */
import { Component, createElement, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import * as AreaReact from "@area/react";
import { Badge, Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Button, Code, Count, EmptyState, Kbd, Link, Menu, MenuItem, MenuLabel, MenuSeparator, PanelSection, SectionHeading, Table, TableCell, TableLink, Tabs, Tooltip, ZoomControl, type TreeViewNode } from "@area/react";
import { ArrowLeftIcon, CardsIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, GridIcon, OpenIcon, ResetIcon } from "@area/icons";
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
import { appScale } from "../app-scale.ts";
import { CanvasSection, GALLERY_LOOK, Tile, TileGrid, type CardLook } from "../tile.tsx";

/*
 * The Cards menu (owner, 2026-10-25: "there should just be 1 style of container, so the options for that menu should be
 * container, no container, then, waterfall/hugging the height of components … or fixed height containers"). Two
 * choices, each on its own: whether the card is drawn, and its height. The one container is Basic, the name and Copy on
 * hover (GALLERY_LOOK, the look Typography's and Imagery's cards share); No container draws none at rest, its edge on
 * hover. It was nine looks, 2026-10-22 to 2026-10-25 (framed, the name above or below, a white fill, no stroke).
 *   fixed      every card 5:4, the component centred in it
 *   waterfall  each card hugs its component at its scale, the same room above and below every one, and drops into
 *              the shortest column (src/gallery/fit.ts, hug): a taller component gets a taller card, never a bigger
 *              component
 */
const CONTAINERS = [{ value: "container", label: "Container" }, { value: "none", label: "No container" }] as const;
const HEIGHTS = [{ value: "fixed", label: "Fixed height", description: "Every card one height" }, { value: "waterfall", label: "Waterfall", description: "Each card hugs its component" }] as const;
type CardContainer = (typeof CONTAINERS)[number]["value"];
type CardHeight = (typeof HEIGHTS)[number]["value"];
const lookOf = (container: CardContainer): CardLook => container === "none" ? { ...GALLERY_LOOK, container: "containerless" } : GALLERY_LOOK;
import { Properties, Stage, useStageKeys } from "../stage.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { ChromeButton, SidebarList, SidebarTree, useStudio, Workspace } from "../studio.tsx";
import { hrefOf } from "../places.ts";
import { matches } from "../search.ts";
import { ArrangeMenu, groupBy, PinButton, PinMenu, sortBy, useArrangement, usePins } from "../organize.tsx";

interface Example { id: string; title: string; demo: string; note?: string; group?: string }
interface Family { slug: string; name: string; docsOnly?: boolean; imports?: string; exportName?: string; manifest?: string; api?: string[][]; examples: Example[] }
/** A gallery tile: its specimen name (size-sm), group (Sizes) and value in that group (sm). */
interface Tile { id: string; name: string; group: string; value: string; label: string; demo: string; note?: string }
/* The family's manifest (packages/styles/src/manifest.ts): its sentence, block, axes, defaults, parts and states. */
interface ManifestLike { block: string; description: string; variants: Record<string, readonly string[]>; defaults: Record<string, string>; elements?: readonly string[]; states?: readonly string[]; stateAttributes?: Record<string, string> }

export const FAMILIES = (COMPONENT_PAGES as Family[]).filter(family => !family.docsOnly).sort((a, b) => a.name.localeCompare(b.name));
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

/* What each group of a family's tiles holds: its subtitle on Overview (owner, 2026-10-22: "make the copy, titles, and
   subtitles to be more consistent and intentional"). One sentence each, in SPECIMEN_GROUPS order. */
const GROUP_LEDES: Record<string, string> = {
  Default: "The component as it ships.",
  Variants: "Its visual treatments and shapes.",
  Tones: "The same component in each semantic color.",
  Sizes: "Each size, smallest first.",
  Layout: "Arrangements of its parts.",
  Content: "What it holds: text, icons and media.",
  States: "Interactive and runtime states.",
  Behavior: "How it responds as it is used.",
  Templates: "It composed into ready-made patterns.",
  "Variant × tone": "Every treatment in every tone.",
};

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
/** A family's tiles in their groups, in SPECIMEN_GROUPS order. */
const groupsOf = (tiles: Tile[]) => (SPECIMEN_GROUPS as string[]).map(group => [group, tiles.filter(entry => entry.group === group)] as const).filter(([, list]) => list.length);

/*
 * A family's variants as rows under it in the Sidebar (owner, 2026-10-25: "variants for components should live under the
 * tree view, they should be treated as legitimate standalone design items that happen to live under a larger umbrella"):
 * its Default tile as a row, then one branch per group (Variants, Sizes, States …) holding a row per tile, named by its
 * value as the tiles are. A family with one tile has no rows under it. Row ids are `tile:<family>/<tile>` and
 * `axis:<family>/<group>` (studio.tsx, SidebarTree).
 */
function variantRows(family: Family): TreeViewNode[] | undefined {
  const tiles = TILES.get(family.slug)!;
  if (tiles.length < 2) return undefined;
  const row = (entry: Tile): TreeViewNode => ({ id: `tile:${family.slug}/${entry.id}`, label: entry.value });
  return groupsOf(tiles).flatMap(([group, list]) => group === "Default" ? list.map(row)
    : [{ id: `axis:${family.slug}/${group}`, label: group, trailing: <Count count={list.length} />, children: list.map(row) }]);
}
/** The rows that hold a tile, opened so it shows in the Sidebar. */
const revealOf = (family: Family, tile?: Tile) => [`key:${family.slug}`, ...(tile && tile.group !== "Default" ? [`axis:${family.slug}/${tile.group}`] : [])];

/*
 * The move between the Overview and a tile (owner, 2026-10-25: the view shifts "to some kind of gallery view … then you
 * can return back to the original design thing you were looking at or open a new one"): opening a card grows the Stage
 * from it on `slow`; leaving shrinks the Stage into its card on `moderate`, exits being a step faster. Both are moves
 * across the screen while visible, so ease-in-out (MOTION.md), and both read the motion tokens where they play, so Motion
 * 0 and reduced motion skip them. The scale is the width's alone, from the top start, so nothing is stretched; the
 * element rests untransformed, on whole pixels.
 */
let pendingMorph: { from: DOMRect; to: "stage" | "tile" } | null = null;
function morph(element: Element | null | undefined, from: DOMRect, duration: "slow" | "moderate") {
  if (!(element instanceof HTMLElement)) return;
  const to = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  const ms = parseFloat(style.getPropertyValue(`--area-duration-${duration}`)) || 0;
  if (!ms || !to.width || !from.width) return;
  const easing = style.getPropertyValue("--area-ease-in-out").trim() || "ease-in-out";
  element.animate([
    { transformOrigin: "0 0", transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})` },
    { transformOrigin: "0 0", transform: "none" },
  ], { duration: ms, easing });
}
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
 * The Overview (owner, 2026-10-25; it was All, one card per family): every family, in the Sidebar's order, as a section
 * of its variants, so the whole library reads like a menu. A section shows one row of cards until it is opened (Show all),
 * then every tile in its groups; the family the person left opens on its own, its tile selected ("you were here"). A
 * click on a card opens that tile alone (the Stage), as Enter does.
 *
 * Over a hundred families hold about a thousand tiles, so a section draws its cards only once it nears the view (an
 * IntersectionObserver on the Canvas body, as far ahead as the window is tall), holding their room with empty cards
 * until then, and fits its own tiles (src/gallery/fit.ts); the first open draws a few screens, not the library.
 */
function Overview({ groups, visit, open, onToggle, onOpen, zoom, look, waterfall }: {
  groups: Array<[string, Family[]]>; visit?: string; open: string[]; onToggle: (slug: string) => void;
  onOpen: (key: string, from?: Element | null) => void; zoom: string; look: CardLook; waterfall: boolean;
}) {
  // The arrangement's groups keep their order but draw no title of their own: a group's title over a family's read as
  // two headings of one tier stacked 12 apart. The Sidebar names the groups, and each family's status follows its title.
  return (
    <div className="studio-sections" {...zoomScope(zoom)}>
      {groups.flatMap(([, list]) => list).map(entry => (
        <FamilySection key={entry.slug} family={entry} open={open.includes(entry.slug)} onToggle={() => onToggle(entry.slug)}
          visit={visit} onOpen={onOpen} zoom={zoom} look={look} waterfall={waterfall} />
      ))}
    </div>
  );
}

/** One family in the Overview: its name, status and tile count over one row of its tiles, or all of them in groups. */
function FamilySection({ family, open, onToggle, visit, onOpen, zoom, look, waterfall }: {
  family: Family; open: boolean; onToggle: () => void; visit?: string; onOpen: (key: string, from?: Element | null) => void; zoom: string; look: CardLook; waterfall: boolean;
}) {
  const tiles = TILES.get(family.slug)!;
  const status = statusOf(family);
  const [visitSlug, visitTile] = visit?.split("/") ?? [];
  const here = visitSlug === family.slug;
  const section = useRef<HTMLElement>(null);
  const body = useRef<HTMLDivElement>(null);
  // Drawn once it nears the view, and kept; the family just left draws at once, so its tile can be found.
  const [seen, setNear] = useState(false);
  const near = seen || here;
  useEffect(() => {
    if (near || !section.current) return;
    const root = section.current.closest(".studio-canvas__body");
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) setNear(true); },
      { root, rootMargin: "100% 0px" });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, [near]);
  // A closed section shows as many cards as its row holds (one to four, by the Canvas's width and the zoom).
  const [columns, setColumns] = useState(4);
  useEffect(() => {
    const grid = body.current?.querySelector(".studio-grid");
    if (!grid) return;
    const measure = () => setColumns(Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [near, open]);
  useFit(body, `${family.slug}:${open}:${columns}:${zoom}:${near}:${waterfall}`, near);
  const card = (entry: Tile) => (
    <Tile key={entry.id} container="asset" id={`variant-${family.slug}-${entry.id}`} span="wide" stage="fit" card look={look} aspect={waterfall ? "hug" : undefined} openOnClick
      aria-label={`${family.name}: ${entry.label}`} data-key={family.slug} data-name={family.name} label={entry.value}
      selected={here && entry.id === visitTile} onOpen={() => onOpen(`${family.slug}/${entry.id}`, document.getElementById(`variant-${family.slug}-${entry.id}`))}
      actions={<CopyCode code={SNIPPETS[entry.demo]} name={`${family.name} ${entry.label}`} />}>
      <TileBoundary><Demo name={entry.demo} /></TileBoundary>
    </Tile>
  );
  // Empty cards of the real size hold a section's room until it is drawn.
  const ghosts = (count: number) => Array.from({ length: count }, (_, index) => <div key={index} className="studio-overview__ghost" aria-hidden="true" />);
  const more = tiles.length > columns;
  return (
    <section ref={section} className="studio-section" id={`family-${family.slug}`} aria-labelledby={`family-${family.slug}-title`}>
      <SectionTitle id={`family-${family.slug}-title`}
        title={<a href={hrefOf({ page: "components", item: family.slug })} className="studio-section__link" onClick={event => { event.preventDefault(); onOpen(`${family.slug}/${tiles[0]!.id}`); }}>{family.name}</a>}
        count={tiles.length} badge={<Badge size="sm" tone={STATUS_TONE[status]} variant="soft">{STATUS_LABEL[status]}</Badge>} />
      <div ref={body} className="studio-overview__body" data-fit="">
        {open ? groupsOf(tiles).map(([group, list]) => (
          <div key={group} className="studio-overview__group">
            <p className="studio-overview__group-label" {...appScale()}>{group} <span className="studio-muted studio-tabular">{list.length}</span></p>
            <TileGrid span="wide" cards waterfall={waterfall}>{near ? list.map(card) : ghosts(list.length)}</TileGrid>
          </div>
        )) : (
          <TileGrid span="wide" cards waterfall={waterfall}>{near ? tiles.slice(0, columns).map(card) : ghosts(Math.min(columns, tiles.length))}</TileGrid>
        )}
      </div>
      {more || open ? (
        // A text control in the title link's style, so its text starts on the cards' edge as the title does.
        <div className="studio-overview__more" {...appScale()}>
          <button type="button" className="studio-section__link studio-overview__toggle" aria-expanded={open} aria-controls={`family-${family.slug}`} onClick={onToggle}>
            {open ? "Show one row" : `Show all ${tiles.length}`}
          </button>
        </div>
      ) : null}
    </section>
  );
}

/** A section's title as CanvasSection draws it (Area's SectionHeading), with the family's status after its count. */
function SectionTitle({ id, title, count, badge }: { id: string; title: ReactNode; count: number; badge: ReactNode }) {
  return (
    <SectionHeading className="studio-section-heading studio-overview__title" level={3} titleId={id} {...appScale()}
      title={<>{title} <span className="studio-muted studio-tabular">{count}</span> <span className="studio-overview__status">{badge}</span></>} />
  );
}

/**
 * A family's Preview tab: one tile alone, on the Stage at its real size with its code (owner, 2026-10-25: Single, "the
 * original design thing you were looking at"). Its other tiles are rows under it in the Sidebar, the Canvas bar's
 * previous and next, and its section in the Overview; the strips of tiles that followed the Stage moved there. The
 * reference is in the other tabs (src/family-tabs.tsx).
 */
function FamilyPreview({ family, tiles, tile, config, onChange, zoom, replays }: {
  family: Family; tiles: Tile[]; tile: Tile; config: Config | null; onChange: (prop: string, value: PropValue) => void; zoom: string; replays: number;
}) {
  const playground = PLAYGROUNDS[family.slug];
  const onStage = config && playground ? matchingTile(playground, tiles, config) : tile;
  const label = config && playground ? onStage?.label ?? "Custom" : tile.label;
  return (
    <div className="studio-sections" {...zoomScope(zoom)}>
      <CanvasSection id="family-preview" title="Preview" lede="At its real size, with its code. The Inspector sets its properties.">
        <Stage zoom={zoom} replays={replays} label={label}
          code={config && playground ? configCode(playground, config) : SNIPPETS[tile.demo]}>
          <TileBoundary>{config && playground ? renderConfig(playground, config, onChange) : <Demo name={tile.demo} />}</TileBoundary>
        </Stage>
      </CanvasSection>
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
  // The page opens as a documentation page does: what the family is for, in plain text from its manifest, over the
  // tabs, so every tab reads under it (owner, 2026-10-22, after a component docs page and Primer's).
  const purpose = manifestOf(family)?.description;
  return (
    <>
    {purpose ? <p className="studio-lede" {...appScale()}>{purpose}</p> : null}
    <Tabs className="studio-family-tabs" size="sm" aria-label={`${family.name} views`} value={tab} onValueChange={next => onTab(next as FamilyTab)}
      items={FAMILY_TABS.map(entry => ({ id: entry.id, label: entry.label }))} {...appScale()}>
      {/* The tabs' panel is the app's; the specimens inside take the Inspector's settings (specimen-scope.tsx). */}
      <div className="studio-family-tabs__panel">
        {tab === "overview" ? overview
          : tab === "documentation" ? <DocumentationTab family={info} onOpenFamily={onOpenFamily} familyName={familyName} />
          : tab === "api" ? <ApiTab family={info} />
          : tab === "code" ? <CodeTab family={info} />
          : <SpecTab family={info} />}
      </div>
    </Tabs>
    </>
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
  // The Cards menu (CONTAINERS, HEIGHTS): the card drawn or not, fixed or hugging its component. New keys: the old
  // "components-card" held one of nine looks.
  const [container, setContainer] = useViewOption<CardContainer>("components-container", "container", CONTAINERS.map(choice => choice.value));
  const [height, setHeight] = useViewOption<CardHeight>("components-height", "fixed", HEIGHTS.map(choice => choice.value));
  const look = lookOf(container);
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
  // A family's row in the Sidebar tree (studio.tsx, SidebarTree): `key:` where it is listed, `pin:` under Pinned, so the
  // context menu pins either (organize.tsx, PinMenu); the Inspector heading pins too. No pin on the row: Tree view keeps
  // a row's actions' room when they are hidden, which set the rows' counts in from the branches'.
  // A family's variants hang under its row where it is listed; a pinned row is a shortcut to the family alone.
  const treeRow = (entry: Family, prefix: "key" | "pin"): TreeViewNode => ({
    id: `${prefix}:${entry.slug}`, label: entry.name, trailing: <Count count={TILES.get(entry.slug)!.length} />,
    children: prefix === "key" ? variantRows(entry) : undefined,
  });

  // Opening and leaving the Stage. Opening keeps the tile; leaving, by any route (Escape, ⌘↑, ⌘[, the Overview button,
  // the breadcrumb), opens the Overview at the family just left, its section open and the tile selected ("you were
  // here"), and Back or Escape returns to it. A card opened from the Overview grows into the Stage; leaving shrinks the
  // Stage into its card (pendingMorph, morph).
  const canvas = useRef<HTMLDivElement>(null);
  const open = (key: string, from?: Element | null) => {
    if (from) pendingMorph = { from: from.getBoundingClientRect(), to: "stage" };
    select(key);
  };
  const back = () => {
    const stage = canvas.current?.querySelector(".studio-stage");
    if (stage) pendingMorph = { from: stage.getBoundingClientRect(), to: "tile" };
    select("");
  };
  // The family sections opened in the Overview (Show all), kept while the tab is open.
  const [expanded, setExpanded] = useState<string[]>([]);
  const toggleSection = (slug: string) => setExpanded(open => open.includes(slug) ? open.filter(entry => entry !== slug) : [...open, slug]);
  const lastStage = useRef<string | undefined>(undefined);
  if (family && stageTile) lastStage.current = stageKey;
  // Arriving in the Overview from a tile: which tile, and the move to play once its card is drawn.
  const arriving = useRef<{ key: string; move: typeof pendingMorph } | null>(null);
  useLayoutEffect(() => {
    const move = pendingMorph;
    pendingMorph = null;
    setEdit(null);
    if (family) {
      canvas.current?.scrollTo({ top: 0 });
      if (move?.to === "stage") morph(canvas.current?.querySelector(".studio-stage"), move.from, "slow");
      return;
    }
    const key = lastStage.current;
    lastStage.current = undefined;
    if (!key) { canvas.current?.scrollTo({ top: 0 }); return; }
    const slug = key.split("/")[0]!;
    setSelected(key);
    setExpanded(open => open.includes(slug) ? open : [...open, slug]);
    arriving.current = { key, move };
  }, [family?.slug]);
  // The next render draws the family's section open with the tile selected: bring it into view, then play the move.
  useLayoutEffect(() => {
    if (!arriving.current || family) return;
    const { key, move } = arriving.current;
    const card = document.getElementById(`variant-${key.split("/").join("-")}`);
    if (!card) return;
    arriving.current = null;
    card.scrollIntoView({ block: "center" });
    if (move?.to === "tile") morph(card.closest(".gallery-asset") ?? card, move.from, "moderate");
  });
  // Escape leaves the Stage for the Overview, and in the Overview returns to the tile just left.
  useStageKeys({ onBack: back, enabled: Boolean(family) });
  useStageKeys({ onBack: () => { if (selected) open(selected, document.getElementById(`variant-${selected.split("/").join("-")}`)); }, enabled: !family && Boolean(selected) && mode === "grid" });
  // In the Overview a family's row in the Sidebar scrolls to its section, as a table of contents; a variant's row opens it.
  const [toc, setToc] = useState<string>();
  const onTree = (id: string) => {
    if (id.startsWith("tile:")) { open(id.slice(5)); return; }
    const slug = id.replace(/^(key|pin):/, "");
    if (family || mode === "list") { select(slug); return; }
    setToc(slug);
    document.getElementById(`family-${slug}`)?.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  useEffect(() => setToc(undefined), [family?.slug]);
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
  // Previous and next tile, through the library in the Sidebar's order: a family's last tile leads to the next family's
  // first, so the Stage walks every variant as the Overview lists them.
  const sequence = (ordered.some(entry => entry.slug === family?.slug) ? ordered : FAMILIES)
    .flatMap(entry => TILES.get(entry.slug)!.map(tile => ({ family: entry, tile })));
  const at = family && stageTile ? sequence.findIndex(step => step.family === family && step.tile.id === stageTile.id) : -1;
  const previous = at > 0 ? sequence[at - 1] : undefined;
  const following = at >= 0 ? sequence[at + 1] : undefined;
  const stepName = (step: (typeof sequence)[number]) => `${step.family.name}, ${step.tile.label}`;
  const stageLabel = config && playground ? matchingTile(playground, tiles, config)?.label ?? "Custom" : stageTile?.label;

  // The Overview fits section by section (FamilySection); the Stage shows its tile at its real size.
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

  // How the cards are drawn, after the zoom (PRODUCT_UI rule 14: zoom, style, size): an icon menu as Sort and group is,
  // its choices kept open so the cards change behind it.
  const cardsSummary = `${CONTAINERS.find(choice => choice.value === container)!.label}, ${HEIGHTS.find(choice => choice.value === height)!.label.toLowerCase()}`;
  const cardsControl = (
    <Menu aria-label="Cards" align="end" tooltip={<>Cards: {cardsSummary}</>}
      trigger={<Button variant="ghost" tone="neutral" size="sm" iconOnly className="studio-bar-icon" icon={<CardsIcon />} aria-label="Cards" />}>
      <MenuLabel>Container</MenuLabel>
      {CONTAINERS.map(choice => (
        <MenuItem key={choice.value} keepOpen radio checked={container === choice.value} onClick={() => setContainer(choice.value)}>{choice.label}</MenuItem>
      ))}
      <MenuSeparator />
      <MenuLabel>Height</MenuLabel>
      {HEIGHTS.map(choice => (
        <MenuItem key={choice.value} keepOpen radio checked={height === choice.value} description={choice.description} onClick={() => setHeight(choice.value)}>{choice.label}</MenuItem>
      ))}
    </Menu>
  );

  return (
    <Workspace
      sidebar={
        <SidebarList>
          <PinMenu pins={pins} label="Components">
            <SidebarTree label="Components" count={shown.length} onSelect={onTree}
              current={family ? (stageTile && variantRows(family) ? `tile:${family.slug}/${stageTile.id}` : `key:${family.slug}`) : toc ? `key:${toc}` : undefined}
              reveal={family ? revealOf(family, stageTile) : undefined}
              groups={[
                { id: "pinned", label: "Pinned", items: pinned.map(entry => treeRow(entry, "pin")) },
                ...groups.map(([label, list]) => ({ id: label.toLowerCase().replace(/\s+/g, "-"), label, items: list.map(entry => treeRow(entry, "key")) })),
              ]} />
          </PinMenu>
        </SidebarList>
      }
      canvasLead={family ? (
        // The way out and where this is (owner, 2026-10-24: "at the top, breadrcumbs can be used to help with layer
        // management"): the Overview, then the path to the tile, each step a link back up.
        <div className="studio-canvas__lead">
          <Tooltip side="bottom" describes={false} trigger={
            <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<GridIcon />} aria-label="Overview" aria-keyshortcuts="Escape" onClick={back} />
          }>Overview <Kbd keys={["Esc"]} size="sm" /></Tooltip>
          <Breadcrumb nowrap className="studio-canvas__crumbs" aria-label="Where this is" {...appScale()}>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href={hrefOf({ page: "components" })} onClick={event => { event.preventDefault(); back(); }}>Components</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href={hrefOf({ page: "components", item: family.slug })} onClick={event => { event.preventDefault(); select(family.slug); }}>{family.name}</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{stageLabel}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      ) : (
        // Where this is in the Overview too (owner, 2026-10-25: "put some text in the top left, a breadcrumb"), so the bar
        // reads the same on both levels: the tab, then the level, where a tile adds its family and its name. Components
        // scrolls back to the top. Then the way back to the tile just left (the Overview's "you were here"), as Escape.
        <div className="studio-canvas__lead">
          <Breadcrumb nowrap className="studio-canvas__crumbs" aria-label="Where this is" {...appScale()}>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink href={hrefOf({ page: "components" })} onClick={event => { event.preventDefault(); canvas.current?.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }}>Components</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{mode === "list" ? "List" : "Overview"}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {selectedFamily && selectedTile && mode === "grid" ? (
            <Tooltip side="bottom" trigger={
              <Button variant="ghost" tone="neutral" size="sm" icon={<ArrowLeftIcon />} aria-keyshortcuts="Escape"
                onClick={() => open(selected!, document.getElementById(`variant-${selected!.split("/").join("-")}`))}>Back to {selectedFamily.name}</Button>
            }>{selectedFamily.name}, {selectedTile.label} <Kbd keys={["Esc"]} size="sm" /></Tooltip>
          ) : null}
        </div>
      )}
      canvasTitle={family ? `${family.name}, ${stageLabel}` : "Overview"}
      canvasActions={family ? (
        <ViewControls>
          {/* Replay and zoom view the Stage, on Preview only (a control that does not apply is left out). */}
          {onOverview ? <ChromeButton label="Replay" icon={<ResetIcon />} onClick={() => setReplays(count => count + 1)} /> : null}
          {onOverview ? zoomControl : null}
          <ChromeButton label={previous ? `Previous: ${stepName(previous)}` : "Previous"} icon={<ChevronLeftIcon />} onClick={() => previous && select(`${previous.family.slug}/${previous.tile.id}`)} />
          <ChromeButton label={following ? `Next: ${stepName(following)}` : "Next"} icon={<ChevronRightIcon />} onClick={() => following && select(`${following.family.slug}/${following.tile.id}`)} />
        </ViewControls>
      ) : (
        <ViewControls>
          <ViewFilter label="Status" value={status} onChange={setStatus}
            options={[{ value: "all", label: "All statuses" }, { value: "complete", label: "Complete" }, { value: "review", label: "In review" }, { value: "unrefined", label: "Unrefined" }]} />
          <ArrangeMenu arrangement={arrangement} sorts={SORTS} groups={GROUPS} directions={DIRECTIONS[arrangement.sort]} />
          {mode === "grid" ? zoomControl : null}
          {mode === "grid" ? cardsControl : null}
          <ViewSwitch value={mode} onChange={setMode} />
        </ViewControls>
      )}
      canvasRef={canvas}
      canvas={family ? (
        stageTile
          ? <FamilyPage family={family} tab={familyTab} onTab={setFamilyTab} onOpenFamily={open}
              overview={<FamilyPreview family={family} tiles={tiles} tile={stageTile} config={config} onChange={change} zoom={zoom} replays={replays} />} />
          : <EmptyState title="No tiles yet" description="This family has no gallery specimens." />
      ) : onCanvas.length ? mode === "list" ? (
        // List: one row per family, its status, tile count and import.
          <Table size="md" interactive aria-label="Components">
            <thead><tr><th scope="col">Family</th><th scope="col">Status</th><th scope="col">Tiles</th><th scope="col">Import</th></tr></thead>
            <tbody>
              {onCanvas.map(entry => (
                <tr key={entry.slug}>
                  <td><TableLink href={hrefOf({ page: "components", item: entry.slug })} onClick={event => { event.preventDefault(); select(entry.slug); }}>{entry.name}</TableLink></td>
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
            visit={selected} open={expanded} onToggle={toggleSection} onOpen={open} zoom={zoom} look={look} waterfall={height === "waterfall"} />
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
        manifest && Object.keys(manifest.variants).length ? ["Variants", Object.entries(manifest.variants).map(([axis, values]) => `${axis} ${values.length}`).join(", ")] : null,
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
