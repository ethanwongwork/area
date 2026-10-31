/**
 * A project's pages (the IA of 2026-10-29; src/projects.ts): the tab is the project, and its Sidebar is its tree (src/app-nav.tsx,
 * ProjectNav). A project uses one theme of one system as the Library publishes it, so every specimen here paints in that
 * theme, and nothing on these pages edits the system: an exploration is where a project changes the look, and Publish is
 * how that change reaches the system.
 *
 *   ProjectOverview   #project/<id>: its pages, explorations and versions, with New page, New exploration, Save version
 *   ProjectPageView   #project/<id>/pages/<page>/<layer>: a page's layers in order, a system's screens and Inspiration's
 *                     images, each a tile; Add screen and Add image put one at the end
 *   ExplorationPage   #project/<id>/explorations/<id>: the exploration's theme, which the Inspector's Theme view edits, on
 *                     the screen and the system's patterns; Publish puts it in the system
 *   VersionsPage      #project/<id>/versions/<id>: saved versions, each restored from the Inspector
 */
import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { AssetGrid, AssetGridItem, Button, Card, CardContent, CardDescription, CardHeader, CardLink, CardTitle, ConfirmDialog, Dialog, EmptyState, Field, Input, Menu, MenuItem, PanelSection, Radio, RadioGroup, Table, TableCell, TableHeaderCell, TableLink } from "@area/react";
import { AddIcon, ChevronDownIcon } from "@area/icons";
import { canvasAttributes, useStudio, Workspace } from "../studio.tsx";
import { CanvasSection, CARD_SCOPE, Tile, TileGrid } from "../tile.tsx";
import { ViewControls } from "../view-controls.tsx";
import { Facts } from "../facts.tsx";
import { CanvasSettings } from "../canvas-settings.tsx";
import { ScreenFigure } from "../setup-screen.tsx";
import { hasColours } from "../colours.ts";
import { hrefOf, systemName } from "../places.ts";
import { EXAMPLES, WidthZoom } from "./examples.tsx";
import { NameDialog } from "./home.tsx";
import { nameOf, url, useLibrary } from "./imagery.tsx";
import { BeforeAfter, KINDS, ThemeScreen } from "../publish.tsx";
import { addExploration, addLayer, addPage, restoreVersion, saveVersion, type Layer, type Project } from "../projects.ts";
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
          description="Its folder moves to the Trash, where it can be put back; its tab closes. What it published stays in the Library."
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
  return image ? <img className="studio-layer__image" src={url(image.thumb)} alt={image.alt || nameOf(image)} /> : <p className="studio-muted">This image is no longer in Inspiration.</p>;
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
            <TileGrid span="unit" cards>
              {project.pages.map(page => (
                <Card key={page.id}>
                  <CardContent>
                    <CardHeader>
                      <CardTitle><CardLink href={hrefOf({ page: "project-page", project: project.id, item: page.id })} onClick={event => { event.preventDefault(); navigate({ page: "project-page", item: page.id }); }}>{page.name}</CardLink></CardTitle>
                      <CardDescription>{page.layers.length ? `${plural(page.layers.length, "layer")}: ${page.layers.slice(0, 3).map(layer => layer.name).join(", ")}${page.layers.length > 3 ? "…" : ""}` : "Empty"}</CardDescription>
                    </CardHeader>
                  </CardContent>
                </Card>
              ))}
            </TileGrid>
          </CanvasSection>
          <CanvasSection id="project-explorations" title="Explorations" count={project.explorations.length}>
            {project.explorations.length ? (
              <TileGrid span="wide" cards min={CARD_MIN}>
                {project.explorations.map(entry => (
                  <Tile key={entry.id} span="wide" stage="fit" inert label={entry.name} value={entry.published ? `Published in ${versionName(systemName(project.system), entry.published)}` : "Not published"}
                    onSelect={() => navigate({ page: "exploration", item: entry.id })} onOpen={() => navigate({ page: "exploration", item: entry.id })}>
                    <ThemeScreen theme={entry.theme} mode={theme} />
                  </Tile>
                ))}
              </TileGrid>
            ) : (
              <EmptyState title="No explorations yet" description={`An exploration tries a change to ${systemName(project.system)}'s look here, and Publish puts it in the system.`}
                actions={<Button size="sm" variant="soft" tone="neutral" onClick={newExploration}>New exploration</Button>} />
            )}
          </CanvasSection>
          <CanvasSection id="project-versions" title="Versions" count={project.versions.length}>
            {project.versions.length ? (
              <Table aria-label="Versions">
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
              <EmptyState title="No versions yet" description="Save version keeps a copy of the pages and explorations to go back to."
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

export function ProjectPageView() {
  const { openProject, item, select, updateProject, navigate } = useStudio();
  const { library } = useLibrary();
  const [picking, setPicking] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [pageId, layerId] = (item ?? "").split("/");
  if (!openProject) return null;
  const project = openProject;
  const page = project.pages.find(entry => entry.id === pageId) ?? project.pages[0]!;
  const layer = page.layers.find(entry => entry.id === layerId) ?? null;
  const add = (kind: Layer["kind"], ref: string, name: string) => {
    const made = addLayer(project, page.id, kind, ref, name);
    updateProject(project.id, () => made.project);
    if (made.layer) select(`${page.id}/${made.layer.id}`);
  };
  const removeLayer = (id: string) => {
    updateProject(project.id, current => ({ ...current, pages: current.pages.map(entry => entry.id === page.id ? { ...entry, layers: entry.layers.filter(other => other.id !== id) } : entry) }));
    select(page.id);
  };
  const deletePage = () => {
    updateProject(project.id, current => ({ ...current, pages: current.pages.filter(entry => entry.id !== page.id) }));
    navigate({ page: "project" });
  };
  const images = library?.items ?? [];
  const sourceOf = (entry: Layer) => entry.kind === "screen"
    ? `${systemName(project.system)} › Patterns › ${EXAMPLES.find(example => example.id === entry.ref)?.label ?? entry.ref}`
    : `Inspiration › ${library?.folders.find(folder => folder.id === entry.ref.split("/")[0])?.name ?? entry.ref.split("/")[0]}`;
  return (
    <Workspace
      canvasTitle={page.name}
      canvasActions={
        <ViewControls>
          <Menu aria-label="Add screen" align="end" tooltip="Add one of the system's screens"
            trigger={<Button variant="ghost" tone="neutral" size="sm" icon={<AddIcon />} trailingIcon={<ChevronDownIcon />}>Add screen</Button>}>
            {EXAMPLES.map(example => <MenuItem key={example.id} onClick={() => add("screen", example.id, example.label)}>{example.label}</MenuItem>)}
          </Menu>
          <Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />} disabled={!images.length} onClick={() => setPicking(true)}>Add image</Button>
        </ViewControls>
      }
      canvas={<>
        {page.layers.length ? (
          <TileGrid span="wide">
            {page.layers.map(entry => (
              <Tile key={entry.id} span="wide" stage="center" inert card label={entry.name} value={entry.kind === "screen" ? "Screen" : "Image"}
                selected={entry.id === layer?.id} onSelect={() => select(`${page.id}/${entry.id}`, { replace: true })}>
                <LayerView layer={entry} library={library} />
              </Tile>
            ))}
          </TileGrid>
        ) : (
          <EmptyState title={`${page.name} is empty`} description="Add one of the system's screens, or an image from Inspiration. Each is a layer, listed under the page in the Sidebar." />
        )}
        {picking ? (
          <Dialog open onOpenChange={next => { if (!next) setPicking(false); }} title="Add image" description="Choose an image from Inspiration: it goes at the end of the page.">
            <AssetGrid aria-label="Inspiration" {...CARD_SCOPE} style={{ "--area-asset-card-size": `${PICK_SIZE}px` } as CSSProperties}
              onOpen={value => { const image = images.find(entry => `${entry.folder}/${entry.id}` === value); if (image) add("image", value, nameOf(image)); setPicking(false); }}>
              {images.slice(0, 60).map(entry => <AssetGridItem key={`${entry.folder}/${entry.id}`} value={`${entry.folder}/${entry.id}`} name={nameOf(entry)} media={url(entry.thumb)} container="framed" caption="below" aspect="square" />)}
            </AssetGrid>
          </Dialog>
        ) : null}
        {renaming ? <NameDialog title="Rename page" action="Rename" initial={page.name} onCancel={() => setRenaming(false)}
          onDone={name => { updateProject(project.id, current => ({ ...current, pages: current.pages.map(entry => entry.id === page.id ? { ...entry, name } : entry) })); setRenaming(false); }} /> : null}
      </>}
      inspector={{
        design: layer ? (<>
          <PanelSection>
            <div className="studio-inspector-actions">
              <Button size="sm" variant="soft" tone="danger" onClick={() => removeLayer(layer.id)}>Remove layer</Button>
            </div>
          </PanelSection>
          <PanelSection heading={layer.name}>
            <Facts label="Layer" items={[["Kind", layer.kind === "screen" ? "Screen" : "Image"], ["From", sourceOf(layer)], ["Page", page.name], ["Order", `${page.layers.indexOf(layer) + 1} of ${page.layers.length}`]]} />
          </PanelSection>
        </>) : (<>
          <PanelSection>
            <div className="studio-inspector-actions">
              <Button size="sm" variant="soft" tone="neutral" onClick={() => setRenaming(true)}>Rename page</Button>
              {project.pages.length > 1 ? <Button size="sm" variant="soft" tone="danger" onClick={deletePage}>Delete page</Button> : null}
            </div>
          </PanelSection>
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
                <Tile span="wide" stage="fit" inert label={from.name} value={`Live in ${versionName(systemName(project.system), liveOf(openSystem).version)}`}>
                  <ThemeScreen theme={from} mode={theme} />
                </Tile>
              ) : null}
              <Tile span="wide" stage="fit" inert label={exploration.name} value={exploration.published ? `Published in ${versionName(systemName(project.system), exploration.published)}` : "Not published"}>
                <ScreenFigure className="studio-theme-card" scope={scope} />
              </Tile>
            </TileGrid>
          </CanvasSection>
          <CanvasSection id="exploration-screens" title="On the system's screens" count={EXAMPLES.length - 2} lede="The system's patterns, in the exploration.">
            <TileGrid span="wide">
              {EXAMPLES.filter(entry => entry.id !== "chat" && entry.id !== "abstract-board").map(entry => (
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
      description={`Everyone using ${system} gets it, and it goes in ${system}'s History from ${openProject.name}. Unpublished changes in ${system} stay unpublished.`}
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
              <Table aria-label="Versions">
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
              <EmptyState title="No versions yet" description="Save version keeps a copy of the pages and explorations to go back to."
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
