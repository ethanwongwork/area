/** Surface gallery specimens: one variant per tile. docs/specs/surface.md. */
import { Badge, Button, Card, CardContent, CardDescription, CardTitle, Field, Input, Panel, PanelSection, Stack, Surface } from "@area/react";

/* A Surface's title pair is Card's (plan B1.1): the title at the text's size, strong, its description joined under it. */
const Body = () => (
  <Stack>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description of what this region holds.</CardDescription>
    </CardContent>
    <Stack orientation="horizontal" gap="related"><Button size="sm" variant="outline" tone="neutral">Cancel</Button><Button size="sm">Save</Button></Stack>
  </Stack>
);

export const GallerySurface = () => <Surface style={{ inlineSize: 280 }}><Body /></Surface>;
export const GallerySurfaceSoft = () => <Surface variant="soft" style={{ inlineSize: 280 }}><Body /></Surface>;
export const GallerySurfacePlain = () => <Surface variant="plain" style={{ inlineSize: 280 }}><Body /></Surface>;
export const GallerySurfaceSizeSm = () => <Surface size="sm" style={{ inlineSize: 280 }}><Body /></Surface>;
export const GallerySurfaceSizeMd = () => <Surface size="md" style={{ inlineSize: 280 }}><Body /></Surface>;
export const GallerySurfaceSizeLg = () => <Surface size="lg" style={{ inlineSize: 280 }}><Body /></Surface>;

/** Three layers: a surface holding a soft well holding a surface, each corner concentric with the one around it. */
export const GallerySurfaceNested = () => (
  <Surface style={{ inlineSize: 300 }}>
    <Surface variant="soft">
      <Surface>
        <Stack orientation="horizontal" spread>
          <span>Item one</span>
          <Badge>Label</Badge>
        </Stack>
      </Surface>
    </Surface>
  </Surface>
);

/** A settings region: fields grouped in a raised surface, controls stepping from its ground. */
export const GallerySurfaceForm = () => (
  <Surface style={{ inlineSize: 300 }}>
    <Stack>
      <Field label="Name"><Input variant="soft" placeholder="Value" /></Field>
      <Field label="Email"><Input variant="soft" placeholder="Value" /></Field>
    </Stack>
  </Surface>
);

/** In a Card: the Card publishes the frame recipe's nested corner, a row's 8 inside its 10 (its corner less its media inset, never under a row's). */
export const GallerySurfaceInCard = () => (
  <Card style={{ inlineSize: 300 }}>
    <Surface variant="soft">
      <Stack orientation="horizontal" spread>
        <span>Item one</span>
        <Badge>Label</Badge>
      </Stack>
    </Surface>
    <CardContent>
      <CardTitle>Title</CardTitle>
      <CardDescription>Description</CardDescription>
    </CardContent>
  </Card>
);

/** In a Panel: the Panel's corner less its inset is under a row's corner, so a Surface in it takes a row's, 8. */
export const GallerySurfaceInPanel = () => (
  <Panel size="md" title="Title">
    <PanelSection heading="Label">
      <Surface variant="soft">
        <Stack orientation="horizontal" spread>
          <span>Item one</span>
          <Badge>Label</Badge>
        </Stack>
      </Surface>
    </PanelSection>
  </Panel>
);
