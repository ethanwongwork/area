/**
 * Icons: the categories in the Sidebar, every Area icon grouped by category on the Canvas
 * (filtered by the Titlebar search, which also reads each icon's keywords and its names in other
 * libraries), drawn in the style and at the size the Canvas's header sets. The Inspector shows the chosen
 * icon (its drawing, Copy SVG, Download, Copy name and import, its facts and search words from
 * @area/icons/meta), else the Sidebar's category, else the set. Icons, categories and batches come from
 * @area/icons; the SVG export and CopyButton are ../copy.tsx.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { Badge, Button, Code, Count, EmptyState, HoverCard, ListBox, ListBoxItem, Nav, NavGroup, NavItem, PanelSection, Segmented, Select, Table, TableCell, TableLink } from "@area/react";
import { batches as ICON_BATCHES, categories as ICON_CATEGORIES, icons as ICON_META } from "@area/icons/meta";
import * as APPROVED from "@area/icons";
import * as IN_REVIEW from "@area/icons/review";
import { CopyIcon, DownloadIcon, StarFilledIcon, StarIcon } from "@area/icons";
import { CopyButton, standaloneSvg } from "../copy.tsx";
import { SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection } from "../tile.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { Facts } from "../facts.tsx";
import { Preview, Selection } from "../inspector.tsx";
import { matches } from "../search.ts";
import { readStored, writeStored } from "../storage.ts";
import { ArrangeMenu, groupBy, PinButton, PinMenu, sortBy, useArrangement, usePins } from "../organize.tsx";

type Mode = "outline" | "filled";
type IconComponent = (props: APPROVED.IconProps) => ReactElement;
/** One icon as the page draws it: its record in @area/icons/meta and its two components (approved icons from the
 *  main entry, the rest from @area/icons/review). */
type Entry = (typeof ICON_META)[number] & { Icon: IconComponent; Filled: IconComponent };
const COMPONENTS: Record<string, IconComponent> = { ...IN_REVIEW, ...APPROVED } as unknown as Record<string, IconComponent>;
const BY_NAME = new Map<string, Entry>(ICON_META.map(meta => [meta.name, { ...meta, Icon: COMPONENTS[meta.component]!, Filled: COMPONENTS[meta.filledComponent]! }]));
const CATEGORY_OF = new Map(ICON_CATEGORIES.flatMap(category => category.icons.map(name => [name, category] as const)));
const BATCH_TITLE = new Map(ICON_BATCHES.map(batch => [batch.id, batch.title]));
/** An icon's review status, from its batch (a variant shares its base icon's); none when it was never put in one. */
const statusOf = (name: string) => { const entry = BY_NAME.get(name); return entry?.batch ? entry.status : undefined; };
/** An icon's review status as the components' status reads: a soft Badge, success when approved. */
const StatusBadge = ({ name }: { name: string }) => statusOf(name) === "approved"
  ? <Badge size="sm" tone="success" variant="soft">Approved</Badge>
  : <Badge size="sm" tone="caution" variant="soft">In review</Badge>;
const titleCase = (name: string) => name.split("-").map(word => word[0]!.toUpperCase() + word.slice(1)).join(" ");
/* The package's record of each icon: its export names, and the names that draw the same icon. */
const META = new Map(ICON_META.map(entry => [entry.name, entry]));
const ALIASES = new Map<string, string[]>();
for (const entry of ICON_META) if (entry.aliasOf) ALIASES.set(entry.aliasOf, [...(ALIASES.get(entry.aliasOf) ?? []), entry.name]);
/** What the search reads besides the name: the icon's keywords and its names in other libraries. */
const searchWords = (name: string) => {
  const meta = META.get(name);
  return meta ? [...meta.keywords, ...Object.values(meta.names ?? {}).map(other => other.replaceAll("_", " "))] : [];
};
const LIBRARIES = [["lucide", "Lucide"], ["phosphor", "Phosphor"], ["fluent", "Fluent"], ["material", "Material"]] as const;
/** The import line: approved icons are in the main entry, the rest in @area/icons/review. */
const importLine = (name: string, style: "outline" | "filled") => {
  const meta = META.get(name);
  if (!meta) return undefined;
  return `import { ${style === "filled" ? meta.filledComponent : meta.component} } from "@area/icons${meta.status === "approved" ? "" : "/review"}";`;
};

/* Sort and group (src/organize.tsx). The default is the curated order: by category, each in the
   order its category lists it. */
const SORTS = [{ value: "category", label: "Category order" }, { value: "name", label: "Name" }] as const;
const GROUPS = [{ value: "category", label: "Category" }, { value: "status", label: "Status" }, { value: "none", label: "None" }] as const;
type Sort = (typeof SORTS)[number]["value"];
type Group = (typeof GROUPS)[number]["value"];
const ORDER = new Map(ICON_CATEGORIES.flatMap(category => category.icons).map((name, index) => [name, index] as const));
const STATUS_LABEL = (name: string) => statusOf(name) === "approved" ? "Approved" : statusOf(name) === "review" ? "In review" : "Not reviewed";

/* Sizes: the grid from Area's 12 floor to 32 in steps of 4, chosen in the Canvas's header; the preview
   at the icon browser's 128, the hover window's at 96 (three quarters of it, so the card stays a
   third of the Canvas or less). */
const SIZE = { min: 12, max: 32, initial: 16 } as const;
const SIZES = Array.from({ length: (SIZE.max - SIZE.min) / 4 + 1 }, (_, index) => SIZE.min + index * 4);
const PREVIEW = 128;
const CARD_PREVIEW = 96;

/** Saves an icon's SVG as a file (the browser's download; Electron asks where). */
function download(svg: string, name: string) {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: `${name}.svg` });
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * The icon hover window (owner, 2026-10-12, after Cursor's icon gallery): resting on a cell opens
 * an Area Hover card under it with the icon's name and category, the icon large, and Copy SVG over
 * Download, stacked across the card at Button's default size (owner, 2026-10-17: stack them, drop one
 * copy). Copy name went: the name is printed on the card, and the Inspector keeps Copy name and
 * Copy import. The download says "Download" (its neighbour names the format). Its rows are built
 * only while it is open, so a sheet of hundreds of cells carries one empty surface each.
 */
/*
 * The Canvas's icons. In the grid they are one ListBox (docs/specs/list-box.md): a single Tab stop, the arrows move
 * across the sheets in reading order and to the nearest icon above or below, typing jumps to a name, and selection
 * follows focus so the Inspector shows what the keys are on. Sections are its groups. The list view is a Table.
 */
function Sheet({ grid, value, onChoose, size, children }: { grid: boolean; value: string | null; onChoose: (name: string) => void; size: number; children: ReactNode }) {
  const style = { "--_size": `${size}px` } as CSSProperties;
  return grid
    ? <ListBox layout="grid" aria-label="Icons" value={value} onValueChange={onChoose} selectionFollowsFocus className="studio-icons studio-sections" style={style}>{children}</ListBox>
    : <div className="studio-icons studio-sections" style={style}>{children}</div>;
}

function IconCell({ entry, style, size }: { entry: Entry; style: Mode; size: number }) {
  const [open, setOpen] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  const Glyph = style === "filled" ? entry.Filled : entry.Icon;
  const svg = () => {
    const node = preview.current?.querySelector("svg");
    return node ? standaloneSvg(node, entry.name) : "";
  };
  const category = CATEGORY_OF.get(entry.name);
  return (
    // Pointer only: the arrows sweep the sheet, and the Inspector already shows the card's name and actions for the
    // option the keys are on (the List box's selection follows focus).
    <HoverCard side="bottom" align="center" delay={500} openOnFocus={false} open={open} onOpenChange={setOpen} className="studio-icon-card" aria-label={titleCase(entry.name)}
      trigger={
        // An option of the sheet's ListBox: selected by a press or, as the keys move, by focus.
        <ListBoxItem value={entry.name} textValue={titleCase(entry.name)} className="studio-icons__cell" data-icon={entry.name} data-key={entry.name}
          data-name={titleCase(entry.name)} aria-label={titleCase(entry.name)}>
          <Glyph size={size} aria-hidden="true" />
        </ListBoxItem>
      }>
      {open ? <>
        <div className="studio-icon-card__head">
          <span className="studio-icon-card__name">{entry.name}</span>
          {category ? <span className="studio-icon-card__meta">{category.name}</span> : null}
        </div>
        <div className="studio-icon-card__preview" ref={preview}><Glyph size={CARD_PREVIEW} aria-hidden="true" /></div>
        <div className="studio-icon-card__actions">
          <CopyButton label="Copy SVG" icon={<CopyIcon />} fullWidth size="md" value={() => svg()} />
          <Button variant="outline" fullWidth icon={<DownloadIcon />} onClick={() => download(svg(), entry.name)}>Download</Button>
        </div>
      </> : null}
    </HoverCard>
  );
}

export function IconsPage() {
  const { query, item, select } = useStudio();
  const [style, setStyle] = useState<Mode>(() => (readStored<string>("iconMode", "outline") === "filled" ? "filled" : "outline"));
  const [size, setSize] = useState<number>(() => {
    const saved = Number(readStored("iconSize", SIZE.initial));
    return saved >= SIZE.min && saved <= SIZE.max ? saved : SIZE.initial;
  });
  useEffect(() => { writeStored("iconMode", style); writeStored("iconSize", size); }, [style, size]);

  // The Sidebar's choice (All, or one category) and the Inspector's (one icon, until the Sidebar's
  // choice changes; with none, the category or the set).
  const view = ICON_CATEGORIES.find(category => category.slug === item);
  const [selected, setSelected] = useState<string>();
  useEffect(() => setSelected(undefined), [item]);
  const choose = (name: string) => setSelected(name);
  const icon = selected ? BY_NAME.get(selected) : undefined;
  const [mode, setMode] = useViewOption<ViewMode>("icons", "grid", ["grid", "list"]);
  const [status, setStatus] = useViewOption<"all" | "approved" | "review">("icons-status", "all", ["all", "approved", "review"]);
  const arrangement = useArrangement<Sort, Group>("icons", { sort: "category", descending: false, group: "category" }, SORTS, GROUPS);
  const pins = usePins("icons");
  const filtered = useMemo(() => ICON_CATEGORIES.map(category => ({
    ...category,
    shown: category.icons.filter(name => matches(query, name, category.name, BY_NAME.get(name)?.derivedFrom, ...searchWords(name))
      && (status === "all" || statusOf(name) === status)),
  })), [query, status]);
  const listed = filtered.filter(section => section.shown.length);
  // The Canvas's sections: one category (the Sidebar's choice), or every icon arranged.
  const order = (names: readonly string[]) => arrangement.sort === "name"
    ? sortBy(names, name => name, arrangement.descending)
    : sortBy(names, name => ORDER.get(name) ?? 0, arrangement.descending);
  const sections = useMemo(() => {
    if (view) return filtered.filter(section => section.slug === view.slug).map(section => ({ ...section, shown: order(section.shown) }));
    const every = order([...new Set(listed.flatMap(section => section.shown))]);
    if (arrangement.group === "status") return groupBy(every, STATUS_LABEL, ["Approved", "In review", "Not reviewed"]).map(([name, shown]) => ({ slug: name.toLowerCase().replace(/\s+/g, "-"), name, shown }));
    if (arrangement.group === "none") return every.length ? [{ slug: "all", name: "All icons", shown: every }] : [];
    const categories = arrangement.sort === "name" ? sortBy(listed, section => section.name, arrangement.descending) : arrangement.descending ? [...listed].reverse() : listed;
    return categories.map(section => ({ ...section, shown: order(section.shown) }));
  }, [filtered, view, arrangement.sort, arrangement.descending, arrangement.group]);
  const onCanvas = sections;
  const total = onCanvas.reduce((sum, section) => sum + section.shown.length, 0);
  const pinned = pins.pins.filter(name => BY_NAME.has(name));

  // Keep the selected icon in view when it changes from the Sidebar or a link.
  const canvas = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (icon) canvas.current?.querySelector<HTMLElement>(`[data-icon="${CSS.escape(icon.name)}"]`)?.scrollIntoView({ block: "nearest" });
  }, [icon?.name]);

  const preview = useRef<HTMLDivElement>(null);
  const svg = () => {
    const node = preview.current?.querySelector("svg");
    return node && icon ? standaloneSvg(node, icon.name) : "";
  };
  const Draw = icon ? (style === "filled" ? icon.Filled : icon.Icon) : undefined;
  const iconStatus = icon?.batch ? { status: icon.status, batch: BATCH_TITLE.get(icon.batch) ?? icon.batch } : undefined;
  const category = icon ? CATEGORY_OF.get(icon.name) : undefined;
  const meta = icon ? META.get(icon.name) : undefined;
  const aliases = icon ? [...(ALIASES.get(icon.name) ?? []), ...(meta?.aliasOf ? [meta.aliasOf] : [])] : [];
  // The overview counts what the Sidebar's choice holds: the category, or every icon.
  const scope = view ? view.icons : ICON_META.map(entry => entry.name);
  const approved = scope.filter(name => statusOf(name) === "approved").length;
  const inReview = scope.filter(name => statusOf(name) === "review").length;

  return (
    <Workspace
      sidebar={<SidebarList><PinMenu pins={pins} label="Icons">{
        <Nav aria-label="Icon categories">
          <SidebarAll tab="icons" count={listed.reduce((sum, section) => sum + section.shown.length, 0)} current={!view} />
          {pinned.length ? (
            <NavGroup label="Pinned">
              {pinned.map(name => {
                const entry = BY_NAME.get(name)!;
                const Glyph = style === "filled" ? entry.Filled : entry.Icon;
                return (
                  <NavItem key={name} href={`#icons`} data-key={name} data-name={titleCase(name)} icon={<Glyph size={16} aria-hidden="true" />}
                    onClick={event => { event.preventDefault(); choose(name); }}>
                    {titleCase(name)}
                  </NavItem>
                );
              })}
            </NavGroup>
          ) : null}
          <NavGroup label="Categories">
            {/* The categories in the Canvas's order (product UI rule 7): A to Z under Name, reversed
                under descending; the curated order otherwise. */}
            {(arrangement.sort === "name" ? sortBy(listed, section => section.name, arrangement.descending) : arrangement.descending ? [...listed].reverse() : listed).map(section => (
              <NavItem key={section.slug} href={`#icons/${section.slug}`} current={section.slug === view?.slug}
                onClick={event => { event.preventDefault(); select(section.slug); }}
                trailing={<Count count={section.shown.length} />}>
                {section.name}
              </NavItem>
            ))}
          </NavGroup>
        </Nav>
      }</PinMenu></SidebarList>}
      canvasTitle={view ? view.name : "All icons"}
      canvasRef={canvas}
      canvasActions={
        <ViewControls>
          <ViewFilter label="Status" value={status} onChange={setStatus}
            options={[{ value: "all", label: "All statuses" }, { value: "approved", label: "Approved" }, { value: "review", label: "In review" }]} />
          <ArrangeMenu arrangement={arrangement} sorts={SORTS} groups={view ? undefined : GROUPS}
            directions={arrangement.sort === "name" ? ["A to Z", "Z to A"] : ["First to last", "Last to first"]} />
          {/* How the icons are drawn, as Components' zoom: the style, then the size (product UI
              rule 14: display settings in the Canvas's header, after the filters and the sort). */}
          <Segmented size="sm" iconOnly aria-label="Style" value={style} onValueChange={value => setStyle(value as Mode)}
            items={[{ value: "outline", label: "Outline", icon: <StarIcon /> }, { value: "filled", label: "Filled", icon: <StarFilledIcon /> }]} />
          <Select size="sm" variant="soft" aria-label="Size" value={String(size)} onChange={event => setSize(Number(event.currentTarget.value))}
            style={{ "--area-select-inline-size": "calc(var(--area-space-64) + var(--area-space-8))" } as CSSProperties /* pick: 72, "32 px" and the chevron */}>
            {SIZES.map(value => <option key={value} value={value}>{value} px</option>)}
          </Select>
          <ViewSwitch value={mode} onChange={setMode} />
        </ViewControls>
      }
      canvas={total ? (
        <PinMenu pins={pins} label="Icon">
        <Sheet grid={mode !== "list"} value={icon?.name ?? null} onChoose={choose} size={size}>
          {onCanvas.map(section => (
            <CanvasSection key={section.slug} role={mode === "list" ? undefined : "group"} id={`icons-${section.slug}`} title={view || onCanvas.length === 1 ? undefined : <>{section.name} <span className="studio-muted">{section.shown.length}</span></>}>
              {mode === "list" ? (
                // List: one row per icon on the Canvas's surface (a flush Table), drawn at the
                // chosen size, with its facts.
                <Table size="md" interactive flush aria-label={section.name}>
                  <thead><tr><th scope="col">Icon</th><th scope="col">Name</th><th scope="col">Keyline</th><th scope="col">Status</th></tr></thead>
                  <tbody>
                    {section.shown.map(name => {
                      const entry = BY_NAME.get(name);
                      if (!entry) return null;
                      const Glyph = style === "filled" ? entry.Filled : entry.Icon;
                      return (
                        <tr key={name} data-selected={name === icon?.name ? "" : undefined}>
                          <TableCell fit><span className="studio-icons__glyph" data-icon={name}><Glyph size={size} aria-hidden="true" /></span></TableCell>
                          <td><TableLink href={`#icons`} onClick={event => { event.preventDefault(); choose(name); }}><Code>{name}</Code></TableLink></td>
                          <td><span className="studio-muted">{entry.keyline}</span></td>
                          <td>{statusOf(name) ? <StatusBadge name={name} /> : <span className="studio-muted">—</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                // Grid: label-free cells straight on the Canvas's surface, no container (owner,
                // 2026-10-12, after Cursor's icon gallery); names in the hover window and the Inspector.
                <div className="studio-icons__sheet">
                  {section.shown.map(name => {
                    const entry = BY_NAME.get(name);
                    return entry ? <IconCell key={name} entry={entry} style={style} size={size} /> : null;
                  })}
                </div>
              )}
            </CanvasSection>
          ))}
        </Sheet>
        </PinMenu>
      ) : <EmptyState title="No icons" description={`Nothing matches “${query}”.`} />}
      inspector={
        <>
          <CanvasSettings axes={["type", "density"]} />
          {icon && Draw ? (
            <>
              <Selection preview={<Preview ref={preview} label={titleCase(icon.name)}><Draw size={PREVIEW} aria-hidden="true" /></Preview>}>
                <CopyButton label="Copy SVG" icon={<CopyIcon />} fullWidth value={() => svg()} />
                <Button variant="outline" size="sm" fullWidth icon={<DownloadIcon />} onClick={() => download(svg(), icon.name)}>Download</Button>
                <CopyButton label="Copy name" icon={<CopyIcon />} fullWidth value={() => icon.name} />
                {importLine(icon.name, style) ? <CopyButton label="Copy import" icon={<CopyIcon />} fullWidth value={() => importLine(icon.name, style)!} /> : null}
              </Selection>
              <PanelSection heading="Icon" actions={<PinButton name={titleCase(icon.name)} pinned={pins.has(icon.name)} onToggle={() => pins.toggle(icon.name)} />}>
                <Facts label="Icon" items={[
                  ["Name", <Code>{icon.name}</Code>],
                  meta ? ["Import", <Code>{style === "filled" ? meta.filledComponent : meta.component}</Code>] : null,
                  aliases.length ? [meta?.aliasOf ? "Same as" : "Also", aliases.join(", ")] : null,
                  category ? ["Category", category.name] : null,
                  icon.derivedFrom ? ["From", icon.derivedFrom] : null,
                  ["Keyline", icon.keyline],
                  meta ? ["Filled", meta.fill === "solid" ? "Solid body" : "Heavier outline"] : null,
                  meta?.rtl ? ["Right to left", "Mirrors"] : null,
                  meta?.cuts?.includes(12) ? ["At 12px", "Own drawing"] : null,
                  meta?.source ? ["Ink from", `${LIBRARIES.find(([key]) => key === meta.source!.library)?.[1] ?? meta.source.library} ${meta.source.names[0]}`] : null,
                  iconStatus ? ["Status", <StatusBadge name={icon.name} />] : null,
                  iconStatus ? ["Batch", iconStatus.batch] : null,
                ]} />
              </PanelSection>
              {meta ? (
                <PanelSection heading="Search">
                  <Facts label="Search" items={[
                    ...LIBRARIES.map(([key, library]) => meta.names?.[key] ? [library, <Code>{meta.names[key]}</Code>] as const : null),
                    meta.keywords.length ? ["Keywords", meta.keywords.join(", ")] : null,
                  ]} />
                </PanelSection>
              ) : null}
            </>
          ) : (
            <PanelSection heading={view ? "Category" : "Set"}>
              <Facts label={view ? "Category" : "Set"} items={[
                view ? null : ["Package", <Code>@area/icons</Code>],
                ["Icons", scope.length],
                ["Approved", approved],
                ["In review", inReview],
                scope.length - approved - inReview ? ["Not reviewed", scope.length - approved - inReview] : null,
                view ? null : ["Categories", ICON_CATEGORIES.length],
                ["Styles", "Outline, Filled"],
                ["Sizes", `${SIZE.min} to ${SIZE.max}`],
                ["12px cuts", scope.filter(name => META.get(name)?.cuts?.includes(12)).length],
              ]} />
            </PanelSection>
          )}
        </>
      }
    />
  );
}
