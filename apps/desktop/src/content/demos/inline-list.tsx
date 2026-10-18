/** Inline list gallery specimens: one separator per tile. docs/specs/inline-list.md. */
import { ClockIcon, StarIcon } from "@area/icons";
import { InlineList, Link } from "@area/react";

const items = ["Item one", "Item two", "Item three", "Item four"];
/* A byline: a muted row with a dot between items. */
export const GalleryInlineList = () => (
  <div style={{ color: "var(--area-fg-muted)" }}>
    <InlineList><Link ink="muted" variant="standalone" href="#gallery-inline-list">David Tee</Link><span>12 May 2026</span><span>6 min read</span></InlineList>
  </div>
);
/* Links in a list are standalone (underlined on hover); their ink is Link's: here the link blue. */
export const GalleryInlineListBlue = () => <InlineList>{items.map(item => <Link key={item} ink="blue" variant="standalone" href="#gallery-inline-list-blue">{item}</Link>)}</InlineList>;
export const GalleryInlineListRule = () => <InlineList separator="rule">{items.map(item => <Link key={item} variant="standalone" href="#gallery-inline-list-rule">{item}</Link>)}</InlineList>;
/* Icon-led metadata needs no mark: each icon starts its item. */
export const GalleryInlineListNone = () => (
  <div style={{ color: "var(--area-fg-muted)" }}>
    <InlineList separator="none">
      <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--area-space-4)" }}><StarIcon width={16} height={16} aria-hidden />128</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--area-space-4)" }}><ClockIcon width={16} height={16} aria-hidden />Updated 2 days ago</span>
      <span>Label</span>
    </InlineList>
  </div>
);
/* Wrapping: a mark stays with the item before it, so no line starts with one. */
export const GalleryInlineListWrap = () => (
  <div style={{ inlineSize: "calc(var(--area-space-96) * 2.5)" }}>
    <InlineList>{["Item one", "Item two", "Item three", "Item four", "Item five", "Item six"].map(item => <Link key={item} variant="standalone" href="#gallery-inline-list-wrap">{item}</Link>)}</InlineList>
  </div>
);
