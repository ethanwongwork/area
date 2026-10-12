/** BoxModel gallery specimens: one variant per tile. docs/specs/box-model.md. */
import { BoxModel } from "@area/react";

/* Figma's Dev Mode inspector: 287 wide inside a 319 panel's 16 margins. */
const frame = { inlineSize: 288 };

export const GalleryBoxModel = () => (
  <BoxModel style={frame} margin={24} border={1} padding={16} radius={8} width={608} height={184} caption="border-box" />
);

export const GalleryBoxModelNeutral = () => (
  <BoxModel style={frame} tone="neutral" margin={24} border={1} padding={16} radius={8} width={608} height={184} caption="border-box" />
);

/* Different values per side, CSS order: top, right, bottom, left. */
export const GalleryBoxModelSides = () => (
  <BoxModel style={frame} margin={[0, 16, 24, 16]} border={[0, 0, 1, 0]} padding={[12, 16, 12, 16]} width={320} height={40} />
);

/* Per-corner radii, as a tab's top corners. */
export const GalleryBoxModelCorners = () => (
  <BoxModel style={frame} margin={0} border={1} padding={[8, 12, 8, 12]} radius={[8, 8, 0, 0]} width={96} height={20} />
);
