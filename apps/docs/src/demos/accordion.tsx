/** AccordionItem gallery specimens: one variant per tile. docs/specs/accordion.md. */
import { AccordionItem, Accordion } from "@area/react";

export const GalleryAccordion = () => (
  <AccordionItem heading="Title" defaultOpen>Body text</AccordionItem>
);
export const GalleryAccordionClosed = () => (
  <AccordionItem heading="Title">Body text</AccordionItem>
);
export const GalleryAccordionSizeSm = () => (
  <AccordionItem size="sm" heading="Title" defaultOpen>Body text</AccordionItem>
);
export const GalleryAccordionSizeMd = () => (
  <AccordionItem size="md" heading="Title" defaultOpen>Body text</AccordionItem>
);
export const GalleryAccordionDisabled = () => (
  <AccordionItem heading="Title" disabled>Body text</AccordionItem>
);
export const GalleryAccordionNested = () => (
  <AccordionItem heading="Title" defaultOpen>
    <p style={{ margin: 0 }}>Body text</p>
    <AccordionItem heading="Title">Body text</AccordionItem>
  </AccordionItem>
);
export const GalleryAccordionLongTitle = () => (
  <div style={{ inlineSize: 240 }}>
    <AccordionItem heading="A longer title that wraps onto a second line" defaultOpen>Body text</AccordionItem>
  </div>
);
export const GalleryAccordionDivided = () => (
  <Accordion variant="divided" size="sm" defaultValue={["one"]} style={{ inlineSize: 320 }}>
    <AccordionItem value="one" heading="Item one">Body text</AccordionItem>
    <AccordionItem value="two" heading="Item two">Body text</AccordionItem>
    <AccordionItem value="three" heading="Item three">Body text</AccordionItem>
  </Accordion>
);
export const GalleryAccordionDividedMd = () => (
  <Accordion variant="divided" size="md" defaultValue={["one"]} style={{ inlineSize: 320 }}>
    <AccordionItem value="one" heading="Item one">Body text</AccordionItem>
    <AccordionItem value="two" heading="Item two">Body text</AccordionItem>
    <AccordionItem value="three" heading="Item three">Body text</AccordionItem>
  </Accordion>
);
export const GalleryAccordionMultiple = () => (
  <Accordion multiple defaultValue={["one", "two"]} style={{ inlineSize: 320 }}>
    <AccordionItem value="one" heading="Item one">Body text</AccordionItem>
    <AccordionItem value="two" heading="Item two">Body text</AccordionItem>
    <AccordionItem value="three" heading="Item three">Body text</AccordionItem>
  </Accordion>
);
