/** Stack gallery specimens: one option per tile. docs/specs/stack.md. */
import { Badge, Button, SectionHeading, Stack, Surface } from "@area/react";

const Rows = () => <><Button variant="outline" tone="neutral">Item one</Button><Button variant="outline" tone="neutral">Item two</Button><Button variant="outline" tone="neutral">Item three</Button></>;

export const GalleryStack = () => <Stack style={{ inlineSize: 200 }}><Rows /></Stack>;
export const GalleryStackHorizontal = () => <Stack orientation="horizontal"><Rows /></Stack>;
export const GalleryStackRelated = () => <Stack gap="related" style={{ inlineSize: 200 }}><Rows /></Stack>;
export const GalleryStackGroup = () => <Stack gap="group" style={{ inlineSize: 200 }}><Rows /></Stack>;
export const GalleryStackSection = () => <Stack gap="section" style={{ inlineSize: 200 }}><Rows /></Stack>;
export const GalleryStackAlignStart = () => <Stack align="start" style={{ inlineSize: 200 }}><Rows /></Stack>;
export const GalleryStackAlignCenter = () => <Stack align="center" style={{ inlineSize: 200 }}><Rows /></Stack>;
export const GalleryStackAlignEnd = () => <Stack align="end" style={{ inlineSize: 200 }}><Rows /></Stack>;
export const GalleryStackAlignStretch = () => <Stack align="stretch" style={{ inlineSize: 200 }}><Rows /></Stack>;
export const GalleryStackAlignBaseline = () => (
  <Stack orientation="horizontal" align="baseline"><Button size="sm" variant="outline" tone="neutral">Item one</Button><Badge>Label</Badge></Stack>
);
export const GalleryStackSpread = () => (
  <Stack orientation="horizontal" spread style={{ inlineSize: 280 }}><SectionHeading level={3} title="Title" /><Button size="sm" variant="ghost" tone="neutral">Action</Button></Stack>
);
export const GalleryStackWrap = () => (
  <Stack orientation="horizontal" gap="related" wrap style={{ inlineSize: 200 }}>
    {["One", "Two", "Three", "Four", "Five", "Six"].map(label => <Badge key={label}>{label}</Badge>)}
  </Stack>
);
/** In a small Surface the section gap stops at the Surface's inset. */
export const GalleryStackInSurface = () => (
  <Surface size="sm" style={{ inlineSize: 220 }}><Stack gap="section"><Rows /></Stack></Surface>
);
