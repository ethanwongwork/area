/**
 * Components: All and every family in the Sidebar; the Canvas shows every family's tiles (All) or
 * one family's; the Inspector holds the canvas settings and the selected tile, family or library.
 *
 * The tiles are the docs gallery's own (apps/docs/src/gallery/specimens.mjs) rendered from the
 * same demos (apps/docs/src/registry.tsx), labelled and ordered the same way, and fitted by the
 * same code (apps/docs/src/gallery/fit.ts).
 */
import { Component, createElement, useEffect, useRef, useState, type ReactNode } from "react";
import { Badge, Count, EmptyState, Nav, NavGroup, NavItem, PanelSection, Table, TableLink } from "@area/react";
// @ts-expect-error — the gallery's page content and status registry are authored in JavaScript.
import { COMPONENT_PAGES } from "../../../docs/src/pages.mjs";
// @ts-expect-error — as above.
import { componentStatus } from "../../../docs/src/component-status.mjs";
// @ts-expect-error — as above.
import { componentSpecimens, demoWrapper } from "../../../docs/src/gallery/specimens.mjs";
// @ts-expect-error — as above.
import { SPECIMEN_GROUPS, specimenGroup, specimenLabel, specimenName } from "../../../docs/scripts/specimen-names.mjs";
import { DEMOS } from "../../../docs/src/registry.tsx";
import { fitTiles } from "../../../docs/src/gallery/fit.ts";
import { CanvasSettings } from "../canvas-settings.tsx";
import { Facts, PropsTable } from "../facts.tsx";
import { ListFrame, Tile, TileGrid } from "../tile.tsx";
import { useViewOption, ViewControls, ViewFilter, ViewSwitch, type ViewMode } from "../view-controls.tsx";
import { SidebarAll, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { matches } from "../search.ts";

interface Example { id: string; title: string; demo: string; note?: string; group?: string }
interface Family { slug: string; name: string; docsOnly?: boolean; imports?: string; exportName?: string; api?: string[][]; examples: Example[] }
interface Tile { id: string; label: string; demo: string; note?: string }

const FAMILIES = (COMPONENT_PAGES as Family[]).filter(family => !family.docsOnly).sort((a, b) => a.name.localeCompare(b.name));
const STATUS_LABEL = { complete: "Complete", review: "In review", unrefined: "Unrefined" } as const;
const STATUS_TONE = { complete: "success", review: "caution", unrefined: "neutral" } as const;
type Status = keyof typeof STATUS_LABEL;

/* A family's tiles, labelled group / value and in group order, as component-gallery.mjs does. */
function tilesOf(family: Family): Tile[] {
  const specimens = componentSpecimens(family, (name: string) => name in DEMOS) as Example[];
  const hasDefault = specimens.some(example => specimenName(example, family.slug) === "default");
  const notes = new Map(family.examples.map(example => [example.demo, example.note]));
  return specimens.map((example, index) => {
    const name = specimenName(example, family.slug);
    const group = !hasDefault && index === 0 ? "Default" : (example.group ?? specimenGroup(name, family.slug));
    const value = group === "Default" && !hasDefault ? name : specimenLabel(name, group);
    return { order: SPECIMEN_GROUPS.indexOf(group), tile: { id: example.id, label: group === "Default" ? value : `${group} / ${value}`, demo: example.demo, note: example.note ?? notes.get(example.demo) } };
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

function FamilyTiles({ family, selected, onSelect }: { family: Family; selected?: string; onSelect: (id: string) => void }) {
  const tiles = TILES.get(family.slug)!;
  if (!tiles.length) return <EmptyState title="No tiles yet" description="This family has no gallery specimens." />;
  return (
    <TileGrid span="wide">
      {tiles.map(entry => {
        const key = `${family.slug}/${entry.id}`;
        return (
          <Tile key={key} span="wide" stage="fit" label={entry.label} aria-label={`${family.name}: ${entry.label}`}
            selected={key === selected} onSelect={() => onSelect(key)}>
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
function FamilySection({ family, selected, onSelect, onOpen }: { family: Family; selected?: string; onSelect: (key: string) => void; onOpen: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || near) return;
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) setNear(true); }, { rootMargin: "100% 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [near]);
  useFit(ref, near, near);
  const rows = Math.ceil(TILES.get(family.slug)!.length / 3);
  return (
    <section ref={ref} className="studio-section" aria-labelledby={`family-${family.slug}`} data-fit="">
      <h2 className="studio-canvas__section-title" id={`family-${family.slug}`} data-area-ui="compact">
        <a href={`#components/${family.slug}`} className="studio-section__link" onClick={event => { event.preventDefault(); onOpen(); }}>{family.name}</a>
      </h2>
      {near ? <FamilyTiles family={family} selected={selected} onSelect={onSelect} /> : <div style={{ blockSize: `${rows * 256}px` }} />}
    </section>
  );
}

export function ComponentsPage() {
  const { query, item, select } = useStudio();
  // The Sidebar's choice: every family (All, the default) or one.
  const family = FAMILIES.find(entry => entry.slug === item);
  const shown = FAMILIES.filter(entry => matches(query, entry.name, entry.slug));
  const [mode, setMode] = useViewOption<ViewMode>("components", "grid", ["grid", "list"]);
  const [status, setStatus] = useViewOption<"all" | Status>("components-status", "all", ["all", "complete", "review", "unrefined"]);
  const onCanvas = family ? [family] : shown.filter(entry => status === "all" || statusOf(entry) === status);
  // The Inspector's: one tile, as "<family>/<tile id>".
  const [selected, setSelected] = useState<string>();
  useEffect(() => setSelected(undefined), [item]);
  const [selectedSlug, selectedId] = selected?.split("/") ?? [];
  const selectedFamily = FAMILIES.find(entry => entry.slug === selectedSlug);
  const tile = selectedFamily ? TILES.get(selectedFamily.slug)!.find(entry => entry.id === selectedId) : undefined;
  const subject = selectedFamily ?? family;

  const groups: Array<[string, Family[]]> = [
    ["In review", shown.filter(entry => statusOf(entry) === "review")],
    ["Components", shown.filter(entry => statusOf(entry) !== "review")],
  ];

  // One family fits as a whole Canvas; All fits section by section (FamilySection).
  const canvas = useRef<HTMLDivElement>(null);
  const single = useRef<HTMLDivElement>(null);
  useEffect(() => { canvas.current?.scrollTo({ top: 0 }); }, [item]);
  useFit(single, family?.slug, Boolean(family));

  const counts = { complete: 0, review: 0, unrefined: 0 };
  for (const entry of FAMILIES) counts[statusOf(entry)]++;
  const total = FAMILIES.reduce((sum, entry) => sum + TILES.get(entry.slug)!.length, 0);

  return (
    <Workspace
      sidebar={
        <SidebarList>
          <Nav aria-label="Components">
            <SidebarAll tab="components" count={shown.length} current={!family} />
            {groups.filter(([, list]) => list.length).map(([label, list]) => (
              <NavGroup key={label} label={label}>
                {list.map(entry => (
                  <NavItem key={entry.slug} href={`#components/${entry.slug}`} current={entry.slug === family?.slug}
                    onClick={event => { event.preventDefault(); select(entry.slug); }}
                    trailing={<Count count={TILES.get(entry.slug)!.length} />}>
                    {entry.name}
                  </NavItem>
                ))}
              </NavGroup>
            ))}
          </Nav>
        </SidebarList>
      }
      canvasTitle={family ? family.name : "All components"}
      canvasMeta={family
        ? <Badge tone={STATUS_TONE[statusOf(family)]} variant="soft">{STATUS_LABEL[statusOf(family)]}</Badge>
        : <span className="studio-muted studio-tabular">{onCanvas.length}</span>}
      canvasActions={
        <ViewControls>
          {family ? null : (
            <ViewFilter label="Status" value={status} onChange={setStatus}
              options={[{ value: "all", label: "All statuses" }, { value: "complete", label: "Complete" }, { value: "review", label: "In review" }, { value: "unrefined", label: "Unrefined" }]} />
          )}
          <ViewSwitch value={mode} onChange={setMode} />
        </ViewControls>
      }
      canvasRef={canvas}
      canvas={family ? (
        <div className="studio-sections">
          {mode === "list" ? (
            // List: one row per tile, its demo and note.
            <ListFrame>
              <Table size="md" interactive aria-label={`${family.name} tiles`}>
                <thead><tr><th scope="col">Specimen</th><th scope="col">Demo</th><th scope="col">Note</th></tr></thead>
                <tbody>
                  {TILES.get(family.slug)!.map(entry => {
                    const key = `${family.slug}/${entry.id}`;
                    return (
                      <tr key={key} data-selected={key === selected ? "" : undefined}>
                        <td><TableLink href={`#components/${family.slug}`} onClick={event => { event.preventDefault(); setSelected(key); }}>{entry.label}</TableLink></td>
                        <td><code className="studio-mono">{entry.demo}</code></td>
                        <td><span className="studio-muted">{entry.note ?? "—"}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </ListFrame>
          ) : <div ref={single} data-fit=""><FamilyTiles family={family} selected={selected} onSelect={setSelected} /></div>}
          {/* Props under the tiles, at full width (owner, 2026-10-11; they were cramped in the Inspector).
              Documentation, not a specimen: it keeps the app's compact scale and default radius whatever
              the Canvas previews. */}
          {family.api?.length ? (
            <section className="studio-section" aria-labelledby="family-props" data-area-ui="compact">
              <h2 className="studio-canvas__section-title" id="family-props">Props</h2>
              <ListFrame><PropsTable api={family.api} /></ListFrame>
            </section>
          ) : null}
        </div>
      ) : onCanvas.length ? mode === "list" ? (
        // List: one row per family, its status, tile count and import.
        <ListFrame>
          <Table size="md" interactive aria-label="Components">
            <thead><tr><th scope="col">Family</th><th scope="col">Status</th><th scope="col">Tiles</th><th scope="col">Import</th></tr></thead>
            <tbody>
              {onCanvas.map(entry => (
                <tr key={entry.slug}>
                  <td><TableLink href={`#components/${entry.slug}`} onClick={event => { event.preventDefault(); select(entry.slug); }}>{entry.name}</TableLink></td>
                  <td><Badge tone={STATUS_TONE[statusOf(entry)]} variant="soft">{STATUS_LABEL[statusOf(entry)]}</Badge></td>
                  <td className="area-table__cell--numeric">{TILES.get(entry.slug)!.length}</td>
                  <td>{entry.imports ?? entry.exportName ? <code className="studio-mono">{entry.imports ?? entry.exportName}</code> : <span className="studio-muted">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ListFrame>
      ) : (
        <div className="studio-sections">
          {onCanvas.map(entry => <FamilySection key={entry.slug} family={entry} selected={selected} onSelect={setSelected} onOpen={() => select(entry.slug)} />)}
        </div>
      ) : <EmptyState title="No components" description={`Nothing matches “${query}”.`} />}
      inspectorTitle={tile?.label ?? subject?.name ?? "All components"}
      inspector={
        <>
          <CanvasSettings />
          {subject ? (
            <PanelSection heading={tile ? "Tile" : "Family"}>
              <Facts label={tile ? "Tile" : "Family"} items={tile ? [
                ["Family", subject.name],
                ["Specimen", tile.label],
                ["Demo", <code className="studio-mono">{tile.demo}</code>],
                tile.note ? ["Note", tile.note] : null,
              ] : [
                ["Status", STATUS_LABEL[statusOf(subject)]],
                ["Tiles", TILES.get(subject.slug)!.length],
                subject.imports ?? subject.exportName ? ["Import", <code className="studio-mono">{subject.imports ?? subject.exportName}</code>] : null,
              ]} />
            </PanelSection>
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
      }
    />
  );
}
