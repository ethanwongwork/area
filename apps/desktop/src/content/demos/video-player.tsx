/** Video player gallery specimens: one variant per tile. docs/specs/video-player.md. The clip is a 6 s abstract loop
 * drawn for Area (a canvas recorded in the browser), served beside the other sample images. */
import { Figure, VideoPlayer } from "@area/react";

const clip = "images/sample-video.webm";
const width = { inlineSize: "calc(var(--area-space-96) * 5)", maxInlineSize: "100%" };

export const GalleryVideoPlayer = () => <div style={width}><VideoPlayer label="Sample video" src={clip} preload="metadata" /></div>;
/* Controls that stay, for short clips and docs. */
export const GalleryVideoPlayerAlways = () => <div style={width}><VideoPlayer label="Sample video" src={clip} preload="metadata" controls="always" /></div>;
/* In a Figure, with its caption. */
export const GalleryVideoPlayerFigure = () => (
  <div style={width}><Figure caption="Caption describing the video."><VideoPlayer label="Sample video" src={clip} preload="metadata" /></Figure></div>
);
/* A narrow player drops the volume slider and picture in picture. */
export const GalleryVideoPlayerNarrow = () => <div style={{ inlineSize: "calc(var(--area-space-96) * 3)" }}><VideoPlayer label="Sample video" src={clip} preload="metadata" /></div>;
