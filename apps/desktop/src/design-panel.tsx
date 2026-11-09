/**
 * The design interface's panel (owner, 2026-11-06: "the bottom part will show a gallery of all previous iterations and
 * all project layers, and a tab for documentation, code, and any other relevant tab that would support the design
 * information"): it sits under a project page's stage (src/pages/project.tsx), peeking up from the Canvas's foot, and the
 * Canvas scrolls as one page down to it. Its tabs, each about the layer on the stage or the project round it:
 *
 *   Iterations           every change to the pages, kept automatically (projects.ts recordIteration), and the saved
 *                        versions; a double-click goes back to one
 *   Layers               the page's layers as cards: a click puts one on the stage; Add screen, Add image
 *   Documentation        what the layer is, what it is built from and what in it is not from Area
 *   Code                 the screen's source (src/content/examples), a design of its own written as code (design-doc.ts
 *                        `toJsx`), or an image's markup
 *   Components & tokens  the families the screen uses and the tokens their stylesheets read
 *   Specs                the frame, type styles, colors and corners, read from the drawn design (src/design-scan.ts)
 *   Comments             notes on the layer, saved in the project
 *   Checks               contrast, alt text and names, read from the drawn design
 *   Research             the project's notes and the references it uses
 *
 * Which tab is open is the person's (a view option). The tabs are Area's Tabs; their row scrolls away with the panel
 * (PRODUCT_UI "Open component gaps": a sticky tab list). Only the row peeks under the stage; a click on any tab, the
 * open one too, scrolls the Canvas so the panel fills it (owner, 2026-11-06).
 */
import { useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode, type RefObject } from "react";
import { AssetGrid, AssetGridItem, Avatar, Button, Code, CodeBlock, ConfirmDialog, Dialog, EmptyState, Input, Menu, MenuItem, TableLink, Tabs, Textarea } from "@area/react";
import { AddIcon, ChevronDownIcon } from "@area/icons";
import SOURCES from "virtual:component-sources";
import { useStudio } from "./studio.tsx";
import { CanvasSection, CARD_SCOPE, FEED_CODE, Tile, TileGrid } from "./tile.tsx";
import { useViewOption } from "./view-controls.tsx";
import { DataTable, FactTable, stylesheetOf } from "./family-tabs.tsx";
// @ts-expect-error — the highlighter is authored in JavaScript.
import { highlight } from "./content/highlight.mjs";
import { toJsx } from "./design-doc.ts";
import { appScale } from "./app-scale.ts";
import { hrefOf, systemName } from "./places.ts";
import { EXAMPLES, PATTERNS } from "./pages/examples.tsx";
import { FAMILIES } from "./pages/components.tsx";
import { nameOf, url, useLibrary } from "./pages/imagery.tsx";
import { readChecks, readSpecs, type CheckKind, type DesignChecks, type DesignSpecs } from "./design-scan.ts";
import { addComment, restoreIteration, type Iteration, type Layer, type Project, type ProjectPage } from "./projects.ts";

const TABS = [
  { id: "iterations", label: "Iterations" },
  { id: "layers", label: "Layers" },
  { id: "documentation", label: "Documentation" },
  { id: "code", label: "Code" },
  { id: "components", label: "Components & tokens" },
  { id: "specs", label: "Specs" },
  { id: "comments", label: "Comments" },
  { id: "checks", label: "Checks" },
  { id: "research", label: "Research" },
] as const;
type TabId = (typeof TABS)[number]["id"];
const TAB_IDS = TABS.map(tab => tab.id);
/** A reference's card in Research's picker: Imagery's small size. */
const PICK_SIZE = 128; /* pick: imagery.tsx SIZES.small */

type Library = ReturnType<typeof useLibrary>["library"];
const exampleOf = (layer: Layer | null) => layer?.kind === "screen" ? EXAMPLES.find(entry => entry.id === layer.ref) : undefined;
const imageOf = (layer: Layer | null, library: Library) => layer?.kind === "image" ? library?.items.find(entry => `${entry.folder}/${entry.id}` === layer.ref) : undefined;
const when = (at: string) => new Date(at).toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const plural = (count: number, one: string, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;
const tabular = (value: ReactNode) => <span className="studio-tabular">{value}</span>;

export interface DesignPanelProps {
  project: Project;
  page: ProjectPage;
  /** The layer on the stage. */
  layer: Layer | null;
  /** The stage's element, whose first drawn screen Specs and Checks read. */
  stage: RefObject<HTMLElement | null>;
  /** A layer drawn as its card shows it. */
  layerView: (layer: Layer) => ReactNode;
  /** Puts a layer on the stage. */
  onShow: (layer: Layer) => void;
  /** Adds a screen or an image at the end of the page. */
  onAdd: (kind: Layer["kind"], ref: string, name: string) => void;
}

export function DesignPanel(props: DesignPanelProps) {
  const [tab, setTab] = useViewOption<TabId>("design-tab", "layers", TAB_IDS);
  const { project, layer } = props;
  const comments = layer ? project.comments.filter(entry => entry.page === props.page.id && entry.layer === layer.id).length : 0;
  const content: Record<TabId, () => ReactNode> = {
    iterations: () => <IterationsTab {...props} />,
    layers: () => <LayersTab {...props} />,
    documentation: () => <DocumentationTab {...props} />,
    code: () => <CodeTab {...props} />,
    components: () => <ComponentsTab {...props} />,
    specs: () => <SpecsTab {...props} />,
    comments: () => <CommentsTab {...props} />,
    checks: () => <ChecksTab {...props} />,
    research: () => <ResearchTab {...props} />,
  };
  const counts: Partial<Record<TabId, number>> = { iterations: project.history.length, layers: props.page.layers.length, comments };
  const panel = useRef<HTMLElement>(null);
  /** Scrolls the Canvas so the panel's top meets the Canvas body's (instantly when the person asks for less motion). */
  const reveal = () => {
    const self = panel.current;
    const body = self?.closest<HTMLElement>(".studio-canvas__body");
    if (!self || !body) return;
    const top = body.scrollTop + self.getBoundingClientRect().top - body.getBoundingClientRect().top;
    if (Math.abs(top - body.scrollTop) < 1) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    body.scrollTo({ top, behavior: still ? "auto" : "smooth" });
  };
  const onTabClick = (event: MouseEvent) => { if ((event.target as Element).closest('[role="tab"]')) reveal(); };
  return (
    <section ref={panel} className="studio-design__panel" aria-label="Design details" onClick={onTabClick}>
      <Tabs size="sm" aria-label="Design details" value={tab} onValueChange={next => setTab(next as TabId)}
        items={TABS.map(entry => ({
          id: entry.id, label: entry.label,
          trailing: counts[entry.id] ? <span className="studio-design__count">{counts[entry.id]}</span> : undefined,
          // Only the open tab draws (a scan or a whole screen's source is not free).
          content: entry.id === tab ? <div className="studio-design__body">{content[entry.id]()}</div> : null,
        }))} />
    </section>
  );
}

/** A tab's first row: what it holds, and its actions at the end. */
function TabHead({ children, actions }: { children: ReactNode; actions?: ReactNode }) {
  return <div className="studio-design__head"><p className="studio-design__summary">{children}</p>{actions ? <div className="studio-design__actions">{actions}</div> : null}</div>;
}

/* --- Iterations ---------------------------------------------------------------- */

function IterationsTab({ project, page, layer, layerView }: DesignPanelProps) {
  const { updateProject, navigate } = useStudio();
  const [picked, setPicked] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<Iteration | null>(null);
  const iterations = [...project.history].reverse();
  const now = JSON.stringify(project.pages);
  // An iteration's card draws the page as that change left it: the stage's layer if it was there, else its first.
  const pictureOf = (iteration: Iteration) => {
    const then = iteration.pages.find(entry => entry.id === page.id) ?? iteration.pages[0];
    const shown = then?.layers.find(entry => entry.id === layer?.id) ?? then?.layers[0];
    return shown ? layerView(shown) : null;
  };
  return (
    <div className="studio-sections">
      <TabHead actions={<Button size="sm" variant="ghost" tone="neutral" onClick={() => navigate({ page: "versions" })}>Versions</Button>}>
        {iterations.length ? `${plural(iterations.length, "iteration")}, newest first. Every change to the pages is kept; double-click one to go back to it.` : "Every change to the pages is kept here as you work."}
      </TabHead>
      {iterations.length ? (
        <TileGrid span="wide" cards>
          {iterations.map(iteration => {
            const current = JSON.stringify(iteration.pages) === now;
            return (
              <Tile key={iteration.id} span="wide" stage="center" shape="wide" inert card label={iteration.note}
                value={current ? "Now" : when(iteration.at)} selected={picked === iteration.id}
                onSelect={() => setPicked(iteration.id)} onOpen={() => { if (!current) setRestoring(iteration); }}>
                {pictureOf(iteration)}
              </Tile>
            );
          })}
        </TileGrid>
      ) : (
        <EmptyState size="sm" title="No iterations yet" description="Add a screen or an image, rename or reorder the page: each change is kept as an iteration to go back to." />
      )}
      {project.versions.length ? (
        <CanvasSection id="design-versions" title="Saved versions" count={project.versions.length}>
          <DataTable label="Saved versions" head={["Version", "Pages", "Saved"]} fit={[1, 2]}
            rows={[...project.versions].reverse().map(version => [
              <TableLink href={hrefOf({ page: "versions", project: project.id, item: version.id })} onClick={event => { event.preventDefault(); navigate({ page: "versions", item: version.id }); }}>{version.name}</TableLink>,
              tabular(version.pages.length), <span className="studio-muted">{when(version.at)}</span>,
            ])} />
        </CanvasSection>
      ) : null}
      {restoring ? (
        <ConfirmDialog open title={`Go back to “${restoring.note}”?`} confirmLabel="Go back"
          description="The pages go back to how this change left them. The current pages stay in Iterations."
          onOpenChange={next => { if (!next) setRestoring(null); }}
          onConfirm={() => { updateProject(project.id, current => restoreIteration(current, restoring.id)); setRestoring(null); }} />
      ) : null}
    </div>
  );
}

/* --- Layers -------------------------------------------------------------------- */

/** Add screen and Add image: the page's own actions. */
export function AddLayer({ onAdd }: Pick<DesignPanelProps, "onAdd">) {
  const { library } = useLibrary();
  const [picking, setPicking] = useState(false);
  const images = library?.items ?? [];
  return (
    <>
      <Menu aria-label="Add screen" align="end" tooltip="Add one of the system's screens"
        trigger={<Button variant="ghost" tone="neutral" size="sm" icon={<AddIcon />} trailingIcon={<ChevronDownIcon />}>Add screen</Button>}>
        {PATTERNS.map(example => <MenuItem key={example.id} onClick={() => onAdd("screen", example.id, example.label)}>{example.label}</MenuItem>)}
      </Menu>
      <Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />} disabled={!images.length} onClick={() => setPicking(true)}>Add image</Button>
      {picking ? <ReferencePicker onPick={(ref, name) => { onAdd("image", ref, name); setPicking(false); }} onClose={() => setPicking(false)} /> : null}
    </>
  );
}

/** The saved references to choose one from, in a dialog. */
function ReferencePicker({ onPick, onClose }: { onPick: (ref: string, name: string) => void; onClose: () => void }) {
  const { library } = useLibrary();
  const images = library?.items ?? [];
  return (
    <Dialog open onOpenChange={next => { if (!next) onClose(); }} title="Add image" description="Choose an image from your saved references: it goes at the end of the page.">
      <AssetGrid aria-label="Saved references" {...CARD_SCOPE} style={{ "--area-asset-card-size": `${PICK_SIZE}px` } as CSSProperties}
        onOpen={value => { const image = images.find(entry => `${entry.folder}/${entry.id}` === value); if (image) onPick(value, nameOf(image)); }}>
        {images.slice(0, 60).map(entry => <AssetGridItem key={`${entry.folder}/${entry.id}`} value={`${entry.folder}/${entry.id}`} name={nameOf(entry)} media={url(entry.thumb)} container="framed" caption="above" aspect="square" />)}
      </AssetGrid>
    </Dialog>
  );
}

function LayersTab({ page, layer, layerView, onShow, onAdd }: DesignPanelProps) {
  return (
    <div className="studio-sections">
      <TabHead actions={<AddLayer onAdd={onAdd} />}>
        {page.layers.length ? `${plural(page.layers.length, "layer")} on ${page.name}. Click one to put it on the stage.` : `${page.name} has no layers yet.`}
      </TabHead>
      {page.layers.length ? (
        <TileGrid span="wide" cards>
          {page.layers.map(entry => (
            <Tile key={entry.id} span="wide" stage="center" shape="wide" inert card openOnClick label={entry.name} value={entry.kind === "screen" ? "Screen" : "Image"}
              selected={entry.id === layer?.id} onSelect={() => onShow(entry)} onOpen={() => onShow(entry)}>
              {layerView(entry)}
            </Tile>
          ))}
        </TileGrid>
      ) : (
        <EmptyState size="sm" title={`${page.name} is empty`} description="Add one of the system's screens, or an image from your saved references." />
      )}
    </div>
  );
}

/* --- Documentation ------------------------------------------------------------- */

/** A family's name as a link to its page in the project's system. */
function FamilyLink({ name }: { name: string }) {
  const { navigate, openProject } = useStudio();
  const family = FAMILIES.find(entry => entry.name.toLowerCase() === name.toLowerCase());
  if (!family) return <>{name}</>;
  const place = { page: "components" as const, system: openProject?.system, item: family.slug };
  return <TableLink href={hrefOf(place)} onClick={event => { event.preventDefault(); navigate(place, { newTab: event.metaKey }); }}>{family.name}</TableLink>;
}

function DocumentationTab({ project, layer }: DesignPanelProps) {
  const { library } = useLibrary();
  const example = exampleOf(layer);
  const image = imageOf(layer, library);
  if (!layer) return <EmptyState size="sm" title="Nothing on the stage" description="Add a layer to the page, and its documentation shows here." />;
  if (example) return (
    <div className="studio-sections">
      <TabHead>{example.description}</TabHead>
      <FactTable label="Screen" rows={[
        ["Pattern", `${systemName(project.system)} › Patterns › ${example.label}`],
        ["Width", `${"width" in example ? example.width : 1440}px`],
        ["Built from", plural(example.families.length, "component family", "component families")],
      ]} />
      <CanvasSection id="design-doc-families" title="Built from" count={example.families.length} lede="Every Area family on the screen; each opens its page and documentation.">
        <p className="studio-design__links">{example.families.map((name, index) => <span key={name}>{index ? ", " : null}<FamilyLink name={name} /></span>)}</p>
      </CanvasSection>
      {example.gaps.length ? (
        <CanvasSection id="design-doc-gaps" title="Not from Area" count={example.gaps.length} lede="What the screen draws itself, for want of a component.">
          <ul className="studio-design__list">{example.gaps.map(gap => <li key={gap}>{gap}</li>)}</ul>
        </CanvasSection>
      ) : null}
    </div>
  );
  return (
    <div className="studio-sections">
      <TabHead>A saved reference on the page: a picture to design from, not a screen.</TabHead>
      <FactTable label="Image" rows={[
        ["From", `References › ${library?.folders.find(folder => folder.id === layer.ref.split("/")[0])?.name ?? layer.ref.split("/")[0]}`],
        image?.width ? ["Size", `${image.width} × ${image.height}`] : null,
        ["Alt text", image?.alt || "None"],
      ]} />
    </div>
  );
}

/* --- Code ---------------------------------------------------------------------- */

/** The screen's own file: src/content/examples/<id>.tsx, or the chat screen's. */
export const screenFile = (id: string) => SOURCES.screens[`${id}.tsx`] !== undefined ? { path: `apps/desktop/src/content/examples/${id}.tsx`, code: SOURCES.screens[`${id}.tsx`]! } : null;

function CodeTab({ layer }: DesignPanelProps) {
  const { library } = useLibrary();
  const example = exampleOf(layer);
  const image = imageOf(layer, library);
  if (!layer) return <EmptyState size="sm" title="Nothing on the stage" description="Add a layer to the page, and its code shows here." />;
  if (example && layer.doc) {
    // A design of its own (src/design-doc.ts): its code is written from it, the components as themselves.
    return (
      <div className="studio-sections">
        <TabHead>{`This layer's own design, written as code. It started from ${example.label}, whose file is unchanged.`}</TabHead>
        <CodeBlock title={`${layer.name}.tsx`} language="tsx" html={highlight(toJsx(layer.doc, { name: layer.name }))} {...FEED_CODE} {...appScale()} />
      </div>
    );
  }
  if (example) {
    const file = screenFile(example.id);
    return (
      <div className="studio-sections">
        <TabHead>{file ? "The screen's source: Area's components, composed." : "This screen is drawn by the app's own module, not a pattern file."}</TabHead>
        {file ? <CodeBlock title={file.path} language="tsx" html={highlight(file.code)} {...FEED_CODE} {...appScale()} /> : null}
      </div>
    );
  }
  const markup = `<img src="${image ? url(image.file) : layer.ref}" alt="${image?.alt ?? ""}" width="${image?.width ?? ""}" height="${image?.height ?? ""}" />`;
  return (
    <div className="studio-sections">
      <TabHead>An image has no source of its own; this is its markup.</TabHead>
      <CodeBlock language="html" html={highlight(markup)} {...FEED_CODE} {...appScale()} />
    </div>
  );
}

/* --- Components & tokens --------------------------------------------------------- */

/** The tokens a family's rules read (`var(--area-…)` in the rules of its block). */
function tokensOf(slug: string): string[] {
  const family = FAMILIES.find(entry => entry.slug === slug);
  const sheet = stylesheetOf(slug, family?.manifest ? `area-${family.manifest}` : undefined);
  if (!sheet) return [];
  const text = SOURCES.css[sheet]!;
  const block = `.area-${family?.manifest ?? slug}`;
  const found = new Set<string>();
  for (const [, selector, body] of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!selector!.includes(block)) continue;
    for (const [, token] of body!.matchAll(/var\((--area-[a-z0-9-]+)/g)) found.add(token!);
  }
  return [...found].sort();
}
const GROUPS: Array<[RegExp, string]> = [
  [/^--area-(focus-offset|focus-width|stroke|border-width)/, "Stroke"],
  [/^--area-(bg|fg|border|accent|danger|warning|success|info|tone|token|selection|focus|overlay|scrim)/, "Color"],
  [/^--area-(text|font|weight|leading|tracking|ui-size|ui-leading|control-[a-z]+-text|control-[a-z]+-leading)/, "Type"],
  [/^--area-(space|gap|inset|pad)/, "Spacing"],
  [/^--area-(radius|corner)/, "Shape"],
  [/^--area-(shadow|elevation|lift)/, "Elevation"],
  [/^--area-(duration|ease|motion|hover|press|transition)/, "Motion"],
  [/^--area-(icon|control)/, "Size"],
];
const groupOf = (token: string) => GROUPS.find(([pattern]) => pattern.test(token))?.[1] ?? "Other";

function ComponentsTab({ layer }: DesignPanelProps) {
  const example = exampleOf(layer);
  const families = useMemo(() => (example?.families ?? []).map(name => ({ name, family: FAMILIES.find(entry => entry.name.toLowerCase() === name.toLowerCase()) })), [example]);
  const tokens = useMemo(() => {
    const used = new Map<string, string[]>();
    for (const { name, family } of families) for (const token of family ? tokensOf(family.slug) : []) used.set(token, [...(used.get(token) ?? []), name]);
    return [...used.entries()].sort((a, b) => groupOf(a[0]).localeCompare(groupOf(b[0])) || b[1].length - a[1].length || a[0].localeCompare(b[0]));
  }, [families]);
  if (!example) return <EmptyState size="sm" title={layer ? "An image uses no components" : "Nothing on the stage"} description="A screen's components and the tokens they read show here." />;
  return (
    <div className="studio-sections">
      <TabHead>{`${plural(families.length, "component")} and the ${plural(tokens.length, "token")} their styles read. Change a token in the system's theme and every place here follows.`}</TabHead>
      <CanvasSection id="design-families" title="Components" count={families.length} lede="Every Area family on the screen, with how many tokens its stylesheet reads.">
        <DataTable label="Components" head={["Component", "Tokens"]} fit={[1]}
          rows={families.map(({ name, family }) => [<FamilyLink name={name} />, tabular(family ? tokensOf(family.slug).length : "–")])} />
      </CanvasSection>
      <CanvasSection id="design-tokens" title="Tokens" count={tokens.length} lede="The tokens those families read, by group.">
        <DataTable label="Tokens" head={["Token", "Group", "Used by"]} fit={[1]}
          rows={tokens.map(([token, by]) => [<Code>{token}</Code>, groupOf(token), <span className="studio-muted">{by.length > 3 ? `${by.slice(0, 3).join(", ")} and ${by.length - 3} more` : by.join(", ")}</span>])} />
      </CanvasSection>
    </div>
  );
}

/* --- Specs and Checks: read from the stage ------------------------------------------ */

/** Reads the stage's first drawn screen once it has drawn, and again when it changes (a mode, a theme, a layer). */
function useStageRead<T>(stage: RefObject<HTMLElement | null>, key: string, read: (root: Element) => T): T | null {
  const [result, setResult] = useState<{ key: string; value: T } | null>(null);
  useEffect(() => {
    const host = stage.current;
    if (!host) return;
    let timer = 0;
    const run = () => {
      // The design laid out unscaled (a scaled design's content box), else the frame a self-scaled one draws in.
      const root = host.querySelector(".studio-viewer__content") ?? host.querySelector(".studio-viewer__screen");
      if (root) setResult({ key, value: read(root) });
    };
    const frame = requestAnimationFrame(() => requestAnimationFrame(run));
    const observer = new MutationObserver(() => { clearTimeout(timer); timer = window.setTimeout(run, 300); });
    observer.observe(host, { subtree: true, childList: true, attributes: true, attributeFilter: ["data-area-theme", "class"] });
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); observer.disconnect(); };
  }, [stage, key]); // eslint-disable-line react-hooks/exhaustive-deps
  return result?.key === key ? result.value : null;
}

const Swatch = ({ value }: { value: string }) => <span className="studio-design__swatch" style={{ background: value.split(" ")[0], opacity: value.includes("%") ? Number(value.split(" ")[1]!.replace("%", "")) / 100 : 1 }} aria-hidden="true" />;

function SpecsTab({ layer, stage }: DesignPanelProps) {
  const specs: DesignSpecs | null = useStageRead(stage, `specs:${layer?.id ?? ""}`, readSpecs);
  if (!layer) return <EmptyState size="sm" title="Nothing on the stage" description="Add a layer to the page, and its measurements show here." />;
  if (!specs) return <TabHead>Measuring the design…</TabHead>;
  return (
    <div className="studio-sections">
      <TabHead>Read from the design as drawn, in the project's theme and the stage's mode.</TabHead>
      <CanvasSection id="design-specs-frame" title="Frame">
        <FactTable label="Frame" rows={[["Size", `${specs.width} × ${specs.height}`], ["Elements", specs.elements], ["Type styles", specs.type.length], ["Colors", specs.colors.length]]} />
      </CanvasSection>
      {specs.type.length ? (
        <CanvasSection id="design-specs-type" title="Type styles" count={specs.type.length} lede="Size over line, weight and face, largest first, with a sample of each.">
          <DataTable label="Type styles" head={["Style", "Face", "Uses", "Sample"]} fit={[2]}
            rows={specs.type.map(style => [tabular(`${style.size}/${style.line} ${style.weight}`), style.face, tabular(style.count), <span className="studio-muted">{style.sample}</span>])} />
        </CanvasSection>
      ) : null}
      {specs.colors.length ? (
        <CanvasSection id="design-specs-colors" title="Colors" count={specs.colors.length} lede="Each color as ink (words), fill and edge, most used first.">
          <DataTable label="Colors" head={["Color", "Ink", "Fill", "Edge"]} fit={[1, 2, 3]}
            rows={specs.colors.map(color => [<span className="studio-design__color"><Swatch value={color.value} /><Code>{color.value}</Code></span>, tabular(color.ink || "–"), tabular(color.fill || "–"), tabular(color.edge || "–")])} />
        </CanvasSection>
      ) : null}
      {specs.corners.length ? (
        <CanvasSection id="design-specs-corners" title="Corners" count={specs.corners.length}>
          <DataTable label="Corners" head={["Radius", "Uses"]} fit={[1]} rows={specs.corners.map(corner => [tabular(corner.value), tabular(corner.count)])} />
        </CanvasSection>
      ) : null}
    </div>
  );
}

const CHECK_TITLES: Record<CheckKind, string> = { contrast: "Contrast", alt: "Alt text", name: "Names", label: "Labels" };

function ChecksTab({ layer, stage }: DesignPanelProps) {
  const checks: DesignChecks | null = useStageRead(stage, `checks:${layer?.id ?? ""}`, readChecks);
  if (!layer) return <EmptyState size="sm" title="Nothing on the stage" description="Add a layer to the page, and its checks show here." />;
  if (layer.kind === "image") return <EmptyState size="sm" title="An image has no UI to check" description="Checks read a screen's words, controls and fields." />;
  if (!checks) return <TabHead>Checking the design…</TabHead>;
  const kinds = (Object.keys(CHECK_TITLES) as CheckKind[]).map(kind => ({ kind, issues: checks.issues.filter(issue => issue.kind === kind) }));
  return (
    <div className="studio-sections">
      <TabHead>{checks.issues.length ? `${plural(checks.issues.length, "issue")} in ${plural(checks.texts, "text")} and the screen's controls, in the stage's mode.` : `No issues: ${plural(checks.checked, "text")} meet WCAG's contrast floor, and every image, control and field is named.`}</TabHead>
      <FactTable label="Checks" rows={kinds.map(({ kind, issues }) => [CHECK_TITLES[kind], issues.length ? plural(issues.length, "issue") : "Passes"])} />
      {kinds.filter(({ issues }) => issues.length).map(({ kind, issues }) => (
        <CanvasSection key={kind} id={`design-checks-${kind}`} title={CHECK_TITLES[kind]} count={issues.length}>
          <DataTable label={CHECK_TITLES[kind]} head={["Where", "Why"]}
            rows={issues.slice(0, 60).map(issue => [issue.what, <span className="studio-muted">{issue.detail}</span>])} />
        </CanvasSection>
      ))}
    </div>
  );
}

/* --- Comments ------------------------------------------------------------------- */

function CommentsTab({ project, page, layer }: DesignPanelProps) {
  const { updateProject, profileName } = useStudio();
  const [draft, setDraft] = useState("");
  if (!layer) return <EmptyState size="sm" title="Nothing on the stage" description="Add a layer to the page to comment on it." />;
  const comments = project.comments.filter(entry => entry.page === page.id && entry.layer === layer.id);
  const post = () => { updateProject(project.id, current => addComment(current, page.id, layer.id, profileName, draft)); setDraft(""); };
  return (
    <div className="studio-sections">
      <TabHead>{comments.length ? `${plural(comments.length, "comment")} on ${layer.name}, newest first.` : `No comments on ${layer.name} yet. Notes on it stay with the project.`}</TabHead>
      <form className="studio-design__compose" onSubmit={event => { event.preventDefault(); post(); }}>
        <Input size="sm" fullWidth aria-label={`Comment on ${layer.name}`} value={draft} onChange={event => setDraft(event.target.value)} placeholder="Add a comment" />
        <Button size="sm" type="submit" disabled={!draft.trim()}>Comment</Button>
      </form>
      {comments.length ? (
        <ol className="studio-design__comments" aria-label={`Comments on ${layer.name}`}>
          {[...comments].reverse().map(comment => (
            <li key={comment.id} className="studio-design__comment">
              <Avatar size="sm" alt={comment.author} fallback={comment.author.split(" ").map(part => part[0]).join("").slice(0, 2)} />
              <div>
                <p className="studio-design__byline"><strong>{comment.author}</strong> <span className="studio-muted">{when(comment.at)}</span></p>
                <p>{comment.text}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}

/* --- Research ------------------------------------------------------------------- */

function ResearchTab({ project, layerView, onAdd }: DesignPanelProps) {
  const { updateProject } = useStudio();
  const [notes, setNotes] = useState(project.notes);
  const [picking, setPicking] = useState(false);
  // The notes save as they are typed, a moment after the last key.
  useEffect(() => {
    if (notes === project.notes) return;
    const timer = setTimeout(() => updateProject(project.id, current => ({ ...current, notes })), 400);
    return () => clearTimeout(timer);
  }, [notes]); // eslint-disable-line react-hooks/exhaustive-deps
  const references = project.pages.flatMap(entry => entry.layers.filter(layer => layer.kind === "image").map(layer => ({ page: entry, layer })));
  return (
    <div className="studio-sections">
      <TabHead actions={<Button size="sm" variant="ghost" tone="neutral" icon={<AddIcon />} onClick={() => setPicking(true)}>Add reference</Button>}>
        Findings, data and insights behind the design, saved with the project.
      </TabHead>
      <CanvasSection id="design-research-notes" title="Notes" lede="What people said and what the numbers show.">
        <Textarea className="studio-design__notes" aria-label="Research notes" rows={8} fullWidth value={notes} onChange={event => setNotes(event.target.value)} placeholder="Five interviews: people want the chart first…" />
      </CanvasSection>
      <CanvasSection id="design-research-references" title="References" count={references.length}
        lede={references.length ? "The saved references this project uses, on any page. One added here goes at the end of this page." : "None yet: add one from your saved references, and it goes at the end of this page."}>
        {references.length ? (
          <TileGrid span="wide" cards>
            {references.map(({ page, layer }) => (
              <Tile key={`${page.id}/${layer.id}`} span="wide" stage="center" shape="wide" inert card label={layer.name} value={page.name}>{layerView(layer)}</Tile>
            ))}
          </TileGrid>
        ) : null}
      </CanvasSection>
      {picking ? <ReferencePicker onPick={(ref, name) => { onAdd("image", ref, name); setPicking(false); }} onClose={() => setPicking(false)} /> : null}
    </div>
  );
}
