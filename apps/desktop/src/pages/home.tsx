/**
 * Home (docs/research/app-structure-2026-10-28/README.md, Phase 2): the workspace at a glance, in the fixed first tab
 * (Figma's file browser). Its feed: the systems, each drawn as Setup's product screen in its chosen theme; New system, three
 * ways (a fork of the Area Starter's values, an import, which is a stub until import exists, or describing it in the
 * Setup chat); the Library's boards; and the places visited lately. A system, a board or a place opens in the tab already
 * on it, else a new tab (src/studio.tsx `navigate`).
 *
 * Location: #home, #home/<system> for a chosen system, #home/new for New system's dialog.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { AssetGrid, AssetGridItem, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardLink, CardTitle, ConfirmDialog, Dialog, EmptyState, Field, Input, PanelSection, Radio, RadioGroup, Table, TableCell, TableHeaderCell, TableLink } from "@area/react";
import { AddIcon } from "@area/icons";
import { canvasAttributes, useStudio, Workspace, type Visit } from "../studio.tsx";
import { CanvasSection, CARD_SCOPE, Tile, TileGrid } from "../tile.tsx";
import { ViewControls } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { ScreenFigure } from "../setup-screen.tsx";
import { hasColours } from "../colours.ts";
import { activeTheme, ORIGIN_LABEL, type System, type SystemOrigin } from "../systems.ts";
import { systemName, hrefOf, resolve, tabKind, type Place } from "../places.ts";
import { placeLabel } from "../app-nav.tsx";
import { readStored } from "../storage.ts";
import { url, useLibrary } from "./imagery.tsx";

/** A system card is the feed's 300 card, wide enough to read the screen in it (PRODUCT_UI.md, the Canvas feed), as Themes'. */
const SYSTEM_MIN = 300; /* pick */
/** A board is a Library group's card at Imagery's medium size. */
const BOARD_SIZE = 192; /* pick: imagery.tsx SIZES.medium */
/** Recent shows the last few places, as Figma's Recents and Cursor's recent projects do. */
const RECENT = 8; /* pick */

/** The three ways to start a system, in the order Home offers them. Import waits for import itself. */
const WAYS: ReadonlyArray<{ origin: Exclude<SystemOrigin, "area">; title: string; description: string; later?: boolean }> = [
  { origin: "starter", title: "From the Area Starter", description: "Area's own values, to change from there." },
  { origin: "described", title: "Describe it", description: "Answer a few questions in a chat; the theme follows." },
  { origin: "import", title: "Import", description: "From Figma, a site or a codebase. Not built yet.", later: true },
];

/** How long ago, in the words a file browser uses ("Just now", "5 min ago", "3 days ago"). */
function ago(at: number, now: number): string {
  const minutes = Math.round((now - at) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

/** A place's name for Recent: where it is (the system, the Library) and what (its section, the item). */
function visitLabel(place: Place): string {
  const where = tabKind(place) === "system" ? systemName(place.system) : null;
  return [where, placeLabel(place), place.item?.split("/").at(-1)].filter(Boolean).join(" › ");
}

export function HomePage() {
  const { item, select, navigate, systems, openSystem, theme, brand: accent, shown, createSystem, renameSystem, deleteSystem } = useStudio();
  const { library } = useLibrary();
  const chosen = systems.find(entry => entry.id === item) ?? null;
  // New system's dialog: opened by a way's card, the Canvas bar or the nav's New system row (#home/new).
  const [making, setMaking] = useState<Exclude<SystemOrigin, "area"> | null>(item === "new" ? "starter" : null);
  useEffect(() => { if (item === "new") { setMaking(way => way ?? "starter"); select("", { replace: true }); } }, [item]);
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  // Read when Home opens: the places visited since, newest first.
  const [visits] = useState(() => {
    const saved = readStored<Visit[]>("recent", []);
    return (Array.isArray(saved) ? saved : []).flatMap(visit => {
      // A visit from before systems (#brand/…) reads as where its link now goes.
      const place = visit && typeof visit.hash === "string" ? resolve(visit.hash) : null;
      return place && place.page !== "home" ? [{ place, at: Number(visit.at) || 0 }] : [];
    }).slice(0, RECENT);
  });
  const now = useMemo(() => Date.now(), []);

  const open = (target: System) => navigate({ page: "themes", system: target.id });
  const make = (name: string, origin: Exclude<SystemOrigin, "area">) => {
    const made = createSystem(name, origin);
    setMaking(null);
    // A described system opens on its first theme's Setup chat; one from the Starter on its Themes.
    navigate({ page: origin === "described" ? "theme-setup" : "themes", system: made.id });
  };
  // A system card draws its chosen theme's settings and Material. Exact colours are one rule in the document's head for the
  // open system alone (src/colours.ts, src/brand.ts), so only its card shows them.
  const scopeOf = (entry: System) => {
    const own = activeTheme(entry);
    const open = entry.id === openSystem.id;
    return { ...canvasAttributes(open ? shown.canvas : own.canvas, open ? shown.material : own.material),
      ...(open && hasColours(shown.colours) ? { "data-area-colours": "" } : {}), ...(open && accent.on ? { "data-area-brand": "" } : {}), "data-area-theme": theme };
  };
  const boards = library?.folders ?? [];
  const firstOf = (folder: string) => (library?.items ?? []).filter(entry => entry.folder === folder).slice(0, 4).map(entry => url(entry.thumb));

  return (
    <Workspace
      canvasTitle="Home"
      canvasActions={
        <ViewControls>
          <Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />} onClick={() => setMaking("starter")}>New system</Button>
        </ViewControls>
      }
      canvas={<>
        <div className="studio-sections">
          <CanvasSection id="home-systems" title="Systems" count={systems.length} lede="Each system is the look and the rules a product is built with: its themes, and Area's parts drawn in the one it uses.">
            <TileGrid span="wide" cards min={SYSTEM_MIN}>
              {systems.map(entry => (
                <Tile key={entry.id} span="wide" stage="fit" inert label={entry.name} value={`${entry.themes.length} ${entry.themes.length === 1 ? "theme" : "themes"} · ${activeTheme(entry).name}`}
                  selected={chosen?.id === entry.id} onSelect={() => select(entry.id, { replace: true })} onOpen={() => open(entry)}>
                  <ScreenFigure className="studio-theme-card" scope={scopeOf(entry)} />
                </Tile>
              ))}
            </TileGrid>
          </CanvasSection>
          <CanvasSection id="home-new" title="New system" lede="Start from Area's values, describe the system in a chat, or import it.">
            <TileGrid span="unit" cards>
              {WAYS.map(way => (
                <Card key={way.origin}>
                  <CardContent>
                    <CardHeader action={way.later ? <Badge size="sm" variant="soft" tone="neutral">Later</Badge> : undefined}>
                      <CardTitle>{way.later ? way.title : <CardLink href="#home/new" onClick={event => { event.preventDefault(); setMaking(way.origin); }}>{way.title}</CardLink>}</CardTitle>
                      <CardDescription>{way.description}</CardDescription>
                    </CardHeader>
                  </CardContent>
                </Card>
              ))}
            </TileGrid>
          </CanvasSection>
          <CanvasSection id="home-boards" title="Boards" count={boards.length}>
            {boards.length ? (
              <AssetGrid aria-label="Boards" onOpen={id => navigate({ page: "library", item: id })} {...CARD_SCOPE}
                style={{ "--area-asset-card-size": `${BOARD_SIZE}px` } as CSSProperties}>
                {boards.map(entry => <AssetGridItem key={entry.id} value={entry.id} name={entry.name} container="framed" caption="below" aspect="landscape" group={firstOf(entry.id)} />)}
              </AssetGrid>
            ) : (
              <EmptyState title="No boards yet" description="The Library's groups appear here as boards. Open the Library to see what it holds."
                actions={<Button size="sm" variant="soft" tone="neutral" onClick={() => navigate({ page: "library" })}>Open the Library</Button>} />
            )}
          </CanvasSection>
          <CanvasSection id="home-recent" title="Recent" count={visits.length}>
            {visits.length ? (
              <Table aria-label="Recent places">
                <thead><tr><TableHeaderCell>Place</TableHeaderCell><TableHeaderCell fit>Opened</TableHeaderCell></tr></thead>
                <tbody>
                  {visits.map(({ place, at }) => (
                    <tr key={`${place.page}:${place.system ?? ""}:${place.group ?? ""}:${place.item ?? ""}`}>
                      <TableCell><TableLink href={hrefOf(place)} onClick={event => { event.preventDefault(); navigate(place, { newTab: event.metaKey || event.ctrlKey }); }}>{visitLabel(place)}</TableLink></TableCell>
                      <TableCell fit className="studio-muted">{ago(at, now)}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : <EmptyState title="Nothing opened yet" description="The places you open, a system's components or a Library board, appear here." />}
          </CanvasSection>
        </div>
        {making ? <NewSystem origin={making} onOriginChange={setMaking} onCancel={() => setMaking(null)} onCreate={make} /> : null}
          {chosen && renaming ? <NameDialog title="Rename system" action="Rename" initial={chosen.name} onCancel={() => setRenaming(false)} onDone={name => { renameSystem(chosen.id, name); setRenaming(false); }} /> : null}
          {chosen && deleting ? (
            <ConfirmDialog open title={`Delete ${chosen.name}?`} tone="danger" confirmLabel="Delete system"
              description="Its folder moves to the Trash, where it can be put back; its tabs close."
              onOpenChange={next => { if (!next) setDeleting(false); }} onConfirm={() => { deleteSystem(chosen.id); setDeleting(false); select("", { replace: true }); }} />
          ) : null}
        </>
      }
      inspector={{
        design: chosen ? (<>
          <PanelSection>
            <div className="studio-inspector-actions">
              <Button size="sm" variant="soft" tone="neutral" onClick={() => open(chosen)}>Open</Button>
              <Button size="sm" variant="soft" tone="neutral" onClick={() => setRenaming(true)}>Rename</Button>
              {/* The Area system holds the old links and the settings from before systems, so it stays. */}
              {chosen.origin !== "area" ? <Button size="sm" variant="soft" tone="danger" onClick={() => setDeleting(true)}>Delete</Button> : null}
            </div>
          </PanelSection>
          <PanelSection heading={chosen.name}>
            <Facts label="System" items={[
              ["Themes", chosen.themes.length],
              ["Uses", activeTheme(chosen).name],
              ["Began from", ORIGIN_LABEL[chosen.origin]],
              ["Made", new Date(chosen.created).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })],
              ["Saved in", `Systems/${chosen.id}/system.json`],
            ]} />
          </PanelSection>
        </>) : (
          <PanelSection heading="Home">
            <Facts label="Workspace" items={[
              ["Systems", systems.length],
              ["Boards", boards.length],
              ["Open system", openSystem.name],
            ]} />
          </PanelSection>
        ),
      }}
    />
  );
}

/** New system's dialog: how it starts (Import stays a stub) and its name. */
function NewSystem({ origin, onOriginChange, onCancel, onCreate }: {
  origin: Exclude<SystemOrigin, "area">; onOriginChange: (origin: Exclude<SystemOrigin, "area">) => void; onCancel: () => void; onCreate: (name: string, origin: Exclude<SystemOrigin, "area">) => void;
}) {
  const [name, setName] = useState("");
  const field = useNameFocus();
  const submit = (event?: FormEvent) => { event?.preventDefault(); onCreate(name.trim() || "Untitled system", origin); };
  return (
    <Dialog open onOpenChange={next => { if (!next) onCancel(); }} title="New system" description="A system is the look and the rules a product is built with."
      footer={<><Button variant="ghost" tone="neutral" onClick={onCancel}>Cancel</Button><Button onClick={() => submit()}>{origin === "described" ? "Create and describe" : "Create system"}</Button></>}>
      <form className="studio-home__form" onSubmit={submit}>
        <Field label="Name"><Input ref={field} fullWidth placeholder="Untitled system" value={name} onChange={event => setName(event.target.value)} /></Field>
        <RadioGroup label="Start" value={origin} onValueChange={value => onOriginChange(value as Exclude<SystemOrigin, "area">)}>
          {WAYS.map(way => <Radio key={way.origin} variant="card" value={way.origin} label={way.title} description={way.description} disabled={way.later} />)}
        </RadioGroup>
      </form>
    </Dialog>
  );
}

/**
 * The name field takes focus once its dialog is open, its text chosen to retype. Dialog opens its modal in an effect, which
 * focuses the close; this effect, its parent's, runs after it.
 */
function useNameFocus(select = false) {
  const field = useRef<HTMLInputElement>(null);
  useEffect(() => { field.current?.focus(); if (select) field.current?.select(); }, []);
  return field;
}

/** A name to type, for renaming. */
function NameDialog({ title, action, initial, onCancel, onDone }: { title: string; action: string; initial: string; onCancel: () => void; onDone: (name: string) => void }) {
  const [name, setName] = useState(initial);
  const field = useNameFocus(true);
  const submit = (event?: FormEvent) => { event?.preventDefault(); if (name.trim()) onDone(name.trim()); };
  return (
    <Dialog open onOpenChange={next => { if (!next) onCancel(); }} title={title}
      footer={<><Button variant="ghost" tone="neutral" onClick={onCancel}>Cancel</Button><Button disabled={!name.trim()} onClick={() => submit()}>{action}</Button></>}>
      <form className="studio-home__form" onSubmit={submit}>
        <Field label="Name"><Input ref={field} fullWidth value={name} onChange={event => setName(event.target.value)} /></Field>
      </form>
    </Dialog>
  );
}
