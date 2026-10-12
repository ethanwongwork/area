/**
 * Icons: the categories in the Sidebar, every Area icon grouped by category on the Canvas
 * (filtered by the Titlebar search), and the selected icon in the Inspector with its style, size,
 * facts and Copy SVG. The icon data and the SVG export are the icon browser's
 * (apps/docs/src/gallery/icon-browser.tsx).
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { EmptyState, Field, Nav, NavGroup, NavItem, Count, PanelSection, Segmented, Slider, Table, TableLink } from "@area/react";
import { PILOT_BATCHES, PILOT_ICONS, PilotCopyIcon } from "../../../docs/src/pilot-icons.tsx";
import { ICON_CATEGORIES } from "../../../docs/src/icon-categories.ts";
import { CopyButton, standaloneSvg } from "../../../docs/src/gallery/icon-browser.tsx";
import { SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, ListFrame, Tile, TileGrid } from "../tile.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { Facts } from "../facts.tsx";
import { matches } from "../search.ts";
import { readStored, writeStored } from "../storage.ts";

type Entry = (typeof PILOT_ICONS)[number];
type Mode = "outline" | "filled";

const BY_NAME = new Map<string, Entry>(PILOT_ICONS.map(icon => [icon.name, icon]));
const CATEGORY_OF = new Map(ICON_CATEGORIES.flatMap(category => category.icons.map(name => [name, category] as const)));
const STATUS = new Map<string, { status: string; batch: string }>(
  PILOT_BATCHES.flatMap(batch => Object.entries(batch.icons).map(([name, status]) => [name, { status, batch: batch.title }] as const)),
);
/** An icon's review status, from its batch (a variant shares its base icon's). */
const statusOf = (name: string) => STATUS.get(BY_NAME.get(name)?.derivedFrom ?? name)?.status;
const titleCase = (name: string) => name.split("-").map(word => word[0]!.toUpperCase() + word.slice(1)).join(" ");

/* Sizes: the grid from Area's 12 floor to 32; the preview at the icon browser's 128. */
const SIZE = { min: 12, max: 32, initial: 16 } as const;
const PREVIEW = 128;

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
  const sections = useMemo(() => ICON_CATEGORIES.map(category => ({
    ...category,
    shown: category.icons.filter(name => matches(query, name, category.name, BY_NAME.get(name)?.derivedFrom)
      && (status === "all" || statusOf(name) === status)),
  })), [query, status]);
  const listed = sections.filter(section => section.shown.length);
  const onCanvas = view ? sections.filter(section => section.slug === view.slug) : listed;
  const total = onCanvas.reduce((sum, section) => sum + section.shown.length, 0);

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
      sidebar={<SidebarList>{
        <Nav aria-label="Icon categories">
          <SidebarAll tab="icons" count={listed.reduce((sum, section) => sum + section.shown.length, 0)} current={!view} />
          <NavGroup label="Categories">
            {listed.map(section => (
              <NavItem key={section.slug} href={`#icons/${section.slug}`} current={section.slug === view?.slug}
                onClick={event => { event.preventDefault(); select(section.slug); }}
                trailing={<Count count={section.shown.length} />}>
                {section.name}
              </NavItem>
            ))}
          </NavGroup>
        </Nav>
      }</SidebarList>}
      canvasTitle={view ? view.name : "All icons"}
      canvasMeta={<span className="studio-muted studio-tabular">{total}</span>}
      canvasRef={canvas}
      canvasActions={
        <ViewControls>
          <ViewFilter label="Status" value={status} onChange={setStatus}
            options={[{ value: "all", label: "All statuses" }, { value: "approved", label: "Approved" }, { value: "review", label: "In review" }]} />
          <ViewSwitch value={mode} onChange={setMode} />
        </ViewControls>
      }
      canvas={total ? (
        <div className="studio-icons studio-sections" style={{ "--_size": `${size}px` } as CSSProperties}>
          {onCanvas.map(section => (
            <CanvasSection key={section.slug} id={`icons-${section.slug}`} title={view ? undefined : <>{section.name} <span className="studio-muted">{section.shown.length}</span></>}>
              {mode === "list" ? (
                // List: one row per icon, drawn at the chosen size, with its facts.
                <ListFrame>
                  <Table size="md" interactive aria-label={section.name}>
                    <thead><tr><th scope="col">Icon</th><th scope="col">Name</th><th scope="col">Keyline</th><th scope="col">Status</th></tr></thead>
                    <tbody>
                      {section.shown.map(name => {
                        const entry = BY_NAME.get(name);
                        if (!entry) return null;
                        const Glyph = style === "filled" ? entry.Filled : entry.Icon;
                        return (
                          <tr key={name} data-selected={name === icon.name ? "" : undefined}>
                            <td className="area-table__cell--fit"><span className="studio-icons__glyph" data-icon={name}><Glyph size={size} aria-hidden="true" /></span></td>
                            <td><TableLink href={`#icons/${section.slug}`} onClick={event => { event.preventDefault(); choose(name); }}><code className="studio-mono">{name}</code></TableLink></td>
                            <td><span className="studio-muted">{entry.keyline}</span></td>
                            <td><span className="studio-muted">{statusOf(name) === "approved" ? "Approved" : statusOf(name) === "review" ? "In review" : "—"}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </ListFrame>
              ) : view ? (
                // One category, grid: every icon its own unit tile, named, at the chosen size.
                <TileGrid span="unit">
                  {section.shown.map(name => {
                    const entry = BY_NAME.get(name);
                    if (!entry) return null;
                    const Glyph = style === "filled" ? entry.Filled : entry.Icon;
                    return (
                      <Tile key={name} span="unit" stage="center" pressable label={name} aria-label={titleCase(name)}
                        selected={name === icon.name} onSelect={() => choose(name)}>
                        <Glyph size={size} aria-hidden="true" data-icon={name} />
                      </Tile>
                    );
                  })}
                </TileGrid>
              ) : (
                // All, grid: the category's sheet is the container, label-free cells (Lucide, Primer);
                // names on hover and in the Inspector.
                <div className="studio-icons__sheet">
                  {section.shown.map(name => {
                    const entry = BY_NAME.get(name);
                    if (!entry) return null;
                    const Glyph = style === "filled" ? entry.Filled : entry.Icon;
                    return (
                      <button key={name} type="button" className="studio-icons__cell" data-icon={name} aria-pressed={name === icon.name}
                        aria-label={titleCase(name)} title={name} onClick={() => choose(name)}>
                        <Glyph size={size} aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>
              )}
            </CanvasSection>
          ))}
        </div>
      ) : <EmptyState title="No icons" description={`Nothing matches “${query}”.`} />}
      inspectorTitle={titleCase(icon.name)}
      inspector={
        <>
          <CanvasSettings axes={["ui"]} />
          <PanelSection>
            <div className="studio-icon-preview" ref={preview}><Draw size={PREVIEW} aria-hidden="true" /></div>
            <CopyButton label="Copy SVG" icon={<PilotCopyIcon />} fullWidth copy={() => navigator.clipboard.writeText(svg())} />
          </PanelSection>
          <PanelSection heading="Display">
            <Field label="Style" orientation="horizontal">
              <Segmented size="sm" fullWidth value={style} onValueChange={value => setStyle(value as Mode)}
                items={[{ value: "outline", label: "Outline" }, { value: "filled", label: "Filled" }]} />
            </Field>
            <Field label={`Size · ${size}`} orientation="horizontal">
              <Slider size="sm" min={SIZE.min} max={SIZE.max} step={4} value={size} aria-label="Icon size"
                onChange={event => setSize(Number(event.currentTarget.value))} />
            </Field>
          </PanelSection>
          <PanelSection heading="Icon">
            <Facts label="Icon" items={[
              ["Name", <code className="studio-mono">{icon.name}</code>],
              category ? ["Category", category.name] : null,
              icon.derivedFrom ? ["From", icon.derivedFrom] : null,
              ["Keyline", icon.keyline],
              iconStatus ? ["Status", iconStatus.status === "approved" ? "Approved" : "In review"] : null,
              iconStatus ? ["Batch", iconStatus.batch] : null,
            ]} />
          </PanelSection>
        </>
      }
    />
  );
}
