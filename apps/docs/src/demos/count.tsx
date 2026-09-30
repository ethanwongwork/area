/** Count gallery specimens: one variant per tile. docs/specs/count.md. */
import { Count, Nav, NavItem, Tabs } from "@area/react";

export const GalleryCount = () => <Count count={12} />;
export const GalleryCountSoft = () => <Count variant="soft" count={12} />;
export const GalleryCountSizeSm = () => <Count size="sm" variant="soft" count={12} />;
export const GalleryCountSizeMd = () => <Count size="md" variant="soft" count={12} />;
export const GalleryCountSingleDigit = () => <Count variant="soft" count={3} />;
export const GalleryCountOverflow = () => <Count variant="soft" count={125} />;
export const GalleryCountZeroHidden = () => <Count variant="soft" count={0} showZero={false} />;
export const GalleryCountLabel = () => <Count variant="soft" count={3} label="unread" />;

export const GalleryCountNav = () => (
  <Nav aria-label="Label">
    <NavItem href="#gallery-count-nav" current trailing={<Count count={12} />}>Item one</NavItem>
    <NavItem href="#gallery-count-nav" trailing={<Count count={3} />}>Item two</NavItem>
    <NavItem href="#gallery-count-nav">Item three</NavItem>
  </Nav>
);
export const GalleryCountTabs = () => (
  <Tabs tabs={[
    { id: "one", label: "Item one", trailing: <Count variant="soft" count={12} />, content: "Body text" },
    { id: "two", label: "Item two", trailing: <Count variant="soft" count={3} />, content: "Body text" },
  ]} />
);
