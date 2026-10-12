/**
 * Icons: the categories in the Sidebar, every Area icon grouped by category on the Canvas
 * (filtered by the Titlebar search), and the selected icon in the Inspector with its style, size,
 * facts and Copy SVG. The icon data and the SVG export are the icon browser's
 * (apps/docs/src/gallery/icon-browser.tsx).
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Badge, Button, Code, Count, EmptyState, Field, HoverCard, Nav, NavGroup, NavItem, PanelSection, Segmented, Slider, Table, TableLink } from "@area/react";
import { PILOT_BATCHES, PILOT_ICONS } from "../../../docs/src/pilot-icons.tsx";
import { CopyIcon, DownloadIcon } from "@area/icons";
import { ICON_CATEGORIES } from "../../../docs/src/icon-categories.ts";
import { CopyButton, standaloneSvg } from "../../../docs/src/gallery/icon-browser.tsx";
import { SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection } from "../tile.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { Facts } from "../facts.tsx";
import { matches } from "../search.ts";
import { readStored, writeStored } from "../storage.ts";
import { ArrangeMenu, groupBy, PinButton, PinMenu, sortBy, useArrangement, usePins } from "../organize.tsx";
import { onGridKeys } from "../grid-keys.ts";

type Entry = (typeof PILOT_ICONS)[number];
type Mode = "outline" | "filled";

const BY_NAME = new Map<string, Entry>(PILOT_ICONS.map(icon => [icon.name, icon]));
const CATEGORY_OF = new Map(ICON_CATEGORIES.flatMap(category => category.icons.map(name => [name, category] as const)));
const STATUS = new Map<string, { status: string; batch: string }>(
  PILOT_BATCHES.flatMap(batch => Object.entries(batch.icons).map(([name, status]) => [name, { status, batch: batch.title }] as const)),
);
/** An icon's review status, from its batch (a variant shares its base icon's). */
const statusOf = (name: string) => STATUS.get(BY_NAME.get(name)?.derivedFrom ?? name)?.status;
/** An icon's review status as the components' status reads: a soft Badge, success when approved. */
const StatusBadge = ({ name }: { name: string }) => statusOf(name) === "approved"
  ? <Badge size="sm" tone="success" variant="soft">Approved</Badge>
  : <Badge size="sm" tone="caution" variant="soft">In review</Badge>;
const titleCase = (name: string) => name.split("-").map(word => word[0]!.toUpperCase() + word.slice(1)).join(" ");

/* Sort and group (src/organize.tsx). The default is the curated order: by category, each in the
   order its category lists it. */
const SORTS = [{ value: "category", label: "Category order" }, { value: "name", label: "Name" }] as const;
const GROUPS = [{ value: "category", label: "Category" }, { value: "status", label: "Status" }, { value: "none", label: "None" }] as const;
type Sort = (typeof SORTS)[number]["value"];
type Group = (typeof GROUPS)[number]["value"];
const ORDER = new Map(ICON_CATEGORIES.flatMap(category => category.icons).map((name, index) => [name, index] as const));
const STATUS_LABEL = (name: string) => statusOf(name) === "approved" ? "Approved" : statusOf(name) === "review" ? "In review" : "Not reviewed";

/* Sizes: the grid from Area's 12 floor to 32; the preview at the icon browser's 128, the hover
   window's at 96 (three quarters of it, so the card stays a third of the Canvas or less). */
const SIZE = { min: 12, max: 32, initial: 16 } as const;
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
 * an Area Hover card under it with the icon's name and category, the icon large, and Copy SVG,
 * Download SVG and Copy name. Its rows are built only while it is open, so a sheet of hundreds of
 * cells carries one empty surface each.
 */
function IconCell({ entry, style, size, selected, onChoose }: { entry: Entry; style: Mode; size: number; selected: boolean; onChoose: () => void }) {
  const [open, setOpen] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  const Glyph = style === "filled" ? entry.Filled : entry.Icon;
  const svg = () => {
    const node = preview.current?.querySelector("svg");
    return node ? standaloneSvg(node, entry.name) : "";
  };
  const category = CATEGORY_OF.get(entry.name);
  return (
    <HoverCard side="bottom" align="center" delay={500} open={open} onOpenChange={setOpen} className="studio-icon-card" aria-label={titleCase(entry.name)}
      trigger={
        <button type="button" className="studio-icons__cell" data-icon={entry.name} data-key={entry.name} data-name={titleCase(entry.name)}
          aria-pressed={selected} aria-label={titleCase(entry.name)} onClick={onChoose}>
          <Glyph size={size} aria-hidden="true" />
        </button>
      }>
      {open ? <>
        <div className="studio-icon-card__head">
          <span className="studio-icon-card__name">{entry.name}</span>
          {category ? <span className="studio-icon-card__meta">{category.name}</span> : null}
        </div>
        <div className="studio-icon-card__preview" ref={preview}><Glyph size={CARD_PREVIEW} aria-hidden="true" /></div>
        <div className="studio-icon-card__actions">
          <CopyButton label="Copy SVG" icon={<CopyIcon />} fullWidth copy={() => navigator.clipboard.writeText(svg())} />
          <Button variant="outline" size="sm" fullWidth icon={<DownloadIcon />} onClick={() => download(svg(), entry.name)}>Download SVG</Button>
          <CopyButton label="Copy name" icon={<CopyIcon />} fullWidth copy={() => navigator.clipboard.writeText(entry.name)} />
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

  // The Sidebar's choice (All, or one category) and the Inspector's (one icon, kept across launches).
  const view = ICON_CATEGORIES.find(category => category.slug === item);
  const [selected, setSelected] = useState(() => readStored("icon", "component"));
  const choose = (name: string) => { setSelected(name); writeStored("icon", name); };
  const icon = BY_NAME.get(selected) ?? PILOT_ICONS[0]!;
  const [mode, setMode] = useViewOption<ViewMode>("icons", "grid", ["grid", "list"]);
  const [status, setStatus] = useViewOption<"all" | "approved" | "review">("icons-status", "all", ["all", "approved", "review"]);
  const arrangement = useArrangement<Sort, Group>("icons", { sort: "category", descending: false, group: "category" }, SORTS, GROUPS);
  const pins = usePins("icons");
  const filtered = useMemo(() => ICON_CATEGORIES.map(category => ({
    ...category,
    shown: category.icons.filter(name => matches(query, name, category.name, BY_NAME.get(name)?.derivedFrom)
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
    canvas.current?.querySelector<HTMLElement>(`[data-icon="${CSS.escape(icon.name)}"]`)?.scrollIntoView({ block: "nearest" });
  }, [icon.name]);

  const preview = useRef<HTMLDivElement>(null);
  const svg = () => {
    const node = preview.current?.querySelector("svg");
    return node ? standaloneSvg(node, icon.name) : "";
  };
  const Draw = style === "filled" ? icon.Filled : icon.Icon;
  const iconStatus = STATUS.get(icon.derivedFrom ?? icon.name);
  const category = CATEGORY_OF.get(icon.name);

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
      canvasMeta={<span className="studio-muted studio-tabular">{total}</span>}
      canvasRef={canvas}
      canvasActions={
        <ViewControls>
          <ViewFilter label="Status" value={status} onChange={setStatus}
            options={[{ value: "all", label: "All statuses" }, { value: "approved", label: "Approved" }, { value: "review", label: "In review" }]} />
          <ArrangeMenu arrangement={arrangement} sorts={SORTS} groups={view ? undefined : GROUPS}
            directions={arrangement.sort === "name" ? ["A to Z", "Z to A"] : ["First to last", "Last to first"]} />
          <ViewSwitch value={mode} onChange={setMode} />
        </ViewControls>
      }
      canvas={total ? (
        <PinMenu pins={pins} label="Icon">
        <div className="studio-icons studio-sections" style={{ "--_size": `${size}px` } as CSSProperties} onKeyDown={onGridKeys}>
          {onCanvas.map(section => (
            <CanvasSection key={section.slug} id={`icons-${section.slug}`} title={view || onCanvas.length === 1 ? undefined : <>{section.name} <span className="studio-muted">{section.shown.length}</span></>}>
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
                        <tr key={name} data-selected={name === icon.name ? "" : undefined}>
                          <td className="area-table__cell--fit"><span className="studio-icons__glyph" data-icon={name}><Glyph size={size} aria-hidden="true" /></span></td>
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
                    return entry ? <IconCell key={name} entry={entry} style={style} size={size} selected={name === icon.name} onChoose={() => choose(name)} /> : null;
                  })}
                </div>
              )}
            </CanvasSection>
          ))}
        </div>
        </PinMenu>
      ) : <EmptyState title="No icons" description={`Nothing matches “${query}”.`} />}
      inspectorTitle={titleCase(icon.name)}
      inspector={
        <>
          <CanvasSettings axes={["ui"]} />
          <PanelSection>
            <div className="studio-icon-preview" ref={preview}><Draw size={PREVIEW} aria-hidden="true" /></div>
            <CopyButton label="Copy SVG" icon={<CopyIcon />} fullWidth copy={() => navigator.clipboard.writeText(svg())} />
          </PanelSection>
          <PanelSection heading="Display">
            <Field label="Style" orientation="horizontal">
              <Segmented size="sm" fullWidth value={style} onValueChange={value => setStyle(value as Mode)}
                items={[{ value: "outline", label: "Outline" }, { value: "filled", label: "Filled" }]} />
            </Field>
            <Field label="Size" orientation="horizontal">
              <Slider size="sm" min={SIZE.min} max={SIZE.max} step={4} value={size} readout
                onChange={event => setSize(Number(event.currentTarget.value))} />
            </Field>
          </PanelSection>
          <PanelSection heading="Icon" actions={<PinButton name={titleCase(icon.name)} pinned={pins.has(icon.name)} onToggle={() => pins.toggle(icon.name)} />}>
            <Facts label="Icon" items={[
              ["Name", <Code>{icon.name}</Code>],
              category ? ["Category", category.name] : null,
              icon.derivedFrom ? ["From", icon.derivedFrom] : null,
              ["Keyline", icon.keyline],
              iconStatus ? ["Status", <StatusBadge name={icon.name} />] : null,
              iconStatus ? ["Batch", iconStatus.batch] : null,
            ]} />
          </PanelSection>
        </>
      }
    />
  );
}
