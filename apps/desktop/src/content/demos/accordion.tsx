/** AccordionItem gallery specimens: one variant per tile. docs/specs/accordion.md. */
import { AccordionItem, Accordion } from "@area/react";

/* Every specimen at one fixed width, as an accordion fills its container (shadcn's preview:
   w-full max-w-lg), so opening or closing never changes its width. */
const frame = { inlineSize: 240 };

export const GalleryAccordion = () => (
  <AccordionItem style={frame} heading="Title" defaultOpen>Body text</AccordionItem>
);
export const GalleryAccordionClosed = () => (
  <AccordionItem style={frame} heading="Title">Body text</AccordionItem>
);
export const GalleryAccordionSizeSm = () => (
  <AccordionItem style={frame} size="sm" heading="Title" defaultOpen>Body text</AccordionItem>
);
export const GalleryAccordionSizeMd = () => (
  <AccordionItem style={frame} size="md" heading="Title" defaultOpen>Body text</AccordionItem>
);
export const GalleryAccordionDisabled = () => (
  <AccordionItem style={frame} heading="Title" disabled>Body text</AccordionItem>
);
export const GalleryAccordionNested = () => (
  <AccordionItem style={frame} heading="Title" defaultOpen>
    <p style={{ margin: 0 }}>Body text</p>
    <AccordionItem heading="Title">Body text</AccordionItem>
  </AccordionItem>
);
export const GalleryAccordionLongTitle = () => (
  <AccordionItem style={frame} heading="A longer title that wraps onto a second line" defaultOpen>Body text</AccordionItem>
);
export const GalleryAccordionDivided = () => (
  <Accordion variant="divided" size="sm" defaultValue={["one"]} style={frame}>
    <AccordionItem value="one" heading="Item one">Body text</AccordionItem>
    <AccordionItem value="two" heading="Item two">Body text</AccordionItem>
    <AccordionItem value="three" heading="Item three">Body text</AccordionItem>
  </Accordion>
);
export const GalleryAccordionDividedMd = () => (
  <Accordion variant="divided" size="md" defaultValue={["one"]} style={frame}>
    <AccordionItem value="one" heading="Item one">Body text</AccordionItem>
    <AccordionItem value="two" heading="Item two">Body text</AccordionItem>
    <AccordionItem value="three" heading="Item three">Body text</AccordionItem>
  </Accordion>
);
export const GalleryAccordionMultiple = () => (
  <Accordion multiple defaultValue={["one", "two"]} style={frame}>
    <AccordionItem value="one" heading="Item one">Body text</AccordionItem>
    <AccordionItem value="two" heading="Item two">Body text</AccordionItem>
    <AccordionItem value="three" heading="Item three">Body text</AccordionItem>
  </Accordion>
);
