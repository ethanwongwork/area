/** PreviewFrame gallery specimens: one variant per tile, at the Inspector's 256 column. docs/specs/preview-frame.md. */
import type { CSSProperties } from "react";
import { Button, PreviewFrame } from "@area/react";
import { HeartIcon } from "@area/icons";

const column = { inlineSize: 256 } as CSSProperties;

/* An icon at the icon browser's 128, as the app's icon Inspector shows it. */
export const GalleryPreviewFrame = () => (
  <div style={column}><PreviewFrame label="icon/heart"><HeartIcon size={128} /></PreviewFrame></div>
);

/* Figma's grey well (Box model's ground), for a preview that should read as recessed into the panel. */
export const GalleryPreviewFrameSubtle = () => (
  <div style={column}><PreviewFrame ground="subtle" label="icon/heart"><HeartIcon size={128} /></PreviewFrame></div>
);

/* A component at the gallery's 4:3 tile shape, as Figma's asset tiles preview a component. */
export const GalleryPreviewFrameLandscape = () => (
  <div style={column}><PreviewFrame aspect="landscape"><Button>Button</Button></PreviewFrame></div>
);

/* A colour fills a 2:1 frame, as the app's colour Inspector. */
export const GalleryPreviewFrameWide = () => (
  <div style={column}><PreviewFrame aspect="wide" color="var(--area-indigo-500)" label="indigo/500" /></div>
);

/* An image is contained whole and only scaled down. */
export const GalleryPreviewFrameImage = () => (
  <div style={column}><PreviewFrame><img src="images/chip-filter.png" alt="Filter chip" /></PreviewFrame></div>
);

/* A transparent asset on the checker: an exported icon, clear around its strokes (Figma's export preview). */
export const GalleryPreviewFrameChecker = () => (
  <div style={column}><PreviewFrame ground="checker" label="icon/heart.svg"><HeartIcon size={128} /></PreviewFrame></div>
);

/* A translucent colour shows the checker through it. */
export const GalleryPreviewFrameAlpha = () => (
  <div style={column}>
    <PreviewFrame aspect="wide" color="color-mix(in srgb, var(--area-indigo-500) 40%, transparent)" label="indigo/500 at 40%" />
  </div>
);
