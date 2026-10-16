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
    <Nav orientation="horizontal" aria-label="Sections">
      <NavItem href="#gallery-titlebar" current>Components</NavItem>
      <NavItem href="#gallery-titlebar">Icons</NavItem>
    </Nav>
  </Titlebar>
);
/* In a frameless macOS window: the start clears the traffic lights (drawn by the system; here the room is empty). */
export const GalleryTitlebarMacos = () => (
  <Titlebar windowControls="macos" style={bar} end={icon("Dark mode", MoonIcon)}>
    {icon("Show sidebar", PanelLeftIcon)}
    <Nav orientation="horizontal" aria-label="Sections">
      <NavItem href="#gallery-titlebar-macos" current>Components</NavItem>
      <NavItem href="#gallery-titlebar-macos">Icons</NavItem>
    </Nav>
  </Titlebar>
);

/* A titled group on a page. */
export const GallerySectionHeading = () => <SectionHeading title="Arrows" />;
/* With a count in the muted ink. */
export const GallerySectionHeadingCount = () => <SectionHeading title={<>Arrows <span style={{ color: "var(--area-fg-muted)", fontWeight: "var(--area-weight-regular)" }}>48</span></>} />;
/* With a lede, 8 under the title. */
export const GallerySectionHeadingLede = () => (
  <SectionHeading title="Headings" lede="Introduce pages, sections and surfaces. Surface titles follow the type size; larger headings hold theirs." />
);
