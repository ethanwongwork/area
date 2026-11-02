/**
 * The app's navigation (docs/research/app-structure-2026-10-28/README.md; the shell is variation A, owner 2026-10-28):
 *
 *   AppTabs   the Titlebar's open tabs, as a browser's: Home first (icon only, never closed: Figma's file browser tab),
 *             then References, one per open project, system or lab, its type icon, name and close, then
 *             New tab (owner, 2026-10-29: "i like the floating tab component from claude codes browser")
 *   AppNav    the Sidebar's nav, the tab's own (owner, 2026-10-29: "tabs can be libraries or projects … those will be
 *             accessed through the left nav, but the tab itself … will always just be the project itself"): in Home's tab
 *             the workspace (Home and References, then Projects and Systems, a row each); in a system's tab its
 *             sections, in References' its views, in a project's its overview, pages and their layers, explorations and
 *             versions, each under a back row to Home.
 *             A click opens in the tab holding what it names (this one, or another), ⌘-click in a new one
 *   PageList  a page's own list under the nav (Components' families, Icons' categories, References' collections), under
 *             its filter; the nav stays (2026-10-30; was a takeover of the Sidebar under a back row)
 *
 * References (owner, 2026-10-31: Explore renamed "since its a collection of all designs, images, etc") is what others share
 * (Discover, Following) and what you keep (Saved, its collections), one place beside Home.
 * New project and New system are their sections' last rows (Home's dialogs).
 */
import { Fragment, useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Button, Count, Kbd, Nav, NavGroup, NavItem, SearchField, Tooltip } from "@area/react";
import { AddIcon, ArrowLeftIcon, BookmarkIcon, ChevronDownIcon, DismissIcon, DocumentIcon, FlaskIcon, FolderIcon, GitBranchIcon, HistoryIcon, HomeIcon, ImageIcon, LayoutIcon, ShapesIcon } from "@area/icons";
import { systemName, HOME_TAB, hrefOf, LIST_PAGES, projectName, REFERENCE_VIEWS, referenceView, tabKind, tabName, type PageId, type Place, type TabKind } from "./places.ts";
import { addExploration, addPage } from "./projects.ts";
import { activeTheme, versionName } from "./systems.ts";
import { ChromeButton, SidebarList, useStudio } from "./studio.tsx";
import { FAMILIES, KIND_ORDER, kindOf } from "./pages/components.tsx";
import { StatusBadge } from "./tile.tsx";

// A system is the triangle, square and circle (owner, 2026-10-31: "a simple composition of triangle square, and circle";
// never the palette, and not the four-diamond component); its own drawing is being made in the icon set.
const TAB_ICONS: Record<TabKind, ReactNode> = { home: <HomeIcon />, system: <ShapesIcon />, project: <FolderIcon />, references: <BookmarkIcon />, labs: <FlaskIcon /> };

/**
 * A system's sections, one row each and one click away (owner, 2026-10-30: "foundations is not very well organized ... the
 * actual nav items are too hidden behind multiple clicks. i want to simplify the design system overall. each system is one
 * thing with components, colors, typography, icons, patterns, etc underneath it"). Foundations and its setting-group pages
 * are gone: a theme's settings are edited on Themes (its Playground), so an old Foundations link opens Themes, on the
 * setting it named. In the Sidebar they sit in three groups (SystemNav); this list is search's.
 */
export const SYSTEM_SECTIONS: ReadonlyArray<{ place: Place; label: string }> = [
  { place: { page: "themes" }, label: "Themes" },
  { place: { page: "tokens" }, label: "Tokens" },
  { place: { page: "color" }, label: "Colors" },
  { place: { page: "typography" }, label: "Typography" },
  { place: { page: "spacing" }, label: "Spacing" },
  { place: { page: "shape" }, label: "Shape" },
  { place: { page: "elevation" }, label: "Elevation" },
  { place: { page: "motion" }, label: "Motion" },
  { place: { page: "icons" }, label: "Icons" },
  { place: { page: "components" }, label: "Components" },
  { place: { page: "patterns" }, label: "Patterns" },
  { place: { page: "history" }, label: "Versions" },
];

/** A place's name: its section or lab. */
export function placeLabel(place: Place): string {
  if (place.page === "settings" || place.page === "foundations") return "Themes";
  return ({ home: "Home", themes: "Themes", "theme-setup": "New theme", tokens: "Tokens", color: "Colors", typography: "Typography", icons: "Icons",
    spacing: "Spacing", shape: "Shape", elevation: "Elevation", motion: "Motion",
    components: "Components", patterns: "Patterns", history: "Versions", references: "References", materials: "Materials", tests: "Tests", feed: "Feed",
    project: "Overview", "project-page": "Page", exploration: "Exploration", versions: "Versions" } as Record<PageId, string>)[place.page];
}
/** What a page's list holds, for its filter's placeholder. */
const LISTED: Partial<Record<PageId, string>> = { tokens: "tokens", color: "scales", typography: "typefaces and roles", icons: "icons", components: "components",
  patterns: "patterns", references: "collections", materials: "bundles", tests: "tests" };

/** Same section, whatever is chosen on it. New theme, and an old Foundations link, are under Themes. */
const sectionOf = (place: Place) => place.page === "theme-setup" || place.page === "foundations" || place.page === "settings" ? "themes" : place.page;
const samePage = (a: Place, b: Place) => sectionOf(a) === sectionOf(b);

export function AppTabs({ tabs, current, onSelect, onClose, onNew }: {
  tabs: ReadonlyArray<{ id: string; place: Place }>; current: string; onSelect: (id: string) => void; onClose: (id: string) => void; onNew: () => void;
}) {
  // Past the bar's room the tabs scroll; the current one is brought into view when it changes or a tab opens.
  const nav = useRef<HTMLElement>(null);
  // A tab whose name is cut (at 170, or faded under its close) shows the whole name in a Tooltip; one that fits shows none.
  const [named, setNamed] = useState<string | null>(null);
  const isCut = (id: string) => {
    const text = nav.current?.querySelector<HTMLElement>(`[data-tab="${id}"] .area-nav__text`);
    if (!text) return false;
    if (text.scrollWidth > text.clientWidth + 1) return true;
    const words = document.createRange();
    words.selectNodeContents(text);
    const close = text.closest(".area-nav__row")?.querySelector("button")?.getBoundingClientRect();
    // On hover the close shows, so a name running under it is cut too (the fade ends 4 before its plate).
    return Boolean(close && words.getBoundingClientRect().right > close.left - 4);
  };
  useEffect(() => { nav.current?.querySelector("[aria-current]")?.scrollIntoView({ block: "nearest", inline: "nearest" }); }, [current, tabs.length]);
  return (
    <div className="studio-titlebar__tabs">
    <Nav ref={nav} orientation="horizontal" aria-label="Open tabs" className="studio-titlebar__nav"
      // A mouse wheel's vertical turn scrolls the tabs sideways (Cursor's and Chrome's tab strips); a trackpad's own
      // sideways scroll passes through.
      onWheel={event => { if (nav.current && Math.abs(event.deltaY) > Math.abs(event.deltaX)) nav.current.scrollLeft += event.deltaY; }}>
      {tabs.map(tab => {
        const name = tabName(tab.place);
        // Home, always first: its icon alone in a square plate, never closed (Figma's file browser tab, 40 wide, the
        // icon centred). It names itself in a Tooltip with ⌘⇧H.
        if (tab.id === HOME_TAB) return (
          <Tooltip key={tab.id} side="bottom" describes={false} trigger={
            <NavItem data-tab={tab.id} href={hrefOf(tab.place)} current={tab.id === current} icon={TAB_ICONS.home} aria-label="Home" aria-keyshortcuts="Meta+Shift+H"
              onClick={event => { event.preventDefault(); onSelect(tab.id); }} />
          }>Home <Kbd keys={["⌘", "⇧", "H"]} size="sm" /></Tooltip>
        );
        // Every other tab closes, the last one too: Home is then the tab left.
        const close = () => onClose(tab.id);
        return (
          <Tooltip key={tab.id} side="bottom" describes={false} open={named === tab.id} onOpenChange={next => setNamed(next && isCut(tab.id) ? tab.id : null)} trigger={
          <NavItem className="studio-tab" data-tab={tab.id} href={hrefOf(tab.place)} current={tab.id === current} icon={TAB_ICONS[tabKind(tab.place)]}
            onClick={event => { event.preventDefault(); onSelect(tab.id); }}
            // A middle click closes a tab, as a browser's. The close shows on the current tab, on hover and on focus, and
            // always on touch (Nav revealActions; Tree view's rule, Cursor's and Figma's file tabs), over the name's end.
            onAuxClick={event => { if (event.button === 1) { event.preventDefault(); close(); } }}
            // The close names itself in a Tooltip (product UI rule 4), with ⌘W on the current tab; it stays out of the Tab
            // order (one stop a tab), and ⌘W closes from the keyboard.
            revealActions actions={<Tooltip side="bottom" describes={false} trigger={
              <Button size="sm" variant="ghost" tone="neutral" iconOnly icon={<DismissIcon />} aria-label={`Close ${name}`} aria-keyshortcuts={tab.id === current ? "Meta+W" : undefined} tabIndex={-1} onClick={close} />
            }>Close tab{tab.id === current ? <> <Kbd keys={["⌘", "W"]} size="sm" /></> : null}</Tooltip>}>
            {name}
          </NavItem>
          }>{name}</Tooltip>
        );
      })}
    </Nav>
    {/* A new tab starts at search: the choice opens in it (Arc's new tab). Home is the fixed first tab, so a new tab
        opening Home would be a second one (2026-10-29). */}
    <ChromeButton label="New tab" keys={["⌘", "T"]} shortcut="Meta+T" icon={<AddIcon />} onClick={onNew} />
    </div>
  );
}

/** An expandable row's chevron: the row's children open and close (Nav's expandable item, docs/specs/nav.md). */
function Expander({ open, label, controls, onToggle }: { open: boolean; label: string; controls: string; onToggle: () => void }) {
  return <Button size="sm" variant="ghost" iconOnly icon={<ChevronDownIcon />} aria-label={label} aria-expanded={open} aria-controls={controls} onClick={onToggle} />;
}

/** The Sidebar's nav for the current tab: the workspace in Home's tab (and a lab's), else the tab's tree. */
export function AppNav() {
  const { place } = useStudio();
  const kind = tabKind(place);
  return kind === "system" ? <SystemNav /> : kind === "project" ? <ProjectNav /> : kind === "references" ? <ReferencesNav /> : <WorkspaceNav />;
}

/** Opens a place from a nav row: in the tab holding it (src/studio.tsx `navigate`), ⌘-click in a new one. */
function useOpen() {
  const { navigate } = useStudio();
  return (target: Place) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // A page with its own list opens it in the Sidebar's place (the takeover).
    navigate(target, { newTab: event.metaKey || event.ctrlKey, panel: LIST_PAGES.has(target.page) ? "page" : "nav" });
  };
}

/** The first row of a tab's tree: back to the workspace, in Home's tab. */
function BackHome() {
  const open = useOpen();
  return (
    <NavGroup>
      <NavItem href={hrefOf({ page: "home" })} icon={<ArrowLeftIcon />} onClick={open({ page: "home" })}>Home</NavItem>
    </NavGroup>
  );
}

/**
 * The workspace: Home and References, then the projects and the systems, each opening in its own tab. Home and References
 * are the two places beside the work (owner, 2026-10-31: "the public facing explore page should just be elevated next to
 * home"). Systems was the Library until 2026-10-31 (owner: "rename library to systems … so we just have projects and
 * systems, anything live or published can just remain as either a project or a system").
 */
function WorkspaceNav() {
  const { place, systems, projects } = useStudio();
  const open = useOpen();
  return (
    <SidebarList>
      <Nav aria-label="Workspace">
        <NavGroup>
          <NavItem href={hrefOf({ page: "home" })} icon={<HomeIcon />} current={place.page === "home"} onClick={open({ page: "home" })}>Home</NavItem>
          <NavItem href={hrefOf({ page: "references" })} icon={TAB_ICONS.references} onClick={open({ page: "references" })}>References</NavItem>
        </NavGroup>
        <NavGroup label="Projects">
          {projects.map(project => (
            <NavItem key={project.id} href={hrefOf({ page: "project", project: project.id })} icon={TAB_ICONS.project} onClick={open({ page: "project", project: project.id })}>
              {project.name}
            </NavItem>
          ))}
          <NavItem href={hrefOf({ page: "home", item: "new-project" })} icon={<AddIcon />} onClick={open({ page: "home", item: "new-project" })}>New project</NavItem>
        </NavGroup>
        <NavGroup label="Systems">
          {systems.map(system => (
            <NavItem key={system.id} href={hrefOf({ page: "themes", system: system.id })} icon={TAB_ICONS.system} onClick={open({ page: "themes", system: system.id })}>{system.name}</NavItem>
          ))}
          <NavItem href={hrefOf({ page: "home", item: "new" })} icon={<AddIcon />} onClick={open({ page: "home", item: "new" })}>New system</NavItem>
        </NavGroup>
      </Nav>
    </SidebarList>
  );
}

/** References' tab: Discover, Following and Saved, one row each (no counts, as a system's rows). */
function ReferencesNav() {
  const { place } = useStudio();
  const open = useOpen();
  const view = referenceView(place.item);
  return (
    <SidebarList>
      <Nav aria-label="References">
        <BackHome />
        <NavGroup label="References">
          {REFERENCE_VIEWS.map(entry => {
            const target: Place = { page: "references", item: entry.item };
            return (
              <NavItem key={entry.label} href={hrefOf(target)} onClick={open(target)}
                current={entry.item ? view === entry.item : !view && !place.item}>
                {entry.label}
              </NavItem>
            );
          })}
        </NavGroup>
      </Nav>
    </SidebarList>
  );
}

/** The families by kind, in Components' own order (its Documentation files; src/pages/components.tsx kindOf). */
const FAMILIES_BY_KIND: ReadonlyArray<[string, typeof FAMILIES]> = KIND_ORDER
  .map(kind => [kind, [...FAMILIES].filter(family => kindOf(family) === kind).sort((a, b) => a.name.localeCompare(b.name))] as [string, typeof FAMILIES])
  .filter(([, list]) => list.length > 0);

/**
 * A system's tab, after the design systems' own sites (research 2026-10-31: Primer, Carbon, Atlassian, Material, Apple's
 * HIG, Spectrum; owner: "i dont like seeing components with 122 next to it … maybe components should be exposed"):
 * Foundations (the language: Themes, Tokens, Colors, Typography, Spacing, Shape, Elevation, Motion, Icons), then Components, every family by name under its kind
 * (Atlassian's and the HIG's groups past ~80 families; Primer and Carbon list theirs flat under ~60), each kind a row that
 * opens to its families, the current family's kind open; then Patterns and Versions. No row carries a bare count: Versions
 * says what is unpublished, which is news, not a size.
 */
function SystemNav() {
  const { place, workingSystem, changes } = useStudio();
  const open = useOpen();
  const ids = useId();
  const at = (target: Place): Place => ({ ...target, system: workingSystem.id });
  const row = (target: Place, label: string, trailing?: ReactNode) => (
    <NavItem key={label} href={hrefOf(at(target))} current={samePage(target, place)} onClick={open(at(target))} trailing={trailing}>{label}</NavItem>
  );
  // The family on the Canvas (a family, or one of its tiles), and its kind, which stays open.
  const family = place.page === "components" ? place.item?.split("/")[0] : undefined;
  const currentKind = family ? FAMILIES_BY_KIND.find(([, list]) => list.some(entry => entry.slug === family))?.[0] : undefined;
  const [opened, setOpened] = useState<ReadonlySet<string>>(() => new Set());
  const [closed, setClosed] = useState<ReadonlySet<string>>(() => new Set());
  const isOpen = (kind: string) => opened.has(kind) || (kind === currentKind && !closed.has(kind));
  const toggle = (kind: string) => {
    const next = !isOpen(kind);
    setOpened(current => { const set = new Set(current); if (next) set.add(kind); else set.delete(kind); return set; });
    setClosed(current => { const set = new Set(current); if (next) set.delete(kind); else set.add(kind); return set; });
  };
  return (
    <SidebarList>
      <Nav aria-label={workingSystem.name}>
        <BackHome />
        {/* The language, after the design systems' Foundations and Figma's variables and styles (2026-10-31): Themes, then
            every token, then each foundation the tokens make, then Icons. */}
        <NavGroup label="Foundations">
          {SYSTEM_SECTIONS.slice(0, SYSTEM_SECTIONS.findIndex(entry => entry.place.page === "components")).map(entry => row(entry.place, entry.label))}
        </NavGroup>
        <NavGroup label="Components">
          {/* Every family at once, by kind (the Overview's sections). */}
          <NavItem href={hrefOf(at({ page: "components" }))} current={place.page === "components" && !family} onClick={open(at({ page: "components" }))}>Overview</NavItem>
          {FAMILIES_BY_KIND.map(([kind, list]) => {
            const shown = isOpen(kind);
            const families = `${ids}-${kind.replace(/\W+/g, "-")}`;
            return (
              <Fragment key={kind}>
                <NavItem href={hrefOf(at({ page: "components" }))}
                  onClick={event => { event.preventDefault(); toggle(kind); }}
                  actions={<Expander open={shown} label={kind} controls={families} onToggle={() => toggle(kind)} />}>
                  {kind}
                </NavItem>
                <div id={families} hidden={!shown}>
                  <NavGroup nested>
                    {list.map(entry => {
                      const target = at({ page: "components", item: entry.slug });
                      return <NavItem key={entry.slug} href={hrefOf(target)} current={family === entry.slug} onClick={open(target)}>{entry.name}</NavItem>;
                    })}
                  </NavGroup>
                </div>
              </Fragment>
            );
          })}
        </NavGroup>
        <NavGroup>
          {row({ page: "patterns" }, "Patterns")}
          {/* A system's release notes, Versions as a project's are (History until 2026-10-31: one word for one idea). While
              the draft has changes, it says how many are waiting. */}
          {row({ page: "history" }, "Versions", changes.length ? <span className="studio-muted">{changes.length} unpublished</span> : undefined)}
        </NavGroup>
      </Nav>
    </SidebarList>
  );
}

/** A project's tab: its overview, its pages (each opening to its layers), its explorations and its versions. */
function ProjectNav() {
  const { place, openProject, openSystem, updateProject, navigate } = useStudio();
  const open = useOpen();
  const ids = useId();
  const [pageId, layerId] = place.page === "project-page" ? (place.item ?? "").split("/") : [];
  // Every page with layers starts open; a chevron closes it.
  const [closed, setClosed] = useState<ReadonlySet<string>>(() => new Set());
  if (!openProject) return <WorkspaceNav />;
  const project = openProject.id;
  const newPage = () => {
    const made = addPage(openProject);
    updateProject(project, () => made.project);
    navigate({ page: "project-page", project, item: made.page.id });
  };
  // An exploration starts from the theme the project uses, as published.
  const newExploration = () => {
    const from = openSystem.themes.find(entry => entry.id === openProject.theme) ?? activeTheme(openSystem);
    const made = addExploration(openProject, from);
    updateProject(project, () => made.project);
    navigate({ page: "exploration", project, item: made.exploration.id });
  };
  const toggle = (id: string) => setClosed(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  return (
    <SidebarList>
      <Nav aria-label={openProject.name}>
        <BackHome />
        <NavGroup label={openProject.name}>
          <NavItem href={hrefOf({ page: "project", project })} icon={<LayoutIcon />} current={place.page === "project"} onClick={open({ page: "project", project })}>Overview</NavItem>
        </NavGroup>
        <NavGroup label="Pages">
          {openProject.pages.map(page => {
            const shown = !closed.has(page.id) && page.layers.length > 0;
            const layers = `${ids}-${page.id}`;
            return (
              <Fragment key={page.id}>
                <NavItem href={hrefOf({ page: "project-page", project, item: page.id })} icon={<DocumentIcon />}
                  current={pageId === page.id && !layerId} onClick={open({ page: "project-page", project, item: page.id })}
                  trailing={page.layers.length ? <Count variant="soft" size="sm" count={page.layers.length} /> : undefined}
                  actions={page.layers.length ? <Expander open={shown} label={`${page.name}'s layers`} controls={layers} onToggle={() => toggle(page.id)} /> : undefined}>
                  {page.name}
                </NavItem>
                <div id={layers} hidden={!shown}>
                  <NavGroup nested>
                    {page.layers.map(layer => (
                      <NavItem key={layer.id} href={hrefOf({ page: "project-page", project, item: `${page.id}/${layer.id}` })}
                        icon={layer.kind === "image" ? <ImageIcon /> : <LayoutIcon />}
                        current={pageId === page.id && layerId === layer.id} onClick={open({ page: "project-page", project, item: `${page.id}/${layer.id}` })}>
                        {layer.name}
                      </NavItem>
                    ))}
                  </NavGroup>
                </div>
              </Fragment>
            );
          })}
          <NavItem href={hrefOf({ page: "project", project })} icon={<AddIcon />} onClick={event => { event.preventDefault(); newPage(); }}>New page</NavItem>
        </NavGroup>
        <NavGroup label="Explorations">
          {openProject.explorations.map(entry => (
            <NavItem key={entry.id} href={hrefOf({ page: "exploration", project, item: entry.id })} icon={<GitBranchIcon />}
              current={place.page === "exploration" && place.item === entry.id} onClick={open({ page: "exploration", project, item: entry.id })}
              trailing={<StatusBadge status={entry.published ? "published" : "draft"} iconOnly>{entry.published ? `Published in ${versionName(systemName(openProject.system), entry.published)}` : "Not published"}</StatusBadge>}>
              {entry.name}
            </NavItem>
          ))}
          <NavItem href={hrefOf({ page: "project", project })} icon={<AddIcon />} onClick={event => { event.preventDefault(); newExploration(); }}>New exploration</NavItem>
        </NavGroup>
        <NavGroup>
          <NavItem href={hrefOf({ page: "versions", project })} icon={<HistoryIcon />} current={place.page === "versions"} onClick={open({ page: "versions", project })}
            trailing={<Count variant="soft" size="sm" count={openProject.versions.length} />}>
            Versions
          </NavItem>
        </NavGroup>
      </Nav>
    </SidebarList>
  );
}

/**
 * A page's list under the nav (owner, 2026-10-30: "the nav is laggy and the actual nav items are too hidden behind multiple
 * clicks"; was a Takeover, which replaced the nav and needed a Back row before any other section): the tab's nav
 * stays at the Sidebar's top, one click to every section, and the open section's list follows it under its filter, as
 * Figma's pages sit above its layers.
 */
export function PageList({ children }: { children: ReactNode }) {
  const { place, query, setQuery } = useStudio();
  const listed = LISTED[place.page] ?? placeLabel(place).toLowerCase();
  return (
    <div className="studio-page-list">
      <SidebarList>
        <SearchField size="sm" variant="soft" fullWidth className="studio-takeover__filter" value={query} onValueChange={setQuery}
          placeholder={`Filter ${listed}`} aria-label={`Filter ${listed}`} />
      </SidebarList>
      {children}
    </div>
  );
}

