/** Navbox gallery specimens. docs/specs/navbox.md. */
import { Link, Navbox, NavboxGroup } from "@area/react";

const links = (names: string[], hash: string) => names.map(name => <Link key={name} variant="standalone" ink="muted" href={hash}>{name}</Link>);
const width = { inlineSize: "calc(var(--area-space-96) * 6)", maxInlineSize: "100%" };

export const GalleryNavbox = () => (
  <Navbox title="Title" style={width}>
    <NavboxGroup label="Group one">{links(["Item one", "Item two", "Item three"], "#gallery-navbox")}</NavboxGroup>
    <NavboxGroup label="Group two">{links(["Item one", "Item two", "Item three", "Item four"], "#gallery-navbox")}</NavboxGroup>
    <NavboxGroup label="Group three">{links(["Item one", "Item two"], "#gallery-navbox")}</NavboxGroup>
  </Navbox>
);
/* Closing an article: a rule above, one group under the title ("See also"). */
export const GalleryNavboxDivided = () => (
  <Navbox title="See also" divided style={width}>
    <NavboxGroup>{links(["Item one", "Item two", "Item three"], "#gallery-navbox-divided")}</NavboxGroup>
  </Navbox>
);
