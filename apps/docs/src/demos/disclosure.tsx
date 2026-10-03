/** Disclosure gallery specimens: one variant per tile. docs/specs/disclosure.md. */
import { Disclosure, DisclosureGroup } from "@area/react";

export const GalleryDisclosure = () => (
  <Disclosure heading="Title" defaultOpen>Body text</Disclosure>
);
export const GalleryDisclosureClosed = () => (
  <Disclosure heading="Title">Body text</Disclosure>
);
export const GalleryDisclosureSizeSm = () => (
  <Disclosure size="sm" heading="Title" defaultOpen>Body text</Disclosure>
);
export const GalleryDisclosureSizeMd = () => (
  <Disclosure size="md" heading="Title" defaultOpen>Body text</Disclosure>
);
export const GalleryDisclosureDisabled = () => (
  <Disclosure heading="Title" disabled>Body text</Disclosure>
);
export const GalleryDisclosureNested = () => (
  <Disclosure heading="Title" defaultOpen>
    <p style={{ margin: 0 }}>Body text</p>
    <Disclosure heading="Title">Body text</Disclosure>
  </Disclosure>
);
export const GalleryDisclosureLongTitle = () => (
  <div style={{ inlineSize: 240 }}>
    <Disclosure heading="A longer title that wraps onto a second line" defaultOpen>Body text</Disclosure>
  </div>
);
export const GalleryDisclosureDivided = () => (
  <DisclosureGroup variant="divided" size="sm" defaultValue={["one"]} style={{ inlineSize: 320 }}>
    <Disclosure value="one" heading="Item one">Body text</Disclosure>
    <Disclosure value="two" heading="Item two">Body text</Disclosure>
    <Disclosure value="three" heading="Item three">Body text</Disclosure>
  </DisclosureGroup>
);
export const GalleryDisclosureDividedMd = () => (
  <DisclosureGroup variant="divided" size="md" defaultValue={["one"]} style={{ inlineSize: 320 }}>
    <Disclosure value="one" heading="Item one">Body text</Disclosure>
    <Disclosure value="two" heading="Item two">Body text</Disclosure>
    <Disclosure value="three" heading="Item three">Body text</Disclosure>
  </DisclosureGroup>
);
export const GalleryDisclosureGroupMultiple = () => (
  <DisclosureGroup multiple defaultValue={["one", "two"]} style={{ inlineSize: 320 }}>
    <Disclosure value="one" heading="Item one">Body text</Disclosure>
    <Disclosure value="two" heading="Item two">Body text</Disclosure>
    <Disclosure value="three" heading="Item three">Body text</Disclosure>
  </DisclosureGroup>
);
