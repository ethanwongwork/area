import { Nav, NavGroup, NavItem, NavSeparator } from "@area/react";
import { CheckIcon, InfoIcon, PlusIcon, SearchIcon } from "../icons.tsx";

export const NavDefault = () => (
  <Nav aria-label="Sections">
    <NavItem href="#" current>
      Overview
    </NavItem>
    <NavItem href="#">Activity</NavItem>
    <NavItem href="#">Settings</NavItem>
  </Nav>
);

export const NavVertical = () => (
  <Nav aria-label="Workspace">
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
  <Nav tone="accent" aria-label="Accent example">
    <NavItem href="#" current>
      Current
    </NavItem>
    <NavItem href="#">Another page</NavItem>
  </Nav>
);

export const NavDisabled = () => (
  <Nav aria-label="Disabled example">
    <NavItem href="#" current>
      Available
    </NavItem>
    <NavItem disabled>Not yet available</NavItem>
  </Nav>
);
