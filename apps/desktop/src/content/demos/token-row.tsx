/** TokenRow gallery specimens: one variant per tile. Area's own palette tokens stand in for a file's.
 * docs/specs/token-row.md. */
import { TokenRow } from "@area/react";

/* Figma Dev Mode's Colors: rows in a 288 inspector column. */
const frame = { inlineSize: 288 };
const stack = { display: "grid", gap: "var(--area-space-8)", inlineSize: 288 };

export const GalleryTokenRow = () => (
  <div style={frame}><TokenRow swatch="var(--area-neutral-850)" name="neutral/850" value="#1D1D1D" /></div>
);

export const GalleryTokenRowNameOnly = () => (
  <div style={frame}><TokenRow swatch="var(--area-neutral-50)" name="neutral/50" /></div>
);

export const GalleryTokenRowPlain = () => (
  <div style={frame}><TokenRow name="space/16" value="16" /></div>
);

export const GalleryTokenRowOutline = () => (
  <div style={frame}><TokenRow outline swatch="var(--area-neutral-850)" name="neutral/850" value="#1D1D1D" /></div>
);

export const GalleryTokenRowCopyable = () => (
  <div style={frame}><TokenRow copyable swatch="var(--area-blue-500)" name="blue/500" value="#006DF5" /></div>
);

export const GalleryTokenRowGroup = () => (
  <div style={stack}>
    <TokenRow swatch="var(--area-neutral-850)" name="neutral/850" value="#1D1D1D" />
    <TokenRow swatch="var(--area-neutral-500)" name="neutral/500" value="#747474" />
    <TokenRow swatch="var(--area-neutral-25)" name="neutral/25" value="#FAFAFA" />
  </div>
);
