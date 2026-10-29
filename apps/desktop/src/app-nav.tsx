/**
 * The app's navigation (docs/research/app-structure-2026-10-28/README.md; the shell is variation A, owner 2026-10-28):
 *
 *   AppTabs   the Titlebar's open tabs, as a browser's: Home first (icon only, never closed: Figma's file browser tab),
 *             then one per open brand, Library or lab, its type icon, name and close, then New tab (owner, 2026-10-29:
 *             "i like the floating tab component from claude codes browser")
 *   AppNav    the Sidebar's nav: Home and the Library, then Brands, each brand a row, the open one expanded to its sections
 *             (Cursor's agents window nav); a click opens in the current tab, ⌘-click in a new one
 *   Takeover  a page's own list in the Sidebar's place (Components' families, Icons' categories, the Library's groups),
 *             under a back row to the nav and a filter
 *
 * Explore, Projects and Boards come with the phases that build them; until then they are left out (product UI rule 16),
 * as is the person's row. New brand is the Brands section's last row (Home's New brand).
 */
import { Fragment, useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Button, Count, Kbd, Nav, NavGroup, NavItem, SearchField, Tooltip } from "@area/react";
import { AddIcon, ArrowLeftIcon, ChevronDownIcon, DismissIcon, FlaskIcon, HomeIcon, LibraryIcon, PaletteIcon } from "@area/icons";
import { SETTING_GROUPS } from "@area/tokens/config";
import { brandName, groupSlug, HOME_TAB, hrefOf, LIST_PAGES, tabKind, tabName, type PageId, type Place, type TabKind } from "./places.ts";
import { ChromeButton, SidebarList, useStudio } from "./studio.tsx";
import { FAMILIES } from "./pages/components.tsx";
import { EXAMPLES } from "./pages/examples.tsx";

const TAB_ICONS: Record<TabKind, ReactNode> = { home: <HomeIcon />, brand: <PaletteIcon />, library: <LibraryIcon />, labs: <FlaskIcon /> };

/** Foundations' pages: Color, Typography and Icons, then one per setting group, named as the registry names it. */
export const FOUNDATIONS: ReadonlyArray<{ place: Place; label: string }> = [
  { place: { page: "color" }, label: "Color" },
  { place: { page: "typography" }, label: "Typography" },
  { place: { page: "icons" }, label: "Icons" },
  ...SETTING_GROUPS.map(group => ({ place: { page: "settings" as const, group: groupSlug(group.heading) }, label: group.heading })),
];
const IN_FOUNDATIONS: ReadonlySet<PageId> = new Set(["foundations", "settings", "color", "typography", "icons"]);

/** A place's name: its section, Foundations page or lab. */
export function placeLabel(place: Place): string {
  if (place.page === "settings") return FOUNDATIONS.find(entry => entry.place.group === place.group)?.label ?? "Foundations";
  return ({ home: "Home", themes: "Themes", "theme-setup": "New theme", foundations: "Foundations", color: "Color", typography: "Typography", icons: "Icons",
    components: "Components", patterns: "Patterns", library: "Library", materials: "Materials" } as Record<PageId, string>)[place.page];
}
/** What a page's list holds, for its filter's placeholder. */
const LISTED: Partial<Record<PageId, string>> = { color: "scales", typography: "roles", icons: "icons", components: "components",
  patterns: "patterns", library: "images", materials: "bundles" };

/** Same page (a setting group's page is its group), whatever is chosen on it. New theme is under Themes. */
const samePage = (a: Place, b: Place) => (a.page === "theme-setup" ? "themes" : a.page) === (b.page === "theme-setup" ? "themes" : b.page) && a.group === b.group;

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

export function AppNav() {
  const { place, navigate, brands, openBrand } = useStudio();
  // The open brand starts open while a tab on it is shown, Foundations while one of its pages is; a chevron closes either,
  // and opens any other brand.
  const onBrand = tabKind(place) === "brand";
  const [opened, setOpened] = useState<ReadonlySet<string>>(() => new Set(onBrand ? [openBrand.id] : []));
  useEffect(() => { if (onBrand) setOpened(open => open.has(openBrand.id) ? open : new Set([...open, openBrand.id])); }, [onBrand, openBrand.id]);
  const [foundationsOpen, setFoundationsOpen] = useState(() => IN_FOUNDATIONS.has(place.page));
  const ids = useId();
  const open = (target: Place) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // A page with its own list opens it in the Sidebar's place (the takeover); ⌘-click opens a new tab.
    navigate(target, { newTab: event.metaKey || event.ctrlKey, panel: LIST_PAGES.has(target.page) ? "page" : "nav" });
  };
  const here = (target: Place) => onBrand && (place.brand ?? "area") === target.brand && samePage(target, place);
  const row = (target: Place, label: string, trailing?: ReactNode, actions?: ReactNode) => (
    <NavItem key={label} href={hrefOf(target)} current={here(target)} onClick={open(target)} trailing={trailing} actions={actions}>{label}</NavItem>
  );
  return (
    <SidebarList>
      <Nav aria-label="Workspace">
        <NavGroup>
          <NavItem href={hrefOf({ page: "home" })} icon={<HomeIcon />} current={place.page === "home"} onClick={open({ page: "home" })}>Home</NavItem>
          <NavItem href={hrefOf({ page: "library" })} icon={<LibraryIcon />} current={place.page === "library"} onClick={open({ page: "library" })}>Library</NavItem>
        </NavGroup>
        <NavGroup label="Brands">
          {brands.map(brand => {
            const shown = opened.has(brand.id);
            const sections = `${ids}-${brand.id}`, foundations = `${ids}-${brand.id}-foundations`;
            const toggle = () => setOpened(open => { const next = new Set(open); if (next.has(brand.id)) next.delete(brand.id); else next.add(brand.id); return next; });
            const at = (target: Place): Place => ({ ...target, brand: brand.id });
            return (
              <Fragment key={brand.id}>
                <NavItem href={hrefOf(at({ page: "themes" }))} icon={TAB_ICONS.brand} onClick={open(at({ page: "themes" }))}
                  actions={<Expander open={shown} label={`${brand.name}'s sections`} controls={sections} onToggle={toggle} />}>
                  {brand.name}
                </NavItem>
                <div id={sections} hidden={!shown}>
                  <NavGroup nested>
                    {row(at({ page: "themes" }), "Themes", <Count count={brand.themes.length} />)}
                    {row(at({ page: "foundations" }), "Foundations", undefined,
                      <Expander open={foundationsOpen} label="Foundations' pages" controls={foundations} onToggle={() => setFoundationsOpen(!foundationsOpen)} />)}
                    <div id={foundations} hidden={!foundationsOpen}>
                      <NavGroup nested>{FOUNDATIONS.map(entry => row(at(entry.place), entry.label))}</NavGroup>
                    </div>
                    {row(at({ page: "components" }), "Components", <Count count={FAMILIES.length} max={9999} />)}
                    {row(at({ page: "patterns" }), "Patterns", <Count count={EXAMPLES.length} />)}
                  </NavGroup>
                </div>
              </Fragment>
            );
          })}
          <NavItem href={hrefOf({ page: "home", item: "new" })} icon={<AddIcon />} onClick={open({ page: "home", item: "new" })}>New brand</NavItem>
        </NavGroup>
      </Nav>
    </SidebarList>
  );
}

/**
 * A page's list in the Sidebar's place (Figma's and Cursor's drill-in): a back row to the nav ("‹ Area"), the list's
 * filter (it was the Titlebar's search, which now searches every place), then the list. The Canvas stays where it is.
 */
export function Takeover({ children }: { children: ReactNode }) {
  const { place, setPanel, query, setQuery } = useStudio();
  const back = tabKind(place) === "brand" ? brandName(place.brand) : "Workspace";
  const listed = LISTED[place.page] ?? placeLabel(place).toLowerCase();
  return (
    <div className="studio-takeover">
      <SidebarList>
        <Nav aria-label={placeLabel(place)}>
          <NavItem href={hrefOf(place)} icon={<ArrowLeftIcon />} onClick={event => { event.preventDefault(); setPanel("nav"); }}>{back}</NavItem>
        </Nav>
        <SearchField size="sm" variant="soft" fullWidth className="studio-takeover__filter" value={query} onValueChange={setQuery}
          placeholder={`Filter ${listed}`} aria-label={`Filter ${listed}`} />
      </SidebarList>
      {children}
    </div>
  );
}
