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
