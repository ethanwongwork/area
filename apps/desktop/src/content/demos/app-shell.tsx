/** App shell gallery specimens: one variant per tile. docs/specs/app-shell.md. */
import { Button, Nav, NavItem, SearchField, SectionHeading, Titlebar } from "@area/react";
import { MoonIcon, PanelLeftIcon, PanelRightIcon } from "@area/icons";

const bar = { inlineSize: "calc(var(--area-space-96) * 7)", maxInlineSize: "100%" };
const icon = (label: string, Icon: typeof MoonIcon) => <Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<Icon />} aria-label={label} />;

/* A window's top bar: Panel's bar height and rule, tabs at the start, search and toggles at the end. */
export const GalleryTitlebar = () => (
  <Titlebar style={bar} end={<>
    <SearchField size="sm" variant="soft" aria-label="Search" placeholder="Search" />
    {icon("Show inspector", PanelRightIcon)}
    {icon("Dark mode", MoonIcon)}
  </>}>
    {icon("Show sidebar", PanelLeftIcon)}
    <Nav orientation="horizontal" aria-label="Label">
      <NavItem href="#gallery-titlebar" current>Item one</NavItem>
      <NavItem href="#gallery-titlebar">Item two</NavItem>
    </Nav>
  </Titlebar>
);
/* plain: no rule under the bar (ChatGPT's and Notion's top bars); the bar loses the rule's 1, so the controls stay centred. */
export const GalleryTitlebarPlain = () => (
  <Titlebar variant="plain" style={bar} end={<>
    <SearchField size="sm" variant="soft" aria-label="Search" placeholder="Search" />
    {icon("Dark mode", MoonIcon)}
  </>}>
    {icon("Show sidebar", PanelLeftIcon)}
    <Nav orientation="horizontal" aria-label="Label">
      <NavItem href="#gallery-titlebar-plain" current>Item one</NavItem>
      <NavItem href="#gallery-titlebar-plain">Item two</NavItem>
    </Nav>
  </Titlebar>
);
/* floating: a raised plate held one cluster space off the window's top and sides (the window's ground behind it). */
export const GalleryTitlebarFloating = () => (
  <div data-area-ground="recessed" style={{ ...bar, background: "var(--area-bg-subtle)", paddingBlockEnd: "var(--area-space-24)" }}>
    <Titlebar variant="floating" end={<>
      <SearchField size="sm" variant="soft" aria-label="Search" placeholder="Search" />
      {icon("Dark mode", MoonIcon)}
    </>}>
      {icon("Show sidebar", PanelLeftIcon)}
      <Nav orientation="horizontal" aria-label="Label">
        <NavItem href="#gallery-titlebar-floating" current>Item one</NavItem>
        <NavItem href="#gallery-titlebar-floating">Item two</NavItem>
      </Nav>
    </Titlebar>
  </div>
);
/* In a frameless macOS window: the start clears the traffic lights (drawn by the system; here the room is empty). */
export const GalleryTitlebarMacos = () => (
  <Titlebar windowControls="macos" style={bar} end={icon("Dark mode", MoonIcon)}>
    {icon("Show sidebar", PanelLeftIcon)}
    <Nav orientation="horizontal" aria-label="Label">
      <NavItem href="#gallery-titlebar-macos" current>Item one</NavItem>
      <NavItem href="#gallery-titlebar-macos">Item two</NavItem>
    </Nav>
  </Titlebar>
);

/* A titled group on a page. */
export const GallerySectionHeading = () => <SectionHeading title="Title" />;
/* With a count in the muted ink. */
export const GallerySectionHeadingCount = () => <SectionHeading title={<>Title <span style={{ color: "var(--area-fg-muted)", fontWeight: "var(--area-weight-regular)" }}>48</span></>} />;
/* With a lede, 8 under the title. */
export const GallerySectionHeadingLede = () => (
  <SectionHeading title="Title" lede="Description that wraps onto a second line under the title" style={{ inlineSize: "calc(var(--area-space-80) * 3)" }} />
);
