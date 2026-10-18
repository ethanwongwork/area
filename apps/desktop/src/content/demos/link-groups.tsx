/** LinkGroups gallery specimens. docs/specs/link-groups.md. */
import { Link, LinkGroups, LinkGroup } from "@area/react";

const links = (names: string[], hash: string) => names.map(name => <Link key={name} variant="standalone" ink="muted" href={hash}>{name}</Link>);
const width = { inlineSize: "calc(var(--area-space-96) * 6)", maxInlineSize: "100%" };

export const GalleryLinkGroups = () => (
  <LinkGroups title="David Tee's studio" style={width}>
    <LinkGroup label="People">{links(["David Tee", "Design team", "Research team"], "#gallery-link-groups")}</LinkGroup>
    <LinkGroup label="Work">{links(["Area", "Type specimens", "Hardware", "Teaching"], "#gallery-link-groups")}</LinkGroup>
    <LinkGroup label="Places">{links(["Wellington", "Remote"], "#gallery-link-groups")}</LinkGroup>
  </LinkGroups>
);
/* Closing an article: a rule above, one group under the title ("See also"). */
export const GalleryLinkGroupsDivided = () => (
  <LinkGroups title="See also" divided style={width}>
    <LinkGroup>{links(["Area icons", "Area tokens", "Design systems"], "#gallery-link-groups-divided")}</LinkGroup>
  </LinkGroups>
);
