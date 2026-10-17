/** Navbox gallery specimens. docs/specs/navbox.md. */
import { InlineList, Link, Navbox, NavboxGroup } from "@area/react";

const links = (names: string[], hash: string) => <InlineList>{names.map(name => <Link key={name} ink="blue" href={hash}>{name}</Link>)}</InlineList>;
const width = { inlineSize: "calc(var(--area-space-96) * 6)", maxInlineSize: "100%" };

export const GalleryNavbox = () => (
  <Navbox title="David Tee's studio" style={width}>
    <NavboxGroup label="People">{links(["David Tee", "Design team", "Research team"], "#gallery-navbox")}</NavboxGroup>
    <NavboxGroup label="Work">{links(["Area", "Type specimens", "Hardware", "Teaching"], "#gallery-navbox")}</NavboxGroup>
    <NavboxGroup label="Places">{links(["Wellington", "Remote"], "#gallery-navbox")}</NavboxGroup>
  </Navbox>
);
/* Collapsed, as Wikipedia folds a page's later navboxes. */
export const GalleryNavboxCollapsed = () => (
  <Navbox title="Design systems" defaultExpanded={false} style={width}>
    <NavboxGroup label="Libraries">{links(["Area", "Area icons", "Area tokens"], "#gallery-navbox-collapsed")}</NavboxGroup>
  </Navbox>
);
