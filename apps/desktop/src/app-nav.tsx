/**
 * The app's navigation (docs/research/app-structure-2026-10-28/README.md; the shell is variation A, owner 2026-10-28):
 *
 *   AppTabs   the Titlebar's open tabs, as a browser's: Home first (icon only, never closed: Figma's file browser tab),
 *             then References, one per open project, system or lab, its type icon, name and close, then
 *             New tab (owner, 2026-10-29: "i like the floating tab component from claude codes browser")
 *   AppNav    the Sidebar's nav, one tree in every tab (owner, 2026-11-01; it was each tab's own from 2026-10-29 to
 *             11-01, under a back row to Home): Home and References, then Projects and Systems, each item opening in
 *             place to its sections. A click opens in the tab holding what it names (this one, or another), ⌘-click in
 *             a new one (owner, 2026-10-29: "the tab itself … will always just be the project itself")
 *   PageList  a page's own list, right under its project or system in the tree (Components' families, a page's layers,
 *             Icons' categories), or leading the scroll (References' collections), under its head, a name and a search icon (2026-11-01; under
 *             the nav from 2026-10-30, a takeover of the Sidebar under a back row before that)
 *
 * References (owner, 2026-10-31: Explore renamed "since its a collection of all designs, images, etc") is what others share
 * (Discover, Following) and what you keep (Saved, its collections), one place beside Home.
 * New project and New system are their groups' + (Home's dialogs); with no project yet, New project is the group's row.
 */
import { useEffect, useId, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Button, ConfirmDialog, ContextMenu, Count, Kbd, Menu, MenuItem, MenuSeparator, Nav, NavGroup, NavItem, ScrollArea, SearchField, Tooltip } from "@area/react";
import { AddIcon, BookmarkIcon, ChevronDownIcon, CopyIcon, DismissIcon, DocumentIcon, FlaskIcon, FolderIcon, GitBranchIcon, HistoryIcon, HomeIcon, LayoutIcon, MoreHorizontalIcon, PencilIcon, SearchIcon, SystemIcon } from "@area/icons";
import { systemName, HOME_TAB, hrefOf, LIST_PAGES, projectName, REFERENCE_VIEWS, referenceView, resolve, tabHolds, tabKind, tabName, type PageId, type Place, type TabKind } from "./places.ts";
import { addExploration, addPage, deletePage, duplicatePage, renamePage, type Project, type ProjectPage } from "./projects.ts";
import { NameDialog } from "./pages/home.tsx";
import { readStored, writeStored } from "./storage.ts";
import { activeTheme, versionName } from "./systems.ts";
import { ChromeButton, SidebarList, useStudio, type Visit } from "./studio.tsx";
import { StatusBadge } from "./tile.tsx";

// A system is the triangle, square and circle (owner, 2026-10-31: "a simple composition of triangle square, and circle";
// never the palette, and not the four-diamond component); its own drawing is being made in the icon set.
const TAB_ICONS: Record<TabKind, ReactNode> = { home: <HomeIcon />, system: <SystemIcon />, project: <FolderIcon />, references: <BookmarkIcon />, projects: <FolderIcon />, systems: <SystemIcon />, labs: <FlaskIcon /> };

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
  { place: { page: "illustrations" }, label: "Illustrations" },
  { place: { page: "components" }, label: "Components" },
  { place: { page: "patterns" }, label: "Patterns" },
  { place: { page: "history" }, label: "Versions" },
];

/** A place's name: its section or lab. */
export function placeLabel(place: Place): string {
  if (place.page === "settings" || place.page === "foundations") return "Themes";
  return ({ home: "Home", projects: "Projects", systems: "Systems", themes: "Themes", "theme-setup": "New theme", tokens: "Tokens", color: "Colors", typography: "Typography", icons: "Icons", illustrations: "Illustrations",
    spacing: "Spacing", shape: "Shape", elevation: "Elevation", motion: "Motion",
    components: "Components", patterns: "Patterns", history: "Versions", references: "References", materials: "Materials", tests: "Tests", feed: "Feed",
    project: "Overview", "project-page": "Page", exploration: "Exploration", versions: "Versions" } as Record<PageId, string>)[place.page];
}
/** What a page's list holds, for its head's name and its filter's placeholder. */
const LISTED: Partial<Record<PageId, string>> = { tokens: "tokens", color: "scales", typography: "typefaces and roles", icons: "icons", illustrations: "illustrations", components: "components", "project-page": "layers",
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

/** Opens a place from a nav row: in the tab holding it (src/studio.tsx `navigate`), ⌘-click in a new one. */
function useOpen() {
  const { navigate } = useStudio();
  return (target: Place) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate(target, { newTab: event.metaKey || event.ctrlKey, panel: LIST_PAGES.has(target.page) ? "page" : "nav" });
  };
}

/** The foundations a system's Foundations row opens to (SYSTEM_SECTIONS between Themes and Components). */
const FOUNDATION_SECTIONS = SYSTEM_SECTIONS.slice(1, SYSTEM_SECTIONS.findIndex(entry => entry.place.page === "components"));
const isFoundation = (place: Place) => FOUNDATION_SECTIONS.some(entry => samePage(entry.place, place));

/** The row that holds the current page, opened when the page changes: Foundations, Pages or Explorations. */
function revealOf(place: Place): string | null {
  const kind = tabKind(place);
  if (kind === "project") return place.page === "project-page" ? `project:${place.project}/pages` : place.page === "exploration" ? `project:${place.project}/explorations` : null;
  if (kind === "system") return isFoundation(place) ? `system:${place.system ?? "area"}/foundations` : null;
  return null;
}

/**
 * Which rows are open (Foundations, Pages, Explorations), kept across tabs and launches. Opening a section folds the
 * project's or system's others and opens the one holding the page, so its list starts high (owner pick r4-fold,
 * 2026-11-01: "only the section holding the page stays open"; until then what you left open stayed open). A row opened
 * by hand stays open until the section changes.
 */
function useFolds() {
  const { place } = useStudio();
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set(readStored<string[]>("nav-open", [])));
  const save = (next: ReadonlySet<string>) => { setOpen(next); writeStored("nav-open", [...next]); };
  const reveal = revealOf(place);
  const kind = tabKind(place);
  const prefix = kind === "project" ? `project:${place.project}/` : kind === "system" ? `system:${place.system ?? "area"}/` : null;
  // Before paint, so a page never shows the row holding it folded for a frame.
  useLayoutEffect(() => {
    if (!prefix) return;
    setOpen(current => {
      const next = new Set([...current].filter(key => !key.startsWith(prefix)));
      if (reveal) next.add(reveal);
      if (next.size === current.size && [...next].every(key => current.has(key))) return current;
      writeStored("nav-open", [...next]);
      return next;
    });
  }, [`${tabHolds(place)}|${sectionOf(place)}|${reveal}`]);
  return {
    isOpen: (key: string) => open.has(key),
    toggle: (key: string) => { const next = new Set(open); if (next.has(key)) next.delete(key); else next.add(key); save(next); },
  };
}

/** A long run in the nav (a project's pages, its explorations) shows this many, then Show more. */
const CAP = 5; /* spec: Cursor's SidebarPaginatedMenu maxVisible */

/** The places opened lately, for Home's Recent (studio.tsx records each visit; Home's Continue reads the same). */
const RECENT = 8; /* pick */
const recentLabel = (place: Place) => {
  const kind = tabKind(place);
  const where = kind === "system" ? systemName(place.system) : kind === "project" ? projectName(place.project) : null;
  return [where, placeLabel(place)].filter(Boolean).join(" › ");
};
function recentPlaces(): Place[] {
  const saved = readStored<Visit[]>("recent", []);
  // One row a name: two families in Components are one "Area › Components".
  const seen = new Set<string>();
  return (Array.isArray(saved) ? saved : []).flatMap(visit => {
    const place = visit && typeof visit.hash === "string" ? resolve(visit.hash) : null;
    if (!place || place.page === "home" || seen.has(recentLabel(place))) return [];
    seen.add(recentLabel(place));
    return [place];
  }).slice(0, RECENT);
}

/**
 * The Sidebar's nav (owner, 2026-11-01: "what if the top header portion has home references projects and systems. then
 * there is a divider section and everything below that shows contextually what is supposed to be there"; research and
 * the rounds before in docs/research/consistent-nav-2026-11-01/): four places held at the top in every tab, as Claude's
 * sidebar holds its slots across Chat and Code, the one holding the current tab marked; then a rule; then, in one scroll,
 * what the tab holds:
 *
 *   Home        Recent: the places opened lately
 *   References  Discover, Following and Saved, then the collections (References' list)
 *   Projects    every project, and New project (the Projects tab's cards say the same)
 *   Systems     every system, and New system
 *   a project   its name, then Overview, Pages (its pages, New page), Explorations (New exploration) and Versions, then
 *               the open page's layers (its list)
 *   a system    its name, then Themes, Foundations (Tokens to Icons), Components, Patterns and Versions, then the open
 *               section's list (Components' families by kind, Colors' scales …)
 *   a lab       its list
 *
 * Each row opens in the tab holding what it names, ⌘-click in a new one (a tab never changes what it holds).
 */
export function AppNav({ children: list }: { children?: ReactNode }) {
  const { place, systems, projects, openProject, workingSystem, changes, openSystem, updateProject, navigate } = useStudio();
  const open = useOpen();
  const folds = useFolds();
  const ids = useId();
  const kind = tabKind(place);
  const domId = (key: string) => `${ids}-${key.replace(/[^\w-]+/g, "-")}`;
  // A row that only holds others (Foundations, Pages, Explorations) opens and closes on a click, as a kind did.
  const toggleOnly = (key: string) => (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); folds.toggle(key); };
  const expander = (key: string, label: string) => <Expander open={folds.isOpen(key)} label={label} controls={domId(key)} onToggle={() => folds.toggle(key)} />;
  // Children, kept in the tree but hidden while folded, so a chevron's aria-controls always names them.
  const children = (key: string, rows: ReactNode) => <div id={domId(key)} hidden={!folds.isOpen(key)}><NavGroup nested>{rows}</NavGroup></div>;
  // A long run shows 5, then Show more (owner pick r4-cap, 2026-11-01; Cursor's Agents sidebar, SidebarPaginatedMenu
  // maxVisible 5); the current one always shows.
  const [more, setMore] = useState<ReadonlySet<string>>(() => new Set());
  // A page's row menu (owner's pick, 2026-11-06: layer and page actions in the Sidebar's rows, as Figma's): the page a
  // Rename or Delete dialog is open for.
  const [pageAction, setPageAction] = useState<{ action: "rename" | "delete"; project: Project; page: ProjectPage } | null>(null);
  const capped = <T,>(key: string, entries: readonly T[], isCurrent: (entry: T) => boolean, draw: (entry: T) => ReactNode) => {
    const all = more.has(key);
    const shown = all ? entries : entries.filter((entry, index) => index < CAP || isCurrent(entry));
    const hidden = entries.length - shown.length;
    const flip = (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); setMore(current => { const next = new Set(current); if (all) next.delete(key); else next.add(key); return next; }); };
    return <>{shown.map(draw)}{hidden > 0 || (all && entries.length > CAP) ? <NavItem href="#" className="studio-muted" onClick={flip}>{all ? "Show less" : `Show ${hidden} more`}</NavItem> : null}</>;
  };

  // The scroll starts at the top in each tab; on a new section the current row is kept in view, and when the list
  // would start below the Sidebar's middle the current row comes to the top, so the list has most of the height
  // (owner, 2026-11-01: "make sure … the components section has enough room"). Choosing in the list leaves it be.
  const tree = useRef<HTMLElement>(null);
  useEffect(() => { const scroller = tree.current?.closest<HTMLElement>(".area-scroll-area__viewport"); if (scroller) scroller.scrollTop = 0; }, [tabHolds(place)]);
  useEffect(() => {
    const nav = tree.current;
    const scroller = nav?.closest<HTMLElement>(".area-scroll-area__viewport");
    // The context's own current row: not the list's, nor one inside a layer's picture.
    const current = nav?.querySelector<HTMLElement>(":is(.area-nav__item)[aria-current]:not(.studio-page-list *)");
    const listed = scroller?.querySelector<HTMLElement>(".studio-page-list");
    if (scroller && current && listed && listed.getBoundingClientRect().top - scroller.getBoundingClientRect().top > scroller.clientHeight / 2) current.scrollIntoView({ block: "start" });
    else current?.scrollIntoView({ block: "nearest" });
  }, [`${tabHolds(place)}|${sectionOf(place)}`]);

  // The list's chosen row (a layer, a tile) is brought into view when it changes or the tab opens, below the pinned rows
  // (owner pick r4-fixes, 2026-11-01: "the selected row is always in view"); after a frame, so a list that opens its
  // branches to reveal it has drawn them.
  useEffect(() => {
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => {
      const scroller = tree.current?.closest<HTMLElement>(".area-scroll-area__viewport") ?? document.querySelector<HTMLElement>(".studio-sidebar__scroll .area-scroll-area__viewport");
      const chosen = scroller?.querySelector<HTMLElement>(".studio-page-list :is(.area-nav__item, [role=\"treeitem\"])[aria-current]:not(.area-nav__picture *)");
      if (!scroller || !chosen) return;
      const view = scroller.getBoundingClientRect();
      const row = chosen.getBoundingClientRect();
      // The pinned stack (the name, the list's head, sticky branches) covers about the list's first third.
      if (row.top < view.top + view.height / 3 || row.bottom > view.bottom) scroller.scrollTop += row.top - (view.top + view.height / 2);
    }));
    return () => cancelAnimationFrame(frame);
  }, [hrefOf(place)]);

  const newPage = (project: Project) => {
    const made = addPage(project);
    updateProject(project.id, () => made.project);
    navigate({ page: "project-page", project: project.id, item: made.page.id });
  };
  // An exploration starts from the theme the project uses, as published.
  const newExploration = (project: Project) => {
    const system = systems.find(entry => entry.id === project.system) ?? openSystem;
    const from = system.themes.find(entry => entry.id === project.theme) ?? activeTheme(system);
    const made = addExploration(project, from);
    updateProject(project.id, () => made.project);
    navigate({ page: "exploration", project: project.id, item: made.exploration.id });
  };

  const pageMenu = (project: Project, page: ProjectPage) => <>
    <MenuItem icon={<PencilIcon />} onClick={() => setPageAction({ action: "rename", project, page })}>Rename</MenuItem>
    <MenuItem icon={<CopyIcon />} onClick={() => {
      const made = duplicatePage(project, page.id);
      updateProject(project.id, () => made.project);
      if (made.page) navigate({ page: "project-page", project: project.id, item: made.page.id });
    }}>Duplicate</MenuItem>
    {project.pages.length > 1 ? <><MenuSeparator /><MenuItem tone="danger" onClick={() => setPageAction({ action: "delete", project, page })}>Delete</MenuItem></> : null}
  </>;
  const pageDialog = pageAction ? (pageAction.action === "rename" ? (
    <NameDialog title="Rename page" action="Rename" initial={pageAction.page.name} onCancel={() => setPageAction(null)}
      onDone={name => { updateProject(pageAction.project.id, current => renamePage(current, pageAction.page.id, name)); setPageAction(null); }} />
  ) : (
    <ConfirmDialog open tone="danger" title={`Delete ${pageAction.page.name}?`} confirmLabel="Delete page"
      description={pageAction.page.layers.length ? `Its ${pageAction.page.layers.length === 1 ? "layer goes" : `${pageAction.page.layers.length} layers go`} with it. Iterations keep the page as it was, to go back to.` : "Iterations keep the page as it was, to go back to."}
      onOpenChange={next => { if (!next) setPageAction(null); }}
      onConfirm={() => {
        const { project, page } = pageAction;
        updateProject(project.id, current => deletePage(current, page.id));
        if (place.page === "project-page" && (place.item ?? "").split("/")[0] === page.id) navigate({ page: "project", project: project.id });
        setPageAction(null);
      }} />
  )) : null;

  const context = (): ReactNode => {
    if (kind === "home") {
      const recent = recentPlaces();
      return (
        <NavGroup label="Recent">
          {recent.length ? recent.map(entry => (
            <NavItem key={hrefOf(entry)} href={hrefOf(entry)} icon={TAB_ICONS[tabKind(entry)]} onClick={open(entry)}>{recentLabel(entry)}</NavItem>
          )) : <p className="studio-muted studio-sidebar__empty">The places you open appear here.</p>}
        </NavGroup>
      );
    }
    if (kind === "references") {
      const view = referenceView(place.item);
      return (
        <NavGroup>
          {REFERENCE_VIEWS.map(entry => {
            const target: Place = { page: "references", item: entry.item };
            return <NavItem key={entry.label} href={hrefOf(target)} onClick={open(target)} current={entry.item ? view === entry.item : !view}>{entry.label}</NavItem>;
          })}
        </NavGroup>
      );
    }
    if (kind === "projects") return (
      <NavGroup label="Projects">
        {projects.map(entry => (
          <NavItem key={entry.id} href={hrefOf({ page: "project", project: entry.id })} icon={TAB_ICONS.project} current={place.item === entry.id}
            onClick={open({ page: "project", project: entry.id })}>{entry.name}</NavItem>
        ))}
        <NavItem href={hrefOf({ page: "home", item: "new-project" })} icon={<AddIcon />} onClick={open({ page: "home", item: "new-project" })}>New project</NavItem>
      </NavGroup>
    );
    if (kind === "systems") return (
      <NavGroup label="Systems">
        {systems.map(entry => (
          <NavItem key={entry.id} href={hrefOf({ page: "themes", system: entry.id })} icon={TAB_ICONS.system} current={place.item === entry.id}
            onClick={open({ page: "themes", system: entry.id })}>{entry.name}</NavItem>
        ))}
        <NavItem href={hrefOf({ page: "home", item: "new" })} icon={<AddIcon />} onClick={open({ page: "home", item: "new" })}>New system</NavItem>
      </NavGroup>
    );
    if (kind === "project" && openProject) {
      const project = openProject;
      const key = `project:${project.id}`;
      const [pageId] = place.page === "project-page" ? (place.item ?? "").split("/") : [];
      const at = (target: Omit<Place, "project">): Place => ({ ...target, project: project.id });
      return (
        <ContextMenu menuLabel="Page actions" itemSelector="[data-page]"
          menu={row => { const page = project.pages.find(entry => entry.id === row.dataset.page); return page ? pageMenu(project, page) : null; }}>
        {pageDialog}
        <NavGroup label={project.name} sticky>
          <NavItem href={hrefOf(at({ page: "project" }))} icon={<LayoutIcon />} current={place.page === "project"} onClick={open(at({ page: "project" }))}>Overview</NavItem>
          {/* Pages, each a board of layers: the open page's layers are the list under the project. */}
          <NavItem href={hrefOf(at({ page: "project" }))} icon={<DocumentIcon />} current={place.page === "project-page" && !folds.isOpen(`${key}/pages`)}
            onClick={toggleOnly(`${key}/pages`)} actions={expander(`${key}/pages`, `${project.name}'s pages`)}>Pages</NavItem>
          {children(`${key}/pages`, <>
            {capped(`${key}/pages`, project.pages, page => pageId === page.id, page => (
              <NavItem key={page.id} data-page={page.id} href={hrefOf(at({ page: "project-page", item: page.id }))} current={pageId === page.id} onClick={open(at({ page: "project-page", item: page.id }))}
                trailing={page.layers.length ? <Count variant="soft" size="sm" count={page.layers.length} /> : undefined} revealActions
                actions={<Menu aria-label={`${page.name} actions`} align="start" trigger={<Button size="sm" variant="ghost" tone="neutral" iconOnly icon={<MoreHorizontalIcon />} aria-label={`${page.name} actions`} tabIndex={-1} />}>{pageMenu(project, page)}</Menu>}>
                {page.name}
              </NavItem>
            ))}
            <NavItem href={hrefOf(at({ page: "project" }))} icon={<AddIcon />} onClick={event => { event.preventDefault(); newPage(project); }}>New page</NavItem>
          </>)}
          <NavItem href={hrefOf(at({ page: "project" }))} icon={<GitBranchIcon />} current={place.page === "exploration" && !folds.isOpen(`${key}/explorations`)}
            onClick={toggleOnly(`${key}/explorations`)} actions={expander(`${key}/explorations`, `${project.name}'s explorations`)}>Explorations</NavItem>
          {children(`${key}/explorations`, <>
            {capped(`${key}/explorations`, project.explorations, entry => place.page === "exploration" && place.item === entry.id, entry => (
              <NavItem key={entry.id} href={hrefOf(at({ page: "exploration", item: entry.id }))}
                current={place.page === "exploration" && place.item === entry.id} onClick={open(at({ page: "exploration", item: entry.id }))}
                trailing={<StatusBadge status={entry.published ? "published" : "draft"} iconOnly>{entry.published ? `Published in ${versionName(systemName(project.system), entry.published)}` : "Not published"}</StatusBadge>}>
                {entry.name}
              </NavItem>
            ))}
            <NavItem href={hrefOf(at({ page: "project" }))} icon={<AddIcon />} onClick={event => { event.preventDefault(); newExploration(project); }}>New exploration</NavItem>
          </>)}
          <NavItem href={hrefOf(at({ page: "versions" }))} icon={<HistoryIcon />} current={place.page === "versions"} onClick={open(at({ page: "versions" }))}
            trailing={project.versions.length ? <Count variant="soft" size="sm" count={project.versions.length} /> : undefined}>Versions</NavItem>
          {list}
        </NavGroup>
        </ContextMenu>
      );
    }
    if (kind === "system") {
      const system = systems.find(entry => entry.id === (place.system ?? "area")) ?? workingSystem;
      const key = `system:${system.id}`;
      const at = (target: Place): Place => ({ ...target, system: system.id });
      const row = (target: Place, label: string, trailing?: ReactNode) => (
        <NavItem key={label} href={hrefOf(at(target))} current={samePage(target, place)} onClick={open(at(target))} trailing={trailing}>{label}</NavItem>
      );
      // A system's sections, the same words under every system (owner, 2026-10-30: "each system is one thing with
      // components, colors, typography, icons, patterns, etc underneath it"): Themes, the foundations the tokens make
      // under one row, Components, Patterns, and Versions, which says what is unpublished, news rather than a size.
      return (
        <NavGroup label={system.name} sticky>
          {row(SYSTEM_SECTIONS[0]!.place, SYSTEM_SECTIONS[0]!.label)}
          <NavItem href={hrefOf(at(FOUNDATION_SECTIONS[0]!.place))} current={isFoundation(place) && !folds.isOpen(`${key}/foundations`)}
            onClick={toggleOnly(`${key}/foundations`)} actions={expander(`${key}/foundations`, `${system.name}'s foundations`)}>Foundations</NavItem>
          {children(`${key}/foundations`, FOUNDATION_SECTIONS.map(entry => row(entry.place, entry.label)))}
          {row({ page: "components" }, "Components")}
          {row({ page: "patterns" }, "Patterns")}
          {row({ page: "history" }, "Versions", changes.length ? <span className="studio-muted">{changes.length} unpublished</span> : undefined)}
          {list}
        </NavGroup>
      );
    }
    return null;
  };

  // The four places: the one holding the current tab is marked (a project's tab marks Projects).
  const placeRow = (target: Place, label: string, icon: ReactNode, holds: ReadonlyArray<TabKind>) => (
    <NavItem href={hrefOf(target)} icon={icon} current={holds.includes(kind)} onClick={open(target)}>{label}</NavItem>
  );
  const rows = context();
  return (<>
    <SidebarList>
      <Nav aria-label="Places">
        <NavGroup>
          {placeRow({ page: "home" }, "Home", <HomeIcon />, ["home", "labs"])}
          {placeRow({ page: "references" }, "References", TAB_ICONS.references, ["references"])}
          {placeRow({ page: "projects" }, "Projects", TAB_ICONS.project, ["projects", "project"])}
          {placeRow({ page: "systems" }, "Systems", TAB_ICONS.system, ["systems", "system"])}
        </NavGroup>
      </Nav>
    </SidebarList>
    {/* Under the rule, one scroll: what the tab holds, then the page's own list (owner, 2026-11-01: "is it better if its
        not separated … everything is just in an endless scroll?"). */}
    <ScrollArea className="studio-sidebar__scroll">
      <div className="studio-sidebar__list studio-sidebar__workspace">
        {rows ? <Nav ref={tree} aria-label={kind === "project" ? openProject?.name : kind === "system" ? systemName(place.system) : tabName(place)}>{rows}</Nav> : null}
        {/* A project's or a system's list is inside its group, under its pinned name; the others' follow the rows. */}
        {kind === "project" || kind === "system" ? null : list}
      </div>
    </ScrollArea>
  </>);
}

/**
 * A page's list under the nav (owner, 2026-10-30: "the nav is laggy and the actual nav items are too hidden behind multiple
 * clicks"; was a Takeover, which replaced the nav and needed a Back row before any other section): the tab's nav
 * stays at the Sidebar's top, one click to every section, and the open section's list follows it under its heading, as
 * Figma's pages sit above its layers.
 *
 * The heading names the list and ends in a search icon (owner, 2026-11-01: "make the search an icon button and not full
 * width"; Figma's Layers and Cursor's Explorer heads): the icon or ⌥⌘F opens the filter in the heading's place, focused;
 * Escape or leaving it empty puts the heading back. A query keeps the field open, so a filtered list always says so.
 */
export function PageList({ children }: { children: ReactNode }) {
  const { place, query, setQuery } = useStudio();
  const listed = LISTED[place.page] ?? placeLabel(place).toLowerCase();
  const [filtering, setFiltering] = useState(false);
  const head = useRef<HTMLDivElement>(null);
  const shown = filtering || query !== "";
  // Escape hands focus back to the icon that opened the field (the Tooltip's trigger holds its own ref).
  const close = (focus: boolean) => { setFiltering(false); if (focus) requestAnimationFrame(() => head.current?.querySelector<HTMLElement>(".area-nav__actions button")?.focus()); };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code !== "KeyF" || !event.altKey || !(event.metaKey || event.ctrlKey) || event.shiftKey) return;
      event.preventDefault();
      setFiltering(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div ref={head} className="studio-page-list">
      <SidebarList>
        {shown ? (
          <SearchField size="sm" variant="soft" fullWidth className="studio-takeover__filter" value={query} onValueChange={setQuery} autoFocus
            placeholder={`Filter ${listed}`} aria-label={`Filter ${listed}`}
            onBlur={() => { if (!query) close(false); }}
            onKeyDown={event => { if (event.key === "Escape" && !event.currentTarget.value) { event.preventDefault(); close(true); } }} />
        ) : (
          <NavGroup className="studio-takeover__filter" label={listed.replace(/^./, letter => letter.toUpperCase())} role={undefined} aria-labelledby={undefined}
            actions={<Tooltip side="bottom" describes={false} trigger={
              <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<SearchIcon />} aria-label={`Filter ${listed}`}
                aria-keyshortcuts="Alt+Meta+F" onClick={() => setFiltering(true)} />
            }>Filter {listed} <Kbd keys={["⌥", "⌘", "F"]} size="sm" /></Tooltip>} />
        )}
      </SidebarList>
      {children}
    </div>
  );
}

