/** Link groups gallery specimens. docs/specs/link-groups.md. */
import { Link, LinkGroups, LinkGroup } from "@area/react";

const links = (names: string[], hash: string) => names.map(name => <Link key={name} variant="standalone" href={hash}>{name}</Link>);
const width = { inlineSize: "calc(var(--area-space-96) * 6)", maxInlineSize: "100%" };

export const GalleryLinkGroups = () => (
  <LinkGroups title="Title" style={width}>
    <LinkGroup label="Group one">{links(["Item one", "Item two", "Item three"], "#gallery-link-groups")}</LinkGroup>
    <LinkGroup label="Group two">{links(["Item one", "Item two", "Item three", "Item four"], "#gallery-link-groups")}</LinkGroup>
    <LinkGroup label="Group three">{links(["Item one", "Item two"], "#gallery-link-groups")}</LinkGroup>
  </LinkGroups>
);
/* Closing an article: a rule above, one group under the title ("See also"). */
export const GalleryLinkGroupsDivided = () => (
  <LinkGroups title="See also" divided style={width}>
    <LinkGroup>{links(["Item one", "Item two", "Item three"], "#gallery-link-groups-divided")}</LinkGroup>
  </LinkGroups>
);
