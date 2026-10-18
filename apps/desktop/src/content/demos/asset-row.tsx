/** AssetRow gallery specimens: one variant per tile. docs/specs/asset-row.md. */
import { AssetRow, Button } from "@area/react";
import { DownloadIcon, HeartIcon, HomeIcon, SearchIcon } from "@area/icons";

/* Figma Dev Mode's Assets: rows in a 288 inspector column. */
const frame = { inlineSize: 288 };
const stack = { display: "grid", inlineSize: 288 };

export const GalleryAssetRow = () => (
  <div style={frame}><AssetRow preview={<HeartIcon />} name="icon/heart" meta="SVG · 24 × 24" /></div>
);

export const GalleryAssetRowImage = () => (
  <div style={frame}><AssetRow preview="images/chip-filter.png" name="image" meta="PNG · 1254 × 1254" /></div>
);

export const GalleryAssetRowNameOnly = () => (
  <div style={frame}><AssetRow preview={<SearchIcon />} name="icon/search" /></div>
);

export const GalleryAssetRowAction = () => (
  <div style={frame}>
    <AssetRow preview={<HeartIcon />} name="icon/heart" meta="SVG · 24 × 24"
      actions={<Button variant="ghost" tone="neutral" size="sm" iconOnly icon={<DownloadIcon />} aria-label="Download icon/heart" />} />
  </div>
);

export const GalleryAssetRowGroup = () => (
  <div style={stack}>
    <AssetRow preview={<HeartIcon />} name="icon/heart" meta="SVG · 24 × 24" />
    <AssetRow preview={<HomeIcon />} name="icon/home" meta="SVG · 24 × 24" />
    <AssetRow preview="images/chip-filter.png" name="image" meta="PNG · 1254 × 1254" />
  </div>
);
