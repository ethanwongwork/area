/** Navbox gallery specimens. docs/specs/navbox.md. */
import { Link, Navbox, NavboxGroup } from "@area/react";

const links = (names: string[], hash: string) => names.map(name => <Link key={name} variant="standalone" ink="muted" href={hash}>{name}</Link>);
const width = { inlineSize: "calc(var(--area-space-96) * 6)", maxInlineSize: "100%" };

export const GalleryNavbox = () => (
  <Navbox title="David Tee's studio" style={width}>
    <NavboxGroup label="People">{links(["David Tee", "Design team", "Research team"], "#gallery-navbox")}</NavboxGroup>
    <NavboxGroup label="Work">{links(["Area", "Type specimens", "Hardware", "Teaching"], "#gallery-navbox")}</NavboxGroup>
    <NavboxGroup label="Places">{links(["Wellington", "Remote"], "#gallery-navbox")}</NavboxGroup>
  </Navbox>
);
/* Closing an article: a rule above, one group under the title ("See also"). */
export const GalleryNavboxDivided = () => (
  <Navbox title="See also" divided style={width}>
    <NavboxGroup>{links(["Area icons", "Area tokens", "Design systems"], "#gallery-navbox-divided")}</NavboxGroup>
  </Navbox>
);
