/** Inline list gallery specimens: one separator per tile. docs/specs/inline-list.md. */
import { InlineList, Link } from "@area/react";

const items = ["Item one", "Item two", "Item three", "Item four"];
export const GalleryInlineList = () => <InlineList>{items.map(item => <Link key={item} ink="blue" href="#gallery-inline-list">{item}</Link>)}</InlineList>;
export const GalleryInlineListBar = () => <InlineList separator="bar">{items.map(item => <Link key={item} ink="blue" href="#gallery-inline-list-bar">{item}</Link>)}</InlineList>;
export const GalleryInlineListComma = () => <InlineList separator="comma">{items.map(item => <span key={item}>{item}</span>)}</InlineList>;
/* Wrapping: a separator stays with the item before it. */
export const GalleryInlineListWrap = () => (
  <div style={{ inlineSize: "calc(var(--area-space-96) * 2.5)" }}>
    <InlineList>{["Item one", "Item two", "Item three", "Item four", "Item five"].map(item => <Link key={item} ink="blue" href="#gallery-inline-list-wrap">{item}</Link>)}</InlineList>
  </div>
);
