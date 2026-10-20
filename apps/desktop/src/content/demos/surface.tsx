/** Surface gallery specimens: one variant per tile. docs/specs/surface.md. */
import { Badge, Button, Field, Input, Stack, Surface } from "@area/react";

const Body = () => (
  <Stack>
    <Stack gap="related">
      <strong>Title</strong>
      <span>Description of what this region holds.</span>
    </Stack>
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
          <strong>Item one</strong>
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
