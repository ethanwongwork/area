/** Navbox gallery specimens. docs/specs/navbox.md. */
import { InlineList, Link, Navbox, NavboxGroup } from "@area/react";

const links = (names: string[], hash: string) => <InlineList>{names.map(name => <Link key={name} ink="blue" href={hash}>{name}</Link>)}</InlineList>;
const width = { inlineSize: "calc(var(--area-space-96) * 6)", maxInlineSize: "100%" };

export const GalleryNavbox = () => (
  <Navbox title="Title" style={width}>
    <NavboxGroup label="Group one">{links(["Item one", "Item two", "Item three"], "#gallery-navbox")}</NavboxGroup>
    <NavboxGroup label="Group two">{links(["Item one", "Item two", "Item three", "Item four"], "#gallery-navbox")}</NavboxGroup>
    <NavboxGroup label="Group three">{links(["Item one", "Item two"], "#gallery-navbox")}</NavboxGroup>
  </Navbox>
);
/* Collapsed, as Wikipedia folds a page's later navboxes. */
export const GalleryNavboxCollapsed = () => (
  <Navbox title="Title" defaultExpanded={false} style={width}>
    <NavboxGroup label="Group one">{links(["Item one", "Item two", "Item three"], "#gallery-navbox-collapsed")}</NavboxGroup>
  </Navbox>
);
