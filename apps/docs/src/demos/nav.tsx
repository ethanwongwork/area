import { Nav, NavGroup, NavItem, NavSeparator } from "@area/react";
import { CheckIcon, InfoIcon, PlusIcon, SearchIcon } from "../icons.tsx";

/**
 * A vertical nav is framed at a sidebar's width, because that is the only width at which
 * its behaviour is legible: truncation, the trailing slot, and the plate's proportions all
 * depend on the row being narrow. Stretched across the example container it reads as a list
 * of headings. 260px is the middle of the shipping range -- ChatGPT ~260, VS Code ~300,
 * Linear ~220.
 */
const sidebar = { inlineSize: 260 };

export const NavDefault = () => (
  <Nav aria-label="Sections" style={sidebar}>
    <NavItem href="#" current>
      Overview
    </NavItem>
    <NavItem href="#">Activity</NavItem>
    <NavItem href="#">Settings</NavItem>
  </Nav>
);

export const NavVertical = () => (
  <Nav aria-label="Workspace" style={sidebar}>
    <NavGroup label="Pinned">
      <NavItem href="#" icon={<CheckIcon />} current>
        Release checklist
      </NavItem>
      <NavItem href="#" icon={<InfoIcon />}>
        Onboarding notes
      </NavItem>
    </NavGroup>
    <NavGroup label="Recents">
      <NavItem href="#" icon={<SearchIcon />} trailing="12">
        Search results
      </NavItem>
      <NavItem href="#" icon={<PlusIcon />}>
        Untitled document with a very long name that has to truncate
      </NavItem>
    </NavGroup>
  </Nav>
);

export const NavHorizontal = () => (
  <Nav orientation="horizontal" aria-label="Product">
    <NavItem href="#" current>
      Overview
    </NavItem>
    <NavItem href="#">Pricing</NavItem>
    <NavItem href="#">Docs</NavItem>
    <NavSeparator />
    <NavItem href="#">Changelog</NavItem>
  </Nav>
);

export const NavAccent = () => (
  <Nav tone="accent" aria-label="Accent example" style={sidebar}>
    <NavItem href="#" current>
      Current
    </NavItem>
    <NavItem href="#">Another page</NavItem>
  </Nav>
);

export const NavDisabled = () => (
  <Nav aria-label="Disabled example" style={sidebar}>
    <NavItem href="#" current>
      Available
    </NavItem>
    <NavItem disabled>Not yet available</NavItem>
  </Nav>
);
