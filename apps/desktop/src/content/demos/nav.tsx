import { useState } from "react";
import { Button, Nav, NavGroup, NavItem, NavSeparator } from "@area/react";
import { AddIcon, CheckIcon, InfoIcon, SearchIcon } from "@area/icons";

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

/* Groups that fold (NavGroup open / onOpenChange): the heading is the button, its chevron after the name; actions sit at
   its end (the desktop app's Projects and Systems, 2026-11-01). */
export const NavFolding = () => {
  const [open, setOpen] = useState({ one: true, two: false });
  return (
    <Nav aria-label="Label">
      <NavGroup label="Label" open={open.one} onOpenChange={next => setOpen(current => ({ ...current, one: next }))}
        actions={<Button size="sm" variant="ghost" iconOnly icon={<AddIcon />} aria-label="Action" />}>
        <NavItem href="#" current>Item one</NavItem>
        <NavItem href="#">Item two</NavItem>
      </NavGroup>
      <NavGroup label="Label" open={open.two} onOpenChange={next => setOpen(current => ({ ...current, two: next }))}>
        <NavItem href="#">Item three</NavItem>
        <NavItem href="#">Item four</NavItem>
      </NavGroup>
    </Nav>
  );
};

/* A picture in the icon's place (NavItem picture): a screen's or an image's thumbnail, so rows that share a kind read apart. */
const picture = (split: string) => <span style={{ display: "block", inlineSize: "100%", blockSize: "100%", background: `linear-gradient(var(--area-bg-component-active) 0 ${split}, transparent ${split})` }} />;
export const NavPictures = () => (
  <Nav aria-label="Label">
    <NavItem href="#" picture={picture("35%")}>Item one</NavItem>
    <NavItem href="#" current picture={picture("60%")}>Item two</NavItem>
    <NavItem href="#" picture={picture("20%")}>Item three</NavItem>
  </Nav>
);

/* A sticky heading (NavGroup sticky): the group's name stays at the top of the scroll while its rows pass under it. */
export const NavSticky = () => (
  <div style={{ blockSize: 160, overflowY: "auto", inlineSize: 240 }}>
    <Nav aria-label="Label">
      <NavGroup label="Label" sticky>
        {["Item one", "Item two", "Item three", "Item four", "Item five", "Item six", "Item seven"].map((item, index) => <NavItem key={item} href="#" current={index === 0}>{item}</NavItem>)}
      </NavGroup>
    </Nav>
  </div>
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

export const NavNeutral = () => (
  <div data-area-selection="neutral" style={{ display: "contents" }}>
    <Nav selection="marker" aria-label="Label">
      <NavItem href="#" current>
        Item one
      </NavItem>
      <NavItem href="#">Item two</NavItem>
    </Nav>
  </div>
);

/* Inactive (components audit V2, 2026-11-07): drawn as disabled, but it keeps its Tab stop and says why in a Tooltip. */
export const NavInactive = () => (
  <Nav aria-label="Label">
    <NavItem href="#" current>
      Item one
    </NavItem>
    <NavItem href="#" inactive inactiveText="Description">Item two</NavItem>
  </Nav>
);

export const NavDisabled = () => (
  <Nav aria-label="Label">
    <NavItem href="#" current>
      Item one
    </NavItem>
    <NavItem disabled>Item two</NavItem>
  </Nav>
);
