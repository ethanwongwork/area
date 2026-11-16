/** Count gallery specimens: one variant per tile. docs/specs/count.md. */
import { Count, Nav, NavItem, Tabs } from "@area/react";

export const GalleryCount = () => <Count count={12} />;
export const GalleryCountSoft = () => <Count variant="soft" count={12} />;
/** Follows the radius setting instead of a pill (2026-10-03). */
export const GalleryCountRounded = () => <Count variant="soft" pill={false} count={12} />;
export const GalleryCountSizeSm = () => <Count size="sm" count={12} />;
export const GalleryCountSizeMd = () => <Count size="md" count={12} />;
export const GalleryCountSingleDigit = () => <Count variant="soft" count={3} />;
export const GalleryCountOverflow = () => <Count variant="soft" count={125} />;
/* Zero hidden renders nothing, so the tile shows the rows it sits on: the second row's 0 is not drawn (a Count alone at 0
   left an empty tile; system evaluation F3.3). */
export const GalleryCountZeroHidden = () => (
  <Nav aria-label="Label">
    <NavItem href="#gallery-count-zero" current trailing={<Count variant="soft" count={3} />}>Item one</NavItem>
    <NavItem href="#gallery-count-zero" trailing={<Count variant="soft" count={0} showZero={false} />}>Item two</NavItem>
  </Nav>
);
export const GalleryCountLabel = () => <Count variant="soft" count={3} label="unread" />;

export const GalleryCountNav = () => (
  <Nav aria-label="Label">
    <NavItem href="#gallery-count-nav" current trailing={<Count count={12} />}>Item one</NavItem>
    <NavItem href="#gallery-count-nav" trailing={<Count count={3} />}>Item two</NavItem>
    <NavItem href="#gallery-count-nav">Item three</NavItem>
  </Nav>
);
export const GalleryCountTabs = () => (
  <Tabs items={[
    { id: "one", label: "Item one", trailing: <Count variant="soft" count={12} />, content: "Body text" },
    { id: "two", label: "Item two", trailing: <Count variant="soft" count={3} />, content: "Body text" },
  ]} />
);
