/**
 * Home (docs/research/app-structure-2026-10-28/README.md, Phase 2; a single-column feed since 2026-10-31, owner: "i do like
 * the general name or concept of home, but just want things to be displayed as almost like a single column feed … a feed
 * of things, updates, notifications, launches, new published work, new projects"), in the fixed first tab. The Sidebar
 * already lists the projects and systems, so Home is what happened: Continue (the last few places), then Latest, a
 * Timeline newest first: changes waiting to publish, each system's publishes (its release notes, drawn as the theme they
 * published), projects started, versions saved, references saved. A system's or project's picture selects it for the
 * Inspector (Open, Rename, Delete) and opens it on a double-click; its title opens it. Notifications from other people
 * and launches by people you follow join the same Timeline when sharing exists.
 *
 * Location: #home, #home/<system or project> for a chosen one, #home/new for New system's dialog, #home/new-project for
 * New project's.
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { AssetGrid, AssetGridItem, Button, ConfirmDialog, Dialog, EmptyState, Field, Input, Link, PanelSection, Radio, RadioGroup, Select, Table, TableCell, TableHeaderCell, TableLink, Timeline, TimelineItem } from "@area/react";
import { AddIcon, BookmarkIcon, CircleDashedIcon, FolderIcon, HistoryIcon, ShapesIcon, TagIcon } from "@area/icons";
import { canvasAttributes, useStudio, Workspace, type Visit } from "../studio.tsx";
import { CanvasSection, CARD_SCOPE, COLLECTION_ROW, COLLECTION_STRIP, collectionName, Tile, TileGrid, FEED_TABLE, type ProjectStatus } from "../tile.tsx";
import { ViewControls } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { SHOWCASE, ScreenFigure } from "../setup-screen.tsx";
import { activeTheme, asLive, liveOf, ORIGIN_LABEL, RELEASE_KIND_LABEL, versionName, type Release, type System, type SystemOrigin } from "../systems.ts";
import type { Project, ProjectVersion } from "../projects.ts";
import { ThemeScreen } from "../publish.tsx";
import { projectName, systemName, hrefOf, resolve, tabKind, type Place } from "../places.ts";
import { placeLabel } from "../app-nav.tsx";
import { readStored } from "../storage.ts";
import { url, useLibrary } from "./imagery.tsx";
import { FAMILIES } from "./components.tsx";
import { EXAMPLES } from "./examples.tsx";
import { SETTINGS } from "./theme-settings.ts";
import { TYPE_ROLES } from "../tokens.ts";
import { categories as ICON_CATEGORIES } from "@area/icons/meta";

/** A picture in the feed fills the column: one card a row (the 768 reading column holds no two at this minimum). */
const FEED_CARD_MIN = 480; /* pick */
/** Continue shows the last few places, as Notion's Home "Recently visited" and Cursor's recent projects do. */
const RECENT = 4; /* pick */
/** Saved references show their first collections; References holds the rest. */
const SAVED_SHOWN = 6; /* pick */

/** What happened, for the feed: each from the workspace's own records, never made up. */
type HomeEvent =
  | { kind: "release"; at: number; system: System; release: Release }
  | { kind: "project"; at: number; project: Project }
  | { kind: "version"; at: number; project: Project; version: ProjectVersion }
  | { kind: "saved"; at: number };

/** The three ways to start a system, in the order Home offers them. Import waits for import itself. */
const WAYS: ReadonlyArray<{ origin: Exclude<SystemOrigin, "area">; title: string; description: string; later?: boolean }> = [
  { origin: "starter", title: "From the Area Starter", description: "Area's own values, to change from there." },
  { origin: "described", title: "Describe it", description: "Answer a few questions in a chat; the theme follows." },
  { origin: "import", title: "Import", description: "From Figma, a site or a codebase. Not built yet.", later: true },
];

/** How long ago, in the words a file browser uses ("Just now", "5 min ago", "3 days ago"); past a week, the date. */
function ago(at: number, now: number): string {
  const minutes = Math.round((now - at) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return days === 1 ? "Yesterday" : `${days} days ago`;
  return new Date(at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: new Date(at).getFullYear() === new Date(now).getFullYear() ? undefined : "numeric" });
}
const plural = (count: number, one: string, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;

/** What a place has chosen, by its name where the app has one ("state-selected" → "Selected state"), else its id in words. */
function itemLabel(place: Place): string | undefined {
  const id = place.item?.split("/")[0];
  if (!id) return undefined;
  const named = place.page === "components" ? FAMILIES.find(family => family.slug === id)?.name
    : place.page === "patterns" || place.page === "tests" ? EXAMPLES.find(example => example.id === id)?.label
    : place.page === "settings" ? SETTINGS.find(setting => setting.id === id)?.title
    : place.page === "typography" ? TYPE_ROLES.find(role => role.id === id)?.name
    : place.page === "icons" ? ICON_CATEGORIES.find(category => category.slug === id)?.name
    : undefined;
  return named ?? id.replace(/-/g, " ").replace(/^./, letter => letter.toUpperCase());
}

/** A place's name for Recent: where it is (the system, the Library) and what (its section, the item). */
function visitLabel(place: Place): string {
  const where = tabKind(place) === "system" ? systemName(place.system) : tabKind(place) === "project" ? projectName(place.project) : null;
  return [where, placeLabel(place), itemLabel(place)].filter(Boolean).join(" › ");
}

export function HomePage() {
  const { item, select, navigate, systems, projects, openSystem, theme, changes, createSystem, renameSystem, deleteSystem, createProject } = useStudio();
  const { library } = useLibrary();
  const chosen = systems.find(entry => entry.id === item) ?? null;
  const chosenProject = projects.find(entry => entry.id === item) ?? null;
  // New project's dialog: opened by the Canvas bar, the Projects section or the nav's New project row (#home/new-project).
  const [starting, setStarting] = useState(item === "new-project");
  useEffect(() => { if (item === "new-project") { setStarting(true); select("", { replace: true }); } }, [item]);
  const start = (name: string, system: string, themeId: string) => {
    const made = createProject(name, system, themeId);
    setStarting(false);
    navigate({ page: "project", project: made.id });
  };
  // A project's card draws the theme it uses, as its system publishes it.
  const projectScope = (entry: Project) => {
    const system = systems.find(other => other.id === entry.system);
    const used = system ? asLive(system).themes.find(other => other.id === entry.theme) ?? activeTheme(asLive(system)) : null;
    return used ? { ...canvasAttributes(used.canvas, used.material), "data-area-theme": theme } : { "data-area-theme": theme };
  };
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
  const boards = library?.folders ?? [];
  const inFolder = (folder: string) => (library?.items ?? []).filter(entry => entry.folder === folder);

  // Everything that happened, newest first: each system's publishes (its first is when it began), each project's start and
  // saved versions, and the references saved.
  const events = useMemo(() => {
    const list: HomeEvent[] = [
      ...systems.flatMap(system => system.releases.map(release => ({ kind: "release" as const, at: Date.parse(release.at), system, release }))),
      ...projects.flatMap(project => [
        { kind: "project" as const, at: Date.parse(project.created), project },
        ...project.versions.map(version => ({ kind: "version" as const, at: Date.parse(version.at), project, version })),
      ]),
      ...(library?.items.length ? [{ kind: "saved" as const, at: Date.parse(library.fetched) }] : []),
    ];
    return list.filter(event => Number.isFinite(event.at)).sort((a, b) => b.at - a.at);
  }, [systems, projects, library]);
  const eventKey = (event: HomeEvent) => event.kind === "release" ? `release:${event.system.id}:${event.release.version}`
    : event.kind === "project" ? `project:${event.project.id}` : event.kind === "version" ? `version:${event.project.id}:${event.version.id}` : "saved";
  // A title that opens what it names, in the tab holding it (⌘-click: a new one).
  const opener = (target: Place, label: string) => (
    <Link href={hrefOf(target)} onClick={event => { event.preventDefault(); navigate(target, { newTab: event.metaKey || event.ctrlKey }); }}>{label}</Link>
  );
  // One picture, the column's width: selecting it shows it in the Inspector, a double-click opens it.
  const picture = (key: string, label: string, value: string, selected: boolean, onSelect: () => void, onOpen: () => void, figure: ReactNode, status?: ProjectStatus) => (
    <TileGrid key={key} span="wide" cards min={FEED_CARD_MIN}>
      <Tile span="wide" stage="screen" inert label={label} value={value} status={status} selected={selected} onSelect={onSelect} onOpen={onOpen}>{figure}</Tile>
    </TileGrid>
  );
  const feedEvent = (event: HomeEvent) => {
    const key = eventKey(event);
    const time = ago(event.at, now);
    const dateTime = new Date(event.at).toISOString();
    if (event.kind === "release") {
      const { system, release } = event;
      const first = release.kind === "first";
      const published = release.themes.find(entry => entry.id === release.theme) ?? release.themes[0]!;
      const from = release.from ? projects.find(entry => entry.id === release.from)?.name : undefined;
      return (
        <TimelineItem key={key} icon={first ? <ShapesIcon /> : <TagIcon />} time={time} dateTime={dateTime}
          title={first ? <>{opener({ page: "themes", system: system.id }, system.name)} began</> : <>{opener({ page: "history", system: system.id, item: release.version }, versionName(system.name, release.version))} published</>}
          meta={first ? ORIGIN_LABEL[system.origin] : [RELEASE_KIND_LABEL[release.kind], from ? `from ${from}` : null].filter(Boolean).join(", ")}>
          <div className="studio-home__event">
            {release.note && !first ? <p className="studio-home__note">{release.note}</p> : null}
            {picture(`release:${system.id}:${release.version}`, published.name, versionName(system.name, release.version), chosen?.id === system.id,
              () => select(system.id, { replace: true }), () => open(system), <ThemeScreen theme={published} mode={theme} />, "published")}
          </div>
        </TimelineItem>
      );
    }
    if (event.kind === "project") {
      const { project } = event;
      return (
        <TimelineItem key={key} icon={<FolderIcon />} time={time} dateTime={dateTime} meta={`Uses ${systemName(project.system)}`}
          title={<>{opener({ page: "project", project: project.id }, project.name)} started</>}>
          {picture(`project:${project.id}`, project.name, `${systemName(project.system)}, ${plural(project.pages.length, "page")}`, chosenProject?.id === project.id,
            () => select(project.id, { replace: true }), () => navigate({ page: "project", project: project.id }),
            <ScreenFigure className="studio-theme-card" hold={SHOWCASE} scope={projectScope(project)} />)}
        </TimelineItem>
      );
    }
    if (event.kind === "version") return (
      <TimelineItem key={key} icon={<HistoryIcon />} time={time} dateTime={dateTime} meta={event.project.name}
        title={<>{opener({ page: "versions", project: event.project.id }, event.version.name)} saved</>} />
    );
    return (
      <TimelineItem key={key} icon={<BookmarkIcon />} time={time} dateTime={dateTime} meta={plural(boards.length, "collection")}
        title={<>{opener({ page: "references" }, `${plural(library?.items.length ?? 0, "reference")} saved`)}</>}>
        {/* The collection card across the column: a row of its images that scrolls sideways (tile.tsx COLLECTION_STRIP). */}
        <AssetGrid aria-label="Collections" onOpen={id => navigate({ page: "references", item: id })} className="studio-images" {...CARD_SCOPE}
          style={{ "--area-asset-card-size": "100%", "--area-asset-card-strip-height": `${COLLECTION_ROW}px` } as CSSProperties}>
          {boards.slice(0, SAVED_SHOWN).map(entry => (
            <AssetGridItem key={entry.id} value={entry.id} textValue={entry.name} name={collectionName(entry.name, inFolder(entry.id).length)} {...COLLECTION_STRIP}
              group={inFolder(entry.id).slice(0, 8).map(asset => url(asset.thumb))} />
          ))}
        </AssetGrid>
      </TimelineItem>
    );
  };

  return (
    <Workspace
      canvasTitle="Home"
      canvasActions={
        <ViewControls>
          <Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />} onClick={() => setStarting(true)}>New project</Button>
          <Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />} onClick={() => setMaking("starter")}>New system</Button>
        </ViewControls>
      }
      canvas={<>
        <div className="studio-sections studio-home__feed">
          <CanvasSection id="home-continue" title="Continue">
            {visits.length ? (
              <Table wrapperProps={FEED_TABLE} aria-label="Recent places">
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
            ) : <EmptyState size="sm" title="Nothing opened yet" description="The places you open, a project's designs, a system's components or a collection, appear here." />}
          </CanvasSection>
          <CanvasSection id="home-latest" title="Latest">
            {events.length || changes.length ? (
              <Timeline aria-label="Latest">
                {/* The open system's unpublished changes come first: the one thing here waiting on you. */}
                {changes.length ? (
                  <TimelineItem current icon={<CircleDashedIcon />} title={`${plural(changes.length, "change")} waiting to publish`} meta={openSystem.name} time="Now">
                    <Button size="sm" variant="soft" tone="neutral" onClick={() => navigate({ page: "history", system: openSystem.id })}>Review</Button>
                  </TimelineItem>
                ) : null}
                {events.map(feedEvent)}
              </Timeline>
            ) : <EmptyState size="sm" title="Nothing yet" description="Publishes, new projects, saved versions and references appear here as they happen." />}
          </CanvasSection>
        </div>
        {starting ? <NewProject systems={systems} onCancel={() => setStarting(false)} onCreate={start} /> : null}
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
        design: chosenProject ? (
          <>
            <PanelSection>
              <div className="studio-inspector-actions">
                <Button size="sm" variant="soft" tone="neutral" onClick={() => navigate({ page: "project", project: chosenProject.id })}>Open</Button>
              </div>
            </PanelSection>
            <PanelSection heading={chosenProject.name}>
              <Facts label="Project" items={[
                ["Uses", systemName(chosenProject.system)],
                ["Pages", chosenProject.pages.length],
                ["Explorations", chosenProject.explorations.length],
                ["Versions", chosenProject.versions.length],
                ["Made", new Date(chosenProject.created).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })],
              ]} />
            </PanelSection>
          </>
        ) : chosen ? (<>
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
              ["Live", versionName(chosen.name, liveOf(chosen).version)],
              ["Began from", ORIGIN_LABEL[chosen.origin]],
              ["Made", new Date(chosen.created).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })],
              ["Saved in", `Systems/${chosen.id}/system.json`],
            ]} />
          </PanelSection>
        </>) : (
          <PanelSection heading="Home">
            <Facts label="Workspace" items={[
              ["Projects", projects.length],
              ["Systems", systems.length],
              ["Collections", boards.length],
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

/** New project's dialog: its name, and the system and theme it uses (as published). */
function NewProject({ systems, onCancel, onCreate }: { systems: readonly System[]; onCancel: () => void; onCreate: (name: string, system: string, theme: string) => void }) {
  const [name, setName] = useState("");
  const [systemId, setSystemId] = useState(systems[0]!.id);
  const system = asLive(systems.find(entry => entry.id === systemId) ?? systems[0]!);
  const [themeId, setThemeId] = useState(activeTheme(system).id);
  const field = useNameFocus();
  const submit = (event?: FormEvent) => { event?.preventDefault(); onCreate(name.trim() || "Untitled project", system.id, system.themes.some(entry => entry.id === themeId) ? themeId : activeTheme(system).id); };
  return (
    <Dialog open onOpenChange={next => { if (!next) onCancel(); }} title="New project" description="A project uses one system, as it is published, to make new things and try big changes."
      footer={<><Button variant="ghost" tone="neutral" onClick={onCancel}>Cancel</Button><Button onClick={() => submit()}>Create project</Button></>}>
      <form className="studio-home__form" onSubmit={submit}>
        <Field label="Name"><Input ref={field} fullWidth placeholder="Untitled project" value={name} onChange={event => setName(event.target.value)} /></Field>
        <Field label="System">
          <Select fullWidth value={system.id} onChange={event => { const next = asLive(systems.find(entry => entry.id === event.currentTarget.value) ?? systems[0]!); setSystemId(next.id); setThemeId(activeTheme(next).id); }}>
            {systems.map(entry => <option key={entry.id} value={entry.id}>{versionName(entry.name, liveOf(entry).version)}</option>)}
          </Select>
        </Field>
        <Field label="Theme">
          <Select fullWidth value={themeId} onChange={event => setThemeId(event.currentTarget.value)}>
            {system.themes.map(entry => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
          </Select>
        </Field>
      </form>
    </Dialog>
  );
}

/**
 * The name field takes focus once its dialog is open, its text chosen to retype. Dialog opens its modal in an effect, which
 * focuses the close; this effect, its parent's, runs after it.
 */
export function useNameFocus(select = false) {
  const field = useRef<HTMLInputElement>(null);
  useEffect(() => { field.current?.focus(); if (select) field.current?.select(); }, []);
  return field;
}

/** A name to type, for renaming. */
export function NameDialog({ title, action, initial, onCancel, onDone }: { title: string; action: string; initial: string; onCancel: () => void; onDone: (name: string) => void }) {
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
