/**
 * The app's navigation (docs/research/app-structure-2026-10-28/README.md; the shell is variation A, owner 2026-10-28):
 *
 *   AppTabs   the Titlebar's open tabs, as a browser's: Home first (icon only, never closed: Figma's file browser tab),
 *             then one per open project, Library item (a system, Inspiration) or lab, its type icon, name and close, then
 *             New tab (owner, 2026-10-29: "i like the floating tab component from claude codes browser")
 *   AppNav    the Sidebar's nav, the tab's own (owner, 2026-10-29: "tabs can be libraries or projects … those will be
 *             accessed through the left nav, but the tab itself … will always just be the project itself"): in Home's tab
 *             the workspace (Home, then Projects and the Library, a row each); in a system's tab its sections, in a
 *             project's its overview, pages and their layers, explorations and versions, each under a back row to Home.
 *             A click opens in the tab holding what it names (this one, or another), ⌘-click in a new one
 *   PageList  a page's own list under the nav (Components' families, Icons' categories, the Library's groups), under
 *             its filter; the nav stays (2026-10-30; was a takeover of the Sidebar under a back row)
 *
 * Explore comes with the phase that builds it; until then it is left out (product UI rule 16), as is the person's row.
 * New project and New system are their sections' last rows (Home's dialogs).
 */
import { Fragment, useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Button, Count, Kbd, Nav, NavGroup, NavItem, SearchField, Tooltip } from "@area/react";
import { AddIcon, ArrowLeftIcon, ChevronDownIcon, DismissIcon, DocumentIcon, FlaskIcon, FolderIcon, GitBranchIcon, HistoryIcon, HomeIcon, ImageIcon, ImagesIcon, LayoutIcon, PaletteIcon } from "@area/icons";
import { systemName, HOME_TAB, hrefOf, LIST_PAGES, projectName, tabKind, tabName, type PageId, type Place, type TabKind } from "./places.ts";
import { addExploration, addPage } from "./projects.ts";
import { activeTheme, versionName } from "./systems.ts";
import { ChromeButton, SidebarList, useStudio } from "./studio.tsx";
import { FAMILIES } from "./pages/components.tsx";
import { PATTERNS } from "./pages/examples.tsx";

const TAB_ICONS: Record<TabKind, ReactNode> = { home: <HomeIcon />, system: <PaletteIcon />, project: <FolderIcon />, inspiration: <ImagesIcon />, labs: <FlaskIcon /> };

/**
 * A system's sections, one row each and one click away (owner, 2026-10-30: "foundations is not very well organized ... the
 * actual nav items are too hidden behind multiple clicks. i want to simplify the design system overall. each system is one
 * thing with components, colors, typography, icons, patterns, etc underneath it"). Foundations and its setting-group pages
 * are gone: a theme's settings are edited on Themes (its Playground), so an old Foundations link opens Themes, on the
 * setting it named.
 */
export const SYSTEM_SECTIONS: ReadonlyArray<{ place: Place; label: string }> = [
  { place: { page: "themes" }, label: "Themes" },
  { place: { page: "color" }, label: "Colors" },
  { place: { page: "typography" }, label: "Typography" },
  { place: { page: "icons" }, label: "Icons" },
  { place: { page: "components" }, label: "Components" },
  { place: { page: "patterns" }, label: "Patterns" },
  { place: { page: "history" }, label: "History" },
];

/** A place's name: its section or lab. */
export function placeLabel(place: Place): string {
  if (place.page === "settings" || place.page === "foundations") return "Themes";
  return ({ home: "Home", themes: "Themes", "theme-setup": "New theme", color: "Colors", typography: "Typography", icons: "Icons",
    components: "Components", patterns: "Patterns", history: "History", inspiration: "Inspiration", materials: "Materials", tests: "Tests",
    project: "Overview", "project-page": "Page", exploration: "Exploration", versions: "Versions" } as Record<PageId, string>)[place.page];
}
/** What a page's list holds, for its filter's placeholder. */
const LISTED: Partial<Record<PageId, string>> = { color: "scales", typography: "roles", icons: "icons", components: "components",
  patterns: "patterns", inspiration: "images", materials: "bundles", tests: "tests" };

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

/** The Sidebar's nav for the current tab: the workspace in Home's tab (and Inspiration's and a lab's), else the tab's tree. */
export function AppNav() {
  const { place } = useStudio();
  const kind = tabKind(place);
  return kind === "system" ? <SystemNav /> : kind === "project" ? <ProjectNav /> : <WorkspaceNav />;
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

/** The workspace: Home, then the projects and the Library (each system, and Inspiration), each opening in its own tab. */
function WorkspaceNav() {
  const { place, systems, projects } = useStudio();
  const open = useOpen();
  return (
    <SidebarList>
      <Nav aria-label="Workspace">
        <NavGroup>
          <NavItem href={hrefOf({ page: "home" })} icon={<HomeIcon />} current={place.page === "home"} onClick={open({ page: "home" })}>Home</NavItem>
        </NavGroup>
        <NavGroup label="Projects">
          {projects.map(project => (
            <NavItem key={project.id} href={hrefOf({ page: "project", project: project.id })} icon={TAB_ICONS.project} onClick={open({ page: "project", project: project.id })}>
              {project.name}
            </NavItem>
          ))}
          <NavItem href={hrefOf({ page: "home", item: "new-project" })} icon={<AddIcon />} onClick={open({ page: "home", item: "new-project" })}>New project</NavItem>
        </NavGroup>
        <NavGroup label="Library">
          {systems.map(system => (
            <NavItem key={system.id} href={hrefOf({ page: "themes", system: system.id })} icon={TAB_ICONS.system} onClick={open({ page: "themes", system: system.id })}>{system.name}</NavItem>
          ))}
          <NavItem href={hrefOf({ page: "inspiration" })} icon={TAB_ICONS.inspiration} current={place.page === "inspiration"} onClick={open({ page: "inspiration" })}>Inspiration</NavItem>
          <NavItem href={hrefOf({ page: "home", item: "new" })} icon={<AddIcon />} onClick={open({ page: "home", item: "new" })}>New system</NavItem>
        </NavGroup>
      </Nav>
    </SidebarList>
  );
}

/** A system's tab: its sections, one row each (SYSTEM_SECTIONS), Themes first and History last. */
function SystemNav() {
  const { place, openSystem, workingSystem, changes } = useStudio();
  const open = useOpen();
  const at = (target: Place): Place => ({ ...target, system: workingSystem.id });
  const row = (target: Place, label: string, trailing?: ReactNode, actions?: ReactNode) => (
    <NavItem key={label} href={hrefOf(at(target))} current={samePage(target, place)} onClick={open(at(target))} trailing={trailing} actions={actions}>{label}</NavItem>
  );
  return (
    <SidebarList>
      <Nav aria-label={workingSystem.name}>
        <BackHome />
        <NavGroup label={workingSystem.name}>
          {row({ page: "themes" }, "Themes", <Count count={openSystem.themes.length} />)}
          {row({ page: "color" }, "Colors")}
          {row({ page: "typography" }, "Typography")}
          {row({ page: "icons" }, "Icons")}
          {row({ page: "components" }, "Components", <Count count={FAMILIES.length} max={9999} />)}
          {row({ page: "patterns" }, "Patterns", <Count count={PATTERNS.length} />)}
          {/* History counts the publishes; while the working copy has changes, it says how many are waiting. */}
          {row({ page: "history" }, "History", changes.length ? <span className="studio-muted">{changes.length} unpublished</span> : <Count count={workingSystem.releases.length} />)}
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
                  trailing={page.layers.length ? <Count count={page.layers.length} /> : undefined}
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
              trailing={entry.published ? <span className="studio-muted">{versionName(systemName(openProject.system), entry.published)}</span> : undefined}>
              {entry.name}
            </NavItem>
          ))}
          <NavItem href={hrefOf({ page: "project", project })} icon={<AddIcon />} onClick={event => { event.preventDefault(); newExploration(); }}>New exploration</NavItem>
        </NavGroup>
        <NavGroup>
          <NavItem href={hrefOf({ page: "versions", project })} icon={<HistoryIcon />} current={place.page === "versions"} onClick={open({ page: "versions", project })}
            trailing={<Count count={openProject.versions.length} />}>
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

