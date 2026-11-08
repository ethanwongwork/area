/**
 * A project's pages (the IA of 2026-10-29; src/projects.ts): the tab is the project, and it opens in place in the Sidebar's
 * one tree (src/app-nav.tsx, AppNav), a page's layers the list under it. A project uses one theme of one system as the Library publishes it, so every specimen here paints in that
 * theme, and nothing on these pages edits the system: an exploration is where a project changes the look, and Publish is
 * how that change reaches the system.
 *
 *   ProjectOverview   #project/<id>: its pages, explorations and versions, with New page, New exploration, Save version
 *   ProjectPageView   #project/<id>/pages/<page>/<layer>: the design interface (2026-11-06): the layer on a stage, the
 *                     design panel under it (src/design-panel.tsx: iterations, layers, documentation, code, components
 *                     and tokens, specs, comments, checks, research); an element chosen on the stage is edited in the
 *                     Inspector's Design view, its changes logged at the view's foot and sent to Chat together
 *                     (src/design-select.tsx, design-inspector.tsx, design-edit.ts); an old …/<layer>/open link opens the same
 *   ExplorationPage   #project/<id>/explorations/<id>: the exploration's theme, which the Inspector's Theme view edits, on
 *                     the screen and the system's patterns; Publish puts it in the system
 *   VersionsPage      #project/<id>/versions/<id>: saved versions, each restored from the Inspector
 */
import { Fragment, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { AssetGrid, AssetGridItem, Button, ConfirmDialog, ContextMenu, Dialog, EmptyState, Field, Input, Menu, MenuItem, MenuSeparator, Nav, NavItem, PanelSection, Radio, RadioGroup, Table, TableCell, TableHeaderCell, TableLink } from "@area/react";
import { AddIcon, AppWindowIcon, ChevronDownIcon, CopyIcon, ImageIcon, MoreHorizontalIcon, PencilIcon } from "@area/icons";
import { canvasAttributes, SidebarList, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, CARD_SCOPE, Tile, TileGrid, type OpenHow, FEED_TABLE, WhenVisible } from "../tile.tsx";
import { ViewControls, ViewLead } from "../view-controls.tsx";
import { useDesignViewer, type DesignViewerOptions } from "../design-viewer.tsx";
import { AddLayer, DesignPanel, screenFile } from "../design-panel.tsx";
import { StageSelection } from "../design-select.tsx";
import { ChangeLog, ElementPanel } from "../design-inspector.tsx";
import { applyChange, screensIn } from "../design-edit.ts";
import { openDesign, useCardArrival } from "../morph.ts";
import { Facts } from "../facts.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { SHOWCASE, ScreenFigure } from "../setup-screen.tsx";
import { hasColours } from "../colours.ts";
import { hrefOf, systemName } from "../places.ts";
import { EXAMPLES, PATTERNS, screenDesign, WidthZoom } from "./examples.tsx";
import { NameDialog } from "./home.tsx";
import { nameOf, url, useLibrary } from "./imagery.tsx";
import { BeforeAfter, KINDS, ThemeScreen } from "../publish.tsx";
import { addExploration, addLayer, addPage, changesOn, duplicateLayer, removeLayer, renameLayer, restoreVersion, saveVersion, type DesignChange, type Layer, type Project } from "../projects.ts";
import { activeTheme, liveOf, nextVersion, RELEASE_KIND_LABEL, versionName, type ReleaseKind } from "../systems.ts";

/** An exploration's card is the feed's 300 card, as a theme's. */
const CARD_MIN = 300; /* pick */
/** A board's image picker shows Inspiration's cards at Imagery's small size. */
const PICK_SIZE = 128; /* pick: imagery.tsx SIZES.small */

const dateOf = (at: string) => new Date(at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
const plural = (count: number, one: string, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;

/** The project's own actions in the Inspector's Design view: Rename and Delete, with their dialogs. */
function ProjectActions({ project }: { project: Project }) {
  const { updateProject, deleteProject } = useStudio();
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  return (
    <PanelSection>
      <div className="studio-inspector-actions">
        <Button size="sm" variant="soft" tone="neutral" onClick={() => setRenaming(true)}>Rename</Button>
        <Button size="sm" variant="soft" tone="danger" onClick={() => setDeleting(true)}>Delete</Button>
      </div>
      {renaming ? <NameDialog title="Rename project" action="Rename" initial={project.name} onCancel={() => setRenaming(false)}
        onDone={name => { updateProject(project.id, current => ({ ...current, name })); setRenaming(false); }} /> : null}
      {deleting ? (
        <ConfirmDialog open title={`Delete ${project.name}?`} tone="danger" confirmLabel="Delete project"
          description="Its folder moves to the Trash, where it can be put back; its tab closes. What it published stays in its system."
          onOpenChange={next => { if (!next) setDeleting(false); }} onConfirm={() => { deleteProject(project.id); setDeleting(false); }} />
      ) : null}
    </PanelSection>
  );
}

/** The project's facts: what it uses and holds. */
function ProjectFacts({ project }: { project: Project }) {
  const { openSystem } = useStudio();
  const used = openSystem.themes.find(entry => entry.id === project.theme);
  return (
    <PanelSection heading={project.name}>
      <Facts label="Project" items={[
        ["Uses", `${systemName(project.system)} › ${used?.name ?? "a theme no longer published"}`],
        ["Version", `${versionName(systemName(project.system), liveOf(openSystem).version)}, as published`],
        ["Pages", project.pages.length],
        ["Explorations", project.explorations.length],
        ["Versions", project.versions.length],
        ["Made", dateOf(project.created)],
        ["Saved in", `Projects/${project.id}/project.json`],
      ]} />
    </PanelSection>
  );
}

/** A layer drawn on its page: a screen at its own width zoomed to the tile, or an image. */
function LayerView({ layer, library }: { layer: Layer; library: ReturnType<typeof useLibrary>["library"] }) {
  if (layer.kind === "screen") {
    const example = EXAMPLES.find(entry => entry.id === layer.ref);
    return example ? <WidthZoom><div className="ex-thumb" aria-hidden="true"><example.Screen /></div></WidthZoom> : <p className="studio-muted">This screen is no longer in Patterns.</p>;
  }
  // Nothing while Inspiration loads.
  if (!library) return null;
  const image = library.items.find(entry => `${entry.folder}/${entry.id}` === layer.ref);
  return image ? <img className="studio-layer__image" src={url(image.thumb)} alt={image.alt || nameOf(image)} /> : <p className="studio-muted">This image is no longer in your saved references.</p>;
}

/**
 * A layer's kind in the Sidebar's list, as Figma's layers mark a frame or an image: a screen or an image icon. It was the
 * layer's picture, 20 × 14 (owner pick r4-thumbs, 2026-11-01), until the owner asked the same day "is the small image
 * thumbnail very practical?": at that size a screen is a white plate with a few bars, so two variations of one screen
 * (the case it was for) looked the same, an image read only as its colour, and every row drew a whole screen. The
 * Canvas shows the chosen layer; the row's name says which.
 */
const LAYER_ICONS: Record<Layer["kind"], ReactNode> = { screen: <AppWindowIcon />, image: <ImageIcon /> };

/** A layer as the design viewer draws it: its screen at its width, or its image at its size; null when its source is gone. */
function layerDesign(layer: Layer, library: ReturnType<typeof useLibrary>["library"]): Pick<DesignViewerOptions, "width" | "height" | "frame" | "render" | "selfScaled" | "themed"> | null {
  if (layer.kind === "screen") {
    const example = EXAMPLES.find(entry => entry.id === layer.ref);
    return example ? screenDesign(example) : null;
  }
  const image = library?.items.find(entry => `${entry.folder}/${entry.id}` === layer.ref);
  return image ? {
    width: image.width || 1200, height: image.height || 900, selfScaled: true, themed: false, frame: "bare",
    render: () => <img className="studio-viewer__image" src={url(image.file)} alt={image.alt || nameOf(image)} style={{ background: image.color }} />,
  } : null;
}

/** Save version's dialog: a name for the copy. */
function useSaveVersion(project: Project | null) {
  const { updateProject } = useStudio();
  const [saving, setSaving] = useState(false);
  const dialog = project && saving ? (
    <NameDialog title="Save version" action="Save" initial={`Version ${project.versions.length + 1}`} onCancel={() => setSaving(false)}
      onDone={name => { updateProject(project.id, current => saveVersion(current, name)); setSaving(false); }} />
  ) : null;
  return { save: () => setSaving(true), dialog };
}

export function ProjectOverview() {
  const { openProject, openSystem, updateProject, navigate, theme } = useStudio();
  const { library } = useLibrary();
  const { save, dialog } = useSaveVersion(openProject);
  if (!openProject) return null;
  const project = openProject;
  const newPage = () => { const made = addPage(project); updateProject(project.id, () => made.project); navigate({ page: "project-page", item: made.page.id }); };
  const newExploration = () => {
    const from = openSystem.themes.find(entry => entry.id === project.theme) ?? activeTheme(openSystem);
    const made = addExploration(project, from);
    updateProject(project.id, () => made.project);
    navigate({ page: "exploration", item: made.exploration.id });
  };
  return (
    <Workspace
      canvasTitle={project.name}
      canvasActions={
        <ViewControls>
          <Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />} onClick={newPage}>New page</Button>
          <Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />} onClick={newExploration}>New exploration</Button>
          <Button size="sm" variant="ghost" tone="neutral" onClick={save}>Save version</Button>
        </ViewControls>
      }
      canvas={<>
        <div className="studio-sections">
          <CanvasSection id="project-pages" title="Pages" count={project.pages.length} lede={`Boards of screens and images, in ${systemName(project.system)}'s published look.`}>
            {/* One picture a page, its first layer at a product screen's 16:9 (owner, 2026-11-01: "for normal project cards
                it should only be 1 visual. maybe for ui, 1920x1080 AR for card thumbnails is the standard"); a click opens
                it, ⌘-click in a tab of its own. They were text cards (a name and its layers' names) until then. */}
            <TileGrid span="wide" cards min={CARD_MIN}>
              {project.pages.map(page => (
                <Tile key={page.id} span="wide" stage="screen" inert openOnClick label={page.name} value={page.layers.length ? plural(page.layers.length, "layer") : "Empty"}
                  onOpen={how => navigate({ page: "project-page", item: page.id }, { newTab: how.newTab })}>
                  {page.layers[0] ? <LayerView layer={page.layers[0]} library={library} /> : null}
                </Tile>
              ))}
            </TileGrid>
          </CanvasSection>
          <CanvasSection id="project-explorations" title="Explorations" count={project.explorations.length}>
            {project.explorations.length ? (
              <TileGrid span="wide" cards min={CARD_MIN}>
                {project.explorations.map(entry => (
                  <Tile key={entry.id} span="wide" stage="screen" inert label={entry.name} status={entry.published ? "published" : "draft"} value={entry.published ? "Published" : "Draft"}
                    onSelect={() => navigate({ page: "exploration", item: entry.id })} onOpen={() => navigate({ page: "exploration", item: entry.id })}>
                    <ThemeScreen theme={entry.theme} mode={theme} />
                  </Tile>
                ))}
              </TileGrid>
            ) : (
              <EmptyState size="sm" title="No explorations yet" description={`An exploration tries a change to ${systemName(project.system)}'s look here, and Publish puts it in the system.`}
                actions={<Button size="sm" variant="soft" tone="neutral" onClick={newExploration}>New exploration</Button>} />
            )}
          </CanvasSection>
          <CanvasSection id="project-versions" title="Versions" count={project.versions.length}>
            {project.versions.length ? (
              <Table wrapperProps={FEED_TABLE} aria-label="Versions">
                <thead><tr><TableHeaderCell>Version</TableHeaderCell><TableHeaderCell fit>Saved</TableHeaderCell></tr></thead>
                <tbody>
                  {[...project.versions].reverse().map(version => (
                    <tr key={version.id}>
                      <TableCell><TableLink href={hrefOf({ page: "versions", project: project.id, item: version.id })} onClick={event => { event.preventDefault(); navigate({ page: "versions", item: version.id }); }}>{version.name}</TableLink></TableCell>
                      <TableCell fit className="studio-muted">{dateOf(version.at)}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <EmptyState size="sm" title="No versions yet" description="Save version keeps a copy of the pages and explorations to go back to."
                actions={<Button size="sm" variant="soft" tone="neutral" onClick={save}>Save version</Button>} />
            )}
          </CanvasSection>
        </div>
        {dialog}
      </>}
      inspector={{ design: <><ProjectActions project={project} /><ProjectFacts project={project} /></> }}
    />
  );
}

/**
 * A page as the design interface (owner, 2026-11-06: "the main center page … will be where the design lives. you can zoom
 * in and out on it or change the view settings to fill the frame space"): the layer on a stage at the top, short of the
 * Canvas's height so the design panel (src/design-panel.tsx) peeks up under it, and the Canvas scrolls as one page from
 * the one to the other; the stage never takes a plain scroll (design-viewer.tsx `scroll: "page"`). The stage holds one
 * layer at a time (the owner's pick): the chosen one, else the page's first; the Layers tab, the Sidebar's list and ← →
 * choose another. The Canvas bar is the viewer's: mode and ground at its start, the place, the steps and the zoom (Fit in
 * frame, Fill width) at its end.
 */
export function ProjectPageView() {
  const { openProject, item, select, updateProject, navigate, theme, query } = useStudio();
  const { library } = useLibrary();
  // What a Rename dialog is open for: a layer of the page (from its row's menu in the Sidebar).
  const [renaming, setRenaming] = useState<Layer | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [pageId, layerId] = (item ?? "").split("/");
  const shownPage = openProject?.pages.find(entry => entry.id === pageId) ?? openProject?.pages[0];
  const layers = shownPage?.layers ?? [];
  // The layer on the stage: the one chosen, else the page's first.
  const chosenLayer = layers.find(entry => entry.id === layerId) ?? layers[0] ?? null;
  // The element chosen on the stage, for the layer it was chosen on (src/design-select.tsx).
  const [chosen, setChosen] = useState<{ layer: string; path: number[] } | null>(null);
  const selected = chosen && chosen.layer === chosenLayer?.id ? chosen.path : null;
  const choose = (path: number[] | null) => setChosen(path && chosenLayer ? { layer: chosenLayer.id, path } : null);
  // The design changes drawn on this layer (projects.ts `DesignChange`): the screen is keyed by them, so one undone
  // redraws it from its code before the rest are drawn again.
  const drawn = openProject && shownPage && chosenLayer ? changesOn(openProject, shownPage.id, chosenLayer.id) : [];
  const revision = JSON.stringify(drawn.map(entry => [entry.path, entry.property, entry.value]));
  const base = chosenLayer ? layerDesign(chosenLayer, library) : null;
  const design = base ? { ...base, render: (mode: "light" | "dark", scale: number) => <Fragment key={revision}>{base.render(mode, scale)}</Fragment> } : null;
  const at = chosenLayer ? layers.indexOf(chosenLayer) : -1;
  const viewer = useDesignViewer({
    active: Boolean(design), scroll: "page", design: `layer:${chosenLayer?.id ?? ""}`, label: chosenLayer?.name ?? "Layer", appMode: theme,
    width: 1440, render: () => null, ...design,
    step: { index: at, count: layers.length, noun: "layer", onStep: by => { const next = layers[(at + by + layers.length) % layers.length]!; select(`${shownPage?.id}/${next.id}`, { replace: true }); } },
  });
  // Draw the changes on every copy of the screen, now and whenever the stage draws one again (a mode, a layer).
  useLayoutEffect(() => {
    const host = stageRef.current;
    if (!host) return;
    const draw = () => { for (const root of screensIn(host)) for (const change of drawn) applyChange(root, change); };
    draw();
    const watch = new MutationObserver(records => { if (records.some(record => [...record.addedNodes].some(node => node instanceof Element && (node.matches(".studio-viewer__content, .studio-viewer__screen") || node.querySelector(".studio-viewer__content"))))) draw(); });
    watch.observe(host, { childList: true, subtree: true });
    return () => watch.disconnect();
  }, [revision, chosenLayer?.id, design !== null]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!openProject) return null;
  const project = openProject;
  const page = shownPage!;
  const layer = chosenLayer;
  const editable = Boolean(design && layer?.kind === "screen");
  const show = (entry: Layer) => select(`${page.id}/${entry.id}`, { replace: true });
  const add = (kind: Layer["kind"], ref: string, name: string) => {
    const made = addLayer(project, page.id, kind, ref, name);
    updateProject(project.id, () => made.project);
    if (made.layer) select(`${page.id}/${made.layer.id}`);
  };
  const duplicate = (entry: Layer) => {
    const made = duplicateLayer(project, page.id, entry.id);
    updateProject(project.id, () => made.project);
    if (made.layer) select(`${page.id}/${made.layer.id}`, { replace: true });
  };
  const remove = (entry: Layer) => {
    updateProject(project.id, current => removeLayer(current, page.id, entry.id));
    if (entry.id === layer?.id) select(page.id, { replace: true });
  };
  const openChange = (change: DesignChange) => {
    if (change.page !== page.id || change.layer !== layer?.id) select(`${change.page}/${change.layer}`, { replace: true });
    setChosen({ layer: change.layer, path: change.path });
  };
  const sourceOf = (entry: Layer) => entry.kind === "screen"
    ? `${systemName(project.system)} › Patterns › ${EXAMPLES.find(example => example.id === entry.ref)?.label ?? entry.ref}`
    : `References › ${library?.folders.find(folder => folder.id === entry.ref.split("/")[0])?.name ?? entry.ref.split("/")[0]}`;
  const fileOf = (entry: Layer) => entry.kind === "screen" ? screenFile(entry.ref)?.path ?? null : null;
  // The page's layers, its list under the nav (app-nav.tsx PageList; owner's pick 2026-11-01: a section's own list goes
  // there, so the nav's tree stays three levels; they were rows under the page in the project's nav). Each row's menu
  // (its … and a right-click) renames, duplicates and removes it, as Figma's layers list does (owner's pick, 2026-11-06).
  const listed = page.layers.filter(entry => entry.name.toLowerCase().includes(query.trim().toLowerCase()));
  const layerMenu = (entry: Layer) => <>
    <MenuItem icon={<PencilIcon />} onClick={() => setRenaming(entry)}>Rename</MenuItem>
    <MenuItem icon={<CopyIcon />} onClick={() => duplicate(entry)}>Duplicate</MenuItem>
    <MenuSeparator />
    <MenuItem tone="danger" onClick={() => remove(entry)}>Remove</MenuItem>
  </>;
  return (
    <Workspace
      // The list stays when the page is empty, so the Sidebar keeps its width from page to page (a list's floor).
      sidebar={
        <SidebarList>
          {page.layers.length ? (
            <ContextMenu menuLabel="Layer actions" itemSelector="[data-layer]"
              menu={row => { const entry = page.layers.find(other => other.id === row.dataset.layer); return entry ? layerMenu(entry) : null; }}>
              <Nav aria-label={`${page.name}'s layers`}>
                {listed.map(entry => (
                  <NavItem key={entry.id} data-layer={entry.id} href={hrefOf({ page: "project-page", project: project.id, item: `${page.id}/${entry.id}` })}
                    icon={LAYER_ICONS[entry.kind]} current={entry.id === layer?.id} revealActions
                    actions={<Menu aria-label={`${entry.name} actions`} align="start" trigger={<Button size="sm" variant="ghost" tone="neutral" iconOnly icon={<MoreHorizontalIcon />} aria-label={`${entry.name} actions`} tabIndex={-1} />}>{layerMenu(entry)}</Menu>}
                    onClick={event => { event.preventDefault(); show(entry); }}>
                    {entry.name}
                  </NavItem>
                ))}
              </Nav>
            </ContextMenu>
          ) : <p className="studio-muted studio-sidebar__empty">No layers yet.</p>}
        </SidebarList>
      }
      canvasTitle={layer ? layer.name : page.name}
      canvasLead={design ? <ViewLead>{viewer.lead}</ViewLead> : undefined}
      canvasActions={design ? <ViewControls>{viewer.controls}</ViewControls> : undefined}
      canvas={<>
        <div className="studio-design">
          <div ref={stageRef} className="studio-design__stage" data-filled={viewer.height ? "" : undefined} data-editing={editable ? "" : undefined}
            style={viewer.height ? { "--_stage-height": `${viewer.height}px` } as CSSProperties : undefined}>
            {design ? viewer.stage : (
              <div className="studio-design__empty">
                <EmptyState title={layer ? "This layer's source is gone" : `${page.name} is empty`}
                  description={layer ? "Its screen left Patterns, or its image left your saved references. Remove it from its menu in the Sidebar." : "Add one of the system's screens, or an image from your saved references. It shows here, and the panel below holds its iterations, documentation and code."}
                  actions={layer ? undefined : <AddLayer onAdd={add} />} />
              </div>
            )}
            <StageSelection stage={stageRef} enabled={editable} selected={selected} onSelect={choose} />
          </div>
          <DesignPanel project={project} page={page} layer={layer} stage={stageRef} onShow={show} onAdd={add}
            layerView={entry => <LayerView layer={entry} library={library} />} />
        </div>
        {renaming ? <NameDialog title="Rename layer" action="Rename" initial={renaming.name} onCancel={() => setRenaming(null)}
          onDone={name => { updateProject(project.id, current => renameLayer(current, page.id, renaming.id, name)); setRenaming(null); }} /> : null}
      </>}
      inspectorFooter={<ChangeLog project={project} page={page} layer={layer} onOpen={openChange} screenFile={fileOf} />}
      inspector={{
        // The chosen element's properties (src/design-inspector.tsx), else what is on the stage: the layer and its page.
        design: layer && selected && editable ? (
          <ElementPanel project={project} page={page} layer={layer} stage={stageRef} path={selected} onSelect={choose} />
        ) : (<>
          {layer ? (
            <PanelSection heading={layer.name}>
              {editable ? <p className="studio-design__about">Click anything on the stage to change it here. Each change is drawn at once and logged below, to send to Chat together.</p> : null}
              <Facts label="Layer" items={[["Kind", layer.kind === "screen" ? "Screen" : "Image"], ["From", sourceOf(layer)], ["Page", page.name], ["Order", `${page.layers.indexOf(layer) + 1} of ${page.layers.length}`]]} />
            </PanelSection>
          ) : null}
          <PanelSection heading={page.name}>
            <Facts label="Page" items={[["Layers", page.layers.length], ["Screens", page.layers.filter(entry => entry.kind === "screen").length], ["Images", page.layers.filter(entry => entry.kind === "image").length], ["Project", project.name]]} />
          </PanelSection>
        </>),
      }}
    />
  );
}

export function ExplorationPage() {
  const { openProject, openSystem, item, shown, brand, theme, updateProject, navigate } = useStudio();
  const [publishing, setPublishing] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  if (!openProject) return null;
  const project = openProject;
  const exploration = project.explorations.find(entry => entry.id === item);
  if (!exploration) return null;
  const from = openSystem.themes.find(entry => entry.id === exploration.from);
  // The exploration is the edited theme (src/studio.tsx), so the screen paints what the Inspector shows, previews included.
  const scope = { ...canvasAttributes(shown.canvas, shown.material), ...(hasColours(shown.colours) ? { "data-area-colours": "" } : {}), ...(brand.on ? { "data-area-brand": "" } : {}), "data-area-theme": theme };
  return (
    <Workspace
      canvasTitle={exploration.name}
      canvasActions={
        <ViewControls>
          <Button size="sm" onClick={() => setPublishing(true)}>Publish to {systemName(project.system)}…</Button>
        </ViewControls>
      }
      canvas={<>
        <div className="studio-sections">
          <CanvasSection id="exploration" title={exploration.name}
            lede={`From ${from?.name ?? "a theme"} in ${versionName(systemName(project.system), liveOf(openSystem).version)}. Change it in the Inspector's Theme view; nothing in ${systemName(project.system)} changes until you publish.`}>
            <TileGrid span="wide" cards min={CARD_MIN}>
              {from ? (
                <Tile span="wide" stage="screen" inert label={from.name} status="published" value="Live">
                  <ThemeScreen theme={from} mode={theme} />
                </Tile>
              ) : null}
              <Tile span="wide" stage="screen" inert label={exploration.name} status={exploration.published ? "published" : "draft"} value={exploration.published ? "Published" : "Draft"}>
                <ScreenFigure className="studio-theme-card" hold={SHOWCASE} scope={scope} />
              </Tile>
            </TileGrid>
          </CanvasSection>
          <CanvasSection id="exploration-screens" title="On the system's screens" count={PATTERNS.length - 2} lede="The system's patterns, in the exploration.">
            <TileGrid span="wide" cards>
              {PATTERNS.filter(entry => entry.id !== "chat" && entry.id !== "abstract-board").map(entry => (
                <Tile key={entry.id} span="wide" stage="center" inert card label={entry.label}>
                  <WidthZoom><div className="ex-thumb" aria-hidden="true"><entry.Screen /></div></WidthZoom>
                </Tile>
              ))}
            </TileGrid>
          </CanvasSection>
        </div>
        {publishing ? <PublishExploration onClose={() => setPublishing(false)} /> : null}
        {renaming ? <NameDialog title="Rename exploration" action="Rename" initial={exploration.name} onCancel={() => setRenaming(false)}
          onDone={name => { updateProject(project.id, current => ({ ...current, explorations: current.explorations.map(entry => entry.id === exploration.id ? { ...entry, name, theme: { ...entry.theme, name } } : entry) })); setRenaming(false); }} /> : null}
        {deleting ? (
          <ConfirmDialog open title={`Delete ${exploration.name}?`} tone="danger" confirmLabel="Delete exploration"
            description={exploration.published ? `What it published stays in ${systemName(project.system)}.` : "It was never published, so its changes are lost."}
            onOpenChange={next => { if (!next) setDeleting(false); }}
            onConfirm={() => { updateProject(project.id, current => ({ ...current, explorations: current.explorations.filter(entry => entry.id !== exploration.id) })); setDeleting(false); navigate({ page: "project" }); }} />
        ) : null}
      </>}
      inspector={{
        theme: <CanvasSettings />,
        design: (<>
          <PanelSection>
            <div className="studio-inspector-actions">
              <Button size="sm" variant="soft" tone="neutral" onClick={() => setRenaming(true)}>Rename</Button>
              <Button size="sm" variant="soft" tone="danger" onClick={() => setDeleting(true)}>Delete</Button>
            </div>
          </PanelSection>
          <PanelSection heading={exploration.name}>
            <Facts label="Exploration" items={[
              ["From", `${systemName(project.system)} › ${from?.name ?? "a theme no longer published"}`],
              ["Published", exploration.published ? versionName(systemName(project.system), exploration.published) : "Not yet"],
              ["Edited in", "Inspector › Theme"],
            ]} />
          </PanelSection>
        </>),
      }}
    />
  );
}

/** Publish an exploration: as an update to the theme it came from, or as a new theme; then the kind and the note. */
function PublishExploration({ onClose }: { onClose: () => void }) {
  const { openProject, openSystem, item, publishExploration, theme } = useStudio();
  const exploration = openProject?.explorations.find(entry => entry.id === item);
  const from = exploration ? openSystem.themes.find(entry => entry.id === exploration.from) : undefined;
  const [replaces, setReplaces] = useState(Boolean(from));
  const [kind, setKind] = useState<Exclude<ReleaseKind, "first">>(from ? "fixes" : "adds");
  const [note, setNote] = useState(() => exploration && from ? `${from.name} from ${openProject!.name}'s ${exploration.name}` : exploration ? `Adds ${exploration.name}` : "");
  const live = liveOf(openSystem);
  const version = nextVersion(live.version, kind);
  const system = openProject ? systemName(openProject.system) : "";
  const choices = useMemo(() => KINDS.filter(entry => replaces || entry.value !== "fixes"), [replaces]);
  if (!openProject || !exploration) return null;
  const submit = (event?: FormEvent) => { event?.preventDefault(); publishExploration(exploration.id, replaces && Boolean(from), kind, note); onClose(); };
  return (
    <Dialog open onOpenChange={next => { if (!next) onClose(); }} title={`Publish ${versionName(system, version)}`}
      description={`Everyone using ${system} gets it, and it goes in ${system}'s Versions from ${openProject.name}. Unpublished changes in ${system} stay unpublished.`}
      footer={<><Button variant="ghost" tone="neutral" onClick={onClose}>Cancel</Button><Button onClick={() => submit()}>Publish {versionName(system, version)}</Button></>}>
      <form className="studio-publish" onSubmit={submit}>
        <BeforeAfter before={from && replaces ? { label: `Live in ${versionName(system, live.version)}`, value: from.name, theme: from } : null}
          after={{ label: `Publishing as ${versionName(system, version)}`, value: replaces && from ? from.name : exploration.name, theme: exploration.theme }} empty="A new theme replaces nothing." mode={theme} />
        <RadioGroup label="Publish as" value={replaces ? "update" : "new"} onValueChange={value => { const update = value === "update"; setReplaces(update); setKind(update ? "fixes" : "adds"); }}>
          <Radio value="update" disabled={!from} label={from ? `An update to ${from.name}` : "An update"} description={from ? `${from.name} takes the exploration's values.` : "The theme it came from is no longer published."} />
          <Radio value="new" label={`A new theme, ${exploration.name}`} description={`${system} gets a theme beside the others.`} />
        </RadioGroup>
        <RadioGroup label="Kind" value={kind} onValueChange={value => setKind(value as Exclude<ReleaseKind, "first">)}>
          {choices.map(entry => <Radio key={entry.value} variant="soft" layout="list" value={entry.value} label={RELEASE_KIND_LABEL[entry.value]} meta={versionName(system, nextVersion(live.version, entry.value))} description={entry.description} />)}
        </RadioGroup>
        <Field label="Note"><Input fullWidth value={note} onChange={event => setNote(event.target.value)} /></Field>
      </form>
    </Dialog>
  );
}

export function VersionsPage() {
  const { openProject, item, select, updateProject } = useStudio();
  const { save, dialog } = useSaveVersion(openProject);
  const [restoring, setRestoring] = useState(false);
  if (!openProject) return null;
  const project = openProject;
  const chosen = project.versions.find(entry => entry.id === item) ?? null;
  return (
    <Workspace
      canvasTitle="Versions"
      canvasActions={<ViewControls><Button size="sm" variant="ghost" tone="neutral" onClick={save}>Save version</Button></ViewControls>}
      canvas={<>
        <div className="studio-sections">
          <CanvasSection id="versions" title="Versions" count={project.versions.length} lede="Copies of the pages and explorations, newest first. Restoring one keeps the others.">
            {project.versions.length ? (
              <Table wrapperProps={FEED_TABLE} aria-label="Versions">
                <thead><tr><TableHeaderCell>Version</TableHeaderCell><TableHeaderCell fit>Pages</TableHeaderCell><TableHeaderCell fit>Explorations</TableHeaderCell><TableHeaderCell fit>Saved</TableHeaderCell></tr></thead>
                <tbody>
                  {[...project.versions].reverse().map(version => (
                    <tr key={version.id} aria-selected={version === chosen || undefined}>
                      <TableCell><TableLink href={hrefOf({ page: "versions", project: project.id, item: version.id })} onClick={event => { event.preventDefault(); select(version.id, { replace: true }); }}>{version.name}</TableLink></TableCell>
                      <TableCell fit>{version.pages.length}</TableCell>
                      <TableCell fit>{version.explorations.length}</TableCell>
                      <TableCell fit className="studio-muted">{dateOf(version.at)}</TableCell>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <EmptyState size="sm" title="No versions yet" description="Save version keeps a copy of the pages and explorations to go back to."
                actions={<Button size="sm" variant="soft" tone="neutral" onClick={save}>Save version</Button>} />
            )}
          </CanvasSection>
        </div>
        {dialog}
        {chosen && restoring ? (
          <ConfirmDialog open title={`Restore ${chosen.name}?`} confirmLabel="Restore"
            description="The pages and explorations go back to this version. Save a version first to keep what is there now."
            onOpenChange={next => { if (!next) setRestoring(false); }} onConfirm={() => { updateProject(project.id, current => restoreVersion(current, chosen.id)); setRestoring(false); }} />
        ) : null}
      </>}
      inspector={{
        design: chosen ? (<>
          <PanelSection>
            <div className="studio-inspector-actions">
              <Button size="sm" variant="soft" tone="neutral" onClick={() => setRestoring(true)}>Restore</Button>
            </div>
          </PanelSection>
          <PanelSection heading={chosen.name}>
            <Facts label="Version" items={[["Saved", dateOf(chosen.at)], ["Pages", chosen.pages.map(page => page.name).join(", ")], ["Explorations", chosen.explorations.length ? chosen.explorations.map(entry => entry.name).join(", ") : "None"]]} />
          </PanelSection>
        </>) : <ProjectFacts project={project} />,
      }}
    />
  );
}
