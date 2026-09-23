import { Nav, NavGroup, NavItem, NavSeparator } from "@area/react";
import { CheckIcon, InfoIcon, SearchIcon } from "../icons.tsx";

/**
 * A vertical nav is framed at a sidebar's width, because that is the only width at which
 * its behaviour is legible: truncation, the trailing slot, and the plate's proportions all
 * depend on the row being narrow. Stretched across the example container it reads as a list
 * of headings. 260px is the middle of the shipping range -- ChatGPT ~260, VS Code ~300,
 * Linear ~220.
 */
const sidebar = { inlineSize: 260 };

export const NavDefault = () => (
  <Nav aria-label="Label" style={sidebar}>
    <NavItem href="#" current>
      Item one
    </NavItem>
    <NavItem href="#">Item two</NavItem>
    <NavItem href="#">Item three</NavItem>
  </Nav>
);

export const NavVertical = () => (
  <Nav aria-label="Label" style={sidebar}>
    <NavGroup label="Label">
      <NavItem href="#" current>
        Item one
      </NavItem>
      <NavItem href="#">
        Item two
      </NavItem>
    </NavGroup>
    <NavGroup label="Label">
      <NavItem href="#">
        Item three
      </NavItem>
      <NavItem href="#">Item four</NavItem>
    </NavGroup>
  </Nav>
);

export const NavIcons = () => <Nav aria-label="Label" style={sidebar}><NavItem href="#" current icon={<CheckIcon />}>Item one</NavItem><NavItem href="#" icon={<InfoIcon />}>Item two</NavItem><NavItem href="#" icon={<SearchIcon />}>Item three</NavItem></Nav>;
export const NavCounts = () => <Nav aria-label="Label" style={sidebar}><NavItem href="#" current trailing="1">Item one</NavItem><NavItem href="#" trailing="2">Item two</NavItem><NavItem href="#">Item three</NavItem></Nav>;
export const NavTruncation = () => <Nav aria-label="Label" style={sidebar}><NavItem href="#" current>Item one</NavItem><NavItem href="#">Item two with a name long enough to truncate</NavItem></Nav>;

export const NavHorizontal = () => (
  <Nav orientation="horizontal" aria-label="Label">
    <NavItem href="#" current>
      Item one
    </NavItem>
    <NavItem href="#">Item two</NavItem>
    <NavItem href="#">Item three</NavItem>
    <NavItem href="#">Item four</NavItem>
  </Nav>
);

export const NavSeparated = () => <Nav orientation="horizontal" aria-label="Label"><NavItem href="#" current>Item one</NavItem><NavSeparator /><NavItem href="#">Item two</NavItem></Nav>;

export const NavAccent = () => (
  <Nav tone="accent" aria-label="Label" style={sidebar}>
    <NavItem href="#" current>
      Item one
    </NavItem>
    <NavItem href="#">Item two</NavItem>
  </Nav>
);

export const NavDisabled = () => (
  <Nav aria-label="Label" style={sidebar}>
    <NavItem href="#" current>
      Item one
    </NavItem>
    <NavItem disabled>Item two</NavItem>
  </Nav>
);
