import { Nav, NavGroup, NavItem, NavSeparator } from "@area/react";
import { CheckIcon, InfoIcon, SearchIcon } from "@area/icons";

/* A vertical nav renders at its own sidebar width (240, nav.css); no demo framing. */

export const NavDefault = () => (
  <Nav aria-label="Label">
    <NavItem href="#" current>
      Item one
    </NavItem>
    <NavItem href="#">Item two</NavItem>
    <NavItem href="#">Item three</NavItem>
  </Nav>
);

export const NavVertical = () => (
  <Nav aria-label="Label">
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

export const NavIcons = () => <Nav aria-label="Label"><NavItem href="#" current icon={<CheckIcon />}>Item one</NavItem><NavItem href="#" icon={<InfoIcon />}>Item two</NavItem><NavItem href="#" icon={<SearchIcon />}>Item three</NavItem></Nav>;
export const NavCounts = () => <Nav aria-label="Label"><NavItem href="#" current trailing="1">Item one</NavItem><NavItem href="#" trailing="2">Item two</NavItem><NavItem href="#">Item three</NavItem></Nav>;
export const NavTruncation = () => <Nav aria-label="Label"><NavItem href="#" current>Item one</NavItem><NavItem href="#">Item two with a label long enough to truncate</NavItem></Nav>;

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
  <div data-area-selection="accent" style={{ display: "contents" }}>
    <Nav selection="marker" aria-label="Label">
      <NavItem href="#" current>
        Item one
      </NavItem>
      <NavItem href="#">Item two</NavItem>
    </Nav>
  </div>
);

export const NavDisabled = () => (
  <Nav aria-label="Label">
    <NavItem href="#" current>
      Item one
    </NavItem>
    <NavItem disabled>Item two</NavItem>
  </Nav>
);
