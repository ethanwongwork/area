/** Meter gallery specimens: one variant per tile. docs/specs/meter.md. */
import { Meter } from "@area/react";

const row = { inlineSize: "calc(var(--area-space-96) * 4)", maxInlineSize: "100%" };

export const GalleryMeter = () => <Meter style={row} label="Label" description="Description" value={24} />;
export const GalleryMeterWarning = () => <Meter style={row} tone="warning" label="Label" description="Description" value={82} valueText="18% left" />;
export const GalleryMeterDanger = () => <Meter style={row} tone="danger" label="Label" description="Description" value={29} max={30} valueText="1 left" />;
export const GalleryMeterSm = () => <Meter style={row} size="sm" label="Label" description="Description" value={24} />;
export const GalleryMeterLg = () => <Meter style={row} size="lg" label="Label" description="Description" value={24} />;
/* The label and the value, no description. */
export const GalleryMeterLabelOnly = () => <Meter style={row} label="Label" value={1200} max={4000} valueText="1,200 / 4,000" />;
/* The bar alone, named for assistive tech. */
export const GalleryMeterBare = () => <Meter style={row} aria-label="Label" value={24} valueText={null} />;
/* Parts of one measure, each named in the legend with its value and share (owner 2026-10-30, docs/research/inspector-panel-2026-10-30). */
export const GalleryMeterSegments = () => (
  <Meter style={row} label="Label" segments={[{ label: "Label", value: 6 }, { label: "Label", value: 4 }, { label: "Label", value: 3 }, { label: "Label", value: 1 }]} />
);
/* Parts against a limit: max leaves the rest of the track, and the value says how much is used. */
export const GalleryMeterSegmentsLimit = () => (
  <Meter style={row} label="Label" max={100} valueText="44% used" segments={[{ label: "Label", value: 22 }, { label: "Label", value: 12 }, { label: "Label", value: 10 }]} />
);
